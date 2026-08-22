import { apiClient } from "@/api/api-client";

import type {
  CreateTablePayload,
  DbTable,
  UpdateTablePayload,
} from "./table.types";

export async function getTablesRequest(
  projectId: string,
): Promise<DbTable[]> {
  const response = await apiClient.get<DbTable[]>(
    `/projects/${projectId}/tables`,
  );

  return response.data;
}

export async function createTableRequest(
  projectId: string,
  payload: CreateTablePayload,
): Promise<DbTable> {
  const response = await apiClient.post<DbTable>(
    `/projects/${projectId}/tables`,
    payload,
  );

  return response.data;
}

export async function updateTableRequest(
  projectId: string,
  tableId: string,
  payload: UpdateTablePayload,
): Promise<DbTable> {
  const response = await apiClient.patch<DbTable>(
    `/projects/${projectId}/tables/${tableId}`,
    payload,
  );

  return response.data;
}

export async function deleteTableRequest(
  projectId: string,
  tableId: string,
): Promise<void> {
  await apiClient.delete(
    `/projects/${projectId}/tables/${tableId}`,
  );
}