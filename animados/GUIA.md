# Videos animados — guía del método

Esta carpeta hace **videos explicativos animados sin cara**: verticales, de 20 a 45 segundos, dibujados con código, narrados en español y con subtítulos. Se pide un tema («hazme un video de por qué la cebolla te hace llorar») y sale un MP4 listo para subir.

Quien lee esto es Claude: cuando te pidan un video animado, sigue esta guía de principio a fin. El video de referencia, ya terminado, es [videos/cebolla/](videos/cebolla/); cópiale la estructura, no el contenido.

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
4. **Escenas.** Una escena por archivo en `compositions/` y el montaje en `index.html` (secciones «Estilo» y «Reglas técnicas»). Cada cosa aparece cuando la voz la nombra: toma los segundos de `tiempos.json`.
5. **Subtítulos.** `node animados/herramientas/subtitulos.mjs animados/videos/<video>`
   Genera `compositions/subtitulos.html`. No se edita a mano.
6. **Revisión.** Dentro de la carpeta del video: `npx --yes hyperframes@0.9.20 check --json`. Cero errores, y cada aviso arreglado o justificado.
7. **Mirar.** `npx --yes hyperframes@0.9.20 snapshot --at 0,1.9,3.2,... --no-end --keep -o snapshots` con al menos dos momentos por escena, y **mira las imágenes**. Que `check` pase no dice cómo se ve.
8. **Render.** `npx --yes hyperframes@0.9.20 render -q delivery -o renders/<video>.mp4`
9. **Entrega.** Di dónde quedó el MP4, cuánto dura y qué no pudiste comprobar (el sonido se mide, no se oye). La portada es el cuadro 0: `snapshot --at 0`.

Para verlo y retocarlo en el navegador: `npx --yes hyperframes@0.9.20 preview` dentro de la carpeta del video.

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
- **Guiones propios:** el tema puede ser el mismo que el de otro video; el texto, el orden y los dibujos son nuestros.

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

## Subtítulos

Los genera `subtitulos.mjs`: grupos de hasta 3 palabras, uno a la vez; cada palabra se enciende cuando la voz la dice. Si hay que cambiar el aspecto, se cambia en el script para que todos los videos queden iguales.

## Sonido

- **Voz:** Kokoro `ef_dora` (español, local y gratis). Es correcta, no excelente; para una voz mejor se cambia la función `hablar` de `voz.mjs` por otro motor que entregue un WAV por frase.
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
- Todo `<audio>` lleva `id`.
- La duración del video es el `data-duration` de la raíz y debe coincidir con `duracion` en `tiempos.json`.

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
  herramientas/voz.mjs     narración y tiempos por palabra
  herramientas/subtitulos.mjs
  videos/<video>/
    guion.json             lo que se dice
    tiempos.json           cuándo se dice (generado)
    index.html             montaje: escenas, subtítulos y audio
    compositions/*.html    una escena por archivo
    renders/               los MP4 (no van a GitHub)
```

Los scripts son de Node porque HyperFrames ya lo exige; el resto de la Legión sigue en PowerShell.
