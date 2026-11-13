// montaje.mjs - Arma el index.html de un video animado, sus escenas de plantilla y sus subtitulos.
//
// Uso (desde la raiz del proyecto):
//   node animados/herramientas/montaje.mjs animados/videos/<video> [--sin-voz]
//
// Lee   <video>/guion.json y <video>/tiempos.json (lo deja voz.mjs)
// Deja  <video>/index.html                 (fondo, una ranura por escena, subtitulos y audio)
//       <video>/compositions/<escena>.html (solo las escenas que el guion pide por plantilla)
//       <video>/compositions/subtitulos.html
//
// index.html lleva los tiempos de la voz dentro (window.__tiempos), asi que las escenas no
// escriben segundos a mano: preguntan cuando se dice cada cosa con window.__reloj.
// Si cambia la voz, se corre voz.mjs y montaje.mjs otra vez y todo queda sincronizado.
//
// Plantillas: si el guion trae  "escenas": { "<id>": { "plantilla": "<nombre>", "datos": {...} } }
// la escena <id> sale de animados/plantillas/<nombre>.html. Dentro de una plantilla:
//   {{id}}            el id de la escena (prefijo de todos sus ids y clases)
//   {{d.ruta.0.x}}    un dato (los del guion, "datos", mas los de la escena), escapado para HTML
//   {{{d.ruta}}}      el mismo dato sin escapar (para SVG)
//   {{datos}}         todos los datos como JSON, para el script
//   {{>nombre}}       incluye animados/plantillas/_nombre.html
// Todo objeto de los datos con "icono": "<nombre>" recibe "icono_svg" desde iconos.json.
//
// --sin-voz deja el video mudo (mismos tiempos, sin el audio).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const PLANTILLAS = path.resolve(AQUI, "..", "plantillas");

const carpeta = process.argv[2] ? path.resolve(process.argv[2]) : null;
const sinVoz = process.argv.includes("--sin-voz");
if (!carpeta || !fs.existsSync(path.join(carpeta, "tiempos.json"))) {
  console.error("Uso: node animados/herramientas/montaje.mjs <carpeta-del-video> [--sin-voz]  (corre antes voz.mjs)");
  process.exit(1);
}
const guion = JSON.parse(fs.readFileSync(path.join(carpeta, "guion.json"), "utf8"));
const tiempos = JSON.parse(fs.readFileSync(path.join(carpeta, "tiempos.json"), "utf8"));
if (!tiempos.escenas) {
  console.error("tiempos.json no trae escenas: vuelve a correr voz.mjs.");
  process.exit(1);
}

const r2 = (n) => Math.round(n * 100) / 100;
const total = Math.ceil(tiempos.duracion * 100) / 100;
const norma = (s) =>
  String(s)
    .normalize("NFD")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();
const escapa = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// ---------- Escenas de plantilla ----------
const dirEscenas = path.join(carpeta, "compositions");
fs.mkdirSync(dirEscenas, { recursive: true });
const iconos = fs.existsSync(path.join(PLANTILLAS, "iconos.json")) ? JSON.parse(fs.readFileSync(path.join(PLANTILLAS, "iconos.json"), "utf8")) : {};

function conIconos(valor) {
  if (Array.isArray(valor)) return valor.map(conIconos);
  if (valor && typeof valor === "object") {
    const copia = Object.fromEntries(Object.entries(valor).map(([k, v]) => [k, conIconos(v)]));
    if (typeof copia.icono === "string") {
      if (!iconos[copia.icono]) throw new Error(`No existe el icono "${copia.icono}". Los que hay: ${Object.keys(iconos).join(", ")}`);
      copia.icono_svg = iconos[copia.icono];
    }
    return copia;
  }
  return valor;
}

function busca(datos, ruta) {
  return ruta.split(".").reduce((v, clave) => (v === undefined || v === null ? undefined : v[clave]), datos);
}

function expande(nombre, id, datos) {
  const archivo = path.join(PLANTILLAS, nombre + ".html");
  if (!fs.existsSync(archivo)) throw new Error(`No existe la plantilla "${nombre}" (${archivo}).`);
  let texto = fs.readFileSync(archivo, "utf8");
  for (let vuelta = 0; vuelta < 3; vuelta++) {
    texto = texto.replace(/\{\{>([a-z0-9-]+)\}\}/g, (_, parcial) => {
      const ruta = path.join(PLANTILLAS, "_" + parcial + ".html");
      if (!fs.existsSync(ruta)) throw new Error(`La plantilla "${nombre}" incluye "${parcial}", que no existe.`);
      return fs.readFileSync(ruta, "utf8").replace(/\s+$/, "");
    });
  }
  const faltan = new Set();
  const dato = (ruta) => {
    const v = busca(datos, ruta);
    if (v === undefined || v === null) faltan.add(ruta);
    return v ?? "";
  };
  texto = texto
    .replace(/\{\{\{d\.([\w.]+)\}\}\}/g, (_, ruta) => String(dato(ruta)))
    .replace(/\{\{d\.([\w.]+)\}\}/g, (_, ruta) => escapa(dato(ruta)))
    .replace(/\{\{datos\}\}/g, () => JSON.stringify(datos).replace(/</g, "\\u003c"))
    .replace(/\{\{id\}\}/g, id);
  if (faltan.size) throw new Error(`A la escena "${id}" (plantilla "${nombre}") le faltan datos: ${[...faltan].join(", ")}`);
  return `<!-- Generado por montaje.mjs desde animados/plantillas/${nombre}.html. No editar a mano: cambia el guion o la plantilla. -->\n` + texto;
}

