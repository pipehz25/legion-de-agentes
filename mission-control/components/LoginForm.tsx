"use client";

import { useState } from "react";

export default function LoginForm() {
  const [user, setUser] = useState<"santiago" | "felipe">("santiago");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, password }),
      });
      if (r.ok) {
        window.location.href = "/";
        return;
      }
      const j = (await r.json().catch(() => ({}))) as { error?: string };
      setError(j.error || "No se pudo entrar. Inténtalo otra vez.");
    } catch {
      setError("Sin conexión. Revisa internet e inténtalo otra vez.");
    }
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="space-y-5 rounded-2xl border border-line bg-surface p-6 shadow-sm">
      <fieldset>
        <legend className="mb-2 text-sm font-medium">¿Quién eres?</legend>
        <div className="grid grid-cols-2 gap-2">
          {(["santiago", "felipe"] as const).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => setUser(u)}
              aria-pressed={user === u}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition ${
                user === u ? "border-ink bg-sunken" : "border-line hover:border-muted"
              }`}
            >
              <span className={`grid size-7 place-items-center rounded-full text-xs font-semibold text-white ${u === "santiago" ? "bg-santiago" : "bg-felipe"}`}>
                {u === "santiago" ? "S" : "F"}
              </span>
              {u === "santiago" ? "Santiago" : "Felipe"}
            </button>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-line bg-bg px-3 py-2.5 text-base outline-none focus:border-primary"
        />
      </div>
      {error && (
        <p role="alert" className="text-sm text-bad">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-ink transition hover:opacity-90 disabled:opacity-60"
      >
        {busy ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
