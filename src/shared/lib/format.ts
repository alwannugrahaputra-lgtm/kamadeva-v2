import { format } from "date-fns";

export function formatCurrency(amount: number | null | undefined) {
  const safeAmount = amount ?? 0;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(safeAmount);
}

export function formatDate(date: Date | string | null | undefined, pattern = "dd MMM yyyy") {
  if (!date) return "-";
  return format(new Date(date), pattern);
}

export function formatDateTime(date: Date | string | null | undefined) {
  if (!date) return "-";
  return format(new Date(date), "dd MMM yyyy, HH:mm");
}
