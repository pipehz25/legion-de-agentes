# Escenas horizontales: catálogo para escribir un video largo

Referencia para diseñar las escenas de un video largo de YouTube (1920×1080, tema `archivo`, `cosmos`, `expedicion` o `mercado`; ver «Temas») sin leer el código. El estilo es el de la muestra aprobada (`animados/propios/hi-panama-muestra`) y de los capítulos c0 y c1 de `animados/propios/hi-panama/guion.json`: míralos como ejemplo completo.

## 1. Cómo va en el guion

```json
{
  "tipo": "largo", "orientacion": "horizontal",
  "personajes": { "roosevelt": { "nombre": "Theodore Roosevelt", "rol": "Presidente de EE. UU.", "barba": "morsa", "gafas": "quevedos" } },
  "capitulos": [
    { "id": "c3", "titulo": "Nicaragua o Panamá",
      "escenas": {
        "comision": { "plantilla": "mapa", "datos": { "...": "..." } },
        "precio": { "plantilla": "cifra", "datos": { "valor": 109, "moneda": "US$", "unidad": "millones", "rotulo": "lo que pedían los franceses", "palabra": "109" } }
      },
      "frases": [
        { "id": "f22", "escena": "comision", "texto": "En 1901, una comisión ...", "cortes": [{ "escena": "precio", "palabra": 7 }] }
      ] }
  ]
}
```

- **El texto de las frases no se toca nunca** (ni una letra): su voz ya está pagada. Tampoco `motor`, `voz`, `modelo_voz` ni `ajustes_voz`. Cambiar escenas, cortes o pausas no gasta nada.
- **Una escena cada 4 a 8 s.** Una frase dura de 7 a 11 s: pártela con `cortes`. `"palabra"` es el número de la palabra (desde 0, contando como en el texto: «1903,» es una palabra), el texto de la palabra (`"Cruzarla"`) o `"fin"` (la escena empieza al terminar la frase). El corte tiene que caer a más de 0,3 s del borde de una escena. Para contar palabras, abre `tiempos.json` del video: cada frase trae sus palabras en orden.
- **Ids de escena:** minúsculas, números y guiones, únicos en todo el video (no repitas `mapa` en dos capítulos: `mapa-nicaragua`). Una escena no puede volver más tarde: si quieres repetirla, cópiala con otro id.
- **La tarjeta del capítulo es automática** (plantilla `capitulo`, «Capítulo III» y el título) y se ve sola en la pausa antes de la primera frase. Para otra, pon `"tarjeta": "<id de una escena tuya>"`; `"tarjeta": false` la quita.
- **Final del capítulo:** la última escena se ve hasta medio segundo después de la última palabra; lo que aparezca con la última palabra casi no se lee. Que lo último entre un par de segundos antes.
- **Frases sin escena:** salen con un titular «Escena pendiente»: sirve para ver el capítulo antes de terminarlo, nunca para publicar.
- **`imagen`** en las frases de c2 a c7 es la foto que usaba el modo viejo. No se dibuja sola: es una pista. Si la quieres, ponla como `foto` en una escena (su nombre de Commons está en `imagenes` del guion).
- **Lo que se ve tiene que estar en las fuentes** del guion, como lo que se dice. Si una escena muestra un dato nuevo (una fecha, una cifra), agrega su fuente a `fuentes`.

### Momentos

Casi todo dato que aparece lleva un momento: `"palabra": "Nashville"` (cuando se dice esa palabra, contando solo desde que empieza la escena; sirve el comienzo de la palabra: `"presum"` encuentra «presumió»), `"en": 0.5` (a la mitad de lo que se habla en la escena) o un número de segundos desde que empieza la escena. Sin momento, cada plantilla tiene un orden por defecto.

### Personajes de la ficha

Cada persona se dibuja con la ficha de `personajes` del guion (rasgos aproximados según sus retratos; nunca su cara real). En los datos se nombra así:

