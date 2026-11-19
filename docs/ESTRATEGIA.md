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

## 9. Legiones de cuentas (reunión de Santiago y Felipe, 2026-11-19)

### Lo que se planteó

- **Tres modelos de negocio:**
  1. Agencia de agentes (Unidad B).
  2. **Negocios propios: «legiones de cuentas»** por nicho, con clips de tendencias y contenido propio, para generar vistas y monetizar (Unidad A).
  3. Por definir.
- **Meta de Felipe:** hasta 50 cuentas por nicho. Abrir muchos canales de YouTube, monetizar más o menos 1 de cada 10, quedarse con los mejores y vender el resto. Un canal monetizado se vende por unas 10 a 15 veces lo que gana al mes; la referencia que dio fue un canal de hogar de 16.000 suscriptores que gana unos 700 USD al mes y se ofrecía en 8.000 USD.
- **Nicho e idioma pagan distinto** (RPM, lo que se gana por cada mil vistas):
  - finanzas, salud y fitness, mecánica y hogar pagan más; los canales para niños, poco;
  - inglés (EE. UU.) y alemán pagan más que español.
  - Felipe ya tiene 4 o 5 canales, uno de ellos en alemán, y CurioSismo es suyo.
- **Retención en videos largos:** en los canales que funcionan, el primer minuto va animado; después, imágenes y texto con voz en off.
- **Equipo:** una Mac mini M6 de 1 TB prendida todo el día para producir sin parar; la gestiona Felipe. Además, optimizar cuánto Claude se gasta por ciclo.

### Cómo se monetiza en cada red (datos verificados el 2026-11-19)

| Red | Cómo se gana | Condición |
|---|---|---|
| **YouTube** | Anuncios (Programa de socios), afiliados en la descripción, venta de canales monetizados | 1.000 suscriptores **y** 4.000 horas de videos largos en 12 meses, **o** 10 millones de vistas de Shorts en 90 días. Hay un nivel de entrada desde 500 suscriptores. **Colombia está en la lista de países.** La monetización no pasa sola al comprador de un canal y la cuenta de AdSense no se transfiere |
| **TikTok** | Programa de recompensas (vistas), publicidad de marcas, afiliados, TikTok Shop | El programa de recompensas **no está en Colombia**: pide residencia real en un país elegible, 10.000 seguidores, 100.000 vistas en 30 días y videos de 60 s o más. Una VPN o cambiar el idioma no sirve. TikTok Shop tampoco está en Colombia |
| **Instagram** | Publicidad de marcas en la red de cuentas, productos digitales propios o de afiliados, tráfico hacia YouTube y TikTok | No paga por vistas |

### Qué cambia en el plan

1. **YouTube primero, con videos largos.** Las 4.000 horas solo cuentan en videos largos; los Shorts van por la vía de 10 millones de vistas, que es mucho más difícil. El Narrador hoy hace Shorts de 45 a 60 s, así que necesita un **modo largo** de 8 a 15 minutos: primer minuto animado y después ilustraciones, texto y voz. Los Shorts quedan como avance de cada video largo (tarea C16).
2. **La voz es el cuello de botella.** Un video de 10 minutos son 10 minutos de grabación, y los canales en inglés o alemán no los pueden grabar ustedes. Para escalar hace falta **voz de IA de pago** (decisión P-10, con presupuesto). YouTube permite voz de IA, pero desmonetiza los personajes de IA que dan consejos en temas sensibles: en salud, nada de consejos con voz de IA.
3. **Muchos canales, pero distintos y por etapas.** Desde julio de 2026, YouTube desmonetiza canales enteros por contenido genérico, repetido o de plantilla, y lo evalúa canal por canal. Cada canal necesita su propia línea, su estilo y su valor; no puede ser el mismo video con otro nombre.
   - **Cupo:** con 100 subidas al día por proyecto, 300 canales con un video largo a la semana son unas 43 subidas al día, así que cabe en el cupo. Lo que limita es producir: voz, render y revisión.
   - **Etapas:** se crece por etapas (3 → 10 → 25 → 50 por nicho) cuando un formato demuestra retención. Al principio se pueden medir los primeros canales con 2 o 3 videos largos a la semana cada uno.
