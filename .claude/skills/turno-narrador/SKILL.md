---
name: turno-narrador
description: Turno de producción diaria de videos largos para YouTube (horizontales, con escenas diseñadas) del Agente 06 Narrador - toma los siguientes temas pendientes, escribe el guion, genera la voz de ElevenLabs una sola vez, diseña las escenas en paralelo, exporta, deja el MP4 en Descargas y reporta el costo. Retoma solo donde quedó si un turno se cortó por el límite de uso. Pensado para /loop en una sesión aparte, p. ej. `/loop 6h /turno-narrador`. Acepta cuántos videos hacer en el turno (por defecto 1) y, opcional, temas por id, p. ej. `/turno-narrador 2` o `/turno-narrador hi-boyaca`.
---

# Turno del Narrador (videos largos)

Actúas como orquestador: el trabajo pesado lo hacen subagentes. Anota la hora de inicio y, de cada subagente, los tokens que reporta su notificación de fin (`subagent_tokens`): son el costo del turno.

## 0. Preparar
1. `git pull --rebase --autostash`.
2. Cuántos videos: el número de `$ARGUMENTS` (por defecto 1, máximo 3 por turno). Si trae ids, son esos temas.

## 1. Retomar lo que quedó a medias
Antes de empezar temas nuevos, busca en `animados/propios/*/guion.json` los que tengan `"tipo": "largo"` y `"orientacion": "horizontal"` y no tengan MP4 en `salidas/narrador/<id>/<id>.mp4`, y continúa cada uno desde el paso que le falte (2, 3, 4 o 5). Cuentan dentro del número de videos del turno.
- **Solo lo de esta PC:** retoma únicamente los temas que en `temas.json` estén `en-produccion` con el `"pc"` de esta PC. Los que otra PC ya terminó (`guion` con nota de su MP4) aquí no tienen MP4 (los MP4 no viajan por GitHub) ni voz en la caché (`animados/.voz-cache/` tampoco viaja): retomarlos rehace el video y vuelve a pagar toda la voz.

## 2. Guion (si no existe)
- Tema: el siguiente `pendiente` de `datos/narrador/temas.json`, solo del nicho `historia` (el único con plantillas horizontales probadas; los demás nichos esperan a que se prueben sus estilos). Respeta el orden de las series.
- **Dos PCs:** si el turno corre en más de una PC, apártalo antes de escribir nada: pon el tema en `"estado": "en-produccion"` con `"pc": "<nombre de esta PC>"`, haz commit y push de `datos/narrador/temas.json` y solo entonces sigue. Si el push choca, `git pull --rebase --autostash`, vuelve a mirar y toma otro tema si ya lo apartaron. Nunca tomes un tema `en-produccion` de otra PC.
- Lanza Agent `subagent_type: narrador`, prompt: `Encargo: largo <id>. Sigue tu procedimiento.` Si haces varios videos a la vez, lanza los guiones en el mismo mensaje y agrega al prompt `Otro agente trabaja en paralelo: no edites temas.json.`; luego actualízalo tú.

## 3. Voz (una sola vez)
1. Revisa que el guion no tenga BOM ni acentos rotos (`Ã`, `Â`). Si los tiene, arréglalo antes de pagar voz.
   **Saldo (la cuenta de ElevenLabs es compartida entre las PCs):** con `tope_caracteres` aún en `50`, corre `voz.mjs` una vez: dice los caracteres por generar y lo que lleva la cuenta en el mes, y se detiene sin pagar. Si lo que lleva más lo de este video pasa el límite del plan, no generes: deja el tema `en-produccion` de esta PC y dilo en el informe (el turno siguiente lo retoma cuando haya saldo).
2. Sube `tope_caracteres` del guion a `9500` **con `sed` o node**, nunca con `Get-Content`/`Set-Content` de PowerShell 5.1: leen el UTF-8 como ANSI, rompen los acentos y la voz sale leyendo basura (pasó con hi-boyaca y costó una voz entera).
3. Corre `node animados/herramientas/voz.mjs animados/propios/<id>` y anota los caracteres que dice que va a generar y lo que lleva la cuenta en el mes. Si se corta la conexión, vuelve a correrlo: lo ya generado queda en caché.
4. Vuelve a dejar `tope_caracteres` en `50`.

Si pasa del tope, no lo subas más: avísalo en el informe y deja el tema para revisión.

## 4. Escenas (dos subagentes a la vez)
1. Reparte los capítulos en dos mitades de duración parecida: `c0` con la primera.
2. Lanza **en el mismo mensaje** dos Agent `subagent_type: narrador` con `model: "sonnet"`, uno por mitad, con el prompt `Encargo: escenas <id> <capítulos>. Usa la copia <id>-tmp-a` (o `-tmp-b`). Si hay otros agentes renderizando a la vez, agrega: `Si un render falla por Chrome ocupado, espera y reintenta.`
3. Espera a los dos. Si un capítulo no quedó, relánzalo solo para ese capítulo.

## 5. Unir, exportar y revisar
1. `node animados/herramientas/une-escenas.mjs animados/propios/<id> animados/propios/<id>/escenas/c0.json ...` (todos los capítulos).
2. `node animados/herramientas/producir.mjs animados/propios/<id>` (unos 12 min; en segundo plano). Debe decir «0 caracteres por generar». Con varios videos, expórtalos uno detrás de otro, no a la vez. El render baja GSAP de internet: si falla con `ERR_NAME_NOT_RESOLVED`, se cayó la conexión; vuelve a correrlo y solo rehace los capítulos que faltan.
3. Saca 6 cuadros repartidos del MP4 (con `herramientas/bin/ffmpeg.exe -ss <s> -frames:v 1 -vf scale=480:-1`) y míralos con Read.
   - Si algo se ve mal (texto cortado, escena vacía, cosas encimadas), anótalo.
   - Si es grave, relanza el subagente de escenas de ese capítulo y vuelve a producir: solo se rehace ese capítulo.
4. Copia `<id>.mp4`, `miniatura.jpg`, `descripcion.txt`, `<id>.srt`, `fuentes.md`, `creditos-imagenes.md` y, si existe, `comentario-fuentes.txt` a `%USERPROFILE%\Downloads\Narrador-videos\<id>\`. Marca el tema en `temas.json` como `guion` con una nota de la fecha y la ruta del MP4.
5. Borra las copias `animados/propios/<id>-tmp-*` y `salidas/narrador/<id>-tmp-*`.

## 6. Subir a GitHub
- `git add animados/propios/<id> datos/narrador salidas/narrador/<id> salidas/narrador/videos.json`.
- No subas `salidas/animador/videos.json` si solo cambió la fecha: devuélvelo con `git checkout --`.
- Commit `Narrador (turno): <título> (<duración>)` con el pie de coautoría y `git push`. Si lo rechaza, `git pull --rebase --autostash` y vuelve a hacer push.

## 7. Informe (10 líneas como máximo)
Por video:
- título, duración y ruta del MP4 en Descargas;
- caracteres de voz;
- tokens de cada subagente y su total;
- tiempo total.

Al final, el próximo tema de la lista y lo que quedó pendiente.

**Si un subagente se corta por el límite de uso de Claude,** no lo reintentes en este turno: el siguiente lo retoma (paso 1). Dilo en el informe con la hora a la que se reinicia el límite.
