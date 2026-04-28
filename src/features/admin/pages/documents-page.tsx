// Penjelasan file: halaman admin dokumen dengan list dan form upload metadata terpisah.
import Link from "next/link";
import { DocumentStatus, DocumentType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { SubmitButton } from "@/components/ui/submit-button";
import { ADMIN_ROUTE_ACCESS } from "@/shared/config/access";
import { requireRole } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";

export default async function DocumentsPage({
  searchParams,
  mode = "list",
  routeBase = "/admin/dokumen",
}: {
  searchParams: Promise<{ q?: string; edit?: string }>;
  mode?: "list" | "create" | "edit";
  routeBase?: string;
}) {
  await requireRole(ADMIN_ROUTE_ACCESS.documents);
  const params = await searchParams;
  const query = params.q?.trim();
  const editId = params.edit;
  const currentMode = mode === "create" ? "create" : editId ? "edit" : "list";

  const [clients, leads, documents] = await Promise.all([
    prisma.client.findMany({ orderBy: { fullName: "asc" } }),
    prisma.lead.findMany({ orderBy: { name: "asc" } }),
    prisma.document.findMany({
      where: query
        ? {
            OR: [
              { title: { contains: query } },
              { client: { is: { fullName: { contains: query } } } },
              { lead: { is: { name: { contains: query } } } },
            ],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
      include: { client: true, lead: true },
    }),
  ]);
  const editingDocument =
    currentMode === "edit" && editId
      ? await prisma.document.findUnique({
          where: { id: editId },
        })
      : null;

  async function upsertDocument(formData: FormData) {
    "use server";
    await requireRole(ADMIN_ROUTE_ACCESS.documents);

    const id = String(formData.get("id") ?? "").trim();

    const payload = {
      title: String(formData.get("title") ?? ""),
      type: String(formData.get("type") ?? DocumentType.KONTRAK) as DocumentType,
      status: String(formData.get("status") ?? DocumentStatus.DRAFT) as DocumentStatus,
      fileUrl: String(formData.get("fileUrl") ?? ""),
      clientId: String(formData.get("clientId") ?? "") || null,
      leadId: String(formData.get("leadId") ?? "") || null,
    };

    if (id) {
      await prisma.document.update({ where: { id }, data: payload });
    } else {
      await prisma.document.create({ data: payload });
    }

    revalidatePath("/admin/documents");
    revalidatePath(routeBase);
    redirect(routeBase);
  }

  async function deleteDocument(formData: FormData) {
    "use server";
    await requireRole(ADMIN_ROUTE_ACCESS.documents);
    const id = String(formData.get("id"));
    await prisma.document.delete({ where: { id } });
    revalidatePath("/admin/documents");
    revalidatePath(routeBase);
    redirect(routeBase);
  }

  if (currentMode === "create" || currentMode === "edit") {
    return (
      <div>
        <AdminTopbar
          title={currentMode === "edit" ? "Edit Dokumen" : "Upload Dokumen"}
          description="Simpan metadata dokumen lalu kembali ke daftar dokumen."
        />
        <div className="admin-form-panel">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="admin-panel-kicker">{currentMode === "edit" ? "Edit dokumen" : "Tambah dokumen"}</p>
              <h3 className="admin-panel-title">{editingDocument?.title ?? "Dokumen baru"}</h3>
            </div>
            <Link href={routeBase} className="text-sm font-semibold text-[var(--brand-deep)]">
              Kembali ke list
            </Link>
          </div>
          <form action={upsertDocument}>
            <input type="hidden" name="id" defaultValue={editingDocument?.id ?? ""} />
            <div className="form-grid">
              <input name="title" defaultValue={editingDocument?.title ?? ""} placeholder="Nama dokumen" className="input-base" required />
              <select name="type" className="input-base" defaultValue={editingDocument?.type ?? DocumentType.KONTRAK}>
                {Object.values(DocumentType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <select name="status" className="input-base" defaultValue={editingDocument?.status ?? DocumentStatus.DRAFT}>
                {Object.values(DocumentStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <input name="fileUrl" defaultValue={editingDocument?.fileUrl ?? ""} placeholder="Link file / storage path" className="input-base" required />
              <select name="clientId" className="input-base" defaultValue={editingDocument?.clientId ?? ""}>
                <option value="">Tautkan client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.fullName}
                  </option>
                ))}
              </select>
              <select name="leadId" className="input-base" defaultValue={editingDocument?.leadId ?? ""}>
                <option value="">Tautkan calon klien</option>
                {leads.map((lead) => (
                  <option key={lead.id} value={lead.id}>
                    {lead.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4">
              <SubmitButton pendingText="Menyimpan dokumen...">
                {currentMode === "edit" ? "Simpan Perubahan" : "Simpan Dokumen"}
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
        title="Dokumen"
        description="Arsip dokumen client, calon klien, dan kebutuhan administrasi acara."
      />
      <div className="admin-list-panel">
        <div className="admin-toolbar">
          <form action={routeBase}>
            <div className="admin-search-row">
              <input name="q" defaultValue={query ?? ""} placeholder="Cari dokumen..." className="input-base" />
              <button type="submit" className="admin-search-button">
                Cari
              </button>
            </div>
          </form>
          <Link href={`${routeBase}/tambah`} className="admin-primary-link">
            + Upload Dokumen
          </Link>
        </div>

        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>Nama Dokumen</th>
                <th>Klien</th>
                <th>Kategori</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <p className="font-semibold text-[var(--brand-deep)]">{doc.title}</p>
                    <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="text-sm text-[var(--muted)] underline">
                      Buka dokumen
                    </a>
                  </td>
                  <td>{doc.client?.fullName ?? doc.lead?.name ?? "-"}</td>
                  <td>{doc.type}</td>
                  <td>{doc.status}</td>
                  <td>
                    <div className="flex gap-2">
                      <Link href={`${routeBase}?edit=${doc.id}`} className="admin-table-link">
                        Edit
                      </Link>
                      <form action={deleteDocument}>
                        <input type="hidden" name="id" value={doc.id} />
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
