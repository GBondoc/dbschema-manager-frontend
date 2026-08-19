export type ProjectMemberRole =
  | "OWNER"
  | "EDITOR"
  | "VIEWER";

export type ProjectMember = {
  id: string | null;
  userId: string;
  displayedName: string | null;
  role: ProjectMemberRole;
};

export type ProjectInviteRole =
  | "EDITOR"
  | "VIEWER";

export type ProjectInvite = {
  id: string;
  token: string;
  role: ProjectInviteRole;
  expiresAt: string;
  revoked?: boolean;
  createdAt?: string;
};

export type CreateProjectInviteData = {
  role: ProjectInviteRole;
  expiresInMinutes: number;
};
