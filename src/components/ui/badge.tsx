// Penjelasan file: komponen UI reusable yang dipakai di banyak halaman.
import { cn } from "@/shared/lib/utils";

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "brand";
}) {
  const tones = {
    neutral: "bg-[rgba(255,255,255,0.04)] text-[var(--muted)] border-[var(--line)]",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-rose-50 text-rose-700 border-rose-200",
    brand:
      "bg-[rgba(212,175,55,0.09)] text-[var(--accent)] border-[rgba(212,175,55,0.22)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
  };

  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.18em] uppercase",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}
