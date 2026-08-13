import {
  Navigate,
  Route,
  Routes,
} from "react-router";

import { ProtectedRoute } from "../auth/ProtectedRoute";
import { PublicRoute } from "../auth/PublicRoute";

import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";

import { HomeRedirect } from "./HomeRedirect";

import { ProjectsPage } from "../pages/ProjectsPage";
import { ProjectPage } from "../pages/ProjectPage";

export function AppRouter() {
  return (
    <Routes>
      <Route
        path="/"
        element={<HomeRedirect />}
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
            <ProtectedRoute>
                <ProjectsPage />
            </ProtectedRoute>
        }
      />

      <Route
        path="/projects/:projectId"
        element={
          <ProtectedRoute>
            <ProjectPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}