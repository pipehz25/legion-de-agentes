"use client";

import { useState } from "react";
import type { Estado, Person, Prioridad, Task, Unidad } from "@/lib/model";
import { ESTADOS, ESTADO_LABEL, PEOPLE, PERSON_KEYS, UNITS, WEEKS, fmtStamp, isPinned, isWaiting, makesCycle, nextCode, pendingDeps } from "@/lib/model";
import { useMC } from "../App";
import { useTaskActions } from "../TaskCard";
import { Avatar, Chip, IconCopy, IconStar, IconTrash, IconX, PERSON_TEXT, Sheet, useDraft, useToast } from "../ui";

const FORWARD: Estado[] = ["in_progress", "review", "done"];

export default function TaskSheet({ id, onClose }: { id: string | null; onClose: () => void }) {
  const { byId } = useMC();
  const t = id ? byId.get(id) : undefined;
  return (
    <Sheet open onClose={onClose} label={t ? `Tarea ${t.id}` : "Tarea"}>
      {t ? (
        <Body key={t._id} t={t} onClose={onClose} />
      ) : (
        <div className="p-6">
          <p className="text-sm text-muted">Esta tarea ya no existe.</p>
          <button type="button" onClick={onClose} className="mt-4 rounded-xl border border-line px-4 py-2 text-sm">
            Cerrar
          </button>
        </div>
      )}
    </Sheet>
  );
}

