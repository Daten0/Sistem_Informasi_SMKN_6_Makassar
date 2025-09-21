import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const parentSchema = z.object({
  namaAyah: z.string().min(2, "Nama ayah harus diisi minimal 2 karakter"),
  pekerjaanAyah: z.string().min(2, "Pekerjaan ayah harus diisi"),
  pendidikanAyah: z.string().min(1, "Pendidikan ayah harus dipilih"),
  penghasilanAyah: z.string().min(1, "Penghasilan ayah harus dipilih"),
  teleponAyah: z.string().min(10, "Nomor telepon ayah harus diisi minimal 10 digit"),
  
  namaIbu: z.string().min(2, "Nama ibu harus diisi minimal 2 karakter"),
  pekerjaanIbu: z.string().min(2, "Pekerjaan ibu harus diisi"),
  pendidikanIbu: z.string().min(1, "Pendidikan ibu harus dipilih"),
  penghasilanIbu: z.string().min(1, "Penghasilan ibu harus dipilih"),
  teleponIbu: z.string().min(10, "Nomor telepon ibu harus diisi minimal 10 digit"),
  
  alamatOrangTua: z.string().min(10, "Alamat orang tua harus diisi minimal 10 karakter"),
  
  // Guardian (optional if different from parents)
  namaWali: z.string().optional(),
  pekerjaanWali: z.string().optional(),
  pendidikanWali: z.string().optional(),
  hubunganWali: z.string().optional(),
  teleponWali: z.string().optional(),
  alamatWali: z.string().optional(),
});

type ParentFormData = z.infer<typeof parentSchema>;

