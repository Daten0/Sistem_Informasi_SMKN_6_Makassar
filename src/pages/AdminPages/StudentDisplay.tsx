import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Pencil, Trash, UserPlus } from "lucide-react";

interface StudentData {
  id: string;
  fullName: string;
  nisn: string;
  gender: string;
  birthPlace: string;
  birthDate: string;
  religion: string;
  address: string;
  phoneNumber: string;
  email: string;
  kelas?: string;
  photo?: string;
  parentInfo:
    | {
        // shape may vary depending on how data was saved (localized keys), so allow any
      }
    | any;
}

const StudentDisplay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);

  useEffect(() => {
    // Load students from localStorage
    const stored = JSON.parse(localStorage.getItem("students") || "[]");
    setStudents(stored);

    // If a single student was passed via navigation state, add it (backwards compatible)
    if (location.state?.studentData) {
      const newStudent = { ...location.state.studentData, id: Math.random().toString(36).substr(2, 9) };
      const merged = [...stored, newStudent];
      setStudents(merged);
      localStorage.setItem("students", JSON.stringify(merged));
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleEdit = (student: StudentData) => {
    navigate("/admin/AddStudents", { state: { editingStudent: student } });
  };

  const handleDelete = (studentId: string) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      const next = students.filter((s) => s.id !== studentId);
      setStudents(next);
      localStorage.setItem("students", JSON.stringify(next));
    }
  };

  const handleAddNew = () => {
    navigate("/admin/AddStudents");
  };

  const filteredStudents = students.filter((student) => student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || student.nisn.includes(searchQuery));

  const resolveParentInfo = (student: any) => {
    if (!student) return {};
    let p = student.parentInfo ?? student.parent ?? null;
    if (!p) return {};
    // If parent info is wrapped again (from ParentForm which returned { parentInfo: { ... } })
    if (p.parentInfo) return p.parentInfo;
    return p;
  };

  const getStudentField = (student: any, engKey: string, indoKey: string) => {
    if (!student) return "-";
    return student[engKey] ?? student[indoKey] ?? "-";
  };

  const getParentField = (student: any, engKey: string, indoKey: string) => {
    const p = resolveParentInfo(student);
    return p[engKey] ?? p[indoKey] ?? "-";
  };

  return (
    <div className="w-full">
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-0 pb-4">
          <CardTitle className="text-xl sm:text-2xl font-bold text-black dark:text-white">List Siswa</CardTitle>
          <Button onClick={handleAddNew} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
            <UserPlus className="w-4 h-4 mr-2" />
            Tambah Siswa
          </Button>
        </CardHeader>
        <CardContent className="px-0">
          <div className="mb-4">
            <Input 
              placeholder="Cari berdasarkan Nama atau NISN..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="max-w-sm bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder:text-gray-500" 
            />
          </div>

          <div className="rounded-md border border-gray-200 dark:border-gray-800 overflow-x-auto bg-white dark:bg-transparent">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-900/50">
                  <TableHead className="text-gray-600 dark:text-gray-400">NIS</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400">Nama</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 hidden md:table-cell">Kelas</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 hidden md:table-cell">Jenis Kelamin</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 hidden sm:table-cell">No Telepon</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id} className="border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <TableCell className="font-medium text-gray-900 dark:text-white">{student.nisn}</TableCell>
                    <TableCell className="text-gray-900 dark:text-white">{student.fullName}</TableCell>
                    <TableCell className="hidden md:table-cell text-gray-900 dark:text-white">{student.kelas || "-"}</TableCell>
                    <TableCell className="hidden md:table-cell text-gray-900 dark:text-white">{student.gender}</TableCell>
                    <TableCell className="hidden sm:table-cell text-gray-900 dark:text-white">{student.phoneNumber}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedStudent(student)} className="h-8" title="View details">
                          Lihat
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEdit(student)} className="h-8 w-8 p-0" title="Edit student">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(student.id)} className="h-8 w-8 p-0 text-destructive hover:text-destructive" title="Delete student">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredStudents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-gray-500 dark:text-gray-400">
                      Siswa tidak ditemukan. Klik "Tambah Siswa" untuk menambahkan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {selectedStudent && (
        <div className="mt-6">
          <Card className="border-gray-800 bg-gray-900/50">
            <CardHeader className="border-b border-gray-800">
              <CardTitle className="text-lg sm:text-xl text-white">Detail Siswa: {getStudentField(selectedStudent, "fullName", "nama") || selectedStudent.fullName}</CardTitle>
            </CardHeader>
            <CardContent>
              <h4 className="font-semibold text-lg text-white mb-3">Informasi Siswa</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2 mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center border border-gray-700">
                    {selectedStudent.photo ? (
                      // photo stored as data URL
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={selectedStudent.photo} alt={`${selectedStudent.fullName} photo`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-sm text-muted-foreground">No photo</div>
                    )}
                  </div>
                </div>

                <div>
                  <p>
                    <strong>NIS:</strong> {getStudentField(selectedStudent, "nisn", "nisn")}
                  </p>
                  <p>
                    <strong>Nama:</strong> {getStudentField(selectedStudent, "fullName", "nama")}
                  </p>
                  <p>
                    <strong>Kelas:</strong> {getStudentField(selectedStudent, "kelas", "kelas")}
                  </p>
                  <p>
                    <strong>Jenis Kelamin:</strong> {getStudentField(selectedStudent, "gender", "jenisKelamin")}
                  </p>
                  <p>
                    <strong>Telepon:</strong> {getStudentField(selectedStudent, "phoneNumber", "telepon") || getStudentField(selectedStudent, "phoneNumber", "noTelepon")}
                  </p>
                  <p>
                    <strong>Email:</strong> {getStudentField(selectedStudent, "email", "email")}
                  </p>
                </div>
              </div>

              <h4 className="font-semibold text-lg text-white mb-3 mt-6">Informasi Orang Tua</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                <div>
                  <p>
                    <strong>Nama Ayah:</strong> {getParentField(selectedStudent, "fatherName", "namaAyah")}
                  </p>
                  <p>
                    <strong>Pekerjaan Ayah:</strong> {getParentField(selectedStudent, "fatherOccupation", "pekerjaanAyah")}
                  </p>
                  <p>
                    <strong>Telepon Ayah:</strong> {getParentField(selectedStudent, "fatherPhone", "teleponAyah")}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Nama Ibu:</strong> {getParentField(selectedStudent, "motherName", "namaIbu")}
                  </p>
                  <p>
                    <strong>Pekerjaan Ibu:</strong> {getParentField(selectedStudent, "motherOccupation", "pekerjaanIbu")}
                  </p>
                  <p>
                    <strong>Telepon Ibu:</strong> {getParentField(selectedStudent, "motherPhone", "teleponIbu")}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button onClick={() => setSelectedStudent(null)} className="px-4">
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StudentDisplay;
