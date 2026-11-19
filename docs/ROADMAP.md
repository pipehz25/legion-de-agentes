# Roadmap · 30 días

Versión 1 · 2026-11-19 · Del 19 de noviembre al 14 de diciembre de 2026. El estado de cada tarea se lleva en **Mission Control** (pestaña Tareas); aquí queda el plan. Horas = esfuerzo estimado (hipótesis).

**Quién** (roles en D-09):
- **S** = Santiago: programación y conexiones (APIs, apps de desarrollador, autorizaciones, Mission Control, hardware) y el espacio de Lalo.
- **F** = Felipe: crea y gestiona las cuentas; operación diaria de la raíz; permisos con los creadores.
- **C** = Claude Code.
- **T** = los dos.

Cuando una tarea mezcla las dos cosas, Felipe crea la cuenta y Santiago la conecta. Las conexiones de la raíz se hacen en la PC de Felipe, porque las credenciales son de la PC que publica.
**Unidad:** A = Media · B = Enterprise · G = general.

## Semana 1 · 19–23 nov · Foco y observabilidad

| Tarea | Quién | U | h | Depende de | Lista cuando |
|---|---|---|---|---|---|
| C1 Auditoría y documentos del brief | C | G | 4 | — | Los 7 documentos de `docs/` están en GitHub y los dos los leyeron |
| C2 Mission Control v0 | C | G | 4 | — | Tareas, cuentas, pipeline y decisiones funcionan y los dos pueden marcar |
| ~~S1 Compartir Mission Control con Felipe como Editor~~ (cancelada: la v1 tiene usuario y contraseña) | S | G | — | — | — |
| C13 Mission Control v1 en Vercel (hecha el 2026-11-19, en revisión) | C | G | 6 | — | Los dos entran, ven sus tareas y las mueven |
| S16 Poner las contraseñas de Mission Control (`cd mission-control` y `npm run password`) | S | G | 0,2 | C13 | Los dos entran en https://legion-mission-control.vercel.app |
| F9 Entrar a Mission Control y cambiar la contraseña | F | G | 0,1 | S16 | Felipe entra con su propia contraseña |
| T1 Reunión de decisiones: P-01 derechos, P-02 piloto, P-03, presupuesto (Q-03) y CurioSismo (Q-08) | T | G | 1 | C1 | P-01 a P-03 pasan a «tomadas» en `DECISIONS.md` |
| S2 Decidir los 11 clips de Lalo que esperan | S | A | 1 | — | Ningún clip de Lalo sin decidir en `pendientes.md` |
| S3 Dejar el turno de Lalo cada 6 h | S | A | 0,2 | — | `/loop 6h /turno-lalo` corriendo en una sesión abierta |
| F1 Crear los canales de YouTube Legión Urbana y Legión de Risas | F | A | 1 | — | Los dos canales existen y Santiago puede conectarlos |
| S11 Conectar los canales de YouTube (urbano y risas). Al encenderlo aparecen 59 envíos viejos esperando aprobación: revisarlos antes de aprobar | S | A | 1,5 | F1 | `estado`: las dos filas de YouTube con token válido y YouTube encendido |
| S12 Primera subida de prueba en YouTube | S | A | 0,5 | S11 | Un Short de cada línea, público y en su canal |
| S13 Activar las vistas de TikTok (raíz) | S | A | 1 | — | El panel muestra vistas de TikTok |
| F4 Loop de `/legion` y bandeja de TikTok al día | F | A | diario | — | Sin borradores viejos en la bandeja |
| C3 Plan de permisos: lista de creadores, plantilla de solicitud y registro de licencias | C | A | 2 | — | Plantilla y registro en el repositorio |
| F5 Pedir permiso a los 5 creadores principales | F | A | 1 | C3, T1 | Solicitud enviada a Westcol, Samulx, Momentos de la Mente, juan diego mm y La Cotorrisa |
| C4 Medir costo y tiempo por ciclo | C | G | 3 | — | Cada informe anota inicio, fin y conteos; Mission Control muestra tiempo por video |
| C5 Mission Control en la cadena (paso final de `/legion` y `/turno-lalo`) | C | G | 3 | S1 | Tras un ciclo, la pestaña Pipeline muestra la hora de ese ciclo |

## Semana 2 · 24–30 nov · Contenido propio y derechos en el pipeline

