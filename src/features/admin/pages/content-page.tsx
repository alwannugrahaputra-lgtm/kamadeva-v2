// Penjelasan file: halaman admin konten memakai entri CMS ringan berbasis faq item.
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { SubmitButton } from "@/components/ui/submit-button";
import { ADMIN_ROUTE_ACCESS } from "@/shared/config/access";
import { requireRole } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";

type ContentItem = {
  id: string;
  title: string;
  type: string;
  status: string;
  summary: string;
};

function parseContentCategory(category: string) {
  if (!category.startsWith("CONTENT:")) {
    return null;
  }

  const [, type = "Halaman", status = "Draft"] = category.split(":");
  return { type, status };
}

export default async function ContentPage({
  searchParams,
  mode = "list",
  routeBase = "/admin/konten",
}: {
  searchParams: Promise<{ q?: string; edit?: string }>;
  mode?: "list" | "create" | "edit";
  routeBase?: string;
}) {
  await requireRole(ADMIN_ROUTE_ACCESS.content);
  const params = await searchParams;
  const query = params.q?.trim().toLowerCase();
  const editId = params.edit;
  const currentMode = mode === "create" ? "create" : editId ? "edit" : "list";

  const contentEntries = await prisma.faqItem.findMany({
    where: {
      category: {
        startsWith: "CONTENT:",
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  const rows: ContentItem[] = contentEntries
    .map((item) => {
      const meta = parseContentCategory(item.category);
      if (!meta) return null;
      return {
        id: item.id,
        title: item.question,
        type: meta.type,
        status: meta.status,
        summary: item.answer,
      };
    })
    .filter((item): item is ContentItem => Boolean(item))
    .filter((item) =>
      query ? [item.title, item.type, item.status].some((value) => value.toLowerCase().includes(query)) : true,
    );
  const editingContent =
    currentMode === "edit" && editId
      ? contentEntries.find((item) => item.id === editId) ?? null
      : null;

  async function upsertContent(formData: FormData) {
    "use server";
    await requireRole(ADMIN_ROUTE_ACCESS.content);

    const id = String(formData.get("id") ?? "").trim();
    const type = String(formData.get("type") ?? "Halaman");
    const status = String(formData.get("status") ?? "Draft");
    const payload = {
      category: `CONTENT:${type}:${status}`,
      question: String(formData.get("title") ?? ""),
      answer: String(formData.get("summary") ?? ""),
      sortOrder: Number(formData.get("sortOrder")) || 99,
    };

    if (id) {
      await prisma.faqItem.update({ where: { id }, data: payload });
    } else {
      await prisma.faqItem.create({ data: payload });
    }

    revalidatePath(routeBase);
    redirect(routeBase);
  }

  async function deleteContent(formData: FormData) {
    "use server";
    await requireRole(ADMIN_ROUTE_ACCESS.content);
    const id = String(formData.get("id"));
    await prisma.faqItem.delete({ where: { id } });
    revalidatePath(routeBase);
    redirect(routeBase);
  }

  if (currentMode === "create" || currentMode === "edit") {
    return (
      <div>
        <AdminTopbar
          title={currentMode === "edit" ? "Edit Konten" : "Tambah Konten"}
          description="Tambah item konten website lalu simpan kembali ke daftar."
        />
        <div className="admin-form-panel">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="admin-panel-kicker">{currentMode === "edit" ? "Edit konten" : "Tambah konten"}</p>
              <h3 className="admin-panel-title">{editingContent?.question ?? "Konten website baru"}</h3>
            </div>
            <Link href={routeBase} className="text-sm font-semibold text-[var(--brand-deep)]">
              Kembali ke list
            </Link>
          </div>
          <form action={upsertContent}>
            <input type="hidden" name="id" defaultValue={editingContent?.id ?? ""} />
            <div className="form-grid">
              <input name="title" defaultValue={editingContent?.question ?? ""} placeholder="Judul konten" className="input-base" required />
              <select name="type" className="input-base" defaultValue={parseContentCategory(editingContent?.category ?? "")?.type ?? "Halaman"}>
                <option value="Halaman">Halaman</option>
                <option value="Landing">Landing</option>
                <option value="Portfolio">Portfolio</option>
              </select>
              <select name="status" className="input-base" defaultValue={parseContentCategory(editingContent?.category ?? "")?.status ?? "Published"}>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
              <input name="sortOrder" type="number" defaultValue={editingContent?.sortOrder ?? ""} placeholder="Urutan tampil" className="input-base" />
            </div>
            <textarea name="summary" defaultValue={editingContent?.answer ?? ""} placeholder="Ringkasan konten" className="input-base mt-4 min-h-28" required />
            <div className="mt-4">
              <SubmitButton pendingText="Menyimpan konten...">
                {currentMode === "edit" ? "Simpan Perubahan" : "Simpan Konten"}
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
        title="Konten"
        description="Daftar item konten website yang dikelola dari panel admin."
      />
      <div className="admin-list-panel">
        <div className="admin-toolbar">
          <form action={routeBase}>
            <div className="admin-search-row">
              <input name="q" defaultValue={params.q ?? ""} placeholder="Cari konten..." className="input-base" />
              <button type="submit" className="admin-search-button">
                Cari
              </button>
            </div>
          </form>
          <Link href={`${routeBase}/tambah`} className="admin-primary-link">
            + Tambah Konten
          </Link>
        </div>

        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>Judul</th>
                <th>Jenis</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <p className="font-semibold text-[var(--brand-deep)]">{row.title}</p>
                    <p className="text-sm text-[var(--muted)]">{row.summary}</p>
                  </td>
                  <td>{row.type}</td>
                  <td>{row.status}</td>
                  <td>
                    <div className="flex gap-2">
                      <Link href={`${routeBase}?edit=${row.id}`} className="admin-table-link">
                        Edit
                      </Link>
                      <form action={deleteContent}>
                        <input type="hidden" name="id" value={row.id} />
                        <button type="submit" className="admin-danger-link">
                          Hapus
                        </button>
                      </form>
                    </div>
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
