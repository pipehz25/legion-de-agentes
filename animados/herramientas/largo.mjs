// largo.mjs - Videos largos para YouTube (horizontal 1920x1080, de 8 a 20 minutos).
//
// Documental hecho sobre todo con imagenes de archivo que se mueven despacio (Ken Burns),
// narrado con la voz del guion (ElevenLabs, Kokoro, grabada...) y con tarjetas animadas de
// titulo y de capitulo. No se corre solo: lo llama producir.mjs cuando el guion trae
// "tipo": "largo".
//   node animados/herramientas/producir.mjs animados/propios/<id>               (todo)
//   node animados/herramientas/producir.mjs animados/propios/<id> --sin-render  (sin el MP4)
// voz.mjs tambien lo usa (aplanarLargo) para leer los capitulos como una lista de frases.
//
// Pasos:
//   1. voz        voz.mjs: assets/narracion.wav y tiempos.json; cada tramo de imagen es una "escena"
//   2. imagenes   Wikimedia Commons (solo dominio publico, CC0, CC BY y CC BY-SA) o archivos de la
//                 carpeta del video; las de Commons quedan en animados/.imagenes-cache/
//   3. plan       que se ve en cada cuadro: tramos de imagen, tarjetas y fundidos (largo/plan.json)
//   4. textos     <id>.srt, descripcion.txt (con capitulos), creditos-imagenes.md y fuentes.md
//   5. miniatura  miniatura.jpg de 1280x720 (HyperFrames)
//   6. tarjetas   titulo y capitulos, con el aspecto del tema (HyperFrames, un solo render)
//   7. tramos     un MP4 por tramo con ffmpeg, varios a la vez; los que no cambiaron se reusan
//   8. union      se pegan los tramos sin recodificar y se les pone la voz a -14 LUFS
// Todo lo intermedio queda en <video>/largo/ (no va a GitHub). La entrega, en salidas/narrador/<id>/.
//
// Con "orientacion": "horizontal" el guion es un video largo POR ESCENAS (el estilo aprobado): cada
// capitulo trae sus "escenas" y lo produce largo-escenas.mjs. De aqui salen para ese modo la lectura del
// guion (esLargoEscenas, planEscenas y aplanarLargo, que usa voz.mjs) y los textos de la entrega (srt,
// descripcion, creditos, fuentes) y la miniatura, que se exportan al final.

import { spawn, spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { TEMAS } from "./temas.mjs";

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const ANIMADOS = path.resolve(AQUI, "..");
const RAIZ = path.resolve(ANIMADOS, "..");
const HF = "hyperframes@0.9.20";
const WINDOWS = process.platform === "win32";
const ENTORNO = { ...process.env, DO_NOT_TRACK: "1", HYPERFRAMES_NO_TELEMETRY: "1" };

const ANCHO = 1920;
const ALTO = 1080;
const FPS = 30;
// Cada imagen se compone una vez en un "lienzo" 1,2 veces mas grande que el cuadro: el
// movimiento recorta dentro de el y siempre se reduce al cuadro, nunca se agranda.
const LIENZO_W = 2304;
const LIENZO_H = 1296;
const CACHE_IMAGENES = path.join(ANIMADOS, ".imagenes-cache");
// User-Agent generico, sin datos de nadie. Si Wikimedia limitara mucho los pedidos, la persona
// puede poner el suyo (con un contacto) en la variable LEGION_COMMONS_UA.
const UA = process.env.LEGION_COMMONS_UA || "LegionNarrador/1.0 (videos educativos)";
// Si cambia como se dibuja algo, sube su numero y se vuelve a hacer (se invalida la cache).
const VERSION = { ficha: 1, lienzo: 1, tramo: 1, tarjetas: 1, miniatura: 1 };
const X264 = ["-c:v", "libx264", "-preset", "veryfast", "-crf", "19", "-pix_fmt", "yuv420p", "-profile:v", "high", "-g", String(FPS * 2), "-sc_threshold", "0", "-video_track_timescale", "15360"];

// ffmpeg y ffprobe: primero los de la Legion (herramientas/bin, los instala herramientas/instalar.ps1
// en Windows), despues los del PATH (en Mac, `brew install ffmpeg`).
function programa(nombre) {
  const propio = path.join(RAIZ, "herramientas", "bin", WINDOWS ? nombre + ".exe" : nombre);
  return fs.existsSync(propio) ? propio : nombre;
}
const FFMPEG = programa("ffmpeg");
const FFPROBE = programa("ffprobe");

// ---------- Utilidades ----------
const r3 = (n) => Math.round(n * 1000) / 1000;
const limita = (x, a, b) => Math.max(a, Math.min(b, x));
const hash = (x) => crypto.createHash("sha1").update(typeof x === "string" ? x : JSON.stringify(x)).digest("hex");
const dormir = (ms) => new Promise((ok) => setTimeout(ok, ms));
const escapa = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const rel = (p) => path.relative(RAIZ, p).replace(/\\/g, "/");
const numero = (v, porDefecto) => (v !== null && v !== undefined && v !== "" && Number.isFinite(Number(v)) ? Number(v) : porDefecto);
const leeJson = (ruta) => {
  try {
    return JSON.parse(fs.readFileSync(ruta, "utf8"));
  } catch {
    return null;
  }
};
const escribeJson = (ruta, datos) => fs.writeFileSync(ruta, JSON.stringify(datos, null, 2) + "\n", "utf8");

function ff(args, opciones = {}) {
  const r = spawnSync(FFMPEG, ["-hide_banner", "-v", "error", "-y", ...args], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, ...opciones });
  if (r.status !== 0) throw new Error(`ffmpeg fallo:\n${String(r.stderr || r.error || "").slice(0, 2000)}`);
  return r;
}

function ffAsync(args, opciones = {}) {
  return new Promise((ok, mal) => {
    const p = spawn(FFMPEG, ["-hide_banner", "-v", "error", "-y", ...args], { stdio: ["ignore", "ignore", "pipe"], ...opciones });
    let error = "";
    p.stderr.on("data", (d) => (error += d));
    p.on("error", mal);
    p.on("close", (codigo) => (codigo === 0 ? ok() : mal(new Error(`ffmpeg fallo:\n${error.slice(0, 2000)}`))));
  });
}

