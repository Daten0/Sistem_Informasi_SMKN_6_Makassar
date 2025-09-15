import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Users, GraduationCap, Building } from "lucide-react";

const ManagementSection = () => {
  const leadership = [
    {
      name: "Drs. Ahmad Sutrisno, M.Pd",
      position: "Kepala Sekolah",
      description: "Memimpin sekolah dengan visi mewujudkan pendidikan kejuruan berkualitas",
      icon: User,
      color: "school-blue"
    },
    {
      name: "Dra. Siti Nurhalimah, M.Pd",
      position: "Wakil Kepala Sekolah Kurikulum",
      description: "Mengawasi dan mengembangkan kurikulum sesuai standar industri",
      icon: GraduationCap,
      color: "school-green"
    },
    {
      name: "Ir. Muhammad Yusuf, M.T",
      position: "Wakil Kepala Sekolah Sarana Prasarana",
      description: "Mengelola dan mengembangkan fasilitas pendukung pembelajaran",
      icon: Building,
      color: "school-purple"
    },
    {
      name: "Drs. Andi Mappaseng, M.M",
      position: "Wakil Kepala Sekolah Humas",
      description: "Membangun kerjasama dengan dunia usaha dan industri",
      icon: Users,
      color: "school-yellow"
    }
  ];

  const departments = [
    {
      name: "Teknik Komputer dan Jaringan",
      head: "Rahmat Hidayat, S.T",
      students: "180 siswa"
    },
    {
      name: "Teknik Kendaraan Ringan",
      head: "Muhammad Saleh, S.Pd",
      students: "160 siswa"
    },
    {
      name: "Teknik Elektronika Industri",
      head: "Nurhayati, S.T",
      students: "140 siswa"
    },
    {
      name: "Administrasi Perkantoran",
      head: "Siti Aminah, S.Pd",
      students: "200 siswa"
    },
    {
      name: "Akuntansi dan Keuangan",
      head: "Ahmad Fauzi, S.E",
      students: "220 siswa"
    },
    {
      name: "Tata Boga",
      head: "Fatimah, S.Pd",
      students: "120 siswa"
    }
  ];

  return (
    <section id="management" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Struktur <span className="text-school-purple">Organisasi</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tim manajemen yang berpengalaman dan kompeten dalam memimpin pendidikan kejuruan.
          </p>
        </div>

        {/* Leadership Team */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Tim Kepemimpinan</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {leadership.map((leader, index) => {
              const Icon = leader.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className={`mx-auto w-16 h-16 bg-school-${leader.color} rounded-full flex items-center justify-center mb-4`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-lg">{leader.name}</CardTitle>
                    <p className={`text-school-${leader.color} font-semibold`}>
                      {leader.position}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{leader.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Departments */}
        <div>
          <h3 className="text-2xl font-bold text-center mb-8">Program Keahlian</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <h4 className="font-bold text-lg mb-2 text-school-blue">{dept.name}</h4>
                  <p className="text-muted-foreground mb-2">
                    <span className="font-semibold">Ketua Program:</span> {dept.head}
                  </p>
                  <p className="text-sm text-school-green font-semibold">{dept.students}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManagementSection;