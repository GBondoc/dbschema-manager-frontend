import { apiClient } from "../../api/api-client";

import type {
  CreateProjectInviteData,
  ProjectInvite,
  ProjectMember,
} from "./project-member.types";

export async function getProjectMembersRequest(
  projectId: string,
): Promise<ProjectMember[]> {
  const response =
    await apiClient.get<ProjectMember[]>(
      `/projects/${projectId}/members`,
    );

  return response.data;
}

export async function getProjectInvitesRequest(
  projectId: string,
): Promise<ProjectInvite[]> {
  const response =
    await apiClient.get<ProjectInvite[]>(
      `/projects/${projectId}/invites`,
    );

  return response.data;
}

export async function createProjectInviteRequest(
  projectId: string,
  data: CreateProjectInviteData,
): Promise<ProjectInvite> {
  const response =
    await apiClient.post<ProjectInvite>(
      `/projects/${projectId}/invites`,
      data,
    );

  return response.data;
}

export async function revokeProjectInviteRequest(
  projectId: string,
  inviteId: string,
): Promise<void> {
  await apiClient.patch(
    `/projects/${projectId}/invites/${inviteId}/revoke`,
  );
}

export type ProjectInvitePreview = {
  projectId: string;
  projectName: string;
  role: "EDITOR" | "VIEWER";
  expiresAt: string;
};

export async function getProjectInviteRequest(
  token: string,
): Promise<ProjectInvitePreview> {
  const response =
    await apiClient.get<ProjectInvitePreview>(
      `/project-invites/${token}`,
    );

  return response.data;
}

export async function acceptProjectInviteRequest(
  token: string,
): Promise<{
  projectId: string;
  projectName: string;
  role: "EDITOR" | "VIEWER";
}> {
  const response =
    await apiClient.post(
      `/project-invites/${token}/accept`,
    );

  return response.data;
}

export async function updateProjectMemberRoleRequest(
  projectId: string,
  memberId: string,
  role: "EDITOR" | "VIEWER",
): Promise<ProjectMember> {
  const response =
    await apiClient.patch<ProjectMember>(
      `/projects/${projectId}/members/${memberId}`,
      {
        role,
      },
    );

  return response.data;
}

export async function removeProjectMemberRequest(
  projectId: string,
  memberId: string,
): Promise<void> {
  await apiClient.delete(
    `/projects/${projectId}/members/${memberId}`,
  );
}

export async function leaveProjectRequest(
  projectId: string,
): Promise<void> {
  await apiClient.delete(
    `/projects/${projectId}/members/me`,
  );
}