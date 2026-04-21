import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { ADMIN_ROUTE_ACCESS } from "@/shared/config/access";
import { requireRole } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { whatsappArchitecture } from "@/server/services/whatsapp";
import { formatDateTime } from "@/shared/lib/format";

export default async function WhatsAppPage() {
  await requireRole(ADMIN_ROUTE_ACCESS.whatsapp);

  const syncLogs = await prisma.whatsAppSync.findMany({
    orderBy: { syncedAt: "desc" },
    include: { client: true, lead: true },
  });

  return (
    <div>
      <AdminTopbar
        title="WhatsApp"
        description="Riwayat sinkronisasi dan komunikasi."
      />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="glass-card rounded-[30px] p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Sinkronisasi</p>
          <h3 className="mt-2 text-2xl font-semibold text-[var(--brand-deep)]">Alur komunikasi</h3>
          <div className="mt-6 space-y-3">
            {whatsappArchitecture.flow.map((step) => (
              <div key={step} className="rounded-[20px] bg-white p-4 text-sm leading-7 text-[var(--muted)]">
                {step}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-[30px] p-6">
          <h3 className="text-2xl font-semibold text-[var(--brand-deep)]">Preview histori sinkronisasi</h3>
          <div className="mt-5 space-y-4">
            {syncLogs.map((log) => (
              <div key={log.id} className="rounded-[22px] bg-white p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="rounded-full bg-[var(--soft)] px-3 py-1 text-xs font-semibold text-[var(--brand-deep)]">
                    {log.direction}
                  </p>
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{formatDateTime(log.syncedAt)}</p>
                </div>
                <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">{log.preview}</p>
                <p className="mt-2 text-xs text-[var(--muted)]">
                  Terkait: {log.client?.fullName ?? log.lead?.name ?? "Belum ditautkan"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
