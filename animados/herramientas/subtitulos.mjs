// subtitulos.mjs - Escribe la escena de subtitulos de un video animado.
//
// Uso (desde la raiz del proyecto):
//   node animados/herramientas/subtitulos.mjs animados/videos/<video>
//
// Lee   <video>/guion.json y <video>/tiempos.json (lo deja voz.mjs)
// Deja  <video>/compositions/subtitulos.html
//
// Reglas (animados/GUIA.md, "Subtitulos"): grupos de 2 a 3 palabras, uno a la vez, en la
// franja baja de la zona segura; cada palabra se enciende cuando la voz la dice y las
// palabras clave del guion van en el color de acento.

import fs from "node:fs";
import path from "node:path";

const carpeta = process.argv[2] ? path.resolve(process.argv[2]) : null;
if (!carpeta || !fs.existsSync(path.join(carpeta, "tiempos.json"))) {
  console.error("Uso: node animados/herramientas/subtitulos.mjs <carpeta-del-video>  (corre antes voz.mjs)");
  process.exit(1);
}
const guion = JSON.parse(fs.readFileSync(path.join(carpeta, "guion.json"), "utf8"));
const tiempos = JSON.parse(fs.readFileSync(path.join(carpeta, "tiempos.json"), "utf8"));

const MAX_PALABRAS = 3;
const MAX_LETRAS = 17;
const ANCHO = 860; // dentro del 80 % seguro para texto de un cuadro de 1080
const TAM_BASE = 84;
const TAM_MIN = 58;
const r2 = (n) => Math.round(n * 100) / 100;
const html = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const limpia = (s) => s.toLowerCase().replace(/[.,;:]/g, "");

// 1. Grupos.
const grupos = [];
for (const frase of tiempos.frases) {
  const delGuion = guion.frases.find((f) => f.id === frase.id) || {};
  if (delGuion.subtitulos === false) continue;
  const claves = new Set((delGuion.clave || []).map(limpia));
  let actual = [];
  const cerrar = () => {
    if (actual.length) grupos.push(actual);
    actual = [];
  };
  frase.palabras.forEach((p, i) => {
    const letras = actual.reduce((s, x) => s + x.texto.length + 1, 0) + p.texto.length;
    if (actual.length >= MAX_PALABRAS || (actual.length && letras > MAX_LETRAS)) cerrar();
    actual.push({ ...p, clave: claves.has(limpia(p.texto)) });
    const siguiente = frase.palabras[i + 1];
    const pausa = siguiente ? siguiente.inicio - p.fin : 1;
    if (/[.,;:!?]$/.test(p.texto) || pausa >= 0.15) cerrar();
  });
  cerrar();
}

// 2. Ventana de cada grupo: abre un poco antes de su primera palabra y nunca pisa al siguiente.
const ventanas = grupos.map((g, i) => {
  const previo = i > 0 ? grupos[i - 1][grupos[i - 1].length - 1].fin : 0;
  const inicio = Math.max(g[0].inicio - 0.08, previo + 0.02, 0.1);
  const proximo = i < grupos.length - 1 ? grupos[i + 1][0].inicio - 0.1 : tiempos.duracion - 0.05;
  const fin = Math.max(Math.min(g[g.length - 1].fin + 0.3, proximo), g[g.length - 1].fin);
  return { inicio: r2(inicio), fin: r2(fin) };
});
for (let i = 0; i < ventanas.length - 1; i++) {
  if (ventanas[i].fin > ventanas[i + 1].inicio - 0.02) ventanas[i].fin = r2(ventanas[i + 1].inicio - 0.02);
}

// 3. HTML.
const bloques = grupos.map((g, i) => {
  const texto = g.map((p) => p.texto).join(" ");
  const tam = Math.max(TAM_MIN, Math.min(TAM_BASE, Math.floor(ANCHO / (texto.length * 0.56) / 2) * 2));
  const palabras = g
    .map((p) => `<span id="sub-${p.id}" class="sub-palabra${p.clave ? " sub-clave" : ""}">${html(p.texto)}</span>`)
    .join(" ");
  const v = ventanas[i];
  return `    <div id="sub-g${i}" class="clip sub-grupo" data-start="${v.inicio}" data-duration="${r2(v.fin - v.inicio)}" data-track-index="0">
      <div class="sub-linea" style="font-size: ${tam}px">${palabras}</div>
    </div>`;
});

const golpes = grupos
  .flatMap((g, i) => g.map((p) => `      ["#sub-${p.id}", ${r2(Math.max(p.inicio - 0.03, ventanas[i].inicio))}],`))
  .join("\n");

const salida = `<!-- Generado por animados/herramientas/subtitulos.mjs a partir de tiempos.json. No editar a mano: cambia el guion y vuelve a generarlo. -->
<template>
  <style>
    #root {
      position: absolute;
      inset: 0;
      font-family: "Nunito", sans-serif;
      color: #fbf7ef;
    }
    .sub-grupo {
      position: absolute;
      inset: 0;
    }
    .sub-linea {
      position: absolute;
      left: 90px;
      width: 900px;
      top: 1150px;
      height: 130px;
      line-height: 130px;
      text-align: center;
      white-space: nowrap;
      overflow: visible;
      font-weight: 900;
      letter-spacing: -0.01em;
      text-shadow:
        0 5px 0 rgba(0, 0, 0, 0.35),
        0 12px 34px rgba(0, 0, 0, 0.55);
    }
    .sub-palabra {
      display: inline-block;
    }
    .sub-clave {
      color: #ffc93c;
    }
  </style>

  <div id="root" data-composition-id="subtitulos" data-width="1080" data-height="1920">
${bloques.join("\n")}
  </div>

  <script>
    const tl = gsap.timeline({ paused: true });
    // Cada palabra se enciende cuando la voz la dice.
    [
${golpes}
    ].forEach(([palabra, t]) => {
      tl.fromTo(palabra, { opacity: 0.3, y: 8, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.12, ease: "back.out(2.4)" }, t);
    });
    window.__timelines["subtitulos"] = tl;
  </script>
</template>
`;

fs.mkdirSync(path.join(carpeta, "compositions"), { recursive: true });
fs.writeFileSync(path.join(carpeta, "compositions", "subtitulos.html"), salida, "utf8");
console.log(`Listo: ${grupos.length} grupos de subtitulos`);
grupos.forEach((g, i) => console.log(`  ${String(ventanas[i].inicio).padStart(6)} - ${String(ventanas[i].fin).padEnd(6)} ${g.map((p) => (p.clave ? p.texto.toUpperCase() : p.texto)).join(" ")}`));
