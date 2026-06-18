import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/AuthContext";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAuth();
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!user && !token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
          authMessage: "You must login first",
        }}
      />
    );
  }

  return children;
};

export default ProtectedRoute;
