import { Users } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Project } from "../../features/projects/project.types";

type ProjectHeaderSectionProps = {
  project: Project;
  onOpenMembers: () => void;
};

export function ProjectHeaderSection({
  project,
  onOpenMembers,
}: ProjectHeaderSectionProps) {
  return (
    <section className="mt-8 flex items-start justify-between gap-6">
      <div>
        <span className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
          MySQL
        </span>

        <h1 className="mt-4 wrap-break-word text-3xl font-bold tracking-tight">
          {project.name}
        </h1>

        <p className="mt-2 max-w-3xl wrap-break-word text-sm leading-6 text-muted-foreground">
          {project.description ||
            "Proiect fără descriere."}
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={onOpenMembers}
      >
        <Users className="size-4" />
        Membrii proiectului
      </Button>
    </section>
  );
}