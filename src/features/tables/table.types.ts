export type DbTable = {
  id: string;
  projectId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type CreateTablePayload = {
  name: string;
};

export type UpdateTablePayload = {
  name?: string;
};