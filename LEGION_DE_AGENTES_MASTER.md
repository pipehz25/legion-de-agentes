# LEGIÓN DE AGENTES — MASTER BRIEF PARA CLAUDE CODE

Versión 0.2 — 19 noviembre 2026
Estado: documento de arranque; hipótesis pendientes de validación.

> **Cambios en la v0.2 (2026-11-19):** los socios son **Santiago y Felipe Hernández**. La v0.1 nombraba por error a «Agustín», que no existe. El resto del texto no cambia. La estrategia, el estado actual y el plan que salen de este brief están en `docs/` (empezar por `docs/ESTRATEGIA.md`).

## 0. Tu misión
Actúa como arquitecto de software, product manager, responsable de operaciones de IA y analista financiero. Trabaja sobre el repositorio existente sin borrar ni sobrescribir implementaciones. Primero inspecciona el código, estructura, README, configuración, scripts y flujos actuales; documenta lo encontrado. No presupongas que las funciones descritas ya están construidas. Propón y ejecuta iteraciones pequeñas, verificables, con pruebas y aprobación antes de operaciones externas, gastos o publicaciones.

## 1. Visión
LEGIÓN DE AGENTES será el sistema operativo interno compartido por Santiago y Felipe Hernández para construir, comercializar y operar varias unidades de negocio automatizadas. Debe ofrecer visibilidad diaria sobre prioridades, responsables, avances, bloqueos, presupuesto, ingresos, costos y rendimiento de agentes.

Socios operativos: Santiago y Felipe Hernández. La estructura societaria está pendiente de formalizar. No asignar participaciones ni responsabilidades legales sin confirmación.

## 2. Unidades de negocio

### Unidad A — MEDIA NETWORK / fábrica de contenido
Objetivo: construir una red de marcas/cuentas temáticas que produzcan y publiquen contenido original o contenido de terceros debidamente licenciado y transformado con aportes sustantivos. Plataformas: Instagram, TikTok, YouTube.

Flujo objetivo:
1. Brief editorial: nicho, audiencia, idioma, país, tono, objetivos, restricciones y cuentas autorizadas.
2. Cazador viral: detectar tendencias a partir de fuentes y APIs permitidas, registrar enlaces, fecha, métricas disponibles y señales de oportunidad. No raspar sitios contra sus términos.
3. Evaluador: puntuar relevancia, originalidad, demanda, riesgo de copyright, reputación, seguridad y potencial comercial.
4. Guionista: generar ángulos propios, hook, estructura, narración, CTA y fuentes verificables.
5. Productor/clipero: editar material propio o licenciado, subtítulos, voz con derechos, B-roll autorizado y formatos verticales.
6. QA editorial: comprobar hechos, licencias, audio, identidad visual, duplicación, seguridad, restricciones por plataforma y metadatos.
7. Variador: crear variaciones editoriales reales (guion, narrativa, montaje y valor añadido), no copias superficiales para saturar plataformas.
8. Programador/publicador: publicar mediante APIs oficiales o herramientas autorizadas, solo en cuentas propias o gestionadas con permiso; soportar borradores y revisión humana.
9. Analista: almacenar publicaciones, alcance, retención, reproducciones, engagement, seguidores, conversiones, ingresos y costos.
10. Optimizador: recomendar experimentos A/B y aprender sin manipular métricas ni interacciones.

Dos tipos de contenido:
- Clips de personas públicas: exigir licencia o excepción aplicable revisada; atribuir cuando corresponda. La atribución por sí sola no autoriza el uso. Evitar reuploads y contenido reutilizado sin valor original.
- Contenido propio: historia, ciencia, medicina, negocios u otros nichos. En medicina, exigir fuentes confiables, fecha, revisión editorial y prohibición de recomendaciones clínicas personalizadas sin supervisión profesional.

Meta aspiracional: administrar más de 1.000 cuentas en el largo plazo; NO objetivo operativo inmediato ni garantía de que las plataformas lo permitan. Etapas sugeridas: 3 cuentas piloto -> 10 -> 25 -> 50 -> 100 -> expansión posterior sujeta a métricas, permisos, soporte y políticas. No crear cuentas masivas automatizadas, no evadir límites, no usar proxies para eludir detección, no comprar vistas, no engagement falso.

Monetización: programas oficiales de creadores (elegibilidad variable), patrocinios, branded content declarado, acuerdos por campañas, producción como servicio, afiliados permitidos y licenciamiento de formatos propios. No asumir pagos por visualizaciones en todas las redes ni elegibilidad del contenido reutilizado.

MVP: 3 marcas/cuentas, 2 nichos, 1 flujo de producción end-to-end, calendario, cola de aprobación, publicación autorizada, métricas y tablero de costos por video.

