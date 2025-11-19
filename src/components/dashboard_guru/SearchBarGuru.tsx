import {
  Search,
  QrCode,
  Printer,
  Loader2,
  ArrowLeft,
  GraduationCap,
  User,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import * as QRCode from "qrcode.react";
import { TeachersProvider } from "@/contexts/TeachersContext";
import { useState } from "react";
import { Teacher } from "@/contexts/TeachersContext";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import TeachersProfile from "./TeachersProfile";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import supabase from "@/supabase";
import { toast } from "sonner";

const SearchBarGuruContent = () => {
  const [searchType, setSearchType] = useState("username");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.warning("Input pencarian tidak boleh kosong.");
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    setSearchResults([]);

    let query = supabase.from("guru").select("*");

    if (searchType === "username") {
      query = query.ilike("username", `%${searchQuery}%`);
    } else if (searchType === "nip") {
      query = query.eq("nip", searchQuery);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      toast.error("Gagal mencari data guru", {
        description: error.message,
      });
    } else {
      setSearchResults(data || []);
    }

    setIsLoading(false);
  };

  const handleTeacherClick = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
  };

  const handleBack = () => {
    setSelectedTeacher(null);
    setSearchQuery("");
    setSearchResults([]);
    setHasSearched(false);
  };

  const handlePrint = () => {
    const qrCodeElement = document.getElementById("qr-code-to-print");
    if (qrCodeElement) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(
          "<html><head><title>Print QR Code</title></head><body>"
        );
        printWindow.document.write(qrCodeElement.innerHTML);
        printWindow.document.write("</body></html>");
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  if (selectedTeacher) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Pencarian
          </Button>
        </div>
        <TeachersProfile teacher={selectedTeacher} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="bg-card rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row items-stretch">
          <div className="flex items-center justify-center bg-card border-b md:border-b-0 md:border-r border-border px-8 py-6 md:py-0 md:min-w-[200px]">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
              <GraduationCap className="h-8 w-8" />
              Guru
            </h2>
          </div>

          <div className="flex-1 flex flex-col md:flex-row items-center gap-3 px-6 py-5 md:px-8 md:py-6">
            <Select value={searchType} onValueChange={setSearchType}>
              <SelectTrigger className="w-full md:w-[120px] h-12 bg-secondary/30 focus:bg-secondary/50 border-0">
                <SelectValue placeholder="Cari berdasarkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="username">Nama</SelectItem>
                <SelectItem value="nip">NIP</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="text"
              placeholder={`Cari ${
                searchType === "username" ? "Nama" : "NIP"
              } Guru...`}
              className="flex-1 h-12 pl-4 text-base md:text-lg border-0 bg-secondary/30 focus:bg-secondary/50 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button
              size="icon"
              className="h-12 w-12 shrink-0"
              aria-label="Search"
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Search className="h-6 w-6" />
              )}
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  className="h-12 w-12 shrink-0 bg-muted hover:bg-muted/80 text-muted-foreground"
                  aria-label="Generate QR Code"
                >
                  <QrCode className="h-6 w-6" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Scan untuk Mendaftar</DialogTitle>
                </DialogHeader>
                <div
                  className="flex justify-center py-4"
                  id="qr-code-to-print"
                >
                  <QRCode.QRCodeSVG
                    value={`${window.location.origin}/teachers/GuruForm`}
                    size={256}
                  />
                </div>
                <DialogFooter>
                  <Button onClick={handlePrint} variant="outline">
                    <Printer className="w-4 h-4 mr-2" />
                    Print QR
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-10">
          <Loader2 className="h-8 w-8 animate-spin inline-block" />
          <p className="mt-2 text-muted-foreground">Mencari data guru...</p>
        </div>
      )}

      {!isLoading && hasSearched && searchResults.length === 0 && (
        <div className="text-center py-10">
          <p className="text-lg text-muted-foreground">
            Tidak ada hasil ditemukan.
          </p>
        </div>
      )}

      {!isLoading && searchResults.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {searchResults.map((teacher) => (
            <Card
              key={teacher.id}
              className="overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => handleTeacherClick(teacher)}
            >
              <CardContent className="p-5 flex items-center gap-5">
                <Avatar className="h-16 w-16 border-2 border-primary">
                  <AvatarImage
                    src={teacher.picture_url || undefined}
                    alt={teacher.username}
                  />
                  <AvatarFallback className="text-2xl bg-secondary">
                    {teacher.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-lg truncate text-primary">
                    {teacher.username}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {teacher.nip}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <p className="text-base md:text-lg text-foreground">
          Belum Terdaftar Sebagai Guru?{" "}
          <a
            href="/teachers/GuruForm"
            className="text-primary hover:text-primary/80 font-semibold transition-colors underline-offset-4 hover:underline"
          >
            Daftar Sekarang
          </a>
        </p>
      </div>
    </div>
  );
};

const SearchBarGuru = () => (
  <TeachersProvider>
    <SearchBarGuruContent />
  </TeachersProvider>
);

export default SearchBarGuru;