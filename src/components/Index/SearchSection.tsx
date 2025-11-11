import { useState } from "react";
import { Search, Newspaper, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNews } from "@/hooks/useNews";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NewsItem } from "@/contexts/NewsContext";

const SearchSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { newsItems, loading } = useNews();
  const [searchResults, setSearchResults] = useState<NewsItem[]>([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = () => {
    setSearchPerformed(true);
    if (searchQuery.trim()) {
      const lowercasedQuery = searchQuery.toLowerCase();
      const results = newsItems.filter(
        (item) =>
          item.judul_berita.toLowerCase().includes(lowercasedQuery) ||
          (item.tags && item.tags.some((tag) => tag.toLowerCase().includes(lowercasedQuery)))
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
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

            {/* Search Input */}
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Cari berdasarkan judul..."
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
        {searchPerformed && (
          <div className="text-left mt-8">
            {loading ? (
              <div className="text-center text-white py-8">
                <p className="text-lg">Mencari...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((item) => (
                  <Link to={`/preview/${item.id}`} key={item.id}>
                    <Card className="bg-white hover:shadow-lg transition-shadow duration-300 text-left">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Newspaper className="w-5 h-5 text-primary" />
                          {item.judul_berita}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground line-clamp-3">
                          {item.ringkasan}
                        </p>
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {item.tags.map((tag) => (
                              <div
                                key={tag}
                                className="flex items-center bg-gray-100 rounded-full px-2 py-1 text-xs"
                              >
                                <Tag className="w-3 h-3 mr-1 text-gray-500" />
                                {tag}
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center text-white py-8">
                <p className="text-lg">Tidak ada berita yang ditemukan.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchSection;