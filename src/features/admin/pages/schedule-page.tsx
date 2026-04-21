import { ScheduleStatus, ScheduleType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { Badge } from "@/components/ui/badge";
import { SubmitButton } from "@/components/ui/submit-button";
import { ADMIN_ACTION_ACCESS, ADMIN_ROUTE_ACCESS, hasRoleAccess } from "@/shared/config/access";
import { requireRole } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { formatDateTime } from "@/shared/lib/format";

const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const session = await requireRole(ADMIN_ROUTE_ACCESS.schedule);
  const canManageSchedule = hasRoleAccess(ADMIN_ACTION_ACCESS.scheduleManage, session.role);
  const params = await searchParams;

  const [scheduleItems, clients, leads, vendors] = await Promise.all([
    prisma.scheduleItem.findMany({
      orderBy: { startDate: "asc" },
      include: { client: true, lead: true, vendor: true },
    }),
    prisma.client.findMany({ orderBy: { fullName: "asc" } }),
    prisma.lead.findMany({ orderBy: { name: "asc" } }),
    prisma.vendor.findMany({ orderBy: { name: "asc" } }),
  ]);

  async function createSchedule(formData: FormData) {
    "use server";
    await requireRole(ADMIN_ACTION_ACCESS.scheduleManage);

    const startDate = new Date(String(formData.get("startDate")));
    const endDate = new Date(String(formData.get("endDate")));

    // Prevent two agenda items from occupying the same time slot.
    const conflict = await prisma.scheduleItem.findFirst({
      where: {
        AND: [
          { startDate: { lt: endDate } },
          { endDate: { gt: startDate } },
        ],
      },
    });

    if (conflict) {
      redirect("/admin/schedule?message=Bentrok%20jadwal%20terdeteksi.%20Silakan%20pilih%20waktu%20lain.");
    }

    await prisma.scheduleItem.create({
      data: {
        title: String(formData.get("title") ?? ""),
        type: String(formData.get("type") ?? ScheduleType.MEETING) as ScheduleType,
        startDate,
        endDate,
        location: String(formData.get("location") ?? "") || null,
        notes: String(formData.get("notes") ?? "") || null,
        status: String(formData.get("status") ?? ScheduleStatus.TERJADWAL) as ScheduleStatus,
        clientId: String(formData.get("clientId") ?? "") || null,
        leadId: String(formData.get("leadId") ?? "") || null,
        vendorId: String(formData.get("vendorId") ?? "") || null,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/schedule");
    redirect("/admin/schedule?message=Jadwal%20berhasil%20ditambahkan.");
  }

  async function deleteSchedule(formData: FormData) {
    "use server";
    await requireRole(ADMIN_ACTION_ACCESS.scheduleManage);
    const id = String(formData.get("id"));
    await prisma.scheduleItem.delete({ where: { id } });
    revalidatePath("/admin");
    revalidatePath("/admin/schedule");
    redirect("/admin/schedule?message=Jadwal%20dihapus.");
  }

  const weeklyColumns = Array.from({ length: 7 }, (_, index) => ({
    day: days[index],
    items: scheduleItems.filter((item) => new Date(item.startDate).getDay() === ((index + 1) % 7)),
  }));

  return (
    <div>
      <AdminTopbar
        title="Jadwal"
        description="Agenda operasional dan kalender acara."
      />
      {params.message ? (
        <div className="mb-6 rounded-[24px] bg-white px-5 py-4 text-sm text-[var(--brand-deep)]">{params.message}</div>
      ) : null}
      <div className={canManageSchedule ? "grid gap-6 xl:grid-cols-[0.9fr_1.1fr]" : "grid gap-6"}>
        {canManageSchedule ? (
          <div className="glass-card rounded-[30px] p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Tambah agenda</p>
            <form action={createSchedule} className="mt-5">
              <div className="form-grid">
                <input name="title" placeholder="Judul agenda" className="input-base" required />
                <select name="type" className="input-base" defaultValue={ScheduleType.MEETING}>
                  {Object.values(ScheduleType).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <input name="startDate" type="datetime-local" className="input-base" required />
                <input name="endDate" type="datetime-local" className="input-base" required />
                <input name="location" placeholder="Lokasi" className="input-base" />
                <select name="status" className="input-base" defaultValue={ScheduleStatus.TERJADWAL}>
                  {Object.values(ScheduleStatus).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <select name="clientId" className="input-base">
                  <option value="">Tautkan klien</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.fullName}
                    </option>
                  ))}
                </select>
                <select name="leadId" className="input-base">
                  <option value="">Tautkan lead</option>
                  {leads.map((lead) => (
                    <option key={lead.id} value={lead.id}>
                      {lead.name}
                    </option>
                  ))}
                </select>
                <select name="vendorId" className="input-base">
                  <option value="">Tautkan vendor</option>
                  {vendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </option>
                  ))}
                </select>
              </div>
              <textarea name="notes" placeholder="Catatan agenda" className="input-base mt-4 min-h-28" />
              <div className="mt-4">
                <SubmitButton pendingText="Menyimpan jadwal...">Tambah Jadwal</SubmitButton>
              </div>
            </form>
          </div>
        ) : null}

        <div className="space-y-6">
          <div className="glass-card rounded-[30px] p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Tampilan mingguan</p>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {weeklyColumns.map((column) => (
                <div key={column.day} className="rounded-[24px] bg-white p-4">
                  <p className="font-semibold text-[var(--brand-deep)]">{column.day}</p>
                  <div className="mt-3 space-y-3">
                    {column.items.length ? (
                      column.items.map((item) => (
                        <div key={item.id} className="rounded-[18px] border border-[var(--line)] p-3">
                          <p className="text-sm font-semibold text-[var(--brand-deep)]">{item.title}</p>
                          <p className="mt-1 text-xs text-[var(--muted)]">{formatDateTime(item.startDate)}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-[var(--muted)]">Tidak ada agenda.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-[30px] p-6">
            <div className="table-shell">
              <table>
                <thead>
                  <tr>
                    <th>Agenda</th>
                    <th>Waktu</th>
                    <th>Terkait</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <p className="font-semibold text-[var(--brand-deep)]">{item.title}</p>
                        <p className="text-sm text-[var(--muted)]">{item.type}</p>
                      </td>
                      <td>{formatDateTime(item.startDate)}</td>
                      <td>{item.client?.fullName ?? item.lead?.name ?? item.vendor?.name ?? "-"}</td>
                      <td>
                        <Badge tone={item.status === ScheduleStatus.SELESAI ? "success" : "brand"}>{item.status}</Badge>
                      </td>
                      <td>
                        {canManageSchedule ? (
                          <form action={deleteSchedule}>
                            <input type="hidden" name="id" value={item.id} />
                            <button type="submit" className="rounded-full bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                              Hapus
                            </button>
                          </form>
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
    </div>
  );
}
