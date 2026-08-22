import { ProjectCard } from "./ProjectCard";

import type { Project } from "../../features/projects/project.types";

type ProjectsSectionProps = {
  title: string;
  description: string;
  projects: Project[];

  className?: string;

  onOpenProject: (
    project: Project,
  ) => void;

  onEditProject: (
    project: Project,
  ) => void;

  onDeleteProject: (
    project: Project,
  ) => void;
};

export function ProjectsSection({
  title,
  description,
  projects,
  className = "",

  onOpenProject,
  onEditProject,
  onDeleteProject,
}: ProjectsSectionProps) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <section
      className={className}
    >
      <div>
        <h2 className="text-xl font-semibold">
          {title}
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {projects.map(
          (project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpen={
                onOpenProject
              }
              onEdit={
                onEditProject
              }
              onDelete={
                onDeleteProject
              }
            />
          ),
        )}
      </div>
    </section>
  );
}