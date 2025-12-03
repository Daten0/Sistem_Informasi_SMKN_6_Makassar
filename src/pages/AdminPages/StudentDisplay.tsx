import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Pencil, Trash } from "lucide-react";
import supabase from "@/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Kejuruan {
  id: string;
  nama_jurusan: string;
}

interface Kelas {
  id: string;
  nama_kelas: string;
  level_kelas: string;
  id_kejuruan: string;
}

interface StudentData {
  id: string;
  fullName: string;
  nis: string;
  gender: string;
  birthPlace: string;
  birthDate: string;
  religion: string;
  address: string;
  phoneNumber: string;
  terdaftar: boolean;
  kejuruan: string;
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
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [kejuruans, setKejuruans] = useState<Kejuruan[]>([]);
  const [selectedKejuruan, setSelectedKejuruan] = useState<string | null>(null);
  const [kelas, setKelas] = useState<Kelas[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedKelas, setSelectedKelas] = useState<string | null>(null);
  const itemsPerPage = 8;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedKejuruan, selectedLevel, selectedKelas]);

  useEffect(() => {
    const fetchStudents = async () => {
      const { data: studentData, error } = await supabase.from("add_siswa")
        .select(`
          id,
          nama_lengkap,
          nis,
          jenis_kelamin,
          tempat_lahir,
          tanggal_lahir,
          agama,
          alamat_lengkap,
          nomor_telepon,
          terdaftar,
          kejuruan,
          kelas,
          foto_siswa,
          data_ortu (*)
        `);

      if (error) {
        console.error("Error fetching students:", error);
        return;
      }

      const formattedStudents = studentData.map((student) => ({
        id: student.id,
        fullName: student.nama_lengkap,
        nis: student.nis,
        gender: student.jenis_kelamin,
        birthPlace: student.tempat_lahir,
        birthDate: student.tanggal_lahir,
        religion: student.agama,
        address: student.alamat_lengkap,
        phoneNumber: student.nomor_telepon,
        terdaftar: student.terdaftar,
        kejuruan: student.kejuruan,
        kelas: student.kelas,
        photo: student.foto_siswa,
        parentInfo: student.data_ortu[0] || {},
      }));

      setStudents(formattedStudents);
    };

    const fetchKejuruans = async () => {
      const { data, error } = await supabase
        .from("kejuruan")
        .select("id, nama_jurusan");
      if (error) {
        console.error("Error fetching kejuruans:", error);
      } else {
        setKejuruans(data || []);
      }
    };

    const fetchKelas = async () => {
      const { data, error } = await supabase.from("kelas").select("*");
      if (error) {
        console.error("Error fetching kelas:", error);
      } else {
        setKelas(data || []);
      }
    };

    fetchStudents();
    fetchKejuruans();
    fetchKelas();
  }, []);

  const handleEdit = (student: StudentData) => {
    navigate(`/admin/student-display/Edit_student/${student.id}`, {
      state: { editingStudent: student },
    });
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearchQuery =
      student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(student.nis).includes(searchQuery);
    const matchesKejuruan = selectedKejuruan
      ? student.kejuruan === selectedKejuruan
      : true;
    const studentKelas = kelas.find((k) => k.nama_kelas === student.kelas);
    const matchesLevel = selectedLevel
      ? studentKelas?.level_kelas === selectedLevel
      : true;
    const matchesKelas = selectedKelas ? student.kelas === selectedKelas : true;
    return (
      matchesSearchQuery && matchesKejuruan && matchesLevel && matchesKelas
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleDelete = async (studentId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this student? This will also delete associated parent data."
      )
    ) {
      // First, delete the parent data from 'data_ortu'
      const { error: parentError } = await supabase
        .from("data_ortu")
        .delete()
        .eq("student_id", studentId);

      if (parentError) {
        console.error("Error deleting parent data:", parentError);
        // Stop the process if parent data deletion fails.
        return;
      }

      // Then, delete the student from 'add_siswa'
      const { error: studentError } = await supabase
        .from("add_siswa")
        .delete()
        .eq("id", studentId);

      if (studentError) {
        console.error("Error deleting student:", studentError);
      } else {
        setStudents(students.filter((s) => s.id !== studentId));
      }
    }
  };

  const resolveParentInfo = (student: any) => {
    if (!student) return {};
    let p = student.parentInfo ?? student.parent ?? null;
    if (!p) return {};
    // If parent info is wrapped again (from ParentForm which returned { parentInfo: { ... } })
    if (p.parentInfo) return p.parentInfo;
    return p;
  };

  // const getParentField = (student: any, engKey: string, indoKey: string) => {
  //   const p = resolveParentInfo(student);
  //   return p[engKey] ?? p[indoKey] ?? "-";
  // };

  return (
    <div className="w-full">
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-0 pb-4">
          <CardTitle className="text-xl sm:text-2xl font-bold text-black dark:text-white">
            List Siswa
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="flex justify-between items-center mb-4">
            <Input
              placeholder="Cari berdasarkan Nama atau NIS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder:text-gray-500"
            />
            <div className="flex gap-2">
              <Button
                variant={!selectedKejuruan ? "default" : "outline"}
                onClick={() => {
                  setSelectedKejuruan(null);
                  setSelectedLevel(null);
                  setSelectedKelas(null);
                }}
              >
                Semua
              </Button>
              {kejuruans.map((kejuruan) => (
                <Button
                  key={kejuruan.id}
                  variant={
                    selectedKejuruan === kejuruan.nama_jurusan
                      ? "default"
                      : "outline"
                  }
                  onClick={() => {
                    setSelectedKejuruan(kejuruan.nama_jurusan);
                    setSelectedLevel(null);
                    setSelectedKelas(null);
                  }}
                >
                  {kejuruan.nama_jurusan}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex gap-4 mb-4">
            <Select
              onValueChange={(value) =>
                setSelectedLevel(value === "all" ? null : value)
              }
              value={selectedLevel || "all"}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Pilih Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Level</SelectItem>
                <SelectItem value="X">X</SelectItem>
                <SelectItem value="XI">XI</SelectItem>
                <SelectItem value="XII">XII</SelectItem>
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) =>
                setSelectedKelas(value === "all" ? null : value)
              }
              value={selectedKelas || "all"}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Pilih Kelas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kelas</SelectItem>
                {kelas
                  .filter((k) => {
                    const kejuruanId = kejuruans.find(
                      (kj) => kj.nama_jurusan === selectedKejuruan
                    )?.id;
                    if (selectedKejuruan && selectedLevel) {
                      return (
                        k.id_kejuruan === kejuruanId &&
                        k.level_kelas === selectedLevel
                      );
                    }
                    if (selectedKejuruan) {
                      return k.id_kejuruan === kejuruanId;
                    }
                    if (selectedLevel) {
                      return k.level_kelas === selectedLevel;
                    }
                    return true;
                  })
                  .map((k) => (
                    <SelectItem key={k.id} value={k.nama_kelas}>
                      {k.nama_kelas}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border border-gray-200 dark:border-gray-800 overflow-x-auto bg-white dark:bg-transparent">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-900/50">
                  <TableHead className="text-gray-600 dark:text-gray-400">
                    NIS
                  </TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400">
                    Nama
                  </TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 hidden md:table-cell">
                    Jenis Kelamin
                  </TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 hidden sm:table-cell">
                    No Telepon
                  </TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 hidden md:table-cell">
                    Kelas
                  </TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 hidden sm:table-cell">
                    Kejuruan
                  </TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 hidden sm:table-cell">
                    Terdaftar
                  </TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedStudents.map((student) => (
                  <TableRow
                    key={student.id}
                    className="border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <TableCell className="font-medium text-gray-900 dark:text-white">
                      {student.nis}
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-white">
                      {student.fullName}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-gray-900 dark:text-white">
                      {student.gender}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-gray-900 dark:text-white">
                      {student.phoneNumber}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-gray-900 dark:text-white">
                      {student.kelas || "-"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-gray-900 dark:text-white">
                      {student.kejuruan || "-"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-gray-900 dark:text-white">
                      {student.terdaftar ? "Terdaftar" : "Tidak Terdaftar"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedStudent(student)}
                          className="h-8"
                          title="View details"
                        >
                          Lihat
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(student)}
                          className="h-8 w-8 p-0"
                          title="Edit student"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(student.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          title="Delete student"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredStudents.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-4 text-gray-500 dark:text-gray-400"
                    >
                      Siswa tidak ditemukan. Klik "Tambah Siswa" untuk
                      menambahkan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      {selectedStudent && (
        <div className="mt-6">
          <Card className="border-gray-800 bg-gray-900/50">
            <CardHeader className="border-b border-gray-800">
              <CardTitle className="text-lg sm:text-xl text-white">
                Detail Siswa: {selectedStudent.fullName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h4 className="font-semibold text-lg text-white mb-3">
                Informasi Siswa
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2 mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center border border-gray-700">
                    {selectedStudent.photo ? (
                      <img
                        src={selectedStudent.photo}
                        alt={`${selectedStudent.fullName} photo`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        No photo
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <p>
                    <strong>NIS:</strong> {selectedStudent.nis}
                  </p>
                  <p>
                    <strong>Nama:</strong> {selectedStudent.fullName}
                  </p>
                  <p>
                    <strong>Jenis Kelamin:</strong> {selectedStudent.gender}
                  </p>
                  <p>
                    <strong>Telepon:</strong> {selectedStudent.phoneNumber}
                  </p>
                  <p>
                    <strong>Kelas:</strong> {selectedStudent.kelas}
                  </p>
                  <p>
                    <strong>Kejuruan:</strong> {selectedStudent.kejuruan}
                  </p>
                  <p>
                    <strong>Status Terdaftar:</strong>{" "}
                    {selectedStudent.terdaftar
                      ? "Terdaftar"
                      : "Tidak Terdaftar"}
                  </p>
                </div>
              </div>

              <h4 className="font-semibold text-lg text-white mb-3 mt-6">
                Informasi Orang Tua
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                <div>
                  <p>
                    <strong>Nama Ayah:</strong>{" "}
                    {selectedStudent.parentInfo.nama_lengkap_ayah || "-"}
                  </p>
                  <p>
                    <strong>Pekerjaan Ayah:</strong>{" "}
                    {selectedStudent.parentInfo.pekerjaan_ayah || "-"}
                  </p>
                  <p>
                    <strong>Telepon Ayah:</strong>{" "}
                    {selectedStudent.parentInfo.nomor_telepon_ayah || "-"}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Nama Ibu:</strong>{" "}
                    {selectedStudent.parentInfo.nama_lengkap_ibu || "-"}
                  </p>
                  <p>
                    <strong>Pekerjaan Ibu:</strong>{" "}
                    {selectedStudent.parentInfo.pekerjaan_ibu || "-"}
                  </p>
                  <p>
                    <strong>Telepon Ibu:</strong>{" "}
                    {selectedStudent.parentInfo.nomor_telepon_ibu || "-"}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={() => setSelectedStudent(null)}
                  className="px-4"
                >
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
