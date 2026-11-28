// temas.mjs - Temas visuales de los videos propios (Narrador): archivo, laboratorio, pizarra, cosmos, expedicion y mercado.
//
// Los usan montaje.mjs (Shorts verticales) y largo.mjs (videos largos de YouTube: tarjetas de
// titulo y de capitulo y miniatura). Cada tema define variables CSS que usan las plantillas del
// Narrador y los subtitulos, el fondo (textura estatica, sin nada aleatorio) y la letra. `anchos`
// es el ancho medio de una letra en em: las plantillas lo usan para escoger el tamano de letra
// segun el largo del texto. fondoCss(p) recibe la paleta { fondo, brillo, brilloFin }.

// Motas y fibras de papel para el tema archivo: siempre las mismas (salen de una formula fija).
export function texturaPapel() {
  const h = (i) => {
    const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
    return x - Math.floor(x);
  };
  const L = 280;
  const partes = [];
  for (let i = 0; i < 70; i++) {
    const x = (h(i) * L).toFixed(1);
    const y = (h(i + 500) * L).toFixed(1);
    const rr = (0.5 + h(i + 900) * 1.5).toFixed(2);
    const op = (0.05 + h(i + 1300) * 0.11).toFixed(3);
    partes.push(`<circle cx='${x}' cy='${y}' r='${rr}' fill='%235a3a1c' fill-opacity='${op}'/>`);
  }
  for (let i = 0; i < 16; i++) {
    const x = h(i + 2000) * L;
    const y = h(i + 2500) * L;
    const a = h(i + 3000) * Math.PI;
    const largo = 10 + h(i + 3500) * 22;
    const x2 = x + Math.cos(a) * largo;
    const y2 = y + Math.sin(a) * largo;
    const cx = (x + x2) / 2 + Math.sin(a) * 5;
    const cy = (y + y2) / 2 - Math.cos(a) * 5;
    const op = (0.06 + h(i + 4000) * 0.08).toFixed(3);
    partes.push(`<path d='M${x.toFixed(1)} ${y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}' stroke='%237a5530' stroke-opacity='${op}' stroke-width='1.1' fill='none'/>`);
  }
  return `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='${L}' height='${L}'>${partes.join("")}</svg>")`;
}

// Cielo de estrellas para el tema cosmos: siempre las mismas (formula fija, como texturaPapel).
// Una baldosa grande (para que no se note la repeticion) con estrellas chicas de brillo variable y
// unas pocas mas grandes con halo.
export function texturaEstrellas() {
  const h = (i) => {
    const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
    return x - Math.floor(x);
  };
  const L = 640;
  const partes = [];
  for (let i = 0; i < 150; i++) {
    const x = (h(i + 7000) * L).toFixed(1);
    const y = (h(i + 7500) * L).toFixed(1);
    const rr = (0.5 + h(i + 8000) * 1.1).toFixed(2);
    const op = (0.18 + h(i + 8500) * 0.5).toFixed(3);
    const c = h(i + 9000) < 0.22 ? "%23ffd9a8" : h(i + 9000) < 0.5 ? "%23bfe4ff" : "%23ffffff";
    partes.push(`<circle cx='${x}' cy='${y}' r='${rr}' fill='${c}' fill-opacity='${op}'/>`);
  }
  for (let i = 0; i < 9; i++) {
    const x = (h(i + 9500) * L).toFixed(1);
    const y = (h(i + 9800) * L).toFixed(1);
    partes.push(`<circle cx='${x}' cy='${y}' r='5' fill='%2399d9ff' fill-opacity='0.08'/><circle cx='${x}' cy='${y}' r='1.9' fill='%23ffffff' fill-opacity='0.85'/>`);
  }
  return `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='${L}' height='${L}'>${partes.join("")}</svg>")`;
}

// Curvas de nivel de un mapa topografico para el tema expedicion: siempre las mismas (formula fija).
// Un solo lienzo de 1920x1920 (no se repite: asi las curvas no se cortan en los bordes), con cerros
// de anillos irregulares, una curva maestra mas gruesa cada cinco y una reticula de mapa muy suave.
export function texturaTopografica() {
  const h = (i) => {
    const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
    return x - Math.floor(x);
  };
  const L = 1920;
  const partes = [];
  for (let k = 1; k < 8; k++) partes.push(`<path d='M${k * 240} 0 V${L} M0 ${k * 240} H${L}' stroke='%23e8dcae' stroke-opacity='0.035' stroke-width='2' fill='none'/>`);
  const cerros = [
    [330, 300, 9],
    [1500, 420, 11],
    [980, 1150, 12],
    [250, 1520, 8],
    [1700, 1650, 9],
  ];
  cerros.forEach(([cx, cy, n], c) => {
    const f1 = h(c + 100) * 6.28;
    const f2 = h(c + 200) * 6.28;
    const f3 = h(c + 300) * 6.28;
    for (let k = 1; k <= n; k++) {
      const r = k * 44 + h(c * 50 + k) * 10;
      let d = "";
      for (let j = 0; j <= 72; j++) {
        const a = (j / 72) * Math.PI * 2;
        const rr = r * (1 + 0.16 * Math.sin(2 * a + f1) + 0.09 * Math.sin(3 * a + f2 + k * 0.12) + 0.05 * Math.sin(5 * a + f3));
        d += (j ? "L" : "M") + (cx + rr * Math.cos(a)).toFixed(1) + " " + (cy + rr * 0.82 * Math.sin(a)).toFixed(1);
      }
      const maestra = k % 5 === 0;
      partes.push(`<path d='${d}Z' fill='none' stroke='%23e8dcae' stroke-opacity='${maestra ? 0.13 : 0.075}' stroke-width='${maestra ? 3 : 1.6}'/>`);
    }
  });
  return `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='${L}' height='${L}'>${partes.join("")}</svg>") center / cover no-repeat`;
}

