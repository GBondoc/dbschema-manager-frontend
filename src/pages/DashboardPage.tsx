import { UserMenu } from "../components/UserMenu";

export function DashboardPage() {
  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="app-brand">
            <div className="app-brand-logo">DB</div>

            <div className="app-brand-text">
                <strong>DB Schema Manager</strong>
                <span>MySQL Learning Workspace</span>
            </div>
        </div>

        <UserMenu />
      </header>

      <main className="dashboard-content">
        <h2>Dashboard</h2>
      </main>
    </div>
  );
}