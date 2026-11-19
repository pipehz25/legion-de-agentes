"use client";

import { useState } from "react";
import type { Doc, Person } from "@/lib/model";
import { PEOPLE, todayStr } from "@/lib/model";
import { useMC } from "../App";
import { Avatar, IconX, Sheet } from "../ui";

const EMPTY = { codigo: "", titulo: "", estado: "pendiente", opciones: "", recomendacion: "", decision: "", responsable: "todos" };

export default function DecisionSheet({ id, onClose }: { id: string | null; onClose: () => void }) {
  const { decisiones } = useMC();
  const doc = id ? decisiones.find((d) => d._id === id) : undefined;
  return (
    <Sheet open onClose={onClose} label={doc ? `Decisión ${doc.codigo}` : "Nueva decisión"}>
      <Form key={doc?._id ?? "new"} doc={doc} onClose={onClose} />
    </Sheet>
  );
}

function Form({ doc, onClose }: { doc?: Doc; onClose: () => void }) {
  const { decisiones, create, patch, me } = useMC();
  const nextCode = () => {
    let max = 0;
    for (const d of decisiones) {
      const m = /^P-(\d+)$/.exec(String(d.codigo || ""));
      if (m) max = Math.max(max, Number(m[1]));
    }
    return `P-${String(max + 1).padStart(2, "0")}`;
  };
  const [v, setV] = useState<Record<string, unknown>>({ ...EMPTY, codigo: doc ? "" : nextCode(), ...(doc ?? {}) });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const isNew = !doc;
  const set = (k: string, val: unknown) => setV((c) => ({ ...c, [k]: val }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const titulo = String(v.titulo || "").trim();
    if (!titulo) return setError("Escribe qué hay que decidir.");
    if (v.estado !== "pendiente" && !String(v.decision || "").trim()) return setError("Escribe qué se decidió.");
    const data: Record<string, unknown> = {
      codigo: String(v.codigo || "").trim(),
      titulo,
      estado: v.estado,
      opciones: String(v.opciones || "").trim(),
      recomendacion: String(v.recomendacion || "").trim(),
      decision: String(v.decision || "").trim(),
      responsable: v.responsable,
    };
    if (v.estado !== "pendiente" && (!doc || doc.estado === "pendiente")) Object.assign(data, { fecha: todayStr(), por: me });
    setBusy(true);
    const ok = isNew ? !!(await create("decisiones", data)) : await patch("decisiones", doc!._id, data);
    setBusy(false);
    if (ok) onClose();
  }

  const label = "mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-muted";
  const input = "w-full rounded-xl border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-primary";

  return (
    <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center gap-3 border-b border-line px-5 py-4 sm:px-6">
        <h2 className="flex-1 text-xl font-semibold tracking-tight">{isNew ? "Nueva decisión" : `Decisión ${String(v.codigo)}`}</h2>
        <button type="button" onClick={onClose} aria-label="Cerrar" className="grid size-9 place-items-center rounded-full border border-line hover:bg-sunken">
          <IconX />
        </button>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-y-auto overflow-x-hidden px-5 py-5 sm:px-6 [&_.grid>*]:min-w-0">
        <div className="grid grid-cols-[110px_1fr] gap-3">
          <div>
            <label htmlFor="dc-cod" className={label}>
              Código
            </label>
            <input id="dc-cod" value={String(v.codigo)} onChange={(e) => set("codigo", e.target.value)} className={input} />
          </div>
          <div>
            <span className={label}>Estado</span>
            <div className="flex rounded-xl border border-line p-0.5">
              {[
                ["pendiente", "Pendiente"],
                ["tomada", "Tomada"],
                ["descartada", "Descartada"],
              ].map(([k, l]) => (
                <button key={k} type="button" onClick={() => set("estado", k)} aria-pressed={v.estado === k} className={`flex-1 rounded-lg py-1.5 text-xs font-semibold ${v.estado === k ? "bg-ink text-surface" : "text-muted"}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="dc-tit" className={label}>
            Qué hay que decidir
          </label>
          <input id="dc-tit" data-autofocus value={String(v.titulo)} onChange={(e) => set("titulo", e.target.value)} className={input} />
        </div>
        <div>
          <label htmlFor="dc-op" className={label}>
            Opciones
          </label>
          <textarea id="dc-op" rows={3} value={String(v.opciones)} onChange={(e) => set("opciones", e.target.value)} className={input} />
        </div>
        <div>
          <label htmlFor="dc-rec" className={label}>
            Recomendación
          </label>
          <textarea id="dc-rec" rows={2} value={String(v.recomendacion)} onChange={(e) => set("recomendacion", e.target.value)} className={input} />
        </div>
        <div>
          <label htmlFor="dc-dec" className={label}>
            Lo que se decidió y por qué
          </label>
          <textarea id="dc-dec" rows={3} value={String(v.decision)} onChange={(e) => set("decision", e.target.value)} className={input} />
        </div>
        <div>
          <span className={label}>Responsable</span>
          <div className="flex flex-wrap gap-2">
            {(["todos", "santiago", "felipe", "claude"] as Person[]).map((p) => (
              <button key={p} type="button" onClick={() => set("responsable", p)} aria-pressed={v.responsable === p} className={`flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-sm ${v.responsable === p ? "border-ink bg-sunken" : "border-line"}`}>
                <Avatar p={p} size="sm" /> {PEOPLE[p].name}
              </button>
            ))}
          </div>
        </div>
        {error && (
          <p role="alert" className="text-sm text-bad">
            {error}
          </p>
        )}
      </div>
      <div className="border-t border-line px-5 py-3 sm:px-6">
        <button type="submit" disabled={busy} className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-ink disabled:opacity-40">
          {busy ? "Guardando…" : isNew ? "Crear decisión" : "Guardar"}
        </button>
      </div>
    </form>
  );
}
