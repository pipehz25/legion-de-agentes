# Modelo de costos

Versión 1 · 2026-11-19. **Regla:** aquí no hay precios inventados. Cada precio lleva fecha y fuente; lo que no se ha verificado dice «por verificar». Lo que no se mide todavía, también se dice.

## 1. Qué se mide hoy

Nada de dinero ni de consumo. La única señal es que el 2026-11-18 el ciclo de la PC de Felipe se cortó por el **límite de uso de Claude**: hoy el recurso que más limita es la capacidad de Claude, no el dinero. La tarea **C4** del roadmap empieza a medir.

## 2. Proveedores

| Concepto | Tipo | Precio | Unidad | Verificado | Fuente |
|---|---|---|---|---|---|
| Claude (plan de cada PC) | OPEX fijo; capacidad variable | Por verificar | Mes por usuario | — | Cuenta de cada socio |
| YouTube Data API | OPEX variable | Sin tarifa publicada; el límite es de cupo | 100 subidas al día por proyecto | 2026-11-17 | developers.google.com/youtube/v3/determine_quota_cost |
| TikTok Content Posting API | OPEX variable | Sin tarifa publicada (por confirmar en sus términos) | 5 borradores pendientes cada 24 h por cuenta | 2026-10-29 | `legion/03-publicador/plataformas.md` §4 |
| Instagram API (Meta) | OPEX variable | Sin tarifa publicada (por confirmar) | Unas 50 publicaciones cada 24 h por cuenta | — | `plataformas.md` §5 |
| yt-dlp, ffmpeg, deno, whisper.cpp | Software libre | 0 | — | — | `herramientas/instalar.ps1` |
| Voz de los videos | Costo humano | Tiempo del equipo | Minutos por video | 2026-11-18 | D-04: voz grabada, sin Higgsfield |
| GitHub (repositorio) | OPEX fijo | Por verificar | Mes | — | Cuenta de Felipe |
| Electricidad de las PCs | OPEX fijo | Por verificar | kWh | — | — |
| Mac mini M6, 32 GB / 1 TB | CAPEX (candidato) | 1.799 USD en la tienda de EE. UU.; en Colombia, por verificar | Equipo | 2026-11-18 | Captura de la tienda de Apple que mandó Santiago |
| Mac mini M5 Pro, 24 GB / 512 GB | CAPEX (candidato) | 1.699 USD en la tienda de EE. UU.; en Colombia, por verificar | Equipo | 2026-11-18 | Misma captura |
| Mac mini M6 básica, 16 GB / 256 GB | CAPEX (candidato) | 899 USD en EE. UU. | Equipo | 2026-11-17 | Prensa del lanzamiento (2026-08-25) |
| Vercel, plan Hobby (Mission Control) | OPEX fijo | 0. Hobby es para uso personal y no comercial | Mes | 2026-11-19 | Sitios de precios de terceros; confirmar en vercel.com/pricing |
| Vercel, plan Pro (si el uso comercial lo exige) | OPEX fijo | 20 USD por persona al mes, con 20 USD de consumo incluidos (por verificar) | Mes por asiento | 2026-11-19 | Sitios de precios de terceros; confirmar en vercel.com/pricing |
| Neon Postgres, plan `free_v3` (Mission Control) | OPEX fijo | 0 | Mes | 2026-11-19 | Creado desde Vercel Marketplace |

## 3. Fórmulas

- **Costo por video** = guion + material + voz + edición/render + revisión humana + publicación + infraestructura asignada.
  - Infraestructura asignada = (Claude + electricidad + hardware amortizado) ÷ videos del mes.
  - Revisión humana = minutos de aprobación × valor de la hora del socio (por definir; aunque no se pague, cuenta como costo).
- **Costo por cliente (Unidad B)** = onboarding + integración + consumo de APIs + soporte + infraestructura asignada.
- **Margen de contribución** = ingresos netos − costos variables.
- **Punto de equilibrio** = costos fijos ÷ margen de contribución porcentual, solo si el margen es positivo.
- **Hardware amortizado** = precio del equipo ÷ 36 meses (hipótesis de vida útil).

## 4. Escenarios de volumen (hipótesis)

Los volúmenes son supuestos para planear; los costos se llenan cuando C4 dé datos reales.

| | Conservador | Base | Agresivo |
|---|---|---|---|
| Cuentas activas | 3 (piloto) | 10 (etapa 2) | 25 (etapa 3) |
| Videos al día por cuenta | 1 | 3 | 3 |
| Videos al mes | 90 | 900 | 2.250 |
| Minutos de aprobación humana al mes (hipótesis: 2 min por video) | 180 | 1.800 | 4.500 |
| Ciclos de Claude al día | 4 (2 PCs) | Por medir | Por medir |
| Costo por video | Por medir (C4) | Por medir | Por medir |

**Lectura temprana:** en el escenario base ya son 30 horas de aprobación al mes. Antes de escalar a 10 cuentas, la aprobación debe ser casi toda automática para lo `autorizado` o `propio`. Esa es una razón más para resolver los derechos (P-01).

## 5. Tres escenarios de equipo (P-05)

| | Equipo actual (2 PCs con Windows) | Mac mini dedicada | Nube o híbrido |
|---|---|---|---|
| CAPEX | 0 | 1.699 a 1.799 USD en EE. UU. (en Colombia, por verificar) | 0 |
| Siempre encendido | No: depende de las PCs de los socios | Sí | Sí |
| Transcripción (whisper) | Solo con el procesador | Más rápida, usa la parte gráfica | Según el servicio |
| Trabajo de adaptación | 0 | Unas 8 h para que los scripts corran en Mac y Windows | Rehacer lo que use videos locales |
| Cuándo conviene | Piloto | Cuando C4 muestre que las PCs no alcanzan o haga falta 24/7 | Para agentes de empresas que no usan video |

## 6. Alertas y stop-loss (por activar cuando haya presupuesto, Q-03)

- Gasto del mes por encima del 80 % del presupuesto: alerta en Mission Control.
- Un pipeline sin publicaciones en 48 h: alerta.
- Costo por video por encima del umbral acordado durante 2 semanas: se pausa ese pipeline y se revisa.
- Un aviso de derechos en cualquier cuenta: se pausa esa fuente en todas las cuentas.

## 7. Cómo se va a medir (tarea C4)

1. Cada informe de ciclo anota inicio, fin, clips producidos, minutos de video procesados y publicaciones.
2. Al cerrar la semana, cada socio anota de la pantalla de uso de Claude cuánto consumió la Legión, hasta que haya una forma automática.
3. Mission Control muestra el costo y el tiempo por video de cada marca.
