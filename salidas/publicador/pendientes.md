# Pendientes del Publicador

Generado: 2026-11-19T23:02:57-05:00 · ciclo 12 · entrada: `salidas/clipero/clips.json` (ciclo 18 del Clipero, generado el 2026-11-18 a las 01:50): 4 clips nuevos, 2 urbanos y 2 de risas.

**Cómo leer esta página**

- **Este ciclo llegó tarde.** Empezó el 18-nov a la 01:45, fuera del horario (08:00-23:00), se quedó colgado y no se retomó hasta las 22:57 del 19-nov. **El 18-nov no se mandó nada a TikTok** y la cola de ese día venció:
  - Los 8 previstos para el 18-nov: `cotorrisa-vinchi-dicaprio`, `jhovanoty-faja-disfraz`, `westcol-daren-mentiroso`, `lonche-cinco-lesiones`, `samulx-prueba-antidoping`, `samulx-camerino-robado`, `nsn-telefono-infancia`, `tirandobola-luz-experiencias`.
  - Y otros 15 que ya no tenían hueco. Si quieres alguno igualmente: `/publicador aprobar <clip-id>:tiktok`.
- **TikTok, hoy (22:58-22:59):** 6 borradores nuevos, los que vencían hoy. Están en la bandeja de su cuenta y no son públicos hasta que los publicas desde la app. La API solo manda el video: al publicarlo, **pega el texto de TikTok** de su sección.
  - `westcol-boxeo-aburrido` → `principal`
  - `hh-aeropuerto-4am` → `risas`
  - `ganga-robot-precio` → `principal`
  - `hh-colada-bano` → `risas`
  - `hh-estafa-reventa` → `risas`
  - `cotorrisa-suite-karol-g` → `risas`
  - Cada clip nuevo se aprueba solo y va como borrador. Para que uno no llegue a la bandeja: `/publicador rechazar <clip-id>:tiktok <motivo>`.
- **Caso Herrera** (pasa a lo legal; Cazador Urbano, 17-nov). Nada se reabre:
  - **`westcol-disculpa-pelea-jh` está en la bandeja de Legión Urbana: no lo publiques.** Descártalo desde la app (la API no puede borrarlo).
  - **`westcol-herrera-no-planeado`:** el envío del 17-nov dio HTTP 500 y no se sabe si llegó. No se reintenta: si está en la bandeja, descártalo.
- **Bandeja según la API: 50 borradores sin publicar** (27 en `principal` y 23 en `risas`). 43 tienen la ventana cerrada (tabla al final del resumen) y 6 vencen hoy. **Publica o descarta** desde la app los que ya no quieras.
- **Plan de TikTok** (4 borradores al día por cuenta, primero la ventana más cercana y después el puntaje). Todo cabe antes de su ventana:
  - **`principal`, 20-nov:** `ganga-guarida-toretto`, `ganga-bienvenida-piscina` (después de verlo entero) y `westcol-show-kris-r` (día del concierto de Kris R). Publica los dos de La Ganga a horas distintas.
  - **`risas`, 20-nov:** `culpa-marin-despide-quevedo`, `luciernaga-imitadores-iva`, `culpa-mama-carrazo` y `renona-checo-dinosaurios`. Publica los dos de La Culpa separados.
  - **`risas`, 21-nov:** `olga-agua-mostaza` y `juanpis-pestilencia-juicio-tv`.
  - **Se quedan fuera** (vencen hoy, la cuenta `risas` ya lleva 4 de 4): `hh-colada-tres-minutos`, `hh-temblor-hijos`, `cotorrisa-paloma-medalla`, `cotorrisa-refri-papas` y `hh-lluvia-lima`.
- **Instagram y YouTube:** pendientes de aprobación. Siguen sin activar y sin credenciales: aprobar ahora solo deja el envío listo.
  - **YouTube tiene ahora un canal por línea** (cambio de Santiago del 17-nov): los urbanos van a `principal` (Legión Urbana) y los de risas a `risas` (Legión de Risas, apagado hasta que lo autorices). Las entradas de risas que estaban en `principal` pasan a `risas`, también en su envío.
  - **En YouTube lo aprobado sale público** al subirse (`youtube.privacidad: public`; Google ya no deja privado lo que suben los proyectos sin auditar). Antes salía privado.
  - En Instagram, los urbanos van a `principal` y los de risas a la cuenta `risas` (apagada), nunca a la urbana.
  - Las 22 pendientes con ventana hasta hoy (11 clips) vencen al acabar el día.
- **Clips subidos a mano** (`legion/03-publicador/subidos-a-mano.json`): no aparecen aquí.
- **Derechos:** todos los clips de esta página son `sin_verificar`: contenido de terceros sin permiso confirmado. Solo se publica con aprobación expresa (en TikTok, tu publicación desde la bandeja) y siempre con el crédito a la fuente. Riesgos: reclamaciones de Content ID (los ingresos pasan al titular), bloqueo del video o avisos por derechos de autor que pueden llevar al cierre de la cuenta.
- **Revisar antes de publicar** (el detalle de cada clip está en su sección):
  - **Nuevos:**
    - `ganga-bienvenida-piscina`: **velo entero.** Es una broma física y él dice «no, no, no» mientras lo cargan: si no parece que se lo toma a risa, no lo publiques. Los textos no nombran a nadie.
    - `luciernaga-imitadores-iva` (humor político): **son imitadores** de La Luciérnaga, no Claudia López ni Álvaro Uribe. Los textos lo dicen siempre; al publicar no añadas opiniones, consignas ni etiquetas de partido. Escucha dos palabras que quedan como «(…)».
    - `ganga-guarida-toretto`: no se ve quién dice el brindis; los textos solo nombran a La Ganga. Termina con media palabra del plano siguiente.
    - `juanpis-pestilencia-juicio-tv`: cuenta la historia Dilson Díaz (el invitado), no Juanpis. El «juicio» es un programa de televisión actuado.
  - **En la bandeja desde hoy:** `ganga-robot-precio` (escúchalo: no se sabe quién dice la cifra) y `hh-estafa-reventa` (junto a la fan aparece un joven; si parece menor de edad, no lo publiques). En `hh-colada-bano` la fan es una persona privada con la cara cubierta.
  - `renona-checo-dinosaurios`: velo antes. El remate lo dice Franco imitando a Checo según los comentarios, pero el plano general no lo muestra de cerca; si no fuera Franco, no lo publiques con este texto.
  - `culpa-marin-despide-quevedo`: escucha los dos tramos que los subtítulos dejan como «(…)» y el audio, algo saturado en la fuente.
  - `olga-agua-mostaza` y `culpa-mama-carrazo`: no nombran a quien cuenta, porque la imagen no lo identifica.

## Resumen

Línea **urbano**: 5 clips.

| # | Clip | Puntaje | Ventana hasta | TikTok (principal) | Instagram (principal) | YouTube (principal) |
|---|---|---|---|---|---|---|
| 1 | `2026-11-17-westcol-boxeo-aburrido` | 76 | 2026-11-19 | en la bandeja desde 2026-11-19 22:58 (borrador), **enviado hoy** | pendiente de aprobación | pendiente de aprobación |
| 2 | `2026-11-17-ganga-robot-precio` | 74 | 2026-11-19 | en la bandeja desde 2026-11-19 22:58 (borrador), **enviado hoy** | pendiente de aprobación | pendiente de aprobación |
| 15 | `2026-11-18-ganga-guarida-toretto` | 74 | 2026-11-20 | aprobado automáticamente; en cola (previsto 20-nov) | pendiente de aprobación | pendiente de aprobación |
| 16 | `2026-11-18-ganga-bienvenida-piscina` | 73 | 2026-11-20 | aprobado automáticamente; en cola (previsto 20-nov) | pendiente de aprobación | pendiente de aprobación |
| 17 | `2026-11-17-westcol-show-kris-r` | 68 | 2026-11-20 | aprobado automáticamente; en cola (previsto 20-nov, día del concierto de Kris R) | pendiente de aprobación | pendiente de aprobación |

Línea **risas**: 15 clips.

