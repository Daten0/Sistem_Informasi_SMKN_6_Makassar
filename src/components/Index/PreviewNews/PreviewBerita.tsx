import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useNews } from "@/hooks/useNews";
import { useEffect, useState } from "react";
import { NewsItem } from "@/contexts/NewsContext";

export default function NewsPreview() {
  const { id } = useParams<{ id: string }>();
  const { getNewsById, loading } = useNews();
  const [newsItem, setNewsItem] = useState<NewsItem | undefined>(undefined);

  useEffect(() => {
    if (!loading && id) {
      const item = getNewsById(id);
      setNewsItem(item);
    }
  }, [id, getNewsById, loading]);

  if (loading) {
    return (
        <div className="text-center py-12">
            <p>Loading...</p>
        </div>
    )
  }

  if (!newsItem) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Berita tidak ditemukan</h2>
        <Link to="/">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Halaman Utama
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Preview Berita</h1>
            <p className="text-muted-foreground mt-2">
              Lihat bagaimana berita akan tampil kepada pembaca
            </p>
          </div>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-card to-secondary/30 border-border max-w-4xl mx-auto">
        <CardHeader className="p-0">
          <div className="relative overflow-hidden rounded-t-lg">
            <img
              src={newsItem.gambar_berita}
              alt={newsItem.judul_berita}
              className="w-full h-64 md:h-80 object-cover"
            />
            {/* <div className="absolute top-4 right-4">
              {getStatusBadge(newsItem.status)}
            </div> */}
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {newsItem.judul_berita}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {newsItem.ringkasan}
              </p>
            </div>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 py-4 border-y border-border">
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{new Date(newsItem.created_at).toLocaleDateString()}</span>
              </div>
              <Badge variant="outline" className="capitalize">
                {newsItem.kategori_berita}
              </Badge>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-foreground leading-relaxed whitespace-pre-wrap">
                {newsItem.konten}
              </div>
            </div>

            {/* Tags */}
            {newsItem.tags && newsItem.tags.length > 0 && (
              <div className="pt-6 border-t border-border">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {newsItem.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )};
          </div>
        </CardContent>
      </Card>
    </div>
  );
}