// largo-escenas.mjs - Videos largos de YouTube hechos con escenas disenadas (horizontal 1920x1080).
//
// Es el estilo aprobado por los socios (la muestra animados/propios/hi-panama-muestra): mapas,
// personajes, documentos y cifras animados con las plantillas horizontales, como los Shorts, pero
// armado por capitulos. No se corre solo: lo llama producir.mjs cuando el guion trae "tipo": "largo"
// y "orientacion": "horizontal".
//   node animados/herramientas/producir.mjs animados/propios/<id>                     (todo)
//   node animados/herramientas/producir.mjs animados/propios/<id> --capitulos c0,c1   (solo esos)
//   node animados/herramientas/producir.mjs animados/propios/<id> --sin-render        (sin MP4)
//   ... --capturas  ademas deja hojas de capturas de cada capitulo montado (para mirarlas)
//   ... --con-pendientes  deja renderizar el video completo aunque haya frases sin escena (borrador)
//
// Pasos:
//   1. voz        voz.mjs para todo el video (misma cache y mismo tope de caracteres de siempre)
//   2. fotos      las fotos de Commons que piden las escenas ("foto"), con su licencia revisada
//   3. plan       donde empieza cada capitulo (siempre en un cuadro exacto) y sus tiempos propios
//   4. textos     <id>.srt, descripcion.txt (con capitulos), creditos-imagenes.md, fuentes.md
//   5. miniatura  la de largo.mjs (una imagen de "imagenes" y el texto grande)
//   6. capitulos  cada capitulo es un proyecto de HyperFrames en <video>/largo/capitulos/<cap>/:
//                 montaje (mudo), revision y render; si no cambio nada, se reusa su MP4
//   7. union      los capitulos se pegan sin recodificar y se les pone la voz a -14 LUFS
// Con --capitulos solo se arman, revisan y renderizan esos (los textos salen igual, completos) y el
// MP4 que se entrega es <id>-<c0-c1>.mp4, sin meta.json: es para probar.

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { aplicaCortes, fotosDe } from "./escenas.mjs";
import {
  aplanarLargo,
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
  miniatura,
  minutos,
  mostrarAvisos,
  planEscenas,
  preparaImagenes,
  tituloCommons,
  FFMPEG,
  FPS,
} from "./largo.mjs";

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const ANIMADOS = path.resolve(AQUI, "..");
const RAIZ = path.resolve(ANIMADOS, "..");
const PLANTILLAS = path.join(ANIMADOS, "plantillas");
const CACHE_IMAGENES = path.join(ANIMADOS, ".imagenes-cache");
const HF = "hyperframes@0.9.20";
const ENTORNO = { ...process.env, DO_NOT_TRACK: "1", HYPERFRAMES_NO_TELEMETRY: "1" };
// Si cambia como se arma un capitulo, sube este numero y se vuelven a renderizar todos.
const VERSION_CAPITULO = 1;
// Las herramientas que deciden como se ve un capitulo: si cambian, el capitulo se vuelve a hacer.
const HERRAMIENTAS = ["montaje.mjs", "subtitulos.mjs", "temas.mjs", "escenas.mjs"];

const r3 = (n) => Math.round(n * 1000) / 1000;
const cuadro = (s) => Math.round(s * FPS) / FPS;
const rel = (p) => path.relative(RAIZ, p).replace(/\\/g, "/");
const numeroDe = (v, porDefecto) => (v !== null && v !== undefined && v !== "" && Number.isFinite(Number(v)) ? Number(v) : porDefecto);
const leeTexto = (ruta) => (fs.existsSync(ruta) ? fs.readFileSync(ruta, "utf8") : "");

function npx(orden, cwd) {
  // npx es un .cmd en Windows: hay que pasar por el shell.
  return spawnSync(`npx --yes ${HF} ${orden}`, { shell: true, cwd, env: ENTORNO, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], maxBuffer: 64 * 1024 * 1024 });
}

// Cuadros y duracion del video de un MP4 (solo la pista de video).
function cuadrosDe(archivo) {
  const ffprobe = FFMPEG.replace(/ffmpeg(\.exe)?$/i, (m, ext) => "ffprobe" + (ext || ""));
  const r = spawnSync(ffprobe, ["-v", "error", "-select_streams", "v:0", "-count_packets", "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", archivo], { encoding: "utf8" });
  const n = parseInt(String(r.stdout).trim(), 10);
  if (!Number.isFinite(n) || n <= 0) throw new Error(`No pude leer los cuadros de ${rel(archivo)}`);
  return n;
}

// ---------- Plan: donde empieza cada capitulo y sus tiempos propios ----------
// El capitulo k empieza donde empieza su tarjeta (un instante despues de la ultima frase del
// anterior) o, sin tarjeta, justo antes de su primera frase; siempre en un cuadro exacto. Sus
// tiempos (tiempos.json del proyecto del capitulo) cuentan desde 0.
function planCapitulos(plano, tv, guion) {
  // La ultima escena de un capitulo se queda un respiro despues de su ultima palabra (si no, la tarjeta
  // del capitulo siguiente entraria enseguida); el resto de la pausa es para la tarjeta.
  const respiro = Math.max(0.12, Math.min(numeroDe(guion.respiro_capitulo, 0.5), numeroDe(guion.pausa_capitulo, 3) - 1.6));
  const frasesTv = new Map(tv.frases.map((f) => [f.id, f]));
  const caps = plano.capitulos.map((c) => ({ ...c }));
  caps.forEach((c, k) => {
    for (const f of c.frases) if (!frasesTv.has(f.id)) throw new Error(`tiempos.json no trae la frase ${f.id}: vuelve a correr la voz.`);
    const primera = frasesTv.get(c.frases[0].id);
    if (k === 0) c.B = 0;
    else {
      const previa = frasesTv.get(caps[k - 1].frases.at(-1).id);
      c.B = cuadro(c.tarjeta ? previa.fin + respiro : primera.inicio - 0.07);
    }
  });
  const final = cuadro(tv.duracion);
  caps.forEach((c, k) => {
    c.fin = k + 1 < caps.length ? caps[k + 1].B : final;
    c.D = r3(c.fin - c.B);
    const mueve = (t) => r3(t - c.B);
    const frases = c.frases.map((f) => {
      const t = frasesTv.get(f.id);
      return { id: t.id, escena: f.escena, texto: t.texto, inicio: mueve(t.inicio), fin: mueve(t.fin), palabras: t.palabras.map((p) => ({ ...p, inicio: mueve(p.inicio), fin: mueve(p.fin) })) };
    });
    // Ventanas de escena, como las arma voz.mjs: la tarjeta va sola antes de la primera frase.
    const escenas = [];
    if (c.tarjeta) escenas.push({ id: c.tarjeta, inicio: 0 });
    for (const f of frases) {
      const ultima = escenas.at(-1);
      if (ultima && ultima.id === f.escena) continue;
      if (escenas.some((e) => e.id === f.escena)) throw new Error(`La escena "${f.escena}" aparece dos veces separadas en ${c.id}; junta sus frases o usa otra escena.`);
      escenas.push({ id: f.escena, inicio: escenas.length ? r3(f.inicio - 0.07) : 0 });
    }
    escenas.forEach((e, i) => (e.fin = i + 1 < escenas.length ? escenas[i + 1].inicio : c.D));
    c.tiempos = { duracion: c.D, audio: "assets/narracion.wav", escenas, frases };
    try {
      c.ventanas = c.frases.some((f) => Array.isArray(f.cortes) && f.cortes.length) ? aplicaCortes(escenas, c.frases, frases) : escenas;
    } catch (e) {
      throw new Error(`${c.id}: ${e.message}`);
    }
  });
  return caps;
}

// ---------- Proyecto de HyperFrames de un capitulo ----------
function guionDelCapitulo(guion, c, nombre) {
  const quita = (f) => Object.fromEntries(Object.entries(f).filter(([k]) => ["id", "escena", "texto", "cortes", "subtitulos", "clave"].includes(k)));
  return {
    titulo: `${guion.titulo || nombre} (${c.id}${c.titulo ? ": " + c.titulo : ""})`,
    nota: "Generado por largo-escenas.mjs a partir del guion del video largo. No editar a mano.",
    orientacion: "horizontal",
    estilo: guion.estilo,
    ...(guion.subtitulos === false ? { subtitulos: false } : {}),
    ...(guion.datos ? { datos: guion.datos } : {}),
    ...(guion.personajes ? { personajes: guion.personajes } : {}),
    escenas: c.escenas,
    frases: c.frases.map(quita),
  };
}

// Miniatura con un cuadro disenado: "miniatura": { "texto": "...", "escena": "<id>", "en": 4.5 } toma
// el cuadro de esa escena (a "en" segundos de su comienzo; sin "en", casi al final), sin subtitulos, y le
// pone encima el texto grande, como la miniatura de siempre.
async function miniaturaDeEscena(trabajo, dir, guion, caps, nombre, avisos) {
  const pedida = guion.miniatura;
  const c = caps.find((x) => x.escenas[pedida.escena]);
  const v = c && c.ventanas.find((x) => x.id === pedida.escena);
  if (!v) throw new Error(`miniatura.escena "${pedida.escena}" no es una escena del guion.`);
  const t = r3(Math.min(v.fin - 0.05, v.inicio + (Number.isFinite(Number(pedida.en)) ? Number(pedida.en) : (v.fin - v.inicio) * 0.85)));
  const dirCuadro = path.join(trabajo, "cuadro-miniatura");
  fs.mkdirSync(dirCuadro, { recursive: true });
  escribeProyectoHF(dirCuadro, `${nombre}-miniatura`);
  escribeJson(path.join(dirCuadro, "guion.json"), { ...guionDelCapitulo(guion, c, nombre), subtitulos: false });
  escribeJson(path.join(dirCuadro, "tiempos.json"), c.tiempos);
  const dirComp = path.join(dirCuadro, "compositions");
  if (fs.existsSync(dirComp)) for (const n of fs.readdirSync(dirComp)) fs.rmSync(path.join(dirComp, n), { force: true, recursive: true });
  const m = spawnSync(process.execPath, [path.join(AQUI, "montaje.mjs"), dirCuadro, "--sin-voz"], { cwd: RAIZ, env: ENTORNO, encoding: "utf8" });
  if (m.status !== 0) throw new Error(`Fallo el montaje del cuadro de la miniatura:\n${(m.stderr || m.stdout || "").slice(0, 1500)}`);
  fs.rmSync(path.join(dirCuadro, "snapshots"), { recursive: true, force: true });
  const r = npx(`snapshot --at ${t} --no-end --keep -o snapshots`, dirCuadro);
  const capturas = path.join(dirCuadro, "snapshots");
  const hallada = fs.existsSync(capturas) ? fs.readdirSync(capturas).find((n) => n.endsWith(".png")) : null;
  if (r.status !== 0 || !hallada) throw new Error("HyperFrames no dejo el cuadro de la miniatura:\n" + ((r.stderr || "") + (r.stdout || "")).slice(0, 1500));
  // El nombre lleva el contenido: si el cuadro cambia, la miniatura se rehace.
  const png = path.join(dirCuadro, `cuadro-${hash(fs.readFileSync(path.join(capturas, hallada)).toString("base64")).slice(0, 12)}.png`);
  fs.copyFileSync(path.join(capturas, hallada), png);
  const imagenes = { cuadro: { clave: "cuadro", archivo: png, ancho: 1920, alto: 1080, encuadre: pedida.encuadre || "centro" } };
  return miniatura(trabajo, dir, { ...guion, miniatura: { ...pedida, imagen: "cuadro" } }, imagenes, avisos);
}

