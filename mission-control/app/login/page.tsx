import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await currentUser()) redirect("/");
  return (
    <main className="grid min-h-dvh place-items-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3">
          <Mark />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Legión de Agentes</p>
            <h1 className="text-2xl font-semibold tracking-tight">Mission Control</h1>
          </div>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}

function Mark() {
  return (
    <span className="grid size-11 grid-cols-2 gap-1 rounded-xl bg-ink p-2" aria-hidden="true">
      <span className="rounded-sm bg-santiago" />
      <span className="rounded-sm bg-felipe" />
      <span className="rounded-sm bg-claude" />
      <span className="rounded-sm bg-primary" />
    </span>
  );
}
