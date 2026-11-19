"use client";

import { useState } from "react";
import type { Person, Task } from "@/lib/model";
import { PEOPLE, UNITS, currentWeek, fmtDay, forPerson, isClosed, isLate, isPinned, isWaiting, sortTasks, suggestions, todayStr } from "@/lib/model";
import { useMC } from "../App";
import TaskCard, { useTaskActions } from "../TaskCard";
import { Avatar, IconPlus, IconX, PERSON_TEXT } from "../ui";

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Buenos días" : h < 19 ? "Buenas tardes" : "Buenas noches";
}

export default function Today() {
  const { me, tasks, byId, pipeline, go, setFilter, open } = useMC();
  const [who, setWho] = useState<Person>(me);
  const actions = useTaskActions();
  const today = todayStr();

  const mine = tasks.filter((t) => forPerson(t, who));
  const pinned = mine.filter((t) => isPinned(t, today)).sort(sortTasks).slice(0, 3);
  const sugg = suggestions(tasks, who, byId).slice(0, 4);
  const open_ = tasks.filter((t) => !isClosed(t));
  const late = open_.filter((t) => isLate(t, today)).sort(sortTasks);
  const week = currentWeek(today);
  const blocked = open_
    .filter((t) => t.estado === "blocked" || (isWaiting(t, byId) && t.estado === "ready" && t.semana > 0 && t.semana <= week))
    .sort(sortTasks);
  const review = open_.filter((t) => t.estado === "review").sort(sortTasks);
  const done = tasks.filter((t) => t.estado === "done").length;
  const myOpen = mine.filter((t) => !isClosed(t)).length;
  const hours = pinned.reduce((s, t) => s + t.esfuerzo, 0);

  const pt = pipeline.reduce(
    (a, p) => {
      const d = p.derechos || {};
      const pub = p.publicaciones || {};
      const ver = (Number(d.autorizado) || 0) + (Number(d.propio) || 0);
      a.ver += ver;
      a.total += ver + (Number(d.transformado) || 0) + (Number(d.sin_verificar) || 0);
      a.publicados += Number(pub.publicado) || 0;
      a.bandeja += Number(pub.en_borradores) || 0;
      a.aprob += Number(p.pendientes_aprobacion) || 0;
      return a;
    },
    { ver: 0, total: 0, publicados: 0, bandeja: 0, aprob: 0 },
  );
  const rightsPct = pt.total ? Math.round((100 * pt.ver) / pt.total) : null;

  return (
    <div className="grid gap-6">
      {/* Saludo */}
      <section>
        <p className="text-sm text-muted first-letter:uppercase">{fmtDay(today, { weekday: "long", day: "numeric", month: "long" })}</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          {greeting()}, {PEOPLE[me].name}
        </h2>
        <p className="mt-1 text-sm text-muted">
          {myOpen} tareas abiertas para ti{late.length ? ` · ${late.length} atrasadas en el equipo` : ""}
          {review.length ? ` · ${review.length} esperan revisión` : ""}
        </p>
      </section>

      {/* Mi día */}
      <section className="rounded-3xl border border-line bg-surface p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-lg font-semibold tracking-tight">{who === me ? "Mi día" : `El día de ${PEOPLE[who].name}`}</h3>
          <span className="text-sm text-muted tabular">
            {pinned.length}/3{hours ? ` · ${hours} h` : ""}
          </span>
          <div className="ml-auto flex gap-1 rounded-full bg-sunken p-1">
            {(["santiago", "felipe", "claude"] as Person[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setWho(p)}
                aria-pressed={who === p}
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition ${who === p ? "bg-surface shadow-sm" : "text-muted"}`}
              >
                <Avatar p={p} size="sm" />
                <span className="hidden sm:inline">{PEOPLE[p].name}</span>
              </button>
            ))}
          </div>
        </div>

        <ol className="mt-4 grid gap-2">
          {pinned.map((t, i) => (
            <li key={t._id} className="flex items-center gap-2">
              <span className="w-5 text-center text-lg font-semibold text-muted tabular">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <TaskCard t={t} />
              </div>
              <button type="button" onClick={() => actions.pin(t, false)} className="grid size-8 place-items-center rounded-full text-muted hover:bg-sunken hover:text-ink" aria-label={`Quitar ${t.id} de hoy`}>
                <IconX />
              </button>
            </li>
          ))}
          {Array.from({ length: 3 - pinned.length }).map((_, i) => (
            <li key={"e" + i} className="flex items-center gap-2">
              <span className="w-5 text-center text-lg font-semibold text-line tabular">{pinned.length + i + 1}</span>
              <div className="flex-1 rounded-2xl border border-dashed border-line px-4 py-3 text-sm text-muted">Elige una tarea de abajo</div>
              <span className="size-8" />
            </li>
          ))}
        </ol>

        {pinned.length < 3 && sugg.length > 0 && (
          <div className="mt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-muted">Sugeridas</p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {sugg.map((t) => (
                <li key={t._id} className="flex items-center gap-2 rounded-2xl bg-sunken px-3 py-2.5">
                  <span className={`font-mono text-[11px] ${PERSON_TEXT[t.quien]}`}>{t.id}</span>
                  <button type="button" onClick={() => open("task", t._id)} className="min-w-0 flex-1 truncate text-left text-sm font-medium hover:underline">
                    {t.titulo}
                  </button>
                  <button
                    type="button"
                    onClick={() => actions.pin(t, true, who === "claude" ? me : (who as "santiago" | "felipe"))}
                    className="flex shrink-0 items-center gap-1 rounded-full bg-surface px-2.5 py-1 text-xs font-semibold shadow-sm hover:bg-ink hover:text-surface"
                  >
                    <IconPlus className="size-3.5" /> Hoy
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Números */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        <Kpi value={`${done}/${tasks.length}`} label="tareas hechas" tone="ok" />
        <Kpi value={late.length} label="atrasadas" tone={late.length ? "bad" : undefined} />
        <Kpi value={review.length} label="por revisar" tone={review.length ? "warn" : undefined} />
        <Kpi value={pt.publicados} label="videos publicados" />
        <Kpi value={pt.bandeja} label="en bandeja de TikTok" />
        <Kpi value={pt.aprob} label="clips por aprobar" tone={pt.aprob ? "warn" : undefined} />
        <Kpi value={rightsPct == null ? "—" : `${rightsPct} %`} label="clips con derechos claros" tone={rightsPct != null && rightsPct < 50 ? "bad" : "ok"} />
      </section>

      {/* Equipo */}
      <section className="grid gap-3 md:grid-cols-3">
        <ListBox title="Atrasadas" items={late} empty="Nada atrasado." tone="bad" />
        <ListBox title="Bloqueadas o esperando" items={blocked} empty="Nada bloqueado." />
        <ListBox title="Por revisar" items={review} empty="Nada por revisar." tone="warn" />
      </section>

      {/* Unidades */}
      <section className="grid gap-3 md:grid-cols-3">
        {(["A", "B", "C"] as const).map((u) => {
          const ut = tasks.filter((t) => t.unidad === u);
          const ud = ut.filter((t) => t.estado === "done").length;
          const pct = ut.length ? Math.round((100 * ud) / ut.length) : 0;
          return (
            <button
              key={u}
              type="button"
              onClick={() => {
                setFilter({ unit: u, who: "all" });
                go("tareas");
              }}
              className="rounded-3xl border border-line bg-surface p-5 text-left transition hover:shadow-md"
            >
              <p className="font-mono text-xs text-muted">Unidad {u}</p>
              <p className="mt-1 text-lg font-semibold tracking-tight">{UNITS[u].name}</p>
              <p className="mt-1 text-sm text-muted">{UNITS[u].obj}</p>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-sunken">
                <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-2 text-xs text-muted tabular">{ut.length ? `${ud} de ${ut.length} tareas hechas` : "Sin tareas"}</p>
            </button>
          );
        })}
      </section>
    </div>
  );
}

function Kpi({ value, label, tone }: { value: React.ReactNode; label: string; tone?: "ok" | "bad" | "warn" }) {
  const c = tone === "bad" ? "text-bad" : tone === "warn" ? "text-warn" : tone === "ok" ? "text-ok" : "";
  return (
    <div className="rounded-2xl border border-line bg-surface px-4 py-3">
      <p className={`text-2xl font-semibold tracking-tight tabular ${c}`}>{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}

function ListBox({ title, items, empty, tone }: { title: string; items: Task[]; empty: string; tone?: "bad" | "warn" }) {
  const { open } = useMC();
  return (
    <div className="rounded-3xl border border-line bg-surface p-4">
      <div className="mb-2 flex items-center gap-2">
        <h3 className="text-sm font-semibold">{title}</h3>
        <span className={`text-xs tabular ${tone === "bad" && items.length ? "text-bad" : tone === "warn" && items.length ? "text-warn" : "text-muted"}`}>{items.length}</span>
      </div>
      {items.length ? (
        <ul className="grid gap-1">
          {items.slice(0, 6).map((t) => (
            <li key={t._id}>
              <button type="button" onClick={() => open("task", t._id)} className="flex w-full items-baseline gap-2 rounded-lg px-1.5 py-1 text-left text-sm hover:bg-sunken">
                <span className={`font-mono text-[11px] ${PERSON_TEXT[t.quien]}`}>{t.id}</span>
                <span className="min-w-0 flex-1 truncate">{t.titulo}</span>
              </button>
            </li>
          ))}
          {items.length > 6 && <li className="px-1.5 pt-1 text-xs text-muted">y {items.length - 6} más</li>}
        </ul>
      ) : (
        <p className="text-sm text-muted">{empty}</p>
      )}
    </div>
  );
}
