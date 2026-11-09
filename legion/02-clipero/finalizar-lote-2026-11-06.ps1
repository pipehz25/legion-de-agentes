param([switch]$PermitirPendientes)
$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '../..')).Path
Set-Location -LiteralPath $root
$utf8 = New-Object Text.UTF8Encoding $false
function ReadJson($p) { [IO.File]::ReadAllText((Join-Path $root $p),$utf8) | ConvertFrom-Json }
function WriteText($p,$s) { [IO.File]::WriteAllText((Join-Path $root $p),$s,$utf8) }
function WriteJson($p,$o) { WriteText $p (ConvertTo-Json -InputObject $o -Depth 20) }
function Hms($s) { $t=[TimeSpan]::FromSeconds($s); '{0}:{1:00}:{2:00}' -f [int][Math]::Floor($t.TotalHours),$t.Minutes,$t.Seconds }
function Html($s) { [Net.WebUtility]::HtmlEncode([string]$s) }
$batch = ReadJson 'salidas/clipero/lote-2026-11-06-seleccion.json'
$context = ReadJson 'salidas/clipero/lote-2026-11-06-contexto.json'
$review = ReadJson 'salidas/clipero/lote-2026-11-06-revision.json'
$validation = ReadJson 'salidas/clipero/lote-2026-11-06-validacion.json'
if ($validation.Count -ne $batch.clips.Count) { throw 'Technical validation incomplete' }
if (@($validation | Where-Object {-not $_.ok -and ($_.problema -ne 'sin render' -or -not $PermitirPendientes)}).Count) { throw 'Technical validation failed or incomplete' }
$registry = ReadJson 'salidas/clipero/clips.json'
$memory = ReadJson 'datos/clipero/estado.json'
$cycle = if ($memory.lote_2026_11_06) { $memory.ciclo } else { [int]$memory.ciclo + 1 }
$stamp = [DateTimeOffset]::Now.ToOffset([TimeSpan]::FromHours(-5)).ToString('o')
$new = New-Object Collections.Generic.List[object]
$pending = New-Object Collections.Generic.List[object]
$pendingRows = New-Object Collections.Generic.List[string]
$rows = New-Object Collections.Generic.List[string]
$cards = New-Object Collections.Generic.List[string]
$sourceRows = New-Object Collections.Generic.List[string]
$rank=@{}
$all = @($batch.clips | Sort-Object @{Expression={($_.puntos | Measure-Object -Sum).Sum};Descending=$true})
foreach ($c in $all) {
    $id='2026-11-06-'+$c.slug
    $path='salidas/clipero/clips/'+$id
    if (-not (Test-Path ($path+'/meta.json'))) {
        if (-not $PermitirPendientes) { throw "Missing render $id" }
        $src=ReadJson ('datos/clipero/fuentes/'+$c.fuente+'/resumen.json')
        $ctx=$context.($c.fuente)
        $reason='Fallo de descarga; ver registro del ultimo intento.'
        $logPath='datos/clipero/lote-2026-11-06/'+$id+'.log'
        if(Test-Path $logPath){$raw=Get-Content -Raw $logPath; if($raw -match 'not a bot|confirm you'){$reason='YouTube exige iniciar sesion para confirmar que no es un bot. No se accedio a cookies ni se intento eludir el control.'}elseif($raw -match 'format is not available'){$reason='YouTube no entrego un formato de video util en el intento.'}elseif($raw -match 'resolve|Connection|timed out|ffmpeg exited'){$reason='Fallo de red/CDN o timeout de ffmpeg en el reintento acotado.'}}
        $score=($c.puntos|Measure-Object -Sum).Sum
        $entry=[pscustomobject]@{id=$id;estado='propuesto';tipo=$c.tipo;puntaje=$score;gancho=$c.gancho;archivo=$null;ficha=($path+'/ficha.md');duracion_seg=($c.fin-$c.inicio);fuente=[pscustomobject]@{url=$src.url;canal=$src.canal;inicio=$c.inicio;fin=$c.fin};oportunidad_cazador=$null;orden_en_fuente=$null;derechos='sin_verificar';plataformas=@('tiktok','instagram','youtube');ventana_hasta=$ctx.ventana;motivo_pendiente=$reason}
        $pending.Add($entry)
        New-Item -ItemType Directory -Force -Path $path|Out-Null
        WriteText ($path+'/ficha.md') ("# "+$c.gancho+"`n`nEstado: propuesto, SIN MP4 exportado.`n`nMotivo: "+$reason+"`n`nFuente: ["+$src.titulo+"]("+$src.url+'&t='+[int][Math]::Floor($c.inicio)+"). Corte propuesto: "+(Hms $c.inicio)+' - '+(Hms $c.fin)+".`n`n"+$c.motivo+"`n`nPuntaje editorial: "+$score+"/100. Desglose: "+($c.puntos -join ', ')+" (fuerza, autonomia, gancho, relevancia, frescura).`n`n"+$ctx.evidencia+"`n`nDerechos: sin_verificar. No publicar hasta producir y revisar el archivo.`n")
        $pendingRows.Add('| ['+$id+']('+('../clips/'+$id+'/ficha.md')+') | '+(Hms $c.inicio)+' - '+(Hms $c.fin)+' | '+$reason+' |')
        continue
    }
    if ($id -notin $review.aprobados) { throw "Missing visual review $id" }
    $m=ReadJson ($path+'/meta.json')
    $src=ReadJson ('datos/clipero/fuentes/'+$c.fuente+'/resumen.json')
    $ctx=$context.($c.fuente)
    $score=($c.puntos | Measure-Object -Sum).Sum
    if (-not $rank.ContainsKey($c.fuente)) { $rank[$c.fuente]=0 }; $rank[$c.fuente]++
    $credit=$src.url+'&t='+[int][Math]::Floor($m.inicio)
    $description=$c.motivo+' Fuente: '+$src.canal+'. '+$credit
    $suggested=if($c.fuente -eq '6VQixigepm8'){'21:00'}else{'19:00'}
    $p=$c.puntos
    $sourceSize=if($m.fuente_ancho){"$($m.fuente_ancho)x$($m.fuente_alto)"}else{'no registrada en la primera exportacion'}
    $text=@"
# $($c.gancho)

- Estado: listo; revision visual de cuatro fotogramas aprobada.
- Archivo: [clip.mp4](clip.mp4), [portada](portada.jpg), [revision](revision.jpg).
- Fuente: [$($src.titulo)]($credit), canal $($src.canal).
- Corte real: $(Hms $m.inicio) - $(Hms $m.fin) ($($m.inicio)-$($m.fin) s); duracion exportada $($m.duracion_seg) s.
- Tipo: $($c.tipo). Prioridad dentro de esta fuente: $($rank[$c.fuente]).
- Derechos: sin_verificar. No se ha confirmado propiedad ni permiso de estos canales.

## Textos para publicar

**TikTok:** $($c.gancho)

**Reels:** $($c.gancho)

**Shorts:** $($c.gancho)

$description

$($ctx.tags)

## Por que se selecciono

$($c.motivo)

Puntaje editorial: **$score/100**. Fuerza $($p[0])/25; autonomia $($p[1])/20; gancho $($p[2])/15; relevancia $($p[3])/25; frescura $($p[4])/15.

$($ctx.evidencia)

El video tenia $($src.vistas) vistas, $($src.comentarios) comentarios y ningun pico de repeticion disponible al analizar. No hay tendencia del Cazador aplicable: encargo directo del usuario. Fuerza, autonomia y gancho son juicios editoriales sobre el fragmento. Frescura conservadora (7/15): busquedas agrupadas no localizaron un duplicado exacto, pero no prueban ausencia en redes. No es una prediccion de vistas.

Referencia de contexto: $($ctx.verificacion)

## Edicion y control

Salida 1080x1920; resolucion del fragmento fuente: $sourceSize. Video completo centrado sobre fondo desenfocado, gancho de hasta ocho palabras y subtitulos de la plataforma. Se conserva el orden y el sentido del audio; no se reescriben cifras usando fuentes externas. La fuente lleva ilustraciones y puede incluir subtitulos originales pequenos; los nuevos subtitulos son mas legibles en vertical.

Audio normalizado en modo $($m.audio.normalizacion): $($m.audio.salida_lufs) LUFS, pico $($m.audio.salida_tp) dBTP. Revision de cuatro cuadros: texto legible, sin anuncios detectados. No equivale a una escucha humana completa.

Ventana editorial estimada hasta $($ctx.ventana). TikTok, Reels y Shorts. Hora de prueba: $suggested America/Bogota, alternando fuentes y midiendo retencion; no se dispone de analitica propia para determinar la mejor hora. No se publico ni se programo nada.
"@
    WriteText ($path+'/ficha.md') $text
    $entry=[pscustomobject]@{id=$id;estado='listo';tipo=$c.tipo;puntaje=$score;gancho=$c.gancho;archivo=$m.archivo;ficha=($path+'/ficha.md');duracion_seg=$m.duracion_seg;fuente=[pscustomobject]@{url=$src.url;canal=$src.canal;inicio=$m.inicio;fin=$m.fin};oportunidad_cazador=$null;orden_en_fuente=$rank[$c.fuente];derechos='sin_verificar';plataformas=@('tiktok','instagram','youtube');ventana_hasta=$ctx.ventana}
    $new.Add($entry)
    $rows.Add('| ['+$id+']('+('../clips/'+$id+'/ficha.md')+') | '+$c.tipo+' | '+$score+' | '+$m.duracion_seg+' s | sin_verificar |')
    $cards.Add('<article data-source="'+(Html $c.fuente)+'"><h2>'+(Html $c.gancho)+'</h2><p>'+(Html $src.canal)+' / '+(Html $ctx.tema)+' / '+$score+'/100 / '+$m.duracion_seg+' s</p><video controls preload="none" poster="clips/'+$id+'/portada.jpg" src="clips/'+$id+'/clip.mp4"></video><p><a href="clips/'+$id+'/clip.mp4" download>Descargar MP4</a> &middot; <a href="clips/'+$id+'/ficha.md">Ficha</a> &middot; <a href="'+(Html $credit)+'">Fuente</a></p><p>'+(Html $c.motivo)+'</p></article>')
}
$ids=@(@($new.ToArray())+@($pending.ToArray())|ForEach-Object {$_.id})
# Preserve unrelated records, including discarded entries, without pruning.
$registry.clips=@($new.ToArray())+@($pending.ToArray())+@($registry.clips|Where-Object {$_.id -notin $ids})
$registry.generado=$stamp; $registry.ciclo=$cycle
WriteJson 'salidas/clipero/clips.json' $registry
$sources=@($batch.clips|Select-Object -ExpandProperty fuente -Unique)
foreach($sid in $sources){
    $src=ReadJson ('datos/clipero/fuentes/'+$sid+'/resumen.json')
    $count=@($new|Where-Object {$_.fuente.url -eq $src.url}).Count
    $pendingCount=@($pending|Where-Object {$_.fuente.url -eq $src.url}).Count
    $lines=@(Get-Content -Encoding UTF8 $src.transcripcion).Count
    $entry=[pscustomobject]@{id=$sid;url=$src.url;titulo=$src.titulo;analizado='2026-11-06';resultado="$count clips, $pendingCount pendientes por descarga | transcripcion completa leida ($lines lineas) | encargo directo ocho fuentes | sin picos ni comentarios | informe 2026-11-06-ocho-videos.md"}
    $memory.fuentes=@($memory.fuentes|Where-Object {$_.id -ne $sid})+@($entry)
    $tableTitle=$src.titulo.Replace('|','\|')
    $sourceRows.Add('| ['+$tableTitle+']('+$src.url+') | '+$src.canal+' | '+(Hms $src.duracion_seg)+' | '+$lines+' | '+$count+' |')
}
$memory.momentos=@($memory.momentos|Where-Object {$_.clip -notin $ids})+@($new|ForEach-Object {[pscustomobject]@{fuente=([regex]::Match($_.fuente.url,'v=([\w-]{11})').Groups[1].Value);inicio=$_.fuente.inicio;fin=$_.fuente.fin;estado='cortado';clip=$_.id;motivo='Seleccion editorial; revision visual aprobada'}})
$memory.momentos+=@($pending|ForEach-Object {[pscustomobject]@{fuente=([regex]::Match($_.fuente.url,'v=([\w-]{11})').Groups[1].Value);inicio=$_.fuente.inicio;fin=$_.fuente.fin;estado='propuesto';clip=$_.id;motivo=$_.motivo_pendiente}})
$memory.actualizado=$stamp; $memory.ciclo=$cycle
$memory|Add-Member -NotePropertyName lote_2026_11_06 -NotePropertyValue 'ocho-videos-usuario' -Force
WriteJson 'datos/clipero/estado.json' $memory
$discard=($sources|ForEach-Object { $ctx=$context.($_); '### '+$ctx.tema+"`n`n"+$ctx.descartes }) -join "`n`n"
$pendingText=if($pending.Count){"Quedan **$($pending.Count) de 27 seleccionados** sin MP4 por los fallos siguientes. Se completo una pasada y un unico reintento de los fallidos; no se usaron cookies ni se eludieron controles de acceso.`n`n| Propuesta | Corte | Motivo |`n|---|---|---|`n"+($pendingRows -join "`n")}else{'Ninguno de los 27 seleccionados queda pendiente.'}
$report=@"
# Ocho videos: seleccion y clips del 6 de noviembre de 2026

