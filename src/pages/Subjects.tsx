import Header from "@/components/Index/Header";
import Footer from "@/components/Index/Footer";
import SearchBarAkademik from "@/components/dashboard_akademik/SearchBarAkademik";
import { ProgramCard } from "@/components/dashboard_akademik/ProgramCard";

import { useNavigate } from "react-router-dom";

const programs = [
  { id: 1, title: "Desain Komunikasi Visual" },
  { id: 2, title: "Tata Boga" },
  { id: 3, title: "Perhotelan" },
  { id: 4, title: "Akutansi" },
  { id: 5, title: "Tata Kecantikan" },
  { id: 6, title: "Tata Busana" },
];


const Subjects = () => {
  const navigate = useNavigate();

  const filteredPrograms = programs; // Placeholder for future search functionality

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 px-6 md:px-8">
        <SearchBarAkademik />

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => (
            <ProgramCard
              key={program.id}
              title={program.title}
              onClick={() => {
                switch (program.title) {
                  case "Desain Komunikasi Visual":
                    navigate("/subjects/dkv");
                    break;
                  case "Perhotelan":
                    navigate("/subjects/ph");
                    break;
                  case "Akutansi":
                    navigate("/subjects/ak");
                    break;
                  case "Tata Boga":
                    navigate("/subjects/bg");
                    break;
                  case "Tata Busana":
                    navigate("/subjects/bs");
                    break;
                  case "Tata Kecantikan":
                    navigate("/subjects/tkc");
                    break;
                }
              }}
            />
          ))}

        {filteredPrograms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Tidak ada program yang ditemukan
            </p>
          </div>
        )}
        </div>

        
      </main>
      <Footer />
    </div>
  );
};

export default Subjects;