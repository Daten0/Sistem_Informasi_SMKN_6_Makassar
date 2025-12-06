import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
  useCallback,
  useRef,
} from "react";
import supabase from "../supabase";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { clearSupabaseSession } from "@/lib/utils";

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

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<"admin" | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const isMountedRef = useRef(true);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isPageVisibleRef = useRef(true);
  const isRefreshingRef = useRef(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, []);

  const updateState = useCallback((
    user: User | null,
    sess: Session | null,
    role: "admin" | null,
    isLoading: boolean
  ) => {
    if (isMountedRef.current) {
      setCurrentUser(user);
      setSession(sess);
      setUserRole(role);
      setLoading(isLoading);
    }
  }, []);

  // Setup auth state listener - runs once on mount
  useEffect(() => {
    if (!isMountedRef.current) return;

    setLoading(true);

    const {
      data: { subscription: authListener },
    } = supabase.auth.onAuthStateChange(async (_event, sessionData) => {
      if (!isMountedRef.current) return;

      console.log("Auth state changed:", _event, sessionData?.user?.email);

      // Handle different auth events
      if (_event === 'SIGNED_OUT') {
        console.log("User signed out");
        updateState(null, null, null, false);
        return;
      }

      if (_event === 'SIGNED_IN' || _event === 'TOKEN_REFRESHED' || _event === 'USER_UPDATED') {
        if (sessionData?.user) {
          try {
            const { data: adminData, error: adminError } = await supabase
              .from("admins")
              .select("role")
              .eq("id", sessionData.user.id)
              .single();

            if (!isMountedRef.current) return;

            if (adminError || !adminData) {
              updateState(
                { ...sessionData.user, user_role: null },
                sessionData,
                null,
                false
              );
            } else {
              updateState(
                { ...sessionData.user, user_role: adminData.role },
                sessionData,
                adminData.role,
                false
              );
            }
          } catch (error) {
            console.error("Error fetching admin role:", error);
            if (isMountedRef.current) {
              updateState(null, null, null, false);
            }
          }
          return;
        }
      }

      // For other events or no session data
      updateState(null, null, null, false);
    });

    return () => {
      authListener.unsubscribe();
    };
  }, [updateState]);

  // Setup visibility change listener - handles tab switching
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        // Tab became visible
        isPageVisibleRef.current = true;

        if (!isMountedRef.current) return;

        // Prevent multiple refresh attempts
        if (isRefreshingRef.current) {
          console.log("Already refreshing, skipping duplicate request");
          return;
        }

        isRefreshingRef.current = true;

        try {
          console.log("Tab visible - validating session...");
          
          // Try to refresh token
          const { data, error } = await supabase.auth.refreshSession();

          if (!isMountedRef.current) {
            isRefreshingRef.current = false;
            return;
          }

          if (error) {
            console.error("Token refresh error:", error);
            console.log("Clearing corrupted session...");
            // Clear corrupted session on refresh failure
            await supabase.auth.signOut();
            clearSupabaseSession();
            if (isMountedRef.current) {
              updateState(null, null, null, false);
            }
          } else if (data?.session) {
            console.log("Session refreshed successfully on tab return");
            // Session is valid, auth listener will handle state update
          } else {
            // No session found
            clearSupabaseSession();
            if (isMountedRef.current) {
              updateState(null, null, null, false);
            }
          }
        } catch (error) {
          console.error("Error on tab visibility change:", error);
          if (isMountedRef.current) {
            clearSupabaseSession();
            updateState(null, null, null, false);
          }
        } finally {
          isRefreshingRef.current = false;
          // Resume inactivity timer after refresh
          if (isMountedRef.current && isPageVisibleRef.current) {
            resetInactivityTimer();
          }
        }
      } else {
        // Tab became hidden - PAUSE inactivity timer
        isPageVisibleRef.current = false;
        if (inactivityTimerRef.current) {
          clearTimeout(inactivityTimerRef.current);
          inactivityTimerRef.current = null;
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [updateState]);

  // Setup inactivity timeout - RESPECTS visibility state
  const resetInactivityTimer = useCallback(() => {
    // Clear existing timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    // Only set new timer if page is visible
    if (!isPageVisibleRef.current) {
      return;
    }

    const performLogout = async () => {
      if (!isMountedRef.current) return;
      try {
        await supabase.auth.signOut();
        clearSupabaseSession();
        if (isMountedRef.current) {
          updateState(null, null, null, false);
        }
      } catch (error) {
        console.error("Error during inactivity logout:", error);
      }
    };

    inactivityTimerRef.current = setTimeout(performLogout, INACTIVITY_TIMEOUT);
  }, [updateState]);

  // Activity listeners - only reset timer if page is visible
  useEffect(() => {
    const handleActivity = () => {
      if (isMountedRef.current && isPageVisibleRef.current) {
        resetInactivityTimer();
      }
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);

    // Initial timer setup
    resetInactivityTimer();

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [resetInactivityTimer]);

  const logout = useCallback(async () => {
    try {
      console.log("Logging out user...");
      await supabase.auth.signOut();
      // Ensure all session data is cleared
      clearSupabaseSession();
      if (isMountedRef.current) {
        updateState(null, null, null, false);
      }
    } catch (error) {
      console.error("Error logging out:", error);
      // Force clear session even if signOut fails
      clearSupabaseSession();
      if (isMountedRef.current) {
        updateState(null, null, null, false);
      }
    }
  }, [updateState]);

  const login = async (email: string, password: string) => {
    if (isLockedOut) {
      throw new Error("Too many failed login attempts. Please try again later.");
    }

    try {
      console.log("Login attempt for:", email);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Sign in error:", error);
        throw error;
      }
      
      // Login successful - auth listener will handle state update
      console.log("Login successful, auth listener will handle navigation");
      
      if (isMountedRef.current) {
        setLoginAttempts(0);
      }
    } catch (error) {
      if (isMountedRef.current) {
        setLoginAttempts((prev) => prev + 1);
        if (loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS) {
          setIsLockedOut(true);
          setTimeout(() => {
            if (isMountedRef.current) {
              setIsLockedOut(false);
              setLoginAttempts(0);
            }
          }, LOCKOUT_DURATION);
        }
      }
      throw error;
    }
  };

  const value = {
    currentUser,
    session,
    login,
    logout,
    loading,
    userRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};