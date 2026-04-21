import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeWhatsAppNumber(value: string) {
  return value.replace(/\D/g, "");
}

export function normalizeSocialHandle(value: string) {
  return value.trim().replace(/^@+/, "");
}
