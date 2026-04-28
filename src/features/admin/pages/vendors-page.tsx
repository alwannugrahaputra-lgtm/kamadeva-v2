// Penjelasan file: halaman admin vendor dengan pola list dan form seperti mockup.
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

function parseNullableNumber(value: FormDataEntryValue | null) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export default async function VendorsPage({
  searchParams,
  mode = "list",
  routeBase = "/admin/vendor",
}: {
  searchParams: Promise<{ q?: string; edit?: string }>;
  mode?: "list" | "create" | "edit";
  routeBase?: string;
}) {
  const session = await requireRole(ADMIN_ROUTE_ACCESS.vendors);
  const canManageVendors = hasRoleAccess(ADMIN_ACTION_ACCESS.vendorsManage, session.role);
  const params = await searchParams;
  const query = params.q?.trim();
  const editId = params.edit;
  const currentMode = mode === "create" ? "create" : editId ? "edit" : "list";

  const vendors = await prisma.vendor.findMany({
    where: query
      ? {
          OR: [
            { name: { contains: query } },
            { phone: { contains: query } },
            { address: { contains: query } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
  });

  const editingVendor =
    currentMode === "edit" && editId
      ? await prisma.vendor.findUnique({
          where: { id: editId },
        })
      : null;

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
      priceStart: parseNullableNumber(formData.get("priceStart")),
      rating: parseNullableNumber(formData.get("rating")),
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
    revalidatePath(routeBase);
    redirect(routeBase);
  }

  async function deleteVendor(formData: FormData) {
    "use server";
    await requireRole(ADMIN_ACTION_ACCESS.vendorsManage);
    const id = String(formData.get("id"));
    await prisma.vendor.delete({ where: { id } });
    revalidatePath("/admin");
    revalidatePath("/admin/vendors");
    revalidatePath(routeBase);
    redirect(routeBase);
  }

  if (canManageVendors && (currentMode === "create" || currentMode === "edit")) {
    return (
      <div>
        <AdminTopbar
          title={currentMode === "edit" ? "Edit Vendor" : "Tambah Vendor"}
          description="Lengkapi data vendor lalu simpan kembali ke daftar."
        />

        <div className="admin-form-panel">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="admin-panel-kicker">{currentMode === "edit" ? "Edit vendor" : "Tambah vendor"}</p>
              <h3 className="admin-panel-title">{editingVendor?.name ?? "Vendor baru"}</h3>
            </div>
            <Link href={routeBase} className="text-sm font-semibold text-[var(--brand-deep)]">
              Kembali ke list
            </Link>
          </div>
          <form action={upsertVendor}>
            <input type="hidden" name="id" defaultValue={editingVendor?.id ?? ""} />
            <div className="form-grid">
              <input name="name" defaultValue={editingVendor?.name ?? ""} placeholder="Nama vendor" className="input-base" required />
              <select name="category" defaultValue={editingVendor?.category ?? VendorCategory.DEKORASI} className="input-base">
                {Object.values(VendorCategory).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <input name="phone" defaultValue={editingVendor?.phone ?? ""} placeholder="Kontak" className="input-base" required />
              <input name="email" defaultValue={editingVendor?.email ?? ""} placeholder="Email" className="input-base" />
              <input name="address" defaultValue={editingVendor?.address ?? ""} placeholder="Alamat" className="input-base" />
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
                {currentMode === "edit" ? "Simpan Perubahan" : "Simpan Vendor"}
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
        title="Vendor"
        description="Daftar vendor pendukung yang dipakai tim Kamadeva."
      />
      <div className="admin-list-panel">
        <div className="admin-toolbar">
          <form action={routeBase}>
            <div className="admin-search-row">
              <input name="q" defaultValue={query ?? ""} placeholder="Cari vendor..." className="input-base" />
              <button type="submit" className="admin-search-button">
                Cari
              </button>
            </div>
          </form>
          {canManageVendors ? (
            <Link href={`${routeBase}/tambah`} className="admin-primary-link">
              + Tambah Vendor
            </Link>
          ) : null}
        </div>

        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>Nama Vendor</th>
                <th>Kategori</th>
                <th>Kontak</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor.id}>
                  <td>
                    <p className="font-semibold text-[var(--brand-deep)]">{vendor.name}</p>
                    <p className="text-sm text-[var(--muted)]">{vendor.address ?? "-"}</p>
                  </td>
                  <td>{vendor.category}</td>
                  <td>{vendor.phone}</td>
                  <td>
                    <Badge tone={vendor.isActive ? "success" : "warning"}>{vendor.isActive ? "Aktif" : "Nonaktif"}</Badge>
                  </td>
                  <td>
                    {canManageVendors ? (
                      <div className="flex gap-2">
                        <Link href={`${routeBase}?edit=${vendor.id}`} className="admin-table-link">
                          Edit
                        </Link>
                        <form action={deleteVendor}>
                          <input type="hidden" name="id" value={vendor.id} />
                          <button type="submit" className="admin-danger-link">
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
  );
}
