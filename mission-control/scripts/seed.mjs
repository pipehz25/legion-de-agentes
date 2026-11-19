// Carga en Mission Control (Vercel) los documentos exportados de la versión anterior.
// Uso:  node scripts/seed.mjs <carpeta-exportada> [url]
//   <carpeta-exportada>/<coleccion>/<id>.json  (tareas, cuentas, decisiones, pipeline)
//   url por defecto: MC_URL de .env.local
// Usa MC_AGENT_TOKEN de .env.local (nunca se imprime).
import { promises as fs } from "node:fs";
import path from "node:path";

async function loadEnv() {
  try {
    const txt = await fs.readFile(path.join(process.cwd(), ".env.local"), "utf8");
    for (const line of txt.split(/\r?\n/)) {
      const m = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, "");
    }
  } catch {
    /* sin .env.local */
  }
}

await loadEnv();
const dir = process.argv[2];
const base = (process.argv[3] || process.env.MC_URL || "").replace(/\/$/, "");
const token = process.env.MC_AGENT_TOKEN || "";
if (!dir || !base || token.length < 32) {
  console.error("Uso: node scripts/seed.mjs <carpeta> [url]. Hace falta MC_URL y MC_AGENT_TOKEN en .env.local.");
  process.exit(1);
}

let ok = 0;
let bad = 0;
for (const col of ["tareas", "cuentas", "decisiones", "pipeline"]) {
  let files = [];
  try {
    files = (await fs.readdir(path.join(dir, col))).filter((f) => f.endsWith(".json"));
  } catch {
    continue;
  }
  for (const f of files) {
    const raw = JSON.parse(await fs.readFile(path.join(dir, col, f), "utf8"));
    const id = raw.id && raw.data ? raw.id : path.basename(f, ".json");
    const data = raw.data && typeof raw.data === "object" ? raw.data : raw;
    const r = await fetch(`${base}/api/agent/${col}/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ data }),
    });
    if (r.ok) ok++;
    else {
      bad++;
      console.error(`${col}/${id}: ${r.status}`);
    }
  }
}
console.log(`Cargados ${ok} documentos${bad ? `, ${bad} con error` : ""}.`);
process.exit(bad ? 1 : 0);