function sonda(archivo) {
  const r = spawnSync(FFPROBE, ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height:format=duration", "-of", "json", archivo], { encoding: "utf8" });
  if (r.status !== 0) return null;
  try {
    const d = JSON.parse(r.stdout);
    const s = (d.streams || [])[0] || {};
    return { ancho: Number(s.width) || 0, alto: Number(s.height) || 0, duracion: parseFloat((d.format || {}).duration) || 0 };
  } catch {
    return null;
  }
}

function hiperframes(orden, cwd) {
  // npx es un .cmd en Windows: hay que pasar por el shell.
  const r = spawnSync(`npx --yes ${HF} ${orden}`, { shell: true, cwd, env: ENTORNO, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0) throw new Error(`HyperFrames fallo (${orden.split(" ")[0]}):\n${(r.stderr || "") + (r.stdout || "")}`.slice(0, 3000));
  return r;
}

async function enParalelo(tareas, cuantas, alAvanzar) {
  let siguiente = 0;
  let hechas = 0;
  const trabajador = async () => {
    while (siguiente < tareas.length) {
      const tarea = tareas[siguiente++];
      await tarea();
      hechas++;
      if (alAvanzar) alAvanzar(hechas, tareas.length);
    }
  };
  await Promise.all(Array.from({ length: Math.min(cuantas, tareas.length) }, trabajador));
}

const minutos = (s) => {
  const t = Math.max(0, Math.floor(s));
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const ss = String(t % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${ss}` : `${String(m).padStart(2, "0")}:${ss}`;
};

// ---------- Guion ----------
export function esLargo(guion) {
  return Boolean(guion) && guion.tipo === "largo";
}

function ajustes(guion) {
  return {
    pausaCapitulo: numero(guion.pausa_capitulo, 1.2), // silencio de la voz antes de un capitulo
    pausaTitulo: numero(guion.pausa_titulo, 2.0), // silencio de la voz entre el gancho y el capitulo 1
    durTarjeta: numero(guion.duracion_tarjeta, 3.0), // cuanto se ve la tarjeta de un capitulo
    durTitulo: numero(guion.duracion_titulo, 4.5), // cuanto se ve la tarjeta de apertura (titulo + capitulo 1)
    fundido: numero(guion.fundido, 0.5), // fundido entre imagenes
    fundidoFinal: numero(guion.fundido_final, 1.2), // fundido a negro al final
    cola: numero(guion.cola, 2.5), // segundos despues de la ultima frase
  };
}

// Capitulos -> frases en orden, tramos (frases seguidas con la misma imagen) y capitulos con su
// tarjeta. El primer capitulo con titulo lleva la tarjeta de apertura (titulo del video y
// capitulo 1); los siguientes, la de su capitulo. Un capitulo sin titulo (el gancho) no lleva.
export function planLargo(guion) {
  const errores = [];
  const caps = Array.isArray(guion.capitulos) ? guion.capitulos : [];
  if (!caps.length) errores.push('el guion largo necesita "capitulos", cada uno con sus "frases"');
  const imagenes = guion.imagenes || {};
  const vistos = new Set();
  const frases = [];
  const tramos = [];
  const capitulos = [];
  let imagen = null;
  let n = 0;
  caps.forEach((c, ci) => {
    const titulo = String(c.titulo || "").trim();
    const cap = { id: c.id || `c${ci}`, titulo, numero: 0, tarjeta: null, etiqueta: c.etiqueta, frases: [], tramos: [] };
    if (titulo) {
      n++;
      cap.numero = n;
      cap.tarjeta = n === 1 ? "apertura" : "capitulo";
    }
    if (!Array.isArray(c.frases) || !c.frases.length) errores.push(`el capitulo ${cap.id} no tiene frases`);
    let tramo = null;
    for (const f of c.frases || []) {
      if (!f || !f.id) {
        errores.push(`una frase del capitulo ${cap.id} no tiene id`);
        continue;
      }
      if (vistos.has(f.id)) errores.push(`el id de frase "${f.id}" esta repetido (tienen que ser unicos en todo el video)`);
      vistos.add(f.id);
      if (!String(f.texto || "").trim()) errores.push(`la frase ${f.id} no tiene texto`);
      if (f.imagen && !imagenes[f.imagen]) errores.push(`la frase ${f.id} pide la imagen "${f.imagen}", que no esta en "imagenes"`);
      const nueva = Boolean(f.imagen) && f.imagen !== imagen;
      if (f.imagen) imagen = f.imagen;
      if (!imagen) errores.push(`la frase ${f.id} no tiene imagen y no hay una anterior que seguir`);
      if (!tramo || nueva) {
        tramo = { id: `t${tramos.length + 1}`, imagen, capitulo: cap.id, frases: [] };
        tramos.push(tramo);
        cap.tramos.push(tramo.id);
      }
      tramo.frases.push(f.id);
      cap.frases.push(f.id);
      frases.push({ ...f, escena: tramo.id });
    }
    capitulos.push(cap);
  });
  return { frases, tramos, capitulos, errores };
}

// ---------- Video largo hecho con escenas ("orientacion": "horizontal") ----------
// Cada capitulo trae sus "escenas" ({ id: { plantilla, datos } }, como un Short) y sus frases con
// "escena" y "cortes". Lo produce largo-escenas.mjs; aqui solo se lee el guion (voz.mjs lo usa).
export function esLargoEscenas(guion) {
  return esLargo(guion) && guion.orientacion === "horizontal";
}

// Capitulos -> frases en orden (cada una con su escena) y capitulos con sus escenas completas: la
// tarjeta del capitulo (la que pide "tarjeta", o una "capitulo" automatica si tiene titulo) y una
// escena de respaldo por cada frase que todavia no tiene escena (un "titular" que dice "pendiente").
export function planEscenas(guion) {
  const errores = [];
  const avisos = [];
  const caps = Array.isArray(guion.capitulos) ? guion.capitulos : [];
  if (!caps.length) errores.push('el guion largo necesita "capitulos", cada uno con sus "frases"');
  const vistas = new Set();
  const dueno = new Map(); // id de escena -> capitulo
  const frases = [];
  const capitulos = [];
  let n = 0;
  caps.forEach((c, ci) => {
    const id = c.id || `c${ci}`;
    const titulo = String(c.titulo || "").trim();
    const numero = titulo ? ++n : 0;
    const escenas = { ...(c.escenas || {}) };
    const suma = (eid, escena) => {
      if (dueno.has(eid) && dueno.get(eid) !== id) errores.push(`la escena "${eid}" esta en ${dueno.get(eid)} y en ${id}: los ids de escena no se repiten en todo el video`);
      dueno.set(eid, id);
      if (escena) escenas[eid] = escena;
    };
    for (const [eid, e] of Object.entries(escenas)) {
      if (!/^[a-z0-9][a-z0-9-]*$/.test(eid)) errores.push(`la escena "${eid}" (${id}) tiene un id raro: usa minusculas, numeros y guiones`);
      if (!e || !e.plantilla) errores.push(`la escena "${eid}" (${id}) no tiene "plantilla"`);
      suma(eid);
    }
    let tarjeta = null;
    if (typeof c.tarjeta === "string") {
      if (!escenas[c.tarjeta]) errores.push(`el capitulo ${id} pide la tarjeta "${c.tarjeta}", que no esta en sus escenas`);
      tarjeta = c.tarjeta;
    } else if (c.tarjeta !== false && titulo) {
      tarjeta = `tarjeta-${id}`;
      if (!escenas[tarjeta]) suma(tarjeta, { plantilla: "capitulo", datos: { numero: `Capítulo ${romano(numero)}`, titulo } });
    }
    const cap = { id, titulo, numero, etiqueta: c.etiqueta, tarjeta, escenas, frases: [], respaldos: [] };
    const usadas = new Set(tarjeta ? [tarjeta] : []);
    for (const f of c.frases || []) {
      if (!f || !f.id) {
        errores.push(`una frase del capitulo ${id} no tiene id`);
        continue;
      }
      if (vistas.has(f.id)) errores.push(`el id de frase "${f.id}" esta repetido (tienen que ser unicos en todo el video)`);
      vistas.add(f.id);
      if (!String(f.texto || "").trim()) errores.push(`la frase ${f.id} no tiene texto`);
      let escena = f.escena;
      if (!escena) {
        // Respaldo mientras el capitulo no tenga escenas: se ve que falta.
        escena = `respaldo-${f.id}`;
        const palabras = (titulo || guion.titulo || "").split(/\s+/).filter(Boolean);
        suma(escena, { plantilla: "titular", datos: { insignia: `Escena pendiente · ${f.id}`, lineas: equilibra(palabras, Math.min(2, palabras.length || 1)), resalta: 1, todo_al_inicio: true } });
        cap.respaldos.push(f.id);
      } else if (!escenas[escena]) errores.push(`la frase ${f.id} pide la escena "${escena}", que no esta en las escenas de ${id}`);
      if (escena === tarjeta) errores.push(`la frase ${f.id} usa la tarjeta "${tarjeta}" como escena: la tarjeta se ve sola, antes de la primera frase`);
      usadas.add(escena);
      for (const corte of f.cortes || []) {
        if (!corte || !corte.escena || !escenas[corte.escena]) errores.push(`un corte de la frase ${f.id} pide la escena "${corte && corte.escena}", que no esta en las escenas de ${id}`);
        else usadas.add(corte.escena);
      }
      const plana = { ...f, escena };
      delete plana.imagen; // pista del modo de fotos: aqui no se usa
      cap.frases.push(plana);
      frases.push({ ...plana, capitulo: id });
    }
    if (!cap.frases.length) errores.push(`el capitulo ${id} no tiene frases`);
    for (const eid of Object.keys(escenas)) if (!usadas.has(eid)) avisos.push(`la escena "${eid}" de ${id} no la usa ninguna frase ni corte`);
    capitulos.push(cap);
  });
  return { frases, capitulos, errores, avisos };
}

// El guion por escenas como lo entiende voz.mjs: una lista de frases con su escena, y antes de cada
// tarjeta de capitulo una pausa de voz ("pausa_capitulo", 3 s por defecto) en la frase anterior.
function aplanarEscenas(guion) {
  const plano = planEscenas(guion);
  if (plano.errores.length) throw new Error("El guion largo tiene problemas:\n  - " + plano.errores.join("\n  - "));
  const pausaCap = numero(guion.pausa_capitulo, 3);
  const frases = plano.frases.map((f) => ({ ...f }));
  let inicio = guion.inicio ?? 0.2;
  let i = 0;
  for (const cap of plano.capitulos) {
    if (cap.tarjeta && cap.frases.length) {
      if (i === 0) inicio = Math.max(inicio, pausaCap);
      else {
        const previa = frases[i - 1];
        previa.pausa_despues = Math.max(numero(previa.pausa_despues, numero(guion.pausa, 0.22)), pausaCap);
      }
    }
    i += cap.frases.length;
  }
  return { ...guion, frases, inicio, cola: numero(guion.cola, 2.5) };
}

// El guion largo como lo entiende voz.mjs: una lista de frases cuya "escena" es su tramo, con la
// pausa de voz de cada tarjeta puesta en la frase anterior (voz.mjs avanza con pausa_despues).
export function aplanarLargo(guion) {
  if (esLargoEscenas(guion)) return aplanarEscenas(guion);
  const plano = planLargo(guion);
  if (plano.errores.length) throw new Error("El guion largo tiene problemas:\n  - " + plano.errores.join("\n  - "));
  const a = ajustes(guion);
  const frases = plano.frases.map((f) => ({ ...f }));
  const indice = new Map(frases.map((f, i) => [f.id, i]));
  let inicio = guion.inicio ?? 0.2;
  for (const cap of plano.capitulos) {
    if (!cap.tarjeta || !cap.frases.length) continue;
    const pausa = cap.tarjeta === "apertura" ? a.pausaTitulo : a.pausaCapitulo;
    const i = indice.get(cap.frases[0]);
    if (i === 0) {
      inicio = Math.max(inicio, pausa); // sin gancho: la tarjeta abre el video
      continue;
    }
    const previa = frases[i - 1];
    previa.pausa_despues = Math.max(numero(previa.pausa_despues, numero(guion.pausa, 0.22)), pausa);
  }
  return { ...guion, frases, inicio, cola: a.cola };
}

// ---------- Imagenes ----------
function textoPlano(html) {
  return String(html || "")
    .replace(/<(div|span)[^>]*display:\s*none[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

const sinRastreo = (url) => String(url || "").split("?")[0];

function tituloCommons(t) {
  let s = String(t || "").trim().replace(/_/g, " ");
  s = s.replace(/^(file|archivo|image|imagen):\s*/i, "");
  return "File:" + s.charAt(0).toUpperCase() + s.slice(1);
}

// Solo dominio publico, CC0, CC BY y CC BY-SA. Devuelve el nombre corto, o null si no se acepta.
function licenciaAceptada(ficha) {
  const codigo = String(ficha.licencia_codigo || "").toLowerCase().trim();
  const corta = String(ficha.licencia || "").trim();
  if (ficha.no_libre) return null;
  if (/^pd($|[-\s])/.test(codigo) || /^(public domain|dominio p[uú]blico)/i.test(corta)) return "Dominio público";
  if (codigo === "cc0" || /^cc0/i.test(corta)) return "CC0";
  if (/^cc-by-sa-\d/.test(codigo) || /^cc[ -]by-sa[ -]\d/i.test(corta)) return corta || "CC BY-SA";
  if (/^cc-by-\d/.test(codigo) || /^cc[ -]by[ -]\d/i.test(corta)) return corta || "CC BY";
  return null;
}

// Pide a Wikimedia respetando sus limites: si contesta 429 o 503, espera lo que diga Retry-After.
async function pideWikimedia(url, intentos = 3) {
  for (let i = 1; ; i++) {
    let r;
    try {
      r = await fetch(url, { headers: { "User-Agent": UA, "Api-User-Agent": UA } });
    } catch (e) {
      if (i >= intentos) throw new Error(`No se pudo conectar con Wikimedia (${e.message}). Revisa la conexion a internet.`);
      await dormir(3000 * i);
      continue;
    }
    if (r.status === 429 || r.status === 503) {
      if (i >= intentos) {
        throw new Error(
          `Wikimedia sigue limitando los pedidos (${r.status}) en ${sinRastreo(url)}. Prueba mas tarde (lo ya bajado queda guardado) ` +
            "o pon un User-Agent propio, con un contacto, en la variable LEGION_COMMONS_UA.",
        );
      }
      const espera = limita(Number(r.headers.get("retry-after")) || 15 * i, 5, 180);
      console.log(`   Wikimedia pide esperar ${espera} s antes de seguir (limite de pedidos)...`);
      await dormir(espera * 1000);
      continue;
    }
    if (!r.ok) throw new Error(`Wikimedia respondio ${r.status} en ${sinRastreo(url)}`);
    return r;
  }
}

// Wikimedia limita mucho las descargas de originales (upload.wikimedia.org) a los clientes que no
// se identifican con un contacto; las miniaturas de tamano estandar (thumb.wikimedia.org) no. Se
// pide la mayor miniatura estandar mas chica que el original: si el original pasa de 3840 px, la
// de 2560 (que Commons sirve en su escalon de 3840); si no, 1920, 1280, 960 o 500.
function anchoMiniatura(ancho) {
  if (ancho > 3840) return 2560;
  return [1920, 1280, 960, 500].find((x) => x < ancho) || null;
}

// imageinfo de varios archivos a la vez (40 por pedido). Devuelve titulo pedido -> pagina (o null).
async function consultaCommons(titulos, ancho = 2560, completo = true) {
  const paginas = new Map();
  for (let i = 0; i < titulos.length; i += 40) {
    const lote = titulos.slice(i, i + 40);
    const url = new URL("https://commons.wikimedia.org/w/api.php");
    const params = {
      action: "query",
      format: "json",
      formatversion: "2",
      redirects: "1",
      prop: "imageinfo",
      iiprop: completo ? "url|extmetadata|size|mime" : "url|size",
      iiurlwidth: String(ancho),
      ...(completo ? { iiextmetadatafilter: "LicenseShortName|License|LicenseUrl|Artist|Credit|UsageTerms|AttributionRequired|Copyrighted|NonFree|Restrictions" } : {}),
      titles: lote.join("|"),
    };
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
    const datos = await (await pideWikimedia(url)).json();
    if (datos.error) throw new Error(`Wikimedia Commons: ${datos.error.info || datos.error.code}`);
    const alias = new Map();
    for (const n of [...((datos.query && datos.query.normalized) || []), ...((datos.query && datos.query.redirects) || [])]) alias.set(n.from, n.to);
    const porTitulo = new Map(((datos.query && datos.query.pages) || []).map((p) => [p.title, p]));
    for (const t of lote) {
      let final = t;
      for (let k = 0; k < 4 && alias.has(final); k++) final = alias.get(final);
      paginas.set(t, porTitulo.get(final) || null);
    }
    if (i + 40 < titulos.length) await dormir(1500);
  }
  return paginas;
}

function fichaDe(pagina) {
  if (!pagina || pagina.missing || pagina.invalid || !pagina.imageinfo || !pagina.imageinfo.length) return null;
  const ii = pagina.imageinfo[0];
  const m = ii.extmetadata || {};
  const v = (k) => (m[k] && m[k].value !== undefined && m[k].value !== null ? String(m[k].value) : "");
  return {
    v: VERSION.ficha,
    titulo: pagina.title,
    pagina: sinRastreo(ii.descriptionurl),
    url: sinRastreo(ii.thumburl || ii.url),
    original: sinRastreo(ii.url),
    ancho: ii.width,
    alto: ii.height,
    mime: ii.mime,
    licencia: textoPlano(v("LicenseShortName")),
    licencia_codigo: v("License"),
    licencia_url: v("LicenseUrl"),
    autor: textoPlano(v("Artist")).slice(0, 160) || "Autor desconocido",
    credito: textoPlano(v("Credit")).slice(0, 200),
    atribucion: v("AttributionRequired").toLowerCase() === "true",
    no_libre: v("NonFree").toLowerCase() === "true",
    restricciones: textoPlano(v("Restrictions")),
    consultado: new Date().toISOString(),
  };
}

// Deja cada imagen del guion lista para usar: { clave: { archivo, ancho, alto, origen, ficha... } }.
// Las de Commons se consultan (licencia) y se bajan una sola vez; quedan en animados/.imagenes-cache/.
async function preparaImagenes(carpeta, guion, usadas, avisos) {
  fs.mkdirSync(CACHE_IMAGENES, { recursive: true });
  const listas = {};
  const errores = [];
  const commons = [];
  for (const clave of usadas) {
    const img = guion.imagenes[clave];
    const comun = { clave, que_muestra: img.que_muestra || "", encuadre: img.encuadre, movimiento: img.movimiento, ajuste: img.ajuste };
    if (img.archivo && img.commons) {
      errores.push(`${clave}: lleva "commons" y "archivo" a la vez; deja uno`);
      continue;
    }
    if (img.archivo) {
      const ruta = path.resolve(carpeta, img.archivo);
      if (!ruta.startsWith(path.resolve(carpeta) + path.sep)) errores.push(`${clave}: "${img.archivo}" tiene que estar dentro de la carpeta del video`);
      else if (!fs.existsSync(ruta)) errores.push(`${clave}: no existe ${rel(ruta)}`);
      else listas[clave] = { ...comun, origen: "archivo", archivo: ruta, relativo: img.archivo.replace(/\\/g, "/"), credito: img.credito || "Material propio" };
      continue;
    }
    if (!img.commons) {
      errores.push(`${clave}: necesita "commons" (el nombre exacto del archivo en Wikimedia Commons) o "archivo"`);
      continue;
    }
    const titulo = tituloCommons(img.commons);
    const id = hash("commons:" + titulo).slice(0, 20);
    commons.push({ clave, titulo, id, comun, ficha: leeJson(path.join(CACHE_IMAGENES, id + ".json")) });
  }

  // Lo que no esta en la cache se consulta a Commons, de una vez.
  const faltan = commons.filter((c) => !c.ficha || c.ficha.v !== VERSION.ficha || !c.ficha.archivo || !fs.existsSync(path.join(CACHE_IMAGENES, c.ficha.archivo)));
  if (faltan.length) {
    console.log(`   consultando ${faltan.length} imagen(es) en Wikimedia Commons...`);
    const paginas = await consultaCommons([...new Set(faltan.map((c) => c.titulo))]);
    for (const c of faltan) {
      const ficha = fichaDe(paginas.get(c.titulo));
      if (!ficha) errores.push(`${c.clave}: "${c.titulo}" no existe en Wikimedia Commons (revisa el nombre exacto, con la extension)`);
      c.ficha = ficha ? { ...ficha, archivo: c.ficha && c.ficha.archivo } : null;
      c.nueva = true;
    }
    // URL de la miniatura estandar que se va a bajar (ver anchoMiniatura).
    const porAncho = new Map();
    for (const c of faltan) {
      if (!c.ficha) continue;
      const ancho = anchoMiniatura(c.ficha.ancho);
      if (!ancho || (ancho === 2560 && /\/thumb\//.test(c.ficha.url))) continue;
      if (!porAncho.has(ancho)) porAncho.set(ancho, []);
      porAncho.get(ancho).push(c);
    }
    for (const [ancho, lista] of porAncho) {
      await dormir(1000);
      const paginas = await consultaCommons([...new Set(lista.map((c) => c.titulo))], ancho, false);
      for (const c of lista) {
        const p = paginas.get(c.titulo);
        const ii = p && p.imageinfo && p.imageinfo[0];
        if (ii && ii.thumburl && /\/thumb\//.test(ii.thumburl)) c.ficha.url = sinRastreo(ii.thumburl);
      }
    }
  }
  if (errores.length) throw new Error("Problemas con las imagenes del guion:\n  - " + errores.join("\n  - "));

  // Licencias: se revisan todas (tambien las de la cache) antes de bajar nada.
  const malas = commons.filter((c) => !licenciaAceptada(c.ficha));
  if (malas.length) {
    throw new Error(
      "Imagenes con una licencia que no se puede usar (solo se aceptan dominio publico, CC0, CC BY y CC BY-SA):\n" +
        malas.map((c) => `  - ${c.clave}: ${c.ficha.licencia || c.ficha.licencia_codigo || "sin licencia declarada"} — ${c.ficha.pagina}`).join("\n") +
        '\nCambialas en "imagenes" del guion por otras de Commons con una de esas licencias.',
    );
  }

  // Descargas: de a una, con una pausa, para no pasar el limite de Wikimedia.
  let bajadas = 0;
  for (const c of commons) {
    const ext = (path.extname(new URL(c.ficha.url).pathname) || ".jpg").toLowerCase();
    const nombre = c.id + (ext === ".svg" ? ".png" : ext);
    const destino = path.join(CACHE_IMAGENES, nombre);
    if (!fs.existsSync(destino)) {
      if (bajadas++) await dormir(1500);
      process.stdout.write(`   bajando ${c.clave} ... `);
      const r = await pideWikimedia(c.ficha.url);
      const tipo = r.headers.get("content-type") || "";
      if (!/^image\//.test(tipo)) throw new Error(`${c.clave}: Wikimedia no devolvio una imagen (${tipo}) para ${c.ficha.url}`);
      fs.writeFileSync(destino + ".tmp", Buffer.from(await r.arrayBuffer()));
      fs.renameSync(destino + ".tmp", destino);
      console.log("ok");
    }
    c.ficha.archivo = nombre;
    if (c.nueva || !c.ficha.archivo) escribeJson(path.join(CACHE_IMAGENES, c.id + ".json"), c.ficha);
    if (c.ficha.restricciones) avisos.push(`imagen ${c.clave}: Commons marca restricciones (${c.ficha.restricciones}); revisa su pagina antes de publicar`);
    listas[c.clave] = { ...c.comun, origen: "commons", archivo: destino, ficha: c.ficha, licencia: licenciaAceptada(c.ficha) };
  }

  for (const [clave, img] of Object.entries(listas)) {
    const s = sonda(img.archivo);
    if (!s || !s.ancho) throw new Error(`${clave}: no se pudo leer la imagen ${rel(img.archivo)}`);
    img.ancho = s.ancho;
    img.alto = s.alto;
  }
  return listas;
}

// ---------- Lienzos y movimiento ----------
// Una imagen con una proporcion parecida a 16:9 cubre el cuadro (se recorta un poco segun su
// "encuadre"); las demas van enteras sobre una copia desenfocada de si mismas, sin barras negras.
const ANCLA = { centro: [0.5, 0.5], arriba: [0.5, 0], abajo: [0.5, 1], izquierda: [0, 0.5], derecha: [1, 0.5] };
const ENFOQUE = { centro: [0.5, 0.5], arriba: [0.5, 0.28], abajo: [0.5, 0.72], izquierda: [0.3, 0.5], derecha: [0.7, 0.5] };
const MOVIMIENTOS = ["acercar", "derecha", "alejar", "izquierda"];

function ajusteDe(img) {
  if (img.ajuste === "cubrir" || img.ajuste === "contener") return img.ajuste;
  const proporcion = img.ancho / img.alto;
  return proporcion >= 1.5 && proporcion <= 2.1 ? "cubrir" : "contener";
}

function lienzo(img, dir, avisos) {
  const st = fs.statSync(img.archivo);
  const ajuste = ajusteDe(img);
  const encuadre = ANCLA[img.encuadre] ? img.encuadre : "centro";
  const clave = hash({ v: VERSION.lienzo, f: path.basename(img.archivo), peso: st.size, fecha: Math.round(st.mtimeMs), ajuste, encuadre, w: LIENZO_W, h: LIENZO_H }).slice(0, 16);
  const destino = path.join(dir, `${img.clave}-${clave}.png`);
  // Cuanto se agranda la imagen en el cuadro final: mas de 1,6 veces se nota borrosa.
  const escala = ajuste === "cubrir" ? Math.max(ANCHO / img.ancho, ALTO / img.alto) : Math.min(ANCHO / img.ancho, ALTO / img.alto);
  if (escala > 1.6) avisos.push(`imagen ${img.clave}: es chica (${img.ancho}x${img.alto}); en pantalla se agranda ${escala.toFixed(1)} veces y puede verse borrosa`);
  if (fs.existsSync(destino)) return { ruta: destino, clave, ajuste };
  const W = LIENZO_W;
  const H = LIENZO_H;
  let filtro;
  if (ajuste === "cubrir") {
    const [ax, ay] = ANCLA[encuadre];
    filtro = `[0:v]scale=${W}:${H}:force_original_aspect_ratio=increase:flags=lanczos,crop=${W}:${H}:(iw-ow)*${ax}:(ih-oh)*${ay},setsar=1,format=rgb24[out]`;
  } else {
    filtro = [
      // Fondo: la misma imagen cubriendo el cuadro, muy desenfocada, mas oscura y menos saturada.
      `[0:v]scale=${W}:${H}:force_original_aspect_ratio=increase:flags=bilinear,crop=${W}:${H},scale=${W / 8}:${H / 8}:flags=area,gblur=sigma=9,scale=${W}:${H}:flags=bicubic,eq=brightness=-0.13:saturation=0.7,setsar=1,format=rgba[fondo]`,
      // La imagen entera, centrada, con una sombra suave alrededor.
      `[0:v]scale=${W}:${H}:force_original_aspect_ratio=decrease:flags=lanczos,setsar=1,format=rgba,split[img][s]`,
      `[s]drawbox=x=0:y=0:w=iw:h=ih:color=black:t=fill,pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2:color=black@0,gblur=sigma=26,colorchannelmixer=aa=0.6[sombra]`,
      `[fondo][sombra]overlay=0:0[f2]`,
      `[f2][img]overlay=(W-w)/2:(H-h)/2,format=rgb24[out]`,
    ].join(";");
  }
  ff(["-i", img.archivo, "-filter_complex", filtro, "-map", "[out]", "-frames:v", "1", "-update", "1", destino + ".tmp.png"]);
  fs.renameSync(destino + ".tmp.png", destino);
  return { ruta: destino, clave, ajuste };
}

// Movimiento lento de un tramo. Acercar/alejar: el zoom crece hacia el punto de "encuadre".
// Izquierda/derecha: la camara se desliza despacio en esa direccion (con un poco de zoom).
function movimientoDe(tipo, encuadre, durS) {
  const [fx, fy] = ENFOQUE[encuadre] || ENFOQUE.centro;
  const W = LIENZO_W;
  const H = LIENZO_H;
  if (tipo === "acercar" || tipo === "alejar") {
    const A = r3(limita(0.011 * durS, 0.05, 0.14));
    const [z0, z1] = tipo === "acercar" ? [1, 1 + A] : [1 + A, 1];
    return { tipo, z0, z1, fx, fy };
  }
  const z = 1.12;
  const rango = W - W / z;
  const amp = Math.min(rango, 46 * durS); // unos 38 px por segundo en el cuadro final
  const desde = limita(fx * rango - amp / 2, 0, rango - amp);
  const [x0, x1] = tipo === "derecha" ? [desde, desde + amp] : [desde + amp, desde];
  return { tipo, z, x0: r3(x0), x1: r3(x1), top: r3(fy * (H - H / z)) };
}

// Interpolacion lineal a -> b segun la expresion P (de 0 a 1), sin comas ni signos dobles.
const lineal = (a, b, P) => (b >= a ? `(${a}+${r3(b - a)}*${P})` : `(${a}-${r3(a - b)}*${P})`);

// El filtro perspective de ffmpeg recorta con precision de subpixel: el movimiento sale suave,
// sin el temblor de zoompan (que redondea a pixeles enteros).
function perspectiva(m, F0, V) {
  const P = `((on+${F0})/${Math.max(1, V - 1)})`;
  const W = LIENZO_W;
  const H = LIENZO_H;
  let x;
  let y;
  let w;
  let h;
  if (m.z0 !== undefined) {
    const z = lineal(m.z0, m.z1, P);
    w = `(${W}/${z})`;
    h = `(${H}/${z})`;
    x = `(${r3(m.fx * W)}*(1-1/${z}))`;
    y = `(${r3(m.fy * H)}*(1-1/${z}))`;
  } else {
    w = String(r3(W / m.z));
    h = String(r3(H / m.z));
    x = lineal(m.x0, m.x1, P);
    y = String(m.top);
  }
  return `perspective=x0='${x}':y0='${y}':x1='${x}+${w}':y1='${y}':x2='${x}':y2='${y}+${h}':x3='${x}+${w}':y3='${y}+${h}':interpolation=linear:eval=frame`;
}

// ---------- Plan: que se ve en cada cuadro ----------
// Elementos en orden (tramos de imagen y tarjetas), cada uno con su inicio en cuadros. Entre dos
// elementos hay un fundido centrado en el limite. Cada "clip" es lo que se renderiza aparte: va
// desde que termina un fundido hasta que termina el siguiente, asi se pegan sin recodificar.
function planVisual(guion, plano, tv, imagenes, avisos) {
  const a = ajustes(guion);
  const TF = Math.round(tv.duracion * FPS);
  const escenas = new Map(tv.escenas.map((e) => [e.id, e]));
  const frases = new Map(tv.frases.map((f) => [f.id, f]));
  const tarjetaDe = new Map();
  for (const c of plano.capitulos) if (c.tarjeta && c.tramos.length) tarjetaDe.set(c.tramos[0], c);
  const els = [];
  let nImagen = 0;
  plano.tramos.forEach((t, k) => {
    const e = escenas.get(t.id);
    if (!e) throw new Error(`tiempos.json no trae el tramo ${t.id}: vuelve a correr la voz.`);
    let inicio = k === 0 ? 0 : e.inicio;
    const cap = tarjetaDe.get(t.id);
    if (cap) {
      const dur = cap.tarjeta === "apertura" ? a.durTitulo : a.durTarjeta;
      let S = 0;
      if (k > 0) {
        const ultima = frases.get(plano.tramos[k - 1].frases.at(-1));
        S = Math.max(ultima.fin + 0.2, els.at(-1).inicio + 1.0);
      }
      let E = S + dur;
      const tope = e.fin - 1.2;
      if (E > tope) {
        E = Math.max(S + 1.5, tope);
        avisos.push(`la tarjeta del capitulo ${cap.id} se acorto a ${(E - S).toFixed(1)} s porque el tramo que sigue es muy corto`);
      }
      els.push({ tipo: "tarjeta", capitulo: cap, inicio: S });
      inicio = E;
    }
    const img = imagenes[t.imagen];
    els.push({ tipo: "imagen", tramo: t.id, clave: t.imagen, img, indice: nImagen++, inicio, finVoz: e.fin });
  });

  els.forEach((el, i) => (el.B = i === 0 ? 0 : Math.round(el.inicio * FPS)));
  for (let i = 1; i < els.length; i++) if (els[i].B < els[i - 1].B + 9) els[i].B = els[i - 1].B + 9;
  const limite = (i) => (i + 1 < els.length ? els[i + 1].B : TF);
  const hBase = Math.max(1, Math.round((a.fundido * FPS) / 2));
  els.forEach((el, i) => {
    el.h = i === 0 ? 0 : Math.max(1, Math.min(hBase, Math.floor((el.B - els[i - 1].B) / 3), Math.floor((limite(i) - el.B) / 3)));
  });
  els.forEach((el, i) => {
    el.visIni = i === 0 ? 0 : el.B - el.h;
    el.visFin = i + 1 < els.length ? els[i + 1].B + els[i + 1].h : TF;
    el.V = el.visFin - el.visIni;
    if (el.tipo === "imagen") {
      const dur = el.V / FPS;
      const tipo = MOVIMIENTOS.includes(el.img.movimiento) ? el.img.movimiento : MOVIMIENTOS[el.indice % MOVIMIENTOS.length];
      el.mov = movimientoDe(tipo, el.img.encuadre, dur);
      if (dur > 25) avisos.push(`el tramo ${el.tramo} (${el.clave}) dura ${Math.round(dur)} s con una sola imagen; parte sus frases entre dos imagenes`);
    }
  });
  const fFinal = Math.round(a.fundidoFinal * FPS);
  const clips = els.map((el, i) => {
    const C0 = i === 0 ? 0 : el.B + el.h;
    const C1 = i + 1 < els.length ? els[i + 1].B + els[i + 1].h : TF;
    const b = els[i + 1] || null;
    const N = C1 - C0;
    return { i, a: el, b, F0: C0 - el.visIni, N, T: b ? 2 * b.h : 0, C0, salida: b ? 0 : Math.min(fFinal, Math.max(0, N - 2)) };
  });
  return { TF, els, clips };
}

// ---------- Subtitulos (.srt) ----------
const MAX_LINEA = 42;
const MAX_SUB = 6;

// Parte un texto en 1 o 2 lineas de hasta 42 letras, lo mas parejas posible. null si no cabe.
function lineasSub(palabras) {
  const texto = palabras.join(" ");
  if (texto.length <= MAX_LINEA) return [texto];
  let mejor = null;
  for (let i = 1; i < palabras.length; i++) {
    const a = palabras.slice(0, i).join(" ");
    const b = palabras.slice(i).join(" ");
    if (a.length > MAX_LINEA || b.length > MAX_LINEA) continue;
    const nota = Math.max(a.length, b.length) - (/[,;:.]$/.test(palabras[i - 1]) ? 6 : 0) + (ENLACES.has(String(palabras[i - 1]).toLowerCase()) ? 8 : 0);
    if (!mejor || nota < mejor.nota) mejor = { nota, lineas: [a, b] };
  }
  return mejor ? mejor.lineas : null;
}

// Cada frase se parte en el menor numero de subtitulos que quepan (2 lineas, 6 s), lo mas parejos
// posible y, si se puede, despues de una coma o un punto: nunca queda una palabra suelta al final.
function parteFrase(palabras) {
  const n = palabras.length;
  const cabe = (i, j) => Boolean(lineasSub(palabras.slice(i, j).map((p) => p.texto))) && palabras[j - 1].fin - palabras[i].inicio <= MAX_SUB;
  const costo = (i, j) => {
    const largo = palabras.slice(i, j).map((p) => p.texto).join(" ").length;
    let c = 1000;
    if (largo < 22) c += (22 - largo) * 12;
    if (largo > 70) c += (largo - 70) * 2;
    if (j < n && /[.!?…]$/.test(palabras[j - 1].texto)) c -= 60;
    else if (j < n && /[,;:]$/.test(palabras[j - 1].texto)) c -= 35;
    else if (j < n && ENLACES.has(palabras[j - 1].texto.toLowerCase())) c += 40;
    return c;
  };
  const mejor = new Array(n + 1).fill(Infinity);
  const desde = new Array(n + 1).fill(-1);
  mejor[0] = 0;
  for (let j = 1; j <= n; j++) {
    for (let i = j - 1; i >= 0; i--) {
      if (!cabe(i, j)) {
        if (j - i > 1) break; // mas palabras tampoco caben
        mejor[j] = mejor[i] + 5000; // una palabra sola que no cabe: va igual
        desde[j] = i;
        break;
      }
      if (mejor[i] + costo(i, j) < mejor[j]) {
        mejor[j] = mejor[i] + costo(i, j);
        desde[j] = i;
      }
    }
  }
  const cortes = [];
  for (let j = n; j > 0; j = desde[j]) cortes.unshift([desde[j], j]);
  return cortes.map(([i, j]) => palabras.slice(i, j));
}

function hazSrt(tv, frasesGuion) {
  const sinSub = new Set(frasesGuion.filter((f) => f.subtitulos === false).map((f) => f.id));
  const subs = [];
  for (const frase of tv.frases) {
    if (sinSub.has(frase.id) || !frase.palabras.length) continue;
    for (const grupo of parteFrase(frase.palabras)) subs.push({ palabras: grupo, inicio: grupo[0].inicio, fin: grupo.at(-1).fin });
  }
  const ts = (s) => {
    const ms = Math.max(0, Math.round(s * 1000));
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const ss = Math.floor((ms % 60000) / 1000);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")},${String(ms % 1000).padStart(3, "0")}`;
  };
  return subs
    .map((s, i) => {
      const siguiente = subs[i + 1];
      const tope = siguiente ? siguiente.inicio - 0.05 : s.fin + 1;
      let fin = Math.min(s.fin + 0.3, tope);
      if (fin - s.inicio < 1.0) fin = Math.min(s.inicio + 1.0, tope);
      fin = Math.min(Math.max(fin, s.fin), s.inicio + MAX_SUB);
      const lineas = lineasSub(s.palabras.map((p) => p.texto)) || [s.palabras.map((p) => p.texto).join(" ")];
      return `${i + 1}\n${ts(s.inicio)} --> ${ts(fin)}\n${lineas.join("\n")}\n`;
    })
    .join("\n");
}

// ---------- Textos de la entrega ----------
function capitulosYoutube(plan, plano, total, avisos) {
  const lista = [];
  const primero = plano.capitulos[0];
  if (primero && !primero.tarjeta) lista.push({ etiqueta: primero.etiqueta || "Introducción", inicio: 0 });
  for (const el of plan.els) {
    if (el.tipo !== "tarjeta") continue;
    const c = el.capitulo;
    lista.push({ etiqueta: c.etiqueta || c.titulo, inicio: el.B / FPS });
  }
  // YouTube: el primero en 00:00, al menos 3 y cada uno de 10 s o mas.
  if (lista.length > 1 && lista[1].inicio < 10 && lista[0].inicio === 0) {
    avisos.push(`el gancho dura menos de 10 s: en la descripcion, el capitulo "${lista[1].etiqueta}" empieza en 00:00`);
    lista.splice(0, 1);
  }
  if (lista.length) lista[0].inicio = 0;
  lista.forEach((c, i) => {
    const fin = i + 1 < lista.length ? lista[i + 1].inicio : total;
    c.dura = fin - c.inicio;
    if (c.dura < 10) avisos.push(`el capitulo "${c.etiqueta}" dura ${c.dura.toFixed(1)} s; YouTube pide 10 s o mas por capitulo`);
  });
  if (lista.length < 3) avisos.push(`hay ${lista.length} capitulo(s) en la descripcion; YouTube solo los muestra con 3 o mas`);
  return lista;
}

function creditosDe(imagenes, plan) {
  const apariciones = {};
  for (const el of plan.els) if (el.tipo === "imagen") (apariciones[el.clave] ||= []).push(minutos(el.B / FPS));
  return Object.values(imagenes).map((img) => ({
    clave: img.clave,
    que_muestra: img.que_muestra,
    origen: img.origen,
    autor: img.origen === "commons" ? img.ficha.autor : img.credito,
    licencia: img.origen === "commons" ? img.licencia : "",
    licencia_url: img.origen === "commons" ? img.ficha.licencia_url : "",
    pagina: img.origen === "commons" ? img.ficha.pagina : "",
    titulo: img.origen === "commons" ? img.ficha.titulo : img.relativo,
    aparece: [...new Set(apariciones[img.clave] || [])],
  }));
}

function escribeCreditos(dir, guion, creditos) {
  const celda = (s) => String(s || "").replace(/\|/g, "/").replace(/\n/g, " ");
  const filas = creditos.map((c) => {
    const licencia = c.origen === "commons" ? (c.licencia_url ? `[${c.licencia}](${c.licencia_url})` : c.licencia) : "Propia";
    const fuente = c.origen === "commons" ? `[${celda(c.titulo)}](${c.pagina})` : celda(c.titulo);
    return `| ${celda(c.clave)} | ${celda(c.que_muestra)} | ${celda(c.autor)} | ${licencia} | ${fuente} | ${c.aparece.join(", ")} |`;
  });
  const texto = [
    `# Créditos de las imágenes: ${guion.titulo || ""}`,
    "",
    "Imágenes de Wikimedia Commons con licencia libre (dominio público, CC0, CC BY o CC BY-SA), comprobada al producir el video. Las CC BY y CC BY-SA exigen citar al autor y la licencia: van en la descripción de YouTube.",
    "",
    "| Imagen | Qué muestra | Autor | Licencia | Fuente | Aparece en |",
    "|---|---|---|---|---|---|",
    ...filas,
    "",
  ].join("\n");
  fs.writeFileSync(path.join(dir, "creditos-imagenes.md"), texto, "utf8");
}

function escribeFuentes(dir, guion) {
  if (!Array.isArray(guion.fuentes) || !guion.fuentes.length) return;
  const lineas = [`# Fuentes: ${guion.titulo || ""}`, "", ...guion.fuentes.map((f) => `- **${f.dato || ""}** — ${f.fuente || ""}${f.url ? ` (${f.url})` : ""}`), ""];
  fs.writeFileSync(path.join(dir, "fuentes.md"), lineas.join("\n"), "utf8");
}

const etiquetas = (lista) => (lista || []).map((h) => (String(h).startsWith("#") ? h : "#" + h)).join(" ");

// YouTube admite 5000 caracteres. Las CC BY y CC BY-SA siempre llevan su atribucion completa (la
// licencia lo exige); las de dominio publico y CC0 se citan por cortesia y, si no cabe, en corto.
function escribeDescripcion(dir, guion, capitulos, creditos, avisos) {
  const pub = guion.publicacion || {};
  const conAtribucion = creditos.filter((c) => c.origen === "commons" && /^CC BY/i.test(c.licencia));
  const libres = creditos.filter((c) => c.origen === "commons" && !/^CC BY/i.test(c.licencia));
  const corta = (c) => (c.licencia === "CC0" ? "CC0" : c.licencia.toLowerCase());
  const hayFuentes = Array.isArray(guion.fuentes) && guion.fuentes.length > 0;
  const fuentesCompletas = hayFuentes ? [...new Set(guion.fuentes.map((f) => `- ${f.fuente || ""}${f.url ? `: ${f.url}` : ""}`))] : [];
  // Solo el nombre de la obra o institucion ("Encyclopaedia Britannica, «...»" -> "Encyclopaedia Britannica").
  const fuentesNombres = hayFuentes ? [...new Set(guion.fuentes.map((f) => String(f.fuente || "").split(/[,«"(]/)[0].trim()).filter(Boolean))] : [];
  const AVISO_COMENTARIO = "La lista completa de fuentes, con sus enlaces, está en el comentario fijado.";
  // Niveles: 0-2 recortan los creditos de dominio publico; 3-4 dejan en la descripcion solo los
  // nombres de las fuentes y mandan la lista con enlaces a comentario-fuentes.txt (para fijarlo).
  const arma = (nivel) => {
    const partes = [pub.titulo_youtube || guion.titulo || "", ""];
    if (pub.descripcion) partes.push(String(pub.descripcion).trim(), "");
    if (capitulos.length) partes.push("CAPÍTULOS", ...capitulos.map((c) => `${minutos(c.inicio)} ${c.etiqueta}`), "");
    if (hayFuentes) {
      if (nivel <= 2) partes.push("FUENTES", ...fuentesCompletas, "");
      else if (nivel === 3) partes.push("FUENTES", ...fuentesNombres.map((n) => `- ${n}`), AVISO_COMENTARIO, "");
      else partes.push("FUENTES: " + fuentesNombres.join(" · "), AVISO_COMENTARIO, "");
    }
    if (conAtribucion.length || libres.length) {
      partes.push("IMÁGENES (Wikimedia Commons)");
      for (const c of conAtribucion) partes.push(`- ${c.que_muestra || c.titulo}: ${c.autor}, ${c.licencia}${c.licencia_url ? ` (${c.licencia_url})` : ""}. ${c.pagina}`);
      if (nivel === 0) for (const c of libres) partes.push(`- ${c.que_muestra || c.titulo}: ${c.autor} (${corta(c)}). ${c.pagina}`);
      else if (nivel === 1) for (const c of libres) partes.push(`- ${c.que_muestra || c.titulo}: ${c.autor} (${corta(c)})`);
      else if (libres.length) partes.push(`- Además, ${libres.length} imagen(es) de dominio público o CC0.`);
      partes.push("");
    }
    if (pub.hashtags && pub.hashtags.length) partes.push(etiquetas(pub.hashtags), "");
    return partes.join("\n").replace(/\n{3,}/g, "\n\n");
  };
  let nivel = 0;
  let texto = arma(0);
  while (nivel < 4 && texto.length > 5000) texto = arma(++nivel);
  if (texto.length > 5000) avisos.push(`descripcion.txt tiene ${texto.length} caracteres; YouTube admite 5000 (acorta la descripcion o las fuentes)`);
  fs.writeFileSync(path.join(dir, "descripcion.txt"), texto, "utf8");
  const archivoComentario = path.join(dir, "comentario-fuentes.txt");
  if (nivel >= 3) {
    const comentario = ["Fuentes de este video:", ...fuentesCompletas].join("\n") + "\n";
    fs.writeFileSync(archivoComentario, comentario, "utf8");
    // Un comentario de YouTube admite 10 000 caracteres.
    if (comentario.length > 10000) avisos.push(`comentario-fuentes.txt tiene ${comentario.length} caracteres; un comentario de YouTube admite 10000`);
  } else {
    fs.rmSync(archivoComentario, { force: true });
  }
  return texto;
}

// ---------- Tarjetas y miniatura (HyperFrames) ----------
function temaDe(guion) {
  const nombre = (guion.estilo && guion.estilo.tema) || "archivo";
  const tema = TEMAS[nombre];
  if (!tema) throw new Error(`estilo.tema "${nombre}" no existe. Los que hay: ${Object.keys(TEMAS).join(", ")}`);
  const e = { fondo: tema.fondo, brillo: tema.brillo, ...(guion.estilo || {}) };
  const rgb = [1, 3, 5].map((i) => parseInt(String(e.brillo).slice(i, i + 2), 16));
  const paleta = { fondo: e.fondo, brillo: e.brillo, brilloFin: `rgba(${rgb.join(", ")}, 0)` };
  return { nombre, tema, paleta, vars: { "--papel": paleta.fondo, ...tema.vars } };
}

// Colores del texto de la miniatura (sobre la imagen oscurecida), por tema.
const MINI = { archivo: ["#fff3d6", "#ffc93c"], laboratorio: ["#ffffff", "#5ff0e6"], pizarra: ["#ffffff", "#b8ff3c"] };

// Reparte palabras en n lineas minimizando la mas larga; una linea que termina en una palabra de
// enlace ("a", "de", "la", "y"...) cuenta como si fuera 6 letras mas larga, para no dejarla colgando.
const ENLACES = new Set(["a", "al", "de", "del", "el", "la", "las", "los", "lo", "y", "e", "o", "u", "en", "con", "por", "para", "que", "un", "una", "su", "sus", "the", "of", "and", "to", "in"]);
function equilibra(palabras, n) {
  const m = palabras.length;
  const largo = (i, j) => palabras.slice(i, j).join(" ").length + (j < m && ENLACES.has(String(palabras[j - 1]).toLowerCase()) ? 6 : 0);
  const memo = new Map();
  const mejor = (i, k) => {
    if (k === 1) return { costo: largo(i, m), cortes: [] };
    const llave = i + "," + k;
    if (memo.has(llave)) return memo.get(llave);
    let res = null;
    for (let j = i + 1; j <= m - k + 1; j++) {
      const resto = mejor(j, k - 1);
      const costo = Math.max(largo(i, j), resto.costo);
      if (!res || costo < res.costo) res = { costo, cortes: [j, ...resto.cortes] };
    }
    memo.set(llave, res);
    return res;
  };
  const { cortes } = mejor(0, n);
  const lineas = [];
  let desde = 0;
  for (const c of [...cortes, m]) {
    lineas.push(palabras.slice(desde, c).join(" "));
    desde = c;
  }
  return lineas;
}

// Lineas y tamano de letra para que un texto llene su caja (ancho medio de letra en em).
function reparte(texto, { maxLineas, ancho, alto, tamMax, tamMin, anchoLetra, interlinea = 1.08 }) {
  const manual = String(texto).split(/\s*[|\n]\s*/).filter(Boolean);
  const opciones = [];
  if (manual.length > 1) opciones.push(manual);
  else {
    const palabras = String(texto).split(/\s+/).filter(Boolean);
    for (let n = 1; n <= Math.min(maxLineas, palabras.length); n++) opciones.push(equilibra(palabras, n));
  }
  let mejor = null;
  for (const lineas of opciones) {
    const largo = Math.max(...lineas.map((l) => l.length));
    const tam = Math.min(tamMax, ancho / (largo * anchoLetra), alto / (lineas.length * interlinea));
    if (!mejor || tam > mejor.tam * 1.04) mejor = { lineas, tam };
  }
  mejor.tam = Math.max(tamMin, Math.floor(mejor.tam));
  return mejor;
}

const ROMANOS = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
const romano = (n) => ROMANOS.reduce((s, [v, l]) => {
  while (n >= v) {
    s += l;
    n -= v;
  }
  return s;
}, "");

const ORNAMENTO = `<svg viewBox="0 0 600 28" width="600" height="28"><line x1="0" y1="14" x2="268" y2="14" stroke="currentColor" stroke-width="3"/><path d="M300 1 L313 14 L300 27 L287 14 Z" fill="currentColor"/><circle cx="276" cy="14" r="3.5" fill="currentColor"/><circle cx="324" cy="14" r="3.5" fill="currentColor"/><line x1="332" y1="14" x2="600" y2="14" stroke="currentColor" stroke-width="3"/></svg>`;

function escribeProyectoHF(dir, nombre) {
  fs.mkdirSync(dir, { recursive: true });
  const base = {
    "meta.json": { id: nombre, name: nombre },
    "hyperframes.json": {
      $schema: "https://hyperframes.heygen.com/schema/hyperframes.json",
      registry: "https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry",
      paths: { blocks: "compositions", components: "compositions/components", assets: "assets" },
      media: { autoProxy: true },
    },
    "package.json": { name: nombre, private: true, type: "module" },
  };
  for (const [archivo, contenido] of Object.entries(base)) {
    const ruta = path.join(dir, archivo);
    if (!fs.existsSync(ruta)) escribeJson(ruta, contenido);
  }
}

function paginaHF({ ancho, alto, duracion, t, estilos, cuerpo, guion }) {
  const varsCss = Object.entries(t.vars).map(([k, v]) => `        ${k}: ${v};`).join("\n");
  const enlace = t.tema.google ? `\n    <link rel="stylesheet" href="${t.tema.google}" />` : "";
  return `<!doctype html>
<!-- Generado por animados/herramientas/largo.mjs. No editar a mano. -->
<html lang="es" data-resolution="landscape" data-tema="${t.nombre}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${ancho}, height=${alto}" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>${enlace}
    <style>
      :root {
${varsCss}
      }
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      html,
      body {
        margin: 0;
        width: ${ancho}px;
        height: ${alto}px;
        overflow: hidden;
        background: var(--papel);
      }
      #root {
        position: relative;
        width: ${ancho}px;
        height: ${alto}px;
        overflow: hidden;
        font-family: ${t.vars["--fuente-texto"]};
        color: var(--tinta);
      }
${estilos}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${duracion}" data-width="${ancho}" data-height="${alto}">
${cuerpo.html}
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      const tl = gsap.timeline({ paused: true });
${cuerpo.js}
      window.__timelines["main"] = tl;
      tl.seek(0);
    </script>
  </body>
</html>
`;
}

// Un solo video con todas las tarjetas seguidas; cada clip toma la suya por numero de cuadro.
function tarjetas(trabajo, guion, plan) {
  const t = temaDe(guion);
  const lista = plan.els.filter((el) => el.tipo === "tarjeta");
  if (!lista.length) return null;
  let K0 = 0;
  for (const el of lista) {
    el.K0 = K0;
    K0 += el.V;
  }
  const totalCuadros = K0;
  const anchoTit = t.tema.anchos.anchoTitulo;
  const anchoTxt = t.tema.anchos.anchoTexto;
  const datos = lista.map((el) => {
    const c = el.capitulo;
    const apertura = c.tarjeta === "apertura";
    const titulo = apertura
      ? reparte(guion.titulo || "", { maxLineas: 3, ancho: 1500, alto: 460, tamMax: 140, tamMin: 64, anchoLetra: anchoTit })
      : reparte(c.titulo, { maxLineas: 2, ancho: 1500, alto: 320, tamMax: 140, tamMin: 64, anchoLetra: anchoTit });
    return { K0: el.K0, V: el.V, hEntra: el.h, apertura, numero: c.numero, capTitulo: c.titulo, titulo };
  });
  const firma = hash({ v: VERSION.tarjetas, tema: t.nombre, vars: t.vars, paleta: t.paleta, datos, titulo: guion.titulo });
  const dir = path.join(trabajo, "tarjetas");
  const video = path.join(dir, `tarjetas-${firma.slice(0, 12)}.mp4`);
  for (const el of lista) el.video = video;
  if (fs.existsSync(video)) return { video, nuevo: false };

  const s = (cuadros) => r3(cuadros / FPS);
  const html = [];
  const js = [];
  html.push(`      <div id="fondo"></div>\n      <div class="marco"></div>\n      <div class="marco marco-2"></div>`);
  datos.forEach((d, i) => {
    const id = `tj${i + 1}`;
    const ini = s(d.K0);
    const dur = s(d.V);
    const entra = ini + s(2 * d.hEntra) * 0.7 + 0.1; // cuando ya va terminando el fundido de entrada
    const lineas = d.titulo.lineas.map((l) => `<div>${escapa(l)}</div>`).join("");
    if (d.apertura) {
      html.push(`      <div class="clip tj" id="${id}" data-start="${ini}" data-duration="${dur}">
        <div class="tj-cont" id="${id}-cont">
          <div class="tj-titulo" id="${id}-tit" style="font-size: ${d.titulo.tam}px">${lineas}</div>
          <div class="tj-orn" id="${id}-orn">${ORNAMENTO}</div>
          <div class="tj-sub" id="${id}-sub"><span class="tj-sub-rot">Capítulo ${romano(d.numero)}</span><span class="tj-sub-sep">·</span><span>${escapa(d.capTitulo)}</span></div>
        </div>
      </div>`);
      js.push(`      tl.fromTo("#${id}-cont", { scale: 1 }, { scale: 1.035, duration: ${dur}, ease: "none" }, ${ini});`);
      js.push(`      tl.fromTo("#${id}-tit", { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, ${r3(entra)});`);
      js.push(`      tl.fromTo("#${id}-orn", { opacity: 0, scaleX: 0.15 }, { opacity: 1, scaleX: 1, duration: 0.8, ease: "power2.out" }, ${r3(entra + 0.45)});`);
      js.push(`      tl.fromTo("#${id}-sub", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, ${r3(Math.max(entra + 1.2, ini + dur * 0.42))});`);
    } else {
      html.push(`      <div class="clip tj" id="${id}" data-start="${ini}" data-duration="${dur}">
        <div class="tj-cont" id="${id}-cont">
          <div class="tj-rot" id="${id}-rot">Capítulo ${romano(d.numero)}</div>
          <div class="tj-orn" id="${id}-orn">${ORNAMENTO}</div>
          <div class="tj-titulo" id="${id}-tit" style="font-size: ${d.titulo.tam}px">${lineas}</div>
        </div>
      </div>`);
      js.push(`      tl.fromTo("#${id}-cont", { scale: 1 }, { scale: 1.035, duration: ${dur}, ease: "none" }, ${ini});`);
      js.push(`      tl.fromTo("#${id}-rot", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, ${r3(entra)});`);
      js.push(`      tl.fromTo("#${id}-orn", { opacity: 0, scaleX: 0.15 }, { opacity: 1, scaleX: 1, duration: 0.8, ease: "power2.out" }, ${r3(entra + 0.2)});`);
      js.push(`      tl.fromTo("#${id}-tit", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, ${r3(entra + 0.4)});`);
    }
  });
  const estilos = `      #fondo {
        position: absolute;
        inset: 0;
        background:${t.tema.fondoCss(t.paleta)};
      }
      .marco {
        position: absolute;
        inset: 52px;
        border: 3px solid var(--marco);
        opacity: 0.55;
      }
      .marco-2 {
        inset: 66px;
        border-width: 1px;
      }
      .tj {
        position: absolute;
        inset: 0;
      }
      .tj-cont {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 34px;
        padding-bottom: 170px; /* la franja de abajo queda libre para los subtitulos */
      }
      .tj-titulo {
        font-family: ${t.vars["--fuente-titulo"]};
        font-weight: ${t.vars["--peso-titulo"]};
        letter-spacing: ${t.vars["--espaciado-titulo"]};
        line-height: 1.08;
        color: var(--tinta);
        text-shadow: var(--resplandor-tinta);
        text-align: center;
        white-space: nowrap;
        opacity: 0;
      }
      .tj-rot,
      .tj-sub-rot {
        font-family: ${t.vars["--fuente-texto"]};
        font-weight: 700;
        text-transform: uppercase;
        color: var(--acento);
        text-shadow: var(--resplandor);
      }
      .tj-rot {
        font-size: 48px;
        letter-spacing: 0.34em;
        padding-left: 0.34em;
        opacity: 0;
      }
      .tj-orn {
        width: 600px;
        height: 28px;
        color: var(--acento2);
        opacity: 0;
      }
      .tj-orn svg {
        display: block;
      }
      .tj-sub {
        font-family: ${t.vars["--fuente-texto"]};
        font-weight: 700;
        font-size: 50px;
        color: var(--tinta-suave);
        white-space: nowrap;
        opacity: 0;
      }
      .tj-sub-rot {
        letter-spacing: 0.22em;
        font-size: 40px;
      }
      .tj-sub-sep {
        margin: 0 22px;
        color: var(--acento2);
      }`;
  escribeProyectoHF(dir, "tarjetas");
  for (const viejo of fs.readdirSync(dir).filter((n) => /^tarjetas-.*\.mp4$/.test(n))) fs.rmSync(path.join(dir, viejo), { force: true });
  const duracion = r3(totalCuadros / FPS);
  fs.writeFileSync(path.join(dir, "index.html"), paginaHF({ ancho: ANCHO, alto: ALTO, duracion, t, estilos, cuerpo: { html: html.join("\n"), js: js.join("\n") }, guion }), "utf8");
  hiperframes(`render -q delivery --fps ${FPS} -o "${video}.tmp.mp4"`, dir);
  fs.renameSync(video + ".tmp.mp4", video);
  const s2 = sonda(video);
  if (!s2 || Math.abs(s2.duracion - duracion) > 0.2) throw new Error(`El video de las tarjetas salio con ${s2 ? s2.duracion : "?"} s y debia durar ${duracion} s.`);
  return { video, nuevo: true };
}

// miniatura.jpg de 1280x720: la imagen elegida y el texto grande, con mucho contraste.
function miniatura(trabajo, dirEntrega, guion, imagenes, avisos) {
  const pedida = guion.miniatura || {};
  const destino = path.join(dirEntrega, "miniatura.jpg");
  if (!pedida.texto || !pedida.imagen) {
    avisos.push('sin "miniatura" (texto e imagen) en el guion: no se hizo miniatura.jpg');
    return null;
  }
  const img = imagenes[pedida.imagen];
  if (!img) throw new Error(`miniatura.imagen "${pedida.imagen}" no esta en "imagenes".`);
  const t = temaDe(guion);
  const lado = pedida.lado === "derecha" ? "derecha" : "izquierda";
  const vertical = img.ancho / img.alto < 1.2;
  const anchoLetra = t.tema.anchos.anchoTitulo * 1.32; // en mayusculas
  const texto = reparte(String(pedida.texto).toUpperCase(), { maxLineas: 3, ancho: vertical ? 600 : 640, alto: 520, tamMax: 150, tamMin: 54, anchoLetra, interlinea: 1.0 });
  const resalta = Number.isInteger(pedida.resalta) ? pedida.resalta : texto.lineas.length - 1;
  const [colTexto, colResalta] = MINI[t.nombre] || MINI.archivo;
  const firma = hash({ v: VERSION.miniatura, tema: t.nombre, texto, resalta, lado, img: path.basename(img.archivo), encuadre: pedida.encuadre || img.encuadre, vertical });
  const sello = path.join(trabajo, "miniatura.firma");
  if (fs.existsSync(destino) && fs.existsSync(sello) && fs.readFileSync(sello, "utf8") === firma) return destino;

  const dir = path.join(trabajo, "miniatura");
  escribeProyectoHF(dir, "miniatura");
  fs.mkdirSync(path.join(dir, "assets"), { recursive: true });
  // Copia a un tamano razonable (Chrome no necesita los 3840 px de Commons).
  const foto = path.join(dir, "assets", "foto.jpg");
  ff(["-i", img.archivo, "-vf", "scale='min(2000,iw)':-2:flags=lanczos", "-frames:v", "1", "-q:v", "2", "-update", "1", foto]);
  const [ax, ay] = ANCLA[pedida.encuadre || img.encuadre] || ANCLA.centro;
  const izq = lado === "izquierda";
  const lineas = texto.lineas.map((l, i) => `<div${i === resalta ? ' class="resalta"' : ""}>${escapa(l)}</div>`).join("");
  const imagenHtml = vertical
    ? `      <img class="mini-fondo" src="assets/foto.jpg" alt="" />\n      <img class="mini-lado" src="assets/foto.jpg" alt="" />`
    : `      <img class="mini-img" src="assets/foto.jpg" alt="" />`;
  const sombra = "#120a04";
  const contorno = [];
  for (let k = 0; k < 16; k++) contorno.push(`${r3(Math.cos((k * Math.PI) / 8) * 5)}px ${r3(Math.sin((k * Math.PI) / 8) * 5)}px 0 ${sombra}`);
  const estilos = `      .mini-img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: ${ax * 100}% ${ay * 100}%;
        filter: contrast(1.08) saturate(1.08);
      }
      .mini-fondo {
        position: absolute;
        left: -60px;
        top: -60px;
        width: 1400px;
        height: 840px;
        object-fit: cover;
        filter: blur(26px) brightness(0.5) saturate(0.8);
      }
      .mini-lado {
        position: absolute;
        top: 0;
        ${izq ? "right" : "left"}: 40px;
        height: 720px;
        max-width: 620px;
        object-fit: cover;
        object-position: ${ax * 100}% ${ay * 100}%;
        box-shadow: 0 0 60px rgba(0, 0, 0, 0.6);
        filter: contrast(1.08) saturate(1.08);
      }
      .mini-velo {
        position: absolute;
        inset: 0;
        background: linear-gradient(${izq ? "90deg" : "270deg"}, rgba(12, 7, 3, 0.9) 0%, rgba(12, 7, 3, 0.72) 40%, rgba(12, 7, 3, 0) 70%),
          radial-gradient(ellipse 120% 100% at 50% 50%, rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0.45) 100%);
      }
      .mini-caja {
        position: absolute;
        top: 0;
        bottom: 0;
        ${izq ? "left" : "right"}: 56px;
        width: ${vertical ? 600 : 640}px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: ${izq ? "flex-start" : "flex-end"};
        gap: 22px;
      }
      .mini-barra {
        width: 130px;
        height: 12px;
        background: ${colResalta};
        box-shadow: 0 3px 0 ${sombra};
      }
      .mini-texto {
        font-family: ${t.vars["--fuente-titulo"]};
        font-weight: 900;
        line-height: 1;
        letter-spacing: -0.005em;
        text-transform: uppercase;
        text-align: ${izq ? "left" : "right"};
        color: ${colTexto};
        white-space: nowrap;
        text-shadow: ${contorno.join(", ")}, 0 10px 26px rgba(0, 0, 0, 0.7);
      }
      .mini-texto .resalta {
        color: ${colResalta};
      }`;
  const cuerpo = {
    html: `${imagenHtml}\n      <div class="mini-velo"></div>\n      <div class="mini-caja"><div class="mini-barra"></div><div class="mini-texto" style="font-size: ${texto.tam}px">${lineas}</div></div>`,
    js: "",
  };
  fs.writeFileSync(path.join(dir, "index.html"), paginaHF({ ancho: 1280, alto: 720, duracion: 1, t, estilos, cuerpo, guion }), "utf8");
  fs.rmSync(path.join(dir, "snapshots"), { recursive: true, force: true });
  hiperframes(`snapshot --at 0.5 --no-end --keep -o snapshots`, dir);
  const capturas = path.join(dir, "snapshots");
  const hallada = fs.existsSync(capturas) ? fs.readdirSync(capturas).find((n) => n.endsWith(".png")) : null;
  if (!hallada) throw new Error("HyperFrames no dejo la captura de la miniatura.");
  const png = path.join(capturas, hallada);
  ff(["-i", png, "-vf", "scale=1280:720:flags=lanczos", "-frames:v", "1", "-q:v", "2", "-update", "1", destino]);
  if (fs.statSync(destino).size > 2 * 1024 * 1024) ff(["-i", png, "-vf", "scale=1280:720:flags=lanczos", "-frames:v", "1", "-q:v", "5", "-update", "1", destino]);
  fs.writeFileSync(sello, firma, "utf8");
  return destino;
}

// ---------- Tramos (ffmpeg) ----------
function firmaElemento(el) {
  if (!el) return null;
  if (el.tipo === "imagen") return { t: "i", lienzo: path.basename(el.lienzo), mov: el.mov, V: el.V };
  return { t: "c", video: path.basename(el.video), K0: el.K0, V: el.V };
}

function argsClip(clip, salida) {
  const entradas = [];
  const filtros = [];
  const rama = (el, F0, K, etiqueta, idx) => {
    if (el.tipo === "imagen") {
      entradas.push("-framerate", String(FPS), "-i", el.lienzo);
      filtros.push(`[${idx}:v]loop=loop=${K - 1}:size=1:start=0,settb=1/${FPS},setpts=N,${perspectiva(el.mov, F0, el.V)},scale=${ANCHO}:${ALTO}:flags=bicubic,setsar=1,format=yuv420p,fps=${FPS}[${etiqueta}]`);
    } else {
      entradas.push("-i", el.video);
      filtros.push(`[${idx}:v]trim=start_frame=${el.K0 + F0}:end_frame=${el.K0 + F0 + K},settb=1/${FPS},setpts=N,scale=${ANCHO}:${ALTO}:flags=bicubic,setsar=1,format=yuv420p,fps=${FPS}[${etiqueta}]`);
    }
  };
  rama(clip.a, clip.F0, clip.N, "a", 0);
  let ultima = "a";
  if (clip.b) {
    rama(clip.b, 0, clip.T, "b", 1);
    filtros.push(`[a][b]xfade=transition=fade:duration=${(clip.T / FPS).toFixed(5)}:offset=${((clip.N - clip.T) / FPS).toFixed(5)}[x]`);
    ultima = "x";
  }
  if (clip.salida) {
    filtros.push(`[${ultima}]fade=t=out:start_frame=${clip.N - clip.salida}:nb_frames=${clip.salida}[y]`);
    ultima = "y";
  }
  return [...entradas, "-filter_complex", filtros.join(";"), "-map", `[${ultima}]`, "-frames:v", String(clip.N), "-r", String(FPS), ...X264, "-an", salida];
}

async function renderTramos(trabajo, plan) {
  const dir = path.join(trabajo, "tramos");
  fs.mkdirSync(dir, { recursive: true });
  for (const clip of plan.clips) {
    const firma = hash({ v: VERSION.tramo, x264: X264, N: clip.N, F0: clip.F0, T: clip.T, salida: clip.salida, a: firmaElemento(clip.a), b: firmaElemento(clip.b) });
    clip.archivo = path.join(dir, firma.slice(0, 16) + ".mp4");
  }
  const usados = new Set(plan.clips.map((c) => path.basename(c.archivo)));
  for (const n of fs.readdirSync(dir)) if (!usados.has(n)) fs.rmSync(path.join(dir, n), { force: true });
  const nuevos = plan.clips.filter((c) => !fs.existsSync(c.archivo));
  // Cuantos tramos a la vez: segun los nucleos de la PC, o lo que diga LEGION_TRAMOS_A_LA_VEZ.
  const cuantos = limita(Math.floor(numero(process.env.LEGION_TRAMOS_A_LA_VEZ, os.cpus().length / 3)), 1, 12);
  let ultimo = 0;
  await enParalelo(
    nuevos.map((clip) => async () => {
      await ffAsync(argsClip(clip, clip.archivo + ".tmp.mp4"));
      fs.renameSync(clip.archivo + ".tmp.mp4", clip.archivo);
    }),
    cuantos,
    (hechas, total) => {
      const pct = Math.floor((hechas / total) * 10);
      if (pct > ultimo || hechas === total) {
        ultimo = pct;
        console.log(`   tramos: ${hechas}/${total}`);
      }
    },
  );
  return { nuevos: nuevos.length, total: plan.clips.length, cuantos };
}

// Dos pasadas de loudnorm: la voz queda en -14 LUFS (lo que usa YouTube), sin pasar de -1,5 dBTP.
function filtroVolumen(narracion) {
  const r = spawnSync(FFMPEG, ["-hide_banner", "-nostats", "-i", narracion, "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"], { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 });
  const texto = r.stderr || "";
  const json = texto.slice(texto.lastIndexOf("{"), texto.lastIndexOf("}") + 1);
  try {
    const m = JSON.parse(json);
    return `loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true,aresample=48000`;
  } catch {
    return "loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000";
  }
}

// .gitignore de la carpeta del video: se versionan el guion y las imagenes propias.
function escribeIgnorar(carpeta, guion) {
  const ruta = path.join(carpeta, ".gitignore");
  const cabecera = "# Video largo: se versionan el guion y las imagenes propias; lo demas lo regenera producir.mjs";
  if (fs.existsSync(ruta) && !fs.readFileSync(ruta, "utf8").startsWith(cabecera)) return;
  // escenas/*.json: escenas de capitulos escritas aparte (une-escenas.mjs las une al guion).
  const lineas = [cabecera, "*", "!.gitignore", "!guion.json", "!escenas/", "!escenas/*.json"];
  for (const img of Object.values(guion.imagenes || {})) {
    if (!img || !img.archivo) continue;
    const partes = String(img.archivo).replace(/\\/g, "/").split("/").filter(Boolean);
    for (let i = 1; i < partes.length; i++) lineas.push("!" + partes.slice(0, i).join("/") + "/");
    lineas.push("!" + partes.join("/"));
  }
  fs.writeFileSync(ruta, [...new Set(lineas)].join("\n") + "\n", "utf8");
}

// ---------- Todo junto ----------
export async function produceLargo(carpeta, opciones = {}) {
  const inicioTotal = Date.now();
  const tiempos = {};
  const mide = async (nombre, fn) => {
    const t0 = Date.now();
    const r = await fn();
    tiempos[nombre] = (Date.now() - t0) / 1000;
    return r;
  };
  const guion = JSON.parse(fs.readFileSync(path.join(carpeta, "guion.json"), "utf8"));
  const nombre = path.basename(carpeta);
  const entrega = typeof guion.entrega === "string" && /^[a-z0-9-]+$/.test(guion.entrega) ? guion.entrega : "narrador";
  const dir = path.join(RAIZ, "salidas", entrega, nombre);
  const trabajo = path.join(carpeta, "largo");
  const avisos = [];
  console.log(`\n=== ${nombre}: ${guion.titulo || ""} (video largo) ===`);
  const plano = planLargo(guion);
  if (plano.errores.length) throw new Error("El guion largo tiene problemas:\n  - " + plano.errores.join("\n  - "));
  fs.mkdirSync(trabajo, { recursive: true });
  escribeIgnorar(carpeta, guion);

  console.log("1/8 voz");
  const voz = await mide("voz", () => spawnSync(process.execPath, [path.join(AQUI, "voz.mjs"), carpeta], { cwd: RAIZ, env: ENTORNO, stdio: ["ignore", "inherit", "inherit"] }));
  if (voz.status === 3) return { nombre, esperando: true };
  if (voz.status !== 0) throw new Error(`Fallo "voz" en ${nombre} (mira el mensaje de arriba).`);
  const tv = JSON.parse(fs.readFileSync(path.join(carpeta, "tiempos.json"), "utf8"));

  console.log("2/8 imagenes");
  const usadas = [...new Set([...plano.tramos.map((t) => t.imagen), ...(guion.miniatura && guion.miniatura.imagen ? [guion.miniatura.imagen] : [])])];
  for (const clave of Object.keys(guion.imagenes || {})) if (!usadas.includes(clave)) avisos.push(`la imagen ${clave} esta en "imagenes" pero ninguna frase la usa`);
  const imagenes = await mide("imagenes", () => preparaImagenes(carpeta, guion, usadas, avisos));
  console.log(`   ${Object.keys(imagenes).length} imagen(es) listas, con licencia comprobada`);

  console.log("3/8 plan");
  const plan = planVisual(guion, plano, tv, imagenes, avisos);
  const capitulos = capitulosYoutube(plan, plano, tv.duracion, avisos);
  console.log(`   ${minutos(tv.duracion)} (${tv.duracion} s), ${plan.els.filter((e) => e.tipo === "imagen").length} tramos de imagen, ${plan.els.filter((e) => e.tipo === "tarjeta").length} tarjeta(s)`);

  console.log("4/8 textos");
  fs.mkdirSync(dir, { recursive: true });
  const plana = aplanarLargo(guion);
  fs.writeFileSync(path.join(dir, `${nombre}.srt`), hazSrt(tv, plana.frases), "utf8");
  const creditos = creditosDe(imagenes, plan);
  escribeCreditos(dir, guion, creditos);
  escribeFuentes(dir, guion);
  escribeDescripcion(dir, guion, capitulos, creditos, avisos);
  capitulos.forEach((c) => console.log(`   ${minutos(c.inicio)} ${c.etiqueta}`));

  console.log("5/8 miniatura");
  const mini = await mide("miniatura", () => miniatura(trabajo, dir, guion, imagenes, avisos));

  const resumenPlan = {
    generado: new Date().toISOString(),
    duracion: tv.duracion,
    cuadros: plan.TF,
    elementos: plan.els.map((el) => ({
      tipo: el.tipo,
      ...(el.tipo === "imagen" ? { tramo: el.tramo, imagen: el.clave, movimiento: el.mov && el.mov.tipo } : { capitulo: el.capitulo.id, tarjeta: el.capitulo.tarjeta }),
      inicio: r3(el.B / FPS),
      visible: [r3(el.visIni / FPS), r3(el.visFin / FPS)],
    })),
  };

  if (opciones.sinRender) {
    escribeJson(path.join(trabajo, "plan.json"), resumenPlan);
    mostrarAvisos(avisos);
    console.log(`Sin render: textos${mini ? " y miniatura" : ""} en ${rel(dir)}/`);
    return { nombre, avisos: avisos.length, mp4: null };
  }

  console.log("6/8 tarjetas");
  const tj = await mide("tarjetas", () => tarjetas(trabajo, guion, plan));
  if (tj) console.log(`   ${tj.nuevo ? "renderizadas" : "sin cambios (se reusan)"}`);

  console.log("7/8 tramos");
  const dirLienzos = path.join(trabajo, "lienzos");
  fs.mkdirSync(dirLienzos, { recursive: true });
  const r = await mide("tramos", async () => {
    const lienzos = new Map();
    for (const el of plan.els) {
      if (el.tipo !== "imagen") continue;
      if (!lienzos.has(el.clave)) lienzos.set(el.clave, lienzo(el.img, dirLienzos, avisos));
      el.lienzo = lienzos.get(el.clave).ruta;
    }
    const enUso = new Set([...lienzos.values()].map((l) => path.basename(l.ruta)));
    for (const n of fs.readdirSync(dirLienzos)) if (!enUso.has(n)) fs.rmSync(path.join(dirLienzos, n), { force: true });
    return renderTramos(trabajo, plan);
  });
  console.log(`   ${r.nuevos} nuevo(s) de ${r.total} (${r.cuantos} a la vez); los demas se reusan`);
  escribeJson(path.join(trabajo, "plan.json"), resumenPlan);

  console.log("8/8 union");
  const mp4 = path.join(dir, `${nombre}.mp4`);
  await mide("union", () => {
    const lista = plan.clips.map((c) => `file '${path.relative(trabajo, c.archivo).replace(/\\/g, "/")}'`).join("\n") + "\n";
    fs.writeFileSync(path.join(trabajo, "lista.txt"), lista, "utf8");
    const af = filtroVolumen(path.join(carpeta, "assets", "narracion.wav"));
    const quemar = guion.subtitulos_quemados === true;
    if (quemar) fs.copyFileSync(path.join(dir, `${nombre}.srt`), path.join(trabajo, "subtitulos.srt"));
    const estiloSub = "FontName=Georgia,FontSize=17,Bold=1,PrimaryColour=&H00FFFFFF,OutlineColour=&H00101010,BackColour=&H80000000,BorderStyle=1,Outline=1.6,Shadow=0.8,MarginV=26";
    const video = quemar ? ["-vf", `subtitles=subtitulos.srt:force_style='${estiloSub}'`, ...X264] : ["-c:v", "copy"];
    ff(["-f", "concat", "-safe", "0", "-i", "lista.txt", "-i", path.join(carpeta, "assets", "narracion.wav"), "-map", "0:v:0", "-map", "1:a:0", ...video, "-af", af, "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2", "-movflags", "+faststart", mp4 + ".tmp.mp4"], { cwd: trabajo });
    fs.renameSync(mp4 + ".tmp.mp4", mp4);
  });

  // Entrega: duracion y volumen medidos en el MP4, publicacion.txt y meta.json.
  const s = sonda(mp4);
  const vol = spawnSync(FFMPEG, ["-hide_banner", "-nostats", "-i", mp4, "-vn", "-af", "ebur128", "-f", "null", "-"], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  const lufs = ((vol.stderr || "").match(/I:\s+(-?[\d.]+) LUFS/g) || []).pop() || "";
  const pub = guion.publicacion || {};
  fs.writeFileSync(path.join(dir, "publicacion.txt"), [pub.titulo_youtube || guion.titulo || "", "", etiquetas(pub.hashtags)].join("\n").trim() + "\n", "utf8");
  const renderS = Math.round((Date.now() - inicioTotal) / 100) / 10;
  const meta = {
    id: nombre,
    tipo: "largo",
    titulo: pub.titulo_youtube || guion.titulo || nombre,
    duracion_s: Math.round((s ? s.duracion : tv.duracion) * 10) / 10,
    volumen: lufs.replace(/\s+/g, " ").trim(),
    voz: `${guion.motor || "kokoro"}${guion.voz ? " / " + guion.voz : ""}`,
    capitulos: capitulos.map((c) => ({ inicio: minutos(c.inicio), titulo: c.etiqueta })),
    imagenes: Object.keys(imagenes).length,
    subtitulos_quemados: guion.subtitulos_quemados === true,
    avisos: avisos.length,
    tiempo_produccion_s: renderS,
    producido: new Date().toISOString(),
    video: `${nombre}.mp4`,
    portada: mini ? "miniatura.jpg" : null,
    subtitulos: `${nombre}.srt`,
    descripcion: "descripcion.txt",
    guion: rel(path.join(carpeta, "guion.json")),
  };
  escribeJson(path.join(dir, "meta.json"), meta);
  mostrarAvisos(avisos);
  const partes = Object.entries(tiempos).map(([k, v]) => `${k} ${v.toFixed(1)} s`);
  console.log(`Tiempos: ${partes.join(", ")}; total ${renderS} s`);
  console.log(`Listo: ${mp4}  (${minutos(meta.duracion_s)}, ${meta.volumen})`);
  return { nombre, avisos: avisos.length, mp4 };
}

function mostrarAvisos(avisos) {
  if (!avisos.length) return;
  console.log("Avisos:");
  for (const a of [...new Set(avisos)]) console.log("  - " + a);
}

// Piezas que reusa largo-escenas.mjs (el video largo hecho con escenas).
export {
  capitulosYoutube,
  escribeCreditos,
  escribeDescripcion,
  escribeFuentes,
  escribeIgnorar,
  escribeJson,
  escribeProyectoHF,
  ff,
  filtroVolumen,
  hash,
  hazSrt,
  hiperframes,
  miniatura,
  minutos,
  mostrarAvisos,
  preparaImagenes,
  romano,
  sonda,
  tituloCommons,
  FFMPEG,
  FPS,
};
