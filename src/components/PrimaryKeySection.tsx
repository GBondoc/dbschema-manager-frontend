import {
  useEffect,
  useState,
} from "react";

import { KeyRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import type { DbColumn } from "../features/columns/column.types";
import type { PrimaryKey } from "../features/constraints/constraint.types";

import {
  deletePrimaryKeyRequest,
  getPrimaryKeyRequest,
  setPrimaryKeyRequest,
} from "../features/constraints/constraint-api";

type PrimaryKeySectionProps = {
  projectId: string;
  tableId: string;
  columns: DbColumn[];
  canEdit: boolean;
};

export function PrimaryKeySection({
  projectId,
  tableId,
  columns,
  canEdit,
}: PrimaryKeySectionProps) {
  const [primaryKey, setPrimaryKey] =
    useState<PrimaryKey | null>(null);

  const [selectedColumnIds, setSelectedColumnIds] =
    useState<string[]>([]);

  const [isEditing, setIsEditing] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadPrimaryKey(): Promise<void> {
      try {
        setIsLoading(true);
        setError("");

        const data =
          await getPrimaryKeyRequest(
            projectId,
            tableId,
          );

        setPrimaryKey(data);

        setSelectedColumnIds(
          data?.columns.map(
            (column) => column.id,
          ) ?? [],
        );
      } catch {
        setError(
          "Cheia primară nu a putut fi încărcată.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadPrimaryKey();
  }, [projectId, tableId]);

  function toggleColumn(
    columnId: string,
  ): void {
    setSelectedColumnIds(
      (current) =>
        current.includes(columnId)
          ? current.filter(
              (id) => id !== columnId,
            )
          : [...current, columnId],
    );
  }

  function startEditing(): void {
    setSelectedColumnIds(
      primaryKey?.columns.map(
        (column) => column.id,
      ) ?? [],
    );

    setIsEditing(true);
    setError("");
  }

  function cancelEditing(): void {
    setSelectedColumnIds(
      primaryKey?.columns.map(
        (column) => column.id,
      ) ?? [],
    );

    setIsEditing(false);
    setError("");
  }

  async function handleSave(): Promise<void> {
    if (selectedColumnIds.length === 0) {
      setError(
        "Selectează cel puțin o coloană.",
      );
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      const updated =
        await setPrimaryKeyRequest(
          projectId,
          tableId,
          {
            columnIds:
              selectedColumnIds,
          },
        );

      setPrimaryKey(updated);
      setIsEditing(false);
    } catch {
      setError(
        "Cheia primară nu a putut fi salvată.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(): Promise<void> {
    try {
      setIsSaving(true);
      setError("");

      await deletePrimaryKeyRequest(
        projectId,
        tableId,
      );

      setPrimaryKey(null);
      setSelectedColumnIds([]);
      setIsEditing(false);
    } catch {
      setError(
        "Cheia primară nu a putut fi ștearsă.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">
        Se încarcă cheia primară...
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-background/40 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <KeyRound className="size-4 text-primary" />

            <h4 className="text-sm font-semibold">
              Primary Key
            </h4>
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            Coloana sau coloanele care identifică unic fiecare înregistrare.
          </p>
        </div>

        {canEdit && !isEditing && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={startEditing}
          >
            {primaryKey
              ? "Modifică"
              : "Definește"}
          </Button>
        )}
      </div>

      {error && (
        <div className="mt-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {!isEditing && (
        <div className="mt-4">
          {primaryKey ? (
            <div className="flex flex-wrap gap-2">
              {primaryKey.columns.map(
                (column) => (
                  <span
                    key={column.id}
                    className="rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                  >
                    {column.name}
                  </span>
                ),
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nu este definită nicio cheie primară.
            </p>
          )}
        </div>
      )}

      {isEditing && (
        <div className="mt-4">
          {columns.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Adaugă mai întâi cel puțin o coloană.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {columns.map((column) => {
                const checked =
                  selectedColumnIds.includes(
                    column.id,
                  );

                return (
                  <label
                    key={column.id}
                    className="flex cursor-pointer items-center gap-3 rounded-md border border-border p-3 transition-colors hover:bg-accent/50"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() =>
                        toggleColumn(
                          column.id,
                        )
                      }
                    />

                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">
                        {column.name}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {column.dataType}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between gap-3">
            <div>
              {primaryKey && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  disabled={isSaving}
                  onClick={() => {
                    void handleDelete();
                  }}
                >
                  Șterge cheia primară
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isSaving}
                onClick={cancelEditing}
              >
                Anulează
              </Button>

              <Button
                type="button"
                size="sm"
                disabled={
                  isSaving ||
                  selectedColumnIds.length === 0
                }
                onClick={() => {
                  void handleSave();
                }}
              >
                {isSaving
                  ? "Se salvează..."
                  : "Salvează"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}