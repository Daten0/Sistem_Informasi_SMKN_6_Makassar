import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
  useCallback,
} from "react";
import supabase from "../supabase";
import { clearSupabaseSession } from "@/lib/utils";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";

export type User = SupabaseUser & {
  user_role: "admin" | null;
};

interface AuthContextType {
  currentUser: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  userRole: "admin" | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<"admin" | null>(null);
  const [loading, setLoading] = useState(true);
  const isRefreshingRef = React.useRef(false);
  const isPageVisibleRef = React.useRef(true);

  // Helper to fetch admin role
  const fetchUserRole = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("admins")
        .select("role")
        .eq("id", userId)
        .single();

      if (error || !data) {
        return null;
      }
      return data.role as "admin";
    } catch (error) {
      console.error("Error fetching user role:", error);
      return null;
    }
  }, []);

  useEffect(() => {
    // 1. Check active session on mount
    const initializeAuth = async () => {
      setLoading(true);
      try {
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();

        if (initialSession?.user) {
          setSession(initialSession);
          const role = await fetchUserRole(initialSession.user.id);
          setUserRole(role);
          setCurrentUser({ ...initialSession.user, user_role: role });
        } else {
          setSession(null);
          setCurrentUser(null);
          setUserRole(null);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // 2. Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth State Change:", event);

      // Defer state updates to avoid setState-during-render warnings
      setTimeout(async () => {
        setSession(currentSession);

        if (currentSession?.user) {
          // Only fetch role if we don't have it or if user changed (though user change usually implies session change)
          // We fetch it every time to be safe and ensure sync
          const role = await fetchUserRole(currentSession.user.id);
          setUserRole(role);
          setCurrentUser({ ...currentSession.user, user_role: role });
        } else {
          setCurrentUser(null);
          setUserRole(null);
        }

        setLoading(false);
      }, 0);
    });

    // 3. Visibility handler: attempt a single refresh when tab becomes visible
    const handleVisibility = async () => {
      if (document.visibilityState === "visible") {
        isPageVisibleRef.current = true;
        if (isRefreshingRef.current) return;
        isRefreshingRef.current = true;
        try {
          const { data, error } = await supabase.auth.refreshSession();
          if (error) {
            console.error("Visibility refresh failed:", error);
            // Clear corrupted session and let auth listener handle state
            try {
              await supabase.auth.signOut();
            } catch (e) {
              console.warn("signOut after failed refresh failed:", e);
            }
            clearSupabaseSession();
          } else if (data?.session) {
            // session refreshed; auth listener will update state
            console.log("Session refreshed on visibility");
          }
        } catch (e) {
          console.error("Error during visibility refresh:", e);
        } finally {
          isRefreshingRef.current = false;
        }
      } else {
        isPageVisibleRef.current = false;
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [fetchUserRole]);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setCurrentUser(null);
    setSession(null);
    setUserRole(null);
  }, []);

  const value = { currentUser, session, login, logout, loading, userRole };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
