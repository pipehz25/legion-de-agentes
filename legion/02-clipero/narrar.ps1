<#
narrar.ps1 - Convierte un clip ya cortado (gameplay sin subtitulos, idealmente en -Modo marco) en un Short narrado:
voz de IA local (Kokoro, via hyperframes), subtitulos sincronizados con la voz, sello del logo y frase de cierre.
Es lo que hace el clip contenido propio (guion + voz + edicion sobre el gameplay), no un recorte ajeno.

Uso (desde la raiz del proyecto o de la copia del espacio):
  powershell -NoProfile -ExecutionPolicy Bypass -File legion/02-clipero/narrar.ps1 -Id <clip-id> -Guion "<texto>"
      [-Voz am_michael] [-Velocidad 1.05] [-Idioma en-us] [-Cierre "Getaway Kings out."] [-Logo <png>] [-VolumenJuego 0.15]
  -GuionArchivo <txt> sirve en lugar de -Guion cuando el texto lleva comillas.

Lee  salidas/clipero/clips/<id>/clip.mp4 del espacio de la PC (espacio.local.json, igual que clipero.ps1)
Deja salidas/clipero/clips/<id>/narrado.mp4, narrado.json y revision-narrado.jpg

La voz necesita Node (npx) y el entorno de Python de animados (animados/.venv). Voces de Kokoro en ingles:
am_michael, am_fenrir, am_puck, am_adam, af_heart, af_bella, af_nicole, bm_george, bf_emma (lista completa: hyperframes tts --help).
#>
param(
    [Parameter(Mandatory = $true)][string]$Id,
    [string]$Guion = '',
    [string]$GuionArchivo = '',
    [string]$Voz = 'am_michael',
    [double]$Velocidad = 1.05,
    [string]$Idioma = 'en-us',
    [string]$Cierre = '',
    [string]$Logo = '',
    [double]$VolumenJuego = 0.15
)
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
$utf8 = New-Object Text.UTF8Encoding($false)
$cultura = [Globalization.CultureInfo]::InvariantCulture

$raiz = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$bin = Join-Path $raiz 'herramientas\bin'
$ffmpeg = Join-Path $bin 'ffmpeg.exe'
$ffprobe = Join-Path $bin 'ffprobe.exe'
$whisper = Join-Path $bin 'whisper\whisper-cli.exe'
$modelo = Get-ChildItem (Join-Path $raiz 'herramientas\modelos') -Filter '*.bin' -ErrorAction SilentlyContinue | Sort-Object Length -Descending | Select-Object -First 1
$python = Join-Path $raiz 'animados\.venv\Scripts\python.exe'
foreach ($exe in $ffmpeg, $ffprobe, $whisper) { if (-not (Test-Path $exe)) { throw "Falta $exe (herramientas/instalar.ps1)" } }
if (-not $modelo) { throw 'Falta el modelo de whisper en herramientas/modelos (herramientas/instalar.ps1)' }
if (-not (Test-Path $python)) { throw "Falta el entorno de la voz: $python (animados/GUIA.md, Instalacion)" }

# Espacio de la PC (igual que clipero.ps1)
$espacio = ''
$rutaEspacio = Join-Path $raiz 'espacio.local.json'
if (Test-Path -LiteralPath $rutaEspacio) { $espacio = ([string]([IO.File]::ReadAllText($rutaEspacio, $utf8) | ConvertFrom-Json).espacio).Trim() }
$raizDatos = if ($espacio) { Join-Path $raiz "espacios\$espacio" } else { $raiz }

$dir = Join-Path $raizDatos "salidas\clipero\clips\$Id"
$clip = Join-Path $dir 'clip.mp4'
if (-not (Test-Path $clip)) { throw "No existe $clip. Corta antes el clip con clipero.ps1 cortar (-Subs ninguno -Modo marco)." }
if ($GuionArchivo) { $Guion = [IO.File]::ReadAllText((Resolve-Path $GuionArchivo).Path, $utf8) }
$Guion = ($Guion -replace '\s+', ' ').Trim()
if (-not $Guion) { throw 'Falta el guion (-Guion o -GuionArchivo)' }
$texto = if ($Cierre) { "$Guion $($Cierre.Trim())" } else { $Guion }

