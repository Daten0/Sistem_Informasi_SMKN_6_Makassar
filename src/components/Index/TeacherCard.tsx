import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Teacher } from "@/contexts/TeachersContext";

interface TeacherCardProps {
  teacher: Teacher;
}

export const TeacherCard = ({ teacher }: TeacherCardProps) => {
  return (
    <Card className="overflow-hidden shadow-card transition-smooth hover:shadow-lg border-border/50 bg-card h-full">
      <div className="relative h-100 w-full overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
        <img
          src={teacher.picture_url}
          alt={`${teacher.username}'s profile`}
          className="overflow h-85 w-full object-cover transition-smooth hover:scale-105"
        />
        {teacher.terdaftar && (
          <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground shadow-soft">
            Terdaftar
          </Badge>
        )}
      </div>
      
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-foreground">{teacher.username}</h3>
          <p className="text-sm text-muted-foreground font-mono">NIP: {teacher.nip}</p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50 transition-smooth hover:bg-muted">
            <div className="w-2 h-2 rounded-full bg-primary mt-1.5"></div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Jabatan</p>
              <p className="text-sm font-medium text-card-foreground">{teacher.jabatan}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50 transition-smooth hover:bg-muted">
            <div className="w-2 h-2 rounded-full bg-accent mt-1.5"></div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Mata Pelajaran</p>
              <p className="text-sm font-medium text-card-foreground">{teacher.mapel.join(", ")}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50 transition-smooth hover:bg-muted">
            <div className="w-2 h-2 rounded-full bg-primary mt-1.5"></div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Program Keahlian</p>
              <p className="text-sm font-medium text-card-foreground">{teacher.kejuruan.join(", ")}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};