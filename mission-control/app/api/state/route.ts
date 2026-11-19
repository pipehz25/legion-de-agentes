import { currentUser } from "@/lib/auth";
import { fail, json } from "@/lib/http";
import { store } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const me = await currentUser();
  if (!me) return fail("Inicia sesión.", 401);
  try {
    const data = await store().all();
    return json({ me, ...data, now: new Date().toISOString() });
  } catch (e) {
    console.error(e);
    return fail("No se pudo leer la base de datos.", 500);
  }
}
