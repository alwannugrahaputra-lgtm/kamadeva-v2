import Link from "next/link";
import { VenuePreference } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { Badge } from "@/components/ui/badge";
import { SubmitButton } from "@/components/ui/submit-button";
import { ADMIN_ACTION_ACCESS, ADMIN_ROUTE_ACCESS, hasRoleAccess } from "@/shared/config/access";
import { requireRole } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { formatCurrency } from "@/shared/lib/format";
import { slugify } from "@/shared/lib/utils";

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const session = await requireRole(ADMIN_ROUTE_ACCESS.packages);
  const canManagePackages = hasRoleAccess(ADMIN_ACTION_ACCESS.packagesManage, session.role);
  const params = await searchParams;
  const editingPackage = params.edit
    ? await prisma.weddingPackage.findUnique({
        where: { id: params.edit },
      })
    : null;

  const packages = await prisma.weddingPackage.findMany({
    orderBy: { price: "asc" },
  });

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
      minGuests: Number(formData.get("minGuests")) || null,
      maxGuests: Number(formData.get("maxGuests")) || null,
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
    redirect("/admin/packages");
  }

  async function deletePackage(formData: FormData) {
    "use server";
    await requireRole(ADMIN_ACTION_ACCESS.packagesManage);
    const id = String(formData.get("id"));
    await prisma.weddingPackage.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/paket");
    revalidatePath("/admin/packages");
    redirect("/admin/packages");
  }

  return (
    <div>
      <AdminTopbar
        title="Paket Wedding"
        description="Paket, harga, dan detail layanan."
      />
      <div className={canManagePackages ? "grid gap-6 xl:grid-cols-[0.9fr_1.1fr]" : "grid gap-6"}>
        {canManagePackages ? (
        <div className="glass-card rounded-[30px] p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">
                {editingPackage ? "Edit paket" : "Tambah paket"}
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-[var(--brand-deep)]">
                {editingPackage?.name ?? "Paket baru"}
              </h3>
            </div>
            {editingPackage ? (
              <Link href="/admin/packages" className="text-sm font-semibold text-[var(--brand-deep)]">
                Reset form
              </Link>
            ) : null}
          </div>
          <form action={upsertPackage}>
            <input type="hidden" name="id" defaultValue={editingPackage?.id ?? ""} />
            <div className="form-grid">
              <input name="name" defaultValue={editingPackage?.name ?? ""} placeholder="Nama paket" className="input-base" required />
              <input name="price" type="number" defaultValue={editingPackage?.price ?? ""} placeholder="Harga" className="input-base" required />
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
                <option value="false">Tidak featured</option>
                <option value="true">Featured</option>
              </select>
              <select name="isActive" defaultValue={editingPackage?.isActive ? "true" : "false"} className="input-base">
                <option value="true">Aktif</option>
                <option value="false">Nonaktif</option>
              </select>
            </div>
            <textarea name="description" defaultValue={editingPackage?.description ?? ""} placeholder="Deskripsi paket" className="input-base mt-4 min-h-28" required />
            <textarea name="facilities" defaultValue={editingPackage?.facilities ?? ""} placeholder="Detail fasilitas" className="input-base mt-4 min-h-28" required />
            <textarea name="includedVendors" defaultValue={editingPackage?.includedVendors ?? ""} placeholder="Vendor yang termasuk" className="input-base mt-4 min-h-28" required />
            <textarea name="addOns" defaultValue={editingPackage?.addOns ?? ""} placeholder="Opsi tambahan" className="input-base mt-4 min-h-28" required />
            <div className="mt-4">
              <SubmitButton pendingText="Menyimpan paket...">
                {editingPackage ? "Update Paket" : "Tambah Paket"}
              </SubmitButton>
            </div>
          </form>
        </div>
        ) : null}
        <div className="grid gap-5">
          {packages.map((pkg) => (
            <div key={pkg.id} className="glass-card rounded-[30px] p-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone="brand">{pkg.recommendedVenue ?? "Fleksibel"}</Badge>
                {pkg.isFeatured ? <Badge tone="success">Featured</Badge> : null}
                {!pkg.isActive ? <Badge tone="warning">Nonaktif</Badge> : null}
              </div>
              <h3 className="mt-3 text-2xl font-semibold text-[var(--brand-deep)]">{pkg.name}</h3>
              <p className="mt-2 text-lg font-semibold text-[var(--brand)]">{formatCurrency(pkg.price)}</p>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{pkg.description}</p>
              {canManagePackages ? (
                <div className="mt-4 flex gap-2">
                  <Link href={`/admin/packages?edit=${pkg.id}`} className="rounded-full border border-[var(--line)] px-4 py-2 text-xs font-semibold">
                    Edit
                  </Link>
                  <form action={deletePackage}>
                    <input type="hidden" name="id" value={pkg.id} />
                    <button type="submit" className="rounded-full bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700">
                      Hapus
                    </button>
                  </form>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
