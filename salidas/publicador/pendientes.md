# Pendientes del Publicador

Generado: 2026-11-20T21:24:00-05:00 · ciclo 13 · entrada: `salidas/clipero/clips.json` (ciclo 18 del Clipero, generado el 2026-11-18 a las 01:50): sin clips nuevos desde el ciclo 12.

**Cómo leer esta página**

- **TikTok, hoy (21:15-21:16):** 5 borradores nuevos. Están en la bandeja de su cuenta y no son públicos hasta que los publicas desde la app. La API solo manda el video: al publicarlo, **pega el texto de TikTok** de su sección.
  - `ganga-guarida-toretto` → `principal`
  - `culpa-marin-despide-quevedo` → `risas`
  - `ganga-bienvenida-piscina` → `principal`
  - `luciernaga-imitadores-iva` → `risas`
  - `westcol-show-kris-r` → `principal`
  - Publica los dos de La Ganga a horas distintas, y `ganga-bienvenida-piscina` solo después de verlo entero. `westcol-show-kris-r` va el día del concierto de Kris R.
  - Los dos de La Culpa son del mismo capítulo: `culpa-mama-carrazo` no entró hoy (abajo), así que no coinciden.
- **TikTok cortó la cuenta `risas` a las 21:17** con `spam_risk_too_many_pending_share` (borradores pendientes: llevaba 6 en 24 h, los 4 del 19-nov por la noche y los 2 de hoy). Se paró esa cuenta en este ciclo:
  - **`culpa-mama-carrazo` no entró** (intento 1 de 2) y su ventana acaba hoy. Sin más, vence en el próximo ciclo. Si lo quieres mañana: `/publicador aprobar 2026-11-17-culpa-mama-carrazo:tiktok`.
  - **`renona-checo-dinosaurios`** no se intentó: pasa al 21-nov, el día que vence.
  - Publicar o descartar borradores desde la app libera sitio: `risas` tiene 25 sin publicar según la API.
- **Caso Herrera** (pasa a lo legal; Cazador Urbano, 17-nov). Nada se reabre:
  - **`westcol-disculpa-pelea-jh` está en la bandeja de Legión Urbana: no lo publiques.** Descártalo desde la app (la API no puede borrarlo).
  - **`westcol-herrera-no-planeado`:** el envío del 17-nov dio HTTP 500 y no se sabe si llegó. No se reintenta: si está en la bandeja, descártalo.
- **Bandeja según la API: 55 borradores sin publicar** (30 en `principal` y 25 en `risas`). 49 tienen la ventana cerrada (tabla al final del resumen) y 5 vencen hoy, los de esta noche. **Publica o descarta** desde la app los que ya no quieras.
- **Plan de TikTok** (4 borradores al día por cuenta, primero la ventana más cercana y después el puntaje):
  - **`risas`, 21-nov:** `renona-checo-dinosaurios`, `juanpis-pestilencia-juicio-tv` y `olga-agua-mostaza`, más `culpa-mama-carrazo` si lo apruebas. Mejor después de las 21:17, cuando los borradores de hoy salen de la ventana de 24 h.
  - **`principal`:** no queda nada en cola.
  - **Vencieron hoy sin enviarse** (ventana hasta el 19-nov; ese día `risas` ya llevaba 4 de 4): `cotorrisa-paloma-medalla`, `cotorrisa-refri-papas`, `hh-colada-tres-minutos`, `hh-lluvia-lima`, `hh-temblor-hijos`. Si quieres alguno igualmente: `/publicador aprobar <clip-id>:tiktok`.
