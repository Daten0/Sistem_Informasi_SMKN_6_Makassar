import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
  useRef,
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

export type TeacherForInsert = Omit<
  Teacher,
  "id" | "created_at" | "updated_at" | "terdaftar"
>;
export type TeacherForUpdate = Partial<
  Omit<Teacher, "id" | "created_at" | "updated_at">
>;

interface TeachersContextType {
  teachers: Teacher[];
  addTeacher: (teacherData: TeacherForInsert) => Promise<void>;
  updateTeacher: (
    id: string,
    teacherData: TeacherForUpdate
  ) => Promise<boolean>;
  deleteTeacher: (id: string) => Promise<void>;
  getTeacherById: (id: string) => Teacher | undefined;
  loading: boolean;
  refreshTeachers: () => Promise<void>;
}

export const TeachersContext = createContext<TeachersContextType | undefined>(
  undefined
);

export function TeachersProvider({ children }: { children: ReactNode }) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<any>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    fetchTeachers();
    setupRealtimeListener();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      isMountedRef.current = false;
    };
  }, []);

  const isSessionExpiredError = (error: any) => {
    return !error
      ? false
      : error?.code === "PGRST301" ||
          error?.code === "INVALID_JWT" ||
          (error?.message &&
            /401|unauthorized|expired|invalid/i.test(error.message));
  };

  const setupRealtimeListener = async () => {
    // Clean up old channel if exists
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Create new subscription
    channelRef.current = supabase
      .channel("public:guru")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "guru" },
        () => {
          // Defer fetch to avoid setState-during-render warnings
          setTimeout(() => {
            if (isMountedRef.current) fetchTeachers();
          }, 0);
        }
      )
      .subscribe();
  };

  const fetchTeachers = async () => {
    if (!isMountedRef.current) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("guru")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching teachers:", error);
        if (isSessionExpiredError(error)) {
          try {
            const { error: refreshError } =
              await supabase.auth.refreshSession();
            if (refreshError) {
              toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
            } else {
              const { data: retryData, error: retryError } = await supabase
                .from("guru")
                .select("*")
                .order("created_at", { ascending: true });
              if (retryError) {
                toast.error("Gagal memuat data guru", {
                  description: retryError.message,
                });
              } else {
                if (isMountedRef.current) setTeachers(retryData || []);
              }
            }
          } catch (e) {
            console.error("Error during refresh retry", e);
            toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
          }
        } else {
          toast.error("Gagal memuat data guru", { description: error.message });
        }
      } else {
        if (isMountedRef.current) setTeachers(data || []);
      }
    } catch (error) {
      if (!isMountedRef.current) return;
      console.error("Unexpected error fetching teachers:", error);
      toast.error("Terjadi kesalahan saat memuat data guru");
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  };

  const addTeacher = async (teacherData: TeacherForInsert) => {
    try {
      const { data, error } = await supabase
        .from("guru")
        .insert([{ ...teacherData, terdaftar: true }])
        .select();

      if (error) {
        toast.error("Gagal menambah data guru", { description: error.message });
        console.error(error);
      } else if (data && data.length > 0) {
        toast.success("Data guru berhasil ditambahkan");
      }
    } catch (err) {
      console.error("Error adding teacher:", err);
      toast.error("Terjadi kesalahan saat menambah data guru");
    }
  };

  const updateTeacher = async (
    id: string,
    teacherData: TeacherForUpdate
  ): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("guru")
        .update({
          ...teacherData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select();

      if (error) {
        toast.error("Gagal memperbarui data guru", {
          description: error.message,
        });
        return false;
      }

      if (data && data.length > 0) {
        toast.success("Data guru berhasil diperbarui");
        return true;
      }

      return false;
    } catch (err) {
      console.error("Error updating teacher:", err);
      toast.error("Terjadi kesalahan saat memperbarui data guru");
      return false;
    }
  };

  const deleteTeacher = async (id: string) => {
    try {
      const { error } = await supabase.from("guru").delete().eq("id", id);

      if (error) {
        toast.error("Gagal menghapus data guru", {
          description: error.message,
        });
      } else {
        toast.success("Data guru berhasil dihapus");
      }
    } catch (err) {
      console.error("Error deleting teacher:", err);
      toast.error("Terjadi kesalahan saat menghapus data guru");
    }
  };

  const getTeacherById = (id: string) => {
    return teachers.find((t) => t.id === id);
  };

  const value = {
    teachers,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    getTeacherById,
    loading,
    refreshTeachers: fetchTeachers,
  };

  return (
    <TeachersContext.Provider value={value}>
      {children}
    </TeachersContext.Provider>
  );
}

export const useTeachers = () => {
  const context = useContext(TeachersContext);
  if (context === undefined) {
    throw new Error("useTeachers must be used within a TeachersProvider");
  }
  return context;
};