- En un objeto: `{ "personaje": "hay", "pose": "firmar", "expresion": "sonrisa" }`. La ficha entra entera (nombre, rol, bandera, rasgos) y lo que pongas manda encima.
- En la lista `personajes` del `tablero`: basta el id, `["roosevelt", "marroquin", { "personaje": "bunau", "sombrero": "bombin" }]`.
- En `personaje` y `cita`, en la raíz de los datos: `{ "personaje": "lesseps", "anios": "1805-1894", "rol": "..." }`.

Ficha de hi-panama: `roosevelt`, `hay`, `bunau`, `marroquin`, `amador`, `lesseps`, `herran`, `huertas`, `cromwell`, `urrutia`, `thomson`, `torrijos`, `carter`, `soldado` (colombiano, 1903) y `marinero` (estadounidense). Urrutia y Thomson son aproximados (sin retrato comprobado).

Rasgos (para un personaje nuevo o para cambiar algo en una escena): `piel`, `pelo`, `ropa`, `detalle`, `corbata` (colores `#rrggbb`); `peinado`: `corto`, `largo`, `calvo`, `recogido`, `peluca`, `raya`; `barba`: `ninguna`, `bigote`, `completa`, `patillas`, `bigote-encerado`, `morsa`, `candado`, `recortada`; `sombrero`: `ninguno`, `bicornio`, `copa`, `corona`, `bombin`, `ala`, `kepis`, `marinero`, `canotier`; `gafas`: `true` o `"quevedos"`; `expresion`: `neutral`, `sonrisa`, `serio`, `sorprendido`, `enojado`, `pensativo`, `astuto`; `pose` (medio cuerpo): `neutral`, `senalar`, `brazos-cruzados`, `firmar`, `saludar`, `pensar`, `jarras`, `discurso`; `cuello`: `corbata`, `lazo`, `ninguno`; `bata`, `charreteras`: `true`. En la ficha también van `nombre`, `corto` (nombre corto para el tablero), `rol` (24 letras) y `bandera`.

### Fotos de Commons como elemento

Un dato `foto` (o `foto_<algo>`) con el nombre exacto del archivo de Commons: `"foto": "File:Uss Nashville PG-7.jpg"`. Al producir se revisa la licencia (solo dominio público, CC0, CC BY, CC BY-SA) y se baja a `animados/.imagenes-cache/` si no estaba; los créditos salen solos. Las de `imagenes` del guion ya están bajadas y comprobadas: úsalas primero. Las fotos nunca van a pantalla completa: solo `recorte`, `fichas`, `tablero`, `dos-personajes` y `vehiculo` las muestran.

### Colores, banderas y dibujos

- **Colores** por nombre: `acento` (rojo lacre; cian en `cosmos`), `acento2` (oro viejo; ámbar en `cosmos`), `tinta`, `alerta`, `bien`, o un `#rrggbb`.
- **Banderas:** `colombia`, `panama`, `eeuu`, `francia`, `espana`.
- **Dibujos** (`dibujo` en `mapa` > `fichas`, `fichas`, `cifra` y `titular`): `calendario`, `canon`, `pluma`, `sello`, `ancla`, `tren`, `mosquito`, `lluvia`, `derrumbe`, `cruz`, `moneda`, `esclusa`, `barco`, `volcan`, `documento`, `draga`, `montana`, `bandera`, `balanza`, `reloj`.

### Temas: `archivo`, `cosmos`, `expedicion` y `mercado`

Las plantillas horizontales toman todos sus colores y letras del tema (`estilo.tema` del guion; `herramientas/temas.mjs`):

