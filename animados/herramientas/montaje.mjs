// montaje.mjs - Arma el index.html de un video animado, sus escenas de plantilla y sus subtitulos.
//
// Uso (desde la raiz del proyecto):
//   node animados/herramientas/montaje.mjs animados/videos/<video> [--sin-voz]
//
// Lee   <video>/guion.json y <video>/tiempos.json (lo deja voz.mjs)
// Deja  <video>/index.html                 (fondo, una ranura por escena, subtitulos y audio)
//       <video>/compositions/<escena>.html (solo las escenas que el guion pide por plantilla)
//       <video>/compositions/subtitulos.html
//
// index.html lleva los tiempos de la voz dentro (window.__tiempos), asi que las escenas no
// escriben segundos a mano: preguntan cuando se dice cada cosa con window.__reloj.
// Si cambia la voz, se corre voz.mjs y montaje.mjs otra vez y todo queda sincronizado.
//
// Plantillas: si el guion trae  "escenas": { "<id>": { "plantilla": "<nombre>", "datos": {...} } }
// la escena <id> sale de animados/plantillas/<nombre>.html. Dentro de una plantilla:
//   {{id}}            el id de la escena (prefijo de todos sus ids y clases)
//   {{d.ruta.0.x}}    un dato (los del guion, "datos", mas los de la escena), escapado para HTML
//   {{{d.ruta}}}      el mismo dato sin escapar (para SVG)
//   {{d.ruta|resp}}   dato opcional (si falta, queda "resp", que puede ser vacio); {{{d.ruta|}}} sin escapar
//   {{datos}}        todos los datos como JSON, para el script
//   {{>nombre}}       incluye animados/plantillas/_nombre.html
// Todo objeto de los datos con "icono": "<nombre>" recibe "icono_svg" desde iconos.json, y con
// "ilustracion": "<nombre>" (o "ilustracion_<algo>") recibe "ilustracion_svg" desde ilustraciones.json.
//
// Temas (videos propios del Narrador): "estilo": { "tema": "archivo" | "laboratorio" | "pizarra" }
// cambia el fondo, la letra, los colores (variables CSS --tinta, --acento, --papel...) y los
// subtitulos. "fondo" y "brillo" siguen valiendo para variar la paleta dentro del tema.
// Sin "tema", el video sale exactamente como siempre (los del Animador).
//
// --sin-voz deja el video mudo (mismos tiempos, sin el audio).
//
// Horizontal (videos de YouTube hechos con escenas): "orientacion": "horizontal" en el guion pone
// el lienzo en 1920x1080. En una plantilla:
//   {{?h}}...{{/h}}   solo en horizontal;  {{?v}}...{{/v}}  solo en vertical
//   {{ancho}}, {{alto}}  el tamano del lienzo
// Una plantilla que dice en su cabecera "Horizontal: propio" trae su propio diseno horizontal; las
// demas, en horizontal, se dibujan igual que en vertical dentro de un escenario centrado (su zona
// de dibujo de 190 a 1100 px, un poco reducida). "Solo horizontal" no se deja usar en vertical.
//
// Cortes dentro de una frase: "cortes": [{ "escena": "<id>", "palabra": 9 | "texto" | "fin" }] en una
// frase hace que la escena <id> empiece en esa palabra (o al terminar la frase, con "fin"), aunque
// la frase siga. Sirve para que las frases largas no se queden en una sola escena. La escena nueva
// necesita su plantilla en "escenas" como cualquier otra.
//
// Fotos: un dato "foto" (o "foto_<algo>") con el nombre de un archivo de Wikimedia Commons que ya
// este en animados/.imagenes-cache/ (lo baja largo.mjs, con su licencia revisada) se copia a
// assets/fotos/ y la plantilla recibe "foto_src", "foto_ancho", "foto_alto" y "foto_credito".
//
// Ficha de personajes: "personajes": { "<id>": { nombre, rol, ...rasgos de _figura-js.html } } en el
// guion. En los datos de una escena, un objeto con "personaje": "<id>" recibe la ficha (lo que traiga
// el objeto manda encima: pose, expresion...), y en una lista "personajes" basta el id (escenas.mjs).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { aplicaCortes, conPersonajes } from "./escenas.mjs";
import { TEMAS } from "./temas.mjs";

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const PLANTILLAS = path.resolve(AQUI, "..", "plantillas");
const CACHE_IMAGENES = path.resolve(AQUI, "..", ".imagenes-cache");

