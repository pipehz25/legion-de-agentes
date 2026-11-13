// montaje.mjs - Arma el index.html de un video animado y sus subtitulos.
//
// Uso (desde la raiz del proyecto):
//   node animados/herramientas/montaje.mjs animados/videos/<video> [--sin-voz]
//
// Lee   <video>/tiempos.json (lo deja voz.mjs)
// Deja  <video>/index.html                 (fondo, una ranura por escena, subtitulos y audio)
//       <video>/compositions/subtitulos.html
//
// index.html lleva los tiempos de la voz dentro (window.__tiempos), asi que las escenas no
// escriben segundos a mano: preguntan cuando se dice cada palabra con window.__reloj.
// Si cambia la voz, se corre voz.mjs y montaje.mjs otra vez y todo queda sincronizado.
//
// --sin-voz deja el video mudo (mismos tiempos, sin el audio).

import fs from "node:fs";
import path from "node:path";

const carpeta = process.argv[2] ? path.resolve(process.argv[2]) : null;
const sinVoz = process.argv.includes("--sin-voz");
if (!carpeta || !fs.existsSync(path.join(carpeta, "tiempos.json"))) {
  console.error("Uso: node animados/herramientas/montaje.mjs <carpeta-del-video> [--sin-voz]  (corre antes voz.mjs)");
  process.exit(1);
}
const tiempos = JSON.parse(fs.readFileSync(path.join(carpeta, "tiempos.json"), "utf8"));
if (!tiempos.escenas) {
  console.error("tiempos.json no trae escenas: vuelve a correr voz.mjs.");
  process.exit(1);
}

const r2 = (n) => Math.round(n * 100) / 100;
const total = Math.ceil(tiempos.duracion * 100) / 100;

for (const e of tiempos.escenas) {
  if (!fs.existsSync(path.join(carpeta, "compositions", e.id + ".html"))) {
    console.warn(`Aviso: falta compositions/${e.id}.html (la escena "${e.id}" saldra vacia).`);
  }
}

// Lo minimo que las escenas necesitan saber de la voz.
const datos = {
  escenas: Object.fromEntries(tiempos.escenas.map((e) => [e.id, { inicio: e.inicio, fin: e.id === tiempos.escenas.at(-1).id ? total : e.fin }])),
  frases: Object.fromEntries(tiempos.frases.map((f) => [f.id, { inicio: f.inicio, fin: f.fin, palabras: f.palabras.map((p) => p.inicio) }])),
};

const ranuras = tiempos.escenas
  .map((e) => {
    const fin = datos.escenas[e.id].fin;
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
      window.__tiempos = ${JSON.stringify(datos)};

      // Reloj de una escena: devuelve segundos contados desde que la escena empieza.
      //   const r = window.__reloj("corte");
      //   r.p("f2", 3)  cuando se dice la palabra 3 (la primera es 0) de la frase f2
      //   r.fin("f2")   cuando termina la frase f2
      //   r.dur         cuanto dura la escena
      window.__reloj = (escena) => {
        const e = window.__tiempos.escenas[escena];
        if (!e) throw new Error('La escena "' + escena + '" no esta en el guion.');
        const frase = (id) => {
          const f = window.__tiempos.frases[id];
          if (!f) throw new Error('La frase "' + id + '" no esta en el guion.');
          return f;
        };
        return {
          dur: e.fin - e.inicio,
          p: (id, i = 0) => {
            const palabras = frase(id).palabras;
            return palabras[Math.min(i, palabras.length - 1)] - e.inicio;
          },
          fin: (id) => frase(id).fin - e.inicio,
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
console.log(`Listo: index.html (${tiempos.escenas.length} escenas, ${total} s${sinVoz ? ", sin voz" : ""})`);
tiempos.escenas.forEach((e) => console.log(`  ${String(e.inicio).padStart(6)} - ${String(datos.escenas[e.id].fin).padEnd(6)} ${e.id}`));

// Los subtitulos salen del mismo tiempos.json.
await import("./subtitulos.mjs");
