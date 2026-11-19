# Narrador — método de los videos propios

Este es el método del agente 06, el Narrador. Hace **videos verticales de contenido 100 % nuestro** para las cuentas propias de la Legión: historia, historia de la medicina, ciencia, dinero y curiosidades. El motor es el mismo del Animador (`animados/GUIA.md`): escenas dibujadas con código, voz grabada por una persona, subtítulos por palabra y render con HyperFrames.

**Qué cambia frente al Animador**
- Aquí no se vende nada: se cuenta una historia o se explica algo.
- Los videos son más largos (45 a 60 s).
- Cada dato lleva su fuente.
- Cada nicho tiene su estilo visual.

Si esta guía y `animados/GUIA.md` chocan en algo técnico (motor, zonas, reglas de HyperFrames), manda la guía. En contenido manda esta.

## 1. Piezas del sistema

| Pieza | Dónde | Qué es |
|---|---|---|
| Nichos | `animados/contenido/nichos.json` | Cada categoría: estilo, tono, fuentes confiables, formatos y límites |
| Banco de temas | `datos/narrador/temas.json` | Temas por nicho con su estado (`pendiente`, `esperando-grabacion`, `hecho`, `descartado`) y las series |
| Calendario | `datos/narrador/calendario.json` y `salidas/narrador/calendario-<AAAA-MM>.md` | Qué video sale cada día y en qué cuenta |
| Videos | `animados/propios/<video>/guion.json` | Un guion por video; lo demás lo genera `producir.mjs` |
| Entregas | `salidas/narrador/<video>/` | MP4, `portada.jpg`, `textos.md` (uno por red), `fuentes.md`, `publicacion.txt` y `meta.json` |
| Por grabar | `salidas/narrador/por-grabar.md` | Las frases de todos los videos que esperan voz |
| Plantillas y estilos | `animados/plantillas/` y `animados/GUIA.md` («Videos propios (Narrador): temas y plantillas») | Escenas para explicar y los 3 temas visuales |

## 2. Del tema al video

1. **Tema.** Del calendario del día, del banco (el primer `pendiente` del nicho que toque) o el que pida la persona.
2. **Investigar.** Al menos **dos fuentes confiables** que coincidan en cada dato que se dice (sección 4). Anota cada una en `guion.fuentes`.
3. **Guion.** Con la estructura de la sección 3, en `animados/propios/<video>/guion.json`, usando solo plantillas (`escenas` con `plantilla` y `datos`) y el `estilo.tema` del nicho.
4. **Frases para grabar.** `node animados/herramientas/producir.mjs animados/propios/<video> --sin-render`. Sin grabación queda «esperando grabación» y sus frases van a `salidas/narrador/por-grabar.md`.
5. **Con la grabación** (`grabacion.m4a` en la carpeta del video), vuelve a correr ese comando. Corrige cada error y cada aviso.
6. **Mirar.** `node animados/herramientas/capturas.mjs animados/propios/<video>` y revisa cada hoja: texto que se sale, cosas encimadas, tildes y fuentes que no cargaron.
7. **Producir y entregar.** `node animados/herramientas/producir.mjs animados/propios/<video>`.
8. **Reaprovechar** (sección 9), si se pidió.

Una vez grabado, **el texto dicho no se cambia**. Si algo no cabe, se cambia el texto en pantalla.

## 3. Guion narrativo

**Largo:** de 45 a 60 segundos, es decir de 110 a 150 palabras. Hasta 19 palabras por frase.

**Estructura:**

| Parte | Frases | Qué hace |
|---|---|---|
| **Gancho** | 1 | Pregunta o afirmación sorprendente, de 10 palabras o menos. Va en pantalla (`titulo-pregunta`) con `"subtitulos": false`. Promete algo que el video sí cumple |
| **Contexto** | 1-2 | Quién, cuándo y dónde, en lenguaje de calle. Un año o un lugar en pantalla (`dato-grande` o `personaje`) |
| **Tensión** | 2-3 | El problema, lo que nadie entendía o lo que salió mal. Aquí va el bucle abierto: «pero lo raro vino después» |
| **Revelación** | 1-2 | La respuesta, el giro o el descubrimiento. Es el momento más visual del video |
| **Cierre** | 1 | La lección o el dato para llevarse. En pantalla, una línea propia de 2 a 5 palabras que dure 2 s o más (`cierre-respuesta`) |

**Reglas:**
- **Una sola idea por video,** con un ejemplo seguido de principio a fin, no una lista de datos.
- **Tono:** de tú, frases cortas, español neutro con sabor latino. Sin «hola», sin presentarse y sin pedir en la voz que sigan la cuenta (eso va en el texto de la publicación).
- **Retención:** algo nuevo en pantalla cada 2 a 4 segundos (`animados/GUIA.md`, «Movimiento»).
- **`clave`:** una o dos palabras por frase, que salen en el color de acento.
- **Formatos:** misterio histórico, descubrimiento médico, mito o realidad, dato que no sabías y la historia en 3 pasos. El orden de escenas de cada uno está en `animados/GUIA.md`.
- **Cada video es distinto.** No repitas el formato ni la paleta del video anterior de la misma cuenta. Dentro del tema del nicho, varía `fondo` y `brillo`.

## 4. Verdad y fuentes