### Unidad B — ENTERPRISE AGENTS / legiones para empresas
Objetivo: diagnosticar oportunidades y desplegar equipos de agentes con controles, trazabilidad y resultados medibles.

Flujo comercial-operativo:
1. Captación y calificación del prospecto.
2. Diagnóstico de procesos, herramientas, costos, cuellos de botella y datos disponibles.
3. Mapa de oportunidades con ROI esperado y riesgos.
4. Propuesta, alcance, entregables, SLA, seguridad y precio.
5. Diseño de agentes y responsabilidades: coordinador, ventas, atención, operaciones, finanzas, soporte, analítica, según necesidad real.
6. Integraciones con sistemas autorizados (CRM, correo, calendarios, ERP, WhatsApp, bases de datos).
7. Sandbox y pruebas de calidad, permisos, fallos, escalamiento humano y privacidad.
8. Piloto con KPI base, medición y aceptación del cliente.
9. Despliegue, monitoreo, alertas, soporte, auditoría y optimización.

Modelo comercial por validar: diagnóstico pagado, setup/implementación, mensualidad por soporte y operación, consumo variable de APIs y ampliaciones por módulos. Evitar prometer autonomía total; exigir aprobación humana para pagos, cambios sensibles, comunicaciones externas de riesgo y acceso a datos delicados.

MVP: plantilla de diagnóstico, generador de propuesta, registro de oportunidades, catálogo de agentes, plantilla de implementación, panel de estado y reporte mensual de ROI.

### Unidad C — POR DEFINIR
Crear espacio reservado en la aplicación, sin asignar presupuesto ni backlog de producción hasta que Santiago y Felipe confirmen la idea, mercado, cliente y monetización.

## 3. Aplicación central: Mission Control
Diseñar una aplicación web privada, responsive y multiusuario con:
- Inicio: resumen ejecutivo, KPIs, prioridades de hoy, tareas vencidas, riesgos, costos e ingresos.
- Portafolio: unidades A, B y C, objetivos, estado, presupuesto, hitos.
- Tareas: responsable, fecha, prioridad, esfuerzo, dependencias, criterio de aceptación, estado, evidencia y bloqueo.
- Vista diaria de Santiago y Felipe: máximo 3 prioridades críticas por persona, capacidad estimada y resultados esperados.
- Sprints semanales y roadmap trimestral.
- Agentes: nombre, función, versión, modelo, permisos, herramientas, última ejecución, costo, errores, logs y aprobación.
- Media: marcas, cuentas autorizadas, ideas, fuentes/licencias, guiones, activos, pipeline, calendario, publicación y analítica.
- Enterprise: CRM, diagnósticos, propuestas, implementaciones, clientes, contratos y soporte.
- Finanzas: presupuesto, CAPEX/OPEX, costos por ejecución, tokens, renders, almacenamiento, ingresos, margen y runway.
- Decisiones: registro de hipótesis, responsables, fecha y resultado.
- Alertas: errores de workflows, presupuestos superados, publicaciones fallidas, licencias vencidas y tareas bloqueadas.
- Seguridad: roles, secretos cifrados, auditoría, segregación por cliente, respaldos y consentimiento.

Estados de tarea: backlog, ready, in_progress, blocked, review, done, canceled.
Entidades mínimas: User, BusinessUnit, Project, Goal, Sprint, Task, Dependency, Agent, AgentRun, Integration, Budget, Expense, Revenue, Brand, SocialAccount, ContentIdea, SourceLicense, Asset, VideoVariant, PublishingJob, MetricSnapshot, Lead, Client, AuditLog.

## 4. Stack: evaluación, no imposición
- Orquestación/código: Claude Code, scripts y workers; evaluar n8n para integraciones repetitivas.
- Frontend: Next.js + TypeScript, UI responsive.
- Datos/autenticación: PostgreSQL y Auth con RLS (por ejemplo Supabase) o infraestructura equivalente.
- Cola y jobs: Redis/worker o cola gestionada, idempotencia, reintentos exponenciales y dead-letter queue.
- Video: FFmpeg local, plantillas, subtitulado, TTS y proveedores de generación audiovisual solo cuando aporten valor.
- Almacenamiento: objeto compatible S3 para medios; base de datos para metadatos.
- Observabilidad: logs estructurados, errores, trazas, costo por job, alertas.
- Publicación: integraciones oficiales verificadas por plataforma, tipo de cuenta y permisos; cuando no sea viable, exportación para publicación manual.
- Modelos: routing por tarea (económico para clasificación, potente para guion y revisión); presupuestos y límites.
- Hardware: comparar Mac de Apple Silicon disponible realmente en el mercado vs cloud GPU/CPU; no asumir que existe o está a la venta una 'MacBook CPU M6'. Verificar modelo, RAM unificada, SSD, memoria para modelos locales, concurrencia, consumo, garantía y precio colombiano antes de comprar.

