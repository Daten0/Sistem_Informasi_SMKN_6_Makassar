import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { TeacherForm, TeacherFormValues } from "@/components/tambah_guru/Guru_form/TeacherForm";
import { Teacher, useTeachers, TeacherForUpdate } from "@/contexts/TeachersContext";
// import { Teacher, TeacherForUpdate } from "@/contexts/TeachersContext";
import supabase from "@/supabase";

const EditTeacherPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTeacherById, updateTeacher } = useTeachers();
  const [teacher, setTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    if (id) {
      const foundTeacher = getTeacherById(id);
      if (foundTeacher) {
        setTeacher(foundTeacher);
      } else {
        toast.error("Guru tidak ditemukan");
        navigate("/admin/teachers");
      }
    }
  }, [id, getTeacherById, navigate]);

  const handleUpdateTeacher = async (updatedData: TeacherForUpdate) => {
    if (!id) return;
    const success = await updateTeacher(id, updatedData);
    if (success) {
      navigate("/admin/teachers");
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
      />
    </div>
  );
};

export default EditTeacherPage;