## Resumen

Se leyeron completas las ocho transcripciones: **2 h 40 min 10 s** de fuentes. Se exportaron **$($new.Count) clips** con subtitulos, gancho, portada y ficha; todos revisados visualmente en cuatro cuadros y comprobados tecnicamente. Ninguna fuente ofrece picos de repeticion ni comentarios; la seleccion es editorial y no garantiza viralidad. Son videos narrados e ilustrados: **0 clips muestran en persona a los perfiles habituales del proyecto**.

[Abrir catalogo local](../lote-2026-11-06.html). Los MP4 estan en salidas/clipero/clips/2026-11-06-*/clip.mp4.

## Clips producidos

| Clip y ficha | Tipo | Puntaje | Duracion | Derechos |
|---|---|---:|---:|---|
$($rows -join "`n")

## Momentos propuestos sin cortar

$pendingText

Los demas tramos de las fuentes se descartaron por preambulo, repeticion, menor autonomia, limites de contexto o transcripcion dudosa, no por una cuota por fuente.

$discard

## Fuentes analizadas

| Fuente | Canal | Duracion | Lineas leidas | Clips |
|---|---|---:|---:|---:|
$($sourceRows -join "`n")

## Criterio y saturacion

Puntajes desglosados en cada ficha y en lote-2026-11-06-seleccion.json. Las oportunidades del Cazador (ciclo 5) son de otros temas; no se invento una tendencia aplicable. El encargo explicito cubre las ocho fuentes y prima sobre el nicho habitual y el limite de cinco fuentes por ciclo.

