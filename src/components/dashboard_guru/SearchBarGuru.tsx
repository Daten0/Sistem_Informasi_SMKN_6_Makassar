import { Search, QrCode, Printer } from "lucide-react";
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

const SearchBarGuru = () => {
  const handlePrint = () => {
    const qrCodeElement = document.getElementById("qr-code-to-print");
    if (qrCodeElement) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write('<html><head><title>Print QR Code</title></head><body>');
        printWindow.document.write(qrCodeElement.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
      }
    }
  };
  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="bg-card rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row items-stretch">
          {/* Label Section */}
          <div className="flex items-center justify-center bg-card border-b md:border-b-0 md:border-r border-border px-8 py-6 md:py-0 md:min-w-[200px]">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Guru
            </h2>
          </div>
          
          {/* Search Section */}
          <div className="flex-1 flex items-center gap-3 px-6 py-5 md:px-8 md:py-6">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Cari Di Sini"
                className="w-full h-12 pl-4 pr-12 text-base md:text-lg border-0 bg-secondary/30 focus:bg-secondary/50 transition-colors"
              />
            </div>
            <Button 
              size="icon"
              className="h-12 w-12 shrink-0 bg-muted hover:bg-muted/80 text-muted-foreground"
              aria-label="Search"
            >
              <Search className="h-6 w-6" />
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
                <div className="flex justify-center py-4" id="qr-code-to-print">
                  <QRCode.QRCodeSVG value={`${window.location.origin}/teachers/GuruForm`} size={256} />
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
      {/* Registration Prompt */}
      <div className="mt-6 text-center">
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

export default SearchBarGuru;