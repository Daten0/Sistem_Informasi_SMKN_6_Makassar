import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface Employee {
  id: string;
  name: string;
  nip: string;
  department: string[];
  classes: string;
}

interface EmployeeTableProps {
  employees: Employee[];
  onViewDetail: (employee: Employee) => void;
}

export const EmployeeTable = ({ employees, onViewDetail }: EmployeeTableProps) => {
  return (
    <div className="w-full bg-white rounded-lg border border-border shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-table-header hover:bg-table-header">
            <TableHead className="font-semibold text-foreground">Nama</TableHead>
            <TableHead className="font-semibold text-foreground">NIP</TableHead>
            <TableHead className="font-semibold text-foreground">Kelas</TableHead>
            <TableHead className="font-semibold text-foreground text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow 
              key={employee.id} 
              className="bg-table-row hover:bg-table-row-hover transition-colors"
            >
              <TableCell className="font-medium">{employee.name}</TableCell>
              <TableCell className="text-muted-foreground">{employee.nip}</TableCell>
              <TableCell className="text-muted-foreground">{employee.classes}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetail(employee)}
                  className="text-purple hover:text-purple hover:bg-purple/10 font-medium"
                >
                  Lihat detail
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};