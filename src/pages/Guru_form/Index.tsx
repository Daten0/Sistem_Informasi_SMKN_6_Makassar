import { TeacherForm } from "@/components/Index/Guru_form/TeacherForm";
import { GraduationCap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top duration-700">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <GraduationCap className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Form Pendaftaran Guru
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Lengkapi data diri guru dengan informasi yang akurat
          </p>
        </div>

        <div className="bg-card shadow-lg rounded-lg p-6 sm:p-8 animate-in fade-in slide-in-from-bottom duration-700">
          <TeacherForm />
        </div>

        <footer className="text-center mt-8 text-sm text-muted-foreground">
          <p>© 2025 Sistem Informasi Pendidikan</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;