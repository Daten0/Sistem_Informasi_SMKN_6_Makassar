import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SubjectCard } from "@/components/tambah_kesiswaan/SubjectCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Subject {
  id: string;
  abbreviation: string;
  fullName: string;
}

const AdminMaterialsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Sample data - replace with actual data
  const subjects: Subject[] = [
    { id: "1", abbreviation: "DKV", fullName: "Desain Komunikasi Visual" },
    { id: "2", abbreviation: "TB", fullName: "Tata Busana" },
    { id: "3", abbreviation: "PH", fullName: "Perhotelan" },
    { id: "4", abbreviation: "BG", fullName: "Tata Boga" },
    { id: "5", abbreviation: "TKC", fullName: "Tata Kecantikan" },
    { id: "6", abbreviation: "AK", fullName: "Akutansi" },
  ];

  // Filter subjects based on search
  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.abbreviation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (id: string) => {
    console.log("Edit subject with id:", id);
    // Implement edit functionality
  };

  const handleDelete = (id: string) => {
    console.log("Delete subject with id:", id);
    // Implement delete functionality
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Jurusan</h1>
        <p className="text-muted-foreground mt-2">
          Kelola daftar Jurusan di SMKN 6 Makassar
        </p>
      </div>

      {/* Search and Add Section */}
      <Card className="p-6">
        <div className="flex justify-end">
          <Button 
            onClick={() => navigate('add-subject')} 
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Jurusan
          </Button>
        </div>
      </Card>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((subject) => (
          <SubjectCard
            key={subject.id}
            abbreviation={subject.abbreviation}
            fullName={subject.fullName}
            onEdit={() => handleEdit(subject.id)}
            onDelete={() => handleDelete(subject.id)}
          />
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
    </div>
  );
};

export default AdminMaterialsPage;