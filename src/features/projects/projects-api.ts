import { apiClient } from "../../api/api-client";

import type {
  CreateProjectRequest,
  Project,
} from "./project.types";

export async function getProjectsRequest(): Promise<Project[]> {
  const response = await apiClient.get<Project[]>("/projects");

  return response.data;
}

export async function createProjectRequest(
  data: CreateProjectRequest,
): Promise<Project> {
  const response = await apiClient.post<Project>(
    "/projects",
    data,
  );

  return response.data;
}

export async function getProjectRequest(
  id: string,
): Promise<Project> {
  const response = await apiClient.get<Project>(
    `/projects/${id}`,
  );

  return response.data;
}

export type UpdateProjectRequest = {
  name?: string;
  description?: string;
};

export async function updateProjectRequest(
  id: string,
  data: UpdateProjectRequest,
): Promise<Project> {
  const response = await apiClient.patch<Project>(
    `/projects/${id}`,
    data,
  );

  return response.data;
}

export async function deleteProjectRequest(
  id: string,
): Promise<void> {
  await apiClient.delete(`/projects/${id}`);
}