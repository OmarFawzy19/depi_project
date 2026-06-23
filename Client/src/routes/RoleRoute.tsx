import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/AuthContext";

type RoleRouteProps = {
  children: React.ReactNode;
  allowedRoles: string[];
};

const RoleRoute = ({ children, allowedRoles }: RoleRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RoleRoute;
