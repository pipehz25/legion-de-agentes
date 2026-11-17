# Pendientes del Publicador

Generado: 2026-11-17T17:03:13-05:00 · ciclo 10 · entrada: `salidas/clipero/clips.json` (ciclo 16 del Clipero, generado el 2026-11-17 a las 16:44): 39 clips nuevos, 13 del ciclo 15 que aún no estaban preparados y 26 del ciclo 16.

**Cómo leer esta página**

- **TikTok:** cada clip nuevo se aprueba solo y va como **borrador** a la bandeja de su cuenta. No es público hasta que lo publicas desde la app. La API solo manda el video: al publicarlo, **pega el texto de TikTok** de su sección. Hoy llegaron 8:
  - **Legión Urbana** (cuenta `principal`): `samulx-retiro-boxeo`, `samulx-dime-que-no-puedes`, `samulx-cuarto-round` y `westcol-disculpa-pelea-jh`.
  - **@legion.risas** (cuenta `risas`): `parenlamano-papa-a-dormir`, `parenlamano-luquitas-turista`, `parenlamano-luquitas-zapatilla` y `tirandobola-perra-amigo`.
  - Para que un clip no llegue a la bandeja: `/publicador rechazar <clip-id>:tiktok <motivo>`.
- **`westcol-herrera-no-planeado`: no se sabe si llegó.** TikTok respondió HTTP 500 sin identificador, como con `prestamo-primera-cancion` el 31-oct (aquel no llegó). Mira la bandeja de Legión Urbana: si no está, dilo y se reintenta (le queda 1 intento); si está, publícalo desde ahí con el texto de su sección.
- **Bandeja según la API: 44 borradores sin publicar** (25 en `principal` y 19 en `risas`). Hoy TikTok aceptó los 8, pero el 15-nov cortó las dos cuentas con `spam_risk_too_many_pending_share`. **Publica o descarta** desde la app los que ya no quieras: 23 tienen la ventana cerrada (tabla al final del resumen).
- **No caben todos los clips.** TikTok admite 4 borradores al día por cuenta y el Clipero entregó 39 de golpe, casi todos con ventana hasta el 18 o el 19-nov. Plan:
  - **`principal`:**
    - **18-nov:** `samulx-camerino-herrera`, `lonche-cinco-lesiones`, `samulx-prueba-antidoping` y `samulx-camerino-robado` (o `westcol-herrera-no-planeado`, si confirmas que no llegó).
    - **19-nov:** `westcol-boxeo-aburrido`, `ganga-robot-precio` y `westcol-show-kris-r`.
  - **`risas`:**
    - **18-nov:** `nsn-telefono-infancia`, `jhovanoty-faja-disfraz`, `tirandobola-luz-experiencias` y `cotorrisa-vinchi-dicaprio`.
    - **19-nov:** `hh-aeropuerto-4am`, `hh-estafa-reventa`, `hh-colada-bano` y `cotorrisa-suite-karol-g`.
  - **Se quedan fuera** si no decides otra cosa:
    - **`principal`, 5** (vencen el 18-nov): `westcol-daren-mentiroso`, `samulx-entrada-sin-musica`, `samulx-clinica-fotico`, `samulx-hable-mucho` y `samulx-cuerda-espalda`.
    - **`risas`, 16:** 11 vencen el 18-nov y 5 el 19-nov.
    - Si prefieres otros, rechaza para TikTok los del plan que no quieras y entra el siguiente de la cola.
- **Vencidos al llegar:** `stf5-ganga-cara-a-cara` y `stf5-westcol-grefg-frunci` tenían ventana hasta el 16-nov y no se envían. Para mandarlos igual: `/publicador aprobar <clip-id>:tiktok`.
- **Instagram y YouTube:** pendientes de aprobación. Las dos plataformas siguen sin activar y sin credenciales: aprobar ahora solo deja el envío listo para cuando se activen.
  - Los urbanos van en Instagram a `principal`; los de risas, a la cuenta `risas` (apagada hasta que la crees y la autorices), nunca a la urbana.
  - Las 32 pendientes con ventana hasta hoy (16 clips de risas) vencen al acabar el día.
- **Clips subidos a mano** (`legion/03-publicador/subidos-a-mano.json`): no aparecen aquí.
- **Derechos:** todos los clips de esta página son `sin_verificar`: contenido de terceros sin permiso confirmado. Solo se publica con aprobación expresa (en TikTok, tu publicación desde la bandeja) y siempre con el crédito a la fuente. Riesgos: reclamaciones de Content ID (los ingresos pasan al titular), bloqueo del video o avisos por derechos de autor que pueden llevar al cierre de la cuenta.
- **Revisar antes de publicar** (el detalle de cada clip está en su sección):
  - **Herrera** (`westcol-herrera-no-planeado`, `westcol-disculpa-pelea-jh` y `samulx-camerino-herrera`): si la polémica pasa a lo judicial, no se publican. Los textos no añaden nada sobre Herrera. Publica `disculpa-pelea-jh` (ya en la bandeja) y `herrera-no-planeado` en días distintos.
  - `samulx-retiro-boxeo` (en la bandeja): dice «creo que me voy a retirar»; los textos no lo dan por hecho, y en un directo posterior lo matiza.
  - `ganga-robot-precio`: escúchalo antes. No se sabe quién dice la cifra y los textos no se la atribuyen a nadie (la ficha proponía «La Ganga da la cifra»).
  - `hh-estafa-reventa`: junto a la fan aparece un joven (su hijo, según ella). Si parece menor de edad, no lo publiques.
  - `samulx-cuerda-espalda`: se ven los raspones de la espalda.
  - **En la bandeja de risas desde hoy, los tres del Papa** (`parenlamano-papa-a-dormir`, `parenlamano-luquitas-turista` y `parenlamano-luquitas-zapatilla`): vencían hoy. Publica `luquitas-turista` antes que `luquitas-zapatilla`, y deja `cotorrisa-papa-cadenero` para otro día.
  - `parenlamano-papa-a-dormir`: los conductores le ponen voz a un video del Papa. Si parece que el Papa dice «no me rompan más la pelota», descártalo.
  - `parenlamano-barrera-2am`: los textos no atribuyen la regla a nadie (la ficha se la atribuía a Rober Galati por un comentario).
  - `westcol-daren-mentiroso`: los textos no dicen que ganó «en 5 segundos» (la pelea se detuvo después, por la lesión de hombro del Agropecuario).
  - `hh-colada-bano` va antes que `hh-colada-tres-minutos` (el desenlace). En los dos, la fan es una persona privada con la cara cubierta.
  - `jhovanoty-faja-disfraz` (humor político): es el humorista contando su disfraz de Abelardo de la Espriella; De la Espriella no sale. Al publicar no le añadas cargo, consignas ni opinión.
  - `cotorrisa-vinchi-dicaprio` y `cotorrisa-dicaprio-sandwich`, y los dos de Jhovanoty: en días distintos.

## Resumen

Línea **urbano**: 17 clips.

| # | Clip | Puntaje | Ventana hasta | TikTok (principal) | Instagram (principal) | YouTube |
|---|---|---|---|---|---|---|
| 17 | `2026-11-17-samulx-retiro-boxeo` | 78 | 2026-11-18 | en la bandeja desde hoy, 16:58 (borrador) | pendiente de aprobación | pendiente de aprobación |
| 18 | `2026-11-17-westcol-herrera-no-planeado` | 78 | 2026-11-18 | no se sabe si llegó: TikTok dio HTTP 500 sin identificador (hoy, 16:57; 1 de 2 intentos; mira la bandeja) | pendiente de aprobación | pendiente de aprobación |
| 19 | `2026-11-17-samulx-dime-que-no-puedes` | 77 | 2026-11-18 | en la bandeja desde hoy, 16:58 (borrador) | pendiente de aprobación | pendiente de aprobación |
| 20 | `2026-11-17-westcol-disculpa-pelea-jh` | 77 | 2026-11-18 | en la bandeja desde hoy, 16:59 (borrador) | pendiente de aprobación | pendiente de aprobación |
| 21 | `2026-11-17-samulx-cuarto-round` | 76 | 2026-11-18 | en la bandeja desde hoy, 16:59 (borrador) | pendiente de aprobación | pendiente de aprobación |
| 22 | `2026-11-17-samulx-camerino-herrera` | 75 | 2026-11-18 | aprobado automáticamente; en cola (previsto 18-nov) | pendiente de aprobación | pendiente de aprobación |
| 25 | `2026-11-17-lonche-cinco-lesiones` | 74 | 2026-11-18 | aprobado automáticamente; en cola (previsto 18-nov) | pendiente de aprobación | pendiente de aprobación |
| 27 | `2026-11-17-samulx-prueba-antidoping` | 73 | 2026-11-18 | aprobado automáticamente; en cola (previsto 18-nov) | pendiente de aprobación | pendiente de aprobación |
| 32 | `2026-11-17-samulx-camerino-robado` | 72 | 2026-11-18 | aprobado automáticamente; en cola (previsto 18-nov; cede su sitio a westcol-herrera-no-planeado si el usuario confirma que ese no llegó a la bandeja) | pendiente de aprobación | pendiente de aprobación |
| 41 | `2026-11-17-samulx-clinica-fotico` | 70 | 2026-11-18 | aprobado automáticamente; en cola, sin hueco antes de su ventana (2026-11-18) | pendiente de aprobación | pendiente de aprobación |
| 42 | `2026-11-17-samulx-entrada-sin-musica` | 70 | 2026-11-18 | aprobado automáticamente; en cola, sin hueco antes de su ventana (2026-11-18) | pendiente de aprobación | pendiente de aprobación |
| 43 | `2026-11-17-westcol-daren-mentiroso` | 70 | 2026-11-18 | aprobado automáticamente; en cola, sin hueco antes de su ventana (2026-11-18) | pendiente de aprobación | pendiente de aprobación |
| 44 | `2026-11-17-samulx-hable-mucho` | 68 | 2026-11-18 | aprobado automáticamente; en cola, sin hueco antes de su ventana (2026-11-18) | pendiente de aprobación | pendiente de aprobación |
| 46 | `2026-11-17-samulx-cuerda-espalda` | 66 | 2026-11-18 | aprobado automáticamente; en cola, sin hueco antes de su ventana (2026-11-18) | pendiente de aprobación | pendiente de aprobación |
| 47 | `2026-11-17-westcol-boxeo-aburrido` | 76 | 2026-11-19 | aprobado automáticamente; en cola (previsto 19-nov) | pendiente de aprobación | pendiente de aprobación |
| 48 | `2026-11-17-ganga-robot-precio` | 74 | 2026-11-19 | aprobado automáticamente; en cola (previsto 19-nov, después de escucharlo) | pendiente de aprobación | pendiente de aprobación |
| 58 | `2026-11-17-westcol-show-kris-r` | 68 | 2026-11-20 | aprobado automáticamente; en cola (previsto 19-nov, en la previa del concierto de Kris R del 20-nov) | pendiente de aprobación | pendiente de aprobación |

Línea **risas**: 41 clips.

| # | Clip | Puntaje | Ventana hasta | TikTok (risas) | Instagram (risas) | YouTube |
|---|---|---|---|---|---|---|
| 1 | `2026-11-10-cotorrisa-yordi-tacto` | 82 | 2026-11-17 | en la bandeja desde 2026-11-10 20:35 (borrador) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación |
| 2 | `2026-11-10-culpa-tato-diesel` | 80 | 2026-11-17 | en la bandeja desde 2026-11-10 20:35 (borrador) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación |
| 3 | `2026-11-10-cotorrisa-yordi-plancha` | 78 | 2026-11-17 | en la bandeja desde 2026-11-10 20:35 (borrador) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación |
| 4 | `2026-11-10-culpa-ivan-senorazo` | 78 | 2026-11-17 | en la bandeja desde 2026-11-10 20:36 (borrador) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación |
| 5 | `2026-11-10-culpa-super-alexis` | 77 | 2026-11-17 | en la bandeja desde 2026-11-13 18:09 (borrador) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación |
| 6 | `2026-11-10-cotorrisa-yordi-cuenta` | 76 | 2026-11-17 | en la bandeja desde 2026-11-11 11:21 (borrador) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación |
| 7 | `2026-11-10-cotorrisa-vista-cansada` | 75 | 2026-11-17 | en la bandeja desde 2026-11-11 11:22 (borrador) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación |
| 8 | `2026-11-12-cotorrisa-codigo-22` | 74 | 2026-11-17 | en la bandeja desde 2026-11-13 18:09 (borrador) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación |
| 9 | `2026-11-12-culpa-quevedo-mentiras` | 72 | 2026-11-17 | en la bandeja desde 2026-11-14 19:35 (borrador) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación |
| 10 | `2026-11-13-parenlamano-cardenal-prevost` | 72 | 2026-11-17 | en la bandeja desde 2026-11-14 19:36 (borrador) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación |
| 11 | `2026-11-12-cotorrisa-dedito-flaco` | 70 | 2026-11-17 | en la bandeja desde 2026-11-14 19:36 (borrador) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación |
| 12 | `2026-11-12-cotorrisa-harvard` | 70 | 2026-11-17 | en la bandeja desde 2026-11-14 19:37 (borrador) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación |
| 13 | `2026-11-12-culpa-ivan-piscina` | 70 | 2026-11-17 | en la bandeja desde 2026-11-15 18:21 (borrador) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación |
| 14 | `2026-11-13-parenlamano-papa-a-dormir` | 70 | 2026-11-17 | en la bandeja desde hoy, 16:58 (borrador) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación |
| 15 | `2026-11-15-parenlamano-luquitas-turista` | 70 | 2026-11-17 | en la bandeja desde hoy, 16:58 (borrador) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación |
| 16 | `2026-11-15-parenlamano-luquitas-zapatilla` | 69 | 2026-11-17 | en la bandeja desde hoy, 16:58 (borrador) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación |
| 23 | `2026-11-15-nsn-telefono-infancia` | 74 | 2026-11-18 | aprobado automáticamente; en cola (previsto 18-nov) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación |
| 24 | `2026-11-15-tirandobola-perra-amigo` | 74 | 2026-11-18 | en la bandeja desde hoy, 16:59 (borrador) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación |
| 26 | `2026-11-13-jhovanoty-faja-disfraz` | 73 | 2026-11-18 | aprobado automáticamente; en cola (previsto 18-nov) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación |
| 28 | `2026-11-13-cotorrisa-vinchi-dicaprio` | 72 | 2026-11-18 | aprobado automáticamente; en cola (previsto 18-nov) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación |
| 29 | `2026-11-13-jhovanoty-radar-eldorado` | 72 | 2026-11-18 | aprobado automáticamente; en cola, sin hueco antes de su ventana (2026-11-18) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación |
| 30 | `2026-11-15-parenlamano-barrera-2am` | 72 | 2026-11-18 | aprobado automáticamente; en cola, sin hueco antes de su ventana (2026-11-18) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación |
| 31 | `2026-11-15-tirandobola-luz-experiencias` | 72 | 2026-11-18 | aprobado automáticamente; en cola (previsto 18-nov) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación |
| 33 | `2026-11-13-cotorrisa-navajas-suizas` | 71 | 2026-11-18 | aprobado automáticamente; en cola, sin hueco antes de su ventana (2026-11-18) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación |
| 34 | `2026-11-13-cotorrisa-papa-cadenero` | 71 | 2026-11-18 | aprobado automáticamente; en cola, sin hueco antes de su ventana (2026-11-18) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación |
| 35 | `2026-11-13-cotorrisa-pastor-gases` | 70 | 2026-11-18 | aprobado automáticamente; en cola, sin hueco antes de su ventana (2026-11-18) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación |
| 36 | `2026-11-15-nsn-santa-regalos` | 70 | 2026-11-18 | aprobado automáticamente; en cola, sin hueco antes de su ventana (2026-11-18) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación |
| 37 | `2026-11-15-nsn-spiderman-sudado` | 70 | 2026-11-18 | aprobado automáticamente; en cola, sin hueco antes de su ventana (2026-11-18) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación |
| 38 | `2026-11-15-parenlamano-litkillah-kidkeo` | 70 | 2026-11-18 | aprobado automáticamente; en cola, sin hueco antes de su ventana (2026-11-18) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación |
| 39 | `2026-11-15-tirandobola-comentarios-bano` | 70 | 2026-11-18 | aprobado automáticamente; en cola, sin hueco antes de su ventana (2026-11-18) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación |
| 40 | `2026-11-15-tirandobola-marco-gana` | 70 | 2026-11-18 | aprobado automáticamente; en cola, sin hueco antes de su ventana (2026-11-18) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación |
| 45 | `2026-11-13-cotorrisa-dicaprio-sandwich` | 67 | 2026-11-18 | aprobado automáticamente; en cola, sin hueco antes de su ventana (2026-11-18) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación |
| 49 | `2026-11-17-hh-aeropuerto-4am` | 74 | 2026-11-19 | aprobado automáticamente; en cola (previsto 19-nov) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación |
| 50 | `2026-11-17-cotorrisa-suite-karol-g` | 72 | 2026-11-19 | aprobado automáticamente; en cola (previsto 19-nov) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación |
| 51 | `2026-11-17-hh-colada-bano` | 72 | 2026-11-19 | aprobado automáticamente; en cola (previsto 19-nov) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación |
| 52 | `2026-11-17-hh-estafa-reventa` | 72 | 2026-11-19 | aprobado automáticamente; en cola (previsto 19-nov) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación |
| 53 | `2026-11-17-hh-colada-tres-minutos` | 71 | 2026-11-19 | aprobado automáticamente; en cola, sin hueco antes de su ventana (2026-11-19) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación |
| 54 | `2026-11-17-hh-temblor-hijos` | 69 | 2026-11-19 | aprobado automáticamente; en cola, sin hueco antes de su ventana (2026-11-19) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación |
| 55 | `2026-11-17-cotorrisa-paloma-medalla` | 68 | 2026-11-19 | aprobado automáticamente; en cola, sin hueco antes de su ventana (2026-11-19) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación |
| 56 | `2026-11-17-cotorrisa-refri-papas` | 67 | 2026-11-19 | aprobado automáticamente; en cola, sin hueco antes de su ventana (2026-11-19) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación |
| 57 | `2026-11-17-hh-lluvia-lima` | 66 | 2026-11-19 | aprobado automáticamente; en cola, sin hueco antes de su ventana (2026-11-19) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación |

**Borradores con la ventana cerrada** (siguen en la bandeja de TikTok según la API; publícalos solo si aún te sirven, si no, descártalos desde la app para liberar sitio). El texto de cada uno está en su archivo de envío.

| Clip | Cuenta | En la bandeja desde | Ventana hasta | Texto |
|---|---|---|---|---|
| `2026-10-29-blessd-tregua-pirlo` | principal | 2026-10-29 20:54 | 2026-10-31 | [envío](../../datos/publicador/envios/2026-10-29-blessd-tregua-pirlo__tiktok.json) |
| `2026-10-29-blessd-ryan-castro-los-mismos` | principal | 2026-10-31 18:52 | 2026-11-03 | [envío](../../datos/publicador/envios/2026-10-29-blessd-ryan-castro-los-mismos__tiktok.json) |
| `2026-10-29-blessd-vendedor-controles` | principal | 2026-10-31 18:52 | 2026-11-04 | [envío](../../datos/publicador/envios/2026-10-29-blessd-vendedor-controles__tiktok.json) |
| `2026-11-09-ibai-westcol-escalera-ranita` | principal | 2026-11-10 19:40 | 2026-11-14 | [envío](../../datos/publicador/envios/2026-11-09-ibai-westcol-escalera-ranita__tiktok.json) |
| `2026-11-09-ibai-westcol-ariete-puerta` | principal | 2026-11-10 19:40 | 2026-11-14 | [envío](../../datos/publicador/envios/2026-11-09-ibai-westcol-ariete-puerta__tiktok.json) |
| `2026-11-09-ibai-westcol-cinta` | principal | 2026-11-10 19:41 | 2026-11-14 | [envío](../../datos/publicador/envios/2026-11-09-ibai-westcol-cinta__tiktok.json) |
| `2026-11-10-westcol-samulx-lonche-excusas` | principal | 2026-11-10 19:41 | 2026-11-14 | [envío](../../datos/publicador/envios/2026-11-10-westcol-samulx-lonche-excusas__tiktok.json) |
| `2026-11-10-samulx-burger-mermelada` | principal | 2026-11-11 11:19 | 2026-11-14 | [envío](../../datos/publicador/envios/2026-11-10-samulx-burger-mermelada__tiktok.json) |
| `2026-11-10-samulx-pesaje-lonche` | principal | 2026-11-11 11:20 | 2026-11-14 | [envío](../../datos/publicador/envios/2026-11-10-samulx-pesaje-lonche__tiktok.json) |
| `2026-11-10-samulx-burger-espana` | principal | 2026-11-11 11:20 | 2026-11-14 | [envío](../../datos/publicador/envios/2026-11-10-samulx-burger-espana__tiktok.json) |
| `2026-11-11-francupido-plantada-langosta` | risas | 2026-11-13 18:08 | 2026-11-15 | [envío](../../datos/publicador/envios/2026-11-11-francupido-plantada-langosta__tiktok.json) |
| `2026-11-12-ballarta-champana` | risas | 2026-11-13 18:08 | 2026-11-15 | [envío](../../datos/publicador/envios/2026-11-12-ballarta-champana__tiktok.json) |
| `2026-11-11-westcol-samulx-mosquito-ia` | principal | 2026-11-13 18:09 | 2026-11-14 | [envío](../../datos/publicador/envios/2026-11-11-westcol-samulx-mosquito-ia__tiktok.json) |
| `2026-11-11-westcol-samulx-bicho-gigante` | principal | 2026-11-13 18:10 | 2026-11-14 | [envío](../../datos/publicador/envios/2026-11-11-westcol-samulx-bicho-gigante__tiktok.json) |
| `2026-11-09-ibai-westcol-activacion` | principal | 2026-11-13 18:10 | 2026-11-14 | [envío](../../datos/publicador/envios/2026-11-09-ibai-westcol-activacion__tiktok.json) |
| `2026-11-10-samulx-chanty-no-cae` | principal | 2026-11-13 18:10 | 2026-11-14 | [envío](../../datos/publicador/envios/2026-11-10-samulx-chanty-no-cae__tiktok.json) |
| `2026-11-10-samulx-pollito-rebanaditas` | principal | 2026-11-14 19:33 | 2026-11-14 | [envío](../../datos/publicador/envios/2026-11-10-samulx-pollito-rebanaditas__tiktok.json) |
| `2026-11-10-samulx-plan-relevos` | principal | 2026-11-14 19:34 | 2026-11-14 | [envío](../../datos/publicador/envios/2026-11-10-samulx-plan-relevos__tiktok.json) |
| `2026-11-09-ibai-westcol-zapatilla` | principal | 2026-11-14 19:34 | 2026-11-14 | [envío](../../datos/publicador/envios/2026-11-09-ibai-westcol-zapatilla__tiktok.json) |
| `2026-11-11-westcol-grefg-unico-golpe` | principal | 2026-11-14 19:35 | 2026-11-14 | [envío](../../datos/publicador/envios/2026-11-11-westcol-grefg-unico-golpe__tiktok.json) |
| `2026-11-14-stf5-daren-cinco-segundos` | principal | 2026-11-15 18:19 | 2026-11-16 | [envío](../../datos/publicador/envios/2026-11-14-stf5-daren-cinco-segundos__tiktok.json) |
| `2026-11-14-stf5-westcol-patadita` | principal | 2026-11-15 18:20 | 2026-11-16 | [envío](../../datos/publicador/envios/2026-11-14-stf5-westcol-patadita__tiktok.json) |
| `2026-11-14-stf5-daren-quiero-guerra` | principal | 2026-11-15 18:20 | 2026-11-16 | [envío](../../datos/publicador/envios/2026-11-14-stf5-daren-quiero-guerra__tiktok.json) |

