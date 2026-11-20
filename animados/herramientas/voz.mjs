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
// La voz sale de una grabacion de una persona ("motor": "grabada"), de ElevenLabs, de
// Higgsfield, de Kokoro (local) o de archivos sueltos. Los tiempos por palabra salen del
// propio audio: se detectan sus pausas y cada palabra recibe su parte del tramo.
//
// Sale con codigo 3 si el guion pide voz grabada y la grabacion todavia no esta.
// Un guion de video largo ("tipo": "largo", con "capitulos") se aplana con largo.mjs.

import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { aplanarLargo, esLargo } from "./largo.mjs";

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const ANIMADOS = path.resolve(AQUI, "..");
const HF = "hyperframes@0.9.20";
const WINDOWS = process.platform === "win32";
const PY = WINDOWS ? path.join(ANIMADOS, ".venv", "Scripts", "python.exe") : path.join(ANIMADOS, ".venv", "bin", "python");

// --- ElevenLabs ("motor": "elevenlabs") ----------------------------------------------
// Voz de pago, se cobra por caracter. La clave va FUERA del proyecto: en la variable
// ELEVENLABS_API_KEY o en ~/.legion/elevenlabs/clave.txt (en Windows,
// %USERPROFILE%\.legion\elevenlabs\clave.txt), una sola linea. La guarda una persona con
// animados/herramientas/guardar-clave-elevenlabs.ps1; este script la usa y nunca la imprime.
// "voz" en el guion es el id (o el nombre) de una voz de la cuenta. Para elegirla:
//   node animados/herramientas/voz.mjs --voces-elevenlabs            (las de la cuenta)
//   node animados/herramientas/voz.mjs --buscar-voces-elevenlabs [acento]   (biblioteca, en espanol)
//   node animados/herramientas/voz.mjs --agregar-voz-elevenlabs <dueno> <voice_id> <nombre>
const EL_API = "https://api.elevenlabs.io/v1";
const EL_ARCHIVO_CLAVE = path.join(os.homedir(), ".legion", "elevenlabs", "clave.txt");
function claveElevenlabs() {
  const clave = (process.env.ELEVENLABS_API_KEY || (fs.existsSync(EL_ARCHIVO_CLAVE) ? fs.readFileSync(EL_ARCHIVO_CLAVE, "utf8") : "")).trim();
  if (!clave) {
    throw new Error(
      `Falta la clave de ElevenLabs. Guardala con: powershell -NoProfile -ExecutionPolicy Bypass -File animados\\herramientas\\guardar-clave-elevenlabs.ps1  (no la pegues en el chat).`,
    );
  }
  return clave;
}
async function elevenlabs(ruta, opciones = {}) {
  const r = await fetch(EL_API + ruta, { ...opciones, headers: { "xi-api-key": claveElevenlabs(), ...(opciones.headers || {}) } });
  if (!r.ok) {
    let detalle = "";
    try {
      detalle = JSON.stringify((await r.json()).detail || "");
    } catch {}
    const error = new Error(`ElevenLabs respondio ${r.status} en ${ruta.split("?")[0]}: ${detalle.slice(0, 400)}`);
    error.status = r.status;
    throw error;
  }
  return r;
}
async function vocesElevenlabs() {
  return (await (await elevenlabs("/voices")).json()).voices || [];
}

