import { apiClient } from "../../api/api-client";

import type {
  PrimaryKey,
  PrimaryKeyResponse,
  SetPrimaryKeyPayload,
} from "./constraint.types";

import type {
  CreateForeignKeyPayload,
  ForeignKey,
  UpdateForeignKeyPayload,
} from "./constraint.types";

export async function getPrimaryKeyRequest(
  projectId: string,
  tableId: string,
): Promise<PrimaryKey | null> {
  const response =
    await apiClient.get<PrimaryKeyResponse>(
      `/projects/${projectId}/tables/${tableId}/constraints/primary-key`,
    );

  return response.data.primaryKey;
}

export async function setPrimaryKeyRequest(
  projectId: string,
  tableId: string,
  payload: SetPrimaryKeyPayload,
): Promise<PrimaryKey> {
  const response =
    await apiClient.put<PrimaryKeyResponse>(
      `/projects/${projectId}/tables/${tableId}/constraints/primary-key`,
      payload,
    );

  if (!response.data.primaryKey) {
    throw new Error(
      "Primary key was not returned by the server.",
    );
  }

  return response.data.primaryKey;
}

export async function deletePrimaryKeyRequest(
  projectId: string,
  tableId: string,
): Promise<void> {
  await apiClient.delete(
    `/projects/${projectId}/tables/${tableId}/constraints/primary-key`,
  );
}

export async function getForeignKeysRequest(
  projectId: string,
  tableId: string,
): Promise<ForeignKey[]> {
  const response = await apiClient.get<ForeignKey[]>(
    `/projects/${projectId}/tables/${tableId}/constraints/foreign-keys`,
  );

  return response.data;
}

export async function createForeignKeyRequest(
  projectId: string,
  tableId: string,
  payload: CreateForeignKeyPayload,
): Promise<ForeignKey[]> {
  const response = await apiClient.post<ForeignKey[]>(
    `/projects/${projectId}/tables/${tableId}/constraints/foreign-keys`,
    payload,
  );

  return response.data;
}

export async function updateForeignKeyRequest(
  projectId: string,
  tableId: string,
  constraintId: string,
  payload: UpdateForeignKeyPayload,
): Promise<ForeignKey[]> {
  const response = await apiClient.patch<ForeignKey[]>(
    `/projects/${projectId}/tables/${tableId}/constraints/foreign-keys/${constraintId}`,
    payload,
  );

  return response.data;
}

export async function deleteForeignKeyRequest(
  projectId: string,
  tableId: string,
  constraintId: string,
): Promise<void> {
  await apiClient.delete(
    `/projects/${projectId}/tables/${tableId}/constraints/foreign-keys/${constraintId}`,
  );
}