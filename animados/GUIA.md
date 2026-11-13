# Videos animados — guía del método

Esta carpeta hace **videos explicativos animados sin cara**: verticales, de 20 a 45 segundos, dibujados con código, narrados en español y con subtítulos. Se pide un tema («hazme un video de por qué la cebolla te hace llorar») y sale un MP4 listo para subir.

Quien lee esto es Claude: cuando te pidan un video animado, sigue esta guía de principio a fin. El video de referencia, ya terminado, es [videos/legion-agentes/](videos/legion-agentes/); cópiale la estructura, no el contenido. [videos/cebolla/](videos/cebolla/) fue el primero y es anterior a `montaje.mjs`: su `index.html` y los segundos de sus escenas están escritos a mano, así que no le corras `montaje.mjs`.

El motor es [HyperFrames](https://github.com/heygen-com/hyperframes) (HTML animado con GSAP que se renderiza a MP4, licencia Apache 2.0). Sus reglas mandan sobre esta guía cuando choquen: están en el `CLAUDE.md` de cada carpeta de video y en `npx hyperframes docs <tema>`.

## Instalación (una vez por PC)

Hace falta Node 22 o superior, ffmpeg y Python 3.10 o superior. Desde la raíz del proyecto:

```powershell
python -m venv animados\.venv
animados\.venv\Scripts\python.exe -m pip install kokoro-onnx soundfile
npx --yes hyperframes@0.9.20 telemetry disable
npx --yes hyperframes@0.9.20 doctor
```

`doctor` debe mostrar en verde Node, FFmpeg y Chrome. Docker, whisper y MusicGen no se usan. La primera voz descarga el modelo Kokoro (unos 300 MB) y tarda más.

La versión de HyperFrames va fijada (`0.9.20`) en esta guía, en `herramientas/voz.mjs` y en el `package.json` de cada video. Para subirla se cambia en los tres sitios a la vez.

## Pasos de un video

Todo se corre desde la raíz del proyecto salvo que se diga otra cosa. `<video>` es un nombre corto en minúsculas y sin espacios (`cebolla`, `cafe-sueno`).

1. **Carpeta.** Dentro de `animados/videos/`:
   `npx --yes hyperframes@0.9.20 init <video> --example=blank --resolution=portrait --non-interactive --skip-skills`
2. **Guion.** Escribe `animados/videos/<video>/guion.json` (sección «Guion»). Comprueba cada dato antes de animarlo.
3. **Voz y tiempos.** `node animados/herramientas/voz.mjs animados/videos/<video>`
   Deja `assets/narracion.wav` y `tiempos.json`, con el inicio y el fin de cada frase y de cada palabra. Todo lo demás se sincroniza con ese archivo. Si cambias el guion, vuelve a correrlo: solo regenera las frases que cambiaron.
4. **Escenas.** Una escena por archivo en `compositions/`, con el mismo nombre que su `escena` en el guion (secciones «Estilo», «Escenas» y «Reglas técnicas»). Cada cosa aparece cuando la voz la nombra.
5. **Montaje.** `node animados/herramientas/montaje.mjs animados/videos/<video>`
   Genera `index.html` (una ranura por escena, subtítulos y audio) y `compositions/subtitulos.html`. Ninguno de los dos se edita a mano. Con `--sin-voz` el video sale mudo, con los mismos tiempos.
6. **Revisión.** Dentro de la carpeta del video: `npx --yes hyperframes@0.9.20 check --json`. Cero errores, y cada aviso arreglado o justificado.
7. **Mirar.** `npx --yes hyperframes@0.9.20 snapshot --at 0,1.9,3.2,... --no-end --keep -o snapshots` con al menos dos momentos por escena, y **mira las imágenes**. Que `check` pase no dice cómo se ve.
8. **Render.** `npx --yes hyperframes@0.9.20 render -q delivery -o renders/<video>.mp4`
9. **Entrega.** Di dónde quedó el MP4, cuánto dura y qué no pudiste comprobar (el sonido se mide, no se oye). La portada es el cuadro 0: `snapshot --at 0`.

Para verlo y retocarlo en el navegador: `npx --yes hyperframes@0.9.20 preview` dentro de la carpeta del video.

## Serie con plantillas

Para sacar muchos videos del mismo formato no se dibuja cada uno: el guion pide sus escenas por **plantilla** y solo cambia los datos. Un video nuevo es una carpeta con su `guion.json`; un solo comando hace el resto:

```powershell
node animados/herramientas/producir.mjs animados/videos/<video>              # voz, montaje, revisión, render y entrega
node animados/herramientas/producir.mjs animados/videos/<video> --sin-render # se queda en la revisión
node animados/herramientas/producir.mjs --todos                              # los que no tienen MP4 o cambiaron de guion
node animados/herramientas/capturas.mjs animados/videos/<video>              # hojas de capturas para mirar
```

La entrega queda en `salidas/animador/<video>/`: el MP4, `portada.jpg`, `publicacion.txt` (texto y hashtags) y `meta.json`. `salidas/animador/videos.json` lista todo lo entregado.

En el guion, las plantillas van así (el ejemplo completo es [videos/restaurante/guion.json](videos/restaurante/guion.json)):

```json
"datos": { "letrero": "TU RESTAURANTE", "tareas": [{ "texto": "Reservas", "icono": "calendario", "color": "#6fd3ff", "palabra": "reservas" }] },
"escenas": {
  "gancho": { "plantilla": "gancho-edificio", "datos": { "lineas": ["¿Y si tu restaurante", "tomara reservas", "mientras duermes?"] } },
  "agente1": { "plantilla": "agente-chat", "datos": { "rotulo": "RESERVAS", "color": "#6fd3ff", "estado": "Reservado", "mensajes": [{ "de": "cliente", "texto": "¿Mesa para 4 hoy?" }, { "de": "agente", "texto": "¡Lista! A las 8." }] } }
}
```

`datos` vale para todas las escenas; los de cada escena se suman encima. Una escena sin plantilla se escribe a mano en `compositions/`, como antes.

**Plantillas** (en [plantillas/](plantillas/); cada archivo dice arriba qué datos pide):

| Plantilla | Qué muestra | Datos |
|---|---|---|
| `gancho-edificio` | Título en tres líneas y el negocio de noche con agentes en las ventanas | `lineas` (3), `letrero` |
| `tareas-reloj` | Cuatro tareas que caen alrededor de un reloj que se pone rojo | `tareas` (4), `come` |
| `nacen-agentes` | De un núcleo de IA nace un agente por cada tarea | `tareas` |
| `agente-chat` | Un agente conversando | `rotulo`, `color`, `estado`, `mensajes` (2) |
| `agente-agenda` | Un calendario al que se le llenan cupos | `rotulo`, `color`, `estado` |
| `agente-cobros` | Una cuenta que recibe su sello | `rotulo`, `color`, `estado`, `sello` |
| `agente-pedidos` | Tres tarjetas que se van marcando | `rotulo`, `color`, `estado`, `items` (3) |
| `agente-ventas` | Barras que crecen, flecha y moneda | `rotulo`, `color`, `estado` |
| `agente-redes` | Un teléfono con una publicación y corazones | `rotulo`, `color`, `estado` |
| `legion-aprueba` | La legión completa, día y noche, y el botón «Aprobado» | ninguno |
| `cierre-marca` | La marca, la fila de agentes «a la medida» y el botón | `letrero`, `linea`, `boton` |

Iconos para las tareas ([plantillas/iconos.json](plantillas/iconos.json)): `mensaje`, `documento`, `moneda`, `flecha`, `calendario`, `bolsa`, `estrella`, `campana`, `visto`, `lupa`, `caja`, `persona`, `llave`, `reloj`, `corazon`.

### La serie «mientras duermes»

Un video por tipo de negocio, siempre con las mismas nueve frases y ocho escenas:

| Frase | Escena | Plantilla | Texto |
|---|---|---|---|
| f1 | `gancho` | `gancho-edificio` | «¿Y si tu *negocio* *hiciera algo* mientras duermes?» |
| f2 | `problema` | `tareas-reloj` | «*A*, *B*, *C*, *D*: tareas que se comen tu día.» |
| f3 | `solucion` | `nacen-agentes` | «Nosotros creamos un agente de inteligencia artificial para cada una.» (fija) |
| f4 a f6 | `agente1` a `agente3` | una `agente-…` cada una | «Uno…», «Otro…», «Otro…» |
| f7 | `legion` | `legion-aprueba` | «Trabajan juntos, día y noche, y tú solo apruebas.» (fija) |
| f8 | `cierre` | `cierre-marca` | «Eso es una legión de agentes, hecha a la medida de tu *negocio*.» |
| f9 | `cierre` | | «Escríbenos y armamos la tuya.» (fija) |

Medidas que hacen que quepa y alcance a leerse:

- **Gancho:** tres líneas de 21 letras o menos; la tercera es siempre «mientras duermes?». `f1` y `f9` llevan `"subtitulos": false`.
- **Tareas:** cuatro, de una palabra y 9 letras o menos. La `palabra` de cada una tiene que estar dicha en `f2`: es lo que dispara su caída.
- **Frases de agente:** de 5 a 8 palabras, con `"pausa_despues": 0.5` para que la escena respire.
- **Texto en pantalla de cada agente:** `rotulo` de una palabra (13 letras o menos), `estado` de 3 palabras o menos, `mensajes` de 4 palabras o menos, `items` de 2 palabras o menos.
- **Colores:** las tareas usan en orden `#6fd3ff`, `#ffc93c`, `#86e8b4`, `#ff7eb6`; los agentes, `#6fd3ff`, `#ffc93c` y `#ff7eb6`.
- **Las frases fijas no se tocan** ni se cambia la voz: así la serie suena igual y esas frases se pagan una sola vez (quedan en `animados/.voz-cache/`).
- **`publicacion`:** `texto` de una a tres frases y cinco o seis `hashtags`.

### Una plantilla nueva

Una plantilla es una escena normal con marcas: `{{id}}` (el id de la escena, prefijo de todos sus ids y clases), `{{d.dato}}` (un dato, escapado), `{{{d.dato}}}` (sin escapar, para SVG), `{{datos}}` (todos los datos como JSON, para el script) y `{{>nombre}}` (incluye `plantillas/_nombre.html`). Como no sabe qué texto le va a tocar, no cuenta palabras: se ancla a partes de la frase (`r.en(0, 0.5)`) o a una palabra con respaldo (`r.palabra(0, "comen", 0.78)`). Antes de usarla en serie, pruébala con un video y mira sus capturas.

## Guion

`guion.json`:

```json
{
  "titulo": "¿Por qué la cebolla te hace llorar?",
  "voz": "ef_dora",
  "velocidad": 1.0,
  "inicio": 0.2,
  "pausa": 0.22,
  "cola": 1.5,
  "frases": [
    { "id": "f1", "escena": "gancho", "subtitulos": false, "texto": "¿Por qué la cebolla te hace llorar?" },
    { "id": "f2", "escena": "corte", "texto": "Cuando la cortas, rompes miles de células diminutas.", "clave": ["células"] }
  ]
}
```

- **Gancho:** la primera frase es una pregunta que la gente ya se ha hecho, de 8 palabras o menos. Es el título en pantalla, así que lleva `"subtitulos": false`.
- **Cuerpo:** de 4 a 6 frases que responden esa pregunta con un solo ejemplo seguido de principio a fin, no con una lista de datos. Cada frase es un paso y una imagen.
- **Cierre:** la última frase deja algo útil (un truco, la respuesta en corto). En pantalla se remata con una línea propia de 2 a 5 palabras que no repite lo que dice la voz y que dura al menos 2 segundos.
- **Largo:** hasta 19 palabras por frase. De 60 a 75 palabras dan unos 25 segundos; el tope son 110 palabras (45 segundos).
- **Tono:** de tú, frases cortas, español neutro. Sin «hola», sin presentarse y sin pedir que sigan la cuenta.
- **Verdad:** cada afirmación se comprueba antes de animarla. Si un dato está en discusión, se dice la versión segura o se quita. Un dibujo bonito y falso es peor que no tenerlo.
- **`clave`:** una o dos palabras por frase que cargan el sentido; salen en color de acento en los subtítulos.
- **`escena`:** el archivo de `compositions/` que se ve mientras suena esa frase. Las frases de una misma escena van seguidas.
- **`motor`:** de dónde sale la voz: `"higgsfield"`, `"kokoro"` (por defecto) o `"externo"` (sección «Sonido»).
- **Guiones propios:** el tema puede ser el mismo que el de otro video; el texto, el orden y los dibujos son nuestros.

**Si es un anuncio** (para pautar), cambia tres cosas:
- El gancho nombra el problema o el deseo del cliente, no una curiosidad.
- El cuerpo muestra cómo funciona el servicio en pasos que se puedan dibujar.
- El cierre sí pide una acción («Escríbenos»), con un botón en pantalla que dura al menos 2 segundos.

No se inventan cifras, clientes, precios ni resultados: solo se dice lo que el servicio hace.

## Estilo

**Formato:** 1080×1920, 30 cuadros por segundo.

**Zonas del cuadro** (la app tapa los bordes):

| Zona | Píxeles en vertical | Qué va |
|---|---|---|
| Arriba | 0 a 168 | Nada |
| Dibujo | 190 a 1100 | El sujeto, los títulos y las etiquetas |
| Subtítulos | 1150 a 1280 | Solo los subtítulos |
| Abajo | desde 1330 | Solo fondo |

En horizontal, el texto va entre 108 y 972.

**Colores.** El fondo y la tinta no cambian; el resto sale del tema.

| Uso | Color |
|---|---|
| Fondo | `#0d2029` con un resplandor `#1f4a58` detrás del sujeto |
| Tinta (texto) | `#fbf7ef` |
| Acento (palabra clave, rótulos) | `#ffc93c` |
| Alerta | `#ff6b5e` |
| Agua, frío | `#6fd3ff` |
| Gas, aire | `#86e8b4` |
| Sujeto | El color real de la cosa, saturado, en tres tonos: base, sombra y brillo |

**Letra:** Nunito 900 para todo. Título del gancho a 112 px, cierre a 92 px, rótulos entre 40 y 60 px. Nada que se lea por debajo de 28 px.

**Dibujo:**
- SVG plano escrito a mano: formas redondeadas, sin contorno, con una sombra más oscura a un lado, un brillo claro y una sombra elíptica en el piso.
- Un solo sujeto, centrado, grande. Si el tema lo permite, con cara (dos ojos y una boca): da carácter con muy poco.
- Lo que no se ve a simple vista se muestra dentro de una lupa redonda con borde claro.
- Las etiquetas van pegadas a la parte que nombran, con una línea guía, y solo cuando añaden algo que la voz no dice.
- Sin emojis, sin fotos, sin logos de terceros.

**Movimiento:**
- El cuadro 0 es la portada: título y sujeto ya en pantalla, nunca negro.
- Algo nuevo cada 2 a 4 segundos. Las cosas entran con rebote (`back.out`) en 0,25 a 0,4 s.
- De una escena a la siguiente se conserva el sujeto en el mismo sitio para que el corte no se note.
- Nunca más de 3 segundos sin que algo se mueva.

## Escenas

Las escenas no llevan segundos escritos a mano: le preguntan al reloj cuándo se dice cada palabra. Así, si cambia la voz, basta con correr `voz.mjs` y `montaje.mjs` otra vez.

```js
const tl = gsap.timeline({ paused: true });
const r = window.__reloj("problema"); // el nombre de esta escena
const fx = window.__fx;

fx.entra(tl, "#pr-reloj", 0, { y: 60 });        // entra con rebote al empezar la escena
fx.entra(tl, "#pr-chip-2", r.p("f2", 2));       // entra cuando se dice la palabra 2 de la frase f2
fx.golpe(tl, "#pr-reloj", r.fin("f2"));         // salta cuando termina la frase f2
fx.flota(tl, "#pr-robot-f", 0.6, r.dur);        // vaivén hasta el final de la escena

window.__timelines["problema"] = tl;
```

| Función | Qué da o qué hace |
|---|---|
| `r.p("f2", 3)` | Segundo en que se dice la palabra 3 de la frase `f2` (la primera es la 0), contado desde que empieza la escena |
| `r.ini("f2")`, `r.fin("f2")` | Segundo en que empieza y en que termina la frase `f2` |
| `r.en("f2", 0.5)` | La mitad de la frase `f2` (la parte va de 0 a 1) |
| `r.palabra("f2", "comen", 0.78)` | Segundo en que se dice esa palabra; si no está en la frase, cae en esa parte |
| `r.dur` | Duración de la escena |

Una frase se nombra por su id (`"f2"`) o por su puesto dentro de la escena (`0` es la primera); las plantillas usan el puesto.

| Función | Qué hace |
|---|---|
| `fx.entra(tl, sel, t, desde)` | Entra con rebote; `desde` suma un punto de partida, como `{ y: 80 }` |
| `fx.sale(tl, sel, t, hacia)` | Sale encogiéndose |
| `fx.golpe(tl, sel, t, escala)` | Salto de énfasis sobre algo que ya está en pantalla |
| `fx.flota(tl, sel, t, fin)` | Vaivén suave y finito; va en un envoltorio interior que no tenga otro movimiento en `y` |
| `fx.tiembla(tl, sel, t)` | Temblor corto; va en un elemento que no tenga otro movimiento en `x` |

Para ver en qué palabra cae cada cosa, abre `tiempos.json`: cada frase trae sus palabras en orden.

## Subtítulos

Los genera `subtitulos.mjs` (lo llama `montaje.mjs`): grupos de hasta 3 palabras, uno a la vez; cada palabra se enciende cuando la voz la dice. Si hay que cambiar el aspecto, se cambia en el script para que todos los videos queden iguales.

## Sonido

- **Voz de Higgsfield (la que se publica):** en el guion, `"motor": "higgsfield"`, `"variante": "elevenlabs"` y `"voz": "Bram"` (un nombre de `higgsfield voices list`). Necesita el CLI instalado y con sesión (`npm i -g @higgsfield/cli` y `higgsfield auth login`; los corre la persona, no Claude). Gasta créditos de esa cuenta: un video de 30 segundos cuesta cerca de 2. Solo se vuelven a generar las frases que cambian. Todas las voces traen muestra en inglés, así que una voz nueva se prueba primero con una frase y se revisa con whisper que el español se entienda.
- **Voz local:** Kokoro (`ef_dora` de mujer, `em_alex` y `em_santa` de hombre), con `"motor": "kokoro"`. Es gratis y suena sintética; sirve para armar y cronometrar el video, no para publicarlo.
- **Voz de otro servicio:** genera o graba una frase por archivo, con el `id` de la frase como nombre (`f1.wav`, `f2.mp3`…), y déjalas en `assets/voz-externa/`. Pon `"motor": "externo"` en el guion y corre `voz.mjs` y `montaje.mjs`: el video se vuelve a sincronizar solo.
- **Volumen:** el video final queda cerca de −16 LUFS. Se comprueba con `ffmpeg -i <mp4> -af ebur128 -f null -`.
- **Música y efectos:** todavía no hay. Cuando haya una fuente con licencia clara, la música va a 0,14 de volumen bajo la voz y cada efecto tiene una causa visible en pantalla.

## Reglas técnicas que más se rompen

- La escena, su anfitrión en `index.html` y la clave de su línea de tiempo llevan el mismo id. Todo el contenido de una escena va dentro de `<template>`, y su raíz se estiliza como `#root`.
- Los ids no se repiten entre escenas: llevan un prefijo de dos letras (`co-`, `vj-`).
- Dentro de una escena se usa `fromTo` para la primera aparición y `to` para lo que sigue. Nunca `from`.
- Lo que aparece más tarde arranca oculto por CSS (`opacity: 0`) o por el estado inicial de su `fromTo`.
- Nada de `Math.random()`, `Date.now()`, temporizadores ni `repeat: -1`. Las repeticiones son finitas y terminan antes de que acabe la escena.
- No se pone `transform` en CSS a un elemento que GSAP anima. La posición va con `left` y `top`; el movimiento, con `x`, `y`, `scale` y `rotation`.
- Cada objeto es un `div` con posición absoluta y su `svg` dentro; se anima el `div`.
- Los signos que la letra no trae (✓, flechas, corazones) se dibujan en SVG; nada de emojis.
- `index.html` y `subtitulos.html` los escribe `montaje.mjs`: lo que se cambie a mano se pierde.

## Antes de entregar

- [ ] `check` sin errores.
- [ ] Capturas vistas, al menos dos por escena: nada tapado, nada fuera de su zona, tildes y signos bien.
- [ ] El cuadro 0 sirve de portada.
- [ ] Cada dibujo aparece cuando la voz lo nombra.
- [ ] El cierre dura 2 segundos o más.
- [ ] Volumen medido en el MP4.

## Qué hay en la carpeta

```
animados/
  GUIA.md                  esta guía
  herramientas/producir.mjs  todo de una vez: voz, montaje, revisión, render y entrega
  herramientas/voz.mjs       narración y tiempos por palabra
  herramientas/montaje.mjs   index.html, escenas de plantilla y subtítulos
  herramientas/capturas.mjs  hojas de capturas para revisar
  herramientas/subtitulos.mjs
  plantillas/                escenas reutilizables e iconos
  videos/<video>/
    guion.json             lo que se dice
    tiempos.json           cuándo se dice (generado)
    index.html             montaje: escenas, subtítulos y audio (generado)
    compositions/*.html    una escena por archivo
    renders/               los MP4 (no van a GitHub)
```

Los scripts son de Node porque HyperFrames ya lo exige; el resto de la Legión sigue en PowerShell.
