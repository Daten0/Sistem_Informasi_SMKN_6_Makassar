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
    fatherName: string;
    fatherOccupation: string;
    fatherPhone: string;
    motherName: string;
    motherOccupation: string;
    motherPhone: string;
  };
}

const StudentDisplay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // If we receive a new student from the form, add it to our list
    if (location.state?.studentData) {
      const newStudent = {
        ...location.state.studentData,
        id: Math.random().toString(36).substr(2, 9), // Generate a random ID
      };
      setStudents((prev) => [...prev, newStudent]);
      // Clear the location state to prevent duplicate additions
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleEdit = (student: StudentData) => {
    navigate("/admin/AddStudents", { state: { editingStudent: student } });
  };

  const handleDelete = (studentId: string) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      setStudents((prev) => prev.filter((s) => s.id !== studentId));
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
                  <TableHead>Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Actions</TableHead>
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
    </div>
  );
};

export default StudentDisplay;
