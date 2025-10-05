import { useState } from 'react'
import { EmployeeTable, type Employee } from '../../components/tambah_guru/EmployeeTable'
import { SearchBar } from '../../components/tambah_guru/SearchBar'
import PersonalInfo from '../../components/tambah_guru/PersonalInfo'
import ProfileSection from '../../components/tambah_guru/ProfileSection'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../../components/ui/sheet'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { UsersRound, School, X } from 'lucide-react'

const AdminTeachersPage = () => {
  // State management
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTeacher, setSelectedTeacher] = useState<Employee | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Stats data - can be replaced with actual counts
  const stats = [
    { icon: UsersRound, label: 'Total Guru', value: '45' },
    { icon: School, label: 'Kelas', value: '24' },
  ]

  // Mock data for demonstration - replace with actual data fetch
  const teachers: Employee[] = [
    {
      id: '1',
      name: 'John Doe',
      nip: '123456',
      department: ['dkv'],
      classes: '10A, 11B'
    },
    {
      id: '2',
      name: 'Jane Smith',
      nip: '789012',
      department: ['ak'],
      classes: '12A'
    }
  ]

  // Filter teachers based on search
  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.nip.includes(searchQuery)
  )

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Manajemen Guru</h1>
        <p className="text-muted-foreground mt-2 ">
          Kelola data guru dan informasi pengajar di SMKN 6 Makassar
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 flex items-center space-x-4 hover:shadow-md transition-shadow">
            <div className="p-3 bg-primary/10 rounded-lg">
              <stat.icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          </Card>
        ))}
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
                      <TableHead className="font-semibold text-foreground">Kelas</TableHead>
                      <TableHead className="text-right font-semibold text-foreground">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeachers.map((teacher) => (
                      <TableRow 
                        key={teacher.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <TableCell className="font-medium text-foreground">{teacher.name}</TableCell>
                        <TableCell className="text-foreground">{teacher.nip}</TableCell>
                        <TableCell className="text-foreground">{teacher.classes}</TableCell>
                        <TableCell className="text-right">
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
                              <div className="px-6 py-4 space-y-8">
                                <div className="bg-card rounded-lg p-6 border border-border">
                                  <h3 className="text-xl font-semibold mb-6 text-foreground border-b border-border pb-3">
                                    Profil Guru
                                  </h3>
                                  <div className="text-foreground">
                                    <ProfileSection />
                                  </div>
                                </div>
                                <div className="bg-card rounded-lg p-6 border border-border">
                                  <h3 className="text-xl font-semibold mb-6 text-foreground border-b border-border pb-3">
                                    Informasi Personal
                                  </h3>
                                  <div className="text-foreground">
                                    <PersonalInfo />
                                  </div>
                                </div>
                              </div>
                            </SheetContent>
                          </Sheet>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                <p className="text-2xl font-bold text-foreground">{filteredTeachers.length}</p>
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