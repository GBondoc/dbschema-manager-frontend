import { apiClient } from "@/api/api-client";

import type {
  CreateColumnPayload,
  DbColumn,
  UpdateColumnPayload,
} from "./column.types";

export async function getColumnsRequest(
  projectId: string,
  tableId: string,
): Promise<DbColumn[]> {
  const response = await apiClient.get<DbColumn[]>(
    `/projects/${projectId}/tables/${tableId}/columns`,
  );

  return response.data;
}

export async function createColumnRequest(
  projectId: string,
  tableId: string,
  payload: CreateColumnPayload,
): Promise<DbColumn> {
  const response = await apiClient.post<DbColumn>(
    `/projects/${projectId}/tables/${tableId}/columns`,
    payload,
  );

  return response.data;
}

export async function updateColumnRequest(
  projectId: string,
  tableId: string,
  columnId: string,
  payload: UpdateColumnPayload,
): Promise<DbColumn> {
  const response = await apiClient.patch<DbColumn>(
    `/projects/${projectId}/tables/${tableId}/columns/${columnId}`,
    payload,
  );

  return response.data;
}

export async function deleteColumnRequest(
  projectId: string,
  tableId: string,
  columnId: string,
): Promise<void> {
  await apiClient.delete(
    `/projects/${projectId}/tables/${tableId}/columns/${columnId}`,
  );
}