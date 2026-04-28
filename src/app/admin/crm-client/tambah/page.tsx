import ClientsPage from "@/features/admin/pages/clients-page";

export default function TambahClientPage() {
  return <ClientsPage searchParams={Promise.resolve({})} mode="create" routeBase="/admin/crm-client" />;
}
