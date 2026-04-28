// Penjelasan file: halaman admin untuk daftar calon klien.
import Link from "next/link";
import { LeadStatus, VenuePreference } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { Badge } from "@/components/ui/badge";
import { SubmitButton } from "@/components/ui/submit-button";
import { ADMIN_ACTION_ACCESS, ADMIN_ROUTE_ACCESS, hasRoleAccess } from "@/shared/config/access";
import { requireRole } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { formatDate } from "@/shared/lib/format";

export default async function LeadsPage({
  searchParams,
  mode = "list",
  routeBase = "/admin/calon-klien",
}: {
  searchParams: Promise<{ q?: string; edit?: string }>;
  mode?: "list" | "create" | "edit";
  routeBase?: string;
}) {
  const session = await requireRole(ADMIN_ROUTE_ACCESS.leads);
  const canManageLeads = hasRoleAccess(ADMIN_ACTION_ACCESS.leadsManage, session.role);
  const params = await searchParams;
  const query = params.q?.trim();
  const editId = params.edit;
  const currentMode = mode === "create" ? "create" : editId ? "edit" : "list";

  const leads = await prisma.lead.findMany({
    where: query
      ? {
          OR: [
            { name: { contains: query } },
            { location: { contains: query } },
            { source: { contains: query } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
  });

  const editingLead =
    currentMode === "edit" && editId
      ? await prisma.lead.findUnique({
          where: { id: editId },
        })
      : null;

  async function upsertLead(formData: FormData) {
    "use server";
    await requireRole(ADMIN_ACTION_ACCESS.leadsManage);

    const id = String(formData.get("id") ?? "").trim();
    const payload = {
      name: String(formData.get("name") ?? ""),
      whatsapp: String(formData.get("whatsapp") ?? ""),
      eventDate: formData.get("eventDate") ? new Date(String(formData.get("eventDate"))) : null,
      location: String(formData.get("location") ?? ""),
      budget: Number(formData.get("budget")) || null,
      preferredVenue: (String(formData.get("preferredVenue") ?? "") || null) as VenuePreference | null,
      guestCount: Number(formData.get("guestCount")) || null,
      neededServices: String(formData.get("neededServices") ?? ""),
      notes: String(formData.get("notes") ?? "") || null,
      status: String(formData.get("status") ?? LeadStatus.LEAD) as LeadStatus,
    };

    if (id) {
      await prisma.lead.update({ where: { id }, data: payload });
    } else {
      await prisma.lead.create({ data: payload });
    }

    revalidatePath("/admin");
    revalidatePath("/admin/leads");
    revalidatePath(routeBase);
    redirect(routeBase);
  }

  async function deleteLead(formData: FormData) {
    "use server";
    await requireRole(ADMIN_ACTION_ACCESS.leadsManage);
    const id = String(formData.get("id"));
    await prisma.lead.delete({ where: { id } });
    revalidatePath("/admin");
    revalidatePath("/admin/leads");
    revalidatePath(routeBase);
    redirect(routeBase);
  }

  if (canManageLeads && (currentMode === "create" || currentMode === "edit")) {
    return (
      <div>
        <AdminTopbar
          title={currentMode === "edit" ? "Edit Calon Klien" : "Tambah Calon Klien"}
          description="Lengkapi data calon klien lalu simpan kembali ke daftar."
        />
        <div className="admin-form-panel">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="admin-panel-kicker">{currentMode === "edit" ? "Edit calon klien" : "Tambah calon klien"}</p>
              <h3 className="admin-panel-title">{editingLead?.name ?? "Data calon klien baru"}</h3>
            </div>
            <Link href={routeBase} className="text-sm font-semibold text-[var(--brand-deep)]">
              Kembali ke list
            </Link>
          </div>
          <form action={upsertLead}>
            <input type="hidden" name="id" defaultValue={editingLead?.id ?? ""} />
            <div className="form-grid">
              <input name="name" defaultValue={editingLead?.name ?? ""} placeholder="Nama" className="input-base" required />
              <input name="whatsapp" defaultValue={editingLead?.whatsapp ?? ""} placeholder="WhatsApp" className="input-base" required />
              <input name="eventDate" type="date" defaultValue={editingLead?.eventDate ? new Date(editingLead.eventDate).toISOString().slice(0, 10) : ""} className="input-base" />
              <input name="location" defaultValue={editingLead?.location ?? ""} placeholder="Lokasi acara" className="input-base" required />
              <input name="budget" type="number" defaultValue={editingLead?.budget ?? ""} placeholder="Budget" className="input-base" />
              <select name="preferredVenue" defaultValue={editingLead?.preferredVenue ?? ""} className="input-base">
                <option value="">Preferensi venue</option>
                {Object.values(VenuePreference).map((venue) => (
                  <option key={venue} value={venue}>
                    {venue}
                  </option>
                ))}
              </select>
              <input name="guestCount" type="number" defaultValue={editingLead?.guestCount ?? ""} placeholder="Jumlah tamu" className="input-base" />
              <select name="status" defaultValue={editingLead?.status ?? LeadStatus.LEAD} className="input-base">
                {Object.values(LeadStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <input name="neededServices" defaultValue={editingLead?.neededServices ?? ""} placeholder="Layanan dibutuhkan" className="input-base md:col-span-2" required />
            </div>
            <textarea name="notes" defaultValue={editingLead?.notes ?? ""} placeholder="Catatan admin atau brief awal" className="input-base mt-4 min-h-32" />
            <div className="mt-4">
              <SubmitButton pendingText="Menyimpan calon klien...">
                {currentMode === "edit" ? "Simpan Perubahan" : "Simpan Calon Klien"}
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
        title="Calon Klien"
        description="Prospek baru dari website, Instagram, dan WhatsApp."
      />
      <div className="admin-list-panel">
        <div className="admin-toolbar">
          <form action={routeBase}>
            <div className="admin-search-row">
              <input name="q" defaultValue={query ?? ""} placeholder="Cari calon klien..." className="input-base" />
              <button type="submit" className="admin-search-button">
                Cari
              </button>
            </div>
          </form>
          {canManageLeads ? (
            <Link href={`${routeBase}/tambah`} className="admin-primary-link">
              + Tambah
            </Link>
          ) : null}
        </div>
        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Tanggal Input</th>
                <th>Sumber</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="font-medium text-[var(--brand-deep)]">{lead.name}</td>
                  <td>{formatDate(lead.createdAt)}</td>
                  <td>{lead.source}</td>
                  <td>
                    <Badge tone={lead.status === LeadStatus.DEAL ? "success" : "brand"}>{lead.status}</Badge>
                  </td>
                  <td>
                    {canManageLeads ? (
                      <div className="flex gap-2">
                        <Link href={`${routeBase}?edit=${lead.id}`} className="admin-table-link">
                          Edit
                        </Link>
                        <form action={deleteLead}>
                          <input type="hidden" name="id" value={lead.id} />
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
