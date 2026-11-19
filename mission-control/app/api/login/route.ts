import { checkPassword, createSession, isUser } from "@/lib/auth";
import { body, fail, json } from "@/lib/http";
import { store } from "@/lib/store";

const MAX_FAILS = 5;
const LOCK_MS = 15 * 60 * 1000;

type Fails = { n: number; until: number };

async function readFails(user: string): Promise<Fails> {
  try {
    const raw = await store().getPrivate(`fails:${user}`);
    const f = raw ? (JSON.parse(raw) as Fails) : null;
    return { n: Number(f?.n) || 0, until: Number(f?.until) || 0 };
  } catch {
    return { n: 0, until: 0 };
  }
}

async function writeFails(user: string, f: Fails) {
  try {
    await store().setPrivate(`fails:${user}`, JSON.stringify(f), "login");
  } catch (e) {
    console.error(e);
  }
}

export async function POST(req: Request) {
  const b = await body(req);
  const user = b?.user;
  const password = typeof b?.password === "string" ? b.password : "";
  if (!isUser(user)) return fail("Usuario o contraseña incorrectos.", 401);

  // Bloqueo por intentos fallidos: 5 seguidos bloquean ese usuario 15 minutos.
  const f = await readFails(user);
  if (f.until > Date.now()) {
    const min = Math.ceil((f.until - Date.now()) / 60000);
    return fail(`Demasiados intentos. Espera ${min} min e inténtalo otra vez.`, 429);
  }

  if (!(await checkPassword(user, password))) {
    const n = f.n + 1;
    await writeFails(user, n >= MAX_FAILS ? { n: 0, until: Date.now() + LOCK_MS } : { n, until: 0 });
    await new Promise((r) => setTimeout(r, 700));
    return fail("Usuario o contraseña incorrectos.", 401);
  }

  if (f.n || f.until) await writeFails(user, { n: 0, until: 0 });
  await createSession(user);
  return json({ ok: true, user });
}
