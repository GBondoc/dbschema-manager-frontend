import { Navigate } from "react-router";
import { useAuth } from "../auth/AuthContext";

export function HomeRedirect() {
  const { isAuthenticated } = useAuth();

  return (
    <Navigate
      to={isAuthenticated ? "/dashboard" : "/login"}
      replace
    />
  );
}