const carpeta = process.argv[2] ? path.resolve(process.argv[2]) : null;
const sinVoz = process.argv.includes("--sin-voz");
if (!carpeta || !fs.existsSync(path.join(carpeta, "tiempos.json"))) {
  console.error("Uso: node animados/herramientas/montaje.mjs <carpeta-del-video> [--sin-voz]  (corre antes voz.mjs)");
  process.exit(1);
}
const guion = JSON.parse(fs.readFileSync(path.join(carpeta, "guion.json"), "utf8"));
const tiempos = JSON.parse(fs.readFileSync(path.join(carpeta, "tiempos.json"), "utf8"));
if (!tiempos.escenas) {
  console.error("tiempos.json no trae escenas: vuelve a correr voz.mjs.");
  process.exit(1);
}

const r2 = (n) => Math.round(n * 100) / 100;
const r3 = (n) => Math.round(n * 1000) / 1000;
const total = Math.ceil(tiempos.duracion * 100) / 100;
const norma = (s) =>
  String(s)
    .normalize("NFD")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();
const escapa = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// ---------- Lienzo ----------
const orientacion = guion.orientacion || "vertical";
if (!["vertical", "horizontal"].includes(orientacion)) throw new Error(`"orientacion" es "vertical" (por defecto) u "horizontal" (llego "${orientacion}").`);
const HORIZONTAL = orientacion === "horizontal";
const W = HORIZONTAL ? 1920 : 1080;
const H = HORIZONTAL ? 1080 : 1920;

// ---------- Cortes de escena dentro de una frase ----------
// Las ventanas de escena salen de tiempos.json (una por grupo de frases). Un corte parte una
// ventana en la palabra pedida: la escena nueva empieza un instante antes de que se diga
// (escenas.mjs, que tambien usa largo-escenas.mjs).
let escenasFinales = tiempos.escenas.map((e) => ({ ...e }));
const conCortes = (guion.frases || []).some((f) => Array.isArray(f.cortes) && f.cortes.length);
if (conCortes) escenasFinales = aplicaCortes(escenasFinales, guion.frases, tiempos.frases);

// ---------- Fotos de la cache de Commons ----------
let fichasCache = null;
function buscaFoto(nombre) {
  if (!fichasCache) {
    fichasCache = fs.existsSync(CACHE_IMAGENES)
      ? fs
          .readdirSync(CACHE_IMAGENES)
          .filter((n) => n.endsWith(".json"))
          .map((n) => JSON.parse(fs.readFileSync(path.join(CACHE_IMAGENES, n), "utf8")))
      : [];
  }
  const limpio = (s) => String(s).replace(/^(File|Archivo):/i, "").replace(/_/g, " ").trim().toLowerCase();
  const ficha = fichasCache.find((f) => limpio(f.titulo) === limpio(nombre));
  if (!ficha || !ficha.archivo || !fs.existsSync(path.join(CACHE_IMAGENES, ficha.archivo))) {
    throw new Error(`La foto "${nombre}" no esta en animados/.imagenes-cache/ (se baja con el video largo, que revisa su licencia).`);
  }
  if (ficha.no_libre) throw new Error(`La foto "${nombre}" no tiene una licencia libre (${ficha.licencia}).`);
  const destino = path.join(carpeta, "assets", "fotos", ficha.archivo);
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  if (!fs.existsSync(destino) || fs.statSync(destino).size !== fs.statSync(path.join(CACHE_IMAGENES, ficha.archivo)).size) {
    fs.copyFileSync(path.join(CACHE_IMAGENES, ficha.archivo), destino);
  }
  return { src: "assets/fotos/" + ficha.archivo, ancho: ficha.ancho, alto: ficha.alto, credito: [ficha.autor, ficha.licencia].filter(Boolean).join(" · ") };
}

// ---------- Escenas de plantilla ----------
const dirEscenas = path.join(carpeta, "compositions");
fs.mkdirSync(dirEscenas, { recursive: true });
const leeJson = (nombre) => (fs.existsSync(path.join(PLANTILLAS, nombre)) ? JSON.parse(fs.readFileSync(path.join(PLANTILLAS, nombre), "utf8")) : {});
const iconos = leeJson("iconos.json");
const heroes = leeJson("heroes.json"); // dibujos principales por tipo de negocio
const ilustraciones = leeJson("ilustraciones.json"); // dibujos de los videos propios (Narrador)

