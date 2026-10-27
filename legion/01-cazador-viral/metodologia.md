# Metodología del Cazador Viral

## 1. Unidad de análisis: el patrón replicable

No se rastrean videos: se rastrean **patrones que se pueden volver a hacer**. Una pieza viral suele contener varios.

| Tipo | Qué es | Ejemplo |
|------|--------|---------|
| `formato` | Estructura reutilizable | "Tier list de…", "POV: eres…", "Cosas que no sabías de…" |
| `audio` | Sonido, canción o voz en tendencia | Un fragmento de canción que todos usan para revelar algo |
| `meme` | Plantilla visual o frase | Una imagen con texto que se rellena |
| `reto` | Acción que el público repite | Un paso de baile, una prueba |
| `tema` | Asunto del momento que se puede aprovechar | Lanzamiento, noticia, polémica, partido |
| `pieza` | Contenido concreto atípico cuyo patrón aún no tiene nombre | Posible semilla |

## 2. Filtro: ¿es viral o solo es famoso?

Se mide el rendimiento **relativo**, no el absoluto:

- **Sobre-rendimiento** = vistas de la pieza ÷ mediana de vistas de las ~10 piezas anteriores del creador. ≥3× es señal; ≥10× es señal fuerte. Si no hay historial del creador, usar vistas ÷ seguidores.
- **Velocidad** = vistas por hora desde la publicación (el recolector la calcula para YouTube).
- **Compartidos y guardados** cuando se vean: si hay más compartidos que me gusta, la señal es muy fuerte.
- **Comentarios con intención de réplica**: "voy a hacer esto", "parte 2", etiquetas a amigos.

Una pieza de un famoso con sobre-rendimiento < 2× **no cuenta**: ahí funciona la fama, no el formato. La excepción es cuando el famoso inaugura un formato que otros ya están replicando con éxito.

## 3. Genoma viral: descomposición obligatoria

Cada candidato se descompone en 10 genes. Esto es lo que permite replicar y combinar.

| # | Gen | Pregunta | Valores típicos |
|---|-----|----------|-----------------|
| 1 | `gancho` | ¿Qué frena el scroll en 0-3 s? | Pregunta imposible, afirmación contraintuitiva, resultado primero, *in medias res*, POV, "nadie habla de…", número/lista, imagen anómala, reto directo al espectador |
| 2 | `estructura` | ¿Cómo avanza? | Lista/top, antes-después, transformación, storytime, tutorial exprés, reacción, respuesta a comentario, serie por partes, loop perfecto, mito vs realidad, tier list, experimento, comparación, día en la vida |
| 3 | `emocion` | ¿Qué siente el público? | Asombro, risa, indignación, nostalgia, identificación ("literal yo"), curiosidad, ternura, morbo, orgullo identitario, aspiración |
| 4 | `payoff` | ¿Qué recompensa al final? | Giro, revelación, dato, remate, resolución, cliffhanger |
| 5 | `formato_tecnico` | ¿Cómo está hecho? | Duración, vertical/horizontal, cara a cámara o voz en off, texto en pantalla, subtítulos dinámicos, pantalla dividida, green screen, IA generativa, clip de stream o podcast |
| 6 | `audio` | ¿Qué suena? | Sonido en tendencia, canción, voz viral, silencio dramático, efecto |
| 7 | `edicion` | ¿Qué ritmo tiene? | Cortes por segundo, zooms, b-roll, inserciones meme, picos de retención |
| 8 | `arquetipo` | ¿Quién habla? | Experto, outsider, villano, el que reacciona, el que sabe datos raros, personaje recurrente |
| 9 | `participacion` | ¿Cómo invita a sumarse? | Plantilla copiable, pregunta binaria, etiqueta a alguien, invitación a dueto/stitch, polémica, "parte 2" |
| 10 | `contexto` | ¿De qué se alimenta? | Actualidad (evento), estacional, perenne, nicho, identidad regional |

Cada gen se marca como **perecedero** (audio, meme o tema que se quema) o **estructural** (gancho, estructura o mecánica que se puede reutilizar casi indefinidamente).

## 4. Replicabilidad (0-20)

Suma puntos si:
- la plantilla es clara y tiene pocos elementos,
- no depende de fama, presupuesto ni acceso exclusivo,
- funciona con cara o sin cara,
- se adapta a varios nichos.

Resta puntos si:
- depende de un evento único irrepetible,
- requiere derechos (música, clips) que no se pueden licenciar,
- tiene riesgo reputacional o de seguridad.

## 5. Puntaje de oportunidad (0-100)

