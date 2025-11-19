import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";
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
  birth_date?: string | null;
  asal?: string | null;
  alamat?: string | null;
  agama?: string | null;
  mapel?: string[] | null;
  kejuruan?: string[] | null;
  picture_url?: string | null;
  terdaftar: boolean;
}

export type TeacherForInsert = Omit<Teacher, "id" | "created_at" | "updated_at" | "picture_url" | "terdaftar"> & { picture_url?: string };
export type TeacherForUpdate = Partial<TeacherForInsert>;

interface TeachersContextType {
  teachers: Teacher[];
  addTeacher: (teacherData: TeacherForInsert, imageFile: File | null) => Promise<void>;
  updateTeacher: (id: string, teacherData: TeacherForUpdate, imageFile: File | null) => Promise<void>;
  deleteTeacher: (id: string) => Promise<void>;
  getTeacherById: (id: string) => Teacher | undefined;
  loading: boolean;
}

export const TeachersContext = createContext<TeachersContextType | undefined>(undefined);

export function TeachersProvider({ children }: { children: ReactNode }) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("guru")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching teachers:", error);
          toast.error("Gagal memuat data guru", { description: error.message });
          setTeachers([]);
        } else {
          setTeachers(data || []);
        }
      } catch (error) {
        console.error("Unexpected error fetching teachers:", error);
        toast.error("Terjadi kesalahan saat memuat data guru");
        setTeachers([]);
      }
      setLoading(false);
    };

    fetchTeachers();
  }, []);

  const addTeacher = async (teacherData: TeacherForInsert, imageFile: File | null) => {
    let picture_url: string | undefined = undefined;

    if (imageFile) {
      const fileName = `${Date.now()}_${imageFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("teacher_pictures")
        .upload(fileName, imageFile);

      if (uploadError) {
        toast.error("Gagal mengunggah gambar", { description: uploadError.message });
        console.error(uploadError);
        return;
      }
      
      const { data: urlData } = supabase.storage.from("teacher_pictures").getPublicUrl(uploadData.path);
      picture_url = urlData.publicUrl;
    }

    const { data, error } = await supabase.from("guru").insert([{ ...teacherData, picture_url, terdaftar: true }]).select().single();

    if (error) {
      toast.error("Gagal menambah data guru", { description: error.message });
      console.error(error);
    } else if (data) {
      setTeachers((prev) => [data, ...prev]);
      toast.success("Data guru berhasil ditambahkan");
    }
  };

  const updateTeacher = async (id: string, teacherData: TeacherForUpdate, imageFile: File | null) => {
    let picture_url = teacherData.picture_url;

    if (imageFile) {
      const fileName = `${Date.now()}_${imageFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("teacher_pictures")
        .upload(fileName, imageFile);

      if (uploadError) {
        toast.error("Gagal mengunggah gambar baru", { description: uploadError.message });
        return;
      }
      const { data: urlData } = supabase.storage.from("teacher_pictures").getPublicUrl(uploadData.path);
      picture_url = urlData.publicUrl;
    }
    
    const { data, error } = await supabase
      .from("guru")
      .update({ ...teacherData, picture_url, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      toast.error("Gagal memperbarui data guru", { description: error.message });
    } else if (data) {
      setTeachers((prev) => prev.map((item) => (item.id === id ? data : item)));
      toast.success("Data guru berhasil diperbarui");
    }
  };

  const deleteTeacher = async (id: string) => {
    const { error } = await supabase.from("guru").delete().eq("id", id);

    if (error) {
      toast.error("Gagal menghapus data guru", { description: error.message });
    } else {
      setTeachers((prev) => prev.filter((item) => item.id !== id));
      toast.success("Data guru berhasil dihapus");
    }
  };

  const getTeacherById = (id: string) => {
    return teachers.find((item) => item.id === id);
  };

  return (
    <TeachersContext.Provider
      value={{
        teachers,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        getTeacherById,
        loading,
      }}
    >
      {children}
    </TeachersContext.Provider>
  );
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