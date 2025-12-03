import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Palette, 
  UtensilsCrossed, 
  Hotel, 
  Calculator, 
  Sparkles, 
  Scissors 
} from "lucide-react";

const departments = [
  {
    id: "dkv",
    name: "Desain Komunikasi Visual",
    shortName: "DKV",
    icon: Palette,
    description: "Pelajari seni desain grafis, branding, dan multimedia untuk industri kreatif.",
    color: "from-violet-500 to-purple-600",
    students: 150,
    link: "/dkv"
  },
  {
    id: "culinary",
    name: "Tata Boga",
    shortName: "Kuliner",
    icon: UtensilsCrossed,
    description: "Kuasai teknik memasak profesional dan manajemen dapur modern.",
    color: "from-orange-500 to-red-500",
    students: 120,
    link: "/kuliner"
  },
  {
    id: "hospitality",
    name: "Perhotelan",
    shortName: "Hotel",
    icon: Hotel,
    description: "Siapkan karir di industri hospitality dan manajemen hotel internasional.",
    color: "from-blue-500 to-cyan-500",
    students: 100,
    link: "/Perhotelan"
  },
  {
    id: "accounting",
    name: "Akuntansi",
    shortName: "Akuntansi",
    icon: Calculator,
    description: "Pelajari pembukuan, perpajakan, dan manajemen keuangan bisnis.",
    color: "from-emerald-500 to-teal-500",
    students: 130,
    link: "/akutansi"
  },
  {
    id: "beauty",
    name: "Tata Kecantikan",
    shortName: "Kecantikan",
    icon: Sparkles,
    description: "Kuasai teknik makeup, perawatan kulit, dan tren kecantikan terkini.",
    color: "from-pink-500 to-rose-500",
    students: 90,
    link: "/kecantikan"
  },
  {
    id: "fashion",
    name: "Tata Busana",
    shortName: "Fashion",
    icon: Scissors,
    description: "Pelajari desain fashion, pola, dan produksi busana profesional.",
    color: "from-amber-500 to-yellow-500",
    students: 85,
    link: "/busana"
  },
];

const Departments = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-background" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <Link to="/" className="text-primary hover:underline text-sm mb-6 inline-block">
            ← Kembali ke Beranda
          </Link>
          
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
              Program <span className="text-primary">Keahlian</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Silahkan Pilih Jurusan yang Kamu Cari di SMK Negeri 6 Makassar.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap justify-center gap-8 mb-16">
            {[
              { value: "6", label: "Program Keahlian" },
              { value: "675+", label: "Total Siswa" },
              { value: "50+", label: "Guru Profesional" },
              { value: "95%", label: "Tingkat Kelulusan" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <Link key={dept.id} to={dept.link}>
                <Card className="group h-full border-0 shadow-lg bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                  {/* Gradient Header */}
                  <div className={`h-2 bg-gradient-to-r ${dept.color}`} />
                  
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${dept.color} text-white shadow-lg`}>
                        <dept.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {dept.name}
                        </h3>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">
                          {dept.shortName}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {dept.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">{dept.students}</span> siswa aktif
                      </span>
                      <span className="text-primary text-sm font-medium group-hover:translate-x-1 transition-transform">
                        Lihat Detail →
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Siap Memulai Perjalananmu?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Daftarkan dirimu sekarang dan jadilah bagian dari generasi profesional 
            masa depan Indonesia.
          </p>
          <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg">
            Daftar Sekarang
          </button>
        </div>
      </section> */}
    </div>
  );
};

export default Departments;