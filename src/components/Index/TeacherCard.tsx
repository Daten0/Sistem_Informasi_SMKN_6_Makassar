import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Teacher } from "@/contexts/TeachersContext";
import { FiUsers, FiCheckCircle } from "react-icons/fi";
import { LuFileCheck } from "react-icons/lu";

interface TeacherCardProps {
  teacher: Teacher;
}

export const TeacherCard = ({ teacher }: TeacherCardProps) => {
  return (
    <Card className="rounded-3xl shadow-lg border-border/50 bg-card h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl w-full max-w-sm mx-auto">
      <div className="p-4">
        <div className="relative w-full h-80 rounded-2xl overflow-hidden">
          <img
            src={teacher.picture_url}
            alt={`${teacher.username}'s profile`}
            className="h-full w-full object-cover object-top transition-transform duration-300 ease-in-out hover:scale-105"
          />
        </div>
      </div>

      <div className="p-6 pt-2 text-center flex-grow flex flex-col justify-between">
        <div className="flex-grow">
          <div className="flex items-center justify-center space-x-2">
            <h3 className="text-2xl font-bold text-foreground">{teacher.username}</h3>
            {teacher.terdaftar && (
              <FiCheckCircle className="text-green-500 text-2xl" />
            )}
          </div>
          <p className="text-base text-muted-foreground mt-1">{teacher.jabatan}</p>
          <p className="text-base text-muted-foreground mt-1"><span className="font-semibold">Mata Pelajaran:</span> {teacher.mapel.join(", ")}</p>
        </div>

        {/* <div className="mt-6">
          <div className="flex justify-center items-center space-x-6 text-muted-foreground mb-6">
            <div className="flex items-center space-x-2">
              <FiUsers className="text-lg" />
              <span className="font-semibold text-foreground">312</span>
            </div>
            <div className="flex items-center space-x-2">
              <LuFileCheck className="text-lg" />
              <span className="font-semibold text-foreground">48</span>
            </div>
          </div>

          <Button className="w-full rounded-full bg-gray-100 text-gray-800 font-semibold hover:bg-gray-200 transition-colors text-base py-3">
            Follow +
          </Button>
        </div> */}
      </div>
    </Card>
  );
};


// export const TeacherCard = ({ teacher }: TeacherCardProps) => {
//   return (
//     <Card className="overflow-hidden shadow-card transition-shadow duration-300 hover:shadow-lg border-border/50 bg-card h-full flex flex-col">
//       <div className="relative w-full h-96 overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
//         <img
//           src={teacher.picture_url}
//           alt={`${teacher.username}'s profile`}
//           className="h-full w-full object-cover object-top transition-transform duration-300 ease-in-out hover:scale-105"
//         />
//         {teacher.terdaftar && (
//           <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground shadow-soft">
//             Terdaftar
//           </Badge>
//         )}
//       </div>
      
//       <div className="p-6 space-y-4 flex-grow">
//         <div className="space-y-2">
//           <h3 className="text-3xl font-bold text-foreground">{teacher.username}</h3>
//           <p className="text-base text-muted-foreground font-mono">NIP: {teacher.nip}</p>
//         </div>

//         <div className="grid grid-cols-1 gap-3 pt-2">
//           <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50 transition-smooth hover:bg-muted">
//             <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
//             <div className="flex-1">
//               <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Jabatan</p>
//               <p className="text-base font-medium text-card-foreground">{teacher.jabatan}</p>
//             </div>
//           </div>

//           <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50 transition-smooth hover:bg-muted">
//             <div className="w-2 h-2 rounded-full bg-accent mt-2"></div>
//             <div className="flex-1">
//               <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Mata Pelajaran</p>
//               <p className="text-base font-medium text-card-foreground">{teacher.mapel.join(", ")}</p>
//             </div>
//           </div>

//           <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50 transition-smooth hover:bg-muted">
//             <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
//             <div className="flex-1">
//               <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Program Keahlian</p>
//               <p className="text-base font-medium text-card-foreground">{teacher.kejuruan.join(", ")}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Card>
//   );
// };