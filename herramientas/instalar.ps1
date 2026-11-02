# Instala o actualiza las herramientas compartidas de la Legion en herramientas/bin/:
#   yt-dlp  - descarga de video, subtitulos y metadatos
#   ffmpeg  - corte, reencuadre y subtitulado (build GPL de BtbN, incluye libass)
#   deno    - runtime JavaScript que yt-dlp necesita para YouTube
#   whisper - transcripcion local (whisper.cpp) para fuentes sin subtitulos: Kick, Twitch, Instagram...
#             El modelo va en herramientas/modelos/ y solo se descarga la primera vez.
# Uso: powershell -NoProfile -ExecutionPolicy Bypass -File herramientas/instalar.ps1 [-Solo whisper]
#      -Solo: instala solo esas herramientas (yt-dlp, deno, ffmpeg, whisper). Sirve para no tocar yt-dlp ni ffmpeg
#             mientras un agente los esta usando.

param([ValidateSet('yt-dlp', 'deno', 'ffmpeg', 'whisper')][string[]]$Solo = @())

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$bin = Join-Path $PSScriptRoot 'bin'
$tmp = Join-Path $env:TEMP ('legion-herramientas-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Force $bin, $tmp | Out-Null

function Bajar([string]$url, [string]$destino) {
    Invoke-WebRequest -Uri $url -OutFile $destino -UseBasicParsing -TimeoutSec 900
}
function Toca([string]$nombre) { $Solo.Count -eq 0 -or $Solo -contains $nombre }

try {
    if (Toca 'yt-dlp') {
    "yt-dlp..."
    Bajar 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe' (Join-Path $bin 'yt-dlp.exe')
    }

    if (Toca 'deno') {
    "deno..."
    $zip = Join-Path $tmp 'deno.zip'
    Bajar 'https://github.com/denoland/deno/releases/latest/download/deno-x86_64-pc-windows-msvc.zip' $zip
    Expand-Archive -Force $zip $bin
    }

    if (Toca 'ffmpeg') {
    "ffmpeg..."
    $zip = Join-Path $tmp 'ffmpeg.zip'
    Bajar 'https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip' $zip
    $ext = Join-Path $tmp 'ffmpeg'
    Expand-Archive -Force $zip $ext
    $origen = Get-ChildItem -Recurse -Directory $ext | Where-Object Name -eq 'bin' | Select-Object -First 1
    Copy-Item -Force (Join-Path $origen.FullName '*.exe') $bin
    }

    if (Toca 'whisper') {
    "whisper.cpp..."
    # Los binarios de Windows van en las compilaciones (bNNNN), no en las versiones estables: se toma la mas reciente que los trae.
    # La variante BLAS es la mas rapida en CPU.
    $paquete = 'whisper-blas-bin-x64.zip'
    $versiones = Invoke-RestMethod 'https://api.github.com/repos/ggml-org/whisper.cpp/releases?per_page=20' -UserAgent 'legion' -TimeoutSec 60
    $version = $versiones | Where-Object { $_.assets | Where-Object { $_.name -eq $paquete } } | Select-Object -First 1
    if (-not $version) { throw "No se encontro $paquete en las ultimas versiones de whisper.cpp" }
    $zip = Join-Path $tmp 'whisper.zip'
    Bajar ($version.assets | Where-Object { $_.name -eq $paquete } | Select-Object -First 1).browser_download_url $zip
    $ext = Join-Path $tmp 'whisper'
    Expand-Archive -Force $zip $ext
    $cli = Get-ChildItem -Recurse $ext -Filter 'whisper-cli.exe' | Select-Object -First 1
    if (-not $cli) { throw "$paquete no trae whisper-cli.exe" }
    $destino = Join-Path $bin 'whisper'
    New-Item -ItemType Directory -Force $destino | Out-Null
    Copy-Item -Force (Join-Path $cli.DirectoryName '*') $destino
    [IO.File]::WriteAllText((Join-Path $destino 'VERSION.txt'), $version.tag_name)

    $modelos = Join-Path $PSScriptRoot 'modelos'
    New-Item -ItemType Directory -Force $modelos | Out-Null
    $modelo = Join-Path $modelos 'ggml-small-q5_1.bin'
    if (-not (Test-Path $modelo)) {
        "modelo de whisper (181 MB, solo la primera vez)..."
        Bajar 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small-q5_1.bin' "$modelo.part"
        Move-Item -Force "$modelo.part" $modelo
    }
    }
} finally {
    Remove-Item -Recurse -Force $tmp -ErrorAction SilentlyContinue
}

"--- versiones ---"
"yt-dlp " + (& (Join-Path $bin 'yt-dlp.exe') --version)
(& (Join-Path $bin 'deno.exe') --version) | Select-Object -First 1
(& (Join-Path $bin 'ffmpeg.exe') -hide_banner -version) | Select-Object -First 1
if (Test-Path (Join-Path $bin 'whisper\VERSION.txt')) {
    "whisper.cpp " + [IO.File]::ReadAllText((Join-Path $bin 'whisper\VERSION.txt')) + " + " + (Get-ChildItem (Join-Path $PSScriptRoot 'modelos') -Filter 'ggml-*.bin' | Select-Object -First 1).Name
}