- **`archivo`** (historia): papel envejecido, tinta sepia, rojo lacre y oro viejo; Playfair Display y EB Garamond. Es el de los videos de historia; `estilo.fondo` y `estilo.brillo` (tonos claros) varían el papel.
- **`cosmos`** (ciencia y misterios, canal CurioSismo): azul noche casi negro con estrellas y nebulosas fijas (siempre las mismas), hojas de vidrio oscuro con borde de luz, tinta clara, `acento` cian, `acento2` ámbar y `alerta` magenta, con resplandor; títulos y cifras en Exo 2, texto en Inter. El mapa sale como un mapa nocturno (tierra azul oscuro, costas cian) y los personajes llevan un contorno de luz. Pide `"estilo": { "tema": "cosmos" }`; si cambias `fondo`/`brillo`, que sean tonos oscuros. Resalta países con `acento` (cian): con `acento2` quedan grises.
- **`expedicion`** (supervivencia, canal de Juliana): cuaderno de campo sobre un mapa topográfico. Verde oliva oscuro con curvas de nivel y retícula fijas, tarjetas de lona con borde claro y cinta amarilla, tinta clara, `acento` naranja de rescate (`#ff6a1a`), `acento2` amarillo de señal (`#ffd23f`), `alerta` rojo y `bien` verde musgo; sombras duras en vez de resplandor. Títulos en Oswald, texto en Barlow y cifras de estarcido (Big Shoulders Stencil Display), que en `cifra`, `fichas` y el calendario del `titular` dan el tono urgente. El mapa sale topográfico (tierra oliva con curvas de nivel, agua verde petróleo, costa clara). Pide `"estilo": { "tema": "expedicion" }`.
- **`mercado`** (dinero, canal de Felipe: historia económica, empresas, finanzas y crisis): terminal financiera e informe económico. Azul petróleo casi negro con cuadrícula de gráfico y tres líneas de cotización tenues fijas (una dorada con su área, una verde y una roja), paneles de terminal con borde fino, tinta clara, `acento` dorado (`#e3b341`), `acento2` y `bien` verde alza (`#22c55e`), `alerta` rojo baja (`#ef4444`). Títulos en Fraunces, texto en IBM Plex Sans y **cifras en IBM Plex Mono** (tabulares, como precios: `cifra`, años de `linea-tiempo`, calendario del `titular`). La roseta de `cifra` sale verde, como un billete; el mapa, como un gráfico (tierra petróleo, costa dorada, cuadrícula). Para una caída usa `alerta` en los colores de las escenas (rojo) y para una subida `bien` (verde). Pide `"estilo": { "tema": "mercado" }`.

Los colores por nombre (`acento`, `acento2`, `alerta`, `bien`, `tinta`) cambian solos con el tema: escribe nombres y no `#rrggbb`, o el color quedará fijo en los dos. Las banderas, las fotos y el paisaje de `vehiculo` conservan sus colores reales en cualquier tema (el paisaje de `vehiculo` se pasa por un filtro del tema: noche azul en `cosmos`, campo oliva en `expedicion`; la máquina lleva un contorno para despegarse).

Para un color nuevo en una plantilla horizontal: agrégalo como variable en `HORIZONTAL_PAPEL` de `temas.mjs` (con el valor de `archivo`) y su versión en `cosmos`; en CSS se usa `var(--x)` y en un atributo de SVG escrito en JS, `colorTema("--x", "#respaldo")` (de `_escena-h-js.html`), porque `fill="var(--x)"` no siempre se resuelve.

### Probar un capítulo

```powershell
node animados/herramientas/producir.mjs animados/propios/hi-panama --capitulos c3 --sin-render --capturas
```

Arma y revisa solo c3 (sin render, unos 20 s) y deja capturas en `animados/propios/hi-panama/largo/capitulos/c3/snapshots/` (`at-<segundo>s.png`, dos por escena). **Mira las capturas**: que la revisión pase no dice cómo se ve. Los errores de la revisión (textos que se pisan, cosas fuera del cuadro) detienen la producción: corrígelos.

## 2. Plantillas

Todas reservan la franja de subtítulos (de 952 a 1040 px de alto) y ajustan solas el tamaño de la letra dentro de los largos indicados.

