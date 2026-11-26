# guardar-clave-deepgram.ps1 - Guarda la clave de la API de Deepgram FUERA del proyecto.
#
# La ejecuta una persona en su propia ventana de PowerShell (no desde Claude), desde la
# carpeta del proyecto:
#   powershell -NoProfile -ExecutionPolicy Bypass -File animados\herramientas\guardar-clave-deepgram.ps1
#
# La clave se pega sin que se vea en pantalla y queda en
# %USERPROFILE%\.legion\deepgram\clave.txt. No se sube a GitHub, no se pega en el chat y
# ningun agente la lee: solo la usa animados/herramientas/voz.mjs para pedir la voz.
# Con una clave de rol Member se ve el uso; para ver tambien el saldo, la clave debe ser
# de rol Admin u Owner.

$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12
$dir = Join-Path $env:USERPROFILE '.legion\deepgram'
New-Item -ItemType Directory -Force -Path $dir | Out-Null

$segura = Read-Host 'Pega la clave de Deepgram con CLIC DERECHO (no se ve al pegarla; Ctrl+V no sirve aqui) y presiona Enter' -AsSecureString
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
if ($clave -match '[\x00-\x1F\x7F]' -or $clave.Length -lt 20) {
  Write-Host 'No se guardo nada: no llego la clave (si pegaste con Ctrl+V, llega solo la tecla). Vuelve a correrlo y pega con clic derecho.'
  exit 1
}

$archivo = Join-Path $dir 'clave.txt'
[IO.File]::WriteAllText($archivo, $clave, (New-Object Text.UTF8Encoding $false))
Write-Host "Listo: clave guardada en $archivo"

# Comprobacion: pide los proyectos y el saldo (sin mostrar la clave).
$cabecera = @{ 'Authorization' = "Token $clave" }
try {
  $p = Invoke-RestMethod -Uri 'https://api.deepgram.com/v1/projects' -Headers $cabecera
  $proyecto = $p.projects | Select-Object -First 1
  Write-Host ("La clave funciona. Proyecto: {0}." -f $proyecto.name)
} catch {
  Write-Host 'No pude comprobar la clave. Revisa que este completa (se crea en console.deepgram.com, API Keys).'
  exit 1
}
try {
  $b = Invoke-RestMethod -Uri ("https://api.deepgram.com/v1/projects/{0}/balances" -f $proyecto.project_id) -Headers $cabecera
  foreach ($s in $b.balances) { Write-Host ("Saldo: {0} {1}" -f $s.amount, $s.units) }
} catch {
  Write-Host 'La clave no puede ver el saldo (es de rol Member). El uso si se ve; el saldo, en console.deepgram.com.'
}
