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

### P-04 · Dónde vive Mission Control a partir de la versión 1
- **A.** Seguir en claude.ai: página con base de datos compartida. Sin costo y sin servidores; Claude escribe en ella al final de cada ciclo.
- **B.** App propia (Next.js + Supabase en Vercel), como sugiere el brief. Más control y usuarios propios, pero con cuentas, costos y mantenimiento.

**Recomendación:** A durante el piloto (ya está construida, v0). B cuando haya clientes de la Unidad B que necesiten acceso, o si A se queda corta. B requiere aprobación de gasto.

### P-05 · Compra de la Mac mini
La M6 existe (Apple la anunció el 2026-08-25) y también la M5 Pro. **Recomendación:** comprar cuando el costo por ciclo y las cargas reales (C4) muestren que las PCs actuales se quedan cortas, o cuando haga falta una máquina siempre encendida. Comparar tres escenarios en `COST_MODEL.md`: equipo actual, Mac y nube. Precio en Colombia por verificar.

### P-06 · Presupuesto mensual
Sin definir. Se necesita para poner alertas y un stop-loss (`COST_MODEL.md`).

### P-07 · Nichos propios
**Recomendación:** curiosidades y ciencia (CurioSismo) primero; negocios e IA (Legión de Agentes) como vitrina de la Unidad B. Medicina queda fuera hasta tener revisión profesional.

### P-08 · Tercer negocio (Unidad C)
Sin definir. Espacio reservado en Mission Control.

## Tomadas

| # | Fecha | Decisión | Quién | Por qué |
|---|---|---|---|---|
| D-01 | 2026-11-19 | Los socios son Santiago y Felipe Hernández | Santiago | La v0.1 del brief nombraba por error a otra persona |
| D-02 | 2026-11-19 | Hacer lo del brief con dos familias de cuentas: clips de famosos y cuentas propias | Santiago | Pedido directo |
| D-03 | 2026-11-19 | Mission Control v0 en claude.ai, sin costo, mientras se decide P-04 | Claude (revisable) | Funciona hoy, sin gasto ni servidores |
| D-04 | 2026-11-18 | El Animador usa voz grabada por el equipo, no Higgsfield | Santiago | Costo y voz propia |
| D-05 | 2026-11-17 | YouTube con un canal por línea (Legión Urbana y Legión de Risas), con el proyecto de Google Cloud de Felipe | Santiago | Separar audiencias. Desde 2026-06-01, 100 subidas al día por proyecto |
| D-06 | 2026-11-10 | Dos líneas de contenido (urbano y risas) y espacios por PC (raíz en la de Felipe, Lalo en la de Santiago) | Santiago y Felipe | Que las dos PCs no se pisen |
| D-07 | 2026-11-10 | Los borradores de TikTok se envían sin `/publicador aprobar`; nada es público hasta publicarlo desde la app | Usuario | Agilidad. Ver P-01 |
| D-08 | desde el inicio | Solo APIs oficiales; variantes reales; no disfrazar videos ni automatizar cuentas fuera de las APIs | Santiago y Felipe | Normas de las plataformas (CLAUDE.md) |
