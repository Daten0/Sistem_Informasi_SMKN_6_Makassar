import { Card, CardContent } from "@/components/ui/card";

const HistorySection = () => {
  const milestones = [
    {
      year: "1985",
      title: "Pendirian Sekolah",
      description: "SMK Negeri 6 Makassar didirikan sebagai sekolah menengah kejuruan dengan 3 program keahlian utama.",
      color: "school-yellow"
    },
    {
      year: "1990",
      title: "Akreditasi Pertama",
      description: "Memperoleh akreditasi B dan mulai mengembangkan fasilitas laboratorium dan workshop.",
      color: "school-blue"
    },
    {
      year: "2000",
      title: "Ekspansi Program",
      description: "Menambah 5 program keahlian baru sesuai dengan kebutuhan industri lokal dan nasional.",
      color: "school-green"
    },
    {
      year: "2010",
      title: "Sertifikasi ISO",
      description: "Memperoleh sertifikasi ISO 9001:2008 sebagai pengakuan atas sistem manajemen mutu.",
      color: "school-purple"
    },
    {
      year: "2015",
      title: "Akreditasi A",
      description: "Berhasil meraih akreditasi A dari Badan Akreditasi Nasional Sekolah/Madrasah.",
      color: "school-yellow"
    },
    {
      year: "2020",
      title: "Era Digital",
      description: "Transformasi digital dengan pembelajaran online dan modernisasi seluruh fasilitas.",
      color: "school-blue"
    }
  ];

  return (
    <section id="history" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sejarah <span className="text-school-green">Sekolah</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Perjalanan panjang SMK Negeri 6 Makassar dalam membangun pendidikan kejuruan berkualitas.
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-0.5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-school-yellow via-school-blue via-school-green to-school-purple"></div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                {/* Year badge */}
                <div className={`absolute left-0 md:left-1/2 md:transform md:-translate-x-1/2 w-8 h-8 bg-school-${milestone.color} rounded-full flex items-center justify-center text-white font-bold text-sm z-10`}>
                  {index + 1}
                </div>

                {/* Content */}
                <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                  <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className={`inline-block px-3 py-1 bg-school-${milestone.color} text-white text-sm font-semibold rounded-full mb-3`}>
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistorySection;