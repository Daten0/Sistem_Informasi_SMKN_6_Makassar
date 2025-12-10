import { Card, CardContent } from "@/components/ui/card";
import {
  Hotel,
  MonitorDot,
  House,
  IceCreamBowl,
  Briefcase,
} from "lucide-react";
import { Link } from "react-router-dom";

const PHProfile = () => {
  const facilities = [
    {
      icon: MonitorDot,
      name: "Front Office",
      desc: "Meja resepsionis yang dilengkapi dengan papan kunci dan rak surat (folio rack)",
    },
    {
      icon: House,
      name: "Housekeeping",
      desc: "Satu atau dua unit kamar simulasi yang didesain menyerupai kamar hotel standar (termasuk kamar mandi) untuk latihan membuat tempat tidur (making bed), membersihkan kamar, dan penataan amenitas.",
    },
    {
      icon: IceCreamBowl,
      name: "Food & Beverage - F&B",
      desc: "Ruangan makan yang ditata seperti restoran sungguhan, lengkap dengan meja, kursi, dan peralatan makan (cutlery, chinaware, glassware) untuk latihan table set-up dan pelayanan (seperti Russian Service atau American Service).",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-background py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <Link
            to="/"
            className="text-primary hover:underline text-sm mb-4 inline-block"
          >
            ← Kembali ke Jurusan
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-primary/10 rounded-2xl">
              <Hotel className="w-12 h-12 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Perhotelan
              </h1>
              <p className="text-muted-foreground text-lg mt-2">
                Jurusan Perhotelan - SMK Negeri 6 Makassar
              </p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Program keahlian yang mempersiapkan siswa menjadi tenaga profesional
            di bidang industri hospitality. Pembelajaran berfokus pada layanan
            prima (service excellence), manajemen tata graha (housekeeping),
            layanan makanan dan minuman (food & beverage service), serta
            operasional kantor depan (front office), guna menciptakan lulusan
            yang kompeten, beretika, dan siap bersaing di dunia perhotelan dan
            pariwisata.
          </p>
        </div>
      </section>

      {/* Prospek Kerja */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Prospek Kerja
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg bg-card hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    Kompetensi Utama yang Didapatkan
                  </h3>
                </div>
                <ul className="text-muted-foreground space-y-2">
                  {[
                    "Manajemen Kantor Depan (Front Office)",
                    "Tata Graha (Housekeeping)",
                    "Layanan Makanan & Minuman (F&B Service)",
                    "Manajemen Acara (Event Management)",
                    "Hubungan Tamu (Guest Relations)",
                  ].map((item, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="text-primary">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-card hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Lingkup Pekerjaan
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Hotel Bintang, Resort, Apartemen, Kapal Pesiar, Maskapai
                  Penerbangan, Event Organizer, Biro Perjalanan
                </p> <br></br>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Profesi dan Karir
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Front Office Agent, Concierge, Housekeeper, Butler, Food &
                  Beverage Server, Event Coordinator, Manajer Hotel
                </p>
              </CardContent>
            </Card>
            {/* <Card className="border-0 shadow-lg bg-card hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                
              </CardContent>
            </Card> */}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Fasilitas Unggulan
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {facilities.map((facility, idx) => (
              <Card
                key={idx}
                className="border-0 shadow-md bg-card hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <CardContent className="p-6 text-center">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                    <facility.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {facility.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {facility.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PHProfile;
