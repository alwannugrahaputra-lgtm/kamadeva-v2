// Penjelasan file: komponen UI reusable yang dipakai di banyak halaman.
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  icon?: ReactNode;
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-[var(--brand-deep)] text-white hover:bg-[var(--brand)] shadow-lg shadow-[rgba(79,43,34,0.16)]",
  secondary: "bg-white text-[var(--foreground)] border border-[var(--line)] hover:bg-[var(--soft)]",
  ghost: "bg-transparent text-[var(--foreground)] hover:bg-white/60",
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
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all",
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