// ---------- Temas de los videos propios (Narrador) ----------
// Viven en temas.mjs (los comparte largo.mjs, el de los videos largos de YouTube). Cada tema
// define variables CSS que usan las plantillas del Narrador y los subtitulos, el fondo y la letra.
const temaPedido = guion.estilo && guion.estilo.tema;

if (temaPedido && !TEMAS[temaPedido]) {
  throw new Error(`estilo.tema "${temaPedido}" no existe. Los que hay: ${Object.keys(TEMAS).join(", ")}`);
}
const tema = temaPedido ? TEMAS[temaPedido] : null;

// Paleta del video: "estilo": { "fondo": "#0d2029", "brillo": "#1f4a58" } en el guion.
// De esos dos colores salen los tonos de paneles y tarjetas, para que todo combine.
const hex = (c) => [1, 3, 5].map((i) => parseInt(String(c).slice(i, i + 2), 16));
const aHex = (rgb) => "#" + rgb.map((n) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, "0")).join("");
const mezcla = (a, b, parte) => aHex(hex(a).map((n, i) => n + (hex(b)[i] - n) * parte));
const estilo = tema
  ? { fondo: tema.fondo, brillo: tema.brillo, ...guion.estilo }
  : { fondo: "#0d2029", brillo: "#1f4a58", ...(guion.estilo || {}) };
