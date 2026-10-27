# Instala o actualiza las herramientas compartidas de la Legion en herramientas/bin/:
#   yt-dlp  - descarga de video, subtitulos y metadatos
#   ffmpeg  - corte, reencuadre y subtitulado (build GPL de BtbN, incluye libass)
#   deno    - runtime JavaScript que yt-dlp necesita para YouTube
# Uso: powershell -NoProfile -ExecutionPolicy Bypass -File herramientas/instalar.ps1

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$bin = Join-Path $PSScriptRoot 'bin'
$tmp = Join-Path $env:TEMP ('legion-herramientas-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Force $bin, $tmp | Out-Null

function Bajar([string]$url, [string]$destino) {
    Invoke-WebRequest -Uri $url -OutFile $destino -UseBasicParsing -TimeoutSec 900
}

try {
    "yt-dlp..."
    Bajar 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe' (Join-Path $bin 'yt-dlp.exe')

    "deno..."
    $zip = Join-Path $tmp 'deno.zip'
    Bajar 'https://github.com/denoland/deno/releases/latest/download/deno-x86_64-pc-windows-msvc.zip' $zip
    Expand-Archive -Force $zip $bin

    "ffmpeg..."
    $zip = Join-Path $tmp 'ffmpeg.zip'
    Bajar 'https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip' $zip
    $ext = Join-Path $tmp 'ffmpeg'
    Expand-Archive -Force $zip $ext
    $origen = Get-ChildItem -Recurse -Directory $ext | Where-Object Name -eq 'bin' | Select-Object -First 1
    Copy-Item -Force (Join-Path $origen.FullName '*.exe') $bin
} finally {
    Remove-Item -Recurse -Force $tmp -ErrorAction SilentlyContinue
}

"--- versiones ---"
"yt-dlp " + (& (Join-Path $bin 'yt-dlp.exe') --version)
(& (Join-Path $bin 'deno.exe') --version) | Select-Object -First 1
(& (Join-Path $bin 'ffmpeg.exe') -hide_banner -version) | Select-Object -First 1
