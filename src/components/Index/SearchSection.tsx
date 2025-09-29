import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SearchSection = () => {
  const [searchType, setSearchType] = useState("Berita Terkini");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log(`Searching for ${searchType}: ${searchQuery}`);
      // Here you would implement the actual search functionality
    }
  };

  return (
    <section className="py-16 px-6 md:px-8 bg-gradient-primary">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
          Cari Berita Terkini
        </h2>
        
        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 shadow-elegant">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Type Selector */}
            {/* <Select value={searchType} onValueChange={setSearchType}>
              <SelectTrigger className="md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="students">Siswa</SelectItem>
                <SelectItem value="teachers">Guru</SelectItem>
              </SelectContent>
            </Select> */}

            {/* Search Input */}
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder={`Search for ${searchType}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-12"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button
                onClick={handleSearch}
                size="sm"
                className="absolute right-1 top-1 h-8"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          
        </div>
      </div>
    </section>
  );
};

export default SearchSection;