const ParentForm = () => {
  const form = useForm<ParentFormData>({
    resolver: zodResolver(parentSchema),
    defaultValues: {
      namaAyah: "",
      pekerjaanAyah: "",
      pendidikanAyah: "",
      penghasilanAyah: "",
      teleponAyah: "",
      namaIbu: "",
      pekerjaanIbu: "",
      pendidikanIbu: "",
      penghasilanIbu: "",
      teleponIbu: "",
      alamatOrangTua: "",
      namaWali: "",
      pekerjaanWali: "",
      pendidikanWali: "",
      hubunganWali: "",
      teleponWali: "",
      alamatWali: "",
    },
  });

  const onSubmit = (data: ParentFormData) => {
    console.log("Parent Data:", data);
    toast({
      title: "Data orang tua berhasil disimpan!",
      description: `Data orang tua/wali telah tersimpan dalam sistem.`,
    });
    
    // Reset form after successful submission
    form.reset();
  };

  const pendidikanOptions = [
    { value: "sd", label: "SD/Sederajat" },
    { value: "smp", label: "SMP/Sederajat" },
    { value: "sma", label: "SMA/SMK/Sederajat" },
    { value: "d3", label: "Diploma III" },
    { value: "s1", label: "Sarjana (S1)" },
    { value: "s2", label: "Magister (S2)" },
    { value: "s3", label: "Doktor (S3)" },
  ];

  const penghasilanOptions = [
    { value: "< 1jt", label: "Kurang dari Rp 1.000.000" },
    { value: "1-2jt", label: "Rp 1.000.000 - Rp 2.000.000" },
    { value: "2-5jt", label: "Rp 2.000.000 - Rp 5.000.000" },
    { value: "5-10jt", label: "Rp 5.000.000 - Rp 10.000.000" },
    { value: "> 10jt", label: "Lebih dari Rp 10.000.000" },
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-medium">
      <CardHeader className="bg-gradient-subtle rounded-t-lg">
        <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
          <Users className="h-6 w-6" />
          Data Orang Tua/Wali
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Father Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary border-b border-border pb-2">
              Data Ayah
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="namaAyah" className="text-sm font-medium">Nama Lengkap Ayah *</Label>
                <Input
                  id="namaAyah"
                  placeholder="Masukkan nama lengkap ayah"
                  {...form.register("namaAyah")}
                  className="transition-smooth focus:ring-2 focus:ring-primary/20"
                />
                {form.formState.errors.namaAyah && (
                  <p className="text-sm text-destructive">{form.formState.errors.namaAyah.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pekerjaanAyah" className="text-sm font-medium">Pekerjaan Ayah *</Label>
                <Input
                  id="pekerjaanAyah"
                  placeholder="PNS, Wiraswasta, dll"
                  {...form.register("pekerjaanAyah")}
                  className="transition-smooth focus:ring-2 focus:ring-primary/20"
                />
                {form.formState.errors.pekerjaanAyah && (
                  <p className="text-sm text-destructive">{form.formState.errors.pekerjaanAyah.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="pendidikanAyah" className="text-sm font-medium">Pendidikan Ayah *</Label>
                <Select onValueChange={(value) => form.setValue("pendidikanAyah", value)}>
                  <SelectTrigger className="transition-smooth focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Pilih pendidikan" />
                  </SelectTrigger>
                  <SelectContent>
                    {pendidikanOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.pendidikanAyah && (
                  <p className="text-sm text-destructive">{form.formState.errors.pendidikanAyah.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="penghasilanAyah" className="text-sm font-medium">Penghasilan Ayah *</Label>
                <Select onValueChange={(value) => form.setValue("penghasilanAyah", value)}>
                  <SelectTrigger className="transition-smooth focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Pilih penghasilan" />
                  </SelectTrigger>
                  <SelectContent>
                    {penghasilanOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.penghasilanAyah && (
                  <p className="text-sm text-destructive">{form.formState.errors.penghasilanAyah.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="teleponAyah" className="text-sm font-medium">Nomor Telepon Ayah *</Label>
                <Input
                  id="teleponAyah"
                  placeholder="08123456789"
                  {...form.register("teleponAyah")}
                  className="transition-smooth focus:ring-2 focus:ring-primary/20"
                />
                {form.formState.errors.teleponAyah && (
                  <p className="text-sm text-destructive">{form.formState.errors.teleponAyah.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Mother Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary border-b border-border pb-2">
              Data Ibu
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="namaIbu" className="text-sm font-medium">Nama Lengkap Ibu *</Label>
                <Input
                  id="namaIbu"
                  placeholder="Masukkan nama lengkap ibu"
                  {...form.register("namaIbu")}
                  className="transition-smooth focus:ring-2 focus:ring-primary/20"
                />
                {form.formState.errors.namaIbu && (
                  <p className="text-sm text-destructive">{form.formState.errors.namaIbu.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pekerjaanIbu" className="text-sm font-medium">Pekerjaan Ibu *</Label>
                <Input
                  id="pekerjaanIbu"
                  placeholder="Ibu Rumah Tangga, Guru, dll"
                  {...form.register("pekerjaanIbu")}
                  className="transition-smooth focus:ring-2 focus:ring-primary/20"
                />
                {form.formState.errors.pekerjaanIbu && (
                  <p className="text-sm text-destructive">{form.formState.errors.pekerjaanIbu.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="pendidikanIbu" className="text-sm font-medium">Pendidikan Ibu *</Label>
                <Select onValueChange={(value) => form.setValue("pendidikanIbu", value)}>
                  <SelectTrigger className="transition-smooth focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Pilih pendidikan" />
                  </SelectTrigger>
                  <SelectContent>
                    {pendidikanOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.pendidikanIbu && (
                  <p className="text-sm text-destructive">{form.formState.errors.pendidikanIbu.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="penghasilanIbu" className="text-sm font-medium">Penghasilan Ibu *</Label>
                <Select onValueChange={(value) => form.setValue("penghasilanIbu", value)}>
                  <SelectTrigger className="transition-smooth focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Pilih penghasilan" />
                  </SelectTrigger>
                  <SelectContent>
                    {penghasilanOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.penghasilanIbu && (
                  <p className="text-sm text-destructive">{form.formState.errors.penghasilanIbu.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="teleponIbu" className="text-sm font-medium">Nomor Telepon Ibu *</Label>
                <Input
                  id="teleponIbu"
                  placeholder="08123456789"
                  {...form.register("teleponIbu")}
                  className="transition-smooth focus:ring-2 focus:ring-primary/20"
                />
                {form.formState.errors.teleponIbu && (
                  <p className="text-sm text-destructive">{form.formState.errors.teleponIbu.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Parents Address */}
          <div className="space-y-2">
            <Label htmlFor="alamatOrangTua" className="text-sm font-medium">Alamat Orang Tua *</Label>
            <Textarea
              id="alamatOrangTua"
              placeholder="Jl. Contoh No. 123, Kec. Contoh, Makassar"
              {...form.register("alamatOrangTua")}
              className="min-h-[100px] transition-smooth focus:ring-2 focus:ring-primary/20"
            />
            {form.formState.errors.alamatOrangTua && (
              <p className="text-sm text-destructive">{form.formState.errors.alamatOrangTua.message}</p>
            )}
          </div>

          {/* Guardian Information (Optional) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary border-b border-border pb-2">
              Data Wali (Opsional - Jika berbeda dengan orang tua)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="namaWali" className="text-sm font-medium">Nama Lengkap Wali</Label>
                <Input
                  id="namaWali"
                  placeholder="Masukkan nama lengkap wali"
                  {...form.register("namaWali")}
                  className="transition-smooth focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hubunganWali" className="text-sm font-medium">Hubungan dengan Siswa</Label>
                <Select onValueChange={(value) => form.setValue("hubunganWali", value)}>
                  <SelectTrigger className="transition-smooth focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Pilih hubungan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kakek">Kakek</SelectItem>
                    <SelectItem value="nenek">Nenek</SelectItem>
                    <SelectItem value="paman">Paman</SelectItem>
                    <SelectItem value="bibi">Bibi</SelectItem>
                    <SelectItem value="saudara">Saudara</SelectItem>
                    <SelectItem value="lainnya">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="pekerjaanWali" className="text-sm font-medium">Pekerjaan Wali</Label>
                <Input
                  id="pekerjaanWali"
                  placeholder="Pekerjaan wali"
                  {...form.register("pekerjaanWali")}
                  className="transition-smooth focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pendidikanWali" className="text-sm font-medium">Pendidikan Wali</Label>
                <Select onValueChange={(value) => form.setValue("pendidikanWali", value)}>
                  <SelectTrigger className="transition-smooth focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Pilih pendidikan" />
                  </SelectTrigger>
                  <SelectContent>
                    {pendidikanOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="teleponWali" className="text-sm font-medium">Nomor Telepon Wali</Label>
                <Input
                  id="teleponWali"
                  placeholder="08123456789"
                  {...form.register("teleponWali")}
                  className="transition-smooth focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="alamatWali" className="text-sm font-medium">Alamat Wali</Label>
              <Textarea
                id="alamatWali"
                placeholder="Alamat wali (jika berbeda dengan orang tua)"
                {...form.register("alamatWali")}
                className="min-h-[80px] transition-smooth focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              className="px-8 bg-gradient-primary hover:opacity-90 transition-smooth"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Menyimpan..." : "Simpan Data Orang Tua/Wali"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ParentForm;