## 5. Costos: crear calculadora editable
No inventar precios actuales. Crear tabla de proveedores con precio, moneda, fecha de verificación, unidad de cobro y fuente. Separar:
- CAPEX: equipo, almacenamiento local, accesorios, UPS.
- OPEX fijo: hosting, base de datos, dominio, monitoreo, herramientas de gestión.
- OPEX variable: tokens, TTS, transcripción, generación de video, render, almacenamiento, transferencia, automatizaciones y publicación.
- Costos humanos: revisión, guion, edición, ventas, soporte.
- Costo unitario/video = guion + assets + voz + edición/render + revisión + publicación + infraestructura asignada.
- Costo unitario/cliente = onboarding + integración + consumo + soporte + infraestructura asignada.
- Margen de contribución = ingresos netos - costos variables.
- Punto de equilibrio = costos fijos / margen de contribución porcentual, si el margen es positivo.

Escenarios: conservador, base y agresivo. Añadir alertas por presupuesto y stop-loss por pipeline.

## 6. Seguridad, legal y políticas
- Nunca publicar, comprar, registrar cuentas, enviar mensajes masivos ni generar gastos sin aprobación explícita y credenciales autorizadas.
- Usar APIs oficiales, respetar rate limits, términos de servicio y políticas de monetización.
- Derechos de imagen, voz, música y videos; licencias documentadas por activo.
- Cumplimiento de protección de datos aplicable en Colombia (incluida Ley 1581 de 2012) y jurisdicciones de clientes; asesoría legal antes de escalar internacionalmente.
- Evitar suplantación, deepfakes engañosos, desinformación y automatización de engagement.
- Mantener secretos fuera de Git; permisos mínimos, cifrado y rotación.
- Multi-tenant con aislamiento estricto por cliente.

## 7. Plan de 30 días (propuesta)
Semana 1: auditar repositorio y pipeline actual; definir 2 nichos, 3 cuentas, métricas base; arquitectura, modelo de datos, presupuesto y backlog.
Semana 2: construir Mission Control básico y pipeline de idea a video con QA y aprobación; medir costo y tiempo por pieza.
Semana 3: integrar publicación permitida o exportación manual; analítica; construir diagnóstico empresarial y propuesta comercial.
Semana 4: ejecutar pilotos reales, comparar KPIs, corregir cuellos de botella, documentar SOPs y decidir si escalar a 10 cuentas y primer cliente Enterprise.

Indicadores Media: videos publicados, costo/video, tiempo de producción, retención, vistas válidas, seguidores netos, ingresos/1.000 vistas cuando aplique, tasa de aprobación, incidencias de copyright.
Indicadores Enterprise: diagnósticos, propuestas, conversión, setup, MRR, margen, horas ahorradas verificadas, SLA, incidentes y satisfacción.
Indicadores globales: cash burn, runway, tareas terminadas/semana, lead time, fallos de agentes y costo por resultado.

## 8. Reglas de ejecución para Claude Code
1. Lee el repositorio actual y produce `docs/AS_IS.md` con lo existente, dependencias, riesgos y deuda técnica.
2. Crea `docs/ARCHITECTURE.md`, `docs/ROADMAP.md`, `docs/COST_MODEL.md`, `docs/DECISIONS.md` y `docs/OPEN_QUESTIONS.md`.
3. Presenta primero una arquitectura mínima y backlog priorizado con criterios de aceptación. Reutiliza lo que ya funcione.
4. Antes de cambios destructivos, integraciones externas, uso de credenciales, publicación o gasto, pide autorización.
5. Implementa vertical slices funcionales, no maquetas desconectadas: auth -> tareas -> pipeline -> QA -> aprobación -> métricas.
6. Añade pruebas, migraciones reversibles, README, variables `.env.example` sin secretos y comandos reproducibles.
7. Registra métricas y costos reales; señala toda cifra estimada.
8. Cada cierre de sesión entrega: completado, pruebas, pendientes, bloqueos, gasto y 3 siguientes acciones para Santiago y Felipe.
9. No declares completada una funcionalidad sin pruebas y evidencia.
10. Empieza preguntando solo los bloqueos indispensables tras la auditoría; no detengas el trabajo de documentación por preguntas no críticas.

## 9. Primera orden de trabajo
**Audita el repositorio y el proyecto existente del cazador viral, clipero y publicador.** Dime qué funciona realmente, qué falta, cómo lo conectarías con Mission Control y cuál es el primer vertical slice que puedes construir hoy. Entrega un plan de ejecución con tareas separadas para Santiago, Felipe y Claude Code, estimaciones y riesgos. No publiques contenido ni generes costos sin autorización.

