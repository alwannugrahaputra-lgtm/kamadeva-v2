"use client";

// Penjelasan file: sidebar admin mengikuti tata letak mockup utama.
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type AppRole } from "@/shared/config/access";
import { adminNavigation } from "@/shared/config/navigation";

export function AdminSidebar({
  role,
}: {
  role: AppRole;
  name: string;
}) {
  const pathname = usePathname();
  const visibleNavigation = adminNavigation.filter((item) =>
    item.allowedRoles.includes(role),
  );

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-panel">
        <div className="admin-sidebar-brand">
          <div className="admin-sidebar-brand-mark">
            <Image
              src="/brand/kamadeva-mark.png"
              alt="Kamadeva Wedding Organizer"
              width={52}
              height={52}
              className="h-10 w-10 object-cover"
            />
          </div>
          <div>
            <p className="admin-sidebar-kicker">Kamadeva Wedding Organizer</p>
            <p className="admin-sidebar-title">Control Hub</p>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          {visibleNavigation.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-sidebar-link ${active ? "is-active" : ""}`}
              >
                <span className="admin-sidebar-link-icon">
                  <Icon size={15} />
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
