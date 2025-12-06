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
    // Set with 1 year expiration to persist across sessions
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(
      value
    )}; path=/; expires=${expirationDate.toUTCString()}; SameSite=Lax`;
  },
  removeItem: (key: string): void => {
    if (typeof document === "undefined") return;
    // Properly remove cookie by setting past date
    document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax`;
  },
};

// Helper function to clear all Supabase session data
export const clearSupabaseSession = () => {
  if (typeof document === "undefined") return;
  
  // List of all possible Supabase session keys
  const sessionKeys = [
    "sb-auth-token",
    "sb-refresh-token",
    "supabase.auth.token",
    "supabase.auth.refreshToken",
    "SUPABASE_AUTH_TOKEN",
    "auth.0.expires_at",
    "auth.0.user",
    "auth.0.token",
  ];
  
  // Clear from cookies
  sessionKeys.forEach(key => {
    supabaseCookieStorage.removeItem(key);
    // Also try to clear from any auth subdomain
    supabaseCookieStorage.removeItem(`sb:${key}`);
  });
  
  // Clear from localStorage if present
  if (typeof localStorage !== "undefined") {
    sessionKeys.forEach(key => {
      localStorage.removeItem(key);
      localStorage.removeItem(`sb:${key}`);
    });
  }
  
  // Also clear Supabase keys from storage
  if (typeof localStorage !== "undefined") {
    Object.keys(localStorage).forEach(key => {
      if (key.includes("supabase") || key.includes("auth") || key.startsWith("sb:")) {
        localStorage.removeItem(key);
      }
    });
  }
  
  console.log("Supabase session data cleared");
};