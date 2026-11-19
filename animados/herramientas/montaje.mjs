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

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const PLANTILLAS = path.resolve(AQUI, "..", "plantillas");

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
const total = Math.ceil(tiempos.duracion * 100) / 100;
const norma = (s) =>
  String(s)
    .normalize("NFD")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();
const escapa = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// ---------- Escenas de plantilla ----------
const dirEscenas = path.join(carpeta, "compositions");
fs.mkdirSync(dirEscenas, { recursive: true });
const leeJson = (nombre) => (fs.existsSync(path.join(PLANTILLAS, nombre)) ? JSON.parse(fs.readFileSync(path.join(PLANTILLAS, nombre), "utf8")) : {});
const iconos = leeJson("iconos.json");
const heroes = leeJson("heroes.json"); // dibujos principales por tipo de negocio
const ilustraciones = leeJson("ilustraciones.json"); // dibujos de los videos propios (Narrador)

// ---------- Temas de los videos propios (Narrador) ----------
// Cada tema define variables CSS que usan las plantillas del Narrador y los subtitulos, el
// fondo (textura estatica, sin nada aleatorio) y la letra. `ancho*` es el ancho medio de una
// letra en em: las plantillas lo usan para escoger el tamano de letra segun el largo del texto.
const temaPedido = guion.estilo && guion.estilo.tema;

// Motas y fibras de papel para el tema archivo: siempre las mismas (salen de una formula fija).
function texturaPapel() {
  const h = (i) => {
    const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
    return x - Math.floor(x);
  };
  const L = 280;
  const partes = [];
  for (let i = 0; i < 70; i++) {
    const x = (h(i) * L).toFixed(1);
    const y = (h(i + 500) * L).toFixed(1);
    const rr = (0.5 + h(i + 900) * 1.5).toFixed(2);
    const op = (0.05 + h(i + 1300) * 0.11).toFixed(3);
    partes.push(`<circle cx='${x}' cy='${y}' r='${rr}' fill='%235a3a1c' fill-opacity='${op}'/>`);
  }
  for (let i = 0; i < 16; i++) {
    const x = h(i + 2000) * L;
    const y = h(i + 2500) * L;
    const a = h(i + 3000) * Math.PI;
    const largo = 10 + h(i + 3500) * 22;
    const x2 = x + Math.cos(a) * largo;
    const y2 = y + Math.sin(a) * largo;
    const cx = (x + x2) / 2 + Math.sin(a) * 5;
    const cy = (y + y2) / 2 - Math.cos(a) * 5;
    const op = (0.06 + h(i + 4000) * 0.08).toFixed(3);
    partes.push(`<path d='M${x.toFixed(1)} ${y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}' stroke='%237a5530' stroke-opacity='${op}' stroke-width='1.1' fill='none'/>`);
  }
  return `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='${L}' height='${L}'>${partes.join("")}</svg>")`;
}