### `titular` — 3 a 5 s
Texto grande que entra palabra por palabra al decirse, con una hoja de calendario o un medallón con dibujo al lado. Para una fecha clave, una pregunta o una idea fuerte.
Datos: `lineas` (2 o 3, de 14 letras; caben 18), `resalta` (número de línea en rojo; por defecto la última), `insignia` (40 letras), `todo_al_inicio` (`true`: completo desde el cuadro 0), `calendario` { `arriba`, `numero` (1 o 2 cifras: un día), `abajo`, `lado`, `palabra`|`en`, `sello`, `palabra_sello`, `tachar` (palabra en que se tacha la hoja) } o `dibujo` (sin calendario), `lado_dibujo`, `palabra_dibujo`.
```json
{ "plantilla": "titular", "datos": { "lineas": ["¿Cómo pudo", "pasar?"], "resalta": 1, "calendario": { "arriba": "Cosa de", "numero": "1", "abajo": "día", "lado": "derecha", "palabra": "No", "tachar": "cosa" } } }
{ "plantilla": "titular", "datos": { "lineas": ["El gran sueño", "era un canal"], "resalta": 1, "dibujo": "barco", "palabra_dibujo": "canal" } }
```

### `mapa` — 4 a 8 s (con 2 o 3 vistas)
Mapa ilustrado de las Américas (de México al cabo de Hornos, con el Caribe) con cámara que viaja entre vistas, países que se encienden, un país que se separa, rutas que se dibujan (con un barco o un tren que las recorre), ríos, lagos, el canal con sus esclusas, montañas, ciudades, rótulos, banderas, una cartela arriba a la izquierda y fichas abajo. No llega a Estados Unidos (termina en el norte de México): para «hacia Washington», una flecha que sale por arriba.
Datos (todo opcional salvo `vistas`):
- `vistas`: [{ `caja`: [lonOeste, latNorte, lonEste, latSur] o `centro`: [lon, lat] + `ancho` (grados), `palabra`|`en` (cuándo llega; la primera está desde el cuadro 0), `dur` (s) }]. Vistas que ya funcionan: Colombia y Panamá `centro [-80, 4.5]`, `ancho 34`; istmo `caja [-83.4, 10.5, -76.6, 6.2]`; zona del canal `caja [-80.25, 9.62, -79.25, 8.78]`; Nicaragua y Panamá `centro [-82.5, 10.6]`, `ancho 14`; Caribe `centro [-76, 13]`, `ancho 44`; continente `centro [-102, -27]`, `ancho 165`.
- `paises`: [{ `id`: `colombia`|`panama`|`venezuela`|`ecuador`|`nicaragua`, `color`, `opacidad` (0,6), `palabra`|`en`, `hasta` }].
- `separa`: { `pais`: `"panama"`, `palabra`|`en`, `hacia`: [dx, dy], `color` }.
- `rutas`: [{ `puntos`: [[lon, lat], …] o `"ferrocarril"`, `"canal"` (el de 1914), `"culebra"` (el corte), `"ruta_nicaragua"`; `estilo`: `linea`, `discontinua`, `tren`, `flecha`, `canal` (cauce de agua), `resalte` (franja ancha translúcida: la zona del canal, el corte Culebra); `color`, `grosor`, `palabra`|`en`, `dur`, `movil`: `barco`|`tren`, `hasta` }].
- `rios`: [{ `id`: `chagres`|`san_juan`, `palabra`|`en`, `rotulo`, `rotulo_lugar`, `rotulo_tam` }]. El Chagres va como era antes de la represa.
- `lagos`: [{ `id`: `gatun` (aparece; existe desde 1913) | `nicaragua` | `managua` (siempre están; se resaltan), `palabra`|`en`, `rotulo` }].
- `esclusas`: [{ `id`: `gatun`|`pedro_miguel`|`miraflores`, `texto` (por defecto su nombre), `lado`, `palabra`|`en` }].
- `montes`: { `puntos`: `"culebra"` o [[lon, lat], …], `tam`, `palabra`|`en` }.
- `marcas` (ciudades): [{ `texto`, `lugar`, `lado`: `derecha`|`izquierda`|`arriba`|`abajo`, `tam`, `palabra`|`en`, `hasta` }].
- `rotulos`: [{ `texto`, `lugar`, `estilo`: `mar`|`pais`|`titulo`|`rio`, `tam`, `giro`, `palabra`|`en`, `hasta` }].
- `banderas`: [{ `pais`, `lugar`, `tam`, `palabra`|`en`, `hasta` }].
- `cartela`: { `titulo` (28 letras), `sub` (40), `palabra`|`en` }.
- `fichas` (abajo; hasta 2): [{ `titulo` ("3", "1821"), `texto` (16 letras), `dibujo`, `tachar`, `marcas` (rayitas), `contar`, `lugar`: `abajo-izquierda`|`abajo-derecha`|`abajo-centro`|`arriba-derecha`, `palabra`|`en`, `hasta` }] o { `tipo`: `"anios"`, `de`, `a`, `texto`, `lugar`, `palabra` }.
- **Lugares con nombre:** `colon`, `panama`, `bogota`, `cartagena`, `caracas`, `quito`, `cabo_hornos`, `darien`, `gatun`, `pedro_miguel`, `miraflores`, `gamboa`, `culebra`, `balboa`, `cristobal`, `chagres`, `managua`, `granada`, `san_carlos`, `san_juan_del_norte`, `san_juan_del_sur`, `momotombo`, `martinica`, `saint_pierre`, `bahia_panama`, `lago_nicaragua`, `lago_gatun`; o [lon, lat].
- Cuidado: los rótulos no van en el tercio de abajo (los tapan los subtítulos y las fichas) ni debajo de la cartela. Un rótulo de mar va en el agua: mira la captura. Pedro Miguel y Miraflores están a 3 km: en la vista de todo el canal sus medallones se tocan (dales `"tam": 56` o acércate). Dos textos que se pisan son un error de la revisión.
```json
{ "plantilla": "mapa", "datos": {
  "vistas": [{ "caja": [-80.15, 9.45, -79.45, 8.88] }],
  "paises": [{ "id": "panama", "color": "acento2", "opacidad": 0.25, "en": 0 }],
  "lagos": [{ "id": "gatun", "en": 0.02, "rotulo": "Lago Gatún" }],
  "montes": { "puntos": "culebra", "palabra": "cordillera" },
  "rutas": [{ "puntos": "canal", "estilo": "canal", "en": 0.03, "dur": 1.4 }, { "puntos": "culebra", "estilo": "resalte", "palabra": "Culebra" }],
  "esclusas": [{ "id": "gatun", "palabra": "Gatún", "lado": "izquierda" }, { "id": "pedro_miguel", "palabra": "Pedro" }, { "id": "miraflores", "palabra": "Miraflores", "lado": "izquierda" }],
  "rotulos": [{ "texto": "Corte Culebra", "lugar": [-79.6, 9.1], "estilo": "titulo", "tam": 34, "palabra": "Culebra" }],
  "cartela": { "titulo": "El canal de 1914", "sub": "Esclusas, un lago y un corte en la montaña" } } }
```

