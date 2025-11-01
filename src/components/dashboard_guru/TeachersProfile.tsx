import { Card } from "@/components/ui/card";

const TeachersProfile = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Profile Photo */}
      <div className="flex justify-center mb-12">
        <div className="bg-card p-6 rounded-lg shadow-lg">
          <div className="w-64 h-80 bg-muted rounded-sm overflow-hidden">
            <img 
              src="/placeholder.svg" 
              alt="Student Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Detail Siswa Card */}
      <Card className="bg-card shadow-lg">
        <div className="p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Detail Guru
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8 max-w-4xl mx-auto">
            {/* Left Column */}
            <div className="space-y-8">
              <div>
                <p className="text-lg text-muted-foreground mb-1">NIP</p>
                <p className="text-2xl font-bold text-foreground">0057473221</p>
              </div>

              <div>
                <p className="text-lg text-muted-foreground mb-1">Jabatan</p>
                <p className="text-2xl font-bold text-foreground">Kepala Bengkel IT</p>
              </div>

              <div>
                <p className="text-lg text-muted-foreground mb-1">Tempat Lahir</p>
                <p className="text-2xl font-bold text-foreground">Makassar</p>
              </div>

              <div>
                <p className="text-lg text-muted-foreground mb-1">Agama</p>
                <p className="text-2xl font-bold text-foreground">Islam</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <div>
                <p className="text-lg text-muted-foreground mb-1">Nama Siswa</p>
                <p className="text-2xl font-bold text-foreground">Muh Agung M</p>
              </div>

              <div>
                <p className="text-lg text-muted-foreground mb-1">Kelas Mengajar</p>
                <p className="text-2xl font-bold text-foreground">Kelas X</p>
              </div>

              <div>
                <p className="text-lg text-muted-foreground mb-1">Tanggal Lahir</p>
                <p className="text-2xl font-bold text-foreground">16 Agustus 2006</p>
              </div>

              <div>
                <p className="text-lg text-muted-foreground mb-1">Alamat</p>
                <p className="text-2xl font-bold text-foreground">Bumi Tamarunang indah Blok A.6</p>
              </div>

              <div>
                <p className="text-lg text-muted-foreground mb-1">Mata Pelajaran</p>
                <p className="text-2xl font-bold text-foreground">Desain Komunikasi Visual</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TeachersProfile;