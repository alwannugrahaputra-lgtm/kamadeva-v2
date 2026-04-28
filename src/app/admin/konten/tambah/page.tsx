import ContentPage from "@/features/admin/pages/content-page";

export default function AddContentPage() {
  return <ContentPage searchParams={Promise.resolve({})} mode="create" routeBase="/admin/konten" />;
}
