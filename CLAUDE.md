# Legión de Agentes I.A

Una legión de agentes autónomos, cada uno controlado por un loop. Esta sesión de Claude Code es el **orquestador**: crea los agentes, los dispara con loops y resume sus resultados. El usuario define los procesos uno a uno.

## La Legión

| # | Agente | Qué hace | Entrada | Disparo suelto | Estado |
|---|--------|----------|---------|----------------|--------|
| 01 | Cazador Viral | Detecta patrones virales replicables antes de que se quemen y diseña formatos híbridos | Redes y recolector propio | `/cazador-viral` | Listo |
| 02 | Clipero | Encuentra momentos en contenido largo (podcasts, streams, entrevistas) ligados a las oportunidades del 01 y produce clips verticales con subtítulos | `salidas/cazador-viral/oportunidades.json` | `/clipero` | Listo; requiere `herramientas/instalar.ps1` |

**Cadena:** `/legion` ejecuta los agentes en orden (01 → 02). Es lo que debe correr en el loop: `/loop 6h /legion`. Cada agente nuevo que dependa de otro se añade como paso en `.claude/skills/legion/SKILL.md`.

## Convenciones para todo agente

- **Definición:** `.claude/agents/<nombre>.md` (rol, procedimiento de ciclo, reglas y esquemas de salida).
- **Disparador:** `.claude/skills/<nombre>/SKILL.md`. Solo lanza el subagente y resume su respuesta; el trabajo pesado nunca se hace en el contexto del orquestador.
- **Conocimiento, configuración y scripts:** `legion/NN-<nombre>/`.
- **Memoria entre ciclos:** `datos/<nombre>/`. Solo la escribe su propio agente.
- **Entregables:** `salidas/<nombre>/`. Los agentes se comunican **solo** leyendo las salidas de otros (contratos JSON documentados en la definición de cada agente), nunca la carpeta `datos/` ajena.
- **Scripts:** PowerShell 5.1 (en esta máquina no hay Python, Node ni Git). Los `.ps1` solo llevan caracteres ASCII; los JSON se escriben en UTF-8 sin BOM. Se ejecutan con `powershell -NoProfile -ExecutionPolicy Bypass -File ...`.
- **Herramientas compartidas** (yt-dlp, ffmpeg, deno): `herramientas/bin/`. Se instalan o actualizan con `herramientas/instalar.ps1`, que ejecuta el usuario (el clasificador bloquea que Claude descargue ejecutables). Conviene actualizar yt-dlp cada pocas semanas, porque YouTube cambia a menudo.
- **Permisos** para que los loops corran sin preguntar: `.claude/settings.json`. Cada agente nuevo con script propio necesita su regla `PowerShell(...)`.
- **Idioma:** español. Fechas en ISO 8601 con zona horaria local.
- **GitHub:** todo lo que se crea se sube a https://github.com/pipehz25/legion-de-agentes (rama `main`; colaborador: Santiago). Al terminar cada cambio: commit y push. `.gitignore` deja fuera los binarios, las instantáneas crudas, la caché de transcripciones y los videos e imágenes de los clips.

## Loops

- `/loop <intervalo> /<agente>` funciona mientras esta sesión siga abierta.
- Para 24/7 sin la sesión abierta: rutinas en la nube (`/schedule`). Requieren el proyecto en un repositorio de GitHub (ya está; falta configurar las rutinas).
