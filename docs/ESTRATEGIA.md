# Estrategia de la Legión

Versión 1 · 2026-11-19 · Para Santiago y Felipe Hernández. Sale de `LEGION_DE_AGENTES_MASTER.md` y del estado real del repositorio (`docs/AS_IS.md`). Las cifras marcadas «hipótesis» se confirman o se corrigen al cierre del piloto.

## 1. Dónde estamos (datos del 2026-11-19)

| | Hoy |
|---|---|
| Cadena de clips | Funciona de punta a punta **solo en TikTok**, y con un paso humano: el video llega como borrador y alguien lo publica desde la app |
| Clips producidos | 202 en la raíz (153 urbano, 49 risas), 15 de Lalo y 30 de CurioSismo (propios, sin registrar todavía) |
| Publicados de verdad | 22: 18 de la raíz y 4 de Lalo. Otros 44 esperan en la bandeja de TikTok |
| Derechos | **198 de los 202 clips de la raíz están `sin_verificar`**. Los de Lalo son `autorizado` y los de CurioSismo, `propio` |
| De quién son los clips | Westcol 58 (29 %), Samulx 19, Momentos de la Mente 18, juan diego mm 11, La Cotorrisa 15 (sumando a Ricardo Pérez y a Slobotzky). Estos cinco suman el 60 % |
| Métricas | Casi ninguna: las vistas de TikTok están apagadas y YouTube no está conectado |
| Contenido propio | Canal CurioSismo (YouTube, 4 videos largos), Animador (7 videos de venta hechos, 3 esperando voz) y kit de lanzamiento de Instagram de la Legión |
| Unidad B (empresas) | Solo los videos de venta del Animador. Sin diagnóstico, sin propuesta y sin clientes |
| Costos | No se miden. El 2026-11-18 el ciclo de Felipe se cortó por el límite de uso de Claude |

**Conclusión:** el motor de producción existe. Faltan **derechos, métricas y foco**. La primera semana va a integración y observabilidad, no a construir piezas nuevas (§14 del brief).

## 2. Las dos familias de cuentas

### A1 · Cuentas de clips de famosos (contenido de terceros)

**Qué son:** cuentas que cortan momentos de streamers, artistas, humoristas y podcasts. Hoy son Legión Urbana (TikTok `principal`), Legión de Risas (TikTok `risas`), Lalo Ocampo (`lalo-music` y 14 cuentas más declaradas) y GTA (EE. UU., en preparación).

**El problema:** el brief lo dice claro: *la atribución por sí sola no autoriza el uso*. Un clip resubido con subtítulos y crédito, sin permiso:
- puede recibir reclamos de Content ID (los ingresos pasan al dueño), bloqueos o avisos que tumban la cuenta;
- no suele ser elegible para los programas de pago de las plataformas, que piden contenido original. Por eso **las vistas de estas cuentas no se convierten solas en dinero**.

**Cómo se hace bien: la escalera de derechos.** Cada fuente queda en uno de tres niveles:

| Nivel | Qué es | Cómo se publica |
|---|---|---|
| `autorizado` | Permiso escrito del titular o de su equipo (como Lalo), o un programa oficial de clippers del creador | Puede ir en automático y escalar a más cuentas |
| `transformado` (nuevo) | Fragmento corto dentro de una pieza con aporte propio sustancial: comentario, análisis, contexto o recopilación con narración nuestra. Necesita revisión editorial y, antes de escalar, asesoría legal | Solo con aprobación manual |
| `sin_verificar` | Resubida con subtítulos y crédito | No escala. Mientras se consiguen permisos, ver la decisión P-01 en `DECISIONS.md` |

**Plan de permisos (30 días):**
1. Escribir a los cinco creadores que suman el 60 % de los clips (Westcol, Samulx, Momentos de la Mente, juan diego mm y La Cotorrisa), con una plantilla que ofrezca algo a cambio: crédito, enlace, más alcance y reportes de vistas.
2. Buscar si alguno ya tiene **programa de clippers**. Varios creadores pagan a clippers por vistas, y ese es el negocio legítimo detrás de cuentas como estas (lo que vende Butter).
3. Llevar un **registro de licencias** (fuente, titular, tipo de permiso, evidencia, vigencia). El Clipero prioriza las fuentes autorizadas y el Publicador solo pone en automático lo `autorizado` o `propio`.

**Cómo ganan dinero (hipótesis):** campañas de clipping pagadas por creadores o marcas, acuerdos con los artistas (como Lalo), patrocinios y audiencia para empujar las marcas propias. No se cuenta con el pago de las plataformas por vistas.

### A2 · Cuentas propias (contenido 100 % nuestro)

**Qué son:** marcas cuyo contenido es nuestro de punta a punta: guion, voz, edición y material. No dependen de permisos y sí pueden entrar a los programas de creadores.

**Lo que ya existe:**
- **CurioSismo:** canal propio de YouTube con 4 videos largos (Antártida, sistema solar, cables de internet, apagón). El Clipero ya cortó 30 clips con derechos `propio` y su ficha de verificación de hechos (`curiosismo/indice.md`). Falta registrarlos para que el Publicador los vea, y conectar dónde se publican.
- **Animador:** motor de videos animados con voz grabada por el equipo. Hoy hace videos de venta de la Legión; con plantillas nuevas puede hacer explicadores para nichos propios.
- **Legión de Agentes en Instagram:** kit de lanzamiento listo (`salidas/animador/instagram/`). Es la vitrina de la Unidad B.

**Nichos propios recomendados:**
1. **Curiosidades y ciencia** (CurioSismo). Ya hay material, el formato de clips funciona y el riesgo es bajo si se cuidan los hechos.
2. **Negocios e IA para empresas** (Legión de Agentes). Alimenta la Unidad B: cada video atrae prospectos.
3. Más adelante, historia. **Medicina, no por ahora:** exige revisión profesional (brief §2).

**Cadena del contenido propio:** tema → guion con fuentes (Claude) → voz grabada (persona) → video (Animador, o cortes de un video largo propio con el Clipero) → QA de hechos → Publicador → métricas. Las piezas existen; falta unirlas para un nicho propio (tarea C7 del roadmap).

## 3. El piloto de 30 días: 3 marcas, 2 nichos (MVP del brief)

| Marca | Familia | Nicho | Por qué | Estado |
|---|---|---|---|---|
| **Lalo Ocampo** (`lalo-music`, TikTok) | A1, `autorizado` | Música urbana | Ya publica, con permiso del artista: es el modelo de clips bien hecho | Activa |
| **Legión Urbana** (TikTok `principal` + YouTube) | A1, camino a `autorizado` | Música urbana y streamers | Es la cuenta con más volumen. El piloto prueba si se consiguen los permisos de Westcol y compañía | Activa en TikTok; YouTube por conectar |
| **CurioSismo** (YouTube Shorts + la red que se defina) | A2, `propio` | Curiosidades y ciencia | Contenido 100 % nuestro, con 30 clips listos | Por conectar |

**Fuera del piloto mientras dura** (ver P-03):
- **Legión de Risas:** sigue publicando solo con aprobación manual y no se le añaden cuentas. Su contenido es de humoristas y de sátira política, todo `sin_verificar`.
- **Las 14 cuentas extra de Lalo:** pasan a la etapa 2 (10 cuentas) cuando `lalo-music` cumpla los criterios de la §4.
- **GTA:** experimento con fecha de vencimiento por el lanzamiento (2026-11-19). Se publica solo lo que tenga derechos claros; el material de Rockstar no lo es.
- **Instagram y Facebook:** después de YouTube.

## 4. Escalera de crecimiento: 3 → 10 → 25 → 50 → 100

Una etapa se pasa solo si se cumple todo esto durante 4 semanas seguidas. Los umbrales numéricos se fijan con la línea base del piloto; hoy no hay datos para fijarlos sin inventar.

1. **Derechos:** 100 % de lo publicado en las cuentas que crecen es `autorizado` o `propio`, sin avisos ni reclamos.
2. **Constancia:** cada cuenta publica lo planeado sin fallos del pipeline.
3. **Costo conocido:** costo y tiempo por video medidos (`COST_MODEL.md`).
4. **Tendencia:** la mediana de vistas y la retención por cuenta suben frente a la línea base.
5. **Capacidad:** las aprobaciones humanas caben en el tiempo de Santiago y Felipe.

Las cuentas nuevas se crean a mano, una por una, con su línea clara. Nada de crear cuentas en masa, proxies, compra de vistas ni engagement falso (brief §2 y CLAUDE.md).

## 5. Unidad B · Enterprise Agents

**Activos:** los videos de venta por tipo de negocio (7 hechos: restaurante, consultorio, inmobiliaria, tienda, gimnasio, salón y el general; 3 esperando voz: veterinaria, taller y hotel) y el kit de Instagram.

**Camino al primer cliente:**
1. Vitrina: Instagram de la Legión con los videos del Animador (contenido propio, nicho negocios e IA).
2. Diagnóstico: plantilla de preguntas, mapa de procesos y ROI esperado (C9).
3. Propuesta: generador con alcance, entregables, precio y SLA (C9).
4. Catálogo de agentes por tipo de negocio, a partir de los 17 temas del Animador (C10).
5. Piloto con un negocio, con KPI base, aprobación humana para todo lo sensible y agentes en la nube (`/schedule`), sin depender de ninguna PC.

## 6. Unidad C

Reservada en Mission Control, sin presupuesto ni tareas, hasta que Santiago y Felipe definan idea, mercado, cliente y forma de cobrar.

## 7. Indicadores y dónde se ven

Todo se ve en **Mission Control** (`docs/ARCHITECTURE.md`):
- **Media:** videos publicados, costo y tiempo por video, vistas, retención, seguidores netos, tasa de aprobación e incidencias de derechos.
- **Enterprise:** diagnósticos, propuestas, conversión, MRR y horas ahorradas verificadas.
- **Global:** tareas terminadas por semana, fallos de agentes, gasto y costo por resultado.

Hoy solo se puede medir producción (clips, publicaciones, derechos). Vistas y costos llegan con las tareas F3, C4 y C6 del roadmap.

## 8. Riesgos principales

| Riesgo | Qué tan grave | Respuesta |
|---|---|---|
| Clips sin licencia (98 % de la raíz) | Alto: pueden caer cuentas y no monetizan | Escalera de derechos y plan de permisos (§2) |
| El Publicador no revisa los derechos en el código; los borradores salen sean cuales sean | Alto | Tarea C8: la regla va en el script, no solo en el prompt |
| Sin métricas | Alto: no se puede decidir qué escalar | Vistas de TikTok, YouTube y panel (F1, F3, C6) |
| Límite de uso de Claude | Medio: corta ciclos a mitad | Medir el consumo por ciclo y repartir la carga (C4) |
| Políticas de contenido reutilizado | Medio | Variantes reales; crecer con contenido propio |
| Dependencia de dos PCs encendidas | Medio | Rutinas en la nube para lo que no necesita videos; máquina dedicada cuando se justifique |
| Sátira política (Risas) | Medio: reputación | Aprobación manual y no escalar |
