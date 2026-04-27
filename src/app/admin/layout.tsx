// Penjelasan file: layout utama untuk seluruh area admin.
import { AdminSidebar } from "@/features/admin/components/admin-sidebar";
import { requireSession } from "@/server/auth/session";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requireSession();

  return (
    <div className="admin-shell">
      <div className="admin-grid">
        <AdminSidebar role={session.role} name={session.name} />
        <div className="admin-main min-w-0 p-1 lg:p-4">{children}</div>
      </div>
    </div>
  );
}
