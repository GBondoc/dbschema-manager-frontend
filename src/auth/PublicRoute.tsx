import type { ReactNode } from "react";
import {
  Navigate,
  useLocation,
} from "react-router";

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

  const location = useLocation();

  const locationState = location.state as {
    from?: string;
  } | null;

  const redirectTo =
    locationState?.from ?? "/dashboard";

  if (isLoading) {
    return <p>Se încarcă...</p>;
  }

  if (isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        replace
      />
    );
  }

  return children;
}