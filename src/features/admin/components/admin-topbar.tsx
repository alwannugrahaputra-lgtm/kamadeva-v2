// Penjelasan file: komponen admin untuk tampilan dan interaksi modul internal.
import { LogOut } from "lucide-react";
import { logout } from "@/server/auth/session";
import { SubmitButton } from "@/components/ui/submit-button";

export function AdminTopbar({ title, description }: { title: string; description?: string }) {
  return (
    <div className="paper-panel ornament-ring mb-8 flex flex-col gap-5 rounded-[34px] p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8">
      <div>
        <p className="eyebrow">Kamadeva Dashboard</p>
        <h2 className="mt-5 section-title text-5xl font-semibold text-[var(--brand-deep)]">
          {title}
        </h2>
        {description ? (
          <p className="section-copy mt-3 max-w-2xl text-sm">{description}</p>
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
