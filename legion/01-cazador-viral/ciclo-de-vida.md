# Ciclo de vida de un patrón y detección de saturación

El objetivo es replicar **antes del pico**. Llegar tarde a un patrón viral rinde menos que no hacerlo.

## Etapas

| Etapa | Qué está pasando | Señales observables | Acción |
|-------|------------------|---------------------|--------|
| `semilla` | 1-3 piezas originales despegan; casi nadie replica | Sobre-rendimiento alto, 0-5 réplicas, sin nombre ni hashtag propio | Vigilar. Replicar solo si encaja muy bien: riesgo alto, premio máximo |
| `emergente` | Primeras réplicas, también de cuentas pequeñas, que rinden por encima de su media | 5-50 réplicas visibles, en una sola plataforma, sin tutoriales ni prensa, búsquedas subiendo | **Ventana ideal: replicar ya** |
| `crecimiento` | Adopción acelerada por creadores medianos | Cientos de réplicas, aparece en listas (Creative Center, X), primeros "cómo hacer el trend", salta a una segunda plataforma | Replicar con giro propio; buscar arbitraje de nicho o idioma |
| `pico` | Lo hacen creadores grandes y marcas; los medios hablan de "el trend que arrasa" | Las réplicas nuevas rinden igual o menos que la media de su creador; abundan los tutoriales; el crecimiento se frena | Solo con giro fuerte o como base de arbitraje |
| `saturacion` | Fatiga | Comentarios tipo "otra vez esto", parodias del propio trend, marcas tardías, compilaciones | Evitar; como mucho, parodia o meta |
| `quemado` | El uso cae o se vuelve irónico | Sale de las listas; las búsquedas bajan | Descartar y archivar (puede volver meses después como nostalgia) |

## Señales y cómo medirlas con nuestras fuentes

1. **Velocidad (Δ entre ciclos):** cambio en vistas por hora, en la posición en listas, en `horas_en_lista` de X (trends24) y en el tráfico de Google Trends. Se compara siempre con el snapshot anterior.
2. **Aceleración:** si la velocidad baja dos ciclos seguidos, el patrón se acerca al pico.
3. **Rendimiento de réplicas recientes (la señal más importante):** tomar 3-5 réplicas publicadas en las últimas 48-72 h por cuentas pequeñas o medianas. Si la mayoría supera la media de su creador, el patrón sigue vivo; si no, está en pico o saturación.
4. **Densidad de réplicas:** número aproximado de piezas o creadores que usan el patrón (conteo de videos del audio o hashtag cuando sea visible).
5. **Señales tardías:** tutoriales de "cómo hacerlo", artículos de medios o blogs de marketing ("los trends de esta semana"), marcas grandes participando. Indican pico o algo posterior.
6. **Fatiga:** comentarios negativos por repetición.
7. **Edad:** días desde `primera_vez_visto`. Referencias orientativas, a calibrar con datos propios: audio o meme de TikTok, 2-4 semanas; reto, 1-3 semanas; tema de actualidad, 24-72 h. Los formatos estructurales (storytime, tier list, top 5) no se queman de forma global: su saturación se evalúa por nicho y plataforma.

## Índice de saturación (0-100)

Es heurístico. Se suman:

| Componente | Rango |
|------------|-------|
| Densidad de réplicas | 0-25 |
| Rendimiento de réplicas recientes (invertido: todas por debajo de su media = 30) | 0-30 |
| Señales tardías presentes (tutoriales, medios, marcas) | 0-20 |
| Fatiga en comentarios | 0-15 |
| Edad relativa a su tipo | 0-10 |

Correspondencia orientativa: 0-15 semilla · 16-35 emergente · 36-55 crecimiento · 56-70 pico · 71-85 saturación · 86-100 quemado.

La etapa final la decide el agente con todas las señales. Si el índice y las réplicas recientes no coinciden, **ganan las réplicas recientes**.

## Reglas

- Nada pasa a `semilla` ni a `emergente` sin al menos **dos señales independientes** (por ejemplo, sobre-rendimiento y réplicas que rinden).
- Cada cambio de etapa se anota en `historial` con la fecha y la señal que lo justifica.
- Un mismo patrón puede estar en etapas distintas según plataforma, idioma o nicho. Se registra en `etapa_por_contexto`: de ahí salen los arbitrajes.
- En `etapa_por_contexto` hay dos valores especiales para los contextos de destino:
  - `sin-adaptar`: se buscó y no hay versiones en ese idioma, nicho o plataforma. Para el componente "momento del ciclo" cuenta como `semilla` (22 puntos), con confianza `baja` hasta encontrar réplicas allí.
  - `sin-verificar`: no se buscó. Se puntúa con la etapa del contexto de origen, y verificarlo es prioridad del ciclo siguiente.
- La ventana estimada es la fecha a partir de la cual se espera el pico. Siempre una fecha concreta, con confianza baja, media o alta.
- **Calibración:** si existe `datos/cazador-viral/resultados.json` (resultados reales del contenido publicado), se usa para ajustar estos umbrales, y el ajuste se anota en el informe.
