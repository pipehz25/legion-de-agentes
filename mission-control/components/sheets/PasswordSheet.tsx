"use client";

import { useState } from "react";
import { IconLock, IconX, Sheet, useToast } from "../ui";

export default function PasswordSheet({ onClose }: { onClose: () => void }) {
  const toast = useToast();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [again, setAgain] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (next.length < 10) return setError("La nueva contraseña debe tener al menos 10 caracteres.");
    if (next !== again) return setError("Las dos contraseñas nuevas no coinciden.");
    setBusy(true);
    try {
      const r = await fetch("/api/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current, next }),
      });
      const j = (await r.json().catch(() => ({}))) as { error?: string };
      if (!r.ok) {
        setError(j.error || "No se pudo cambiar la contraseña.");
        setBusy(false);
        return;
      }
      toast("Contraseña cambiada", "ok");
      onClose();
    } catch {
      setError("Sin conexión. Inténtalo otra vez.");
      setBusy(false);
    }
  }

  const input = "w-full rounded-xl border border-line bg-bg px-3 py-2.5 text-base outline-none focus:border-primary";
  return (
    <Sheet open onClose={onClose} label="Cambiar contraseña">
      <form onSubmit={submit} className="flex flex-col">
        <div className="flex items-center gap-3 border-b border-line px-5 py-4 sm:px-6">
          <IconLock className="size-5 text-muted" />
          <h2 className="flex-1 text-xl font-semibold tracking-tight">Cambiar contraseña</h2>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="grid size-9 place-items-center rounded-full border border-line hover:bg-sunken">
            <IconX />
          </button>
        </div>
        <div className="grid gap-4 px-5 py-5 sm:px-6">
          <div>
            <label htmlFor="pw-cur" className="mb-1.5 block text-sm font-medium">
              Contraseña actual
            </label>
            <input id="pw-cur" data-autofocus type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} className={input} />
          </div>
          <div>
            <label htmlFor="pw-new" className="mb-1.5 block text-sm font-medium">
              Nueva contraseña <span className="font-normal text-muted">(10 caracteres o más)</span>
            </label>
            <input id="pw-new" type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} className={input} />
          </div>
          <div>
            <label htmlFor="pw-again" className="mb-1.5 block text-sm font-medium">
              Repite la nueva
            </label>
            <input id="pw-again" type="password" autoComplete="new-password" value={again} onChange={(e) => setAgain(e.target.value)} className={input} />
          </div>
          {error && (
            <p role="alert" className="text-sm text-bad">
              {error}
            </p>
          )}
          <button type="submit" disabled={busy} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-ink disabled:opacity-50">
            {busy ? "Guardando…" : "Cambiar contraseña"}
          </button>
        </div>
      </form>
    </Sheet>
  );
}
