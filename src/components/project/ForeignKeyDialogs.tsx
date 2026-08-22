import {
  useEffect,
  useState,
} from "react";

import {
  Plus,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

import type { DbTable } from "@/features/tables/table.types";
import type { DbColumn } from "@/features/columns/column.types";

import type {
  CreateForeignKeyPayload,
  ForeignKey,
  UpdateForeignKeyPayload,
} from "@/features/constraints/constraint.types";

import { getColumnsRequest } from "@/features/columns/column-api";

type MappingState = {
  columnId: string;
  referencedColumnId: string;
};

type ForeignKeyDialogsProps = {
  projectId: string;
  tableId: string;

  tables: DbTable[];
  localColumns: DbColumn[];

  createOpen: boolean;

  onCreateOpenChange: (
    open: boolean,
  ) => void;

  editingForeignKey: ForeignKey | null;

  onEditingForeignKeyChange: (
    foreignKey: ForeignKey | null,
  ) => void;

  deletingForeignKey: ForeignKey | null;

  onDeletingForeignKeyChange: (
    foreignKey: ForeignKey | null,
  ) => void;

  onCreate: (
    payload: CreateForeignKeyPayload,
  ) => Promise<ForeignKey[]>;

  onUpdate: (
    constraintId: string,
    payload: UpdateForeignKeyPayload,
  ) => Promise<ForeignKey[]>;

  onDelete: (
    constraintId: string,
  ) => Promise<void>;
};

function createEmptyMapping(): MappingState {
  return {
    columnId: "",
    referencedColumnId: "",
  };
}

export function ForeignKeyDialogs({
  projectId,
  tableId,

  tables = [],
  localColumns = [],

  createOpen,
  onCreateOpenChange,

  editingForeignKey,
  onEditingForeignKeyChange,

  deletingForeignKey,
  onDeletingForeignKeyChange,

  onCreate,
  onUpdate,
  onDelete,
}: ForeignKeyDialogsProps) {
  const [
    referencedTableId,
    setReferencedTableId,
  ] = useState("");

  const [
    referencedColumns,
    setReferencedColumns,
  ] = useState<DbColumn[]>([]);

  const [
    mappings,
    setMappings,
  ] = useState<MappingState[]>([
    createEmptyMapping(),
  ]);

  const [
    isLoadingReferencedColumns,
    setIsLoadingReferencedColumns,
  ] = useState(false);

  const [
    isCreating,
    setIsCreating,
  ] = useState(false);

  const [
    isUpdating,
    setIsUpdating,
  ] = useState(false);

  const [
    isDeleting,
    setIsDeleting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const formOpen =
    createOpen ||
    editingForeignKey !== null;

  const isEditing =
    editingForeignKey !== null;

  const isSaving =
    isCreating ||
    isUpdating;

  function resetForm(): void {
    setReferencedTableId("");
    setReferencedColumns([]);

    setMappings([
      createEmptyMapping(),
    ]);

    setError("");
  }

  function getTableName(
    id: string,
  ): string {
    return (
      tables.find(
        (table) =>
          table.id === id,
      )?.name ?? ""
    );
  }

  function getLocalColumnName(
    id: string,
  ): string {
    return (
      localColumns.find(
        (column) =>
          column.id === id,
      )?.name ?? ""
    );
  }

  function getReferencedColumnName(
    id: string,
  ): string {
    return (
      referencedColumns.find(
        (column) =>
          column.id === id,
      )?.name ?? ""
    );
  }

  useEffect(() => {
    let cancelled = false;

    async function loadReferencedColumns(): Promise<void> {
      if (!referencedTableId) {
        setReferencedColumns([]);
        return;
      }

      setIsLoadingReferencedColumns(true);
      setError("");

      try {
        const data =
          await getColumnsRequest(
            projectId,
            referencedTableId,
          );

        if (!cancelled) {
          setReferencedColumns(data);
        }
      } catch {
        if (!cancelled) {
          setReferencedColumns([]);

          setError(
            "Nu s-au putut încărca coloanele tabelului referit.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingReferencedColumns(false);
        }
      }
    }

    void loadReferencedColumns();

    return () => {
      cancelled = true;
    };
  }, [
    projectId,
    referencedTableId,
  ]);

  useEffect(() => {
    if (!editingForeignKey) {
      return;
    }

    setReferencedTableId(
      editingForeignKey
        .referencedTable?.id ?? "",
    );

    setMappings(
      editingForeignKey.columns.length > 0
        ? editingForeignKey.columns.map(
            (mapping) => ({
              columnId:
                mapping.column.id,

              referencedColumnId:
                mapping
                  .referencedColumn
                  ?.id ?? "",
            }),
          )
        : [
            createEmptyMapping(),
          ],
    );

    setError("");
  }, [editingForeignKey]);

  function updateMapping(
    index: number,
    field:
      | "columnId"
      | "referencedColumnId",
    value: string,
  ): void {
    setMappings((current) =>
      current.map(
        (
          mapping,
          mappingIndex,
        ) =>
          mappingIndex === index
            ? {
                ...mapping,
                [field]: value,
              }
            : mapping,
      ),
    );

    setError("");
  }

  function addMapping(): void {
    setMappings((current) => [
      ...current,
      createEmptyMapping(),
    ]);
  }

  function removeMapping(
    index: number,
  ): void {
    setMappings((current) =>
      current.filter(
        (
          _,
          mappingIndex,
        ) =>
          mappingIndex !== index,
      ),
    );
  }

  function handleReferencedTableChange(
    value: string | null,
  ): void {
    const nextValue =
      value ?? "";

    setReferencedTableId(
      nextValue,
    );

    setReferencedColumns([]);

    setMappings((current) =>
      current.map(
        (mapping) => ({
          ...mapping,
          referencedColumnId: "",
        }),
      ),
    );

    setError("");
  }

  function isFormValid(): boolean {
    if (!referencedTableId) {
      return false;
    }

    if (mappings.length === 0) {
      return false;
    }

    const complete =
      mappings.every(
        (mapping) =>
          Boolean(
            mapping.columnId,
          ) &&
          Boolean(
            mapping.referencedColumnId,
          ),
      );

    if (!complete) {
      return false;
    }

    const localIds =
      mappings.map(
        (mapping) =>
          mapping.columnId,
      );

    const referencedIds =
      mappings.map(
        (mapping) =>
          mapping.referencedColumnId,
      );

    return (
      new Set(localIds).size ===
        localIds.length &&
      new Set(referencedIds).size ===
        referencedIds.length
    );
  }

  function getAvailableLocalColumns(
    index: number,
  ): DbColumn[] {
    return localColumns.filter(
      (column) =>
        column.id ===
          mappings[index]?.columnId ||
        !mappings.some(
          (
            mapping,
            mappingIndex,
          ) =>
            mappingIndex !== index &&
            mapping.columnId ===
              column.id,
        ),
    );
  }

  function getAvailableReferencedColumns(
    index: number,
  ): DbColumn[] {
    return referencedColumns.filter(
      (column) =>
        column.id ===
          mappings[index]
            ?.referencedColumnId ||
        !mappings.some(
          (
            mapping,
            mappingIndex,
          ) =>
            mappingIndex !== index &&
            mapping.referencedColumnId ===
              column.id,
        ),
    );
  }

  const maxMappings =
    Math.min(
      localColumns.length,
      referencedColumns.length,
    );

  const canAddMapping =
    Boolean(
      referencedTableId,
    ) &&
    !isLoadingReferencedColumns &&
    maxMappings > 0 &&
    mappings.length <
      maxMappings;

  async function handleCreate(): Promise<void> {
    if (!isFormValid()) {
      setError(
        "Completează toate câmpurile cheii străine.",
      );

      return;
    }

    setIsCreating(true);
    setError("");

    try {
      await onCreate({
        referencedTableId,

        columns:
          mappings.map(
            (mapping) => ({
              columnId:
                mapping.columnId,

              referencedColumnId:
                mapping.referencedColumnId,
            }),
          ),
      });

      resetForm();

      onCreateOpenChange(
        false,
      );
    } catch {
      setError(
        "Cheia străină nu a putut fi creată. Verifică dacă tipurile coloanelor sunt compatibile și dacă referința este către o cheie primară sau o coloană UNIQUE.",
      );
    } finally {
      setIsCreating(false);
    }
  }

  async function handleUpdate(): Promise<void> {
    if (
      !editingForeignKey ||
      !isFormValid()
    ) {
      setError(
        "Completează toate câmpurile cheii străine.",
      );

      return;
    }

    setIsUpdating(true);
    setError("");

    try {
      await onUpdate(
        editingForeignKey.id,
        {
          referencedTableId,

          columns:
            mappings.map(
              (mapping) => ({
                columnId:
                  mapping.columnId,

                referencedColumnId:
                  mapping.referencedColumnId,
              }),
            ),
        },
      );

      onEditingForeignKeyChange(
        null,
      );

      resetForm();
    } catch {
      setError(
        "Cheia străină nu a putut fi actualizată. Verifică dacă tipurile coloanelor sunt compatibile și dacă referința este către o cheie primară sau o coloană UNIQUE.",
      );
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDelete(): Promise<void> {
    if (!deletingForeignKey) {
      return;
    }

    setIsDeleting(true);

    try {
      await onDelete(
        deletingForeignKey.id,
      );

      onDeletingForeignKeyChange(
        null,
      );
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleSave(): Promise<void> {
    if (isEditing) {
      await handleUpdate();
      return;
    }

    await handleCreate();
  }

  function handleFormOpenChange(
    open: boolean,
  ): void {
    if (
      open ||
      isSaving
    ) {
      return;
    }

    if (isEditing) {
      onEditingForeignKeyChange(
        null,
      );
    } else {
      onCreateOpenChange(
        false,
      );
    }

    resetForm();
  }

  function handleCancel(): void {
    if (isEditing) {
      onEditingForeignKeyChange(
        null,
      );
    } else {
      onCreateOpenChange(
        false,
      );
    }

    resetForm();
  }

  return (
    <>
      <Dialog
        open={formOpen}
        onOpenChange={
          handleFormOpenChange
        }
      >
        <DialogContent className="max-h-[85vh] w-[calc(100vw-2rem)] overflow-y-auto overflow-x-hidden sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {isEditing
                ? "Editează cheia străină"
                : "Adaugă cheie străină"}
            </DialogTitle>

            <DialogDescription>
              {isEditing
                ? "Modifică tabelul sau coloanele implicate în relație."
                : "Definește relația dintre tabelul curent și tabelul referit."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                Tabel referit
              </label>

              <Select
                value={
                  referencedTableId ||
                  null
                }
                onValueChange={
                  handleReferencedTableChange
                }
              >
                <SelectTrigger className="w-full">
                  <span
                    className={
                      referencedTableId
                        ? "truncate"
                        : "truncate text-muted-foreground"
                    }
                  >
                    {referencedTableId
                      ? getTableName(
                          referencedTableId,
                        )
                      : "Selectează tabelul referit"}
                  </span>
                </SelectTrigger>

                <SelectContent>
                  {tables.map(
                    (table) => (
                      <SelectItem
                        key={table.id}
                        value={table.id}
                      >
                        {table.name}
                        {table.id ===
                        tableId
                          ? " (tabel curent)"
                          : ""}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <h4 className="text-sm font-medium">
                  Coloane
                </h4>

                <p className="mt-1 text-xs text-muted-foreground">
                  Asociază fiecare coloană locală cu o coloană din tabelul referit.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {mappings.map(
                  (
                    mapping,
                    index,
                  ) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 gap-3 rounded-lg border border-border p-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto] md:items-end"
                    >
                      <div className="flex min-w-0 flex-col gap-2">
                        <label className="text-xs text-muted-foreground">
                          Coloană locală
                        </label>

                        <Select
                          value={
                            mapping.columnId ||
                            null
                          }
                          onValueChange={(
                            value,
                          ) =>
                            updateMapping(
                              index,
                              "columnId",
                              value ??
                                "",
                            )
                          }
                        >
                          <SelectTrigger className="w-full min-w-0">
                            <span
                              className={
                                mapping.columnId
                                  ? "truncate"
                                  : "truncate text-muted-foreground"
                              }
                            >
                              {mapping.columnId
                                ? getLocalColumnName(
                                    mapping.columnId,
                                  )
                                : "Selectează coloana"}
                            </span>
                          </SelectTrigger>

                          <SelectContent>
                            {getAvailableLocalColumns(
                              index,
                            ).map(
                              (
                                column,
                              ) => (
                                <SelectItem
                                  key={
                                    column.id
                                  }
                                  value={
                                    column.id
                                  }
                                >
                                  {
                                    column.name
                                  }
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="hidden pb-2 text-sm text-muted-foreground md:block">
                        →
                      </div>

                      <div className="flex min-w-0 flex-col gap-2">
                        <label className="text-xs text-muted-foreground">
                          Coloană referită
                        </label>

                        <Select
                          value={
                            mapping.referencedColumnId ||
                            null
                          }
                          disabled={
                            !referencedTableId ||
                            isLoadingReferencedColumns
                          }
                          onValueChange={(
                            value,
                          ) =>
                            updateMapping(
                              index,
                              "referencedColumnId",
                              value ??
                                "",
                            )
                          }
                        >
                          <SelectTrigger className="w-full min-w-0">
                            <span
                              className={
                                mapping.referencedColumnId
                                  ? "truncate"
                                  : "truncate text-muted-foreground"
                              }
                            >
                              {isLoadingReferencedColumns
                                ? "Se încarcă..."
                                : mapping.referencedColumnId
                                  ? getReferencedColumnName(
                                      mapping.referencedColumnId,
                                    )
                                  : "Selectează coloana"}
                            </span>
                          </SelectTrigger>

                          <SelectContent>
                            {getAvailableReferencedColumns(
                              index,
                            ).map(
                              (
                                column,
                              ) => (
                                <SelectItem
                                  key={
                                    column.id
                                  }
                                  value={
                                    column.id
                                  }
                                >
                                  {
                                    column.name
                                  }
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={
                          mappings.length ===
                          1
                        }
                        className="justify-self-end text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() =>
                          removeMapping(
                            index,
                          )
                        }
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ),
                )}
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-fit"
                disabled={
                  !canAddMapping
                }
                onClick={
                  addMapping
                }
              >
                <Plus className="size-4" />
                Adaugă asociere
              </Button>
            </div>

            {error && (
              <div
                className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                role="alert"
              >
                {error}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isSaving}
              onClick={
                handleCancel
              }
            >
              Anulează
            </Button>

            <Button
              type="button"
              disabled={
                isSaving ||
                !isFormValid()
              }
              onClick={() =>
                void handleSave()
              }
            >
              {isCreating
                ? "Se creează..."
                : isUpdating
                  ? "Se salvează..."
                  : isEditing
                    ? "Salvează modificările"
                    : "Adaugă cheia străină"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={
          deletingForeignKey !==
          null
        }
        onOpenChange={(open) => {
          if (
            !open &&
            !isDeleting
          ) {
            onDeletingForeignKeyChange(
              null,
            );
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Ștergi cheia străină?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Relația definită prin această cheie străină va fi eliminată. Această acțiune nu poate fi anulată.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={
                isDeleting
              }
            >
              Anulează
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={
                isDeleting
              }
              onClick={(event) => {
                event.preventDefault();

                void handleDelete();
              }}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isDeleting
                ? "Se șterge..."
                : "Șterge cheia străină"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}