import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "./useAuth";

export function ProtectedAdminRoute() {
  const { user, isLoading } = useAuth();

  const location = useLocation();

  if (isLoading) {
    return <div className="route-loading">CASA</div>;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  if (user.role !== "admin" && user.role !== "super_admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
