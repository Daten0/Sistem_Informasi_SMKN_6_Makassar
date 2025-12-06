import React, { 
  createContext, 
  useState, 
  useEffect, 
  ReactNode, 
  useContext,
  useCallback,
  useMemo
 } from "react";
import supabase from "@/supabase";
import { toast } from "sonner";

// Based on f:\TUGAS_SIDIQ\Projects\vocational-compass-main\Context\Supabase\Db_Schema(guru).md
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
}

export const TeachersContext = createContext<TeachersContextType | undefined>(undefined);

export function TeachersProvider({ children }: { children: ReactNode }) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeachers = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("guru").select("*").order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching teachers:", error);
        toast.error("Gagal memuat data guru", { description: error.message });
      } else {
        setTeachers(data || []);
      }
    } catch (error) {
      console.error("Unexpected error fetching teachers:", error);
      toast.error("Terjadi kesalahan saat memuat data guru");
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchTeachers().finally(() => setLoading(false));

    const channel = supabase
      .channel("public:guru")
      .on("postgres_changes", { event: "*", schema: "public", table: "guru" }, () => {
        fetchTeachers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTeachers]);



  const addTeacher = useCallback(
    async (teacherData: TeacherForInsert) => {
      const { data, error } = await supabase
        .from("guru")
        .insert([{ ...teacherData, terdaftar: true }])
        .select();

      if (error) {
        toast.error("Gagal menambah data guru", {
          description: error.message,
        });
        console.error(error);
      } else if (data && data.length > 0) {
        toast.success("Data guru berhasil ditambahkan");
      }
    },
    []
  );

  const updateTeacher = useCallback(
    async (
      id: string,
      teacherData: TeacherForUpdate
    ): Promise<boolean> => {
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
    },
    []
  );

  const deleteTeacher = useCallback(async (id: string) => {
    const { error } = await supabase.from("guru").delete().eq("id", id);

    if (error) {
      toast.error("Gagal menghapus data guru", {
        description: error.message,
      });
    } else {
      toast.success("Data guru berhasil dihapus");
    }
  }, []);

  const getTeacherById = useCallback(
    (id: string) => {
      return teachers.find((item) => item.id === id);
    },
    [teachers]
  );

  const value = useMemo(
    () => ({
      teachers,
      addTeacher,
      updateTeacher,
      deleteTeacher,
      getTeacherById,
      loading,
    }),
    [teachers, addTeacher, updateTeacher, deleteTeacher, getTeacherById, loading],
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
    };
  }
  return context;
}