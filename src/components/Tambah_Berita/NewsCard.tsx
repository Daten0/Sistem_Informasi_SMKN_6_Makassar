import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, Eye, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  publishDate: Date;
  imageUrl?: string;
  views: number;
}

interface NewsCardProps {
  news: NewsItem;
  onEdit: (news: NewsItem) => void;
  onDelete: (id: string) => void;
  onView: (news: NewsItem) => void;
}

const NewsCard = ({ news, onEdit, onDelete, onView }: NewsCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      <CardHeader className="p-0">
        {news.imageUrl && (
          <div className="relative overflow-hidden rounded-t-lg h-48">
            <img
              src={news.imageUrl}
              alt={news.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="bg-primary text-primary-foreground">
                {news.category}
              </Badge>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-4" onClick={() => onView(news)}>
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {news.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-3">
          {news.content}
        </p>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{news.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{format(news.publishDate, "dd MMM yyyy", { locale: id })}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{news.views.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onView(news);
          }}
        >
          <Eye className="mr-1 h-3 w-3" />
          Lihat
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(news);
            }}
          >
            <Edit className="mr-1 h-3 w-3" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(news.id);
            }}
          >
            <Trash2 className="mr-1 h-3 w-3" />
            Hapus
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NewsCard;