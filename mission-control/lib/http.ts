import { NextResponse } from "next/server";

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

export function fail(message: string, status: number) {
  return json({ error: message }, status);
}

export async function body(req: Request): Promise<Record<string, unknown> | null> {
  try {
    const b = (await req.json()) as unknown;
    return b && typeof b === "object" && !Array.isArray(b) ? (b as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export function isObject(x: unknown): x is Record<string, unknown> {
  return !!x && typeof x === "object" && !Array.isArray(x);
}

/** Tamaño máximo de un documento (64 KB) para que nadie llene la base por error. */
export function tooBig(x: unknown): boolean {
  return JSON.stringify(x).length > 64 * 1024;
}
