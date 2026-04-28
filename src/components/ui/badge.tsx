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
    neutral: "bg-[rgba(184,139,84,0.08)] text-[var(--muted)] border-[rgba(184,139,84,0.14)]",
    success: "bg-[#eef7ee] text-[#5f8b60] border-[#d4e8d5]",
    warning: "bg-[#fff2df] text-[#af7a38] border-[#f0d6b0]",
    danger: "bg-[#fde8e4] text-[#c86556] border-[#f6cbc3]",
    brand:
      "bg-[rgba(184,139,84,0.09)] text-[var(--brand)] border-[rgba(184,139,84,0.18)] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]",
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