| Tarea | Quién | U | h | Depende de | Lista cuando |
|---|---|---|---|---|---|
| C6 Registrar los 30 clips de CurioSismo para el Publicador | C | A | 1 | T1 | Aparecen en la cola del Publicador del espacio que los publica |
| F7 Crear las cuentas de CurioSismo que falten (TikTok o Instagram, según Q-09) | F | A | 1 | T1 | Las cuentas existen y Santiago puede conectarlas |
| S14 Conectar CurioSismo para publicar | S | A | 1 | T1 | La cuenta de CurioSismo con token válido en `estado` |
| C7 Cadena de contenido propio v0: tema, guion con fuentes, voz grabada, video y QA | C | A | 6 | — | Un video propio de curiosidades listo para aprobar, con su ficha de fuentes |
| S4 Grabar la voz del primer video propio | S | A | 0,3 | C7 | El audio está en la carpeta del video |
| S5 Grabar las voces de hotel, veterinaria y taller | S | B | 0,5 | — | Los tres MP4 producidos por el Animador |
| C8 Derechos en el código del Publicador: hoy `publicar.ps1` no los revisa y los borradores salen sean cuales sean (`AS_IS.md` §4); automático solo para `autorizado` y `propio`; `sin_verificar` según P-01 | C | A | 4 | T1, C3 | Un clip `sin_verificar` no sale sin la regla que se decidió |
| C14 Limpieza técnica: scripts de un solo uso, artefactos sueltos, búsquedas sin versionar, espejo de Codex y crecimiento del repositorio (`AS_IS.md` §10) | C | G | 2 | — | Sin scripts de un solo uso ni archivos sueltos |
| S6 Vistas de TikTok de Lalo | S | A | 0,5 | S13 | El panel de Lalo muestra vistas |
| C9 Insistir en lo que pega (optimizador v0) | C | A | 4 | S12, S13 | El Clipero prioriza las fuentes con clips que rindieron y lo dice en su informe |

## Semana 3 · 1–7 dic · Unidad B y distribución

| Tarea | Quién | U | h | Depende de | Lista cuando |
|---|---|---|---|---|---|
| C10 Plantilla de diagnóstico y generador de propuesta | C | B | 4 | — | Con las respuestas de un negocio sale una propuesta con alcance, precio y SLA |
| C11 Catálogo de agentes por tipo de negocio | C | B | 3 | — | Catálogo con los 17 tipos de negocio del Animador |
| S7 Elegir el negocio piloto de la Unidad B y agendar el diagnóstico | S | B | 2 | C10 | Diagnóstico agendado |
| F8 Lanzar el Instagram de la Legión con el kit | F | B | 2 | S5 | Perfil, destacadas y los primeros 3 videos publicados |
| F6 Crear las cuentas de Instagram de urbano y risas (profesionales) | F | A | 1 | — | Las dos cuentas existen como profesionales |
| S15 Conectar Instagram urbano y risas | S | A | 1,5 | F6 | Las dos cuentas con token válido en `estado` |
| T3 Actualizar yt-dlp en las dos PCs | T | G | 0,2 | — | `instalar.ps1 -Solo yt-dlp` corrido en ambas |

## Semana 4 · 8–14 dic · Piloto y decisión de escalar

| Tarea | Quién | U | h | Depende de | Lista cuando |
|---|---|---|---|---|---|
| T4 Revisión del piloto: indicadores, costo por video y derechos; ¿pasar a 10 cuentas? | T | G | 1,5 | C4, C9 | Decisión registrada en `DECISIONS.md` |
| S9 Conectar las 14 cuentas extra de Lalo (etapa 2) | S | A | 3 | T4 | 15 cuentas de Lalo con token válido |
| S10 Decidir la compra de la Mac mini con datos reales | S | G | 1 | C4 | Decisión P-05 tomada con los tres escenarios de `COST_MODEL.md` |
| C12 Primer agente para una empresa (piloto en la nube) | C | B | 8 | S7 | Agente corriendo en la nube para el negocio piloto, con aprobación humana |

## Riesgos del plan

- **T1 es el cuello de botella:** sin esas decisiones no avanzan C6, C8, F5, F7 ni S14. Conviene hacerla antes del sábado 21.
- **Conexiones en la PC de Felipe:** S11, S12, S13 y S15 se hacen en la PC de Felipe (en persona, por escritorio remoto, o Felipe pega los comandos mientras Santiago lo guía), porque las credenciales son de la PC que publica.
- **Límite de uso de Claude:** C4 lo mide. Si los ciclos siguen cortándose, se espacian (de cada 6 h a cada 8 h) o se reparte la carga.
- **Respuesta de los creadores:** puede tardar semanas. Por eso el piloto incluye una marca propia (CurioSismo) y una autorizada (Lalo), que no dependen de esas respuestas.
