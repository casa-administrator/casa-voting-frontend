import type { ReactNode } from "react";

import { Navigate } from "react-router-dom";

import { useAuth } from "./useAuth";

export function RequirePermission({
  permission,
  children,
}: {
  permission: string;

  children: ReactNode;
}) {
  const { hasPermission } = useAuth();

  if (!hasPermission(permission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
