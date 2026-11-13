// voz.mjs - Genera la narracion de un video animado y los tiempos de cada palabra.
//
// Uso (desde la raiz del proyecto):
//   node animados/herramientas/voz.mjs animados/videos/<video>
//
// Lee   <video>/guion.json
// Deja  <video>/assets/narracion.wav   (toda la voz, ya nivelada)
//       <video>/assets/voz/fN.wav      (una frase por archivo)
//       <video>/tiempos.json           (inicio y fin de cada frase y de cada palabra)
//
// La voz sale de `hyperframes tts` (Kokoro, local). Los tiempos por palabra salen del
// propio audio: se detectan sus pausas y cada palabra recibe su parte del tramo.

import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const ANIMADOS = path.resolve(AQUI, "..");
const HF = "hyperframes@0.9.20";
const PY = path.join(ANIMADOS, ".venv", "Scripts", "python.exe");

const carpeta = process.argv[2] ? path.resolve(process.argv[2]) : null;
if (!carpeta || !fs.existsSync(path.join(carpeta, "guion.json"))) {
  console.error("Uso: node animados/herramientas/voz.mjs <carpeta-del-video>  (debe tener guion.json)");
  process.exit(1);
}
const guion = JSON.parse(fs.readFileSync(path.join(carpeta, "guion.json"), "utf8"));
// "kokoro": la voz local y gratis. "higgsfield": voz de Higgsfield (gasta creditos de la
// cuenta con la que se inicio sesion en su CLI). "externo": la voz viene ya grabada o
// generada en otro servicio, una frase por archivo, en assets/voz-externa/<id>.wav (o .mp3).
const MOTOR = guion.motor || "kokoro";
if (MOTOR === "kokoro" && !fs.existsSync(PY)) {
  console.error("Falta el entorno de la voz: " + PY + "\nCrealo como dice animados/GUIA.md (seccion Instalacion).");
  process.exit(1);
}
const dirVoz = path.join(carpeta, "assets", "voz");
fs.mkdirSync(dirVoz, { recursive: true });

const env = { ...process.env, HYPERFRAMES_PYTHON: PY, DO_NOT_TRACK: "1", HYPERFRAMES_NO_TELEMETRY: "1" };
const r3 = (n) => Math.round(n * 1000) / 1000;

function correr(cmd, args, opciones = {}) {
  const r = spawnSync(cmd, args, { encoding: "utf8", env, ...opciones });
  if (r.status !== 0) {
    throw new Error(`Fallo: ${cmd} ${Array.isArray(args) ? args.join(" ") : ""}\n${r.stderr || r.stdout || r.error}`);
  }
  return r.stdout;
}

function duracion(archivo) {
  const s = correr("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", archivo]);
  return parseFloat(s.trim());
}

// --- Comprobacion de la voz de pago: se transcribe con whisper (el de la Legion) y se
// compara con el guion. Sin whisper instalado, no se comprueba.
const WHISPER = path.join(ANIMADOS, "..", "herramientas", "bin", "whisper", "whisper-cli.exe");
const MODELO = path.join(ANIMADOS, "..", "herramientas", "modelos", "ggml-small-q5_1.bin");
const revisarDeOido = [];

// Como suena un texto, sin lo que el oido no distingue (tildes, h muda, b/v, z/s, ll/y).
const sonido = (s) =>
  String(s)
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/h/g, "")
    .replace(/g([ei])/g, "j$1")
    .replace(/v/g, "b")
    .replace(/z/g, "s")
    .replace(/ll/g, "y")
    .split(/\s+/)
    .filter(Boolean);

// Cuantas palabras se oyen distintas al guion (0 = se oye lo que dice). null si no se pudo comprobar.
function difiere(audio, texto) {
  if (!fs.existsSync(WHISPER) || !fs.existsSync(MODELO)) return null;
  const wav16 = audio + ".oir.wav";
  correr("ffmpeg", ["-v", "error", "-y", "-i", audio, "-af", "adelay=300:all=1,apad=pad_dur=0.6", "-ar", "16000", "-ac", "1", "-c:a", "pcm_s16le", wav16]);
  const r = spawnSync(WHISPER, ["-m", MODELO, "-l", "es", "-f", wav16, "-np", "-nt"], { encoding: "utf8" });
  fs.rmSync(wav16, { force: true });
  if (r.status !== 0) return null;
  const a = sonido(texto);
  const b = sonido(String(r.stdout).replace(/\[[^\]]*\]/g, " "));
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...new Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  }
  return d[a.length][b.length];
}

