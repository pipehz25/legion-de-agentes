"use client";

import { ago, fmtStamp } from "@/lib/model";
import { useMC } from "../App";

const n = (x: unknown) => Number(x) || 0;

export default function Pipeline() {
  const { pipeline } = useMC();
  const list = [...pipeline].sort((a, b) => n(a.orden) - n(b.orden));
  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Pipeline</h2>
        <p className="mt-1 text-sm text-muted">Lo que producen y publican los agentes en cada espacio. Lo escribe Claude al final de cada ciclo.</p>
      </div>
      {list.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-muted">Todavía no hay datos del pipeline.</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {list.map((p) => {
            const c = p.clips || {};
            const d = p.derechos || {};
            const pub = p.publicaciones || {};
            const ok = n(d.autorizado) + n(d.propio);
            const tr = n(d.transformado);
            const sv = n(d.sin_verificar);
            const tot = ok + tr + sv;
            const pct = (x: number) => (tot ? `${(100 * x) / tot}%` : "0%");
            const stale = p.actualizado && Date.now() - new Date(p.actualizado).getTime() > 36 * 3600000;
            return (
              <article key={p._id} className="grid gap-5 rounded-3xl border border-line bg-surface p-5">
                <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="text-lg font-semibold tracking-tight">{p.nombre || p._id}</h3>
                  <span className={`text-xs ${stale ? "text-warn" : "text-muted"}`}>
                    {p.pc ? `PC de ${p.pc} · ` : ""}
                    {p.actualizado ? `${ago(p.actualizado)} (${fmtStamp(p.actualizado)})` : "sin fecha"}
                  </span>
                </header>
                <div className="grid grid-cols-3 gap-2">
                  <Stat v={n(c.listo)} l={`clips listos de ${n(c.total)}`} />
                  <Stat v={n(pub.publicado)} l="publicados" />
                  <Stat v={n(pub.en_borradores)} l="en bandeja" />
                  <Stat v={n(p.pendientes_aprobacion)} l="por aprobar" warn={n(p.pendientes_aprobacion) > 0} />
                  <Stat v={n(c.propuesto)} l="propuestos" />
                  <Stat v={n(c.descartado)} l="descartados" />
                </div>
                {tot > 0 && (
                  <div>
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span className="font-semibold">Derechos</span>
                      <span className={ok / tot < 0.5 ? "text-bad" : "text-ok"}>{Math.round((100 * ok) / tot)} % claros</span>
                    </div>
                    <div className="flex h-2.5 overflow-hidden rounded-full bg-sunken" role="img" aria-label={`${ok} autorizados o propios, ${tr} transformados, ${sv} sin verificar`}>
                      <span className="bg-ok" style={{ width: pct(ok) }} />
                      <span className="bg-info" style={{ width: pct(tr) }} />
                      <span className="bg-warn" style={{ width: pct(sv) }} />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted tabular">
                      <span><i className="mr-1 inline-block size-2 rounded-sm bg-ok" />Autorizado o propio {ok}</span>
                      {tr > 0 && <span><i className="mr-1 inline-block size-2 rounded-sm bg-info" />Transformado {tr}</span>}
                      <span><i className="mr-1 inline-block size-2 rounded-sm bg-warn" />Sin verificar {sv}</span>
                    </div>
                  </div>
                )}
                {Array.isArray(p.agentes) && p.agentes.length > 0 && (
                  <div>
                    <p className="mb-1.5 text-xs font-semibold">Último ciclo</p>
                    <ul className="grid gap-1 text-sm">
                      {p.agentes.map((a: { nombre?: string; ultimo?: string }, i: number) => (
                        <li key={i} className="flex justify-between gap-3">
                          <span>{a.nombre}</span>
                          <span className="text-muted tabular">{a.ultimo ? fmtStamp(a.ultimo) : "—"}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {Array.isArray(p.alertas) && p.alertas.length > 0 && (
                  <ul className="grid gap-1.5 rounded-2xl bg-bad/5 p-3 text-sm text-bad">
                    {p.alertas.map((a: string, i: number) => (
                      <li key={i} className="flex gap-2">
                        <span aria-hidden="true">•</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Stat({ v, l, warn }: { v: number; l: string; warn?: boolean }) {
  return (
    <div className="rounded-2xl bg-sunken px-3 py-2.5">
      <p className={`text-xl font-semibold tracking-tight tabular ${warn ? "text-warn" : ""}`}>{v}</p>
      <p className="text-[11px] leading-tight text-muted">{l}</p>
    </div>
  );
}
