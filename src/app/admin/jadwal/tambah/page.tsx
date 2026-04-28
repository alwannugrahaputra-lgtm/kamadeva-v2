import SchedulePage from "@/features/admin/pages/schedule-page";

export default function AddSchedulePage() {
  return <SchedulePage searchParams={Promise.resolve({})} mode="create" routeBase="/admin/jadwal" />;
}
