import { Card } from "@/components/ui/card";

interface SemesterCardProps {
  semesterNumber: number;
  kejuruanId: string;
  onClick?: () => void;
}

export const SemesterCard = ({ semesterNumber, kejuruanId, onClick }: SemesterCardProps) => {
  return (
    <Card 
      className="bg-secondary border-none shadow-[var(--shadow-card)] transition-all hover:shadow-lg cursor-pointer"
      onClick={onClick}
    >
      <div className="p-6">
        <h3 className="text-xl font-bold text-foreground text-center">
          SEMESTER {semesterNumber}
        </h3>
      </div>
    </Card>
  );
};