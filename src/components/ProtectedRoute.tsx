import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a proper spinner component
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (userRole !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;