// Papel de grafico financiero para el tema mercado: cuadricula fina y unas lineas de cotizacion
// tenues, siempre las mismas (paseo con una formula fija, sin azar). Lienzo de 1920x1080 sin repetir.
export function texturaMercado() {
  const h = (i) => {
    const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
    return x - Math.floor(x);
  };
  const W = 1920;
  const H = 1080;
  const partes = [];
  for (let x = 40; x < W; x += 40) partes.push(`<path d='M${x} 0 V${H}' stroke='%238cb4be' stroke-opacity='${x % 200 === 0 ? 0.075 : 0.035}' stroke-width='1'/>`);
  for (let y = 40; y < H; y += 40) partes.push(`<path d='M0 ${y} H${W}' stroke='%238cb4be' stroke-opacity='${y % 200 === 0 ? 0.075 : 0.035}' stroke-width='1'/>`);
  const series = [
    { y0: 760, deriva: -0.32, paso: 16, color: "%23e3b341", op: 0.16, semilla: 11000, area: true },
    { y0: 430, deriva: 0.12, paso: 24, color: "%2322c55e", op: 0.1, semilla: 12000 },
    { y0: 900, deriva: -0.05, paso: 20, color: "%23ef4444", op: 0.08, semilla: 13000 },
  ];
  for (const sr of series) {
    let y = sr.y0;
    let d = "";
    for (let x = 0, k = 0; x <= W; x += sr.paso, k++) {
      y += (h(sr.semilla + k) - 0.5) * 34 + sr.deriva * sr.paso * 0.5;
      y = Math.max(120, Math.min(H - 60, y));
      d += (k ? "L" : "M") + x + " " + y.toFixed(1);
    }
    if (sr.area) partes.push(`<path d='${d} L${W} ${H} L0 ${H} Z' fill='${sr.color}' fill-opacity='0.035'/>`);
    partes.push(`<path d='${d}' fill='none' stroke='${sr.color}' stroke-opacity='${sr.op}' stroke-width='2.2' stroke-linejoin='round'/>`);
  }
  return `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='${W}' height='${H}'>${partes.join("")}</svg>") center / cover no-repeat`;
}

// Variables de las plantillas horizontales (videos largos): hojas, cintas, mapa, cadena, mesa...
// Son los colores de papel que esas plantillas tenian escritos fijos. Los temas claros (archivo,
// laboratorio y pizarra) se quedan con estos valores, asi que se ven exactamente como antes; cosmos
// los cambia. Los "-rgb" son tres numeros para usar con transparencia: rgba(var(--sombra-rgb), 0.3).
const HORIZONTAL_PAPEL = {
  "--hoja": "#fbf3df",
  "--hoja-fin": "#efe0bd",
  "--hoja-alta": "#fbf4e2",
  "--hoja-baja": "#f3e6c4",
  "--hoja-baja2": "#f1e3c0",
  "--hoja-media": "#f6ebd0",
  "--hoja-tablero": "#f7efda",
  "--hoja-foto": "#e8dcc0",
  "--hoja-tinta": "#fbf3df",
  "--cinta": "rgba(225, 205, 150, 0.82)",
  "--sombra-rgb": "70, 40, 15",
  "--borde-rgb": "59, 36, 21",
  "--mancha-rgb": "150, 100, 40",
  "--hoja-rgb": "251, 244, 226",
  "--halo": "#f6ecd0",
  "--halo-rgb": "246, 236, 208",
  "--icono-papel": "#fbf3df",
  "--trazo": "#3b2415",
  "--trazo-suave": "#6f4e35",
  "--varilla": "#6f5a43",
  "--varilla-luz": "#d8c7a4",
  "--perilla": "#c9a256",
  "--roseta": "#9a7128",
  "--mar": "#d9d9c0",
  "--mar-fin": "#c9ccb0",
  "--mar-raya-rgb": "58, 74, 60",
  "--tierra": "#f4e7c5",
  "--mar-chico": "#cfd2b8",
  "--sombra2-rgb": "80, 50, 20",
  "--costa": "#3b2415",
  "--mar-halo": "#e6e5cf",
  "--txt-mar": "#3a5244",
  "--txt-mar2": "#4f6a5c",
  "--txt-rio": "#2f5a68",
  "--lago": "#cdd2b6",
  "--canal-agua": "#a3c0c1",
  "--rio": "#5f8a98",
  "--luz-ventana": "#f2d48a",
  "--cabina": "#efe6cf",
  "--acero-1": "#8b7863",
  "--acero-2": "#4a3a2c",
  "--acero-3": "#2c2219",
  "--acero-brillo": "#b6a184",
  "--hilo": "#b0302a",
  "--pin": "#a3302a",
  "--pin-luz": "#f2b6a8",
  "--mesa": "#8a5a33",
  "--mesa-luz": "#a8734a",
  "--mesa-frente": "#6e4426",
  "--mesa-oscura": "#5a361d",
  "--firma": "#1f2a5a",
  "--figura-filtro": "none",
  "--pais-k": "1",
  "--paisaje-filtro": "none",
  "--vehiculo-filtro": "none",
  "--mapa-textura": "none",
};

