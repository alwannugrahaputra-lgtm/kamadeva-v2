import PackagesPage from "@/features/admin/pages/packages-page";

export default function AddPackagePage() {
  return <PackagesPage searchParams={Promise.resolve({})} mode="create" routeBase="/admin/paket-wedding" />;
}
