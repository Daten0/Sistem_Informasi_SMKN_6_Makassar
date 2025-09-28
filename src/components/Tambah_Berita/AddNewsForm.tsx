import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Save, Image } from "lucide-react";
import { NewsItem } from "./NewsCard";

interface AddNewsFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (news: Omit<NewsItem, 'id' | 'views'>) => void;
  editingNews?: NewsItem | null;
}

const categories = [
  "Politik",
  "Ekonomi", 
  "Teknologi",
  "Olahraga",
  "Hiburan",
  "Kesehatan",
  "Pendidikan",
  "Internasional"
];

const AddNewsForm = ({ isOpen, onClose, onSave, editingNews }: AddNewsFormProps) => {
  const [formData, setFormData] = useState({
    title: editingNews?.title || "",
    content: editingNews?.content || "",
    category: editingNews?.category || "",
    author: editingNews?.author || "",
    imageUrl: editingNews?.imageUrl || ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      publishDate: editingNews?.publishDate || new Date(),
    });
    setFormData({ title: "", content: "", category: "", author: "", imageUrl: "" });
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            {editingNews ? "Edit Berita" : "Tambah Berita Baru"}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Judul Berita</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Masukkan judul berita..."
                required
              />
            </div>

            <div>
              <Label htmlFor="author">Penulis</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => handleChange("author", e.target.value)}
                placeholder="Nama penulis..."
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Kategori</Label>
              <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="imageUrl">URL Gambar</Label>
              <div className="flex gap-2">
                <Image className="h-4 w-4 text-muted-foreground mt-3" />
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => handleChange("imageUrl", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="content">Konten Berita</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleChange("content", e.target.value)}
                placeholder="Tulis konten berita di sini..."
                rows={8}
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary"
              >
                <Save className="mr-2 h-4 w-4" />
                {editingNews ? "Update" : "Simpan"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddNewsForm;