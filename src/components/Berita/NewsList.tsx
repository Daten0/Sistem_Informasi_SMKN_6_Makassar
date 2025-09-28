import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  User,
  FileText
} from "lucide-react";
import { Link } from "react-router-dom";
import { useNews } from "@/contexts/NewsContext";
import { useToast } from "@/hooks/use-toast";

export default function NewsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const { newsItems, deleteNewsItem } = useNews();
  const { toast } = useToast();

  const filteredNews = newsItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number, title: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus berita "${title}"?`)) {
      deleteNewsItem(id);
      toast({
        title: "Berhasil!",
        description: `Berita "${title}" telah dihapus`,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-success text-success-foreground">Published</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Kelola Berita</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Kelola semua artikel dan berita yang telah dibuat
          </p>
        </div>
        <Link to="/admin/berita/buatBerita" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Berita
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="flex items-center w-full">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari berita..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {filteredNews.map((news) => (
          <Card key={news.id} className="bg-gradient-to-br from-card to-secondary/30 border-border hover:shadow-lg transition-all duration-300 group">
            <CardHeader className="p-0">
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4">
                  {getStatusBadge(news.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg text-foreground line-clamp-2 mb-2">
                    {news.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-3">
                    {news.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {news.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {news.publishDate}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    {news.views}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-border">
                  <div className="flex space-x-2 w-full sm:w-auto">
                    <Link to={`/admin/berita/editBerita/${news.id}`} className="flex-1 sm:flex-none">
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        <Edit className="h-3 w-3 mr-1" />
                        <span className="sm:inline">Edit</span>
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-destructive hover:text-destructive flex-1 sm:flex-none"
                      onClick={() => handleDelete(news.id, news.title)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <Link to={`/admin/berita/preview/${news.id}`} className="w-full sm:w-auto">
                    <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                      <Eye className="h-3 w-3 mr-1" />
                      Preview
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Tidak ada berita ditemukan</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? "Coba ubah kata kunci pencarian" : "Mulai dengan membuat berita pertama Anda"}
          </p>
          <Link to="/admin/news/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Berita
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}