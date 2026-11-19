// Modelo compartido por el navegador y el servidor: tipos, nombres y reglas de las tareas.

export type Person = "santiago" | "felipe" | "claude" | "todos";
export type Estado = "backlog" | "ready" | "in_progress" | "blocked" | "review" | "done" | "canceled";
export type Prioridad = "alta" | "media" | "baja";
export type Unidad = "A" | "B" | "C" | "G";
export type Sub = { t: string; ok: boolean };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Doc = Record<string, any> & { _id: string };

export interface Task {
  _id: string;
  id: string;
  titulo: string;
  quien: Person;
  unidad: Unidad;
  semana: number;
  estado: Estado;
  prioridad: Prioridad;
  vence: string;
  esfuerzo: number;
  depende: string[];
  subtareas: Sub[];
  criterio: string;
  detalle: string;
  comando: string;
  evidencia: string;
  bloqueo: string;
  hoy: string;
  orden: number;
  actualizado: string;
  por: string;
}

export const PEOPLE: Record<Person, { name: string; short: string; role: string }> = {
  santiago: { name: "Santiago", short: "S", role: "Programación y conexiones" },
  felipe: { name: "Felipe", short: "F", role: "Cuentas y operación" },
  claude: { name: "Claude", short: "C", role: "Código y documentos" },
  todos: { name: "Los dos", short: "SF", role: "Santiago y Felipe" },
};
export const PERSON_KEYS: Person[] = ["santiago", "felipe", "claude", "todos"];

export const ESTADOS: { key: Estado; label: string }[] = [
  { key: "backlog", label: "Backlog" },
  { key: "ready", label: "Por hacer" },
  { key: "in_progress", label: "En curso" },
  { key: "blocked", label: "Bloqueada" },
  { key: "review", label: "En revisión" },
  { key: "done", label: "Hecha" },
  { key: "canceled", label: "Cancelada" },
];
export const ESTADO_LABEL = Object.fromEntries(ESTADOS.map((e) => [e.key, e.label])) as Record<Estado, string>;

/** Columnas del tablero: 4 a la vista; backlog y bloqueada viven dentro de otra columna con su etiqueta. */
export const COLUMNS: { key: string; label: string; estados: Estado[]; drop: Estado }[] = [
  { key: "todo", label: "Por hacer", estados: ["ready", "backlog"], drop: "ready" },
  { key: "doing", label: "En curso", estados: ["in_progress", "blocked"], drop: "in_progress" },
  { key: "review", label: "En revisión", estados: ["review"], drop: "review" },
  { key: "done", label: "Hecha", estados: ["done"], drop: "done" },
];

export const UNITS: Record<Unidad, { name: string; obj: string }> = {
  A: { name: "Media Network", obj: "Clips de famosos con derechos y cuentas con contenido propio en TikTok, YouTube e Instagram." },
  B: { name: "Enterprise Agents", obj: "Diagnosticar empresas y desplegar legiones de agentes con ROI medible." },
  C: { name: "Por definir", obj: "Reservada para el tercer negocio. Sin tareas hasta definirlo." },
  G: { name: "General", obj: "Operación, documentos, Mission Control, costos y equipo." },
};

export const WEEKS: Record<number, { label: string; from: string; to: string }> = {
  1: { label: "Semana 1 · 19–23 nov", from: "2026-11-19", to: "2026-11-23" },
  2: { label: "Semana 2 · 24–30 nov", from: "2026-11-24", to: "2026-11-30" },
  3: { label: "Semana 3 · 1–7 dic", from: "2026-12-01", to: "2026-12-07" },
  4: { label: "Semana 4 · 8–14 dic", from: "2026-12-08", to: "2026-12-14" },
  0: { label: "Sin semana", from: "", to: "" },
};

const PRIO_RANK: Record<Prioridad, number> = { alta: 0, media: 1, baja: 2 };

function str(x: unknown): string {
  return typeof x === "string" ? x : "";
}

export function normTask(d: Doc): Task {
  const estado = (ESTADOS.some((e) => e.key === d.estado) ? d.estado : "backlog") as Estado;
  const quien = (PERSON_KEYS.includes(d.quien) ? d.quien : "todos") as Person;
  const unidad = (["A", "B", "C", "G"].includes(d.unidad) ? d.unidad : "G") as Unidad;
  const prioridad = (["alta", "media", "baja"].includes(d.prioridad) ? d.prioridad : "media") as Prioridad;
  return {
    _id: d._id,
    id: str(d.id) || d._id,
    titulo: str(d.titulo),
    quien,
    unidad,
    semana: Number(d.semana) || 0,
    estado,
    prioridad,
    vence: /^\d{4}-\d{2}-\d{2}$/.test(str(d.vence)) ? d.vence : "",
    esfuerzo: Number(d.esfuerzo) || 0,
    depende: Array.isArray(d.depende) ? d.depende.filter((x: unknown) => typeof x === "string" && x) : [],
    subtareas: Array.isArray(d.subtareas)
      ? d.subtareas.filter((s: unknown) => !!s && typeof (s as Sub).t === "string").map((s: Sub) => ({ t: s.t, ok: !!s.ok }))
      : [],
    criterio: str(d.criterio),
    detalle: str(d.detalle),
    comando: str(d.comando),
    evidencia: str(d.evidencia),
    bloqueo: str(d.bloqueo),
    hoy: str(d.hoy),
    orden: Number(d.orden) || 0,
    actualizado: str(d.actualizado),
    por: str(d.por),
  };
}

