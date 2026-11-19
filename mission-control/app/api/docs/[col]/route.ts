import { randomBytes } from "node:crypto";
import { currentUser } from "@/lib/auth";
import { body, fail, isObject, json, tooBig } from "@/lib/http";
import { clean, ID_RE, isCol, store } from "@/lib/store";

type Ctx = { params: Promise<{ col: string }> };

/** Crea un documento. Cuerpo: { id?: string, data: {...} } */
export async function POST(req: Request, ctx: Ctx) {
  const me = await currentUser();
  if (!me) return fail("Inicia sesión.", 401);
  const { col } = await ctx.params;
  if (!isCol(col)) return fail("Colección desconocida.", 404);
  const b = await body(req);
  if (!b || !isObject(b.data)) return fail("Falta data.", 400);
  if (tooBig(b.data)) return fail("El documento es demasiado grande.", 413);
  const id = typeof b.id === "string" && b.id ? b.id : "x" + Date.now().toString(36) + randomBytes(3).toString("hex");
  if (!ID_RE.test(id)) return fail("Id no válido.", 400);
  try {
    const ok = await store().create(col, id, clean(b.data), me);
    if (!ok) return fail("Ya existe un documento con ese id.", 409);
    return json({ ok: true, id }, 201);
  } catch (e) {
    console.error(e);
    return fail("No se pudo guardar.", 500);
  }
}
