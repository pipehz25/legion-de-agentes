"use client";

import { useState } from "react";
import type { Doc, Person } from "@/lib/model";
import { ACC_STATES, PEOPLE, PLATFORMS, RIGHTS } from "@/lib/model";
import { useMC } from "../App";
import { Avatar, IconTrash, IconX, Sheet } from "../ui";

const EMPTY = { marca: "", handle: "", plataforma: "TikTok", familia: "clips", nicho: "", estado: "idea", derechos: "sin_verificar", responsable: "felipe", espacio: "", etapa: "", piloto: false, notas: "" };

export default function AccountSheet({ id, onClose }: { id: string | null; onClose: () => void }) {
  const { cuentas } = useMC();
  const doc = id ? cuentas.find((c) => c._id === id) : undefined;
  return (
    <Sheet open onClose={onClose} label={doc ? `Cuenta ${doc.marca}` : "Nueva cuenta"}>
      <Form key={doc?._id ?? "new"} doc={doc} onClose={onClose} />
    </Sheet>
  );
}

function Form({ doc, onClose }: { doc?: Doc; onClose: () => void }) {
  const { patch, create, remove } = useMC();
  const [v, setV] = useState<Record<string, unknown>>({ ...EMPTY, ...(doc ?? {}) });
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const isNew = !doc;

  const set = (k: string, val: unknown, immediate = true) => {
    setV((cur) => ({ ...cur, [k]: val }));
    if (!isNew && immediate) patch("cuentas", doc!._id, { [k]: val }, true);
  };
  const commit = (k: string) => {
    if (!isNew && v[k] !== doc![k]) patch("cuentas", doc!._id, { [k]: String(v[k] ?? "").trim() }, true);
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isNew) return onClose();
    if (!String(v.marca).trim()) return;
    setBusy(true);
    const { _id, ...rest } = v as Doc;
    void _id;
    const newId = await create("cuentas", { ...rest, marca: String(v.marca).trim() });
    setBusy(false);
    if (newId) onClose();
  }

  const label = "mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-muted";
  const input = "w-full rounded-xl border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-primary";
  const text = (k: string, lbl: string, ph = "") => (
    <div>
      <label htmlFor={"ac-" + k} className={label}>
        {lbl}
      </label>
      <input id={"ac-" + k} value={String(v[k] ?? "")} placeholder={ph} onChange={(e) => set(k, e.target.value, false)} onBlur={() => commit(k)} className={input} />
    </div>
  );
  const select = (k: string, lbl: string, opts: readonly { key: string; label: string }[]) => (
    <div>
      <label htmlFor={"ac-" + k} className={label}>
        {lbl}
      </label>
      <select id={"ac-" + k} value={String(v[k] ?? "")} onChange={(e) => set(k, e.target.value)} className={input}>
        {opts.map((o) => (
          <option key={o.key} value={o.key}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center gap-3 border-b border-line px-5 py-4 sm:px-6">
        <h2 className="flex-1 text-xl font-semibold tracking-tight">{isNew ? "Nueva cuenta" : String(v.marca)}</h2>
        <button type="button" onClick={onClose} aria-label="Cerrar" className="grid size-9 place-items-center rounded-full border border-line hover:bg-sunken">
          <IconX />
        </button>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-y-auto overflow-x-hidden px-5 py-5 sm:px-6 [&_.grid>*]:min-w-0">
        <div className="grid grid-cols-2 gap-3">
          {text("marca", "Marca", "Ej.: CurioSismo")}
          {text("handle", "Cuenta o alias", "@usuario")}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {select("plataforma", "Plataforma", PLATFORMS.map((p) => ({ key: p, label: p })))}
          {select("familia", "Familia", [
            { key: "clips", label: "Clips de famosos" },
            { key: "propio", label: "Propia" },
          ])}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {select("estado", "Estado", ACC_STATES)}
          {select("derechos", "Derechos", RIGHTS)}
        </div>
        {text("nicho", "Nicho", "Ej.: curiosidades")}
        <div>
          <span className={label}>Responsable</span>
          <div className="flex flex-wrap gap-2">
            {(["felipe", "santiago", "todos"] as Person[]).map((p) => (
              <button key={p} type="button" onClick={() => set("responsable", p)} aria-pressed={v.responsable === p} className={`flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-sm ${v.responsable === p ? "border-ink bg-sunken" : "border-line"}`}>
                <Avatar p={p} size="sm" /> {PEOPLE[p].name}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {text("espacio", "Espacio", "raíz, lalo…")}
          {text("etapa", "Etapa", "Ej.: etapa 2")}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!v.piloto} onChange={(e) => set("piloto", e.target.checked)} className="size-4" />
          En el piloto de 30 días
        </label>
        {text("notas", "Notas", "Qué falta para activarla")}
        {!isNew && (
          <div className="border-t border-line pt-4">
            {confirm ? (
              <div className="flex items-center gap-2 text-sm">
                <span>¿Borrar esta cuenta del registro?</span>
                <button type="button" onClick={async () => (await remove("cuentas", doc!._id)) && onClose()} className="rounded-xl bg-bad px-3 py-1.5 font-semibold text-white">
                  Sí, borrar
                </button>
                <button type="button" onClick={() => setConfirm(false)} className="rounded-xl border border-line px-3 py-1.5">
                  No
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => setConfirm(true)} className="flex items-center gap-1.5 text-sm text-muted hover:text-bad">
                <IconTrash /> Borrar cuenta
              </button>
            )}
          </div>
        )}
      </div>
      <div className="border-t border-line px-5 py-3 sm:px-6">
        <button type="submit" disabled={busy || (isNew && !String(v.marca).trim())} className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-ink disabled:opacity-40">
          {isNew ? (busy ? "Creando…" : "Crear cuenta") : "Listo"}
        </button>
      </div>
    </form>
  );
}
