import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

interface Course {
  semester: number;
  id: number;
  name: string;
  meetings: number;
  duration: number;
  group: string; // 'umum', 'khusus', 'pilihan'
  majorId: string; // 'dkv', 'tb', etc.
}

const SemesterDetails = () => {
  const { majorId } = useParams<{ majorId: string }>();
  const navigate = useNavigate();
  const semesterNum = 3; // This is SemesterDetail3

  const [courses, setCourses] = useState<Course[]>([]);

  const handleDelete = (id: number, name: string) => {
    const allCourses = JSON.parse(localStorage.getItem("courses") || "[]");
    const updatedCourses = allCourses.filter((c: Course) => c.id !== id);
    localStorage.setItem("courses", JSON.stringify(updatedCourses));
    setCourses(updatedCourses.filter((course: Course) => course.majorId === majorId && course.semester === semesterNum));
    toast.success(`${name} telah dihapus`);
  };

  // Map internal group names to display names
  const groupDisplayNames: Record<string, string> = {
    umum: "A. Kelompok Umum",
    khusus: "B. Kelompok Khusus",
    pilihan: "C. Kelompok Pilihan",
  };

  // Group courses by their group
  const groupedCourses = courses.reduce((acc, course) => {
    const groupName = groupDisplayNames[course.group] || "Lainnya";
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    acc[groupName].push(course);
    return acc;
  }, {} as Record<string, Course[]>);

  const majorName = majorId ? majorId.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) : "Jurusan";

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate("/admin/kejuruan")} className="gap-2 hover:bg-secondary">
          <ArrowLeft className="h-5 w-5" />
          Kembali
        </Button>

        {/* Courses Table */}
        <Card className="bg-card border-none shadow-[var(--shadow-card)] overflow-hidden">
          <div className="p-6 flex justify-end">
            <Button onClick={() => navigate(`/admin/kejuruan/${majorId}/add-course`)} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Mata Pelajaran
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="text-foreground font-bold text-base w-20">No</TableHead>
                  <TableHead className="text-foreground font-bold text-base">Mata Pembelajaran</TableHead>
                  <TableHead className="text-foreground font-bold text-base text-center">Jumlah Pertemuan</TableHead>
                  <TableHead className="text-foreground font-bold text-base text-center">Durasi Waktu</TableHead>
                  <TableHead className="text-foreground font-bold text-base text-center w-32">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(groupedCourses).map(([groupName, groupCourses]) => (
                  <>
                    {/* Group Header Row */}
                    <TableRow key={groupName} className="bg-muted/30 hover:bg-muted/30">
                      <TableCell colSpan={6} className="font-bold text-foreground py-4">
                        {groupName}
                      </TableCell>
                    </TableRow>
                    {/* Course Rows */}
                    {groupCourses.map((course, index) => (
                      <TableRow key={course.id} className="hover:bg-muted/20">
                        <TableCell className="font-medium">{index + 1}.</TableCell>
                        <TableCell className="font-medium">{course.name}</TableCell>
                        <TableCell className="text-center">{course.meetings}</TableCell>
                        <TableCell className="text-center">{course.duration}</TableCell>
                        <TableCell className="text-center">
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(course.id, course.name)} className="text-destructive hover:text-destructive hover:bg-destructive/10 font-bold">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ))}
                {courses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      Tidak ada mata pelajaran tersedia
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SemesterDetails;
