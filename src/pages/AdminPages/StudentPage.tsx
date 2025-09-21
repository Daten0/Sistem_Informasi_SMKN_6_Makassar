// import Header from "@/components/Admin/Header";
// import Sidebar from "@/components/Admin/Sidebar";
import TabNavigation from "@/components/Tambah_Siswa/TabNavigation";
import ParentForm from "@/components/Tambah_Siswa/ParentForm";
import StudentForm from "@/components/Tambah_Siswa/StudentForm";
import { useState } from "react";

const AdminStudentsPage = () => {
  const [activeTab, setActiveTab] = useState<"student" | "parent">("student");
  return (
    // <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
    //   <Sidebar />
    //   <div className="flex-1 flex flex-col">
    //     <Header />
    //     <main className="flex-1 p-6">
    //       <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Students</h1>
    //       {/* Students content goes here */}
    //     </main>
    //   </div>
    // </div>
    <>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Siswa</h1>

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-6 py-12">
        <TabNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        
        <div className="mb-8">
          {activeTab === "student" ? (
            <StudentForm />
          ) : (
            <ParentForm />
          )}
        </div>
      </div>
    </>
    // Students content goes here
  );
};

export default AdminStudentsPage;