import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "@/supabase";
import { toast } from "sonner";
import StudentForm from "@/components/Tambah_Siswa/StudentForm";
import ParentForm from "@/components/Tambah_Siswa/ParentForm";
import TabNavigation from "@/components/Tambah_Siswa/TabNavigation";
import { Button } from "@/components/ui/button";
import StudentFormProps from "@/components/Tambah_Siswa/StudentForm";

const EditStudentPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"student" | "parent">("student");
  const [studentDataForForm, setStudentDataForForm] = useState<any>(null);
  const [parentDataForForm, setParentDataForForm] = useState<any>(null);
  
  const [studentPayload, setStudentPayload] = useState<any>(null);
  const [parentPayload, setParentPayload] = useState<any>(null);
  
  const [parentRecordId, setParentRecordId] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchStudent = async () => {
        const { data, error } = await supabase
          .from("add_siswa")
          .select(`*, data_ortu (*)`)
          .eq("id", id)
          .single();

        if (error) {
          toast.error("Gagal mengambil data siswa.", { description: error.message });
        } else if (data) {
            const formattedStudent = {
                id: data.id,
                fullName: data.nama_lengkap,
                nis: String(data.nis),
                gender: data.jenis_kelamin,
                birthPlace: data.tempat_lahir,
                birthDate: data.tanggal_lahir,
                religion: data.agama,
                address: data.alamat_lengkap,
                phoneNumber: data.nomor_telepon,
                terdaftar: data.terdaftar,
                kejuruan: data.kejuruan,
                kelas: data.kelas,
                photo: data.foto_siswa,
              };
          setStudentDataForForm(formattedStudent);
          
          // This payload is closer to the database schema and is used for submission
          const { data_ortu, ...studentDbData } = data;
          setStudentPayload(studentDbData);

          if (data.data_ortu && data.data_ortu.length > 0) {
            setParentDataForForm({ parentInfo: data.data_ortu[0] });
            setParentPayload(data.data_ortu[0]);
            setParentRecordId(data.data_ortu[0].id);
          }
        }
      };
      fetchStudent();
    }
  }, [id]);

  const handleStudentSave = (data: any) => {
    setStudentPayload(data.supabaseData);
    setActiveTab("parent");
  };

  const handleParentSave = (data: any) => {
    setParentPayload(data.supabaseData);
  };

  const handleFinalSubmit = async () => {
    if (!studentPayload || !id) {
      toast.error("Data siswa belum lengkap.");
      return;
    }

    // 1. Update student data
    const { error: studentError } = await supabase
      .from("add_siswa")
      .update(studentPayload)
      .eq("id", id);

    if (studentError) {
      toast.error("Gagal memperbarui data siswa.", { description: studentError.message });
      return;
    }

    // 2. Update or Insert parent data
    if (parentPayload) {
      if (parentRecordId) { // Update existing parent data
        const { id: pId, student_id, created_at, ...updatePayload } = parentPayload;
        const { error: parentError } = await supabase
          .from("data_ortu")
          .update(updatePayload)
          .eq("id", parentRecordId);

        if (parentError) {
          toast.error("Gagal memperbarui data orang tua.", { description: parentError.message });
          return;
        }
      } else { // Insert new parent data
        const { error: parentInsertError } = await supabase
          .from("data_ortu")
          .insert({ ...parentPayload, student_id: id });
        if (parentInsertError) {
          toast.error("Gagal menyimpan data orang tua.", { description: parentInsertError.message });
          return;
        }
      }
    }

    toast.success("Data siswa dan orang tua berhasil diperbarui!");
    navigate("/admin/student-display");
  };

  if (!studentDataForForm) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-6">
        Edit Data Siswa
      </h1>
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className={activeTab === "student" ? "block" : "hidden"}>
        <StudentForm
          initialData={studentDataForForm}
          onSavePartial={handleStudentSave}
          studentId={id}
          isEditMode={true}
        />
      </div>
      <div className={activeTab === "parent" ? "block" : "hidden"}>
        <ParentForm
          initialData={parentDataForForm}
          onSave={handleParentSave}
          studentId={id}
        />
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleFinalSubmit}
          disabled={!studentPayload}
          className="bg-gradient-primary"
        >
          Simpan Perubahan
        </Button>
      </div>
    </div>
  );
};

export default EditStudentPage;