# Estado actual (AS-IS)

Auditoría de solo lectura del 2026-11-19, primera orden de trabajo del brief (§8.1 y §9).
- **[C]** = comprobado en el código o en los datos.
- **[I]** = inferido.

## 1. Respuesta corta

**¿Funciona de punta a punta?** Sí, pero solo en TikTok y con un paso humano [C]:
1. Los cazadores detectan.
2. El Clipero corta.
3. El Publicador manda el video como borrador a TikTok.
4. Una persona lo termina y lo publica desde la app.

YouTube, Instagram y Facebook están programados, pero sin cuentas conectadas. No hay métricas ni medición de costos. La primera semana se dedica a integración y observabilidad.

## 2. Componentes

| Componente | Qué hace | Entradas y salidas | Estado |
|---|---|---|---|
| **01 Cazador Urbano** (`.claude/agents/cazador-viral.md`, `legion/01-cazador-viral/recolectar.ps1`) | Recoge señales (Google Trends, trends24, Wikipedia), sigue el ciclo de vida de cada patrón y propone fuentes para clips | Lee `datos/cazador-viral/{patrones,perfiles,archivo}.json` y escribe `salidas/cazador-viral/oportunidades.json`: `oportunidades[]` (id, etapa, puntaje, ventana) y `fuentes_para_clips[]` (url, canal, vistas por hora) | [C] Ciclo 15. 10 patrones: 6 quemados, 2 emergentes y 2 semilla |
| **04 Cazador de Risas** (`cazador-risas.md`, `legion/04-cazador-risas/enfoque.md`) | Lo mismo para comedia y sátira política, sin recolector propio | Escribe `salidas/cazador-risas/oportunidades.json`, con `linea` y `reserva` | [C] Ciclo 7 |
| **02 Clipero** (`clipero.md`, `legion/02-clipero/clipero.ps1`: buscar, canal, vistazo, analizar, cortar) | Encuentra momentos en videos largos y corta clips verticales con subtítulos y variantes | Escribe `salidas/clipero/clips.json`: id, estado, puntaje, fuente{url, canal, inicio, fin}, linea, variante_de, derechos, plataformas, ventana_hasta. Cada clip deja `clips/<id>/{meta.json, ficha.md}` | [C] 202 clips en la raíz (193 listos), 15 de Lalo, 30 de CurioSismo y 17 de GTA fuera del repositorio |
| **03 Publicador** (`publicador.md`, `legion/03-publicador/publicar.ps1`: estado, subir, comprobar, panel, autorizar) | Escribe los textos, reparte entre cuentas, sube lo aprobado y mantiene el panel | Lee `clips.json`; escribe `datos/publicador/estado.json` (550 entradas), los envíos `envios/<clip>__<p>.json` con su `.resultado.json`, y en `salidas/publicador/` deja `publicaciones.json`, `pendientes.md` y `panel.html` | [C] TikTok real, en modo borrador; el resto sin credenciales |
| **05 Animador** (`animados/`, Node con HyperFrames) | Videos verticales animados de unos 30 s para vender la Legión | Lee `datos/animador/temas.json` (17 temas); deja `salidas/animador/videos.json` y `por-grabar.md` | [C] 7 hechos, 3 esperando voz y 7 pendientes. No publica |
| **CurioSismo** (`curiosismo/`) | Encargo del Clipero sobre el canal propio de YouTube | `curiosismo/clips.json` (30 clips, `propio`, línea `curiosidades`) y `indice.md` con los avisos de verificación de hechos | [C] Nada registrado ni publicado |
| **Skills** | `/legion` (01→04→02→03 y push), `/turno-lalo` (02→03 en `espacios/lalo`) | — | [C] `turno-cazador` y `turno-clips` se conservan pero no se usan |

## 3. Dependencias externas

| Dependencia | Programada | Configurada |
|---|---|---|
| yt-dlp, ffmpeg, ffprobe, deno, whisper.cpp (modelo `ggml-small-q5_1`) | Sí | Sí, en `herramientas/bin`. Solo hay versiones para Windows |
| Node 22+, HyperFrames 0.9.20, Chrome (Animador) | Sí | Sí, en la PC de Santiago |
| TikTok Content Posting API | Sí | Sí: sandbox, destino `borrador`, cuentas `principal`, `risas` y `lalo-music`. Los 68 resultados de envío son de TikTok |
| YouTube Data API v3 | Sí | No (`youtube.activa: false`) |
| Instagram API y Facebook Reels | Sí | No |
| X | No | No: subir video por API es de pago |
| YouTube API y Twitch para el recolector | Sí, opcional | No: falta `YOUTUBE_API_KEY` |

Las credenciales están fuera del repositorio (`%USERPROFILE%\.legion\publicador\credenciales.json`). La auditoría no las abrió.

## 4. Derechos

- **Valores:** `propio`, `autorizado` y `sin_verificar` (`legion/02-clipero/metodologia.md`, `plataformas.md` §9). La única fuente autorizada es Lalo Ocampo, confirmada el 2026-11-02 (`legion/02-clipero/config.json`). [C]
- **Datos:** 198 de los 202 clips de la raíz son `sin_verificar`. De quién son: Westcol 58 (contando WestcolClips), Samulx 19, Momentos de la Mente 18, juan diego mm 11, La Cotorrisa 15 y otros. [C]
- **⚠ `publicar.ps1` no revisa los derechos.** Sus guardas son el espacio, los descartados, los duplicados, los repetidos, las cuentas activas y la simulación. El control de derechos está solo en el prompt (`publicador.md`). [C]
- **⚠ Los borradores salen sean cuales sean los derechos.** Con `aprobacion_automatica_borradores: true`, `publicador.md` crea la entrada aprobada aunque el clip sea `sin_verificar`. Por eso las 62 publicaciones de la raíz son de clips sin verificar. [C]
- **Crédito:** el prompt lo pide cuando el clip no es `propio`. Pero en modo borrador el texto se pega a mano en la app, así que el crédito depende de ese paso. [I]
- **CurioSismo marcado dos veces distinto:** el lote del 06-nov dejó 9 clips como `sin_verificar` y línea urbano (también están en `subidos-a-mano.json`); el encargo del 15-nov, como `propio`. [C]

