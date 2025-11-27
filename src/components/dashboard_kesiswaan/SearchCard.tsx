import { useState, useEffect } from "react";
import { Search, QrCode, Printer } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import * as QRCode from "qrcode.react";
import supabase from "@/supabase";
import {
  Card,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import StudentProfile from "@/components/dashboard_kesiswaan/StudentProfile";
import { Badge } from "@/components/ui/badge";

export interface Kejuruan {
  id: string;
  nama_jurusan: string;
  label_jurusan: string;
}

export interface Student {
  id: string;
  nis: number;
  nama_lengkap: string;
  kejuruan: string;
  kelas: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  agama: string;
  alamat_lengkap: string;
  foto_siswa: string | null;
  jenis_kelamin: string;
  nomor_telepon: string;
  created_at: string;
  updated_at: string | null;
  terdaftar: boolean;
}

const SearchCard = () => {
  const [searchType, setSearchType] = useState("siswa");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [departments, setDepartments] = useState<Kejuruan[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchDepartments = async () => {
      const { data, error } = await supabase.from("kejuruan").select("*");
      if (error) {
        console.error("Error fetching departments:", error);
      } else {
        setDepartments(data || []);
      }
    };
    fetchDepartments();
  }, []);

  const handleSearch = async (
    department: string | null = selectedDepartment
  ) => {

    // if (!searchQuery.trim() && !department) {
    //   setSearchResults([]);
    //   setSearched(false);
    //   return;
    // }

    setLoading(true);
    setSearched(true);

    try {
      let query = supabase.from("add_siswa").select("*");

      if (department) {
        query = query.eq("kejuruan", department);
      }

      if (searchQuery.trim()) {
        const orFilters = [];
        orFilters.push(`nama_lengkap.ilike.%${searchQuery}%`);

        if (!isNaN(parseInt(searchQuery, 10))) {
          orFilters.push(`nis.eq.${searchQuery}`);
        }
        query = query.or(orFilters.join(","));
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setSearchResults(data || []);
    } catch (error) {
      console.error("Error searching students:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentSelect = (departmentLabel: string | null) => {
    setSelectedDepartment(departmentLabel);
    handleSearch(departmentLabel);
  };

  const handlePrint = () => {
    const qrCodeElement = document.getElementById("qr-code-to-print");
    if (qrCodeElement) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(
          "<html><head><title>Print QR Code</title></head><body>"
        );
        printWindow.document.write(qrCodeElement.innerHTML);
        printWindow.document.write("</body></html>");
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  if (selectedStudent) {
    return (
      <StudentProfile
        student={selectedStudent}
        onBack={() => setSelectedStudent(null)}
      />
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="bg-card rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row items-stretch">
          {/* Label Section */}
          <div className="flex items-center justify-center bg-card border-b md:border-b-0 md:border-r border-border p-4 md:min-w-[220px]">
            <Select onValueChange={setSearchType} defaultValue={searchType}>
              <SelectTrigger className="h-14 text-2xl md:text-3xl font-bold border-0 focus:ring-0">
                <SelectValue placeholder="Pilih" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="siswa" className="text-lg">
                  Siswa
                </SelectItem>
                <SelectItem value="alumni" className="text-lg">
                  Alumni
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Section */}
          <div className="flex-1 flex items-center gap-3 px-6 py-5 md:px-8 md:py-6">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder={`Cari ${
                  searchType === "siswa" ? "Siswa" : "Alumni"
                } Di Sini`}
                className="w-full h-12 pl-4 pr-12 text-base md:text-lg border-0 bg-secondary/30 focus:bg-secondary/50 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button
              size="icon"
              className="h-12 w-12 shrink-0 bg-muted hover:bg-muted/80 text-muted-foreground"
              aria-label="Search"
              onClick={() => handleSearch()}
              disabled={loading}
            >
              <Search className="h-6 w-6" />
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  className="h-12 w-12 shrink-0 bg-muted hover:bg-muted/80 text-muted-foreground"
                  aria-label="Generate QR Code"
                >
                  <QrCode className="h-6 w-6" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Scan untuk Mendaftar</DialogTitle>
                </DialogHeader>
                <div className="flex justify-center py-4" id="qr-code-to-print">
                  <QRCode.QRCodeSVG
                    value={`${window.location.origin}/students/SiswaForm`}
                    size={256}
                  />
                </div>
                <DialogFooter>
                  <Button onClick={handlePrint} variant="outline">
                    <Printer className="w-4 h-4 mr-2" />
                    Print QR
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      {/* Department Filter Chips */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Badge
          variant={!selectedDepartment ? "default" : "outline"}
          onClick={() => handleDepartmentSelect(null)}
          className="cursor-pointer"
        >
          Semua
        </Badge>
        {departments.map((dept) => (
          <Badge
            key={dept.id}
            variant={
              selectedDepartment === dept.nama_jurusan ? "default" : "outline"
            }
            onClick={() => handleDepartmentSelect(dept.nama_jurusan)}
            className="cursor-pointer"
          >
            {dept.nama_jurusan}
          </Badge>
        ))}
      </div>
      {/* Registration Prompt */}
      {searchType === "siswa" && (
        <div className="mt-6 text-center">
          <p className="text-base md:text-lg text-foreground">
            Belum Terdaftar Sebagai Siswa?{" "}
            <a
              href="/students/SiswaForm"
              className="text-primary hover:text-primary/80 font-semibold transition-colors underline-offset-4 hover:underline"
            >
              Daftar Sekarang
            </a>
          </p>
        </div>
      )}

      {searched && (
        <div className="mt-8">
          {loading ? (
            <p className="text-center">Mencari...</p>
          ) : searchResults.length > 0 ? (
            <div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                Hasil Pencarian
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.map((student) => (
                  <Card
                    key={student.id}
                    className="bg-card cursor-pointer hover:shadow-md transition-shadow flex items-center p-6"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <div className="flex-grow">
                      <CardTitle>{student.nama_lengkap}</CardTitle>
                      <CardDescription>NIS: {student.nis}</CardDescription>
                      <div className="pt-4 text-sm text-muted-foreground">
                        <p>Kelas: {student.kelas}</p>
                        <p>Kejuruan: {student.kejuruan}</p>
                      </div>
                    </div>
                    <img
                      src={student.foto_siswa || "/placeholder.svg"}
                      alt={`Foto ${student.nama_lengkap}`}
                      className="w-24 h-32 object-cover rounded-md ml-6"
                    />
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              Siswa tidak ditemukan.
            </p>
          )}
        </div>
      )}

      {/* Registration Prompt */}
      {searchType === "alumni" && (
        <div className="mt-6 text-center">
          <p className="text-base md:text-lg text-foreground">
            Belum Terdaftar Sebagai Alumni?{" "}
            <a
              href="#register"
              className="text-primary hover:text-primary/80 font-semibold transition-colors underline-offset-4 hover:underline"
            >
              Daftar Sekarang
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchCard;
