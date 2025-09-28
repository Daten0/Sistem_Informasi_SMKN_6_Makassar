import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, Eye } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { NewsItem } from "./NewsCard";

interface NewsDetailProps {
  news: NewsItem;
  onBack: () => void;
}

const NewsDetail = ({ news, onBack }: NewsDetailProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          onClick={onBack}
          className="mb-6 hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Daftar Berita
        </Button>

        <article className="max-w-4xl mx-auto">
          <Card className="overflow-hidden shadow-lg">
            {news.imageUrl && (
              <div className="relative h-64 md:h-96 overflow-hidden">
                <img
                  src={news.imageUrl}
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-primary text-primary-foreground text-sm px-3 py-1">
                    {news.category}
                  </Badge>
                </div>
              </div>
            )}
            
            <CardContent className="p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                {news.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6 pb-6 border-b">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{news.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{format(news.publishDate, "EEEE, dd MMMM yyyy", { locale: id })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{news.views.toLocaleString()} views</span>
                </div>
              </div>
              
              <div className="prose prose-lg max-w-none">
                <div className="text-lg leading-relaxed text-foreground whitespace-pre-wrap">
                  {news.content}
                </div>
              </div>
            </CardContent>
          </Card>
        </article>
      </div>
    </div>
  );
};

export default NewsDetail;