### `tratado` — 5 a 8 s
Dos hojas de calendario con una flecha (el tiempo que pasó), un documento que se escribe solo, un mapa chico del istmo con la franja del canal y un sello con bandera, o una franja roja de rechazo.
Datos: `titulo` (16 letras), `sub` (40), `desde` y `hasta` { `arriba`: "Nov", `numero`: "3" } (opcionales: sin ellos, el mapa sube), `lapso` (18), `franja` (rótulo del mapa, 34), `sello` (8 letras; mejor 4 a 6), `bandera`, `rechazado` (`true`), `texto_rechazo` ("En quiebra", 12 letras), `palabras` { `lapso`, `documento`, `sello`, `franja` }.
```json
{ "plantilla": "tratado", "datos": { "titulo": "Tratado", "sub": "Herrán-Hay, enero de 1903", "desde": { "arriba": "Ene", "numero": "22" }, "hasta": { "arriba": "Ago", "numero": "12" }, "lapso": "siete meses", "franja": "Zona de unos 10 km", "rechazado": true, "palabras": { "lapso": "acuerdo", "documento": "Senado", "sello": "rechazó", "franja": "agosto" } } }
```

### `dos-personajes` — 5 a 8 s
Dos personas de medio cuerpo frente a frente detrás de una mesa, con placas y banderas; una firma el documento. Puede llevar una foto real con cinta arriba al centro. Para una negociación, una firma o un enfrentamiento.
Datos: `izquierda`, `derecha`: { `personaje` o `nombre` (22 letras), `rol` (34), `bandera`, `palabra_bandera`, rasgos, `pose`, `expresion` }, `firma`: `"izquierda"`|`"derecha"`, `palabra_firma`, `foto`, `foto_pie` (40), `palabra_foto`.
```json
{ "plantilla": "dos-personajes", "datos": { "izquierda": { "personaje": "hay", "expresion": "sonrisa" }, "derecha": { "personaje": "bunau", "bandera": "panama", "palabra_bandera": "Panamá" }, "firma": "derecha", "palabra_firma": "firmó", "foto": "File:Portrait of Philippe-Jean Bunau-Varilla.jpg", "foto_pie": "Bunau-Varilla (foto anterior a 1904)", "palabra_foto": "nombre" } }
```

