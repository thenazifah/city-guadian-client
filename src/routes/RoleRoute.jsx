import { Navigate, Outlet } from "react-router-dom";
import { ROLE_HOME_ROUTES } from "@/config/constants";
import { useAuth } from "@/hooks/useAuth";

export function RoleRoute({ allowedRoles }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={ROLE_HOME_ROUTES[user.role] || "/"} replace />;
  }

  return <Outlet />;
}