// Pronunciacion: como se le escribe cada palabra a la voz de pago (animados/pronunciacion.json).
const archivoPronunciacion = path.join(ANIMADOS, "pronunciacion.json");
const reglasDeVoz = fs.existsSync(archivoPronunciacion) ? JSON.parse(fs.readFileSync(archivoPronunciacion, "utf8")).reglas || [] : [];
function paraLaVoz(texto) {
  let salida = texto;
  for (const regla of reglasDeVoz) {
    salida = salida.replace(new RegExp(regla.busca, "gi"), (hallado) => {
      const mayuscula = hallado[0] !== hallado[0].toLowerCase();
      return mayuscula ? regla.pon[0].toUpperCase() + regla.pon.slice(1) : regla.pon;
    });
  }
  return salida;
}

// CLI de Higgsfield (npm i -g @higgsfield/cli; higgsfield auth login). Se llama a su
// archivo de entrada con node, sin pasar por el shell, para que el texto llegue intacto.
let entradaHiggsfield = null;
function higgsfield(args) {
  if (!entradaHiggsfield) {
    const raiz = spawnSync("npm root -g", { shell: true, encoding: "utf8" }).stdout.trim();
    entradaHiggsfield = path.join(raiz, "@higgsfield", "cli", "bin", "higgsfield.js");
    if (!fs.existsSync(entradaHiggsfield)) {
      throw new Error("Falta el CLI de Higgsfield. Instalalo con: npm i -g @higgsfield/cli  y despues: higgsfield auth login");
    }
  }
  const r = spawnSync(process.execPath, [entradaHiggsfield, ...args], { encoding: "utf8" });
  if (r.status !== 0) throw new Error("Higgsfield fallo:\n" + (r.stderr || r.stdout));
  return r.stdout;
}

