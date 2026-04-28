// Penjelasan file: halaman admin untuk modul operasional terkait.
import { CalendarClock, CircleDollarSign, MessageSquareHeart, UserRoundSearch, Users, WalletCards } from "lucide-react";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { ADMIN_ROUTE_ACCESS } from "@/shared/config/access";
import { requireRole } from "@/server/auth/session";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { getDashboardData } from "@/server/services/dashboard";
import { formatCurrency, formatDateTime } from "@/shared/lib/format";

export default async function AdminDashboardPage() {
  await requireRole(ADMIN_ROUTE_ACCESS.dashboard);
  const dashboard = await getDashboardData();

  return (
    <div>
      <AdminTopbar
        title="Dashboard"
        description="Ringkasan cepat aktivitas, klien, acara, dan cashflow Kamadeva."
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={UserRoundSearch} title="Calon klien" value={dashboard.latestLeads.length} description="+12% dari bulan lalu" />
        <StatCard icon={Users} title="Klien aktif" value={dashboard.activeClients} description="+8% dari bulan lalu" />
        <StatCard icon={CalendarClock} title="Acara bulan ini" value={dashboard.upcomingSchedules.length} description="+5% dari bulan lalu" />
        <StatCard icon={CircleDollarSign} title="Pendapatan bulan ini" value={dashboard.cashflow.cashIn} description="Total pemasukan terbaru." currency />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.24fr_0.76fr]">
        <div className="glass-card rounded-[30px] p-6 lg:p-7">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--muted)]">Jadwal hari ini</p>
              <h3 className="mt-2 text-2xl font-semibold text-[var(--brand-deep)]">
                Agenda terdekat tim Kamadeva
              </h3>
            </div>
            <Badge tone="brand">{dashboard.upcomingSchedules.length} item</Badge>
          </div>
          <div className="space-y-4">
            {dashboard.upcomingSchedules.map((item) => (
              <div
                key={item.id}
                className="rounded-[24px] border border-[rgba(212,175,55,0.12)] bg-[rgba(255,255,255,0.03)] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.22)]"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <Badge tone="brand">{item.type}</Badge>
                  <p className="text-sm text-[var(--muted)]">{formatDateTime(item.startDate)}</p>
                </div>
                <h4 className="mt-4 text-xl font-semibold leading-tight text-[var(--brand-deep)]">
                  {item.title}
                </h4>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                  {item.client?.fullName ?? item.lead?.name ?? item.vendor?.name ?? "Agenda umum"}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          <div className="glass-card rounded-[30px] p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--muted)]">Pendapatan bulan ini</p>
                <h3 className="mt-2 text-2xl font-semibold text-[var(--brand-deep)]">
                  Status pembayaran
                </h3>
              </div>
              <WalletCards className="text-[var(--brand)]" />
            </div>
            <div className="space-y-4">
              {dashboard.pendingPayments.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[24px] border border-[rgba(212,175,55,0.12)] bg-[rgba(255,255,255,0.03)] p-4"
                >
                  <p className="font-semibold text-[var(--brand-deep)]">{item.client.fullName}</p>
                  <p className="mt-1 text-sm leading-7 text-[var(--muted)]">{item.description}</p>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-[var(--muted)]">{item.status}</span>
                    <span className="font-semibold text-[var(--brand-deep)]">{formatCurrency(item.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-[30px] p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--muted)]">Lead masuk</p>
                <h3 className="mt-2 text-2xl font-semibold text-[var(--brand-deep)]">
                  Prospek masuk dari website
                </h3>
              </div>
              <MessageSquareHeart className="text-[var(--brand)]" />
            </div>
            <div className="space-y-4">
              {dashboard.latestLeads.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[24px] border border-[rgba(212,175,55,0.12)] bg-[rgba(255,255,255,0.03)] p-4"
                >
                  <p className="font-semibold text-[var(--brand-deep)]">{item.name}</p>
                  <p className="mt-1 text-sm leading-7 text-[var(--muted)]">{item.location}</p>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-[var(--muted)]">{item.status}</span>
                    <span className="font-semibold text-[var(--brand-deep)]">{formatCurrency(item.budget)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
