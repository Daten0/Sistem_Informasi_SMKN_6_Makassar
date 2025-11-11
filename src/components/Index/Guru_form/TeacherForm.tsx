import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { CalendarIcon, Upload, X } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useState } from "react";

const formSchema = z.object({
  nama: z.string().min(2, { message: "Nama harus diisi minimal 2 karakter" }),
  nip: z.string().min(5, { message: "NIP harus diisi minimal 5 karakter" }),
  jabatan: z.string().min(2, { message: "Jabatan harus diisi" }),
  tanggalLahir: z.date({ required_error: "Tanggal lahir harus diisi" }),
  asal: z.string().min(2, { message: "Asal harus diisi" }),
  alamat: z.string().min(5, { message: "Alamat harus diisi minimal 5 karakter" }),
  agama: z.string({ required_error: "Agama harus dipilih" }),
  mataPelajaran: z.string({ required_error: "Mata pelajaran harus dipilih" }),
  kejuruan: z.string({ required_error: "Kejuruan harus dipilih" }),
});

export function TeacherForm() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: "",
      nip: "",
      jabatan: "",
      asal: "",
      alamat: "",
      agama: "",
      mataPelajaran: "",
      kejuruan: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file terlalu besar", {
          description: "Maksimal ukuran file adalah 5MB",
        });
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Format file tidak valid", {
          description: "Hanya file gambar yang diperbolehkan",
        });
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setImageFile(null);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log({ ...values, profileImage: imageFile?.name });
    toast.success("Data berhasil disimpan!", {
      description: `Data guru ${values.nama} telah tersimpan dengan sukses.`,
    });
    form.reset();
    removeImage();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Profile Image Upload */}
        <div className="flex flex-col items-center space-y-4 pb-6 border-b border-border">
          <div className="relative">
            {profileImage ? (
              <div className="relative group">
                <img
                  src={profileImage}
                  alt="Preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary/20 shadow-md"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full bg-muted border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="text-center">
            <label
              htmlFor="profile-image"
              className="cursor-pointer inline-flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md transition-colors text-sm font-medium"
            >
              <Upload className="h-4 w-4" />
              {profileImage ? "Ganti Foto" : "Upload Foto Profil"}
            </label>
            <input
              id="profile-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Maksimal 5MB (JPG, PNG, atau WEBP)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="nama"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lengkap</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan nama lengkap" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NIP</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan NIP" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jabatan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jabatan</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan jabatan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tanggalLahir"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Tanggal Lahir</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: id })
                        ) : (
                          <span>Pilih tanggal</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      locale={id}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="asal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asal</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan asal daerah" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="alamat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alamat</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan alamat lengkap" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="agama"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agama</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih agama" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="islam">Islam</SelectItem>
                    <SelectItem value="kristen">Kristen</SelectItem>
                    <SelectItem value="katolik">Katolik</SelectItem>
                    <SelectItem value="hindu">Hindu</SelectItem>
                    <SelectItem value="buddha">Buddha</SelectItem>
                    <SelectItem value="konghucu">Konghucu</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="kejuruan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kejuruan</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kejuruan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="perhotelan">Perhotelan</SelectItem>
                    <SelectItem value="tata-busana">Tata Busana</SelectItem>
                    <SelectItem value="tata-boga">Tata Boga</SelectItem>
                    <SelectItem value="akuntansi">Akuntansi</SelectItem>
                    <SelectItem value="desain-komunikasi-visual">Desain Komunikasi Visual</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mataPelajaran"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mata Pelajaran</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan mata pelajaran" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full md:w-auto">
          Simpan Data
        </Button>
      </form>
    </Form>
  );
}
