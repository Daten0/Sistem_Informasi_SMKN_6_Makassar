import { Card } from "@/components/ui/card";
import { Student } from "./SearchCard";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";

interface StudentProfileProps {
  student: Student;
  onBack: () => void;
}

const StudentProfile = ({ student, onBack }: StudentProfileProps) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Button onClick={onBack} variant="outline" className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Pencarian
      </Button>
      {/* Profile Photo */}
      <div className="flex justify-center mb-12">
        <div className="bg-card p-6 rounded-lg shadow-lg">
          <div className="w-64 h-80 bg-muted rounded-sm overflow-hidden">
            <img src={student.foto_siswa || "/placeholder.svg"} alt="Student Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Detail Siswa Card */}
      <Card className="bg-card shadow-lg">
        <div className="p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">Detail Siswa</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8 max-w-4xl mx-auto">
            {/* Left Column */}
            <div className="space-y-8">
              <div>
                <p className="text-lg text-muted-foreground mb-1">NIS</p>
                <p className="text-2xl font-bold text-foreground">{student.nis}</p>
              </div>

              <div>
                <p className="text-lg text-muted-foreground mb-1">Jurusan</p>
                <p className="text-2xl font-bold text-foreground">{student.kejuruan}</p>
              </div>

              <div>
                <p className="text-lg text-muted-foreground mb-1">Tempat Lahir</p>
                <p className="text-2xl font-bold text-foreground">{student.tempat_lahir}</p>
              </div>

              <div>
                <p className="text-lg text-muted-foreground mb-1">Agama</p>
                <p className="text-2xl font-bold text-foreground">{student.agama}</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <div>
                <p className="text-lg text-muted-foreground mb-1">Nama Siswa</p>
                <p className="text-2xl font-bold text-foreground">{student.nama_lengkap}</p>
              </div>

              <div>
                <p className="text-lg text-muted-foreground mb-1">Kelas</p>
                <p className="text-2xl font-bold text-foreground">{student.kelas}</p>
              </div>

              <div>
                <p className="text-lg text-muted-foreground mb-1">Tanggal Lahir</p>
                <p className="text-2xl font-bold text-foreground">{new Date(student.tanggal_lahir).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
              </div>

              <div>
                <p className="text-lg text-muted-foreground mb-1">Alamat</p>
                <p className="text-2xl font-bold text-foreground">{student.alamat_lengkap}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StudentProfile;