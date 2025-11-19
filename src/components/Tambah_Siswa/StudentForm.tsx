import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload, Save } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import supabase from "@/supabase";

const studentSchema = z.object({
  nis: z.string().min(9, "NIS harus 9 digit").max(9, "NIS harus 9 digit"),
  nama: z.string().min(2, "Nama harus diisi minimal 2 karakter"),
  kejuruan: z.string().min(1, "Kejuruan harus dipilih"),
  kelas: z.string().min(1, "Kelas harus dipilih"),
  tempatLahir: z.string().min(2, "Tempat lahir harus diisi"),
  tanggalLahir: z.date({
    required_error: "Tanggal lahir harus diisi",
  }),
  jenisKelamin: z.string().min(1, "Jenis kelamin harus dipilih"),
  agama: z.string().min(1, "Agama harus dipilih"),
  alamat: z.string().min(10, "Alamat harus diisi minimal 10 karakter"),
  noTelepon: z.string().min(10, "Nomor telepon harus diisi minimal 10 digit"),
});

type StudentFormData = z.infer<typeof studentSchema>;

export interface StudentFormProps {
  initialData?: any;
  onSavePartial?: (data: any) => void;
  studentId?: string;
  isEditMode?: boolean;
}

const StudentForm = ({ initialData, onSavePartial, studentId, isEditMode = false }: StudentFormProps) => {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      nis: "",
      nama: "",
      kejuruan: "",
      kelas: "",
      tempatLahir: "",
      jenisKelamin: "",
      agama: "",
      alamat: "",
      noTelepon: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        nis: initialData.nis || "",
        nama: initialData.fullName || "",
        kejuruan: initialData.kejuruan || "",
        kelas: initialData.kelas || "",
        tempatLahir: initialData.birthPlace || "",
        tanggalLahir: initialData.birthDate ? new Date(initialData.birthDate) : undefined,
        jenisKelamin: initialData.gender === "Laki-laki" ? "L" : "P",
        agama: initialData.religion || "",
        alamat: initialData.address || "",
        noTelepon: initialData.phoneNumber || "",
      });
      // restore photo preview if available in initialData
      if (initialData.photo || initialData.photoPreview) {
        setPhotoPreview(initialData.photo || initialData.photoPreview);
      }
    }
  }, [initialData]);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onSubmit = async (data: StudentFormData) => {
    let photoUrl = photoPreview;

    if (photo) {
      const filePath = `students/${studentId || data.nis}/${photo.name}`;
      const { error: uploadError } = await supabase.storage.from("student_pictures").upload(filePath, photo, {
        cacheControl: "3600",
        upsert: true,
      });

      if (uploadError) {
        toast.error(`Gagal mengupload foto: ${uploadError.message}`);
        return;
      }

      const { data: publicUrlData } = supabase.storage.from("student_pictures").getPublicUrl(filePath);
      photoUrl = publicUrlData.publicUrl;
    }

    const studentDataForSupabase = {
      id: studentId,
      nis: data.nis,
      nama_lengkap: data.nama,
      kejuruan: data.kejuruan,
      kelas: data.kelas,
      tempat_lahir: data.tempatLahir,
      tanggal_lahir: data.tanggalLahir.toISOString().split("T")[0],
      jenis_kelamin: data.jenisKelamin,
      agama: data.agama,
      nomor_telepon: data.noTelepon,
      alamat_lengkap: data.alamat,
      foto_siswa: photoUrl,
      terdaftar: true,
    };

    if (onSavePartial) {
      onSavePartial({
        displayData: {
          id: initialData?.id || Math.random().toString(36).substr(2, 9),
          fullName: data.nama,
          nis: data.nis,
          gender: data.jenisKelamin,
          birthPlace: data.tempatLahir,
          birthDate: data.tanggalLahir ? data.tanggalLahir.toISOString() : "",
          religion: data.agama.charAt(0).toUpperCase() + data.agama.slice(1),
          address: data.alamat,
          phoneNumber: data.noTelepon,
          kelas: data.kelas.toUpperCase(),
          kejuruan: data.kejuruan,
          photo: photoUrl,
        },
        supabaseData: studentDataForSupabase,
      });
      toast.success("Data siswa berhasil divalidasi dan disimpan sementara.");
    } else {
      // Fallback for direct submission if onSavePartial is not provided
      const { error } = await supabase.from("add_siswa").insert([studentDataForSupabase]);
      if (error) {
        toast.error(`Gagal menyimpan data siswa: ${error.message}`);
      } else {
        toast.success("Data siswa berhasil disimpan ke database!");
      }
    }
  };


  return (
    <Card className="w-full max-w-4xl mx-auto shadow-medium">
      <CardHeader className="bg-gradient-subtle rounded-t-lg">
        <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
          <Save className="h-6 w-6" />
          Data Siswa
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nisn" className="text-sm font-medium">
                NIS *
              </Label>
              <Input id="nis" placeholder="1234567890" {...form.register("nis")} className="transition-smooth focus:ring-2 focus:ring-primary/20" readOnly={isEditMode} />
              {form.formState.errors.nis && <p className="text-sm text-destructive">{form.formState.errors.nis.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nama" className="text-sm font-medium">
                Nama Lengkap *
              </Label>
              <Input id="nama" placeholder="Masukkan nama lengkap" {...form.register("nama")} className="transition-smooth focus:ring-2 focus:ring-primary/20" />
              {form.formState.errors.nama && <p className="text-sm text-destructive">{form.formState.errors.nama.message}</p>}
            </div>
          </div>

          {/* Academic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="jurusan" className="text-sm font-medium">
                Jurusan *
              </Label>
              <Select onValueChange={(value) => form.setValue("kejuruan", value)}>
                <SelectTrigger className="transition-smooth focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="Pilih kejuruan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DKV">Desain Komunikasi Visual</SelectItem>
                  <SelectItem value="BG">Tata Boga</SelectItem>
                  <SelectItem value="PH">Perhotelan</SelectItem>
                  <SelectItem value="AK">Akutansi</SelectItem>
                  <SelectItem value="TK">Tata Kecantikan</SelectItem>
                  <SelectItem value="TB">Tata Busana</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.kejuruan && <p className="text-sm text-destructive">{form.formState.errors.kejuruan.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="kelas" className="text-sm font-medium">
                Kelas *
              </Label>
              <Select onValueChange={(value) => form.setValue("kelas", value)}>
                <SelectTrigger className="transition-smooth focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="Pilih kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="x">Kelas X</SelectItem>
                  <SelectItem value="xi">Kelas XI</SelectItem>
                  <SelectItem value="xii">Kelas XII</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.kelas && <p className="text-sm text-destructive">{form.formState.errors.kelas.message}</p>}
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="tempatLahir" className="text-sm font-medium">
                Tempat Lahir *
              </Label>
              <Input id="tempatLahir" placeholder="Makassar" {...form.register("tempatLahir")} className="transition-smooth focus:ring-2 focus:ring-primary/20" />
              {form.formState.errors.tempatLahir && <p className="text-sm text-destructive">{form.formState.errors.tempatLahir.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Tanggal Lahir *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal transition-smooth", !form.watch("tanggalLahir") && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.watch("tanggalLahir") ? format(form.watch("tanggalLahir"), "dd MMMM yyyy") : <span>Pilih tanggal</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={form.watch("tanggalLahir")} onSelect={(date) => form.setValue("tanggalLahir", date as Date)} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
              {form.formState.errors.tanggalLahir && <p className="text-sm text-destructive">{form.formState.errors.tanggalLahir.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="jenisKelamin" className="text-sm font-medium">
                Jenis Kelamin *
              </Label>
              <Select onValueChange={(value) => form.setValue("jenisKelamin", value)}>
                <SelectTrigger className="transition-smooth focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="Pilih jenis kelamin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                  <SelectItem value="Perempuan">Perempuan</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.jenisKelamin && <p className="text-sm text-destructive">{form.formState.errors.jenisKelamin.message}</p>}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="agama" className="text-sm font-medium">
                Agama *
              </Label>
              <Select onValueChange={(value) => form.setValue("agama", value)}>
                <SelectTrigger className="transition-smooth focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="Pilih agama" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="islam">Islam</SelectItem>
                  <SelectItem value="kristen">Kristen</SelectItem>
                  <SelectItem value="katolik">Katolik</SelectItem>
                  <SelectItem value="hindu">Hindu</SelectItem>
                  <SelectItem value="buddha">Buddha</SelectItem>
                  <SelectItem value="konghucu">Konghucu</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.agama && <p className="text-sm text-destructive">{form.formState.errors.agama.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="noTelepon" className="text-sm font-medium">
                Nomor Telepon *
              </Label>
              <Input id="noTelepon" placeholder="08123456789" {...form.register("noTelepon")} className="transition-smooth focus:ring-2 focus:ring-primary/20" />
              {form.formState.errors.noTelepon && <p className="text-sm text-destructive">{form.formState.errors.noTelepon.message}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="alamat" className="text-sm font-medium">
              Alamat Lengkap *
            </Label>
            <Textarea id="alamat" placeholder="Jl. Contoh No. 123, Kec. Contoh, Makassar" {...form.register("alamat")} className="min-h-[100px] transition-smooth focus:ring-2 focus:ring-primary/20" />
            {form.formState.errors.alamat && <p className="text-sm text-destructive">{form.formState.errors.alamat.message}</p>}
          </div>

          {/* Photo Upload */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Foto Siswa</Label>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:bg-muted/50 transition-smooth">
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" id="photo-upload" />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Klik untuk upload foto atau drag & drop</p>
                    <p className="text-xs text-muted-foreground mt-1">Format: JPG, PNG (Max: 2MB)</p>
                  </label>
                </div>
              </div>
              {photoPreview && (
                <div className="w-24 h-24 border rounded-lg overflow-hidden">
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-4">
            <Button type="submit" className="px-8 bg-gradient-primary hover:opacity-90 transition-smooth" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Menyimpan..." : "Simpan Data Siswa"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StudentForm;