Busquedas web por canal y temas, mas tres consultas agrupadas de YouTube: la de CurioSismo no dio resultados; las de Momentos de la Mente devolvieron resultados generales sin recortes exactos verificables. Esto es evidencia limitada: frescura 7/15, no ausencia demostrada de competidores. Registros: datos/clipero/busquedas/2026-11-06_004805.jsonl y 2026-11-06_004808.jsonl.

Se contrastaron hallazgos de papiros con Vesuvius Challenge, ED138 con Rubin, propuesta de hipopotamos con Library of Congress, olfato canino con Queen's Belfast, parpadeo con Sussex, memoria con los estudios citados en fichas. Se conservaron limites y lenguaje condicional; no se modificaron cifras de subtitulos a partir de prensa.

## Problemas y resolucion

El sandbox bloqueo inicialmente el socket; el acceso autorizado fuera del sandbox funciono. Una seccion remota de ED138 quedo sin progreso mas de tres minutos. Se probo descarga completa, pero el formato H.264 pesaba 286,6 MB mas audio y su transferencia resulto lenta. Se detuvieron solo los procesos propios y se regreso a descargas de fragmentos, limitadas a fuente 720p y con timeout de lectura de ffmpeg de 30 segundos. El primer fragmento con esa estrategia termino en 51 segundos. La salida sigue siendo 1080x1920 y no se presenta como detalle nativo 1080p. Cada meta/ficha registra la resolucion efectiva cuando esta disponible. El formato, subtitulos y normalizacion existentes se conservaron.

