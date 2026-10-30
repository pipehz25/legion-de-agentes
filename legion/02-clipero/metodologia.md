# Metodología del Clipero

Un clip relevante es un **momento de un contenido largo** que funciona solo, engancha en 2 segundos y llega **mientras el tema está subiendo**, antes de que todo el mundo lo haya recortado.

## 1. Tipos de momento

| Tipo | Qué es | Por qué funciona |
|------|--------|------------------|
| `revelacion` | Dato, confesión o noticia que nadie había dicho | Curiosidad y "tienes que ver esto" |
| `frase` | Afirmación citable, polémica o contundente | Se comparte como opinión propia; genera debate |
| `confrontacion` | Choque, réplica, desacuerdo en vivo | Tensión y bandos en comentarios |
| `humor` | Chiste, situación absurda, risa contagiosa | Compartido por pura diversión |
| `reaccion` | Reacción genuina y visible (sorpresa, enojo, emoción) | La emoción se contagia |
| `historia` | Anécdota completa con inicio, giro y final en menos de 75 s | Retención alta y payoff claro |
| `consejo` | Algo útil y accionable, dicho con autoridad | Se guarda y se comparte |
| `prediccion` | Afirmación audaz sobre el futuro (IA, música, cultura) | Debate y regreso cuando se cumple |
| `emotivo` | Momento sincero que conmueve | Identificación y compartidos |

## 2. Cómo encontrar los momentos

`clipero.ps1 analizar` entrega tres señales del público y la transcripción:

1. **`picos_repeticion`**: picos del gráfico "más repetido" de YouTube. Son los segundos que la gente vuelve a ver: la señal más fuerte. Cada pico es una **zona** (en videos largos, cada segmento dura ~1 % del video); el momento exacto se busca en la transcripción dentro de esa zona.
2. **`marcas_en_comentarios`**: minutos que el público cita en comentarios ("23:41 me muero"). Si coinciden con un pico, el momento casi seguro sirve.
3. **`capitulos`**: ayudan a ubicar temas.
4. **Transcripción** (`transcripcion.txt`, líneas `[h:mm:ss] texto`): buscar marcadores como `[Risas]`, exclamaciones, "no puede ser", preguntas directas seguidas de una respuesta fuerte, cambios bruscos de tema, y menciones de los temas que el Cazador Viral marcó como emergentes.

En videos de **menos de 24-48 h** todavía no hay gráfico de repetición ni comentarios con minutos: hay que juzgar solo con la transcripción y los temas en alza. Ahí está la mayor ventaja, porque casi nadie lo ha recortado aún.

## 3. Puntaje del clip (0-100)

| Componente | Máx. | Qué mide |
|------------|------|----------|
| Fuerza del momento | 25 | Pico de repetición, menciones en comentarios, intensidad emocional, lo citable que es |
| Autonomía | 20 | Se entiende sin contexto previo; no necesita haber visto el video |
| Gancho | 15 | Los primeros 2 s frenan el scroll (o se pueden lograr empezando en la frase justa) |
| Relevancia ahora | 25 | Ligado a una oportunidad del Cazador Viral en semilla, emergente o crecimiento; tema o persona en alza en Google o X; fuente reciente |
| Frescura del clip | 15 | Nadie (o casi nadie) ha publicado ya este mismo momento |

Se produce desde `umbral_produccion` (65). Por debajo, el momento puede quedar como propuesta en el informe.

## 4. Saturación del clip

Antes de cortar, comprobar si el momento ya está recortado: `clipero.ps1 buscar` con la frase clave o "<persona> <tema>", y una búsqueda web.

- Sin clips del momento: frescura completa.
- Pocos clips y con pocas vistas: frescura media; vale la pena con mejor gancho o subtítulos.
- Varios clips con muchas vistas: el momento ya está en pico. Solo tiene sentido como **arbitraje de idioma**: el original está en otro idioma y no hay versión subtitulada al idioma de la audiencia.

## 5. Reglas de edición

- **Entrar en el gancho.** Se elimina el preámbulo: el clip empieza en la frase más fuerte o en la pregunta que la provoca. Si hace falta contexto, el texto de gancho de arriba lo da.
- **Salir después del payoff**, dejando 0,5-1 s de la reacción.
- **Duración:** entre 15 y 75 s; lo ideal, de 25 a 45 s.
- **Texto de gancho:** como mucho 8 palabras. Crea curiosidad sin mentir sobre lo que pasa.
- **Subtítulos en el idioma de la audiencia.** Si la fuente está en otro idioma, se analiza con `-Traducir es` y se corta con `-Subs es`.
- **Audio:** `cortar` lo normaliza a -14 LUFS integrado con pico real ≤ -1 dBTP, en dos pasadas y siempre en modo lineal, y lo exporta en AAC a 48 kHz. Queda registrado en el `audio` de `meta.json`. Si `objetivo_lufs` queda por debajo de -14, la fuente tiene picos extremos y el clip saldrá algo más bajo: se anota en la ficha. Si la fuente ya venía saturada (`entrada_tp` > 0), la normalización no repara esa distorsión; si se oye, se busca otra fuente del mismo momento.
- **Modo de video:** `desenfoque` (video completo al centro sobre fondo desenfocado) sirve para todo y nunca corta caras. `recorte` (centro a pantalla completa) solo cuando hay una sola persona centrada.
- **Verificación visual:** después de cortar, mirar `revision.jpg` (4 cuadros repartidos por todo el clip). El gancho y los subtítulos se tienen que leer y no pueden tapar caras. Tampoco puede haber **anuncios ni banners incrustados** en la fuente (promociones de conciertos, patrocinadores, marcas de terceros). Si aparecen, se mueven la entrada o la salida para evitarlos; si ocupan el momento entero, se descarta.

## 6. Derechos y ética

- Cada clip lleva una marca de derechos:
  - `propio`: contenido del propio usuario.
  - `autorizado`: canal con programa de clips o permiso, según `fuentes_autorizadas` en `config.json`.
  - `sin_verificar`: hay que revisarlo antes de publicar.
- Siempre se acredita la fuente: canal, enlace y minuto.
- **Nunca se altera el sentido.** Está prohibido cortar de forma que alguien parezca decir lo que no dijo: quitar una negación, sacar una ironía de contexto o unir frases separadas.
- No se recortan momentos que expongan a personas privadas o a menores, ni tragedias, ni nada que caiga en las exclusiones del Cazador Viral.
