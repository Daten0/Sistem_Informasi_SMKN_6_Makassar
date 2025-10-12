import { BookOpen, Users, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const quickAccessItems = [
  {
    icon: BookOpen,
    title: "Akademik",
    description: "Jelajahi kurikulum dan materi pembelajaran kami yang komprehensif",
    href: "/subjects",
    color: "text-blue-600"
  },
  {
    icon: GraduationCap,
    title: "Kesiswaan",
    description: "Informasi siswa, prestasi, dan kemajuan akademik",
    href: "/students", 
    color: "text-green-600"
  },
  {
    icon: Users,
    title: "Guru",
    description: "Temui staf pengajar kami yang berkualifikasi dan keahlian mereka",
    href: "/teachers",
    color: "text-purple-600"
  }
];

const QuickAccess = () => {
  return (
    <section className="py-16 px-6 md:px-8 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
          Akses Cepat
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {quickAccessItems.map((item, index) => (
            <Card 
              key={index}
              className="group hover:shadow-elegant transition-all duration-300 cursor-pointer hover:-translate-y-2 bg-card border-border"
              onClick={() => window.location.href = item.href}
            >
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-card-foreground mb-3">
                  {item.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
                
                <div className="mt-6">
                  <span className="text-primary font-semibold group-hover:underline">
                    Learn More →
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickAccess;