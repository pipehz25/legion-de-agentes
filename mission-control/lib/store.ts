import { neon } from "@neondatabase/serverless";
import { promises as fs } from "node:fs";
import path from "node:path";

export const COLLECTIONS = ["tareas", "cuentas", "decisiones", "pipeline"] as const;
export type Col = (typeof COLLECTIONS)[number];
export type Doc = Record<string, unknown> & { _id: string };
export type AllData = Record<Col, Doc[]>;

export function isCol(x: string): x is Col {
  return (COLLECTIONS as readonly string[]).includes(x);
}

export const ID_RE = /^[A-Za-z0-9_.:-]{1,80}$/;

/** Quita campos internos (que empiezan por «_») antes de guardar. */
export function clean(data: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) if (!k.startsWith("_")) out[k] = v;
  return out;
}

const DB_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL || "";

interface Store {
  /** Valores privados (hashes de contraseña). Viven en la colección «_privado», que la API nunca devuelve. */
  getPrivate(key: string): Promise<string | null>;
  setPrivate(key: string, value: string, user: string): Promise<void>;
  all(): Promise<AllData>;
  create(col: Col, id: string, data: Record<string, unknown>, user: string): Promise<boolean>;
  upsert(col: Col, id: string, data: Record<string, unknown>, user: string): Promise<void>;
  patch(col: Col, id: string, data: Record<string, unknown>, user: string): Promise<Doc | null>;
  remove(col: Col, id: string, user: string): Promise<boolean>;
}

function empty(): AllData {
  return { tareas: [], cuentas: [], decisiones: [], pipeline: [] };
}

// ---------- Postgres (Neon) ----------
function pgStore(): Store {
  const sql = neon(DB_URL);
  let ready: Promise<unknown> | null = null;
  const ensure = () => {
    if (!ready) {
      ready = (async () => {
        await sql`create table if not exists mc_docs (
          col text not null, id text not null, data jsonb not null,
          updated_at timestamptz not null default now(), updated_by text,
          primary key (col, id))`;
        await sql`create table if not exists mc_audit (
          id bigserial primary key, at timestamptz not null default now(),
          usr text, col text not null, doc text not null, action text not null, data jsonb)`;
      })().catch((e) => {
        ready = null;
        throw e;
      });
    }
    return ready;
  };
  const audit = (user: string, col: Col, id: string, action: string, data: unknown) =>
    sql`insert into mc_audit (usr, col, doc, action, data) values (${user}, ${col}, ${id}, ${action}, ${JSON.stringify(data ?? null)}::jsonb)`;

  return {
    async getPrivate(key) {
      await ensure();
      const rows = (await sql`select data from mc_docs where col = '_privado' and id = ${key}`) as { data: { v?: string } }[];
      return rows[0]?.data?.v ?? null;
    },
    async setPrivate(key, value, user) {
      await ensure();
      await sql`insert into mc_docs (col, id, data, updated_by) values ('_privado', ${key}, ${JSON.stringify({ v: value })}::jsonb, ${user})
        on conflict (col, id) do update set data = excluded.data, updated_at = now(), updated_by = excluded.updated_by`;
      await sql`insert into mc_audit (usr, col, doc, action) values (${user}, '_privado', ${key}, 'cambiar')`;
    },
    async all() {
      await ensure();
      const rows = (await sql`select col, id, data from mc_docs where col <> '_privado' order by col, id`) as { col: string; id: string; data: Record<string, unknown> }[];
      const out = empty();
      for (const r of rows) if (isCol(r.col)) out[r.col].push({ ...r.data, _id: r.id });
      return out;
    },
    async create(col, id, data, user) {
      await ensure();
      const rows = await sql`insert into mc_docs (col, id, data, updated_by) values (${col}, ${id}, ${JSON.stringify(data)}::jsonb, ${user})
        on conflict (col, id) do nothing returning id`;
      if (!rows.length) return false;
      await audit(user, col, id, "crear", data);
      return true;
    },
    async upsert(col, id, data, user) {
      await ensure();
      await sql`insert into mc_docs (col, id, data, updated_by) values (${col}, ${id}, ${JSON.stringify(data)}::jsonb, ${user})
        on conflict (col, id) do update set data = excluded.data, updated_at = now(), updated_by = excluded.updated_by`;
      await audit(user, col, id, "reemplazar", data);
    },
    async patch(col, id, data, user) {
      await ensure();
      const rows = (await sql`update mc_docs set data = data || ${JSON.stringify(data)}::jsonb, updated_at = now(), updated_by = ${user}
        where col = ${col} and id = ${id} returning data`) as { data: Record<string, unknown> }[];
      if (!rows.length) return null;
      await audit(user, col, id, "cambiar", data);
      return { ...rows[0].data, _id: id };
    },
    async remove(col, id, user) {
      await ensure();
      const rows = await sql`delete from mc_docs where col = ${col} and id = ${id} returning id`;
      if (!rows.length) return false;
      await audit(user, col, id, "borrar", null);
      return true;
    },
  };
}

