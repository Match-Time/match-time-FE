import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function formatDateToISO(date: Date) {
  // Build YYYY-MM-DD in local time to avoid timezone shifts
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseISODate(value: string) {
  // Set to noon local time to avoid DST/offset backshifts
  return new Date(`${value}T12:00:00`);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
