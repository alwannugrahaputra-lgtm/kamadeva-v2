// Penjelasan file: komponen admin untuk tampilan dan interaksi modul internal.
import { LogOut } from "lucide-react";
import { logout } from "@/server/auth/session";
import { SubmitButton } from "@/components/ui/submit-button";

export function AdminTopbar({ title, description }: { title: string; description?: string }) {
  return (
    <div className="admin-topbar-card mb-6 flex flex-col gap-5 rounded-[26px] p-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
          Kamadeva Dashboard
        </p>
        <h2 className="mt-3 text-[2rem] font-semibold text-[var(--brand-deep)]">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">{description}</p>
        ) : null}
      </div>
      <form
        action={async () => {
          "use server";
          await logout();
        }}
      >
        <SubmitButton variant="secondary" pendingText="Keluar..." className="min-w-[132px]">
          <LogOut size={16} />
          Logout
        </SubmitButton>
      </form>
    </div>
  );
}