// ---------- Archivo local (solo desarrollo) ----------
type FileShape = { docs: Record<string, Record<string, Record<string, unknown>>>; audit: unknown[] };
function fileStore(): Store {
  const file = path.join(process.cwd(), ".data", "mc.json");
  let chain: Promise<unknown> = Promise.resolve();
  const read = async (): Promise<FileShape> => {
    try {
      return JSON.parse(await fs.readFile(file, "utf8")) as FileShape;
    } catch {
      return { docs: {}, audit: [] };
    }
  };
  const write = async (d: FileShape) => {
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, JSON.stringify(d, null, 1), "utf8");
  };
  // Serializa las escrituras para no pisarse dentro del mismo proceso.
  const tx = <T,>(fn: (d: FileShape) => T | Promise<T>): Promise<T> => {
    const run = chain.then(async () => {
      const d = await read();
      const r = await fn(d);
      await write(d);
      return r;
    });
    chain = run.catch(() => undefined);
    return run;
  };
  const log = (d: FileShape, user: string, col: Col, id: string, action: string, data: unknown) => {
    d.audit.push({ at: new Date().toISOString(), usr: user, col, doc: id, action, data });
    if (d.audit.length > 2000) d.audit.splice(0, d.audit.length - 2000);
  };
  return {
    async getPrivate(key) {
      const d = await read();
      const v = d.docs._privado?.[key]?.v;
      return typeof v === "string" ? v : null;
    },
    setPrivate: (key, value, user) =>
      tx((d) => {
        d.docs._privado = d.docs._privado || {};
        d.docs._privado[key] = { v: value };
        d.audit.push({ at: new Date().toISOString(), usr: user, col: "_privado", doc: key, action: "cambiar" });
      }),
    async all() {
      const d = await read();
      const out = empty();
      for (const col of COLLECTIONS) for (const [id, data] of Object.entries(d.docs[col] || {})) out[col].push({ ...data, _id: id });
      return out;
    },
    create: (col, id, data, user) =>
      tx((d) => {
        d.docs[col] = d.docs[col] || {};
        if (d.docs[col][id]) return false;
        d.docs[col][id] = data;
        log(d, user, col, id, "crear", data);
        return true;
      }),
    upsert: (col, id, data, user) =>
      tx((d) => {
        d.docs[col] = d.docs[col] || {};
        d.docs[col][id] = data;
        log(d, user, col, id, "reemplazar", data);
      }),
    patch: (col, id, data, user) =>
      tx((d) => {
        const cur = d.docs[col]?.[id];
        if (!cur) return null;
        d.docs[col][id] = { ...cur, ...data };
        log(d, user, col, id, "cambiar", data);
        return { ...d.docs[col][id], _id: id } as Doc;
      }),
    remove: (col, id, user) =>
      tx((d) => {
        if (!d.docs[col]?.[id]) return false;
        delete d.docs[col][id];
        log(d, user, col, id, "borrar", null);
        return true;
      }),
  };
}

let instance: Store | null = null;
export function store(): Store {
  if (instance) return instance;
  if (DB_URL) instance = pgStore();
  else if (process.env.NODE_ENV !== "production") instance = fileStore();
  else throw new Error("Falta DATABASE_URL: conecta la base de datos en Vercel (Storage).");
  return instance;
}
