// Penjelasan file: komponen admin untuk tampilan dan interaksi modul internal.
import { LogOut } from "lucide-react";
import { logout } from "@/server/auth/session";
import { SubmitButton } from "@/components/ui/submit-button";

export function AdminTopbar({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-8 flex flex-col gap-4 rounded-[30px] border border-[var(--line)] bg-white/60 p-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Kamadeva</p>
        <h2 className="mt-2 section-title text-5xl font-semibold text-[var(--brand-deep)]">{title}</h2>
        {description ? <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">{description}</p> : null}
      </div>
      <form
        action={async () => {
          "use server";
          await logout();
        }}
      >
        <SubmitButton variant="secondary" pendingText="Keluar...">
          <LogOut size={16} />
          Logout
        </SubmitButton>
      </form>
    </div>
  );
}
