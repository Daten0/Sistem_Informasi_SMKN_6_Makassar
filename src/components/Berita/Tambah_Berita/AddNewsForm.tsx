import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Save, 
  Upload, 
  Eye, 
  ArrowLeft,
  ImageIcon,
  X
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useNews } from "@/contexts/NewsContext";
import supabase from "@/supabase"

export default function CreateNews() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { addNewsItem } = useNews();
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    author: "",
    tags: [] as string[],
    isPublished: false,
    featuredImage: null as File | null,
  });
  const [currentTag, setCurrentTag] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, featuredImage: file });
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, currentTag.trim()]
      });
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      toast({
        title: "Error",
        description: "Judul dan konten wajib diisi",
        variant: "destructive",
      });
      return;
    }
    if (!formData.category) {
      toast({
        title: "Error",
        description: "Kategori wajib dipilih",
        variant: "destructive",
      });
      return;
    }
    if (!formData.author) {
      toast({
        title: "Error",
        description: "Penulis wajib dipilih",
        variant: "destructive",
      });
      return;
    }

    const newsDataToInsert = {
      judul_berita: formData.title,
      ringkasan: formData.excerpt || formData.content.substring(0, 150) + "...",
      konten: formData.content,
      pembuat_berita: formData.author,
      publikasi_berita: formData.isPublished ? "publikasi" : "draft",
      gambar_berita: imagePreview || "/api/placeholder/300/200",
      kategori_berita: formData.category,
      tags: formData.tags,
    };

    const { error } = await supabase.from("list_berita").insert([newsDataToInsert]);

    if (error) {
      console.error("Error inserting news:", error);
      toast({
        title: "Gagal Menyimpan Berita",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Berhasil!",
        description: `Berita "${formData.title}" telah ${
          formData.isPublished ? "dipublikasikan" : "disimpan sebagai draft"
        }`,
      });
      navigate("/admin/berita");
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center space-x-4">
        <Link to="/admin/berita">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tambah Berita Baru</h1>
          <p className="text-muted-foreground mt-2">
            Buat artikel atau berita baru untuk dipublikasikan
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gradient-to-br from-card to-secondary/30 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Konten Utama</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-foreground">Judul Berita *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Masukkan judul yang menarik..."
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt" className="text-foreground">Ringkasan</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Ringkasan singkat artikel..."
                    className="mt-1 min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="content" className="text-foreground">Konten *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Tulis konten artikel lengkap di sini..."
                    className="mt-1 min-h-[300px]"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Featured Image */}
            <Card className="bg-gradient-to-br from-card to-accent/30 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Gambar Utama</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setImagePreview(null);
                          setFormData({ ...formData, featuredImage: null });
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">
                        Pilih gambar untuk artikel Anda
                      </p>
                      <Label htmlFor="image-upload" className="cursor-pointer">
                        <Button type="button" variant="outline" asChild>
                          <span>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Gambar
                          </span>
                        </Button>
                      </Label>
                    </div>
                  )}
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <Card className="bg-gradient-to-br from-card to-secondary/30 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Pengaturan Publikasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="publish" className="text-foreground">Publikasikan Sekarang</Label>
                  <Switch
                    id="publish"
                    checked={formData.isPublished}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {formData.isPublished 
                    ? "Artikel akan langsung dipublikasikan" 
                    : "Artikel akan disimpan sebagai draft"
                  }
                </p>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card className="bg-gradient-to-br from-card to-accent/30 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Kategori</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori berita" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Prestasi">Prestasi</SelectItem>
                    <SelectItem value="Terkini">Terkini</SelectItem>
                    <SelectItem value="Ekskul">Ekskul</SelectItem>
                    <SelectItem value="Daily">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Author */}
            <Card className="bg-gradient-to-br from-card to-accent/30 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Penulis</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={formData.author} onValueChange={(value) => setFormData({ ...formData, author: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih penulis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Guru">Guru</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="bg-gradient-to-br from-card to-secondary/30 border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    placeholder="Tambah tag..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    Tambah
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button type="submit" className="w-full bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
                <Save className="h-4 w-4 mr-2" />
                {formData.isPublished ? 'Publikasikan' : 'Simpan Draft'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}