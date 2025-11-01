import TabNavigation from "@/components/Tambah_Siswa/TabNavigation";
import ParentForm from "@/components/Tambah_Siswa/ParentForm";
import StudentForm from "@/components/Tambah_Siswa/StudentForm";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import supabase from "@/supabase";



const AdminStudentsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editingStudent = location.state?.editingStudent || null;

  const [studentData, setStudentData] = useState<any>(null);
  const [parentData, setParentData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveStudent = (data: any) => {
    setStudentData(data);
  };

  const handleSaveParent = (data: any) => {
    setParentData(data);
  };

  const handleFinalSubmit = async () => {
    if (!studentData) {
      toast.error("Data siswa harus diisi lengkap.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Menyimpan semua data...");

    // 1. Check for existing NIS
    const { data: existingStudent, error: checkError } = await supabase.from("add_siswa").select("nis").eq("nis", studentData.supabaseData.nis).single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116: "The query returned no rows" - this is expected if NIS doesn't exist
      toast.error(`Terjadi kesalahan saat memeriksa NIS: ${checkError.message}`, { id: toastId });
      setIsSubmitting(false);
      return;
    }

    if (existingStudent) {
      toast.error(`Siswa dengan NIS ${studentData.supabaseData.nis} sudah terdaftar.`, { id: toastId });
      setIsSubmitting(false);
      return;
    }

    // 2. Insert student data
    const { id, ...studentInsertData } = studentData.supabaseData;
    const { data: newStudent, error: studentError } = await supabase.from("add_siswa").insert(studentInsertData).select().single();

    if (studentError) {
      toast.error(`Gagal menyimpan data siswa: ${studentError.message}`, { id: toastId });
      setIsSubmitting(false);
      return;
    }

    // 3. Insert parent data if it exists
    if (parentData) {
      const { error: parentError } = await supabase.from("data_ortu").insert({ ...parentData.supabaseData, student_id: newStudent.id });

      if (parentError) {
        toast.error(`Gagal menyimpan data orang tua: ${parentError.message}. Data siswa berhasil disimpan.`, { id: toastId });
        setIsSubmitting(false);
        // Navigate away since student was created
        setTimeout(() => navigate("/admin/students"), 2000);
        return;
      }
    }

    toast.success("Semua data berhasil disimpan!", { id: toastId });
    setIsSubmitting(false);
    setTimeout(() => navigate("/admin/student-display"), 1500);
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
            {editingStudent ? "Edit Data Siswa" : "Tambah Siswa Baru"}
          </h1>
        </div>

        <div className="space-y-8">
          <StudentForm 
            initialData={editingStudent} 
            onSavePartial={handleSaveStudent} 
          />
          <ParentForm 
            initialData={editingStudent} 
            onSave={handleSaveParent} 
          />
        </div>

        <div className="mt-8 flex justify-end">
          <Button 
            onClick={handleFinalSubmit} 
            disabled={isSubmitting || !studentData || !parentData}
            className="px-8 py-3 text-lg bg-green-600 hover:bg-green-700 text-white"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Semua Data"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default AdminStudentsPage;
