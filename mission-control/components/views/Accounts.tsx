"use client";

import type { Doc, Person } from "@/lib/model";
import { ACC_STATES, PEOPLE, PERSON_KEYS, RIGHTS } from "@/lib/model";
import { useMC } from "../App";
import { Avatar, Chip, IconPlus, IconStar } from "../ui";
import type { Tone } from "../ui";

export function accTone(s: string): Tone {
  return s === "activa" ? "ok" : s === "pausada" ? "bad" : s === "por_conectar" ? "warn" : "neutral";
}
export function rightsTone(r: string): Tone {
  return r === "autorizado" || r === "propio" ? "ok" : r === "transformado" ? "info" : "warn";
}
export const accLabel = (s: string) => ACC_STATES.find((x) => x.key === s)?.label ?? "Idea";
export const rightsLabel = (r: string) => RIGHTS.find((x) => x.key === r)?.label ?? "Sin verificar";
const asPerson = (x: unknown): Person => (PERSON_KEYS.includes(x as Person) ? (x as Person) : "todos");

export default function Accounts() {
  const { cuentas, open, patch } = useMC();
  const list = [...cuentas].sort((a, b) => Number(!!b.piloto) - Number(!!a.piloto) || String(a.marca).localeCompare(String(b.marca)));
  const active = list.filter((c) => c.estado === "activa").length;
  const pilot = list.filter((c) => c.piloto).length;
  const toConnect = list.filter((c) => c.estado === "por_conectar" || c.estado === "por_crear").length;

  const groups: { key: string; title: string; sub: string }[] = [
    { key: "clips", title: "Clips de famosos", sub: "Contenido de terceros: solo crece lo autorizado." },
    { key: "propio", title: "Propias", sub: "Contenido 100 % nuestro." },
  ];

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Cuentas</h2>
          <p className="mt-1 text-sm text-muted tabular">
            {active} activas · {pilot} en el piloto · {toConnect} por crear o conectar
          </p>
        </div>
        <button type="button" onClick={() => open("account", null)} className="ml-auto flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-ink">
          <IconPlus /> Nueva cuenta
        </button>
      </div>
      {groups.map((g) => {
        const items = list.filter((c) => (c.familia || "clips") === g.key);
        return (
          <section key={g.key} className="grid gap-3">
            <div>
              <h3 className="text-base font-semibold">{g.title}</h3>
              <p className="text-sm text-muted">{g.sub}</p>
            </div>
            {items.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-line p-6 text-center text-sm text-muted">Ninguna todavía.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((c: Doc) => (
                  <article
                    key={c._id}
                    role="button"
                    tabIndex={0}
                    onClick={() => open("account", c._id)}
                    onKeyDown={(e) => e.key === "Enter" && open("account", c._id)}
                    className="flex cursor-pointer flex-col gap-3 rounded-3xl border border-line bg-surface p-4 transition hover:-translate-y-px hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-muted">{c.plataforma}</p>
                        <p className="text-base font-semibold leading-tight">{c.marca}</p>
                        {c.handle && <p className="mt-0.5 truncate text-xs text-muted">{c.handle}</p>}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          patch("cuentas", c._id, { piloto: !c.piloto });
                        }}
                        aria-pressed={!!c.piloto}
                        aria-label={c.piloto ? "Quitar del piloto" : "Poner en el piloto"}
                        title={c.piloto ? "En el piloto" : "Fuera del piloto"}
                        className={`grid size-8 place-items-center rounded-full transition ${c.piloto ? "bg-warn/15 text-warn" : "text-line hover:text-muted"}`}
                      >
                        <IconStar className="size-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <Chip tone={accTone(c.estado)}>{accLabel(c.estado)}</Chip>
                      <Chip tone={rightsTone(c.derechos)}>{rightsLabel(c.derechos)}</Chip>
                      {c.nicho && <Chip>{c.nicho}</Chip>}
                    </div>
                    {c.notas && <p className="text-sm text-muted">{c.notas}</p>}
                    <div className="mt-auto flex items-center gap-2 border-t border-line pt-3 text-xs text-muted">
                      <Avatar p={asPerson(c.responsable)} size="sm" />
                      {PEOPLE[asPerson(c.responsable)].name}
                      {c.espacio && <span className="ml-auto">Espacio {c.espacio}</span>}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
