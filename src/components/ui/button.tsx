// Penjelasan file: komponen UI reusable yang dipakai di banyak halaman.
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  icon?: ReactNode;
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-[linear-gradient(135deg,#CFA262,#B88B54_58%,#9D7343)] text-[#fffaf5] shadow-[0_16px_32px_rgba(184,139,84,0.22)] hover:-translate-y-0.5 hover:shadow-[0_20px_36px_rgba(184,139,84,0.24)]",
  secondary:
    "bg-[#fffdfa] text-[var(--brand-deep)] border border-[rgba(184,139,84,0.18)] shadow-[0_10px_26px_rgba(123,96,68,0.08)] hover:-translate-y-0.5 hover:bg-[var(--soft)] hover:shadow-[0_14px_28px_rgba(123,96,68,0.1)]",
  ghost:
    "bg-transparent text-[var(--brand-deep)] hover:bg-[rgba(184,139,84,0.08)] hover:-translate-y-0.5",
  danger: "bg-[#c86556] text-white hover:bg-[#ae5446]",
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
