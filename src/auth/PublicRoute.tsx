import type { ReactNode } from "react";
import { Navigate } from "react-router";

import { useAuth } from "./AuthContext";

type PublicRouteProps = {
  children: ReactNode;
};

export function PublicRoute({
  children,
}: PublicRouteProps) {
  const {
    isAuthenticated,
    isLoading,
  } = useAuth();

  if (isLoading) {
    return <p>Se încarcă...</p>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}