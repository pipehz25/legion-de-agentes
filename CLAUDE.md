# Legión de Agentes I.A

Una legión de agentes autónomos, cada uno controlado por un loop. Esta sesión de Claude Code es el **orquestador**: crea los agentes, los dispara con loops y resume sus resultados. El usuario define los procesos uno a uno.

## Empresa, estrategia y Mission Control (desde el 2026-11-19)

- **Socios y roles (D-09):** Santiago es el programador: conexiones, APIs, autorizaciones, Mission Control y hardware, y lleva el espacio de Lalo. Felipe crea y gestiona las cuentas: perfiles, operación diaria de la raíz, bandeja de TikTok y permisos con los creadores. Si una tarea mezcla las dos cosas, Felipe crea la cuenta y Santiago la conecta (en la PC que publica). El brief maestro es `LEGION_DE_AGENTES_MASTER.md`: tres unidades (A Media Network, B Enterprise Agents, C por definir) y una app central, Mission Control.
- **Estrategia:** `docs/ESTRATEGIA.md`. Hay dos familias de cuentas: clips de famosos (solo escala lo `autorizado`) y cuentas propias con contenido 100 % nuestro. El piloto es de 3 marcas y 2 nichos, y se crece por etapas medibles.
- **Documentos:** `docs/AS_IS.md` (estado real), `ARCHITECTURE.md`, `ROADMAP.md` (30 días, con tareas S/F/C/T), `COST_MODEL.md`, `DECISIONS.md` y `OPEN_QUESTIONS.md`. Cada decisión nueva se anota en `DECISIONS.md`.
- **Mission Control:** https://legion-mission-control.vercel.app. Es una app propia en Vercel (Next.js + Postgres de Neon) con usuario y contraseña; el código está en `mission-control/` y se despliega con `vercel deploy --prod` desde esa carpeta (equipo de Vercel de Santiago). Ahí viven el estado de las tareas, las cuentas, las decisiones y el estado del pipeline por espacio; cuando una tarea del roadmap avanza, se marca ahí. Los agentes escriben por `/api/agent/...` con el token `MC_AGENT_TOKEN`, que va en el `.env.local` de cada PC y nunca en GitHub ni en el chat. La v0 en claude.ai (`docs/mission-control/`) ya no se usa.
- **Al cerrar una sesión de trabajo:** lo completado, las pruebas, lo pendiente, los bloqueos, el gasto y 3 siguientes acciones para Santiago y Felipe (brief §8.8).

## La Legión

| # | Agente | Qué hace | Entrada | Disparo suelto | Estado |
|---|--------|----------|---------|----------------|--------|
| 01 | Cazador Urbano (`cazador-viral`) | Detecta patrones virales replicables antes de que se quemen y diseña formatos híbridos. Línea `urbano`: música urbana, empresarios y streamers | Redes y recolector propio | `/cazador-viral` | Listo |
| 04 | Cazador de Risas | El mismo trabajo que el 01, para la línea `risas`: comedia, stand-up, humoristas y momentos graciosos de la política colombiana. Reglas propias en `legion/04-cazador-risas/enfoque.md` | Redes (sin recolector) | `/cazador-risas` | Nuevo (2026-11-10) |
| 02 | Clipero | Encuentra momentos en contenido largo (podcasts, streams, entrevistas) ligados a las oportunidades de los dos cazadores y produce clips verticales con subtítulos, cada uno con su `linea`; si el Publicador tiene varias cuentas, corta además variantes de los mejores momentos | `salidas/cazador-viral/oportunidades.json` y `salidas/cazador-risas/oportunidades.json` | `/clipero` | Listo; requiere `herramientas/instalar.ps1` |
| 03 | Publicador | Escribe los textos de cada plataforma, reparte los clips entre las cuentas del usuario (una versión distinta por cuenta) y sube a YouTube, TikTok, Instagram y Facebook los que el usuario aprueba. Mantiene el panel `salidas/publicador/panel.html` | `salidas/clipero/clips.json` | `/publicador`, `/publicador aprobar <clip-id>` | Publica en TikTok como borrador (raíz y Lalo); YouTube, Instagram y Facebook programados pero sin credenciales (`legion/03-publicador/plataformas.md`). Ojo: `publicar.ps1` todavía no revisa los derechos en el código (tarea C8) |
| 05 | Animador | Produce videos explicativos animados (dibujados con código, narrados y con subtítulos) para vender la Legión de Agentes a negocios: un video por tipo de negocio, con plantillas. No publica: deja el MP4 y su texto listos | `datos/animador/temas.json` (su lista de temas) | `/animador`, `/animador <tema>`, `/animador <número>` | Nuevo (2026-11-12); requiere Node, ffmpeg y whisper (`animados/GUIA.md`); la voz la graban las personas (`salidas/animador/por-grabar.md`) |
| 06 | Narrador | Videos de contenido 100 % propio (historia, historia de la medicina, ciencia, dinero, curiosidades) para las cuentas propias: investiga con fuentes, escribe el guion, lo produce con el motor de `animados/` en uno de 3 estilos (archivo, laboratorio, pizarra) y deja MP4, portada, textos por red y fuentes. Arma también el banco de temas, el calendario del mes, las series y el reaprovechamiento | `datos/narrador/temas.json` y `datos/narrador/calendario.json` | `/narrador`, `/narrador producir <id>`, `/narrador temas <nicho>`, `/narrador calendario <AAAA-MM>`, `/narrador serie <asunto>`, `/narrador reaprovechar <id>` | Nuevo (2026-11-19); mismos requisitos que el Animador; la voz la graban las personas (`salidas/narrador/por-grabar.md`) |

