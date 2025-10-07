import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SubjectCardProps {
  abbreviation: string;
  fullName: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const SubjectCard = ({
  abbreviation,
  fullName,
  onEdit,
  onDelete,
}: SubjectCardProps) => {
  return (
    <Card className="p-6 transition-all hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-3xl font-bold text-foreground mb-2">
            {abbreviation}
          </h3>
          <p className="text-base text-muted-foreground">{fullName}</p>
        </div>
        <div className="flex gap-2 ml-4">
          <Button
            size="icon"
            onClick={onEdit}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            onClick={onDelete}
            className="bg-destructive hover:bg-destructive/90"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
