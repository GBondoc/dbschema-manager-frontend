import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createTableRequest,
  deleteTableRequest,
  getTablesRequest,
  updateTableRequest,
} from "./table-api";

import type { DbTable } from "./table.types";

export function useProjectTables(
  projectId: string | undefined,
) {
  const [tables, setTables] =
    useState<DbTable[]>([]);

  const [selectedTableId, setSelectedTableId] =
    useState<string | null>(null);

  const [isLoadingTables, setIsLoadingTables] =
    useState(false);

  const [tableError, setTableError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadTables(): Promise<void> {
      if (!projectId) {
        setTables([]);
        setSelectedTableId(null);
        return;
      }

      setIsLoadingTables(true);
      setTableError("");

      try {
        const data =
          await getTablesRequest(projectId);

        if (cancelled) {
          return;
        }

        setTables(data);

        setSelectedTableId((current) => {
          if (
            current &&
            data.some(
              (table) =>
                table.id === current,
            )
          ) {
            return current;
          }

          return data[0]?.id ?? null;
        });
      } catch {
        if (!cancelled) {
          setTableError(
            "Nu s-au putut încărca tabelele proiectului.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingTables(false);
        }
      }
    }

    void loadTables();

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const selectedTable =
    useMemo(
      () =>
        tables.find(
          (table) =>
            table.id === selectedTableId,
        ) ?? null,
      [tables, selectedTableId],
    );

  async function createTable(
    name: string,
  ): Promise<DbTable> {
    if (!projectId) {
      throw new Error("Project ID missing");
    }

    setTableError("");

    try {
      const created =
        await createTableRequest(
          projectId,
          {
            name,
          },
        );

      setTables((current) => [
        ...current,
        created,
      ]);

      setSelectedTableId(created.id);

      return created;
    } catch (error) {
      setTableError(
        "Nu s-a putut crea tabelul.",
      );

      throw error;
    }
  }

  async function updateTable(
    tableId: string,
    name: string,
  ): Promise<DbTable> {
    if (!projectId) {
      throw new Error("Project ID missing");
    }

    setTableError("");

    try {
      const updated =
        await updateTableRequest(
          projectId,
          tableId,
          {
            name,
          },
        );

      setTables((current) =>
        current.map((table) =>
          table.id === updated.id
            ? updated
            : table,
        ),
      );

      return updated;
    } catch (error) {
      setTableError(
        "Nu s-a putut actualiza tabelul.",
      );

      throw error;
    }
  }

  async function deleteTable(
    tableId: string,
  ): Promise<void> {
    if (!projectId) {
      throw new Error("Project ID missing");
    }

    setTableError("");

    try {
      await deleteTableRequest(
        projectId,
        tableId,
      );

      setTables((current) => {
        const remaining =
          current.filter(
            (table) =>
              table.id !== tableId,
          );

        if (
          selectedTableId === tableId
        ) {
          setSelectedTableId(
            remaining[0]?.id ?? null,
          );
        }

        return remaining;
      });
    } catch (error) {
      setTableError(
        "Nu s-a putut șterge tabelul.",
      );

      throw error;
    }
  }

  return {
    tables,
    selectedTable,
    selectedTableId,
    setSelectedTableId,

    isLoadingTables,
    tableError,

    createTable,
    updateTable,
    deleteTable,
  };
}