// Penjelasan file: dashboard admin mengikuti struktur mockup dengan kartu ringkasan dan panel aktivitas.
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { ADMIN_ROUTE_ACCESS } from "@/shared/config/access";
import { requireRole } from "@/server/auth/session";
import { getDashboardData } from "@/server/services/dashboard";
import { formatCurrency, formatDateTime } from "@/shared/lib/format";

export default async function AdminDashboardPage() {
  await requireRole(ADMIN_ROUTE_ACCESS.dashboard);
  const dashboard = await getDashboardData();

  return (
    <div>
      <AdminTopbar
        title="Dashboard"
        description="Ringkasan cepat aktivitas tim, client aktif, acara bulan ini, dan pendapatan."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="admin-simple-stat">
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Calon Klien</p>
          <p className="mt-3 text-4xl font-semibold text-[var(--brand-deep)]">{dashboard.latestLeads.length}</p>
          <p className="mt-2 text-sm text-[var(--muted)]">+12% dari bulan lalu</p>
        </div>
        <div className="admin-simple-stat">
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Klien Aktif</p>
          <p className="mt-3 text-4xl font-semibold text-[var(--brand-deep)]">{dashboard.activeClients}</p>
          <p className="mt-2 text-sm text-[var(--muted)]">+8% dari bulan lalu</p>
        </div>
        <div className="admin-simple-stat">
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Acara Bulan Ini</p>
          <p className="mt-3 text-4xl font-semibold text-[var(--brand-deep)]">{dashboard.upcomingSchedules.length}</p>
          <p className="mt-2 text-sm text-[var(--muted)]">+5% dari bulan lalu</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="admin-list-panel">
          <p className="admin-panel-kicker">Jadwal hari ini</p>
          <h3 className="admin-panel-title">Agenda tim</h3>
          <div className="mt-5 space-y-3">
            {dashboard.upcomingSchedules.slice(0, 3).map((item) => (
              <div key={item.id} className="admin-timeline-row">
                <div className="admin-timeline-accent" />
                <div className="flex-1">
                  <p className="font-semibold text-[var(--brand-deep)]">{item.title}</p>
                  <p className="text-sm text-[var(--muted)]">
                    {item.client?.fullName ?? item.lead?.name ?? item.vendor?.name ?? "Agenda umum"}
                  </p>
                </div>
                <span className="text-sm text-[var(--brand-deep)]">{new Date(item.startDate).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-list-panel">
          <p className="admin-panel-kicker">Pendapatan bulan ini</p>
          <h3 className="admin-panel-title">{formatCurrency(dashboard.cashflow.cashIn)}</h3>
          <p className="mt-1 text-sm text-[var(--brand)]">+15% dari bulan lalu</p>
          <div className="admin-mini-chart mt-6">
            {dashboard.pendingPayments.length ? (
              dashboard.pendingPayments.map((item, index) => (
                <div key={item.id} className="admin-mini-chart-row" style={{ ["--bar-width" as string]: `${40 + index * 11}%` }}>
                  <span>{item.client.fullName}</span>
                  <strong>{formatCurrency(item.amount)}</strong>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--muted)]">Belum ada data pembayaran terbaru.</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="admin-list-panel">
          <p className="admin-panel-kicker">Lead terbaru</p>
          <h3 className="admin-panel-title">Prospek masuk</h3>
          <div className="mt-5 space-y-3">
            {dashboard.latestLeads.map((lead) => (
              <div key={lead.id} className="admin-white-card rounded-[18px] p-4">
                <p className="font-semibold text-[var(--brand-deep)]">{lead.name}</p>
                <p className="text-sm text-[var(--muted)]">{lead.location}</p>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-[var(--muted)]">{lead.status}</span>
                  <strong className="text-[var(--brand-deep)]">{formatCurrency(lead.budget)}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-list-panel">
          <p className="admin-panel-kicker">Pembayaran</p>
          <h3 className="admin-panel-title">Status client</h3>
          <div className="mt-5 space-y-3">
            {dashboard.pendingPayments.map((payment) => (
              <div key={payment.id} className="admin-white-card rounded-[18px] p-4">
                <p className="font-semibold text-[var(--brand-deep)]">{payment.client.fullName}</p>
                <p className="text-sm text-[var(--muted)]">{payment.description}</p>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-[var(--muted)]">{payment.status}</span>
                  <strong className="text-[var(--brand-deep)]">{formatCurrency(payment.amount)}</strong>
                </div>
                <p className="mt-2 text-xs text-[var(--muted)]">{formatDateTime(payment.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
