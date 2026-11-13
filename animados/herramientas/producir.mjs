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
// Entrega en salidas/animador/<video>/:
//   <video>.mp4, portada.jpg, publicacion.txt (texto y hashtags del guion) y meta.json.
// Una carpeta de video solo necesita su guion.json; lo demas lo crea este script.

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const ANIMADOS = path.resolve(AQUI, "..");
const RAIZ = path.resolve(ANIMADOS, "..");
const HF = "hyperframes@0.9.20";
const ENTORNO = { ...process.env, DO_NOT_TRACK: "1", HYPERFRAMES_NO_TELEMETRY: "1" };

const args = process.argv.slice(2);
const sinRender = args.includes("--sin-render");
const todos = args.includes("--todos");
const pedidas = args.filter((a) => !a.startsWith("--")).map((a) => path.resolve(a));

function corre(titulo, orden, cwd, opciones = {}) {
  const r = spawnSync(orden, { shell: true, cwd, env: ENTORNO, encoding: "utf8", stdio: opciones.callado ? ["ignore", "pipe", "pipe"] : ["ignore", "inherit", "inherit"], maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0 && !opciones.tolera) throw new Error(`Fallo "${titulo}".\n${r.stderr || ""}${r.stdout || ""}`.slice(0, 3000));
  return r;
}

function entregaDe(carpeta) {
  const nombre = path.basename(carpeta);
  return { nombre, dir: path.join(RAIZ, "salidas", "animador", nombre), mp4: path.join(RAIZ, "salidas", "animador", nombre, nombre + ".mp4") };
}

function pendiente(carpeta) {
  const { mp4 } = entregaDe(carpeta);
  if (!fs.existsSync(mp4)) return true;
  return fs.statSync(path.join(carpeta, "guion.json")).mtimeMs > fs.statSync(mp4).mtimeMs;
}

function produce(carpeta) {
  const { nombre, dir, mp4 } = entregaDe(carpeta);
  const guion = JSON.parse(fs.readFileSync(path.join(carpeta, "guion.json"), "utf8"));
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
  corre("voz", `node "${path.join(AQUI, "voz.mjs")}" "${carpeta}"`, RAIZ);
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
  corre("portada", `ffmpeg -v error -y -i "${mp4}" -frames:v 1 -q:v 3 -update 1 "${path.join(dir, "portada.jpg")}"`, RAIZ, { callado: true, tolera: true });
  const sonda = corre("duracion", `ffprobe -v error -show_entries format=duration -of csv=p=0 "${mp4}"`, RAIZ, { callado: true, tolera: true });
  const volumen = corre("volumen", `ffmpeg -hide_banner -nostats -i "${mp4}" -af ebur128 -f null -`, RAIZ, { callado: true, tolera: true });
  const lufs = ((volumen.stderr || "").match(/I:\s+(-?[\d.]+) LUFS/g) || []).pop() || "";
  const pub = guion.publicacion || {};
  const texto = [pub.texto || guion.titulo || "", "", (pub.hashtags || []).map((h) => (h.startsWith("#") ? h : "#" + h)).join(" ")].join("\n").trim() + "\n";
  fs.writeFileSync(path.join(dir, "publicacion.txt"), texto, "utf8");
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
  const dir = path.join(ANIMADOS, "videos");
  carpetas = fs
    .readdirSync(dir)
    .map((n) => path.join(dir, n))
    .filter((c) => fs.existsSync(path.join(c, "guion.json")) && JSON.parse(fs.readFileSync(path.join(c, "guion.json"), "utf8")).escenas)
    .filter(pendiente);
  if (!carpetas.length) console.log("No hay videos pendientes: todos tienen su MP4 al dia en salidas/animador/.");
}
if (!carpetas.length && !todos) {
  console.error("Uso: node animados/herramientas/producir.mjs <carpeta-del-video> | --todos  [--sin-render]");
  process.exit(1);
}

const hechos = [];
const fallidos = [];
for (const carpeta of carpetas) {
  if (!fs.existsSync(path.join(carpeta, "guion.json"))) {
    fallidos.push({ nombre: path.basename(carpeta), error: "no tiene guion.json" });
    continue;
  }
  try {
    hechos.push(produce(carpeta));
  } catch (e) {
    console.error(String(e.message || e));
    fallidos.push({ nombre: path.basename(carpeta), error: String(e.message || e).split("\n")[0] });
  }
}
// Catalogo de lo entregado: lo que otro agente (o una persona) necesita para publicar.
function catalogo() {
  const base = path.join(RAIZ, "salidas", "animador");
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
        video: `salidas/animador/${n}/${meta.video}`,
        portada: `salidas/animador/${n}/portada.jpg`,
        video_en_esta_pc: fs.existsSync(path.join(base, n, meta.video)),
        publicacion: texto,
      };
    })
    .sort((a, b) => String(b.producido).localeCompare(String(a.producido)));
  fs.writeFileSync(path.join(base, "videos.json"), JSON.stringify({ actualizado: new Date().toISOString(), videos }, null, 2) + "\n", "utf8");
}
catalogo();

if (carpetas.length > 1 || fallidos.length) {
  console.log(`\nResumen: ${hechos.length} hecho(s), ${fallidos.length} con error.`);
  hechos.forEach((h) => console.log(`  ok    ${h.nombre}${h.avisos ? `  (${h.avisos} aviso(s) de revision)` : ""}`));
  fallidos.forEach((f) => console.log(`  ERROR ${f.nombre}: ${f.error}`));
}
process.exit(fallidos.length ? 1 : 0);