// La voz se puede escribir por nombre ("Bram") o por id; `higgsfield voices list` las muestra.
let vocesHiggsfield = null;
function vozDeHiggsfield(pedida) {
  if (!pedida) throw new Error('Con "motor": "higgsfield" el guion necesita "voz" (un nombre de `higgsfield voices list`).');
  if (/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(pedida)) return { id: pedida, tipo: guion.voz_tipo || "preset" };
  if (!vocesHiggsfield) {
    const salida = higgsfield(["voices", "list", "--json"]);
    const datos = JSON.parse(salida.slice(salida.search(/[[{]/)));
    vocesHiggsfield = Array.isArray(datos) ? datos : datos.voices || datos.items || datos.data || [];
  }
  const voz = vocesHiggsfield.find((v) => String(v.name).toLowerCase() === String(pedida).toLowerCase());
  if (!voz) throw new Error(`Higgsfield no tiene una voz llamada "${pedida}". Mira los nombres con: higgsfield voices list`);
  return { id: voz.id, tipo: voz.voice_type || "preset" };
}

// 1. Una frase por archivo: voz, y recorte del silencio de los extremos.
function hablar(frase) {
  const txt = path.join(dirVoz, frase.id + ".txt");
  const crudo = path.join(dirVoz, frase.id + ".crudo.wav");
  const wav = path.join(dirVoz, frase.id + ".wav");
  const sello = path.join(dirVoz, frase.id + ".firma");
  const recorte =
    "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.03," +
    "areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse";
  const yaEsta = (firma) => fs.existsSync(wav) && fs.existsSync(sello) && fs.readFileSync(sello, "utf8") === firma;

  if (MOTOR === "externo") {
    const dirExterna = path.join(carpeta, "assets", "voz-externa");
    const fuente = ["wav", "mp3", "m4a", "ogg", "flac"]
      .map((ext) => path.join(dirExterna, `${frase.id}.${ext}`))
      .find((f) => fs.existsSync(f));
    if (!fuente) throw new Error(`Falta la voz de ${frase.id}: pon ${frase.id}.wav (o .mp3) en ${dirExterna}`);
    const datos = fs.statSync(fuente);
    const firma = JSON.stringify({ texto: frase.texto, fuente: path.basename(fuente), peso: datos.size, fecha: datos.mtimeMs });
    if (yaEsta(firma)) return wav;
    correr("ffmpeg", ["-v", "error", "-y", "-i", fuente, "-af", recorte, "-ar", "48000", "-ac", "1", wav]);
    fs.writeFileSync(sello, firma, "utf8");
    return wav;
  }

  if (MOTOR === "higgsfield") {
    const voz = vozDeHiggsfield(frase.voz || guion.voz);
    const variante = guion.variante || "elevenlabs";
    // Cada frase cuesta creditos: solo se vuelve a generar si cambio el texto o la voz.
    const dicho = paraLaVoz(frase.texto);
    const sellado = { texto: frase.texto, motor: MOTOR, voz: voz.id, variante };
    if (dicho !== frase.texto) sellado.dicho = dicho;
    const firma = JSON.stringify(sellado);
    if (yaEsta(firma)) return wav;
    // Las frases que se repiten entre videos (las de la marca) se generan una sola vez:
    // quedan guardadas en animados/.voz-cache/ por texto y voz.
    const cache = path.join(ANIMADOS, ".voz-cache");
    fs.mkdirSync(cache, { recursive: true });
    const llave = crypto.createHash("sha1").update(firma).digest("hex");
    const guardado = path.join(cache, llave + ".mp3");
    if (!fs.existsSync(guardado)) {
      // Hasta tres intentos: se queda con el primero que se oiga igual al guion, o con el mejor.
      let mejor = null;
      for (let intento = 1; intento <= 3; intento++) {
        const salida = higgsfield([
          "generate", "create", "text2speech_v2",
          "--prompt", dicho,
          "--variant", variante,
          "--voice_id", voz.id,
          "--voice_type", voz.tipo,
          "--wait", "--json",
        ]);
        const trabajos = JSON.parse(salida.slice(salida.indexOf("[")));
        const url = trabajos[0] && trabajos[0].result_url;
        if (!url) throw new Error("Higgsfield no devolvio audio para " + frase.id + ":\n" + salida.slice(0, 400));
        const temporal = `${guardado}.${intento}.mp3`;
        correr("curl", ["-sL", "-o", temporal, url]);
        const fallos = difiere(temporal, frase.texto);
        if (!mejor || (fallos !== null && fallos < mejor.fallos)) {
          if (mejor) fs.rmSync(mejor.archivo, { force: true });
          mejor = { archivo: temporal, fallos: fallos ?? 0, intentos: intento };
        } else {
          fs.rmSync(temporal, { force: true });
        }
        mejor.intentos = intento;
        if (!fallos) break;
      }
      fs.renameSync(mejor.archivo, guardado);
      if (mejor.intentos > 1) process.stdout.write(`(${mejor.intentos} intentos) `);
      if (mejor.fallos) revisarDeOido.push(`${frase.id} "${frase.texto}": whisper oye ${mejor.fallos} palabra(s) distinta(s) tras ${mejor.intentos} intentos`);
    }
    correr("ffmpeg", ["-v", "error", "-y", "-i", guardado, "-af", recorte, "-ar", "48000", "-ac", "1", wav]);
    fs.writeFileSync(sello, firma, "utf8");
    return wav;
  }

  const voz = frase.voz || guion.voz || "ef_dora";
  const vel = frase.velocidad || guion.velocidad || 1;
  // Si la frase no cambio, se reutiliza su audio (la voz tarda unos segundos por frase).
  const firma = JSON.stringify({ texto: frase.texto, voz, vel });
  if (yaEsta(firma)) return wav;
  fs.writeFileSync(txt, frase.texto, "utf8");
  // npx es un .cmd en Windows: hay que pasar por el shell.
  const orden = `npx --yes ${HF} tts "${txt}" -v ${voz} -l es -s ${vel} -o "${crudo}" --json`;
  const r = spawnSync(orden, { shell: true, encoding: "utf8", env, cwd: carpeta });
  if (r.status !== 0 || !fs.existsSync(crudo)) {
    throw new Error("No salio la voz de " + frase.id + ":\n" + (r.stdout || "") + (r.stderr || ""));
  }
  correr("ffmpeg", ["-v", "error", "-y", "-i", crudo, "-af", recorte, "-ar", "48000", "-ac", "1", wav]);
  fs.rmSync(crudo, { force: true });
  fs.writeFileSync(sello, firma, "utf8");
  return wav;
}

// 2. Silencios dentro del audio de una frase (pausas de puntuacion y cierres de consonante).
function silencios(wav) {
  const r = spawnSync(
    "ffmpeg",
    ["-hide_banner", "-nostats", "-i", wav, "-af", "silencedetect=noise=-26dB:d=0.05", "-f", "null", "-"],
    { encoding: "utf8" },
  );
  const texto = r.stderr || "";
  const inicios = [...texto.matchAll(/silence_start: (-?[\d.]+)/g)].map((m) => Math.max(0, parseFloat(m[1])));
  const fines = [...texto.matchAll(/silence_end: (-?[\d.]+)/g)].map((m) => parseFloat(m[1]));
  return inicios.filter((_, i) => fines[i] !== undefined).map((inicio, i) => ({ inicio, fin: fines[i] }));
}

const letras = (s) =>
  Math.max(
    1,
    s
      .normalize("NFD") // separa las tildes de su letra; la linea siguiente las descarta
      .replace(/[^a-zA-Z0-9]/g, "").length,
  );

// Grupos de palabras separados por la puntuacion del guion (ahi es donde la voz hace pausa).
function clausulas(palabras) {
  const grupos = [];
  let actual = [];
  palabras.forEach((p, i) => {
    actual.push(i);
    if (/[,;:.!?]$/.test(p) && i < palabras.length - 1) {
      grupos.push(actual);
      actual = [];
    }
  });
  if (actual.length) grupos.push(actual);
  return grupos;
}

// 3. Tiempo de cada palabra. La voz sintetica habla a ritmo parejo, asi que el tiempo se
//    reparte segun el largo de cada palabra; y cada signo de puntuacion del guion se ancla
//    al silencio real mas largo que haya cerca de donde deberia caer.
function alinear(palabras, wav, dur) {
  const huecos = silencios(wav);
  const grupos = clausulas(palabras);
  const pesos = grupos.map((g) => g.reduce((suma, i) => suma + letras(palabras[i]), 0));
  const tramos = [];
  let desde = 0;
  let pausas = 0;
  for (let g = 0; g < grupos.length; g++) {
    if (g === grupos.length - 1) {
      tramos.push({ inicio: desde, fin: dur });
      break;
    }
    const resto = pesos.slice(g).reduce((x, y) => x + y, 0);
    const esperado = desde + ((dur - desde) * pesos[g]) / resto;
    let mejor = null;
    let nota = 0;
    for (const h of huecos) {
      const medio = (h.inicio + h.fin) / 2;
      if (h.inicio <= desde + 0.05 || h.fin >= dur - 0.05 || Math.abs(medio - esperado) > 0.45) continue;
      const n = h.fin - h.inicio - 0.25 * Math.abs(medio - esperado);
      if (n > nota) {
        nota = n;
        mejor = h;
      }
    }
    if (mejor) {
      tramos.push({ inicio: desde, fin: mejor.inicio });
      desde = mejor.fin;
      pausas++;
    } else {
      tramos.push({ inicio: desde, fin: esperado });
      desde = esperado;
    }
  }
  const tiempos = new Array(palabras.length);
  grupos.forEach((grupo, g) => {
    let cursor = tramos[g].inicio;
    for (const i of grupo) {
      const d = ((tramos[g].fin - tramos[g].inicio) * letras(palabras[i])) / pesos[g];
      tiempos[i] = { inicio: cursor, fin: cursor + d };
      cursor += d;
    }
  });
  return { tiempos, pausas, esperadas: grupos.length - 1 };
}

// --- Proceso ---
const pausa = guion.pausa ?? 0.22;
let cursor = guion.inicio ?? 0.2;
let numero = 0;
const frases = [];
const partes = [];

for (const frase of guion.frases) {
  process.stdout.write(`voz ${frase.id} ... `);
  const wav = hablar(frase);
  const dur = duracion(wav);
  const palabras = frase.texto.split(/\s+/).filter(Boolean);
  const { tiempos, pausas, esperadas } = alinear(palabras, wav, dur);
  console.log(`${dur.toFixed(2)} s (${palabras.length} palabras, ${pausas} de ${esperadas} pausas ancladas)`);
  frases.push({
    id: frase.id,
    escena: frase.escena,
    texto: frase.texto,
    inicio: r3(cursor),
    fin: r3(cursor + dur),
    palabras: palabras.map((p, i) => ({
      id: "w" + numero++,
      texto: p,
      inicio: r3(cursor + tiempos[i].inicio),
      fin: r3(cursor + tiempos[i].fin),
    })),
  });
  partes.push({ wav, antes: frases.length === 1 ? cursor : (frase.pausa_antes ?? pausa) });
  cursor += dur + (frase.pausa_despues ?? pausa);
}
// La pausa que precede a cada frase es la `pausa_despues` de la anterior.
for (let i = 1; i < partes.length; i++) {
  partes[i].antes = r3(frases[i].inicio - frases[i - 1].fin);
}
const total = r3(frases[frases.length - 1].fin + (guion.cola ?? 0.9));

// Ventana de cada escena: empieza un instante antes de su primera frase y dura hasta la
// siguiente. Las frases de una misma escena van seguidas en el guion.
const escenas = [];
for (const f of frases) {
  const ultima = escenas[escenas.length - 1];
  if (ultima && ultima.id === f.escena) continue;
  if (escenas.some((e) => e.id === f.escena)) {
    throw new Error(`La escena "${f.escena}" aparece dos veces separadas en el guion; junta sus frases.`);
  }
  const inicio = escenas.length ? r3(f.inicio - 0.07) : 0;
  if (ultima) ultima.fin = inicio;
  escenas.push({ id: f.escena, inicio, fin: total });
}

// 4. Une las frases con sus silencios y nivela la voz (el video final queda cerca de -16 LUFS).
const entradas = [];
const filtros = [];
const orden = [];
partes.forEach((p, i) => {
  entradas.push("-i", p.wav);
  filtros.push(`anullsrc=r=48000:cl=mono,atrim=0:${p.antes}[s${i}]`);
  filtros.push(`[${i}:a]aresample=48000[a${i}]`);
  orden.push(`[s${i}][a${i}]`);
});
filtros.push(`anullsrc=r=48000:cl=mono,atrim=0:${guion.cola ?? 0.9}[sf]`);
filtros.push(`${orden.join("")}[sf]concat=n=${partes.length * 2 + 1}:v=0:a=1,loudnorm=I=-14.5:TP=-1.5:LRA=11,aresample=48000[out]`);
const salida = path.join(carpeta, "assets", "narracion.wav");
correr("ffmpeg", ["-v", "error", "-y", ...entradas, "-filter_complex", filtros.join(";"), "-map", "[out]", "-ac", "2", salida]);

fs.writeFileSync(
  path.join(carpeta, "tiempos.json"),
  JSON.stringify({ duracion: total, audio: "assets/narracion.wav", escenas, frases }, null, 2) + "\n",
  "utf8",
);
if (revisarDeOido.length) {
  console.log("\nPara revisar de oido (la voz puede haber dicho algo distinto al guion):");
  revisarDeOido.forEach((r) => console.log("  - " + r));
}
console.log(`\nListo: ${salida}\n       duracion total ${total} s (audio real ${duracion(salida).toFixed(2)} s) -> tiempos.json`);
