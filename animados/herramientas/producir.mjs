// producir.mjs - Produce un video animado de principio a fin a partir de su guion.
//
// Uso (desde la raiz del proyecto):
//   node animados/herramientas/producir.mjs animados/videos/<video>
//   node animados/herramientas/producir.mjs --todos      (los que no tienen video o cambiaron de guion)
//   ... --sin-render   se queda en la revision (no gasta tiempo de render)
//
// Pasos: voz -> montaje -> revision de HyperFrames -> render -> entrega.
// Si la revision encuentra errores, se detiene antes del render y los muestra.
//
// Entrega en salidas/<entrega>/<video>/:
//   <video>.mp4, portada.jpg, publicacion.txt (texto y hashtags del guion) y meta.json;
//   ademas textos.md (un texto por red, si el guion trae publicacion.redes) y
//   fuentes.md (si el guion trae fuentes).
// <entrega> es "animador" para animados/videos/ (videos de venta) y "narrador" para
// animados/propios/ (videos de contenido propio); el guion puede fijarlo con "entrega".
// Una carpeta de video solo necesita su guion.json; lo demas lo crea este script.
//
// Voz grabada ("motor": "grabada"): deja en la carpeta del video para-grabar.txt (las frases
// que hay que leer) y, mientras no este la grabacion, el video queda "esperando grabacion"
// (no es un error). salidas/animador/por-grabar.md junta todos los que esperan.

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const ANIMADOS = path.resolve(AQUI, "..");
const RAIZ = path.resolve(ANIMADOS, "..");
const HF = "hyperframes@0.9.20";
const ENTORNO = { ...process.env, DO_NOT_TRACK: "1", HYPERFRAMES_NO_TELEMETRY: "1" };

// Donde viven los videos de cada agente y a que carpeta de salidas van.
const CARPETAS = { animador: path.join(ANIMADOS, "videos"), narrador: path.join(ANIMADOS, "propios") };
const leeGuion = (carpeta) => JSON.parse(fs.readFileSync(path.join(carpeta, "guion.json"), "utf8"));
function entregaNombre(carpeta, guion) {
  if (guion && typeof guion.entrega === "string" && /^[a-z0-9-]+$/.test(guion.entrega)) return guion.entrega;
  return path.resolve(carpeta).startsWith(CARPETAS.narrador + path.sep) ? "narrador" : "animador";
}

const args = process.argv.slice(2);
const sinRender = args.includes("--sin-render");
const todos = args.includes("--todos");
const pedidas = args.filter((a) => !a.startsWith("--")).map((a) => path.resolve(a));