- **Instagram y YouTube:** pendientes de aprobación. Siguen sin activar y sin credenciales: aprobar ahora solo deja el envío listo.
  - **YouTube lleva un canal por línea:** los urbanos van a `principal` (Legión Urbana) y los de risas a `risas` (Legión de Risas, apagado hasta que lo autorices).
  - **En YouTube lo aprobado sale público** al subirse (`youtube.privacidad: public`; Google ya no deja privado lo que suben los proyectos sin auditar).
  - En Instagram, los urbanos van a `principal` y los de risas a la cuenta `risas` (apagada), nunca a la urbana.
  - Las 12 pendientes con ventana hasta hoy (6 clips) vencen al acabar el día.
- **Clips subidos a mano** (`legion/03-publicador/subidos-a-mano.json`): no aparecen aquí.
- **Derechos:** todos los clips de esta página son `sin_verificar`: contenido de terceros sin permiso confirmado. Solo se publica con aprobación expresa (en TikTok, tu publicación desde la bandeja) y siempre con el crédito a la fuente. Riesgos: reclamaciones de Content ID (los ingresos pasan al titular), bloqueo del video o avisos por derechos de autor que pueden llevar al cierre de la cuenta.
- **Revisar antes de publicar** (el detalle de cada clip está en su sección):
  - **En la bandeja desde hoy:**
    - `ganga-bienvenida-piscina`: **velo entero.** Es una broma física y él dice «no, no, no» mientras lo cargan: si no parece que se lo toma a risa, no lo publiques. Los textos no nombran a nadie.
    - `luciernaga-imitadores-iva` (humor político): **son imitadores** de La Luciérnaga, no Claudia López ni Álvaro Uribe. Los textos lo dicen siempre; al publicar no añadas opiniones, consignas ni etiquetas de partido. Escucha dos palabras que quedan como «(…)». Va atado a la noticia del 17-nov: mejor publicarlo pronto.
    - `ganga-guarida-toretto`: no se ve quién dice el brindis; los textos solo nombran a La Ganga. Termina con media palabra del plano siguiente.
    - `westcol-show-kris-r`: habla Westcol; Kris R no sale y no suena su música. Dos palabras quedan como «(…)».
    - `culpa-marin-despide-quevedo`: escucha los dos tramos que los subtítulos dejan como «(…)» y el audio, algo saturado en la fuente: si se oye mal, no lo publiques.
  - **En cola:**
    - `renona-checo-dinosaurios`: velo antes. El remate lo dice Franco imitando a Checo según los comentarios, pero el plano general no lo muestra de cerca; si no fuera Franco, no lo publiques con este texto.
    - `juanpis-pestilencia-juicio-tv`: cuenta la historia Dilson Díaz (el invitado), no Juanpis. El «juicio» es un programa de televisión actuado.
    - `olga-agua-mostaza` y `culpa-mama-carrazo`: no nombran a quien cuenta, porque la imagen no lo identifica.

## Resumen

Línea **urbano**: 3 clips.

| # | Clip | Puntaje | Ventana hasta | TikTok (principal) | Instagram (principal) | YouTube (principal) |
|---|---|---|---|---|---|---|
| 4 | `2026-11-18-ganga-guarida-toretto` | 74 | 2026-11-20 | en la bandeja desde 2026-11-20 21:15 (borrador), **enviado hoy** | pendiente de aprobación | pendiente de aprobación |
| 5 | `2026-11-18-ganga-bienvenida-piscina` | 73 | 2026-11-20 | en la bandeja desde 2026-11-20 21:16 (borrador), **enviado hoy** | pendiente de aprobación | pendiente de aprobación |
| 6 | `2026-11-17-westcol-show-kris-r` | 68 | 2026-11-20 | en la bandeja desde 2026-11-20 21:16 (borrador), **enviado hoy** | pendiente de aprobación | pendiente de aprobación |

Línea **risas**: 6 clips.

