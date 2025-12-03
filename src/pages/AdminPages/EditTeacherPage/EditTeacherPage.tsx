import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { TeacherForm } from "@/components/tambah_guru/Guru_form/TeacherForm";
import { useTeachers } from "@/contexts/TeachersContext";
import { Teacher, TeacherForUpdate, TeacherForInsert } from "@/contexts/TeachersContext";
import supabase from "@/supabase";

const EditTeacherPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTeacherById, updateTeacher } = useTeachers();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTeacher = async () => {
      if (!id) {
        toast.error("ID Guru tidak ditemukan");
        navigate("/admin/teachers");
        return;
      }

      // Coba dapatkan dari context dulu
      const contextTeacher = getTeacherById(id);
      if (contextTeacher) {
        setTeacher(contextTeacher);
        return;
      }

      // Jika tidak ada di context, fetch dari Supabase
      try {
        const { data, error } = await supabase
          .from("guru")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          throw error;
        }
        if (data) {
          setTeacher(data);
        } else {
          toast.error("Guru tidak ditemukan");
          navigate("/admin/teachers");
        }
      } catch (error: any) {
        console.error("Error fetching teacher:", error);
        toast.error("Gagal memuat data guru.", {
          description: error.message,
        });
        navigate("/admin/teachers");
      }
    };

    fetchTeacher();
  }, [id, navigate, getTeacherById]);

  const handleUpdateTeacher = async (
    data: TeacherForInsert,
    imageFile: File | null
  ) => {
    if (!id || !teacher) return;

    setIsSubmitting(true);
    try {
      const updatedData: TeacherForUpdate = {
        ...data,
      };

      const success = await updateTeacher(id, updatedData, imageFile);

      if (success) {
        toast.success("Data guru berhasil diperbarui!");
        navigate("/admin/teachers");
      }
    } catch (error) {
      console.error("Unexpected error during update:", error);
      toast.error("Terjadi kesalahan yang tidak terduga saat memperbarui data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!teacher) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Toaster />
      <div className="flex items-center mb-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2" />
          Kembali
        </Button>
        <h1 className="text-2xl font-bold ml-4">Edit Data Guru</h1>
      </div>
      <TeacherForm
        initialData={teacher}
        onSubmit={handleUpdateTeacher}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default EditTeacherPage;