| Componente | Máx. | Cómo se calcula |
|------------|------|-----------------|
| Fuerza viral | 25 | Sobre-rendimiento, velocidad, compartidos |
| Momento del ciclo | 30 | semilla 22 · emergente 30 · crecimiento 22 · pico 8 · saturación 0 · quemado = descartado (ver `ciclo-de-vida.md`) |
| Replicabilidad | 20 | Sección 4 |
| Encaje con nichos | 15 | `nichos` de `config.json` |
| Potencial de hibridación | 10 | ¿Sus genes combinan bien con otros patrones vivos? |

- Se publica desde `umbral_oportunidad` (60), como oportunidad o como apuesta según el filtro de evidencia.
- Sirve de base para un formato híbrido desde `umbral_hibridacion` (70).

### Filtro de evidencia: medir el patrón, no algo cercano

Cada evidencia lleva dos marcas más:
- `mide`:
  - `patron`: mide el propio patrón. Por ejemplo, videos que usan el formato o el audio, vistas de sus réplicas, permanencia del tema en X o en Google Trends, versiones en YouTube con sus vistas.
  - `senal_relacionada`: mide algo cercano. Por ejemplo, reproducciones de la canción en Spotify, visitas a Wikipedia o puestos en listas de blogs. Sirve de apoyo, pero no prueba que el patrón funcione.
- `contexto`: dónde se tomó la medida, con la notación de `etapa_por_contexto` (`tiktok-en`, `x-co`, `spotify-co`…).

Un patrón que supera el umbral entra en **`oportunidades`** solo si tiene al menos una evidencia `medido` con `mide: "patron"` tomada **en una plataforma o un mercado de destino**. Si no, va a **`apuestas`**, con lo que falta medir para pasar a oportunidad.

## 6. Hibridación: formatos virales hechos de formatos virales

Palancas, de la más fiable a la menos:

1. **Trasplante de nicho**: un formato probado en el nicho A y todavía sin usar en el nicho B. Un formato puede estar quemado en humor y sin estrenar en historia o IA. Es la palanca más fiable.
2. **Arbitraje de plataforma**: en pico en TikTok pero emergente en Reels, Shorts o Facebook, o al revés.
3. **Arbitraje de idioma o región**: viral en inglés y aún sin adaptar al español o a LatAm. Suele haber un retraso de días a semanas. Hay que verificarlo buscando versiones en español.
4. **Cruce de genes**: gancho de A + estructura de B + tema de C + audio de D.
5. **Aprovechar la actualidad con un formato estable**: formato estructural + tema del día (Google Trends, X). La ventana es de 24-72 h.

Reglas de cruce:
- Como máximo **un gen perecedero** por formato; el resto, estructurales. Así el formato sobrevive aunque el elemento de moda muera.
- Ese gen perecedero debe estar en semilla, emergente o crecimiento; nunca en pico tardío ni en saturación.
- Emociones compatibles: asombro con curiosidad, sí; ternura con indignación, casi nunca.
- El gancho debe entenderse en 1-2 s, sin contexto y sin sonido (con texto en pantalla).
- Debe poder producirlo un creador con recursos normales.
- Se replica la **estructura**, nunca el material: nada de reutilizar clips, audio con derechos ni guiones ajenos sin licencia.

## 7. Ficha de formato híbrido (`salidas/cazador-viral/formatos/<id>.md`)

```markdown
# <Nombre del formato>

- **Fórmula:** [gen de A] + [gen de B] + …
- **Patrones base:** <ids de patrones.json> (etapa de cada uno)
- **Palanca:** trasplante de nicho / arbitraje de plataforma / arbitraje de idioma / cruce de genes / actualidad
- **Por qué debería funcionar:** evidencia con enlaces y métricas
- **Plataformas objetivo y duración:**
- **Ventana estimada:** hasta <fecha>, porque <etapa del gen perecedero>. Confianza: baja/media/alta
- **Guion esqueleto:**
  - 0-2 s (gancho, texto en pantalla incluido):
  - Desarrollo:
  - Final (payoff + invitación a participar):
- **Título, descripción y hashtags sugeridos:**
- **Tres variantes por nicho:**
- **Riesgos:** derechos, sensibilidad, dependencia del gen perecedero
- **Cómo saber si funcionó:** KPI y umbral a las 24 h
```

## 8. Exclusiones

No se recomiendan nunca: retos con riesgo físico, contenido que explote tragedias o víctimas reales, desinformación, acoso, discurso de odio ni nada que implique suplantar a una persona.
