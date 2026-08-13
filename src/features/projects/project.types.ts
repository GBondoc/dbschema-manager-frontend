export type Project = {
  id: string;
  ownerUserId: string;
  name: string;
  description: string | null;
  dialect: string;
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
};

export type CreateProjectRequest = {
  name: string;
  description?: string;
  dialect: "MYSQL";
};

export type UpdateProjectRequest = {
  name?: string;
  description?: string;
};