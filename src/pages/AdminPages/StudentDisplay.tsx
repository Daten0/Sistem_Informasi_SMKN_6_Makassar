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
  parentInfo: {
    // shape may vary depending on how data was saved (localized keys), so allow any
  } | any;
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

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Student List</CardTitle>
          <Button onClick={handleAddNew} className="bg-primary hover:bg-primary/90">
            <UserPlus className="w-4 h-4 mr-2" />
            Add New Student
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input placeholder="Search by name or NISN..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="max-w-sm" />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NISN</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Jenis Kelamin</TableHead>
                  <TableHead>No Hnadphone</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.nisn}</TableCell>
                    <TableCell>{student.fullName}</TableCell>
                    <TableCell>{student.kelas || "-"}</TableCell>
                    <TableCell>{student.gender}</TableCell>
                    <TableCell>{student.phoneNumber}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedStudent(student)} className="h-8" title="View details">
                          View
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
                    <TableCell colSpan={6} className="text-center py-4">
                      No students found. Click "Add New Student" to add one.
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
          <Card>
            <CardHeader>
              <CardTitle>Detail Siswa: {selectedStudent.fullName}</CardTitle>
            </CardHeader>
            <CardContent>
              <h4 className="font-semibold">Informasi Orang Tua</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <p><strong>Nama Ayah:</strong> {selectedStudent.parentInfo?.fatherName || selectedStudent.parentInfo?.namaAyah || '-'}</p>
                  <p><strong>Pekerjaan Ayah:</strong> {selectedStudent.parentInfo?.fatherOccupation || selectedStudent.parentInfo?.pekerjaanAyah || '-'}</p>
                  <p><strong>Telepon Ayah:</strong> {selectedStudent.parentInfo?.fatherPhone || selectedStudent.parentInfo?.teleponAyah || '-'}</p>
                </div>
                <div>
                  <p><strong>Nama Ibu:</strong> {selectedStudent.parentInfo?.motherName || selectedStudent.parentInfo?.namaIbu || '-'}</p>
                  <p><strong>Pekerjaan Ibu:</strong> {selectedStudent.parentInfo?.motherOccupation || selectedStudent.parentInfo?.pekerjaanIbu || '-'}</p>
                  <p><strong>Telepon Ibu:</strong> {selectedStudent.parentInfo?.motherPhone || selectedStudent.parentInfo?.teleponIbu || '-'}</p>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button onClick={() => setSelectedStudent(null)} className="px-4">Close</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StudentDisplay;
