# Herramienta del Clipero (Agente 02 de la Legion). Tres acciones:
#   buscar   -Consulta "<texto>" [-N 10] [-Recientes | -Hoy] [-Detalle]
#            -> datos/clipero/busquedas/<marca>.jsonl con videos candidatos (duracion, vistas, canal).
#               -Recientes: subidos esta semana. -Hoy: subidos hoy.
#               -Detalle: anade fecha exacta, likes, comentarios, horas_desde y vistas_por_hora (mas lento).
#   analizar -Url <url> [-Traducir es]
#            -> datos/clipero/fuentes/<id>/: resumen.json (picos de "mas repetido", marcas de tiempo en comentarios,
#               capitulos), transcripcion.txt y palabras*.json (palabras con tiempo, para subtitular)
#   cortar   -Url <url> -Inicio <seg> -Fin <seg> -Id <clip-id> [-Gancho "<texto>"] [-Subs orig|es|ninguno] [-Modo desenfoque|recorte]
#            -> salidas/clipero/clips/<Id>/clip.mp4 (1080x1920, subtitulos quemados), portada.jpg y meta.json
# Uso: powershell -NoProfile -ExecutionPolicy Bypass -File legion/02-clipero/clipero.ps1 <accion> ...
# Requiere herramientas/bin (yt-dlp, ffmpeg, deno): powershell -NoProfile -ExecutionPolicy Bypass -File herramientas/instalar.ps1

param(
    [Parameter(Mandatory = $true, Position = 0)][ValidateSet('buscar', 'analizar', 'cortar')][string]$Accion,
    [string]$Consulta,
    [int]$N = 10,
    [switch]$Recientes,
    [switch]$Hoy,
    [switch]$Detalle,
    [string]$Url,
    [string]$Traducir = '',
    [double]$Inicio = -1,
    [double]$Fin = -1,
    [string]$Id,
    [string]$Gancho = '',
    [string]$Subs = 'orig',
    [ValidateSet('desenfoque', 'recorte')][string]$Modo = 'desenfoque'
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

$raiz = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$bin = Join-Path $raiz 'herramientas\bin'
$ytdlp = Join-Path $bin 'yt-dlp.exe'
$ffmpeg = Join-Path $bin 'ffmpeg.exe'
$ffprobe = Join-Path $bin 'ffprobe.exe'
foreach ($exe in $ytdlp, $ffmpeg, $ffprobe, (Join-Path $bin 'deno.exe')) {
    if (-not (Test-Path $exe)) { throw "Falta $exe. Instala con: powershell -NoProfile -ExecutionPolicy Bypass -File herramientas/instalar.ps1" }
}
# yt-dlp busca deno y ffmpeg en el PATH
$env:PATH = "$bin;$env:PATH"

$utf8 = New-Object Text.UTF8Encoding $false
$cultura = [Globalization.CultureInfo]::InvariantCulture
$fuentes = Join-Path $raiz 'datos\clipero\fuentes'

function Num([double]$x) { $x.ToString('0.###', $cultura) }
function Relativa([string]$ruta) { $ruta.Substring($raiz.Length + 1) -replace '\\', '/' }
function LeerJson([string]$ruta) { [IO.File]::ReadAllText($ruta, $utf8) | ConvertFrom-Json }
function EscribirJson([string]$ruta, $obj, [switch]$Compacto) {
    $json = if ($Compacto) { ConvertTo-Json -InputObject $obj -Depth 6 -Compress } else { ConvertTo-Json -InputObject $obj -Depth 6 }
    [IO.File]::WriteAllText($ruta, $json, $utf8)
}
function Hms([double]$s) {
    $t = [TimeSpan]::FromSeconds([math]::Floor([math]::Max(0.0,$s)))
    '{0}:{1:00}:{2:00}' -f [int][math]::Floor($t.TotalHours), $t.Minutes, $t.Seconds
}
function YtDlp([string[]]$argumentos) {
    & $ytdlp --quiet --no-warnings --ffmpeg-location $bin @argumentos
    if ($LASTEXITCODE -ne 0) { throw "yt-dlp termino con codigo $LASTEXITCODE" }
}
function IdVideo([string]$u) {
    $m = [regex]::Match($u, '(?:v=|youtu\.be/|shorts/|live/)([\w-]{11})')
    if ($m.Success) { return $m.Groups[1].Value }
    # Fuentes que no son de YouTube (Twitch, Kick...): id estable derivado de la URL
    $h = [BitConverter]::ToString([Security.Cryptography.SHA1]::Create().ComputeHash($utf8.GetBytes($u))).Replace('-', '')
    'x' + $h.Substring(0, 10).ToLower()
}

# Convierte subtitulos json3 de YouTube en palabras con tiempo de inicio (segundos).
# Los automaticos traen una palabra por segmento; los manuales, frases enteras que se reparten en el tiempo del segmento.
function PalabrasJson3([string]$ruta) {
    $j = LeerJson $ruta
    $lista = New-Object Collections.Generic.List[object]
    foreach ($ev in $j.events) {
        if (-not $ev.segs) { continue }
        $ini = [double]$ev.tStartMs
        $finEv = $ini + [double]$ev.dDurationMs
        $segs = @($ev.segs | Where-Object { $_.utf8 -and $_.utf8.Trim() })
        for ($k = 0; $k -lt $segs.Count; $k++) {
            $a = $ini + [double]$segs[$k].tOffsetMs
            $b = if ($k + 1 -lt $segs.Count) { $ini + [double]$segs[$k + 1].tOffsetMs } else { $finEv }
            # YouTube tapa las groserias como "[ __ ]"; se deja una sola palabra "***" para que no salgan "[", "__" y "]"
            $ws = @(($segs[$k].utf8.Trim() -replace '\[\s*_+\s*\]', '***') -split '\s+' | Where-Object { $_ })
            if ($b -le $a) { $b = $a + 400 * $ws.Count }
            for ($q = 0; $q -lt $ws.Count; $q++) {
                $lista.Add([pscustomobject]@{ t = [math]::Round(($a + ($b - $a) * $q / $ws.Count) / 1000.0, 2); w = $ws[$q] })
            }
        }
    }
    @($lista | Sort-Object t)
}

function Transcripcion($palabras) {
    $lineas = New-Object Collections.Generic.List[string]
    $buf = New-Object Collections.Generic.List[string]
    $t0 = $null; $prev = 0
    foreach ($p in $palabras) {
        if ($null -ne $t0 -and (($p.t - $prev) -gt 1.5 -or ($p.t - $t0) -gt 12 -or $buf.Count -ge 30)) {
            $lineas.Add("[$(Hms $t0)] $($buf -join ' ')"); $buf.Clear(); $t0 = $null
        }
        if ($null -eq $t0) { $t0 = $p.t }
        $buf.Add($p.w); $prev = $p.t
    }
    if ($buf.Count) { $lineas.Add("[$(Hms $t0)] $($buf -join ' ')") }
    $lineas
}

function TiempoAss([double]$s) {
    $t = [TimeSpan]::FromMilliseconds([math]::Max(0.0,$s) * 1000)
    '{0}:{1:00}:{2:00}.{3:00}' -f [int][math]::Floor($t.TotalHours), $t.Minutes, $t.Seconds, [int][math]::Floor($t.Milliseconds / 10)
}
function TextoAss([string]$s) { ($s -replace '[{}\\]', '') -replace '\r?\n', '\N' }

# Ejecuta ffmpeg dentro de trabajo/ con stderr a un archivo (en PowerShell 5.1, 2>&1 convierte cada linea en error)
# y devuelve el texto del registro. Los argumentos no pueden llevar espacios: se usan rutas relativas.
function FfmpegLog([string[]]$argumentos, [string]$nombreLog) {
    $log = Join-Path $trabajo $nombreLog
    $p = Start-Process -FilePath $ffmpeg -ArgumentList (@('-hide_banner', '-nostats') + $argumentos) -WorkingDirectory $trabajo `
        -NoNewWindow -Wait -PassThru -RedirectStandardError $log
    $texto = [IO.File]::ReadAllText($log, $utf8)
    if ($p.ExitCode -ne 0) { throw "ffmpeg termino con codigo $($p.ExitCode): $((($texto -split '\r?\n') | Where-Object { $_ } | Select-Object -Last 4) -join ' | ')" }
    $texto
}
# loudnorm imprime sus mediciones como el ultimo bloque JSON (plano) del registro
function JsonFinal([string]$texto) {
    $a = $texto.LastIndexOf('{'); $b = $texto.LastIndexOf('}')
    if ($a -lt 0 -or $b -lt $a) { throw 'loudnorm no devolvio mediciones' }
    $texto.Substring($a, $b - $a + 1) | ConvertFrom-Json
}
function Dbl($s) { [double]::Parse([string]$s, $cultura) }

# Normalizacion de volumen en dos pasadas: -14 LUFS integrado y pico real -1 dBTP, siempre en modo lineal.
# loudnorm solo aplica modo lineal si la ganancia necesaria no lleva los picos por encima de -1 dBTP y el LRA
# medido cabe en el objetivo; si no, pasa a modo dinamico (volumen que sube y baja). Para evitarlo:
#   1. LRA objetivo amplio (20, o el medido si es mayor).
#   2. Si la ganancia no cabe, un limitador baja los picos antes y se vuelve a medir a traves de el.
#   3. Ultimo recurso: bajar el objetivo integrado lo justo para seguir en lineal.
# Devuelve la cadena -af para la pasada 2 y los datos de la medicion.
function Normalizar([string]$entrada) {
    $res = [ordered]@{ cadena = $null; normalizacion = 'omitida'; objetivo_lufs = -14.0; limitador = $false }
    $pistas = & $ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 (Join-Path $trabajo $entrada)
    if (-not $pistas) { $res.normalizacion = 'omitida: sin audio'; return $res }
    try {
        $lra = 20
        $m = JsonFinal (FfmpegLog @('-i', $entrada, '-vn', '-af', "loudnorm=I=-14:TP=-1:LRA=$($lra):print_format=json", '-f', 'null', '-') 'medida1.txt')
        $i = Dbl $m.input_i; $tp = Dbl $m.input_tp
        if ((Dbl $m.input_lra) -gt $lra) { $lra = [int][math]::Min(50, [math]::Ceiling((Dbl $m.input_lra)) + 1) }
        $pre = ''
        $ganancia = -14 - $i
        if ($tp + $ganancia -gt -1) {
            $limite = [math]::Min(1.0, [math]::Max(0.0625, [math]::Pow(10, (-1 - $ganancia - 0.5) / 20)))
            $pre = "alimiter=limit=$(Num $limite):level=0:attack=5:release=50,"
            $m = JsonFinal (FfmpegLog @('-i', $entrada, '-vn', '-af', "$($pre)loudnorm=I=-14:TP=-1:LRA=$($lra):print_format=json", '-f', 'null', '-') 'medida2.txt')
            $i = Dbl $m.input_i; $tp = Dbl $m.input_tp
            $res.limitador = $true
        }
        if ($tp + ($res.objetivo_lufs - $i) -gt -1) { $res.objetivo_lufs = [math]::Floor((-1 - $tp + $i) * 10) / 10 }
        $res.entrada_lufs = $i; $res.entrada_tp = $tp
        $res.cadena = "$($pre)loudnorm=I=$(Num $res.objetivo_lufs):TP=-1:LRA=$($lra):measured_I=$($m.input_i):measured_TP=$($m.input_tp)" +
            ":measured_LRA=$($m.input_lra):measured_thresh=$($m.input_thresh):offset=$($m.target_offset):linear=true:print_format=json"
    } catch {
        # Audio sin nivel medible (silencio: loudnorm devuelve -inf) o fallo de la medicion: el clip sale sin normalizar
        $res.normalizacion = "omitida: $($_.Exception.Message)"
    }
    $res
}

# ---------------------------------------------------------------- buscar
if ($Accion -eq 'buscar') {
    if (-not $Consulta) { throw 'Falta -Consulta' }
    $dir = Join-Path $raiz 'datos\clipero\busquedas'
    New-Item -ItemType Directory -Force $dir | Out-Null
    $archivo = Join-Path $dir ((Get-Date -Format 'yyyy-MM-dd_HHmmss') + '.jsonl')
    # yt-dlp no tiene busqueda ordenada por fecha (ytsearchdate no existe) y YouTube quito ese orden;
    # -Hoy y -Recientes usan los filtros "subidos hoy" y "subidos esta semana" de la pagina de resultados.
    $filtro = if ($Hoy) { 'EgIIAg%253D%253D' } elseif ($Recientes) { 'EgIIAw%253D%253D' } else { $null }
    $objetivo = if ($filtro) { "https://www.youtube.com/results?search_query=$([uri]::EscapeDataString($Consulta))&sp=$filtro" } else { "ytsearch$($N):$Consulta" }
    if ($Detalle) {
        # Extraccion completa de cada resultado (unos segundos por video): trae fecha exacta y metricas
        $campos = '%(.{id,title,channel,channel_follower_count,duration,view_count,like_count,comment_count,timestamp,live_status,webpage_url})j'
        & $ytdlp --quiet --no-warnings --ignore-errors --skip-download --playlist-end "$N" --print-to-file $campos $archivo $objetivo
    } else {
        YtDlp @('--flat-playlist', '--skip-download', '--playlist-end', "$N", '--print-to-file', '%(.{id,title,channel,duration,view_count,live_status,url})j', $archivo, $objetivo)
    }
    if (-not (Test-Path $archivo)) { "Busqueda: sin resultados ($Consulta)"; exit 0 }
    if ($Detalle) {
        # Anade horas desde la publicacion y vistas por hora, y ordena por vistas por hora
        $ahora = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
        $filas = foreach ($linea in [IO.File]::ReadAllLines($archivo, $utf8)) {
            $r = $linea | ConvertFrom-Json
            $horas = if ($r.timestamp) { [math]::Max(1.0, [math]::Round(($ahora - [double]$r.timestamp) / 3600, 1)) } else { $null }
            $r | Add-Member -NotePropertyName horas_desde -NotePropertyValue $horas
            $r | Add-Member -NotePropertyName vistas_por_hora -NotePropertyValue $(if ($horas -and $r.view_count) { [long]($r.view_count / $horas) } else { $null })
            $r
        }
        [IO.File]::WriteAllLines($archivo, [string[]]@($filas | Sort-Object { [double]$_.vistas_por_hora } -Descending | ForEach-Object { $_ | ConvertTo-Json -Compress }), $utf8)
    }
    "Busqueda: $(Relativa $archivo) ($(@([IO.File]::ReadAllLines($archivo)).Count) resultados)"
    exit 0
}

# ---------------------------------------------------------------- analizar
if ($Accion -eq 'analizar') {
    if (-not $Url) { throw 'Falta -Url' }
    $vid = IdVideo $Url
    $dir = Join-Path $fuentes $vid
    New-Item -ItemType Directory -Force $dir | Out-Null
    $base = Join-Path $dir 'fuente'

    YtDlp @('--no-playlist', '--skip-download', '--write-info-json', '--write-comments',
        '--extractor-args', 'youtube:comment_sort=top;max_comments=300,300,0,0', '-o', "$base.%(ext)s", $Url)
    $info = LeerJson "$base.info.json"

    # Idioma original: el declarado, o el de los subtitulos automaticos "-orig"
    $idioma = [string]$info.language
    if (-not $idioma -and $info.automatic_captions) {
        $orig = @($info.automatic_captions.PSObject.Properties.Name | Where-Object { $_ -like '*-orig' }) | Select-Object -First 1
        if ($orig) { $idioma = $orig -replace '-orig$', '' }
    }
    if (-not $idioma) { $idioma = 'es' }
    $idioma = ($idioma -split '-')[0]

    $pedidos = @($idioma)
    if ($Traducir -and $Traducir -ne $idioma) { $pedidos += $Traducir }
    $subsListos = @()
    foreach ($lang in $pedidos) {
        try {
            YtDlp @('--no-playlist', '--skip-download', '--write-subs', '--write-auto-subs', '--sub-format', 'json3',
                '--sub-langs', "^$lang(-.*)?$", '-o', "$base.%(ext)s", $Url)
        } catch { }
        $sub = Get-ChildItem $dir -Filter "fuente.$lang*.json3" | Sort-Object { $_.Name.Length } | Select-Object -First 1
        if ($sub) {
            $palabras = PalabrasJson3 $sub.FullName
            $nombre = if ($lang -eq $idioma) { 'palabras.json' } else { "palabras-$lang.json" }
            EscribirJson (Join-Path $dir $nombre) @($palabras) -Compacto
            if ($lang -eq $idioma) {
                [IO.File]::WriteAllLines((Join-Path $dir 'transcripcion.txt'), [string[]](Transcripcion $palabras), $utf8)
            }
            $subsListos += $(if ($lang -eq $idioma) { 'orig' } else { $lang })
        }
    }
    # Los json3 ya quedaron convertidos en palabras*.json
    Remove-Item (Join-Path $dir 'fuente.*.json3') -ErrorAction SilentlyContinue

    # Picos del grafico "mas repetido" (heatmap): maximos locales, sin contar el arranque del video
    $picos = @()
    $dur = [double]$info.duration
    if ($info.heatmap) {
        $h = @($info.heatmap)
        $cand = for ($k = 1; $k -lt $h.Count - 1; $k++) {
            if ($h[$k].value -gt $h[$k - 1].value -and $h[$k].value -ge $h[$k + 1].value -and $h[$k].start_time -gt $dur * 0.03) { $h[$k] }
        }
        $picos = @($cand | Where-Object { $_ } | Sort-Object value -Descending | Select-Object -First 8 | ForEach-Object {
            [ordered]@{ inicio = [math]::Round($_.start_time, 1); fin = [math]::Round($_.end_time, 1); hms = Hms $_.start_time; intensidad = [math]::Round($_.value, 2) }
        })
    }

    # Marcas de tiempo citadas en comentarios (ej. "12:34 jajaja"), agrupadas en ventanas de 30 s
    $marcas = @()
    if ($info.comments) {
        $cubos = @{}
        foreach ($c in $info.comments) {
            $texto = [string]$c.text
            foreach ($m in [regex]::Matches($texto, '(?<![\d:])(?:(\d{1,2}):)?(\d{1,2}):(\d{2})(?![\d:])')) {
                $s = 60 * [int]$m.Groups[2].Value + [int]$m.Groups[3].Value
                if ($m.Groups[1].Success) { $s += 3600 * [int]$m.Groups[1].Value }
                if ($dur -and $s -gt $dur) { continue }
                $k = [int]([math]::Floor($s / 30) * 30)
                if (-not $cubos.ContainsKey($k)) { $cubos[$k] = [ordered]@{ seg = $k; hms = Hms $k; menciones = 0; likes = 0; ejemplos = @() } }
                $cubo = $cubos[$k]
                $cubo.menciones++
                $cubo.likes += [int]$c.like_count
                if ($cubo.ejemplos.Count -lt 2) { $cubo.ejemplos += $texto.Substring(0, [math]::Min(140, $texto.Length)) }
            }
        }
        $marcas = @($cubos.Values | Sort-Object { $_.menciones + $_.likes / 50 } -Descending | Select-Object -First 8)
    }

    $fecha = [string]$info.upload_date
    if ($fecha -match '^\d{8}$') { $fecha = '{0}-{1}-{2}' -f $fecha.Substring(0, 4), $fecha.Substring(4, 2), $fecha.Substring(6, 2) }
    $resumen = [ordered]@{
        id                    = $vid
        url                   = $Url
        titulo                = $info.title
        canal                 = $(if ($info.channel) { $info.channel } else { $info.uploader })
        seguidores_canal      = $info.channel_follower_count
        publicado             = $fecha
        duracion_seg          = $info.duration
        vistas                = $info.view_count
        likes                 = $info.like_count
        comentarios           = $info.comment_count
        estado_directo        = $info.live_status
        idioma                = $idioma
        subtitulos            = $subsListos
        capitulos             = @($info.chapters | Where-Object { $_ } | ForEach-Object { [ordered]@{ inicio = [math]::Round($_.start_time); hms = Hms $_.start_time; titulo = $_.title } })
        picos_repeticion      = $picos
        marcas_en_comentarios = $marcas
        transcripcion         = $(if ($subsListos -contains 'orig') { Relativa (Join-Path $dir 'transcripcion.txt') } else { $null })
        analizado             = (Get-Date).ToString('o')
    }
    EscribirJson (Join-Path $dir 'resumen.json') $resumen

    # El info.json crudo (formatos y comentarios) ocupa mucho y ya esta resumido
    Remove-Item "$base.info.json" -ErrorAction SilentlyContinue
    Get-ChildItem -Directory $fuentes | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-14) } | Remove-Item -Recurse -Force

    "Analisis: $(Relativa (Join-Path $dir 'resumen.json'))"
    "  idioma=$idioma subtitulos=$($subsListos -join ',') picos=$($picos.Count) marcas_comentarios=$($marcas.Count)"
    if ($resumen.transcripcion) { "Transcripcion: $($resumen.transcripcion)" } else { "Transcripcion: no disponible (sin subtitulos)" }
    exit 0
}

# ---------------------------------------------------------------- cortar
if (-not $Url -or -not $Id -or $Inicio -lt 0 -or $Fin -le $Inicio) {
    throw 'Uso: cortar -Url <url> -Inicio <seg> -Fin <seg> -Id <clip-id> [-Gancho "<texto>"] [-Subs orig|es|ninguno] [-Modo desenfoque|recorte]'
}
if ($Fin - $Inicio -gt 180) { throw 'Un clip no puede durar mas de 180 s' }
$vid = IdVideo $Url
$salida = Join-Path $raiz "salidas\clipero\clips\$Id"
$trabajo = Join-Path $salida 'trabajo'
New-Item -ItemType Directory -Force $trabajo | Out-Null

$palabras = @()
if ($Subs -ne 'ninguno') {
    $nombre = if ($Subs -eq 'orig') { 'palabras.json' } else { "palabras-$Subs.json" }
    $ruta = Join-Path (Join-Path $fuentes $vid) $nombre
    if (Test-Path $ruta) { $palabras = LeerJson $ruta }
}

# Ajusta los cortes a limites de palabra para no empezar ni terminar a media palabra
$ini = $Inicio; $fin = $Fin
if ($palabras.Count) {
    $primera = $palabras | Where-Object { $_.t -ge $Inicio - 0.5 } | Select-Object -First 1
    $ultima = $palabras | Where-Object { $_.t -le $Fin + 0.5 } | Select-Object -Last 1
    if ($primera -and $primera.t -le $Inicio + 0.5) { $ini = [math]::Max(0.0,$primera.t - 0.15) }
    if ($ultima -and $ultima.t -gt $ini) { $fin = [math]::Max($Fin, $ultima.t + 0.7) }
}
$durClip = $fin - $ini

try {
    YtDlp @('--no-playlist', '-f', 'bv*[height<=1080]+ba/b[height<=1080]/b', '--merge-output-format', 'mp4',
        '--download-sections', "*$(Num $ini)-$(Num $fin)", '--force-keyframes-at-cuts', '-o', (Join-Path $trabajo 'seccion.%(ext)s'), $Url)
    $video = Get-ChildItem $trabajo -Filter 'seccion.*' | Select-Object -First 1
    if (-not $video) { throw 'yt-dlp no produjo el video de la seccion' }

    # Subtitulos estilo clip (bloques de hasta 3 palabras, mayusculas) y gancho fijo arriba
    $eventos = New-Object Collections.Generic.List[string]
    if ($Gancho) { $eventos.Add("Dialogue: 1,$(TiempoAss 0),$(TiempoAss $durClip),Gancho,,0,0,0,,$(TextoAss $Gancho)") }
    $ws = @($palabras | Where-Object { $_.t -ge $ini -and $_.t -lt $fin -and $_.w -notmatch '^\[.*\]$' })
    $k = 0
    while ($k -lt $ws.Count) {
        $grupo = @($ws[$k]); $k++
        while ($k -lt $ws.Count -and $grupo.Count -lt 3 -and ($ws[$k].t - $grupo[-1].t) -lt 0.6 -and $grupo[-1].w -notmatch '[.?!,]$') {
            $grupo += $ws[$k]; $k++
        }
        $a = $grupo[0].t - $ini
        $b = if ($k -lt $ws.Count) { [math]::Min($ws[$k].t - $ini, $a + 2.5) } else { [math]::Min($grupo[-1].t - $ini + 0.8, $durClip) }
        $texto = TextoAss ((($grupo | ForEach-Object { $_.w }) -join ' ').ToUpper())
        $eventos.Add("Dialogue: 0,$(TiempoAss $a),$(TiempoAss $b),Sub,,0,0,0,,$texto")
    }
    $ass = @(
        '[Script Info]', 'ScriptType: v4.00+', 'PlayResX: 1080', 'PlayResY: 1920', 'WrapStyle: 0', 'ScaledBorderAndShadow: yes', '',
        '[V4+ Styles]',
        'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding',
        'Style: Sub,Arial,84,&H00FFFFFF,&H000000FF,&H00000000,&H64000000,-1,0,0,0,100,100,0,0,1,7,2,2,60,60,430,1',
        'Style: Gancho,Arial,68,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,3,16,0,8,80,80,230,1', '',
        '[Events]', 'Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text'
    ) + $eventos
    [IO.File]::WriteAllLines((Join-Path $trabajo 'subs.ass'), [string[]]$ass, $utf8)
    # La fuente va junto al .ass para no depender de la configuracion de fuentes de ffmpeg en Windows
    Copy-Item (Join-Path $env:WINDIR 'Fonts\arialbd.ttf') $trabajo -ErrorAction SilentlyContinue

    $filtro = if ($Modo -eq 'recorte') {
        '[0:v]scale=-2:1920,crop=1080:1920,setsar=1,subtitles=subs.ass:fontsdir=.[v]'
    } else {
        '[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=20:2,eq=brightness=-0.08[fondo];' +
        '[0:v]scale=1080:-2[frente];[fondo][frente]overlay=(W-w)/2:(H-h)/2,setsar=1,subtitles=subs.ass:fontsdir=.[v]'
    }
    # Rutas relativas dentro de trabajo/: evita problemas de ffmpeg con acentos y espacios en la ruta del proyecto
    Push-Location $trabajo
    try {
        # Pasada 1 (medicion) dentro de Normalizar; pasada 2 aplicada durante el render. El audio sale en AAC a 48 kHz
        # (loudnorm trabaja internamente a 192 kHz).
        $audio = Normalizar $video.Name
        $af = if ($audio.cadena) { @('-af', $audio.cadena, '-ar', '48000') } else { @() }
        $log = FfmpegLog (@('-y', '-i', $video.Name, '-filter_complex', $filtro, '-map', '[v]', '-map', '0:a?') + $af + @(
            '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '21', '-pix_fmt', 'yuv420p',
            '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', '..\clip.mp4')) 'render.txt'
        if ($audio.cadena) {
            $final = JsonFinal $log
            $audio.normalizacion = $final.normalization_type
            $audio.salida_lufs = Dbl $final.output_i
            $audio.salida_tp = Dbl $final.output_tp
        }
        $audio.Remove('cadena')
        & $ffmpeg -hide_banner -loglevel error -y -ss (Num ([math]::Min(1.5, $durClip / 2))) -i '..\clip.mp4' -frames:v 1 -q:v 3 '..\portada.jpg'
        # Hoja de revision: 4 cuadros repartidos por todo el clip en una sola imagen
        & $ffmpeg -hide_banner -loglevel error -y -i '..\clip.mp4' -vf "fps=4/$(Num $durClip),scale=270:-2,tile=4x1" -frames:v 1 -q:v 3 '..\revision.jpg'
        $real = [double]::Parse((& $ffprobe -v error -show_entries format=duration -of csv=p=0 '..\clip.mp4'), $cultura)
    } finally { Pop-Location }

    $meta = [ordered]@{
        id = $Id; url_fuente = $Url; video_id = $vid
        inicio = [math]::Round($ini, 2); fin = [math]::Round($fin, 2); inicio_hms = Hms $ini; duracion_seg = [math]::Round($real, 1)
        gancho = $Gancho; subtitulos = $(if ($ws.Count) { $Subs } else { 'ninguno' }); palabras_subtituladas = $ws.Count; modo = $Modo
        audio = $audio
        archivo = Relativa (Join-Path $salida 'clip.mp4'); portada = Relativa (Join-Path $salida 'portada.jpg')
        revision = Relativa (Join-Path $salida 'revision.jpg')
        creado = (Get-Date).ToString('o')
    }
    EscribirJson (Join-Path $salida 'meta.json') $meta
} finally {
    Remove-Item -Recurse -Force $trabajo -ErrorAction SilentlyContinue
}

"Clip: $($meta.archivo) ($($meta.duracion_seg) s, corte $(Num $ini)-$(Num $fin), subtitulos=$($meta.subtitulos) [$($ws.Count) palabras])"
if ($audio.normalizacion -eq 'linear') {
    "Audio: $(Num $audio.salida_lufs) LUFS, pico $(Num $audio.salida_tp) dBTP (lineal$(if ($audio.limitador) { ', con limitador' }), objetivo $(Num $audio.objetivo_lufs) LUFS)"
} else {
    "AVISO audio: normalizacion '$($audio.normalizacion)' (se esperaba lineal)"
}
"Portada: $($meta.portada)"
"Revision (4 cuadros): $($meta.revision)"
