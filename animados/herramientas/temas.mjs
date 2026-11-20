// temas.mjs - Temas visuales de los videos propios (Narrador): archivo, laboratorio y pizarra.
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
    },
    fondoCss: (p) => `
          radial-gradient(ellipse 125% 90% at 50% 45%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.6) 100%),
          radial-gradient(circle, rgba(157, 177, 201, 0.17) 0, rgba(157, 177, 201, 0.17) 1.6px, rgba(157, 177, 201, 0) 2.4px) 0 0 / 40px 40px,
          radial-gradient(ellipse 60% 26% at 84% 92%, rgba(255, 79, 216, 0.12) 0%, rgba(255, 79, 216, 0) 100%),
          radial-gradient(ellipse 50% 24% at 10% 12%, rgba(184, 255, 60, 0.06) 0%, rgba(184, 255, 60, 0) 100%),
          radial-gradient(ellipse 72% 44% at 50% 40%, ${p.brillo} 0%, ${p.brilloFin} 100%),
          ${p.fondo}`,
  },
};