const TEMAS = {
  // Historia: papel envejecido, tinta sepia, acento rojo lacre, titulos en serif.
  archivo: {
    fondo: "#eadbb8",
    brillo: "#fbf3df",
    google: "",
    anchos: { anchoTitulo: 0.56, anchoTexto: 0.5, anchoCifra: 0.6 },
    vars: {
      "--tinta": "#3b2415",
      "--tinta-suave": "#6f4e35",
      "--acento": "#a3302a",
      "--acento2": "#9a7128",
      "--alerta": "#b0402a",
      "--bien": "#3f6a4a",
      "--sobre-acento": "#fbf3df",
      "--tarjeta": "#f6ebd0",
      "--borde-tarjeta": "3px solid rgba(59, 36, 21, 0.32)",
      "--sombra": "0 10px 26px rgba(80, 50, 20, 0.18)",
      "--radio": "12px",
      "--linea": "#3b2415",
      "--riel": "rgba(59, 36, 21, 0.22)",
      "--resplandor": "none",
      "--resplandor-tinta": "none",
      "--il-filtro": "sepia(0.28) saturate(0.86) drop-shadow(0 12px 14px rgba(70, 40, 15, 0.22))",
      "--marco": "#9a7128",
      "--marco-sombra": "0 0 0 6px #f6ebd0, 0 0 0 10px #3b2415, 0 16px 34px rgba(80, 50, 20, 0.3)",
      "--ins-fondo": "transparent",
      "--ins-tinta": "#a3302a",
      "--ins-borde": "3px solid #a3302a",
      "--ins-sombra": "none",
      "--lupa-aro": "#9a7128",
      "--lupa-mango": "#4a2e1a",
      "--fuente-titulo": '"Playfair Display", serif',
      "--peso-titulo": "900",
      "--espaciado-titulo": "-0.01em",
      "--fuente-texto": '"EB Garamond", serif',
      "--peso-texto": "700",
      "--fuente-cifra": '"Playfair Display", serif',
      "--fuente-sub": '"Playfair Display", serif',
      "--peso-sub": "900",
      "--sub-tinta": "#2e1a0e",
      "--sub-clave": "#a3302a",
      "--sub-fondo": "rgba(250, 242, 222, 0.94)",
      "--sub-borde": "3px solid rgba(59, 36, 21, 0.28)",
      "--sub-caja": "0 8px 22px rgba(80, 50, 20, 0.18)",
      "--sub-sombra": "none",
    },
    fondoCss: (p) => `
          radial-gradient(ellipse 125% 90% at 50% 45%, rgba(92, 58, 24, 0) 52%, rgba(92, 58, 24, 0.46) 100%),
          ${texturaPapel()},
          radial-gradient(circle at 16% 20%, rgba(150, 100, 40, 0.13) 0, rgba(150, 100, 40, 0) 16%),
          radial-gradient(circle at 86% 64%, rgba(150, 100, 40, 0.1) 0, rgba(150, 100, 40, 0) 20%),
          radial-gradient(circle at 30% 88%, rgba(150, 100, 40, 0.1) 0, rgba(150, 100, 40, 0) 14%),
          radial-gradient(ellipse 72% 44% at 50% 40%, ${p.brillo} 0%, ${p.brilloFin} 100%),
          ${p.fondo}`,
  },
  // Medicina y ciencia: blanco azulado con cuadricula de cuaderno, tinta azul petroleo.
  laboratorio: {
    fondo: "#eaf3f7",
    brillo: "#ffffff",
    google: "",
    anchos: { anchoTitulo: 0.6, anchoTexto: 0.55, anchoCifra: 0.64 },
    vars: {
      "--tinta": "#0e3a48",
      "--tinta-suave": "#46707e",
      "--acento": "#0a9792",
      "--acento2": "#2f7fd1",
      "--alerta": "#e9584b",
      "--bien": "#0a9792",
      "--sobre-acento": "#ffffff",
      "--tarjeta": "#ffffff",
      "--borde-tarjeta": "2px solid rgba(14, 58, 72, 0.12)",
      "--sombra": "0 14px 32px rgba(14, 58, 72, 0.13)",
      "--radio": "30px",
      "--linea": "#0e3a48",
      "--riel": "rgba(14, 58, 72, 0.16)",
      "--resplandor": "none",
      "--resplandor-tinta": "none",
      "--il-filtro": "drop-shadow(0 14px 18px rgba(14, 58, 72, 0.18))",
      "--marco": "#0a9792",
      "--marco-sombra": "0 0 0 8px #ffffff, 0 18px 40px rgba(14, 58, 72, 0.2)",
      "--ins-fondo": "#0a9792",
      "--ins-tinta": "#ffffff",
      "--ins-borde": "0 solid transparent",
      "--ins-sombra": "0 8px 20px rgba(10, 151, 146, 0.28)",
      "--lupa-aro": "#7fa3b3",
      "--lupa-mango": "#0e3a48",
      "--fuente-titulo": '"Inter", sans-serif',
      "--peso-titulo": "900",
      "--espaciado-titulo": "-0.035em",
      "--fuente-texto": '"Inter", sans-serif',
      "--peso-texto": "700",
      "--fuente-cifra": '"Inter", sans-serif',
      "--fuente-sub": '"Inter", sans-serif',
      "--peso-sub": "900",
      "--sub-tinta": "#0e3a48",
      "--sub-clave": "#07827d",
      "--sub-fondo": "rgba(255, 255, 255, 0.96)",
      "--sub-borde": "2px solid rgba(14, 58, 72, 0.1)",
      "--sub-caja": "0 10px 26px rgba(14, 58, 72, 0.16)",
      "--sub-sombra": "none",
    },
    fondoCss: (p) => `
          radial-gradient(ellipse 125% 90% at 50% 45%, rgba(14, 58, 72, 0) 58%, rgba(14, 58, 72, 0.12) 100%),
          linear-gradient(90deg, rgba(14, 58, 72, 0) 70px, rgba(233, 88, 75, 0.32) 70px, rgba(233, 88, 75, 0.32) 73px, rgba(14, 58, 72, 0) 73px),
          linear-gradient(rgba(31, 111, 140, 0.15) 2px, rgba(31, 111, 140, 0) 2px) 0 0 / 180px 180px,
          linear-gradient(90deg, rgba(31, 111, 140, 0.15) 2px, rgba(31, 111, 140, 0) 2px) 0 0 / 180px 180px,
          linear-gradient(rgba(31, 111, 140, 0.075) 1px, rgba(31, 111, 140, 0) 1px) 0 0 / 36px 36px,
          linear-gradient(90deg, rgba(31, 111, 140, 0.075) 1px, rgba(31, 111, 140, 0) 1px) 0 0 / 36px 36px,
          radial-gradient(ellipse 72% 44% at 50% 40%, ${p.brillo} 0%, ${p.brilloFin} 100%),
          ${p.fondo}`,
  },
  // Dinero, datos y curiosidades: pizarra oscura, trazos y cifras en neon.
  pizarra: {
    fondo: "#090d16",
    brillo: "#17263f",
    google: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap",
    anchos: { anchoTitulo: 0.58, anchoTexto: 0.55, anchoCifra: 0.62 },
    vars: {
      "--tinta": "#eef6ff",
      "--tinta-suave": "#9db1c9",
      "--acento": "#3ff0ff",
      "--acento2": "#ff4fd8",
      "--alerta": "#ff5c8a",
      "--bien": "#b8ff3c",
      "--sobre-acento": "#04121a",
      "--tarjeta": "rgba(16, 26, 44, 0.82)",
      "--borde-tarjeta": "3px solid rgba(63, 240, 255, 0.55)",
      "--sombra": "0 0 26px rgba(63, 240, 255, 0.16), inset 0 0 22px rgba(63, 240, 255, 0.06)",
      "--radio": "20px",
      "--linea": "#3ff0ff",
      "--riel": "rgba(157, 177, 201, 0.22)",
      "--resplandor": "0 0 18px rgba(63, 240, 255, 0.6), 0 0 4px rgba(63, 240, 255, 0.8)",
      "--resplandor-tinta": "0 0 22px rgba(160, 220, 255, 0.28)",
      "--il-filtro": "drop-shadow(0 0 22px rgba(63, 240, 255, 0.32))",
      "--marco": "#3ff0ff",
      "--marco-sombra": "0 0 28px rgba(63, 240, 255, 0.6), inset 0 0 26px rgba(63, 240, 255, 0.35)",
      "--ins-fondo": "rgba(255, 79, 216, 0.12)",
      "--ins-tinta": "#ff8ae6",
      "--ins-borde": "3px solid #ff4fd8",
      "--ins-sombra": "0 0 20px rgba(255, 79, 216, 0.5)",
      "--lupa-aro": "#3ff0ff",
      "--lupa-mango": "#ff4fd8",
      "--fuente-titulo": '"Space Grotesk", sans-serif',
      "--peso-titulo": "700",
      "--espaciado-titulo": "-0.025em",
      "--fuente-texto": '"Space Grotesk", sans-serif',
      "--peso-texto": "500",
      "--fuente-cifra": '"Space Grotesk", sans-serif',
      "--fuente-sub": '"Space Grotesk", sans-serif',
      "--peso-sub": "700",
      "--sub-tinta": "#ffffff",
      "--sub-clave": "#b8ff3c",
      "--sub-fondo": "rgba(5, 9, 16, 0.62)",
      "--sub-borde": "2px solid rgba(63, 240, 255, 0.35)",
      "--sub-caja": "0 0 24px rgba(63, 240, 255, 0.18)",
      "--sub-sombra": "0 0 16px rgba(120, 230, 255, 0.45)",
    },
    fondoCss: (p) => `
          radial-gradient(ellipse 125% 90% at 50% 45%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.6) 100%),
          radial-gradient(circle, rgba(157, 177, 201, 0.17) 0, rgba(157, 177, 201, 0.17) 1.6px, rgba(157, 177, 201, 0) 2.4px) 0 0 / 40px 40px,
          radial-gradient(ellipse 60% 26% at 84% 92%, rgba(255, 79, 216, 0.12) 0%, rgba(255, 79, 216, 0) 100%),
          radial-gradient(ellipse 50% 24% at 10% 12%, rgba(184, 255, 60, 0.06) 0%, rgba(184, 255, 60, 0) 100%),
          radial-gradient(ellipse 72% 44% at 50% 40%, ${p.brillo} 0%, ${p.brilloFin} 100%),
          ${p.fondo}`,
  },
};
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
  for (let vuelta = 0; vuelta < 3; vuelta++) {
    texto = texto.replace(/\{\{>([a-z0-9-]+)\}\}/g, (_, parcial) => {
      const ruta = path.join(PLANTILLAS, "_" + parcial + ".html");
      if (!fs.existsSync(ruta)) throw new Error(`La plantilla "${nombre}" incluye "${parcial}", que no existe.`);
      return fs.readFileSync(ruta, "utf8").replace(/\s+$/, "");
    });
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
for (const e of tiempos.escenas) {
  const pedida = pedidas[e.id];
  const destino = path.join(dirEscenas, e.id + ".html");
  if (pedida && pedida.plantilla) {
    const datos = conIconos({ ...(guion.datos || {}), ...(pedida.datos || {}) });
    fs.writeFileSync(destino, expande(pedida.plantilla, e.id, datos), "utf8");
  } else if (!fs.existsSync(destino)) {
    console.warn(`Aviso: falta compositions/${e.id}.html y el guion no le da plantilla (la escena "${e.id}" saldra vacia).`);
  }
}

// ---------- index.html ----------
// Lo minimo que las escenas necesitan saber de la voz.
const ultima = tiempos.escenas.at(-1).id;
const datosReloj = {
  escenas: Object.fromEntries(
    tiempos.escenas.map((e) => [
      e.id,
      { inicio: e.inicio, fin: e.id === ultima ? total : e.fin, frases: tiempos.frases.filter((f) => f.escena === e.id).map((f) => f.id) },
    ]),
  ),
  frases: Object.fromEntries(
    tiempos.frases.map((f) => [f.id, { inicio: f.inicio, fin: f.fin, palabras: f.palabras.map((p) => p.inicio), textos: f.palabras.map((p) => norma(p.texto)) }]),
  ),
};

const ranuras = tiempos.escenas
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
        data-width="1080"
        data-height="1920"
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
const jsTema = tema
  ? `\n\n      // Tema visual (videos propios): nombre y ancho medio de una letra (en em) para ajustar textos.\n      window.__tema = ${JSON.stringify({ nombre: temaPedido, ...tema.anchos })};`
  : "";
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
<html lang="es" data-resolution="portrait"${attrTema}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
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
          ini: (ref = 0) => frase(ref).inicio - e.inicio,
          fin: (ref = 0) => frase(ref).fin - e.inicio,
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
        width: 1080px;
        height: 1920px;
        overflow: hidden;
        background: var(--fondo);
      }
      #root {
        position: relative;
        width: 1080px;
        height: 1920px;
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
      data-width="1080"
      data-height="1920"
    >
      <div id="fondo"></div>

${ranuras}

      <div
        id="subtitulos"
        data-composition-id="subtitulos"
        data-composition-src="compositions/subtitulos.html"
        data-start="0"
        data-duration="${total}"
        data-track-index="2"
        data-track-kind="captions"
        data-width="1080"
        data-height="1920"
        style="z-index: 5"
      ></div>
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
const dePlantilla = tiempos.escenas.filter((e) => pedidas[e.id] && pedidas[e.id].plantilla).length;
console.log(`Listo: index.html (${tiempos.escenas.length} escenas, ${dePlantilla} de plantilla, ${total} s${sinVoz ? ", sin voz" : ""}${tema ? ", tema " + temaPedido : ""})`);
tiempos.escenas.forEach((e) =>
  console.log(`  ${String(e.inicio).padStart(6)} - ${String(datosReloj.escenas[e.id].fin).padEnd(6)} ${e.id}${pedidas[e.id]?.plantilla ? "  <- " + pedidas[e.id].plantilla : ""}`),
);

// Los subtitulos salen del mismo tiempos.json.
await import("./subtitulos.mjs");