### `personaje` — 4 a 6 s
Retrato dibujado en un medallón a la izquierda; nombre, años y rol a la derecha. Para presentar a alguien.
Datos: `personaje` (o `nombre`, 20 letras, y rasgos), `anios` ("1805-1894", 12), `rol` (44, dos renglones), `palabra_anios`, `palabra_rol`, `pose` (con pose, medio cuerpo). El nombre aparece cuando se dice su primera palabra.
```json
{ "plantilla": "personaje", "datos": { "personaje": "lesseps", "anios": "1805-1894", "rol": "El francés que construyó el canal de Suez", "palabra_anios": "Lesseps", "palabra_rol": "francés" } }
```

### `cita` — 5 a 8 s
Una frase entre comillas en una hoja de papel; a la izquierda, el medallón del personaje con su rol; debajo, autor y fuente. Las palabras se encienden al paso de la voz. Solo citas comprobadas (si se citan con distintas palabras, dilo en la fuente: «traducción», «según…»).
Datos: `texto` (150 letras, sin comillas), `personaje` (o rasgos; sin él, la hoja sola en el centro), `autor` (por defecto el nombre de la ficha, 30), `fuente` (50), `rol` (30, bajo el medallón), `medallon: false`.
```json
{ "plantilla": "cita", "datos": { "personaje": "roosevelt", "expresion": "astuto", "texto": "Tomé el istmo, empecé el canal y dejé al Congreso debatiendo", "fuente": "Discurso en Berkeley, 1911 (traducción)" } }
```

