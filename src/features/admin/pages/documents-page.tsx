// Penjelasan file: halaman admin untuk modul operasional terkait.
import { DocumentStatus, DocumentType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import { SubmitButton } from "@/components/ui/submit-button";
import { ADMIN_ROUTE_ACCESS } from "@/shared/config/access";
import { requireRole } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { formatDate } from "@/shared/lib/format";

export default async function DocumentsPage() {
  await requireRole(ADMIN_ROUTE_ACCESS.documents);

  const [clients, leads, documents] = await Promise.all([
    prisma.client.findMany({ orderBy: { fullName: "asc" } }),
    prisma.lead.findMany({ orderBy: { name: "asc" } }),
    prisma.document.findMany({
      orderBy: { createdAt: "desc" },
      include: { client: true, lead: true },
    }),
  ]);

  async function createDocument(formData: FormData) {
    "use server";

    await prisma.document.create({
      data: {
        title: String(formData.get("title") ?? ""),
        type: String(formData.get("type") ?? DocumentType.KONTRAK) as DocumentType,
        status: String(formData.get("status") ?? DocumentStatus.DRAFT) as DocumentStatus,
        fileUrl: String(formData.get("fileUrl") ?? ""),
        clientId: String(formData.get("clientId") ?? "") || null,
        leadId: String(formData.get("leadId") ?? "") || null,
      },
    });

    revalidatePath("/admin/documents");
    redirect("/admin/documents");
  }

  return (
    <div>
      <AdminTopbar
        title="Dokumen"
        description="Arsip dokumen klien dan lead."
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="glass-card rounded-[30px] p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Upload metadata dokumen</p>
          <form action={createDocument} className="mt-5">
            <div className="form-grid">
              <input name="title" placeholder="Judul dokumen" className="input-base" required />
              <select name="type" className="input-base" defaultValue={DocumentType.KONTRAK}>
                {Object.values(DocumentType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <select name="status" className="input-base" defaultValue={DocumentStatus.DRAFT}>
                {Object.values(DocumentStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <input name="fileUrl" placeholder="Link file / storage path" className="input-base" required />
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
            </div>
            <div className="mt-4">
              <SubmitButton pendingText="Menyimpan dokumen...">Tambah Dokumen</SubmitButton>
            </div>
          </form>
        </div>

        <div className="glass-card rounded-[30px] p-6">
          <div className="table-shell">
            <table>
              <thead>
                <tr>
                  <th>Dokumen</th>
                  <th>Tipe</th>
                  <th>Status</th>
                  <th>Terkait</th>
                  <th>Tanggal</th>
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
                    <td>{doc.type}</td>
                    <td>{doc.status}</td>
                    <td>{doc.client?.fullName ?? doc.lead?.name ?? "-"}</td>
                    <td>{formatDate(doc.createdAt)}</td>
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
