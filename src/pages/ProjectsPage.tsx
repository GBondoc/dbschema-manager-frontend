import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import { useNavigate } from "react-router";
import {
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";

import { AppHeader } from "../components/AppHeader";

import {
  createProjectRequest,
  deleteProjectRequest,
  getProjectsRequest,
  updateProjectRequest,
} from "../features/projects/projects-api";

import type { Project } from "../features/projects/project.types";

import { Button } from "@/components/ui/button"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { AxiosError } from "axios";

export function ProjectsPage() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // CREATE
  const [showCreateForm, setShowCreateForm] =
    useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // EDIT
  const [editingProject, setEditingProject] =
    useState<Project | null>(null);

  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] =
    useState("");

  const [isUpdating, setIsUpdating] = useState(false);

  // DELETE
  const [deletingProject, setDeletingProject] =
    useState<Project | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    void loadProjects();
  }, []);

  async function loadProjects(): Promise<void> {
    setError("");
    setIsLoading(true);

    try {
      const data = await getProjectsRequest();
      setProjects(data);
    } catch {
      setError("Nu s-au putut încărca proiectele.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateProject(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    setError("");
    setIsCreating(true);

    try {
      const project = await createProjectRequest({
        name: name.trim(),
        description: description.trim() || undefined,
        dialect: "MYSQL",
      });

      setProjects((current) => [
        {
          ...project,
          accessRole: "OWNER",
        },
        ...current,
      ]);

      setName("");
      setDescription("");
      setShowCreateForm(false);
    } catch {
      setError("Nu s-a putut crea proiectul.");
    } finally {
      setIsCreating(false);
    }
  }

  function openEditProject(project: Project): void {
    setEditingProject(project);
    setEditName(project.name);
    setEditDescription(project.description ?? "");
  }

  async function handleUpdateProject(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!editingProject) {
      return;
    }

    setError("");
    setIsUpdating(true);

    try {
      const updatedProject =
        await updateProjectRequest(
          editingProject.id,
          {
            name: editName.trim(),
            description:
              editDescription.trim() || undefined,
          },
        );

      setProjects((current) =>
        current.map((project) =>
          project.id === updatedProject.id
            ? {
                ...updatedProject,
                accessRole: project.accessRole,
              }
            : project,
        ),
      );

      setEditingProject(null);
    } catch {
      setError(
        "Nu s-a putut actualiza proiectul.",
      );
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDeleteProject(): Promise<void> {
    if (!deletingProject) {
      return;
    }

    setError("");
    setIsDeleting(true);

    try {
      await deleteProjectRequest(
        deletingProject.id,
      );

      setProjects((current) =>
        current.filter(
          (project) =>
            project.id !== deletingProject.id,
        ),
      );

      setDeletingProject(null);
    } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 409) {
            setError(
              "Proiectul nu poate fi șters cât timp mai are membri. Elimină membrii proiectului sau așteaptă ca aceștia să părăsească proiectul.",
            );
            return;
          }
        }

        setError(
          "Nu s-a putut șterge proiectul.",
        );
    } finally {
      setIsDeleting(false);
    }
  }

  const ownedProjects = projects.filter(
    (project) => project.accessRole === "OWNER",
  );

  const sharedProjects = projects.filter(
    (project) => project.accessRole !== "OWNER",
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* PAGE HEADER */}
        <section className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Proiecte
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Creează proiecte proprii sau lucrează în proiectele
              partajate cu tine.
            </p>
          </div>

          <Button
            type="button"
            onClick={() =>
              setShowCreateForm(true)
            }
          >
            + Proiect nou
          </Button>
        </section>

        {/* CREATE DIALOG */}
        <Dialog
          open={showCreateForm}
          onOpenChange={(open) => {
            if (!isCreating) {
              setShowCreateForm(open);
            }
          }}
        >
          <DialogContent className="sm:max-w-lg">
            <DialogHeader className="gap-2">
              <DialogTitle>
                Creează un proiect
              </DialogTitle>

              <DialogDescription>
                Definește un nou spațiu de lucru
                pentru schema ta MySQL.
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={handleCreateProject}
              className="flex flex-col gap-5"
            >
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="project-name"
                  className="text-sm font-medium"
                >
                  Nume proiect
                </label>

                <Input
                  id="project-name"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Exemplu: Biblioteca școlii"
                  required
                />
              </div>

              <div className="flex flex-col gap-2.5">
                <label
                  htmlFor="project-description"
                  className="text-sm font-medium"
                >
                  Descriere
                </label>

                <Textarea
                  id="project-description"
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value,
                    )
                  }
                  placeholder="Descriere opțională"
                  rows={5}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isCreating}
                  onClick={() =>
                    setShowCreateForm(false)
                  }
                >
                  Anulează
                </Button>

                <Button
                  type="submit"
                  disabled={isCreating}
                >
                  {isCreating
                    ? "Se creează..."
                    : "Creează proiectul"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* EDIT DIALOG */}
        <Dialog
          open={editingProject !== null}
          onOpenChange={(open) => {
            if (!open && !isUpdating) {
              setEditingProject(null);
            }
          }}
        >
          <DialogContent className="sm:max-w-lg">
            <DialogHeader className="gap-2">
              <DialogTitle>
                Editează proiectul
              </DialogTitle>

              <DialogDescription>
                Modifică numele sau descrierea
                proiectului.
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={handleUpdateProject}
              className="flex flex-col gap-5"
            >
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="edit-project-name"
                  className="text-sm font-medium"
                >
                  Nume proiect
                </label>

                <Input
                  id="edit-project-name"
                  value={editName}
                  onChange={(event) =>
                    setEditName(
                      event.target.value,
                    )
                  }
                  required
                />
              </div>

              <div className="flex flex-col gap-2.5">
                <label
                  htmlFor="edit-project-description"
                  className="text-sm font-medium"
                >
                  Descriere
                </label>

                <Textarea
                  id="edit-project-description"
                  value={editDescription}
                  onChange={(event) =>
                    setEditDescription(
                      event.target.value,
                    )
                  }
                  placeholder="Descriere opțională"
                  rows={5}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isUpdating}
                  onClick={() =>
                    setEditingProject(null)
                  }
                >
                  Anulează
                </Button>

                <Button
                  type="submit"
                  disabled={isUpdating}
                >
                  {isUpdating
                    ? "Se salvează..."
                    : "Salvează modificările"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* DELETE CONFIRMATION */}
        <AlertDialog
          open={deletingProject !== null}
          onOpenChange={(open) => {
            if (!open && !isDeleting) {
              setDeletingProject(null);
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Ștergi proiectul?
              </AlertDialogTitle>

              <AlertDialogDescription>
                Proiectul{" "}
                <strong className="text-foreground">
                  {deletingProject?.name}
                </strong>{" "}
                va fi șters definitiv. Această
                acțiune nu poate fi anulată.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={isDeleting}
              >
                Anulează
              </AlertDialogCancel>

              <AlertDialogAction
                disabled={isDeleting}
                onClick={(event) => {
                  event.preventDefault();

                  void handleDeleteProject();
                }}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                {isDeleting
                  ? "Se șterge..."
                  : "Șterge proiectul"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* ERROR */}
        {error && (
          <div
            className="mt-8 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* LOADING */}
        {isLoading && (
          <div className="mt-12 text-sm text-muted-foreground">
            Se încarcă proiectele...
          </div>
        )}

        {/* EMPTY */}
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
                Proiectele tale vor apărea aici
                după ce creezi primul proiect.
              </p>
            </section>
          )}

        {/* OWNED PROJECTS */}
        {!isLoading && ownedProjects.length > 0 && (
          <section className="mt-10">
            <div>
              <h2 className="text-xl font-semibold">
                Proiectele mele
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Proiectele create și administrate de tine.
              </p>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {ownedProjects.map((project) => (
                <article
                  key={project.id}
                  className="group flex min-h-56 flex-col justify-between rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <span className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                        MySQL
                      </span>

                      <DropdownMenu>
                        <DropdownMenuTrigger
                          className="flex size-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                          aria-label="Opțiuni proiect"
                        >
                          <MoreVertical className="size-4" />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          align="end"
                          className="w-52"
                        >
                          <DropdownMenuGroup>
                            <DropdownMenuItem
                              onClick={() =>
                                openEditProject(project)
                              }
                            >
                              <Pencil className="size-4" />
                              Editează proiectul
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() =>
                                setDeletingProject(project)
                              }
                              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                            >
                              <Trash2 className="size-4" />
                              Șterge proiectul
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <h3 className="mt-5 break-words text-xl font-semibold">
                      {project.name}
                    </h3>

                    <p className="mt-2 line-clamp-3 break-words text-sm leading-6 text-muted-foreground">
                      {project.description ||
                        "Proiect fără descriere."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/projects/${project.id}`)
                    }
                    className="mt-6 w-fit cursor-pointer text-sm font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    Deschide proiectul →
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* SHARED PROJECTS */}
        {!isLoading && sharedProjects.length > 0 && (
          <section className="mt-12">
            <div>
              <h2 className="text-xl font-semibold">
                Partajate cu mine
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Proiectele în care ai fost invitat să colaborezi.
              </p>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {sharedProjects.map((project) => (
                <article
                  key={project.id}
                  className="group flex min-h-56 flex-col justify-between rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <span className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                        MySQL
                      </span>

                      <span className="rounded-md border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
                        {project.accessRole === "EDITOR"
                          ? "Editor"
                          : "Vizualizator"}
                      </span>
                    </div>

                    <h3 className="mt-5 break-words text-xl font-semibold">
                      {project.name}
                    </h3>

                    <p className="mt-2 line-clamp-3 break-words text-sm leading-6 text-muted-foreground">
                      {project.description ||
                        "Proiect fără descriere."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/projects/${project.id}`)
                    }
                    className="mt-6 w-fit cursor-pointer text-sm font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    Deschide proiectul →
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}