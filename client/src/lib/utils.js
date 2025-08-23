import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function truncateNumber(number, digits=2) {
  return Math.floor(Number(number) * 100) / 10 ** digits;
}

// Get route for easy switch server / serverless setup
const USE_SERVERLESS = import.meta.env.VITE_USE_SERVERLESS === "true"; // env var

export function getRoute(controller, method = "", params = {}) {
  if (USE_SERVERLESS) {
    if (!method) {
      // No action, just return /controller
      return `${controller}`;
    }

    const query = new URLSearchParams({ action: method, ...params }).toString();
    return `${controller}?${query}`;
  } else {
    // Express style fallback
    return method ? `/${controller}/${method}` : `/${controller}`;
  }
}
