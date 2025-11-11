import Header from "@/components/Index/Header";
import Footer from "@/components/Index/Footer";
// import { Search } from "lucide-react";
import SearchCard from "@/components/dashboard_kesiswaan/SearchCard";
// import StudentProfile  from "@/components/dashboard_kesiswaan/StudentProfile"

const Students = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 px-6 md:px-8">
        <SearchCard />
      </main>
      <Footer />
    </div>
  );
};

export default Students;