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

`datos` vale para todas las escenas; los de cada escena se suman encima. Toda escena `agente-…` acepta además una `insignia` opcional arriba a la derecha (una hora o «1 de 3»). Una escena sin plantilla se escribe a mano en `compositions/`, como antes. Los nombres `icono` y `heroe` están reservados para esos dibujos: en los datos de otras plantillas no se usan para otra cosa.

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

Una plantilla es una escena normal con marcas: `{{id}}` (el id de la escena, prefijo de todos sus ids y clases), `{{d.dato}}` (un dato, escapado), `{{{d.dato}}}` (sin escapar, para SVG), `{{d.dato|respaldo}}` y `{{{d.dato|}}}` (dato opcional: si falta, queda el respaldo, que puede ser vacío), `{{datos}}` (todos los datos como JSON, para el script) y `{{>nombre}}` (incluye `plantillas/_nombre.html`; ojo: también se expande dentro de un comentario). Como no sabe qué texto le va a tocar, no cuenta palabras: se ancla a partes de la frase (`r.en(0, 0.5)`) o a una palabra con respaldo (`r.palabra(0, "comen", 0.78)`). Antes de usarla en serie, pruébala con un video y mira sus capturas.

Para el formato horizontal (sección «Videos horizontales con escenas»): `{{ancho}}` y `{{alto}}` dan el tamaño del lienzo (úsalos en el `data-width` y `data-height` de la raíz), `{{?h}}…{{/h}}` deja un trozo solo en horizontal y `{{?v}}…{{/v}}` solo en vertical (si ocupan renglones enteros, en la otra orientación desaparecen sin dejar rastro). La cabecera dice `Horizontal: propio` si la plantilla trae su diseño horizontal, o `Solo horizontal` si no sirve en vertical.

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
| `personaje` | Retrato de busto dibujado (silueta genérica con cara sencilla, nunca la de una persona real) en un medallón, con nombre, años y rol; con `pose`, medio cuerpo con brazos | `nombre`, `anios`, `rol`, (los rasgos de «Personajes dibujados», `palabra_anios`, `palabra_rol`) | `nombre` de 20 letras; `anios` de 12; `rol` de 44 (dos renglones) |
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

### Personajes dibujados

`personaje`, `dos-personajes`, `tablero` y `cita` dibujan a sus personas con la misma función ([plantillas/_figura-js.html](plantillas/_figura-js.html)). Siempre es una figura genérica con rasgos que ayudan a reconocer a quien representa (el bigote, los quevedos, el sombrero), nunca un retrato de su cara. Datos, todos opcionales:

| Dato | Valores |
|---|---|
| `piel`, `pelo`, `ropa`, `detalle`, `corbata` | Colores (`"#2f4f7a"`); `detalle` son los botones y adornos |
| `peinado` | `corto` (por defecto), `largo`, `calvo`, `recogido`, `peluca`, `raya` (de lado, engominado) |
| `barba` | `ninguna`, `bigote`, `completa`, `patillas`, `bigote-encerado` (puntas hacia arriba), `morsa` (grueso, tapa la boca), `candado`, `recortada` |
| `sombrero` | `ninguno`, `bicornio`, `copa`, `corona`, `bombin`, `ala`, `kepis` (militar), `marinero`, `canotier` (de paja) |
| `gafas` | `true` (redondas) o `"quevedos"` (sin patas, con cordón) |
| `expresion` | `neutral`, `sonrisa`, `serio`, `sorprendido`, `enojado`, `pensativo`, `astuto` |
| `pose` | Medio cuerpo con brazos: `neutral`, `senalar`, `brazos-cruzados`, `firmar`, `saludar`, `pensar`, `jarras` (manos en la cintura), `discurso` |
| `cuello` | `corbata` (por defecto en medio cuerpo), `lazo` o `ninguno` |
| `bata`, `charreteras` | `true`: bata de médico, uniforme militar |

Para que una persona se vea igual en todo un video, sus rasgos van una sola vez en la ficha `personajes` del guion y las escenas la nombran por id (`{ "personaje": "roosevelt", "pose": "senalar" }`; sección «Videos horizontales con escenas»). Ejemplos de la muestra de Panamá: Roosevelt es `barba: "morsa"` con `gafas: "quevedos"`; Bunau-Varilla, `barba: "bigote-encerado"`, `peinado: "raya"` y `sombrero: "bombin"`; un soldado de 1903, `sombrero: "kepis"` con `charreteras`.

## Videos horizontales con escenas (YouTube)

Es el estilo que se quiere para los videos largos: **escenas diseñadas y animadas con código** (mapas, personajes, documentos, cifras, texto que se mueve), como en los Shorts, pero a 1920×1080. Las fotos de archivo solo entran como un elemento dentro del diseño (un retrato con cinta, un recorte con su pie), nunca a pantalla completa. La muestra es [propios/hi-panama-muestra/guion.json](propios/hi-panama-muestra/guion.json): los primeros 61 s de «¿Cómo perdió Colombia a Panamá?», con 14 escenas. El video completo se arma por capítulos («Video largo por escenas», más abajo).

**Para escribir escenas** (qué hace cada plantilla, sus datos con un ejemplo, cuánto dura, personajes, fotos y cortes): [contenido/escenas-horizontales.md](contenido/escenas-horizontales.md).

Piezas:

- **Lienzo.** `"orientacion": "horizontal"` en el guion. Sin él, todo sale vertical, igual que siempre (`montaje.mjs` da exactamente la misma salida en los videos que ya existían).
- **Plantillas viejas en horizontal.** Las que no tienen diseño horizontal propio se dibujan como en vertical dentro de un escenario centrado y un poco reducido (su zona de dibujo de 190 a 1100 px queda entre 82 y 920). Funcionan, pero dejan los lados vacíos: para un video largo, mejor las de la tabla de abajo. `personaje`, `linea-tiempo` y `cita` traen su diseño horizontal propio (en vertical siguen exactamente igual).
- **Cortes dentro de una frase.** Las frases de un video largo duran de 7 a 11 s y una escena no debería durar más de 4 a 8. `"cortes": [{ "escena": "mapa", "palabra": 9 }]` en una frase hace que la escena `mapa` empiece en la palabra 9 (desde 0) aunque la frase siga; `"palabra"` también puede ser el texto de la palabra, o `"fin"` para una escena que empieza al terminar la frase. La escena nueva necesita su plantilla en `escenas`. Cambiar cortes o pausas no vuelve a pedir voz: las frases salen de la caché. La lógica está en [herramientas/escenas.mjs](herramientas/escenas.mjs).
- **Fotos de Commons como elemento.** Un dato `foto` (o `foto_<algo>`) con el nombre de un archivo de Commons (`"File:Panam2.JPG"`) que ya esté en `animados/.imagenes-cache/` se copia a `assets/fotos/` y la plantilla recibe `foto_src`, `foto_ancho`, `foto_alto` y `foto_credito`. Si la foto no está en la caché o su licencia no es libre, `montaje.mjs` se detiene. En un video largo por escenas, `producir.mjs` baja antes las que falten y les revisa la licencia.
- **Ficha de personajes.** `"personajes": { "roosevelt": { "nombre": "...", "rol": "...", "barba": "morsa", "gafas": "quevedos" } }` en el guion. En los datos de una escena, `{ "personaje": "roosevelt", "pose": "senalar" }` recibe la ficha (lo que se escribe manda encima) y en la lista del `tablero` basta el id. Así cada persona se ve igual en todo el video. Sirve en cualquier guion (también en los Shorts).
- **Subtítulos.** En horizontal salen abajo (952 a 1040 px), más chicos y de hasta 4 palabras, sobre la misma píldora del tema; las plantillas horizontales dejan esa franja libre. `"subtitulos": false` en el guion los quita todos (para YouTube se pueden subir aparte: el video largo deja su `.srt`).

**Plantillas horizontales** (todas con `estilo.tema`; cada archivo explica sus datos en la cabecera). Los momentos se dan con una palabra dicha, con `{ "en": 0.5 }` (una parte de lo hablado en la escena) o en segundos desde que empieza la escena; en una escena que empieza a mitad de frase, solo cuentan las palabras dichas desde que empieza.

| Plantilla | Qué muestra |
|---|---|
| `titular` | Texto grande que entra palabra por palabra, con una hoja de calendario (que puede llevar un sello o tacharse) o un medallón con un dibujo. Para una fecha clave, una pregunta o una idea fuerte |
| `mapa` | Mapa ilustrado de las Américas con cámara que viaja entre `vistas`, países que se encienden (`colombia`, `panama`, `venezuela`, `ecuador`, `nicaragua`), un país que se separa, rutas que se dibujan (línea, discontinua, vía de tren, flecha, cauce de canal o franja resaltada) con un barco o un tren, ríos (Chagres, San Juan), lagos (de Nicaragua siempre; Gatún si se pide), el canal de 1914 con sus esclusas y el corte Culebra, montañas, ciudades, rótulos, banderas, una cartela y fichas. La costa de Panamá tiene detalle junto al canal para acercarse. Geografía: [plantillas/_geo-americas.html](plantillas/_geo-americas.html) |
| `tratado` | Dos hojas de calendario con una flecha (el tiempo que pasó), un documento que se escribe solo, un mapa chico del istmo con la franja del canal y un sello con su bandera, o una franja de rechazo («Rechazado», «En quiebra») |
| `dos-personajes` | Dos personas de medio cuerpo frente a frente detrás de una mesa, con sus placas y banderas; una firma el documento. Puede llevar una foto real con cinta |
| `personaje` | Retrato dibujado en un medallón, con nombre, años y rol |
| `cita` | Una frase entre comillas en una hoja, con el medallón del personaje, su rol, el autor y la fuente; las palabras se encienden al paso de la voz |
| `cifra` | Un número grande que cuenta desde 0, con moneda, unidad y rótulo, sobre una tarjeta de documento; o 2 o 3 cifras comparadas con sus barras |
| `linea-tiempo` | De 3 a 7 hitos de izquierda a derecha; el actual se resalta y el riel se enciende hasta él |
| `recorte` | Un documento o una foto real (caricatura, portada, estampilla) como pieza central, con cinta, pie, acercamiento lento y un círculo de tinta que marca un detalle; al lado, título y nota |
| `fichas` | De 2 a 4 tarjetas con dibujo y rótulo (causas, peligros, órdenes); la resaltada se mueve (el mosquito zumba). Con foto opcional |
| `cadena` | Una cadena de hierro con placas que entran con cada palabra y, al final, la cámara se corre hacia atrás hasta los años de donde viene |
| `tablero` | Tablero de investigación: retratos dibujados de los protagonistas, recortes reales con su pie e hilo rojo entre ellos |
| `capitulo` | Tarjeta de capítulo con marco doble (en un video largo es automática) |
| `vehiculo` | Un tren de vapor, un barco (de vapor o de guerra) o una draga (la pala de vapor de las obras, trabajando o abandonada) que entra a la escena; con sello del año, título, dato y foto opcional |

