"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import type { Doc, Person, Task } from "@/lib/model";
import { PEOPLE, isClosed, normTask } from "@/lib/model";
import { Avatar, IconBoard, IconHome, IconLogout, IconPulse, IconScale, IconUsers, ToastHost, useToast } from "./ui";
import Today from "./views/Today";
import Board from "./views/Board";
import Accounts from "./views/Accounts";
import Pipeline from "./views/Pipeline";
import Decisions from "./views/Decisions";
import TaskSheet from "./sheets/TaskSheet";
import AccountSheet from "./sheets/AccountSheet";
import DecisionSheet from "./sheets/DecisionSheet";
import PasswordSheet from "./sheets/PasswordSheet";
import { IconLock } from "./ui";

export type Me = "santiago" | "felipe";
type Col = "tareas" | "cuentas" | "decisiones" | "pipeline";
type State = { me: Me; tareas: Doc[]; cuentas: Doc[]; decisiones: Doc[]; pipeline: Doc[]; now: string };
type Modal = { kind: "task" | "account" | "decision"; id: string | null } | null;

interface MC {
  me: Me;
  loaded: boolean;
  tasks: Task[];
  byId: Map<string, Task>;
  cuentas: Doc[];
  decisiones: Doc[];
  pipeline: Doc[];
  patch: (col: Col, id: string, data: Record<string, unknown>, quiet?: boolean) => Promise<boolean>;
  create: (col: Col, data: Record<string, unknown>, id?: string) => Promise<string | null>;
  remove: (col: Col, id: string) => Promise<boolean>;
  open: (kind: "task" | "account" | "decision", id: string | null) => void;
  go: (tab: Tab) => void;
  setFilter: (f: Partial<BoardFilter>) => void;
  filter: BoardFilter;
}
export type BoardFilter = { who: "me" | "all" | Person; unit: "all" | "A" | "B" | "C" | "G"; week: "all" | string };

const Ctx = createContext<MC | null>(null);
export function useMC(): MC {
  const c = useContext(Ctx);
  if (!c) throw new Error("useMC fuera de App");
  return c;
}

const TABS = [
  { key: "hoy", label: "Hoy", icon: IconHome },
  { key: "tareas", label: "Tareas", icon: IconBoard },
  { key: "cuentas", label: "Cuentas", icon: IconUsers },
  { key: "pipeline", label: "Pipeline", icon: IconPulse },
  { key: "decisiones", label: "Decisiones", icon: IconScale },
] as const;
export type Tab = (typeof TABS)[number]["key"];

async function fetcher(url: string): Promise<State> {
  const r = await fetch(url, { cache: "no-store" });
  if (r.status === 401) {
    window.location.href = "/login";
    throw new Error("Sesión vencida");
  }
  if (!r.ok) throw new Error(`Error ${r.status}`);
  return r.json() as Promise<State>;
}

export default function App({ me }: { me: Me }) {
  return (
    <ToastHost>
      <Shell me={me} />
    </ToastHost>
  );
}

