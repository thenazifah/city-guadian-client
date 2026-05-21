import { Navigate, Outlet } from "react-router-dom";
import { ROLE_HOME_ROUTES } from "@/config/constants";
import { useAuth } from "@/hooks/useAuth";

function AuthLoadingScreen() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />
    </div>
  );
}

export function GuestRoute() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (isAuthenticated && user) {
    return <Navigate to={ROLE_HOME_ROUTES[user.role] || "/"} replace />;
  }

  return <Outlet />;
}
