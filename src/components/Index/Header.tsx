import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, User, GraduationCap, School } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import schoolLogo from "@/assets/school-logo.png";

const Header = () => {
  return (
    <header className="bg-background border-b border-border py-4 px-6 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and School Name */}
        <div className="flex items-center gap-4">
          <img 
            src={schoolLogo} 
            alt="SMK Negeri 6 Makassar Logo" 
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h1 className="text-xl font-bold text-foreground">SMK Negeri 6 Makassar</h1>
            <p className="text-sm text-muted-foreground">Tentang SMK Negeri 6 Makassar</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Jurusan
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Desain Komunikasi Visual</DropdownMenuItem>
              <DropdownMenuItem>Tata Boga</DropdownMenuItem>
              <DropdownMenuItem>Perhotelan</DropdownMenuItem>
              <DropdownMenuItem>Akutansi</DropdownMenuItem>
              <DropdownMenuItem>Tata Kecantikan</DropdownMenuItem>
              <DropdownMenuItem>Tata Busana</DropdownMenuItem>
          
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <School className="w-4 h-4" />
                Profil Sekolah
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Tentang Kami</DropdownMenuItem>
              <DropdownMenuItem>Visi & Misi</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button className="bg-gradient-primary hover:opacity-90 transition-opacity">
            <User className="w-4 h-4 mr-2" />
            Login
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <Button variant="ghost" className="md:hidden">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Button>
      </div>
    </header>
  );
};

export default Header;