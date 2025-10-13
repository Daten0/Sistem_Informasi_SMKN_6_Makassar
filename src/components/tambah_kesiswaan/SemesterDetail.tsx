import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

interface Course {
  id: number;
  name: string;
  meetings: number;
  duration: number;
  semester: number;
  group: string;
}

const SemesterDetails = () => {
  const { semesterNum } = useParams();
  const navigate = useNavigate();

  // Sample data - replace with actual data
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 1,
      name: "Matematika",
      meetings: 16,
      duration: 80,
      semester: 1,
      group: "A. Kelompok Umum",
    },
  ]);

  const handleDelete = (id: number, name: string) => {
    setCourses(courses.filter((c) => c.id !== id));
    toast.success(`${name} telah dihapus`);
  };

  // Group courses by their group
  const groupedCourses = courses.reduce((acc, course) => {
    if (!acc[course.group]) {
      acc[course.group] = [];
    }
    acc[course.group].push(course);
    return acc;
  }, {} as Record<string, Course[]>);

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/materials")}
          className="gap-2 hover:bg-secondary"
        >
          <ArrowLeft className="h-5 w-5" />
          Kembali
        </Button>

        {/* Page Header */}
        <Card className="bg-card border-none shadow-[var(--shadow-card)]">
          <div className="p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground text-center">
              Semester {semesterNum}
            </h1>
          </div>
        </Card>

        {/* Courses Table */}
        <Card className="bg-card border-none shadow-[var(--shadow-card)] overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="text-foreground font-bold text-base w-20">
                    No
                  </TableHead>
                  <TableHead className="text-foreground font-bold text-base">
                    Mata Pembelajaran
                  </TableHead>
                  <TableHead className="text-foreground font-bold text-base text-center">
                    Jumlah Pertemuan
                  </TableHead>
                  <TableHead className="text-foreground font-bold text-base text-center">
                    Durasi Waktu
                  </TableHead>
                  <TableHead className="text-foreground font-bold text-base text-center">
                    Semester
                  </TableHead>
                  <TableHead className="text-foreground font-bold text-base text-center w-32">
                    Action
                  </TableHead>
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
                          Semester {course.semester}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(course.id, course.name)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 font-bold"
                          >
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
                    <TableCell
                      colSpan={6}
                      className="text-center py-12 text-muted-foreground"
                    >
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