import { useState } from 'react'
import { SearchBar } from '../../components/tambah_guru/SearchBar'
import PersonalInfo from '../../components/tambah_guru/PersonalInfo'
import ProfileSection from '../../components/tambah_guru/ProfileSection'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../../components/ui/sheet'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { UsersRound, Plus } from 'lucide-react';
import { Pencil, Trash} from "lucide-react";
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useTeachers } from '@/contexts/TeachersContext';
import { Teacher } from '@/contexts/TeachersContext';
import TeachersProfile from '@/components/Index/dashboard_guru/TeachersProfile';

const AdminTeachersPage = () => {

  // interface Employee {
  //   id: string;
  //   name: string;
  //   nip: string;
  //   department: string[];
  //   subjects: string[];
  // }
  // interface EmployeeTableProps {
  //   employees: Employee[];
  //   onViewDetail: (employee: Employee) => void;
  // }
  // State management
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { teachers, deleteTeacher, loading } = useTeachers();
  const navigate = useNavigate();

//  // Mock data for demonstration - replace with actual data fetch
//   const [teachers, setTeachers] = useState<Employee[]>([
//     {
//       id: '1',
//       name: 'John Doe',
//       nip: '123456',
//       department: ['dkv'],
//       subjects: ['Dasar Kejuruan DKV']
//     },
//     {
//       id: '2',
//       name: 'Jane Smith',
//       nip: '789012',
//       department: ['ak'],
//       subjects: ['Matematika']
//     }
//   ])


  const handleEdit = (teacher: Teacher) => {
    navigate(`/admin/teachers/edit/${teacher.id}`);
  };

  const handleDelete = (teacherId: string) => {
    deleteTeacher(teacherId);
  };

  // Filter teachers based on search
  const filteredTeachers = teachers.filter(teacher => 
    teacher.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.nip.includes(searchQuery)
  );

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const paginatedTeachers = filteredTeachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Manajemen Guru</h1>
        <p className="text-muted-foreground mt-2 ">
          Kelola data guru dan informasi pengajar di SMKN 6 Makassar
        </p>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left section: Search, Filter, and Table */}
        <div className="lg:col-span-2">
          <Card className="p-6 mb-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block text-muted-foreground">
                  Pencarian
                </label>
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Cari nama atau NIP..."
                />
              </div>
              <Button onClick={() => navigate("/admin/teachers/add-teacher")}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Guru
              </Button>
            </div>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <div className="border-b border-border px-6 py-4">
              <h2 className="text-lg font-semibold text-foreground">Daftar Guru</h2>
              <p className="text-sm text-muted-foreground">
                {filteredTeachers.length} guru ditampilkan
              </p>
            </div>
            <div className="p-4">
              <div className="rounded-lg border border-border">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-muted/50">
                      <TableHead className="font-semibold text-foreground">Nama</TableHead>
                      <TableHead className="font-semibold text-foreground">NIP</TableHead>
                      <TableHead className="font-semibold text-foreground">Jabatan</TableHead>
                      <TableHead className="text-right font-semibold text-foreground">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTeachers.map((teacher) => (
                      <TableRow 
                        key={teacher.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <TableCell className="font-medium text-foreground">{teacher.username}</TableCell>
                        <TableCell className="text-foreground">{teacher.nip}</TableCell>
                        <TableCell className="text-foreground">{teacher.jabatan}</TableCell>
                        <TableCell className="text-right">
                           <div className="flex items-center justify-end gap-2">
                            <Sheet 
                              open={isDetailsOpen && selectedTeacher?.id === teacher.id}
                              onOpenChange={(open) => {
                                if (!open) {
                                  setIsDetailsOpen(false)
                                  setSelectedTeacher(null)
                                }
                              }}
                            >
                              <SheetTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedTeacher(teacher)
                                    setIsDetailsOpen(true)
                                  }}
                                  className="text-primary hover:text-primary hover:bg-primary/10"
                                >
                                  Lihat Detail
                                </Button>
                              </SheetTrigger>
                              <SheetContent className="w-full sm:max-w-[680px] lg:max-w-[800px] p-0 overflow-y-auto">
                                <SheetHeader className="border-b border-border p-6">
                                  <SheetTitle className="text-2xl font-bold text-foreground">Detail Guru</SheetTitle>
                                </SheetHeader>
                                {selectedTeacher && (
                                  <TeachersProfile teacher={selectedTeacher} />
                                )}
                              </SheetContent>
                            </Sheet>
                            <Button variant="outline" size="sm" onClick={() => handleEdit(teacher)} className="h-8 w-8 p-0" title="Edit guru">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDelete(teacher.id)} className="h-8 w-8 p-0 text-destructive hover:text-destructive" title="Hapus guru">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-muted-foreground">
                    Halaman {currentPage} dari {totalPages}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      Sebelumnya
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                    >
                      Selanjutnya
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right section for stats or other info */}
        <div className="lg:col-span-1">
          <Card className="p-8 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4">
              <UsersRound className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Statistik Guru</h3>
            <div className="space-y-4 mt-6">
              <div className="text-left p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Total Guru Aktif</p>
                <p className="text-2xl font-bold text-foreground">{teachers.length}</p>
              </div>
              <div className="text-left p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Jurusan</p>
                <p className="text-2xl font-bold text-foreground">6</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminTeachersPage