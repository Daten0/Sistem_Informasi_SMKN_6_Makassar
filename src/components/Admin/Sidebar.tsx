import { Link } from "react-router-dom";
import { Users, BookOpen, GraduationCap } from "lucide-react";
import schoolLogo from "@/assets/school-logo.png";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  return (
    <aside className={cn("w-64 bg-white dark:bg-gray-800 shadow-md hidden", { "lg:block": isOpen, "hidden": !isOpen })}>
      <div className="p-6 flex items-center space-x-4">
        <img src={schoolLogo} alt="School Logo" className="h-10 w-auto" />
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Admin Panel</h2>
      </div>
      <nav className="mt-6">
        <ul>
          <li>
            <Link to="/admin/AddStudents" className="flex items-center px-6 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
              <Users className="w-5 h-5" />
              <span className="ml-4">Siswa</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/teachers" className="flex items-center px-6 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
              <GraduationCap className="w-5 h-5" />
              <span className="ml-4">Guru</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/materials" className="flex items-center px-6 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
              <BookOpen className="w-5 h-5" />
              <span className="ml-4">Materi Pembelajaran</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;