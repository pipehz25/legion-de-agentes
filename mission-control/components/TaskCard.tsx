"use client";

import type { Task } from "@/lib/model";
import { dueInfo, isPinned, isWaiting, pendingDeps } from "@/lib/model";
import { useMC } from "./App";
import { Avatar, CheckButton, Chip, IconStar, PERSON_TEXT, useToast } from "./ui";

export function useTaskActions() {
  const { patch, me, byId, tasks } = useMC();
  const toast = useToast();
  const stamp = () => ({ actualizado: new Date().toISOString(), por: me });
  return {
    toggleDone(t: Task) {
      if (t.estado === "done") return patch("tareas", t._id, { estado: "in_progress", ...stamp() });
      if (isWaiting(t, byId)) {
        toast(`Espera a ${pendingDeps(t, byId).map((d) => d.id).join(", ")}.`);
        return;
      }
      toast(`${t.id} hecha ✓`, "ok");
      return patch("tareas", t._id, { estado: "done", hoy: "", ...stamp() });
    },
    move(t: Task, estado: Task["estado"]) {
      if (t.estado === estado) return;
      const forward = estado === "in_progress" || estado === "review" || estado === "done";
      if (forward && isWaiting(t, byId)) {
        toast(`No se puede empezar: espera a ${pendingDeps(t, byId).map((d) => d.id).join(", ")}.`);
        return;
      }
      return patch("tareas", t._id, { estado, ...stamp() });
    },
    pin(t: Task, on: boolean, forWhom: "santiago" | "felipe" = me) {
      if (on) {
        const today = new Date();
        const pinnedCount = tasks.filter((x) => isPinned(x) && (x.quien === forWhom || x.quien === "todos")).length;
        if (pinnedCount >= 3) {
          toast("Ya hay 3 prioridades para hoy. Quita una antes.");
          return;
        }
        const d = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
        return patch("tareas", t._id, { hoy: d });
      }
      return patch("tareas", t._id, { hoy: "" });
    },
  };
}

export default function TaskCard({ t, draggable = false, dense = false }: { t: Task; draggable?: boolean; dense?: boolean }) {
  const { byId, open } = useMC();
  const actions = useTaskActions();
  const waiting = isWaiting(t, byId);
  const due = dueInfo(t);
  const subOk = t.subtareas.filter((s) => s.ok).length;
  const done = t.estado === "done";
  return (
    <div
      role="button"
      tabIndex={0}
      draggable={draggable}
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", t._id);
        e.dataTransfer.effectAllowed = "move";
      }}
      onClick={() => open("task", t._id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open("task", t._id);
        }
      }}
      className={`group flex cursor-pointer gap-3 rounded-2xl border bg-surface p-3 text-left transition hover:-translate-y-px hover:shadow-md ${
        due?.tone === "bad" ? "border-bad/50" : waiting ? "border-dashed border-line" : "border-line"
      } ${done ? "opacity-60" : ""}`}
    >
      <CheckButton done={done} disabled={waiting && !done} onClick={() => actions.toggleDone(t)} label={done ? `Reabrir ${t.id}` : `Marcar ${t.id} como hecha`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className={`font-mono text-[11px] font-medium ${PERSON_TEXT[t.quien]}`}>{t.id}</span>
          {isPinned(t) && <IconStar className="size-3.5 text-warn" />}
          <span className="ml-auto">
            <Avatar p={t.quien} size="sm" />
          </span>
        </div>
        <p className={`mt-0.5 text-[14px] font-medium leading-snug ${done ? "line-through" : ""}`}>{t.titulo}</p>
        {!dense && (
          <div className="mt-2 flex flex-wrap gap-1">
            {t.prioridad === "alta" && !done && <Chip tone="alert">Alta</Chip>}
            {t.estado === "blocked" && <Chip tone="bad">Bloqueada</Chip>}
            {t.estado === "backlog" && <Chip>Backlog</Chip>}
            {due && <Chip tone={due.tone === "none" ? "neutral" : due.tone}>{due.text}</Chip>}
            {waiting && <Chip tone="neutral">Espera a {pendingDeps(t, byId).map((d) => d.id).join(", ")}</Chip>}
            {t.esfuerzo > 0 && !done && <Chip>{t.esfuerzo} h</Chip>}
          </div>
        )}
        {t.subtareas.length > 0 && (
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-sunken">
              <div className="h-full rounded-full bg-ok transition-all" style={{ width: `${Math.round((100 * subOk) / t.subtareas.length)}%` }} />
            </div>
            <span className="text-[11px] text-muted tabular">
              {subOk}/{t.subtareas.length}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
