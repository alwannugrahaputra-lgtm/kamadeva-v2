// Penjelasan file: halaman admin keuangan dengan tampilan ringkasan dan form tambah transaksi.
import Link from "next/link";
import { TransactionType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CashflowChart } from "@/features/admin/components/cashflow-chart";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { SubmitButton } from "@/components/ui/submit-button";
import { ADMIN_ROUTE_ACCESS } from "@/shared/config/access";
import { requireRole } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { formatCurrency, formatDate } from "@/shared/lib/format";

export default async function FinancePage({
  searchParams,
  mode = "list",
  routeBase = "/admin/keuangan",
}: {
  searchParams: Promise<{ q?: string; edit?: string }>;
  mode?: "list" | "create" | "edit";
  routeBase?: string;
}) {
  await requireRole(ADMIN_ROUTE_ACCESS.finance);
  const params = await searchParams;
  const query = params.q?.trim();
  const editId = params.edit;
  const currentMode = mode === "create" ? "create" : editId ? "edit" : "list";

  const [clients, transactions, payments] = await Promise.all([
    prisma.client.findMany({ orderBy: { fullName: "asc" } }),
    prisma.financeTransaction.findMany({
      where: query
        ? {
            OR: [
              { title: { contains: query } },
              { category: { contains: query } },
              { client: { is: { fullName: { contains: query } } } },
            ],
          }
        : undefined,
      orderBy: { transactionDate: "asc" },
      include: { client: true },
    }),
    prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      include: { client: true },
      take: 5,
    }),
  ]);
  const editingTransaction =
    currentMode === "edit" && editId
      ? await prisma.financeTransaction.findUnique({
          where: { id: editId },
        })
      : null;

  async function upsertTransaction(formData: FormData) {
    "use server";
    await requireRole(ADMIN_ROUTE_ACCESS.finance);

    const id = String(formData.get("id") ?? "").trim();

    const payload = {
      type: String(formData.get("type") ?? TransactionType.CASH_IN) as TransactionType,
      title: String(formData.get("title") ?? ""),
      category: String(formData.get("category") ?? ""),
      amount: Number(formData.get("amount")) || 0,
      transactionDate: new Date(String(formData.get("transactionDate"))),
      clientId: String(formData.get("clientId") ?? "") || null,
    };

    if (id) {
      await prisma.financeTransaction.update({ where: { id }, data: payload });
    } else {
      await prisma.financeTransaction.create({ data: payload });
    }

    revalidatePath("/admin");
    revalidatePath("/admin/finance");
    revalidatePath(routeBase);
    redirect(routeBase);
  }

  async function deleteTransaction(formData: FormData) {
    "use server";
    await requireRole(ADMIN_ROUTE_ACCESS.finance);
    const id = String(formData.get("id"));
    await prisma.financeTransaction.delete({ where: { id } });
    revalidatePath("/admin");
    revalidatePath("/admin/finance");
    revalidatePath(routeBase);
    redirect(routeBase);
  }

  const totalIncome = transactions
    .filter((item) => item.type === TransactionType.CASH_IN)
    .reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = transactions
    .filter((item) => item.type === TransactionType.CASH_OUT)
    .reduce((sum, item) => sum + item.amount, 0);
  const balance = totalIncome - totalExpense;
  const cashflowData = transactions.map((item) => ({
    name: new Date(item.transactionDate).toLocaleDateString("id-ID", { day: "2-digit", month: "short" }),
    cashIn: item.type === TransactionType.CASH_IN ? item.amount : 0,
    cashOut: item.type === TransactionType.CASH_OUT ? item.amount : 0,
  }));

  if (currentMode === "create" || currentMode === "edit") {
    return (
      <div>
        <AdminTopbar
          title={currentMode === "edit" ? "Edit Transaksi" : "Catat Transaksi"}
          description="Tambah atau ubah transaksi lalu kembali ke ringkasan keuangan."
        />
        <div className="admin-form-panel">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="admin-panel-kicker">{currentMode === "edit" ? "Edit transaksi" : "Tambah transaksi"}</p>
              <h3 className="admin-panel-title">{editingTransaction?.title ?? "Cashflow baru"}</h3>
            </div>
            <Link href={routeBase} className="text-sm font-semibold text-[var(--brand-deep)]">
              Kembali ke list
            </Link>
          </div>
          <form action={upsertTransaction}>
            <input type="hidden" name="id" defaultValue={editingTransaction?.id ?? ""} />
            <div className="form-grid">
              <select name="type" className="input-base" defaultValue={editingTransaction?.type ?? TransactionType.CASH_IN}>
                {Object.values(TransactionType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <input name="title" defaultValue={editingTransaction?.title ?? ""} placeholder="Judul transaksi" className="input-base" required />
              <input name="category" defaultValue={editingTransaction?.category ?? ""} placeholder="Kategori" className="input-base" required />
              <input name="amount" type="number" defaultValue={editingTransaction?.amount ?? ""} placeholder="Nominal" className="input-base" required />
              <input name="transactionDate" type="date" defaultValue={editingTransaction?.transactionDate ? new Date(editingTransaction.transactionDate).toISOString().slice(0, 10) : ""} className="input-base" required />
              <select name="clientId" className="input-base" defaultValue={editingTransaction?.clientId ?? ""}>
                <option value="">Tautkan client (opsional)</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.fullName}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4">
              <SubmitButton pendingText="Menyimpan transaksi...">
                {currentMode === "edit" ? "Simpan Perubahan" : "Simpan Transaksi"}
              </SubmitButton>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminTopbar
        title="Keuangan"
        description="Ringkasan pendapatan, pengeluaran, dan pergerakan cashflow."
      />
      <div className="admin-list-panel">
        <div className="admin-toolbar">
          <form action={routeBase}>
            <div className="admin-search-row">
              <input name="q" defaultValue={query ?? ""} placeholder="Cari transaksi..." className="input-base" />
              <button type="submit" className="admin-search-button">
                Cari
              </button>
            </div>
          </form>
          <Link href={`${routeBase}/tambah`} className="admin-primary-link">
            + Catat Transaksi
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="admin-simple-stat">
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Total Pendapatan</p>
            <p className="mt-3 text-2xl font-semibold text-[var(--brand-deep)]">{formatCurrency(totalIncome)}</p>
          </div>
          <div className="admin-simple-stat">
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Total Pengeluaran</p>
            <p className="mt-3 text-2xl font-semibold text-[var(--brand-deep)]">{formatCurrency(totalExpense)}</p>
          </div>
          <div className="admin-simple-stat">
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Laba Bersih</p>
            <p className="mt-3 text-2xl font-semibold text-[#3b8f55]">{formatCurrency(balance)}</p>
          </div>
        </div>

        <div className="admin-white-card mt-6 rounded-[24px] p-5">
          <p className="text-sm font-semibold text-[var(--brand-deep)]">Cashflow 30 Hari Terakhir</p>
          <div className="mt-4">
            <CashflowChart data={cashflowData} />
          </div>
        </div>

        <div className="table-shell mt-6">
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Transaksi</th>
                <th>Kategori</th>
                <th>Nominal</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{formatDate(transaction.transactionDate)}</td>
                  <td>
                    <p className="font-semibold text-[var(--brand-deep)]">{transaction.title}</p>
                    <p className="text-sm text-[var(--muted)]">{transaction.client?.fullName ?? "Umum"}</p>
                  </td>
                  <td>{transaction.category}</td>
                  <td className={transaction.type === TransactionType.CASH_IN ? "text-[#2d8b57]" : "text-[#b36b4f]"}>
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <Link href={`${routeBase}?edit=${transaction.id}`} className="admin-table-link">
                        Edit
                      </Link>
                      <form action={deleteTransaction}>
                        <input type="hidden" name="id" value={transaction.id} />
                        <button type="submit" className="admin-danger-link">
                          Hapus
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-shell mt-6">
          <table>
            <thead>
              <tr>
                <th>Kuitansi</th>
                <th>Client</th>
                <th>Status</th>
                <th>Nominal</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.receiptNumber}</td>
                  <td>{payment.client.fullName}</td>
                  <td>{payment.status}</td>
                  <td>{formatCurrency(payment.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
