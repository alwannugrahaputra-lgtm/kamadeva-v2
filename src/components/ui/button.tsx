// Penjelasan file: komponen UI reusable yang dipakai di banyak halaman.
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  icon?: ReactNode;
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-[linear-gradient(135deg,#F5D77A,#D4AF37_52%,#B98E18)] text-[#0B0B0B] shadow-[0_18px_38px_rgba(212,175,55,0.24)] hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-[0_22px_44px_rgba(212,175,55,0.28)]",
  secondary:
    "bg-[rgba(255,255,255,0.04)] text-[var(--foreground)] border border-[var(--line)] shadow-[0_14px_30px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 hover:bg-[rgba(212,175,55,0.08)] hover:shadow-[0_18px_34px_rgba(212,175,55,0.12)]",
  ghost:
    "bg-transparent text-[var(--foreground)] hover:bg-[rgba(255,255,255,0.04)] hover:-translate-y-0.5",
  danger: "bg-[#8a3d37] text-white hover:bg-[#6d2d28]",
};

export function Button({
  className,
  variant = "primary",
  icon,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300",
        variants[variant],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
