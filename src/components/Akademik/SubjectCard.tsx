import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import React from "react";

interface SubjectCardProps {
  abbreviation: string;
  fullName: string;
  onEdit?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
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
      </div>
    </Card>
  );
};