const pedidas = guion.escenas || {};
for (const e of tiempos.escenas) {
  const pedida = pedidas[e.id];
  const destino = path.join(dirEscenas, e.id + ".html");
  if (pedida && pedida.plantilla) {
    const datos = conIconos({ ...(guion.datos || {}), ...(pedida.datos || {}) });
    fs.writeFileSync(destino, expande(pedida.plantilla, e.id, datos), "utf8");
  } else if (!fs.existsSync(destino)) {
    console.warn(`Aviso: falta compositions/${e.id}.html y el guion no le da plantilla (la escena "${e.id}" saldra vacia).`);
  }
}

// ---------- index.html ----------
// Lo minimo que las escenas necesitan saber de la voz.
const ultima = tiempos.escenas.at(-1).id;
const datosReloj = {
  escenas: Object.fromEntries(
    tiempos.escenas.map((e) => [
      e.id,
      { inicio: e.inicio, fin: e.id === ultima ? total : e.fin, frases: tiempos.frases.filter((f) => f.escena === e.id).map((f) => f.id) },
    ]),
  ),
  frases: Object.fromEntries(
    tiempos.frases.map((f) => [f.id, { inicio: f.inicio, fin: f.fin, palabras: f.palabras.map((p) => p.inicio), textos: f.palabras.map((p) => norma(p.texto)) }]),
  ),
};

const ranuras = tiempos.escenas
  .map((e) => {
    const fin = datosReloj.escenas[e.id].fin;
    return `      <div
        id="${e.id}"
        data-composition-id="${e.id}"
        data-composition-src="compositions/${e.id}.html"
        data-start="${e.inicio}"
        data-duration="${r2(fin - e.inicio)}"
        data-track-index="1"
        data-track-kind="graphics"
        data-width="1080"
        data-height="1920"
        style="z-index: 1"
      ></div>`;
  })
  .join("\n");

const audio = sinVoz
  ? ""
  : `
      <audio
        id="narracion"
        class="clip"
        data-start="0"
        data-duration="${total}"
        data-track-index="3"
        data-volume="1"
        src="${tiempos.audio}"
      ></audio>`;