**Banderas** que dibujan `mapa`, `tratado`, `dos-personajes` y `vehiculo`: `colombia`, `panama`, `eeuu`, `francia`, `espana`. **Dibujos** (fichas del mapa, `fichas`, `cifra`, `titular`): `calendario`, `canon`, `pluma`, `sello`, `ancla`, `tren`, `mosquito`, `lluvia`, `derrumbe`, `cruz`, `moneda`, `esclusa`, `barco`, `volcan`, `documento`, `draga`, `montana`, `bandera`, `balanza`, `reloj` (en [plantillas/_escena-h-js.html](plantillas/_escena-h-js.html)).

**Rendimiento de un Short horizontal** (2026-11-20, PC de Santiago, 16 hilos): la muestra de 61,7 s con 14 escenas tardó 109 s en total (render 86 s, 1,4 veces lo que dura el video).

### Video largo por escenas (por capítulos)

Es el video largo de YouTube con el estilo de la muestra. Se reconoce por `"tipo": "largo"` **y** `"orientacion": "horizontal"` en el guion; lo arma [herramientas/largo-escenas.mjs](herramientas/largo-escenas.mjs). El ejemplo es [propios/hi-panama/guion.json](propios/hi-panama/guion.json) (c0 y c1 terminados).

```json
{
  "tipo": "largo", "orientacion": "horizontal",
  "titulo": "...", "motor": "elevenlabs", "voz": "...", "tope_caracteres": 50,
  "pausa": 0.35, "pausa_capitulo": 3, "cola": 2.5,
  "estilo": { "tema": "archivo" },
  "miniatura": { "texto": "PANAMÁ EN 3 DÍAS", "imagen": "<clave de imagenes>" },
  "publicacion": { "titulo_youtube": "...", "descripcion": "...", "hashtags": ["historia"] },
  "fuentes": [ { "dato": "...", "fuente": "...", "url": "..." } ],
  "imagenes": { "<clave>": { "commons": "File:...", "que_muestra": "..." } },
  "personajes": { "roosevelt": { "nombre": "Theodore Roosevelt", "rol": "Presidente de EE. UU.", "barba": "morsa" } },
  "capitulos": [
    { "id": "c0", "titulo": "", "escenas": { "fecha": { "plantilla": "titular", "datos": {} } },
      "frases": [ { "id": "f1", "escena": "fecha", "texto": "...", "cortes": [{ "escena": "separacion", "palabra": 9 }] } ] },
    { "id": "c1", "titulo": "El sueño del canal", "escenas": {}, "frases": [] }
  ]
}
```

- **Capítulos.** El primero sin `titulo` es el gancho. Cada capítulo con título lleva su **tarjeta** automática (plantilla `capitulo`: «Capítulo I» y el título), sola en una pausa de voz de `pausa_capitulo` segundos (3 por defecto) antes de su primera frase. `"tarjeta": "<id>"` usa una escena propia del capítulo; `"tarjeta": false` la quita. La última escena de cada capítulo se queda `respiro_capitulo` (0,5 s) después de su última palabra.
- **Escenas.** Cada capítulo trae las suyas (`{ id: { plantilla, datos } }`, como un Short); los ids no se repiten en todo el video. Una frase sin `escena` sale con un titular «Escena pendiente» (respaldo para armar y mirar el video antes de terminarlo; producir lo avisa).
- **Imágenes.** `imagenes` sirve para la miniatura y para describir en los créditos las fotos que usan las escenas (por su `commons`). `imagen` en una frase no se usa (era del modo de fotos).

Comandos:

```powershell
node animados/herramientas/producir.mjs animados/propios/<id>                                 # todo el video
node animados/herramientas/producir.mjs animados/propios/<id> --capitulos c0,c1               # solo esos (prueba): <id>-c0-c1.mp4
node animados/herramientas/producir.mjs animados/propios/<id> --capitulos c3 --sin-render --capturas  # armar, revisar y mirar c3
node animados/herramientas/une-escenas.mjs animados/propios/<id> animados/propios/<id>/escenas/c3.json  # unir escenas escritas aparte
```

Mientras queden frases sin escena, el video completo no se renderiza (produce los capítulos listos con `--capitulos`, o agrega `--con-pendientes` para un borrador entero).

Cómo se arma: (1) la voz de todo el video con `voz.mjs` (misma caché y mismo tope); (2) las fotos que piden las escenas, con su licencia revisada; (3) dónde empieza cada capítulo, siempre en un cuadro exacto (la tarjeta, o justo antes de su primera frase); (4) `<id>.srt`, `descripcion.txt` (con capítulos, menos de 5000 caracteres; si no cabe, las fuentes van a `comentario-fuentes.txt`), `creditos-imagenes.md` (si hay fotos) y `fuentes.md`; (5) `miniatura.jpg`: como en el modo de fotos (una imagen de `imagenes` y el texto) o, con `"miniatura": { "texto": "...", "escena": "<id>", "en": 4.5 }`, sobre un cuadro de esa escena sin subtítulos (escoge una con el lado del texto despejado; en hi-panama se ve mejor la caricatura); (6) cada capítulo es un proyecto de HyperFrames en `<id>/largo/capitulos/<cap>/` con su guion y sus tiempos (que cuentan desde 0): montaje mudo, revisión y render; si nada de lo que lo dibuja cambió (sus escenas, sus tiempos, las plantillas que usa, las herramientas), se reusa su MP4; (7) los capítulos se pegan sin recodificar y se les pone la voz, cortada con el largo real de cada uno y nivelada a −14 LUFS. La entrega es la del modo de fotos, en `salidas/narrador/<id>/`; con `--capitulos`, el MP4 es `<id>-c0-c1.mp4` y no se escribe `meta.json` (es una prueba).

**Varios agentes a la vez.** Cada uno escribe su capítulo en un archivo aparte, `<id>/escenas/<cap>.json` (`{ "capitulo": "c3", "escenas": {...}, "frases": [{ "id": "f21", "escena": "...", "cortes": [...] }] }`), y lo une con `une-escenas.mjs`: reemplaza solo las escenas de ese capítulo y la escena y los cortes de sus frases, nunca el texto (si el archivo trae un texto distinto, no une nada), y revisa el guion entero antes de guardarlo. Así nadie pisa el capítulo de otro.

**Rendimiento** (medido el 2026-11-20 en la PC de Santiago, 16 hilos), c0 y c1 de `hi-panama` (1:47 de video, 24 escenas): voz desde la caché 18 s (las 65 frases), capítulos 183 s (render 47 s para los 29 s de c0 y 100 s para los 78,5 s de c1, o sea 1,37 s por segundo de video; revisión 13 y 22 s), unión 5 s; **total 206 s**. Para el video completo (9:28, unas 150 escenas) eso da unos 13 min de render, 3 de revisión y medio minuto de unión: **de 16 a 18 minutos la primera vez**; en una PC con la mitad de hilos, el doble. Después, cambiar un capítulo solo vuelve a renderizar ese (de 1 a 3 minutos).

## Videos largos (YouTube horizontal)

> Este modo (fotos a pantalla completa con movimiento lento) no convenció a los socios: el estilo que se quiere es el de «Video largo por escenas» (arriba), que usa este mismo guion con `"orientacion": "horizontal"` y escenas por capítulo. Este modo se conserva para los guiones sin `orientacion` (como `prueba-largo`); sus créditos, miniatura, `.srt` y descripción los reusa el modo por escenas.

Además de los Shorts, el Narrador hace **documentales largos para YouTube**: horizontales (1920×1080, 30 fps), de 8 a 20 minutos, hechos sobre todo con **imágenes de archivo** de Wikimedia Commons que se mueven despacio (efecto Ken Burns), narrados con voz de IA, con una **tarjeta de apertura** (título del video y capítulo 1) y una **tarjeta por capítulo**. No usan plantillas ni escenas: el guion dice qué imagen se ve con cada frase y `producir.mjs` hace el resto con [herramientas/largo.mjs](herramientas/largo.mjs). La muestra es [propios/prueba-largo/guion.json](propios/prueba-largo/guion.json) (voz Kokoro, no se publica).

### Comandos

```powershell
node animados/herramientas/producir.mjs animados/propios/<id>               # voz, imágenes, textos, miniatura, tarjetas, tramos y MP4
node animados/herramientas/producir.mjs animados/propios/<id> --sin-render  # todo menos el MP4: sirve para revisar voz, licencias, capítulos y miniatura
node animados/herramientas/producir.mjs --todos                             # también incluye los largos sin MP4 o con el guion cambiado
```

Se reconoce por `"tipo": "largo"` en el guion. La entrega queda en `salidas/narrador/<id>/`:

| Archivo | Qué es |
|---|---|
| `<id>.mp4` | El video, con la voz a −14 LUFS (lo que usa YouTube) |
| `<id>.srt` | Subtítulos para subir aparte: hasta 2 líneas de 42 caracteres y 6 s por subtítulo, sacados de los tiempos de cada palabra |
| `miniatura.jpg` | 1280×720: la imagen elegida y el texto grande, en negrita y con contorno, legible en chico |
| `descripcion.txt` | Título de YouTube, descripción, capítulos con su minuto, fuentes, créditos de las imágenes y hashtags. Se pega tal cual |
| `creditos-imagenes.md` | Autor, licencia, enlace y minutos en que aparece cada imagen |
| `fuentes.md`, `publicacion.txt`, `meta.json` | Como en los Shorts; `meta.json` lleva `"tipo": "largo"`, los capítulos y cuánto tardó la producción |

### Guion

Vive en `animados/propios/<id>/guion.json`. Los campos marcados como opcionales tienen un valor por defecto razonable.

```json
{
  "tipo": "largo",
  "titulo": "¿Cómo perdió Colombia a Panamá?",
  "nicho": "historia",
  "motor": "elevenlabs", "voz": "C12mZePhNoo0RoTXhSFV", "modelo_voz": "eleven_multilingual_v2", "tope_caracteres": 9000,
  "pausa": 0.35,
  "estilo": { "tema": "archivo" },
  "miniatura": { "texto": "ASÍ PERDIMOS PANAMÁ", "imagen": "<clave de imagenes>" },
  "publicacion": { "titulo_youtube": "...", "descripcion": "...", "hashtags": ["historia"] },
  "fuentes": [ { "dato": "...", "fuente": "...", "url": "..." } ],
  "imagenes": {
    "<clave>": { "commons": "File:Nombre exacto.jpg", "que_muestra": "...", "encuadre": "arriba", "movimiento": "acercar" },
    "<otra>": { "archivo": "assets/mapa.png", "que_muestra": "...", "credito": "Mapa propio" }
  },
  "capitulos": [
    { "id": "c0", "titulo": "", "frases": [ { "id": "f1", "texto": "...", "imagen": "<clave>" } ] },
    { "id": "c1", "titulo": "El sueño del canal", "frases": [ { "id": "f5", "texto": "...", "imagen": "<clave>" }, { "id": "f6", "texto": "..." } ] }
  ]
}
```

- **Capítulos.** El primero, sin `titulo`, es el **gancho** (sin tarjeta). El primer capítulo con título abre con la **tarjeta de apertura**: el título del video y, debajo, «Capítulo I · su título». Cada capítulo siguiente abre con su tarjeta («Capítulo II» y el título). Los títulos de capítulo, de 2 a 5 palabras.
- **Frases.** Los `id` no se repiten en todo el video. Una frase sin `imagen` sigue con la imagen anterior: las frases seguidas con la misma imagen forman un **tramo**. Una imagen se puede repetir en lugares distintos. Una frase con `"subtitulos": false` no sale en el `.srt`.
- **Imágenes.** `commons` es el nombre exacto del archivo en Commons (el que sale en la página del archivo, con `File:` y la extensión; también vale sin `File:`). `archivo` es una imagen propia dentro de la carpeta del video; su `credito` (opcional) sale en los créditos. `que_muestra` va en los créditos y en la descripción.
- **`encuadre`** (opcional): `centro` (por defecto), `arriba`, `abajo`, `izquierda` o `derecha`. Dice dónde está lo importante: si la imagen se recorta, se conserva esa parte, y el acercamiento va hacia ahí (en un retrato, `arriba` es la cara).
- **`movimiento`** (opcional): `acercar`, `alejar`, `izquierda` o `derecha` (la cámara se desliza en esa dirección). Sin él, los tramos alternan los cuatro. Siempre es lento: el acercamiento llega a un 5-14 % según lo que dure el tramo, y el deslizamiento va a unos 38 px por segundo.
- **`ajuste`** (opcional): `cubrir` o `contener`. Por defecto, una imagen con proporción entre 1,5 y 2,1 (casi 16:9) **cubre** el cuadro recortando un poco; las demás (retratos, cuadradas, panorámicas) van **enteras sobre una copia desenfocada y oscurecida de sí mismas**, con una sombra suave: nunca barras negras ni imágenes estiradas.

Campos opcionales del guion largo:

| Campo | Por defecto | Qué hace |
|---|---|---|
| `pausa_capitulo` | 1,2 | Segundos de silencio de la voz antes de un capítulo (la tarjeta se ve encima) |
| `pausa_titulo` | 2,0 | Segundos de silencio entre el gancho y el capítulo 1 |
| `duracion_tarjeta` | 3,0 | Cuánto se ve la tarjeta de un capítulo (la voz del capítulo empieza mientras se ve) |
| `duracion_titulo` | 4,5 | Cuánto se ve la tarjeta de apertura |
| `fundido` | 0,5 | Segundos del fundido entre imágenes y tarjetas |
| `fundido_final` | 1,2 | Fundido a negro al final |
| `cola` | 2,5 | Segundos de imagen después de la última frase |
| `subtitulos_quemados` | `false` | `true` quema los subtítulos en el video (recodifica todo: tarda más) |
| `miniatura.lado` | `izquierda` | De qué lado va el texto de la miniatura; la imagen queda del otro |
| `miniatura.resalta` | la última línea | Número de línea (desde 0) del texto que va en dorado |
| `miniatura.encuadre` | el de la imagen | Qué parte de la imagen se ve en la miniatura |
| `capitulos[].etiqueta` | su título (en el gancho, «Introducción») | Cómo se llama ese capítulo en la lista de la descripción |
| `entrega` | `narrador` | Carpeta de `salidas/` donde se entrega |

