// Penjelasan file: halaman admin jadwal dengan tampilan hari, minggu, dan bulan.
import Link from "next/link";
import { ScheduleStatus, ScheduleType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { Badge } from "@/components/ui/badge";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  ADMIN_ACTION_ACCESS,
  ADMIN_ROUTE_ACCESS,
  hasRoleAccess,
} from "@/shared/config/access";
import { requireRole } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { formatDateTime } from "@/shared/lib/format";

const DAY_LABELS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

type ScheduleView = "week" | "month" | "day";

function buildCalendar(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  return Array.from({ length: totalCells }, (_, index) => {
    const dayNumber = index - startOffset + 1;
    if (dayNumber < 1 || dayNumber > daysInMonth) {
      return null;
    }
    return new Date(year, month, dayNumber);
  });
}

function buildViewHref(routeBase: string, query: string | undefined, view: ScheduleView) {
  const search = new URLSearchParams();
  if (query) {
    search.set("q", query);
  }
  search.set("view", view);
  return `${routeBase}?${search.toString()}`;
}

export default async function SchedulePage({
  searchParams,
  mode = "list",
  routeBase = "/admin/jadwal",
}: {
  searchParams: Promise<{ q?: string; message?: string; view?: string; edit?: string }>;
  mode?: "list" | "create" | "edit";
  routeBase?: string;
}) {
  const session = await requireRole(ADMIN_ROUTE_ACCESS.schedule);
  const canManageSchedule = hasRoleAccess(
    ADMIN_ACTION_ACCESS.scheduleManage,
    session.role,
  );
  const params = await searchParams;
  const query = params.q?.trim();
  const editId = params.edit;
  const currentMode = mode === "create" ? "create" : editId ? "edit" : "list";
  const view: ScheduleView =
    params.view === "week" || params.view === "day" ? params.view : "month";

  const [scheduleItems, clients, leads, vendors] = await Promise.all([
    prisma.scheduleItem.findMany({
      where: query
        ? {
            OR: [
              { title: { contains: query } },
              { location: { contains: query } },
            ],
          }
        : undefined,
      orderBy: { startDate: "asc" },
      include: { client: true, lead: true, vendor: true },
    }),
    prisma.client.findMany({ orderBy: { fullName: "asc" } }),
    prisma.lead.findMany({ orderBy: { name: "asc" } }),
    prisma.vendor.findMany({ orderBy: { name: "asc" } }),
  ]);
  const editingSchedule =
    currentMode === "edit" && editId
      ? await prisma.scheduleItem.findUnique({
          where: { id: editId },
        })
      : null;

  async function upsertSchedule(formData: FormData) {
    "use server";
    await requireRole(ADMIN_ACTION_ACCESS.scheduleManage);

    const id = String(formData.get("id") ?? "").trim();
    const startDate = new Date(String(formData.get("startDate")));
    const endDate = new Date(String(formData.get("endDate")));

    const conflict = await prisma.scheduleItem.findFirst({
      where: {
        AND: [
          ...(id ? [{ id: { not: id } }] : []),
          { startDate: { lt: endDate } },
          { endDate: { gt: startDate } },
        ],
      },
    });

    if (conflict) {
      const target = id ? `${routeBase}?edit=${id}&message=Bentrok%20jadwal%20terdeteksi.` : `${routeBase}/tambah?message=Bentrok%20jadwal%20terdeteksi.`;
      redirect(target);
    }

    const payload = {
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
    };

    if (id) {
      await prisma.scheduleItem.update({ where: { id }, data: payload });
    } else {
      await prisma.scheduleItem.create({ data: payload });
    }

    revalidatePath("/admin");
    revalidatePath("/admin/schedule");
    revalidatePath(routeBase);
    redirect(routeBase);
  }

  async function deleteSchedule(formData: FormData) {
    "use server";
    await requireRole(ADMIN_ACTION_ACCESS.scheduleManage);
    const id = String(formData.get("id"));
    await prisma.scheduleItem.delete({ where: { id } });
    revalidatePath("/admin");
    revalidatePath("/admin/schedule");
    revalidatePath(routeBase);
    redirect(routeBase);
  }

  if (canManageSchedule && (currentMode === "create" || currentMode === "edit")) {
    return (
      <div>
        <AdminTopbar
          title={currentMode === "edit" ? "Edit Jadwal" : "Tambah Jadwal"}
          description="Isi agenda baru atau ubah jadwal lalu simpan kembali ke kalender."
        />
        {params.message ? (
          <div className="mb-6 rounded-[20px] border border-[rgba(191,143,81,0.18)] bg-[#fffdfa] px-4 py-3 text-sm text-[var(--brand-deep)]">
            {params.message}
          </div>
        ) : null}
        <div className="admin-form-panel">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="admin-panel-kicker">{currentMode === "edit" ? "Edit agenda" : "Tambah agenda"}</p>
              <h3 className="admin-panel-title">{editingSchedule?.title ?? "Jadwal baru"}</h3>
            </div>
            <Link
              href={routeBase}
              className="text-sm font-semibold text-[var(--brand-deep)]"
            >
              Kembali ke list
            </Link>
          </div>
          <form action={upsertSchedule}>
            <input type="hidden" name="id" defaultValue={editingSchedule?.id ?? ""} />
            <div className="form-grid">
              <input
                name="title"
                defaultValue={editingSchedule?.title ?? ""}
                placeholder="Judul agenda"
                className="input-base"
                required
              />
              <select
                name="type"
                className="input-base"
                defaultValue={editingSchedule?.type ?? ScheduleType.MEETING}
              >
                {Object.values(ScheduleType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <input
                name="startDate"
                type="datetime-local"
                defaultValue={editingSchedule?.startDate ? new Date(editingSchedule.startDate.getTime() - editingSchedule.startDate.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ""}
                className="input-base"
                required
              />
              <input
                name="endDate"
                type="datetime-local"
                defaultValue={editingSchedule?.endDate ? new Date(editingSchedule.endDate.getTime() - editingSchedule.endDate.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ""}
                className="input-base"
                required
              />
              <input name="location" defaultValue={editingSchedule?.location ?? ""} placeholder="Lokasi" className="input-base" />
              <select
                name="status"
                className="input-base"
                defaultValue={editingSchedule?.status ?? ScheduleStatus.TERJADWAL}
              >
                {Object.values(ScheduleStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <select name="clientId" className="input-base" defaultValue={editingSchedule?.clientId ?? ""}>
                <option value="">Tautkan client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.fullName}
                  </option>
                ))}
              </select>
              <select name="leadId" className="input-base" defaultValue={editingSchedule?.leadId ?? ""}>
                <option value="">Tautkan calon klien</option>
                {leads.map((lead) => (
                  <option key={lead.id} value={lead.id}>
                    {lead.name}
                  </option>
                ))}
              </select>
              <select name="vendorId" className="input-base" defaultValue={editingSchedule?.vendorId ?? ""}>
                <option value="">Tautkan vendor</option>
                {vendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              name="notes"
              defaultValue={editingSchedule?.notes ?? ""}
              placeholder="Catatan agenda"
              className="input-base mt-4 min-h-28"
            />
            <div className="mt-4">
              <SubmitButton pendingText="Menyimpan jadwal...">
                {currentMode === "edit" ? "Simpan Perubahan" : "Simpan Jadwal"}
              </SubmitButton>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const currentDate = scheduleItems[0]?.startDate
    ? new Date(scheduleItems[0].startDate)
    : new Date();
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const monthLabel = currentDate.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
  const dayLabel = currentDate.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const cells = buildCalendar(year, month);
  const weekStart = new Date(currentDate);
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(currentDate.getDate() - ((currentDate.getDay() + 6) % 7));
  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return date;
  });
  const dayItems = scheduleItems.filter((item) => {
    const itemDate = new Date(item.startDate);
    return itemDate.toDateString() === currentDate.toDateString();
  });

  return (
    <div>
      <AdminTopbar
        title="Jadwal"
        description="Kalender acara, meeting, dan agenda vendor tim Kamadeva."
      />
      <div className="admin-list-panel">
        <div className="admin-toolbar">
          <form action={routeBase}>
            <div className="admin-search-row">
              <input
                name="q"
                defaultValue={query ?? ""}
                placeholder="Cari jadwal..."
                className="input-base"
              />
              <input type="hidden" name="view" value={view} />
              <button type="submit" className="admin-search-button">
                Cari
              </button>
            </div>
          </form>
          <div className="admin-inline-pills">
            <Link
              href={buildViewHref(routeBase, query, "week")}
              className={view === "week" ? "is-active" : ""}
            >
              Minggu
            </Link>
            <Link
              href={buildViewHref(routeBase, query, "month")}
              className={view === "month" ? "is-active" : ""}
            >
              Bulan
            </Link>
            <Link
              href={buildViewHref(routeBase, query, "day")}
              className={view === "day" ? "is-active" : ""}
            >
              Hari
            </Link>
          </div>
          {canManageSchedule ? (
            <Link href={`${routeBase}/tambah`} className="admin-primary-link">
              + Tambah Jadwal
            </Link>
          ) : null}
        </div>

        {view === "month" ? (
          <div className="admin-calendar-shell">
            <div className="admin-calendar-head">
              <button type="button" className="admin-calendar-arrow" aria-hidden="true">
                ‹
              </button>
              <h3>{monthLabel}</h3>
              <button type="button" className="admin-calendar-arrow" aria-hidden="true">
                ›
              </button>
            </div>
            <div className="admin-calendar-grid">
              {DAY_LABELS.map((day) => (
                <div key={day} className="admin-calendar-day">
                  {day}
                </div>
              ))}
              {cells.map((date, index) => {
                if (!date) {
                  return (
                    <div
                      key={`empty-${index}`}
                      className="admin-calendar-cell is-empty"
                    />
                  );
                }

                const itemsOnDate = scheduleItems.filter((item) => {
                  const itemDate = new Date(item.startDate);
                  return (
                    itemDate.getDate() === date.getDate() &&
                    itemDate.getMonth() === month &&
                    itemDate.getFullYear() === year
                  );
                });

                return (
                  <div key={date.toISOString()} className="admin-calendar-cell">
                    <span className="admin-calendar-number">{date.getDate()}</span>
                    <div className="admin-calendar-events">
                      {itemsOnDate.slice(0, 2).map((item) => (
                        <div
                          key={item.id}
                          className={`admin-calendar-event tone-${item.type.toLowerCase()}`}
                        >
                          <strong>{item.title}</strong>
                          <span>
                            {new Date(item.startDate).toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {view === "week" ? (
          <div className="admin-week-grid">
            {weekDays.map((date) => {
              const items = scheduleItems.filter((item) => {
                const itemDate = new Date(item.startDate);
                return itemDate.toDateString() === date.toDateString();
              });

              return (
                <div key={date.toISOString()} className="admin-week-card">
                  <p className="admin-panel-kicker">
                    {date.toLocaleDateString("id-ID", { weekday: "short" })}
                  </p>
                  <h4 className="mt-1 text-lg font-semibold text-[var(--brand-deep)]">
                    {date.toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                    })}
                  </h4>
                  <div className="mt-4 space-y-3">
                    {items.length ? (
                      items.map((item) => (
                        <div
                          key={item.id}
                          className={`admin-calendar-event tone-${item.type.toLowerCase()}`}
                        >
                          <strong>{item.title}</strong>
                          <span>
                            {new Date(item.startDate).toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-[var(--muted)]">Belum ada agenda.</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        {view === "day" ? (
          <div className="admin-calendar-shell">
            <div className="admin-calendar-head">
              <div>
                <h3>Agenda Hari Ini</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">{dayLabel}</p>
              </div>
            </div>
            <div className="space-y-3">
              {dayItems.length ? (
                dayItems.map((item) => (
                  <div key={item.id} className="admin-timeline-row">
                    <div className="admin-timeline-accent" />
                    <div className="flex-1">
                      <p className="font-semibold text-[var(--brand-deep)]">
                        {item.title}
                      </p>
                      <p className="text-sm text-[var(--muted)]">
                        {item.client?.fullName ??
                          item.lead?.name ??
                          item.vendor?.name ??
                          "Agenda umum"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[var(--brand-deep)]">
                        {new Date(item.startDate).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                        {item.status}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="admin-empty-state">
                  <p className="font-semibold text-[var(--brand-deep)]">
                    Belum ada agenda
                  </p>
                  <p className="text-sm text-[var(--muted)]">
                    Tidak ada jadwal untuk hari yang sedang dipilih.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : null}

        <div className="table-shell mt-6">
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
                    <p className="font-semibold text-[var(--brand-deep)]">
                      {item.title}
                    </p>
                    <p className="text-sm text-[var(--muted)]">{item.type}</p>
                  </td>
                  <td>{formatDateTime(item.startDate)}</td>
                  <td>
                    {item.client?.fullName ??
                      item.lead?.name ??
                      item.vendor?.name ??
                      "-"}
                  </td>
                  <td>
                    <Badge
                      tone={item.status === ScheduleStatus.SELESAI ? "success" : "brand"}
                    >
                      {item.status}
                    </Badge>
                  </td>
                  <td>
                    {canManageSchedule ? (
                      <div className="flex gap-2">
                        <Link href={`${routeBase}?edit=${item.id}${query ? `&q=${encodeURIComponent(query)}` : ""}${view ? `&view=${view}` : ""}`} className="admin-table-link">
                          Edit
                        </Link>
                        <form action={deleteSchedule}>
                          <input type="hidden" name="id" value={item.id} />
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
