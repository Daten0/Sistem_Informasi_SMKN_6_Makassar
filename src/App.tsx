import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NewsProvider } from "./contexts/NewsContext";
import VisiMisi from "./pages/VisiMisi";
import About from "./pages/About";
import Index from "./pages/Index";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Subjects from "./pages/Subjects";
import NotFound from "./pages/NotFound";
import LoginPages from "./pages/LoginPages";
import RegisterPages from "./pages/RegisterPages";
import AdminPage from "./pages/AdminPages/index";
import AdminDashboardPage from "./pages/AdminPages/DashboardPage";
import AdminProfilePage from "./pages/AdminPages/ProfilePage";
import AddStudentsPage from "./pages/AdminPages/AddStudent/AddStudentPage";
import AdminTeachersPage from "./pages/AdminPages/TeachersPage";
import AdminMaterialsPage from "./pages/AdminPages/MaterialPage";
import AdminStudentDisplay from "./pages/AdminPages/StudentDisplay";
import AdminBerita from "./pages/AdminPages/Berita";
import PreviewBerita from "./pages/AdminPages/previewBerita/preview";
import AddBerita from "./pages/AdminPages/AddBerita/AddBerita";
import EditBerita from "./pages/AdminPages/EditBerita/EditBerita";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <NewsProvider>
        <Toaster />
        <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/About" element={<About />} />
          <Route path="/VisiMisi" element={<VisiMisi />} />
          <Route path="/students" element={<Students />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/login" element={<LoginPages />} />
          <Route path="/register" element={<RegisterPages />} />
          <Route path="/admin" element={<AdminPage />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="profile" element={<AdminProfilePage />} />
            <Route path="AddStudents" element={<AddStudentsPage />} />
            <Route path="student-display" element={<AdminStudentDisplay />} />
            <Route path="teachers" element={<AdminTeachersPage />} />
            <Route path="materials" element={<AdminMaterialsPage />} />
            <Route path="berita" element={<AdminBerita />} />
            <Route path="berita/buatBerita" element={<AddBerita/>} />
            <Route path="berita/editBerita/:id" element={<EditBerita />} />
            <Route path="berita/preview/:id" element={<PreviewBerita />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </NewsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