En `miniatura.texto` una barra (`|`) parte las líneas a mano: `"ASÍ PERDIMOS | PANAMÁ"`. Sin barra, se reparte solo en 1 a 3 líneas.

### Cómo se arma

1. **Voz.** `voz.mjs` lee los capítulos como una sola lista de frases (cada tramo es una «escena») y deja `assets/narracion.wav` y `tiempos.json`, igual que en los Shorts: misma caché, mismo tope y misma comprobación con whisper. Antes de cada tarjeta, la frase anterior lleva la pausa del capítulo.
2. **Imágenes.** Se consultan en Commons de una vez (40 por pedido) y se revisa la licencia de todas **antes de bajar nada**. Se bajan de a una, con pausas, a `animados/.imagenes-cache/` (no va a GitHub); la siguiente vez no se vuelve a pedir nada.
3. **Tramos.** Cada imagen se compone una vez en un lienzo de 2304×1296 (1,2 veces el cuadro). El movimiento recorta dentro del lienzo con el filtro `perspective` de ffmpeg, que trabaja con precisión de subpíxel: sale **sin temblor** (`zoompan` redondea a píxeles enteros y tiembla). Cada tramo es un MP4 aparte con su fundido hacia el siguiente; se hacen varios a la vez y los que no cambiaron se reusan (`<id>/largo/tramos/`).
4. **Tarjetas y miniatura.** Con HyperFrames, en el aspecto del tema del guion (`archivo`: papel envejecido, marco doble en oro viejo, «Capítulo II» en rojo lacre con EB Garamond y el título en Playfair Display 900). Todas las tarjetas salen de un solo render; la miniatura, de una captura.
5. **Unión.** Los tramos se pegan sin recodificar y se les pone la voz, nivelada a −14 LUFS con dos pasadas de `loudnorm`.

Todo lo intermedio queda en `animados/propios/<id>/largo/` (no va a GitHub; la carpeta del video solo versiona `guion.json` y las imágenes propias que pida el guion).

### Licencias de las imágenes

