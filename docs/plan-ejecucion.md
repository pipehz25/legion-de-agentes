# Plan de ejecución de la Legión

Actualizado el 2026-11-18. Cada tarea dice quién la hace, dónde y cuándo está lista.

| Quién | PC | Trabaja en |
|---|---|---|
| **Felipe** | La suya | La raíz: líneas `urbano` y `risas` (`/loop 6h /legion`) |
| **Santiago** | La suya | El espacio `lalo` (`/loop 6h /turno-lalo`) y desarrollo |
| **Claude** | Sesión de Santiago | Lo que hay que programar. Lo sube a GitHub y la otra PC lo baja con `git pull` |

**Cómo se usa:** el estado de cada tarea (pendiente, en curso, hecha) se marca en el **tablero**: https://claude.ai/artifact/A2HQQuZZGdmfGpvsjsnmvi. Lo ve todo el que tenga acceso. Este archivo guarda el detalle; si se añade o cambia una tarea, se cambia aquí y en el tablero.

## Fase 1 · Esta semana: encender lo que ya está construido

### Felipe

- [ ] **F1. Conectar los canales de YouTube.** Crear «Legión Urbana» y «Legión de Risas» con la cuenta de Google de su proyecto de Google Cloud, y conectarlos con su Claude usando el mensaje que le pasó Santiago (guía: `legion/03-publicador/plataformas.md` §3 y §10).
  *Lista cuando* `publicar.ps1 estado` muestra las dos filas de YouTube con `"token": "valido"` y su Claude encendió YouTube en `legion/03-publicador/config.json`.
- [ ] **F2. Primera subida de prueba.** Aprobar un clip de cada línea con `/publicador aprobar <clip-id>`.
  *Lista cuando* los dos salen como Short, públicos y en su canal (risas en risas, urbano en urbano). Pantallazo a Santiago.
- [ ] **F3. Loop y bandeja de TikTok al día.** `/loop 6h /legion` corriendo, y los borradores de TikTok de `principal` y `risas` terminados en la app cada día: cada cuenta admite 5 pendientes cada 24 h.
- [ ] **F4. Vistas de TikTok.** Añadir el scope `video.list` a la app *Legion Publicador* en TikTok for Developers, poner `tiktok.leer_metricas: true` en `legion/03-publicador/config.json` y volver a autorizar `principal` y `risas` (`plataformas.md` §11).
  *Lista cuando* el panel (`salidas/publicador/panel.html`) muestra vistas de TikTok.

### Santiago

- [ ] **S1. Terminar los 4 borradores de @ocampo.music.** Están en la bandeja de TikTok desde el 2026-11-11 (`espacios/lalo/salidas/publicador/pendientes.md`, parte 1). Si ya los terminaste, el próximo turno lo registra.
- [ ] **S2. Decidir los 3 clips que esperan.** Escucharlos y aprobarlos (`/publicador aprobar <clip-id>`) o rechazarlos (`/publicador rechazar <clip-id> <motivo>`). Están en la parte 2 del mismo archivo.
- [ ] **S3. Volver a prender el turno.** `/loop 6h /turno-lalo` en una sesión que quede abierta. No corre desde el 2026-11-11.
- [ ] **S4. Conectar las 14 cuentas de TikTok de Lalo que faltan.** Por cada una: entrar a TikTok con esa cuenta en el navegador, añadirla a *Target users* de la app y correr en tu ventana de PowerShell:
  `powershell -NoProfile -ExecutionPolicy Bypass -File legion/03-publicador/publicar.ps1 autorizar -Plataforma tiktok -Cuenta <alias>`
  Después, Claude la enciende (`activa: true`) en `espacios/lalo/legion/03-publicador/config.json`. Si TikTok no deja añadir más usuarios de prueba, avisar.
  *Lista cuando* `estado` muestra las 15 cuentas con `"token": "valido"`.
- [ ] **S5. Imagen de los canales de YouTube.** Nombre, @usuario, foto, banner y descripción de Legión Urbana y Legión de Risas, con ayuda de Claude. Se los pasa a Felipe para F1.
- [ ] **S6. Grabar las voces del Animador.** Tres videos esperan: hotel, veterinaria y taller (`salidas/animador/por-grabar.md`). Después, `/animador`.

## Fase 2 · Medir y repetir lo que funciona

- [ ] **C1. Claude: «insistir en lo que pega».** El Publicador publica en `salidas/publicador/rendimiento.json` qué clips rindieron (fuente, momento, vistas por hora) y el Clipero corta primero más momentos de esas fuentes y canciones. Santiago aprueba el diseño antes de programarlo. Usa las vistas de YouTube desde F2 y las de TikTok desde F4 y S7.
- [ ] **S7. Vistas de TikTok de Lalo.** Si las cuentas de Lalo usan la misma app de TikTok que Felipe, después de F4: `tiktok.leer_metricas: true` en `espacios/lalo/legion/03-publicador/config.json` y volver a autorizar las cuentas. Si usan otra app, añadirle también `video.list`.
- [ ] **F5. Instagram urbano y risas.** Cuentas profesionales (empresa o creador), añadidas a la app de Meta y autorizadas (`plataformas.md` §5 y §10). Hoy Instagram está apagado en la raíz.

## Fase 3 · Equipo y negocio

- [ ] **S8. Mac mini.** Cuando llegue, Santiago la instala (Claude Code, git, Node) y Claude adapta los scripts para que funcionen en Mac y en Windows. Decidir qué corre ahí: el Animador y, si se quiere, el turno de Lalo.
- [ ] **C2. Primer agente para una empresa.** Santiago y Felipe eligen un negocio piloto (hotel, veterinaria o taller, que ya tienen video) y Claude arma su agente para correr en la nube (`/schedule`), sin depender de ningún computador.
- [ ] **T1. Todos: actualizar yt-dlp** cada pocas semanas en cada PC con `herramientas/instalar.ps1 -Solo yt-dlp` (lo corre la persona). En la PC de Santiago es la del 2026-10-26: toca a comienzos de diciembre.

## Reglas que no cambian

- Felipe no corre `/turno-lalo`. Santiago no corre `/legion` ni los cazadores.
- Las claves nunca van por chat: `autorizar` se corre en la ventana propia de PowerShell.
- Lo de cada espacio se aprueba en su PC: urbano y risas en la de Felipe, Lalo en la de Santiago.
- Cada PC sube solo sus carpetas. Este plan es la excepción: se edita después de `git pull`.
