import { useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { TeacherForm, TeacherFormValues } from "@/components/tambah_guru/Guru_form/TeacherForm";
import { useTeachers, TeacherForInsert } from "@/contexts/TeachersContext";

const AddTeacherPage = () => {
  const navigate = useNavigate();
  const { addTeacher } = useTeachers();

  const handleAddTeacher = async (data: TeacherForInsert) => {
    await addTeacher(data);
    navigate("/admin/teachers");
  };



  return (
    <>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Toaster richColors />
        <div className="flex items-center mb-6">
          <Button variant="outline" size="icon" className="mr-4" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
            Tambah Tenaga Pendidik Baru
          </h1>
        </div>
        <div className="space-y-8">
          <TeacherForm onSubmit={handleAddTeacher}/>
        </div>
      </div>
    </>
  );
};

export default AddTeacherPage;