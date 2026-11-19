"use client";

import { useState } from "react";
import type { Doc, Person } from "@/lib/model";
import { PEOPLE, PERSON_KEYS, fmtDay, todayStr } from "@/lib/model";
import { useMC } from "../App";
import { Avatar, Chip, IconPlus } from "../ui";

const asPerson = (x: unknown): Person => (PERSON_KEYS.includes(x as Person) ? (x as Person) : "todos");

export default function Decisions() {
  const { decisiones, open, patch, me } = useMC();
  const [showTaken, setShowTaken] = useState(false);
  const pending = decisiones
    .filter((d) => d.estado === "pendiente")
    .sort((a, b) => String(a.codigo).localeCompare(String(b.codigo), "es", { numeric: true }));
  const taken = decisiones.filter((d) => d.estado !== "pendiente").sort((a, b) => String(b.fecha || "").localeCompare(String(a.fecha || "")));

  function accept(d: Doc) {
    patch("decisiones", d._id, { estado: "tomada", decision: `Se acepta la recomendación: ${d.recomendacion}`, fecha: todayStr(), por: me });
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Decisiones</h2>
          <p className="mt-1 text-sm text-muted tabular">
            {pending.length} por decidir · {taken.length} tomadas
          </p>
        </div>
        <button type="button" onClick={() => open("decision", null)} className="ml-auto flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-ink">
          <IconPlus /> Nueva decisión
        </button>
      </div>

      {pending.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-muted">No hay nada pendiente por decidir.</p>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {pending.map((d) => (
            <article key={d._id} className="flex flex-col gap-3 rounded-3xl border border-line bg-surface p-5">
              <div className="flex items-center gap-2">
                <Chip tone="warn">{d.codigo}</Chip>
                <span className="ml-auto flex items-center gap-1.5 text-xs text-muted">
                  <Avatar p={asPerson(d.responsable)} size="sm" />
                  {PEOPLE[asPerson(d.responsable)].name}
                </span>
              </div>
              <h3 className="text-base font-semibold leading-snug">{d.titulo}</h3>
              {d.opciones && <p className="whitespace-pre-line text-sm text-muted">{d.opciones}</p>}
              {d.recomendacion && (
                <div className="rounded-2xl bg-primary/8 p-3 text-sm" style={{ background: "color-mix(in oklab, var(--color-primary) 9%, transparent)" }}>
                  <p className="mb-0.5 text-xs font-semibold uppercase tracking-[0.08em] text-primary">Recomendación</p>
                  {d.recomendacion}
                </div>
              )}
              <div className="mt-auto flex flex-wrap gap-2 pt-1">
                {d.recomendacion && (
                  <button type="button" onClick={() => accept(d)} className="rounded-xl bg-ink px-3.5 py-2 text-sm font-semibold text-surface">
                    Aceptar la recomendación
                  </button>
                )}
                <button type="button" onClick={() => open("decision", d._id)} className="rounded-xl border border-line px-3.5 py-2 text-sm font-medium">
                  Decidir otra cosa
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {taken.length > 0 && (
        <section>
          <button type="button" onClick={() => setShowTaken((s) => !s)} className="text-sm font-semibold text-muted hover:text-ink" aria-expanded={showTaken}>
            {showTaken ? "▾" : "▸"} Tomadas ({taken.length})
          </button>
          {showTaken && (
            <ul className="mt-3 grid gap-2">
              {taken.map((d) => (
                <li key={d._id}>
                  <button type="button" onClick={() => open("decision", d._id)} className="flex w-full flex-wrap items-baseline gap-x-3 gap-y-1 rounded-2xl border border-line bg-surface px-4 py-3 text-left hover:shadow-sm">
                    <Chip tone={d.estado === "tomada" ? "ok" : "neutral"}>{d.codigo}</Chip>
                    <span className="font-medium">{d.titulo}</span>
                    <span className="ml-auto text-xs text-muted">{d.fecha ? fmtDay(d.fecha) : ""}</span>
                    {d.decision && <span className="w-full text-sm text-muted">{d.decision}</span>}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