- **Solo se aceptan** dominio público, CC0, CC BY y CC BY-SA (cualquier versión). Con cualquier otra (CC BY-NC, CC BY-ND, GFDL sola, «sin restricciones conocidas», uso legítimo…), `producir.mjs` **se detiene** y lista las imágenes problemáticas con su licencia y su página. La licencia se lee de los metadatos de Commons al producir.
- **CC BY y CC BY-SA obligan a citar** autor y licencia: `descripcion.txt` los trae completos (autor, licencia con su enlace y página del archivo). Las de dominio público y CC0 se citan por cortesía; si la descripción pasaría de los 5.000 caracteres que admite YouTube, esas se acortan solas (primero sin enlace, después en una sola línea). `creditos-imagenes.md` siempre trae todo.
- Si Commons marca **restricciones** en un archivo (derechos de imagen de una persona, marca registrada), sale un aviso: revisa su página antes de publicar.
- Que una pintura de 1805 esté en dominio público no vuelve libre una foto actual de un museo que la reproduzca con otra licencia: usa el archivo que Commons declara en dominio público.
- **Cómo buscar:** en [commons.wikimedia.org](https://commons.wikimedia.org) busca el tema, abre el archivo y copia su nombre (`File:...`). Mira la licencia en la página y prefiere archivos grandes (2000 px o más): uno chico se agranda y se ve borroso (sale un aviso si se agranda más de 1,6 veces).
- **Pedidos a Wikimedia:** van con un User-Agent genérico (`LegionNarrador/1.0 (videos educativos)`), sin datos de nadie. Wikimedia limita mucho a los clientes que no dejan un contacto: probado el 2026-11-19, **los originales** (`upload.wikimedia.org`) contestaban «demasiados pedidos» con una espera de 120 s, y **las miniaturas de tamaño estándar** (`thumb.wikimedia.org`) bajaban sin problema. Por eso se baja la mayor miniatura estándar más chica que el original: 3840 px si el original es más grande, y si no 1920, 1280, 960 o 500 px (para un cuadro de 1920×1080 sobra). Si aun así Wikimedia contesta «demasiados pedidos», el script espera lo que pida (hasta 3 intentos) y, si sigue, se detiene sin perder lo ya bajado. Si se vuelve un problema, la persona puede poner su propio User-Agent, con un contacto, en la variable `LEGION_COMMONS_UA`.

### Costo de la voz

ElevenLabs cobra por carácter: **10 minutos de narración son unos 8.000 a 9.000 caracteres** (de 1.300 a 1.500 palabras). Pon `tope_caracteres` un poco por encima de lo que mida el guion (`voz.mjs` cuenta antes de generar y no sigue si se pasa) y revisa el guion con Kokoro (`"motor": "kokoro"`, gratis) antes de gastar. Cada frase se paga una sola vez (`animados/.voz-cache/`): cambiar una frase solo cobra esa frase, y cambiar imágenes, capítulos o tarjetas no cobra nada.

### Voz de Deepgram (alternativa a ElevenLabs)

`"motor": "deepgram"` y `"voz": "aura-2-<nombre>-es"` (Aura-2, [voces en español](https://developers.deepgram.com/docs/tts-models): colombianas `celeste` y `gloria`; mexicanas `valerio`, `sirio`, `javier`, `luciano`, `estrella` y `olivia`; latinoamericanas `aquila` y `selena`; de España y de Argentina, otras). Cuesta 0,030 USD por 1.000 caracteres (unos 0,17 USD un video de 5.800). Funciona como ElevenLabs: misma caché por frase en `animados/.voz-cache/`, mismo `tope_caracteres`, la misma comprobación con whisper y `"velocidad"` opcional. Antes de generar dice lo que va a cobrar, el saldo y lo que lleva el mes; al terminar, lo que cobró.

- **Clave:** la guarda una persona con `powershell -NoProfile -ExecutionPolicy Bypass -File animados\herramientas\guardar-clave-deepgram.ps1` (queda en `%USERPROFILE%\.legion\deepgram\clave.txt`). Con una clave de rol Member se ve el uso; para ver el saldo, de rol Admin u Owner.
- **Uso y saldo:** `node animados/herramientas/voz.mjs --saldo-deepgram`. Una clave Member no deja ver el uso ni el saldo por la API (faltan `usage:read` y `billing:read`), así que cada PC anota lo que cobra cada pedido (la cabecera `dg-char-count`) en `%USERPROFILE%\.legion\deepgram\gasto.csv` y `--saldo-deepgram` suma el mes. El saldo de la cuenta se mira en console.deepgram.com.
- **Muestra de una voz:** `node animados/herramientas/voz.mjs --muestra-deepgram aura-2-valerio-es <salida.wav> "<texto>"`.
- Hasta 2.000 caracteres por frase (las frases de los guiones caben de sobra).

### Voz de AI33 (revendedor, con la voz «Jose» de ElevenLabs)

`"motor": "ai33"` y `"voz": "elevenlabs_C12mZePhNoo0RoTXhSFV"` (Jose; también tiene voces `minimax_`, `edge_`, `kokoro_` y otras). AI33 (OpenSpeaker, api.ai33.pro) revende voces de ElevenLabs y otros proveedores por créditos propios: el 2026-11-26, 571 caracteres con Jose costaron 639 créditos (~1,12 por carácter; unos 6.500 un video de 5.800). Funciona como los otros motores (caché por frase, tope, whisper) y es asíncrono (crea la tarea y la consulta hasta que trae el MP3).

- **Clave:** en `%USERPROFILE%\.legion\ai33\clave.txt` (o `AI33_API_KEY`), fuera del proyecto.
- **Créditos y gasto:** `node animados/herramientas/voz.mjs --saldo-ai33` (lo que queda en la cuenta y lo que esta PC lleva en el mes, de `%USERPROFILE%\.legion\ai33\gasto.csv`).
- **Voces:** `node animados/herramientas/voz.mjs --voces-ai33 <búsqueda>`; muestra: `--muestra-ai33 <voice_id> <salida.mp3> "<texto>"`.
- **Ojo con los derechos:** no tiene un acuerdo público con ElevenLabs a la vista y su menú ofrece «Shared account». Antes de publicar con esta voz, revisen sus términos de uso.

### Rendimiento

El render se reparte en tramos que corren en paralelo (un tramo por cada 3 hilos del procesador; `LEGION_TRAMOS_A_LA_VEZ` lo cambia). Medido el 2026-11-19 en la PC de Santiago (portátil con Windows, 16 hilos, 5 tramos a la vez):

| Video | Primera vez | Qué se lleva el tiempo |
|---|---|---|
| 10:55 sintético (123 frases, 8 capítulos, 66 tramos de imagen) | **5 min 21 s** | tramos 3 min 37 s, tarjetas 40 s, voz 34 s, unión 23 s |
| `prueba-largo` (1:30, 3 capítulos, 10 imágenes) | 81 s | tarjetas 38 s, tramos 36 s |

Más o menos la mitad del largo del video; en una PC con la mitad de hilos, cuenta el doble. Poner 8 tramos a la vez casi no ayuda (el trabajo ya ocupa el procesador). Cada producción imprime sus «Tiempos» y deja `tiempo_produccion_s` en `meta.json`. Volver a producir reusa lo que no cambió: cambiar una frase rehace la voz de esa frase y los tramos que se movieron; cambiar una tarjeta rehace las tarjetas y los tramos que las tocan (en la muestra, 42 s en total).

### Mac

No usa nada exclusivo de Windows: ffmpeg y ffprobe se buscan primero en `herramientas/bin/` y después en el PATH (`brew install ffmpeg`), whisper como dice «Instalación», y HyperFrames por `npx`. Sin probar todavía en un Mac.

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
- **`motor`:** de dónde sale la voz: `"grabada"`, `"elevenlabs"`, `"higgsfield"`, `"kokoro"` (por defecto) o `"externo"` (sección «Sonido»).
- **Guiones propios:** el tema puede ser el mismo que el de otro video; el texto, el orden y los dibujos son nuestros.

**Si es un anuncio** (para pautar), cambia tres cosas:
- El gancho nombra el problema o el deseo del cliente, no una curiosidad.
- El cuerpo muestra cómo funciona el servicio en pasos que se puedan dibujar.
- El cierre sí pide una acción («Escríbenos»), con un botón en pantalla que dura al menos 2 segundos.

No se inventan cifras, clientes, precios ni resultados: solo se dice lo que el servicio hace.

## Estilo

**Formato:** 1080×1920, 30 cuadros por segundo (1920×1080 con `"orientacion": "horizontal"`; sección «Videos horizontales con escenas»).

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
- **Voz de ElevenLabs** (en prueba desde el 2026-11-19, decisión P-10). En el guion: `"motor": "elevenlabs"`, `"voz"` (id o nombre de una voz de la cuenta) y, opcionales, `"modelo_voz"` (por defecto `eleven_multilingual_v2`), `"ajustes_voz"` y `"tope_caracteres"` (por defecto 3000).
  - **La clave** la guarda una persona, en su propia ventana de PowerShell: `powershell -NoProfile -ExecutionPolicy Bypass -File animados\herramientas\guardar-clave-elevenlabs.ps1`. Queda en `%USERPROFILE%\.legion\elevenlabs\clave.txt` (en Mac, `~/.legion/elevenlabs/clave.txt`, o la variable `ELEVENLABS_API_KEY`). No va en el proyecto ni en el chat. Al crearla en ElevenLabs, dale los permisos *Text to Speech*, *Voices* (leer y escribir) y *User* (leer) y, si lo deja, un límite de créditos.
  - **Elegir voz:** `node animados/herramientas/voz.mjs --buscar-voces-elevenlabs latin american` lista voces de la biblioteca en español, con un enlace de muestra; `--agregar-voz-elevenlabs <dueño> <voice_id> <nombre>` la suma a la cuenta, y `--voces-elevenlabs` muestra las de la cuenta.
  - **Gasto:** cobra por carácter (un Short de 45 a 60 s son unos 600 a 1000). Antes de generar, `voz.mjs` dice cuántos caracteres va a usar y cuántos lleva la cuenta en el mes, y no sigue si pasan del tope. Cada frase se paga una sola vez: queda en `animados/.voz-cache/`. No reintenta solo; si whisper oye algo distinto al guion, lo lista en «Para revisar de oído».
  - **Licencia:** el plan gratis sirve para probar; para publicar hace falta un plan de pago con licencia comercial.
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
  herramientas/temas.mjs     temas visuales del Narrador (archivo, laboratorio, pizarra)
  herramientas/largo.mjs     videos largos de YouTube con fotos (imágenes, tramos, tarjetas, miniatura, textos)
  herramientas/largo-escenas.mjs  videos largos de YouTube por escenas (capítulos, render por capítulo, unión)
  herramientas/escenas.mjs   cortes dentro de una frase y ficha de personajes (los usan montaje y largo-escenas)
  herramientas/une-escenas.mjs  une al guion las escenas de un capítulo escritas aparte
  herramientas/capturas.mjs  hojas de capturas para revisar
  herramientas/subtitulos.mjs
  .imagenes-cache/           imágenes de Wikimedia Commons de los videos largos (no va a GitHub)
  plantillas/                escenas reutilizables e iconos
  plantillas/ilustraciones.json  dibujos de los videos propios (Narrador)
  plantillas/_figura-js.html     personajes dibujados (busto y medio cuerpo con poses)
  plantillas/_geo-americas.html  geografia de la plantilla mapa
  plantillas/_escena-h-js.html   ayudas de las plantillas horizontales (momentos, banderas, dibujos)
  contenido/NARRADOR.md      método de los videos propios
  contenido/escenas-horizontales.md  catálogo de las plantillas horizontales para escribir escenas
  propios/<video>/           videos propios (Narrador); se entregan en salidas/narrador/
  videos/<video>/
    guion.json             lo que se dice
    tiempos.json           cuándo se dice (generado)
    index.html             montaje: escenas, subtítulos y audio (generado)
    compositions/*.html    una escena por archivo
    renders/               los MP4 (no van a GitHub)
```

Los scripts son de Node porque HyperFrames ya lo exige; el resto de la Legión sigue en PowerShell.
