# Legión de Agentes I.A

Una legión de agentes autónomos, cada uno controlado por un loop. Esta sesión de Claude Code es el **orquestador**: crea los agentes, los dispara con loops y resume sus resultados. El usuario define los procesos uno a uno.

## La Legión

| # | Agente | Qué hace | Entrada | Disparo suelto | Estado |
|---|--------|----------|---------|----------------|--------|
| 01 | Cazador Viral | Detecta patrones virales replicables antes de que se quemen y diseña formatos híbridos | Redes y recolector propio | `/cazador-viral` | Listo |
| 02 | Clipero | Encuentra momentos en contenido largo (podcasts, streams, entrevistas) ligados a las oportunidades del 01 y produce clips verticales con subtítulos | `salidas/cazador-viral/oportunidades.json` | `/clipero` | Listo; requiere `herramientas/instalar.ps1` |
| 03 | Publicador | Escribe los textos de cada plataforma y sube a YouTube, TikTok, Instagram y Facebook los clips que el usuario aprueba | `salidas/clipero/clips.json` | `/publicador`, `/publicador aprobar <clip-id>` | En simulación; cada plataforma requiere credenciales (`legion/03-publicador/plataformas.md`) |

**Cadena:** `/legion` ejecuta los agentes en orden (01 → 02 → 03) en una sola PC. Cada agente nuevo que dependa de otro se añade como paso en `.claude/skills/legion/SKILL.md` (y en el turno que le toque, abajo).

**Reparto entre dos PCs** (vigente): la cadena se parte en dos turnos que se pasan el trabajo por GitHub. Cada turno baja lo último antes de empezar y sube solo las carpetas de sus agentes al terminar.

| Turno | PC | Agentes | Loop |
|-------|----|---------|------|
| `/turno-cazador` | Santiago | 01 | `/loop 6h /turno-cazador` |
| `/turno-clips` | Felipe (tiene los videos y las credenciales de las plataformas) | 02 → 03 | `/loop 6h /turno-clips`, arrancado como una hora después del de Santiago |

Mientras rija el reparto, nadie corre `/legion` ni `/cazador-viral` en la PC de los clips: dos Cazadores a la vez se pisan `datos/cazador-viral/`.

**Excepción temporal (desde el 2026-11-08, decisión de Felipe):** el Cazador de Santiago no sube nada desde el 3-nov, así que la PC de Felipe corre también `/turno-cazador` antes de cada `/turno-clips`. Antes de cada turno mira GitHub, y en cuanto vea commits del Cazador hechos desde la PC de Santiago en las últimas 8 h, deja de correrlo. **Santiago:** si reactivas tu loop, avísale a Felipe. Los videos no viajan por GitHub (`.gitignore`), así que el Publicador tiene que correr en la misma PC que el Clipero.

## Convenciones para todo agente

- **Definición:** `.claude/agents/<nombre>.md` (rol, procedimiento de ciclo, reglas y esquemas de salida).
- **Disparador:** `.claude/skills/<nombre>/SKILL.md`. Solo lanza el subagente y resume su respuesta; el trabajo pesado nunca se hace en el contexto del orquestador.
- **Conocimiento, configuración y scripts:** `legion/NN-<nombre>/`.
- **Memoria entre ciclos:** `datos/<nombre>/`. Solo la escribe su propio agente.
- **Entregables:** `salidas/<nombre>/`. Los agentes se comunican **solo** leyendo las salidas de otros (contratos JSON documentados en la definición de cada agente), nunca la carpeta `datos/` ajena.
- **Scripts:** PowerShell 5.1 (no se cuenta con Python ni Node en las PCs de la Legión). Los `.ps1` solo llevan caracteres ASCII; los JSON se escriben en UTF-8 sin BOM. Se ejecutan con `powershell -NoProfile -ExecutionPolicy Bypass -File ...`.
- **Herramientas compartidas** (yt-dlp, ffmpeg, deno): `herramientas/bin/`. Se instalan o actualizan con `herramientas/instalar.ps1`, que ejecuta el usuario (el clasificador bloquea que Claude descargue ejecutables). Conviene actualizar yt-dlp cada pocas semanas, porque YouTube cambia a menudo.
- **Permisos** para que los loops corran sin preguntar: `.claude/settings.json`. Cada agente nuevo con script propio necesita su regla `PowerShell(...)`.
- **Idioma:** español. Fechas en ISO 8601 con zona horaria local.
- **GitHub:** todo lo que se crea se sube a https://github.com/pipehz25/legion-de-agentes (rama `main`; colaborador: Santiago). Al terminar cada cambio: commit y push. `.gitignore` deja fuera los binarios, las instantáneas crudas, la caché de transcripciones y los videos e imágenes de los clips.

## Loops

- `/loop <intervalo> /<agente>` funciona mientras esta sesión siga abierta.
- Para 24/7 sin la sesión abierta: rutinas en la nube (`/schedule`). Requieren el proyecto en un repositorio de GitHub (ya está; falta configurar las rutinas).