**Narrador:** no forma parte de `/legion`. Su método está en `animados/contenido/` (`NARRADOR.md` y `nichos.json`); sus videos, en `animados/propios/`; su memoria, en `datos/narrador/`; y sus entregas, en `salidas/narrador/` (los MP4 no viajan por GitHub). Comparte motor, plantillas y `producir.mjs` con el Animador, que entrega según la carpeta del video. Salud y dinero tienen límites estrictos (sin consejos), y lo de salud no se publica sin revisión de una persona con formación en salud.

**Animador:** no forma parte de `/legion` ni de ningún loop. Su método, sus scripts (Node, porque el motor que usa lo exige) y sus plantillas viven en `animados/`, no en `legion/05-…`; su memoria en `datos/animador/` y sus entregables en `salidas/animador/` (los MP4 no viajan por GitHub). La voz la graba una persona con el celular (`"motor": "grabada"`): el agente deja las frases para leer y produce el video cuando llega el audio. Música y retoques se hacen después en CapCut.

**Varias cuentas:** se declaran en el `config.json` del Publicador (`legion/03-publicador/config.json` o, en un espacio, `espacios/<nombre>/legion/03-publicador/config.json`; `plataformas.<p>.cuentas`) y cada una se autoriza con `publicar.ps1 autorizar -Plataforma <p> -Cuenta <alias>` (`plataformas.md` §10). Un video va a una sola cuenta por plataforma; para que un momento salga en varias, el Clipero corta variantes reales (`legion/02-clipero/metodologia.md` §7). No se disfrazan videos para esquivar el control de duplicados de las plataformas ni se automatizan cuentas fuera de sus APIs oficiales.

**Líneas de contenido** (desde el 2026-11-10): `urbano`, que lleva el Cazador Urbano, y `risas`, que lleva el Cazador de Risas. El Clipero marca cada clip con su línea y el Publicador lo manda a las cuentas de esa línea (`risas` tiene cuenta propia en TikTok e Instagram).

**Cadena:** `/legion` ejecuta la cadena completa en la PC de Felipe: baja de GitHub, corre 01 Cazador Urbano, 04 Cazador de Risas, 02 Clipero y 03 Publicador, y sube todo. Es lo que corre el loop. Cada agente nuevo que dependa de otro se añade como paso en `.claude/skills/legion/SKILL.md`.

**Dos PCs, dos espacios** (desde el 2026-11-10):

| Loop | PC | Qué corre |
|------|----|-----------|
| `/loop 6h /legion` | Felipe (tiene los videos, whisper y las credenciales de las cuentas principales y de risas) | Toda la cadena del espacio principal: 01 Cazador Urbano → 04 Cazador de Risas → 02 Clipero → 03 Publicador |
| `/loop 6h /turno-lalo` | Santiago (tiene los videos y las credenciales de las cuentas de Lalo) | 02 → 03, solo en el espacio `lalo` |

- **Santiago** no corre `/legion`, `/turno-clips`, `/turno-cazador` ni ningún cazador: dos cazadores a la vez se pisan `datos/cazador-*`. Lo suyo es `/turno-lalo` y desarrollar.
- **Felipe** no corre `/turno-lalo`.
- Las skills `/turno-cazador` y `/turno-clips` se conservan por si se vuelve al reparto anterior, pero no se usan.
- Los videos no viajan por GitHub (`.gitignore`): cada Publicador corre en la misma PC que su Clipero.

## Espacios

Un **espacio** es una línea de contenido aparte, con su propia configuración, memoria y salidas en `espacios/<nombre>/`, con la misma estructura que la raíz (`legion/02-clipero/config.json`, `legion/03-publicador/config.json`, `datos/`, `salidas/`). La raíz es la línea de siempre. Los scripts, las definiciones de los agentes, las metodologías y todo lo del Cazador son comunes.

