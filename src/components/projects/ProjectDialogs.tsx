import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

import type { Project } from "../../features/projects/project.types";

type ProjectDialogsProps = {
  createOpen: boolean;

  onCreateOpenChange: (
    open: boolean,
  ) => void;

  editingProject:
    | Project
    | null;

  onEditingProjectChange: (
    project: Project | null,
  ) => void;

  deletingProject:
    | Project
    | null;

  onDeletingProjectChange: (
    project: Project | null,
  ) => void;

  onCreate: (input: {
    name: string;
    description?: string;
  }) => Promise<unknown>;

  onUpdate: (
    projectId: string,
    input: {
      name: string;
      description?: string;
    },
  ) => Promise<unknown>;

  onDelete: (
    projectId: string,
  ) => Promise<void>;
};

export function ProjectDialogs({
  createOpen,
  onCreateOpenChange,

  editingProject,
  onEditingProjectChange,

  deletingProject,
  onDeletingProjectChange,

  onCreate,
  onUpdate,
  onDelete,
}: ProjectDialogsProps) {
  const [name, setName] =
    useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    editName,
    setEditName,
  ] = useState("");

  const [
    editDescription,
    setEditDescription,
  ] = useState("");

  const [isCreating, setIsCreating] =
    useState(false);

  const [isUpdating, setIsUpdating] =
    useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  useEffect(() => {
    if (!editingProject) {
      setEditName("");
      setEditDescription("");
      return;
    }

    setEditName(
      editingProject.name,
    );

    setEditDescription(
      editingProject.description ??
        "",
    );
  }, [editingProject]);

  async function handleCreate(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    const trimmedName =
      name.trim();

    if (!trimmedName) {
      return;
    }

    setIsCreating(true);

    try {
      await onCreate({
        name: trimmedName,
        description:
          description.trim() ||
          undefined,
      });

      setName("");
      setDescription("");

      onCreateOpenChange(false);
    } finally {
      setIsCreating(false);
    }
  }

  async function handleUpdate(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!editingProject) {
      return;
    }

    const trimmedName =
      editName.trim();

    if (!trimmedName) {
      return;
    }

    setIsUpdating(true);

    try {
      await onUpdate(
        editingProject.id,
        {
          name: trimmedName,
          description:
            editDescription.trim() ||
            undefined,
        },
      );

      onEditingProjectChange(
        null,
      );
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDelete(): Promise<void> {
    if (!deletingProject) {
      return;
    }

    setIsDeleting(true);

    try {
      await onDelete(
        deletingProject.id,
      );

      onDeletingProjectChange(
        null,
      );
    } catch {
      // Mesajul de eroare este gestionat
      // de useProjects().
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Dialog
        open={createOpen}
        onOpenChange={(open) => {
          if (isCreating) {
            return;
          }

          onCreateOpenChange(open);

          if (!open) {
            setName("");
            setDescription("");
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader className="gap-2">
            <DialogTitle>
              Creează un proiect
            </DialogTitle>

            <DialogDescription>
              Definește un nou spațiu de lucru pentru schema ta MySQL.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={
              handleCreate
            }
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
                  setName(
                    event.target.value,
                  )
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
                disabled={
                  isCreating
                }
                onClick={() =>
                  onCreateOpenChange(
                    false,
                  )
                }
              >
                Anulează
              </Button>

              <Button
                type="submit"
                disabled={
                  isCreating ||
                  !name.trim()
                }
              >
                {isCreating
                  ? "Se creează..."
                  : "Creează proiectul"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={
          editingProject !== null
        }
        onOpenChange={(open) => {
          if (
            !open &&
            !isUpdating
          ) {
            onEditingProjectChange(
              null,
            );
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader className="gap-2">
            <DialogTitle>
              Editează proiectul
            </DialogTitle>

            <DialogDescription>
              Modifică numele sau descrierea proiectului.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={
              handleUpdate
            }
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
                value={
                  editDescription
                }
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
                disabled={
                  isUpdating
                }
                onClick={() =>
                  onEditingProjectChange(
                    null,
                  )
                }
              >
                Anulează
              </Button>

              <Button
                type="submit"
                disabled={
                  isUpdating ||
                  !editName.trim()
                }
              >
                {isUpdating
                  ? "Se salvează..."
                  : "Salvează modificările"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={
          deletingProject !== null
        }
        onOpenChange={(open) => {
          if (
            !open &&
            !isDeleting
          ) {
            onDeletingProjectChange(
              null,
            );
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
              va fi șters definitiv. Această acțiune nu poate fi anulată.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={
                isDeleting
              }
            >
              Anulează
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={
                isDeleting
              }
              onClick={(event) => {
                event.preventDefault();

                void handleDelete();
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
    </>
  );
}