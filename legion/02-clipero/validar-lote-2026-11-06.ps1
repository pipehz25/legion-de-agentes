$ErrorActionPreference='Stop'
$root=(Resolve-Path (Join-Path $PSScriptRoot '../..')).Path
Set-Location -LiteralPath $root
$utf8=New-Object Text.UTF8Encoding $false
$batch=[IO.File]::ReadAllText((Join-Path $root 'salidas/clipero/lote-2026-11-06-seleccion.json'),$utf8)|ConvertFrom-Json
$results=New-Object Collections.Generic.List[object]
foreach($c in $batch.clips){
    $id='2026-11-06-'+$c.slug
    $dir=Join-Path $root ('salidas/clipero/clips/'+$id)
    if(-not(Test-Path -LiteralPath (Join-Path $dir 'meta.json'))){$results.Add([pscustomobject]@{id=$id;ok=$false;problema='sin render'});continue}
    $m=[IO.File]::ReadAllText((Join-Path $dir 'meta.json'),$utf8)|ConvertFrom-Json
    $probe=& herramientas/bin/ffprobe.exe -v error -show_entries 'stream=codec_type,codec_name,width,height,sample_rate:format=duration' -of json (Join-Path $dir 'clip.mp4')
    if($LASTEXITCODE -ne 0){throw "ffprobe failed $id"}
    $j=($probe -join "`n")|ConvertFrom-Json
    $v=$j.streams|Where-Object {$_.codec_type -eq 'video'}|Select-Object -First 1
    $a=$j.streams|Where-Object {$_.codec_type -eq 'audio'}|Select-Object -First 1
    $d=[double]::Parse($j.format.duration,[Globalization.CultureInfo]::InvariantCulture)
    $ok=($v.width -eq 1080 -and $v.height -eq 1920 -and $v.codec_name -eq 'h264' -and $a.codec_name -eq 'aac' -and $a.sample_rate -eq '48000' -and $d -ge 15 -and $d -le 75 -and $m.palabras_subtituladas -gt 0 -and $m.audio.normalizacion -eq 'linear' -and $m.audio.salida_tp -le -0.9 -and (Test-Path -LiteralPath (Join-Path $dir 'revision.jpg')) -and (Test-Path -LiteralPath (Join-Path $dir 'portada.jpg')))
    $results.Add([pscustomobject]@{id=$id;ok=$ok;duracion=$d;inicio=$m.inicio;fin=$m.fin;fuente=$c.fuente;palabras=$m.palabras_subtituladas;lufs=$m.audio.salida_lufs;tp=$m.audio.salida_tp;bytes=(Get-Item -LiteralPath (Join-Path $dir 'clip.mp4')).Length})
}
foreach($group in ($results|Where-Object {$_.ok}|Group-Object fuente)){
    $ordered=@($group.Group|Sort-Object inicio)
    for($i=1;$i -lt $ordered.Count;$i++){if($ordered[$i].inicio -lt $ordered[$i-1].fin){throw "Overlap $($ordered[$i].id)"}}
}
[IO.File]::WriteAllText((Join-Path $root 'salidas/clipero/lote-2026-11-06-validacion.json'),(ConvertTo-Json -InputObject @($results.ToArray()) -Depth 5),$utf8)
$results|Select-Object id,ok,duracion,lufs,tp|Format-Table -AutoSize
if(@($results|Where-Object {-not $_.ok}).Count){exit 1}
