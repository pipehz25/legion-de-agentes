"use client";

import { useState } from "react";
import type { Person, Task } from "@/lib/model";
import { COLUMNS, PEOPLE, WEEKS, currentWeek, nextCode, sortTasks } from "@/lib/model";
import { useMC } from "../App";
import TaskCard, { useTaskActions } from "../TaskCard";
import { Avatar, IconPlus } from "../ui";

export default function Board() {
  const { me, tasks, filter, setFilter, create, open } = useMC();
  const actions = useTaskActions();
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState<string | null>(null);
  const [showBacklog, setShowBacklog] = useState(false);
  const [showAllDone, setShowAllDone] = useState(false);

  const visible = tasks.filter((t) => {
    if (filter.who === "me" && !(t.quien === me || t.quien === "todos")) return false;
    if (filter.who !== "me" && filter.who !== "all" && t.quien !== filter.who) return false;
    if (filter.unit !== "all" && t.unidad !== filter.unit) return false;
    if (filter.week !== "all" && String(t.semana) !== filter.week) return false;
    return true;
  });

  async function quickAdd(e: React.FormEvent) {
    e.preventDefault();
    const t = title.trim();
    if (!t || busy) return;
    setBusy(true);
    const quien: Person = filter.who === "me" || filter.who === "all" ? me : filter.who;
    const orden = tasks.reduce((m, x) => Math.max(m, x.orden), 0) + 1;
    const id = await create("tareas", {
      id: nextCode(tasks, quien),
      titulo: t,
      quien,
      unidad: filter.unit === "all" ? "A" : filter.unit,
      semana: filter.week === "all" ? currentWeek() : Number(filter.week),
      estado: "ready",
      prioridad: "media",
      vence: "",
      esfuerzo: 0,
      depende: [],
      subtareas: [],
      orden,
      creado: new Date().toISOString(),
      creadoPor: me,
    });
    setBusy(false);
    if (id) {
      setTitle("");
      open("task", id);
    }
  }

  function drop(col: (typeof COLUMNS)[number], e: React.DragEvent) {
    e.preventDefault();
    setOver(null);
    const id = e.dataTransfer.getData("text/plain");
    const t = tasks.find((x) => x._id === id);
    if (!t || col.estados.includes(t.estado)) return;
    actions.move(t, col.drop);
  }

  const whoOptions: { key: typeof filter.who; label: string; p?: Person }[] = [
    { key: "me", label: "Mías" },
    { key: "all", label: "Todas" },
    { key: "santiago", label: "Santiago", p: "santiago" },
    { key: "felipe", label: "Felipe", p: "felipe" },
    { key: "claude", label: "Claude", p: "claude" },
  ];

  return (
    <div className="grid gap-4">
      {/* Agregar rápido */}
      <form onSubmit={quickAdd} className="flex items-center gap-2 rounded-2xl border border-line bg-surface p-2 pl-4 focus-within:border-primary">
        <IconPlus className="size-5 text-muted" />
        <label htmlFor="quick" className="sr-only">
          Nueva tarea
        </label>
        <input
          id="quick"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={`Nueva tarea para ${filter.who === "me" || filter.who === "all" ? "ti" : PEOPLE[filter.who].name}… y Enter`}
          className="min-w-0 flex-1 bg-transparent py-2 text-[15px] outline-none placeholder:text-muted"
          maxLength={160}
        />
        <button type="submit" disabled={!title.trim() || busy} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-ink transition disabled:opacity-40">
          {busy ? "Creando…" : "Crear"}
        </button>
      </form>

      {/* Filtros */}
      <div className="no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {whoOptions.map((o) => (
          <button
            key={o.key}
            type="button"
            onClick={() => setFilter({ who: o.key })}
            aria-pressed={filter.who === o.key}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
              filter.who === o.key ? "border-ink bg-ink text-surface" : "border-line bg-surface text-muted hover:text-ink"
            }`}
          >
            {o.p && <Avatar p={o.p} size="sm" />}
            {o.label}
          </button>
        ))}
        <span className="mx-1 h-5 w-px shrink-0 bg-line" />
        <select
          aria-label="Semana"
          value={filter.week}
          onChange={(e) => setFilter({ week: e.target.value })}
          className="shrink-0 rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-ink"
        >
          <option value="all">Todas las semanas</option>
          {[1, 2, 3, 4, 0].map((w) => (
            <option key={w} value={String(w)}>
              {WEEKS[w].label}
            </option>
          ))}
        </select>
        <select
          aria-label="Unidad"
          value={filter.unit}
          onChange={(e) => setFilter({ unit: e.target.value as typeof filter.unit })}
          className="shrink-0 rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-ink"
        >
          <option value="all">Todas las unidades</option>
          <option value="A">A · Media</option>
          <option value="B">B · Enterprise</option>
          <option value="C">C · Por definir</option>
          <option value="G">General</option>
        </select>
      </div>

      {/* Tablero */}
      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0">
        {COLUMNS.map((col) => {
          let items = visible.filter((t) => col.estados.includes(t.estado)).sort(sortTasks);
          const backlog = col.key === "todo" ? items.filter((t) => t.estado === "backlog") : [];
          if (col.key === "todo") items = items.filter((t) => t.estado !== "backlog");
          const total = items.length + backlog.length;
          const doneHidden = col.key === "done" && !showAllDone && items.length > 6 ? items.length - 6 : 0;
          if (doneHidden) items = items.slice(0, 6);
          return (
            <section
              key={col.key}
              aria-label={col.label}
              onDragOver={(e) => {
                e.preventDefault();
                setOver(col.key);
              }}
              onDragLeave={() => setOver((o) => (o === col.key ? null : o))}
              onDrop={(e) => drop(col, e)}
              className={`flex w-[84vw] max-w-sm shrink-0 snap-start flex-col gap-2 rounded-3xl p-2.5 transition md:w-auto md:max-w-none ${
                over === col.key ? "bg-primary/10 ring-2 ring-primary/40" : "bg-sunken"
              }`}
            >
              <div className="flex items-center gap-2 px-1.5 pt-1">
                <h3 className="text-sm font-semibold">{col.label}</h3>
                <span className="text-xs text-muted tabular">{total}</span>
              </div>
              {items.map((t) => (
                <TaskCard key={t._id} t={t} draggable />
              ))}
              {doneHidden > 0 && (
                <button type="button" onClick={() => setShowAllDone(true)} className="rounded-xl py-2 text-xs font-medium text-muted hover:text-ink">
                  Ver {doneHidden} más
                </button>
              )}
              {backlog.length > 0 && (
                <div className="mt-1">
                  <button type="button" onClick={() => setShowBacklog((s) => !s)} className="w-full rounded-xl px-2 py-1.5 text-left text-xs font-semibold uppercase tracking-[0.08em] text-muted hover:text-ink" aria-expanded={showBacklog}>
                    {showBacklog ? "▾" : "▸"} Backlog · {backlog.length}
                  </button>
                  {showBacklog && (
                    <div className="mt-1 grid gap-2">
                      {backlog.map((t: Task) => (
                        <TaskCard key={t._id} t={t} draggable dense />
                      ))}
                    </div>
                  )}
                </div>
              )}
              {total === 0 && <p className="px-2 py-6 text-center text-xs text-muted">Arrastra una tarea aquí</p>}
            </section>
          );
        })}
      </div>
      <p className="hidden text-xs text-muted md:block">Arrastra las tarjetas entre columnas. Toca una tarjeta para ver y editar todo; se guarda solo.</p>
    </div>
  );
}
