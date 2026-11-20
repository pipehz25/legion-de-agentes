// une-escenas.mjs - Une al guion de un video largo por escenas las escenas de uno o varios capitulos
// escritas en archivos aparte (asi varias personas o agentes trabajan a la vez sin pisarse).
//
// Uso (desde la raiz del proyecto):
//   node animados/herramientas/une-escenas.mjs animados/propios/<id> animados/propios/<id>/escenas/c3.json [...]
//   ... --revisar   solo revisa los archivos (no cambia el guion)
//
// Cada archivo trae UN capitulo:
//   { "capitulo": "c3",
//     "escenas": { "<id>": { "plantilla": "...", "datos": { ... } }, ... },
//     "frases": [ { "id": "f21", "escena": "<id>", "cortes": [ { "escena": "<id>", "palabra": 9 } ] }, ... ],
//       (cada frase tambien puede traer "pausa_despues", "clave" y "subtitulos": no cambian la voz)
//     "tarjeta": "<id>" | false   (opcional; sin ella, la tarjeta del capitulo es automatica) }
// En el guion se reemplazan las escenas de ese capitulo y la "escena" y los "cortes" de cada frase.
// El texto de las frases NUNCA se toca (su voz ya esta pagada): si el archivo trae "texto", tiene que
// ser identico al del guion, o no se une nada. Los demas capitulos quedan como estaban.

import fs from "node:fs";
import path from "node:path";
import { planEscenas } from "./largo.mjs";

const args = process.argv.slice(2);
const soloRevisar = args.includes("--revisar");
const [carpeta, ...archivos] = args.filter((a) => !a.startsWith("--")).map((a) => path.resolve(a));
if (!carpeta || !archivos.length || !fs.existsSync(path.join(carpeta, "guion.json"))) {
  console.error("Uso: node animados/herramientas/une-escenas.mjs <carpeta-del-video> <capitulo.json> [...] [--revisar]");
  process.exit(1);
}
const rutaGuion = path.join(carpeta, "guion.json");
const guion = JSON.parse(fs.readFileSync(rutaGuion, "utf8"));
const errores = [];

for (const archivo of archivos) {
  const nombre = path.basename(archivo);
  let parte;
  try {
    parte = JSON.parse(fs.readFileSync(archivo, "utf8"));
  } catch (e) {
    errores.push(`${nombre}: no es un JSON valido (${e.message})`);
    continue;
  }
  const cap = (guion.capitulos || []).find((c) => c.id === parte.capitulo);
  if (!cap) {
    errores.push(`${nombre}: "capitulo" tiene que ser uno de ${(guion.capitulos || []).map((c) => c.id).join(", ")} (llego "${parte.capitulo}")`);
    continue;
  }
  if (!parte.escenas || typeof parte.escenas !== "object") errores.push(`${nombre}: falta "escenas"`);
  const porId = new Map((parte.frases || []).map((f) => [f.id, f]));
  for (const id of porId.keys()) if (!cap.frases.some((f) => f.id === id)) errores.push(`${nombre}: la frase ${id} no es del capitulo ${cap.id}`);
  for (const f of cap.frases) {
    const nueva = porId.get(f.id);
    if (!nueva) {
      errores.push(`${nombre}: falta la frase ${f.id} (todas las frases del capitulo necesitan su escena)`);
      continue;
    }
    if (nueva.texto !== undefined && nueva.texto !== f.texto) errores.push(`${nombre}: el texto de ${f.id} no es el del guion (el texto no se cambia: su voz ya esta pagada)`);
    if (!nueva.escena) errores.push(`${nombre}: la frase ${f.id} no tiene "escena"`);
  }
  if (errores.length) continue;
  cap.escenas = parte.escenas;
  if (parte.tarjeta !== undefined) cap.tarjeta = parte.tarjeta;
  else delete cap.tarjeta;
  cap.frases = cap.frases.map((f) => {
    const nueva = porId.get(f.id);
    // Se conserva lo demas de la frase (subtitulos, clave, pausa_despues...); la "imagen" del modo de fotos se va.
    const extra = Object.fromEntries(Object.entries(f).filter(([k]) => !["id", "texto", "escena", "cortes", "imagen"].includes(k)));
    // Del archivo tambien valen "pausa_despues", "clave" y "subtitulos" (no cambian la voz).
    for (const k of ["pausa_despues", "clave", "subtitulos"]) if (nueva[k] !== undefined) extra[k] = nueva[k];
    return { id: f.id, escena: nueva.escena, texto: f.texto, ...(nueva.cortes && nueva.cortes.length ? { cortes: nueva.cortes } : {}), ...extra };
  });
  console.log(`${nombre}: capitulo ${cap.id}, ${Object.keys(parte.escenas).length} escenas, ${cap.frases.length} frases`);
}

if (!errores.length) {
  const plano = planEscenas(guion);
  errores.push(...plano.errores);
  plano.avisos.forEach((a) => console.log("aviso: " + a));
}
if (errores.length) {
  console.error("No se unio nada:\n  - " + errores.join("\n  - "));
  process.exit(1);
}
if (soloRevisar) console.log("Revisado: todo en orden (no se cambio el guion).");
else {
  fs.writeFileSync(rutaGuion + ".tmp", JSON.stringify(guion, null, 2) + "\n", "utf8");
  fs.renameSync(rutaGuion + ".tmp", rutaGuion);
  console.log(`Listo: ${path.relative(process.cwd(), rutaGuion)}. Ahora: node animados/herramientas/producir.mjs ${path.relative(process.cwd(), carpeta)} --capitulos <cap> --sin-render --capturas`);
}
