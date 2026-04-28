import DocumentsPage from "@/features/admin/pages/documents-page";

export default function AddDocumentPage() {
  return <DocumentsPage searchParams={Promise.resolve({})} mode="create" routeBase="/admin/dokumen" />;
}
