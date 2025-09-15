import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Globe } from "lucide-react";

const ProfileSection = () => {
  const profileData = [
    {
      icon: MapPin,
      title: "Alamat",
      content: "Jl. Pendidikan No. 123, Makassar, Sulawesi Selatan 90231"
    },
    {
      icon: Phone,
      title: "Telepon",
      content: "+62 411 123456"
    },
    {
      icon: Mail,
      title: "Email",
      content: "info@smkn6makassar.sch.id"
    },
    {
      icon: Globe,
      title: "Website",
      content: "www.smkn6makassar.sch.id"
    }
  ];

  const achievements = [
    { number: "1200+", label: "Siswa Aktif" },
    { number: "95%", label: "Tingkat Kelulusan" },
    { number: "85%", label: "Lulusan Bekerja" },
    { number: "15+", label: "Program Keahlian" }
  ];

  return (
    <section id="profile" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Profil <span className="text-school-blue">Sekolah</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            SMK Negeri 6 Makassar adalah sekolah menengah kejuruan yang berkomitmen 
            menghasilkan lulusan berkualitas dan siap kerja.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-school-green">Visi & Misi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-school-blue mb-2">Visi</h4>
                <p className="text-muted-foreground">
                  Menjadi sekolah menengah kejuruan unggul yang menghasilkan 
                  lulusan berkarakter, kompeten, dan berdaya saing global.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-school-blue mb-2">Misi</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Menyelenggarakan pendidikan kejuruan berkualitas</li>
                  <li>• Mengembangkan karakter siswa yang berakhlak mulia</li>
                  <li>• Membangun kemitraan dengan dunia usaha dan industri</li>
                  <li>• Menghasilkan lulusan yang siap kerja dan wirausaha</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {profileData.map((item, index) => {
              const Icon = item.icon;
              return (
                <Card key={index} className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-hero rounded-lg">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-muted-foreground">{item.content}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {achievements.map((item, index) => (
            <Card key={index} className="text-center p-6">
              <div className="text-2xl md:text-3xl font-bold text-school-blue mb-2">
                {item.number}
              </div>
              <div className="text-sm text-muted-foreground">{item.label}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;