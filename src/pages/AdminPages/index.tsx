import { createContext, useState, useContext, ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/Admin/Header";
import Sidebar from "@/components/Admin/Sidebar";

interface ProfileContextType {
  username: string;
  profileImage: string | null;
  setUsername: (name: string) => void;
  setProfileImage: (image: string | null) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};

const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState("Admin User");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  return (
    <ProfileContext.Provider value={{ username, profileImage, setUsername, setProfileImage }}>
      {children}
    </ProfileContext.Provider>
  );
};

const AdminPage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <ProfileProvider>
      <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
        <Sidebar isOpen={isSidebarOpen} />
        <div className="flex-1 flex flex-col">
          <Header toggleSidebar={toggleSidebar} />
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </ProfileProvider>
  );
};

export default AdminPage;