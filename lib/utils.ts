import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getSeasonFromDate(dateStr: string): 'Monsoon' | 'Summer' | 'Winter' | 'Spring' | 'Autumn' {
  if (!dateStr) return 'Monsoon';
  const month = new Date(dateStr).getMonth() + 1; // 1-12
  // India climate / seasonal patterns
  if (month >= 6 && month <= 9) return 'Monsoon'; // June - Sept
  if (month >= 3 && month <= 5) return 'Summer'; // March - May
  if (month >= 11 || month <= 1) return 'Winter'; // Nov - Jan
  if (month === 2) return 'Spring'; // Feb
  return 'Autumn'; // Oct
}

