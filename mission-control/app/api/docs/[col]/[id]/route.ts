import { currentUser } from "@/lib/auth";
import { body, fail, isObject, json, tooBig } from "@/lib/http";
import { clean, ID_RE, isCol, store } from "@/lib/store";

type Ctx = { params: Promise<{ col: string; id: string }> };

async function target(ctx: Ctx) {
  const { col, id } = await ctx.params;
  if (!isCol(col) || !ID_RE.test(id)) return null;
  return { col, id };
}

/** Cambia algunos campos. Cuerpo: { data: {...} } (se mezcla con lo que hay). */
export async function PATCH(req: Request, ctx: Ctx) {
  const me = await currentUser();
  if (!me) return fail("Inicia sesión.", 401);
  const t = await target(ctx);
  if (!t) return fail("No encontrado.", 404);
  const b = await body(req);
  if (!b || !isObject(b.data)) return fail("Falta data.", 400);
  if (tooBig(b.data)) return fail("El cambio es demasiado grande.", 413);
  try {
    const doc = await store().patch(t.col, t.id, clean(b.data), me);
    if (!doc) return fail("Ese documento ya no existe.", 404);
    return json({ ok: true, doc });
  } catch (e) {
    console.error(e);
    return fail("No se pudo guardar.", 500);
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const me = await currentUser();
  if (!me) return fail("Inicia sesión.", 401);
  const t = await target(ctx);
  if (!t) return fail("No encontrado.", 404);
  try {
    const ok = await store().remove(t.col, t.id, me);
    if (!ok) return fail("Ese documento ya no existe.", 404);
    return json({ ok: true });
  } catch (e) {
    console.error(e);
    return fail("No se pudo borrar.", 500);
  }
}
