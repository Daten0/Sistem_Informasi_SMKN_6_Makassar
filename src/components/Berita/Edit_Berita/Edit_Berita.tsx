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
import supabase from "@/supabase";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

// Define the type for the news item based on your database schema
interface NewsItem {
  id: string;
  judul_berita: string;
  ringkasan: string;
  konten: string;
  kategori_berita: string;
  publikasi_berita: "publikasi" | "draft";
  tags: string[];
  gambar_berita?: string;
  author_id?: string | null;
}


export default function EditNews() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<"publikasi" | "draft">("draft");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  useEffect(() => {
    const fetchNewsItem = async () => {
      if (!id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("list_berita")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching news item:", error);
        toast.error("Gagal memuat berita.");
        setNewsItem(null);
      } else {
        if (data.author_id === currentUser?.id) {
          setIsAuthorized(true);
          setNewsItem(data);
          setTitle(data.judul_berita);
          setExcerpt(data.ringkasan || "");
          setContent(data.konten || "");
          setCategory(data.kategori_berita);
          setStatus(data.publikasi_berita);
          setTags(data.tags ? data.tags.join(", ") : "");
          setImage(data.gambar_berita || "");
        } else {
          setIsAuthorized(false);
          toast.error("Anda tidak memiliki izin untuk mengedit berita ini.");
        }
      }
      setLoading(false);
    };
    if (currentUser) {
      fetchNewsItem();
    }
  }, [id, currentUser]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast.error("Judul dan konten wajib diisi.");
      return;
    }

    const updatedNews = {
      judul_berita: title.trim(),
      ringkasan: excerpt.trim(),
      konten: content.trim(),
      kategori_berita: category,
      publikasi_berita: status,
      tags: tags.split(",").map(tag => tag.trim()).filter(Boolean),
      gambar_berita: image,
      updated_at: new Date().toISOString(),
    };

    if (!id) return;

    const { error } = await supabase
      .from("list_berita")
      .update(updatedNews)
      .eq("id", id);

    if (error) {
      console.error("Error updating news item:", error);
      toast.error("Gagal memperbarui berita.");
    } else {
      toast.success("Berita berhasil diperbarui!");
      navigate("/admin/berita");
    }
  };

  const removeBadge = (tagToRemove: string) => {
    const tagList = tags.split(",").map(tag => tag.trim()).filter(Boolean);
    const newTags = tagList.filter(tag => tag !== tagToRemove);
    setTags(newTags.join(", "));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-destructive mb-4">Tidak Diizinkan</h2>
        <p className="text-muted-foreground mb-6">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
        <Link to="/admin/berita">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar Berita
          </Button>
        </Link>
      </div>
    );
  }

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
                <Label htmlFor="category">Kategori</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Prestasi">Prestasi</SelectItem>
                    <SelectItem value="Terkini">Terkini</SelectItem>
                    <SelectItem value="Ekskul">Ekskul</SelectItem>
                    <SelectItem value="Daily">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(value: "publikasi" | "draft") => setStatus(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="publikasi">Published</SelectItem>
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