## 10. Preguntas abiertas
- ¿Qué es exactamente el tercer negocio?
- ¿Quién es dueño de cada proyecto?
- ¿Qué repositorios y herramientas están ya operativos?
- ¿Presupuesto mensual y presupuesto de hardware?
- ¿Cuáles son los 2 primeros nichos y las 3 cuentas piloto?
- ¿Qué cuentas tienen acceso a APIs oficiales y permisos de publicación?
- ¿Qué porcentaje de contenido será propio, licenciado o de terceros?
- ¿Qué mercados, idiomas y clientes empresariales se priorizarán?

## 11. Resumen ejecutivo y decisiones estratégicas para los fundadores

LEGIÓN DE AGENTES no es simplemente un conjunto de automatizaciones: es una empresa y plataforma operativa de infraestructura de inteligencia artificial con varias unidades de negocio. El sistema central debe permitir desarrollar, operar, supervisar y escalar proyectos impulsados por agentes, con responsabilidades claras para Santiago y Felipe.

**Unidad 01 — Media Network:** investigar tendencias, producir videos originales o usar materiales con derechos adecuados, generar variaciones genuinas, gestionar marcas y cuentas autorizadas, y distribuir a Instagram, TikTok y YouTube. Posibles ingresos: monetización de plataformas cuando se cumplan requisitos, patrocinios, acuerdos comerciales y producción de contenido para clientes. No suponer que las visualizaciones generan pagos automáticamente.

**Unidad 02 — Enterprise Agents:** analizar procesos de empresas, identificar oportunidades de automatización, diseñar legiones de agentes internos por función, integrar sistemas y monitorear calidad, costos y retorno. Ingresos: diagnóstico, implementación, mantenimiento y contratos recurrentes.

**Unidad 03 — Por definir:** conservar espacio en Mission Control para el tercer negocio sin asignarle un alcance inventado.

### 11.1 Estrategia de crecimiento de cuentas

No iniciar con 1.000 cuentas simultáneamente. Validar primero un piloto pequeño y medible, después avanzar por hitos: 3 cuentas de prueba -> 10 cuentas con operaciones estables -> 50 -> 100 -> hasta 1.000 únicamente si hay rentabilidad, capacidad operativa y cumplimiento de reglas de cada plataforma. La cifra 1.000 es una ambición de largo plazo, no una instrucción para crear cuentas masivamente ni eludir restricciones.

### 11.2 Principio de ingeniería

El activo inicial más importante es un **motor de producción repetible y rentable**, no la cantidad de cuentas. Validar costo por video, retención, distribución, crecimiento, ingresos reales y tasa de errores antes de multiplicar el sistema. Reutilizar el cazador viral, el clipero y el publicador existentes; no reconstruir componentes funcionales.

### 11.3 Evaluación de hardware Apple

No comprar una máquina Apple con supuesto chip M6 sin verificar primero la existencia, disponibilidad y especificaciones exactas del modelo elegido. Auditar cargas de trabajo, concurrencia, memoria unificada, almacenamiento, codificación de video, modelos locales, consumo eléctrico y costo total frente a una arquitectura híbrida local/nube. Preparar tres escenarios: equipo actual, equipo Apple por cotizar y nube/híbrido. La compra requiere justificación técnica y financiera.

## 12. Instrucción lista para pegar en Claude Code

> Lee completamente el archivo `LEGION_DE_AGENTES_MASTER.md`. Audita primero todo lo que ya tenemos construido, especialmente el cazador viral, el clipero y el publicador.
>
> Actúa como arquitecto principal del proyecto. Diseña la aplicación Mission Control para Santiago y Felipe, organiza las tareas por prioridad y prepara la implementación progresiva de los dos modelos de negocio.
>
> No reconstruyas lo que ya funciona. Comienza por identificar el estado actual, las brechas técnicas, los costos y el primer módulo que podemos poner en producción.
>
> Antes de realizar publicaciones, contratar servicios, usar credenciales o incurrir en gastos, solicita aprobación. Separa claramente hechos comprobados, hipótesis y propuestas. Crea un plan de trabajo diario visible para ambos fundadores y termina con tareas concretas, responsables, entregables y criterios de aceptación.

## 13. Cómo usar este documento

1. Guardar este `.md` en la raíz de la carpeta o repositorio `Legión de Agentes`.
2. Abrir Claude Code dentro de esa carpeta.
3. Pegar el texto de la sección 12 como instrucción inicial.
4. Pedirle que inspeccione el código real antes de proponer migraciones o nuevos módulos.
5. Revisar juntos el informe de auditoría, el presupuesto y el backlog antes de autorizar despliegues.

## 14. Pregunta crítica para decidir el siguiente paso

¿El cazador viral, el clipero y el publicador ya funcionan de principio a fin en Claude Code o todavía están en desarrollo? La respuesta determina si la primera semana se dedica a integración y observabilidad o a terminar el pipeline mínimo.
