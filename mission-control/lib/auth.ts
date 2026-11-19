import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { store } from "./store";

export const USERS = ["santiago", "felipe"] as const;
export type User = (typeof USERS)[number];

const COOKIE = "mc_session";
const isProd = process.env.NODE_ENV === "production";

function secret(): Uint8Array {
  const s = process.env.MC_SECRET || "";
  if (s.length >= 32) return new TextEncoder().encode(s);
  if (!isProd) return new TextEncoder().encode("solo-desarrollo-solo-desarrollo-000000");
  throw new Error("Falta MC_SECRET (32 caracteres o más).");
}

export function isUser(x: unknown): x is User {
  return typeof x === "string" && (USERS as readonly string[]).includes(x);
}

/** Formato: scrypt:<sal en hex>:<hash en hex>. Sin «$», para que no lo rompa la lectura de .env. */
export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 32);
  return `scrypt:${salt.toString("hex")}:${hash.toString("hex")}`;
}

function verifyHash(stored: string, password: string): boolean {
  const [kind, saltHex, hashHex] = stored.split(":");
  if (kind !== "scrypt" || !saltHex || !hashHex) return false;
  const ref = Buffer.from(hashHex, "hex");
  const got = scryptSync(password, Buffer.from(saltHex, "hex"), ref.length || 32);
  return ref.length > 0 && ref.length === got.length && timingSafeEqual(ref, got);
}

/**
 * Primero la contraseña que el socio cambió desde la app (guardada en la base);
 * si no hay, la inicial de la variable MC_PASS_<USUARIO>.
 */
export async function checkPassword(user: User, password: string): Promise<boolean> {
  if (!password) return false;
  let stored: string | null = null;
  try {
    stored = await store().getPrivate(`pass:${user}`);
  } catch (e) {
    console.error(e);
  }
  stored = stored || process.env[`MC_PASS_${user.toUpperCase()}`] || "";
  if (!stored) return !isProd && process.env.MC_DEV_OPEN === "1";
  return verifyHash(stored, password);
}

export async function setPassword(user: User, password: string): Promise<void> {
  await store().setPrivate(`pass:${user}`, hashPassword(password), user);
}

export async function createSession(user: User): Promise<void> {
  const token = await new SignJWT({ sub: user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret());
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function currentUser(): Promise<User | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return isUser(payload.sub) ? payload.sub : null;
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

/** Los agentes (Claude en cada PC) escriben con «Authorization: Bearer <MC_AGENT_TOKEN>». */
export function agentAuthorized(req: Request): boolean {
  const token = process.env.MC_AGENT_TOKEN || "";
  if (token.length < 32) return false;
  const header = req.headers.get("authorization") || "";
  const given = header.startsWith("Bearer ") ? header.slice(7) : "";
  const a = Buffer.from(given);
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}