| # | Clip | Puntaje | Ventana hasta | TikTok (risas) | Instagram (risas) | YouTube (risas) |
|---|---|---|---|---|---|---|
| 1 | `2026-11-18-luciernaga-imitadores-iva` | 76 | 2026-11-20 | en la bandeja desde 2026-11-20 21:16 (borrador), **enviado hoy** | pendiente de aprobación (cuenta apagada) | pendiente de aprobación (cuenta apagada) |
| 2 | `2026-11-17-culpa-marin-despide-quevedo` | 76 | 2026-11-20 | en la bandeja desde 2026-11-20 21:15 (borrador), **enviado hoy** | pendiente de aprobación (cuenta apagada) | pendiente de aprobación (cuenta apagada) |
| 3 | `2026-11-17-culpa-mama-carrazo` | 75 | 2026-11-20 | **no entró hoy**: TikTok cortó la cuenta (spam_risk_too_many_pending_share), intento 1 de 2; vence hoy salvo `/publicador aprobar 2026-11-17-culpa-mama-carrazo:tiktok` | pendiente de aprobación (cuenta apagada) | pendiente de aprobación (cuenta apagada) |
| 7 | `2026-11-17-renona-checo-dinosaurios` | 74 | 2026-11-21 | aprobado automáticamente; en cola (previsto 21-nov; hoy TikTok cortó la cuenta) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación (cuenta apagada) |
| 8 | `2026-11-17-olga-agua-mostaza` | 73 | 2026-11-21 | aprobado automáticamente; en cola (previsto 21-nov) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación (cuenta apagada) |
| 9 | `2026-11-18-juanpis-pestilencia-juicio-tv` | 74 | 2026-11-22 | aprobado automáticamente; en cola (previsto 21-nov) | pendiente de aprobación (cuenta apagada) | pendiente de aprobación (cuenta apagada) |

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
| `2026-11-17-westcol-boxeo-aburrido` | principal | 2026-11-19 22:58 | 2026-11-19 | [envío](../../datos/publicador/envios/2026-11-17-westcol-boxeo-aburrido__tiktok.json) |
| `2026-11-17-hh-aeropuerto-4am` | risas | 2026-11-19 22:58 | 2026-11-19 | [envío](../../datos/publicador/envios/2026-11-17-hh-aeropuerto-4am__tiktok.json) |
| `2026-11-17-ganga-robot-precio` | principal | 2026-11-19 22:58 | 2026-11-19 | [envío](../../datos/publicador/envios/2026-11-17-ganga-robot-precio__tiktok.json) |
| `2026-11-17-hh-colada-bano` | risas | 2026-11-19 22:59 | 2026-11-19 | [envío](../../datos/publicador/envios/2026-11-17-hh-colada-bano__tiktok.json) |
| `2026-11-17-hh-estafa-reventa` | risas | 2026-11-19 22:59 | 2026-11-19 | [envío](../../datos/publicador/envios/2026-11-17-hh-estafa-reventa__tiktok.json) |
| `2026-11-17-cotorrisa-suite-karol-g` | risas | 2026-11-19 22:59 | 2026-11-19 | [envío](../../datos/publicador/envios/2026-11-17-cotorrisa-suite-karol-g__tiktok.json) |

**Borradores que no conviene publicar** (caso Herrera; descártalos desde la app):

| Clip | Cuenta | En la bandeja desde | Texto |
|---|---|---|---|
| `2026-11-17-westcol-disculpa-pelea-jh` | principal | 2026-11-17 16:59 | [envío](../../datos/publicador/envios/2026-11-17-westcol-disculpa-pelea-jh__tiktok.json) |
| `2026-11-17-westcol-herrera-no-planeado` | principal | no se sabe si llegó (HTTP 500 el 2026-11-17 16:57) | [envío](../../datos/publicador/envios/2026-11-17-westcol-herrera-no-planeado__tiktok.json) |

## 1. `2026-11-18-luciernaga-imitadores-iva`

