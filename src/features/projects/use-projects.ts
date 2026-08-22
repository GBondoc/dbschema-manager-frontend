import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { AxiosError } from "axios";

import {
  createProjectRequest,
  deleteProjectRequest,
  getProjectsRequest,
  updateProjectRequest,
} from "./projects-api";

import type { Project } from "./project.types";

type CreateProjectInput = {
  name: string;
  description?: string;
};

type UpdateProjectInput = {
  name: string;
  description?: string;
};

export function useProjects() {
  const [projects, setProjects] =
    useState<Project[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProjects(): Promise<void> {
      setError("");
      setIsLoading(true);

      try {
        const data =
          await getProjectsRequest();

        if (!cancelled) {
          setProjects(data);
        }
      } catch {
        if (!cancelled) {
          setError(
            "Nu s-au putut încărca proiectele.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadProjects();

    return () => {
      cancelled = true;
    };
  }, []);

  const ownedProjects =
    useMemo(
      () =>
        projects.filter(
          (project) =>
            project.accessRole === "OWNER",
        ),
      [projects],
    );

  const sharedProjects =
    useMemo(
      () =>
        projects.filter(
          (project) =>
            project.accessRole !== "OWNER",
        ),
      [projects],
    );

  async function createProject(
    input: CreateProjectInput,
  ): Promise<Project> {
    setError("");

    try {
      const created =
        await createProjectRequest({
          name: input.name,
          description:
            input.description,
          dialect: "MYSQL",
        });

      const project: Project = {
        ...created,
        accessRole: "OWNER",
      };

      setProjects((current) => [
        project,
        ...current,
      ]);

      return project;
    } catch (error) {
      setError(
        "Nu s-a putut crea proiectul.",
      );

      throw error;
    }
  }

  async function updateProject(
    projectId: string,
    input: UpdateProjectInput,
  ): Promise<Project> {
    setError("");

    try {
      const updated =
        await updateProjectRequest(
          projectId,
          input,
        );

      let result: Project | null =
        null;

      setProjects((current) =>
        current.map((project) => {
          if (
            project.id !== projectId
          ) {
            return project;
          }

          result = {
            ...updated,
            accessRole:
              project.accessRole,
          };

          return result;
        }),
      );

      return (
        result ?? {
          ...updated,
          accessRole: "OWNER",
        }
      );
    } catch (error) {
      setError(
        "Nu s-a putut actualiza proiectul.",
      );

      throw error;
    }
  }

  async function deleteProject(
    projectId: string,
  ): Promise<void> {
    setError("");

    try {
      await deleteProjectRequest(
        projectId,
      );

      setProjects((current) =>
        current.filter(
          (project) =>
            project.id !== projectId,
        ),
      );
    } catch (error) {
      if (
        error instanceof AxiosError &&
        error.response?.status === 409
      ) {
        setError(
          "Proiectul nu poate fi șters cât timp mai are membri. Elimină membrii proiectului sau așteaptă ca aceștia să părăsească proiectul.",
        );

        throw error;
      }

      setError(
        "Nu s-a putut șterge proiectul.",
      );

      throw error;
    }
  }

  return {
    projects,
    ownedProjects,
    sharedProjects,

    isLoading,
    error,

    createProject,
    updateProject,
    deleteProject,
  };
}