export const TEMAS = {
  // Historia: papel envejecido, tinta sepia, acento rojo lacre, titulos en serif.
  archivo: {
    fondo: "#eadbb8",
    brillo: "#fbf3df",
    google: "",
    anchos: { anchoTitulo: 0.56, anchoTexto: 0.5, anchoCifra: 0.6 },
    vars: {
      "--tinta": "#3b2415",
      "--tinta-suave": "#6f4e35",
      "--acento": "#a3302a",
      "--acento2": "#9a7128",
      "--alerta": "#b0402a",
      "--bien": "#3f6a4a",
      "--sobre-acento": "#fbf3df",
      "--tarjeta": "#f6ebd0",
      "--borde-tarjeta": "3px solid rgba(59, 36, 21, 0.32)",
      "--sombra": "0 10px 26px rgba(80, 50, 20, 0.18)",
      "--radio": "12px",
      "--linea": "#3b2415",
      "--riel": "rgba(59, 36, 21, 0.22)",
      "--resplandor": "none",
      "--resplandor-tinta": "none",
      "--il-filtro": "sepia(0.28) saturate(0.86) drop-shadow(0 12px 14px rgba(70, 40, 15, 0.22))",
      "--marco": "#9a7128",
      "--marco-sombra": "0 0 0 6px #f6ebd0, 0 0 0 10px #3b2415, 0 16px 34px rgba(80, 50, 20, 0.3)",
      "--ins-fondo": "transparent",
      "--ins-tinta": "#a3302a",
      "--ins-borde": "3px solid #a3302a",
      "--ins-sombra": "none",
      "--lupa-aro": "#9a7128",
      "--lupa-mango": "#4a2e1a",
      "--fuente-titulo": '"Playfair Display", serif',
      "--peso-titulo": "900",
      "--espaciado-titulo": "-0.01em",
      "--fuente-texto": '"EB Garamond", serif',
      "--peso-texto": "700",
      "--fuente-cifra": '"Playfair Display", serif',
      "--fuente-sub": '"Playfair Display", serif',
      "--peso-sub": "900",
      "--sub-tinta": "#2e1a0e",
      "--sub-clave": "#a3302a",
      "--sub-fondo": "rgba(250, 242, 222, 0.94)",
      "--sub-borde": "3px solid rgba(59, 36, 21, 0.28)",
      "--sub-caja": "0 8px 22px rgba(80, 50, 20, 0.18)",
      "--sub-sombra": "none",
      ...HORIZONTAL_PAPEL,
    },
    fondoCss: (p) => `
          radial-gradient(ellipse 125% 90% at 50% 45%, rgba(92, 58, 24, 0) 52%, rgba(92, 58, 24, 0.46) 100%),
          ${texturaPapel()},
          radial-gradient(circle at 16% 20%, rgba(150, 100, 40, 0.13) 0, rgba(150, 100, 40, 0) 16%),
          radial-gradient(circle at 86% 64%, rgba(150, 100, 40, 0.1) 0, rgba(150, 100, 40, 0) 20%),
          radial-gradient(circle at 30% 88%, rgba(150, 100, 40, 0.1) 0, rgba(150, 100, 40, 0) 14%),
          radial-gradient(ellipse 72% 44% at 50% 40%, ${p.brillo} 0%, ${p.brilloFin} 100%),
          ${p.fondo}`,
  },
  // Medicina y ciencia: blanco azulado con cuadricula de cuaderno, tinta azul petroleo.
  laboratorio: {
    fondo: "#eaf3f7",
    brillo: "#ffffff",
    google: "",
    anchos: { anchoTitulo: 0.6, anchoTexto: 0.55, anchoCifra: 0.64 },
    vars: {
      "--tinta": "#0e3a48",
      "--tinta-suave": "#46707e",
      "--acento": "#0a9792",
      "--acento2": "#2f7fd1",
      "--alerta": "#e9584b",
      "--bien": "#0a9792",
      "--sobre-acento": "#ffffff",
      "--tarjeta": "#ffffff",
      "--borde-tarjeta": "2px solid rgba(14, 58, 72, 0.12)",
      "--sombra": "0 14px 32px rgba(14, 58, 72, 0.13)",
      "--radio": "30px",
      "--linea": "#0e3a48",
      "--riel": "rgba(14, 58, 72, 0.16)",
      "--resplandor": "none",
      "--resplandor-tinta": "none",
      "--il-filtro": "drop-shadow(0 14px 18px rgba(14, 58, 72, 0.18))",
      "--marco": "#0a9792",
      "--marco-sombra": "0 0 0 8px #ffffff, 0 18px 40px rgba(14, 58, 72, 0.2)",
      "--ins-fondo": "#0a9792",
      "--ins-tinta": "#ffffff",
      "--ins-borde": "0 solid transparent",
      "--ins-sombra": "0 8px 20px rgba(10, 151, 146, 0.28)",
      "--lupa-aro": "#7fa3b3",
      "--lupa-mango": "#0e3a48",
      "--fuente-titulo": '"Inter", sans-serif',
      "--peso-titulo": "900",
      "--espaciado-titulo": "-0.035em",
      "--fuente-texto": '"Inter", sans-serif',
      "--peso-texto": "700",
      "--fuente-cifra": '"Inter", sans-serif',
      "--fuente-sub": '"Inter", sans-serif',
      "--peso-sub": "900",
      "--sub-tinta": "#0e3a48",
      "--sub-clave": "#07827d",
      "--sub-fondo": "rgba(255, 255, 255, 0.96)",
      "--sub-borde": "2px solid rgba(14, 58, 72, 0.1)",
      "--sub-caja": "0 10px 26px rgba(14, 58, 72, 0.16)",
      "--sub-sombra": "none",
      ...HORIZONTAL_PAPEL,
    },
    fondoCss: (p) => `
          radial-gradient(ellipse 125% 90% at 50% 45%, rgba(14, 58, 72, 0) 58%, rgba(14, 58, 72, 0.12) 100%),
          linear-gradient(90deg, rgba(14, 58, 72, 0) 70px, rgba(233, 88, 75, 0.32) 70px, rgba(233, 88, 75, 0.32) 73px, rgba(14, 58, 72, 0) 73px),
          linear-gradient(rgba(31, 111, 140, 0.15) 2px, rgba(31, 111, 140, 0) 2px) 0 0 / 180px 180px,
          linear-gradient(90deg, rgba(31, 111, 140, 0.15) 2px, rgba(31, 111, 140, 0) 2px) 0 0 / 180px 180px,
          linear-gradient(rgba(31, 111, 140, 0.075) 1px, rgba(31, 111, 140, 0) 1px) 0 0 / 36px 36px,
          linear-gradient(90deg, rgba(31, 111, 140, 0.075) 1px, rgba(31, 111, 140, 0) 1px) 0 0 / 36px 36px,
          radial-gradient(ellipse 72% 44% at 50% 40%, ${p.brillo} 0%, ${p.brilloFin} 100%),
          ${p.fondo}`,
  },
  // Dinero, datos y curiosidades: pizarra oscura, trazos y cifras en neon.
  pizarra: {
    fondo: "#090d16",
    brillo: "#17263f",
    google: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap",
    anchos: { anchoTitulo: 0.58, anchoTexto: 0.55, anchoCifra: 0.62 },
    vars: {
      "--tinta": "#eef6ff",
      "--tinta-suave": "#9db1c9",
      "--acento": "#3ff0ff",
      "--acento2": "#ff4fd8",
      "--alerta": "#ff5c8a",
      "--bien": "#b8ff3c",
      "--sobre-acento": "#04121a",
      "--tarjeta": "rgba(16, 26, 44, 0.82)",
      "--borde-tarjeta": "3px solid rgba(63, 240, 255, 0.55)",
      "--sombra": "0 0 26px rgba(63, 240, 255, 0.16), inset 0 0 22px rgba(63, 240, 255, 0.06)",
      "--radio": "20px",
      "--linea": "#3ff0ff",
      "--riel": "rgba(157, 177, 201, 0.22)",
      "--resplandor": "0 0 18px rgba(63, 240, 255, 0.6), 0 0 4px rgba(63, 240, 255, 0.8)",
      "--resplandor-tinta": "0 0 22px rgba(160, 220, 255, 0.28)",
      "--il-filtro": "drop-shadow(0 0 22px rgba(63, 240, 255, 0.32))",
      "--marco": "#3ff0ff",
      "--marco-sombra": "0 0 28px rgba(63, 240, 255, 0.6), inset 0 0 26px rgba(63, 240, 255, 0.35)",
      "--ins-fondo": "rgba(255, 79, 216, 0.12)",
      "--ins-tinta": "#ff8ae6",
      "--ins-borde": "3px solid #ff4fd8",
      "--ins-sombra": "0 0 20px rgba(255, 79, 216, 0.5)",
      "--lupa-aro": "#3ff0ff",
      "--lupa-mango": "#ff4fd8",
      "--fuente-titulo": '"Space Grotesk", sans-serif',
      "--peso-titulo": "700",
      "--espaciado-titulo": "-0.025em",
      "--fuente-texto": '"Space Grotesk", sans-serif',
      "--peso-texto": "500",
      "--fuente-cifra": '"Space Grotesk", sans-serif',
      "--fuente-sub": '"Space Grotesk", sans-serif',
      "--peso-sub": "700",
      "--sub-tinta": "#ffffff",
      "--sub-clave": "#b8ff3c",
      "--sub-fondo": "rgba(5, 9, 16, 0.62)",
      "--sub-borde": "2px solid rgba(63, 240, 255, 0.35)",
      "--sub-caja": "0 0 24px rgba(63, 240, 255, 0.18)",
      "--sub-sombra": "0 0 16px rgba(120, 230, 255, 0.45)",
      ...HORIZONTAL_PAPEL,
    },
    fondoCss: (p) => `
          radial-gradient(ellipse 125% 90% at 50% 45%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.6) 100%),
          radial-gradient(circle, rgba(157, 177, 201, 0.17) 0, rgba(157, 177, 201, 0.17) 1.6px, rgba(157, 177, 201, 0) 2.4px) 0 0 / 40px 40px,
          radial-gradient(ellipse 60% 26% at 84% 92%, rgba(255, 79, 216, 0.12) 0%, rgba(255, 79, 216, 0) 100%),
          radial-gradient(ellipse 50% 24% at 10% 12%, rgba(184, 255, 60, 0.06) 0%, rgba(184, 255, 60, 0) 100%),
          radial-gradient(ellipse 72% 44% at 50% 40%, ${p.brillo} 0%, ${p.brilloFin} 100%),
          ${p.fondo}`,
  },
  // Ciencia y misterios (canal CurioSismo): azul noche casi negro con estrellas y nebulosa fijas,
  // tarjetas oscuras translucidas con borde luminoso, tinta clara, acentos cian, ambar y magenta con
  // resplandor, titulos en Exo 2 y texto en Inter. Pensado para los videos largos horizontales.
  cosmos: {
    fondo: "#04070f",
    brillo: "#0f1d3d",
    google: "https://fonts.googleapis.com/css2?family=Exo+2:wght@600;700;800;900&display=swap",
    anchos: { anchoTitulo: 0.6, anchoTexto: 0.55, anchoCifra: 0.62 },
    vars: {
      "--tinta": "#eaf2ff",
      "--tinta-suave": "#a3b6d8",
      "--acento": "#3fe0ff",
      "--acento2": "#ffb547",
      "--alerta": "#ff5aa8",
      "--bien": "#5cf2b0",
      "--sobre-acento": "#03101c",
      "--tarjeta": "rgba(14, 24, 52, 0.8)",
      "--borde-tarjeta": "2px solid rgba(110, 220, 255, 0.5)",
      "--sombra": "0 0 30px rgba(63, 224, 255, 0.16), inset 0 0 24px rgba(63, 224, 255, 0.06)",
      "--radio": "18px",
      "--linea": "#3fe0ff",
      "--riel": "rgba(163, 182, 216, 0.24)",
      "--resplandor": "0 0 18px rgba(63, 224, 255, 0.55), 0 0 4px rgba(63, 224, 255, 0.7)",
      "--resplandor-tinta": "0 0 20px rgba(150, 200, 255, 0.28)",
      "--il-filtro": "drop-shadow(0 0 18px rgba(63, 224, 255, 0.3))",
      "--marco": "#3fe0ff",
      "--marco-sombra": "0 0 26px rgba(63, 224, 255, 0.5), inset 0 0 22px rgba(63, 224, 255, 0.3)",
      "--ins-fondo": "rgba(255, 181, 71, 0.12)",
      "--ins-tinta": "#ffc56b",
      "--ins-borde": "3px solid #ffb547",
      "--ins-sombra": "0 0 18px rgba(255, 181, 71, 0.45)",
      "--lupa-aro": "#3fe0ff",
      "--lupa-mango": "#ff5aa8",
      "--fuente-titulo": '"Exo 2", sans-serif',
      "--peso-titulo": "800",
      "--espaciado-titulo": "-0.01em",
      "--fuente-texto": '"Inter", sans-serif',
      "--peso-texto": "600",
      "--fuente-cifra": '"Exo 2", sans-serif',
      "--fuente-sub": '"Inter", sans-serif',
      "--peso-sub": "800",
      "--sub-tinta": "#ffffff",
      "--sub-clave": "#3fe0ff",
      "--sub-fondo": "rgba(5, 10, 24, 0.74)",
      "--sub-borde": "2px solid rgba(63, 224, 255, 0.35)",
      "--sub-caja": "0 0 22px rgba(63, 224, 255, 0.16)",
      "--sub-sombra": "0 0 14px rgba(120, 220, 255, 0.4)",
      ...HORIZONTAL_PAPEL,
      // Plantillas horizontales: vidrio oscuro con borde de luz en vez de papel.
      "--hoja": "rgba(16, 27, 58, 0.84)",
      "--hoja-fin": "rgba(7, 13, 32, 0.92)",
      "--hoja-alta": "rgba(20, 33, 70, 0.88)",
      "--hoja-baja": "rgba(8, 14, 34, 0.92)",
      "--hoja-baja2": "rgba(8, 14, 34, 0.92)",
      "--hoja-media": "#0a1230",
      "--hoja-tablero": "rgba(13, 22, 50, 0.86)",
      "--hoja-foto": "#0b1430",
      "--hoja-tinta": "#03101c",
      "--cinta": "rgba(63, 224, 255, 0.32)",
      "--sombra-rgb": "30, 120, 230",
      "--borde-rgb": "110, 220, 255",
      "--mancha-rgb": "60, 130, 255",
      "--hoja-rgb": "8, 14, 34",
      "--halo": "#07102a",
      "--halo-rgb": "8, 16, 42",
      "--icono-papel": "#0d1836",
      "--trazo": "#dfeeff",
      "--trazo-suave": "#7fa6d8",
      "--varilla": "#2a3a68",
      "--varilla-luz": "#9cc8ff",
      "--perilla": "#ffb547",
      "--roseta": "#3fe0ff",
      "--mar": "#0b1736",
      "--mar-fin": "#050a1c",
      "--mar-raya-rgb": "90, 160, 255",
      "--tierra": "#15244c",
      "--mar-chico": "#0b1736",
      "--sombra2-rgb": "30, 120, 230",
      "--costa": "#5fd8ff",
      "--mar-halo": "rgba(63, 170, 255, 0.16)",
      "--txt-mar": "#86b9ea",
      "--txt-mar2": "#86b9ea",
      "--txt-rio": "#8fd3ff",
      "--lago": "#0d1d44",
      "--canal-agua": "#2f86c9",
      "--rio": "#4fb0ff",
      "--luz-ventana": "#ffd27a",
      "--cabina": "#1b2c5c",
      "--acero-1": "#d4e2ff",
      "--acero-2": "#7088bd",
      "--acero-3": "#2b3a6a",
      "--acero-brillo": "#f2f8ff",
      "--hilo": "#ff5aa8",
      "--pin": "#ff5aa8",
      "--pin-luz": "#ffd0ea",
      "--mesa": "#1c2b57",
      "--mesa-luz": "#3a5a9e",
      "--mesa-frente": "#111c3d",
      "--mesa-oscura": "#0a1230",
      "--firma": "#3fe0ff",
      "--pais-k": "0.5",
      // vehiculo: el paisaje sepia se vuelve una noche azul y la maquina lleva contorno de luz.
      "--paisaje-filtro": "hue-rotate(185deg) saturate(0.75) brightness(0.42)",
      "--vehiculo-filtro": "drop-shadow(0 0 2px rgba(210, 235, 255, 0.75)) drop-shadow(0 0 18px rgba(63, 224, 255, 0.25))",
      "--figura-filtro": "drop-shadow(0 0 1.5px rgba(210, 235, 255, 0.85)) drop-shadow(0 0 16px rgba(63, 224, 255, 0.25))",
    },
    fondoCss: (p) => `
          radial-gradient(ellipse 125% 95% at 50% 45%, rgba(0, 0, 0, 0) 55%, rgba(0, 0, 0, 0.55) 100%),
          ${texturaEstrellas()},
          radial-gradient(ellipse 42% 34% at 82% 22%, rgba(255, 90, 168, 0.10) 0%, rgba(255, 90, 168, 0) 100%),
          radial-gradient(ellipse 50% 40% at 14% 78%, rgba(63, 160, 255, 0.12) 0%, rgba(63, 160, 255, 0) 100%),
          radial-gradient(ellipse 30% 22% at 60% 70%, rgba(150, 90, 255, 0.07) 0%, rgba(150, 90, 255, 0) 100%),
          radial-gradient(ellipse 72% 50% at 50% 40%, ${p.brillo} 0%, ${p.brilloFin} 100%),
          ${p.fondo}`,
  },
  // Supervivencia (canal de Juliana): cuaderno de campo sobre mapa topografico. Verde oliva oscuro con
  // curvas de nivel fijas, tarjetas de lona con borde de cinta, tinta clara, naranja de rescate y
  // amarillo de senal, verde musgo; titulos en Oswald, texto en Barlow y cifras de estarcido.
  expedicion: {
    fondo: "#262b1d",
    brillo: "#3d4630",
    google: "https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Barlow:wght@500;600;700&family=Big+Shoulders+Stencil+Display:wght@700;800;900&display=swap",
    anchos: { anchoTitulo: 0.5, anchoTexto: 0.52, anchoCifra: 0.5 },
    vars: {
      "--tinta": "#f2ead0",
      "--tinta-suave": "#c7c1a0",
      "--acento": "#ff7a2a",
      "--acento2": "#ffd23f",
      "--alerta": "#ff3b2f",
      "--bien": "#9cc063",
      "--sobre-acento": "#1c1a10",
      "--tarjeta": "rgba(52, 57, 38, 0.94)",
      "--borde-tarjeta": "3px solid rgba(232, 220, 174, 0.4)",
      "--sombra": "0 14px 30px rgba(0, 0, 0, 0.45)",
      "--radio": "6px",
      "--linea": "#ff7a2a",
      "--riel": "rgba(232, 220, 174, 0.26)",
      "--resplandor": "4px 4px 0 rgba(0, 0, 0, 0.5)",
      "--resplandor-tinta": "3px 3px 0 rgba(0, 0, 0, 0.35)",
      "--il-filtro": "drop-shadow(0 10px 12px rgba(0, 0, 0, 0.4))",
      "--marco": "#ff7a2a",
      "--marco-sombra": "0 0 0 6px #2f3422, 0 0 0 9px #ffd23f, 0 16px 30px rgba(0, 0, 0, 0.45)",
      "--ins-fondo": "#ffd23f",
      "--ins-tinta": "#1c1a10",
      "--ins-borde": "0 solid transparent",
      "--ins-sombra": "3px 3px 0 rgba(0, 0, 0, 0.45)",
      "--lupa-aro": "#ffd23f",
      "--lupa-mango": "#ff6a1a",
      "--fuente-titulo": '"Oswald", sans-serif',
      "--peso-titulo": "700",
      "--espaciado-titulo": "0.005em",
      "--fuente-texto": '"Barlow", sans-serif',
      "--peso-texto": "600",
      "--fuente-cifra": '"Big Shoulders Stencil Display", "Oswald", sans-serif',
      "--fuente-sub": '"Barlow", sans-serif',
      "--peso-sub": "700",
      "--sub-tinta": "#fff6e0",
      "--sub-clave": "#ffd23f",
      "--sub-fondo": "rgba(24, 27, 17, 0.88)",
      "--sub-borde": "2px solid rgba(255, 106, 26, 0.65)",
      "--sub-caja": "0 8px 20px rgba(0, 0, 0, 0.4)",
      "--sub-sombra": "none",
      ...HORIZONTAL_PAPEL,
      // Plantillas horizontales: lona y papel de campo oscuros, cinta amarilla, mapa topografico.
      "--hoja": "#3a4029",
      "--hoja-fin": "#2a2f1e",
      "--hoja-alta": "#454c33",
      "--hoja-baja": "#323826",
      "--hoja-baja2": "#323826",
      "--hoja-media": "#2f3422",
      "--hoja-tablero": "#3d4430",
      "--hoja-foto": "#23271a",
      "--hoja-tinta": "#1c1a10",
      "--cinta": "rgba(255, 210, 63, 0.88)",
      "--sombra-rgb": "0, 0, 0",
      "--sombra2-rgb": "0, 0, 0",
      "--borde-rgb": "232, 220, 174",
      "--mancha-rgb": "0, 0, 0",
      "--hoja-rgb": "38, 43, 28",
      "--halo": "#262b1c",
      "--halo-rgb": "38, 43, 28",
      "--icono-papel": "#2f3422",
      "--trazo": "#f2ead0",
      "--trazo-suave": "#b9b38f",
      "--varilla": "#5d5a48",
      "--varilla-luz": "#cfc8a2",
      "--perilla": "#ff6a1a",
      "--roseta": "#ffd23f",
      "--mar": "#2b3f40",
      "--mar-fin": "#1c2a2b",
      "--mar-raya-rgb": "160, 205, 195",
      "--tierra": "#4b5035",
      "--mar-chico": "#2b3f40",
      "--costa": "#eadfb0",
      "--mar-halo": "rgba(190, 225, 215, 0.12)",
      "--txt-mar": "#a8cbc2",
      "--txt-mar2": "#a8cbc2",
      "--txt-rio": "#bfe2d8",
      "--lago": "#2f4546",
      "--canal-agua": "#5f9c9a",
      "--rio": "#7fb8b2",
      "--luz-ventana": "#ffd23f",
      "--cabina": "#454c33",
      "--acero-1": "#dcd6bc",
      "--acero-2": "#8c8970",
      "--acero-3": "#3c3b2f",
      "--acero-brillo": "#f6f1da",
      "--hilo": "#ff6a1a",
      "--pin": "#ff3b2f",
      "--pin-luz": "#ffc9a8",
      "--mesa": "#5a4a32",
      "--mesa-luz": "#7a6544",
      "--mesa-frente": "#3f3424",
      "--mesa-oscura": "#2e2619",
      "--firma": "#ffd23f",
      "--pais-k": "0.5",
      "--mapa-textura": texturaTopografica(),
      "--figura-filtro": "drop-shadow(0 0 1.5px rgba(242, 234, 208, 0.7)) drop-shadow(0 8px 10px rgba(0, 0, 0, 0.4))",
      "--paisaje-filtro": "hue-rotate(18deg) saturate(0.8) brightness(0.6)",
      "--vehiculo-filtro": "drop-shadow(0 0 1.5px rgba(242, 234, 208, 0.6)) drop-shadow(0 10px 12px rgba(0, 0, 0, 0.45))",
    },
    fondoCss: (p) => `
          radial-gradient(ellipse 125% 95% at 50% 45%, rgba(0, 0, 0, 0) 52%, rgba(0, 0, 0, 0.5) 100%),
          ${texturaTopografica()},
          radial-gradient(ellipse 50% 40% at 85% 85%, rgba(255, 106, 26, 0.07) 0%, rgba(255, 106, 26, 0) 100%),
          radial-gradient(ellipse 72% 50% at 50% 40%, ${p.brillo} 0%, ${p.brilloFin} 100%),
          ${p.fondo}`,
  },
  // Dinero (canal de Felipe): terminal financiera e informe economico. Azul petroleo casi negro con
  // cuadricula de grafico y lineas de cotizacion fijas, paneles de terminal con borde fino, tinta clara,
  // dorado como acento, verde alza y rojo baja; titulos en Fraunces, texto en IBM Plex Sans y cifras en
  // IBM Plex Mono (tabulares, como precios).
  mercado: {
    fondo: "#081216",
    brillo: "#14272e",
    google: "https://fonts.googleapis.com/css2?family=Fraunces:wght@600;700;800&family=IBM+Plex+Sans:wght@500;600;700&family=IBM+Plex+Mono:wght@500;600;700&display=swap",
    anchos: { anchoTitulo: 0.56, anchoTexto: 0.54, anchoCifra: 0.62 },
    vars: {
      "--tinta": "#e8eef0",
      "--tinta-suave": "#9fb0b6",
      "--acento": "#e3b341",
      "--acento2": "#22c55e",
      "--alerta": "#ef4444",
      "--bien": "#22c55e",
      "--sobre-acento": "#081216",
      "--tarjeta": "rgba(15, 29, 35, 0.92)",
      "--borde-tarjeta": "2px solid rgba(140, 180, 190, 0.3)",
      "--sombra": "0 12px 28px rgba(0, 0, 0, 0.45)",
      "--radio": "4px",
      "--linea": "#e3b341",
      "--riel": "rgba(159, 176, 182, 0.22)",
      "--resplandor": "0 0 14px rgba(227, 179, 65, 0.3)",
      "--resplandor-tinta": "none",
      "--il-filtro": "drop-shadow(0 10px 14px rgba(0, 0, 0, 0.45))",
      "--marco": "#e3b341",
      "--marco-sombra": "0 0 0 6px #0f1d22, 0 0 0 8px rgba(227, 179, 65, 0.45), 0 16px 32px rgba(0, 0, 0, 0.5)",
      "--ins-fondo": "rgba(227, 179, 65, 0.12)",
      "--ins-tinta": "#f0c75e",
      "--ins-borde": "2px solid #e3b341",
      "--ins-sombra": "none",
      "--lupa-aro": "#e3b341",
      "--lupa-mango": "#9fb0b6",
      "--fuente-titulo": '"Fraunces", serif',
      "--peso-titulo": "700",
      "--espaciado-titulo": "-0.015em",
      "--fuente-texto": '"IBM Plex Sans", sans-serif',
      "--peso-texto": "500",
      "--fuente-cifra": '"IBM Plex Mono", monospace',
      "--fuente-sub": '"IBM Plex Sans", sans-serif',
      "--peso-sub": "700",
      "--sub-tinta": "#ffffff",
      "--sub-clave": "#e3b341",
      "--sub-fondo": "rgba(8, 16, 20, 0.88)",
      "--sub-borde": "1px solid rgba(227, 179, 65, 0.5)",
      "--sub-caja": "0 8px 20px rgba(0, 0, 0, 0.4)",
      "--sub-sombra": "none",
      ...HORIZONTAL_PAPEL,
      // Plantillas horizontales: paneles de terminal, cinta dorada, mapa como grafico.
      "--hoja": "#102127",
      "--hoja-fin": "#0b171b",
      "--hoja-alta": "#13262d",
      "--hoja-baja": "#0d1b20",
      "--hoja-baja2": "#0d1b20",
      "--hoja-media": "#0e1c21",
      "--hoja-tablero": "#11232a",
      "--hoja-foto": "#0a1519",
      "--hoja-tinta": "#081216",
      "--cinta": "rgba(227, 179, 65, 0.75)",
      "--sombra-rgb": "0, 0, 0",
      "--sombra2-rgb": "0, 0, 0",
      "--borde-rgb": "140, 180, 190",
      "--mancha-rgb": "0, 0, 0",
      "--hoja-rgb": "10, 20, 24",
      "--halo": "#0b171b",
      "--halo-rgb": "11, 23, 27",
      "--icono-papel": "#0e1c21",
      "--trazo": "#e8eef0",
      "--trazo-suave": "#8aa0a8",
      "--varilla": "#2c3f46",
      "--varilla-luz": "#9fb0b6",
      "--perilla": "#e3b341",
      "--roseta": "#22c55e",
      "--mar": "#0c1b22",
      "--mar-fin": "#08121a",
      "--mar-raya-rgb": "120, 170, 190",
      "--tierra": "#172a31",
      "--mar-chico": "#0c1b22",
      "--costa": "#e3b341",
      "--mar-halo": "rgba(227, 179, 65, 0.08)",
      "--txt-mar": "#7fa3ad",
      "--txt-mar2": "#7fa3ad",
      "--txt-rio": "#9cc3cc",
      "--lago": "#0f2229",
      "--canal-agua": "#3f7f8f",
      "--rio": "#5aa0b0",
      "--luz-ventana": "#e3b341",
      "--cabina": "#1b3038",
      "--acero-1": "#d0d8da",
      "--acero-2": "#7d8c91",
      "--acero-3": "#2c393d",
      "--acero-brillo": "#f2f5f5",
      "--hilo": "#ef4444",
      "--pin": "#ef4444",
      "--pin-luz": "#ffb4b4",
      "--mesa": "#1a2c33",
      "--mesa-luz": "#2c4650",
      "--mesa-frente": "#0f1c21",
      "--mesa-oscura": "#0a1418",
      "--firma": "#e3b341",
      "--pais-k": "0.6",
      "--mapa-textura": "linear-gradient(rgba(140, 180, 190, 0.06) 1px, rgba(140, 180, 190, 0) 1px) 0 0 / 40px 40px, linear-gradient(90deg, rgba(140, 180, 190, 0.06) 1px, rgba(140, 180, 190, 0) 1px) 0 0 / 40px 40px",
      "--figura-filtro": "drop-shadow(0 0 1.5px rgba(232, 238, 240, 0.6)) drop-shadow(0 8px 12px rgba(0, 0, 0, 0.45))",
      "--paisaje-filtro": "hue-rotate(160deg) saturate(0.35) brightness(0.45)",
      "--vehiculo-filtro": "drop-shadow(0 0 1.5px rgba(232, 238, 240, 0.6)) drop-shadow(0 10px 12px rgba(0, 0, 0, 0.45))",
    },
    fondoCss: (p) => `
          radial-gradient(ellipse 125% 95% at 50% 45%, rgba(0, 0, 0, 0) 55%, rgba(0, 0, 0, 0.5) 100%),
          ${texturaMercado()},
          radial-gradient(ellipse 50% 40% at 85% 15%, rgba(227, 179, 65, 0.06) 0%, rgba(227, 179, 65, 0) 100%),
          radial-gradient(ellipse 72% 50% at 50% 40%, ${p.brillo} 0%, ${p.brilloFin} 100%),
          ${p.fondo}`,
  },
};
