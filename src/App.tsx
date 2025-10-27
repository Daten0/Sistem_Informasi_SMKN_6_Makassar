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
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboardPage from "./pages/AdminPages/DashboardPage";
import AdminProfilePage from "./pages/AdminPages/ProfilePage";
import AddStudentsPage from "./pages/AdminPages/AddStudent/AddStudentPage";
import AdminTeachersPage from "./pages/AdminPages/TeachersPage";
import AdminMaterialsPage from "./pages/AdminPages/Akademik";
import AdminStudentDisplay from "./pages/AdminPages/StudentDisplay";
import AdminBerita from "./pages/AdminPages/Berita";
import PreviewBerita from "./pages/AdminPages/previewBerita/preview";
import AddBerita from "./pages/AdminPages/AddBerita/AddBerita";
import EditBerita from "./pages/AdminPages/EditBerita/EditBerita";
import BeritaPreview from "./pages/PreviewNews";
import AddSubject from "./components/Akademik/AddJurusan";
import AddCourse from "./components/Akademik/AddCourse";
import SemesterDetail1 from "./components/Akademik/SemesterDetail1";
import SemesterDetail2 from "./components/Akademik/SemesterDetail2";
import SemesterDetail3 from "./components/Akademik/SemesterDetail3";
import SemesterDetail4 from "./components/Akademik/SemesterDetail4";
import SemesterDetail5 from "./components/Akademik/SemesterDetail5";
import SemesterDetail6 from "./components/Akademik/SemesterDetail6";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <NewsProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/preview/:id" element={<BeritaPreview />} />
          <Route path="/About" element={<About />} />
          <Route path="/VisiMisi" element={<VisiMisi />} />
          <Route path="/students" element={<Students />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/login" element={<LoginPages />} />
          <Route path="/register" element={<RegisterPages />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="profile" element={<AdminProfilePage />} />
            <Route path="AddStudents" element={<AddStudentsPage />} />
            <Route path="student-display" element={<AdminStudentDisplay />} />
            <Route path="teachers" element={<AdminTeachersPage />} />
            <Route path="kejuruan" element={<AdminMaterialsPage />} />
            <Route path="kejuruan/add-kejuruan" element={<AddSubject />} />
            {/* Keep old route for fallback, but new dynamic route is preferred */}
            <Route
              path="kejuruan/:kejuruanId/add-course"
              element={<AddCourse />}
            />

            {/* Dynamic Routes for All Majors */}
            <Route
              path="kejuruan/:kejuruanId/semester/1"
              element={<SemesterDetail1 />}
            />
            <Route
              path="kejuruan/:kejuruanId/semester/2"
              element={<SemesterDetail2 />}
            />
            <Route
              path="kejuruan/:kejuruanId/semester/3"
              element={<SemesterDetail3 />}
            />
            <Route
              path="kejuruan/:kejuruanId/semester/4"
              element={<SemesterDetail4 />}
            />
            <Route
              path="kejuruan/:kejuruanId/semester/5"
              element={<SemesterDetail5 />}
            />
            <Route
              path="kejuruan/:kejuruanId/semester/6"
              element={<SemesterDetail6 />}
            />

            <Route path="berita" element={<AdminBerita />} />
            <Route path="berita/buatBerita" element={<AddBerita />} />
            <Route path="berita/editBerita/:id" element={<EditBerita />} />
            <Route path="berita/preview/:id" element={<PreviewBerita />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </NewsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
