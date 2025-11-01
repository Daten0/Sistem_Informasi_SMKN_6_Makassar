import { useState } from "react";
import { Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SearchCard = () => {
  const [searchType, setSearchType] = useState("siswa");

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="bg-card rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row items-stretch">
          {/* Label Section */}
          <div className="flex items-center justify-center bg-card border-b md:border-b-0 md:border-r border-border p-4 md:min-w-[220px]">
            <Select onValueChange={setSearchType} defaultValue={searchType}>
              <SelectTrigger className="h-14 text-2xl md:text-3xl font-bold border-0 focus:ring-0">
                <SelectValue placeholder="Pilih" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="siswa" className="text-lg">Siswa</SelectItem>
                <SelectItem value="alumni" className="text-lg">Alumni</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Search Section */}
          <div className="flex-1 flex items-center gap-3 px-6 py-5 md:px-8 md:py-6">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder={`Cari ${searchType === 'siswa' ? 'Siswa' : 'Alumni'} Di Sini`}
                className="w-full h-12 pl-4 pr-12 text-base md:text-lg border-0 bg-secondary/30 focus:bg-secondary/50 transition-colors"
              />
            </div>
            <Button 
              size="icon"
              className="h-12 w-12 shrink-0 bg-muted hover:bg-muted/80 text-muted-foreground"
              aria-label="Search"
            >

              <Search className="h-6 w-6" />
            </Button>
            
          </div>
        </div>
      </div>
      
      {/* Registration Prompt */}
      {searchType === "alumni" && (
        <div className="mt-6 text-center">
          <p className="text-base md:text-lg text-foreground">
            Belum Terdaftar Sebagai Alumni?{" "}
            <a
              href="#register"
              className="text-primary hover:text-primary/80 font-semibold transition-colors underline-offset-4 hover:underline"
            >
              Daftar Sekarang
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchCard;