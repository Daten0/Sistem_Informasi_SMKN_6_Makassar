import { useState } from "react";
import { SearchBar } from "@/components/dashboard_akademik/SearchBar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Header from "@/components/Index/Header";
import Footer from "@/components/Index/Footer";

interface Course {
  id: number;
  name: string;
  meetings: number;
  duration: number;
}

const coursesData: { category: string; courses: Course[] }[] = [
  {
    category: "A. Kelompok Umum",
    courses: [
      { id: 1, name: "Matematika", meetings: 16, duration: 80},
      { id: 2, name: "Bahasa Indonesia", meetings: 14, duration: 70},
      { id: 3, name: "Bahasa Inggris", meetings: 12, duration: 60},
      { id: 4, name: "Pendidikan Pancasila", meetings: 10, duration: 50},
    ],
  },
  {
    category: "B. Kelompok Kejuruan",
    courses: [
      { id: 5, name: "Perawatan Kulit Wajah", meetings: 18, duration: 90},
      { id: 6, name: "Tata Rias Wajah", meetings: 16, duration: 80},
      { id: 7, name: "Perawatan Rambut", meetings: 14, duration: 70},
    ],
  },
];

const CourseDetailTKC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = coursesData.map((category) => ({
    ...category,
    courses: category.courses.filter((course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.courses.length > 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="cari di sini"
          />

          <div className="bg-card rounded-lg shadow-md overflow-hidden mt-8">
            {filteredData.map((category, idx) => (
              <div key={idx} className="mb-8 last:mb-0">
                <h2 className="text-xl font-bold px-6 py-4 bg-muted/30">
                  {category.category}
                </h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20 text-center font-bold text-foreground">No</TableHead>
                      <TableHead className="font-bold text-foreground">Mata Pembelajaran</TableHead>
                      <TableHead className="text-center font-bold text-foreground">Jumlah Pertemuan</TableHead>
                      <TableHead className="text-center font-bold text-foreground">Durasi Waktu</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {category.courses.map((course, index) => (
                      <TableRow key={course.id} className="hover:bg-muted/50">
                        <TableCell className="text-center font-medium">{index + 1}.</TableCell>
                        <TableCell className="font-medium">{course.name}</TableCell>
                        <TableCell className="text-center">{course.meetings}</TableCell>
                        <TableCell className="text-center">{course.duration}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CourseDetailTKC;