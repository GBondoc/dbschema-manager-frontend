import {
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Project } from "../../features/projects/project.types";

type ProjectCardProps = {
  project: Project;

  onOpen: (
    project: Project,
  ) => void;

  onEdit: (
    project: Project,
  ) => void;

  onDelete: (
    project: Project,
  ) => void;
};

function getRoleLabel(
  role: Project["accessRole"],
): string {
  if (role === "EDITOR") {
    return "Editor";
  }

  if (role === "VIEWER") {
    return "Vizualizator";
  }

  return "Proprietar";
}

export function ProjectCard({
  project,
  onOpen,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const isOwner =
    project.accessRole === "OWNER";

  return (
    <article className="group flex min-h-56 flex-col justify-between rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50">
      <div>
        <div className="flex items-start justify-between gap-4">
          <span className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            MySQL
          </span>

          {isOwner ? (
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
                      onEdit(project)
                    }
                  >
                    <Pencil className="size-4" />
                    Editează proiectul
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() =>
                      onDelete(project)
                    }
                    className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                  >
                    <Trash2 className="size-4" />
                    Șterge proiectul
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <span className="rounded-md border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
              {getRoleLabel(
                project.accessRole,
              )}
            </span>
          )}
        </div>

        <h3 className="mt-5 wrap-break-word text-xl font-semibold">
          {project.name}
        </h3>

        <p className="mt-2 line-clamp-3 wrap-break-word text-sm leading-6 text-muted-foreground">
          {project.description ||
            "Proiect fără descriere."}
        </p>
      </div>

      <button
        type="button"
        onClick={() =>
          onOpen(project)
        }
        className="mt-6 w-fit cursor-pointer text-sm font-medium text-primary transition-colors hover:text-primary/80"
      >
        Deschide proiectul →
      </button>
    </article>
  );
}