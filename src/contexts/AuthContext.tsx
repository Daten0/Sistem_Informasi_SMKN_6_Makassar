import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";
import supabase from "../supabase";
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

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<"admin" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);

      if (session?.user) {
        try {
          const { data: adminData, error: adminError } = await supabase
            .from("admins")
            .select("role")
            .eq("id", session.user.id)
            .single();

          if (adminError) {
            console.error("Error fetching user profile:", adminError);
            setUserRole(null);
            setCurrentUser({ ...session.user, user_role: null });
          } else {
            setUserRole(adminData.role);
            setCurrentUser({ ...session.user, user_role: adminData.role });
          }
        } catch (error) {
          console.error("Error in try-catch fetching user profile:", error);
          setUserRole(null);
          setCurrentUser({ ...session.user, user_role: null });
        }
      } else {
        setCurrentUser(null);
        setUserRole(null);
      }
      setLoading(false);
    };

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        try {
          const { data: adminData, error: adminError } = await supabase
            .from("admins")
            .select("role")
            .eq("id", session.user.id)
            .single();

          if (adminError) {
            console.error("Error fetching user profile on auth change:", adminError);
            setUserRole(null);
            setCurrentUser({ ...session.user, user_role: null });
          } else {
            setUserRole(adminData.role);
            setCurrentUser({ ...session.user, user_role: adminData.role });
          }
        } catch (error) {
          console.error("Error in try-catch fetching user profile on auth change:", error);
          setUserRole(null);
          setCurrentUser({ ...session.user, user_role: null });
        }
      } else {
        setCurrentUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return <AuthContext.Provider value={{ currentUser, session, login, logout, loading, userRole }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};