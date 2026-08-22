import {
  useState,
} from "react";

import { useNavigate } from "react-router";

import { AppHeader } from "../components/AppHeader";

import { PageContainer } from "../layouts/PageContainer";

import { ProjectsPageHeader } from "../components/projects/ProjectsPageHeader";
import { ProjectsSection } from "../components/projects/ProjectsSection";
import { ProjectDialogs } from "../components/projects/ProjectDialogs";

import { useProjects } from "../features/projects/use-projects";

import type { Project } from "../features/projects/project.types";

export function ProjectsPage() {
  const navigate =
    useNavigate();

  const {
    projects,
    ownedProjects,
    sharedProjects,

    isLoading,
    error,

    createProject,
    updateProject,
    deleteProject,
  } = useProjects();

  const [
    showCreateProject,
    setShowCreateProject,
  ] = useState(false);

  const [
    editingProject,
    setEditingProject,
  ] =
    useState<Project | null>(
      null,
    );

  const [
    deletingProject,
    setDeletingProject,
  ] =
    useState<Project | null>(
      null,
    );

  function openProject(
    project: Project,
  ): void {
    navigate(
      `/projects/${project.id}`,
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />

      <main className="py-8">
        <PageContainer className="px-8 lg:px-12">
          <ProjectsPageHeader
            onCreateProject={() =>
              setShowCreateProject(
                true,
              )
            }
          />

          {error && (
            <div
              className="mt-8 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              role="alert"
            >
              {error}
            </div>
          )}

          {isLoading && (
            <div className="mt-12 text-sm text-muted-foreground">
              Se încarcă proiectele...
            </div>
          )}

          {!isLoading &&
            projects.length === 0 && (
              <section className="mt-16 flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-5 flex size-16 items-center justify-center rounded-2xl border border-border bg-card text-lg font-bold text-muted-foreground">
                  DB
                </div>

                <h2 className="text-xl font-semibold">
                  Nu ai încă niciun proiect
                </h2>

                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  Proiectele tale vor apărea aici după ce creezi primul proiect.
                </p>
              </section>
            )}

          {!isLoading && (
            <>
              <ProjectsSection
                title="Proiectele mele"
                description="Proiectele create și administrate de tine."
                projects={
                  ownedProjects
                }
                className="mt-10"
                onOpenProject={
                  openProject
                }
                onEditProject={
                  setEditingProject
                }
                onDeleteProject={
                  setDeletingProject
                }
              />

              <ProjectsSection
                title="Proiecte partajate cu mine"
                description="Proiectele în care ai fost invitat să colaborezi."
                projects={
                  sharedProjects
                }
                className="mt-12"
                onOpenProject={
                  openProject
                }
                onEditProject={
                  setEditingProject
                }
                onDeleteProject={
                  setDeletingProject
                }
              />
            </>
          )}

          <ProjectDialogs
            createOpen={
              showCreateProject
            }
            onCreateOpenChange={
              setShowCreateProject
            }
            editingProject={
              editingProject
            }
            onEditingProjectChange={
              setEditingProject
            }
            deletingProject={
              deletingProject
            }
            onDeletingProjectChange={
              setDeletingProject
            }
            onCreate={
              createProject
            }
            onUpdate={
              updateProject
            }
            onDelete={
              deleteProject
            }
          />
        </PageContainer>
      </main>
    </div>
  );
}