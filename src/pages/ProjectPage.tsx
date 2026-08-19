import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router";

import { AppHeader } from "../components/AppHeader";
import { getProjectRequest } from "../features/projects/projects-api";

import type { Project } from "../features/projects/project.types";

import { ProjectMembersDialog } from "../components/ProjectMembersDialog";
import { Button } from "@/components/ui/button";

import { Users } from "lucide-react";

export function ProjectPage() {
  const { projectId } = useParams();

  const [project, setProject] =
    useState<Project | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [showMembers, setShowMembers] =
    useState(false);

  useEffect(() => {
    async function loadProject(): Promise<void> {
      if (!projectId) {
        setError("Proiect invalid.");
        setIsLoading(false);
        return;
      }

      try {
        const data = await getProjectRequest(projectId);
        setProject(data);
      } catch {
        setError("Proiectul nu a fost găsit.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadProject();
  }, [projectId]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <Link
          to="/dashboard"
          className="inline-flex text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Înapoi la proiecte
        </Link>

        {isLoading && (
          <div className="mt-10 text-sm text-muted-foreground">
            Se încarcă proiectul...
          </div>
        )}

        {error && (
          <div
            className="mt-8 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            role="alert"
          >
            {error}
          </div>
        )}

        {!isLoading && project && (
          <>
            <section className="mt-8 flex items-start justify-between gap-6">
              <div>
                <span className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  MySQL
                </span>

                <h1 className="mt-4 break-words text-3xl font-bold tracking-tight">
                  {project.name}
                </h1>

                <p className="mt-2 max-w-3xl break-words text-sm leading-6 text-muted-foreground">
                  {project.description ||
                    "Proiect fără descriere."}
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => setShowMembers(true)}
              >
                <Users className="size-4" />
                Membrii proiectului
              </Button>
            </section>

            <ProjectMembersDialog
              projectId={project.id}
              accessRole={project.accessRole}
              open={showMembers}
              onOpenChange={setShowMembers}
            />

            <section className="mt-10 rounded-xl border border-border bg-card p-6">
              <h2 className="text-xl font-semibold">
                Schema bazei de date
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Tabelele proiectului vor apărea aici.
              </p>
            </section>
          </>
        )}
      </main>
    </div>
  );
}