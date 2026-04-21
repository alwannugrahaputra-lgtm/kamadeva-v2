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
    <div className="glass-card rounded-[28px] p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-[var(--muted)]">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-[var(--brand-deep)]">
            {currency ? formatCurrency(value) : value}
          </p>
        </div>
        <div className="rounded-2xl bg-[var(--soft)] p-3 text-[var(--brand)]">
          <Icon size={22} />
        </div>
      </div>
      <p className="text-sm text-[var(--muted)]">{description}</p>
    </div>
  );
}
