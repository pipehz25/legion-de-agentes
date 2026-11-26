# Decisiones

Registro de decisiones e hipótesis. Cada una dice qué se decidió, quién, cuándo y por qué. Las **pendientes** llevan las opciones y la recomendación de Claude; las deciden Santiago y Felipe. Se reflejan también en la pestaña *Decisiones* de Mission Control.

## Pendientes

### P-01 · Qué hacer con los clips `sin_verificar` mientras se consiguen permisos
198 de los 202 clips de la raíz son de terceros sin permiso (`ESTRATEGIA.md` §2).
- **A.** Seguir como hoy: borradores automáticos a TikTok y publicación a mano.
- **B.** Solo con aprobación manual, clip por clip, sin cuentas nuevas sobre ese contenido. Las cuentas que crecen usan solo `autorizado` o `propio`.
- **C.** Pausar todo lo `sin_verificar` hasta tener licencias.

**Recomendación: B.** Mantiene viva la audiencia de Legión Urbana mientras se piden los permisos y no multiplica el riesgo. Cambio técnico: quitar `aprobacion_automatica_borradores` para lo `sin_verificar` (hoy va solo a la bandeja de TikTok).

### P-02 · Las 3 marcas del piloto
**Recomendación:** Lalo Ocampo (`autorizado`), Legión Urbana (camino a `autorizado`) y CurioSismo (`propio`). Son 2 nichos: música urbana y curiosidades (`ESTRATEGIA.md` §3).

### P-03 · Qué pasa durante el piloto con Legión de Risas, GTA y las 14 cuentas extra de Lalo
**Recomendación:**
- **Risas:** sigue, pero con aprobación manual y sin cuentas nuevas.
- **GTA:** experimento con fecha de vencimiento; solo contenido con derechos claros.
- **14 cuentas de Lalo:** pasan a la etapa 2 cuando `lalo-music` cumpla los criterios de crecimiento.

### P-04 · Dónde vive Mission Control a partir de la versión 1 (tomada: D-10, Vercel)
- **A.** Seguir en claude.ai: página con base de datos compartida. Sin costo y sin servidores; Claude escribe en ella al final de cada ciclo.
- **B.** App propia (Next.js + Supabase en Vercel), como sugiere el brief. Más control y usuarios propios, pero con cuentas, costos y mantenimiento.

**Recomendación:** A durante el piloto (ya está construida, v0). B cuando haya clientes de la Unidad B que necesiten acceso, o si A se queda corta. B requiere aprobación de gasto.

### P-05 · Compra de la Mac mini (tomada: D-11, M6 de 1 TB)
La M6 existe (Apple la anunció el 2026-08-25) y también la M5 Pro. **Recomendación:** comprar cuando el costo por ciclo y las cargas reales (C4) muestren que las PCs actuales se quedan cortas, o cuando haga falta una máquina siempre encendida. Comparar tres escenarios en `COST_MODEL.md`: equipo actual, Mac y nube. Precio en Colombia por verificar.

### P-12 · Categorías de la ola 1 en YouTube (español)
1. Historia (estilo archivo).
2. Historia de la medicina (estilo laboratorio).
3. Dinero e historia económica (estilo pizarra).
4. Curiosidades, ciencia y misterios: CurioSismo, que ya existe.

Ola 2, cuando la ola 1 tenga datos: hogar y trucos (paga bien, pero necesita dibujos nuevos), inglés para el canal que mejor rinda, y alemán.

**Recomendación:** aprobar la ola 1 tal cual, con 1 canal por categoría.
- Son las 4 categorías que el Narrador ya produce con sus 3 estilos.
- Ninguna da consejos riesgosos.
- Dinero es la que más paga y CurioSismo ya tiene audiencia.

Se mide 4 semanas y se crece a 3, 10, 25 y 50 canales por categoría según la retención. Las opciones de nombre y los pasos para crear los canales están en Mission Control (pestaña Cuentas y tarea F10).

### P-09 · Cuentas de TikTok en EE. UU.
El programa de recompensas de TikTok no está en Colombia (ESTRATEGIA §9).
- **A.** Una persona o empresa con presencia real en EE. UU. maneja y cobra esas cuentas.
- **B.** En TikTok solo se gana con publicidad de marcas y afiliados desde Colombia, y las vistas se monetizan en YouTube.

**Recomendación:** B mientras no haya presencia real. Falsear la ubicación (VPN, datos de otra persona) lleva al bloqueo y lo prohíbe el brief.

### P-10 · Voz de IA de pago para escalar e ir a otros idiomas
Los videos largos y los canales en inglés o alemán no se pueden grabar a mano.

**Recomendación:** probar una voz de pago con 2 o 3 videos, medir costo por video (`COST_MODEL.md`) y decidir con datos. Salud, siempre sin consejos.

### P-11 · Vender canales monetizados
Es posible por transferencia de la cuenta de marca, pero la monetización no pasa sola y AdSense no se transfiere.

