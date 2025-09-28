import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Calendar, User, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useNews } from "@/contexts/NewsContext";

export default function NewsPreview() {
  const { id } = useParams();
  const { getNewsById } = useNews();

  const newsItem = getNewsById(Number(id));

  if (!newsItem) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Berita tidak ditemukan</h2>
        <Link to="/admin/berita">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar Berita
          </Button>
        </Link>
      </div>
    );
  }

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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/admin/berita">
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
        <Link to={`/admin/berita/editBerita/${newsItem.id}`}>
          <Button className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300">
            <Edit className="h-4 w-4 mr-2" />
            Edit Berita
          </Button>
        </Link>
      </div>

      <Card className="bg-gradient-to-br from-card to-secondary/30 border-border max-w-4xl mx-auto">
        <CardHeader className="p-0">
          <div className="relative overflow-hidden rounded-t-lg">
            <img
              src={newsItem.image}
              alt={newsItem.title}
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="absolute top-4 right-4">
              {getStatusBadge(newsItem.status)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {newsItem.title}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {newsItem.excerpt}
              </p>
            </div>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 py-4 border-y border-border">
              <div className="flex items-center text-muted-foreground">
                <User className="h-4 w-4 mr-2" />
                <span className="font-medium">{newsItem.author}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{newsItem.publishDate}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Eye className="h-4 w-4 mr-2" />
                <span>{newsItem.views} views</span>
              </div>
              <Badge variant="outline" className="capitalize">
                {newsItem.category}
              </Badge>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-foreground leading-relaxed whitespace-pre-wrap">
                {newsItem.content}
              </div>
            </div>

            {/* Tags */}
            {newsItem.tags.length > 0 && (
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
            )}

            {/* Actions */}
            <div className="flex justify-between items-center pt-6 border-t border-border">
              <Link to="/admin/berita">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali ke Daftar
                </Button>
              </Link>
              <Link to={`/admin/berita/editBerita/${newsItem.id}`}>
                <Button>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Berita
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}