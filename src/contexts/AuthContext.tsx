import React, { createContext, useState, useEffect, ReactNode, useContext, useCallback, } from "react";
import supabase from "../supabase";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { useLocation } from "react-router-dom";

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

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<"admin" | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
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

          if (adminError) {
            console.error("Error fetching user profile:", adminError.message);
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
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  useEffect(() => {
    if (currentUser && !location.pathname.startsWith("/admin")) {
      logout();
    }
  }, [currentUser, location.pathname, logout]);

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