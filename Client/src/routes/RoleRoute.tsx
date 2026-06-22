import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/AuthContext";

type RoleRouteProps = {
  children: any;
  allowedRoles: string[];
};

const RoleRoute = ({ children, allowedRoles }: RoleRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 className="text-2xl font-bold text-red-600 mb-2">دخول مرفوض</h1>
        <p className="text-muted-foreground">
          عذراً، ليس لديك صلاحية للوصول إلى هذه الصفحة.
        </p>
      </div>
    );
  }

  return children;
};

export default RoleRoute;