"use client";

// Penjelasan file: komponen admin untuk tampilan dan interaksi modul internal.
import Image from "next/image";
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
    <aside className="admin-sidebar">
      <div className="paper-panel rounded-[24px] p-4 lg:p-5">
        <div className="admin-topnav-shell">
          <div className="admin-topnav-brand">
            <div className="overflow-hidden rounded-[16px] border border-[rgba(184,139,84,0.16)] bg-[linear-gradient(180deg,#3f3124,#2c2118)] shadow-[0_12px_28px_rgba(0,0,0,0.12)]">
              <Image
                src="/brand/kamadeva-mark.png"
                alt="Kamadeva WO"
                width={52}
                height={52}
                className="h-12 w-12 object-cover"
              />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
                Kamadeva WO
              </p>
              <h1 className="mt-1 font-display text-[1.8rem] font-semibold leading-none text-[var(--brand-deep)]">
                Control Hub
              </h1>
            </div>
          </div>

          <nav className="admin-topnav-links">
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
                className={`admin-topnav-link ${
                  active
                    ? "border-[rgba(209,163,101,0.34)] bg-[linear-gradient(135deg,#d8ae72,#bf8f51)] text-white shadow-[0_16px_30px_rgba(184,139,84,0.16)]"
                    : "border-[rgba(184,139,84,0.1)] bg-[rgba(255,255,255,0.64)] text-[var(--brand-deep)] hover:border-[rgba(184,139,84,0.18)] hover:bg-[rgba(255,255,255,0.88)]"
                }`}
              >
                <span
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-[12px] border ${
                    active
                      ? "border-white/16 bg-[rgba(255,255,255,0.16)]"
                      : "border-[rgba(184,139,84,0.14)] bg-[rgba(255,251,246,0.82)]"
                  }`}
                >
                  <Icon size={18} />
                </span>
                <span className="font-medium whitespace-nowrap">{item.label}</span>
              </Link>
            );
          })}
          </nav>

          <div className="admin-topnav-user">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
              Login aktif
            </p>
            <p className="mt-1 text-sm font-semibold text-[var(--brand-deep)]">{name}</p>
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
              {role}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
