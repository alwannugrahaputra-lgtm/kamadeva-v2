"use client";


// Penjelasan file: komponen UI reusable yang dipakai di banyak halaman.
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/shared/lib/utils";

export function SubmitButton({
  children,
  pendingText = "Menyimpan...",
  variant = "primary",
  className,
}: {
  children: React.ReactNode;
  pendingText?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant={variant} disabled={pending} className={cn(className)}>
      {pending ? pendingText : children}
    </Button>
  );
}