4. **TikTok en EE. UU. solo con presencia real.** Las cuentas «creadas en EE. UU.» solo sirven para el programa de recompensas si una persona o empresa que de verdad está allá las maneja y cobra. Falsear la ubicación lleva al bloqueo y a perder lo ganado, y además lo prohíbe el brief (P-09).
5. **Vender canales es posible, pero se planea aparte.** Se hace por la propiedad de la cuenta de marca (7 días de espera), el comprador tiene que volver a cumplir el Programa de socios y AdSense no se transfiere. Se revisan los términos antes de hacer el primero (P-11).
### Datos de la segunda reunión (mismo día)

- **El canal que Felipe está replicando:** unos 25.000 suscriptores y videos de 450.000 a 1,8 millones de vistas; su primer video, de hace un mes, tiene unas 833.000. Lo que importa es la relación entre vistas y suscriptores: así se reconocen los formatos que están explotando.
- **«Red y no anzuelo»:** Felipe propone abrir muchos canales (300 en YouTube y 300 en Instagram) para aumentar la probabilidad de pegar.
- **Costos y tiempos de hoy, con la herramienta de Felipe (CODE ART de Viani Pro):**
  - cada video largo (12 a 22 minutos) cuesta unos **4 USD**;
  - tarda de **1,5 a 2 horas** en producirse y otros **40 minutos en subirse a mano**;
  - 7 videos en paralelo tardaron más de 12 horas en un Core i7.
  - Los Shorts de Felipe rinden mejor que sus videos largos (1.200 a 1.800 vistas frente a pocas).
- **Cuentas de Felipe:** su cálculo es 6 nichos × 2 videos al día = 12 videos al día, unos 50 USD al día y unos 1.500 USD al mes solo en YouTube. Quiere bajar ese costo aprovechando lo que ya pagan (Claude Pro, ChatGPT Pro, la Mac mini y un MacBook) y repartir el trabajo: una cuenta de Claude para YouTube, otra para Instagram y otra para TikTok.
- **Idioma:** YouTube muestra cada video a quien habla ese idioma, así que un canal hecho desde Colombia puede crecer en Alemania.
- **Nicho que ya tienen:** curiosidades (ciencia, misterios y datos raros), con CurioSismo. Felipe mide sus canales con VidIQ.

**Lo que hay que corregir en esos números:**
- **12 videos al día no alcanzan para 300 canales,** salvo que el mismo video se suba en muchos canales, y eso YouTube lo trata como spam y contenido repetido: puede desmonetizar o cerrar todos los canales relacionados. Cada canal necesita sus propios videos.
- **Las cuentas reales:** 300 canales con 2 o 3 videos a la semana cada uno son de 85 a 130 videos al día. Eso está por encima del cupo de 100 subidas diarias por proyecto y de lo que se puede producir hoy. Por eso se crece por etapas, y el cupo se amplía con la auditoría de YouTube cuando haga falta.

**Cómo bajar el costo y el tiempo con lo que ya tiene la Legión:**
1. **Render rápido:** el primer minuto animado con HyperFrames y el resto armado con ffmpeg a partir de ilustraciones fijas con movimiento suave y subtítulos. Es mucho más rápido que animar 15 minutos (C16).
2. **Voz local gratis primero:** probar voces locales en la Mac (sin costo por video) en español, inglés y alemán contra una voz de pago, y quedarse con la de pago solo donde la diferencia lo justifique (P-10).
3. **Subida automática:** los 40 minutos por video desaparecen, porque el Publicador sube por la API de YouTube.
4. **Encontrar formatos que explotan:** que el Cazador busque, por nicho, canales con muchas más vistas que suscriptores (como el que replica Felipe) y extraiga el formato, nunca el contenido (C19).

6. **Unidad B: primer prospecto.** Una distribuidora con vendedores en todo el país cuya información de clientes vive en los vendedores. Necesita un CRM conectado a los asesores y agentes que lo mantengan al día, sin saltarse a los vendedores (tarea T6).
