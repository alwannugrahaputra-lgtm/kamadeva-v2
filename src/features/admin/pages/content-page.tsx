// Penjelasan file: halaman admin konten dan portfolio dengan upload foto langsung dari panel.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { SubmitButton } from "@/components/ui/submit-button";
import { ADMIN_ROUTE_ACCESS } from "@/shared/config/access";
import { requireRole } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { formatDate } from "@/shared/lib/format";
import { slugify } from "@/shared/lib/utils";

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

function getPortfolioMode(mode: "list" | "create" | "edit", portfolioParam?: string) {
  if (mode === "create" || mode === "edit") {
    return "list";
  }

  if (portfolioParam === "create") {
    return "create";
  }

  if (portfolioParam) {
    return "edit";
  }

  return "list";
}

async function savePortfolioImage(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("File yang diunggah harus berupa gambar.");
  }

  const safeName = slugify(file.name.replace(/\.[^.]+$/, "")) || "portfolio";
  const extension = path.extname(file.name) || ".jpg";
  const fileName = `${Date.now()}-${safeName}${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "portfolio");
  const destination = path.join(uploadDir, fileName);

  await mkdir(uploadDir, { recursive: true });
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(destination, bytes);

  return `/uploads/portfolio/${fileName}`;
}

export default async function ContentPage({
  searchParams,
  mode = "list",
  routeBase = "/admin/konten",
}: {
  searchParams: Promise<{
    q?: string;
    edit?: string;
    portfolio?: string;
    message?: string;
  }>;
  mode?: "list" | "create" | "edit";
  routeBase?: string;
}) {
  await requireRole(ADMIN_ROUTE_ACCESS.content);
  const params = await searchParams;
  const query = params.q?.trim().toLowerCase();
  const editId = params.edit;
  const contentMode = mode === "create" ? "create" : editId ? "edit" : "list";
  const portfolioMode = getPortfolioMode(mode, params.portfolio);
  const portfolioEditId =
    portfolioMode === "edit" && params.portfolio ? params.portfolio : undefined;

  const [contentEntries, portfolioItems] = await Promise.all([
    prisma.faqItem.findMany({
      where: {
        category: {
          startsWith: "CONTENT:",
        },
      },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.portfolioItem.findMany({
      orderBy: { eventDate: "desc" },
    }),
  ]);

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
      query
        ? [item.title, item.type, item.status].some((value) =>
            value.toLowerCase().includes(query),
          )
        : true,
    );

  const filteredPortfolio = portfolioItems.filter((item) =>
    query
      ? [item.title, item.category, item.location].some((value) =>
          value.toLowerCase().includes(query),
        )
      : true,
  );

  const editingContent =
    contentMode === "edit" && editId
      ? contentEntries.find((item) => item.id === editId) ?? null
      : null;
  const editingPortfolio =
    portfolioMode === "edit" && portfolioEditId
      ? portfolioItems.find((item) => item.id === portfolioEditId) ?? null
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

  async function upsertPortfolio(formData: FormData) {
    "use server";
    await requireRole(ADMIN_ROUTE_ACCESS.content);

    const id = String(formData.get("id") ?? "").trim();
    const existingImageUrl = String(formData.get("existingImageUrl") ?? "");
    const file = formData.get("image");
    let imageUrl = existingImageUrl || null;

    if (file instanceof File && file.size > 0) {
      try {
        imageUrl = await savePortfolioImage(file);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Gagal mengunggah gambar.";
        const target = id
          ? `${routeBase}?portfolio=${id}&message=${encodeURIComponent(message)}`
          : `${routeBase}?portfolio=create&message=${encodeURIComponent(message)}`;
        redirect(target);
      }
    }

    if (!imageUrl) {
      const target = id
        ? `${routeBase}?portfolio=${id}&message=Foto%20wajib%20diisi.`
        : `${routeBase}?portfolio=create&message=Foto%20wajib%20diisi.`;
      redirect(target);
    }

    const payload = {
      title: String(formData.get("title") ?? ""),
      category: String(formData.get("category") ?? ""),
      description: String(formData.get("description") ?? ""),
      eventDate: new Date(String(formData.get("eventDate"))),
      location: String(formData.get("location") ?? ""),
      imageUrl,
      isFeatured: String(formData.get("isFeatured") ?? "false") === "true",
    };

    if (id) {
      await prisma.portfolioItem.update({ where: { id }, data: payload });
    } else {
      await prisma.portfolioItem.create({ data: payload });
    }

    revalidatePath("/");
    revalidatePath("/portfolio");
    revalidatePath(routeBase);
    redirect(routeBase);
  }

  async function deletePortfolio(formData: FormData) {
    "use server";
    await requireRole(ADMIN_ROUTE_ACCESS.content);
    const id = String(formData.get("id"));
    await prisma.portfolioItem.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/portfolio");
    revalidatePath(routeBase);
    redirect(routeBase);
  }

  if (contentMode === "create" || contentMode === "edit") {
    return (
      <div>
        <AdminTopbar
          title={contentMode === "edit" ? "Edit Konten" : "Tambah Konten"}
          description="Tambah item konten website lalu simpan kembali ke daftar."
        />
        <div className="admin-form-panel">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="admin-panel-kicker">
                {contentMode === "edit" ? "Edit konten" : "Tambah konten"}
              </p>
              <h3 className="admin-panel-title">
                {editingContent?.question ?? "Konten website baru"}
              </h3>
            </div>
            <Link
              href={routeBase}
              className="text-sm font-semibold text-[var(--brand-deep)]"
            >
              Kembali ke list
            </Link>
          </div>
          <form action={upsertContent}>
            <input type="hidden" name="id" defaultValue={editingContent?.id ?? ""} />
            <div className="form-grid">
              <input
                name="title"
                defaultValue={editingContent?.question ?? ""}
                placeholder="Judul konten"
                className="input-base"
                required
              />
              <select
                name="type"
                className="input-base"
                defaultValue={
                  parseContentCategory(editingContent?.category ?? "")?.type ?? "Halaman"
                }
              >
                <option value="Halaman">Halaman</option>
                <option value="Landing">Landing</option>
                <option value="Portfolio">Portfolio</option>
              </select>
              <select
                name="status"
                className="input-base"
                defaultValue={
                  parseContentCategory(editingContent?.category ?? "")?.status ??
                  "Published"
                }
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
              <input
                name="sortOrder"
                type="number"
                defaultValue={editingContent?.sortOrder ?? ""}
                placeholder="Urutan tampil"
                className="input-base"
              />
            </div>
            <textarea
              name="summary"
              defaultValue={editingContent?.answer ?? ""}
              placeholder="Ringkasan konten"
              className="input-base mt-4 min-h-28"
              required
            />
            <div className="mt-4">
              <SubmitButton pendingText="Menyimpan konten...">
                {contentMode === "edit" ? "Simpan Perubahan" : "Simpan Konten"}
              </SubmitButton>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (portfolioMode === "create" || portfolioMode === "edit") {
    return (
      <div>
        <AdminTopbar
          title={portfolioMode === "edit" ? "Edit Foto Portfolio" : "Upload Foto Portfolio"}
          description="Unggah atau ganti foto wedding langsung dari panel admin."
        />
        {params.message ? (
          <div className="mb-6 rounded-[20px] border border-[rgba(191,143,81,0.18)] bg-[#fffdfa] px-4 py-3 text-sm text-[var(--brand-deep)]">
            {params.message}
          </div>
        ) : null}
        <div className="admin-form-panel">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="admin-panel-kicker">
                {portfolioMode === "edit" ? "Edit portfolio" : "Upload portfolio"}
              </p>
              <h3 className="admin-panel-title">
                {editingPortfolio?.title ?? "Foto portfolio baru"}
              </h3>
            </div>
            <Link
              href={routeBase}
              className="text-sm font-semibold text-[var(--brand-deep)]"
            >
              Kembali ke panel konten
            </Link>
          </div>
          <form action={upsertPortfolio}>
            <input type="hidden" name="id" defaultValue={editingPortfolio?.id ?? ""} />
            <input
              type="hidden"
              name="existingImageUrl"
              defaultValue={editingPortfolio?.imageUrl ?? ""}
            />
            <div className="form-grid">
              <input
                name="title"
                defaultValue={editingPortfolio?.title ?? ""}
                placeholder="Judul event"
                className="input-base"
                required
              />
              <input
                name="category"
                defaultValue={editingPortfolio?.category ?? ""}
                placeholder="Kategori event"
                className="input-base"
                required
              />
              <input
                name="eventDate"
                type="date"
                defaultValue={
                  editingPortfolio?.eventDate
                    ? new Date(editingPortfolio.eventDate).toISOString().slice(0, 10)
                    : ""
                }
                className="input-base"
                required
              />
              <input
                name="location"
                defaultValue={editingPortfolio?.location ?? ""}
                placeholder="Lokasi event"
                className="input-base"
                required
              />
              <select
                name="isFeatured"
                className="input-base"
                defaultValue={editingPortfolio?.isFeatured ? "true" : "false"}
              >
                <option value="true">Tampilkan di website</option>
                <option value="false">Simpan saja</option>
              </select>
              <input
                name="image"
                type="file"
                accept="image/*"
                className="input-base"
                required={portfolioMode === "create"}
              />
            </div>
            <textarea
              name="description"
              defaultValue={editingPortfolio?.description ?? ""}
              placeholder="Deskripsi singkat event"
              className="input-base mt-4 min-h-28"
              required
            />
            {editingPortfolio?.imageUrl ? (
              <div className="mt-4 rounded-[18px] border border-[rgba(184,139,84,0.14)] bg-white p-4">
                <p className="text-sm font-semibold text-[var(--brand-deep)]">
                  Foto saat ini
                </p>
                <Image
                  src={editingPortfolio.imageUrl}
                  alt={editingPortfolio.title}
                  width={640}
                  height={420}
                  className="mt-3 h-48 w-full rounded-[18px] object-cover md:w-80"
                />
              </div>
            ) : null}
            <p className="mt-4 text-sm text-[var(--muted)]">
              Catatan: upload langsung ke panel ini cocok untuk lokal/dev. Untuk Vercel
              production, nanti paling baik dipindah ke storage cloud agar file tetap
              permanen.
            </p>
            <div className="mt-4">
              <SubmitButton pendingText="Menyimpan portfolio...">
                {portfolioMode === "edit" ? "Simpan Perubahan" : "Upload Foto"}
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
        description="Kelola konten website sekaligus foto portfolio dari panel admin."
      />
      <div className="space-y-6">
        <div className="admin-list-panel">
          <div className="admin-toolbar">
            <form action={routeBase}>
              <div className="admin-search-row">
                <input
                  name="q"
                  defaultValue={params.q ?? ""}
                  placeholder="Cari konten..."
                  className="input-base"
                />
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
                        <Link
                          href={`${routeBase}?edit=${row.id}`}
                          className="admin-table-link"
                        >
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

        <div className="admin-list-panel">
          <div className="admin-toolbar">
            <div>
              <p className="admin-panel-kicker">Portfolio</p>
              <h3 className="admin-panel-title">Foto wedding & galeri event</h3>
            </div>
            <Link href={`${routeBase}?portfolio=create`} className="admin-primary-link">
              + Upload Foto Portfolio
            </Link>
          </div>

          <div className="table-shell">
            <table>
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>Judul Event</th>
                  <th>Kategori</th>
                  <th>Tanggal</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredPortfolio.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        width={240}
                        height={160}
                        className="h-16 w-24 rounded-[14px] object-cover"
                      />
                    </td>
                    <td>
                      <p className="font-semibold text-[var(--brand-deep)]">{item.title}</p>
                      <p className="text-sm text-[var(--muted)]">{item.location}</p>
                    </td>
                    <td>{item.category}</td>
                    <td>{formatDate(item.eventDate)}</td>
                    <td>
                      <div className="flex gap-2">
                        <Link
                          href={`${routeBase}?portfolio=${item.id}`}
                          className="admin-table-link"
                        >
                          Ganti Foto
                        </Link>
                        <form action={deletePortfolio}>
                          <input type="hidden" name="id" value={item.id} />
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
    </div>
  );
}
