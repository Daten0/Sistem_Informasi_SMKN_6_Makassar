import Header from "@/components/Index/Header";
import Footer from "@/components/Index/Footer";
import SearchBarGuru from "@/components/dashboard_guru/SearchBarGuru";

const Teachers = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 px-6 md:px-8">
        <SearchBarGuru />
      </main>
      <Footer />
    </div>
  );
};

export default Teachers;