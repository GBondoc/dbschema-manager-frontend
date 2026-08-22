import { apiClient } from "../../api/api-client";

import type {
  PrimaryKey,
  PrimaryKeyResponse,
  SetPrimaryKeyPayload,
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
