# Animador: informe del ciclo del 2026-11-18

Se pidieron 3 videos y se tomaron los tres primeros temas pendientes: veterinaria, taller y hotel. Desde el 18 de noviembre la voz la graba una persona (`"motor": "grabada"`, sección «Sonido» de `animados/GUIA.md`). Por eso **ningún video quedó terminado en este ciclo**: los tres tienen el guion listo y la imagen revisada, y esperan la grabación.

## Esperando grabación (3)

Orden sugerido para publicarlos: **hotel → veterinaria → taller**. Así ninguno repite formato, plantilla de gancho ni color con el anterior, empezando por `salon`, que fue el último publicado.

| Orden | Video | Título | Formato | Gancho | Color | Agentes | Duración estimada | Frases para leer |
|---|---|---|---|---|---|---|---|---|
| 1 | `hotel` | Todos duermen. Tu hotel sigue atendiendo. | de noche (nuevo) | `gancho-edificio` | turquesa (`#04201e`/`#127a70`) | pedidos («Llegadas», 9:00 p. m.), chat («Reservas», 2:00 a. m.), cobros («Pagos», 6:00 a. m.) | unos 27 s | `animados/videos/hotel/para-grabar.txt` |
| 2 | `veterinaria` | ¿Quién avisa cuándo toca la vacuna? | antes y después | `gancho-heroe` con dibujo nuevo (`huella`) | oliva (`#191f06`/`#5f7316`) | agenda («Vacunas»), redes, chat («Atención») | unos 32 s | `animados/videos/veterinaria/para-grabar.txt` |
| 3 | `taller` | Con las manos en el motor, ¿quién contesta? | manos ocupadas (nuevo) | `gancho-mensajes` | grafito (`#14171c`/`#4a5463`) | chat («Mensajes»), cobros («Facturas») | unos 32 s | `animados/videos/taller/para-grabar.txt` |

Las frases de los tres están juntas en `salidas/animador/por-grabar.md`. Cuando el audio esté en la carpeta (`grabacion.m4a`), el próximo ciclo sigue desde ahí: corta la voz, revisa, saca las capturas y entrega el MP4.

Formatos nuevos:
- **de noche:** `gancho-edificio`, tres agentes con `insignia` de hora nocturna, `legion-aprueba` y `cierre-marca`.
- **manos ocupadas:** `gancho-mensajes`, `tareas-reloj`, `nacen-agentes`, dos agentes, `legion-aprueba` y `cierre-marca`.

## Qué se comprobó

- `producir.mjs --sin-render` en los tres: se escribió `para-grabar.txt` y el video quedó «esperando grabación», sin errores.
- **Revisión con tiempos estimados.** Para no esperar a la grabación, se armó en el scratchpad una copia de cada video con tiempos calculados por el largo de las palabras (no se entregó nada de esa copia). Se corrió `montaje.mjs --sin-voz`, `hyperframes check` y `capturas.mjs`, y se miraron todas las hojas, más capturas extra del cambio «antes/después» de la veterinaria.
  - La revisión pasó sin errores. Quedaron dos avisos que no cuentan: `timeline_track_too_dense`, que `producir.mjs` ignora, y `film_silent`, que sale porque la copia era muda.
  - En las capturas no hay texto fuera de su píldora ni cosas encimadas, y las tildes y los signos salen bien.
  - El cuadro 0 sirve de portada en los tres.
- **Dibujo nuevo** `huella` en `animados/plantillas/heroes.json`: una huella color caramelo, con sombra a la derecha, brillo y un corazón rosado. Se probó en el gancho de la veterinaria.

## Qué no se pudo comprobar

- **Duración y volumen reales:** no hay MP4. Las duraciones de la tabla son estimadas; la real depende de quién lea.
- **La voz:** nadie ha grabado todavía. Con la grabación hay que volver a mirar las capturas, porque los tiempos de las escenas cambian. Si sale «Para revisar de oído», lo decide una persona.
- **Escena vacía en el cambio:** en la veterinaria, el cambio de «ANTES» a «DESPUÉS» deja unas décimas con solo el rótulo. Es así en la plantilla y ya pasaba en `consultorio`.

## Propuestas

- **GUIA.md** (no la toqué; no es mi carpeta): agregar los formatos «de noche» y «manos ocupadas» a la tabla, los colores turquesa, oliva y grafito a la lista de usados, y `huella` a los dibujos.
- **Plantilla `agente-pedidos`:** el icono de las tarjetas es siempre una bolsa de compras. En el hotel pasa por maleta, pero un `icono` por tarjeta (de `iconos.json`) la haría útil para más negocios.
- **Plantilla `gancho-edificio`:** las zetas salen con la palabra «mientras». Si la frase no la dice, como en el hotel, salen al 60 % de la frase. Se ve bien, pero se podría pasar la palabra como dato.

## Gasto

No se usó Higgsfield: la guía ya no lo usa para la serie. `higgsfield account status` muestra 285,96 créditos.

## Temas pendientes (7)

academia, agencia-viajes, ferreteria, optica, panaderia, oficina-contable, spa.