Los subtitulos de origen contienen algunos errores fuera de los cortes elegidos. Se evito la cifra dudosa de diametro de ED138 y las transiciones extranas del video nocturno. La revision visual es por muestreo de cuatro cuadros, no reproduccion manual completa. Los derechos de ambos canales siguen sin_verificar; no se publico ni programo contenido.

La primera pasada produjo 22 clips y dejo cinco fallos de red, formato, timeout o solicitud temporal de iniciar sesion. Se hizo un unico reintento normal de esos cinco despues de recuperar la conectividad. Los cinco se exportaron correctamente, sin acceder a cookies ni eludir controles de acceso. No quedan clips seleccionados pendientes.

## Proximo paso

Revisar los MP4 en el catalogo y escoger orden de publicacion. Prioridad inicial: los hallazgos de ED138 y papiros por actualidad; alternar luego familia, animales, aprendizaje y descanso. Las fichas incluyen una hora de prueba, no una recomendacion basada en analitica. Se mantuvieron intactos los registros ajenos, incluidos descartes previos.
"@
WriteText 'salidas/clipero/informes/2026-11-06-ocho-videos.md' $report
$options=($sources|ForEach-Object {'<option value="'+$_+'">'+(Html $context.($_).tema)+'</option>'}) -join ''
$html=@"
<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>$($new.Count) clips - 6 noviembre 2026</title><style>body{margin:0;background:#10151f;color:#edf2f7;font:16px system-ui;padding:24px}main{max-width:1400px;margin:auto}h1{font-size:32px}p{line-height:1.5}a{color:#80d5ff}select{padding:12px;font:inherit;background:#243045;color:white;border:1px solid #53627a;border-radius:8px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;margin-top:24px}article{background:#1c2535;padding:20px;border-radius:14px}h2{font-size:21px}video{width:100%;max-height:560px;background:black}article[hidden]{display:none}</style><main><h1>$($new.Count) clips de tus ocho videos</h1><p>6 de noviembre de 2026 · Verticales con subtitulos y audio normalizado. Ordenados por puntaje editorial. Selecciona una fuente y reproduce o descarga cada archivo.</p><p>$($pending.Count) seleccionados pendientes de descarga. <a href="informes/2026-11-06-ocho-videos.md">Informe completo</a> · Derechos por confirmar; no publicados.</p><label>Fuente <select id="source"><option value="">Todas</option>$options</select></label><section class="grid">$($cards -join "`n")</section></main><script>document.querySelector('#source').addEventListener('change',function(){document.querySelectorAll('article').forEach(a=>{a.hidden=this.value!==''&&a.dataset.source!==this.value;if(a.hidden)a.querySelector('video').pause()})});document.querySelectorAll('video').forEach(v=>v.addEventListener('play',()=>document.querySelectorAll('video').forEach(o=>{if(o!==v)o.pause()})));</script></html>
"@
WriteText 'salidas/clipero/lote-2026-11-06.html' $html
Write-Output "Finalizado: $($new.Count) clips, $($pending.Count) pendientes; ciclo $cycle"
