import {
  useEffect,
  useState,
} from "react";

import {
  createForeignKeyRequest,
  deleteForeignKeyRequest,
  getForeignKeysRequest,
  updateForeignKeyRequest,
} from "./constraint-api";

import type {
  CreateForeignKeyPayload,
  ForeignKey,
  UpdateForeignKeyPayload,
} from "./constraint.types";

export function useForeignKeys(
  projectId: string | undefined,
  tableId: string | null,
) {
  const [foreignKeys, setForeignKeys] =
    useState<ForeignKey[]>([]);

  const [isLoadingForeignKeys, setIsLoadingForeignKeys] =
    useState(false);

  const [foreignKeyError, setForeignKeyError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadForeignKeys(): Promise<void> {
      if (!projectId || !tableId) {
        setForeignKeys([]);
        setForeignKeyError("");
        return;
      }

      setIsLoadingForeignKeys(true);
      setForeignKeyError("");

      try {
        const data =
          await getForeignKeysRequest(
            projectId,
            tableId,
          );

        if (!cancelled) {
          setForeignKeys(data);
        }
      } catch {
        if (!cancelled) {
          setForeignKeyError(
            "Nu s-au putut încărca cheile străine.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingForeignKeys(false);
        }
      }
    }

    void loadForeignKeys();

    return () => {
      cancelled = true;
    };
  }, [projectId, tableId]);

  async function createForeignKey(
    payload: CreateForeignKeyPayload,
  ): Promise<ForeignKey[]> {
    if (!projectId || !tableId) {
      throw new Error(
        "Project or table ID missing",
      );
    }

    setForeignKeyError("");

    try {
      const updatedForeignKeys =
        await createForeignKeyRequest(
          projectId,
          tableId,
          payload,
        );

      setForeignKeys(
        updatedForeignKeys,
      );

      return updatedForeignKeys;
    } catch (error) {
      setForeignKeyError(
        "Nu s-a putut crea cheia străină.",
      );

      throw error;
    }
  }

  async function updateForeignKey(
    constraintId: string,
    payload: UpdateForeignKeyPayload,
  ): Promise<ForeignKey[]> {
    if (!projectId || !tableId) {
      throw new Error(
        "Project or table ID missing",
      );
    }

    setForeignKeyError("");

    try {
      const updatedForeignKeys =
        await updateForeignKeyRequest(
          projectId,
          tableId,
          constraintId,
          payload,
        );

      setForeignKeys(
        updatedForeignKeys,
      );

      return updatedForeignKeys;
    } catch (error) {
      setForeignKeyError(
        "Nu s-a putut actualiza cheia străină.",
      );

      throw error;
    }
  }

  async function deleteForeignKey(
    constraintId: string,
  ): Promise<void> {
    if (!projectId || !tableId) {
      throw new Error(
        "Project or table ID missing",
      );
    }

    setForeignKeyError("");

    try {
      await deleteForeignKeyRequest(
        projectId,
        tableId,
        constraintId,
      );

      setForeignKeys((current) =>
        current.filter(
          (foreignKey) =>
            foreignKey.id !== constraintId,
        ),
      );
    } catch (error) {
      setForeignKeyError(
        "Nu s-a putut șterge cheia străină.",
      );

      throw error;
    }
  }

  return {
    foreignKeys,

    isLoadingForeignKeys,
    foreignKeyError,

    createForeignKey,
    updateForeignKey,
    deleteForeignKey,
  };
}