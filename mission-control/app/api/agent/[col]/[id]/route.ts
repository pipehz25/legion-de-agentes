import { agentAuthorized } from "@/lib/auth";
import { body, fail, isObject, json, tooBig } from "@/lib/http";
import { clean, ID_RE, isCol, store } from "@/lib/store";

/**
 * Para los agentes (Claude en cada PC): escriben el estado del pipeline o avanzan sus tareas.
 * Autorización: «Authorization: Bearer <MC_AGENT_TOKEN>».
 *   PUT   /api/agent/pipeline/raiz   { data: {...} }  reemplaza el documento (o lo crea)
 *   PATCH /api/agent/tareas/C4       { data: {...} }  cambia algunos campos
 */
type Ctx = { params: Promise<{ col: string; id: string }> };

async function parse(req: Request, ctx: Ctx) {
  if (!agentAuthorized(req)) return { error: fail("Token de agente no válido.", 401) };
  const { col, id } = await ctx.params;
  if (!isCol(col) || !ID_RE.test(id)) return { error: fail("No encontrado.", 404) };
  const b = await body(req);
  if (!b || !isObject(b.data)) return { error: fail("Falta data.", 400) };
  if (tooBig(b.data)) return { error: fail("Demasiado grande.", 413) };
  return { col, id, data: clean(b.data) };
}

export async function PUT(req: Request, ctx: Ctx) {
  const p = await parse(req, ctx);
  if ("error" in p) return p.error;
  try {
    await store().upsert(p.col, p.id, p.data, "claude");
    return json({ ok: true });
  } catch (e) {
    console.error(e);
    return fail("No se pudo guardar.", 500);
  }
}

export async function PATCH(req: Request, ctx: Ctx) {
  const p = await parse(req, ctx);
  if ("error" in p) return p.error;
  try {
    const doc = await store().patch(p.col, p.id, p.data, "claude");
    if (!doc) return fail("Ese documento no existe.", 404);
    return json({ ok: true });
  } catch (e) {
    console.error(e);
    return fail("No se pudo guardar.", 500);
  }
}
