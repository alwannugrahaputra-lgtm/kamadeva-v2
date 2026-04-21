// Penjelasan file: halaman admin untuk modul operasional terkait.
import Link from "next/link";
import { VendorCategory } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { Badge } from "@/components/ui/badge";
import { SubmitButton } from "@/components/ui/submit-button";
import { ADMIN_ACTION_ACCESS, ADMIN_ROUTE_ACCESS, hasRoleAccess } from "@/shared/config/access";
import { requireRole } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { formatCurrency } from "@/shared/lib/format";

export default async function VendorsPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const session = await requireRole(ADMIN_ROUTE_ACCESS.vendors);
  const canManageVendors = hasRoleAccess(ADMIN_ACTION_ACCESS.vendorsManage, session.role);
  const params = await searchParams;
  const editingVendor = params.edit
    ? await prisma.vendor.findUnique({
        where: { id: params.edit },
      })
    : null;

  const vendors = await prisma.vendor.findMany({
    orderBy: { createdAt: "desc" },
  });

  async function upsertVendor(formData: FormData) {
    "use server";
    await requireRole(ADMIN_ACTION_ACCESS.vendorsManage);

    const id = String(formData.get("id") ?? "").trim();
    const payload = {
      name: String(formData.get("name") ?? ""),
      category: String(formData.get("category") ?? VendorCategory.LAINNYA) as VendorCategory,
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? "") || null,
      address: String(formData.get("address") ?? "") || null,
      priceStart: Number(formData.get("priceStart")) || null,
      rating: Number(formData.get("rating")) || null,
      collaborationLog: String(formData.get("collaborationLog") ?? "") || null,
      performanceNotes: String(formData.get("performanceNotes") ?? "") || null,
      isActive: String(formData.get("isActive") ?? "true") === "true",
    };

    if (id) {
      await prisma.vendor.update({ where: { id }, data: payload });
    } else {
      await prisma.vendor.create({ data: payload });
    }

    revalidatePath("/admin");
    revalidatePath("/admin/vendors");
    redirect("/admin/vendors");
  }

  async function deleteVendor(formData: FormData) {
    "use server";
    await requireRole(ADMIN_ACTION_ACCESS.vendorsManage);
    const id = String(formData.get("id"));
    await prisma.vendor.delete({ where: { id } });
    revalidatePath("/admin/vendors");
    redirect("/admin/vendors");
  }

  return (
    <div>
      <AdminTopbar
        title="Vendor"
        description="Daftar vendor dan performanya."
      />
      <div className={canManageVendors ? "grid gap-6 xl:grid-cols-[0.9fr_1.1fr]" : "grid gap-6"}>
        {canManageVendors ? (
        <div className="glass-card rounded-[30px] p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">
                {editingVendor ? "Edit vendor" : "Tambah vendor"}
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-[var(--brand-deep)]">
                {editingVendor?.name ?? "Data vendor baru"}
              </h3>
            </div>
            {editingVendor ? (
              <Link href="/admin/vendors" className="text-sm font-semibold text-[var(--brand-deep)]">
                Reset form
              </Link>
            ) : null}
          </div>
          <form action={upsertVendor}>
            <input type="hidden" name="id" defaultValue={editingVendor?.id ?? ""} />
            <div className="form-grid">
              <input name="name" defaultValue={editingVendor?.name ?? ""} placeholder="Nama vendor" className="input-base" required />
              <select name="category" defaultValue={editingVendor?.category ?? VendorCategory.LAINNYA} className="input-base">
                {Object.values(VendorCategory).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <input name="phone" defaultValue={editingVendor?.phone ?? ""} placeholder="Kontak vendor" className="input-base" required />
              <input name="email" defaultValue={editingVendor?.email ?? ""} placeholder="Email" className="input-base" />
              <input name="address" defaultValue={editingVendor?.address ?? ""} placeholder="Alamat vendor" className="input-base" />
              <input name="priceStart" type="number" defaultValue={editingVendor?.priceStart ?? ""} placeholder="Harga mulai" className="input-base" />
              <input name="rating" type="number" step="0.1" defaultValue={editingVendor?.rating ?? ""} placeholder="Rating" className="input-base" />
              <select name="isActive" defaultValue={editingVendor?.isActive ? "true" : "false"} className="input-base">
                <option value="true">Aktif</option>
                <option value="false">Nonaktif</option>
              </select>
            </div>
            <textarea name="collaborationLog" defaultValue={editingVendor?.collaborationLog ?? ""} placeholder="Histori kerja sama" className="input-base mt-4 min-h-28" />
            <textarea name="performanceNotes" defaultValue={editingVendor?.performanceNotes ?? ""} placeholder="Catatan performa vendor" className="input-base mt-4 min-h-28" />
            <div className="mt-4">
              <SubmitButton pendingText="Menyimpan vendor...">
                {editingVendor ? "Update Vendor" : "Tambah Vendor"}
              </SubmitButton>
            </div>
          </form>
        </div>
        ) : null}

        <div className="glass-card rounded-[30px] p-6">
          <div className="table-shell">
            <table>
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>Kategori</th>
                  <th>Harga</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((vendor) => (
                  <tr key={vendor.id}>
                    <td>
                      <p className="font-semibold text-[var(--brand-deep)]">{vendor.name}</p>
                      <p className="text-sm text-[var(--muted)]">{vendor.phone}</p>
                    </td>
                    <td>{vendor.category}</td>
                    <td>{formatCurrency(vendor.priceStart)}</td>
                    <td>{vendor.rating ?? "-"}</td>
                    <td>
                      <Badge tone={vendor.isActive ? "success" : "warning"}>{vendor.isActive ? "Aktif" : "Nonaktif"}</Badge>
                    </td>
                    <td>
                      {canManageVendors ? (
                        <div className="flex gap-2">
                          <Link href={`/admin/vendors?edit=${vendor.id}`} className="rounded-full border border-[var(--line)] px-3 py-2 text-xs font-semibold">
                            Edit
                          </Link>
                          <form action={deleteVendor}>
                            <input type="hidden" name="id" value={vendor.id} />
                            <button type="submit" className="rounded-full bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                              Hapus
                            </button>
                          </form>
                        </div>
                      ) : (
                        <span className="text-xs text-[var(--muted)]">Lihat saja</span>
                      )}
                    </td>
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