const html = `<!doctype html>
<!-- Generado por animados/herramientas/montaje.mjs a partir de tiempos.json. No editar a mano. -->
<html lang="es" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <script>
      // Tiempos de la voz, en segundos del video.
      window.__tiempos = ${JSON.stringify(datosReloj)};

      // Reloj de una escena: devuelve segundos contados desde que la escena empieza.
      // Una frase se nombra por su id ("f2") o por su puesto dentro de la escena (0, 1...).
      //   const r = window.__reloj("problema");
      //   r.p("f2", 3)             cuando se dice la palabra 3 (la primera es 0) de la frase f2
      //   r.palabra(0, "comen")    cuando se dice esa palabra en la primera frase de la escena
      //   r.en(0, 0.5)             la mitad de la primera frase
      //   r.ini(0), r.fin(0)       donde empieza y termina
      //   r.dur                    cuanto dura la escena
      window.__reloj = (escena) => {
        const T = window.__tiempos;
        const e = T.escenas[escena];
        if (!e) throw new Error('La escena "' + escena + '" no esta en el guion.');
        const frase = (ref) => {
          const id = typeof ref === "number" ? e.frases[Math.min(ref, e.frases.length - 1)] : ref;
          const f = T.frases[id];
          if (!f) throw new Error('La frase "' + ref + '" no esta en la escena "' + escena + '".');
          return f;
        };
        const norma = (s) => String(s).normalize("NFD").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
        const en = (ref, parte) => {
          const f = frase(ref);
          return f.inicio + (f.fin - f.inicio) * parte - e.inicio;
        };
        return {
          dur: e.fin - e.inicio,
          p: (ref, i = 0) => {
            const palabras = frase(ref).palabras;
            return palabras[Math.min(i, palabras.length - 1)] - e.inicio;
          },
          ini: (ref = 0) => frase(ref).inicio - e.inicio,
          fin: (ref = 0) => frase(ref).fin - e.inicio,
          en,
          // Si la palabra no esta en la frase, cae en \`respaldo\` (una parte de la frase, de 0 a 1).
          palabra: (ref, texto, respaldo = 0.5) => {
            const f = frase(ref);
            const buscada = norma(texto);
            const i = buscada ? f.textos.findIndex((t) => t === buscada || t.startsWith(buscada)) : -1;
            return i >= 0 ? f.palabras[i] - e.inicio : en(ref, respaldo);
          },
        };
      };

      // Movimientos de la casa. Todos reciben la linea de tiempo de la escena.
      window.__fx = {
        // Entra con rebote. \`desde\` suma un punto de partida: { y: 80 }, { x: -300, rotation: -12 }...
        entra(tl, sel, t, desde = {}, dur = 0.34) {
          const hasta = { opacity: 1, scale: 1, duration: dur, ease: "back.out(2)" };
          for (const k of ["x", "y", "rotation"]) if (k in desde) hasta[k] = 0;
          return tl.fromTo(sel, { opacity: 0, scale: 0.3, ...desde }, hasta, t);
        },
        // Sale encogiendose. \`hacia\` suma un destino: { y: 200 }.
        sale(tl, sel, t, hacia = {}, dur = 0.22) {
          return tl.to(sel, { opacity: 0, scale: 0.6, duration: dur, ease: "power2.in", ...hacia }, t);
        },
        // Vaiven suave entre t y fin; siempre vuelve al punto de partida. Usa un elemento
        // que no tenga otro movimiento en y (un envoltorio interior).
        flota(tl, sel, t, fin, amp = 8, periodo = 1.1) {
          const idas = 2 * Math.max(1, Math.floor((fin - t) / (2 * periodo)));
          return tl.fromTo(sel, { y: 0 }, { y: -amp, duration: periodo, ease: "sine.inOut", repeat: idas - 1, yoyo: true }, t);
        },
        // Salto de enfasis sobre algo que ya esta en pantalla.
        golpe(tl, sel, t, escala = 1.14) {
          tl.to(sel, { scale: escala, duration: 0.1, ease: "power2.out" }, t);
          return tl.to(sel, { scale: 1, duration: 0.26, ease: "back.out(3)" }, t + 0.1);
        },
        // Temblor corto. Usa un elemento que no tenga otro movimiento en x.
        tiembla(tl, sel, t, veces = 5, amp = 9) {
          return tl.fromTo(sel, { x: 0 }, { x: amp, duration: 0.05, repeat: veces * 2 - 1, yoyo: true, ease: "sine.inOut" }, t);
        },
      };
    </script>
    <style>
      :root {
        --fondo: #0d2029;
        --tinta: #fbf7ef;
        --acento: #ffc93c;
      }
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      html,
      body {
        margin: 0;
        width: 1080px;
        height: 1920px;
        overflow: hidden;
        background: var(--fondo);
      }
      #root {
        position: relative;
        width: 1080px;
        height: 1920px;
        overflow: hidden;
        font-family: "Nunito", sans-serif;
        color: var(--tinta);
      }
      #fondo {
        position: absolute;
        inset: 0;
        background:
          radial-gradient(ellipse 70% 42% at 50% 40%, #1f4a58 0%, rgba(31, 74, 88, 0) 100%),
          radial-gradient(ellipse 90% 30% at 50% 100%, #07141a 0%, rgba(7, 20, 26, 0) 100%),
          #0d2029;
      }
    </style>
  </head>
  <body>
    <div
      id="root"
      data-composition-id="main"
      data-start="0"
      data-duration="${total}"
      data-width="1080"
      data-height="1920"
    >
      <div id="fondo"></div>

${ranuras}

      <div
        id="subtitulos"
        data-composition-id="subtitulos"
        data-composition-src="compositions/subtitulos.html"
        data-start="0"
        data-duration="${total}"
        data-track-index="2"
        data-track-kind="captions"
        data-width="1080"
        data-height="1920"
        style="z-index: 5"
      ></div>
${audio}
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      const tl = gsap.timeline({ paused: true });
      window.__timelines["main"] = tl;
      tl.seek(0);
    </script>
  </body>
</html>
`;

fs.writeFileSync(path.join(carpeta, "index.html"), html, "utf8");
const dePlantilla = tiempos.escenas.filter((e) => pedidas[e.id] && pedidas[e.id].plantilla).length;
console.log(`Listo: index.html (${tiempos.escenas.length} escenas, ${dePlantilla} de plantilla, ${total} s${sinVoz ? ", sin voz" : ""})`);
tiempos.escenas.forEach((e) =>
  console.log(`  ${String(e.inicio).padStart(6)} - ${String(datosReloj.escenas[e.id].fin).padEnd(6)} ${e.id}${pedidas[e.id]?.plantilla ? "  <- " + pedidas[e.id].plantilla : ""}`),
);

// Los subtitulos salen del mismo tiempos.json.
await import("./subtitulos.mjs");
