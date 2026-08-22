import {
  useEffect,
  useState,
} from "react";

import {
  createColumnRequest,
  deleteColumnRequest,
  getColumnsRequest,
  updateColumnRequest,
} from "./column-api";

import type {
  CreateColumnPayload,
  DbColumn,
  UpdateColumnPayload,
} from "./column.types";

export function useTableColumns(
  projectId: string | undefined,
  tableId: string | null,
) {
  const [columns, setColumns] =
    useState<DbColumn[]>([]);

  const [isLoadingColumns, setIsLoadingColumns] =
    useState(false);

  const [columnError, setColumnError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadColumns(): Promise<void> {
      if (!projectId || !tableId) {
        setColumns([]);
        setColumnError("");
        return;
      }

      setIsLoadingColumns(true);
      setColumnError("");

      try {
        const data =
          await getColumnsRequest(
            projectId,
            tableId,
          );

        if (!cancelled) {
          setColumns(data);
        }
      } catch {
        if (!cancelled) {
          setColumnError(
            "Nu s-au putut încărca coloanele tabelului.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingColumns(false);
        }
      }
    }

    void loadColumns();

    return () => {
      cancelled = true;
    };
  }, [projectId, tableId]);

  async function createColumn(
    payload: CreateColumnPayload,
  ): Promise<DbColumn> {
    if (!projectId || !tableId) {
      throw new Error(
        "Project or table ID missing",
      );
    }

    setColumnError("");

    try {
      const created =
        await createColumnRequest(
          projectId,
          tableId,
          payload,
        );

      setColumns((current) => [
        ...current,
        created,
      ]);

      return created;
    } catch (error) {
      setColumnError(
        "Nu s-a putut crea coloana.",
      );

      throw error;
    }
  }

  async function updateColumn(
    columnId: string,
    payload: UpdateColumnPayload,
  ): Promise<DbColumn> {
    if (!projectId || !tableId) {
      throw new Error(
        "Project or table ID missing",
      );
    }

    setColumnError("");

    try {
      const updated =
        await updateColumnRequest(
          projectId,
          tableId,
          columnId,
          payload,
        );

      setColumns((current) =>
        current.map((column) =>
          column.id === updated.id
            ? updated
            : column,
        ),
      );

      return updated;
    } catch (error) {
      setColumnError(
        "Nu s-a putut actualiza coloana.",
      );

      throw error;
    }
  }

  async function deleteColumn(
    columnId: string,
  ): Promise<void> {
    if (!projectId || !tableId) {
      throw new Error(
        "Project or table ID missing",
      );
    }

    setColumnError("");

    try {
      await deleteColumnRequest(
        projectId,
        tableId,
        columnId,
      );

      setColumns((current) =>
        current.filter(
          (column) =>
            column.id !== columnId,
        ),
      );
    } catch (error) {
      setColumnError(
        "Nu s-a putut șterge coloana.",
      );

      throw error;
    }
  }

  return {
    columns,
    isLoadingColumns,
    columnError,

    createColumn,
    updateColumn,
    deleteColumn,
  };
}