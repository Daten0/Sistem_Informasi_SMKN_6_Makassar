import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import StrukturImage from "../../assets/hasil rev.png";
import { Link } from "react-router-dom";

const ManagementSection = () => {
  const departments = [
    {
      name: "Desain Komunikasi Visual",
      link: "/dkv",
    },
    {
      name: "Tata Boga",
      link: "/kuliner"
    },
    {
      name: "Perhotelan",
      link: "/Perhotelan"
    },
    {
      name: "Akutansi",
      link: "/akutansi"
    },
    {
      name: "Tata Kecantikan",
      link: "/kecantikan"
    },
    {
      name: "Busana",
      link: "/busana"
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
          {/* <h3 className="text-2xl font-bold text-center mb-8">Struktur Organisasi</h3> */}
          <Dialog>
            <DialogTrigger asChild>
              <div className="cursor-zoom-in">
                <Card className="w-full overflow-hidden">
                  <CardContent className="p-0">
                    <img src={StrukturImage} alt="Struktur Organisasi" className="w-full h-auto object-cover" />
                  </CardContent>
                </Card>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-7xl p-0">
              <img src={StrukturImage} alt="Struktur Organisasi" className="w-full h-auto" />
            </DialogContent>
          </Dialog>
        </div>

        {/* Departments */}
        <div>
          <h3 className="text-2xl font-bold text-center mb-8">Program Keahlian</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept, index) => (
              <Link to={dept.link} key={index}>
                <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                  <CardContent className="p-6">
                    <h4 className="font-bold text-lg mb-2 text-school-blue">{dept.name}</h4>
                    {/* <p className="text-sm text-school-green font-semibold">{dept.link}</p> */}
                    {/* <p className="text-muted-foreground mb-2">
                      <span className="font-semibold">Ketua Program:</span> {dept.head}
                    </p>
                    <p className="text-sm text-school-green font-semibold">{dept.students}</p> */}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManagementSection;