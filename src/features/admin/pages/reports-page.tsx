import { CashflowChart } from "@/features/admin/components/cashflow-chart";
import { LeadFunnelChart } from "@/features/admin/components/lead-funnel-chart";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { ADMIN_ROUTE_ACCESS } from "@/shared/config/access";
import { requireRole } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { formatCurrency } from "@/shared/lib/format";

export default async function ReportsPage() {
  await requireRole(ADMIN_ROUTE_ACCESS.reports);

  const [leadsByStatus, transactions, vendorRatings, packageInterest] = await Promise.all([
    prisma.lead.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    prisma.financeTransaction.findMany({
      orderBy: { transactionDate: "asc" },
    }),
    prisma.vendor.findMany({
      orderBy: { rating: "desc" },
      take: 5,
    }),
    prisma.client.groupBy({
      by: ["selectedPackageId"],
      _count: { _all: true },
      where: {
        selectedPackageId: {
          not: null,
        },
      },
    }),
  ]);

  const packageIds = packageInterest
    .map((item) => item.selectedPackageId)
    .filter((value): value is string => Boolean(value));
  const packageLookup = await prisma.weddingPackage.findMany({
    where: {
      id: {
        in: packageIds,
      },
    },
  });

  const cashflowData = transactions.map((item) => ({
    name: new Date(item.transactionDate).toLocaleDateString("id-ID", { day: "2-digit", month: "short" }),
    cashIn: item.type === "CASH_IN" ? item.amount : 0,
    cashOut: item.type === "CASH_OUT" ? item.amount : 0,
  }));

  const leadData = leadsByStatus.map((item) => ({
    status: item.status,
    total: item._count._all,
  }));

  const packageSummary = packageInterest.map((item) => ({
    name: packageLookup.find((pkg) => pkg.id === item.selectedPackageId)?.name ?? "Tanpa paket",
    total: item._count._all,
  }));

  return (
    <div>
      <AdminTopbar
        title="Laporan"
        description="Ringkasan performa bisnis."
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="glass-card rounded-[30px] p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Cashflow</p>
          <h3 className="mt-2 text-2xl font-semibold text-[var(--brand-deep)]">Pemasukan vs pengeluaran</h3>
          <div className="mt-6">
            <CashflowChart data={cashflowData} />
          </div>
        </div>
        <div className="glass-card rounded-[30px] p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Funnel calon klien</p>
          <h3 className="mt-2 text-2xl font-semibold text-[var(--brand-deep)]">Jumlah calon klien berdasarkan status</h3>
          <div className="mt-6">
            <LeadFunnelChart data={leadData} />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="glass-card rounded-[30px] p-6">
          <h3 className="text-2xl font-semibold text-[var(--brand-deep)]">Vendor performa terbaik</h3>
          <div className="mt-5 space-y-4">
            {vendorRatings.map((vendor) => (
              <div key={vendor.id} className="rounded-[22px] bg-white p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-[var(--brand-deep)]">{vendor.name}</p>
                    <p className="text-sm text-[var(--muted)]">{vendor.category}</p>
                  </div>
                  <p className="text-sm font-semibold text-[var(--brand)]">{vendor.rating ?? "-"} / 5</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-[30px] p-6">
          <h3 className="text-2xl font-semibold text-[var(--brand-deep)]">Paket paling diminati</h3>
          <div className="mt-5 space-y-4">
            {packageSummary.map((item) => (
              <div key={item.name} className="rounded-[22px] bg-white p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-[var(--brand-deep)]">{item.name}</p>
                  <p className="text-sm text-[var(--muted)]">{item.total} klien</p>
                </div>
              </div>
            ))}
            {!packageSummary.length ? (
              <div className="rounded-[22px] bg-white p-4 text-sm text-[var(--muted)]">
                Belum ada data minat paket yang cukup.
              </div>
            ) : null}
          </div>
          <div className="mt-6 rounded-[24px] bg-[var(--soft)] p-5">
            <p className="text-sm text-[var(--muted)]">
              Total pergerakan cashflow tercatat:
              <span className="ml-2 font-semibold text-[var(--brand-deep)]">
                {formatCurrency(transactions.reduce((sum, item) => sum + item.amount, 0))}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
