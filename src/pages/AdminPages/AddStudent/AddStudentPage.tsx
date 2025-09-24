import TabNavigation from "@/components/Tambah_Siswa/TabNavigation";
import ParentForm from "@/components/Tambah_Siswa/ParentForm";
import StudentForm from "@/components/Tambah_Siswa/StudentForm";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminStudentsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"student" | "parent">("student");
  const [partialStudent, setPartialStudent] = useState<any | null>(null);
  const [parentData, setParentData] = useState<any | null>(null);

  const saveCombined = () => {
    if (!partialStudent) {
      alert("Please fill student data first.");
      setActiveTab("student");
      return;
    }
    if (!parentData) {
      alert("Please fill parent data before saving.");
      setActiveTab("parent");
      return;
    }

    const combined = {
      ...partialStudent,
      parentInfo: parentData,
      id: partialStudent.id || Math.random().toString(36).substr(2, 9),
    };

    // persist to localStorage
    const existing = JSON.parse(localStorage.getItem("students") || "[]");
    existing.push(combined);
    localStorage.setItem("students", JSON.stringify(existing));

    // reset
    setPartialStudent(null);
    setParentData(null);

    // navigate back to student display
    navigate("/admin/student-display");
  };

  const handleCancel = () => {
    // navigate back to the student display page
    navigate("/admin/student-display");
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Siswa</h1>

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-6 py-12">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mb-8">
          {activeTab === "student" ? (
            <StudentForm
              initialData={partialStudent}
              onSavePartial={(data: any) => {
                // store partial student and switch to parent tab
                const withId = { id: partialStudent?.id || Math.random().toString(36).substr(2, 9), ...data };
                setPartialStudent(withId);
                setActiveTab("parent");
              }}
            />
          ) : (
            <ParentForm initialData={parentData} onSave={(data: any) => setParentData(data)} />
          )}
        </div>

        <div className="flex justify-end gap-4">
          <button onClick={handleCancel} className="px-4 py-2 border rounded">Back</button>
          <button onClick={saveCombined} className="px-4 py-2 bg-primary text-white rounded">Save Student + Parent</button>
        </div>
      </div>
    </>
  );
};

export default AdminStudentsPage;
