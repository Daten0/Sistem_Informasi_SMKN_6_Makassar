import ParentForm from "@/components/Tambah_Siswa/ParentForm";
import StudentForm from "@/components/Tambah_Siswa/StudentForm";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import supabase from "@/supabase";

const SiswaFormPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editingStudent = location.state?.editingStudent || null;

  const [studentData, setStudentData] = useState<any>(null);
  const [parentData, setParentData] = useState<any>(null);
  const [initialStudentData, setInitialStudentData] = useState<any>(null);
  const [initialParentData, setInitialParentData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingStudent) {
      setInitialStudentData(editingStudent);

      if (editingStudent.parentInfo) {
        const parentInfo = editingStudent.parentInfo;
        const mappedParentData = {
          parentInfo: {
            namaAyah: parentInfo.nama_lengkap_ayah,
            pekerjaanAyah: parentInfo.pekerjaan_ayah,
            pendidikanAyah: parentInfo.pendidikan_ayah,
            penghasilanAyah: parentInfo.penghasilan_ayah,
            teleponAyah: parentInfo.nomor_telepon_ayah,
            namaIbu: parentInfo.nama_lengkap_ibu,
            pekerjaanIbu: parentInfo.pekerjaan_ibu,
            pendidikanIbu: parentInfo.pendidikan_ibu,
            penghasilanIbu: parentInfo.penghasilan_ibu,
            teleponIbu: parentInfo.nomor_telepon_ibu,
            alamatOrangTua: parentInfo.alamat_orang_tua,
            namaWali: parentInfo.nama_lengkap_wali,
            pekerjaanWali: parentInfo.pekerjaan_wali,
            pendidikanWali: parentInfo.pendidikan_wali,
            hubunganWali: parentInfo.hubungan_dengan_siswa,
            teleponWali: parentInfo.nomor_telepon_wali,
            alamatWali: parentInfo.alamat_wali,
          },
        };
        setInitialParentData(mappedParentData);
        
        handleSaveStudent({ supabaseData: editingStudent, displayData: editingStudent });
        handleSaveParent({ supabaseData: parentInfo });
      }
    }
  }, [editingStudent]);

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

    const studentPayload = {
      ...studentData.supabaseData,
      terdaftar: !!parentData,
    };

    if (editingStudent) {
      // UPDATE LOGIC
      if (studentPayload.nis && studentPayload.nis !== editingStudent.nis) {
        const { data: existingStudentWithNewNis, error: checkError } = await supabase.from("add_siswa").select("nis").eq("nis", studentData.supabaseData.nis).single();

        if (checkError && checkError.code !== "PGRST116") {
          toast.error(`Terjadi kesalahan saat memeriksa NIS: ${checkError.message}`, { id: toastId });
          setIsSubmitting(false);
          return;
        }

        if (existingStudentWithNewNis) {
          toast.error(`Siswa dengan NIS ${studentData.supabaseData.nis} sudah terdaftar.`, { id: toastId });
          setIsSubmitting(false);
          return;
        }
      }

      const { error: studentError } = await supabase.from("add_siswa").update(studentPayload).eq("id", editingStudent.id);

      if (studentError) {
        toast.error(`Gagal memperbarui data siswa: ${studentError.message}`, { id: toastId });
        setIsSubmitting(false);
        return;
      }

      if (parentData) {
        const parentId = editingStudent.parentInfo?.id;
        if (parentId) {
          const { error: parentError } = await supabase.from("data_ortu").update(parentData.supabaseData).eq("id", parentId);

          if (parentError) {
            toast.error(`Gagal memperbarui data orang tua: ${parentError.message}. Data siswa berhasil diperbarui.`, { id: toastId });
          }
        } else {
          const { error: parentError } = await supabase.from("data_ortu").insert(parentData.supabaseData);

          if (parentError) {
            toast.error(`Gagal menyimpan data orang tua: ${parentError.message}. Data siswa berhasil diperbarui.`, { id: toastId });
          }
        }
      }

      toast.success("Semua data berhasil diperbarui!", { id: toastId });
      setIsSubmitting(false);
      setTimeout(() => navigate("/students"), 1500);
    } else {
      // CREATE LOGIC
      const { data: existingStudent, error: checkError } = await supabase.from("add_siswa").select("nis").eq("nis", studentPayload.nis).single();

      if (checkError && checkError.code !== "PGRST116") {
        toast.error(`Terjadi kesalahan saat memeriksa NIS: ${checkError.message}`, { id: toastId });
        setIsSubmitting(false);
        return;
      }

      if (existingStudent) {
        toast.error(`Siswa dengan NIS ${studentPayload.nis} sudah terdaftar.`, { id: toastId });
        setIsSubmitting(false);
        return;
      }

      const { id, ...studentInsertData } = studentPayload;
      const { data: newStudent, error: studentError } = await supabase.from("add_siswa").insert(studentInsertData).select().single();

      if (studentError) {
        toast.error(`Gagal menyimpan data siswa: ${studentError.message}`, { id: toastId });
        setIsSubmitting(false);
        return;
      }
      
      if (parentData) {
        const { error: parentError } = await supabase.from("data_ortu").insert({ ...parentData.supabaseData, student_id: newStudent.id });

        if (parentError) {
          toast.error(`Gagal menyimpan data orang tua: ${parentError.message}. Data siswa berhasil disimpan.`, { id: toastId });
          setIsSubmitting(false);
          setTimeout(() => navigate("/students"), 2000);
          return;
        }
      }

      toast.success("Semua data berhasil disimpan!", { id: toastId });
      setIsSubmitting(false);
      setTimeout(() => navigate("/students"), 1500);
    }
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
            initialData={initialStudentData} 
            onSavePartial={handleSaveStudent} 
          />
          <ParentForm 
            initialData={initialParentData} 
            onSave={handleSaveParent} 
          />
        </div>

        <div className="mt-8 flex justify-end">
          <Button 
            onClick={handleFinalSubmit} 
            disabled={isSubmitting || !studentData}
            className="px-8 py-3 text-lg bg-green-600 hover:bg-green-700 text-white"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Semua Data"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default SiswaFormPage;