### `cifra` — 4 a 6 s
Un número grande que cuenta desde 0, con moneda, unidad y rótulo, sobre una tarjeta con marco de documento; o 2 o 3 cifras comparadas, cada una con su barra.
Datos (una): `valor` (número: sale «20.000») o `cifra` (texto, no cuenta), `moneda` ("US$"), `unidad` ("millones", 14 letras), `antes` ("unas", 24), `rotulo` (44), `dibujo`, `contar: false`, `decimales`, `palabra`|`en`, `palabra_rotulo`.
Datos (comparar): `cifras`: [{ `valor`, `moneda`, `unidad`, `rotulo` (30), `palabra`|`en`, `resalta: true` }], `titulo` (40), `barras` (por defecto solo si todas tienen la misma unidad).
```json
{ "plantilla": "cifra", "datos": { "valor": 20000, "antes": "unas", "rotulo": "personas murieron, quizá más", "dibujo": "cruz", "palabra": "veinte", "palabra_rotulo": "personas" } }
{ "plantilla": "cifra", "datos": { "titulo": "El precio de los derechos franceses", "cifras": [{ "valor": 109, "moneda": "US$", "unidad": "millones", "rotulo": "Primer precio", "en": 0.02 }, { "valor": 40, "moneda": "US$", "unidad": "millones", "rotulo": "Nuevo precio", "palabra": "40", "resalta": true }] } }
```

### `linea-tiempo` — 5 a 8 s
De 3 a 7 hitos de izquierda a derecha sobre un riel; cada uno con su año y su texto en una tarjeta. El hito `actual` (el momento de la historia) se resalta con una flecha y el riel se enciende hasta él; los que vienen después quedan tenues.
Datos: `hitos`: [{ `anio` (9 caracteres), `texto` (60 letras con 3 hitos, 48 con 5, 36 con 7), `palabra` (opcional: sin ella, todos entran al empezar) }], `actual` (número desde 0 o el año), `palabra_actual` (si no, cuando se dice su año), `titulo` (40).
```json
{ "plantilla": "linea-tiempo", "datos": { "titulo": "La Guerra de los Mil Días", "actual": 1, "palabra_actual": "estalló", "hitos": [{ "anio": "1886", "texto": "Una Constitución centraliza el poder" }, { "anio": "1899", "texto": "Estalla la guerra entre liberales y conservadores" }, { "anio": "1902", "texto": "Paz firmada en la bahía de Panamá" }, { "anio": "1903", "texto": "Panamá se separa de Colombia" }] } }
```

### `recorte` — 4 a 8 s
Un documento o una foto real (caricatura, portada, estampilla, acta) como pieza central, con cinta y pie; la cámara se acerca despacio y un círculo de tinta roja puede marcar un detalle. Al lado, insignia, título y nota.
Datos: `foto` (obligatoria), `pie` (50), `insignia` ("Puck, 1903", 24), `titulo` (34), `texto` (90), `lado` (`izquierda`: la foto a la izquierda; o `derecha`), `marca` { `x`, `y` (de 0 a 1 sobre la foto), `r` (radio, fracción del ancho), `palabra`|`en` }, `palabras` { `foto`, `titulo`, `texto` }. Sin título ni texto, la foto va sola y grande.
```json
{ "plantilla": "recorte", "datos": { "foto": "File:Momotombo 1900 Edition Stamp.jpg", "pie": "Estampilla de Nicaragua (1900)", "insignia": "Nicaragua, 1900", "titulo": "La estampilla del volcán", "texto": "Enviada a los senadores en 1902", "marca": { "x": 0.5, "y": 0.42, "r": 0.3, "palabra": "volcán" }, "palabras": { "titulo": "estampilla", "texto": "senadores" } } }
```

### `fichas` — 5 a 8 s
De 2 a 4 tarjetas con dibujo y rótulo que entran al paso de la voz (causas, peligros, condiciones, órdenes). La que va `resalta` queda en rojo y su dibujo se mueve (el mosquito zumba). Con `foto`, la foto a la izquierda y las tarjetas en columna; sin ella, en fila.
Datos: `fichas`: [{ `texto` (26 letras), `dibujo`, `palabra`|`en`, `resalta` }], `titulo` (40), `foto`, `foto_pie` (40).
```json
{ "plantilla": "fichas", "datos": { "titulo": "No era el desierto egipcio", "foto": "File:125-French method of excavation in Culebra Cut.jpg", "foto_pie": "Excavación francesa en el corte Culebra (1896)", "fichas": [{ "texto": "Derrumbes", "dibujo": "derrumbe", "palabra": "derrumbes" }, { "texto": "Lluvias sin fin", "dibujo": "lluvia", "palabra": "lluvias" }, { "texto": "Fiebre amarilla y malaria", "dibujo": "mosquito", "palabra": "fiebre", "resalta": true }] } }
```