// Lo que decide como se ve un capitulo: si nada cambio, su MP4 se reusa.
function firmaCapitulo(guionCap, tiemposCap) {
  const usadas = new Set(Object.values(guionCap.escenas).map((e) => e.plantilla + ".html"));
  const comunes = fs.readdirSync(PLANTILLAS).filter((n) => n.startsWith("_") || n.endsWith(".json"));
  const plantillas = [...new Set([...usadas, ...comunes])].sort().map((n) => [n, hash(leeTexto(path.join(PLANTILLAS, n)))]);
  const herramientas = HERRAMIENTAS.map((n) => [n, hash(leeTexto(path.join(AQUI, n)))]);
  const fotos = fotosDe(guionCap.escenas).map((f) => f.titulo);
  return hash({ v: VERSION_CAPITULO, guion: guionCap, tiempos: tiemposCap, plantillas, herramientas, fotos }).slice(0, 16);
}

// Revision de HyperFrames: muestra los hallazgos y se detiene si hay errores.
function revisa(dir, id) {
  const r = npx("check --json", dir);
  const crudo = r.stdout || "";
  let informe;
  try {
    informe = JSON.parse(crudo.slice(crudo.indexOf("{")));
  } catch {
    throw new Error(`La revision de ${id} no devolvio un informe legible:\n` + (r.stderr || crudo).slice(0, 1500));
  }
  const hallazgos = [];
  for (const parte of ["lint", "runtime", "layout", "motion", "contrast", "craft", "audio"]) {
    for (const h of (informe[parte] && informe[parte].findings) || []) {
      if (h.severity === "info" || h.code === "timeline_track_too_dense") continue;
      // El capitulo se renderiza mudo (la voz se pone al unir) y no es el final del video: estos dos
      // avisos no aplican.
      if (h.code === "film_silent" || /film's last line/.test(String(h.message))) continue;
      hallazgos.push(`     [${h.severity}] ${parte}/${h.code} ${h.selector || ""} t=${h.time ?? ""} :: ${String(h.message).slice(0, 160)}`);
    }
  }
  hallazgos.forEach((h) => console.log(h));
  if (!informe.ok) throw new Error(`La revision del capitulo ${id} tiene errores: no se renderiza hasta corregirlos.`);
  return hallazgos.length;
}

// ---------- Todo junto ----------
export async function produceLargoEscenas(carpeta, opciones = {}) {
  const inicioTotal = Date.now();
  const tiempos = {};
  const mide = async (nombre, fn) => {
    const t0 = Date.now();
    const r = await fn();
    tiempos[nombre] = Math.round((Date.now() - t0) / 100) / 10;
    return r;
  };
  const guion = JSON.parse(fs.readFileSync(path.join(carpeta, "guion.json"), "utf8"));
  const nombre = path.basename(carpeta);
  const entrega = typeof guion.entrega === "string" && /^[a-z0-9-]+$/.test(guion.entrega) ? guion.entrega : "narrador";
  const dir = path.join(RAIZ, "salidas", entrega, nombre);
  const trabajo = path.join(carpeta, "largo");
  const avisos = [];
  console.log(`\n=== ${nombre}: ${guion.titulo || ""} (video largo por escenas) ===`);
  const plano = planEscenas(guion);
  if (plano.errores.length) throw new Error("El guion largo tiene problemas:\n  - " + plano.errores.join("\n  - "));
  avisos.push(...plano.avisos);
  const todos = plano.capitulos.map((c) => c.id);
  const pedidos = opciones.capitulos && opciones.capitulos.length ? opciones.capitulos : todos;
  const raros = pedidos.filter((id) => !todos.includes(id));
  if (raros.length) throw new Error(`--capitulos pide ${raros.join(", ")}, que no estan en el guion (los que hay: ${todos.join(", ")}).`);
  const completo = todos.every((id) => pedidos.includes(id));
  for (const c of plano.capitulos) if (c.respaldos.length) avisos.push(`${c.id}: ${c.respaldos.length} frase(s) sin escena; salen con un titular "Escena pendiente" (${c.respaldos[0]}...)`);
  // Un video completo con escenas pendientes no se entrega como si estuviera terminado.
  const pendientes = plano.capitulos.filter((c) => c.respaldos.length && pedidos.includes(c.id)).map((c) => c.id);
  if (completo && !opciones.sinRender && pendientes.length && !opciones.conPendientes) {
    throw new Error(`${pendientes.join(", ")} todavia tienen frases sin escena. Termina sus escenas, produce solo los capitulos listos (--capitulos c0,c1) o, para un borrador completo, agrega --con-pendientes.`);
  }
  fs.mkdirSync(trabajo, { recursive: true });
  escribeIgnorar(carpeta, guion);

  console.log("1/7 voz");
  const voz = await mide("voz", () => spawnSync(process.execPath, [path.join(AQUI, "voz.mjs"), carpeta], { cwd: RAIZ, env: ENTORNO, stdio: ["ignore", "inherit", "inherit"] }));
  if (voz.status === 3) return { nombre, esperando: true };
  if (voz.status !== 0) throw new Error(`Fallo "voz" en ${nombre} (mira el mensaje de arriba).`);
  const tv = JSON.parse(fs.readFileSync(path.join(carpeta, "tiempos.json"), "utf8"));

  console.log("2/7 fotos");
  // Las fotos de las escenas se piden por su nombre en Commons; si el guion tiene esa misma foto en
  // "imagenes", se usa su clave y su "que_muestra" (para los creditos).
  const limpio = (t) => tituloCommons(t).toLowerCase();
  const claveDe = new Map(Object.entries(guion.imagenes || {}).filter(([, img]) => img && img.commons).map(([k, img]) => [limpio(img.commons), k]));
  const pedidas = {};
  const fotoClave = new Map();
  for (const c of plano.capitulos) {
    for (const f of fotosDe(c.escenas)) {
      const clave = claveDe.get(limpio(f.titulo)) || `foto-${hash(limpio(f.titulo)).slice(0, 8)}`;
      fotoClave.set(limpio(f.titulo), clave);
      pedidas[clave] = (guion.imagenes || {})[clave] || { commons: f.titulo, que_muestra: f.pie || f.titulo.replace(/^File:/, "") };
    }
  }
  const mini = guion.miniatura || {};
  if (mini.imagen && !mini.escena) {
    if (!(guion.imagenes || {})[mini.imagen]) throw new Error(`miniatura.imagen "${mini.imagen}" no esta en "imagenes".`);
    pedidas[mini.imagen] = guion.imagenes[mini.imagen];
  }
  const imagenes = await mide("fotos", () => preparaImagenes(carpeta, { imagenes: pedidas }, Object.keys(pedidas), avisos));
  console.log(`   ${Object.keys(imagenes).length} imagen(es) de Commons, con licencia comprobada`);

  console.log("3/7 plan");
  const caps = planCapitulos(plano, tv, guion);
  for (const c of caps) {
    const propias = c.ventanas.filter((v) => v.id !== c.tarjeta);
    const durs = propias.map((v) => v.fin - v.inicio);
    console.log(`   ${c.id}  ${minutos(c.B)}  ${c.D.toFixed(1).padStart(6)} s  ${c.ventanas.length} escenas${c.tarjeta ? " (con tarjeta)" : ""}${c.respaldos.length ? `, ${c.respaldos.length} pendiente(s)` : ""}`);
    propias.forEach((v, i) => {
      if (c.respaldos.length && v.id.startsWith("respaldo-")) return;
      const d = durs[i];
      const ultima = i === propias.length - 1;
      if (d < 2.5) avisos.push(`${c.id}: la escena "${v.id}" dura ${d.toFixed(1)} s (corta; mejor de 4 a 8 s)`);
      if (d > (ultima ? 11 : 10)) avisos.push(`${c.id}: la escena "${v.id}" dura ${d.toFixed(1)} s (larga; mejor partirla con un corte)`);
    });
  }

  console.log("4/7 textos");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${nombre}.srt`), hazSrt(tv, aplanarLargo(guion).frases), "utf8");
  // Capitulos de YouTube: el gancho (sin titulo) en 00:00 y cada capitulo con titulo donde empieza su tarjeta.
  const capsYt = capitulosYoutube(
    { els: caps.filter((c) => c.titulo).map((c) => ({ tipo: "tarjeta", capitulo: c, B: Math.round(c.B * FPS) })) },
    { capitulos: [{ tarjeta: caps[0].titulo ? "capitulo" : null, etiqueta: caps[0].etiqueta }] },
    tv.duracion,
    avisos,
  );
  // Creditos: cada foto con los minutos en que aparece su escena.
  const aparece = {};
  for (const c of caps) {
    for (const v of c.ventanas) {
      const escena = c.escenas[v.id];
      for (const f of fotosDe(escena && escena.datos)) (aparece[fotoClave.get(limpio(f.titulo))] ||= []).push(minutos(c.B + v.inicio));
    }
  }
  const creditos = Object.values(imagenes).map((img) => ({
    clave: img.clave,
    que_muestra: img.que_muestra,
    origen: img.origen,
    autor: img.origen === "commons" ? img.ficha.autor : img.credito,
    licencia: img.origen === "commons" ? img.licencia : "",
    licencia_url: img.origen === "commons" ? img.ficha.licencia_url : "",
    pagina: img.origen === "commons" ? img.ficha.pagina : "",
    titulo: img.origen === "commons" ? img.ficha.titulo : img.relativo,
    aparece: aparece[img.clave] ? [...new Set(aparece[img.clave])] : ["miniatura"],
  }));
  if (creditos.length) escribeCreditos(dir, guion, creditos);
  else fs.rmSync(path.join(dir, "creditos-imagenes.md"), { force: true });
  escribeFuentes(dir, guion);
  escribeDescripcion(dir, guion, capsYt, creditos, avisos);
  capsYt.forEach((c) => console.log(`   ${minutos(c.inicio)} ${c.etiqueta}`));

  console.log("5/7 miniatura");
  const hechaMini = await mide("miniatura", () => (mini.escena ? miniaturaDeEscena(trabajo, dir, guion, caps, nombre, avisos) : miniatura(trabajo, dir, guion, imagenes, avisos)));

  console.log(`6/7 capitulos (${pedidos.join(", ")})`);
  const dirCaps = path.join(trabajo, "capitulos");
  fs.mkdirSync(dirCaps, { recursive: true });
  const elegidos = caps.filter((c) => pedidos.includes(c.id));
  const renders = {};
  let avisosRevision = 0;
  const tCapitulos = Date.now();
  for (const c of elegidos) {
    const dirCap = path.join(dirCaps, c.id);
    const guionCap = guionDelCapitulo(guion, c, nombre);
    const firma = firmaCapitulo(guionCap, c.tiempos);
    c.video = path.join(dirCaps, `${c.id}.mp4`);
    const sello = path.join(dirCaps, `${c.id}.firma`);
    if (fs.existsSync(c.video) && leeTexto(sello) === firma) {
      console.log(`   ${c.id}: sin cambios (se reusa su MP4)`);
      continue;
    }
    const t0 = Date.now();
    fs.mkdirSync(dirCap, { recursive: true });
    escribeProyectoHF(dirCap, `${nombre}-${c.id}`);
    escribeJson(path.join(dirCap, "guion.json"), guionCap);
    escribeJson(path.join(dirCap, "tiempos.json"), c.tiempos);
    // Las escenas que ya no estan se borran (montaje solo escribe las que pide el guion).
    const dirComp = path.join(dirCap, "compositions");
    if (fs.existsSync(dirComp)) for (const n of fs.readdirSync(dirComp)) fs.rmSync(path.join(dirComp, n), { force: true, recursive: true });
    const m = spawnSync(process.execPath, [path.join(AQUI, "montaje.mjs"), dirCap, "--sin-voz"], { cwd: RAIZ, env: ENTORNO, encoding: "utf8" });
    if (m.status !== 0) throw new Error(`Fallo el montaje de ${c.id}:\n${(m.stderr || m.stdout || "").slice(0, 2000)}`);
    const tMontaje = (Date.now() - t0) / 1000;
    avisosRevision += revisa(dirCap, c.id);
    const tRevision = (Date.now() - t0) / 1000 - tMontaje;
    if (opciones.capturas) {
      const cap = spawnSync(process.execPath, [path.join(AQUI, "capturas.mjs"), dirCap], { cwd: RAIZ, env: ENTORNO, encoding: "utf8" });
      console.log(cap.status === 0 ? `   ${c.id}: capturas en ${rel(path.join(dirCap, "snapshots"))}/` : `   ${c.id}: no salieron las capturas`);
    }
    if (opciones.sinRender) {
      console.log(`   ${c.id}: montado y revisado (${tRevision.toFixed(0)} s), sin render`);
      continue;
    }
    const tmp = path.join(dirCap, "renders", `${c.id}.tmp.mp4`);
    fs.mkdirSync(path.dirname(tmp), { recursive: true });
    const r = npx(`render -q delivery --fps ${FPS} -o "${tmp}"`, dirCap);
    if (r.status !== 0 || !fs.existsSync(tmp)) throw new Error(`Fallo el render de ${c.id}:\n${((r.stderr || "") + (r.stdout || "")).slice(-2500)}`);
    fs.renameSync(tmp, c.video);
    fs.writeFileSync(sello, firma, "utf8");
    const tRender = (Date.now() - t0) / 1000 - tMontaje - tRevision;
    renders[c.id] = { duracion_s: c.D, render_s: Math.round(tRender), revision_s: Math.round(tRevision) };
    console.log(`   ${c.id}: ${c.D.toFixed(1)} s de video, render ${tRender.toFixed(0)} s (${(tRender / c.D).toFixed(2)} s por segundo), revision ${tRevision.toFixed(0)} s`);
  }
  tiempos.capitulos = Math.round((Date.now() - tCapitulos) / 100) / 10;

  if (opciones.sinRender) {
    mostrarAvisos(avisos);
    console.log(`Sin render: textos${hechaMini ? " y miniatura" : ""} en ${rel(dir)}/; capitulos montados en ${rel(dirCaps)}/`);
    return { nombre, avisos: avisos.length + avisosRevision, mp4: null };
  }

  console.log("7/7 union");
  const sufijo = completo ? "" : "-" + elegidos.map((c) => c.id).join("-");
  const mp4 = path.join(dir, `${nombre}${sufijo}.mp4`);
  await mide("union", () => {
    // La voz de cada capitulo se corta de la narracion completa con el largo real de su video (se
    // pegan sin recodificar, asi que la voz no se puede correr ni un cuadro).
    for (const c of elegidos) c.real = cuadrosDe(c.video) / FPS;
    const n = elegidos.length;
    const filtros = [`[0:a]asplit=${n}${elegidos.map((_, i) => `[s${i}]`).join("")}`];
    elegidos.forEach((c, i) => filtros.push(`[s${i}]atrim=start=${c.B.toFixed(5)}:duration=${c.real.toFixed(5)},asetpts=PTS-STARTPTS,apad=whole_dur=${c.real.toFixed(5)}[a${i}]`));
    filtros.push(`${elegidos.map((_, i) => `[a${i}]`).join("")}concat=n=${n}:v=0:a=1[voz]`);
    const vozUnion = path.join(trabajo, "voz-union.wav");
    ff(["-i", path.join(carpeta, "assets", "narracion.wav"), "-filter_complex", filtros.join(";"), "-map", "[voz]", "-ar", "48000", "-ac", "2", vozUnion]);
    const lista = elegidos.map((c) => `file '${path.relative(trabajo, c.video).replace(/\\/g, "/")}'`).join("\n") + "\n";
    fs.writeFileSync(path.join(trabajo, "lista-capitulos.txt"), lista, "utf8");
    const af = filtroVolumen(vozUnion);
    ff(["-f", "concat", "-safe", "0", "-i", "lista-capitulos.txt", "-i", vozUnion, "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy", "-af", af, "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2", "-movflags", "+faststart", mp4 + ".tmp.mp4"], { cwd: trabajo });
    fs.renameSync(mp4 + ".tmp.mp4", mp4);
  });

  // Entrega: duracion y volumen medidos en el MP4.
  const duracion = cuadrosDe(mp4) / FPS;
  const vol = spawnSync(FFMPEG, ["-hide_banner", "-nostats", "-i", mp4, "-vn", "-af", "ebur128", "-f", "null", "-"], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  const lufs = (((vol.stderr || "").match(/I:\s+(-?[\d.]+) LUFS/g) || []).pop() || "").replace(/\s+/g, " ").trim();
  const totalS = Math.round((Date.now() - inicioTotal) / 100) / 10;
  const resumen = Object.entries(tiempos).map(([k, v]) => `${k} ${Number(v).toFixed(1)} s`);
  if (completo) {
    const pub = guion.publicacion || {};
    fs.writeFileSync(path.join(dir, "publicacion.txt"), [pub.titulo_youtube || guion.titulo || "", "", (pub.hashtags || []).map((h) => (String(h).startsWith("#") ? h : "#" + h)).join(" ")].join("\n").trim() + "\n", "utf8");
    escribeJson(path.join(dir, "meta.json"), {
      id: nombre,
      tipo: "largo",
      modo: "escenas",
      titulo: pub.titulo_youtube || guion.titulo || nombre,
      duracion_s: Math.round(duracion * 10) / 10,
      volumen: lufs,
      voz: `${guion.motor || "kokoro"}${guion.voz ? " / " + guion.voz : ""}`,
      formato: "1920x1080",
      capitulos: capsYt.map((c) => ({ inicio: minutos(c.inicio), titulo: c.etiqueta })),
      escenas: caps.reduce((s, c) => s + c.ventanas.length, 0),
      imagenes: Object.keys(imagenes).length,
      avisos: avisos.length + avisosRevision,
      tiempo_produccion_s: totalS,
      tiempos_s: tiempos,
      render_capitulos: renders,
      producido: new Date().toISOString(),
      video: `${nombre}.mp4`,
      portada: hechaMini ? "miniatura.jpg" : null,
      subtitulos: `${nombre}.srt`,
      descripcion: "descripcion.txt",
      guion: rel(path.join(carpeta, "guion.json")),
    });
  }
  mostrarAvisos(avisos);
  console.log(`Tiempos: ${resumen.join(", ")}; total ${totalS} s`);
  for (const [id, r] of Object.entries(renders)) console.log(`   render ${id}: ${r.render_s} s para ${r.duracion_s.toFixed(1)} s de video`);
  console.log(`Listo: ${mp4}  (${minutos(duracion)}, ${lufs})${completo ? "" : "  [solo " + elegidos.map((c) => c.id).join(", ") + ": prueba, sin meta.json]"}`);
  return { nombre, avisos: avisos.length + avisosRevision, mp4 };
}
