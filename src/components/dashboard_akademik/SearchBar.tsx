import { Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ value, onChange, placeholder = "cari di sini" }: SearchBarProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto mb-12">
      <div className="relative flex items-center gap-4 bg-card rounded-lg shadow-md px-6 py-4 transition-all hover:shadow-lg">
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 border-0 bg-transparent text-lg focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
        />
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-muted rounded-md transition-colors">
            <Search className="w-6 h-6 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};