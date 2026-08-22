import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

type ProjectsPageHeaderProps = {
  onCreateProject: () => void;
};

export function ProjectsPageHeader({
  onCreateProject,
}: ProjectsPageHeaderProps) {
  return (
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
        onClick={onCreateProject}
      >
        <Plus className="size-4" />
        Proiect nou
      </Button>
    </section>
  );
}