| Espacio | Contenido | PC | Turno | Cuentas |
|---------|-----------|----|-------|---------|
| (raíz) | Clips de los perfiles y oportunidades del Cazador | Felipe | `/legion` | `principal` y `risas` de cada plataforma |
| `lalo` | Solo Lalo Ocampo, desde su canal (fuente autorizada); el Clipero no sigue al Cazador (`enfoque_propio`) | Santiago | `/turno-lalo` | 15 cuentas de TikTok `lalo-*`; cada una se enciende al autorizarla |
| `gta` | Lo viral del lanzamiento de GTA VI (19-nov-2026) para EE. UU., en inglés; el Clipero busca sus propias fuentes (`enfoque_propio`), sin cazadores | Santiago, en una copia aparte del proyecto (`c:\tmp\legion-gta`, con su propio `espacio.local.json`) para no cruzarse con `lalo` | Por ahora a mano, con `/clipero` desde esa copia | `gta-us` en cada plataforma, apagadas hasta que Santiago las cree en EE. UU. y las autorice |

- **Cada PC trabaja en un solo espacio.** Lo dice su `espacio.local.json`, en la raíz del proyecto (`{ "espacio": "lalo" }`), que no se sube a GitHub. Sin ese archivo, la PC trabaja en la raíz. `clipero.ps1` y `publicar.ps1` leen y escriben solos en el espacio de la PC, y `publicar.ps1` rechaza los envíos y los videos de otro. `/clipero`, `/publicador` y `/publicador aprobar ...` actúan sobre el espacio de la PC donde se lanzan.
- **Cada espacio sube solo su carpeta** (`git add espacios/<nombre>`), y la raíz solo las suyas: así dos PCs no se pisan.
- Las credenciales siguen fuera del proyecto y son de cada PC: una cuenta se autoriza en la PC que la va a publicar. Los alias de cuenta no se repiten entre espacios.
- **Otro espacio:** copia los dos `config.json` a `espacios/<nombre>/legion/...`, ajusta sus cuentas y fuentes, pon `espacio.local.json` en la PC que lo lleve y copia `.claude/skills/turno-lalo` con el nombre nuevo.

## Convenciones para todo agente

- **Definición:** `.claude/agents/<nombre>.md` (rol, procedimiento de ciclo, reglas y esquemas de salida).
- **Disparador:** `.claude/skills/<nombre>/SKILL.md`. Solo lanza el subagente y resume su respuesta; el trabajo pesado nunca se hace en el contexto del orquestador.
- **Conocimiento, configuración y scripts:** `legion/NN-<nombre>/`.
- **Memoria entre ciclos:** `datos/<nombre>/`. Solo la escribe su propio agente.
- **Archivos temporales** (scripts auxiliares, pruebas): en el scratchpad de la sesión y con el nombre del agente delante (`clipero-registrar.ps1`, `publicador-...`). Varios agentes comparten ese directorio y se pisan si usan el mismo nombre.
- **Entregables:** `salidas/<nombre>/`. En un espacio, `datos/` y `salidas/` cuelgan de `espacios/<nombre>/` («Espacios»). Los agentes se comunican **solo** leyendo las salidas de otros (contratos JSON documentados en la definición de cada agente), nunca la carpeta `datos/` ajena.
- **Scripts:** PowerShell 5.1 (la cadena no usa Python ni Node; Node solo lo usan el Animador, en la PC que lo corre, y Mission Control, que corre en Vercel). Los `.ps1` solo llevan caracteres ASCII; los JSON se escriben en UTF-8 sin BOM. Se ejecutan con `powershell -NoProfile -ExecutionPolicy Bypass -File ...`.
- **Herramientas compartidas** (yt-dlp, ffmpeg, deno): `herramientas/bin/`. Se instalan o actualizan con `herramientas/instalar.ps1`, que ejecuta el usuario (el clasificador bloquea que Claude descargue ejecutables). Conviene actualizar yt-dlp cada pocas semanas, porque YouTube cambia a menudo.
- **Permisos** para que los loops corran sin preguntar: `.claude/settings.json`. Cada agente nuevo con script propio necesita su regla `PowerShell(...)`.
- **Idioma:** español. Fechas en ISO 8601 con zona horaria local.
- **GitHub:** todo lo que se crea se sube a https://github.com/pipehz25/legion-de-agentes (rama `main`; colaborador: Santiago). Al terminar cada cambio: commit y push. `.gitignore` deja fuera los binarios, las instantáneas crudas, la caché de transcripciones y los videos e imágenes de los clips.

## Loops

- `/loop <intervalo> /<agente>` funciona mientras esta sesión siga abierta.
- Para 24/7 sin la sesión abierta: rutinas en la nube (`/schedule`). Requieren el proyecto en un repositorio de GitHub (ya está; falta configurar las rutinas).