const modo = process.argv[2];
if (modo === "--voces-elevenlabs") {
  for (const v of await vocesElevenlabs()) {
    const l = v.labels || {};
    console.log(`${v.voice_id}  ${v.name}  [${v.category || ""}] ${[l.language, l.accent, l.gender, l.age, l.use_case].filter(Boolean).join(", ")}`);
  }
  process.exit(0);
}
if (modo === "--buscar-voces-elevenlabs") {
  const q = new URLSearchParams({ page_size: "40", language: "es" });
  if (process.argv[3]) q.set("accent", process.argv[3]);
  const datos = await (await elevenlabs("/shared-voices?" + q)).json();
  for (const v of datos.voices || []) {
    console.log(
      `${v.public_owner_id} ${v.voice_id}  ${v.name}  ${[v.accent, v.gender, v.age, v.use_case, v.descriptive].filter(Boolean).join(", ")}` +
        `${v.free_users_allowed === false ? "  (no para plan gratis)" : ""}\n    muestra: ${v.preview_url || "-"}`,
    );
  }
  process.exit(0);
}
if (modo === "--agregar-voz-elevenlabs") {
  const [dueno, id, ...nombre] = process.argv.slice(3);
  if (!dueno || !id || !nombre.length) {
    console.error("Uso: node animados/herramientas/voz.mjs --agregar-voz-elevenlabs <dueno> <voice_id> <nombre>");
    process.exit(1);
  }
  const r = await elevenlabs(`/voices/add/${dueno}/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ new_name: nombre.join(" ") }),
  });
  console.log("Agregada. Id para el guion: " + (await r.json()).voice_id);
  process.exit(0);
}

const carpeta = process.argv[2] ? path.resolve(process.argv[2]) : null;
if (!carpeta || !fs.existsSync(path.join(carpeta, "guion.json"))) {
  console.error("Uso: node animados/herramientas/voz.mjs <carpeta-del-video>  (debe tener guion.json)");
  process.exit(1);
}
const guionLeido = JSON.parse(fs.readFileSync(path.join(carpeta, "guion.json"), "utf8"));
// Video largo de YouTube ("tipo": "largo", ver largo.mjs): sus capitulos se leen como una sola
// lista de frases; la "escena" de cada frase es su tramo de imagen y cada tarjeta de capitulo
// pone una pausa en la frase anterior. Cache y tope de ElevenLabs funcionan igual.
const guion = esLargo(guionLeido) ? aplanarLargo(guionLeido) : guionLeido;
// "grabada": una persona lee todo el guion de una vez; se corta en frases (ver mas abajo).
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
// En Windows esta en herramientas/bin/whisper (lo instala herramientas/instalar.ps1); en Mac,
// `brew install whisper-cpp` lo deja en el PATH. El modelo va en herramientas/modelos/.
function buscaWhisper() {
  const propio = path.join(ANIMADOS, "..", "herramientas", "bin", "whisper", WINDOWS ? "whisper-cli.exe" : "whisper-cli");
  if (fs.existsSync(propio)) return propio;
  for (const dir of (process.env.PATH || "").split(path.delimiter)) {
    for (const nombre of WINDOWS ? ["whisper-cli.exe"] : ["whisper-cli", "whisper-cpp"]) {
      const ruta = path.join(dir, nombre);
      if (dir && fs.existsSync(ruta)) return ruta;
    }
  }
  return null;
}
const WHISPER = buscaWhisper();
const MODELO =
  [process.env.WHISPER_MODELO, path.join(ANIMADOS, "..", "herramientas", "modelos", "ggml-small-q5_1.bin")].find((m) => m && fs.existsSync(m)) || null;
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
  if (!WHISPER || !MODELO) return null;
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

// --- Voz grabada por una persona ("motor": "grabada") ----------------------------------
// Una sola grabacion de todo el guion, en la carpeta del video, con el nombre "grabacion"
// (grabacion.m4a, .mp3, .wav, .ogg...: lo que deje el celular). Se transcribe con whisper,
// se ubica cada frase y se corta en el silencio que la persona deja entre frase y frase.
// Si alguien se equivoca y vuelve a decir una frase, cuenta la ultima vez que la dijo.
const NOMBRE_GRABACION = /^grabacion\.(wav|mp3|m4a|aac|ogg|oga|opus|flac|amr|3gp|caf|mp4|mov|webm)$/i;

function buscaGrabacion() {
  if (guion.grabacion) {
    const ruta = path.resolve(carpeta, guion.grabacion);
    return fs.existsSync(ruta) ? ruta : null;
  }
  for (const dir of [carpeta, path.join(carpeta, "assets")]) {
    if (!fs.existsSync(dir)) continue;
    const hallado = fs.readdirSync(dir).find((n) => NOMBRE_GRABACION.test(n));
    if (hallado) return path.join(dir, hallado);
  }
  return null;
}

// El audio como muestras de 16 bits a 16 kHz, para medirlo.
function muestras(archivo) {
  const r = spawnSync("ffmpeg", ["-v", "error", "-i", archivo, "-f", "s16le", "-ac", "1", "-ar", "16000", "-"], { maxBuffer: 1024 * 1024 * 1024 });
  if (r.status !== 0) throw new Error("No se pudo leer " + archivo + ":\n" + String(r.stderr));
  const b = r.stdout;
  const pcm = new Int16Array(Math.floor(b.length / 2));
  for (let i = 0; i < pcm.length; i++) pcm[i] = b.readInt16LE(i * 2);
  return pcm;
}

// Volumen de cada tramo de 20 ms y el umbral entre voz y silencio de esta grabacion: el
// ruido de fondo de un celular cambia de un lugar a otro, asi que se mide en cada una.
function medirVolumen(pcm) {
  const N = 320;
  const db = [];
  let pico = 1;
  for (let i = 0; i + N <= pcm.length; i += N) {
    let suma = 0;
    for (let k = i; k < i + N; k++) {
      suma += pcm[k] * pcm[k];
      if (Math.abs(pcm[k]) > pico) pico = Math.abs(pcm[k]);
    }
    db.push(10 * Math.log10(suma / N / 1073741824 + 1e-12));
  }
  const orden = [...db].sort((a, b) => a - b);
  const en = (p) => orden[Math.min(orden.length - 1, Math.floor(p * orden.length))];
  const ruido = en(0.1);
  const voz = en(0.9);
  return { db, paso: 0.02, ruido, voz, umbral: ruido + Math.max(6, 0.35 * (voz - ruido)), picoDb: 20 * Math.log10(pico / 32768) };
}

// Silencios de al menos 0,12 s. Un tramo suelto de 20 ms (un clic) no corta un silencio.
function silenciosGrabacion(v) {
  const callado = v.db.map((x) => x < v.umbral);
  for (let i = 1; i < callado.length - 1; i++) if (!callado[i] && callado[i - 1] && callado[i + 1]) callado[i] = true;
  const lista = [];
  let desde = null;
  for (let i = 0; i <= callado.length; i++) {
    if (i < callado.length && callado[i]) {
      if (desde === null) desde = i;
    } else if (desde !== null) {
      if ((i - desde) * v.paso >= 0.12) lista.push({ inicio: desde * v.paso, fin: i * v.paso });
      desde = null;
    }
  }
  return lista;
}

// Lo que oye whisper, palabra por palabra, con su tiempo.
function palabrasOidas(wav16, pista) {
  const base = wav16.replace(/\.wav$/, "");
  const args = ["-m", MODELO, "-l", "es", "-f", wav16, "-ml", "1", "-sow", "-oj", "-of", base, "-np"];
  if (pista) args.push("--prompt", pista);
  const r = spawnSync(WHISPER, args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0 || !fs.existsSync(base + ".json")) throw new Error("whisper no pudo transcribir la grabacion:\n" + (r.stderr || r.stdout));
  const datos = JSON.parse(fs.readFileSync(base + ".json", "utf8"));
  fs.rmSync(base + ".json", { force: true });
  return (datos.transcription || []).map((s) => ({ texto: String(s.text || ""), inicio: s.offsets.from / 1000, fin: s.offsets.to / 1000 }));
}

const plano = (s) =>
  String(s)
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

// Donde dijo la persona cada frase del guion. Las letras del guion se alinean una por una con
// las que oyo whisper (asi no importa si oye "células" partido en dos), y ante dos maneras
// igual de buenas se queda con la mas tardia: si una frase se dijo dos veces, la ultima.
function ubicarFrases(oidas) {
  const A = [];
  guion.frases.forEach((f, k) => {
    for (const c of plano(f.texto)) A.push({ c, k });
  });
  const B = [];
  for (const o of oidas) {
    const oidasLetras = [...plano(o.texto)];
    const d = Math.max(0.01, o.fin - o.inicio);
    oidasLetras.forEach((c, i) => B.push({ c, t: o.inicio + (d * (i + 0.5)) / oidasLetras.length }));
  }
  const n = A.length;
  const m = B.length;
  const ancho = m + 1;
  const costo = new Uint32Array((n + 1) * ancho);
  const paso = new Uint8Array((n + 1) * ancho); // 0 = pareja, 1 = letra del guion sin oir, 2 = letra oida de mas
  for (let i = 1; i <= n; i++) {
    costo[i * ancho] = i;
    paso[i * ancho] = 1;
  }
  for (let j = 1; j <= m; j++) {
    costo[j] = j;
    paso[j] = 2;
  }
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      let mejor = costo[(i - 1) * ancho + j - 1] + (A[i - 1].c === B[j - 1].c ? 0 : 1);
      let p = 0;
      const sinOir = costo[(i - 1) * ancho + j] + 1;
      if (sinOir < mejor) {
        mejor = sinOir;
        p = 1;
      }
      const deMas = costo[i * ancho + j - 1] + 1;
      if (deMas < mejor) {
        mejor = deMas;
        p = 2;
      }
      costo[i * ancho + j] = mejor;
      paso[i * ancho + j] = p;
    }
  }
  const tiempos = guion.frases.map(() => []);
  for (let i = n, j = m; i > 0 && j > 0; ) {
    const p = paso[i * ancho + j];
    if (p === 0) {
      tiempos[A[i - 1].k].push(B[j - 1].t);
      i--;
      j--;
    } else if (p === 1) i--;
    else j--;
  }
  // Al alinear, alguna letra suelta de una frase puede caer lejos (en un arranque en falso,
  // por ejemplo). Las letras se agrupan por cercania y cuenta el grupo mas grande.
  return tiempos.map((t) => {
    if (!t.length) return null;
    t.sort((a, b) => a - b);
    const grupos = [[t[0]]];
    for (let i = 1; i < t.length; i++) {
      if (t[i] - t[i - 1] > 0.7) grupos.push([]);
      grupos.at(-1).push(t[i]);
    }
    const mayor = grupos.reduce((a, b) => (b.length >= a.length ? b : a));
    return { inicio: mayor[0], fin: mayor.at(-1) };
  });
}

// Corta la grabacion en un archivo por frase (assets/voz/fN.wav), igual que los demas motores.
function prepararGrabacion() {
  const fuente = buscaGrabacion();
  if (!WHISPER || !MODELO) {
    throw new Error(
      "La voz grabada necesita whisper y su modelo (herramientas/modelos/ggml-small-q5_1.bin). " +
        "En Windows los instala herramientas/instalar.ps1; en Mac, mira animados/GUIA.md (Instalacion).",
    );
  }
  const datos = fs.statSync(fuente);
  // `v` sube cada vez que cambia la manera de cortar, para que se vuelva a cortar todo.
  const firma = JSON.stringify({ v: 2, grabacion: path.basename(fuente), peso: datos.size, fecha: datos.mtimeMs, frases: guion.frases.map((f) => f.texto) });
  const sello = path.join(dirVoz, "_grabacion.firma");
  const listas = guion.frases.every((f) => fs.existsSync(path.join(dirVoz, f.id + ".wav")));
  if (listas && fs.existsSync(sello)) {
    let guardado = null;
    try {
      guardado = JSON.parse(fs.readFileSync(sello, "utf8"));
    } catch {}
    if (guardado && guardado.firma === firma) {
      console.log(`grabacion ${path.basename(fuente)}: ya estaba cortada`);
      revisarDeOido.push(...(guardado.avisos || [])); // los avisos de entonces siguen valiendo
      return;
    }
  }
  const avisosAntes = revisarDeOido.length;
  console.log(`grabacion ${path.basename(fuente)}: ubicando cada frase...`);
  const base = path.join(dirVoz, "_grabacion.wav");
  const base16 = path.join(dirVoz, "_grabacion16.wav");
  correr("ffmpeg", ["-v", "error", "-y", "-i", fuente, "-vn", "-af", "highpass=f=70", "-ar", "48000", "-ac", "1", base]);
  correr("ffmpeg", ["-v", "error", "-y", "-i", base, "-ar", "16000", "-ac", "1", "-c:a", "pcm_s16le", base16]);
  const largo = duracion(base);
  const v = medirVolumen(muestras(base16));
  const ganancia = Math.max(0, Math.min(30, -1 - v.picoDb));
  const huecos = silenciosGrabacion(v);
  const pista = guion.frases.map((f) => f.texto).join(" ").slice(0, 400);
  const ubicadas = ubicarFrases(palabrasOidas(base16, pista));
  ubicadas.forEach((u, k) => {
    if (!u) throw new Error(`No encontre la frase ${guion.frases[k].id} ("${guion.frases[k].texto}") en la grabacion.`);
  });

  // La pausa entre frases es mas larga que la de una coma: cuenta como pausa entre frases todo
  // silencio de al menos el 80 % de la (n-1)-esima pausa mas larga de la grabacion.
  const dentro = huecos
    .filter((s) => s.inicio > ubicadas[0].inicio && s.fin < ubicadas.at(-1).fin)
    .map((s) => s.fin - s.inicio)
    .sort((a, b) => b - a);
  const referencia = dentro.length ? dentro[Math.min(dentro.length - 1, guion.frases.length - 2)] : 0.6;
  const minPausa = guion.pausa_grabacion ?? Math.min(0.8, Math.max(0.3, 0.8 * referencia));
  const largos = huecos.filter((s) => s.fin - s.inicio >= minPausa);

  // Primer y ultimo tramo con voz dentro de [a, b].
  const hayVoz = (i) => v.db[i] >= v.umbral && (v.db[i + 1] ?? -200) >= v.umbral;
  const recorta = (a, b) => {
    let i = Math.max(0, Math.floor(a / v.paso));
    let j = Math.min(v.db.length - 1, Math.ceil(b / v.paso) - 1);
    while (i < j && !hayVoz(i)) i++;
    while (j > i && !hayVoz(j - 1)) j--;
    return { a: i * v.paso, b: (j + 1) * v.paso };
  };

  let antes = 0;
  const lineas = [];
  ubicadas.forEach((u, k) => {
    const frase = guion.frases[k];
    const siguiente = ubicadas[k + 1];
    const previos = largos.filter((s) => s.fin >= antes && s.fin <= u.inicio + 0.5);
    const desde = previos.length ? previos.at(-1).fin : Math.max(antes, u.inicio - 0.2);
    const limite = siguiente ? siguiente.inicio : largo;
    const posteriores = largos.filter((s) => s.inicio > desde + 0.3 && s.inicio < limite && s.fin > u.fin - 0.2);
    const hasta = posteriores.length ? posteriores[0].inicio : siguiente ? Math.max(desde + 0.3, (u.fin + siguiente.inicio) / 2) : largo;
    const { a, b } = recorta(desde, hasta);
    const corteA = Math.max(antes, a - 0.06);
    const corteB = Math.min(largo, b + 0.12);
    antes = b;
    const wav = path.join(dirVoz, frase.id + ".wav");
    correr("ffmpeg", [
      "-v", "error", "-y", "-i", base,
      "-af", `atrim=start=${corteA.toFixed(3)}:end=${corteB.toFixed(3)},asetpts=PTS-STARTPTS,volume=${ganancia.toFixed(1)}dB`,
      "-ar", "48000", "-ac", "1", wav,
    ]);
    const fallos = difiere(wav, frase.texto);
    const palabras = sonido(frase.texto).length;
    if (fallos !== null && fallos > Math.max(1, Math.round(palabras * 0.2))) {
      revisarDeOido.push(`${frase.id} "${frase.texto}": whisper oye ${fallos} palabra(s) distinta(s); revisa que el corte (${corteA.toFixed(2)}-${corteB.toFixed(2)} s de la grabacion) tenga la frase completa`);
    }
    lineas.push(`  ${frase.id}: ${corteA.toFixed(2)} - ${corteB.toFixed(2)} s${fallos ? ` (whisper oye ${fallos} distinta(s))` : ""}`);
  });
  lineas.forEach((l) => console.log(l));
  fs.rmSync(base16, { force: true });
  fs.writeFileSync(sello, JSON.stringify({ firma, avisos: revisarDeOido.slice(avisosAntes) }), "utf8");
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

// ElevenLabs: modelo, ajustes y firma de cada frase (si cambia algo, se vuelve a generar).
const EL_MODELO = guion.modelo_voz || "eleven_multilingual_v2";
const EL_AJUSTES = { stability: 0.5, similarity_boost: 0.75, style: 0, use_speaker_boost: true, ...(guion.ajustes_voz || {}) };
let vocesEL = null;
async function vozElevenlabs(pedida) {
  if (!pedida) throw new Error('Con "motor": "elevenlabs" el guion necesita "voz" (id o nombre; mira: node animados/herramientas/voz.mjs --voces-elevenlabs).');
  if (/^[A-Za-z0-9]{20}$/.test(pedida)) return pedida;
  vocesEL ??= await vocesElevenlabs();
  const v = vocesEL.find((x) => String(x.name).toLowerCase() === String(pedida).toLowerCase());
  if (!v) throw new Error(`La cuenta de ElevenLabs no tiene una voz llamada "${pedida}". Mira: node animados/herramientas/voz.mjs --voces-elevenlabs`);
  return v.voice_id;
}
function firmaElevenlabs(frase, vozId) {
  const dicho = paraLaVoz(frase.texto);
  const sellado = { texto: frase.texto, motor: "elevenlabs", voz: vozId, modelo: EL_MODELO, ajustes: EL_AJUSTES };
  if (dicho !== frase.texto) sellado.dicho = dicho;
  const firma = JSON.stringify(sellado);
  return { firma, dicho, guardado: path.join(ANIMADOS, ".voz-cache", crypto.createHash("sha1").update(firma).digest("hex") + ".mp3") };
}

// 1. Una frase por archivo: voz, y recorte del silencio de los extremos.
async function hablar(frase) {
  const txt = path.join(dirVoz, frase.id + ".txt");
  const crudo = path.join(dirVoz, frase.id + ".crudo.wav");
  const wav = path.join(dirVoz, frase.id + ".wav");
  const sello = path.join(dirVoz, frase.id + ".firma");
  const recorte =
    "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.03," +
    "areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse";
  const yaEsta = (firma) => fs.existsSync(wav) && fs.existsSync(sello) && fs.readFileSync(sello, "utf8") === firma;

  if (MOTOR === "grabada") {
    // prepararGrabacion() ya dejo cada frase cortada.
    if (!fs.existsSync(wav)) throw new Error(`Falta ${wav}: la grabacion no se corto bien.`);
    return wav;
  }

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

  if (MOTOR === "elevenlabs") {
    const vozId = await vozElevenlabs(frase.voz || guion.voz);
    const { firma, dicho, guardado } = firmaElevenlabs(frase, vozId);
    if (yaEsta(firma)) return wav;
    // Cada frase se paga una sola vez: queda en animados/.voz-cache/ por texto, voz y ajustes.
    if (!fs.existsSync(guardado)) {
      const r = await elevenlabs(`/text-to-speech/${vozId}?output_format=mp3_44100_128`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "audio/mpeg" },
        body: JSON.stringify({ text: dicho, model_id: EL_MODELO, voice_settings: EL_AJUSTES }),
      });
      fs.mkdirSync(path.dirname(guardado), { recursive: true });
      fs.writeFileSync(guardado + ".tmp", Buffer.from(await r.arrayBuffer()));
      fs.renameSync(guardado + ".tmp", guardado);
      // No se reintenta solo (cada intento cuesta): si whisper oye algo distinto, se avisa.
      const fallos = difiere(guardado, frase.texto);
      if (fallos !== null && fallos > Math.max(1, Math.round(sonido(frase.texto).length * 0.2))) {
        revisarDeOido.push(`${frase.id} "${frase.texto}": whisper oye ${fallos} palabra(s) distinta(s)`);
      }
    }
    correr("ffmpeg", ["-v", "error", "-y", "-i", guardado, "-af", recorte, "-ar", "48000", "-ac", "1", wav]);
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

if (MOTOR === "grabada") {
  if (!buscaGrabacion()) {
    console.error(
      `FALTA LA GRABACION de "${path.basename(carpeta)}": lee las frases de ${path.join(carpeta, "para-grabar.txt")} ` +
        `y deja el audio en esa carpeta con el nombre grabacion (grabacion.m4a, .mp3, .wav...).`,
    );
    process.exit(3);
  }
  prepararGrabacion();
}

// Antes de gastar: cuantos caracteres se van a pagar (lo ya generado no cuenta) y tope.
if (MOTOR === "elevenlabs") {
  let porPagar = 0;
  for (const frase of guion.frases) {
    const { firma, dicho, guardado } = firmaElevenlabs(frase, await vozElevenlabs(frase.voz || guion.voz));
    const sello = path.join(dirVoz, frase.id + ".firma");
    const yaHecha = fs.existsSync(path.join(dirVoz, frase.id + ".wav")) && fs.existsSync(sello) && fs.readFileSync(sello, "utf8") === firma;
    if (!yaHecha && !fs.existsSync(guardado)) porPagar += dicho.length;
  }
  let cuenta = "";
  try {
    const s = await (await elevenlabs("/user/subscription")).json();
    cuenta = ` (la cuenta lleva ${s.character_count} de ${s.character_limit} caracteres este mes, plan ${s.tier})`;
  } catch {}
  console.log(`ElevenLabs, modelo ${EL_MODELO}: ${porPagar} caracteres por generar${cuenta}`);
  const tope = guion.tope_caracteres ?? 3000;
  if (porPagar > tope) {
    console.error(`No sigo: ${porPagar} caracteres pasan el tope de ${tope}. Si es a proposito, sube "tope_caracteres" en el guion.`);
    process.exit(1);
  }
}

for (const frase of guion.frases) {
  process.stdout.write(`voz ${frase.id} ... `);
  const wav = await hablar(frase);
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
