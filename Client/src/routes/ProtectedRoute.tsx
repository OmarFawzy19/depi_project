import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/AuthContext";

const ProtectedRoute = ({ children }: any) => {
  const { user } = useAuth();

  // ❌ not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ logged in
  return children;
};

export default ProtectedRoute;