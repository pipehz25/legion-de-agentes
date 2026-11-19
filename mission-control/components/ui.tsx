"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { Person } from "@/lib/model";
import { PEOPLE } from "@/lib/model";

// ---------- Íconos ----------
type IconProps = { className?: string };
const base = "size-4 shrink-0";
function svg(path: React.ReactNode, vb = "0 0 20 20") {
  return function Icon({ className = base }: IconProps) {
    return (
      <svg viewBox={vb} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        {path}
      </svg>
    );
  };
}
export const IconCheck = svg(<path d="M4.5 10.5l3.5 3.5 7.5-8" />);
export const IconPlus = svg(<path d="M10 4.5v11M4.5 10h11" />);
export const IconX = svg(<path d="M5.5 5.5l9 9M14.5 5.5l-9 9" />);
export const IconStar = svg(<path d="M10 3.2l2 4.3 4.6.5-3.4 3.2.9 4.6L10 13.5l-4.1 2.3.9-4.6L3.4 8l4.6-.5z" />);
export const IconCopy = svg(<><rect x="7" y="7" width="9" height="9" rx="2" /><path d="M13 7V5.5A1.5 1.5 0 0 0 11.5 4h-6A1.5 1.5 0 0 0 4 5.5v6A1.5 1.5 0 0 0 5.5 13H7" /></>);
export const IconLogout = svg(<><path d="M8 4H5.5A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8" /><path d="M12 13.5L15.5 10 12 6.5M15.5 10H8" /></>);
export const IconLock = svg(<><rect x="4.5" y="9" width="11" height="7.5" rx="1.8" /><path d="M7 9V7a3 3 0 0 1 6 0v2" /></>);
export const IconTrash = svg(<><path d="M4.5 6h11M8 6V4.5h4V6M6 6l.7 9.5h6.6L14 6" /></>);
export const IconHome = svg(<><path d="M3.5 9.5L10 4l6.5 5.5" /><path d="M5.5 8.5V16h9V8.5" /></>);
export const IconBoard = svg(<><rect x="3.5" y="4" width="4" height="12" rx="1.2" /><rect x="8.5" y="4" width="4" height="8" rx="1.2" /><rect x="13.5" y="4" width="3" height="10" rx="1.2" /></>);
export const IconUsers = svg(<><circle cx="7.5" cy="7.5" r="2.7" /><path d="M2.8 16a4.7 4.7 0 0 1 9.4 0" /><circle cx="14" cy="8" r="2.2" /><path d="M13 12.2a4 4 0 0 1 4.6 3.8" /></>);
export const IconPulse = svg(<path d="M2.5 10.5h3.2l2-5 3.3 9 2.2-6 1.3 2h3" />);
export const IconScale = svg(<><path d="M10 3.5v13M6 16.5h8M4.5 6.5h11" /><path d="M4.5 6.5L2.5 11a2.2 2.2 0 0 0 4 0zM15.5 6.5l-2 4.5a2.2 2.2 0 0 0 4 0z" /></>);
export const IconChevron = svg(<path d="M7.5 5l5 5-5 5" />);
export const IconFlag = svg(<><path d="M5 17V3.5" /><path d="M5 4h9l-2 3.2 2 3.3H5" /></>);

// ---------- Avatar ----------
const PERSON_BG: Record<Person, string> = {
  santiago: "bg-santiago",
  felipe: "bg-felipe",
  claude: "bg-claude",
  todos: "bg-todos",
};
export const PERSON_TEXT: Record<Person, string> = {
  santiago: "text-santiago",
  felipe: "text-felipe",
  claude: "text-claude",
  todos: "text-todos",
};
export function Avatar({ p, size = "md", title }: { p: Person; size?: "sm" | "md" | "lg"; title?: string }) {
  const s = size === "sm" ? "size-5 text-[10px]" : size === "lg" ? "size-9 text-sm" : "size-7 text-xs";
  return (
    <span title={title ?? PEOPLE[p].name} className={`inline-grid shrink-0 place-items-center rounded-full font-semibold text-white ${PERSON_BG[p]} ${s}`}>
      {PEOPLE[p].short}
    </span>
  );
}

// ---------- Chip ----------
export type Tone = "neutral" | "bad" | "warn" | "ok" | "info" | "alert" | "primary";
const TONES: Record<Tone, string> = {
  neutral: "border-line text-muted",
  bad: "border-bad/40 text-bad bg-bad/5",
  warn: "border-warn/40 text-warn bg-warn/5",
  ok: "border-ok/40 text-ok bg-ok/5",
  info: "border-info/40 text-info bg-info/5",
  alert: "border-bad bg-bad text-white",
  primary: "border-primary/40 text-primary bg-primary/5",
};
export function Chip({ tone = "neutral", children, className = "" }: { tone?: Tone; children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11.5px] font-medium tabular ${TONES[tone]} ${className}`}>
      {children}
    </span>
  );
}

// ---------- Sheet (panel lateral en escritorio, desde abajo en el celular) ----------
export function Sheet({ open, onClose, label, children }: { open: boolean; onClose: () => void; label: string; children: React.ReactNode }) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => panel.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus(), 30);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-stretch sm:justify-end" role="presentation">
      <button type="button" aria-label="Cerrar" onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className="anim-up sm:anim-left relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-line bg-surface shadow-2xl sm:max-h-none sm:w-[560px] sm:rounded-none sm:rounded-l-3xl"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-line sm:hidden" aria-hidden="true" />
        {children}
      </div>
    </div>
  );
}

// ---------- Avisos ----------
type Toast = { id: number; text: string; tone: "ok" | "bad" | "neutral" };
const ToastCtx = createContext<(text: string, tone?: Toast["tone"]) => void>(() => {});
export function useToast() {
  return useContext(ToastCtx);
}
export function ToastHost({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const push = useCallback((text: string, tone: Toast["tone"] = "neutral") => {
    const id = Date.now() + Math.random();
    setItems((xs) => [...xs.slice(-2), { id, text, tone }]);
    setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), 3800);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex flex-col items-center gap-2 px-4 sm:bottom-6" aria-live="polite">
        {items.map((t) => (
          <div
            key={t.id}
            className={`anim-pop pointer-events-auto rounded-full px-4 py-2 text-sm font-medium shadow-lg ${
              t.tone === "bad" ? "bg-bad text-white" : t.tone === "ok" ? "bg-ink text-surface" : "bg-ink text-surface"
            }`}
          >
            {t.text}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

// ---------- Botón redondo de «hecha» ----------
export function CheckButton({ done, disabled, onClick, label }: { done: boolean; disabled?: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      disabled={disabled}
      aria-label={label}
      aria-pressed={done}
      className={`grid size-6 shrink-0 place-items-center rounded-full border-2 transition ${
        done ? "border-ok bg-ok text-white" : "border-line text-transparent hover:border-ok hover:text-ok/60"
      } disabled:cursor-not-allowed disabled:opacity-40`}
    >
      <IconCheck className="size-3.5" />
    </button>
  );
}

// ---------- Campo con guardado al salir ----------
export function useDraft(value: string): [string, (v: string) => void, () => boolean] {
  const [draft, setDraft] = useState(value);
  const last = useRef(value);
  useEffect(() => {
    if (value !== last.current) {
      last.current = value;
      setDraft(value);
    }
  }, [value]);
  const changed = () => draft !== last.current;
  return [draft, setDraft, changed];
}
