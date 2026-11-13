// capturas.mjs - Saca capturas de un video animado (dos momentos por escena, mas el cuadro 0
// y el final) y las junta en una hoja de contacto para revisarlas de un vistazo.
//
// Uso (desde la raiz del proyecto):
//   node animados/herramientas/capturas.mjs animados/videos/<video>
//
// Deja  <video>/snapshots/hoja-1.png, hoja-2.png...  (seis capturas por hoja)
// Hay que correr antes voz.mjs y montaje.mjs. Mirar las hojas es parte de la revision:
// que `check` pase no dice como se ve.

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const carpeta = process.argv[2] ? path.resolve(process.argv[2]) : null;
if (!carpeta || !fs.existsSync(path.join(carpeta, "tiempos.json"))) {
  console.error("Uso: node animados/herramientas/capturas.mjs <carpeta-del-video>  (corre antes voz.mjs y montaje.mjs)");
  process.exit(1);
}
const tiempos = JSON.parse(fs.readFileSync(path.join(carpeta, "tiempos.json"), "utf8"));
const r2 = (n) => Math.round(n * 100) / 100;

const momentos = [0];
for (const e of tiempos.escenas) {
  const dur = e.fin - e.inicio;
  momentos.push(r2(e.inicio + dur * 0.5), r2(e.inicio + dur * 0.93));
}
momentos.push(r2(tiempos.duracion - 0.15));
const lista = [...new Set(momentos)].sort((a, b) => a - b);

const dir = path.join(carpeta, "snapshots");
fs.rmSync(dir, { recursive: true, force: true });
const env = { ...process.env, DO_NOT_TRACK: "1", HYPERFRAMES_NO_TELEMETRY: "1" };
const r = spawnSync(`npx --yes hyperframes@0.9.20 snapshot --at ${lista.join(",")} --no-end --keep -o snapshots`, { shell: true, cwd: carpeta, env, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
if (r.status !== 0) {
  console.error("No salieron las capturas:\n" + (r.stderr || r.stdout || "").slice(0, 2000));
  process.exit(1);
}

// En orden de tiempo, de a seis por hoja.
const archivos = lista.map((t) => path.join(dir, `at-${t}s.png`)).filter((f) => fs.existsSync(f));
const POR_HOJA = 6;
const hojas = [];
for (let i = 0; i < archivos.length; i += POR_HOJA) {
  const grupo = archivos.slice(i, i + POR_HOJA);
  const salida = path.join(dir, `hoja-${hojas.length + 1}.png`);
  const entradas = grupo.flatMap((f) => ["-i", f]);
  const filtro = grupo.map((_, k) => `[${k}:v]scale=330:-2[v${k}]`).join(";") + ";" + grupo.map((_, k) => `[v${k}]`).join("") + (grupo.length > 1 ? `hstack=inputs=${grupo.length}` : "copy");
  const f = spawnSync("ffmpeg", ["-v", "error", "-y", ...entradas, "-filter_complex", filtro, "-frames:v", "1", "-update", "1", salida], { encoding: "utf8" });
  if (f.status === 0) hojas.push(salida);
  else console.error(f.stderr);
}
console.log(`Listo: ${archivos.length} capturas en ${hojas.length} hoja(s)`);
hojas.forEach((h, i) => console.log(`  ${h}   (${lista.slice(i * POR_HOJA, i * POR_HOJA + POR_HOJA).join(" s, ")} s)`));