- **Cada afirmación** se comprueba en al menos dos fuentes confiables antes de animarla: enciclopedias, museos, universidades, instituciones públicas o revistas científicas. Las de cada nicho están en `nichos.json`. Blogs, foros y videos de otros creadores no cuentan como fuente.
- **Si un dato está en discusión,** se dice la versión segura («se cree que», «según los registros») o se quita.
- **Los mitos se nombran como mitos,** y se explica de dónde salen.
- **Cifras, fechas y nombres** se copian exactamente de la fuente.
- **`guion.fuentes`** es obligatorio: `[{ "dato": "Semmelweis redujo la mortalidad con el lavado de manos", "fuente": "…", "url": "…" }]`. `producir.mjs` lo entrega como `fuentes.md`.
- **Un dibujo bonito y falso es peor que no publicar.**

## 5. Salud y dinero: límites

- **Historia de la medicina:** se cuentan hechos, no se dan consejos.
- **Divulgación de salud** (cómo funciona el cuerpo, qué es una enfermedad):
  - solo con fuentes como la OMS, la OPS, el NIH o el Ministerio de Salud;
  - **nunca** diagnósticos, dosis, tratamientos, «curas» ni remedios caseros como tratamiento;
  - todo video de salud queda en estado `revision-medica`, y no se entrega para publicar hasta que una persona con formación en salud lo revise;
  - el texto de la publicación lleva: «Contenido informativo. No reemplaza la consulta médica».
- **Dinero:**
  - historia y conceptos (qué es la inflación, por qué vale un billete);
  - **nunca** consejos de inversión, promesas de rentabilidad, criptomonedas para ganar ni «hazte rico»;
  - el texto lleva: «Contenido educativo, no es asesoría financiera».

## 6. Estilos visuales

Se activan con `"estilo": { "tema": "<tema>" }` en el guion (detalle en `animados/GUIA.md`).

| Tema | Nichos | Aspecto |
|---|---|---|
| `archivo` | historia | Papel envejecido, tinta sepia, acento rojo lacre, título en serif |
| `laboratorio` | historia de la medicina, ciencia, salud | Blanco azulado con cuadrícula, tinta azul petróleo, acento turquesa |
| `pizarra` | dinero, datos, curiosidades | Fondo oscuro, trazos y cifras en neón, estilo infografía |

## 7. Series

- **De 3 a 5 videos conectados** sobre un mismo asunto (p. ej. «Pandemias que cambiaron el mundo»). En `temas.json` cada parte lleva `serie: { id, parte, de }`.
- **Cada parte se entiende sola.** La insignia «Parte 2 de 3» va en pantalla, y la última frase en pantalla anuncia la siguiente («Mañana: la gripe de 1918»).
- **En el calendario,** las partes van en días seguidos y en la misma cuenta.

## 8. Calendario del mes

- **Un video al día por cuenta** durante el piloto; se sube cuando haya datos de retención.
- **Mezcla:** la cuenta de historia lleva historia e historia de la medicina; la de curiosidades, ciencia, curiosidades y dinero (según las cuentas que se creen).
- **Efemérides:** antes de armar el mes, busca las fechas del mes que den tema (aniversarios de hechos históricos o descubrimientos) y ponlas en su día.
- **Series** en días seguidos. Nunca dos videos seguidos del mismo formato en la misma cuenta.
- **Salida:**
  - `datos/narrador/calendario.json`: `[{ fecha, cuenta, tema, estado }]`;
  - `salidas/narrador/calendario-<AAAA-MM>.md`: una tabla legible con día, cuenta, tema, formato y estado.

## 9. Portada, textos y reaprovechamiento

**Portada**
- El cuadro 0 es la portada: la escena `titulo-pregunta`, con el gancho de 6 palabras o menos y la ilustración.
- Debe ser **clickbait honesto**: promete lo que el video da.
- Nada importante arriba de 190 px ni debajo de 1100 px (lo tapan las apps).
- Si conviene otro cuadro, `"portada_en": <segundo>`.

**Textos por red** (`guion.publicacion.redes`; `producir.mjs` los deja en `textos.md`):

| Red | Qué lleva |
|---|---|
| `tiktok` | La frase gancho, una pregunta que invite a comentar y 3 a 5 hashtags |
| `instagram` | Gancho, 2 frases de contexto, «Guárdalo para…» o «Compártelo con…» y 5 hashtags |
| `youtube` | `titulo` de 60 letras o menos, 1 o 2 frases y 3 hashtags (uno es `#Shorts`) |
| `facebook` | 2 o 3 frases y una pregunta |

Salud y dinero llevan su aviso (sección 5). Se puede agregar «Fuentes en el primer comentario».

**Reaprovechar** (`/narrador reaprovechar <video>`), en `salidas/narrador/<video>/`:
- `carrusel/`: de 5 a 7 imágenes 1080×1350 para Instagram. Una captura por escena con `npx hyperframes@0.9.20 snapshot`, más un texto corto por imagen en `carrusel.md`.
- `corto-15s.mp4`: solo el gancho y la revelación, cortados del MP4 con ffmpeg en los tiempos de `tiempos.json`.
- `post.md`: la historia en un texto de 5 a 8 líneas, para Facebook o X.

## 10. Voz y publicación

- **La voz es de una persona** (`"motor": "grabada"`): Santiago o Felipe leen `para-grabar.txt` con el celular.
- **Voz de pago:** si algún día se quiere producir sin grabar, se puede conectar una por `"motor": "externo"`. Necesita la aprobación de los dos, por el costo.
- **El Narrador no publica.** Deja todo en `salidas/narrador/` y una persona (o, más adelante, el Publicador) lo sube a las cuentas propias.
