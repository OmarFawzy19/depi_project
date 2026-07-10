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

  const role = String(user.role || "user").toLowerCase().trim();
  const normalizedAllowedRoles = allowedRoles.map(r => String(r).toLowerCase().trim());

  if (!normalizedAllowedRoles.includes(role)) {
    if (role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RoleRoute;
