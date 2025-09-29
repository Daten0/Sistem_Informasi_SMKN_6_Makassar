import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useNews } from "@/contexts/NewsContext";
import { useToast } from "@/hooks/use-toast";

export default function EditNews() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getNewsById, updateNewsItem } = useNews();
  const { toast } = useToast();

  const newsItem = getNewsById(Number(id));

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<"published" | "draft">("draft");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (newsItem) {
      setTitle(newsItem.title);
      setExcerpt(newsItem.excerpt);
      setContent(newsItem.content);
      setAuthor(newsItem.author);
      setCategory(newsItem.category);
      setStatus(newsItem.status);
      setTags(newsItem.tags.join(", "));
      setImage(newsItem.image);
    }
  }, [newsItem]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      toast({
        title: "Error!",
        description: "Mohon lengkapi semua field yang wajib diisi",
        variant: "destructive",
      });
      return;
    }

    const updatedNews = {
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      author: author.trim() || "Admin",
      category: category || "umum",
      status,
      tags: tags.split(",").map(tag => tag.trim()).filter(Boolean),
      image: image || "/api/placeholder/300/200"
    };

    updateNewsItem(newsItem.id, updatedNews);

    toast({
      title: "Berhasil!",
      description: "Berita berhasil diperbarui",
    });

    navigate("/admin/berita");
  };

  const removeBadge = (tagToRemove: string) => {
    const tagList = tags.split(",").map(tag => tag.trim()).filter(Boolean);
    const newTags = tagList.filter(tag => tag !== tagToRemove);
    setTags(newTags.join(", "));
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
            <h1 className="text-3xl font-bold text-foreground">Edit Berita</h1>
            <p className="text-muted-foreground mt-2">
              Perbarui informasi berita yang telah ada
            </p>
          </div>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-card to-secondary/30 border-border">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Form Edit Berita</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Berita *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masukkan judul berita..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Penulis</Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Nama penulis..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teknologi">Teknologi</SelectItem>
                    <SelectItem value="bisnis">Bisnis</SelectItem>
                    <SelectItem value="kesehatan">Kesehatan</SelectItem>
                    <SelectItem value="pendidikan">Pendidikan</SelectItem>
                    <SelectItem value="olahraga">Olahraga</SelectItem>
                    <SelectItem value="umum">Umum</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(value: "published" | "draft") => setStatus(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">URL Gambar</Label>
              <Input
                id="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Ringkasan *</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Tulis ringkasan singkat berita..."
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Konten Berita *</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tulis konten lengkap berita di sini..."
                className="min-h-[300px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (pisahkan dengan koma)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="AI, Teknologi, Inovasi"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.split(",").map(tag => tag.trim()).filter(Boolean).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeBadge(tag)}>
                    {tag}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <Link to="/admin/berita">
                <Button variant="outline">
                  Batal
                </Button>
              </Link>
              <Button 
                type="submit"
                className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Save className="h-4 w-4 mr-2" />
                Perbarui Berita
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}