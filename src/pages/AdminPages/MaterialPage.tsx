import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SubjectCard } from "@/components/tambah_kesiswaan/SubjectCard";
import { SemesterCard } from "@/components/tambah_kesiswaan/SemesterCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Subject {
  id: string;
  abbreviation: string;
  fullName: string;
  semesters: number[];
}

const AdminMaterialsPage = () => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [semesters, setSemesters] = useState<number[]>([]);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [subjects, setSubjects] = useState<Subject[]>([]);

  // Load subjects from localStorage on component mount
  useEffect(() => {
    const storedSubjects = localStorage.getItem("subjects");
    if (storedSubjects) {
      setSubjects(JSON.parse(storedSubjects));
    } else {
      // Initial sample data
      const initialSubjects = [
        { id: "1", abbreviation: "DKV", fullName: "Desain Komunikasi Visual", semesters: [1, 2, 3, 4, 5, 6] },
        { id: "2", abbreviation: "TB", fullName: "Tata Busana", semesters: [1, 2, 3, 4, 5, 6] },
        { id: "3", abbreviation: "PH", fullName: "Perhotelan", semesters: [1, 2, 3, 4, 5, 6] },
        { id: "4", abbreviation: "BG", fullName: "Tata Boga", semesters: [1, 2, 3, 4, 5, 6] },
        { id: "5", abbreviation: "TKC", fullName: "Tata Kecantikan", semesters: [1, 2, 3, 4, 5, 6] },
        { id: "6", abbreviation: "AK", fullName: "Akutansi", semesters: [1, 2, 3, 4, 5, 6] },
      ];
      localStorage.setItem("subjects", JSON.stringify(initialSubjects));
      setSubjects(initialSubjects);
    }
  }, []);

  // Filter subjects based on search
  const filteredSubjects = subjects.filter((subject) => subject.abbreviation.toLowerCase().includes(searchQuery.toLowerCase()) || subject.fullName.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSubjectClick = (subject: Subject) => {
    // Navigate directly to the semester detail page corresponding to the major's ID.
    const majorPath = subject.abbreviation.toLowerCase();
    const semesterNumber = subject.id; // "1", "2", "3", etc.
    navigate(`/admin/materials/${majorPath}/semester/${semesterNumber}`);
  };

  const handleAddCourse = () => {
    if (selectedSubject) {
      navigate("add-course");
    }
  };

  const handleEdit = (id: string) => {
    console.log("Edit subject with id:", id);
    // Implement edit functionality
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus jurusan ini?")) {
      const updatedSubjects = subjects.filter((subject) => subject.id !== id);
      localStorage.setItem("subjects", JSON.stringify(updatedSubjects));
      setSubjects(updatedSubjects);
      toast.success("Jurusan berhasil dihapus");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Jurusan</h1>
        <p className="text-muted-foreground mt-2">Kelola daftar Jurusan di SMKN 6 Makassar</p>
      </div>

      {/* Search and Add Section */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="w-full sm:w-72">
            <Input placeholder="Cari jurusan..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full" />
          </div>
          <Button onClick={() => navigate("add-subject")} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Jurusan
          </Button>
        </div>
      </Card>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((subject) => (
          <div key={subject.id} onClick={() => handleSubjectClick(subject)} className="cursor-pointer">
            <SubjectCard
              abbreviation={subject.abbreviation}
              fullName={subject.fullName}
              onEdit={(e) => {
                e.stopPropagation();
                handleEdit(subject.id);
              }}
              onDelete={(e) => {
                e.stopPropagation();
                handleDelete(subject.id);
              }}
            />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredSubjects.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">{searchQuery ? "Tidak ada mata pelajaran yang sesuai dengan pencarian." : "Belum ada mata pelajaran. Klik tombol tambah untuk menambahkan mata pelajaran baru."}</p>
        </Card>
      )}

      {/* Semester Cards Section */}
      {selectedSubject && (
        <div className="mt-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Semester - {selectedSubject.fullName}</h2>
              <Button onClick={handleAddCourse}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Mata Pelajaran
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {semesters.map((semester) => (
                <SemesterCard key={semester} semesterNumber={semester} majorId={selectedSubject.id} onClick={() => navigate(`${selectedSubject.id}/semester/${semester}`)} />
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminMaterialsPage;
