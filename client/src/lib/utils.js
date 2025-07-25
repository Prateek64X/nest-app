import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function truncateNumber(number, digits=2) {
  return Math.floor(Number(number) * 100) / 10 ** digits;
}