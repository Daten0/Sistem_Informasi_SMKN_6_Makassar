import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Pencil, Trash, UserPlus, QrCode, Printer } from "lucide-react";
import * as QRCode from "qrcode.react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import supabase from "@/supabase";

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
  kehadiran: boolean;
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
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [qrCodeValue, setQrCodeValue] = useState<string>("");

  useEffect(() => {
    const fetchStudents = async () => {
      const { data: studentData, error } = await supabase.from("add_siswa").select(`
          id,
          nama_lengkap,
          nis,
          jenis_kelamin,
          tempat_lahir,
          tanggal_lahir,
          agama,
          alamat_lengkap,
          nomor_telepon,
          kehadiran,
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
        kehadiran: student.kehadiran,
        kejuruan: student.kejuruan,
        kelas: student.kelas,
        photo: student.foto_siswa,
        parentInfo: student.data_ortu[0] || {},
      }));

      setStudents(formattedStudents);
    };

    fetchStudents();
  }, []);

  const handleEdit = (student: StudentData) => {
    navigate("/admin/AddStudents", { state: { editingStudent: student } });
  };

  const handleDelete = async (studentId: string) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      const { error } = await supabase.from("add_siswa").delete().eq("id", studentId);

      if (error) {
        console.error("Error deleting student:", error);
      } else {
        setStudents(students.filter((s) => s.id !== studentId));
      }
    }
  };

  const handleAddNew = () => {
    navigate("/admin/AddStudents");
  };

  const filteredStudents = students.filter((student) => student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || student.nis.includes(searchQuery));

  const handlePrint = () => {
    const qrCodeElement = document.getElementById("qr-code-to-print");
    if (qrCodeElement) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write("<html><head><title>Print QR Code</title>");
        printWindow.document.write("<style>@media print { body { display: flex; justify-content: center; align-items: center; height: 100%; } }</style>");
        printWindow.document.write("</head><body>");
        printWindow.document.write(qrCodeElement.innerHTML);
        printWindow.document.write("</body></html>");
        printWindow.document.close();
        printWindow.print();
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

  const getParentField = (student: any, engKey: string, indoKey: string) => {
    const p = resolveParentInfo(student);
    return p[engKey] ?? p[indoKey] ?? "-";
  };

  return (
    <div className="w-full">
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-0 pb-4">
          <CardTitle className="text-xl sm:text-2xl font-bold text-black dark:text-white">List Siswa</CardTitle>
          <div className="flex gap-2">
            <Button onClick={handleAddNew} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
              <UserPlus className="w-4 h-4 mr-2" />
              Tambah Siswa
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <QrCode className="w-4 h-4 mr-2" />
                  Generate QR
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Scan to Add Student</DialogTitle>
                </DialogHeader>
                <div className="flex justify-center py-4" id="qr-code-to-print">
                  <QRCode.QRCodeSVG value={`${window.location.origin}/admin/AddStudents`} size={256} />
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
        </CardHeader>
        <CardContent className="px-0">
          <div className="mb-4">
            <Input 
              placeholder="Cari berdasarkan Nama atau NIS..." 
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
                  <TableHead className="text-gray-600 dark:text-gray-400 hidden md:table-cell">Jenis Kelamin</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 hidden sm:table-cell">No Telepon</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 hidden md:table-cell">Kelas</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 hidden sm:table-cell">Kejuruan</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400 hidden sm:table-cell">Kehadiran</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id} className="border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <TableCell className="font-medium text-gray-900 dark:text-white">{student.nis}</TableCell>
                    <TableCell className="text-gray-900 dark:text-white">{student.fullName}</TableCell>
                    <TableCell className="hidden md:table-cell text-gray-900 dark:text-white">{student.gender}</TableCell>
                    <TableCell className="hidden sm:table-cell text-gray-900 dark:text-white">{student.phoneNumber}</TableCell>
                    <TableCell className="hidden md:table-cell text-gray-900 dark:text-white">{student.kelas || "-"}</TableCell>
                    <TableCell className="hidden md:table-cell text-gray-900 dark:text-white">{student.kejuruan || "-"}</TableCell>
                    <TableCell className="hidden md:table-cell text-gray-900 dark:text-white">{student.kehadiran ? "Hadir" : "Tidak Hadir"}</TableCell>
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
              <CardTitle className="text-lg sm:text-xl text-white">Detail Siswa: {selectedStudent.fullName}</CardTitle>
            </CardHeader>
            <CardContent>
              <h4 className="font-semibold text-lg text-white mb-3">Informasi Siswa</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2 mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center border border-gray-700">
                    {selectedStudent.photo ? (
                      <img src={selectedStudent.photo} alt={`${selectedStudent.fullName} photo`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-sm text-muted-foreground">No photo</div>
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
                    <strong>Status Kehadiran:</strong> {selectedStudent.kehadiran ? "Hadir" : "Tidak Hadir"}
                  </p>
                </div>
              </div>

              <h4 className="font-semibold text-lg text-white mb-3 mt-6">Informasi Orang Tua</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                <div>
                  <p>
                    <strong>Nama Ayah:</strong> {selectedStudent.parentInfo.nama_lengkap_ayah || "-"}
                  </p>
                  <p>
                    <strong>Pekerjaan Ayah:</strong> {selectedStudent.parentInfo.pekerjaan_ayah || "-"}
                  </p>
                  <p>
                    <strong>Telepon Ayah:</strong> {selectedStudent.parentInfo.nomor_telepon_ayah || "-"}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Nama Ibu:</strong> {selectedStudent.parentInfo.nama_lengkap_ibu || "-"}
                  </p>
                  <p>
                    <strong>Pekerjaan Ibu:</strong> {selectedStudent.parentInfo.pekerjaan_ibu || "-"}
                  </p>
                  <p>
                    <strong>Telepon Ibu:</strong> {selectedStudent.parentInfo.nomor_telepon_ibu || "-"}
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
