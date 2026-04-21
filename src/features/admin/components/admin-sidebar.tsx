"use client";


// Penjelasan file: komponen admin untuk tampilan dan interaksi modul internal.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type AppRole } from "@/shared/config/access";
import { adminNavigation } from "@/shared/config/navigation";

export function AdminSidebar({
  role,
  name,
}: {
  role: AppRole;
  name: string;
}) {
  const pathname = usePathname();
  const visibleNavigation = adminNavigation.filter((item) =>
    item.allowedRoles.includes(role),
  );

  return (
    <aside className="admin-sidebar border-r border-[var(--line)] bg-[rgba(255,248,242,0.96)] p-5 lg:p-6">
      <div>
        <div className="glass-card rounded-[28px] p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
            Kamadeva WO
          </p>
          <h1 className="mt-2 section-title text-4xl font-semibold text-[var(--brand-deep)]">
            Admin Hub
          </h1>
          <p className="mt-4 text-sm text-[var(--muted)]">
            Login sebagai{" "}
            <span className="font-semibold text-[var(--foreground)]">{name}</span> (
            {role})
          </p>
        </div>

        <nav className="mt-6 space-y-2">
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
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all duration-300 ease-out ${
                  active
                    ? "bg-[var(--brand-deep)] text-white shadow-[0_18px_34px_rgba(79,43,34,0.16)]"
                    : "text-[var(--muted)] hover:bg-white/80 hover:text-[var(--brand-deep)]"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
