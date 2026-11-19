import { checkPassword, createSession, isUser } from "@/lib/auth";
import { body, fail, json } from "@/lib/http";

export async function POST(req: Request) {
  const b = await body(req);
  const user = b?.user;
  const password = typeof b?.password === "string" ? b.password : "";
  if (!isUser(user) || !(await checkPassword(user, password))) {
    await new Promise((r) => setTimeout(r, 700));
    return fail("Usuario o contraseña incorrectos.", 401);
  }
  await createSession(user);
  return json({ ok: true, user });
}