for (const clave of ["fondo", "brillo"]) {
  if (!/^#[0-9a-fA-F]{6}$/.test(estilo[clave])) throw new Error(`estilo.${clave} debe ser un color como #0d2029 (llego "${estilo[clave]}").`);
}
const paleta = {
  fondo: estilo.fondo,
  brillo: estilo.brillo,
  brilloFin: `rgba(${hex(estilo.brillo).join(", ")}, 0)`,
  panel: mezcla(estilo.fondo, estilo.brillo, 0.4),
  panelB: mezcla(estilo.fondo, estilo.brillo, 0.9),
  panel2: mezcla(estilo.brillo, "#ffffff", 0.07),
  panel3: mezcla(estilo.brillo, "#ffffff", 0.14),
};

function conIconos(valor) {
  if (Array.isArray(valor)) return valor.map(conIconos);
  if (valor && typeof valor === "object") {
    const copia = Object.fromEntries(Object.entries(valor).map(([k, v]) => [k, conIconos(v)]));
    if (typeof copia.icono === "string") {
      if (!iconos[copia.icono]) throw new Error(`No existe el icono "${copia.icono}". Los que hay: ${Object.keys(iconos).join(", ")}`);
      copia.icono_svg = iconos[copia.icono];
    }
    if (typeof copia.heroe === "string") {
      if (!heroes[copia.heroe]) throw new Error(`No existe el dibujo "${copia.heroe}". Los que hay: ${Object.keys(heroes).join(", ")}`);
      copia.heroe_svg = heroes[copia.heroe];
    }
    for (const [clave, v] of Object.entries(copia)) {
      if (!/^ilustracion(_[a-z0-9]+)?$/.test(clave) || typeof v !== "string" || !v) continue;
      if (!ilustraciones[v]) throw new Error(`No existe la ilustracion "${v}". Las que hay: ${Object.keys(ilustraciones).join(", ")}`);
      copia[clave + "_svg"] = ilustraciones[v];
    }
    for (const [clave, v] of Object.entries(copia)) {
      // Solo los valores que son un archivo de imagen (asi "foto_pie" o "foto_credito" siguen siendo texto).
      if (!/^foto(_[a-z0-9]+)?$/.test(clave) || typeof v !== "string" || !/\.(jpe?g|png|gif|tiff?|webp)$/i.test(v)) continue;
      const f = buscaFoto(v);
      Object.assign(copia, { [clave + "_src"]: f.src, [clave + "_ancho"]: f.ancho, [clave + "_alto"]: f.alto, [clave + "_credito"]: f.credito });
    }
    return copia;
  }
  return valor;
}

function busca(datos, ruta) {
  return ruta.split(".").reduce((v, clave) => (v === undefined || v === null ? undefined : v[clave]), datos);
}

function expande(nombre, id, datos) {
  const archivo = path.join(PLANTILLAS, nombre + ".html");
  if (!fs.existsSync(archivo)) throw new Error(`No existe la plantilla "${nombre}" (${archivo}).`);
  let texto = fs.readFileSync(archivo, "utf8");
  // Las plantillas del Narrador dicen en su cabecera que necesitan un tema.
  if (!tema && /Necesita "estilo\.tema"/.test(texto)) {
    throw new Error(`La plantilla "${nombre}" es de los videos propios: el guion necesita "estilo": { "tema": "archivo" | "laboratorio" | "pizarra" }.`);
  }
  if (!HORIZONTAL && /Solo horizontal/.test(texto)) {
    throw new Error(`La plantilla "${nombre}" es solo para videos horizontales: el guion necesita "orientacion": "horizontal".`);
  }
  const disenoHorizontal = /Horizontal: propio|Solo horizontal/.test(texto);
  for (let vuelta = 0; vuelta < 3; vuelta++) {
    texto = texto.replace(/\{\{>([a-z0-9-]+)\}\}/g, (_, parcial) => {
      const ruta = path.join(PLANTILLAS, "_" + parcial + ".html");
      if (!fs.existsSync(ruta)) throw new Error(`La plantilla "${nombre}" incluye "${parcial}", que no existe.`);
      return fs.readFileSync(ruta, "utf8").replace(/\s+$/, "");
    });
  }
  // Bloques de una sola orientacion: {{?h}}...{{/h}} y {{?v}}...{{/v}}. Si ocupan renglones enteros,
  // se van con sus saltos de linea (asi la otra orientacion queda exactamente igual que sin ellos).
  const deja = (o) => (o === "h") === HORIZONTAL;
  texto = texto
    .replace(/^[ \t]*\{\{\?(h|v)\}\}[ \t]*\r?\n([\s\S]*?)^[ \t]*\{\{\/\1\}\}[ \t]*\r?\n/gm, (_, o, dentro) => (deja(o) ? dentro : ""))
    .replace(/\{\{\?(h|v)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (_, o, dentro) => (deja(o) ? dentro : ""))
    .replace(/\{\{ancho\}\}/g, String(W))
    .replace(/\{\{alto\}\}/g, String(H));
  // En horizontal, una plantilla sin diseno propio se dibuja como en vertical dentro de un escenario
  // de 1080 de ancho, reducido y centrado: su zona de dibujo (190 a 1100 px) queda entre 82 y 920.
  if (HORIZONTAL && !disenoHorizontal) {
    const abre = texto.match(/<div id="root"[^>]*>/);
    const guion0 = abre ? texto.indexOf("<script>", abre.index) : -1;
    const cierra = guion0 > 0 ? texto.lastIndexOf("</div>", guion0) : -1;
    if (!abre || cierra < 0) throw new Error(`No pude acomodar la plantilla "${nombre}" en horizontal (no encuentro su #root).`);
    const fin = abre.index + abre[0].length;
    const s = 0.92;
    const escenario = `\n    <div class="${id}-escenario-v" data-layout-allow-overflow style="position: absolute; left: ${Math.round(960 - 540 * s)}px; top: ${Math.round(500 - 645 * s)}px; width: 1080px; height: 1100px; transform-origin: 0 0; transform: scale(${s})">`;
    texto = texto.slice(0, fin) + escenario + texto.slice(fin, cierra) + "  </div>\n  " + texto.slice(cierra);
  }
  const faltan = new Set();
  const dato = (ruta) => {
    const v = busca(datos, ruta);
    if (v === undefined || v === null) faltan.add(ruta);
    return v ?? "";
  };
  texto = texto
    // {{{d.ruta|respaldo}}}: dato opcional sin escapar (una ilustracion que puede no venir).
    .replace(/\{\{\{d\.([\w.]+)\|([^}]*)\}\}\}/g, (_, ruta, respaldo) => String(busca(datos, ruta) ?? respaldo))
    // {{d.ruta|respaldo}}: dato opcional; si falta, queda el respaldo (puede ser vacio).
    .replace(/\{\{d\.([\w.]+)\|([^}]*)\}\}/g, (_, ruta, respaldo) => escapa(busca(datos, ruta) ?? respaldo))
    .replace(/\{\{\{d\.([\w.]+)\}\}\}/g, (_, ruta) => String(dato(ruta)))
    .replace(/\{\{d\.([\w.]+)\}\}/g, (_, ruta) => escapa(dato(ruta)))
    .replace(/\{\{datos\}\}/g, () => JSON.stringify(datos).replace(/</g, "\\u003c"))
    .replace(/\{\{id\}\}/g, id);
  if (faltan.size) throw new Error(`A la escena "${id}" (plantilla "${nombre}") le faltan datos: ${[...faltan].join(", ")}`);
  return `<!-- Generado por montaje.mjs desde animados/plantillas/${nombre}.html. No editar a mano: cambia el guion o la plantilla. -->\n` + texto;
}

const pedidas = guion.escenas || {};
for (const e of escenasFinales) {
  const pedida = pedidas[e.id];
  const destino = path.join(dirEscenas, e.id + ".html");
  if (pedida && pedida.plantilla) {
    let datos;
    try {
      // Los personajes de la ficha del guion ("personajes") entran antes que los iconos y las fotos.
      datos = conIconos(conPersonajes({ ...(guion.datos || {}), ...(pedida.datos || {}) }, guion.personajes));
    } catch (error) {
      throw new Error(`Escena "${e.id}": ${error.message}`);
    }
    fs.writeFileSync(destino, expande(pedida.plantilla, e.id, datos), "utf8");
  } else if (!fs.existsSync(destino)) {
    console.warn(`Aviso: falta compositions/${e.id}.html y el guion no le da plantilla (la escena "${e.id}" saldra vacia).`);
  }
}

// ---------- index.html ----------
// Lo minimo que las escenas necesitan saber de la voz.
const ultima = escenasFinales.at(-1).id;
// Con cortes, una frase puede tocar dos escenas: cada escena lista las frases que suenan en ella.
// Una escena sin voz (una tarjeta en una pausa) se queda con la frase anterior, para que su reloj funcione.
// Una tarjeta al empezar (antes de la primera frase, como la de un capitulo de un video largo) se
// queda con la frase siguiente.
const frasesDe = (e, fin) => {
  let lista;
  if (!conCortes) lista = tiempos.frases.filter((f) => f.escena === e.id);
  else {
    const suenan = tiempos.frases.filter((f) => f.inicio < fin - 0.05 && f.fin > e.inicio + 0.05);
    lista = suenan.length ? suenan : tiempos.frases.filter((f) => f.fin <= e.inicio + 0.05).slice(-1);
  }
  return lista.length ? lista : tiempos.frases.filter((f) => f.inicio >= e.inicio).slice(0, 1);
};
const datosReloj = {
  escenas: Object.fromEntries(
    escenasFinales.map((e) => {
      const fin = e.id === ultima ? total : e.fin;
      return [e.id, { inicio: e.inicio, fin, frases: frasesDe(e, fin).map((f) => f.id) }];
    }),
  ),
  frases: Object.fromEntries(
    tiempos.frases.map((f) => [f.id, { inicio: f.inicio, fin: f.fin, palabras: f.palabras.map((p) => p.inicio), textos: f.palabras.map((p) => norma(p.texto)) }]),
  ),
};

const ranuras = escenasFinales
  .map((e) => {
    const fin = datosReloj.escenas[e.id].fin;
    return `      <div
        id="${e.id}"
        data-composition-id="${e.id}"
        data-composition-src="compositions/${e.id}.html"
        data-start="${e.inicio}"
        data-duration="${r2(fin - e.inicio)}"
        data-track-index="1"
        data-track-kind="graphics"
        data-width="${W}"
        data-height="${H}"
        style="z-index: 1"
      ></div>`;
  })
  .join("\n");

const audio = sinVoz
  ? ""
  : `
      <audio
        id="narracion"
        class="clip"
        data-start="0"
        data-duration="${total}"
        data-track-index="3"
        data-volume="1"
        src="${tiempos.audio}"
      ></audio>`;

// Piezas del tema. Sin tema quedan vacias (o con su valor de siempre) y el index.html sale
// identico al de antes.
const attrTema = tema ? ` data-tema="${temaPedido}"` : "";
const enlaceFuentes = tema && tema.google ? `\n    <link rel="stylesheet" href="${tema.google}" />` : "";
const jsTema =
  (tema
    ? `\n\n      // Tema visual (videos propios): nombre y ancho medio de una letra (en em) para ajustar textos.\n      window.__tema = ${JSON.stringify({ nombre: temaPedido, ...tema.anchos })};`
    : "") + (HORIZONTAL ? `\n\n      // Lienzo horizontal (1920x1080).\n      window.__lienzo = ${JSON.stringify({ ancho: W, alto: H, horizontal: true })};` : "");
// Con cortes, el principio y el fin de una frase se cuentan dentro de la escena (una frase puede
// empezar antes que la escena o terminar despues).
const iniFin = conCortes
  ? `ini: (ref = 0) => Math.max(0, frase(ref).inicio - e.inicio),
          fin: (ref = 0) => Math.max(0, Math.min(e.fin - e.inicio, frase(ref).fin - e.inicio)),`
  : `ini: (ref = 0) => frase(ref).inicio - e.inicio,
          fin: (ref = 0) => frase(ref).fin - e.inicio,`;
const ranuraSubtitulos =
  guion.subtitulos === false
    ? ""
    : `
      <div
        id="subtitulos"
        data-composition-id="subtitulos"
        data-composition-src="compositions/subtitulos.html"
        data-start="0"
        data-duration="${total}"
        data-track-index="2"
        data-track-kind="captions"
        data-width="${W}"
        data-height="${H}"
        style="z-index: 5"
      ></div>`;
const varsTema = tema
  ? "\n" + Object.entries({ "--papel": paleta.fondo, ...tema.vars }).map(([k, v]) => `        ${k}: ${v};`).join("\n")
  : "";
const fuenteRaiz = tema ? "var(--fuente-texto)" : '"Nunito", sans-serif';
const fondoCss = tema
  ? tema.fondoCss(paleta)
  : `
          radial-gradient(ellipse 70% 42% at 50% 40%, ${paleta.brillo} 0%, ${paleta.brilloFin} 100%),
          radial-gradient(ellipse 90% 30% at 50% 100%, rgba(0, 0, 0, 0.42) 0%, rgba(0, 0, 0, 0) 100%),
          ${paleta.fondo}`;
// Estas clases tambien le dicen al compilador de HyperFrames que letras del tema debe incrustar.
const reglasTema = tema
  ? `
      .tema-titulo {
        font-family: var(--fuente-titulo);
        font-weight: var(--peso-titulo);
      }
      .tema-cifra {
        font-family: var(--fuente-cifra);
        font-weight: var(--peso-titulo);
      }
      .tema-sub {
        font-family: var(--fuente-sub);
        font-weight: var(--peso-sub);
      }`
  : "";

const html = `<!doctype html>
<!-- Generado por animados/herramientas/montaje.mjs a partir de tiempos.json. No editar a mano. -->
<html lang="es" data-resolution="${HORIZONTAL ? "landscape" : "portrait"}"${attrTema}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${W}, height=${H}" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>${enlaceFuentes}
    <script>
      // Tiempos de la voz, en segundos del video.
      window.__tiempos = ${JSON.stringify(datosReloj)};${jsTema}

      // Reloj de una escena: devuelve segundos contados desde que la escena empieza.
      // Una frase se nombra por su id ("f2") o por su puesto dentro de la escena (0, 1...).
      //   const r = window.__reloj("problema");
      //   r.p("f2", 3)             cuando se dice la palabra 3 (la primera es 0) de la frase f2
      //   r.palabra(0, "comen")    cuando se dice esa palabra en la primera frase de la escena
      //   r.en(0, 0.5)             la mitad de la primera frase
      //   r.ini(0), r.fin(0)       donde empieza y termina
      //   r.dur                    cuanto dura la escena
      window.__reloj = (escena) => {
        const T = window.__tiempos;
        const e = T.escenas[escena];
        if (!e) throw new Error('La escena "' + escena + '" no esta en el guion.');
        const frase = (ref) => {
          const id = typeof ref === "number" ? e.frases[Math.min(ref, e.frases.length - 1)] : ref;
          const f = T.frases[id];
          if (!f) throw new Error('La frase "' + ref + '" no esta en la escena "' + escena + '".');
          return f;
        };
        const norma = (s) => String(s).normalize("NFD").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
        const en = (ref, parte) => {
          const f = frase(ref);
          return f.inicio + (f.fin - f.inicio) * parte - e.inicio;
        };
        return {
          dur: e.fin - e.inicio,
          p: (ref, i = 0) => {
            const palabras = frase(ref).palabras;
            return palabras[Math.min(i, palabras.length - 1)] - e.inicio;
          },
          ${iniFin}
          en,
          // Si la palabra no esta en la frase, cae en \`respaldo\` (una parte de la frase, de 0 a 1).
          palabra: (ref, texto, respaldo = 0.5) => {
            const f = frase(ref);
            const buscada = norma(texto);
            const i = buscada ? f.textos.findIndex((t) => t === buscada || t.startsWith(buscada)) : -1;
            return i >= 0 ? f.palabras[i] - e.inicio : en(ref, respaldo);
          },
        };
      };

      // Movimientos de la casa. Todos reciben la linea de tiempo de la escena.
      window.__fx = {
        // Entra con rebote. \`desde\` suma un punto de partida: { y: 80 }, { x: -300, rotation: -12 }...
        entra(tl, sel, t, desde = {}, dur = 0.34) {
          const hasta = { opacity: 1, scale: 1, duration: dur, ease: "back.out(2)" };
          for (const k of ["x", "y", "rotation"]) if (k in desde) hasta[k] = 0;
          return tl.fromTo(sel, { opacity: 0, scale: 0.3, ...desde }, hasta, t);
        },
        // Sale encogiendose. \`hacia\` suma un destino: { y: 200 }.
        sale(tl, sel, t, hacia = {}, dur = 0.22) {
          return tl.to(sel, { opacity: 0, scale: 0.6, duration: dur, ease: "power2.in", ...hacia }, t);
        },
        // Vaiven suave entre t y fin; siempre vuelve al punto de partida. Usa un elemento
        // que no tenga otro movimiento en y (un envoltorio interior).
        flota(tl, sel, t, fin, amp = 8, periodo = 1.1) {
          const idas = 2 * Math.max(1, Math.floor((fin - t) / (2 * periodo)));
          return tl.fromTo(sel, { y: 0 }, { y: -amp, duration: periodo, ease: "sine.inOut", repeat: idas - 1, yoyo: true }, t);
        },
        // Salto de enfasis sobre algo que ya esta en pantalla.
        golpe(tl, sel, t, escala = 1.14) {
          tl.to(sel, { scale: escala, duration: 0.1, ease: "power2.out" }, t);
          return tl.to(sel, { scale: 1, duration: 0.26, ease: "back.out(3)" }, t + 0.1);
        },
        // Temblor corto. Usa un elemento que no tenga otro movimiento en x.
        tiembla(tl, sel, t, veces = 5, amp = 9) {
          return tl.fromTo(sel, { x: 0 }, { x: amp, duration: 0.05, repeat: veces * 2 - 1, yoyo: true, ease: "sine.inOut" }, t);
        },
      };
    </script>
    <style>
      :root {
        --fondo: ${paleta.fondo};
        --brillo: ${paleta.brillo};
        --panel: ${paleta.panel};
        --panel-b: ${paleta.panelB};
        --panel2: ${paleta.panel2};
        --panel3: ${paleta.panel3};
        --tinta: #fbf7ef;
        --acento: #ffc93c;${varsTema}
      }
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      html,
      body {
        margin: 0;
        width: ${W}px;
        height: ${H}px;
        overflow: hidden;
        background: var(--fondo);
      }
      #root {
        position: relative;
        width: ${W}px;
        height: ${H}px;
        overflow: hidden;
        font-family: ${fuenteRaiz};
        color: var(--tinta);
      }
      #fondo {
        position: absolute;
        inset: 0;
        background:${fondoCss};
      }${reglasTema}
    </style>
  </head>
  <body>
    <div
      id="root"
      data-composition-id="main"
      data-start="0"
      data-duration="${total}"
      data-width="${W}"
      data-height="${H}"
    >
      <div id="fondo"></div>

${ranuras}
${ranuraSubtitulos}
${audio}
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      const tl = gsap.timeline({ paused: true });
      window.__timelines["main"] = tl;
      tl.seek(0);
    </script>
  </body>
</html>
`;

fs.writeFileSync(path.join(carpeta, "index.html"), html, "utf8");
const dePlantilla = escenasFinales.filter((e) => pedidas[e.id] && pedidas[e.id].plantilla).length;
console.log(`Listo: index.html (${escenasFinales.length} escenas, ${dePlantilla} de plantilla, ${total} s${sinVoz ? ", sin voz" : ""}${tema ? ", tema " + temaPedido : ""}${HORIZONTAL ? ", horizontal" : ""})`);
escenasFinales.forEach((e) =>
  console.log(`  ${String(e.inicio).padStart(6)} - ${String(datosReloj.escenas[e.id].fin).padEnd(6)} ${e.id}${pedidas[e.id]?.plantilla ? "  <- " + pedidas[e.id].plantilla : ""}`),
);

// Los subtitulos salen del mismo tiempos.json.
await import("./subtitulos.mjs");
