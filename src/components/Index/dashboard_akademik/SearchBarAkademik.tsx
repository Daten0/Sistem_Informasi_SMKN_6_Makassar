import { Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SearchBarAkademik = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="bg-card rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row items-stretch">
          {/* Label Section */}
          <div className="flex items-center justify-center bg-card border-b md:border-b-0 md:border-r border-border px-8 py-6 md:py-0 md:min-w-[200px]">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Mata Pelajaran
            </h2>
          </div>
          
          {/* Search Section */}
          <div className="flex-1 flex items-center gap-3 px-6 py-5 md:px-8 md:py-6">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Cari Di Sini"
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
    </div>
  );
};

export default SearchBarAkademik;