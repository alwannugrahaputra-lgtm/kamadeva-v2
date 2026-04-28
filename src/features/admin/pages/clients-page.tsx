// Penjelasan file: halaman admin untuk modul CRM client.
import Link from "next/link";
import { ClientStatus, VenuePreference } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { Badge } from "@/components/ui/badge";
import { SubmitButton } from "@/components/ui/submit-button";
import { ADMIN_ACTION_ACCESS, ADMIN_ROUTE_ACCESS, hasRoleAccess } from "@/shared/config/access";
import { requireRole } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { formatCurrency, formatDate } from "@/shared/lib/format";

function parseNullableNumber(value: FormDataEntryValue | null) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export default async function ClientsPage({
  searchParams,
  mode = "list",
  routeBase = "/admin/crm-client",
}: {
  searchParams: Promise<{ q?: string; edit?: string }>;
  mode?: "list" | "create" | "edit";
  routeBase?: string;
}) {
  const session = await requireRole(ADMIN_ROUTE_ACCESS.clients);
  const canManageClients = hasRoleAccess(ADMIN_ACTION_ACCESS.clientsManage, session.role);
  const params = await searchParams;
  const query = params.q?.trim();
  const editId = params.edit;
  const currentMode = mode === "create" ? "create" : editId ? "edit" : "list";

  const [clients, packages] = await Promise.all([
    prisma.client.findMany({
      where: query
        ? {
            OR: [
              { fullName: { contains: query } },
              { phone: { contains: query } },
              { eventLocation: { contains: query } },
              { eventType: { contains: query } },
            ],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
      include: { selectedPackage: true },
    }),
    prisma.weddingPackage.findMany({
      where: { isActive: true },
      orderBy: { price: "asc" },
    }),
  ]);

  const editingClient =
    currentMode === "edit" && editId
      ? await prisma.client.findUnique({
          where: { id: editId },
        })
      : null;

  async function upsertClient(formData: FormData) {
    "use server";
    await requireRole(ADMIN_ACTION_ACCESS.clientsManage);

    const id = String(formData.get("id") ?? "").trim();
    const payload = {
      fullName: String(formData.get("fullName") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? "") || null,
      address: String(formData.get("address") ?? "") || null,
      eventDate: formData.get("eventDate") ? new Date(String(formData.get("eventDate"))) : null,
      eventLocation: String(formData.get("eventLocation") ?? "") || null,
      eventType: String(formData.get("eventType") ?? "Wedding"),
      budget: parseNullableNumber(formData.get("budget")),
      selectedPackageId: String(formData.get("selectedPackageId") ?? "") || null,
      preferredVenue: (String(formData.get("preferredVenue") ?? "") || null) as VenuePreference | null,
      guestCount: parseNullableNumber(formData.get("guestCount")),
      status: String(formData.get("status") ?? ClientStatus.LEAD) as ClientStatus,
      specialNotes: String(formData.get("specialNotes") ?? "") || null,
    };

    if (id) {
      await prisma.client.update({
        where: { id },
        data: payload,
      });
    } else {
      await prisma.client.create({
        data: payload,
      });
    }

    revalidatePath("/admin");
    revalidatePath("/admin/clients");
    revalidatePath(routeBase);
    redirect(routeBase);
  }

  async function deleteClient(formData: FormData) {
    "use server";
    await requireRole(ADMIN_ACTION_ACCESS.clientsManage);
    const id = String(formData.get("id"));
    await prisma.client.delete({ where: { id } });
    revalidatePath("/admin");
    revalidatePath("/admin/clients");
    revalidatePath(routeBase);
    redirect(routeBase);
  }

  if (canManageClients && (currentMode === "create" || currentMode === "edit")) {
    return (
      <div>
        <AdminTopbar
          title={currentMode === "edit" ? "Edit Client" : "Tambah Klien"}
          description="Lengkapi data client lalu simpan kembali ke daftar."
        />

        <div className="admin-form-panel">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="admin-panel-kicker">{currentMode === "edit" ? "Edit client" : "Tambah client"}</p>
              <h3 className="admin-panel-title">
                {editingClient ? editingClient.fullName : "Data client baru"}
              </h3>
            </div>
            <Link href={routeBase} className="text-sm font-semibold text-[var(--brand-deep)]">
              Kembali ke list
            </Link>
          </div>
          <form action={upsertClient}>
            <input type="hidden" name="id" defaultValue={editingClient?.id ?? ""} />
            <div className="form-grid">
              <input name="fullName" defaultValue={editingClient?.fullName ?? ""} placeholder="Nama lengkap" className="input-base" required />
              <input name="phone" defaultValue={editingClient?.phone ?? ""} placeholder="Nomor HP" className="input-base" required />
              <input name="email" defaultValue={editingClient?.email ?? ""} placeholder="Email" className="input-base" />
              <input name="address" defaultValue={editingClient?.address ?? ""} placeholder="Alamat" className="input-base" />
              <input name="eventDate" type="date" defaultValue={editingClient?.eventDate ? new Date(editingClient.eventDate).toISOString().slice(0, 10) : ""} className="input-base" />
              <input name="eventLocation" defaultValue={editingClient?.eventLocation ?? ""} placeholder="Lokasi acara" className="input-base" />
              <input name="eventType" defaultValue={editingClient?.eventType ?? "Wedding"} placeholder="Jenis acara" className="input-base" required />
              <input name="budget" type="number" defaultValue={editingClient?.budget ?? ""} placeholder="Budget" className="input-base" />
              <select name="selectedPackageId" defaultValue={editingClient?.selectedPackageId ?? ""} className="input-base">
                <option value="">Pilih paket</option>
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name}
                  </option>
                ))}
              </select>
              <select name="status" defaultValue={editingClient?.status ?? ClientStatus.LEAD} className="input-base">
                {Object.values(ClientStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <select name="preferredVenue" defaultValue={editingClient?.preferredVenue ?? ""} className="input-base">
                <option value="">Preferensi venue</option>
                {Object.values(VenuePreference).map((venue) => (
                  <option key={venue} value={venue}>
                    {venue}
                  </option>
                ))}
              </select>
              <input name="guestCount" type="number" defaultValue={editingClient?.guestCount ?? ""} placeholder="Jumlah tamu" className="input-base" />
            </div>
            <textarea name="specialNotes" defaultValue={editingClient?.specialNotes ?? ""} placeholder="Catatan kebutuhan khusus" className="input-base mt-4 min-h-32" />
            <div className="mt-4">
              <SubmitButton pendingText="Menyimpan client...">
                {currentMode === "edit" ? "Simpan Perubahan" : "Simpan Client"}
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
        title="CRM Client"
        description="Daftar client dan detail acara yang sedang ditangani."
      />

      <div className="admin-list-panel">
        <div className="admin-toolbar">
          <form action={routeBase}>
            <div className="admin-search-row">
              <input name="q" defaultValue={query ?? ""} placeholder="Cari client..." className="input-base" />
              <button type="submit" className="admin-search-button">
                Cari
              </button>
            </div>
          </form>
          {canManageClients ? (
            <Link href={`${routeBase}/tambah`} className="admin-primary-link">
              + Tambah Klien
            </Link>
          ) : null}
        </div>

        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>Nama Klien</th>
                <th>Tanggal Acara</th>
                <th>Lokasi</th>
                <th>Budget</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>
                  <td className="font-medium text-[var(--brand-deep)]">{client.fullName}</td>
                  <td>{formatDate(client.eventDate)}</td>
                  <td>{client.eventLocation ?? "-"}</td>
                  <td>{formatCurrency(client.budget)}</td>
                  <td>
                    <Badge tone={client.status === ClientStatus.DEAL || client.status === ClientStatus.SELESAI ? "success" : "brand"}>
                      {client.status}
                    </Badge>
                  </td>
                  <td>
                    {canManageClients ? (
                      <div className="flex gap-2">
                        <Link href={`${routeBase}?edit=${client.id}`} className="admin-table-link">
                          Edit
                        </Link>
                        <form action={deleteClient}>
                          <input type="hidden" name="id" value={client.id} />
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
