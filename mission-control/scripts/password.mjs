// Pone la contraseña de un socio en Mission Control, sin que pase por el chat ni por GitHub.
// Uso (en tu propia terminal, dentro de mission-control/):  npm run password
// Pregunta el usuario y la contraseña (no se ve al escribir), calcula el hash y lo guarda en la base.
// Sirve también para recuperar una contraseña olvidada. Cada socio puede cambiar la suya
// después desde la app (menú de arriba a la derecha → Cambiar contraseña).
import { randomBytes, scryptSync } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import readline from "node:readline";
import { neon } from "@neondatabase/serverless";

function ask(question, hidden = false) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) {
      rl._writeToOutput = (s) => {
        if (s.includes(question)) rl.output.write(s);
        else if (s !== "\r\n" && s !== "\n") rl.output.write("*");
      };
    }
    rl.question(question, (answer) => {
      rl.close();
      if (hidden) process.stdout.write("\n");
      resolve(answer);
    });
  });
}

function dbUrl() {
  const file = ".env.vercel";
  if (!existsSync(file)) {
    console.log("Trayendo la conexión de la base desde Vercel…");
    const vercel = process.platform === "win32" ? "vercel.cmd" : "vercel";
    spawnSync(vercel, ["env", "pull", file, "--environment=production", "--yes"], { stdio: "ignore", shell: process.platform === "win32" });
  }
  if (!existsSync(file)) return "";
  const txt = readFileSync(file, "utf8");
  const m = /^(?:DATABASE_URL|POSTGRES_URL)="?([^"\r\n]+)"?$/m.exec(txt);
  return m ? m[1] : "";
}

const url = dbUrl();
if (!url) {
  console.error("No encontré la base de datos. Corre esto dentro de mission-control/, con la sesión de Vercel iniciada (vercel login).");
  process.exit(1);
}
const user = (await ask("Usuario (santiago o felipe): ")).trim().toLowerCase();
if (!["santiago", "felipe"].includes(user)) {
  console.error("Usuario no válido.");
  process.exit(1);
}
const p1 = await ask("Contraseña (10 caracteres o más): ", true);
const p2 = await ask("Repítela: ", true);
if (p1.length < 10 || p1 !== p2) {
  console.error("Las contraseñas no coinciden o son muy cortas. No se cambió nada.");
  process.exit(1);
}
const salt = randomBytes(16);
const hash = `scrypt:${salt.toString("hex")}:${scryptSync(p1, salt, 32).toString("hex")}`;
const sql = neon(url);
await sql`create table if not exists mc_docs (col text not null, id text not null, data jsonb not null,
  updated_at timestamptz not null default now(), updated_by text, primary key (col, id))`;
await sql`insert into mc_docs (col, id, data, updated_by) values ('_privado', ${"pass:" + user}, ${JSON.stringify({ v: hash })}::jsonb, 'script')
  on conflict (col, id) do update set data = excluded.data, updated_at = now(), updated_by = 'script'`;
console.log(`Listo: ${user} ya puede entrar en https://legion-mission-control.vercel.app con esa contraseña.`);