| # | Clip | Puntaje | Ventana hasta | TikTok (risas) | Instagram (risas) | YouTube (risas) |
|---|---|---|---|---|---|---|
| 3 | `2026-11-17-hh-aeropuerto-4am` | 74 | 2026-11-19 | en la bandeja desde 2026-11-19 22:58 (borrador), **enviado hoy** | pendiente de aprobación (cuenta apagada) | pendiente de aprobación (cuenta apagada) |
| 4 | `2026-11-17-hh-estafa-reventa` | 72 | 2026-11-19 | en la bandeja desde 2026-11-19 22:59 (borrador), **enviado hoy** | pendiente de aprobación (cuenta apagada) | pendiente de aprobación (cuenta apagada) |
| 5 | `2026-11-17-hh-colada-bano` | 72 | 2026-11-19 | en la bandeja desde 2026-11-19 22:59 (borrador), **enviado hoy** | pendiente de aprobación (cuenta apagada) | pendiente de aprobación (cuenta apagada) |
| 6 | `2026-11-17-cotorrisa-suite-karol-g` | 72 | 2026-11-19 | en la bandeja desde 2026-11-19 22:59 (borrador), **enviado hoy** | pendiente de aprobación (cuenta apagada) | pendiente de aprobación (cuenta apagada) |
| 7 | `2026-11-17-hh-colada-tres-minutos` | 71 | 2026-11-19 | aprobado automáticamente; sin hueco antes de su ventana (2026-11-19): vence hoy | pendiente de aprobación (cuenta apagada) | pendiente de aprobación (cuenta apagada) |
| 8 | `2026-11-17-hh-temblor-hijos` | 69 | 2026-11-19 | aprobado automáticamente; sin hueco antes de su ventana (2026-11-19): vence hoy | pendiente de aprobación (cuenta apagada) | pendiente de aprobación (cuenta apagada) |
| 9 | `2026-11-17-cotorrisa-paloma-medalla` | 68 | 2026-11-19 | aprobado automáticamente; sin hueco antes de su ventana (2026-11-19): vence hoy | pendiente de aprobación (cuenta apagada) | pendiente de aprobación (cuenta apagada) |
| 10 | `2026-11-17-cotorrisa-refri-papas` | 67 | 2026-11-19 | aprobado automáticamente; sin hueco antes de su ventana (2026-11-19): vence hoy | pendiente de aprobación (cuenta apagada) | pendiente de aprobación (cuenta apagada) |
| 11 | `2026-11-17-hh-lluvia-lima` | 66 | 2026-11-19 | aprobado automáticamente; sin hueco antes de su ventana (2026-11-19): vence hoy | pendiente de aprobación (cuenta apagada) | pendiente de aprobación (cuenta apagada) |
| 12 | `2026-11-18-luciernaga-imitadores-iva` | 76 | 2026-11-20 | aprobado automáticamente; en cola (previsto 20-nov) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación (cuenta apagada) |
| 13 | `2026-11-17-culpa-marin-despide-quevedo` | 76 | 2026-11-20 | aprobado automáticamente; en cola (previsto 20-nov) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación (cuenta apagada) |
| 14 | `2026-11-17-culpa-mama-carrazo` | 75 | 2026-11-20 | aprobado automáticamente; en cola (previsto 20-nov) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación (cuenta apagada) |
| 18 | `2026-11-17-renona-checo-dinosaurios` | 74 | 2026-11-21 | aprobado automáticamente; en cola (previsto 20-nov) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación (cuenta apagada) |
| 19 | `2026-11-17-olga-agua-mostaza` | 73 | 2026-11-21 | aprobado automáticamente; en cola (previsto 21-nov) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación (cuenta apagada) |
| 20 | `2026-11-18-juanpis-pestilencia-juicio-tv` | 74 | 2026-11-22 | aprobado automáticamente; en cola (previsto 21-nov) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación (cuenta apagada) |

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
| `2026-11-10-cotorrisa-yordi-tacto` | risas | 2026-11-10 20:35 | 2026-11-17 | [envío](../../datos/publicador/envios/2026-11-10-cotorrisa-yordi-tacto__tiktok.json) |
| `2026-11-10-culpa-tato-diesel` | risas | 2026-11-10 20:35 | 2026-11-17 | [envío](../../datos/publicador/envios/2026-11-10-culpa-tato-diesel__tiktok.json) |
| `2026-11-10-cotorrisa-yordi-plancha` | risas | 2026-11-10 20:35 | 2026-11-17 | [envío](../../datos/publicador/envios/2026-11-10-cotorrisa-yordi-plancha__tiktok.json) |
| `2026-11-10-culpa-ivan-senorazo` | risas | 2026-11-10 20:36 | 2026-11-17 | [envío](../../datos/publicador/envios/2026-11-10-culpa-ivan-senorazo__tiktok.json) |
| `2026-11-10-samulx-burger-mermelada` | principal | 2026-11-11 11:19 | 2026-11-14 | [envío](../../datos/publicador/envios/2026-11-10-samulx-burger-mermelada__tiktok.json) |
| `2026-11-10-samulx-pesaje-lonche` | principal | 2026-11-11 11:20 | 2026-11-14 | [envío](../../datos/publicador/envios/2026-11-10-samulx-pesaje-lonche__tiktok.json) |
| `2026-11-10-samulx-burger-espana` | principal | 2026-11-11 11:20 | 2026-11-14 | [envío](../../datos/publicador/envios/2026-11-10-samulx-burger-espana__tiktok.json) |
| `2026-11-10-cotorrisa-yordi-cuenta` | risas | 2026-11-11 11:21 | 2026-11-17 | [envío](../../datos/publicador/envios/2026-11-10-cotorrisa-yordi-cuenta__tiktok.json) |
| `2026-11-10-cotorrisa-vista-cansada` | risas | 2026-11-11 11:22 | 2026-11-17 | [envío](../../datos/publicador/envios/2026-11-10-cotorrisa-vista-cansada__tiktok.json) |
| `2026-11-11-francupido-plantada-langosta` | risas | 2026-11-13 18:08 | 2026-11-15 | [envío](../../datos/publicador/envios/2026-11-11-francupido-plantada-langosta__tiktok.json) |
| `2026-11-12-ballarta-champana` | risas | 2026-11-13 18:08 | 2026-11-15 | [envío](../../datos/publicador/envios/2026-11-12-ballarta-champana__tiktok.json) |
| `2026-11-10-culpa-super-alexis` | risas | 2026-11-13 18:09 | 2026-11-17 | [envío](../../datos/publicador/envios/2026-11-10-culpa-super-alexis__tiktok.json) |
| `2026-11-12-cotorrisa-codigo-22` | risas | 2026-11-13 18:09 | 2026-11-17 | [envío](../../datos/publicador/envios/2026-11-12-cotorrisa-codigo-22__tiktok.json) |
| `2026-11-11-westcol-samulx-mosquito-ia` | principal | 2026-11-13 18:09 | 2026-11-14 | [envío](../../datos/publicador/envios/2026-11-11-westcol-samulx-mosquito-ia__tiktok.json) |
| `2026-11-11-westcol-samulx-bicho-gigante` | principal | 2026-11-13 18:10 | 2026-11-14 | [envío](../../datos/publicador/envios/2026-11-11-westcol-samulx-bicho-gigante__tiktok.json) |
| `2026-11-09-ibai-westcol-activacion` | principal | 2026-11-13 18:10 | 2026-11-14 | [envío](../../datos/publicador/envios/2026-11-09-ibai-westcol-activacion__tiktok.json) |
| `2026-11-10-samulx-chanty-no-cae` | principal | 2026-11-13 18:10 | 2026-11-14 | [envío](../../datos/publicador/envios/2026-11-10-samulx-chanty-no-cae__tiktok.json) |
| `2026-11-10-samulx-pollito-rebanaditas` | principal | 2026-11-14 19:33 | 2026-11-14 | [envío](../../datos/publicador/envios/2026-11-10-samulx-pollito-rebanaditas__tiktok.json) |
| `2026-11-10-samulx-plan-relevos` | principal | 2026-11-14 19:34 | 2026-11-14 | [envío](../../datos/publicador/envios/2026-11-10-samulx-plan-relevos__tiktok.json) |
| `2026-11-09-ibai-westcol-zapatilla` | principal | 2026-11-14 19:34 | 2026-11-14 | [envío](../../datos/publicador/envios/2026-11-09-ibai-westcol-zapatilla__tiktok.json) |
| `2026-11-11-westcol-grefg-unico-golpe` | principal | 2026-11-14 19:35 | 2026-11-14 | [envío](../../datos/publicador/envios/2026-11-11-westcol-grefg-unico-golpe__tiktok.json) |
| `2026-11-12-culpa-quevedo-mentiras` | risas | 2026-11-14 19:35 | 2026-11-17 | [envío](../../datos/publicador/envios/2026-11-12-culpa-quevedo-mentiras__tiktok.json) |
| `2026-11-13-parenlamano-cardenal-prevost` | risas | 2026-11-14 19:36 | 2026-11-17 | [envío](../../datos/publicador/envios/2026-11-13-parenlamano-cardenal-prevost__tiktok.json) |
| `2026-11-12-cotorrisa-dedito-flaco` | risas | 2026-11-14 19:36 | 2026-11-17 | [envío](../../datos/publicador/envios/2026-11-12-cotorrisa-dedito-flaco__tiktok.json) |
| `2026-11-12-cotorrisa-harvard` | risas | 2026-11-14 19:37 | 2026-11-17 | [envío](../../datos/publicador/envios/2026-11-12-cotorrisa-harvard__tiktok.json) |
| `2026-11-14-stf5-daren-cinco-segundos` | principal | 2026-11-15 18:19 | 2026-11-16 | [envío](../../datos/publicador/envios/2026-11-14-stf5-daren-cinco-segundos__tiktok.json) |
| `2026-11-14-stf5-westcol-patadita` | principal | 2026-11-15 18:20 | 2026-11-16 | [envío](../../datos/publicador/envios/2026-11-14-stf5-westcol-patadita__tiktok.json) |
| `2026-11-14-stf5-daren-quiero-guerra` | principal | 2026-11-15 18:20 | 2026-11-16 | [envío](../../datos/publicador/envios/2026-11-14-stf5-daren-quiero-guerra__tiktok.json) |
| `2026-11-12-culpa-ivan-piscina` | risas | 2026-11-15 18:21 | 2026-11-17 | [envío](../../datos/publicador/envios/2026-11-12-culpa-ivan-piscina__tiktok.json) |
| `2026-11-13-parenlamano-papa-a-dormir` | risas | 2026-11-17 16:58 | 2026-11-17 | [envío](../../datos/publicador/envios/2026-11-13-parenlamano-papa-a-dormir__tiktok.json) |
| `2026-11-17-samulx-retiro-boxeo` | principal | 2026-11-17 16:58 | 2026-11-18 | [envío](../../datos/publicador/envios/2026-11-17-samulx-retiro-boxeo__tiktok.json) |
| `2026-11-15-parenlamano-luquitas-turista` | risas | 2026-11-17 16:58 | 2026-11-17 | [envío](../../datos/publicador/envios/2026-11-15-parenlamano-luquitas-turista__tiktok.json) |
| `2026-11-17-samulx-dime-que-no-puedes` | principal | 2026-11-17 16:58 | 2026-11-18 | [envío](../../datos/publicador/envios/2026-11-17-samulx-dime-que-no-puedes__tiktok.json) |
| `2026-11-15-parenlamano-luquitas-zapatilla` | risas | 2026-11-17 16:58 | 2026-11-17 | [envío](../../datos/publicador/envios/2026-11-15-parenlamano-luquitas-zapatilla__tiktok.json) |
| `2026-11-17-samulx-cuarto-round` | principal | 2026-11-17 16:59 | 2026-11-18 | [envío](../../datos/publicador/envios/2026-11-17-samulx-cuarto-round__tiktok.json) |
| `2026-11-15-tirandobola-perra-amigo` | risas | 2026-11-17 16:59 | 2026-11-18 | [envío](../../datos/publicador/envios/2026-11-15-tirandobola-perra-amigo__tiktok.json) |