## 5. Aprobaciones

- `modo: "aprobacion"` en todos los espacios. `derechos_automatico: ["propio", "autorizado"]` solo se usa en modo automático. [C]
- `aprobacion_automatica_borradores: true` está en la raíz y falta en Lalo y en GTA. Por eso Lalo tiene 11 clips esperando aprobación. [C]
- Estado de las 550 entradas de la raíz:

| Estado | Entradas |
|---|---|
| Publicado | 18 |
| En borradores | 44 |
| Aprobado en cola | 39 |
| Esperando aprobación (59 de YouTube, 59 de Instagram) | 118 |
| Vencido | 111 |
| Rechazado | 220 |

- `subidos-a-mano.json` tiene 162 ids subidos a mano hasta el 2026-11-09. [C]
- **⚠ Al conectar YouTube e Instagram aparecen 118 envíos viejos esperando aprobación.** Hay que revisarlos antes de aprobar en bloque. [I]

## 6. Métricas

- `datos/publicador/metricas.json` está vacío. Las 62 publicaciones no tienen URL, porque se terminaron desde la app. [C]
- Las vistas de TikTok están apagadas (`leer_metricas: false`). Las llamadas de vistas están escritas pero sin probar con cuentas reales (`plataformas.md` §11). [C]

## 7. Costos y uso

- No se mide ningún token ni costo. [C]
- Varios ciclos se cortaron por el **límite de uso de Claude**: informe del Cazador del 2026-11-02, informe del Clipero de Lalo del 2026-11-11 (dos cortes) y ciclo de la raíz del 2026-11-18. [C]
- Hay presupuestos de búsquedas por ciclo y conteo de subidas por día; la duración de cada ciclo solo aparece en el texto de los informes. [C]
- TikTok ya devolvió `spam_risk_too_many_pending_share` (admite 5 borradores pendientes cada 24 h). [C]

## 8. Espacio GTA

- En el repositorio solo están sus dos `config.json`. Lanzamiento de GTA VI para EE. UU., en inglés, sin material de Rockstar, `fuentes_autorizadas: []`, Publicador en simulación y cuenta `gta-us` apagada en las 4 plataformas. [C]
- Fuera del repositorio (`c:\tmp\legion-gta`) hay 17 clips listos, todos `sin_verificar` (2026-11-19 07:45). [C]

## 9. Seguridad

- No hay secretos en el repositorio ni en su historial. La auditoría buscó claves de Google, tokens de Meta, `Bearer`, `client_secret` y claves privadas. [C]
- `.gitignore` cubre `*.env`, cookies, `credenciales*.json`, `settings.local.json` y `espacio.local.json`. `settings.json` niega leer y editar `~/.legion/**`. [C]
- Los tokens de Instagram y Facebook viajan en la URL de la petición, pero los mensajes de error los ocultan. [C]

## 10. Deuda técnica

| Punto | Detalle | Tarea |
|---|---|---|
| Scripts de un solo uso | `legion/02-clipero/{lote,validar-lote,finalizar-lote}-2026-11-06.ps1`, con rutas fijas y un carácter no ASCII. Artefactos sueltos `revision-Xrwm98iaWY8.json`, `westcol-robot-Xrwm98iaWY8.html` | C14 |
| Solo funciona en Windows | `.exe`, mutex de Windows, `%USERPROFILE%`, PowerShell 5.1, enlaces duros | S10 / P-05 |
| Rutas fijas | `c:\tmp\legion-gta` en CLAUDE.md; `c:\Users\HP` en `datos/cazador-viral/patrones.json` | C14 |
| Documentación vieja | CLAUDE.md decía «En simulación», `/turno-clips` como turno de la raíz y «sin Node»: corregido el 2026-11-19 | C1 |
| Espejo de Codex | `AGENTS.md`, `.agents/` y `.codex/` sin versionar y desfasados (falta el Cazador de Risas) | C14 |
| Sin pruebas ni CI | No hay tests ni `.github/` | Por planear |
| Crecimiento del repositorio | 649 archivos de búsquedas y 622 de envíos en git; `panel.html` pesa 222 KB; 21 búsquedas sin versionar | C14 |
| Sin validación de esquemas | El estado JSON lo editan los agentes sin esquema que lo compruebe [I] | Por planear |
| `GUIA.md` del Animador | Perdió las barras invertidas en algunas rutas | C14 |

## 11. Entidades del brief y dónde viven hoy

Ver `ARCHITECTURE.md` §3. En resumen:

| Entidad | Dónde vive |
|---|---|
| Agent | `.claude/agents/*.md` |
| AgentRun | Informes |
| SocialAccount | `config.json` del Publicador |
| SourceLicense | `fuentes_autorizadas` y `derechos` |
| VideoVariant | `clips.json` |
| PublishingJob | Envíos y `estado.json` |
| MetricSnapshot | `metricas.json`, vacío |
| Task | Mission Control y `ROADMAP.md` |