function Shell({ me }: { me: Me }) {
  const toast = useToast();
  const { data, error, mutate } = useSWR<State>("/api/state", fetcher, {
    refreshInterval: 8000,
    revalidateOnFocus: true,
    keepPreviousData: true,
  });
  const [tab, setTab] = useState<Tab>("hoy");
  const [modal, setModal] = useState<Modal>(null);
  const [filter, setFilterState] = useState<BoardFilter>({ who: "me", unit: "all", week: "all" });
  const [menu, setMenu] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);

  // Pestaña en el enlace (#tareas, #cuentas…)
  useEffect(() => {
    const read = () => {
      const h = window.location.hash.replace("#", "");
      if (TABS.some((t) => t.key === h)) setTab(h as Tab);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);
  const go = useCallback((t: Tab) => {
    setTab(t);
    if (window.location.hash !== "#" + t) history.replaceState(null, "", "#" + t);
    window.scrollTo({ top: 0 });
  }, []);

  const tasks = useMemo(() => (data?.tareas ?? []).map(normTask), [data?.tareas]);
  const byId = useMemo(() => new Map(tasks.map((t) => [t._id, t])), [tasks]);

  const patch = useCallback<MC["patch"]>(
    async (col, id, change, quiet) => {
      await mutate((cur) => (cur ? { ...cur, [col]: cur[col].map((d) => (d._id === id ? { ...d, ...change } : d)) } : cur), { revalidate: false });
      try {
        const r = await fetch(`/api/docs/${col}/${encodeURIComponent(id)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: change }),
        });
        if (!r.ok) {
          const j = (await r.json().catch(() => ({}))) as { error?: string };
          toast(j.error || "No se guardó el cambio.", "bad");
          mutate();
          return false;
        }
        if (!quiet) mutate();
        return true;
      } catch {
        toast("Sin conexión: no se guardó el cambio.", "bad");
        mutate();
        return false;
      }
    },
    [mutate, toast],
  );

  const create = useCallback<MC["create"]>(
    async (col, doc, id) => {
      try {
        const r = await fetch(`/api/docs/${col}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, data: doc }),
        });
        const j = (await r.json().catch(() => ({}))) as { id?: string; error?: string };
        if (!r.ok || !j.id) {
          toast(j.error || "No se pudo crear.", "bad");
          return null;
        }
        await mutate();
        return j.id;
      } catch {
        toast("Sin conexión: no se pudo crear.", "bad");
        return null;
      }
    },
    [mutate, toast],
  );

  const remove = useCallback<MC["remove"]>(
    async (col, id) => {
      await mutate((cur) => (cur ? { ...cur, [col]: cur[col].filter((d) => d._id !== id) } : cur), { revalidate: false });
      try {
        const r = await fetch(`/api/docs/${col}/${encodeURIComponent(id)}`, { method: "DELETE" });
        if (!r.ok) {
          toast("No se pudo borrar.", "bad");
          mutate();
          return false;
        }
        mutate();
        return true;
      } catch {
        toast("Sin conexión: no se pudo borrar.", "bad");
        mutate();
        return false;
      }
    },
    [mutate, toast],
  );

  const open = useCallback((kind: "task" | "account" | "decision", id: string | null) => setModal({ kind, id }), []);
  const close = useCallback(() => setModal(null), []);
  const setFilter = useCallback((f: Partial<BoardFilter>) => setFilterState((cur) => ({ ...cur, ...f })), []);

  const value: MC = {
    me,
    loaded: !!data,
    tasks,
    byId,
    cuentas: data?.cuentas ?? [],
    decisiones: data?.decisiones ?? [],
    pipeline: data?.pipeline ?? [],
    patch,
    create,
    remove,
    open,
    go,
    filter,
    setFilter,
  };

  const openCount = tasks.filter((t) => !isClosed(t)).length;
  const pendingDecisions = (data?.decisiones ?? []).filter((d) => d.estado === "pendiente").length;
  const badge: Partial<Record<Tab, number>> = { tareas: openCount, decisiones: pendingDecisions };

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <Ctx.Provider value={value}>
      <div className="mx-auto max-w-6xl px-4 pb-28 pt-4 sm:px-6 sm:pb-12" style={{ paddingLeft: "max(16px, env(safe-area-inset-left))", paddingRight: "max(16px, env(safe-area-inset-right))" }}>
        <header className="flex items-center gap-3 py-2">
          <span className="grid size-9 grid-cols-2 gap-[3px] rounded-lg bg-ink p-[7px]" aria-hidden="true">
            <span className="rounded-[3px] bg-santiago" />
            <span className="rounded-[3px] bg-felipe" />
            <span className="rounded-[3px] bg-claude" />
            <span className="rounded-[3px] bg-primary" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Legión de Agentes</p>
            <h1 className="text-lg font-semibold leading-tight tracking-tight">Mission Control</h1>
          </div>
          <nav className="ml-6 hidden items-center gap-1 rounded-full border border-line bg-surface p-1 sm:flex" aria-label="Secciones">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => go(t.key)}
                aria-current={tab === t.key ? "page" : undefined}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                  tab === t.key ? "bg-ink text-surface" : "text-muted hover:text-ink"
                }`}
              >
                {t.label}
                {badge[t.key] ? <span className={`text-[11px] tabular ${tab === t.key ? "text-surface/70" : "text-muted"}`}>{badge[t.key]}</span> : null}
              </button>
            ))}
          </nav>
          <div className="relative ml-auto">
            <button type="button" onClick={() => setMenu((m) => !m)} className="flex items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-3 text-sm font-medium" aria-expanded={menu}>
              <Avatar p={me} />
              <span className="hidden sm:inline">{PEOPLE[me].name}</span>
            </button>
            {menu && (
              <div className="anim-pop absolute right-0 top-11 z-40 w-60 rounded-2xl border border-line bg-surface p-2 shadow-xl">
                <div className="px-3 py-2">
                  <p className="text-sm font-semibold">{PEOPLE[me].name}</p>
                  <p className="text-xs text-muted">{PEOPLE[me].role}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMenu(false);
                    setPwOpen(true);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-sunken"
                >
                  <IconLock /> Cambiar contraseña
                </button>
                <button type="button" onClick={logout} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-sunken">
                  <IconLogout /> Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </header>

        {error && !data && (
          <p className="mt-6 rounded-2xl border border-bad/30 bg-bad/5 px-4 py-3 text-sm text-bad">No se pudo cargar Mission Control. Revisa la conexión; vuelve a intentarlo sola.</p>
        )}
        {error && data && <p className="mt-3 text-xs text-muted">Sin conexión: lo que ves puede estar desactualizado.</p>}

        <main className="mt-4">
          {!data ? (
            <Skeleton />
          ) : tab === "tareas" ? (
            <Board />
          ) : tab === "cuentas" ? (
            <Accounts />
          ) : tab === "pipeline" ? (
            <Pipeline />
          ) : tab === "decisiones" ? (
            <Decisions />
          ) : (
            <Today />
          )}
        </main>
      </div>

      {/* Barra inferior en el celular */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-surface/95 backdrop-blur sm:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)", paddingLeft: "env(safe-area-inset-left, 0px)", paddingRight: "env(safe-area-inset-right, 0px)" }}
        aria-label="Secciones"
      >
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => go(t.key)}
              aria-current={tab === t.key ? "page" : undefined}
              className={`relative flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium ${tab === t.key ? "text-ink" : "text-muted"}`}
            >
              <Icon className="size-5" />
              {t.label}
              {badge[t.key] ? <span className="absolute right-[22%] top-1.5 min-w-4 rounded-full bg-primary px-1 text-[10px] leading-4 text-primary-ink tabular">{badge[t.key]}</span> : null}
            </button>
          );
        })}
      </nav>

      {modal?.kind === "task" && <TaskSheet id={modal.id} onClose={close} />}
      {modal?.kind === "account" && <AccountSheet id={modal.id} onClose={close} />}
      {modal?.kind === "decision" && <DecisionSheet id={modal.id} onClose={close} />}
      {pwOpen && <PasswordSheet onClose={() => setPwOpen(false)} />}
      {menu && <button type="button" aria-label="Cerrar menú" className="fixed inset-0 z-30 cursor-default" onClick={() => setMenu(false)} />}
    </Ctx.Provider>
  );
}

function Skeleton() {
  return (
    <div className="grid gap-4" aria-busy="true" aria-label="Cargando">
      <div className="h-8 w-64 animate-pulse rounded-lg bg-sunken" />
      <div className="h-48 animate-pulse rounded-3xl bg-sunken" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-2xl bg-sunken" />
        ))}
      </div>
    </div>
  );
}
