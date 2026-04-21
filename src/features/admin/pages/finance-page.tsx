// Penjelasan file: halaman admin untuk modul operasional terkait.
import { PaymentStatus, PaymentType, TransactionType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { SubmitButton } from "@/components/ui/submit-button";
import { ADMIN_ROUTE_ACCESS } from "@/shared/config/access";
import { requireRole } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { formatCurrency, formatDate } from "@/shared/lib/format";

export default async function FinancePage() {
  await requireRole(ADMIN_ROUTE_ACCESS.finance);

  const [clients, payments, transactions] = await Promise.all([
    prisma.client.findMany({ orderBy: { fullName: "asc" } }),
    prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      include: { client: true },
    }),
    prisma.financeTransaction.findMany({
      orderBy: { transactionDate: "desc" },
      include: { client: true },
    }),
  ]);

  async function createPayment(formData: FormData) {
    "use server";

    const count = await prisma.payment.count();
    await prisma.payment.create({
      data: {
        receiptNumber: `INV-KMD-${new Date().getFullYear()}-${String(count + 1).padStart(3, "0")}`,
        type: String(formData.get("type") ?? PaymentType.DP) as PaymentType,
        status: String(formData.get("status") ?? PaymentStatus.BELUM_BAYAR) as PaymentStatus,
        description: String(formData.get("description") ?? ""),
        amount: Number(formData.get("amount")) || 0,
        dueDate: formData.get("dueDate") ? new Date(String(formData.get("dueDate"))) : null,
        paidAt: formData.get("paidAt") ? new Date(String(formData.get("paidAt"))) : null,
        clientId: String(formData.get("clientId") ?? ""),
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/finance");
    redirect("/admin/finance");
  }

  async function createTransaction(formData: FormData) {
    "use server";

    await prisma.financeTransaction.create({
      data: {
        type: String(formData.get("type") ?? TransactionType.CASH_IN) as TransactionType,
        title: String(formData.get("title") ?? ""),
        category: String(formData.get("category") ?? ""),
        amount: Number(formData.get("amount")) || 0,
        transactionDate: new Date(String(formData.get("transactionDate"))),
        clientId: String(formData.get("clientId") ?? "") || null,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/finance");
    redirect("/admin/finance");
  }

  return (
    <div>
      <AdminTopbar
        title="Keuangan"
        description="Pembayaran dan cashflow."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="glass-card rounded-[30px] p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Tambah pembayaran klien</p>
          <form action={createPayment} className="mt-5">
            <div className="form-grid">
              <select name="clientId" className="input-base" required>
                <option value="">Pilih klien</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.fullName}
                  </option>
                ))}
              </select>
              <select name="type" className="input-base" defaultValue={PaymentType.DP}>
                {Object.values(PaymentType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <select name="status" className="input-base" defaultValue={PaymentStatus.BELUM_BAYAR}>
                {Object.values(PaymentStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <input name="amount" type="number" placeholder="Jumlah" className="input-base" required />
              <input name="dueDate" type="date" className="input-base" />
              <input name="paidAt" type="date" className="input-base" />
            </div>
            <input name="description" placeholder="Deskripsi pembayaran" className="input-base mt-4" required />
            <div className="mt-4">
              <SubmitButton pendingText="Menyimpan pembayaran...">Tambah Pembayaran</SubmitButton>
            </div>
          </form>
        </div>

        <div className="glass-card rounded-[30px] p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Tambah transaksi</p>
          <form action={createTransaction} className="mt-5">
            <div className="form-grid">
              <select name="type" className="input-base" defaultValue={TransactionType.CASH_IN}>
                {Object.values(TransactionType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <input name="title" placeholder="Judul transaksi" className="input-base" required />
              <input name="category" placeholder="Kategori" className="input-base" required />
              <input name="amount" type="number" placeholder="Jumlah" className="input-base" required />
              <input name="transactionDate" type="date" className="input-base" required />
              <select name="clientId" className="input-base">
                <option value="">Tautkan klien (opsional)</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.fullName}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4">
              <SubmitButton pendingText="Menyimpan transaksi...">Tambah Transaksi</SubmitButton>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="glass-card rounded-[30px] p-6">
          <h3 className="text-2xl font-semibold text-[var(--brand-deep)]">Histori pembayaran</h3>
          <div className="mt-5 table-shell">
            <table>
              <thead>
                <tr>
                  <th>Kuitansi</th>
                  <th>Klien</th>
                  <th>Status</th>
                  <th>Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td>
                      <p className="font-semibold text-[var(--brand-deep)]">{payment.receiptNumber}</p>
                      <p className="text-sm text-[var(--muted)]">{payment.description}</p>
                    </td>
                    <td>{payment.client.fullName}</td>
                    <td>{payment.status}</td>
                    <td>{formatCurrency(payment.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card rounded-[30px] p-6">
          <h3 className="text-2xl font-semibold text-[var(--brand-deep)]">Cashflow</h3>
          <div className="mt-5 table-shell">
            <table>
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Transaksi</th>
                  <th>Kategori</th>
                  <th>Jumlah</th>
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
                    <td>{formatCurrency(transaction.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
