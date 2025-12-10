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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { CalendarIcon, Upload, X, ChevronDown, Plus, Tag } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Teacher, TeacherForInsert, TeacherForUpdate } from "@/contexts/TeachersContext";
import DOMPurify from "dompurify";
import supabase from "@/supabase";
import { useAuth } from "@/contexts/AuthContext";

const formSchema = z.object({
  username: z.string().min(2, { message: "Nama harus diisi minimal 2 karakter" }),
  nip: z.string().length(18, { message: "NIP harus 18 digit" }),
  jabatan: z.string().min(2, { message: "Jabatan harus diisi" }),
  mapel: z.array(z.string()).min(1, { message: "Mata pelajaran harus dipilih" }),
  kejuruan: z.array(z.string()).min(1, { message: "Kejuruan harus dipilih" }),
});

export type TeacherFormValues = z.infer<typeof formSchema>;

type TeacherFormProps = {
  onSubmit: (values: TeacherForInsert | TeacherForUpdate) => void;
  initialData?: Partial<Teacher>;
  isSubmitting?: boolean;
};

export function TeacherForm({ onSubmit, initialData, isSubmitting }: TeacherFormProps) {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [mapelInput, setMapelInput] = useState("");
  const { currentUser } = useAuth();
  const kejuruanOptions = ["Perhotelan", "Tata Busana", "Tata Boga", "Akuntansi", "Desain Komunikasi Visual"];


  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: initialData?.username || "",
      nip: initialData?.nip ? String(initialData.nip) : "",
      jabatan: initialData?.jabatan || "",
      mapel: initialData?.mapel || [],
      kejuruan: initialData?.kejuruan || [],
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        username: initialData.username || "",
        nip: initialData.nip ? String(initialData.nip) : "",
        jabatan: initialData.jabatan || "",
        mapel: initialData.mapel || [],
        kejuruan: initialData.kejuruan || []
      });
      if (initialData.picture_url) {
        setProfileImage(initialData.picture_url);
      }
    }
  }, [initialData, form]);

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

  const handleAddMapel = () => {
      const currentMapel = form.getValues("mapel") || [];
      if (mapelInput && !currentMapel.includes(mapelInput)) {
        form.setValue("mapel", [...currentMapel, mapelInput], { shouldValidate: true });
        setMapelInput("");
      }
  };

  const handleRemoveMapel = (mapelToRemove: string) => {
    const currentMapel = form.getValues("mapel") || [];
    form.setValue(
      "mapel",
      currentMapel.filter((mapel) => mapel !== mapelToRemove),
      { shouldValidate: true }
    );
  };

  const removeImage = () => {
    setProfileImage(null);
    setImageFile(null);
  };

  async function onFormSubmit(values: TeacherFormValues) {
    let picture_url: string | undefined | null = initialData?.picture_url;

    if (imageFile) {
      if (initialData?.picture_url) {
        const oldImageName = initialData.picture_url.split("/").pop();
        if (oldImageName) {
          await supabase.storage.from("teacher_pictures").remove([oldImageName]);
        }
      }
      
      const fileName = `${currentUser!.id}/${Date.now()}_${imageFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("teacher_pictures")
        .upload(fileName, imageFile);

      if (uploadError) {
        toast.error("Gagal mengunggah gambar", {
          description: uploadError.message,
        });
        return;
      }

      const { data: urlData } = supabase.storage
        .from("teacher_pictures")
        .getPublicUrl(uploadData.path);
      picture_url = urlData.publicUrl;
    }

    const dataToSubmit = {
      ...values,
      username: DOMPurify.sanitize(values.username),
      jabatan: DOMPurify.sanitize(values.jabatan),
      mapel: values.mapel.map((mapel) => DOMPurify.sanitize(mapel)),
      picture_url: picture_url,
    };
    
    onSubmit(dataToSubmit);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
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
            name="username"
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
                  <Input placeholder="Masukkan NIP" {...field} type="text" />
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
            name="kejuruan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Program Keahlian</FormLabel>
                <DropdownMenu>
                  <FormControl>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        {field.value?.length > 0
                          ? field.value.join(", ")
                          : "Pilih kejuruan"}
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                  </FormControl>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuLabel>Kejuruan</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {kejuruanOptions.map((option) => (
                      <DropdownMenuCheckboxItem
                        key={option}
                        checked={field.value?.includes(option)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...(field.value || []), option])
                            : field.onChange(
                                field.value?.filter(
                                  (value) => value !== option
                                )
                              );
                        }}
                      >
                        {option}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mapel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mata Pelajaran</FormLabel>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="e.g., Matematika"
                      value={mapelInput}
                      onChange={(e) => setMapelInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddMapel();
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddMapel} size="icon" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {field.value?.map((mapel) => (
                      <div
                        key={mapel}
                        className="flex items-center gap-1.5 bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm"
                      >
                        <Tag className="h-3.5 w-3.5" />
                        <span>{mapel}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMapel(mapel)}
                          className="ml-1 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
          {isSubmitting ? "Menyimpan..." : (initialData ? "Update Data" : "Simpan Data")}
        </Button>
      </form>
    </Form>
  );
}
