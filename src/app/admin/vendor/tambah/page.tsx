import VendorsPage from "@/features/admin/pages/vendors-page";

export default function AddVendorPage() {
  return <VendorsPage searchParams={Promise.resolve({})} mode="create" routeBase="/admin/vendor" />;
}
