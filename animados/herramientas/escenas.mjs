// escenas.mjs - Piezas comunes de las escenas: cortes dentro de una frase y ficha de personajes.
//
// Lo usan montaje.mjs (todo video hecho con escenas) y largo-escenas.mjs (videos largos de YouTube
// hechos con escenas, que necesita saber cuando empieza cada escena para los creditos y los avisos).

const r3 = (n) => Math.round(n * 1000) / 1000;
const norma = (s) =>
  String(s)
    .normalize("NFD")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();

// ---------- Cortes de escena dentro de una frase ----------
// Las ventanas de escena salen de tiempos.json (una por grupo de frases). Un corte
// ("cortes": [{ "escena": "<id>", "palabra": 9 | "texto" | "fin" }] en una frase) parte una ventana
// en la palabra pedida: la escena nueva empieza un instante antes de que se diga (o al terminar la
// frase, con "fin"). Devuelve las ventanas finales, en orden.
export function aplicaCortes(escenas, frasesGuion, frasesTiempos) {
  const escenasFinales = escenas.map((e) => ({ ...e }));
  for (const delGuion of frasesGuion || []) {
    for (const corte of delGuion.cortes || []) {
      const f = frasesTiempos.find((x) => x.id === delGuion.id);
      if (!f) continue;
      if (!corte.escena || escenasFinales.some((e) => e.id === corte.escena)) throw new Error(`El corte de la frase ${delGuion.id} necesita una "escena" nueva (llego "${corte.escena}").`);
      let t;
      if (corte.palabra === "fin") t = f.fin + 0.12;
      else {
        let i = typeof corte.palabra === "number" ? corte.palabra : f.palabras.findIndex((p) => norma(p.texto) === norma(corte.palabra));
        if (i < 0) i = f.palabras.findIndex((p) => norma(corte.palabra).length > 3 && norma(p.texto).startsWith(norma(corte.palabra)));
        if (i < 0 || i >= f.palabras.length) throw new Error(`El corte de la frase ${delGuion.id} pide la palabra "${corte.palabra}", que no esta en la frase.`);
        t = f.palabras[i].inicio - 0.1;
      }
      t = r3(t);
      const k = escenasFinales.findIndex((e) => t > e.inicio + 0.3 && t < e.fin - 0.3);
      if (k < 0) throw new Error(`El corte de la frase ${delGuion.id} cae demasiado cerca del borde de una escena.`);
      escenasFinales.splice(k + 1, 0, { id: corte.escena, inicio: t, fin: escenasFinales[k].fin });
      escenasFinales[k].fin = t;
    }
  }
  return escenasFinales;
}

// ---------- Ficha de personajes ----------
// "personajes": { "roosevelt": { "nombre": "Theodore Roosevelt", "rol": "...", "barba": "morsa", ... } }
// en el guion. En los datos de una escena, cualquier objeto con "personaje": "<id>" recibe la ficha
// entera y lo que traiga el objeto manda encima ({ "personaje": "hay", "pose": "firmar" }). En una
// lista que se llama "personajes" (la del tablero) basta el id: ["roosevelt", "marroquin"].
// Asi cada persona se ve igual en todo el video.
export function conPersonajes(valor, fichas, clave = "") {
  if (!fichas) return valor;
  const ficha = (id) => {
    const f = fichas[id];
    if (!f || typeof f !== "object") throw new Error(`No hay ficha del personaje "${id}" en "personajes". Las que hay: ${Object.keys(fichas).join(", ")}`);
    return f;
  };
  if (Array.isArray(valor)) {
    return valor.map((v) => (clave === "personajes" && typeof v === "string" ? { ...ficha(v), personaje: v } : conPersonajes(v, fichas)));
  }
  if (valor && typeof valor === "object") {
    const copia = Object.fromEntries(Object.entries(valor).map(([k, v]) => [k, conPersonajes(v, fichas, k)]));
    if (typeof copia.personaje === "string") return { ...ficha(copia.personaje), ...copia };
    return copia;
  }
  return valor;
}

// Fotos de Commons que pide una escena: los datos "foto" o "foto_<algo>" cuyo valor es un archivo
// de imagen (asi "foto_pie" sigue siendo texto). Devuelve [{ titulo, pie }].
export function fotosDe(valor, lista = []) {
  if (Array.isArray(valor)) valor.forEach((v) => fotosDe(v, lista));
  else if (valor && typeof valor === "object") {
    for (const [k, v] of Object.entries(valor)) {
      if (/^foto(_[a-z0-9]+)?$/.test(k) && typeof v === "string" && /\.(jpe?g|png|gif|tiff?|webp)$/i.test(v)) {
        lista.push({ titulo: v, pie: valor[k + "_pie"] || valor.pie || "" });
      } else if (v && typeof v === "object") fotosDe(v, lista);
    }
  }
  return lista;
}
