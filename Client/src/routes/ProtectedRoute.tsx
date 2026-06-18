import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/AuthContext";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAuth();

  const token = localStorage.getItem("token");

  if (!user && !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
