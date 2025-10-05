import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DepartmentFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const departments = [
  { value: "all", label: "Semua Jurusan" },
  { value: "dkv", label: "Desain Komunikasi Visual (DKV)" },
  { value: "tb", label: "Tata Busana (TB)" },
  { value: "tkc", label: "Tata Kecantikan (TKC)" },
  { value: "ak", label: "Akuntansi (AK)" },
  { value: "bg", label: "Tata Boga (BG)" },
  { value: "ph", label: "Perhotelan (PH)" },
];

export const DepartmentFilter = ({ value, onChange }: DepartmentFilterProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[280px] h-12 bg-white border-border rounded-lg shadow-sm">
        <SelectValue placeholder="Pilih Jurusan" />
      </SelectTrigger>
      <SelectContent className="bg-popover border-border shadow-lg rounded-lg">
        {departments.map((dept) => (
          <SelectItem 
            key={dept.value} 
            value={dept.value}
            className="hover:bg-accent focus:bg-accent"
          >
            {dept.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};