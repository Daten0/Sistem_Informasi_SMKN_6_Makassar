import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const supabaseCookieStorage = {
  getItem: (key: string): string | null => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(
      new RegExp("(^|;\\s*)" + key + "=([^;]+)")
    );
    return match ? decodeURIComponent(match[2]) : null;
  },
  setItem: (key: string, value: string): void => {
    if (typeof document === "undefined") return;
    // Expires on browser close
    document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(
      value
    )}; path=/; SameSite=Strict; Secure`;
  },
  removeItem: (key: string): void => {
    if (typeof document === "undefined") return;
    document.cookie = `${key}=; path=/; max-age=0`;
  },
};