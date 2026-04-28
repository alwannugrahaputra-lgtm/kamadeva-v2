import FinancePage from "@/features/admin/pages/finance-page";

export default function AddFinancePage() {
  return <FinancePage searchParams={Promise.resolve({})} mode="create" routeBase="/admin/keuangan" />;
}
