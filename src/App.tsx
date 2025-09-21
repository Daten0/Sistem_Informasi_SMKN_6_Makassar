import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import AdminStudentsPage from "./pages/AdminPages/StudentPage";
import AdminTeachersPage from "./pages/AdminPages/TeachersPage";
import AdminMaterialsPage from "./pages/AdminPages/MaterialPage";
import StudentDisplay from "./pages/AdminPages/PenampilStudent/StudentDisplay";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
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
          <Route path="/admin" element={<AdminPage />} >
            <Route index element={<AdminDashboardPage />} />
            <Route path="profile" element={<AdminProfilePage />} />
            <Route path="AddStudents" element={<AdminStudentsPage />} />
            <Route path="student-display" element={<StudentDisplay />} />
            <Route path="teachers" element={<AdminTeachersPage />} />
            <Route path="materials" element={<AdminMaterialsPage />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
