import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "./useAuth";

export function RequireSuperAdmin() {
  const { user } = useAuth();

  if (user?.role !== "super_admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
