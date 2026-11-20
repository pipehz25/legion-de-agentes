# guardar-clave-elevenlabs.ps1 - Guarda la clave de la API de ElevenLabs FUERA del proyecto.
#
# La ejecuta una persona en su propia ventana de PowerShell (no desde Claude), desde la
# carpeta del proyecto:
#   powershell -NoProfile -ExecutionPolicy Bypass -File animados\herramientas\guardar-clave-elevenlabs.ps1
#
# La clave se pega sin que se vea en pantalla y queda en
# %USERPROFILE%\.legion\elevenlabs\clave.txt. No se sube a GitHub, no se pega en el chat y
# ningun agente la lee: solo la usa animados/herramientas/voz.mjs para pedir la voz.

$ErrorActionPreference = 'Stop'
$dir = Join-Path $env:USERPROFILE '.legion\elevenlabs'
New-Item -ItemType Directory -Force -Path $dir | Out-Null

$segura = Read-Host 'Pega la clave de ElevenLabs (no se ve al pegarla) y presiona Enter' -AsSecureString
$ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($segura)
try {
  $clave = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr).Trim()
} finally {
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
}
if (-not $clave) {
  Write-Host 'No se guardo nada: la clave quedo vacia.'
  exit 1
}

$archivo = Join-Path $dir 'clave.txt'
[IO.File]::WriteAllText($archivo, $clave, (New-Object Text.UTF8Encoding $false))
Write-Host "Listo: clave guardada en $archivo"

# Comprobacion: pide el estado de la cuenta (sin mostrar la clave).
try {
  $s = Invoke-RestMethod -Uri 'https://api.elevenlabs.io/v1/user/subscription' -Headers @{ 'xi-api-key' = $clave }
  Write-Host ("La clave funciona. Plan: {0}. Caracteres usados este mes: {1} de {2}." -f $s.tier, $s.character_count, $s.character_limit)
} catch {
  Write-Host 'No pude comprobar la cuenta. Revisa que la clave este completa y que tenga el permiso "User: Read".'
}
