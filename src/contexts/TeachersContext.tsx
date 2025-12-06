import React, { 
  createContext, 
  useState, 
  useEffect, 
  ReactNode, 
  useContext,
  useMemo,
  useRef
 } from "react";
import supabase from "@/supabase";
import { toast } from "sonner";

export interface Teacher {
  id: string;
  created_at: string;
  updated_at?: string | null;
  nip: string;
  username: string;
  jabatan?: string | null;
  mapel?: string[] | null;
  kejuruan?: string[] | null;
  picture_url?: string | null;
  terdaftar: boolean;
}

export type TeacherForInsert = Omit<Teacher, "id" | "created_at" | "updated_at" | "terdaftar">;
export type TeacherForUpdate = Partial<Omit<Teacher, "id" | "created_at" | "updated_at">>;

interface TeachersContextType {
  teachers: Teacher[];
  addTeacher: (teacherData: TeacherForInsert) => Promise<void>;
  updateTeacher: (id: string, teacherData: TeacherForUpdate) => Promise<boolean>;
  deleteTeacher: (id: string) => Promise<void>;
  getTeacherById: (id: string) => Teacher | undefined;
  loading: boolean;
  refreshTeachers: () => Promise<void>;
}

export const TeachersContext = createContext<TeachersContextType | undefined>(undefined);

export function TeachersProvider({ children }: { children: ReactNode }) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const isMountedRef = useRef(true);
  const channelRef = useRef<any>(null);
  const isPageVisibleRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);

  // Handle page visibility - Re-establish connection when returning to tab
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        isPageVisibleRef.current = true;
        // Re-fetch and re-subscribe when page becomes visible
        if (isMountedRef.current) {
          await fetchTeachers();
          await setupRealtimeListener();
        }
      } else {
        isPageVisibleRef.current = false;
        // Clean up subscription when page is hidden
        if (channelRef.current) {
          supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const setupRealtimeListener = async () => {
    if (!isMountedRef.current) return;

    // Clean up old channel if exists
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Create new subscription
    channelRef.current = supabase
      .channel("public:guru")
      .on("postgres_changes", { event: "*", schema: "public", table: "guru" }, () => {
        if (isMountedRef.current && isPageVisibleRef.current) {
          fetchTeachers();
        }
      })
      .subscribe();
  };

  const isSessionExpiredError = (error: any): boolean => {
    // Check for various session expiration indicators
    return (
      error?.code === 'PGRST301' || // Unauthorized error code
      error?.code === 'INVALID_JWT' ||
      error?.message?.includes('401') ||
      error?.message?.includes('unauthorized') ||
      error?.message?.includes('expired')
    );
  };

  const fetchTeachers = async () => {
    if (!isMountedRef.current) return;

    try {
      if (isMountedRef.current) {
        setLoading(true);
      }

      const { data, error } = await supabase
        .from("guru")
        .select("*")
        .order("created_at", { ascending: false });

      if (!isMountedRef.current) return;

      if (error) {
        console.error("Error fetching teachers:", error);
        
        // Check for authentication errors
        if (isSessionExpiredError(error)) {
          console.warn("Session expired - attempting refresh");
          
          // Try to refresh session
          const { error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshError || !isMountedRef.current) {
            toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
            // Don't redirect here - let AuthContext handle it
            return;
          }
          
          // Retry fetch after refresh
          const { data: retryData, error: retryError } = await supabase
            .from("guru")
            .select("*")
            .order("created_at", { ascending: false });

          if (!isMountedRef.current) return;

          if (retryError) {
            toast.error("Gagal memuat data guru", { description: retryError.message });
          } else {
            setTeachers(retryData || []);
          }
        } else {
          toast.error("Gagal memuat data guru", { description: error.message });
        }
      } else {
        setTeachers(data || []);
      }
    } catch (error) {
      if (!isMountedRef.current) return;
      console.error("Unexpected error fetching teachers:", error);
      toast.error("Terjadi kesalahan saat memuat data guru");
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  // Initial fetch and setup
  useEffect(() => {
    if (!isMountedRef.current) return;

    fetchTeachers();
    setupRealtimeListener();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);

  const addTeacher = async (teacherData: TeacherForInsert) => {
    if (!isMountedRef.current) return;

    try {
      const { data, error } = await supabase
        .from("guru")
        .insert([{ ...teacherData, terdaftar: true }])
        .select();

      if (!isMountedRef.current) return;

      if (error) {
        if (isSessionExpiredError(error)) {
          toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
        } else {
          toast.error("Gagal menambah data guru", { description: error.message });
        }
        console.error(error);
      } else if (data && data.length > 0) {
        toast.success("Data guru berhasil ditambahkan");
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      console.error("Error adding teacher:", err);
      toast.error("Terjadi kesalahan saat menambah data guru");
    }
  };

  const updateTeacher = async (
    id: string,
    teacherData: TeacherForUpdate
  ): Promise<boolean> => {
    if (!isMountedRef.current) return false;

    try {
      const { data, error } = await supabase
        .from("guru")
        .update({
          ...teacherData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select();

      if (!isMountedRef.current) return false;

      if (error) {
        if (isSessionExpiredError(error)) {
          toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
        } else {
          toast.error("Gagal memperbarui data guru", { description: error.message });
        }
        return false;
      }

      if (data && data.length > 0) {
        toast.success("Data guru berhasil diperbarui");
        return true;
      }

      return false;
    } catch (err) {
      if (!isMountedRef.current) return false;
      console.error("Error updating teacher:", err);
      toast.error("Terjadi kesalahan saat memperbarui data guru");
      return false;
    }
  };

  const deleteTeacher = async (id: string) => {
    if (!isMountedRef.current) return;

    try {
      const { error } = await supabase.from("guru").delete().eq("id", id);

      if (!isMountedRef.current) return;

      if (error) {
        if (isSessionExpiredError(error)) {
          toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
        } else {
          toast.error("Gagal menghapus data guru", { description: error.message });
        }
      } else {
        toast.success("Data guru berhasil dihapus");
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      console.error("Error deleting teacher:", err);
      toast.error("Terjadi kesalahan saat menghapus data guru");
    }
  };

  const getTeacherById = (id: string) => {
    return teachers.find((item) => item.id === id);
  };

  const value = useMemo(
    () => ({
      teachers,
      addTeacher,
      updateTeacher,
      deleteTeacher,
      getTeacherById,
      loading,
      refreshTeachers: fetchTeachers,
    }),
    [teachers, loading],
  );

  return <TeachersContext.Provider value={value}>{children}</TeachersContext.Provider>;
}

export function useTeachers() {
  const context = useContext(TeachersContext);
  if (context === undefined) {
    console.warn("useTeachers called outside of TeachersProvider - returning safe fallback");
    return {
      teachers: [],
      addTeacher: async () => {},
      updateTeacher: async () => {},
      deleteTeacher: async () => {},
      getTeacherById: () => undefined,
      loading: false,
      refreshTeachers: async () => {},
    };
  }
  return context;
}