$meta = $null
if (Test-Path (Join-Path $dir 'meta.json')) { $meta = [IO.File]::ReadAllText((Join-Path $dir 'meta.json'), $utf8) | ConvertFrom-Json }
$modo = if ($meta -and $meta.modo) { [string]$meta.modo } else { 'marco' }

$trabajo = Join-Path $dir 'trabajo-narrado'
New-Item -ItemType Directory -Force $trabajo | Out-Null
Push-Location $trabajo
try {
    # 1. Voz
    [IO.File]::WriteAllText((Join-Path $trabajo 'texto.txt'), $texto, $utf8)
    $env:HYPERFRAMES_PYTHON = $python; $env:DO_NOT_TRACK = '1'; $env:HYPERFRAMES_NO_TELEMETRY = '1'
    $vel = $Velocidad.ToString($cultura)
    $salidaTts = cmd /c "npx --yes hyperframes@0.9.20 tts texto.txt -v $Voz -l $Idioma -s $vel -o voz.wav --json 2>&1"
    if (-not (Test-Path 'voz.wav')) { throw "No salio la voz: $(($salidaTts | Select-Object -Last 3) -join ' ')" }
    $dv = [double]::Parse((& $ffprobe -v error -show_entries format=duration -of csv=p=0 'voz.wav'), $cultura)
    $dc = [double]::Parse((& $ffprobe -v error -show_entries format=duration -of csv=p=0 $clip), $cultura)
    $inicio = 0.4
    $final = $dv + $inicio + 0.7
    if ($final -gt $dc) { throw ('El clip dura {0:N1} s y la voz {1:N1} s: acorta el guion o corta un tramo mas largo.' -f $dc, $dv) }

    # 2. Tiempos de cada palabra, desde el propio audio
    & $ffmpeg -v error -y -i 'voz.wav' -ar 16000 -ac 1 'voz16.wav'
    & $whisper -m $modelo.FullName -f 'voz16.wav' -l ($Idioma -split '-')[0] -ml 1 -sow -oj -of 'palabras' -np 2>$null | Out-Null
    $palabras = @(([IO.File]::ReadAllText((Join-Path $trabajo 'palabras.json'), $utf8) | ConvertFrom-Json).transcription |
        Where-Object { $_.text.Trim() -and $_.text.Trim() -notmatch '^\[.*\]$' } |
        ForEach-Object { [pscustomobject]@{ a = $_.offsets.from / 1000.0 + $inicio; b = $_.offsets.to / 1000.0 + $inicio; w = $_.text.Trim() } })

    # 3. Subtitulos: bloques de hasta 3 palabras, en la franja de abajo si el clip es marco
    function TiempoAss($s) { $t = [TimeSpan]::FromSeconds([math]::Max(0, $s)); '{0}:{1:D2}:{2:D2}.{3:D2}' -f $t.Hours, $t.Minutes, $t.Seconds, [int][math]::Floor($t.Milliseconds / 10) }
    $margen = if ($modo -eq 'marco') { 100 } else { 430 }
    $eventos = New-Object Collections.Generic.List[string]
    $k = 0
    while ($k -lt $palabras.Count) {
        $g = @($palabras[$k]); $k++
        while ($k -lt $palabras.Count -and $g.Count -lt 3 -and $g[-1].w -notmatch '[.?!,]$') { $g += $palabras[$k]; $k++ }
        $a = $g[0].a
        $b = if ($k -lt $palabras.Count) { [math]::Min($palabras[$k].a, $g[-1].b + 0.6) } else { [math]::Min($g[-1].b + 0.8, $final) }
        $b = [math]::Max($b, $a + 0.25)
        $frase = ((($g | ForEach-Object { $_.w }) -join ' ').ToUpper()) -replace '[{}\\]', ''
        $eventos.Add("Dialogue: 0,$(TiempoAss $a),$(TiempoAss $b),Sub,,0,0,0,,$frase")
    }
    $ass = @('[Script Info]', 'ScriptType: v4.00+', 'PlayResX: 1080', 'PlayResY: 1920', 'WrapStyle: 0', 'ScaledBorderAndShadow: yes', '',
        '[V4+ Styles]',
        'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding',
        "Style: Sub,Arial,84,&H0000E6FF,&H000000FF,&H00000000,&H64000000,-1,0,0,0,100,100,0,0,1,7,2,2,60,60,$margen,1", '',
        '[Events]', 'Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text') + $eventos
    [IO.File]::WriteAllLines((Join-Path $trabajo 'narrado.ass'), [string[]]$ass, $utf8)
    Copy-Item (Join-Path $env:WINDIR 'Fonts\arialbd.ttf') $trabajo -ErrorAction SilentlyContinue

    # 4. Montaje: juego bajito, voz encima, subtitulos y sello del logo (circular, arriba a la derecha del video)
    Copy-Item $clip 'fondo.mp4' -Force
    $entradas = @('-y', '-i', 'fondo.mp4', '-i', 'voz.wav')
    $retraso = [int]($inicio * 1000)
    $vjuego = $VolumenJuego.ToString($cultura)
    $video = '[0:v]subtitles=narrado.ass:fontsdir=.[sv]'
    if ($Logo -and (Test-Path $Logo)) {
        Copy-Item $Logo 'logo.png' -Force
        $entradas += @('-i', 'logo.png')
        $yLogo = if ($modo -eq 'marco') { 310 } else { 120 }
        $video += ";[2:v]scale=150:150,format=rgba,geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='if(lte(hypot(X-75,Y-75),73),255,0)'[logo];[sv][logo]overlay=x=W-w-28:y=$yLogo[v]"
    } else { $video = $video -replace '\[sv\]$', '[v]' }
    $audio = "[0:a]volume=$vjuego[g];[1:a]adelay=$($retraso):all=1[vz];[g][vz]amix=inputs=2:duration=first:normalize=0[a]"
    $args1 = $entradas + @('-filter_complex', "$video;$audio", '-map', '[v]', '-map', '[a]', '-t', $final.ToString('0.00', $cultura),
        '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '21', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', '..\narrado.mp4')
    & $ffmpeg -v error @args1
    if ($LASTEXITCODE -ne 0 -or -not (Test-Path '..\narrado.mp4')) { throw 'ffmpeg no produjo narrado.mp4' }
    & $ffmpeg -v error -y -i '..\narrado.mp4' -vf "fps=4/$($final.ToString('0.00', $cultura)),scale=270:-2,tile=4x1" -frames:v 1 '..\revision-narrado.jpg'
} finally { Pop-Location }

$info = [ordered]@{
    id = $Id; guion = $Guion; cierre = $Cierre; voz = $Voz; velocidad = $Velocidad; idioma = $Idioma
    duracion_seg = [math]::Round($final, 1); palabras = $palabras.Count; logo = [bool]($Logo -and (Test-Path $Logo))
    motor = 'kokoro (local)'; creado = (Get-Date).ToString('o')
}
[IO.File]::WriteAllText((Join-Path $dir 'narrado.json'), ($info | ConvertTo-Json), $utf8)
Remove-Item -Recurse -Force $trabajo -ErrorAction SilentlyContinue
"Narrado: $((Join-Path $dir 'narrado.mp4').Replace($raiz + '\', '')) ($([math]::Round($final, 1)) s, voz $Voz)"
"Revision: $((Join-Path $dir 'revision-narrado.jpg').Replace($raiz + '\', ''))"
