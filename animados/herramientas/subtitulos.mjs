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
//
// Con "estilo": { "tema": ... } (videos propios) los colores y la letra salen de las variables
// del tema que pone montaje.mjs en index.html (--sub-tinta, --sub-clave, --sub-fondo...) y cada
// grupo va sobre una pildora que contrasta con el fondo. Sin tema, todo queda como siempre.

import fs from "node:fs";
import path from "node:path";

const carpeta = process.argv[2] ? path.resolve(process.argv[2]) : null;
if (!carpeta || !fs.existsSync(path.join(carpeta, "tiempos.json"))) {
  console.error("Uso: node animados/herramientas/subtitulos.mjs <carpeta-del-video>  (corre antes voz.mjs)");
  process.exit(1);
}
const guion = JSON.parse(fs.readFileSync(path.join(carpeta, "guion.json"), "utf8"));
const tiempos = JSON.parse(fs.readFileSync(path.join(carpeta, "tiempos.json"), "utf8"));
const conTema = Boolean(guion.estilo && guion.estilo.tema);
// Horizontal ("orientacion": "horizontal"): grupos de hasta 4 palabras, mas chicos y abajo, para no
// tapar el diseno. "subtitulos": false en el guion los quita todos.
const HORIZONTAL = guion.orientacion === "horizontal";
const W = HORIZONTAL ? 1920 : 1080;
const H = HORIZONTAL ? 1080 : 1920;

const MAX_PALABRAS = HORIZONTAL ? 4 : 3;
const MAX_LETRAS = HORIZONTAL ? 28 : 17;
const ANCHO = HORIZONTAL ? 1400 : 860; // dentro del 80 % seguro para texto del cuadro
const TAM_BASE = HORIZONTAL ? 50 : 84;
const TAM_MIN = HORIZONTAL ? 40 : 58;
const r2 = (n) => Math.round(n * 100) / 100;
const html = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const limpia = (s) => s.toLowerCase().replace(/[.,;:]/g, "");

// 1. Grupos.
const grupos = [];
for (const frase of tiempos.frases) {
  const delGuion = guion.frases.find((f) => f.id === frase.id) || {};
  if (delGuion.subtitulos === false || guion.subtitulos === false) continue;
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
  // Con tema la letra es mas ancha (serif o grotesca) y va sobre pildora: se calcula con mas holgura.
  const tam = Math.max(TAM_MIN, Math.min(TAM_BASE, Math.floor(ANCHO / (texto.length * (conTema ? 0.62 : 0.56)) / 2) * 2));
  const palabras = g
    .map((p) => `<span id="sub-${p.id}" class="sub-palabra${p.clave ? " sub-clave" : ""}">${html(p.texto)}</span>`)
    .join(" ");
  const v = ventanas[i];
  const abre = `<div id="sub-g${i}" class="clip sub-grupo" data-start="${v.inicio}" data-duration="${r2(v.fin - v.inicio)}" data-track-index="0">`;
  // Con tema (videos propios, de 45 a 60 s) cada grupo va en una linea para que el archivo no crezca de mas.
  if (conTema) return `    ${abre}<div class="sub-linea" style="font-size: ${tam}px"><span class="sub-pildora">${palabras}</span></div></div>`;
  return `    ${abre}
      <div class="sub-linea" style="font-size: ${tam}px">${palabras}</div>
    </div>`;
});

// Aspecto con tema: misma franja (1150 a 1280 px), colores y letra del tema, sobre una pildora.
const estiloTema = `
    #root {
      position: absolute;
      inset: 0;
      font-family: var(--fuente-sub);
      color: var(--sub-tinta);
    }
    .sub-grupo {
      position: absolute;
      inset: 0;
    }
    .sub-linea {
      position: absolute;
      left: ${HORIZONTAL ? 160 : 60}px;
      width: ${HORIZONTAL ? 1600 : 960}px;
      top: ${HORIZONTAL ? 952 : 1150}px;
      height: ${HORIZONTAL ? 88 : 130}px;
      line-height: ${HORIZONTAL ? 88 : 130}px;
      text-align: center;
      white-space: nowrap;
      overflow: visible;
      font-weight: var(--peso-sub);
      letter-spacing: -0.01em;
    }
    .sub-pildora {
      display: inline-block;
      vertical-align: middle;
      line-height: 1.3;
      padding: 0.04em 0.42em 0.1em;
      border-radius: 0.36em;
      background: var(--sub-fondo);
      border: var(--sub-borde);
      box-shadow: var(--sub-caja);
      text-shadow: var(--sub-sombra);
    }
    .sub-palabra {
      display: inline-block;
    }
    .sub-clave {
      color: var(--sub-clave);
    }`;
const estiloClasico = `
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
      left: ${HORIZONTAL ? 160 : 90}px;
      width: ${HORIZONTAL ? 1600 : 900}px;
      top: ${HORIZONTAL ? 952 : 1150}px;
      height: ${HORIZONTAL ? 88 : 130}px;
      line-height: ${HORIZONTAL ? 88 : 130}px;
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
    }`;

const golpes = grupos
  .flatMap((g, i) => g.map((p) => `      ["#sub-${p.id}", ${r2(Math.max(p.inicio - 0.03, ventanas[i].inicio))}],`))
  .join("\n");

const salida = `<!-- Generado por animados/herramientas/subtitulos.mjs a partir de tiempos.json. No editar a mano: cambia el guion y vuelve a generarlo. -->
<template>
  <style>${conTema ? estiloTema : estiloClasico}
  </style>

  <div id="root" data-composition-id="subtitulos" data-width="${W}" data-height="${H}">
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