function Body({ t, onClose }: { t: Task; onClose: () => void }) {
  const { tasks, byId, patch, remove, me } = useMC();
  const actions = useTaskActions();
  const toast = useToast();
  const waiting = isWaiting(t, byId);
  const [titulo, setTitulo, tituloChanged] = useDraft(t.titulo);
  const [detalle, setDetalle, detalleChanged] = useDraft(t.detalle);
  const [criterio, setCriterio, criterioChanged] = useDraft(t.criterio);
  const [comando, setComando, comandoChanged] = useDraft(t.comando);
  const [evidencia, setEvidencia, evidenciaChanged] = useDraft(t.evidencia);
  const [bloqueo, setBloqueo, bloqueoChanged] = useDraft(t.bloqueo);
  const [esfuerzo, setEsfuerzo, esfuerzoChanged] = useDraft(t.esfuerzo ? String(t.esfuerzo) : "");
  const [newSub, setNewSub] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const save = (data: Record<string, unknown>) => patch("tareas", t._id, data, true);
  const saveIf = (changed: () => boolean, data: Record<string, unknown>) => {
    if (changed()) save(data);
  };

  function setSubs(subs: Task["subtareas"], startIfNeeded = false) {
    const data: Record<string, unknown> = { subtareas: subs };
    if (startIfNeeded && (t.estado === "ready" || t.estado === "backlog") && !waiting) {
      Object.assign(data, { estado: "in_progress", actualizado: new Date().toISOString(), por: me });
    }
    save(data);
  }

  function addDep(depId: string) {
    if (!depId) return;
    const deps = [...t.depende, depId];
    if (makesCycle(t._id, deps, byId)) {
      toast("Así una tarea quedaría esperándose a sí misma.");
      return;
    }
    save({ depende: deps });
  }

  function changeOwner(p: Person) {
    if (p === t.quien) return;
    save({ quien: p, id: nextCode(tasks, p) });
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(t.comando);
      toast("Comando copiado");
    } catch {
      toast("No se pudo copiar: selecciónalo a mano.");
    }
  }

  const subOk = t.subtareas.filter((s) => s.ok).length;
  const depOptions = tasks.filter((x) => x._id !== t._id && !t.depende.includes(x._id)).sort((a, b) => a.semana - b.semana || a.orden - b.orden);
  const label = "mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-muted";
  const input = "w-full rounded-xl border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-primary";

  return (
    <>
      {/* Cabecera */}
      <div className="flex items-start gap-3 border-b border-line px-5 pb-4 pt-4 sm:px-6">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className={`font-mono text-xs font-medium ${PERSON_TEXT[t.quien]}`}>{t.id}</span>
            <Chip>Unidad {t.unidad}</Chip>
            {t.prioridad === "alta" && <Chip tone="alert">Alta</Chip>}
          </div>
          <textarea
            data-autofocus
            value={titulo}
            rows={1}
            onChange={(e) => setTitulo(e.target.value.replace(/\n/g, " "))}
            onBlur={() => titulo.trim() && saveIf(tituloChanged, { titulo: titulo.trim() })}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                (e.target as HTMLTextAreaElement).blur();
              }
            }}
            aria-label="Título"
            className="w-full resize-none bg-transparent text-xl font-semibold leading-snug tracking-tight outline-none [field-sizing:content]"
          />
        </div>
        <button type="button" onClick={onClose} aria-label="Cerrar" className="grid size-9 shrink-0 place-items-center rounded-full border border-line hover:bg-sunken">
          <IconX />
        </button>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-6 overflow-y-auto overflow-x-hidden px-5 py-5 sm:px-6">
        {/* Estado */}
        <section>
          <span className={label}>Estado</span>
          <div className="flex flex-wrap gap-1.5">
            {ESTADOS.map((e) => {
              const active = t.estado === e.key;
              const locked = waiting && FORWARD.includes(e.key) && !active;
              return (
                <button
                  key={e.key}
                  type="button"
                  disabled={locked}
                  onClick={() => actions.move(t, e.key)}
                  aria-pressed={active}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                    active
                      ? e.key === "done"
                        ? "border-ok bg-ok text-white"
                        : e.key === "blocked"
                          ? "border-bad bg-bad text-white"
                          : "border-ink bg-ink text-surface"
                      : "border-line hover:border-muted"
                  } disabled:cursor-not-allowed disabled:opacity-40`}
                >
                  {e.label}
                </button>
              );
            })}
          </div>
          {waiting && <p className="mt-2 text-sm text-muted">Espera a {pendingDeps(t, byId).map((d) => `${d.id} (${ESTADO_LABEL[d.estado].toLowerCase()})`).join(", ")}. Se puede empezar cuando esté hecha.</p>}
          {t.estado === "blocked" && (
            <input
              value={bloqueo}
              onChange={(e) => setBloqueo(e.target.value)}
              onBlur={() => saveIf(bloqueoChanged, { bloqueo: bloqueo.trim() })}
              placeholder="¿Qué la frena y quién la destraba?"
              aria-label="Motivo del bloqueo"
              className={`${input} mt-2 border-bad/40`}
            />
          )}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {t.estado !== "done" && t.estado !== "canceled" && (
              <button
                type="button"
                onClick={() => actions.pin(t, !isPinned(t))}
                aria-pressed={isPinned(t)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium ${isPinned(t) ? "border-warn bg-warn/10 text-warn" : "border-line"}`}
              >
                <IconStar className="size-4" /> {isPinned(t) ? "En mi día" : "Agregar a mi día"}
              </button>
            )}
            {t.actualizado && (
              <span className="text-xs text-muted">
                {ESTADO_LABEL[t.estado]} · {PEOPLE[(PERSON_KEYS.includes(t.por as Person) ? t.por : "todos") as Person].name} · {fmtStamp(t.actualizado)}
              </span>
            )}
          </div>
        </section>

        {/* Responsable */}
        <section>
          <span className={label}>Responsable</span>
          <div className="flex flex-wrap gap-2">
            {PERSON_KEYS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => changeOwner(p)}
                aria-pressed={t.quien === p}
                className={`flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-sm font-medium ${t.quien === p ? "border-ink bg-sunken" : "border-line"}`}
              >
                <Avatar p={p} size="sm" /> {PEOPLE[p].name}
              </button>
            ))}
          </div>
        </section>

        {/* Datos */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 [&>*]:min-w-0">
          <div>
            <label htmlFor="ts-vence" className={label}>
              Fecha límite
            </label>
            <input id="ts-vence" type="date" value={t.vence} onChange={(e) => save({ vence: e.target.value })} className={input} />
          </div>
          <div>
            <span className={label}>Prioridad</span>
            <div className="flex rounded-xl border border-line p-0.5">
              {(["alta", "media", "baja"] as Prioridad[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => save({ prioridad: p })}
                  aria-pressed={t.prioridad === p}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-semibold capitalize ${t.prioridad === p ? (p === "alta" ? "bg-bad text-white" : "bg-ink text-surface") : "text-muted"}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="ts-esf" className={label}>
              Horas
            </label>
            <input
              id="ts-esf"
              type="number"
              min="0"
              step="0.5"
              inputMode="decimal"
              value={esfuerzo}
              onChange={(e) => setEsfuerzo(e.target.value)}
              onBlur={() => saveIf(esfuerzoChanged, { esfuerzo: Math.max(0, Number(esfuerzo) || 0) })}
              className={input}
            />
          </div>
          <div>
            <label htmlFor="ts-sem" className={label}>
              Semana
            </label>
            <select id="ts-sem" value={String(t.semana)} onChange={(e) => save({ semana: Number(e.target.value) })} className={input}>
              {[1, 2, 3, 4, 0].map((w) => (
                <option key={w} value={w}>
                  {WEEKS[w].label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2 sm:col-span-2">
            <label htmlFor="ts-uni" className={label}>
              Unidad
            </label>
            <select id="ts-uni" value={t.unidad} onChange={(e) => save({ unidad: e.target.value as Unidad })} className={input}>
              {(Object.keys(UNITS) as Unidad[]).map((u) => (
                <option key={u} value={u}>
                  {u} · {UNITS[u].name}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Pasos */}
        <section>
          <span className={label}>
            Pasos {t.subtareas.length > 0 && <span className="normal-case tracking-normal tabular">· {subOk} de {t.subtareas.length}</span>}
          </span>
          {t.subtareas.length > 0 && (
            <ul className="mb-2 grid gap-0.5">
              {t.subtareas.map((s, i) => (
                <li key={i} className="group flex items-start gap-2.5 rounded-lg px-1 py-1 hover:bg-sunken">
                  <input
                    type="checkbox"
                    checked={s.ok}
                    disabled={waiting}
                    onChange={(e) => setSubs(t.subtareas.map((x, j) => (j === i ? { ...x, ok: e.target.checked } : x)), e.target.checked)}
                    className="mt-1 size-4 shrink-0"
                    aria-label={s.t}
                  />
                  <span className={`flex-1 text-sm ${s.ok ? "text-muted line-through" : ""}`}>{s.t}</span>
                  <button
                    type="button"
                    onClick={() => setSubs(t.subtareas.filter((_, j) => j !== i))}
                    className="grid size-6 place-items-center rounded text-muted opacity-0 hover:text-bad group-hover:opacity-100 focus:opacity-100"
                    aria-label={`Quitar el paso ${s.t}`}
                  >
                    <IconX className="size-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const v = newSub.trim();
              if (!v) return;
              setSubs([...t.subtareas, { t: v, ok: false }]);
              setNewSub("");
            }}
          >
            <input value={newSub} onChange={(e) => setNewSub(e.target.value)} placeholder="+ Añadir un paso y Enter" aria-label="Nuevo paso" className={input} />
          </form>
          {t.subtareas.length > 0 && subOk === t.subtareas.length && t.estado !== "done" && (
            <p className="mt-2 text-sm font-medium text-ok">Todos los pasos listos: pásala a «En revisión» o «Hecha».</p>
          )}
        </section>

        {/* Dependencias */}
        <section>
          <span className={label}>Espera a</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {t.depende.map((d) => {
              const dt = byId.get(d);
              return (
                <span key={d} className="flex items-center gap-1 rounded-full border border-line py-0.5 pl-2.5 pr-1 text-sm">
                  <span className="font-mono text-xs">{dt?.id ?? "?"}</span>
                  <span className="max-w-40 truncate text-muted">{dt?.titulo ?? "(borrada)"}</span>
                  {dt && (dt.estado === "done" ? <span className="text-ok">✓</span> : null)}
                  <button type="button" onClick={() => save({ depende: t.depende.filter((x) => x !== d) })} className="grid size-5 place-items-center rounded-full hover:bg-sunken" aria-label="Quitar dependencia">
                    <IconX className="size-3" />
                  </button>
                </span>
              );
            })}
            <select value="" onChange={(e) => addDep(e.target.value)} aria-label="Agregar una tarea que esta espera" className="rounded-full border border-dashed border-line bg-transparent px-3 py-1 text-sm text-muted">
              <option value="">+ Agregar</option>
              {depOptions.map((x) => (
                <option key={x._id} value={x._id}>
                  {x.id} · {x.titulo}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Textos */}
        <section className="grid gap-4">
          <div>
            <label htmlFor="ts-det" className={label}>
              Qué hacer
            </label>
            <textarea id="ts-det" rows={3} value={detalle} onChange={(e) => setDetalle(e.target.value)} onBlur={() => saveIf(detalleChanged, { detalle: detalle.trim() })} className={input} placeholder="Cómo se hace, dónde, qué archivo o pantalla" />
          </div>
          <div>
            <label htmlFor="ts-cri" className={label}>
              Lista cuando
            </label>
            <input id="ts-cri" value={criterio} onChange={(e) => setCriterio(e.target.value)} onBlur={() => saveIf(criterioChanged, { criterio: criterio.trim() })} className={input} placeholder="Criterio de aceptación" />
          </div>
          <div>
            <div className="flex items-center">
              <label htmlFor="ts-cmd" className={label}>
                Comando
              </label>
              {t.comando && (
                <button type="button" onClick={copy} className="mb-1.5 ml-auto flex items-center gap-1 text-xs font-medium text-muted hover:text-ink">
                  <IconCopy className="size-3.5" /> Copiar
                </button>
              )}
            </div>
            <textarea id="ts-cmd" rows={2} value={comando} onChange={(e) => setComando(e.target.value)} onBlur={() => saveIf(comandoChanged, { comando: comando.trim() })} className={`${input} font-mono text-xs`} placeholder="Opcional" />
          </div>
          <div>
            <label htmlFor="ts-evi" className={label}>
              Evidencia
            </label>
            <input id="ts-evi" value={evidencia} onChange={(e) => setEvidencia(e.target.value)} onBlur={() => saveIf(evidenciaChanged, { evidencia: evidencia.trim() })} className={input} placeholder="Enlace o nota que demuestre que quedó lista" />
          </div>
        </section>

        {/* Borrar */}
        <section className="border-t border-line pt-4">
          {confirmDelete ? (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span>¿Borrar {t.id}?</span>
              <button
                type="button"
                onClick={async () => {
                  if (await remove("tareas", t._id)) onClose();
                }}
                className="rounded-xl bg-bad px-3 py-1.5 font-semibold text-white"
              >
                Sí, borrar
              </button>
              <button type="button" onClick={() => setConfirmDelete(false)} className="rounded-xl border border-line px-3 py-1.5">
                No
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => setConfirmDelete(true)} className="flex items-center gap-1.5 text-sm text-muted hover:text-bad">
              <IconTrash /> Borrar tarea
            </button>
          )}
        </section>
      </div>
    </>
  );
}
