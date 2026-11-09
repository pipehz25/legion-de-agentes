param([switch]$SoloBuscar)
$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '../..')).Path
Set-Location -LiteralPath $root
$env:PATH = (Join-Path $root 'herramientas/bin') + ';' + $env:PATH
$utf8 = New-Object Text.UTF8Encoding $false
$manifest = [IO.File]::ReadAllText((Join-Path $root 'salidas/clipero/lote-2026-11-06-seleccion.json'), $utf8) | ConvertFrom-Json
$logDir = Join-Path $root 'datos/clipero/lote-2026-11-06'
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
if ($SoloBuscar) {
    foreach ($query in @('CurioSismo papiro hipopotamos ED138', 'Momentos de la Mente perros gatos memoria', 'Momentos de la Mente hijo madre descanso casa')) {
        & powershell -NoProfile -ExecutionPolicy Bypass -File legion/02-clipero/clipero.ps1 buscar -Consulta $query -N 8
    }
    exit
}
$items = @($manifest.clips | Sort-Object @{Expression={($_.puntos | Measure-Object -Sum).Sum}; Descending=$true})
$n=0
foreach ($c in $items) {
    $n++
    if ($c.fuente -notmatch '^[A-Za-z0-9_-]{11}$' -or $c.slug -notmatch '^[a-z0-9-]+$') { throw 'Invalid manifest identifier' }
    $id = '2026-11-06-' + $c.slug
    $dir = Join-Path $root ('salidas/clipero/clips/' + $id)
    $resolved = [IO.Path]::GetFullPath($dir)
    if (-not $resolved.StartsWith($root + '\', [StringComparison]::OrdinalIgnoreCase)) { throw 'Output outside workspace' }
    if ((Test-Path -LiteralPath (Join-Path $dir 'meta.json')) -and (Test-Path -LiteralPath (Join-Path $dir 'clip.mp4'))) { Write-Output "EXISTE $n/$($items.Count) $id"; continue }
    Write-Output "INICIO $n/$($items.Count) $id $([DateTimeOffset]::Now.ToString('o'))"
    $argsClip = @('-NoProfile','-ExecutionPolicy','Bypass','-File','legion/02-clipero/clipero.ps1','cortar','-Url',('https://www.youtube.com/watch?v=' + $c.fuente),'-Inicio',$c.inicio.ToString([Globalization.CultureInfo]::InvariantCulture),'-Fin',$c.fin.ToString([Globalization.CultureInfo]::InvariantCulture),'-Id',$id,'-Gancho',$c.gancho,'-Subs','orig','-Modo','desenfoque','-AlturaFuente','720')
    $ErrorActionPreference = 'Continue'
    & powershell @argsClip 2>&1 | Tee-Object -FilePath (Join-Path $logDir ($id + '.log'))
    $ErrorActionPreference = 'Stop'
    if ($LASTEXITCODE -ne 0) { Write-Output "ERROR $id codigo=$LASTEXITCODE" } else { Write-Output "FIN $id $([DateTimeOffset]::Now.ToString('o'))" }
}
