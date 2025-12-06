import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { currentUser, userRole, loading } = useAuth();
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // Simple timeout - if auth takes too long, redirect to login
  useEffect(() => {
    if (!loading) {
      // Auth finished loading, clear any pending timeouts
      setLoadingTimeout(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      console.warn("Auth loading took too long - redirecting to login");
      setLoadingTimeout(true);
    }, 8000); // 8 second timeout

    return () => clearTimeout(timeoutId);
  }, [loading]);

  // Loading state
  if (loading && !loadingTimeout) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Validating session...</p>
        </div>
      </div>
    );
  }

  // If timeout or not authenticated
  if (!currentUser || loadingTimeout) {
    return <Navigate to="/login" replace />;
  }

  // If not admin user
  if (userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;