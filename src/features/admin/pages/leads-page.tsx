// Penjelasan file: halaman admin untuk modul operasional terkait.
import Link from "next/link";
import { ClientStatus, LeadStatus, VenuePreference } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { Badge } from "@/components/ui/badge";
import { SubmitButton } from "@/components/ui/submit-button";
import { ADMIN_ACTION_ACCESS, ADMIN_ROUTE_ACCESS, hasRoleAccess } from "@/shared/config/access";
import { requireRole } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { formatCurrency, formatDate } from "@/shared/lib/format";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const session = await requireRole(ADMIN_ROUTE_ACCESS.leads);
  const canManageLeads = hasRoleAccess(ADMIN_ACTION_ACCESS.leadsManage, session.role);
  const params = await searchParams;
  const editingLead = params.edit
    ? await prisma.lead.findUnique({
        where: { id: params.edit },
      })
    : null;

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  });

  async function convertLeadToClient(formData: FormData) {
    "use server";
    await requireRole(ADMIN_ACTION_ACCESS.leadsManage);

    const leadId = String(formData.get("id") ?? "").trim();
    if (!leadId) {
      redirect("/admin/leads");
    }

    const createdClient = await prisma.$transaction(async (tx) => {
      const lead = await tx.lead.findUnique({
        where: { id: leadId },
      });

      if (!lead) {
        throw new Error("Data calon klien tidak ditemukan.");
      }

      const client = await tx.client.create({
        data: {
          fullName: lead.name,
          phone: lead.whatsapp,
          eventDate: lead.eventDate,
          eventLocation: lead.location,
          eventType: "Wedding",
          budget: lead.budget,
          preferredVenue: lead.preferredVenue,
          guestCount: lead.guestCount,
          status: ClientStatus.PROSPEK,
          specialNotes: [lead.neededServices, lead.notes].filter(Boolean).join("\n\n"),
        },
      });

      // Pindahkan seluruh relasi agar histori calon klien tetap ikut
      // menjadi histori klien baru tanpa kehilangan jejak data.
      await tx.communicationLog.updateMany({
        where: { leadId: lead.id },
        data: {
          clientId: client.id,
          leadId: null,
        },
      });

      await tx.document.updateMany({
        where: { leadId: lead.id },
        data: {
          clientId: client.id,
          leadId: null,
        },
      });

      await tx.scheduleItem.updateMany({
        where: { leadId: lead.id },
        data: {
          clientId: client.id,
          leadId: null,
        },
      });

      await tx.whatsAppSync.updateMany({
        where: { leadId: lead.id },
        data: {
          clientId: client.id,
          leadId: null,
        },
      });

      await tx.lead.delete({
        where: { id: lead.id },
      });

      return client;
    });

    revalidatePath("/admin");
    revalidatePath("/admin/leads");
    revalidatePath("/admin/clients");
    revalidatePath("/admin/schedule");
    revalidatePath("/admin/documents");
    revalidatePath("/admin/whatsapp");
    redirect(`/admin/clients?edit=${createdClient.id}`);
  }

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
    redirect("/admin/leads");
  }

  async function deleteLead(formData: FormData) {
    "use server";
    await requireRole(ADMIN_ACTION_ACCESS.leadsManage);
    const id = String(formData.get("id"));
    await prisma.lead.delete({ where: { id } });
    revalidatePath("/admin/leads");
    redirect("/admin/leads");
  }

  return (
    <div>
      <AdminTopbar
        title="Calon Klien"
        description="Prospek baru dari website dan konsultasi awal."
      />
      <div className={canManageLeads ? "grid gap-6 xl:grid-cols-[0.9fr_1.1fr]" : "grid gap-6"}>
        {canManageLeads ? (
        <div className="glass-card rounded-[30px] p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">
                {editingLead ? "Edit calon klien" : "Tambah calon klien"}
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-[var(--brand-deep)]">
                {editingLead?.name ?? "Calon klien baru"}
              </h3>
            </div>
            {editingLead ? (
              <Link href="/admin/leads" className="text-sm font-semibold text-[var(--brand-deep)]">
                Reset form
              </Link>
            ) : null}
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
                {editingLead ? "Update Calon Klien" : "Tambah Calon Klien"}
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
                  <th>Calon klien</th>
                  <th>Tanggal</th>
                  <th>Kebutuhan</th>
                  <th>Status</th>
                  <th>Budget</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <p className="font-semibold text-[var(--brand-deep)]">{lead.name}</p>
                      <p className="text-sm text-[var(--muted)]">{lead.whatsapp}</p>
                    </td>
                    <td>
                      <p>{formatDate(lead.eventDate)}</p>
                      <p className="text-sm text-[var(--muted)]">{lead.location}</p>
                    </td>
                    <td className="text-sm text-[var(--muted)]">{lead.neededServices}</td>
                    <td>
                      <Badge tone={lead.status === LeadStatus.DEAL ? "success" : "brand"}>{lead.status}</Badge>
                    </td>
                    <td>{formatCurrency(lead.budget)}</td>
                    <td>
                      {canManageLeads ? (
                        <div className="flex flex-wrap gap-2">
                          <Link href={`/admin/leads?edit=${lead.id}`} className="rounded-full border border-[var(--line)] px-3 py-2 text-xs font-semibold">
                            Edit
                          </Link>
                          <form action={convertLeadToClient}>
                            <input type="hidden" name="id" value={lead.id} />
                            <button type="submit" className="rounded-full bg-[var(--soft)] px-3 py-2 text-xs font-semibold text-[var(--brand-deep)]">
                              Ubah jadi Klien
                            </button>
                          </form>
                          <form action={deleteLead}>
                            <input type="hidden" name="id" value={lead.id} />
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
