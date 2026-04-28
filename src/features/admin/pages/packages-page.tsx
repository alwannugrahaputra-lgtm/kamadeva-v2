// Penjelasan file: halaman admin paket wedding mengikuti alur mockup list dan form.
import Link from "next/link";
import { VenuePreference } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { SubmitButton } from "@/components/ui/submit-button";
import { ADMIN_ACTION_ACCESS, ADMIN_ROUTE_ACCESS, hasRoleAccess } from "@/shared/config/access";
import { requireRole } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { formatCurrency } from "@/shared/lib/format";
import { slugify } from "@/shared/lib/utils";

function parseNullableNumber(value: FormDataEntryValue | null) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export default async function PackagesPage({
  searchParams,
  mode = "list",
  routeBase = "/admin/paket-wedding",
}: {
  searchParams: Promise<{ q?: string; edit?: string }>;
  mode?: "list" | "create" | "edit";
  routeBase?: string;
}) {
  const session = await requireRole(ADMIN_ROUTE_ACCESS.packages);
  const canManagePackages = hasRoleAccess(ADMIN_ACTION_ACCESS.packagesManage, session.role);
  const params = await searchParams;
  const query = params.q?.trim();
  const editId = params.edit;
  const currentMode = mode === "create" ? "create" : editId ? "edit" : "list";

  const packages = await prisma.weddingPackage.findMany({
    where: query
      ? {
          OR: [{ name: { contains: query } }, { description: { contains: query } }],
        }
      : undefined,
    orderBy: { price: "asc" },
  });

  const editingPackage =
    currentMode === "edit" && editId
      ? await prisma.weddingPackage.findUnique({
          where: { id: editId },
        })
      : null;

  async function upsertPackage(formData: FormData) {
    "use server";
    await requireRole(ADMIN_ACTION_ACCESS.packagesManage);

    const id = String(formData.get("id") ?? "").trim();
    const name = String(formData.get("name") ?? "");
    const payload = {
      name,
      slug: slugify(name),
      price: Number(formData.get("price")) || 0,
      description: String(formData.get("description") ?? ""),
      facilities: String(formData.get("facilities") ?? ""),
      includedVendors: String(formData.get("includedVendors") ?? ""),
      addOns: String(formData.get("addOns") ?? ""),
      recommendedVenue: (String(formData.get("recommendedVenue") ?? "") || null) as VenuePreference | null,
      minGuests: parseNullableNumber(formData.get("minGuests")),
      maxGuests: parseNullableNumber(formData.get("maxGuests")),
      isFeatured: String(formData.get("isFeatured") ?? "false") === "true",
      isActive: String(formData.get("isActive") ?? "true") === "true",
    };

    if (id) {
      await prisma.weddingPackage.update({ where: { id }, data: payload });
    } else {
      await prisma.weddingPackage.create({ data: payload });
    }

    revalidatePath("/");
    revalidatePath("/paket");
    revalidatePath("/admin/packages");
    revalidatePath(routeBase);
    redirect(routeBase);
  }

  async function deletePackage(formData: FormData) {
    "use server";
    await requireRole(ADMIN_ACTION_ACCESS.packagesManage);
    const id = String(formData.get("id"));
    await prisma.weddingPackage.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/paket");
    revalidatePath("/admin/packages");
    revalidatePath(routeBase);
    redirect(routeBase);
  }

  if (canManagePackages && (currentMode === "create" || currentMode === "edit")) {
    return (
      <div>
        <AdminTopbar
          title={currentMode === "edit" ? "Edit Paket" : "Tambah Paket"}
          description="Lengkapi detail paket lalu simpan kembali ke daftar."
        />
        <div className="admin-form-panel">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="admin-panel-kicker">{currentMode === "edit" ? "Edit paket" : "Tambah paket"}</p>
              <h3 className="admin-panel-title">{editingPackage?.name ?? "Paket baru"}</h3>
            </div>
            <Link href={routeBase} className="text-sm font-semibold text-[var(--brand-deep)]">
              Kembali ke list
            </Link>
          </div>
          <form action={upsertPackage}>
            <input type="hidden" name="id" defaultValue={editingPackage?.id ?? ""} />
            <div className="form-grid">
              <input name="name" defaultValue={editingPackage?.name ?? ""} placeholder="Nama paket" className="input-base" required />
              <input name="price" type="number" defaultValue={editingPackage?.price ?? ""} placeholder="Mulai dari" className="input-base" required />
              <select name="recommendedVenue" defaultValue={editingPackage?.recommendedVenue ?? ""} className="input-base">
                <option value="">Venue rekomendasi</option>
                {Object.values(VenuePreference).map((venue) => (
                  <option key={venue} value={venue}>
                    {venue}
                  </option>
                ))}
              </select>
              <input name="minGuests" type="number" defaultValue={editingPackage?.minGuests ?? ""} placeholder="Min tamu" className="input-base" />
              <input name="maxGuests" type="number" defaultValue={editingPackage?.maxGuests ?? ""} placeholder="Max tamu" className="input-base" />
              <select name="isFeatured" defaultValue={editingPackage?.isFeatured ? "true" : "false"} className="input-base">
                <option value="false">Biasa</option>
                <option value="true">Most popular</option>
              </select>
              <select name="isActive" defaultValue={editingPackage?.isActive ? "true" : "false"} className="input-base">
                <option value="true">Aktif</option>
                <option value="false">Nonaktif</option>
              </select>
            </div>
            <textarea name="description" defaultValue={editingPackage?.description ?? ""} placeholder="Deskripsi paket" className="input-base mt-4 min-h-24" required />
            <textarea name="facilities" defaultValue={editingPackage?.facilities ?? ""} placeholder="Fasilitas paket" className="input-base mt-4 min-h-24" required />
            <textarea name="includedVendors" defaultValue={editingPackage?.includedVendors ?? ""} placeholder="Vendor yang termasuk" className="input-base mt-4 min-h-24" required />
            <textarea name="addOns" defaultValue={editingPackage?.addOns ?? ""} placeholder="Tambahan layanan" className="input-base mt-4 min-h-24" />
            <div className="mt-4">
              <SubmitButton pendingText="Menyimpan paket...">
                {currentMode === "edit" ? "Simpan Perubahan" : "Simpan Paket"}
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
        title="Paket Wedding"
        description="Daftar paket yang ditawarkan ke calon klien Kamadeva."
      />
      <div className="admin-list-panel">
        <div className="admin-toolbar">
          <form action={routeBase}>
            <div className="admin-search-row">
              <input name="q" defaultValue={query ?? ""} placeholder="Cari paket..." className="input-base" />
              <button type="submit" className="admin-search-button">
                Cari
              </button>
            </div>
          </form>
          {canManagePackages ? (
            <Link href={`${routeBase}/tambah`} className="admin-primary-link">
              + Tambah Paket
            </Link>
          ) : null}
        </div>

        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>Nama Paket</th>
                <th>Mulai Dari</th>
                <th>Kapasitas</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => (
                <tr key={pkg.id}>
                  <td>
                    <p className="font-semibold text-[var(--brand-deep)]">{pkg.name}</p>
                    <p className="text-sm text-[var(--muted)]">{pkg.isFeatured ? "Most popular" : "Standard"}</p>
                  </td>
                  <td>{formatCurrency(pkg.price)}</td>
                  <td>{pkg.maxGuests ? `${pkg.maxGuests} Pax` : "-"}</td>
                  <td>
                    {canManagePackages ? (
                      <div className="flex gap-2">
                        <Link href={`${routeBase}?edit=${pkg.id}`} className="admin-table-link">
                          Edit
                        </Link>
                        <form action={deletePackage}>
                          <input type="hidden" name="id" value={pkg.id} />
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
