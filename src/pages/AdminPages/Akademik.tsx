import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SubjectCard } from "@/components/Akademik/SubjectCard";
import { SemesterCard } from "@/components/Akademik/SemesterCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import supabase from "@/supabase";

interface Subject {
  id: string;
  nama_jurusan: string;
  label_jurusan: string;
  // abbreviation: string;
}
const AdminMaterialsPage = () => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [semesters, setSemesters] = useState<number[]>([]);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [subjects, setSubjects] = useState<any[]>([]);

  // Load subjects from localStorage on component mount
  useEffect(() => {
    fetchKejuruan();
  }, []);

  const fetchKejuruan = async () => {
    const { data, error } = await supabase.from("kejuruan").select("*");
    if (error) {
      toast.error("Error fetching majors", {
        description: error.message,
      });
    } else {
      setSubjects(data || []);
    }
  };

  // Filter subjects based on search
  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.label_jurusan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.nama_jurusan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubjectClick = (subject: Subject) => {
    const majorPath = subject.label_jurusan.toLowerCase() as keyof typeof majorToSemesterMap;

    const majorToSemesterMap = {
      dkv: 1,
      ak: 2,
      ph: 3,
      bg: 4,
      tkc: 5,
      bs: 6,
    };

    const semesterNumber = majorToSemesterMap[majorPath];

    if (semesterNumber) {
      navigate(`/admin/kejuruan/${majorPath}/semester/${semesterNumber}`);
    } else {
      // Fallback for majors not in the map, though you might want to handle this differently.
      // For now, it will navigate using the subject's ID.
      navigate(`/admin/kejuruan/${majorPath}/semester/${subject.id}`); // Or a default page
    }
  };

  const handleAddCourse = () => {
    if (selectedSubject) {
      navigate("add-course");
    }
  };

  // const handleEdit = (id: string) => {
  //   console.log("Edit subject with id:", id);
  //   // Implement edit functionality
  // };

  const handleDelete = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus jurusan ini?")) {
      const { error } = await supabase.from("kejuruan").delete().eq("id", id);

      if (error) {
        toast.error("Error deleting major", {
          description: error.message,
        });
      } else {
        toast.success("Jurusan berhasil dihapus");
        fetchKejuruan(); // Refresh the list
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Jurusan
        </h1>
        <p className="text-muted-foreground mt-2">
          Kelola daftar Jurusan di SMKN 6 Makassar
        </p>
      </div>

      {/* Search and Add Section
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="w-full sm:w-72">
            <Input
              placeholder="Cari jurusan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <Button
            onClick={() => navigate("add-kejuruan")}
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Jurusan
          </Button>
        </div>
      </Card> */}

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((subject) => (
          <div
            key={subject.id}
            onClick={() => handleSubjectClick(subject)}
            className="cursor-pointer"
          >
            <SubjectCard
              abbreviation={subject.label_jurusan}
              fullName={subject.nama_jurusan}
            />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredSubjects.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            {searchQuery
              ? "Tidak ada mata pelajaran yang sesuai dengan pencarian."
              : "Belum ada mata pelajaran. Klik tombol tambah untuk menambahkan mata pelajaran baru."}
          </p>
        </Card>
      )}

      {/* Semester Cards Section */}
      {selectedSubject && (
        <div className="mt-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                Semester - {selectedSubject.label_jurusan}
              </h2>
              <Button onClick={handleAddCourse}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Mata Pelajaran
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {semesters.map((semester) => (
                <SemesterCard
                  key={semester}
                  semesterNumber={semester}
                  kejuruanId={selectedSubject.id}
                  onClick={() =>
                    navigate(`${selectedSubject.id}/semester/${semester}`)
                  }
                />
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminMaterialsPage;
