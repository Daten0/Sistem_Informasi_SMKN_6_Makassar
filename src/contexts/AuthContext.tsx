import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
  useCallback,
} from "react";
import supabase from "../supabase";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";
// import { useLocation } from "react-router-dom";

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
  // const location = useLocation();

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      setSession(null);
      setUserRole(null);
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    const {
      data: { subscription: authListener },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        try {
          const { data: adminData, error: adminError } = await supabase
            .from("admins")
            .select("role")
            .eq("id", session.user.id)
            .single();

          if (adminError || !adminData) {
            setCurrentUser({ ...session.user, user_role: null });
            setUserRole(null);
          } else {
            setCurrentUser({ ...session.user, user_role: adminData.role });
            setUserRole(adminData.role);
          }
        } catch (error) {
          console.error("Error in auth state change:", error);
          setCurrentUser(null);
          setUserRole(null);
        }
      } else {
        setCurrentUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => {
      authListener.unsubscribe();
    };
  }, [logout]);

  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(logout, INACTIVITY_TIMEOUT);
    };

    window.addEventListener("mousemove", resetInactivityTimer);
    window.addEventListener("keydown", resetInactivityTimer);
    window.addEventListener("click", resetInactivityTimer);

    resetInactivityTimer(); // Initial setup

    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener("mousemove", resetInactivityTimer);
      window.removeEventListener("keydown", resetInactivityTimer);
      window.removeEventListener("click", resetInactivityTimer);
    };
  }, [logout]);

  const login = async (email: string, password: string) => {
    if (isLockedOut) {
      throw new Error("Too many failed login attempts. Please try again later.");
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setLoginAttempts(0); // Reset on successful login
    } catch (error) {
      setLoginAttempts((prev) => prev + 1);
      if (loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS) {
        setIsLockedOut(true);
        setTimeout(() => {
          setIsLockedOut(false);
          setLoginAttempts(0);
        }, LOCKOUT_DURATION);
      }
      throw error;
    }
  };

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