import { checkPassword, currentUser, setPassword } from "@/lib/auth";
import { body, fail, json } from "@/lib/http";

/** Cambia la contraseña del socio que está dentro. Cuerpo: { current, next } */
export async function POST(req: Request) {
  const me = await currentUser();
  if (!me) return fail("Inicia sesión.", 401);
  const b = await body(req);
  const current = typeof b?.current === "string" ? b.current : "";
  const next = typeof b?.next === "string" ? b.next : "";
  if (next.length < 10) return fail("La nueva contraseña debe tener al menos 10 caracteres.", 400);
  if (!(await checkPassword(me, current))) {
    await new Promise((r) => setTimeout(r, 700));
    return fail("La contraseña actual no es correcta.", 401);
  }
  try {
    await setPassword(me, next);
    return json({ ok: true });
  } catch (e) {
    console.error(e);
    return fail("No se pudo guardar la contraseña.", 500);
  }
}
