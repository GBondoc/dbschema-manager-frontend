import type { ReactNode } from "react";
import { Navigate } from "react-router";

import { useAuth } from "./AuthContext";

type PublicRouteProps = {
  children: ReactNode;
};

export function PublicRoute({
  children,
}: PublicRouteProps) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}