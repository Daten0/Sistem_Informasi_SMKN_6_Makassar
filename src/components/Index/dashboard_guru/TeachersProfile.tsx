import { Card } from "@/components/ui/card";
import { Teacher } from "@/contexts/TeachersContext";

interface TeachersProfileProps {
  teacher: Teacher;
}

const TeachersProfile = ({ teacher }: TeachersProfileProps) => {
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatArray = (array: string[] | null | undefined) => {
    if (!array || array.length === 0) return "-";
    return array.join(", ");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Profile Photo */}
      <div className="flex justify-center mb-12">
        <div className="bg-card p-6 rounded-lg shadow-lg">
          <div className="w-64 h-80 bg-muted rounded-sm overflow-hidden">
            <img 
              src={teacher.picture_url || "/placeholder.svg"} 
              alt={`${teacher.username} Profile`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
            />
          </div>
        </div>
      </div>

      {/* Detail Guru Card */}
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
                <p className="text-2xl font-bold text-foreground">{teacher.nip}</p>
              </div>

              <div>
                <p className="text-lg text-muted-foreground mb-1">Jabatan</p>
                <p className="text-2xl font-bold text-foreground">{teacher.jabatan || "-"}</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <div>
                <p className="text-lg text-muted-foreground mb-1">Nama Guru</p>
                <p className="text-2xl font-bold text-foreground">{teacher.username}</p>
              </div>

              <div>
                <p className="text-lg text-muted-foreground mb-1">Mata Pelajaran</p>
                <p className="text-2xl font-bold text-foreground">{formatArray(teacher.mapel)}</p>
              </div>

              <div>
                <p className="text-lg text-muted-foreground mb-1">Kejuruan</p>
                <p className="text-2xl font-bold text-foreground">{formatArray(teacher.kejuruan)}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TeachersProfile;