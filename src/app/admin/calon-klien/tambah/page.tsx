import LeadsPage from "@/features/admin/pages/leads-page";

export default function TambahCalonKlienPage() {
  return <LeadsPage searchParams={Promise.resolve({})} mode="create" routeBase="/admin/calon-klien" />;
}