- **Gancho:** Imitadores: todos quieren el crédito del IVA
- **Puntaje:** 76 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-20 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-18-luciernaga-imitadores-iva/clip.mp4) (62,5 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-18-luciernaga-imitadores-iva/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=pYtwwPMrdzs
- **Revisar antes de publicar:** Humor político (legion/04-cazador-risas/enfoque.md): sátira con imitadores de La Luciérnaga (Caracol Radio). Los rótulos del propio programa dicen «Claudia López de La Luciérnaga» y «Álvaro Uribe de La Luciérnaga»; no sale ningún político real. Corrientes: centro y derecha. Los textos dicen siempre que son imitadores y no llevan opiniones, consignas ni etiquetas de partido: al publicar no se las añadas. El crédito no copia el título del video, que habla de un juez y de operativos de De la Espriella (fuera del clip). Escuchar dos palabras que los subtítulos dejan como «(…)» (1:23:41 y 1:23:50). Ficha: es el único de risas atado a una noticia (17-nov); mejor publicarlo pronto.

### TikTok · cuenta `risas` (@legion.risas) · en la bandeja desde 2026-11-20 21:16 (borrador), **enviado hoy**

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


## 2. `2026-11-17-culpa-marin-despide-quevedo`

- **Gancho:** Iván Marín tuvo que despedir a Ricardo Quevedo
- **Puntaje:** 76 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-20 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-culpa-marin-despide-quevedo/clip.mp4) (71 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-culpa-marin-despide-quevedo/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=OKqALYkh3LA
- **Revisar antes de publicar:** Escuchar dos tramos que los subtítulos dejan como «(…)» (38:41 y 39:17). Lenguaje fuerte tapado por YouTube («***»). La fuente viene algo saturada: si se oye mal, no lo publiques. La imagen no deja asegurar quién es quién: los textos nombran a Iván Marín y a Ricardo Quevedo porque el propio programa lo hace, y no atribuyen el remate a nadie. Mismo capítulo que culpa-mama-carrazo: publícalos separados.

### TikTok · cuenta `risas` (@legion.risas) · en la bandeja desde 2026-11-20 21:15 (borrador), **enviado hoy**

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


## 3. `2026-11-17-culpa-mama-carrazo`

- **Gancho:** La versión de mamá cuando compras carro
- **Puntaje:** 75 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-20 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-culpa-mama-carrazo/clip.mp4) (49,8 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-culpa-mama-carrazo/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=OKqALYkh3LA
- **Revisar antes de publicar:** Lenguaje fuerte tapado por YouTube («***»). Sale el público del show en plano general, sin nadie señalado. Quien cuenta la anécdota no se identifica en la imagen: los textos no lo nombran. Mismo capítulo que culpa-marin-despide-quevedo: publícalos separados.

### TikTok · cuenta `risas` (@legion.risas) · **no entró hoy**: TikTok cortó la cuenta (spam_risk_too_many_pending_share), intento 1 de 2; vence hoy salvo `/publicador aprobar 2026-11-17-culpa-mama-carrazo:tiktok`

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


## 4. `2026-11-18-ganga-guarida-toretto`

- **Gancho:** La Ganga despide su casa estilo Toretto
- **Puntaje:** 74 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-20 · **Línea:** urbano · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-18-ganga-guarida-toretto/clip.mp4) (53,4 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-18-ganga-guarida-toretto/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=QauXCZ2fFs8
- **Revisar antes de publicar:** La imagen no deja asegurar quién dice el brindis ni quién sale de cara: los textos solo nombran a La Ganga (sin #Westcol). El clip termina con media palabra del plano siguiente («E la…», 0,5 s) y la imagen es nocturna y oscura. Los textos dicen «no salió a la primera» y no «a la quinta toma», porque el clip solo muestra una toma fallida. Publícalo a otra hora que ganga-bienvenida-piscina.

### TikTok · cuenta `principal` (Legión Urbana) · en la bandeja desde 2026-11-20 21:15 (borrador), **enviado hoy**

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


## 5. `2026-11-18-ganga-bienvenida-piscina`

- **Gancho:** Bienvenida a La Ganga: directo a la piscina
- **Puntaje:** 73 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-20 · **Línea:** urbano · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-18-ganga-bienvenida-piscina/clip.mp4) (43,8 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-18-ganga-bienvenida-piscina/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=_R71FcOLQQQ
- **Revisar antes de publicar:** Velo entero antes de publicar: es una broma física entre amigos y él dice «no, no, no» mientras lo cargan; si no parece que se lo toma a risa, no lo publiques. No se puede confirmar quién es cada uno: los textos no nombran a nadie y el crédito no copia el título del video («Me desquite de Westcol y de Pan»), porque el tramo no muestra a quién tiran. Una frase queda como «(…)» (0:13:57). Publícalo a otra hora que ganga-guarida-toretto (la ficha lo pone el 20-nov a las 12:30).

### TikTok · cuenta `principal` (Legión Urbana) · en la bandeja desde 2026-11-20 21:16 (borrador), **enviado hoy**

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


## 6. `2026-11-17-westcol-show-kris-r`

- **Gancho:** Westcol sobre el show de Kris R
- **Puntaje:** 68 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-20 · **Línea:** urbano · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-westcol-show-kris-r/clip.mp4) (34,2 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-westcol-show-kris-r/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=YQ-vOO3-Ghk
- **Revisar antes de publicar:** Kris R no sale: habla Westcol. No suena música de Kris R. Dos palabras como (…).

### TikTok · cuenta `principal` (Legión Urbana) · en la bandeja desde 2026-11-20 21:16 (borrador), **enviado hoy**

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


## 7. `2026-11-17-renona-checo-dinosaurios`

- **Gancho:** Franco responde por Checo… y se pasa
- **Puntaje:** 74 · **Derechos:** `sin_verificar` (contenido de terceros sin permiso confirmado: riesgo de Content ID, bloqueo o avisos por derechos de autor; ver arriba) · **Ventana hasta:** 2026-11-21 · **Línea:** risas · **Pieza:** original (sin variantes)
- **Video:** [clip.mp4](../clipero/clips/2026-11-17-renona-checo-dinosaurios/clip.mp4) (54,4 s) · **Ficha:** [ficha.md](../clipero/clips/2026-11-17-renona-checo-dinosaurios/ficha.md) · **Fuente:** https://www.youtube.com/watch?v=DpE-D9sdE9M
- **Revisar antes de publicar:** Velo antes de publicar: el remate lo dice Franco imitando la voz de Checo según los comentarios del video y la propia mesa, pero el plano general no lo muestra de cerca. Si no fuera Franco, no lo publiques con este texto (el gancho del video también lo dice). Lenguaje fuerte («pendejada»). Los carteles de la gira de Franco en la mesa son del propio canal. Se corta antes de la réplica grosera de Checo.

### TikTok · cuenta `risas` (@legion.risas) · aprobado automáticamente; en cola (previsto 21-nov; hoy TikTok cortó la cuenta)

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


## 8. `2026-11-17-olga-agua-mostaza`

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


## 9. `2026-11-18-juanpis-pestilencia-juicio-tv`

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

- Aprobar un clip en todas sus plataformas: `/publicador aprobar <clip-id>` (por ejemplo, `/publicador aprobar 2026-11-18-luciernaga-imitadores-iva`).
- Aprobar una sola plataforma: `/publicador aprobar <clip-id>:<plataforma>` (por ejemplo, `/publicador aprobar 2026-11-18-luciernaga-imitadores-iva:youtube`).
- Aprobar todo lo pendiente: `/publicador aprobar todo` (Instagram y YouTube siguen sin activar: solo deja los envíos listos; en YouTube, lo aprobado saldrá público).
- Rechazar: `/publicador rechazar <clip-id> <motivo>`, o `/publicador rechazar <clip-id>:<plataforma> <motivo>` para una sola plataforma (con `:tiktok`, el clip deja de ir a la bandeja).