**Recomendación:** planearlo cuando haya canales monetizados y revisar antes los términos y la parte tributaria.

### P-06 · Presupuesto mensual
Sin definir. Se necesita para poner alertas y un stop-loss (`COST_MODEL.md`).

### P-07 · Nichos propios
**Recomendación:** curiosidades y ciencia (CurioSismo) primero; negocios e IA (Legión de Agentes) como vitrina de la Unidad B. Medicina queda fuera hasta tener revisión profesional.

### P-08 · Tercer negocio (Unidad C)
Sin definir. Espacio reservado en Mission Control.

## Tomadas

| # | Fecha | Decisión | Quién | Por qué |
|---|---|---|---|---|
| D-15 | 2026-11-24 | Formato estándar de los largos: 6 a 7 min (máx. 5.800 caracteres), voz ElevenLabs Flash (`eleven_flash_v2_5`), guion y escenas con Sonnet, momentos interactivos (preguntas, adivina, mito o realidad, cifra revelada, repaso, pregunta para comentar) y paleta propia por video. El turno puede correr en varias PCs apartando el tema antes de empezar | Santiago | Bajar el costo hacia 1 USD por video (de ~3,8 a ~1,5) y subir la retención. Probado en Buriticá, Gran Colombia y Policarpa |
| D-14 | 2026-11-20 | Videos largos de YouTube (8 a 10 min) horizontales con escenas diseñadas y animadas con código, voz de ElevenLabs (voz «Jose»), producción diaria con `/turno-narrador`. Reemplaza, solo para los largos, la voz grabada de D-04; avanza P-10 | Santiago | El estilo con diseño es el que funciona; grabar la voz a mano no escala. Primer video: Panamá (9:27) |
| D-11 | 2026-11-19 | Se compra una Mac mini M6 de 1 TB para producir todo el día; la gestiona Felipe. Cierra P-05 | Santiago y Felipe (reunión) | Producir videos sin depender de las PCs de trabajo |
| D-12 | 2026-11-19 | CurioSismo es un canal de Felipe (hecho con CODE ART de Viani Pro). Responde Q-08 | Felipe (reunión) | — |
| D-13 | 2026-11-19 | Contenido propio en YouTube primero, con «legiones de cuentas» por nicho (meta: hasta 50 por nicho), creciendo por etapas según retención. Felipe crea las cuentas de YouTube y de TikTok | Santiago y Felipe (reunión) | YouTube monetiza desde Colombia; TikTok no (ESTRATEGIA §9) |
| D-10 | 2026-11-19 | Mission Control pasa a una app propia en Vercel (Next.js + Postgres de Neon, ambos en plan gratis), con usuario y contraseña: https://legion-mission-control.vercel.app. Cierra P-04. Revisar si el uso comercial exige el plan Pro de Vercel | Santiago | Pedido directo: más sencilla, interactiva y en Vercel |
| D-09 | 2026-11-19 | Roles. **Santiago:** programación y conexiones (APIs, apps de desarrollador, autorizaciones, Mission Control, hardware) y el espacio de Lalo. **Felipe:** crea y gestiona las cuentas (perfiles, identidad, operación diaria de la raíz, bandeja de TikTok y permisos con los creadores). Si una tarea mezcla las dos cosas, Felipe crea la cuenta y Santiago la conecta | Santiago | Pedido directo |
| D-01 | 2026-11-19 | Los socios son Santiago y Felipe Hernández | Santiago | La v0.1 del brief nombraba por error a otra persona |
| D-02 | 2026-11-19 | Hacer lo del brief con dos familias de cuentas: clips de famosos y cuentas propias | Santiago | Pedido directo |
| D-03 | 2026-11-19 | Mission Control v0 en claude.ai, sin costo, mientras se decide P-04 | Claude (revisable) | Funciona hoy, sin gasto ni servidores |
| D-04 | 2026-11-18 | El Animador usa voz grabada por el equipo, no Higgsfield | Santiago | Costo y voz propia |
| D-05 | 2026-11-17 | YouTube con un canal por línea (Legión Urbana y Legión de Risas), con el proyecto de Google Cloud de Felipe | Santiago | Separar audiencias. Desde 2026-06-01, 100 subidas al día por proyecto |
| D-06 | 2026-11-10 | Dos líneas de contenido (urbano y risas) y espacios por PC (raíz en la de Felipe, Lalo en la de Santiago) | Santiago y Felipe | Que las dos PCs no se pisen |
| D-07 | 2026-11-10 | Los borradores de TikTok se envían sin `/publicador aprobar`; nada es público hasta publicarlo desde la app | Usuario | Agilidad. Ver P-01 |
| D-08 | desde el inicio | Solo APIs oficiales; variantes reales; no disfrazar videos ni automatizar cuentas fuera de las APIs | Santiago y Felipe | Normas de las plataformas (CLAUDE.md) |