**Borradores que no conviene publicar** (caso Herrera; descártalos desde la app):

| Clip | Cuenta | En la bandeja desde | Texto |
|---|---|---|---|
| `2026-11-17-westcol-disculpa-pelea-jh` | principal | 2026-11-17 16:59 | [envío](../../datos/publicador/envios/2026-11-17-westcol-disculpa-pelea-jh__tiktok.json) |
| `2026-11-17-westcol-herrera-no-planeado` | principal | no se sabe si llegó (HTTP 500 el 2026-11-17 16:57) | [envío](../../datos/publicador/envios/2026-11-17-westcol-herrera-no-planeado__tiktok.json) |

## 1. `2026-11-17-westcol-boxeo-aburrido`

- **Gancho:** Westcol: entre más profesional, más aburrido el boxeo
- **Puntaje:** 76 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-19 · **Línea:** urbano · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-westcol-boxeo-aburrido/clip.mp4) (45,1 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-westcol-boxeo-aburrido/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=YQ-vOO3-Ghk
- **Revisar antes de publicar:** Opinión que puede molestar a la afición del boxeo (es justo lo que da debate). Dos pitidos de la fuente como ***.

### TikTok · cuenta `principal` (Legión Urbana) · en la bandeja desde 2026-11-19 22:58 (borrador), **enviado hoy**

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

### YouTube · cuenta `principal` (canal de la Legión Urbana) · pendiente de aprobación

**Título:** Westcol explica por qué el boxeo profesional le aburre

```
Tras Stream Fighters 5, Westcol da su opinión sobre el boxeo profesional: peleas de 12 rounds “demasiado safe”, sin noqueos ni caídas. Es su opinión, y abre el debate.

Crédito: WestCOL, “¿Que pasara con HERRERA por bajar de la pelea en STREAM FIGHTERS 5?| Westcol”. Video original (minuto 15:53): https://youtu.be/YQ-vOO3-Ghk?t=953

#Westcol #Boxeo #StreamFighters5
```

**Etiquetas:** Westcol, boxeo, boxeo profesional, Stream Fighters 5, opinión, streamers, La Ganga, noqueo


## 2. `2026-11-17-ganga-robot-precio`

- **Gancho:** ¿Cuánto cuesta un robot de Stream Fighters?
- **Puntaje:** 74 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-19 · **Línea:** urbano · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-ganga-robot-precio/clip.mp4) (55,5 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-ganga-robot-precio/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=s1betCsTVVE
- **Revisar antes de publicar:** Escúchalo antes: hablan varios y la imagen no deja asegurar quién dice cada frase. Los textos no le atribuyen la cifra a nadie (la ficha proponía «La Ganga da la cifra»). Las cifras van sin moneda, como se oyen; un tramo como (…).

### TikTok · cuenta `principal` (Legión Urbana) · en la bandeja desde 2026-11-19 22:58 (borrador), **enviado hoy**

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

### YouTube · cuenta `principal` (canal de la Legión Urbana) · pendiente de aprobación

**Título:** Cuánto cuesta un robot como los de Stream Fighters 5

```
En el set de Westcol, con Lonche y La Ganga, cuentan cómo funcionan los robots que compraron en China, hablan de un evento solo de robots (“Steel Fighters”) y dan la cifra: “Traerlo acá a Colombia, 80.000”. No dicen la moneda.

Crédito: LoncheWey, “HABLANDO de MI PELEA en COLOMBIA con LA GANGA | LONCHE”. Video original (minuto 34:30): https://youtu.be/s1betCsTVVE?t=2070

#StreamFighters5 #Westcol #Lonche #Robots
```

**Etiquetas:** Stream Fighters 5, robots, Westcol, Lonche, La Ganga, robot boxeador, Steel Fighters, streamers


## 3. `2026-11-17-hh-aeropuerto-4am`

- **Gancho:** Los citaron a las 4 am en el aeropuerto
- **Puntaje:** 74 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-19 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-hh-aeropuerto-4am/clip.mp4) (57,5 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-hh-aeropuerto-4am/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=qDAqPW70T7c
- **Revisar antes de publicar:** Lenguaje fuerte («reconcha de su madre»). El productor no se ve ni se nombra: al publicar, tampoco.

### TikTok · cuenta `risas` (@legion.risas) · en la bandeja desde 2026-11-19 22:58 (borrador), **enviado hoy**

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

### YouTube · cuenta `risas` (canal de la Legión de Risas) · pendiente de aprobación (cuenta apagada)

**Título:** Hablando Huevadas y el productor que los hizo madrugar 5 horas

```
En su show de El Salvador, Hablando Huevadas cuenta cómo su productor recién ascendido los llevó al aeropuerto a las 4 de la mañana… para un vuelo de las 9.

Crédito: Hablando Huevadas (Ricardo Mendoza y Jorge Luna), “HABLANDO HUEVADAS - Décimotercera Temporada [BAILA YAHAIRA BAILA]”. Video original (minuto 44:55): https://youtu.be/qDAqPW70T7c?t=2695

#HablandoHuevadas #JorgeLuna #RicardoMendoza #Comedia
```

**Etiquetas:** Hablando Huevadas, Jorge Luna, Ricardo Mendoza, comedia peruana, El Salvador, aeropuerto, stand-up, humor


## 4. `2026-11-17-hh-estafa-reventa`

- **Gancho:** Pagó la mitad por si era estafa
- **Puntaje:** 72 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-19 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-hh-estafa-reventa/clip.mp4) (46,2 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-hh-estafa-reventa/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=qDAqPW70T7c
- **Revisar antes de publicar:** Míralo antes: junto a la fan aparece un joven (su hijo, según ella). Si parece menor de edad, no lo publiques (o pide al Clipero recortar la entrada a partir del segundo 4). La fan es una persona privada que participa en el show por voluntad propia: no añadas su nombre ni datos.

### TikTok · cuenta `risas` (@legion.risas) · en la bandeja desde 2026-11-19 22:59 (borrador), **enviado hoy**

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

### YouTube · cuenta `risas` (canal de la Legión de Risas) · pendiente de aprobación (cuenta apagada)

**Título:** Hablando Huevadas hace las cuentas de una estafa de reventa

```
En el show de Hablando Huevadas en El Salvador, una fan cuenta que a su familia la estafaron con entradas de reventa, aunque solo pagaron la mitad “por si era estafa”. En el escenario hacen las cuentas.

Crédito: Hablando Huevadas (Ricardo Mendoza y Jorge Luna), “HABLANDO HUEVADAS - Décimotercera Temporada [BAILA YAHAIRA BAILA]”. Video original (minuto 6:03): https://youtu.be/qDAqPW70T7c?t=363

#HablandoHuevadas #ElSalvador #Comedia
```

**Etiquetas:** Hablando Huevadas, Jorge Luna, Ricardo Mendoza, El Salvador, reventa, estafa, comedia peruana, humor


## 5. `2026-11-17-hh-colada-bano`

- **Gancho:** Se coló al show escondida en el baño
- **Puntaje:** 72 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-19 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-hh-colada-bano/clip.mp4) (64,6 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-hh-colada-bano/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=qDAqPW70T7c
- **Revisar antes de publicar:** Persona privada que cuenta su historia por voluntad propia y con la cara cubierta: no añadas datos. Broma escatológica suave. El desenlace es hh-colada-tres-minutos: publícalo después (ficha).

### TikTok · cuenta `risas` (@legion.risas) · en la bandeja desde 2026-11-19 22:59 (borrador), **enviado hoy**

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

### YouTube · cuenta `risas` (canal de la Legión de Risas) · pendiente de aprobación (cuenta apagada)

**Título:** La fan que se coló a Hablando Huevadas escondida en el baño

```
Sin entrada y sin confiar en la reventa, una fan se escondió dos horas en el baño del teatro y terminó guiando al público como si trabajara ahí. Lo contó en el escenario de Hablando Huevadas en El Salvador.

Crédito: Hablando Huevadas (Ricardo Mendoza y Jorge Luna), “HABLANDO HUEVADAS - Décimotercera Temporada [BAILA YAHAIRA BAILA]”. Video original (minuto 1:35:45): https://youtu.be/qDAqPW70T7c?t=5745

#HablandoHuevadas #ElSalvador #Comedia
```

**Etiquetas:** Hablando Huevadas, Jorge Luna, Ricardo Mendoza, El Salvador, colarse, stand-up, comedia peruana, humor


## 6. `2026-11-17-cotorrisa-suite-karol-g`

- **Gancho:** La suite de Karol G, a un volado
- **Puntaje:** 72 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-19 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-cotorrisa-suite-karol-g/clip.mp4) (39,6 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-cotorrisa-suite-karol-g/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=VzE65NyXqb8
- **Revisar antes de publicar:** Karol G no sale: es lo que ellos cuentan del hotel; no añadas nada. Cuenta la anécdota el de sudadera roja (no se nombra). Una palabra como (…).

### TikTok · cuenta `risas` (@legion.risas) · en la bandeja desde 2026-11-19 22:59 (borrador), **enviado hoy**

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

### YouTube · cuenta `risas` (canal de la Legión de Risas) · pendiente de aprobación (cuenta apagada)

**Título:** La Cotorrisa y la suite que dejó Karol G en Monterrey

```
Según cuentan en La Cotorrisa, en su hotel de Monterrey Karol G pidió cambiar su habitación presidencial por algo “más en casita”. Ellos se la jugaron a un volado… y uno de los dos volvió a perder.

Crédito: La Cotorrisa (Ricardo Pérez y Slobotzky; canal de Ricardo Pérez en YouTube), “Episodio 378 - Somos portada de GQ”. Video original (minuto 4:01): https://youtu.be/VzE65NyXqb8?t=241

#LaCotorrisa #KarolG #Comedia
```

**Etiquetas:** La Cotorrisa, Ricardo Pérez, Slobotzky, Karol G, Monterrey, volado, podcast de comedia, humor


## 7. `2026-11-17-hh-colada-tres-minutos`

- **Gancho:** Se coló al show y duró 3 minutos
- **Puntaje:** 71 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-19 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-hh-colada-tres-minutos/clip.mp4) (61,4 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-hh-colada-tres-minutos/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=qDAqPW70T7c
- **Revisar antes de publicar:** Persona privada, con la cara cubierta: no añadas datos. Es el desenlace de hh-colada-bano: va después.

### TikTok · cuenta `risas` (@legion.risas) · aprobado automáticamente; sin hueco antes de su ventana (2026-11-19): vence hoy

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

### YouTube · cuenta `risas` (canal de la Legión de Risas) · pendiente de aprobación (cuenta apagada)

**Título:** La fan que se coló a Hablando Huevadas y la sacaron en 3 minutos

```
El final de la historia de la fan que se coló al show de Hablando Huevadas en El Salvador: vio 3 minutos antes de que le pidieran la pulsera. Y hasta está de acuerdo en ascender a quien la sacó.

Crédito: Hablando Huevadas (Ricardo Mendoza y Jorge Luna), “HABLANDO HUEVADAS - Décimotercera Temporada [BAILA YAHAIRA BAILA]”. Video original (minuto 1:37:14): https://youtu.be/qDAqPW70T7c?t=5834

#HablandoHuevadas #ElSalvador #Comedia
```

**Etiquetas:** Hablando Huevadas, Jorge Luna, Ricardo Mendoza, El Salvador, colarse, stand-up, comedia peruana, humor


## 8. `2026-11-17-hh-temblor-hijos`

- **Gancho:** Lo que descubrió durante un temblor
- **Puntaje:** 69 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-19 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-hh-temblor-hijos/clip.mp4) (55,3 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-hh-temblor-hijos/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=qDAqPW70T7c
- **Revisar antes de publicar:** Cuenta la anécdota el de camiseta negra y la ficha no dice cuál de los dos es: no lo nombres al publicar. El temblor no causó víctimas; la broma es sobre su egoísmo. Nombra a sus hijos sin mostrarlos.

### TikTok · cuenta `risas` (@legion.risas) · aprobado automáticamente; sin hueco antes de su ventana (2026-11-19): vence hoy

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

### YouTube · cuenta `risas` (canal de la Legión de Risas) · pendiente de aprobación (cuenta apagada)

**Título:** El papá que descubrió a sus hijos en pleno temblor | Hablando Huevadas

```
En el show de Hablando Huevadas en El Salvador, uno de los dos cuenta lo que le enseñó un temblor en Lima: por primera vez en 36 años pensar en alguien más… hasta que el niño empezó a pesar. El temblor no dejó víctimas: el chiste es sobre su egoísmo.

Crédito: Hablando Huevadas (Ricardo Mendoza y Jorge Luna), “HABLANDO HUEVADAS - Décimotercera Temporada [BAILA YAHAIRA BAILA]”. Video original (minuto 1:15:01): https://youtu.be/qDAqPW70T7c?t=4501

#HablandoHuevadas #Paternidad #Comedia
```

**Etiquetas:** Hablando Huevadas, Jorge Luna, Ricardo Mendoza, paternidad, temblor, Lima, comedia peruana, humor


## 9. `2026-11-17-cotorrisa-paloma-medalla`

- **Gancho:** A una paloma le dieron medalla de guerra
- **Puntaje:** 68 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-19 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-cotorrisa-paloma-medalla/clip.mp4) (48,3 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-cotorrisa-paloma-medalla/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=VzE65NyXqb8
- **Revisar antes de publicar:** Pitidos de la fuente como ***. Sale la foto de archivo de la paloma condecorada.

### TikTok · cuenta `risas` (@legion.risas) · aprobado automáticamente; sin hueco antes de su ventana (2026-11-19): vence hoy

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

### YouTube · cuenta `risas` (canal de la Legión de Risas) · pendiente de aprobación (cuenta apagada)

**Título:** La Cotorrisa y la paloma con medalla de la Segunda Guerra Mundial

```
En la sección de efemérides de La Cotorrisa, la historia de la paloma mensajera condecorada en la Segunda Guerra Mundial. Su propuesta: en vez de medalla, alpiste de honor.

Crédito: La Cotorrisa (Ricardo Pérez y Slobotzky; canal de Ricardo Pérez en YouTube), “Episodio 378 - Somos portada de GQ”. Video original (minuto 43:02): https://youtu.be/VzE65NyXqb8?t=2582

#LaCotorrisa #Historia #Comedia
```

**Etiquetas:** La Cotorrisa, Ricardo Pérez, Slobotzky, paloma mensajera, Segunda Guerra Mundial, efemérides, podcast de comedia, humor


## 10. `2026-11-17-cotorrisa-refri-papas`

- **Gancho:** Hoy es el día de limpiar el refri
- **Puntaje:** 67 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-19 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-cotorrisa-refri-papas/clip.mp4) (58,4 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-cotorrisa-refri-papas/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=VzE65NyXqb8
- **Revisar antes de publicar:** Habla sobre todo el de sudadera roja (no se nombra). Tres palabras como (…).

### TikTok · cuenta `risas` (@legion.risas) · aprobado automáticamente; sin hueco antes de su ventana (2026-11-19): vence hoy

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

### YouTube · cuenta `risas` (canal de la Legión de Risas) · pendiente de aprobación (cuenta apagada)

**Título:** La Cotorrisa y el refrigerador de los papás

```
En La Cotorrisa, el “día de limpiar el refrigerador” se convierte en intervención familiar: salsas de 2023, comida de restaurantes que ya cerraron y la excusa de siempre para no tirar nada.

Crédito: La Cotorrisa (Ricardo Pérez y Slobotzky; canal de Ricardo Pérez en YouTube), “Episodio 378 - Somos portada de GQ”. Video original (minuto 51:24): https://youtu.be/VzE65NyXqb8?t=3084

#LaCotorrisa #Comedia #Humor
```

**Etiquetas:** La Cotorrisa, Ricardo Pérez, Slobotzky, refrigerador, papás, podcast de comedia, comedia mexicana, humor


## 11. `2026-11-17-hh-lluvia-lima`

- **Gancho:** Un peruano descubre la lluvia de verdad
- **Puntaje:** 66 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-19 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-hh-lluvia-lima/clip.mp4) (46,2 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-hh-lluvia-lima/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=qDAqPW70T7c
- **Revisar antes de publicar:** Se corta antes de la mención a Bukele (política de El Salvador).

### TikTok · cuenta `risas` (@legion.risas) · aprobado automáticamente; sin hueco antes de su ventana (2026-11-19): vence hoy

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

### YouTube · cuenta `risas` (canal de la Legión de Risas) · pendiente de aprobación (cuenta apagada)

**Título:** Hablando Huevadas contra la tormenta de El Salvador

```
Recién llegados a El Salvador, en Hablando Huevadas descubren lo que es una tormenta de verdad. En Lima, dicen, con dos gotas ya es lluvia.

Crédito: Hablando Huevadas (Ricardo Mendoza y Jorge Luna), “HABLANDO HUEVADAS - Décimotercera Temporada [BAILA YAHAIRA BAILA]”. Video original (minuto 0:41): https://youtu.be/qDAqPW70T7c?t=41

#HablandoHuevadas #Lima #Comedia
```

**Etiquetas:** Hablando Huevadas, Jorge Luna, Ricardo Mendoza, Lima, El Salvador, lluvia, comedia peruana, humor


## 12. `2026-11-18-luciernaga-imitadores-iva`

- **Gancho:** Imitadores: todos quieren el crédito del IVA
- **Puntaje:** 76 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-20 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-18-luciernaga-imitadores-iva/clip.mp4) (62,5 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-18-luciernaga-imitadores-iva/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=pYtwwPMrdzs
- **Revisar antes de publicar:** Humor político (legion/04-cazador-risas/enfoque.md): sátira con imitadores de La Luciérnaga (Caracol Radio). Los rótulos del propio programa dicen «Claudia López de La Luciérnaga» y «Álvaro Uribe de La Luciérnaga»; no sale ningún político real. Corrientes: centro y derecha. Los textos dicen siempre que son imitadores y no llevan opiniones, consignas ni etiquetas de partido: al publicar no se las añadas. El crédito no copia el título del video, que habla de un juez y de operativos de De la Espriella (fuera del clip). Escuchar dos palabras que los subtítulos dejan como «(…)» (1:23:41 y 1:23:50). Ficha: es el único de risas atado a una noticia (17-nov); mejor publicarlo pronto.

### TikTok · cuenta `risas` (@legion.risas) · aprobado automáticamente; en cola (previsto 20-nov)

```
Imitadores de La Luciérnaga: todos se pelean el crédito del IVA 😂

El Gobierno retiró el IVA a la canasta familiar de su reforma tributaria y en La Luciérnaga cada personaje quiere el mérito. Son los imitadores de Claudia López y de Álvaro Uribe del programa, no los políticos.

¿Qué otro imitador quieres ver?

Crédito: La Luciérnaga, Caracol Radio (YouTube), emisión del 17 de noviembre. Video original (minuto 1:23:17): https://youtu.be/pYtwwPMrdzs?t=4997

#LaLuciérnaga #CaracolRadio #Imitadores #HumorColombiano #Sátira
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
“Yo solita lo tumbé”: la sátira del IVA de los imitadores de La Luciérnaga 😂

Después de que el Gobierno retirara el IVA a la canasta familiar de su reforma tributaria, la imitación de Claudia López y la de Álvaro Uribe de La Luciérnaga (Caracol Radio) se pelean el mérito. Son imitaciones de humor, no declaraciones de los políticos.

¿Qué otro imitador quieres ver?

Crédito: La Luciérnaga, Caracol Radio (YouTube), emisión del 17 de noviembre. Video original (minuto 1:23:17): https://youtu.be/pYtwwPMrdzs?t=4997

#LaLuciérnaga #CaracolRadio #Imitadores #HumorColombiano #Sátira
```

### YouTube · cuenta `risas` (canal de la Legión de Risas) · pendiente de aprobación (cuenta apagada)

**Título:** Imitación: ¿quién tumbó el IVA a la canasta familiar? | La Luciérnaga

```
Sátira de La Luciérnaga (Caracol Radio) del 17 de noviembre: después de que el Gobierno retirara el IVA a la canasta familiar de su reforma tributaria, los imitadores del programa se pelean el mérito. Son imitaciones de humor, no declaraciones de los políticos.

Crédito: La Luciérnaga, Caracol Radio (YouTube), emisión del 17 de noviembre. Video original (minuto 1:23:17): https://youtu.be/pYtwwPMrdzs?t=4997

#LaLuciérnaga #CaracolRadio #Imitadores #HumorColombiano
```

**Etiquetas:** La Luciérnaga, Caracol Radio, imitadores, imitación, sátira, humor colombiano, IVA canasta familiar, reforma tributaria


## 13. `2026-11-17-culpa-marin-despide-quevedo`

- **Gancho:** Iván Marín tuvo que despedir a Ricardo Quevedo
- **Puntaje:** 76 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-20 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-culpa-marin-despide-quevedo/clip.mp4) (71 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-culpa-marin-despide-quevedo/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=OKqALYkh3LA
- **Revisar antes de publicar:** Escuchar dos tramos que los subtítulos dejan como «(…)» (38:41 y 39:17). Lenguaje fuerte tapado por YouTube («***»). La fuente viene algo saturada: si se oye mal, no lo publiques. La imagen no deja asegurar quién es quién: los textos nombran a Iván Marín y a Ricardo Quevedo porque el propio programa lo hace, y no atribuyen el remate a nadie. Mismo capítulo que culpa-mama-carrazo: publícalos separados.

### TikTok · cuenta `risas` (@legion.risas) · aprobado automáticamente; en cola (previsto 20-nov)

```
Iván Marín tuvo que despedir a Ricardo Quevedo 😅

Lo invitó a escribir en un programa, al programa le quitaron presupuesto y le tocó a él darle la noticia. La respuesta de Ricardo es mejor que la historia.

¿Alguna vez te tocó despedir a un amigo?

Crédito: Los De La Culpa (YouTube), “NUNCA LE DIRÍA A MI MAMÁ | Los De La Culpa - Capítulo 269”. Video original (minuto 38:29): https://youtu.be/OKqALYkh3LA?t=2309

#LosDeLaCulpa #IvanMarin #RicardoQuevedo #ComediaColombiana
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
Lo invitó a almorzar porque no sabía cómo decirle que estaba despedido 😅

En Los De La Culpa (capítulo 269), Iván Marín cuenta que invitó a Ricardo Quevedo al equipo de guionistas de un programa… y cuando le quitaron presupuesto, le tocó a él despedirlo. Ricardo se lo tomó súper bien, y su respuesta es mejor que la historia.

¿Alguna vez te tocó despedir a un amigo?

Crédito: Los De La Culpa (YouTube), “NUNCA LE DIRÍA A MI MAMÁ | Los De La Culpa - Capítulo 269”. Video original (minuto 38:29): https://youtu.be/OKqALYkh3LA?t=2309

#LosDeLaCulpa #IvanMarin #RicardoQuevedo #ComediaColombiana #Humor
```

### YouTube · cuenta `risas` (canal de la Legión de Risas) · pendiente de aprobación (cuenta apagada)

**Título:** Los De La Culpa: el día que Iván Marín despidió a Ricardo Quevedo

```
En el capítulo 269 de Los De La Culpa, hablando de decisiones que parecían buenas y salieron terribles, Iván Marín cuenta que invitó a Ricardo Quevedo a escribir en un programa… y después le tocó despedirlo. La respuesta de Ricardo es mejor que la historia.

Crédito: Los De La Culpa (YouTube), “NUNCA LE DIRÍA A MI MAMÁ | Los De La Culpa - Capítulo 269”. Video original (minuto 38:29): https://youtu.be/OKqALYkh3LA?t=2309

#LosDeLaCulpa #IvanMarin #RicardoQuevedo #ComediaColombiana
```

**Etiquetas:** Los De La Culpa, Iván Marín, Ricardo Quevedo, comedia colombiana, stand up, anécdotas, despido, humor


## 14. `2026-11-17-culpa-mama-carrazo`

- **Gancho:** La versión de mamá cuando compras carro
- **Puntaje:** 75 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-20 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-culpa-mama-carrazo/clip.mp4) (49,8 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-culpa-mama-carrazo/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=OKqALYkh3LA
- **Revisar antes de publicar:** Lenguaje fuerte tapado por YouTube («***»). Sale el público del show en plano general, sin nadie señalado. Quien cuenta la anécdota no se identifica en la imagen: los textos no lo nombran. Mismo capítulo que culpa-marin-despide-quevedo: publícalos separados.

### TikTok · cuenta `risas` (@legion.risas) · aprobado automáticamente; en cola (previsto 20-nov)

```
Tú: “me compré un carro”. Tu mamá: “¡un carrazo… y de contado!” 😂

Y él, mientras tanto, pagando las cuotas. En Los De La Culpa lo tienen claro: entre las señoras hay una guerra por quién tiene el hijo más exitoso.

Etiqueta a la mamá que hace esto

Crédito: Los De La Culpa (YouTube), “NUNCA LE DIRÍA A MI MAMÁ | Los De La Culpa - Capítulo 269”. Video original (minuto 16:23): https://youtu.be/OKqALYkh3LA?t=983

#LosDeLaCulpa #Mamá #ComediaColombiana #Humor
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
La guerra de las mamás por el hijo más exitoso 😂

En Los De La Culpa (capítulo 269), uno de ellos cuenta que le dijo a su mamá “me compré un carro”… y la versión de ella para el mundo fue “¡Armando se compró un carrazo… y de contado!”. Mientras tanto, él pagando las cuotas.

Etiqueta a la mamá que hace esto

Crédito: Los De La Culpa (YouTube), “NUNCA LE DIRÍA A MI MAMÁ | Los De La Culpa - Capítulo 269”. Video original (minuto 16:23): https://youtu.be/OKqALYkh3LA?t=983

#LosDeLaCulpa #Mamá #ComediaColombiana #Humor
```

### YouTube · cuenta `risas` (canal de la Legión de Risas) · pendiente de aprobación (cuenta apagada)

**Título:** Los De La Culpa: lo que tu mamá cuenta cuando te compras un carro

```
En Los De La Culpa (capítulo 269, “Nunca le diría a mi mamá”) explican cómo las mamás exageran cada logro de sus hijos: “me compré un carro” se convierte en “un carrazo… y de contado”.

Crédito: Los De La Culpa (YouTube), “NUNCA LE DIRÍA A MI MAMÁ | Los De La Culpa - Capítulo 269”. Video original (minuto 16:23): https://youtu.be/OKqALYkh3LA?t=983

#LosDeLaCulpa #Mamá #ComediaColombiana #Humor
```

**Etiquetas:** Los De La Culpa, comedia colombiana, mamás, mamá exagerada, carro, stand up, humor


## 15. `2026-11-18-ganga-guarida-toretto`

- **Gancho:** La Ganga despide su casa estilo Toretto
- **Puntaje:** 74 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-20 · **Línea:** urbano · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-18-ganga-guarida-toretto/clip.mp4) (53,4 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-18-ganga-guarida-toretto/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=QauXCZ2fFs8
- **Revisar antes de publicar:** La imagen no deja asegurar quién dice el brindis ni quién sale de cara: los textos solo nombran a La Ganga (sin #Westcol). El clip termina con media palabra del plano siguiente («E la…», 0,5 s) y la imagen es nocturna y oscura. Los textos dicen «no salió a la primera» y no «a la quinta toma», porque el clip solo muestra una toma fallida. Publícalo a otra hora que ganga-bienvenida-piscina.

### TikTok · cuenta `principal` (Legión Urbana) · aprobado automáticamente; en cola (previsto 20-nov)

```
La Ganga despidió La Guarida con el brindis de Toretto 🥂 (no salió a la primera)

La casa donde La Ganga hacía sus directos en Medellín se va a tumbar, y antes de las 24 horas de stream la despidieron así: “El dinero va y viene… mi familia, salud”.

¿Quién es tu familia de verdad? 🥂

Crédito: Samulx (YouTube), “DESPIDIENDO LA GUARIDA CON TODA LA GANGA ANTES DE QUE LA TUMBEN”. Video original (minuto 15:39): https://youtu.be/QauXCZ2fFs8?t=939

#LaGanga #LaGuarida #Samulx #Toretto #Medellín
```

### Instagram · cuenta `principal` · pendiente de aprobación

```
“Lo más importante son las personas”: el adiós de La Ganga a La Guarida 🥂

La Guarida, la casa donde La Ganga hacía sus directos en Medellín, se va a tumbar. Antes de las 24 horas de stream la despidieron recreando el brindis de Toretto en Rápidos y furiosos. No salió a la primera.

¿Quién es tu familia de verdad? 🥂

Crédito: Samulx (YouTube), “DESPIDIENDO LA GUARIDA CON TODA LA GANGA ANTES DE QUE LA TUMBEN”. Video original (minuto 15:39): https://youtu.be/QauXCZ2fFs8?t=939

#LaGanga #LaGuarida #Samulx #Toretto #Medellín
```

### YouTube · cuenta `principal` (canal de la Legión Urbana) · pendiente de aprobación

**Título:** La Ganga y el brindis de Toretto: el adiós a La Guarida

```
La Guarida, la casa donde La Ganga hacía sus directos en Medellín, se va a tumbar. Antes de las 24 horas de stream, la despidieron recreando el brindis de Toretto en Rápidos y furiosos: “El dinero va y viene… mi familia, salud”. No salió a la primera.

Crédito: Samulx (YouTube), “DESPIDIENDO LA GUARIDA CON TODA LA GANGA ANTES DE QUE LA TUMBEN”. Video original (minuto 15:39): https://youtu.be/QauXCZ2fFs8?t=939

#LaGanga #LaGuarida #Samulx #Toretto
```

**Etiquetas:** La Ganga, La Guarida, Samulx, Toretto, Rápidos y furiosos, brindis, Medellín, streamers, 24 horas


## 16. `2026-11-18-ganga-bienvenida-piscina`

- **Gancho:** Bienvenida a La Ganga: directo a la piscina
- **Puntaje:** 73 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-20 · **Línea:** urbano · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-18-ganga-bienvenida-piscina/clip.mp4) (43,8 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-18-ganga-bienvenida-piscina/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=_R71FcOLQQQ
- **Revisar antes de publicar:** Velo entero antes de publicar: es una broma física entre amigos y él dice «no, no, no» mientras lo cargan; si no parece que se lo toma a risa, no lo publiques. No se puede confirmar quién es cada uno: los textos no nombran a nadie y el crédito no copia el título del video («Me desquite de Westcol y de Pan»), porque el tramo no muestra a quién tiran. Una frase queda como «(…)» (0:13:57). Publícalo a otra hora que ganga-guarida-toretto (la ficha lo pone el 20-nov a las 12:30).

### TikTok · cuenta `principal` (Legión Urbana) · aprobado automáticamente; en cola (previsto 20-nov)

```
Así te dan la bienvenida en La Ganga 😂🏊

En las 24 horas con La Ganga en Medellín, al recién llegado le quitan el teléfono, las tarjetas, la camiseta y los tenis… y directo a la piscina.

¿Te dejarías dar esta bienvenida?

Crédito: Live Samulx (YouTube, canal de directos de Samulx), video del 17 de noviembre. Video original (minuto 13:20): https://youtu.be/_R71FcOLQQQ?t=800

#LaGanga #Samulx #24Horas #Medellín #Streamers
```

### Instagram · cuenta `principal` · pendiente de aprobación

```
“Bienvenido a La Ganga”: sin teléfono, sin camiseta y a la piscina 🏊

En las 24 horas con La Ganga en Medellín, al recién llegado le dan la bienvenida a su manera: le quitan el teléfono, las tarjetas, la camiseta y los tenis… y directo a la piscina.

¿Te dejarías dar esta bienvenida?

Crédito: Live Samulx (YouTube, canal de directos de Samulx), video del 17 de noviembre. Video original (minuto 13:20): https://youtu.be/_R71FcOLQQQ?t=800

#LaGanga #Samulx #24Horas #Medellín #Streamers
```

### YouTube · cuenta `principal` (canal de la Legión Urbana) · pendiente de aprobación

**Título:** La bienvenida de La Ganga en las 24 horas de Medellín

```
En las 24 horas con La Ganga en Medellín, al recién llegado le dan la bienvenida a su manera: le quitan el teléfono, las tarjetas, la camiseta y los tenis… y directo a la piscina.

Crédito: Live Samulx (YouTube, canal de directos de Samulx), video del 17 de noviembre. Video original (minuto 13:20): https://youtu.be/_R71FcOLQQQ?t=800

#LaGanga #Samulx #24Horas #Medellín
```

**Etiquetas:** La Ganga, Samulx, Live Samulx, 24 horas, Medellín, streamers, bienvenida, piscina


## 17. `2026-11-17-westcol-show-kris-r`

- **Gancho:** Westcol sobre el show de Kris R
- **Puntaje:** 68 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-20 · **Línea:** urbano · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-westcol-show-kris-r/clip.mp4) (34,2 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-westcol-show-kris-r/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=YQ-vOO3-Ghk
- **Revisar antes de publicar:** Kris R no sale: habla Westcol. No suena música de Kris R. Dos palabras como (…).

### TikTok · cuenta `principal` (Legión Urbana) · aprobado automáticamente; en cola (previsto 20-nov, día del concierto de Kris R)

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

### YouTube · cuenta `principal` (canal de la Legión Urbana) · pendiente de aprobación

**Título:** Westcol habla del show de Kris R en Stream Fighters 5

```
Tras Stream Fighters 5, Westcol agradece a Kris R: “para muchos fue el mejor show de la noche” y “pasó de ser peleador a ser artista oficial de Stream Fighters”. Kris R toca el viernes 20-nov en el DAVIarena.

Crédito: WestCOL, “¿Que pasara con HERRERA por bajar de la pelea en STREAM FIGHTERS 5?| Westcol”. Video original (minuto 3:16): https://youtu.be/YQ-vOO3-Ghk?t=196

#KrisR #Westcol #StreamFighters5
```

**Etiquetas:** Kris R, Westcol, Stream Fighters 5, música urbana, concierto, DAVIarena, streamers


## 18. `2026-11-17-renona-checo-dinosaurios`

- **Gancho:** Franco responde por Checo… y se pasa
- **Puntaje:** 74 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-21 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-renona-checo-dinosaurios/clip.mp4) (54,4 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-renona-checo-dinosaurios/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=DpE-D9sdE9M
- **Revisar antes de publicar:** Velo antes de publicar: el remate lo dice Franco imitando la voz de Checo según los comentarios del video y la propia mesa, pero el plano general no lo muestra de cerca. Si no fuera Franco, no lo publiques con este texto (el gancho del video también lo dice). Lenguaje fuerte («pendejada»). Los carteles de la gira de Franco en la mesa son del propio canal. Se corta antes de la réplica grosera de Checo.

### TikTok · cuenta `risas` (@legion.risas) · aprobado automáticamente; en cola (previsto 20-nov)

```
Le preguntan a Checo por sus locuras de joven y Franco contesta por él 🦖😂

“Le picábamos los huevos a los dinosaurios y nos echábamos a correr”. Risa general en La Mesa Reñoña.

¿Cuál fue la locura más grande que hiciste de joven?

Crédito: La Mesa Reñoña, de Franco Escamilla (YouTube), “La Mesa Reñoña 524.- 007 mexicano / Ovnis/ Pterodáctilo”. Video original (minuto 1:37:37): https://youtu.be/DpE-D9sdE9M?t=5857

#FrancoEscamilla #LaMesaReñoña #ChecoMejorado #Comedia
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
“Le picábamos los huevos a los dinosaurios” 🦖😂

En La Mesa Reñoña 524 hablan de las locuras que hacían de jóvenes. Cuando le toca a Checo Mejorado, Franco Escamilla contesta por él, imitando su voz.

¿Cuál fue la locura más grande que hiciste de joven?

Crédito: La Mesa Reñoña, de Franco Escamilla (YouTube), “La Mesa Reñoña 524.- 007 mexicano / Ovnis/ Pterodáctilo”. Video original (minuto 1:37:37): https://youtu.be/DpE-D9sdE9M?t=5857

#FrancoEscamilla #LaMesaReñoña #ChecoMejorado #Comedia
```

### YouTube · cuenta `risas` (canal de la Legión de Risas) · pendiente de aprobación (cuenta apagada)

**Título:** Franco Escamilla se pasa con Checo Mejorado en La Mesa Reñoña

```
En La Mesa Reñoña 524 hablan de las locuras que hacían de jóvenes. Cuando le toca a Checo Mejorado, Franco Escamilla contesta por él… y se pasa.

Crédito: La Mesa Reñoña, de Franco Escamilla (YouTube), “La Mesa Reñoña 524.- 007 mexicano / Ovnis/ Pterodáctilo”. Video original (minuto 1:37:37): https://youtu.be/DpE-D9sdE9M?t=5857

#FrancoEscamilla #LaMesaReñoña #ChecoMejorado #Comedia
```

**Etiquetas:** Franco Escamilla, La Mesa Reñoña, Checo Mejorado, Regalito, comedia mexicana, dinosaurios, podcast, humor


## 19. `2026-11-17-olga-agua-mostaza`

- **Gancho:** Su amigo era adicto a algo asqueroso
- **Puntaje:** 73 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-21 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-olga-agua-mostaza/clip.mp4) (42,2 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-olga-agua-mostaza/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=a5BUB-t-bHM
- **Revisar antes de publicar:** Humor asqueroso, sin nadie atacado (el amigo no se nombra). Quien cuenta no se identifica con seguridad: los textos no lo nombran. El letrero de Coca-Cola es del decorado del estudio, no un rótulo añadido. Lenguaje: «boludo».

### TikTok · cuenta `risas` (@legion.risas) · aprobado automáticamente; en cola (previsto 21-nov)

```
Su amigo era adicto… a la agüita de la mostaza 🤢😂

Iba a tu casa, abría la heladera, sacudía el pomo y se tomaba el primer chorrito. La mesa de Soñé que Volaba: “me descompongo”.

¿Conoces a alguien que haga esto? Etiquétalo

Crédito: Soñé que Volaba, de OLGA (YouTube), “COMBINAR COMIDAS RARAS y NO MORIR en el INTENTO | #SoñéQueVolaba 17/11”. Video original (minuto 39:55): https://youtu.be/a5BUB-t-bHM?t=2395

#SoñéQueVolaba #OLGA #Comedia #Mostaza
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
“Era adicto a la agüita que sale antes de la mostaza” 🤢

En Soñé que Volaba (OLGA) hablaban de combinaciones de comida rarísimas, hasta que uno de los conductores contó la adicción más asquerosa de un amigo. La mesa: “me descompongo”.

¿Conoces a alguien que haga esto? Etiquétalo

Crédito: Soñé que Volaba, de OLGA (YouTube), “COMBINAR COMIDAS RARAS y NO MORIR en el INTENTO | #SoñéQueVolaba 17/11”. Video original (minuto 39:55): https://youtu.be/a5BUB-t-bHM?t=2395

#SoñéQueVolaba #OLGA #Comedia #Mostaza
```

### YouTube · cuenta `risas` (canal de la Legión de Risas) · pendiente de aprobación (cuenta apagada)

**Título:** Soñé que Volaba: el amigo adicto al agua de la mostaza

```
En Soñé que Volaba (OLGA) hablaban de combinaciones de comida rarísimas, hasta que uno de los conductores contó la adicción más asquerosa de un amigo: la agüita que sale antes de la mostaza.

Crédito: Soñé que Volaba, de OLGA (YouTube), “COMBINAR COMIDAS RARAS y NO MORIR en el INTENTO | #SoñéQueVolaba 17/11”. Video original (minuto 39:55): https://youtu.be/a5BUB-t-bHM?t=2395

#SoñéQueVolaba #OLGA #Comedia #Mostaza
```

**Etiquetas:** Soñé que Volaba, OLGA, Migue Granados, comedia argentina, mostaza, comidas raras, streaming, humor


## 20. `2026-11-18-juanpis-pestilencia-juicio-tv`

- **Gancho:** La Pestilencia actuó en un juicio de TV
- **Puntaje:** 74 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-22 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-18-juanpis-pestilencia-juicio-tv/clip.mp4) (68 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-18-juanpis-pestilencia-juicio-tv/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=zsa74yNbstU
- **Revisar antes de publicar:** Escuchar la primera palabra después de «Entonces», que los subtítulos dejan como «(…)». Lenguaje fuerte tapado por YouTube («***»). Habla Dilson Díaz, el invitado; a Juanpis solo se le oye, y los textos no le atribuyen la historia. El «juicio» es un programa de televisión actuado, no un caso judicial real.

### TikTok · cuenta `risas` (@legion.risas) · aprobado automáticamente; en cola (previsto 21-nov)

```
La Pestilencia actuó en un “juicio” de la tele por 500 dólares cada uno… y su tío se lo creyó 😂

Dilson Díaz cuenta en The Juanpis Live Show que, recién llegados a Los Ángeles, la banda hizo de actores en un programa de juicios de un canal local de Telemundo. Nadie lo iba a ver… hasta que lo llamó su tío.

¿Cuál es el trabajo más raro que has hecho por plata?

Crédito: The Juanpis Live Show, canal Juanpis González (YouTube), “¿Me volví punkero con La Pestilencia?”. Video original (minuto 54:15): https://youtu.be/zsa74yNbstU?t=3255

#JuanpisGonzalez #LaPestilencia #DilsonDiaz #HumorColombiano #Rock
```

### Instagram · cuenta `risas` · pendiente de aprobación (cuenta apagada)

```
“¿Por qué está con un juez?”: la llamada que recibió Dilson Díaz de La Pestilencia 😂

En The Juanpis Live Show, Dilson cuenta que, recién llegados a Los Ángeles, la banda actuó en un programa de juicios de la televisión local por 500 dólares cada uno. Nadie lo iba a ver… hasta que lo llamó su tío. Con esa plata pagaron cuatro meses de arriendo.

¿Cuál es el trabajo más raro que has hecho por plata?

Crédito: The Juanpis Live Show, canal Juanpis González (YouTube), “¿Me volví punkero con La Pestilencia?”. Video original (minuto 54:15): https://youtu.be/zsa74yNbstU?t=3255

#JuanpisGonzalez #LaPestilencia #DilsonDiaz #HumorColombiano #Rock
```

### YouTube · cuenta `risas` (canal de la Legión de Risas) · pendiente de aprobación (cuenta apagada)

**Título:** La Pestilencia y el juicio de TV que les pagó 4 meses de arriendo

```
Dilson Díaz, de La Pestilencia, cuenta en The Juanpis Live Show cómo, recién llegados a Los Ángeles, la banda actuó en un programa de juicios de la televisión local por 500 dólares cada uno. Nadie lo iba a ver… hasta que lo llamó su tío.

Crédito: The Juanpis Live Show, canal Juanpis González (YouTube), “¿Me volví punkero con La Pestilencia?”. Video original (minuto 54:15): https://youtu.be/zsa74yNbstU?t=3255

#JuanpisGonzalez #LaPestilencia #DilsonDiaz #HumorColombiano
```

**Etiquetas:** La Pestilencia, Dilson Díaz, Juanpis González, The Juanpis Live Show, Alejandro Riaño, humor colombiano, anécdotas, rock colombiano


## Comandos

- Aprobar un clip en todas sus plataformas: `/publicador aprobar <clip-id>` (por ejemplo, `/publicador aprobar 2026-11-17-westcol-boxeo-aburrido`).
- Aprobar una sola plataforma: `/publicador aprobar <clip-id>:<plataforma>` (por ejemplo, `/publicador aprobar 2026-11-17-westcol-boxeo-aburrido:youtube`).
- Aprobar todo lo pendiente: `/publicador aprobar todo` (Instagram y YouTube siguen sin activar: solo deja los envíos listos; en YouTube, lo aprobado saldrá público).
- Rechazar: `/publicador rechazar <clip-id> <motivo>`, o `/publicador rechazar <clip-id>:<plataforma> <motivo>` para una sola plataforma (con `:tiktok`, el clip deja de ir a la bandeja).