function corre(titulo, orden, cwd, opciones = {}) {
  const r = spawnSync(orden, { shell: true, cwd, env: ENTORNO, encoding: "utf8", stdio: opciones.callado ? ["ignore", "pipe", "pipe"] : ["ignore", "inherit", "inherit"], maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0 && !opciones.tolera) throw new Error(`Fallo "${titulo}".\n${r.stderr || ""}${r.stdout || ""}`.slice(0, 3000));
  return r;
}

const NOMBRE_GRABACION = /^grabacion\.(wav|mp3|m4a|aac|ogg|oga|opus|flac|amr|3gp|caf|mp4|mov|webm)$/i;
const tieneGrabacion = (carpeta, guion) =>
  guion.grabacion
    ? fs.existsSync(path.resolve(carpeta, guion.grabacion))
    : [carpeta, path.join(carpeta, "assets")].some((d) => fs.existsSync(d) && fs.readdirSync(d).some((n) => NOMBRE_GRABACION.test(n)));

const COMO_GRABAR = [
  "Cómo grabar",
  "1. Busca un lugar callado y graba con el celular a un palmo de la boca, sin música de fondo.",
  "2. Lee las frases en orden, con tu voz normal y con energía, como si se lo contaras a alguien.",
  "3. Entre frase y frase deja un segundo de silencio: ahí es donde el sistema corta.",
  "4. Si te equivocas, haz una pausa y vuelve a decir esa frase completa: se usa la última vez que la dijiste.",
  "5. Guarda el audio en la carpeta del video con el nombre grabacion (grabacion.m4a, grabacion.mp3, grabacion.wav...). Sin tilde.",
];

function frasesParaLeer(guion) {
  return guion.frases.map((f, i) => `${i + 1}. ${f.texto}`);
}

function escribeParaGrabar(carpeta, guion) {
  const rel = path.relative(RAIZ, carpeta).replace(/\\/g, "/");
  const texto = [`GRABAR: ${guion.titulo || path.basename(carpeta)}`, `Carpeta: ${rel}`, "", ...COMO_GRABAR, "", "Frases", ...frasesParaLeer(guion), ""].join("\n");
  fs.writeFileSync(path.join(carpeta, "para-grabar.txt"), texto, "utf8");
}

function entregaDe(carpeta, guion = leeGuion(carpeta)) {
  const nombre = path.basename(carpeta);
  const entrega = entregaNombre(carpeta, guion);
  const dir = path.join(RAIZ, "salidas", entrega, nombre);
  return { nombre, entrega, dir, mp4: path.join(dir, nombre + ".mp4") };
}

const REDES = [
  ["tiktok", "TikTok"],
  ["instagram", "Instagram (Reels)"],
  ["youtube", "YouTube Shorts"],
  ["facebook", "Facebook (Reels)"],
];
const etiquetas = (lista) => (lista || []).map((h) => (String(h).startsWith("#") ? h : "#" + h)).join(" ");

// textos.md: un bloque por red listo para copiar. publicacion.redes.<red> = { titulo?, texto, hashtags }
function escribeTextos(dir, guion) {
  const redes = (guion.publicacion && guion.publicacion.redes) || {};
  const partes = [`# Textos para publicar: ${guion.titulo || ""}`, ""];
  let alguno = false;
  for (const [clave, nombre] of REDES) {
    const r = redes[clave];
    if (!r || !r.texto) continue;
    alguno = true;
    partes.push(`## ${nombre}`, "");
    if (r.titulo) partes.push(`**Título:** ${r.titulo}`, "");
    partes.push("```", [r.texto, "", etiquetas(r.hashtags)].join("\n").trim(), "```", "");
  }
  if (alguno) fs.writeFileSync(path.join(dir, "textos.md"), partes.join("\n"), "utf8");
}

// fuentes.md: de donde sale cada dato. guion.fuentes = [{ dato, fuente, url? }]
function escribeFuentes(dir, guion) {
  if (!Array.isArray(guion.fuentes) || !guion.fuentes.length) return;
  const lineas = [`# Fuentes: ${guion.titulo || ""}`, "", ...guion.fuentes.map((f) => `- **${f.dato || ""}** — ${f.fuente || ""}${f.url ? ` (${f.url})` : ""}`), ""];
  fs.writeFileSync(path.join(dir, "fuentes.md"), lineas.join("\n"), "utf8");
}

function pendiente(carpeta) {
  const { mp4 } = entregaDe(carpeta);
  if (!fs.existsSync(mp4)) return true;
  return fs.statSync(path.join(carpeta, "guion.json")).mtimeMs > fs.statSync(mp4).mtimeMs;
}

function produce(carpeta) {
  const guion = leeGuion(carpeta);
  const { nombre, dir, mp4 } = entregaDe(carpeta, guion);
  console.log(`\n=== ${nombre}: ${guion.titulo || ""} ===`);

  // Lo minimo que HyperFrames espera encontrar en la carpeta.
  const base = {
    "meta.json": { id: nombre, name: nombre },
    "hyperframes.json": {
      $schema: "https://hyperframes.heygen.com/schema/hyperframes.json",
      registry: "https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry",
      paths: { blocks: "compositions", components: "compositions/components", assets: "assets" },
      media: { autoProxy: true },
    },
    "package.json": { name: nombre, private: true, type: "module", scripts: { dev: `npx --yes ${HF} preview`, check: `npx --yes ${HF} check`, render: `npx --yes ${HF} render` } },
  };
  for (const [archivo, contenido] of Object.entries(base)) {
    const ruta = path.join(carpeta, archivo);
    if (!fs.existsSync(ruta)) fs.writeFileSync(ruta, JSON.stringify(contenido, null, 2) + "\n", "utf8");
  }

  // En un video hecho solo con plantillas lo unico propio es el guion: lo demas se regenera,
  // asi que no se sube a GitHub.
  const escenasDelGuion = [...new Set((guion.frases || []).map((f) => f.escena))];
  const soloPlantillas = guion.escenas && escenasDelGuion.every((e) => guion.escenas[e] && guion.escenas[e].plantilla);
  const ignora = path.join(carpeta, ".gitignore");
  if (soloPlantillas && !fs.existsSync(ignora)) {
    fs.writeFileSync(ignora, "# Video hecho con plantillas: solo se versiona el guion; lo demas lo regenera producir.mjs\n*\n!.gitignore\n!guion.json\n", "utf8");
  }

  console.log("1/4 voz");
  if (guion.motor === "grabada") escribeParaGrabar(carpeta, guion);
  const voz = corre("voz", `node "${path.join(AQUI, "voz.mjs")}" "${carpeta}"`, RAIZ, { tolera: true });
  if (voz.status === 3) return { nombre, esperando: true };
  if (voz.status !== 0) throw new Error(`Fallo "voz" en ${nombre} (mira el mensaje de arriba).`);
  console.log("2/4 montaje");
  corre("montaje", `node "${path.join(AQUI, "montaje.mjs")}" "${carpeta}"`, RAIZ, { callado: true });

  console.log("3/4 revision");
  const rev = corre("revision", `npx --yes ${HF} check --json`, carpeta, { callado: true, tolera: true });
  const crudo = rev.stdout || "";
  let informe;
  try {
    informe = JSON.parse(crudo.slice(crudo.indexOf("{")));
  } catch {
    throw new Error("La revision no devolvio un informe legible:\n" + (rev.stderr || crudo).slice(0, 1500));
  }
  const hallazgos = [];
  for (const parte of ["lint", "runtime", "layout", "motion", "contrast", "craft", "audio"]) {
    for (const h of (informe[parte] && informe[parte].findings) || []) {
      if (h.severity === "info" || h.code === "timeline_track_too_dense") continue;
      hallazgos.push(`   [${h.severity}] ${parte}/${h.code} ${h.selector || ""} t=${h.time ?? ""} :: ${String(h.message).slice(0, 180)}`);
    }
  }
  hallazgos.forEach((h) => console.log(h));
  if (!informe.ok) throw new Error(`La revision de "${nombre}" tiene errores: no se renderiza hasta corregirlos.`);
  if (sinRender) return { nombre, avisos: hallazgos.length, mp4: null };

  console.log("4/4 render");
  fs.mkdirSync(path.join(carpeta, "renders"), { recursive: true });
  const salidaLocal = path.join(carpeta, "renders", nombre + ".mp4");
  corre("render", `npx --yes ${HF} render -q delivery -o "${salidaLocal}"`, carpeta, { callado: true });

  // Entrega.
  fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(salidaLocal, mp4);
  // Portada: el cuadro 0, o el segundo que diga el guion ("portada_en": 1.5).
  const portadaEn = Number(guion.portada_en) > 0 ? `-ss ${Number(guion.portada_en)} ` : "";
  corre("portada", `ffmpeg -v error -y ${portadaEn}-i "${mp4}" -frames:v 1 -q:v 3 -update 1 "${path.join(dir, "portada.jpg")}"`, RAIZ, { callado: true, tolera: true });
  const sonda = corre("duracion", `ffprobe -v error -show_entries format=duration -of csv=p=0 "${mp4}"`, RAIZ, { callado: true, tolera: true });
  const volumen = corre("volumen", `ffmpeg -hide_banner -nostats -i "${mp4}" -af ebur128 -f null -`, RAIZ, { callado: true, tolera: true });
  const lufs = ((volumen.stderr || "").match(/I:\s+(-?[\d.]+) LUFS/g) || []).pop() || "";
  const pub = guion.publicacion || {};
  const texto = [pub.texto || guion.titulo || "", "", (pub.hashtags || []).map((h) => (h.startsWith("#") ? h : "#" + h)).join(" ")].join("\n").trim() + "\n";
  fs.writeFileSync(path.join(dir, "publicacion.txt"), texto, "utf8");
  escribeTextos(dir, guion);
  escribeFuentes(dir, guion);
  const meta = {
    id: nombre,
    titulo: guion.titulo || nombre,
    duracion_s: Math.round(parseFloat(sonda.stdout || "0") * 10) / 10,
    volumen: lufs.replace(/\s+/g, " ").trim(),
    voz: `${guion.motor || "kokoro"}${guion.voz ? " / " + guion.voz : ""}`,
    avisos_revision: hallazgos.length,
    producido: new Date().toISOString(),
    video: `${nombre}.mp4`,
    guion: path.relative(RAIZ, path.join(carpeta, "guion.json")).replace(/\\/g, "/"),
  };
  fs.writeFileSync(path.join(dir, "meta.json"), JSON.stringify(meta, null, 2) + "\n", "utf8");
  console.log(`Listo: ${mp4}  (${meta.duracion_s} s, ${meta.volumen})`);
  return { nombre, avisos: hallazgos.length, mp4 };
}

// ---------- Que producir ----------
let carpetas = pedidas;
if (todos) {
  carpetas = Object.values(CARPETAS)
    .filter((dir) => fs.existsSync(dir))
    .flatMap((dir) => fs.readdirSync(dir).map((n) => path.join(dir, n)))
    .filter((c) => fs.existsSync(path.join(c, "guion.json")) && leeGuion(c).escenas)
    .filter(pendiente);
  if (!carpetas.length) console.log("No hay videos pendientes: todos tienen su MP4 al dia en salidas/.");
}
if (!carpetas.length && !todos) {
  console.error("Uso: node animados/herramientas/producir.mjs <carpeta-del-video> | --todos  [--sin-render]");
  process.exit(1);
}

const hechos = [];
const fallidos = [];
const esperando = [];
for (const carpeta of carpetas) {
  if (!fs.existsSync(path.join(carpeta, "guion.json"))) {
    fallidos.push({ nombre: path.basename(carpeta), error: "no tiene guion.json" });
    continue;
  }
  try {
    const hecho = produce(carpeta);
    (hecho.esperando ? esperando : hechos).push(hecho);
  } catch (e) {
    console.error(String(e.message || e));
    fallidos.push({ nombre: path.basename(carpeta), error: String(e.message || e).split("\n")[0] });
  }
}
// Catalogo de lo entregado: lo que otro agente (o una persona) necesita para publicar.
function catalogo(entrega) {
  const base = path.join(RAIZ, "salidas", entrega);
  if (!fs.existsSync(base)) return;
  const videos = fs
    .readdirSync(base)
    .filter((n) => fs.existsSync(path.join(base, n, "meta.json")))
    .map((n) => {
      const meta = JSON.parse(fs.readFileSync(path.join(base, n, "meta.json"), "utf8"));
      const texto = fs.existsSync(path.join(base, n, "publicacion.txt")) ? fs.readFileSync(path.join(base, n, "publicacion.txt"), "utf8").trim() : "";
      return {
        id: meta.id,
        titulo: meta.titulo,
        duracion_s: meta.duracion_s,
        producido: meta.producido,
        video: `salidas/${entrega}/${n}/${meta.video}`,
        portada: `salidas/${entrega}/${n}/portada.jpg`,
        ...(fs.existsSync(path.join(base, n, "textos.md")) ? { textos: `salidas/${entrega}/${n}/textos.md` } : {}),
        ...(fs.existsSync(path.join(base, n, "fuentes.md")) ? { fuentes: `salidas/${entrega}/${n}/fuentes.md` } : {}),
        video_en_esta_pc: fs.existsSync(path.join(base, n, meta.video)),
        publicacion: texto,
      };
    })
    .sort((a, b) => String(b.producido).localeCompare(String(a.producido)));
  fs.writeFileSync(path.join(base, "videos.json"), JSON.stringify({ actualizado: new Date().toISOString(), videos }, null, 2) + "\n", "utf8");
}
for (const entrega of Object.keys(CARPETAS)) catalogo(entrega);

// Lo que falta grabar, en un solo archivo por agente para quien pone la voz.
function porGrabar(entrega) {
  const base = path.join(RAIZ, "salidas", entrega);
  const dir = CARPETAS[entrega];
  if (!fs.existsSync(dir)) return 0;
  const faltan = fs
    .readdirSync(dir)
    .map((n) => path.join(dir, n))
    .filter((c) => fs.existsSync(path.join(c, "guion.json")))
    .map((c) => ({ carpeta: c, guion: leeGuion(c) }))
    .filter(({ carpeta, guion }) => guion.motor === "grabada" && !tieneGrabacion(carpeta, guion));
  const partes = ["# Videos por grabar", "", "Generado por `animados/herramientas/producir.mjs`. Cada video se graba de una vez, leyendo sus frases en orden.", ""];
  if (!faltan.length) partes.push("No hay videos esperando grabación.", "");
  else {
    partes.push(...COMO_GRABAR.slice(1).map((l) => l.replace(/^\d\. /, "- ")), "");
    for (const { carpeta, guion } of faltan) {
      const rel = path.relative(RAIZ, carpeta).replace(/\\/g, "/");
      partes.push(`## ${guion.titulo || path.basename(carpeta)}`, "", `Guardar como \`${rel}/grabacion.m4a\` (o .mp3, .wav).`, "", ...frasesParaLeer(guion), "");
    }
  }
  fs.mkdirSync(base, { recursive: true });
  fs.writeFileSync(path.join(base, "por-grabar.md"), partes.join("\n"), "utf8");
  return faltan.length;
}
const faltanGrabar = Object.keys(CARPETAS).reduce((n, entrega) => n + porGrabar(entrega), 0);

if (carpetas.length > 1 || fallidos.length || esperando.length) {
  console.log(`\nResumen: ${hechos.length} hecho(s), ${esperando.length} esperando grabacion, ${fallidos.length} con error.`);
  hechos.forEach((h) => console.log(`  ok    ${h.nombre}${h.avisos ? `  (${h.avisos} aviso(s) de revision)` : ""}`));
  esperando.forEach((h) => console.log(`  falta grabar  ${h.nombre}  (frases en su para-grabar.txt)`));
  fallidos.forEach((f) => console.log(`  ERROR ${f.nombre}: ${f.error}`));
}
if (faltanGrabar) console.log(`\n${faltanGrabar} video(s) por grabar: salidas/animador/por-grabar.md y salidas/narrador/por-grabar.md`);
process.exit(fallidos.length ? 1 : 0);
