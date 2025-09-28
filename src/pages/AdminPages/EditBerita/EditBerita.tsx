import Header from "@/components/Admin/Header";
import Sidebar from "@/components/Admin/Sidebar";
import Edit_Berita from "@/components/Berita/Edit_Berita/Edit_Berita";


const EditBerita = () => {
  return (
    // <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
    //   <Sidebar />
    //   <div className="flex-1 flex flex-col">
    //     <Header />
    //     <main className="flex-1 p-6">
    //       <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Learning Materials</h1>
    //       {/* Learning Materials content goes here */}
    //     </main>
    //   </div>
    // </div>
    <>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Berita</h1>
      <Edit_Berita />
    </>
    // Learning Materials content goes here
  );
};

export default EditBerita;