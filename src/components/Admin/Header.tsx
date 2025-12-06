import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon, User, Newspaper } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Users, BookOpen, GraduationCap } from "lucide-react";
import schoolLogo from "@/assets/school-logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/components/theme-provider";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { setTheme, theme } = useTheme();
  const { currentUser } = useAuth();

  // useEffect(() => {
  //   if (isDarkMode) {
  //     document.documentElement.classList.add('dark');
  //     safeLocalStorageSet("theme", "dark");
  //   } else {
  //     document.documentElement.classList.remove('dark');
  //     safeLocalStorageSet("theme", "light");
  //   }
  // }, [isDarkMode]);

  // const toggleDarkMode = () => {
  //   setDarkMode(!isDarkMode);
  // };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
            <Button variant="ghost" onClick={toggleSidebar} className="hidden lg:block">
                <Menu className="w-6 h-6" />
            </Button>
            <div className="lg:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost">
                          <Menu className="w-6 h-6" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 bg-white dark:bg-gray-800 shadow-md">
                    <div className="p-6 flex items-center space-x-4">
                        <img src={schoolLogo} alt="School Logo" className="h-10 w-auto" />
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Admin</h2>
                    </div>
                    <nav className="mt-6">
                        <ul>
                          {/* <li>
                              <Link to="/admin/student-display" className="flex items-center px-6 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <Users className="w-5 h-5" />
                                <span className="ml-4">Siswa</span>
                              </Link>
                          </li> */}
                          <li>
                              <Link to="/admin/teachers" className="flex items-center px-6 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <GraduationCap className="w-5 h-5" />
                                <span className="ml-4">Guru</span>
                              </Link>
                          </li>
                          {/* <li>
                              <Link to="/admin/kejuruan" className="flex items-center px-6 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">

                                <BookOpen className="w-5 h-5" />
                                <span className="ml-4">Akademik</span>
                              </Link>
                          </li> */}
                          <li>
                              <Link to="/admin/berita" className="flex items-center px-6 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                              <Newspaper className="w-5 h-5" />
                              <span className="ml-4">Berita Sekolah</span>
                              </Link>
                          </li>
                        </ul>
                    </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
        <div className="flex-1"></div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </Button>
          <Link to="/admin/profile" className="flex items-center space-x-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={undefined} />
              <AvatarFallback>{currentUser?.user_metadata?.full_name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline">{currentUser?.user_metadata?.full_name}</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;