// ---------- Fechas (día de calendario local) ----------
const pad = (n: number) => (n < 10 ? "0" : "") + n;
export function todayStr(d = new Date()): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
export function dayNum(s: string): number {
  const [y, m, d] = s.split("-").map(Number);
  return Date.UTC(y, m - 1, d) / 86400000;
}
export function fmtDay(s: string, opts: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short" }): string {
  if (!s) return "";
  const [y, m, d] = s.split("-").map(Number);
  try {
    return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("es-CO", { ...opts, timeZone: "UTC" });
  } catch {
    return s;
  }
}
export function fmtStamp(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleString("es-CO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}
export function ago(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const h = (Date.now() - d.getTime()) / 3600000;
  if (h < 1) return "hace menos de una hora";
  if (h < 48) return `hace ${Math.round(h)} h`;
  return `hace ${Math.round(h / 24)} días`;
}
export function currentWeek(today = todayStr()): number {
  for (const w of [1, 2, 3, 4]) if (today >= WEEKS[w].from && today <= WEEKS[w].to) return w;
  return 0;
}

// ---------- Reglas ----------
export const isClosed = (t: Task) => t.estado === "done" || t.estado === "canceled";
export function pendingDeps(t: Task, byId: Map<string, Task>): Task[] {
  return t.depende.map((id) => byId.get(id)).filter((d): d is Task => !!d && !isClosed(d));
}
export function isWaiting(t: Task, byId: Map<string, Task>): boolean {
  return (t.estado === "backlog" || t.estado === "ready") && pendingDeps(t, byId).length > 0;
}
export function isLate(t: Task, today = todayStr()): boolean {
  return !!t.vence && !isClosed(t) && dayNum(t.vence) < dayNum(today);
}
export function isPinned(t: Task, today = todayStr()): boolean {
  return t.hoy === today && !isClosed(t);
}
export function forPerson(t: Task, p: Person): boolean {
  return t.quien === p || (t.quien === "todos" && p !== "claude");
}
export function dueInfo(t: Task, today = todayStr()): { tone: "bad" | "warn" | "none"; text: string } | null {
  if (!t.vence || isClosed(t)) return null;
  const diff = dayNum(t.vence) - dayNum(today);
  if (diff < 0) return { tone: "bad", text: `Atrasada · ${fmtDay(t.vence)}` };
  if (diff === 0) return { tone: "warn", text: "Vence hoy" };
  if (diff === 1) return { tone: "warn", text: "Vence mañana" };
  return { tone: "none", text: fmtDay(t.vence) };
}
export function sortTasks(a: Task, b: Task): number {
  const ca = isClosed(a) ? 1 : 0, cb = isClosed(b) ? 1 : 0;
  if (ca !== cb) return ca - cb;
  const la = isLate(a) ? 0 : 1, lb = isLate(b) ? 0 : 1;
  if (la !== lb) return la - lb;
  if (PRIO_RANK[a.prioridad] !== PRIO_RANK[b.prioridad]) return PRIO_RANK[a.prioridad] - PRIO_RANK[b.prioridad];
  const va = a.vence || "9999", vb = b.vence || "9999";
  if (va !== vb) return va < vb ? -1 : 1;
  return a.orden - b.orden;
}
export function suggestions(tasks: Task[], p: Person, byId: Map<string, Task>): Task[] {
  const rank: Partial<Record<Estado, number>> = { in_progress: 0, review: 1, ready: 2, blocked: 3 };
  return tasks
    .filter((t) => forPerson(t, p) && !isClosed(t) && !isPinned(t) && !isWaiting(t, byId) && t.estado !== "backlog")
    .sort((a, b) => {
      if (isLate(a) !== isLate(b)) return isLate(a) ? -1 : 1;
      if (PRIO_RANK[a.prioridad] !== PRIO_RANK[b.prioridad]) return PRIO_RANK[a.prioridad] - PRIO_RANK[b.prioridad];
      const ra = rank[a.estado] ?? 9, rb = rank[b.estado] ?? 9;
      if (ra !== rb) return ra - rb;
      return sortTasks(a, b);
    });
}
const PREFIX: Record<Person, string> = { santiago: "S", felipe: "F", claude: "C", todos: "T" };
export function nextCode(tasks: Task[], quien: Person): string {
  const p = PREFIX[quien];
  let max = 0;
  for (const t of tasks) {
    const m = /^([A-Z])(\d+)$/.exec(t.id);
    if (m && m[1] === p) max = Math.max(max, Number(m[2]));
  }
  return p + (max + 1);
}
export function makesCycle(selfId: string, deps: string[], byId: Map<string, Task>): boolean {
  const seen = new Set<string>();
  const stack = [...deps];
  while (stack.length) {
    const id = stack.pop()!;
    if (id === selfId) return true;
    if (seen.has(id)) continue;
    seen.add(id);
    const t = byId.get(id);
    if (t) stack.push(...t.depende);
  }
  return false;
}

// ---------- Cuentas y decisiones ----------
export const ACC_STATES = [
  { key: "idea", label: "Idea" },
  { key: "por_crear", label: "Por crear" },
  { key: "por_conectar", label: "Por conectar" },
  { key: "activa", label: "Activa" },
  { key: "pausada", label: "Pausada" },
] as const;
export const RIGHTS = [
  { key: "autorizado", label: "Autorizado" },
  { key: "propio", label: "Propio" },
  { key: "transformado", label: "Transformado" },
  { key: "sin_verificar", label: "Sin verificar" },
] as const;
export const PLATFORMS = ["TikTok", "YouTube", "Instagram", "Facebook", "Varias"] as const;