### `vehiculo` — 4 a 7 s
Un tren de vapor (selva y montañas), un barco (mar) o una draga (pala de vapor en el fondo de una excavación con terrazas) que entra a la escena, con sello del año, título, dato y foto opcional.
Datos: `tipo`: `tren`|`barco`|`draga`, `guerra: true` (barco: buque de guerra blanco con cañones), `quieta: true` (draga: abandonada, oxidada, con maleza), `anio`, `rotulo` (24 letras), `detalle` (32), `bandera` (barco), `foto`, `foto_pie` (40), `palabras` { `anio`, `entra`, `rotulo`, `detalle`, `foto` }.
```json
{ "plantilla": "vehiculo", "datos": { "tipo": "barco", "guerra": true, "bandera": "eeuu", "anio": "1903", "rotulo": "USS Nashville", "detalle": "Cañonero de EE. UU. en Colón", "foto": "File:Uss Nashville PG-7.jpg", "foto_pie": "El Nashville (foto de época)", "palabras": { "anio": "noviembre", "entra": "llegó", "rotulo": "cañonero", "detalle": "Colón" } } }
{ "plantilla": "vehiculo", "datos": { "tipo": "draga", "anio": "1904", "rotulo": "Empiezan las obras", "detalle": "Esta vez, con esclusas", "palabras": { "anio": "1904", "entra": "Estados", "rotulo": "empezó", "detalle": "vez" } } }
```

### `tablero` — 5 a 8 s
Tablero de investigación: hasta 3 retratos dibujados, hasta 2 recortes reales con su pie e hilo rojo entre ellos, y un título abajo. Para presentar a los protagonistas y las pruebas.
Datos: `personajes` (ids de la ficha u objetos; el nombre corto va solo), `papeles`: [{ `foto`, `pie` (40) }], `titulo` (30), `palabras` { `personajes`, `papeles`, `hilos`, `titulo` }.
```json
{ "plantilla": "tablero", "datos": { "personajes": ["roosevelt", "marroquin", { "personaje": "bunau", "sombrero": "bombin" }], "papeles": [{ "foto": "File:Panama canal cartoon 1903.jpg", "pie": "Caricatura estadounidense de 1903" }, { "foto": "File:Panam2.JPG", "pie": "«The News Reaches Bogotá», 1903" }], "titulo": "Lo que dicen los documentos", "palabras": { "personajes": "Esta", "papeles": "contada", "hilos": "documentos", "titulo": "contada" } } }
```

### `cadena` — 5 a 7 s
Una cadena de hierro con 2 o 3 placas que cuelgan al decirse sus palabras; al final la cámara se corre hacia atrás hasta los años de donde viene.
Datos: `eslabones`: [{ `texto` (12 letras), `palabra` }], `anios` (hasta 4), `palabra_atras`, `rotulo_atras` (24).
```json
{ "plantilla": "cadena", "datos": { "eslabones": [{ "texto": "errores" }, { "texto": "cálculos" }, { "texto": "intereses" }], "anios": ["1821", "1855", "1880"], "palabra_atras": "que", "rotulo_atras": "Viene de muy atrás" } }
```

### `capitulo` — la pausa antes del capítulo
Tarjeta de capítulo (marco doble, «Capítulo II» y el título). Normalmente no se escribe: es automática. Datos: `numero` ("Capítulo II", 20 letras), `titulo` (26).

### Plantillas verticales en horizontal
Las de los Shorts (`dato-grande`, `lupa`, `comparacion`, `lista-pasos`…) también funcionan, pero dibujadas en vertical en el centro, con los lados vacíos. En un video largo, usa las de esta lista.
