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
      <div className="paper-panel ornament-ring min-h-full rounded-[34px] p-5 lg:p-6">
        <div className="overflow-hidden rounded-[28px] border border-[rgba(212,175,55,0.14)] bg-[linear-gradient(180deg,rgba(18,18,18,0.96),rgba(8,8,8,0.96))] p-5">
          <div className="flex items-center gap-3">
            <div className="overflow-hidden rounded-[22px] border border-[var(--line)] bg-[#050505] shadow-[0_16px_34px_rgba(0,0,0,0.32)]">
              <Image
                src="/brand/kamadeva-mark.png"
                alt="Kamadeva WO"
                width={56}
                height={56}
                className="h-12 w-12 object-cover"
              />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
                Kamadeva WO
              </p>
              <h1 className="section-title mt-1 text-[2.1rem] font-semibold leading-none text-[var(--brand-deep)]">
                Control Hub
              </h1>
            </div>
          </div>
          <div className="mt-5 rounded-[22px] border border-[rgba(212,175,55,0.12)] bg-[rgba(255,255,255,0.03)] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
              Login aktif
            </p>
            <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">{name}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{role}</p>
          </div>
        </div>

        <nav className="mt-6 space-y-2.5">
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
                className={`flex items-center gap-3 rounded-[22px] border px-4 py-3.5 text-sm transition-all duration-300 ease-out ${
                  active
                    ? "border-[rgba(212,175,55,0.22)] bg-[rgba(212,175,55,0.94)] text-[#0b0b0b] shadow-[0_18px_36px_rgba(212,175,55,0.18)]"
                    : "border-transparent bg-transparent text-[var(--muted)] hover:border-[rgba(212,175,55,0.14)] hover:bg-[rgba(255,255,255,0.03)] hover:text-[var(--brand-deep)]"
                }`}
              >
                <span
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-[16px] border ${
                    active
                      ? "border-black/10 bg-black/10"
                      : "border-[rgba(212,175,55,0.14)] bg-[rgba(255,255,255,0.03)]"
                  }`}
                >
                  <Icon size={18} />
                </span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
