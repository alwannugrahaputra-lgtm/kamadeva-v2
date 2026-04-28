// Penjelasan file: halaman admin laporan bergaya card seperti mockup.
import { FileBarChart2, ReceiptText, UsersRound } from "lucide-react";
import { CashflowChart } from "@/features/admin/components/cashflow-chart";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { ADMIN_ROUTE_ACCESS } from "@/shared/config/access";
import { requireRole } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { formatCurrency } from "@/shared/lib/format";

export default async function ReportsPage() {
  await requireRole(ADMIN_ROUTE_ACCESS.reports);

  const [leadCount, clientCount, transactions] = await Promise.all([
    prisma.lead.count(),
    prisma.client.count(),
    prisma.financeTransaction.findMany({
      orderBy: { transactionDate: "asc" },
    }),
  ]);

  const totalIncome = transactions
    .filter((item) => item.type === "CASH_IN")
    .reduce((sum, item) => sum + item.amount, 0);

  const cashflowData = transactions.map((item) => ({
    name: new Date(item.transactionDate).toLocaleDateString("id-ID", { day: "2-digit", month: "short" }),
    cashIn: item.type === "CASH_IN" ? item.amount : 0,
    cashOut: item.type === "CASH_OUT" ? item.amount : 0,
  }));

  return (
    <div>
      <AdminTopbar
        title="Laporan"
        description="Ringkasan laporan penjualan, client, dan keuangan bulanan."
      />

      <div className="admin-list-panel">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h3 className="text-xl font-semibold text-[var(--brand-deep)]">Laporan</h3>
          <button type="button" className="admin-search-button">
            Filter
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="admin-report-card">
            <div className="admin-report-icon">
              <ReceiptText size={20} />
            </div>
            <div>
              <p className="font-semibold text-[var(--brand-deep)]">Laporan Penjualan</p>
              <p className="text-sm text-[var(--muted)]">Lihat detail penjualan</p>
            </div>
          </div>
          <div className="admin-report-card">
            <div className="admin-report-icon">
              <UsersRound size={20} />
            </div>
            <div>
              <p className="font-semibold text-[var(--brand-deep)]">Laporan Klien</p>
              <p className="text-sm text-[var(--muted)]">Lihat data klien</p>
            </div>
          </div>
          <div className="admin-report-card">
            <div className="admin-report-icon">
              <FileBarChart2 size={20} />
            </div>
            <div>
              <p className="font-semibold text-[var(--brand-deep)]">Laporan Keuangan</p>
              <p className="text-sm text-[var(--muted)]">Ringkasan keuangan</p>
            </div>
          </div>
        </div>

        <div className="admin-white-card mt-6 rounded-[24px] p-5">
          <p className="text-sm font-semibold text-[var(--brand-deep)]">Ringkasan Bulan Ini</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="admin-simple-stat">
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Total Klien Baru</p>
              <p className="mt-3 text-2xl font-semibold text-[var(--brand-deep)]">{leadCount}</p>
            </div>
            <div className="admin-simple-stat">
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Total Acara</p>
              <p className="mt-3 text-2xl font-semibold text-[var(--brand-deep)]">{clientCount}</p>
            </div>
            <div className="admin-simple-stat">
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Total Pendapatan</p>
              <p className="mt-3 text-2xl font-semibold text-[var(--brand-deep)]">{formatCurrency(totalIncome)}</p>
            </div>
          </div>
        </div>

        <div className="admin-white-card mt-6 rounded-[24px] p-5">
          <p className="text-sm font-semibold text-[var(--brand-deep)]">Cashflow Bulanan</p>
          <div className="mt-4">
            <CashflowChart data={cashflowData} />
          </div>
        </div>
      </div>
    </div>
  );
}
