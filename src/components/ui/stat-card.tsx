// Penjelasan file: komponen UI reusable yang dipakai di banyak halaman.
import type { LucideIcon } from "lucide-react";
import { formatCurrency } from "@/shared/lib/format";

export function StatCard({
  icon: Icon,
  title,
  value,
  description,
  currency = false,
}: {
  icon: LucideIcon;
  title: string;
  value: number;
  description: string;
  currency?: boolean;
}) {
  return (
    <div className="paper-panel ornament-ring rounded-[30px] p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
            {title}
          </p>
          <p className="section-title mt-4 text-4xl font-semibold leading-none text-[var(--brand-deep)]">
            {currency ? formatCurrency(value) : value}
          </p>
        </div>
        <div className="rounded-[20px] border border-[rgba(212,175,55,0.16)] bg-[rgba(212,175,55,0.08)] p-3 text-[var(--brand)] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
          <Icon size={22} />
        </div>
      </div>
      <p className="text-sm leading-7 text-[var(--muted)]">{description}</p>
    </div>
  );
}
