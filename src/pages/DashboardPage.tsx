import { useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";

export function DashboardPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout(): Promise<void> {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <main>
      <h1>Dashboard</h1>

      <button type="button" onClick={handleLogout}>
        Logout
      </button>
    </main>
  );
}