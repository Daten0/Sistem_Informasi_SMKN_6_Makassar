import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Kejuruan {
  id: string;
  abbreviation: string;
  fullName: string;
}

const AddCourse = () => {
  const navigate = useNavigate();
  const { kejuruanId } = useParams<{ kejuruanId: string }>();
  const { toast } = useToast();
  const [kejuruan, setKejuruan] = useState<Kejuruan[]>([]);
  const [formData, setFormData] = useState({
    // Use a unique ID for each course
    id: Date.now(),
    semester: "",
    jumlahPertemuan: "",
    durasi: "",
    jenisMapel: "",
    namaMapel: "",
  });

  useEffect(() => {
    // Load majors from localStorage to populate the dropdown
    const storedMajors = localStorage.getItem("subjects");
    if (storedMajors) {
      setKejuruan(JSON.parse(storedMajors));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.semester || !formData.namaMapel || !formData.jenisMapel || !kejuruanId) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field yang diperlukan",
        variant: "destructive",
      });
      return;
    }

    // Save the new course to localStorage
    const existingCourses = JSON.parse(localStorage.getItem("courses") || "[]");
    const newCourse = {
      id: formData.id,
      name: formData.namaMapel,
      meetings: parseInt(formData.jumlahPertemuan) || 0,
      duration: parseInt(formData.durasi) || 0,
      semester: parseInt(formData.semester),
      group: formData.jenisMapel, // 'umum', 'khusus', 'pilihan'
      kejuruanId: kejuruanId, // 'dkv', 'tb', etc.
    };
    localStorage.setItem("courses", JSON.stringify([...existingCourses, newCourse]));

    toast({
      title: "Berhasil",
      description: "Mata pelajaran berhasil ditambahkan",
    });

    // Navigate back after submission
    // A short delay to allow the user to see the toast message
    setTimeout(() => navigate(-1), 1000);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-card rounded-lg p-6 shadow-[var(--shadow-card)]">
          <h1 className="text-3xl font-bold text-foreground">TAMBAH MATA PELAJARAN</h1>
        </div>

        {/* Form */}
        <div className="bg-card rounded-lg p-8 shadow-[var(--shadow-card)]">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* First Row: Semester, Jumlah Pertemuan, Durasi */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <Label htmlFor="semester" className="text-base font-semibold text-foreground">
                  Semester
                </Label>
                <Select value={formData.semester} onValueChange={(value) => setFormData({ ...formData, semester: value })}>
                  <SelectTrigger className="h-12 bg-muted border-0 text-base font-medium">
                    <SelectValue placeholder="Pilih Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Semester 1</SelectItem>
                    <SelectItem value="2">Semester 2</SelectItem>
                    <SelectItem value="3">Semester 3</SelectItem>
                    <SelectItem value="4">Semester 4</SelectItem>
                    <SelectItem value="5">Semester 5</SelectItem>
                    <SelectItem value="6">Semester 6</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="jumlahPertemuan" className="text-base font-semibold text-foreground">
                  Jumlah Pertemuan
                </Label>
                <Input id="jumlahPertemuan" type="number" value={formData.jumlahPertemuan} onChange={(e) => setFormData({ ...formData, jumlahPertemuan: e.target.value })} className="h-12 bg-muted border-0 text-base" placeholder="" />
              </div>

              <div className="space-y-3">
                <Label htmlFor="durasi" className="text-base font-semibold text-foreground">
                  Durasi
                </Label>
                <Input id="durasi" type="text" value={formData.durasi} onChange={(e) => setFormData({ ...formData, durasi: e.target.value })} className="h-12 bg-muted border-0 text-base" placeholder="" />
              </div>
            </div>

            {/* Second Row: Jenis Mata Pelajaran, Nama Mata Pelajaran */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="jenisMapel" className="text-base font-semibold text-foreground">
                  Jenis Mata Pelajaran
                </Label>
                <Select value={formData.jenisMapel} onValueChange={(value) => setFormData({ ...formData, jenisMapel: value })}>
                  <SelectTrigger className="h-12 bg-muted border-0 text-base font-medium">
                    <SelectValue placeholder="Pilih Jenis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="umum">Kelompok Umum</SelectItem>
                    <SelectItem value="khusus">Kelompok Khusus</SelectItem>
                    <SelectItem value="pilihan">Kelompok Pilihan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="namaMapel" className="text-base font-semibold text-foreground">
                  Nama Mata Pelajaran
                </Label>
                <Input id="namaMapel" type="text" value={formData.namaMapel} onChange={(e) => setFormData({ ...formData, namaMapel: e.target.value })} className="h-12 bg-muted border-0 text-base" placeholder="" />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button type="submit" variant="default" size="lg" className="px-12 text-base font-semibold">
                SIMPAN
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