## 1. `2026-11-10-cotorrisa-yordi-tacto`

- **Gancho:** Yordi Rosado y su primer tacto de próstata
- **Puntaje:** 82 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-17 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-10-cotorrisa-yordi-tacto/clip.mp4) (42,5 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-10-cotorrisa-yordi-tacto/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=jUfBJ_aIA3w
- **Revisar antes de publicar:** Tema de salud: Yordi habla de su chequeo preventivo; el clip no bromea sobre el cáncer ni sobre enfermos. La cita del remate va con un solo «señorita» (la ficha la da de las dos formas).

### TikTok · cuenta `risas` (@legion.risas) · en la bandeja desde 2026-11-10 20:35 (borrador)

```
“Señorita, me estoy haciendo”: Yordi Rosado y su primer tacto de próstata

¿Ya te lo hiciste o le tienes miedo?

Crédito: La Cotorrisa (canal de Ricardo Pérez en YouTube), “Anecdotario 377 - Nuestro primer tacto de próstata”, con Yordi Rosado. Video original (minuto 28:16): https://youtu.be/jUfBJ_aIA3w?t=1696

#YordiRosado #LaCotorrisa #Humor #Comedia #Podcast
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
Yordi Rosado y lo que nadie te cuenta de tu primer tacto de próstata

Invitado en La Cotorrisa, Yordi Rosado cuenta cómo fue su primer tacto de próstata, en el chequeo de los 40: “la entrada no fue nada del otro mundo… pero ahí sí te da pena”.

¿Ya te lo hiciste o le tienes miedo?

Crédito: La Cotorrisa (canal de Ricardo Pérez en YouTube), “Anecdotario 377 - Nuestro primer tacto de próstata”, con Yordi Rosado. Video original (minuto 28:16): https://youtu.be/jUfBJ_aIA3w?t=1696

#YordiRosado #LaCotorrisa #Humor #Comedia #Podcast
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** Yordi Rosado y su primer tacto de próstata en La Cotorrisa

```
Invitado en La Cotorrisa, Yordi Rosado cuenta cómo fue su primer tacto de próstata, en el chequeo de los 40: “la entrada no fue nada del otro mundo… pero ahí sí te da pena”.

Crédito: La Cotorrisa (canal de Ricardo Pérez en YouTube), “Anecdotario 377 - Nuestro primer tacto de próstata”, con Yordi Rosado. Video original (minuto 28:16): https://youtu.be/jUfBJ_aIA3w?t=1696

#YordiRosado #LaCotorrisa #Humor #Comedia #Podcast
```

**Etiquetas:** Yordi Rosado, La Cotorrisa, Ricardo Pérez, Slobotzky, tacto de próstata, chequeo a los 40, humor, comedia, podcast


## 2. `2026-11-10-culpa-tato-diesel`

- **Gancho:** Le echó gasolina a un carro diésel
- **Puntaje:** 80 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-17 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-10-culpa-tato-diesel/clip.mp4) (51 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-10-culpa-tato-diesel/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=3BAphhKqHUw
- **Revisar antes de publicar:** VER ANTES DE PUBLICAR: en el audio el presentador le da la palabra a Tato Devia, pero en la imagen no se distingue cuál de los seis humoristas es. Los textos no lo nombran (ni llevan #TatoDevia). Si al verlo confirmas que es él, puedes añadir su nombre al publicar. Las réplicas («mi otro carro es Levi's») son del elenco, no del que cuenta.

### TikTok · cuenta `risas` (@legion.risas) · en la bandeja desde 2026-11-10 20:35 (borrador)

```
Le echó gasolina a un carro diésel… y el resto de Los De La Culpa no lo deja en paz

¿Tú sabías cuál le tocaba?

Crédito: Los De La Culpa (YouTube), “Errores Memorables | Los De La Culpa - Capítulo 268”. Video original (minuto 8:25): https://youtu.be/3BAphhKqHUw?t=505

#LosDeLaCulpa #Humor #ComediaColombiana #StandUp #Anecdotas
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
Le prestaron un carro, le echó gasolina… y era diésel

“Perdonen mi ignorancia”: en el capítulo de errores memorables de Los De La Culpa, uno de los humoristas cuenta que le echó gasolina a un carro diésel. El resto del elenco no lo deja en paz: “mi otro carro es Levi's”.

¿Tú sabías cuál le tocaba?

Crédito: Los De La Culpa (YouTube), “Errores Memorables | Los De La Culpa - Capítulo 268”. Video original (minuto 8:25): https://youtu.be/3BAphhKqHUw?t=505

#LosDeLaCulpa #Humor #ComediaColombiana #StandUp #Anecdotas
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** Le echó gasolina a un carro diésel: error memorable en Los De La Culpa

```
“Perdonen mi ignorancia”: en el capítulo de errores memorables de Los De La Culpa, uno de los humoristas cuenta que le prestaron un carro y le echó gasolina… y era diésel. El resto del elenco no lo deja en paz: “mi otro carro es Levi's”.

Crédito: Los De La Culpa (YouTube), “Errores Memorables | Los De La Culpa - Capítulo 268”. Video original (minuto 8:25): https://youtu.be/3BAphhKqHUw?t=505

#LosDeLaCulpa #Humor #ComediaColombiana #StandUp #Anecdotas
```

**Etiquetas:** Los De La Culpa, Errores Memorables, humor colombiano, comedia colombiana, stand up, carro diésel, anécdotas


## 3. `2026-11-10-cotorrisa-yordi-plancha`

- **Gancho:** Le preguntó a un luchador cómo le fue
- **Puntaje:** 78 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-17 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-10-cotorrisa-yordi-plancha/clip.mp4) (74,3 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-10-cotorrisa-yordi-plancha/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=jUfBJ_aIA3w
- **Revisar antes de publicar:** CUIDADO: el luchador (Super Porky) ya falleció. Los textos no lo nombran ni hablan de su cuerpo; el clip deja fuera los chistes sobre su peso. Al publicar no añadas su nombre ni comentarios sobre él. El «¿cómo estuvo allá arriba?» de la ficha queda fuera del corte: los textos citan «¿cómo la pasaste en la arena?». La broma final de un anfitrión («otra dimensión en la que Yordi Rosado murió…») es sobre Yordi y no se repite en los textos.

### TikTok · cuenta `risas` (@legion.risas) · en la bandeja desde 2026-11-10 20:35 (borrador)

```
“¿Quieres ver cómo estuvo?”: la entrevista de Yordi Rosado en la Arena México que acabó en plancha

¿Tú le habrías preguntado?

Crédito: La Cotorrisa (canal de Ricardo Pérez en YouTube), “Anecdotario 377 - Nuestro primer tacto de próstata”, con Yordi Rosado. Video original (minuto 17:19): https://youtu.be/jUfBJ_aIA3w?t=1039

#YordiRosado #LaCotorrisa #LuchaLibre #Humor #Anecdotas
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
Yordi Rosado le preguntó a un luchador cómo le fue… y se lo enseñó

De sus años de reportero en la Arena México: Yordi Rosado entrevista a un luchador recién bajado del ring, “¿cómo la pasaste en la arena?”, y la respuesta es “¿quieres ver cómo estuvo?”. Y una plancha.

¿Tú le habrías preguntado?

Crédito: La Cotorrisa (canal de Ricardo Pérez en YouTube), “Anecdotario 377 - Nuestro primer tacto de próstata”, con Yordi Rosado. Video original (minuto 17:19): https://youtu.be/jUfBJ_aIA3w?t=1039

#YordiRosado #LaCotorrisa #LuchaLibre #Humor #Anecdotas
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** Yordi Rosado y la plancha que recibió entrevistando en la Arena México

```
De sus años de reportero en la Arena México: Yordi Rosado entrevista a un luchador recién bajado del ring, “¿cómo la pasaste en la arena?”, y la respuesta es “¿quieres ver cómo estuvo?”. Y una plancha.

Crédito: La Cotorrisa (canal de Ricardo Pérez en YouTube), “Anecdotario 377 - Nuestro primer tacto de próstata”, con Yordi Rosado. Video original (minuto 17:19): https://youtu.be/jUfBJ_aIA3w?t=1039

#YordiRosado #LaCotorrisa #LuchaLibre #Humor #Anecdotas
```

**Etiquetas:** Yordi Rosado, La Cotorrisa, Ricardo Pérez, lucha libre, Arena México, anécdotas, humor, comedia


## 4. `2026-11-10-culpa-ivan-senorazo`

- **Gancho:** Iván Marín y su saludo a Jessi Uribe
- **Puntaje:** 78 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-17 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-10-culpa-ivan-senorazo/clip.mp4) (52,8 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-10-culpa-ivan-senorazo/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=3BAphhKqHUw
- **Revisar antes de publicar:** La broma es el despiste de Iván Marín, no Jessi Uribe: los textos no se burlan de Jessi. La respuesta de Jessi va como «según cuenta» Iván.

### TikTok · cuenta `risas` (@legion.risas) · en la bandeja desde 2026-11-10 20:36 (borrador)

```
“¿Qué se dice, señorazo?”: Iván Marín saludó a Jessi Uribe con la frase de otro cantante

¿A quién saludaste mal alguna vez?

Crédito: Los De La Culpa (YouTube), “Errores Memorables | Los De La Culpa - Capítulo 268”. Video original (minuto 12:31): https://youtu.be/3BAphhKqHUw?t=751

#LosDeLaCulpa #IvanMarin #JessiUribe #Humor #ComediaColombiana
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
Iván Marín se encontró a Jessi Uribe… y lo saludó como a Luis Alfonso

En una fiesta, Iván Marín se encuentra con Jessi Uribe y lo saluda con un “¿qué se dice, señorazo?”. Según cuenta en Los De La Culpa, la respuesta fue: “señorazo es Luis Alfonso”. Y quedó la foto del momento.

¿A quién saludaste mal alguna vez?

Crédito: Los De La Culpa (YouTube), “Errores Memorables | Los De La Culpa - Capítulo 268”. Video original (minuto 12:31): https://youtu.be/3BAphhKqHUw?t=751

#LosDeLaCulpa #IvanMarin #JessiUribe #Humor #ComediaColombiana
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** El saludo equivocado de Iván Marín a Jessi Uribe (Los De La Culpa)

```
En una fiesta, Iván Marín se encuentra con Jessi Uribe y lo saluda con un “¿qué se dice, señorazo?”. Según cuenta en Los De La Culpa, la respuesta fue: “señorazo es Luis Alfonso”. Y quedó la foto del momento.

Crédito: Los De La Culpa (YouTube), “Errores Memorables | Los De La Culpa - Capítulo 268”. Video original (minuto 12:31): https://youtu.be/3BAphhKqHUw?t=751

#LosDeLaCulpa #IvanMarin #JessiUribe #Humor #ComediaColombiana
```

**Etiquetas:** Iván Marín, Jessi Uribe, Luis Alfonso, Los De La Culpa, señorazo, humor colombiano, comedia colombiana, anécdotas


## 5. `2026-11-10-culpa-super-alexis`

- **Gancho:** Lo saludó como Alexis Lozano… y era Nino
- **Puntaje:** 77 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-17 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-10-culpa-super-alexis/clip.mp4) (66,9 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-10-culpa-super-alexis/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=3BAphhKqHUw
- **Revisar antes de publicar:** La ficha pide comprobar quién cuenta la anécdota antes de nombrarlo: los textos no lo nombran («uno de Los De La Culpa»).

### TikTok · cuenta `risas` (@legion.risas) · en la bandeja desde 2026-11-13 18:09 (borrador)

```
Lo saludó como “Super Alexis Lozano”… y era Nino Caicedo 😂

En un avión, uno de Los De La Culpa se cruzó con un fundador de Guayacán Orquesta y lo saludó como en las canciones.

¿A quién has saludado con el nombre equivocado?

Crédito: Los De La Culpa (YouTube), “Errores Memorables | Los De La Culpa - Capítulo 268”. Video original (minuto 13:42): https://youtu.be/3BAphhKqHUw?t=822

#LosDeLaCulpa #Guayacan #Salsa #ComediaColombiana #Humor
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
El saludo más incómodo a un músico de Guayacán 😅

En un avión iba un fundador de Guayacán Orquesta. Uno de Los De La Culpa lo saludó como en las canciones: “Maestro, Super Alexis Lozano”. Era Nino Caicedo.

¿A quién has saludado con el nombre equivocado?

Crédito: Los De La Culpa (YouTube), “Errores Memorables | Los De La Culpa - Capítulo 268”. Video original (minuto 13:42): https://youtu.be/3BAphhKqHUw?t=822

#LosDeLaCulpa #Guayacan #Salsa #ComediaColombiana #Humor
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** Guayacán: lo saludó como Alexis Lozano y era Nino Caicedo

```
En un avión iba un fundador de Guayacán Orquesta. Uno de Los De La Culpa lo saludó como en las canciones: “Maestro, Super Alexis Lozano”. Era Nino Caicedo.

Crédito: Los De La Culpa (YouTube), “Errores Memorables | Los De La Culpa - Capítulo 268”. Video original (minuto 13:42): https://youtu.be/3BAphhKqHUw?t=822

#LosDeLaCulpa #Guayacan #ComediaColombiana #Humor
```

**Etiquetas:** Los De La Culpa, Guayacán Orquesta, Alexis Lozano, Nino Caicedo, salsa, comedia colombiana, anécdotas, humor


## 6. `2026-11-10-cotorrisa-yordi-cuenta`

- **Gancho:** El día que a Yordi Rosado le cobraron
- **Puntaje:** 76 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-17 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-10-cotorrisa-yordi-cuenta/clip.mp4) (65,5 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-10-cotorrisa-yordi-cuenta/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=jUfBJ_aIA3w
- **Revisar antes de publicar:** Autocrítica en broma de Yordi Rosado. Los textos dejan fuera el «cabrón» de la cita de la ficha.

### TikTok · cuenta `risas` (@legion.risas) · en la bandeja desde 2026-11-11 11:21 (borrador)

```
Le pagaban la cuenta en todos los restaurantes… hasta que un día no: Yordi Rosado

¿A ti se te hubiera subido?

Crédito: La Cotorrisa (canal de Ricardo Pérez en YouTube), “Anecdotario 377 - Nuestro primer tacto de próstata”, con Yordi Rosado. Video original (minuto 6:07): https://youtu.be/jUfBJ_aIA3w?t=367

#YordiRosado #LaCotorrisa #OtroRollo #Humor #Anecdotas
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
Yordi Rosado y sus 10 minutos de “subida de humo”

En los años de “Otro Rollo” le pagaban la cuenta en todos los restaurantes. Hasta que un día: “joven, la cuenta”. En La Cotorrisa, Yordi Rosado se ríe de su propia ofensa: “es un restaurante, tiene negocio”.

¿A ti se te hubiera subido?

Crédito: La Cotorrisa (canal de Ricardo Pérez en YouTube), “Anecdotario 377 - Nuestro primer tacto de próstata”, con Yordi Rosado. Video original (minuto 6:07): https://youtu.be/jUfBJ_aIA3w?t=367

#YordiRosado #LaCotorrisa #OtroRollo #Humor #Anecdotas
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** Yordi Rosado y los 10 minutos que se le subió la fama

```
En los años de “Otro Rollo” le pagaban la cuenta en todos los restaurantes. Hasta que un día: “joven, la cuenta”. En La Cotorrisa, Yordi Rosado se ríe de su propia ofensa: “es un restaurante, tiene negocio”.

Crédito: La Cotorrisa (canal de Ricardo Pérez en YouTube), “Anecdotario 377 - Nuestro primer tacto de próstata”, con Yordi Rosado. Video original (minuto 6:07): https://youtu.be/jUfBJ_aIA3w?t=367

#YordiRosado #LaCotorrisa #OtroRollo #Humor #Anecdotas
```

**Etiquetas:** Yordi Rosado, La Cotorrisa, Otro Rollo, Ricardo Pérez, Slobotzky, fama, anécdotas, humor


## 7. `2026-11-10-cotorrisa-vista-cansada`

- **Gancho:** A los 40, la vista cansada llega así
- **Puntaje:** 75 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-17 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-10-cotorrisa-vista-cansada/clip.mp4) (62,9 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-10-cotorrisa-vista-cansada/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=jUfBJ_aIA3w
- **Revisar antes de publicar:** ESCUCHAR: hacia el segundo 33 los subtítulos dicen «letras» y puede ser «lentes» (ficha, notas técnicas). Los textos no citan esa frase ni dicen que se niegue a agrandar las letras del celular. El remate del mensaje de mamá lo ponen los anfitriones.

### TikTok · cuenta `risas` (@legion.risas) · en la bandeja desde 2026-11-11 11:22 (borrador)

```
“Hoy amanecí y ya no veo bien”: Yordi Rosado y la vista cansada a los 40

¿Qué tamaño de letra tiene tu celular?

Crédito: La Cotorrisa (canal de Ricardo Pérez en YouTube), “Anecdotario 377 - Nuestro primer tacto de próstata”, con Yordi Rosado. Video original (minuto 45:07): https://youtu.be/jUfBJ_aIA3w?t=2707

#YordiRosado #LaCotorrisa #Humor #Los40 #Comedia
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
A los 40, la vista cansada llega así

“La semana pasada perfecto y hoy amanecí y ya no veo bien”: Yordi Rosado cuenta en La Cotorrisa cómo le llegó la vista cansada. Y el remate en la mesa: el clásico mensaje de mamá, “hola, mijo, ¿cómo estás?”.

¿Qué tamaño de letra tiene tu celular?

Crédito: La Cotorrisa (canal de Ricardo Pérez en YouTube), “Anecdotario 377 - Nuestro primer tacto de próstata”, con Yordi Rosado. Video original (minuto 45:07): https://youtu.be/jUfBJ_aIA3w?t=2707

#YordiRosado #LaCotorrisa #Humor #Los40 #Comedia
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** Vista cansada a los 40: Yordi Rosado en La Cotorrisa

```
“La semana pasada perfecto y hoy amanecí y ya no veo bien”: Yordi Rosado cuenta en La Cotorrisa cómo le llegó la vista cansada. Y el remate en la mesa: el clásico mensaje de mamá, “hola, mijo, ¿cómo estás?”.

Crédito: La Cotorrisa (canal de Ricardo Pérez en YouTube), “Anecdotario 377 - Nuestro primer tacto de próstata”, con Yordi Rosado. Video original (minuto 45:07): https://youtu.be/jUfBJ_aIA3w?t=2707

#YordiRosado #LaCotorrisa #Humor #Los40 #Comedia
```

**Etiquetas:** Yordi Rosado, La Cotorrisa, vista cansada, los 40, Ricardo Pérez, Slobotzky, humor, comedia


## 8. `2026-11-12-cotorrisa-codigo-22`

- **Gancho:** El 'código 22' de los restaurantes
- **Puntaje:** 74 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-17 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-12-cotorrisa-codigo-22/clip.mp4) (71,1 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-12-cotorrisa-codigo-22/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=jUfBJ_aIA3w
- **Revisar antes de publicar:** El código 22 se lo aplicaban a Adal Ramones (Yordi lo nombra en el audio). El título de TikTok de la ficha decía que le pagaban la cuenta a Yordi; se cambió por «Yordi Rosado revela qué era el código 22».

### TikTok · cuenta `risas` (@legion.risas) · en la bandeja desde 2026-11-13 18:09 (borrador)

```
Yordi Rosado revela qué era el “código 22” en los restaurantes 😂

Código 22, código 11… y el misterioso código Cóndor.

¿Qué código te tocaría a ti?

Crédito: La Cotorrisa (canal de Ricardo Pérez en YouTube), “Anecdotario 377 - Nuestro primer tacto de próstata”, con Yordi Rosado. Video original (minuto 3:30): https://youtu.be/jUfBJ_aIA3w?t=210

#LaCotorrisa #YordiRosado #OtroRollo #Anecdotario #Humor
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
Yordi Rosado revela qué era el “código 22” en los restaurantes 😂

En la época de Otro Rollo, a Adal Ramones le consiguieron mesa en un restaurante lleno, lo atendieron como rey y le pagaron la cuenta: era un “código 22”. Después llegaron el código 11 (mesa, pero sin cuenta pagada) y el misterioso código Cóndor.

¿Qué código te tocaría a ti?

Crédito: La Cotorrisa (canal de Ricardo Pérez en YouTube), “Anecdotario 377 - Nuestro primer tacto de próstata”, con Yordi Rosado. Video original (minuto 3:30): https://youtu.be/jUfBJ_aIA3w?t=210

#LaCotorrisa #YordiRosado #OtroRollo #Anecdotario #Humor
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** Código 22, código 11 y código Cóndor: la anécdota de Yordi Rosado

```
En la época de Otro Rollo, a Adal Ramones le consiguieron mesa en un restaurante lleno, lo atendieron como rey y le pagaron la cuenta: era un “código 22”. Después llegaron el código 11 (mesa, pero sin cuenta pagada) y el misterioso código Cóndor.

Crédito: La Cotorrisa (canal de Ricardo Pérez en YouTube), “Anecdotario 377 - Nuestro primer tacto de próstata”, con Yordi Rosado. Video original (minuto 3:30): https://youtu.be/jUfBJ_aIA3w?t=210

#LaCotorrisa #YordiRosado #OtroRollo #Humor
```

**Etiquetas:** Yordi Rosado, La Cotorrisa, Otro Rollo, Adal Ramones, Ricardo Pérez, Slobotzky, anécdotas, humor


## 9. `2026-11-12-culpa-quevedo-mentiras`

- **Gancho:** Ricardo Quevedo: 'digan mentiras con buena intención'
- **Puntaje:** 72 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-17 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-12-culpa-quevedo-mentiras/clip.mp4) (31,7 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-12-culpa-quevedo-mentiras/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=3BAphhKqHUw
- **Revisar antes de publicar:** Los textos citan la frase de la descripción revisada de la ficha («Digan mentiras con buena intención»); no usan «No digan la verdad», que solo estaba en el título sugerido.

### TikTok · cuenta `risas` (@legion.risas) · en la bandeja desde 2026-11-14 19:35 (borrador)

```
Ricardo Quevedo: “Digan mentiras con buena intención” 😂

¿El peor consejo que siguió? Ser honesto.

¿Cuál es tu mentira con buena intención favorita?

Crédito: Los De La Culpa (YouTube), “Errores Memorables | Los De La Culpa - Capítulo 268”. Video original (minuto 34:39): https://youtu.be/3BAphhKqHUw?t=2079

#RicardoQuevedo #LosDeLaCulpa #ComediaColombiana #Humor #StandUp
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
El peor consejo según Ricardo Quevedo: ser honesto 😂

“La gente no acepta la verdad… Digan mentiras con buena intención: mi amor, qué flaca te ves; te quedó delicioso este pollo”.

¿Cuál es tu mentira con buena intención favorita?

Crédito: Los De La Culpa (YouTube), “Errores Memorables | Los De La Culpa - Capítulo 268”. Video original (minuto 34:39): https://youtu.be/3BAphhKqHUw?t=2079

#RicardoQuevedo #LosDeLaCulpa #ComediaColombiana #Humor #StandUp
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** Ricardo Quevedo y las mentiras con buena intención

```
¿El peor consejo que siguió Ricardo Quevedo? Ser honesto. “La gente no acepta la verdad… Digan mentiras con buena intención”.

Crédito: Los De La Culpa (YouTube), “Errores Memorables | Los De La Culpa - Capítulo 268”. Video original (minuto 34:39): https://youtu.be/3BAphhKqHUw?t=2079

#RicardoQuevedo #LosDeLaCulpa #ComediaColombiana #Humor
```

**Etiquetas:** Ricardo Quevedo, Los De La Culpa, comedia colombiana, stand up, mentiras piadosas, consejos, humor


## 10. `2026-11-13-parenlamano-cardenal-prevost`

- **Gancho:** Hace dos años nadie conocía al Papa
- **Puntaje:** 72 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-17 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-13-parenlamano-cardenal-prevost/clip.mp4) (57,9 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-13-parenlamano-cardenal-prevost/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=K4MCv-DXdmI
- **Revisar antes de publicar:** Ficha: escuchar antes de publicar el tramo final (30:40-30:50): los subtítulos estaban desordenados y una palabra quedó como «(…)». Los textos no citan esa última frase y dicen que es una escena inventada por los conductores.

### TikTok · cuenta `risas` (@legion.risas) · en la bandeja desde 2026-11-14 19:36 (borrador)

```
Si el Papa hubiera venido hace dos años, cuando nadie lo conocía: “Corré el auto blanco ese”

En Paren la Mano imaginan cómo habrían tratado al cardenal Prevost, hoy León XIV, antes de ser Papa. Es una escena inventada por los conductores.

¿Le habrías movido el auto?

Crédito: Paren la Mano (Vorterix), “EL DÍA QUE LUQUITAS HABLÓ CON EL PAPA...”. Video original (minuto 29:52): https://youtu.be/K4MCv-DXdmI?t=1792

#ParenLaMano #Vorterix #PapaLeonXIV #Humor #Argentina
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
“Un señor de 75 años una mañana se levanta y es el hombre más famoso del mundo”

Un día eres un cardenal más y al siguiente, el Papa. En Paren la Mano imaginan qué habría pasado si Robert Prevost, hoy León XIV, hubiera ido a Argentina hace dos años, cuando casi nadie lo conocía: “Corré el auto blanco ese”. Es una escena inventada por los conductores.

¿Le habrías movido el auto?

Crédito: Paren la Mano (Vorterix), “EL DÍA QUE LUQUITAS HABLÓ CON EL PAPA...”. Video original (minuto 29:52): https://youtu.be/K4MCv-DXdmI?t=1792

#ParenLaMano #Vorterix #PapaLeonXIV #Humor #Argentina
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** Si el Papa León XIV hubiera venido hace dos años | Paren la Mano

```
Un día eres un cardenal más y al siguiente, el Papa. En Paren la Mano imaginan qué habría pasado si Robert Prevost, hoy León XIV, hubiera ido a Argentina hace dos años, cuando casi nadie lo conocía. Es una escena inventada por los conductores.

Crédito: Paren la Mano (Vorterix), “EL DÍA QUE LUQUITAS HABLÓ CON EL PAPA...”. Video original (minuto 29:52): https://youtu.be/K4MCv-DXdmI?t=1792

#ParenLaMano #Vorterix #PapaLeonXIV #Humor
```

**Etiquetas:** Paren la Mano, Vorterix, Papa León XIV, Robert Prevost, humor argentino, streaming argentino, Papa, humor


## 11. `2026-11-12-cotorrisa-dedito-flaco`

- **Gancho:** Cómo elegir al doctor del tacto
- **Puntaje:** 70 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-17 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-12-cotorrisa-dedito-flaco/clip.mp4) (23 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-12-cotorrisa-dedito-flaco/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=jUfBJ_aIA3w
- **Revisar antes de publicar:** La ficha pide comprobar quién de los conductores dice el remate: los textos no lo nombran. Bromea con el examen, no con la enfermedad.

### TikTok · cuenta `risas` (@legion.risas) · en la bandeja desde 2026-11-14 19:36 (borrador)

```
La pregunta que nadie se atreve a hacer antes del tacto 😂

“Estoy buscando un doctor de manita chica, de dedito flaco”.

¿Tú le pedirías ver las manos?

Crédito: La Cotorrisa (canal de Ricardo Pérez en YouTube), “Anecdotario 377 - Nuestro primer tacto de próstata”, con Yordi Rosado. Video original (minuto 25:40): https://youtu.be/jUfBJ_aIA3w?t=1540

#LaCotorrisa #YordiRosado #Anecdotario #Humor #Prostata
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
El truco de La Cotorrisa para elegir doctor del tacto 😂

La pregunta que nadie se atreve a hacer antes del examen de próstata: ¿hay que pedirle al doctor que enseñe las manos? “Estoy buscando un doctor de manita chica, de dedito flaco”.

¿Tú le pedirías ver las manos?

Crédito: La Cotorrisa (canal de Ricardo Pérez en YouTube), “Anecdotario 377 - Nuestro primer tacto de próstata”, con Yordi Rosado. Video original (minuto 25:40): https://youtu.be/jUfBJ_aIA3w?t=1540

#LaCotorrisa #YordiRosado #Anecdotario #Humor #Prostata
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** La Cotorrisa y el truco para elegir doctor del tacto

```
La pregunta que nadie se atreve a hacer antes del examen de próstata: ¿hay que pedirle al doctor que enseñe las manos? “Estoy buscando un doctor de manita chica, de dedito flaco”.

Crédito: La Cotorrisa (canal de Ricardo Pérez en YouTube), “Anecdotario 377 - Nuestro primer tacto de próstata”, con Yordi Rosado. Video original (minuto 25:40): https://youtu.be/jUfBJ_aIA3w?t=1540

#LaCotorrisa #YordiRosado #Humor #Prostata
```

**Etiquetas:** La Cotorrisa, Yordi Rosado, Ricardo Pérez, Slobotzky, tacto de próstata, anécdotas, humor, comedia


## 12. `2026-11-12-cotorrisa-harvard`

- **Gancho:** Por qué hay gente que te baja los sueños
- **Puntaje:** 70 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-17 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-12-cotorrisa-harvard/clip.mp4) (61,5 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-12-cotorrisa-harvard/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=jUfBJ_aIA3w
- **Revisar antes de publicar:** La frase de «la fila del salón» lleva una palabra censurada en la ficha: los textos no la citan («te baja de la nube»).

### TikTok · cuenta `risas` (@legion.risas) · en la bandeja desde 2026-11-14 19:37 (borrador)

```
“Quiero estudiar en Harvard”… y la gente que te baja los sueños. Yordi Rosado lo explica

¿Alguien te bajó un sueño alguna vez?

Crédito: La Cotorrisa (canal de Ricardo Pérez en YouTube), “Anecdotario 377 - Nuestro primer tacto de próstata”, con Yordi Rosado. Video original (minuto 1:09:51): https://youtu.be/jUfBJ_aIA3w?t=4191

#LaCotorrisa #YordiRosado #Motivacion #Anecdotario #Humor
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
Yordi Rosado: por qué hay gente que te baja los sueños

Dices “quiero estudiar en Harvard” y alguien te baja de la nube. Yordi Rosado explica por qué lo hacen: para no quedarse solos abajo… y porque saben que sí puedes.

¿Alguien te bajó un sueño alguna vez?

Crédito: La Cotorrisa (canal de Ricardo Pérez en YouTube), “Anecdotario 377 - Nuestro primer tacto de próstata”, con Yordi Rosado. Video original (minuto 1:09:51): https://youtu.be/jUfBJ_aIA3w?t=4191

#LaCotorrisa #YordiRosado #Motivacion #Anecdotario #Humor
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** Yordi Rosado: las dos razones por las que alguien te baja los sueños

```
Dices “quiero estudiar en Harvard” y alguien te baja de la nube. Yordi Rosado explica por qué lo hacen: para no quedarse solos abajo… y porque saben que sí puedes.

Crédito: La Cotorrisa (canal de Ricardo Pérez en YouTube), “Anecdotario 377 - Nuestro primer tacto de próstata”, con Yordi Rosado. Video original (minuto 1:09:51): https://youtu.be/jUfBJ_aIA3w?t=4191

#LaCotorrisa #YordiRosado #Motivacion #Humor
```

**Etiquetas:** Yordi Rosado, La Cotorrisa, Ricardo Pérez, Slobotzky, motivación, sueños, consejos, humor


## 13. `2026-11-12-culpa-ivan-piscina`

- **Gancho:** El consejo que casi ahoga a Iván Marín
- **Puntaje:** 70 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-17 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-12-culpa-ivan-piscina/clip.mp4) (21,8 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-12-culpa-ivan-piscina/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=3BAphhKqHUw
- **Revisar antes de publicar:** Anécdota de infancia del propio Iván Marín. La ficha pide separarlo del otro clip de Iván (culpa-ivan-senorazo, en la bandeja desde el 10-nov).

### TikTok · cuenta `risas` (@legion.risas) · en la bandeja desde 2026-11-15 18:21 (borrador)

```
“Si crees que puedes, puedes”… Iván Marín se lo creyó en una piscina 😂

¿Qué consejo te salió peor?

Crédito: Los De La Culpa (YouTube), “Errores Memorables | Los De La Culpa - Capítulo 268”. Video original (minuto 37:48): https://youtu.be/3BAphhKqHUw?t=2268

#IvanMarin #LosDeLaCulpa #ComediaColombiana #Humor
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
El consejo que casi ahoga a Iván Marín 😅

“Si crees que puedes, puedes”. Iván Marín se lo creyó de niño, se tiró a una piscina sin saber nadar… y casi se ahoga.

¿Qué consejo te salió peor?

Crédito: Los De La Culpa (YouTube), “Errores Memorables | Los De La Culpa - Capítulo 268”. Video original (minuto 37:48): https://youtu.be/3BAphhKqHUw?t=2268

#IvanMarin #LosDeLaCulpa #ComediaColombiana #Humor
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** Iván Marín y el peor consejo que siguió de niño

```
“Si crees que puedes, puedes”. Iván Marín se lo creyó de niño, se tiró a una piscina sin saber nadar… y casi se ahoga.

Crédito: Los De La Culpa (YouTube), “Errores Memorables | Los De La Culpa - Capítulo 268”. Video original (minuto 37:48): https://youtu.be/3BAphhKqHUw?t=2268

#IvanMarin #LosDeLaCulpa #ComediaColombiana #Humor
```

**Etiquetas:** Iván Marín, Los De La Culpa, comedia colombiana, stand up, consejos, piscina, humor


## 14. `2026-11-13-parenlamano-papa-a-dormir`

- **Gancho:** Así imaginan al Papa cuando ya quiere dormir
- **Puntaje:** 70 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-17 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-13-parenlamano-papa-a-dormir/clip.mp4) (44,5 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-13-parenlamano-papa-a-dormir/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=K4MCv-DXdmI
- **Revisar antes de publicar:** Ficha: desde el segundo 10 los conductores le ponen voz a un video del Papa. Si parece que el Papa dice «no me rompan más la pelota», descártalo. Los textos dicen que es una imitación con la voz de los conductores.

### TikTok · cuenta `risas` (@legion.risas) · en la bandeja desde hoy, 16:58 (borrador)

```
Así imaginan al Papa cuando ya se quiere ir a dormir: “¿Algún temita más?”

Imitación de los conductores de Paren la Mano: la voz es de ellos, no del Papa.

¿Tú también haces el gesto de “me voy a dormir”?

Crédito: Paren la Mano (Vorterix), “EL DÍA QUE LUQUITAS HABLÓ CON EL PAPA...”. Video original (minuto 25:48): https://youtu.be/K4MCv-DXdmI?t=1548

#ParenLaMano #Vorterix #PapaLeonXIV #Humor #Argentina
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
Así imaginan al Papa a la hora de dormir (imitación)

Cuentan en Paren la Mano que León XIV, después de salir a bendecir a la gente, hizo el gesto de que se iba a dormir, como antes Juan Pablo II y Francisco. Los conductores imaginan, con su propia voz, cómo sería ese final de jornada: “¿Algún temita más?”. Es una imitación: no son palabras del Papa.

¿Tú también haces el gesto de “me voy a dormir”?

Crédito: Paren la Mano (Vorterix), “EL DÍA QUE LUQUITAS HABLÓ CON EL PAPA...”. Video original (minuto 25:48): https://youtu.be/K4MCv-DXdmI?t=1548

#ParenLaMano #Vorterix #PapaLeonXIV #Humor #Argentina
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** El Papa ya se quiere ir a dormir (imitación) | Paren la Mano

```
Los conductores de Paren la Mano imaginan, con su propia voz, cómo sería el final de jornada del Papa León XIV cuando hace el gesto de que se va a dormir. Es una imitación: no son palabras del Papa.

Crédito: Paren la Mano (Vorterix), “EL DÍA QUE LUQUITAS HABLÓ CON EL PAPA...”. Video original (minuto 25:48): https://youtu.be/K4MCv-DXdmI?t=1548

#ParenLaMano #Vorterix #PapaLeonXIV #Humor
```

**Etiquetas:** Paren la Mano, Vorterix, Papa León XIV, imitación, humor argentino, streaming argentino, Papa, humor


## 15. `2026-11-15-parenlamano-luquitas-turista`

- **Gancho:** Le habló al Papa y viajó en turista
- **Puntaje:** 70 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-17 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-15-parenlamano-luquitas-turista/clip.mp4) (61,2 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-15-parenlamano-luquitas-turista/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=uRZ2xc4sRyA
- **Revisar antes de publicar:** Charla cruzada con acento argentino; subtítulos flojos en algunos tramos. Va antes que parenlamano-luquitas-zapatilla (ficha) y conviene separarlo de los otros clips del Papa (parenlamano-papa-a-dormir y cotorrisa-papa-cadenero).

### TikTok · cuenta `risas` (@legion.risas) · en la bandeja desde hoy, 16:58 (borrador)

```
Le habló al Papa… y el discurso lo escribió en clase turista 😂

En Paren la Mano ven la foto de Luquitas escribiendo en el avión y no lo perdonan: “No sé qué me parece más pobre, si que está escribiendo o que viaja en turista”.

¿Turista o primera clase para ver al Papa?

Crédito: Paren la Mano (Vorterix), “SUPERJUEVES DE MARIO: NVIDIA, QUILOMBOS Y MÁS | #ParenLaMano Completo - 12/11”. Video original (minuto 7:02): https://youtu.be/uRZ2xc4sRyA?t=422

#ParenLaMano #Vorterix #Luquitas #PapaLeonXIV #Humor
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
El discurso para el Papa se escribió en clase turista ✈️😂

Luquitas Rodríguez escribió en un cuaderno, en pleno vuelo, el discurso que le dio al papa León XIV. Al día siguiente, en Paren la Mano, el panel ve la foto y se burla: “No sé qué me parece más pobre, si que está escribiendo o que viaja en turista”.

¿Turista o primera clase para ver al Papa?

Crédito: Paren la Mano (Vorterix), “SUPERJUEVES DE MARIO: NVIDIA, QUILOMBOS Y MÁS | #ParenLaMano Completo - 12/11”. Video original (minuto 7:02): https://youtu.be/uRZ2xc4sRyA?t=422

#ParenLaMano #Vorterix #Luquitas #PapaLeonXIV #Humor
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** Luquitas escribió su discurso para el Papa en clase turista | Paren la Mano

```
Luquitas Rodríguez escribió en un cuaderno, en pleno vuelo, el discurso que le dio al papa León XIV. Al día siguiente, en Paren la Mano, el panel ve la foto y no lo perdona.

Crédito: Paren la Mano (Vorterix), “SUPERJUEVES DE MARIO: NVIDIA, QUILOMBOS Y MÁS | #ParenLaMano Completo - 12/11”. Video original (minuto 7:02): https://youtu.be/uRZ2xc4sRyA?t=422

#ParenLaMano #Vorterix #PapaLeonXIV #Humor
```

**Etiquetas:** Paren la Mano, Vorterix, Luquitas Rodríguez, Papa León XIV, humor argentino, streaming argentino, clase turista, humor


## 16. `2026-11-15-parenlamano-luquitas-zapatilla`

- **Gancho:** Mientras Luquitas hablaba con el Papa…
- **Puntaje:** 69 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-17 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-15-parenlamano-luquitas-zapatilla/clip.mp4) (63,6 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-15-parenlamano-luquitas-zapatilla/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=uRZ2xc4sRyA
- **Revisar antes de publicar:** El que habla (gorra blanca) no se nombra en el tramo: no lo nombres al publicar. «Estaban hablando de los pobres» es una broma entre amigos sobre él, no sobre el discurso. Subtítulos flojos; tres palabras como (…). Publícalo después de parenlamano-luquitas-turista (ficha).

### TikTok · cuenta `risas` (@legion.risas) · en la bandeja desde hoy, 16:58 (borrador)

```
Uno hablando con el Papa y el otro arreglando una zapatilla 😂

En Paren la Mano cuentan dónde vio uno del panel el discurso de Luquitas: en su casa, arreglando una zapatilla. “Mirá el contraste”.

¿Dónde estabas tú cuando tu amigo hablaba con el Papa?

Crédito: Paren la Mano (Vorterix), “SUPERJUEVES DE MARIO: NVIDIA, QUILOMBOS Y MÁS | #ParenLaMano Completo - 12/11”. Video original (minuto 2:30): https://youtu.be/uRZ2xc4sRyA?t=150

#ParenLaMano #Vorterix #Luquitas #PapaLeonXIV #Humor
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
“Mirá el contraste”: los polos opuestos de la dupla 😂

El día después del discurso de Luquitas Rodríguez ante el papa León XIV, uno del panel de Paren la Mano cuenta que lo vio desde su casa… arreglando una zapatilla. La respuesta del panel: “Estaban hablando de los pobres… hablaban de vos”.

¿Dónde estabas tú cuando tu amigo hablaba con el Papa?

Crédito: Paren la Mano (Vorterix), “SUPERJUEVES DE MARIO: NVIDIA, QUILOMBOS Y MÁS | #ParenLaMano Completo - 12/11”. Video original (minuto 2:30): https://youtu.be/uRZ2xc4sRyA?t=150

#ParenLaMano #Vorterix #Luquitas #PapaLeonXIV #Humor
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** Lo que hacía su amigo mientras Luquitas hablaba con el Papa | Paren la Mano

```
El día después del discurso de Luquitas Rodríguez ante el papa León XIV, en Paren la Mano cuentan dónde lo vio uno del panel: en su casa, arreglando una zapatilla. “Mirá el contraste.”

Crédito: Paren la Mano (Vorterix), “SUPERJUEVES DE MARIO: NVIDIA, QUILOMBOS Y MÁS | #ParenLaMano Completo - 12/11”. Video original (minuto 2:30): https://youtu.be/uRZ2xc4sRyA?t=150

#ParenLaMano #Vorterix #PapaLeonXIV #Humor
```

**Etiquetas:** Paren la Mano, Vorterix, Luquitas Rodríguez, Papa León XIV, humor argentino, streaming argentino, humor


## 17. `2026-11-17-samulx-retiro-boxeo`

- **Gancho:** Samulx: «creo que me voy a retirar»
- **Puntaje:** 78 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-18 · **Línea:** urbano · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-samulx-retiro-boxeo/clip.mp4) (30,1 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-samulx-retiro-boxeo/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=GkojR4E0tuY
- **Revisar antes de publicar:** Dice «creo que»: los textos no dan el retiro por hecho. En un directo posterior matiza la decisión (recorte de La Ganga Clips TV «NO PELEO MÁS NUNCA… salvo por 300 MIL DÓLARES»).

### TikTok · cuenta `principal` (Legión Urbana) · en la bandeja desde hoy, 16:58 (borrador)

```
Samulx: “creo que me voy a retirar del boxeo” 🥊💔

Al día siguiente de Stream Fighters 5, con el brazo en cabestrillo: “Hice lo que pude. Mi hombro no me da”.

¿Debería volver a pelear?

Crédito: Samulx, “ESTO PASÓ EN LOS CAMERINOS CON HERRERA DESPUES DE STREAM FIGTHERS 5 😯 ME JODÍ EL HOMBRO*”. Video original (minuto 16:10): https://youtu.be/GkojR4E0tuY?t=970

#Samulx #StreamFighters5 #Westcol #LaGanga #Boxeo
```

### Instagram · cuenta `principal` · pendiente de aprobación

```
“Mi hombro no me da”: Samulx tras Stream Fighters 5 🥊

Al día siguiente de la pelea, con el brazo en cabestrillo, Samulx da “una mala noticia”: “creo que me voy a retirar del boxeo… hice lo que pude”. Y cierra en broma con Westcol: “ese tipo se rompe el hombro y después voy yo a romperme también el hombro”.

¿Debería volver a pelear?

Crédito: Samulx, “ESTO PASÓ EN LOS CAMERINOS CON HERRERA DESPUES DE STREAM FIGTHERS 5 😯 ME JODÍ EL HOMBRO*”. Video original (minuto 16:10): https://youtu.be/GkojR4E0tuY?t=970

#Samulx #StreamFighters5 #Westcol #LaGanga #Boxeo
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** Samulx habla de retirarse del boxeo tras lesionarse el hombro

```
Al día siguiente de Stream Fighters 5, con el hombro lesionado, Samulx da “una mala noticia”: “creo que me voy a retirar del boxeo… hice lo que pude, mi hombro no me da”.

Crédito: Samulx, “ESTO PASÓ EN LOS CAMERINOS CON HERRERA DESPUES DE STREAM FIGTHERS 5 😯 ME JODÍ EL HOMBRO*”. Video original (minuto 16:10): https://youtu.be/GkojR4E0tuY?t=970

#Samulx #StreamFighters5 #Boxeo
```

**Etiquetas:** Samulx, Stream Fighters 5, retiro, boxeo, lesión de hombro, Westcol, La Ganga, streamers


## 18. `2026-11-17-westcol-herrera-no-planeado`

- **Gancho:** ¿Fue planeado lo de Herrera? Westcol responde
- **Puntaje:** 78 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-18 · **Línea:** urbano · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-westcol-herrera-no-planeado/clip.mp4) (51,6 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-westcol-herrera-no-planeado/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=YQ-vOO3-Ghk
- **Revisar antes de publicar:** Si la polémica de Herrera pasa a lo judicial antes de publicar, no se publica (ficha). Este tramo no toca lo legal y los textos no añaden nada sobre Herrera. Publicarlo separado de westcol-disculpa-pelea-jh.

### TikTok · cuenta `principal` (Legión Urbana) · no se sabe si llegó: TikTok dio HTTP 500 sin identificador (hoy, 16:57; 1 de 2 intentos; mira la bandeja)

```
¿Lo de Herrera fue planeado? Westcol da su palabra 🥊

“Les doy mi palabra al 100 % que esto no está planeado”: la pelea estaba anunciada en la cartelera y “estamos jugando sí o sí con el dinero de la gente”. Y le agradece a La Piquiña por subir al ring.

¿Le crees a Westcol?

Crédito: WestCOL, “¿Que pasara con HERRERA por bajar de la pelea en STREAM FIGHTERS 5?| Westcol”. Video original (minuto 20:00): https://youtu.be/YQ-vOO3-Ghk?t=1200

#Westcol #StreamFighters5 #Herrera #Piquiña #Boxeo
```

### Instagram · cuenta `principal` · pendiente de aprobación

```
“Esa pelea se tenía que haber dado”: Westcol responde si lo de Herrera fue planeado 🥊

Tras Stream Fighters 5, Westcol da su palabra de que no estaba planeado: la pelea estaba anunciada en la cartelera y “estamos jugando sí o sí con el dinero de la gente”. Y le agradece a La Piquiña, que subió al ring: “aprovechó el momento y lo aprovechó muy bien”.

¿Le crees a Westcol?

Crédito: WestCOL, “¿Que pasara con HERRERA por bajar de la pelea en STREAM FIGHTERS 5?| Westcol”. Video original (minuto 20:00): https://youtu.be/YQ-vOO3-Ghk?t=1200

#Westcol #StreamFighters5 #Herrera #Piquiña #LaGanga
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** Westcol responde si lo de Herrera en Stream Fighters 5 fue planeado

```
Tras Stream Fighters 5, Westcol responde a quienes dicen que lo de Herrera estaba planeado: “les doy mi palabra al 100 % que esto no está planeado”. Y agradece a La Piquiña por subir al ring.

Crédito: WestCOL, “¿Que pasara con HERRERA por bajar de la pelea en STREAM FIGHTERS 5?| Westcol”. Video original (minuto 20:00): https://youtu.be/YQ-vOO3-Ghk?t=1200

#Westcol #StreamFighters5 #Herrera #Piquiña
```

**Etiquetas:** Westcol, Stream Fighters 5, Herrera, La Piquiña, JH de la Cruz, boxeo, streamers, La Ganga


## 19. `2026-11-17-samulx-dime-que-no-puedes`

- **Gancho:** Se le salió el hombro y su entrenador…
- **Puntaje:** 77 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-18 · **Línea:** urbano · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-samulx-dime-que-no-puedes/clip.mp4) (54,1 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-samulx-dime-que-no-puedes/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=GkojR4E0tuY
- **Revisar antes de publicar:** La lesión se cuenta con palabras, sin imágenes del golpe. Una palabra como (…).

### TikTok · cuenta `principal` (Legión Urbana) · en la bandeja desde hoy, 16:58 (borrador)

```
“Mírame a los ojos y dime que no puedes”: lo que le dijo el entrenador a Samulx 🥊

Se le salió el hombro peleando contra Lonche y quiso parar… hasta que escuchó eso.

¿Tú habrías seguido?

Crédito: Samulx, “ESTO PASÓ EN LOS CAMERINOS CON HERRERA DESPUES DE STREAM FIGTHERS 5 😯 ME JODÍ EL HOMBRO*”. Video original (minuto 3:34): https://youtu.be/GkojR4E0tuY?t=214

#Samulx #StreamFighters5 #Lonche #TheChanty #Boxeo
```

### Instagram · cuenta `principal` · pendiente de aprobación

```
Se le salió el hombro en plena pelea… y siguió 🥊

Samulx cuenta el momento de Stream Fighters 5 en que, peleando con Lonche, sintió que se le iba el hombro. Le dijo al entrenador “no puedo, me duele mucho” y la respuesta fue: “Mírame a los ojos y dime que no puedes”. “Y yo: sí puedo, sí puedo”.

¿Tú habrías seguido?

Crédito: Samulx, “ESTO PASÓ EN LOS CAMERINOS CON HERRERA DESPUES DE STREAM FIGTHERS 5 😯 ME JODÍ EL HOMBRO*”. Video original (minuto 3:34): https://youtu.be/GkojR4E0tuY?t=214

#Samulx #StreamFighters5 #Lonche #TheChanty #Boxeo
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** Samulx cuenta cómo siguió peleando con el hombro salido

```
Samulx cuenta el momento en que se le salió el hombro peleando con Lonche en Stream Fighters 5: quiso parar, pero su entrenador le dijo “mírame a los ojos y dime que no puedes”.

Crédito: Samulx, “ESTO PASÓ EN LOS CAMERINOS CON HERRERA DESPUES DE STREAM FIGTHERS 5 😯 ME JODÍ EL HOMBRO*”. Video original (minuto 3:34): https://youtu.be/GkojR4E0tuY?t=214

#Samulx #StreamFighters5 #Lonche #Boxeo
```

**Etiquetas:** Samulx, Stream Fighters 5, Lonche, The Chanty, Willito, lesión de hombro, boxeo, streamers


## 20. `2026-11-17-westcol-disculpa-pelea-jh`

- **Gancho:** Westcol pide perdón por la pelea de JH
- **Puntaje:** 77 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-18 · **Línea:** urbano · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-westcol-disculpa-pelea-jh/clip.mp4) (61,6 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-westcol-disculpa-pelea-jh/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=YQ-vOO3-Ghk
- **Revisar antes de publicar:** Lenguaje fuerte y un pitido de la fuente como ***. Si la polémica de Herrera pasa a lo judicial, no se publica. Publicarlo separado de westcol-herrera-no-planeado (ficha).

### TikTok · cuenta `principal` (Legión Urbana) · en la bandeja desde hoy, 16:59 (borrador)

```
Westcol pide perdón por la pelea de JH en Stream Fighters 5 🙏🥊

“Yo fui el que organicé la pelea” y “me hago 100 % responsable”. Dice que en JH confiaba y que del rival creyó que iba a aprovechar la oportunidad.

¿Fue culpa de Westcol?

Crédito: WestCOL, “¿Que pasara con HERRERA por bajar de la pelea en STREAM FIGHTERS 5?| Westcol”. Video original (minuto 17:42): https://youtu.be/YQ-vOO3-Ghk?t=1062

#Westcol #StreamFighters5 #JHdelaCruz #Herrera #Boxeo
```

### Instagram · cuenta `principal` · pendiente de aprobación

```
“Yo les pido una disculpa”: Westcol sobre la pelea de JH de la Cruz 🥊

Tras Stream Fighters 5, Westcol se hace “100 % responsable”: “yo fui el que organicé la pelea”. De JH dice que “siempre responde y va y hace su trabajo”; del rival, que no sabían cómo iba a reaccionar y creyó que iba a aprovechar la oportunidad.

¿Fue culpa de Westcol?

Crédito: WestCOL, “¿Que pasara con HERRERA por bajar de la pelea en STREAM FIGHTERS 5?| Westcol”. Video original (minuto 17:42): https://youtu.be/YQ-vOO3-Ghk?t=1062

#Westcol #StreamFighters5 #JHdelaCruz #Herrera #LaGanga
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** Westcol se disculpa por la pelea de JH de la Cruz | Stream Fighters 5

```
Tras Stream Fighters 5, Westcol pide disculpas por la pelea de JH de la Cruz: “yo fui el que organicé la pelea” y “me hago 100 % responsable”. Cuenta que en JH confiaba y que del rival creyó que iba a aprovechar la oportunidad.

Crédito: WestCOL, “¿Que pasara con HERRERA por bajar de la pelea en STREAM FIGHTERS 5?| Westcol”. Video original (minuto 17:42): https://youtu.be/YQ-vOO3-Ghk?t=1062

#Westcol #StreamFighters5 #JHdelaCruz #Herrera
```

**Etiquetas:** Westcol, JH de la Cruz, Stream Fighters 5, Herrera, disculpa, boxeo, streamers, La Ganga


## 21. `2026-11-17-samulx-cuarto-round`

- **Gancho:** Le dijeron que eran tres rounds…
- **Puntaje:** 76 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-18 · **Línea:** urbano · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-samulx-cuarto-round/clip.mp4) (41,1 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-samulx-cuarto-round/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=GkojR4E0tuY
- **Revisar antes de publicar:** Nada especial; lenguaje coloquial.

### TikTok · cuenta `principal` (Legión Urbana) · en la bandeja desde hoy, 16:59 (borrador)

```
Le dijeron que eran 3 rounds… y llegó el cuarto 😂🥊

Samulx ya iba a levantar los brazos “como si fueses un ganador” cuando el árbitro anunció otro round. “Chanty, no puedo, bro”.

¿Tú habrías entrado?

Crédito: Samulx, “ESTO PASÓ EN LOS CAMERINOS CON HERRERA DESPUES DE STREAM FIGTHERS 5 😯 ME JODÍ EL HOMBRO*”. Video original (minuto 6:25): https://youtu.be/GkojR4E0tuY?t=385

#Samulx #TheChanty #StreamFighters5 #Boxeo
```

### Instagram · cuenta `principal` · pendiente de aprobación

```
Le dijeron que eran tres rounds… y llegó el cuarto 😂

Samulx cuenta el final de su pelea por parejas con The Chanty en Stream Fighters 5: los entrenadores le dijeron que al acabar el tercer round levantara los brazos “como si fueses un ganador”… y el árbitro anunció un cuarto. A los 10 segundos, Chanty ya le pedía que entrara.

¿Tú habrías entrado?

Crédito: Samulx, “ESTO PASÓ EN LOS CAMERINOS CON HERRERA DESPUES DE STREAM FIGTHERS 5 😯 ME JODÍ EL HOMBRO*”. Video original (minuto 6:25): https://youtu.be/GkojR4E0tuY?t=385

#Samulx #TheChanty #StreamFighters5 #Boxeo
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** Samulx no sabía que había un cuarto round | Stream Fighters 5

```
Samulx cuenta el final de su pelea por parejas con The Chanty en Stream Fighters 5: estaba listo para levantar los brazos al final del tercer round… y el árbitro anunció un cuarto.

Crédito: Samulx, “ESTO PASÓ EN LOS CAMERINOS CON HERRERA DESPUES DE STREAM FIGTHERS 5 😯 ME JODÍ EL HOMBRO*”. Video original (minuto 6:25): https://youtu.be/GkojR4E0tuY?t=385

#Samulx #TheChanty #StreamFighters5
```

**Etiquetas:** Samulx, The Chanty, Stream Fighters 5, cuarto round, pelea por parejas, boxeo, streamers, humor


## 22. `2026-11-17-samulx-camerino-herrera`

- **Gancho:** Lo que pasó en los camerinos con Herrera
- **Puntaje:** 75 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-18 · **Línea:** urbano · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-samulx-camerino-herrera/clip.mp4) (54,6 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-samulx-camerino-herrera/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=GkojR4E0tuY
- **Revisar antes de publicar:** Herrera no sale; solo lo nombra Samulx («ni siquiera hay que mencionar ese tipo»: desprecio, sin acusación). El corte deja fuera el insulto, la violencia y la acusación de esteroides; al publicar no añadas nada sobre Herrera. Si la polémica pasa a lo judicial, no se publica.

### TikTok · cuenta `principal` (Legión Urbana) · aprobado automáticamente; en cola (previsto 18-nov)

```
Samulx iba a encarar a Herrera en los camerinos… hasta que lo vio 😂

“Había más acción fuera del ring que adentro”. Y entonces lo vio entrar “con los músculos de Hércules”.

¿Tú qué habrías hecho?

Crédito: Samulx, “ESTO PASÓ EN LOS CAMERINOS CON HERRERA DESPUES DE STREAM FIGTHERS 5 😯 ME JODÍ EL HOMBRO*”. Video original (minuto 18:47): https://youtu.be/GkojR4E0tuY?t=1127

#Samulx #StreamFighters5 #Herrera #LaGanga
```

### Instagram · cuenta `principal` · pendiente de aprobación

```
“Había más acción fuera del ring que adentro”: Samulx sobre los camerinos 😂

Samulx cuenta lo que no se vio en Stream Fighters 5: en los camerinos “todo el mundo se quería caer a golpes”. Iba decidido a encarar a Herrera… hasta que lo vio entrar “con los músculos de Hércules”.

¿Tú qué habrías hecho?

Crédito: Samulx, “ESTO PASÓ EN LOS CAMERINOS CON HERRERA DESPUES DE STREAM FIGTHERS 5 😯 ME JODÍ EL HOMBRO*”. Video original (minuto 18:47): https://youtu.be/GkojR4E0tuY?t=1127

#Samulx #StreamFighters5 #Herrera #LaGanga
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** Lo que pasó en los camerinos de Stream Fighters 5, según Samulx

```
Samulx cuenta lo que no se vio en los camerinos de Stream Fighters 5: “había más acción fuera del ring que adentro”. Iba decidido a encarar a Herrera… hasta que lo vio entrar.

Crédito: Samulx, “ESTO PASÓ EN LOS CAMERINOS CON HERRERA DESPUES DE STREAM FIGTHERS 5 😯 ME JODÍ EL HOMBRO*”. Video original (minuto 18:47): https://youtu.be/GkojR4E0tuY?t=1127

#Samulx #StreamFighters5 #Herrera
```

**Etiquetas:** Samulx, Stream Fighters 5, Herrera, camerinos, La Ganga, Westcol, streamers, humor


## 23. `2026-11-15-nsn-telefono-infancia`

- **Gancho:** Llamó al teléfono de su infancia… y contestaron
- **Puntaje:** 74 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-18 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-15-nsn-telefono-infancia/clip.mp4) (54,6 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-15-nsn-telefono-infancia/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=pSyuyPq7uh0
- **Revisar antes de publicar:** El número no se dice. La señora no se identifica (solo se oye «Digui»): al publicar no añadas datos sobre ella. Pitidos de la fuente como ***.

### TikTok · cuenta `risas` (@legion.risas) · aprobado automáticamente; en cola (previsto 18-nov)

```
Llamó en directo al teléfono de la casa de su infancia… y contestaron 😳

Andreu Buenafuente marca el número de su familia en Reus y contesta una señora: “no estaba preparado para esto”.

¿Todavía te sabes el teléfono de tu casa?

Crédito: Nadie Sabe Nada, de Andreu Buenafuente y Berto Romero (El Terrat), “NADIE SABE NADA 14x11 | Los Claus y los elfos promiscuos”. Video original (minuto 7:04): https://youtu.be/pSyuyPq7uh0?t=424

#NadieSabeNada #Buenafuente #BertoRomero #Humor
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
Llamó al teléfono de su casa de la infancia… y contestó alguien 😳

En Nadie Sabe Nada hablan de cuando nos sabíamos los teléfonos de memoria y Andreu Buenafuente marca en directo el número de la casa de su familia en Reus. Contesta una señora. Berto lo tiene claro: “a lo mejor de ahí nace una amistad, o el amor”.

¿Todavía te sabes el teléfono de tu casa?

Crédito: Nadie Sabe Nada, de Andreu Buenafuente y Berto Romero (El Terrat), “NADIE SABE NADA 14x11 | Los Claus y los elfos promiscuos”. Video original (minuto 7:04): https://youtu.be/pSyuyPq7uh0?t=424

#NadieSabeNada #Buenafuente #BertoRomero #Humor
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** Buenafuente llama en directo al teléfono de su casa de la infancia

```
En Nadie Sabe Nada hablan de cuando nos sabíamos los teléfonos de memoria. Andreu Buenafuente marca en directo el número de la casa de su familia en Reus… y contesta una señora.

Crédito: Nadie Sabe Nada, de Andreu Buenafuente y Berto Romero (El Terrat), “NADIE SABE NADA 14x11 | Los Claus y los elfos promiscuos”. Video original (minuto 7:04): https://youtu.be/pSyuyPq7uh0?t=424

#NadieSabeNada #Buenafuente #BertoRomero
```

**Etiquetas:** Nadie Sabe Nada, Andreu Buenafuente, Berto Romero, El Terrat, teléfono, Reus, humor, podcast


## 24. `2026-11-15-tirandobola-perra-amigo`

- **Gancho:** Cuando Franco no te insulta, preocúpate
- **Puntaje:** 74 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-18 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-15-tirandobola-perra-amigo/clip.mp4) (39,3 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-15-tirandobola-perra-amigo/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=niP1DkpCYvs
- **Revisar antes de publicar:** Lenguaje fuerte entre amigos («perra», «zorra») y pitidos de la fuente como ***. «Se quiere despedir» es una broma sobre el mensaje: nadie está enfermo.

### TikTok · cuenta `risas` (@legion.risas) · en la bandeja desde hoy, 16:59 (borrador)

```
Cuando tu amigo de siempre te escribe “amigo”… algo pasó 😂

Marco Polo cuenta la vez que Franco Escamilla le contestó más rápido un mensaje. La explicación de Franco: “yo pensé que se iba a morir el señor… se quiere despedir”.

Etiqueta al amigo que te preocupa cuando es amable

Crédito: Tirando Bola, de Franco Escamilla (canal de Franco Escamilla en YouTube), “Marco Polo | Tirando Bola | T9E21”. Video original (minuto 25:43): https://youtu.be/niP1DkpCYvs?t=1543

#FrancoEscamilla #TirandoBola #MarcoPolo #Comedia
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
“¿Y ahora por qué no me dijiste perra?” 😂

En Tirando Bola, Marco Polo cuenta la vez que Franco Escamilla le contestó más rápido un mensaje: cuando le escribió “amigo” en lugar del insulto de siempre. Franco lo explica: si alguien siempre te dice de todo y un día te pone “Oye, amigo”, “yo pensé que se iba a morir el señor”.

Etiqueta al amigo que te preocupa cuando es amable

Crédito: Tirando Bola, de Franco Escamilla (canal de Franco Escamilla en YouTube), “Marco Polo | Tirando Bola | T9E21”. Video original (minuto 25:43): https://youtu.be/niP1DkpCYvs?t=1543

#FrancoEscamilla #TirandoBola #MarcoPolo #Comedia
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** Franco Escamilla explica por qué se asustó con un “amigo” | Tirando Bola

```
En Tirando Bola, Marco Polo cuenta la vez que Franco Escamilla le contestó más rápido un mensaje: cuando le escribió “amigo” en lugar del insulto de siempre.

Crédito: Tirando Bola, de Franco Escamilla (canal de Franco Escamilla en YouTube), “Marco Polo | Tirando Bola | T9E21”. Video original (minuto 25:43): https://youtu.be/niP1DkpCYvs?t=1543

#FrancoEscamilla #TirandoBola #Comedia
```

**Etiquetas:** Franco Escamilla, Tirando Bola, Marco Polo, comedia, comedia mexicana, amistad, billar, humor


## 25. `2026-11-17-lonche-cinco-lesiones`

- **Gancho:** Lonche peleó la primera vez con cinco lesiones
- **Puntaje:** 74 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-18 · **Línea:** urbano · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-lonche-cinco-lesiones/clip.mp4) (38,4 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-lonche-cinco-lesiones/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=s1betCsTVVE
- **Revisar antes de publicar:** Habla de su primera pelea, no de la de Stream Fighters 5: los textos lo dicen así. Una broma de otro queda como (…).

### TikTok · cuenta `principal` (Legión Urbana) · aprobado automáticamente; en cola (previsto 18-nov)

```
Lonche confiesa que hizo su primera pelea con 5 lesiones 😳🥊

Los dos bíceps desgarrados, el pie quebrado una semana antes y la muñeca fisurada. Y le dijeron: “no digas nada, tienes que pelear así”.

¿Tú habrías peleado así?

Crédito: LoncheWey, “HABLANDO de MI PELEA en COLOMBIA con LA GANGA | LONCHE”. Video original (minuto 1:21): https://youtu.be/s1betCsTVVE?t=81

#Lonche #Westcol #StreamFighters5 #LaGanga #Boxeo
```

### Instagram · cuenta `principal` · pendiente de aprobación

```
“No digas nada, tienes que pelear así”: Lonche y las 5 lesiones de su primera pelea 🥊

En el set de Westcol, con La Ganga, Lonche revela que en su primera pelea tenía los dos bíceps desgarrados, el pie quebrado y la muñeca fisurada: al pegarle al costal “era como si me clavaran cuchillos”. Esta vez llegó sin lesiones: “me sentía como un hombre nuevo”.

¿Tú habrías peleado así?

Crédito: LoncheWey, “HABLANDO de MI PELEA en COLOMBIA con LA GANGA | LONCHE”. Video original (minuto 1:21): https://youtu.be/s1betCsTVVE?t=81

#Lonche #Westcol #StreamFighters5 #LaGanga #Boxeo
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** Lonche revela las lesiones con las que hizo su primera pelea

```
Tras Stream Fighters 5, en el set de Westcol, Lonche cuenta que en su primera pelea tenía cinco lesiones: los dos bíceps desgarrados, el pie quebrado y la muñeca fisurada. Esta vez llegó sin lesiones.

Crédito: LoncheWey, “HABLANDO de MI PELEA en COLOMBIA con LA GANGA | LONCHE”. Video original (minuto 1:21): https://youtu.be/s1betCsTVVE?t=81

#Lonche #Westcol #StreamFighters5 #Boxeo
```

**Etiquetas:** Lonche, LoncheWey, Westcol, Stream Fighters 5, La Ganga, lesiones, boxeo, streamers


## 26. `2026-11-13-jhovanoty-faja-disfraz`

- **Gancho:** Su disfraz de De la Espriella pedía faja
- **Puntaje:** 73 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-18 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-13-jhovanoty-faja-disfraz/clip.mp4) (72,4 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-13-jhovanoty-faja-disfraz/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=lEDdtE48rBk
- **Revisar antes de publicar:** Humor político (legion/04-cazador-risas/enfoque.md): es el humorista contando su disfraz de Halloween de Abelardo de la Espriella (derecha); De la Espriella no sale. Los textos dicen que es un disfraz, no le dan cargo, no citan «bienvenido a la patria» (frase final que puede leerse como consigna) y no se burlan del político: el chiste es la faja del humorista.

### TikTok · cuenta `risas` (@legion.risas) · aprobado automáticamente; en cola (previsto 18-nov)

```
Jhovanoty se disfrazó de Abelardo de la Espriella para Halloween y, para que el traje cerrara, terminó en body de encaje

Es un disfraz que el humorista cuenta en su show: De la Espriella no sale en el video.

¿Cuál ha sido tu disfraz más incómodo?

Crédito: Jhovanoty, “Me disfracé de Abelardo de La Espriella... ¡Y Qué problema! - Puro Show de Jhovanoty”. Video original (minuto 11:23): https://youtu.be/lEDdtE48rBk?t=683

#Jhovanoty #PuroShow #HumorColombiano #Halloween #StandUp
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
Jhovanoty y la faja de su disfraz de Abelardo de la Espriella

Para Halloween, el humorista Jhovanoty se disfrazó de Abelardo de la Espriella. Para que el traje cerrara tuvo que fajarse… y como no había faja, fue un body de encaje. Lo difícil vino de noche, con su esposa intentando cerrar los broches. Es un disfraz que el humorista cuenta en su show: De la Espriella no sale en el video.

¿Cuál ha sido tu disfraz más incómodo?

Crédito: Jhovanoty, “Me disfracé de Abelardo de La Espriella... ¡Y Qué problema! - Puro Show de Jhovanoty”. Video original (minuto 11:23): https://youtu.be/lEDdtE48rBk?t=683

#Jhovanoty #PuroShow #HumorColombiano #Halloween #StandUp
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** El disfraz de Abelardo de la Espriella que necesitó faja | Jhovanoty

```
Para Halloween, el humorista Jhovanoty se disfrazó de Abelardo de la Espriella y, para que el traje cerrara, tuvo que fajarse… con un body de encaje. Es un disfraz que cuenta en su show Puro Show: De la Espriella no sale en el video.

Crédito: Jhovanoty, “Me disfracé de Abelardo de La Espriella... ¡Y Qué problema! - Puro Show de Jhovanoty”. Video original (minuto 11:23): https://youtu.be/lEDdtE48rBk?t=683

#Jhovanoty #PuroShow #HumorColombiano #StandUp
```

**Etiquetas:** Jhovanoty, Puro Show, humor colombiano, stand up, disfraz de Halloween, disfraz De la Espriella, comedia, Halloween


## 27. `2026-11-17-samulx-prueba-antidoping`

- **Gancho:** La prueba antidoping de Samulx tras perder
- **Puntaje:** 73 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-18 · **Línea:** urbano · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-samulx-prueba-antidoping/clip.mp4) (27,4 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-samulx-prueba-antidoping/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=GkojR4E0tuY
- **Revisar antes de publicar:** Control de rutina con resultado negativo: los textos lo dicen así. Dos palabras como (…).

### TikTok · cuenta `principal` (Legión Urbana) · aprobado automáticamente; en cola (previsto 18-nov)

```
Le hicieron prueba antidoping después de perder 😂

“Señora, ¿usted está en serio? Usted no vio mi pelea”. Samulx y el control en el camerino de Stream Fighters 5.

¿Hacía falta la prueba?

Crédito: Samulx, “ESTO PASÓ EN LOS CAMERINOS CON HERRERA DESPUES DE STREAM FIGTHERS 5 😯 ME JODÍ EL HOMBRO*”. Video original (minuto 9:36): https://youtu.be/GkojR4E0tuY?t=576

#Samulx #StreamFighters5 #LaGanga #Boxeo
```

### Instagram · cuenta `principal` · pendiente de aprobación

```
“¿Usted no vio mi pelea?”: Samulx y el control antidoping 😂

Al llegar al camerino tras su pelea en Stream Fighters 5, a Samulx le pidieron la muestra para el control: “¿de verdad cree que yo me metí algo?”. Todo salió negativo, y el remate es suyo: si hubiera salido positivo, “hubiese perdido también igual”.

¿Hacía falta la prueba?

Crédito: Samulx, “ESTO PASÓ EN LOS CAMERINOS CON HERRERA DESPUES DE STREAM FIGTHERS 5 😯 ME JODÍ EL HOMBRO*”. Video original (minuto 9:36): https://youtu.be/GkojR4E0tuY?t=576

#Samulx #StreamFighters5 #LaGanga #Boxeo
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** Samulx y la prueba antidoping de Stream Fighters 5

```
Después de su pelea en Stream Fighters 5, a Samulx le pidieron la prueba antidoping en el camerino. Su respuesta: “¿Usted no vio mi pelea?”. Es un control de rutina y salió negativo.

Crédito: Samulx, “ESTO PASÓ EN LOS CAMERINOS CON HERRERA DESPUES DE STREAM FIGTHERS 5 😯 ME JODÍ EL HOMBRO*”. Video original (minuto 9:36): https://youtu.be/GkojR4E0tuY?t=576

#Samulx #StreamFighters5 #Boxeo
```

**Etiquetas:** Samulx, Stream Fighters 5, antidoping, camerino, boxeo, La Ganga, streamers, humor


## 28. `2026-11-13-cotorrisa-vinchi-dicaprio`

- **Gancho:** Por qué DiCaprio se llama Leonardo
- **Puntaje:** 72 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-18 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-13-cotorrisa-vinchi-dicaprio/clip.mp4) (41,4 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-13-cotorrisa-vinchi-dicaprio/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=XUh-fUA_o30
- **Revisar antes de publicar:** Publicar lejos de cotorrisa-dicaprio-sandwich (los dos son de DiCaprio).

### TikTok · cuenta `risas` (@legion.risas) · aprobado automáticamente; en cola (previsto 18-nov)

```
Por qué DiCaprio se llama Leonardo… y casi se llama “Vinchi DiCaprio”

Con lapsus incluido: “dentro del vientre de su padre”.

¿Sabías de dónde venía su nombre?

Crédito: La Cotorrisa (Slobotzky y Ricardo Pérez; canal de Slobotzky en YouTube), “Episodio 399 - El doctor me sacó el jueguito de princesa”. Video original (minuto 38:11): https://youtu.be/XUh-fUA_o30?t=2291

#LaCotorrisa #DiCaprio #LeonardoDiCaprio #Humor #DatoCurioso
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
El dato de por qué DiCaprio se llama Leonardo… y el lapsus que lo arruinó

Su madre, embarazada, miraba un cuadro de Leonardo da Vinci en la Galería Uffizi cuando el bebé dio una patada… “dentro del vientre de su padre”. El lapsus y el remate: casi se llamó Vinchi DiCaprio.

¿Sabías de dónde venía su nombre?

Crédito: La Cotorrisa (Slobotzky y Ricardo Pérez; canal de Slobotzky en YouTube), “Episodio 399 - El doctor me sacó el jueguito de princesa”. Video original (minuto 38:11): https://youtu.be/XUh-fUA_o30?t=2291

#LaCotorrisa #DiCaprio #LeonardoDiCaprio #Humor #DatoCurioso
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** ¿Por qué Leonardo DiCaprio se llama Leonardo? | La Cotorrisa

```
Su madre, embarazada, miraba un cuadro de Leonardo da Vinci en la Galería Uffizi cuando el bebé dio una patada. El dato, un lapsus en plena lectura y el remate: casi se llamó Vinchi DiCaprio.

Crédito: La Cotorrisa (Slobotzky y Ricardo Pérez; canal de Slobotzky en YouTube), “Episodio 399 - El doctor me sacó el jueguito de princesa”. Video original (minuto 38:11): https://youtu.be/XUh-fUA_o30?t=2291

#LaCotorrisa #DiCaprio #DatoCurioso #Humor
```

**Etiquetas:** La Cotorrisa, Slobotzky, Ricardo Pérez, Leonardo DiCaprio, dato curioso, Leonardo da Vinci, podcast de comedia, humor


## 29. `2026-11-13-jhovanoty-radar-eldorado`

- **Gancho:** Cuando se cayó el radar de El Dorado
- **Puntaje:** 72 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-18 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-13-jhovanoty-radar-eldorado/clip.mp4) (56,2 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-13-jhovanoty-radar-eldorado/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=lEDdtE48rBk
- **Revisar antes de publicar:** No hay disfraz ni imitación de políticos: es stand-up de Jhovanoty con su ropa de show. Los textos dicen que el ingeniero y el neurocirujano son parte del chiste. El título del video original (en el crédito) habla del disfraz de De la Espriella.

### TikTok · cuenta `risas` (@legion.risas) · aprobado automáticamente; en cola, sin hueco antes de su ventana (2026-11-18)

```
Se cayó el radar de El Dorado, le cancelaron el vuelo y en la fila había un neurocirujano: “No se salte la fila, que yo tengo un show”

Stand-up de Jhovanoty en Puro Show: el ingeniero y el neurocirujano son parte del chiste.

¿A quién dejarías pasar primero?

Crédito: Jhovanoty, “Me disfracé de Abelardo de La Espriella... ¡Y Qué problema! - Puro Show de Jhovanoty”. Video original (minuto 1:52): https://youtu.be/lEDdtE48rBk?t=112

#Jhovanoty #PuroShow #HumorColombiano #ElDorado #StandUp
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
Jhovanoty imagina a los ingenieros de la torre de control de El Dorado

Jhovanoty cuenta que se dañó un radar en El Dorado y le cancelaron el vuelo a Medellín. Imagina al ingeniero de la torre abriendo el capó “como si supiera” y en la fila se encuentra con un neurocirujano que tiene una operación a corazón abierto… pero él tiene un show. Es stand-up: los personajes son parte del chiste.

¿A quién dejarías pasar primero?

Crédito: Jhovanoty, “Me disfracé de Abelardo de La Espriella... ¡Y Qué problema! - Puro Show de Jhovanoty”. Video original (minuto 1:52): https://youtu.be/lEDdtE48rBk?t=112

#Jhovanoty #PuroShow #HumorColombiano #ElDorado #StandUp
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** Vuelo cancelado en El Dorado y un neurocirujano en la fila | Jhovanoty

```
Jhovanoty cuenta que se dañó un radar en El Dorado y le cancelaron el vuelo a Medellín; en la fila se encuentra con un neurocirujano… pero él tiene un show. Es stand-up: los personajes son parte del chiste.

Crédito: Jhovanoty, “Me disfracé de Abelardo de La Espriella... ¡Y Qué problema! - Puro Show de Jhovanoty”. Video original (minuto 1:52): https://youtu.be/lEDdtE48rBk?t=112

#Jhovanoty #PuroShow #HumorColombiano #StandUp
```

**Etiquetas:** Jhovanoty, Puro Show, humor colombiano, stand up, El Dorado, vuelo cancelado, aeropuerto, comedia


## 30. `2026-11-15-parenlamano-barrera-2am`

- **Gancho:** La regla de las 2 de la mañana
- **Puntaje:** 72 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-18 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-15-parenlamano-barrera-2am/clip.mp4) (61,1 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-15-parenlamano-barrera-2am/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=92HshiOuj1k
- **Revisar antes de publicar:** La ficha atribuye la regla a Rober Galati por un comentario, pero el clip no lo nombra: los textos no se la atribuyen a nadie. Acento y jerga argentinos; un pitido como ***.

### TikTok · cuenta `risas` (@legion.risas) · aprobado automáticamente; en cola, sin hueco antes de su ventana (2026-11-18)

```
La regla de las 2 de la mañana: si no te dormiste, ya amanecés 😂

“Cuando pasa la barrera de las 2 de la mañana, si no te fuiste, ahí está el quiebre: tenés que amanecer”. Con Lit Killah en la mesa.

¿A qué hora es tu barrera?

Crédito: Paren la Mano (Vorterix), “VINO LIT KILLAH Y PAREN LA MODA HISTÓRICO | #ParenLaMano Completo - 13/11”. Video original (minuto 41:34): https://youtu.be/92HshiOuj1k?t=2494

#ParenLaMano #Vorterix #LitKillah #Humor
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
Pasadas las 2 de la mañana ya no hay vuelta 😂

En Paren la Mano explican la regla: “Cuando pasa la barrera de las 2 de la mañana, si no te fuiste, ahí está el quiebre: tenés que amanecer”. Y si estás en un Discord y a las 4 decís que te vas a dormir, “no tenés código”. Con Lit Killah de invitado.

¿A qué hora es tu barrera?

Crédito: Paren la Mano (Vorterix), “VINO LIT KILLAH Y PAREN LA MODA HISTÓRICO | #ParenLaMano Completo - 13/11”. Video original (minuto 41:34): https://youtu.be/92HshiOuj1k?t=2494

#ParenLaMano #Vorterix #LitKillah #Humor
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** La barrera de las 2 de la mañana, según Paren la Mano

```
En Paren la Mano explican su teoría: si pasaste las 2 de la mañana despierto, ya no te vas a dormir. Con Lit Killah en la mesa.

Crédito: Paren la Mano (Vorterix), “VINO LIT KILLAH Y PAREN LA MODA HISTÓRICO | #ParenLaMano Completo - 13/11”. Video original (minuto 41:34): https://youtu.be/92HshiOuj1k?t=2494

#ParenLaMano #Vorterix #LitKillah #Humor
```

**Etiquetas:** Paren la Mano, Vorterix, Lit Killah, humor argentino, streaming argentino, dormir, madrugada, humor


## 31. `2026-11-15-tirandobola-luz-experiencias`

- **Gancho:** ¿Se paga la luz con experiencias?
- **Puntaje:** 72 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-18 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-15-tirandobola-luz-experiencias/clip.mp4) (62,7 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-15-tirandobola-luz-experiencias/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=niP1DkpCYvs
- **Revisar antes de publicar:** Discusión en broma entre amigos. Un pitido de la fuente como *** y una palabra como (…).

### TikTok · cuenta `risas` (@legion.risas) · aprobado automáticamente; en cola (previsto 18-nov)

```
“Vengo a pagar este recibo, me fue muy bien en Londres” 😂

Marco Polo dice que “no todo es dinero” y Franco Escamilla le responde con el recibo de la luz.

¿Experiencias o pagar la luz?

Crédito: Tirando Bola, de Franco Escamilla (canal de Franco Escamilla en YouTube), “Marco Polo | Tirando Bola | T9E21”. Video original (minuto 28:41): https://youtu.be/niP1DkpCYvs?t=1721

#FrancoEscamilla #TirandoBola #MarcoPolo #Comedia
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
Franco Escamilla: “todos te cobran” 😂

Marco Polo cuenta que lo que gana lo gasta en ir a Londres a ver teatro, porque “no todo es dinero”. Franco no lo compra: “¿Tú crees que yo puedo llegar a pagar la luz con experiencias?”. Y remata: “Pues si hubieras visto dos para alcanzar a pagar”.

¿Experiencias o pagar la luz?

Crédito: Tirando Bola, de Franco Escamilla (canal de Franco Escamilla en YouTube), “Marco Polo | Tirando Bola | T9E21”. Video original (minuto 28:41): https://youtu.be/niP1DkpCYvs?t=1721

#FrancoEscamilla #TirandoBola #MarcoPolo #Comedia
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** ¿No todo es dinero? Franco Escamilla responde | Tirando Bola

```
Marco Polo dice que lo que gana lo gasta en ver teatro en Londres porque “no todo es dinero”. Franco Escamilla le responde con el recibo de la luz.

Crédito: Tirando Bola, de Franco Escamilla (canal de Franco Escamilla en YouTube), “Marco Polo | Tirando Bola | T9E21”. Video original (minuto 28:41): https://youtu.be/niP1DkpCYvs?t=1721

#FrancoEscamilla #TirandoBola #Comedia
```

**Etiquetas:** Franco Escamilla, Tirando Bola, Marco Polo, comedia, comedia mexicana, dinero, Londres, humor


## 32. `2026-11-17-samulx-camerino-robado`

- **Gancho:** Así le quitaron el camerino a Lonche y Willito
- **Puntaje:** 72 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-18 · **Línea:** urbano · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-samulx-camerino-robado/clip.mp4) (38,8 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-samulx-camerino-robado/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=GkojR4E0tuY
- **Revisar antes de publicar:** The Chanty, Lonche y Willito no salen: lo cuenta Samulx. Un pitido de la fuente como ***.

### TikTok · cuenta `principal` (Legión Urbana) · aprobado automáticamente; en cola (previsto 18-nov; cede su sitio a westcol-herrera-no-planeado si el usuario confirma que ese no llegó a la bandeja)

```
“Estamos jugando de local”: así le quitaron el camerino a Lonche y Willito 😂

Samulx cuenta cómo él y The Chanty se quedaron con el camerino grande… y ellos “ni siquiera se dieron cuenta”.

Etiqueta a tu amigo que haría esto

Crédito: Samulx, “ESTO PASÓ EN LOS CAMERINOS CON HERRERA DESPUES DE STREAM FIGTHERS 5 😯 ME JODÍ EL HOMBRO*”. Video original (minuto 22:26): https://youtu.be/GkojR4E0tuY?t=1346

#Samulx #TheChanty #Lonche #Willito #StreamFighters5
```

### Instagram · cuenta `principal` · pendiente de aprobación

```
Samulx y The Chanty se quedaron con el camerino de Lonche y Willito 😂

Les tocó un camerino pequeño y vieron el grande vacío, el de Willito y Lonche, que aún no llegaban. The Chanty lo resolvió: “nosotros estamos jugando de local, este es mi país… ellos son visitantes”. Según Samulx, “ni siquiera se dieron cuenta”.

Etiqueta a tu amigo que haría esto

Crédito: Samulx, “ESTO PASÓ EN LOS CAMERINOS CON HERRERA DESPUES DE STREAM FIGTHERS 5 😯 ME JODÍ EL HOMBRO*”. Video original (minuto 22:26): https://youtu.be/GkojR4E0tuY?t=1346

#Samulx #TheChanty #Lonche #Willito #StreamFighters5
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** La jugada del camerino en Stream Fighters 5, contada por Samulx

```
Samulx cuenta cómo él y The Chanty se quedaron con el camerino grande de Lonche y Willito en Stream Fighters 5: “estamos jugando de local… ellos son visitantes”.

Crédito: Samulx, “ESTO PASÓ EN LOS CAMERINOS CON HERRERA DESPUES DE STREAM FIGTHERS 5 😯 ME JODÍ EL HOMBRO*”. Video original (minuto 22:26): https://youtu.be/GkojR4E0tuY?t=1346

#Samulx #TheChanty #StreamFighters5
```

**Etiquetas:** Samulx, The Chanty, Lonche, Willito, Stream Fighters 5, camerino, streamers, humor


## 33. `2026-11-13-cotorrisa-navajas-suizas`

- **Gancho:** 16 navajas suizas en la pañalera
- **Puntaje:** 71 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-18 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-13-cotorrisa-navajas-suizas/clip.mp4) (36,8 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-13-cotorrisa-navajas-suizas/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=XUh-fUA_o30
- **Revisar antes de publicar:** Ficha: en los últimos 11 s se ve un recuadro pequeño de otro segmento del programa («¿Chino, coreano o japonés?»). Si molesta, descártalo.

### TikTok · cuenta `risas` (@legion.risas) · aprobado automáticamente; en cola, sin hueco antes de su ventana (2026-11-18)

```
Cuando tu regalo de viaje te puede costar la cárcel en Suiza: 16 navajas suizas en la pañalera

¿Qué regalo traerías tú de Suiza?

Crédito: La Cotorrisa (Slobotzky y Ricardo Pérez; canal de Slobotzky en YouTube), “Episodio 399 - El doctor me sacó el jueguito de princesa”. Video original (minuto 25:41): https://youtu.be/XUh-fUA_o30?t=1541

#LaCotorrisa #Slobotzky #RicardoPerez #Suiza #Humor
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
“16 navajas suizas en la pañalera”: el regalo que nadie debería subir al avión

Le trajeron regalos de China y ahora le toca devolver el detalle desde Suiza, donde “un chocolatito no baja de 30”. La idea: navajas suizas personalizadas para todo el equipo… hasta que se imagina pasando el aeropuerto con 16 navajas en la pañalera del bebé.

¿Qué regalo traerías tú de Suiza?

Crédito: La Cotorrisa (Slobotzky y Ricardo Pérez; canal de Slobotzky en YouTube), “Episodio 399 - El doctor me sacó el jueguito de princesa”. Video original (minuto 25:41): https://youtu.be/XUh-fUA_o30?t=1541

#LaCotorrisa #Slobotzky #RicardoPerez #Suiza #Humor
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** 16 navajas suizas en la pañalera del bebé | La Cotorrisa

```
Le toca devolver unos regalos desde Suiza y la idea son navajas suizas personalizadas para todo el equipo… hasta que se imagina pasando el aeropuerto con 16 navajas en la pañalera del bebé.

Crédito: La Cotorrisa (Slobotzky y Ricardo Pérez; canal de Slobotzky en YouTube), “Episodio 399 - El doctor me sacó el jueguito de princesa”. Video original (minuto 25:41): https://youtu.be/XUh-fUA_o30?t=1541

#LaCotorrisa #Suiza #Humor #PodcastDeComedia
```

**Etiquetas:** La Cotorrisa, Slobotzky, Ricardo Pérez, navajas suizas, Suiza, aeropuerto, podcast de comedia, humor


## 34. `2026-11-13-cotorrisa-papa-cadenero`

- **Gancho:** El Papa Francisco fue cadenero de antro
- **Puntaje:** 71 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-18 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-13-cotorrisa-papa-cadenero/clip.mp4) (29,6 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-13-cotorrisa-papa-cadenero/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=XUh-fUA_o30
- **Revisar antes de publicar:** El clip termina en «Tú no pasas» a propósito (lo que sigue queda fuera por drogas, color de piel y menores). Separarlo de los otros clips del Papa (parenlamano-cardenal-prevost y parenlamano-papa-a-dormir).

### TikTok · cuenta `risas` (@legion.risas) · aprobado automáticamente; en cola, sin hueco antes de su ventana (2026-11-18)

```
Antes de ser Papa, Bergoglio sacaba borrachos de un club en Buenos Aires

En La Cotorrisa se imaginan a quien pueda presumir que lo sacó el Papa: “Tú no pasas”.

¿Lo sabías?

Crédito: La Cotorrisa (Slobotzky y Ricardo Pérez; canal de Slobotzky en YouTube), “Episodio 399 - El doctor me sacó el jueguito de princesa”. Video original (minuto 1:55:13): https://youtu.be/XUh-fUA_o30?t=6913

#LaCotorrisa #PapaFrancisco #DatoCurioso #Humor #BuenosAires
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
Imagínate que el Papa te sacó del antro: “Tú no pasas”

En los años 50, antes del seminario, Jorge Mario Bergoglio trabajó como guardia de seguridad sacando borrachos de un club nocturno en Buenos Aires. En La Cotorrisa se imaginan a quien pueda presumir que lo sacó el Papa.

¿Lo sabías?

Crédito: La Cotorrisa (Slobotzky y Ricardo Pérez; canal de Slobotzky en YouTube), “Episodio 399 - El doctor me sacó el jueguito de princesa”. Video original (minuto 1:55:13): https://youtu.be/XUh-fUA_o30?t=6913

#LaCotorrisa #PapaFrancisco #DatoCurioso #Humor #BuenosAires
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** El Papa Francisco fue cadenero de antro | La Cotorrisa

```
Antes del seminario, Jorge Mario Bergoglio trabajó como guardia de seguridad sacando borrachos de un club nocturno en Buenos Aires. En La Cotorrisa se imaginan la escena.

Crédito: La Cotorrisa (Slobotzky y Ricardo Pérez; canal de Slobotzky en YouTube), “Episodio 399 - El doctor me sacó el jueguito de princesa”. Video original (minuto 1:55:13): https://youtu.be/XUh-fUA_o30?t=6913

#LaCotorrisa #PapaFrancisco #DatoCurioso #Humor
```

**Etiquetas:** La Cotorrisa, Slobotzky, Ricardo Pérez, Papa Francisco, Bergoglio, dato curioso, Buenos Aires, humor


## 35. `2026-11-13-cotorrisa-pastor-gases`

- **Gancho:** El pastor que 'cura' con gases
- **Puntaje:** 70 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-18 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-13-cotorrisa-pastor-gases/clip.mp4) (72 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-13-cotorrisa-pastor-gases/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=XUh-fUA_o30
- **Revisar antes de publicar:** Ficha: hacia el segundo 15 sale la foto viral del pastor sentado sobre un fiel (persona privada, cara poco visible); si molesta, descártalo. Los textos no nombran al pastor ni añaden datos.

### TikTok · cuenta `risas` (@legion.risas) · aprobado automáticamente; en cola, sin hueco antes de su ventana (2026-11-18)

```
El pastor que dice curar sentándose sobre sus fieles… y soltando gases

En La Cotorrisa no lo pueden creer: “ya por mera dignidad dices que te curó”.

¿Tú le creerías?

Crédito: La Cotorrisa (Slobotzky y Ricardo Pérez; canal de Slobotzky en YouTube), “Episodio 399 - El doctor me sacó el jueguito de princesa”. Video original (minuto 1:58:42): https://youtu.be/XUh-fUA_o30?t=7122

#LaCotorrisa #Humor #Slobotzky #RicardoPerez #NoLoPuedoCreer
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
“Esto hizo caminar a un mudo”: La Cotorrisa y el pastor de los gases

Un pastor asegura que sana a sus fieles sentándose sobre ellos y soltando gases. En La Cotorrisa no lo pueden creer: “ya por mera dignidad dices que te curó”.

¿Tú le creerías?

Crédito: La Cotorrisa (Slobotzky y Ricardo Pérez; canal de Slobotzky en YouTube), “Episodio 399 - El doctor me sacó el jueguito de princesa”. Video original (minuto 1:58:42): https://youtu.be/XUh-fUA_o30?t=7122

#LaCotorrisa #Humor #Slobotzky #RicardoPerez #NoLoPuedoCreer
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** El pastor que “sana” con gases | La Cotorrisa

```
Un pastor asegura que sana a sus fieles sentándose sobre ellos y soltando gases. En La Cotorrisa no lo pueden creer.

Crédito: La Cotorrisa (Slobotzky y Ricardo Pérez; canal de Slobotzky en YouTube), “Episodio 399 - El doctor me sacó el jueguito de princesa”. Video original (minuto 1:58:42): https://youtu.be/XUh-fUA_o30?t=7122

#LaCotorrisa #Humor #NoLoPuedoCreer
```

**Etiquetas:** La Cotorrisa, Slobotzky, Ricardo Pérez, pastor, noticias raras, podcast de comedia, humor, no lo puedo creer


## 36. `2026-11-15-nsn-santa-regalos`

- **Gancho:** ¿Por qué hay regalos si viene Santa Claus?
- **Puntaje:** 70 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-18 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-15-nsn-santa-regalos/clip.mp4) (51,4 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-15-nsn-santa-regalos/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=pSyuyPq7uh0
- **Revisar antes de publicar:** Acento de España; lo de los elfos queda fuera del corte.

### TikTok · cuenta `risas` (@legion.risas) · aprobado automáticamente; en cola, sin hueco antes de su ventana (2026-11-18)

```
Santa Claus solo sabe decir una palabra 🎅😂

Una oyente no entiende por qué en las películas compran regalos si viene Santa Claus. Buenafuente y Berto tienen la teoría: son regalos señuelo.

¿Y en tu casa quién trae los regalos?

Crédito: Nadie Sabe Nada, de Andreu Buenafuente y Berto Romero (El Terrat), “NADIE SABE NADA 14x11 | Los Claus y los elfos promiscuos”. Video original (minuto 17:15): https://youtu.be/pSyuyPq7uh0?t=1035

#NadieSabeNada #Buenafuente #BertoRomero #SantaClaus #Navidad
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
“Santa Claus, ¿cómo estás?” “Regalos.” 🎅😂

Una oyente de Nadie Sabe Nada pregunta por qué en las películas compran regalos si también viene Santa Claus. La respuesta de Andreu Buenafuente y Berto Romero: son regalos señuelo, porque Santa Claus solo sabe de regalos.

¿Y en tu casa quién trae los regalos?

Crédito: Nadie Sabe Nada, de Andreu Buenafuente y Berto Romero (El Terrat), “NADIE SABE NADA 14x11 | Los Claus y los elfos promiscuos”. Video original (minuto 17:15): https://youtu.be/pSyuyPq7uh0?t=1035

#NadieSabeNada #Buenafuente #BertoRomero #SantaClaus #Navidad
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** Buenafuente y Berto explican los regalos de Santa Claus | Nadie Sabe Nada

```
Una oyente pregunta por qué en las películas compran regalos si también viene Santa Claus. Andreu Buenafuente y Berto Romero tienen la respuesta: son regalos señuelo.

Crédito: Nadie Sabe Nada, de Andreu Buenafuente y Berto Romero (El Terrat), “NADIE SABE NADA 14x11 | Los Claus y los elfos promiscuos”. Video original (minuto 17:15): https://youtu.be/pSyuyPq7uh0?t=1035

#NadieSabeNada #SantaClaus #Navidad #Humor
```

**Etiquetas:** Nadie Sabe Nada, Andreu Buenafuente, Berto Romero, Santa Claus, Navidad, regalos, El Terrat, humor


## 37. `2026-11-15-nsn-spiderman-sudado`

- **Gancho:** El problema que nadie ve de Spider-Man
- **Puntaje:** 70 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-18 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-15-nsn-spiderman-sudado/clip.mp4) (58,7 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-15-nsn-spiderman-sudado/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=pSyuyPq7uh0
- **Revisar antes de publicar:** Acento de España.

### TikTok · cuenta `risas` (@legion.risas) · aprobado automáticamente; en cola, sin hueco antes de su ventana (2026-11-18)

```
Nadie habla de lo que debe oler Spider-Man 🕷️😂

Con la licra todo el día debajo de la ropa… y la gente a la que rescata “se tiene que comer el pastel”.

¿Qué superhéroe crees que huele peor?

Crédito: Nadie Sabe Nada, de Andreu Buenafuente y Berto Romero (El Terrat), “NADIE SABE NADA 14x11 | Los Claus y los elfos promiscuos”. Video original (minuto 30:31): https://youtu.be/pSyuyPq7uh0?t=1831

#NadieSabeNada #Buenafuente #BertoRomero #SpiderMan #Humor
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
El problema que nadie ve de Spider-Man 🕷️

Un oyente de Nadie Sabe Nada se cambió en un baño público para ir a una entrevista y se sintió como Spider-Man. Andreu Buenafuente y Berto Romero piensan en lo que eso significa: la licra siempre debajo de la ropa, “lo que debe gastar en desodorantes”… y los rescatados.

¿Qué superhéroe crees que huele peor?

Crédito: Nadie Sabe Nada, de Andreu Buenafuente y Berto Romero (El Terrat), “NADIE SABE NADA 14x11 | Los Claus y los elfos promiscuos”. Video original (minuto 30:31): https://youtu.be/pSyuyPq7uh0?t=1831

#NadieSabeNada #Buenafuente #BertoRomero #SpiderMan #Humor
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** Buenafuente y Berto sobre el Spider-Man sudado | Nadie Sabe Nada

```
Un oyente se cambió en un baño público para una entrevista y se sintió como Spider-Man. En Nadie Sabe Nada piensan en lo que eso significa para los rescatados.

Crédito: Nadie Sabe Nada, de Andreu Buenafuente y Berto Romero (El Terrat), “NADIE SABE NADA 14x11 | Los Claus y los elfos promiscuos”. Video original (minuto 30:31): https://youtu.be/pSyuyPq7uh0?t=1831

#NadieSabeNada #SpiderMan #Humor
```

**Etiquetas:** Nadie Sabe Nada, Andreu Buenafuente, Berto Romero, Spider-Man, Tobey Maguire, superhéroes, El Terrat, humor


## 38. `2026-11-15-parenlamano-litkillah-kidkeo`

- **Gancho:** Lit Killah le escribió a Kid Keo y…
- **Puntaje:** 70 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-18 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-15-parenlamano-litkillah-kidkeo/clip.mp4) (73,8 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-15-parenlamano-litkillah-kidkeo/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=92HshiOuj1k
- **Revisar antes de publicar:** Lit habla bien de Kid Keo todo el tramo: al publicar no le des tono de pelea. Dos palabras como (…). Dura 73,8 s.

### TikTok · cuenta `risas` (@legion.risas) · aprobado automáticamente; en cola, sin hueco antes de su ventana (2026-11-18)

```
Lit Killah le escribió a Kid Keo después de La Velada… y esto pasó 😅

Le mandó un mensaje para decirle que era un capo “y no me contestó… pero hasta ahí”. ¿Volver a pelear? Solo por “una banda guita”.

¿Contra quién debería pelear Lit Killah?

Crédito: Paren la Mano (Vorterix), “VINO LIT KILLAH Y PAREN LA MODA HISTÓRICO | #ParenLaMano Completo - 13/11”. Video original (minuto 19:46): https://youtu.be/92HshiOuj1k?t=1186

#LitKillah #KidKeo #ParenLaMano #LaVelada
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
Lit Killah y el mensaje a Kid Keo que no tuvo respuesta 😅

En Paren la Mano, Lit Killah cuenta que después de su pelea en La Velada del Año le escribió a Kid Keo para decirle que era un capo “y no me contestó… pero hasta ahí”. ¿Volver a pelear? Le gustaría, pero quiere “una banda guita”: “No le tengo bronca a nadie”.

¿Contra quién debería pelear Lit Killah?

Crédito: Paren la Mano (Vorterix), “VINO LIT KILLAH Y PAREN LA MODA HISTÓRICO | #ParenLaMano Completo - 13/11”. Video original (minuto 19:46): https://youtu.be/92HshiOuj1k?t=1186

#LitKillah #KidKeo #ParenLaMano #LaVelada
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** Lit Killah sobre Kid Keo y si volverá a pelear | Paren la Mano

```
En Paren la Mano, Lit Killah cuenta qué pasó cuando le escribió a Kid Keo después de su pelea en La Velada del Año y qué haría falta para que vuelva a subirse a un ring.

Crédito: Paren la Mano (Vorterix), “VINO LIT KILLAH Y PAREN LA MODA HISTÓRICO | #ParenLaMano Completo - 13/11”. Video original (minuto 19:46): https://youtu.be/92HshiOuj1k?t=1186

#LitKillah #KidKeo #ParenLaMano
```

**Etiquetas:** Lit Killah, Kid Keo, Paren la Mano, Vorterix, La Velada del Año, boxeo, streaming argentino, humor


## 39. `2026-11-15-tirandobola-comentarios-bano`

- **Gancho:** Dónde lee Franco los comentarios negativos
- **Puntaje:** 70 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-18 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-15-tirandobola-comentarios-bano/clip.mp4) (31,6 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-15-tirandobola-comentarios-bano/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=niP1DkpCYvs
- **Revisar antes de publicar:** Pitidos de la fuente como *** (la palabra del baño).

### TikTok · cuenta `risas` (@legion.risas) · aprobado automáticamente; en cola, sin hueco antes de su ventana (2026-11-18)

```
Franco Escamilla revela dónde lee los comentarios negativos 🚽😂

Los negativos, en el baño, “porque no estoy haciendo nada”. Los positivos, sentado frente a la computadora, con cafecito.

¿Y tú dónde lees los comentarios?

Crédito: Tirando Bola, de Franco Escamilla (canal de Franco Escamilla en YouTube), “Marco Polo | Tirando Bola | T9E21”. Video original (minuto 35:50): https://youtu.be/niP1DkpCYvs?t=2150

#FrancoEscamilla #TirandoBola #Comedia #Haters
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
Los haters, solo en el baño 🚽😂

En Tirando Bola, Marco Polo le pregunta a Franco Escamilla por qué lee los comentarios negativos. Su método: esos los lee en el baño, “porque no estoy haciendo nada”; a los positivos les contesta “sentado frente a la computadora, cafecito… a la raza que me quiere”.

¿Y tú dónde lees los comentarios?

Crédito: Tirando Bola, de Franco Escamilla (canal de Franco Escamilla en YouTube), “Marco Polo | Tirando Bola | T9E21”. Video original (minuto 35:50): https://youtu.be/niP1DkpCYvs?t=2150

#FrancoEscamilla #TirandoBola #Comedia #Haters
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** Franco Escamilla y su método para los comentarios negativos | Tirando Bola

```
En Tirando Bola, Marco Polo le pregunta a Franco Escamilla por qué lee los comentarios negativos. Su respuesta: depende de dónde esté sentado.

Crédito: Tirando Bola, de Franco Escamilla (canal de Franco Escamilla en YouTube), “Marco Polo | Tirando Bola | T9E21”. Video original (minuto 35:50): https://youtu.be/niP1DkpCYvs?t=2150

#FrancoEscamilla #TirandoBola #Comedia
```

**Etiquetas:** Franco Escamilla, Tirando Bola, Marco Polo, comentarios, haters, comedia, comedia mexicana, humor


## 40. `2026-11-15-tirandobola-marco-gana`

- **Gancho:** Marco Polo le ganó a Franco al billar
- **Puntaje:** 70 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-18 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-15-tirandobola-marco-gana/clip.mp4) (31,3 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-15-tirandobola-marco-gana/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=niP1DkpCYvs
- **Revisar antes de publicar:** La cifra del donativo a Nariz Roja (la apuesta del programa) no se oye y queda como (…); un pitido como ***. Mira la jugada en la imagen antes de publicar.

### TikTok · cuenta `risas` (@legion.risas) · aprobado automáticamente; en cola, sin hueco antes de su ventana (2026-11-18)

```
“No la voy a meter en ningún lado”… y le ganó a Franco Escamilla 🎱😂

Final de la partida de billar de Tirando Bola: Marco Polo no canta la bola, la mete y gana. Franco se la da por buena.

¿Se la tenía que valer?

Crédito: Tirando Bola, de Franco Escamilla (canal de Franco Escamilla en YouTube), “Marco Polo | Tirando Bola | T9E21”. Video original (minuto 58:06): https://youtu.be/niP1DkpCYvs?t=3486

#FrancoEscamilla #TirandoBola #MarcoPolo #Billar
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
El primer logro deportivo de Marco Polo 🎱

Final del billar de Tirando Bola: Marco Polo avisa que no va a cantar la bola porque “no la voy a meter en ningún lado”… y la mete. Franco Escamilla se la da por buena, “porque se me hace bien triste que es tu primer logro deportivo”. “He ganado a Franco Escamilla.”

¿Se la tenía que valer?

Crédito: Tirando Bola, de Franco Escamilla (canal de Franco Escamilla en YouTube), “Marco Polo | Tirando Bola | T9E21”. Video original (minuto 58:06): https://youtu.be/niP1DkpCYvs?t=3486

#FrancoEscamilla #TirandoBola #MarcoPolo #Billar
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** Marco Polo le gana a Franco Escamilla al billar | Tirando Bola

```
Final de la partida de billar de Tirando Bola: Marco Polo anuncia que no va a meter la bola, la mete y gana. Franco Escamilla se la da por buena.

Crédito: Tirando Bola, de Franco Escamilla (canal de Franco Escamilla en YouTube), “Marco Polo | Tirando Bola | T9E21”. Video original (minuto 58:06): https://youtu.be/niP1DkpCYvs?t=3486

#FrancoEscamilla #TirandoBola #Billar
```

**Etiquetas:** Franco Escamilla, Tirando Bola, Marco Polo, billar, comedia, comedia mexicana, Nariz Roja, humor


## 41. `2026-11-17-samulx-clinica-fotico`

- **Gancho:** Se iba de la clínica y el doctor…
- **Puntaje:** 70 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-18 · **Línea:** urbano · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-samulx-clinica-fotico/clip.mp4) (52,4 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-samulx-clinica-fotico/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=GkojR4E0tuY
- **Revisar antes de publicar:** No se nombra la clínica ni se ve a nadie del personal: al publicar, tampoco. Un pitido de la fuente como ***.

### TikTok · cuenta `principal` (Legión Urbana) · aprobado automáticamente; en cola, sin hueco antes de su ventana (2026-11-18)

```
Se iba de la clínica con el hombro lesionado y el doctor le pidió una foto 😂

Samulx, tras Stream Fighters 5: horas sin radiografía y, al firmar el alta, “¿será que nos podemos tomar una fotico antes que te vayas?”.

¿Le habrías dado la foto?

Crédito: Samulx, “ESTO PASÓ EN LOS CAMERINOS CON HERRERA DESPUES DE STREAM FIGTHERS 5 😯 ME JODÍ EL HOMBRO*”. Video original (minuto 14:03): https://youtu.be/GkojR4E0tuY?t=843

#Samulx #StreamFighters5 #Westcol #Bogota
```

### Instagram · cuenta `principal` · pendiente de aprobación

```
“¿Será que nos podemos tomar una fotico antes que te vayas?” 😂

Con el hombro lesionado tras Stream Fighters 5, Samulx pasó horas en una clínica de Bogotá sin que le hicieran la radiografía. Le escribió a Westcol y decidió irse. Cuando por fin le pidió al doctor que firmara el alta… el doctor le pidió una foto.

¿Le habrías dado la foto?

Crédito: Samulx, “ESTO PASÓ EN LOS CAMERINOS CON HERRERA DESPUES DE STREAM FIGTHERS 5 😯 ME JODÍ EL HOMBRO*”. Video original (minuto 14:03): https://youtu.be/GkojR4E0tuY?t=843

#Samulx #StreamFighters5 #Westcol #Bogota
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** Samulx y el doctor que le pidió una foto en la clínica

```
Con el hombro lesionado tras Stream Fighters 5, Samulx pasó horas en una clínica de Bogotá sin radiografía. Cuando por fin se iba, el doctor le pidió una foto.

Crédito: Samulx, “ESTO PASÓ EN LOS CAMERINOS CON HERRERA DESPUES DE STREAM FIGTHERS 5 😯 ME JODÍ EL HOMBRO*”. Video original (minuto 14:03): https://youtu.be/GkojR4E0tuY?t=843

#Samulx #StreamFighters5 #Humor
```

**Etiquetas:** Samulx, Stream Fighters 5, clínica, lesión de hombro, Westcol, Bogotá, streamers, humor


## 42. `2026-11-17-samulx-entrada-sin-musica`

- **Gancho:** Iba a salir con Akapellah… y pasó esto
- **Puntaje:** 70 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-18 · **Línea:** urbano · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-samulx-entrada-sin-musica/clip.mp4) (63,3 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-samulx-entrada-sin-musica/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=GkojR4E0tuY
- **Revisar antes de publicar:** Akapellah no sale; solo lo nombra. No suena ninguna canción en el tramo. Pitidos de la fuente como ***.

### TikTok · cuenta `principal` (Legión Urbana) · aprobado automáticamente; en cola, sin hueco antes de su ventana (2026-11-18)

```
Iba a salir con Akapellah al ring… y le falló hasta la música 😂🥊

Akapellah no pudo viajar, pidió una de Canserbero y la canción no sonó: “lo único bueno que yo podía tener esa pelea era mi entrada”.

¿Con qué canción habrías salido tú?

Crédito: Samulx, “ESTO PASÓ EN LOS CAMERINOS CON HERRERA DESPUES DE STREAM FIGTHERS 5 😯 ME JODÍ EL HOMBRO*”. Video original (minuto 17:17): https://youtu.be/GkojR4E0tuY?t=1037

#Samulx #Akapellah #Canserbero #StreamFighters5
```

### Instagram · cuenta `principal` · pendiente de aprobación

```
“Lo único bueno que yo podía tener esa pelea era mi entrada” 😂

Samulx quería salir al ring de Stream Fighters 5 con Neutro y Akapellah, pero Akapellah no pudo viajar. Pidió una de Canserbero “que le dé rabia”… y la música no sonó. Salió con otra “toda random” y la cara “de lo más malo posible”.

¿Con qué canción habrías salido tú?

Crédito: Samulx, “ESTO PASÓ EN LOS CAMERINOS CON HERRERA DESPUES DE STREAM FIGTHERS 5 😯 ME JODÍ EL HOMBRO*”. Video original (minuto 17:17): https://youtu.be/GkojR4E0tuY?t=1037

#Samulx #Akapellah #Canserbero #StreamFighters5
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** La entrada de Samulx en Stream Fighters 5 que salió mal

```
Samulx cuenta cómo se le cayó su entrada en Stream Fighters 5: iba a salir con Akapellah, que no pudo viajar; pidió una de Canserbero y la música no sonó.

Crédito: Samulx, “ESTO PASÓ EN LOS CAMERINOS CON HERRERA DESPUES DE STREAM FIGTHERS 5 😯 ME JODÍ EL HOMBRO*”. Video original (minuto 17:17): https://youtu.be/GkojR4E0tuY?t=1037

#Samulx #Akapellah #StreamFighters5
```

**Etiquetas:** Samulx, Akapellah, Canserbero, Neutro, Stream Fighters 5, entrada al ring, rap, streamers


## 43. `2026-11-17-westcol-daren-mentiroso`

- **Gancho:** Lo que Daren le dijo a Westcol después
- **Puntaje:** 70 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-18 · **Línea:** urbano · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-westcol-daren-mentiroso/clip.mp4) (27 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-westcol-daren-mentiroso/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=YQ-vOO3-Ghk
- **Revisar antes de publicar:** Daren no sale: Westcol cuenta su chat con él. No hay imágenes del combate. Los textos no dicen que ganó «en 5 segundos» (la ficha lo proponía para Shorts): la pelea se detuvo después, por la lesión de hombro del Agropecuario.

### TikTok · cuenta `principal` (Legión Urbana) · aprobado automáticamente; en cola, sin hueco antes de su ventana (2026-11-18)

```
Daren dice que no alcanzó a tirar su golpe duro… y Westcol no le cree 😂🥊

“Estuve dos meses practicando el puño mío letal y no lo pude ni siquiera tirar”. Westcol: “Cuatro puñitos y pum… Daren, deja de ser mentiroso”.

¿Le crees a Daren?

Crédito: WestCOL, “¿Que pasara con HERRERA por bajar de la pelea en STREAM FIGHTERS 5?| Westcol”. Video original (minuto 9:49): https://youtu.be/YQ-vOO3-Ghk?t=589

#Westcol #Daren #StreamFighters5 #Boxeo
```

### Instagram · cuenta `principal` · pendiente de aprobación

```
“Dos meses practicando el puño mío letal y no lo pude ni siquiera tirar” 😂

Tras la pelea de Daren con el Agropecuario en Stream Fighters 5, Westcol le escribió para preguntarle por qué le dio tan duro y tan rápido. La respuesta no lo convenció: “Daren, deja de ser mentiroso”.

¿Le crees a Daren?

Crédito: WestCOL, “¿Que pasara con HERRERA por bajar de la pelea en STREAM FIGHTERS 5?| Westcol”. Video original (minuto 9:49): https://youtu.be/YQ-vOO3-Ghk?t=589

#Westcol #Daren #StreamFighters5 #Boxeo
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** Lo que Daren le escribió a Westcol tras su pelea en Stream Fighters 5

```
Westcol le escribió a Daren para preguntarle por qué le dio tan duro y tan rápido al Agropecuario en Stream Fighters 5. Daren le dijo que ni siquiera alcanzó a tirar su “puño letal”, y Westcol no le cree.

Crédito: WestCOL, “¿Que pasara con HERRERA por bajar de la pelea en STREAM FIGHTERS 5?| Westcol”. Video original (minuto 9:49): https://youtu.be/YQ-vOO3-Ghk?t=589

#Westcol #Daren #StreamFighters5
```

**Etiquetas:** Westcol, Daren Ramírez, Daren, Agropecuario, Stream Fighters 5, boxeo, streamers


## 44. `2026-11-17-samulx-hable-mucho`

- **Gancho:** Samulx, a los que dicen que habló mucho
- **Puntaje:** 68 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-18 · **Línea:** urbano · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-samulx-hable-mucho/clip.mp4) (19,9 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-samulx-hable-mucho/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=GkojR4E0tuY
- **Revisar antes de publicar:** Lenguaje fuerte en el audio (los textos no lo citan); pitidos como *** y una palabra como (…).

### TikTok · cuenta `principal` (Legión Urbana) · aprobado automáticamente; en cola, sin hueco antes de su ventana (2026-11-18)

```
Samulx responde a los que dicen que habló mucho antes de la pelea 🥊😂

“¿Ustedes qué creían, que yo fuese al pesaje y dijese ‘Ay, no, Willito, por favor, papi’?”… “esa es parte del show”.

¿Habló de más?

Crédito: Samulx, “ESTO PASÓ EN LOS CAMERINOS CON HERRERA DESPUES DE STREAM FIGTHERS 5 😯 ME JODÍ EL HOMBRO*”. Video original (minuto 1:37): https://youtu.be/GkojR4E0tuY?t=97

#Samulx #Willito #StreamFighters5 #LaGanga
```

### Instagram · cuenta `principal` · pendiente de aprobación

```
“Esa es parte del show”: Samulx sobre lo que dijo en el pesaje 🥊

A los que le reprochan que habló mucho antes de Stream Fighters 5, Samulx les responde que “obviamente lo tenía que decir”, admite que después perdió y remata: “esa es parte del show”.

¿Habló de más?

Crédito: Samulx, “ESTO PASÓ EN LOS CAMERINOS CON HERRERA DESPUES DE STREAM FIGTHERS 5 😯 ME JODÍ EL HOMBRO*”. Video original (minuto 1:37): https://youtu.be/GkojR4E0tuY?t=97

#Samulx #Willito #StreamFighters5 #LaGanga
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** Samulx responde a los que dicen que habló mucho en el pesaje

```
A los que le reprochan que habló mucho en el pesaje de Stream Fighters 5, Samulx les responde que “obviamente lo tenía que decir”, admite que después perdió y remata: “esa es parte del show”.

Crédito: Samulx, “ESTO PASÓ EN LOS CAMERINOS CON HERRERA DESPUES DE STREAM FIGTHERS 5 😯 ME JODÍ EL HOMBRO*”. Video original (minuto 1:37): https://youtu.be/GkojR4E0tuY?t=97

#Samulx #StreamFighters5 #LaGanga
```

**Etiquetas:** Samulx, Willito, Stream Fighters 5, pesaje, La Ganga, streamers, boxeo


## 45. `2026-11-13-cotorrisa-dicaprio-sandwich`

- **Gancho:** DiCaprio comió hígado crudo de bisonte
- **Puntaje:** 67 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-18 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-13-cotorrisa-dicaprio-sandwich/clip.mp4) (71,9 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-13-cotorrisa-dicaprio-sandwich/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=XUh-fUA_o30
- **Revisar antes de publicar:** Publicar lejos de cotorrisa-vinchi-dicaprio (ficha).

### TikTok · cuenta `risas` (@legion.risas) · aprobado automáticamente; en cola, sin hueco antes de su ventana (2026-11-18)

```
Critica a DiCaprio por exigente con el hígado de bisonte… y lo exhiben con las orillas del sándwich

¿Exigencia de actor o capricho?

Crédito: La Cotorrisa (Slobotzky y Ricardo Pérez; canal de Slobotzky en YouTube), “Episodio 399 - El doctor me sacó el jueguito de princesa”. Video original (minuto 39:29): https://youtu.be/XUh-fUA_o30?t=2369

#LaCotorrisa #DiCaprio #TheRevenant #Humor #Slobotzky
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
“Él en la película pidió que le quitaran las orillas a su sándwich”

En The Revenant le prepararon a DiCaprio un hígado de bisonte de gelatina y él pidió uno crudo y real. En La Cotorrisa lo critican por exagerado… hasta que sale a la luz quién pidió en su propia película que le quitaran las orillas al sándwich.

¿Exigencia de actor o capricho?

Crédito: La Cotorrisa (Slobotzky y Ricardo Pérez; canal de Slobotzky en YouTube), “Episodio 399 - El doctor me sacó el jueguito de princesa”. Video original (minuto 39:29): https://youtu.be/XUh-fUA_o30?t=2369

#LaCotorrisa #DiCaprio #TheRevenant #Humor #Slobotzky
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** DiCaprio, el hígado de bisonte y las orillas del sándwich | La Cotorrisa

```
En The Revenant, DiCaprio pidió un hígado de bisonte crudo y real en lugar del de gelatina. En La Cotorrisa lo critican por exagerado… hasta que sale a la luz quién pidió en su propia película que le quitaran las orillas al sándwich.

Crédito: La Cotorrisa (Slobotzky y Ricardo Pérez; canal de Slobotzky en YouTube), “Episodio 399 - El doctor me sacó el jueguito de princesa”. Video original (minuto 39:29): https://youtu.be/XUh-fUA_o30?t=2369

#LaCotorrisa #DiCaprio #TheRevenant #Humor
```

**Etiquetas:** La Cotorrisa, Slobotzky, Ricardo Pérez, Leonardo DiCaprio, The Revenant, hígado de bisonte, podcast de comedia, humor


## 46. `2026-11-17-samulx-cuerda-espalda`

- **Gancho:** Lo que más lo lastimó no fue la pelea
- **Puntaje:** 66 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-18 · **Línea:** urbano · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-samulx-cuerda-espalda/clip.mp4) (38,9 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-samulx-cuerda-espalda/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=GkojR4E0tuY
- **Revisar antes de publicar:** Se ven los raspones de la espalda (superficiales, los enseña él). Un pitido de la fuente como ***.

### TikTok · cuenta `principal` (Legión Urbana) · aprobado automáticamente; en cola, sin hueco antes de su ventana (2026-11-18)

```
Lo que más lastimó a Samulx en Stream Fighters 5 no fue la pelea 😂

“Parece que en esa pelea peleé contra Gatúbela”: la cuerda para bajarse del ring tenía puyas y en cada relevo con The Chanty se raspaba la espalda.

¿Qué habrías hecho con esa cuerda?

Crédito: Samulx, “ESTO PASÓ EN LOS CAMERINOS CON HERRERA DESPUES DE STREAM FIGTHERS 5 😯 ME JODÍ EL HOMBRO*”. Video original (minuto 15:08): https://youtu.be/GkojR4E0tuY?t=908

#Samulx #TheChanty #StreamFighters5 #Boxeo
```

### Instagram · cuenta `principal` · pendiente de aprobación

```
“Parece que en esa pelea peleé contra Gatúbela” 😂

Samulx enseña cómo le quedó la espalda tras Stream Fighters 5: no fueron los golpes, fue la cuerda para bajarse del ring, que “tenía puyas”. Con The Chanty rotaron “como 100 veces”, y en cada relevo se raspaba.

¿Qué habrías hecho con esa cuerda?

Crédito: Samulx, “ESTO PASÓ EN LOS CAMERINOS CON HERRERA DESPUES DE STREAM FIGTHERS 5 😯 ME JODÍ EL HOMBRO*”. Video original (minuto 15:08): https://youtu.be/GkojR4E0tuY?t=908

#Samulx #TheChanty #StreamFighters5 #Boxeo
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** Samulx enseña cómo le quedó la espalda tras Stream Fighters 5

```
Samulx enseña cómo le quedó la espalda tras Stream Fighters 5: no fueron los golpes, fue la cuerda para bajarse del ring, en cada uno de los relevos con The Chanty.

Crédito: Samulx, “ESTO PASÓ EN LOS CAMERINOS CON HERRERA DESPUES DE STREAM FIGTHERS 5 😯 ME JODÍ EL HOMBRO*”. Video original (minuto 15:08): https://youtu.be/GkojR4E0tuY?t=908

#Samulx #TheChanty #StreamFighters5
```

**Etiquetas:** Samulx, The Chanty, Stream Fighters 5, ring, pelea por parejas, streamers, humor, boxeo


## 47. `2026-11-17-westcol-boxeo-aburrido`

- **Gancho:** Westcol: entre más profesional, más aburrido el boxeo
- **Puntaje:** 76 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-19 · **Línea:** urbano · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-westcol-boxeo-aburrido/clip.mp4) (45,1 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-westcol-boxeo-aburrido/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=YQ-vOO3-Ghk
- **Revisar antes de publicar:** Opinión que puede molestar a la afición del boxeo (es justo lo que da debate). Dos pitidos de la fuente como ***.

### TikTok · cuenta `principal` (Legión Urbana) · aprobado automáticamente; en cola (previsto 19-nov)

```
Westcol: “el boxeo entre más profesional, más aburrido se vuelve” 🥊

Peleas de 12 rounds en las que “juegan demasiado safe”, sin noqueo ni caída. Para él, la gente busca otra cosa.

¿Tiene razón Westcol?

Crédito: WestCOL, “¿Que pasara con HERRERA por bajar de la pelea en STREAM FIGHTERS 5?| Westcol”. Video original (minuto 15:53): https://youtu.be/YQ-vOO3-Ghk?t=953

#Westcol #Boxeo #StreamFighters5 #LaGanga
```

### Instagram · cuenta `principal` · pendiente de aprobación

```
La opinión de Westcol que va a dividir a los fans del boxeo 🥊

Tras Stream Fighters 5, Westcol dice que “el boxeo entre más profesional, más aburrido se vuelve”: peleas de 12 rounds en las que “juegan demasiado safe” y al final “no hay un noqueo, no hay una caída”.

¿Tiene razón Westcol?

Crédito: WestCOL, “¿Que pasara con HERRERA por bajar de la pelea en STREAM FIGHTERS 5?| Westcol”. Video original (minuto 15:53): https://youtu.be/YQ-vOO3-Ghk?t=953

#Westcol #Boxeo #StreamFighters5 #LaGanga
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** Westcol explica por qué el boxeo profesional le aburre

```
Tras Stream Fighters 5, Westcol da su opinión sobre el boxeo profesional: peleas de 12 rounds “demasiado safe”, sin noqueos ni caídas. Es su opinión, y abre el debate.

Crédito: WestCOL, “¿Que pasara con HERRERA por bajar de la pelea en STREAM FIGHTERS 5?| Westcol”. Video original (minuto 15:53): https://youtu.be/YQ-vOO3-Ghk?t=953

#Westcol #Boxeo #StreamFighters5
```

**Etiquetas:** Westcol, boxeo, boxeo profesional, Stream Fighters 5, opinión, streamers, La Ganga, noqueo


## 48. `2026-11-17-ganga-robot-precio`

- **Gancho:** ¿Cuánto cuesta un robot de Stream Fighters?
- **Puntaje:** 74 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-19 · **Línea:** urbano · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-ganga-robot-precio/clip.mp4) (55,5 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-ganga-robot-precio/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=s1betCsTVVE
- **Revisar antes de publicar:** Escúchalo antes: hablan varios y la imagen no deja asegurar quién dice cada frase. Los textos no le atribuyen la cifra a nadie (la ficha proponía «La Ganga da la cifra»). Las cifras van sin moneda, como se oyen; un tramo como (…).

### TikTok · cuenta `principal` (Legión Urbana) · aprobado automáticamente; en cola (previsto 19-nov, después de escucharlo)

```
¿Cuánto cuesta un robot como los de Stream Fighters? 🤖💸

En el set de Westcol con Lonche y La Ganga cuentan cómo funciona (copia en tiempo real lo que hace una persona, “modo espejo”) y sueltan la cifra: “Traerlo acá a Colombia, 80.000”.

¿Pagarías eso por un robot?

Crédito: LoncheWey, “HABLANDO de MI PELEA en COLOMBIA con LA GANGA | LONCHE”. Video original (minuto 34:30): https://youtu.be/s1betCsTVVE?t=2070

#StreamFighters5 #Westcol #Lonche #LaGanga #Robots
```

### Instagram · cuenta `principal` · pendiente de aprobación

```
“Traerlo acá a Colombia, 80.000”: lo que cuesta un robot como los de Stream Fighters 🤖

Tras Stream Fighters 5, en el set de Westcol con Lonche y La Ganga, cuentan cómo funcionan los robots que compraron en China (copian en tiempo real lo que hace una persona, “modo espejo”), hablan de un evento solo de robots y dan la cifra: 60.000 en China y 20.000 más por traerlo.

¿Pagarías eso por un robot?

Crédito: LoncheWey, “HABLANDO de MI PELEA en COLOMBIA con LA GANGA | LONCHE”. Video original (minuto 34:30): https://youtu.be/s1betCsTVVE?t=2070

#StreamFighters5 #Westcol #Lonche #LaGanga #Robots
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** Cuánto cuesta un robot como los de Stream Fighters 5

```
En el set de Westcol, con Lonche y La Ganga, cuentan cómo funcionan los robots que compraron en China, hablan de un evento solo de robots (“Steel Fighters”) y dan la cifra: “Traerlo acá a Colombia, 80.000”. No dicen la moneda.

Crédito: LoncheWey, “HABLANDO de MI PELEA en COLOMBIA con LA GANGA | LONCHE”. Video original (minuto 34:30): https://youtu.be/s1betCsTVVE?t=2070

#StreamFighters5 #Westcol #Lonche #Robots
```

**Etiquetas:** Stream Fighters 5, robots, Westcol, Lonche, La Ganga, robot boxeador, Steel Fighters, streamers


## 49. `2026-11-17-hh-aeropuerto-4am`

- **Gancho:** Los citaron a las 4 am en el aeropuerto
- **Puntaje:** 74 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-19 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-hh-aeropuerto-4am/clip.mp4) (57,5 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-hh-aeropuerto-4am/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=qDAqPW70T7c
- **Revisar antes de publicar:** Lenguaje fuerte («reconcha de su madre»). El productor no se ve ni se nombra: al publicar, tampoco.

### TikTok · cuenta `risas` (@legion.risas) · aprobado automáticamente; en cola (previsto 19-nov)

```
Los llevaron al aeropuerto a las 4 am… el vuelo era a las 9 😂

“¿Y qué hora es?” “Son las 4:15.” Hablando Huevadas y el productor recién ascendido que los hizo madrugar.

Etiqueta al amigo que siempre llega 5 horas antes

Crédito: Hablando Huevadas (Ricardo Mendoza y Jorge Luna), “HABLANDO HUEVADAS - Décimotercera Temporada [BAILA YAHAIRA BAILA]”. Video original (minuto 44:55): https://youtu.be/qDAqPW70T7c?t=2695

#HablandoHuevadas #JorgeLuna #RicardoMendoza #Comedia
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
“¿Y qué hora es?” “Son las 4:15” ✈️😂

En su show de El Salvador, Hablando Huevadas cuenta cómo el productor al que acababan de ascender los hizo salir hacia el aeropuerto a las 4 de la mañana. Ya en la sala VIP: “Chicos, su avión sale a las 9 de la mañana”.

Etiqueta al amigo que siempre llega 5 horas antes

Crédito: Hablando Huevadas (Ricardo Mendoza y Jorge Luna), “HABLANDO HUEVADAS - Décimotercera Temporada [BAILA YAHAIRA BAILA]”. Video original (minuto 44:55): https://youtu.be/qDAqPW70T7c?t=2695

#HablandoHuevadas #JorgeLuna #RicardoMendoza #Comedia
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** Hablando Huevadas y el productor que los hizo madrugar 5 horas

```
En su show de El Salvador, Hablando Huevadas cuenta cómo su productor recién ascendido los llevó al aeropuerto a las 4 de la mañana… para un vuelo de las 9.

Crédito: Hablando Huevadas (Ricardo Mendoza y Jorge Luna), “HABLANDO HUEVADAS - Décimotercera Temporada [BAILA YAHAIRA BAILA]”. Video original (minuto 44:55): https://youtu.be/qDAqPW70T7c?t=2695

#HablandoHuevadas #JorgeLuna #RicardoMendoza #Comedia
```

**Etiquetas:** Hablando Huevadas, Jorge Luna, Ricardo Mendoza, comedia peruana, El Salvador, aeropuerto, stand-up, humor


## 50. `2026-11-17-cotorrisa-suite-karol-g`

- **Gancho:** La suite de Karol G, a un volado
- **Puntaje:** 72 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-19 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-cotorrisa-suite-karol-g/clip.mp4) (39,6 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-cotorrisa-suite-karol-g/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=VzE65NyXqb8
- **Revisar antes de publicar:** Karol G no sale: es lo que ellos cuentan del hotel; no añadas nada. Cuenta la anécdota el de sudadera roja (no se nombra). Una palabra como (…).

### TikTok · cuenta `risas` (@legion.risas) · aprobado automáticamente; en cola (previsto 19-nov)

```
Karol G dejó la suite presidencial… y La Cotorrisa se la jugó a un volado 😂

Según cuentan, en su hotel de Monterrey Karol G pidió algo “más en casita”. Y el que lo cuenta volvió a perder: “llevo como cinco volados perdidos”.

¿Cara o cruz?

Crédito: La Cotorrisa (Ricardo Pérez y Slobotzky; canal de Ricardo Pérez en YouTube), “Episodio 378 - Somos portada de GQ”. Video original (minuto 4:01): https://youtu.be/VzE65NyXqb8?t=241

#LaCotorrisa #KarolG #RicardoPerez #Slobotzky #Comedia
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
La suite que dejó Karol G, a un volado 🪙😂

En La Cotorrisa cuentan que, en su hotel de Monterrey, Karol G pidió cambiar la habitación presidencial por una suite “más en casita”. Ellos se la jugaron a un volado… y el que lo cuenta volvió a perder: “llevo como cinco volados perdidos”.

¿Cara o cruz?

Crédito: La Cotorrisa (Ricardo Pérez y Slobotzky; canal de Ricardo Pérez en YouTube), “Episodio 378 - Somos portada de GQ”. Video original (minuto 4:01): https://youtu.be/VzE65NyXqb8?t=241

#LaCotorrisa #KarolG #RicardoPerez #Slobotzky #Comedia
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** La Cotorrisa y la suite que dejó Karol G en Monterrey

```
Según cuentan en La Cotorrisa, en su hotel de Monterrey Karol G pidió cambiar su habitación presidencial por algo “más en casita”. Ellos se la jugaron a un volado… y uno de los dos volvió a perder.

Crédito: La Cotorrisa (Ricardo Pérez y Slobotzky; canal de Ricardo Pérez en YouTube), “Episodio 378 - Somos portada de GQ”. Video original (minuto 4:01): https://youtu.be/VzE65NyXqb8?t=241

#LaCotorrisa #KarolG #Comedia
```

**Etiquetas:** La Cotorrisa, Ricardo Pérez, Slobotzky, Karol G, Monterrey, volado, podcast de comedia, humor


## 51. `2026-11-17-hh-colada-bano`

- **Gancho:** Se coló al show escondida en el baño
- **Puntaje:** 72 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-19 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-hh-colada-bano/clip.mp4) (64,6 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-hh-colada-bano/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=qDAqPW70T7c
- **Revisar antes de publicar:** Persona privada que cuenta su historia por voluntad propia y con la cara cubierta: no añadas datos. Broma escatológica suave. El desenlace es hh-colada-tres-minutos: publícalo después (ficha).

### TikTok · cuenta `risas` (@legion.risas) · aprobado automáticamente; en cola (previsto 19-nov)

```
Se escondió 2 horas en el baño para colarse al show 😂

Sin entrada, llegó a las 4 de la tarde y terminó indicándole a la gente: “el baño de los hombres está allá”.

¿Hasta dónde llegarías por ver a tu comediante favorito?

Crédito: Hablando Huevadas (Ricardo Mendoza y Jorge Luna), “HABLANDO HUEVADAS - Décimotercera Temporada [BAILA YAHAIRA BAILA]”. Video original (minuto 1:35:45): https://youtu.be/qDAqPW70T7c?t=5745

#HablandoHuevadas #ElSalvador #Comedia #JorgeLuna #RicardoMendoza
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
“El baño de los hombres está allá”: así se coló al show 😂

Sin entrada y sin confiar en la reventa, una fan se escondió dos horas en el baño del teatro y, diez minutos antes del show, se puso en la puerta a guiar al público como si trabajara ahí. Lo contó en el escenario de Hablando Huevadas en El Salvador… y el público lo confirma.

¿Hasta dónde llegarías por ver a tu comediante favorito?

Crédito: Hablando Huevadas (Ricardo Mendoza y Jorge Luna), “HABLANDO HUEVADAS - Décimotercera Temporada [BAILA YAHAIRA BAILA]”. Video original (minuto 1:35:45): https://youtu.be/qDAqPW70T7c?t=5745

#HablandoHuevadas #ElSalvador #Comedia #JorgeLuna #RicardoMendoza
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** La fan que se coló a Hablando Huevadas escondida en el baño

```
Sin entrada y sin confiar en la reventa, una fan se escondió dos horas en el baño del teatro y terminó guiando al público como si trabajara ahí. Lo contó en el escenario de Hablando Huevadas en El Salvador.

Crédito: Hablando Huevadas (Ricardo Mendoza y Jorge Luna), “HABLANDO HUEVADAS - Décimotercera Temporada [BAILA YAHAIRA BAILA]”. Video original (minuto 1:35:45): https://youtu.be/qDAqPW70T7c?t=5745

#HablandoHuevadas #ElSalvador #Comedia
```

**Etiquetas:** Hablando Huevadas, Jorge Luna, Ricardo Mendoza, El Salvador, colarse, stand-up, comedia peruana, humor


## 52. `2026-11-17-hh-estafa-reventa`

- **Gancho:** Pagó la mitad por si era estafa
- **Puntaje:** 72 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-19 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-hh-estafa-reventa/clip.mp4) (46,2 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-hh-estafa-reventa/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=qDAqPW70T7c
- **Revisar antes de publicar:** Míralo antes: junto a la fan aparece un joven (su hijo, según ella). Si parece menor de edad, no lo publiques (o pide al Clipero recortar la entrada a partir del segundo 4). La fan es una persona privada que participa en el show por voluntad propia: no añadas su nombre ni datos.

### TikTok · cuenta `risas` (@legion.risas) · aprobado automáticamente; en cola (previsto 19-nov)

```
Pagaron la mitad por si era estafa… y aun así le quedaron debiendo 😂

En el show de Hablando Huevadas en El Salvador, una fan cuenta cómo compró su familia las entradas de reventa. En el escenario hacen las cuentas: “Me parece que lo han estafado al señor”.

¿Quién estafó a quién?

Crédito: Hablando Huevadas (Ricardo Mendoza y Jorge Luna), “HABLANDO HUEVADAS - Décimotercera Temporada [BAILA YAHAIRA BAILA]”. Video original (minuto 6:03): https://youtu.be/qDAqPW70T7c?t=363

#HablandoHuevadas #ElSalvador #Reventa #Comedia
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
“Me parece que lo han estafado al señor” 😂

En el show de Hablando Huevadas en El Salvador, una fan cuenta que su familia compró entradas de reventa, pero pagó solo la mitad “por si era estafa”… y lo era. En el escenario hacen las cuentas y el estafado termina siendo otro.

¿Quién estafó a quién?

Crédito: Hablando Huevadas (Ricardo Mendoza y Jorge Luna), “HABLANDO HUEVADAS - Décimotercera Temporada [BAILA YAHAIRA BAILA]”. Video original (minuto 6:03): https://youtu.be/qDAqPW70T7c?t=363

#HablandoHuevadas #ElSalvador #Reventa #Comedia
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** Hablando Huevadas hace las cuentas de una estafa de reventa

```
En el show de Hablando Huevadas en El Salvador, una fan cuenta que a su familia la estafaron con entradas de reventa, aunque solo pagaron la mitad “por si era estafa”. En el escenario hacen las cuentas.

Crédito: Hablando Huevadas (Ricardo Mendoza y Jorge Luna), “HABLANDO HUEVADAS - Décimotercera Temporada [BAILA YAHAIRA BAILA]”. Video original (minuto 6:03): https://youtu.be/qDAqPW70T7c?t=363

#HablandoHuevadas #ElSalvador #Comedia
```

**Etiquetas:** Hablando Huevadas, Jorge Luna, Ricardo Mendoza, El Salvador, reventa, estafa, comedia peruana, humor


## 53. `2026-11-17-hh-colada-tres-minutos`

- **Gancho:** Se coló al show y duró 3 minutos
- **Puntaje:** 71 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-19 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-hh-colada-tres-minutos/clip.mp4) (61,4 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-hh-colada-tres-minutos/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=qDAqPW70T7c
- **Revisar antes de publicar:** Persona privada, con la cara cubierta: no añadas datos. Es el desenlace de hh-colada-bano: va después.

### TikTok · cuenta `risas` (@legion.risas) · aprobado automáticamente; en cola, sin hueco antes de su ventana (2026-11-19)

```
Se coló al show de Hablando Huevadas… y duró 3 minutos 😂

“Su pulsera, su pulsera”… y no tenía. Y encima está de acuerdo en ascender a quien la sacó.

¿La dejarían entrar?

Crédito: Hablando Huevadas (Ricardo Mendoza y Jorge Luna), “HABLANDO HUEVADAS - Décimotercera Temporada [BAILA YAHAIRA BAILA]”. Video original (minuto 1:37:14): https://youtu.be/qDAqPW70T7c?t=5834

#HablandoHuevadas #ElSalvador #Comedia #JorgeLuna #RicardoMendoza
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
“¿Consideras que lo debo ascender?” “Sí.” 😂

El final de la historia de la fan que se coló al show de Hablando Huevadas en El Salvador: entró cuando empezaba, “recién estaban en las reglas”, y a los 3 minutos le pidieron la pulsera. Y del que la sacó, solo tiene buenas palabras.

¿La dejarían entrar?

Crédito: Hablando Huevadas (Ricardo Mendoza y Jorge Luna), “HABLANDO HUEVADAS - Décimotercera Temporada [BAILA YAHAIRA BAILA]”. Video original (minuto 1:37:14): https://youtu.be/qDAqPW70T7c?t=5834

#HablandoHuevadas #ElSalvador #Comedia #JorgeLuna #RicardoMendoza
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** La fan que se coló a Hablando Huevadas y la sacaron en 3 minutos

```
El final de la historia de la fan que se coló al show de Hablando Huevadas en El Salvador: vio 3 minutos antes de que le pidieran la pulsera. Y hasta está de acuerdo en ascender a quien la sacó.

Crédito: Hablando Huevadas (Ricardo Mendoza y Jorge Luna), “HABLANDO HUEVADAS - Décimotercera Temporada [BAILA YAHAIRA BAILA]”. Video original (minuto 1:37:14): https://youtu.be/qDAqPW70T7c?t=5834

#HablandoHuevadas #ElSalvador #Comedia
```

**Etiquetas:** Hablando Huevadas, Jorge Luna, Ricardo Mendoza, El Salvador, colarse, stand-up, comedia peruana, humor


## 54. `2026-11-17-hh-temblor-hijos`

- **Gancho:** Lo que descubrió durante un temblor
- **Puntaje:** 69 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-19 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-hh-temblor-hijos/clip.mp4) (55,3 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-hh-temblor-hijos/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=qDAqPW70T7c
- **Revisar antes de publicar:** Cuenta la anécdota el de camiseta negra y la ficha no dice cuál de los dos es: no lo nombres al publicar. El temblor no causó víctimas; la broma es sobre su egoísmo. Nombra a sus hijos sin mostrarlos.

### TikTok · cuenta `risas` (@legion.risas) · aprobado automáticamente; en cola, sin hueco antes de su ventana (2026-11-19)

```
Un temblor le enseñó que tiene hijos 😂

“Fue la primera vez que pensé en 36 años en alguien que no sea yo”… hasta que el niño empezó a pesar.

Papás: ¿les ha pasado?

Crédito: Hablando Huevadas (Ricardo Mendoza y Jorge Luna), “HABLANDO HUEVADAS - Décimotercera Temporada [BAILA YAHAIRA BAILA]”. Video original (minuto 1:15:01): https://youtu.be/qDAqPW70T7c?t=4501

#HablandoHuevadas #Paternidad #Comedia
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
“Fue la primera vez que pensé en 36 años en alguien que no sea yo” 😂

En el show de Hablando Huevadas en El Salvador, uno de los dos cuenta lo que le pasó durante un temblor fuerte en Lima, de madrugada: cargó a su hijo mayor y salieron a un sitio seguro… hasta que pasó el susto y el niño ya pesaba “sus 18, 20 kg”.

Papás: ¿les ha pasado?

Crédito: Hablando Huevadas (Ricardo Mendoza y Jorge Luna), “HABLANDO HUEVADAS - Décimotercera Temporada [BAILA YAHAIRA BAILA]”. Video original (minuto 1:15:01): https://youtu.be/qDAqPW70T7c?t=4501

#HablandoHuevadas #Paternidad #Comedia
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** El papá que descubrió a sus hijos en pleno temblor | Hablando Huevadas

```
En el show de Hablando Huevadas en El Salvador, uno de los dos cuenta lo que le enseñó un temblor en Lima: por primera vez en 36 años pensar en alguien más… hasta que el niño empezó a pesar. El temblor no dejó víctimas: el chiste es sobre su egoísmo.

Crédito: Hablando Huevadas (Ricardo Mendoza y Jorge Luna), “HABLANDO HUEVADAS - Décimotercera Temporada [BAILA YAHAIRA BAILA]”. Video original (minuto 1:15:01): https://youtu.be/qDAqPW70T7c?t=4501

#HablandoHuevadas #Paternidad #Comedia
```

**Etiquetas:** Hablando Huevadas, Jorge Luna, Ricardo Mendoza, paternidad, temblor, Lima, comedia peruana, humor


## 55. `2026-11-17-cotorrisa-paloma-medalla`

- **Gancho:** A una paloma le dieron medalla de guerra
- **Puntaje:** 68 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-19 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-cotorrisa-paloma-medalla/clip.mp4) (48,3 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-cotorrisa-paloma-medalla/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=VzE65NyXqb8
- **Revisar antes de publicar:** Pitidos de la fuente como ***. Sale la foto de archivo de la paloma condecorada.

### TikTok · cuenta `risas` (@legion.risas) · aprobado automáticamente; en cola, sin hueco antes de su ventana (2026-11-19)

```
Le dieron una medalla de guerra a una paloma… y La Cotorrisa tiene dudas 😂

La echas a volar “y no tiene contemplado ese peso”. Mejor, “el alpiste de honor”.

¿Qué premio le darías tú?

Crédito: La Cotorrisa (Ricardo Pérez y Slobotzky; canal de Ricardo Pérez en YouTube), “Episodio 378 - Somos portada de GQ”. Video original (minuto 43:02): https://youtu.be/VzE65NyXqb8?t=2582

#LaCotorrisa #RicardoPerez #Slobotzky #Comedia #Historia
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
“Lo mejor que le podrían dar es el alpiste de honor” 🕊️😂

En la sección de efemérides de La Cotorrisa, la paloma mensajera condecorada en 1946 por la Segunda Guerra Mundial. Su duda: la medalla le estorba, “la echas a volar y no tiene contemplado ese peso”.

¿Qué premio le darías tú?

Crédito: La Cotorrisa (Ricardo Pérez y Slobotzky; canal de Ricardo Pérez en YouTube), “Episodio 378 - Somos portada de GQ”. Video original (minuto 43:02): https://youtu.be/VzE65NyXqb8?t=2582

#LaCotorrisa #RicardoPerez #Slobotzky #Comedia #Historia
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** La Cotorrisa y la paloma con medalla de la Segunda Guerra Mundial

```
En la sección de efemérides de La Cotorrisa, la historia de la paloma mensajera condecorada en la Segunda Guerra Mundial. Su propuesta: en vez de medalla, alpiste de honor.

Crédito: La Cotorrisa (Ricardo Pérez y Slobotzky; canal de Ricardo Pérez en YouTube), “Episodio 378 - Somos portada de GQ”. Video original (minuto 43:02): https://youtu.be/VzE65NyXqb8?t=2582

#LaCotorrisa #Historia #Comedia
```

**Etiquetas:** La Cotorrisa, Ricardo Pérez, Slobotzky, paloma mensajera, Segunda Guerra Mundial, efemérides, podcast de comedia, humor


## 56. `2026-11-17-cotorrisa-refri-papas`

- **Gancho:** Hoy es el día de limpiar el refri
- **Puntaje:** 67 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-19 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-cotorrisa-refri-papas/clip.mp4) (58,4 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-cotorrisa-refri-papas/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=VzE65NyXqb8
- **Revisar antes de publicar:** Habla sobre todo el de sudadera roja (no se nombra). Tres palabras como (…).

### TikTok · cuenta `risas` (@legion.risas) · aprobado automáticamente; en cola, sin hueco antes de su ventana (2026-11-19)

```
El refri de tus papás tiene cosas de restaurantes que ya no existen 😂

Salsas de 2023 y la excusa de siempre: “el atún en la Segunda Guerra Mundial duraba más”… y lo vuelves a poner.

Etiqueta a quien tiene el refri así

Crédito: La Cotorrisa (Ricardo Pérez y Slobotzky; canal de Ricardo Pérez en YouTube), “Episodio 378 - Somos portada de GQ”. Video original (minuto 51:24): https://youtu.be/VzE65NyXqb8?t=3084

#LaCotorrisa #RicardoPerez #Slobotzky #Comedia
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
“Hoy es el día de limpiar el refrigerador” 😂

En La Cotorrisa, limpiar el refri de los papás se vuelve una intervención: “tienen cosas ahí de restaurantes que ya no existen”, salsas de 2023 y la excusa para no tirar nada: “el atún en la Segunda Guerra Mundial duraba más”.

Etiqueta a quien tiene el refri así

Crédito: La Cotorrisa (Ricardo Pérez y Slobotzky; canal de Ricardo Pérez en YouTube), “Episodio 378 - Somos portada de GQ”. Video original (minuto 51:24): https://youtu.be/VzE65NyXqb8?t=3084

#LaCotorrisa #RicardoPerez #Slobotzky #Comedia
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** La Cotorrisa y el refrigerador de los papás

```
En La Cotorrisa, el “día de limpiar el refrigerador” se convierte en intervención familiar: salsas de 2023, comida de restaurantes que ya cerraron y la excusa de siempre para no tirar nada.

Crédito: La Cotorrisa (Ricardo Pérez y Slobotzky; canal de Ricardo Pérez en YouTube), “Episodio 378 - Somos portada de GQ”. Video original (minuto 51:24): https://youtu.be/VzE65NyXqb8?t=3084

#LaCotorrisa #Comedia #Humor
```

**Etiquetas:** La Cotorrisa, Ricardo Pérez, Slobotzky, refrigerador, papás, podcast de comedia, comedia mexicana, humor


## 57. `2026-11-17-hh-lluvia-lima`

- **Gancho:** Un peruano descubre la lluvia de verdad
- **Puntaje:** 66 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-19 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-hh-lluvia-lima/clip.mp4) (46,2 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-hh-lluvia-lima/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=qDAqPW70T7c
- **Revisar antes de publicar:** Se corta antes de la mención a Bukele (política de El Salvador).

### TikTok · cuenta `risas` (@legion.risas) · aprobado automáticamente; en cola, sin hueco antes de su ventana (2026-11-19)

```
En Lima, cuando va a llover… no llueve 😂

Hablando Huevadas descubre lo que es una tormenta de verdad en El Salvador: “Dios dice: ¿y si mando lluvia? Uy, me lo pasé”.

¿Cómo llueve en tu ciudad?

Crédito: Hablando Huevadas (Ricardo Mendoza y Jorge Luna), “HABLANDO HUEVADAS - Décimotercera Temporada [BAILA YAHAIRA BAILA]”. Video original (minuto 0:41): https://youtu.be/qDAqPW70T7c?t=41

#HablandoHuevadas #Lima #ElSalvador #Comedia
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
“Dios dice: ¿y si mando lluvia? Uy, me lo pasé” 🌧️😂

Recién llegados a El Salvador, en Hablando Huevadas descubren lo que es una tormenta de verdad. En Lima, dicen, con dos gotas ya es lluvia.

¿Cómo llueve en tu ciudad?

Crédito: Hablando Huevadas (Ricardo Mendoza y Jorge Luna), “HABLANDO HUEVADAS - Décimotercera Temporada [BAILA YAHAIRA BAILA]”. Video original (minuto 0:41): https://youtu.be/qDAqPW70T7c?t=41

#HablandoHuevadas #Lima #ElSalvador #Comedia
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** Hablando Huevadas contra la tormenta de El Salvador

```
Recién llegados a El Salvador, en Hablando Huevadas descubren lo que es una tormenta de verdad. En Lima, dicen, con dos gotas ya es lluvia.

Crédito: Hablando Huevadas (Ricardo Mendoza y Jorge Luna), “HABLANDO HUEVADAS - Décimotercera Temporada [BAILA YAHAIRA BAILA]”. Video original (minuto 0:41): https://youtu.be/qDAqPW70T7c?t=41

#HablandoHuevadas #Lima #Comedia
```

**Etiquetas:** Hablando Huevadas, Jorge Luna, Ricardo Mendoza, Lima, El Salvador, lluvia, comedia peruana, humor


## 58. `2026-11-17-westcol-show-kris-r`

- **Gancho:** Westcol sobre el show de Kris R
- **Puntaje:** 68 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-20 · **Línea:** urbano · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-westcol-show-kris-r/clip.mp4) (34,2 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-westcol-show-kris-r/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=YQ-vOO3-Ghk
- **Revisar antes de publicar:** Kris R no sale: habla Westcol. No suena música de Kris R. Dos palabras como (…).

### TikTok · cuenta `principal` (Legión Urbana) · aprobado automáticamente; en cola (previsto 19-nov, en la previa del concierto de Kris R del 20-nov)

```
Westcol: “Kris R para muchos fue el mejor show de la noche” 🎤🔥

Le agradece por ir a Stream Fighters 5 y cuenta que pasó de peleador a artista oficial del evento.

¿Fue el mejor show de la noche?

Crédito: WestCOL, “¿Que pasara con HERRERA por bajar de la pelea en STREAM FIGHTERS 5?| Westcol”. Video original (minuto 3:16): https://youtu.be/YQ-vOO3-Ghk?t=196

#KrisR #Westcol #StreamFighters5 #MusicaUrbana
```

### Instagram · cuenta `principal` · pendiente de aprobación

```
De peleador a artista oficial: Westcol sobre Kris R 🎤

Tras Stream Fighters 5, Westcol le agradece a Kris R “de verdad de corazón”: “para muchos fue el mejor show de la noche” y “pasó de ser peleador a ser artista oficial de Stream Fighters”. Kris R toca el viernes 20-nov en el DAVIarena.

¿Fue el mejor show de la noche?

Crédito: WestCOL, “¿Que pasara con HERRERA por bajar de la pelea en STREAM FIGHTERS 5?| Westcol”. Video original (minuto 3:16): https://youtu.be/YQ-vOO3-Ghk?t=196

#KrisR #Westcol #StreamFighters5 #MusicaUrbana
```

### YouTube · cuenta `principal` · pendiente de aprobación

**Título:** Westcol habla del show de Kris R en Stream Fighters 5

```
Tras Stream Fighters 5, Westcol agradece a Kris R: “para muchos fue el mejor show de la noche” y “pasó de ser peleador a ser artista oficial de Stream Fighters”. Kris R toca el viernes 20-nov en el DAVIarena.

Crédito: WestCOL, “¿Que pasara con HERRERA por bajar de la pelea en STREAM FIGHTERS 5?| Westcol”. Video original (minuto 3:16): https://youtu.be/YQ-vOO3-Ghk?t=196

#KrisR #Westcol #StreamFighters5
```

**Etiquetas:** Kris R, Westcol, Stream Fighters 5, música urbana, concierto, DAVIarena, streamers


## Comandos

- Aprobar un clip en todas sus plataformas: `/publicador aprobar <clip-id>` (por ejemplo, `/publicador aprobar 2026-11-10-cotorrisa-yordi-tacto`).
- Aprobar una sola plataforma: `/publicador aprobar <clip-id>:<plataforma>` (por ejemplo, `/publicador aprobar 2026-11-10-cotorrisa-yordi-tacto:youtube`).
- Aprobar todo lo pendiente: `/publicador aprobar todo` (Instagram y YouTube siguen sin activar: solo deja los envíos listos).
- Rechazar: `/publicador rechazar <clip-id> <motivo>`, o `/publicador rechazar <clip-id>:<plataforma> <motivo>` para una sola plataforma (con `:tiktok`, el clip deja de ir a la bandeja).
