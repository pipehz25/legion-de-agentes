# Videos animados — guía del método

Esta carpeta hace **videos explicativos animados sin cara**: verticales, de 20 a 45 segundos, dibujados con código, narrados en español y con subtítulos. Se pide un tema («hazme un video de por qué la cebolla te hace llorar») y sale un MP4 listo para subir.

Quien lee esto es Claude: cuando te pidan un video animado, sigue esta guía de principio a fin. El video de referencia, ya terminado, es [videos/legion-agentes/](videos/legion-agentes/); cópiale la estructura, no el contenido. [videos/cebolla/](videos/cebolla/) fue el primero y es anterior a `montaje.mjs`: su `index.html` y los segundos de sus escenas están escritos a mano, así que no le corras `montaje.mjs`.

El motor es [HyperFrames](https://github.com/heygen-com/hyperframes) (HTML animado con GSAP que se renderiza a MP4, licencia Apache 2.0). Sus reglas mandan sobre esta guía cuando choquen: están en el `CLAUDE.md` de cada carpeta de video y en `npx hyperframes docs <tema>`.

## Instalación (una vez por PC)

Hace falta Node 22 o superior, ffmpeg y whisper con su modelo (para cortar la voz grabada y comprobarla). Python y Kokoro solo hacen falta para la voz local de prueba.

**Windows.** whisper, su modelo y ffmpeg los instala `herramientas/instalar.ps1`. Desde la raíz del proyecto:

```powershell
npx --yes hyperframes@0.9.20 telemetry disable
npx --yes hyperframes@0.9.20 doctor
# solo para la voz local de prueba:
python -m venv animados.venv
animados.venvScriptspython.exe -m pip install kokoro-onnx soundfile
```

**Mac** (sin probar todavía en uno). Con [Homebrew](https://brew.sh):

```bash
brew install node ffmpeg whisper-cpp
mkdir -p herramientas/modelos
curl -L -o herramientas/modelos/ggml-small-q5_1.bin https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small-q5_1.bin
npx --yes hyperframes@0.9.20 telemetry disable
npx --yes hyperframes@0.9.20 doctor
# solo para la voz local de prueba:
python3 -m venv animados/.venv && animados/.venv/bin/pip install kokoro-onnx soundfile
```

`voz.mjs` busca whisper primero en `herramientas/bin/whisper/` y después en el PATH (`whisper-cli`), y el modelo en `herramientas/modelos/` o en la variable `WHISPER_MODELO`. Los programas los instala la persona, no Claude.

`doctor` debe mostrar en verde Node, FFmpeg y Chrome. Docker y MusicGen no se usan.

La versión de HyperFrames va fijada (`0.9.20`) en esta guía, en `herramientas/voz.mjs` y en el `package.json` de cada video. Para subirla se cambia en los tres sitios a la vez.

## Pasos de un video

Todo se corre desde la raíz del proyecto salvo que se diga otra cosa. `<video>` es un nombre corto en minúsculas y sin espacios (`cebolla`, `cafe-sueno`).

1. **Carpeta.** Dentro de `animados/videos/`:
   `npx --yes hyperframes@0.9.20 init <video> --example=blank --resolution=portrait --non-interactive --skip-skills`
2. **Guion.** Escribe `animados/videos/<video>/guion.json` (sección «Guion»). Comprueba cada dato antes de animarlo.
3. **Voz y tiempos.** Con voz grabada (lo normal), alguien lee `para-grabar.txt` y deja el audio en la carpeta del video como `grabacion.m4a` (sección «Sonido»). Después: `node animados/herramientas/voz.mjs animados/videos/<video>`
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

`datos` vale para todas las escenas; los de cada escena se suman encima. Toda escena `agente-…` acepta además una `insignia` opcional arriba a la derecha (una hora o «1 de 3»). Una escena sin plantilla se escribe a mano en `compositions/`, como antes.

**Plantillas** (en [plantillas/](plantillas/); cada archivo dice arriba qué datos pide):

| Plantilla | Qué muestra | Datos |
|---|---|---|
| `gancho-edificio` | Título en tres líneas y el negocio de noche con agentes en las ventanas | `lineas` (3), `letrero` |
| `gancho-heroe` | Título en tres líneas y, grande, el objeto que identifica al negocio, con dos agentes a los lados | `lineas` (3), `resalta`, `heroe` |
| `gancho-mensajes` | Título y una bandeja de mensajes de clientes que se acumulan sin respuesta | `lineas` (3), `resalta`, `mensajes` (4) |
| `antes-despues` | Tres problemas tachados y, al cambiar de frase, tres cosas resueltas (dos frases) | `antes` (3), `despues` (3) |
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

### Cada video es distinto

Regla de la casa (la pidió Santiago el 2026-11-12): **dos videos no se pueden parecer**. Lo que la marca repite es el robot, la letra, la voz y el cierre; todo lo demás cambia de un video a otro. Antes de escribir un guion, mira en `salidas/animador/videos.json` y en los guiones ya hechos qué se usó, y escoge otra cosa en estas cuatro cosas:

1. **Formato** (la estructura): no repitas el del video anterior.
2. **Gancho:** otra frase y otra plantilla de gancho; nunca dos «¿Y si tu…?» seguidos.
3. **Paleta:** un `estilo` propio, de un tono que no se haya usado en los últimos videos.
4. **Agentes:** otra combinación de plantillas `agente-…`, en otro orden.

Formatos que ya existen (el campo `formato` del guion es solo una etiqueta para llevar la cuenta):

| Formato | Escenas, en orden | Ejemplo |
|---|---|---|
| `mientras duermes` | `gancho-edificio`, `tareas-reloj`, `nacen-agentes`, tres agentes, `legion-aprueba`, `cierre-marca` | [tienda](videos/tienda/guion.json) |
| `un dia` | `gancho-heroe`, tres agentes con `insignia` de hora («9:00 a. m.»), `legion-aprueba`, `cierre-marca` | [restaurante](videos/restaurante/guion.json) |
| `antes y despues` | `gancho-heroe`, `antes-despues`, tres agentes, `cierre-marca` | [consultorio](videos/consultorio/guion.json) |
| `mensajes sin responder` | `gancho-mensajes`, tres agentes, `legion-aprueba`, `cierre-marca` | [inmobiliaria](videos/inmobiliaria/guion.json) |
| `tres agentes` | `gancho-heroe`, tres agentes con `insignia` «1 de 3», `legion-aprueba`, `cierre-marca` | [gimnasio](videos/gimnasio/guion.json) |
| `tu a lo tuyo` | `gancho-heroe`, `tareas-reloj`, `nacen-agentes`, dos agentes, `cierre-marca` | [salon](videos/salon/guion.json) |
| `de noche` | `gancho-edificio`, tres agentes con `insignia` de hora nocturna, `legion-aprueba`, `cierre-marca` | [hotel](videos/hotel/guion.json) |
| `manos ocupadas` | `gancho-mensajes`, `tareas-reloj`, `nacen-agentes`, dos agentes, `legion-aprueba`, `cierre-marca` | [taller](videos/taller/guion.json) |

Un formato nuevo es bienvenido: es otra manera de ordenar las plantillas, o una plantilla nueva. Lo único fijo es que el video termina en `cierre-marca`.

**Paleta.** `"estilo": { "fondo": "#2a0d12", "brillo": "#7a2330" }`: un fondo muy oscuro y un brillo del mismo tono, más claro. De esos dos colores salen solos los tonos de tarjetas y paneles. Sin `estilo`, el video sale en el verde azulado de siempre. Ya usadas: vino (`#2a0d12`/`#7a2330`), azul (`#0b1830`/`#1f4a8a`), verde (`#0b2417`/`#1c6a45`), morado (`#1a0f33`/`#4a2f8a`), naranja quemado (`#291407`/`#8a4514`), magenta (`#2a0b26`/`#86246f`), turquesa (`#04201e`/`#127a70`), oliva (`#191f06`/`#5f7316`) y grafito (`#14171c`/`#4a5463`).

**Dibujo del negocio.** `gancho-heroe` pone grande el objeto que identifica al negocio. Están en [plantillas/heroes.json](plantillas/heroes.json): `plato`, `diente`, `casa`, `tienda`, `pesa`, `tijeras`, `huella`. Si el negocio no tiene el suyo, dibújalo y agrégalo ahí: SVG plano en un lienzo de 400×400, con las reglas de «Dibujo» (sin contorno, sombra a un lado, brillo claro y sombra elíptica en el piso).

**Frases que no cambian** (así la marca suena igual en todos los videos):

- Con `nacen-agentes`: «Nosotros creamos un agente de inteligencia artificial para cada una.»
- Con `legion-aprueba`: «Trabajan juntos, día y noche, y tú solo apruebas.»
- Con `cierre-marca`, dos frases: «Eso es una legión de agentes, hecha a la medida de tu *negocio*.» y «Escríbenos y armamos la tuya.»

**Medidas** que hacen que quepa y alcance a leerse:

- **Gancho:** tres líneas de 21 letras o menos. La frase del gancho y la última llevan `"subtitulos": false`, igual que las dos de `antes-despues` (el texto ya está en pantalla).
- **Tareas** (`tareas-reloj`): cuatro, de una palabra y 9 letras o menos. La `palabra` de cada una tiene que estar dicha en la frase: es lo que dispara su caída.
- **Frases de agente:** de 5 a 10 palabras, con `"pausa_despues": 0.5` para que la escena respire.
- **Texto en pantalla de cada agente:** `rotulo` de una palabra (13 letras o menos), `estado` de 3 palabras o menos, `mensajes` de 4 palabras o menos, `items` de 2 palabras o menos, `insignia` de 10 letras o menos.
- **`antes-despues`:** tres renglones por lado, de 3 palabras o menos.
- **`gancho-mensajes`:** cuatro mensajes de 3 palabras o menos.
- **Colores de los datos:** `#6fd3ff`, `#ffc93c`, `#86e8b4` y `#ff7eb6`, sin repetir entre agentes del mismo video.
- **`publicacion`:** `texto` de una a tres frases y cinco o seis `hashtags`.

### Una plantilla nueva

Una plantilla es una escena normal con marcas: `{{id}}` (el id de la escena, prefijo de todos sus ids y clases), `{{d.dato}}` (un dato, escapado), `{{{d.dato}}}` (sin escapar, para SVG), `{{d.dato|respaldo}}` y `{{{d.dato|}}}` (dato opcional: si falta, queda el respaldo, que puede ser vacío), `{{datos}}` (todos los datos como JSON, para el script) y `{{>nombre}}` (incluye `plantillas/_nombre.html`). Como no sabe qué texto le va a tocar, no cuenta palabras: se ancla a partes de la frase (`r.en(0, 0.5)`) o a una palabra con respaldo (`r.palabra(0, "comen", 0.78)`). Antes de usarla en serie, pruébala con un video y mira sus capturas.

## Videos propios (Narrador): temas y plantillas

Los videos de contenido propio (historia, historia de la medicina, ciencia, dinero, curiosidades) usan el mismo motor, pero con **plantillas para explicar** y **tres estilos visuales**. Viven en `animados/propios/<video>/` y `producir.mjs` los entrega en `salidas/narrador/<video>/`. El método (guion, fuentes, límites de salud y dinero, calendario) está en [contenido/NARRADOR.md](contenido/NARRADOR.md); aquí va lo técnico.

### Cómo se activa un tema

En el guion:

```json
"estilo": { "tema": "archivo" }
"estilo": { "tema": "pizarra", "fondo": "#120a1c", "brillo": "#3a1f55" }
```

`fondo` y `brillo` son opcionales: varían la paleta del fondo dentro del tema (en los temas claros, usa tonos claros; en `pizarra`, oscuros). Sin `tema`, el video sale exactamente como los del Animador (fondo verde azulado, Nunito, subtítulos blancos): los videos de venta no cambian.

| Tema | Para | Fondo | Tinta / acento / alerta | Letra (título / texto) |
|---|---|---|---|---|
| `archivo` | Historia | Papel envejecido crema (`#eadbb8`/`#fbf3df`), motas y fibras fijas, viñeta en los bordes | Marrón `#3b2415` / rojo lacre `#a3302a` / óxido `#b0402a`; oro viejo `#9a7128` | Playfair Display 900 / EB Garamond 700 |
| `laboratorio` | Medicina y ciencia | Blanco azulado (`#eaf3f7`/`#ffffff`) con cuadrícula de cuaderno y margen coral | Azul petróleo `#0e3a48` / turquesa `#0a9792` / coral `#e9584b` | Inter 900 / Inter 700 |
| `pizarra` | Dinero, datos, curiosidades | Casi negro (`#090d16`/`#17263f`) con puntos de cuadrícula | Blanco `#eef6ff` / cian neón `#3ff0ff` (con resplandor) / magenta `#ff4fd8`; lima `#b8ff3c` | Space Grotesk 700 / 500 |

**Qué pone el tema** (`montaje.mjs`, objeto `TEMAS`): el fondo de `index.html`, el atributo `data-tema` en `<html>`, `window.__tema` (nombre y ancho medio de letra, para ajustar textos) y estas variables CSS, que son las que usan las plantillas del Narrador: `--papel`, `--tinta`, `--tinta-suave`, `--acento`, `--acento2`, `--alerta`, `--bien`, `--sobre-acento` (texto sobre un fondo de acento), `--tarjeta`, `--borde-tarjeta`, `--sombra`, `--radio`, `--linea`, `--riel`, `--resplandor`, `--il-filtro` (cómo se asientan las ilustraciones: en `archivo` se entintan en sepia; en `pizarra`, brillan), `--marco`, `--lupa-aro`, `--lupa-mango`, `--ins-*` (insignias), `--fuente-titulo`, `--fuente-texto`, `--fuente-cifra`, `--peso-titulo`, `--peso-texto` y `--sub-*` (subtítulos).

**Subtítulos con tema:** la misma franja (1150 a 1280 px), grupos de hasta 3 palabras, pero con la letra y los colores del tema y sobre una **píldora** que contrasta: crema con tinta marrón en `archivo`, blanca con tinta azul petróleo en `laboratorio` y oscura con letra blanca y resplandor en `pizarra`. Las palabras `clave` salen en rojo lacre, turquesa oscuro o lima.

**Letras.** HyperFrames trae incrustadas Nunito, Inter, Playfair Display y EB Garamond (entre otras: `npx hyperframes@0.9.20 docs` las lista), así que esas no necesitan nada. Space Grotesk no viene: `montaje.mjs` pone en `index.html` su enlace de Google Fonts y el compilador la descarga y la incrusta en el render (la primera vez necesita internet; después queda en `~/.cache/hyperframes/fonts`). Una letra nueva para un tema se agrega igual: si no es de las incrustadas, con su enlace de Google Fonts en `google`. Comprueba en las capturas que salió la letra pedida y no una de respaldo.

### Plantillas del Narrador

Todas dicen en su cabecera `Necesita "estilo.tema"`: si el guion no trae tema, `montaje.mjs` se detiene con un aviso. Usan solo las variables del tema, así que funcionan igual en los tres. Todas respetan las zonas (dibujo y textos entre 190 y 1100 px; nada en la franja de subtítulos) y ajustan solas el tamaño de la letra al largo del texto, dentro de las medidas de la tabla.

| Plantilla | Qué muestra | Datos (los opcionales entre paréntesis) | Medidas |
|---|---|---|---|
| `titulo-pregunta` | El gancho: 2 o 3 líneas grandes y una ilustración debajo. Todo está desde el cuadro 0: es la portada | `lineas`, `ilustracion`, (`resalta`, `insignia`) | Líneas de 16 letras o menos (caben 20, más chicas); `insignia` de 22 |
| `dato-grande` | Una cifra, un año o una palabra enorme con su rótulo; un aro gira detrás | `cifra`, `rotulo`, (`antes`, `ilustracion`, `palabra`, `palabra_rotulo`, `contar`) | `cifra` de 7 caracteres o menos (caben 10); `rotulo` de 40 letras (dos renglones); `antes` de 24 |
| `linea-tiempo` | De 3 a 5 hitos en una línea vertical que se enciende en orden | `hitos` [{`anio`, `texto`, (`palabra`)}], (`titulo`) | `anio` de 9 caracteres; `texto` de 50 letras con 3 hitos, 40 con 4 y 28 con 5; `titulo` de 24 |
| `personaje` | Retrato de busto dibujado (silueta genérica con cara sencilla, nunca la de una persona real) en un medallón, con nombre, años y rol | `nombre`, `anios`, `rol`, (`piel`, `pelo`, `ropa`, `detalle`, `peinado`, `barba`, `sombrero`, `gafas`, `bata`, `charreteras`, `palabra_anios`, `palabra_rol`) | `nombre` de 20 letras; `anios` de 12; `rol` de 44 (dos renglones) |
| `lupa` | Una ilustración grande y una lupa que amplía una parte (o muestra otra ilustración dentro), con su rótulo | `ilustracion`, `rotulo`, (`ilustracion_detalle`, `foco` [x, y] en el lienzo de 400, `titulo`, `palabra`) | `rotulo` de 26 letras; `titulo` de 24 |
| `comparacion` | Dos columnas (mito/realidad, antes/después) | `izquierda` y `derecha`: {`titulo`, `renglones`, (`ilustracion`)}, (`marcas`) | `titulo` de 10 letras; 2 o 3 renglones de 24 letras |
| `lista-pasos` | 3 pasos numerados (sirve de 2 a 4) que entran uno por uno | `pasos` (textos, o {`texto`, (`palabra`, `ilustracion`)}), (`titulo`) | Pasos de 36 letras (26 con ilustración); `titulo` de 24 |
| `cierre-respuesta` | La respuesta o la lección en 2 a 5 palabras grandes, y la cuenta | `respuesta`, (`resalta`, `rotulo`, `ilustracion`, `cuenta`, `siguiente`) | `respuesta` de 28 letras; `cuenta` de 24; `siguiente` de 34 ("Mañana: la gripe de 1918") |
| `cita` | Una frase célebre con su autor; las palabras se encienden al paso de la voz | `texto`, `autor`, (`detalle`) | `texto` de 90 letras (sin comillas); `autor` de 26. Solo citas verificadas |

**Cuándo aparece cada cosa.** Lo que nombra la voz se ancla a la palabra dicha: `palabra` (y `palabra_rotulo`, `palabra_anios`...) es la palabra del guion que lo dispara; si no se dice tal cual, cae en una parte fija de la escena. En `linea-tiempo` cada hito se enciende al decirse su año; en `dato-grande`, la cifra aparece al decirse la cifra (si la voz la dice con letras, pon en `palabra` una palabra que sí se diga, como `"metro"`).

**`resalta`** es el número (desde 0) de la línea o palabra que va en color de acento. **`marcas: false`** en `comparacion` cambia la equis y el visto por puntos de color (para un antes/después sin juicio). **`contar: true`** en `dato-grande` hace que la cifra cuente desde 0 (para porcentajes y cantidades, no para años).

**Escribir una plantilla del Narrador.** Incluye `{{>narrador-css}}` dentro de su `<style>` y `{{>narrador-js}}` al empezar su `<script>`: traen las clases comunes (`-titulo`, `-cifra`, `-acento`, `-suave`, `-tarjeta`, `-insignia`, `-il`) y las ayudas `cuando(palabra, respaldo)` (cuándo se dice una palabra en cualquier frase de la escena), `parte(x)` (un punto de todo lo hablado en la escena), `tope(t)` (que nada caiga al final), `tamPara(texto, ancho, max, min)` y `dibujo(svg)`. Una ilustración opcional va con `{{{d.ilustracion_svg|}}}` (dato sin escapar con respaldo vacío).

### Ilustraciones

[plantillas/ilustraciones.json](plantillas/ilustraciones.json): SVG plano en un lienzo de 400×400 con las reglas de «Dibujo», en sus colores reales; el tema decide cómo se asientan (`--il-filtro`). Se piden por nombre en cualquier dato `ilustracion` o `ilustracion_<algo>` (`montaje.mjs` agrega `ilustracion_svg`).

- **Historia:** `pergamino`, `corona`, `espada`, `barco`, `templo`, `reloj-arena`, `libro`, `mapa`, `bicornio`, `regla`
- **Medicina y ciencia:** `microscopio`, `placa-petri`, `virus`, `bacteria`, `corazon`, `pildora`, `jeringa`, `cerebro`, `adn`, `jabon`
- **Dinero y datos:** `moneda`, `grafica`, `alcancia`, `billete`, `lingote`

Si un tema necesita otra, dibújala y agrégala ahí con las mismas reglas; que se vea bien sobre fondo claro y oscuro (sin blancos puros en los bordes ni negros sin sombra).

### Formatos sugeridos

| Formato | Escenas, en orden | Ejemplo |
|---|---|---|
| `misterio histórico` | `titulo-pregunta`, `personaje`, `dato-grande` (cuándo), `lupa` (la pista), `linea-tiempo` (qué pasó), `cierre-respuesta` | — |
| `descubrimiento médico` | `titulo-pregunta`, `personaje`, `comparacion` (el problema), `lupa` (la pista), `dato-grande` (el año o el resultado), `linea-tiempo` (qué vino después), `cierre-respuesta` | [prueba-laboratorio](propios/prueba-laboratorio/guion.json) |
| `mito o realidad` | `titulo-pregunta`, `personaje` o `dato-grande` (el mito), `lupa` (el detalle), `comparacion` (mito/realidad), `lista-pasos` (de dónde salió), `cierre-respuesta` | [prueba-archivo](propios/prueba-archivo/guion.json) |
| `dato que no sabías` | `titulo-pregunta`, `lupa`, `linea-tiempo` o `comparacion`, `lista-pasos`, `dato-grande` (el giro), `cierre-respuesta` | [prueba-pizarra](propios/prueba-pizarra/guion.json) |
| `la historia en 3 pasos` | `titulo-pregunta`, `dato-grande` (el punto de partida), `lista-pasos` (los 3 pasos), `cita` o `personaje`, `cierre-respuesta` | — |

Igual que en la serie de venta, dos videos seguidos de la misma cuenta no repiten formato ni paleta. Los tres videos de [propios/](propios/) que empiezan por `prueba-` sirven de muestra de cada tema; su voz es Kokoro (solo para cronometrar) y no se publican.

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

Los genera `subtitulos.mjs` (lo llama `montaje.mjs`): grupos de hasta 3 palabras, uno a la vez; cada palabra se enciende cuando la voz la dice. Si hay que cambiar el aspecto, se cambia en el script para que todos los videos queden iguales. Con `estilo.tema` (videos propios) toman la letra y los colores del tema y van sobre una píldora (sección «Videos propios (Narrador)»).

## Sonido

- **Voz grabada (la que se publica).** En el guion, `"motor": "grabada"`. Una persona lee todo el guion de una vez con el celular y deja el audio en la carpeta del video con el nombre `grabacion` (`grabacion.m4a`, `.mp3`, `.wav`, `.ogg`…). `voz.mjs` lo transcribe con whisper, ubica cada frase, la corta en el silencio que la persona deja antes de la siguiente y sigue igual que con cualquier otra voz.
  - **Las frases para leer** las escribe `producir.mjs` en `para-grabar.txt`, dentro de la carpeta de cada video, con las instrucciones. `salidas/animador/por-grabar.md` junta todos los videos que esperan grabación.
  - **Mientras no esté la grabación**, el video queda «esperando grabación»: no es un error y `producir.mjs --todos` lo vuelve a intentar la próxima vez.
  - **Cómo grabar:** lugar callado, celular a un palmo de la boca, voz normal y con energía, y un segundo de silencio entre frase y frase. Si alguien se equivoca, hace una pausa y repite la frase completa: cuenta la última vez que la dijo.
  - **Comprobación:** cada frase cortada se vuelve a transcribir y se compara con el guion; lo que no coincida sale al final como «Para revisar de oído», con los segundos de la grabación donde se cortó. Probado con dos grabaciones de ensayo (pausas de un segundo con una frase repetida, y pausas de medio segundo con más ruido): los cortes quedaron a menos de una décima de segundo.
  - **Una vez grabado, el texto dicho no se cambia.** Si una escena no cabe, se cambia el texto en pantalla (rótulos, estados, mensajes); si hay que cambiar lo que se dice, hay que volver a grabar.
- **Voz de Higgsfield** (ya no se usa para la serie; queda por si hace falta): en el guion, `"motor": "higgsfield"`, `"variante": "elevenlabs"` y `"voz": "Bram"` (un nombre de `higgsfield voices list`). Necesita el CLI instalado y con sesión (`npm i -g @higgsfield/cli` y `higgsfield auth login`; los corre la persona, no Claude). Gasta créditos de esa cuenta: un video de 30 segundos cuesta cerca de 2. Solo se vuelven a generar las frases que cambian. Todas las voces traen muestra en inglés, así que una voz nueva se prueba primero con una frase y se revisa con whisper que el español se entienda.
- **Cómo escribirle a esta voz.** Es de origen inglés y a veces lee con sonido inglés la primera palabra de una frase. Tres cuidados: (1) no empieces una frase con una palabra que también exista en inglés (*agenda*, *general*, *similar*, *responder*); (2) las listas van con sustantivos («Mensajes, llamadas, visitas»), no con verbos en infinitivo, porque les pierde la «r» final; (3) si una palabra sale mal, agrégale una regla en [pronunciacion.json](pronunciacion.json): a la voz se le manda como suena («ajendar») y en pantalla se sigue viendo bien escrita.
- **Comprobación de la voz de Higgsfield.** `voz.mjs` transcribe cada frase con whisper y la vuelve a generar hasta tres veces si no coincide con el guion; lo que no logre arreglar lo lista al final como «Para revisar de oído». Eso confirma que se entiende lo que dice el guion, no que el acento guste: alguien tiene que oír el video antes de publicarlo.
- **Voz local:** Kokoro (`ef_dora` de mujer, `em_alex` y `em_santa` de hombre), con `"motor": "kokoro"`. Es gratis y suena sintética; sirve para armar y cronometrar el video, no para publicarlo.
- **Voz de otro servicio:** genera o graba una frase por archivo, con el `id` de la frase como nombre (`f1.wav`, `f2.mp3`…), y déjalas en `assets/voz-externa/`. Pon `"motor": "externo"` en el guion y corre `voz.mjs` y `montaje.mjs`: el video se vuelve a sincronizar solo.
- **Volumen:** el video final queda cerca de −16 LUFS. Se comprueba con `ffmpeg -i <mp4> -af ebur128 -f null -`.
- **Música y efectos:** se agregan en CapCut, después del render (el MP4 ya sale con voz y subtítulos). La música va baja, para que la voz se entienda, y en una cuenta de empresa solo con licencia comercial: si no, la plataforma puede silenciar el video o frenar el anuncio.

## Piezas de la marca

La foto de perfil y las portadas de las historias destacadas de Instagram salen de [marca/marca.html](marca/marca.html), que se captura con Chrome (`?pieza=perfil`, `servicios`, `como-funciona`, `negocios`, `preguntas` o `contacto`):

```powershell
& "C:Program FilesGoogleChromeApplicationchrome.exe" --headless=new --hide-scrollbars --window-size=1080,1080 --virtual-time-budget=6000 --screenshot="salidasanimadorinstagramperfil.png" "file:///<ruta del proyecto>/animados/marca/marca.html?pieza=perfil"
```

Las portadas van a 1080×1920. Todo lo de la cuenta (biografía, orden de publicación, guiones de respuesta) está en [salidas/animador/instagram/KIT.md](../salidas/animador/instagram/KIT.md).

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
  plantillas/ilustraciones.json  dibujos de los videos propios (Narrador)
  contenido/NARRADOR.md      método de los videos propios
  propios/<video>/           videos propios (Narrador); se entregan en salidas/narrador/
  videos/<video>/
    guion.json             lo que se dice
    tiempos.json           cuándo se dice (generado)
    index.html             montaje: escenas, subtítulos y audio (generado)
    compositions/*.html    una escena por archivo
    renders/               los MP4 (no van a GitHub)
```

Los scripts son de Node porque HyperFrames ya lo exige; el resto de la Legión sigue en PowerShell.
