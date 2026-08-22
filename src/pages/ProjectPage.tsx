import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router";

import { AppHeader } from "../components/AppHeader";
import { getProjectRequest } from "../features/projects/projects-api";

import type { Project } from "../features/projects/project.types";

import { ProjectMembersDialog } from "../components/ProjectMembersDialog";
import { Button } from "@/components/ui/button";

import {
  Pencil,
  Plus,
  Trash2,
  Users,
} from "lucide-react";

import type { DbTable } from "../features/tables/table.types";

import {
  createTableRequest,
  deleteTableRequest,
  getTablesRequest,
  updateTableRequest,
} from "../features/tables/table-api";

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

import { Input } from "@/components/ui/input";

import type {
  ColumnDataType,
  DbColumn,
} from "../features/columns/column.types";

import {
  createColumnRequest,
  deleteColumnRequest,
  getColumnsRequest,
  updateColumnRequest,
} from "../features/columns/column-api";

import { ColumnFormFields } from "../components/ColumnFormFields";
import { PrimaryKeySection } from "../components/PrimaryKeySection";

export function ProjectPage() {
  const { projectId } = useParams();

  const [project, setProject] =
    useState<Project | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [showMembers, setShowMembers] =
    useState(false);

  const [tables, setTables] =
    useState<DbTable[]>([]);

  const [selectedTableId, setSelectedTableId] =
    useState<string | null>(null);

  const [isLoadingTables, setIsLoadingTables] =
    useState(false);

  const [tableError, setTableError] =
    useState("");

  const [showCreateTable, setShowCreateTable] =
    useState(false);

  const [newTableName, setNewTableName] =
    useState("");

  const [isCreatingTable, setIsCreatingTable] =
    useState(false);

  const [editingTable, setEditingTable] =
    useState<DbTable | null>(null);

  const [editTableName, setEditTableName] =
    useState("");

  const [isUpdatingTable, setIsUpdatingTable] =
    useState(false);

  const [deletingTable, setDeletingTable] =
    useState<DbTable | null>(null);

  const [isDeletingTable, setIsDeletingTable] =
    useState(false);

  const [columns, setColumns] =
  useState<DbColumn[]>([]);

const [isLoadingColumns, setIsLoadingColumns] =
  useState(false);

const [columnError, setColumnError] =
  useState("");

const [showCreateColumn, setShowCreateColumn] =
  useState(false);

const [isCreatingColumn, setIsCreatingColumn] =
  useState(false);

const [editingColumn, setEditingColumn] =
  useState<DbColumn | null>(null);

const [isUpdatingColumn, setIsUpdatingColumn] =
  useState(false);

const [deletingColumn, setDeletingColumn] =
  useState<DbColumn | null>(null);

const [isDeletingColumn, setIsDeletingColumn] =
  useState(false);

  const [columnName, setColumnName] =
  useState("");

const [columnDataType, setColumnDataType] =
  useState<ColumnDataType>("INT");

const [columnLength, setColumnLength] =
  useState("");

const [columnPrecision, setColumnPrecision] =
  useState("");

const [columnScale, setColumnScale] =
  useState("");

const [columnNullable, setColumnNullable] =
  useState(true);

const [columnUnique, setColumnUnique] =
  useState(false);

const [columnAutoIncrement, setColumnAutoIncrement] =
  useState(false);

const [columnDefaultValue, setColumnDefaultValue] =
  useState("");

  useEffect(() => {
    async function loadProject(): Promise<void> {
      if (!projectId) {
        setError("Proiect invalid.");
        setIsLoading(false);
        return;
      }

      try {
        const data = await getProjectRequest(projectId);
        setProject(data);
        setIsLoadingTables(true);

        try {
          const tableData =
            await getTablesRequest(projectId);

          setTables(tableData);

          if (tableData.length > 0) {
            setSelectedTableId(tableData[0].id);
          }
        } catch {
          setTableError(
            "Nu s-au putut încărca tabelele proiectului.",
          );
        } finally {
          setIsLoadingTables(false);
        }
      } catch {
        setError("Proiectul nu a fost găsit.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadProject();
  }, [projectId]);

  useEffect(() => {
    async function loadColumns(): Promise<void> {
      if (!projectId || !selectedTableId) {
        setColumns([]);
        return;
      }

      setIsLoadingColumns(true);
      setColumnError("");

      try {
        const data = await getColumnsRequest(
          projectId,
          selectedTableId,
        );

        setColumns(data);
      } catch {
        setColumnError(
          "Nu s-au putut încărca coloanele tabelului.",
        );
      } finally {
        setIsLoadingColumns(false);
      }
    }

    void loadColumns();
  }, [projectId, selectedTableId]);

  async function handleCreateTable(): Promise<void> {
    if (!projectId) {
      return;
    }

    const trimmedName = newTableName.trim();

    if (!trimmedName) {
      return;
    }

    setTableError("");
    setIsCreatingTable(true);

    try {
      const table =
        await createTableRequest(
          projectId,
          {
            name: trimmedName,
          },
        );

      setTables((current) => [
        ...current,
        table,
      ]);

      setSelectedTableId(table.id);
      setNewTableName("");
      setShowCreateTable(false);
    } catch {
      setTableError(
        "Nu s-a putut crea tabelul.",
      );
    } finally {
      setIsCreatingTable(false);
    }
  }

  function openEditTable(
    table: DbTable,
  ): void {
    setEditingTable(table);
    setEditTableName(table.name);
  }

  function resetColumnForm(): void {
    setColumnName("");
    setColumnDataType("INT");
    setColumnLength("");
    setColumnPrecision("");
    setColumnScale("");
    setColumnNullable(true);
    setColumnUnique(false);
    setColumnAutoIncrement(false);
    setColumnDefaultValue("");
  }

  function openEditColumn(
    column: DbColumn,
  ): void {
    setEditingColumn(column);

    setColumnName(column.name);
    setColumnDataType(column.dataType);

    setColumnLength(
      column.length?.toString() ?? "",
    );

    setColumnPrecision(
      column.precision?.toString() ?? "",
    );

    setColumnScale(
      column.scale?.toString() ?? "",
    );

    setColumnNullable(column.nullable);
    setColumnUnique(column.unique);
    setColumnAutoIncrement(
      column.autoIncrement,
    );

    setColumnDefaultValue(
      column.defaultValue ?? "",
    );
  }

  async function handleUpdateTable(): Promise<void> {
    if (!projectId || !editingTable) {
      return;
    }

    const trimmedName =
      editTableName.trim();

    if (!trimmedName) {
      return;
    }

    setTableError("");
    setIsUpdatingTable(true);

    try {
      const updated =
        await updateTableRequest(
          projectId,
          editingTable.id,
          {
            name: trimmedName,
          },
        );

      setTables((current) =>
        current.map((table) =>
          table.id === updated.id
            ? updated
            : table,
        ),
      );

      setEditingTable(null);
    } catch {
      setTableError(
        "Nu s-a putut actualiza tabelul.",
      );
    } finally {
      setIsUpdatingTable(false);
    }
  }

  async function handleCreateColumn(): Promise<void> {
    if (!projectId || !selectedTableId) {
      return;
    }

    const name = columnName.trim();

    if (!name) {
      return;
    }

    setColumnError("");
    setIsCreatingColumn(true);

    try {
      const created =
        await createColumnRequest(
          projectId,
          selectedTableId,
          {
            name,
            dataType: columnDataType,

            length:
              columnLength !== ""
                ? Number(columnLength)
                : undefined,

            precision:
              columnPrecision !== ""
                ? Number(columnPrecision)
                : undefined,

            scale:
              columnScale !== ""
                ? Number(columnScale)
                : undefined,

            nullable: columnNullable,
            unique: columnUnique,
            autoIncrement:
              columnAutoIncrement,

            defaultValue:
              columnDefaultValue.trim() ||
              undefined,
          },
        );

      setColumns((current) => [
        ...current,
        created,
      ]);

      resetColumnForm();
      setShowCreateColumn(false);
    } catch {
      setColumnError(
        "Nu s-a putut crea coloana.",
      );
    } finally {
      setIsCreatingColumn(false);
    }
  }

  async function handleUpdateColumn(): Promise<void> {
    if (
      !projectId ||
      !selectedTableId ||
      !editingColumn
    ) {
      return;
    }

    const name = columnName.trim();

    if (!name) {
      return;
    }

    setColumnError("");
    setIsUpdatingColumn(true);

    try {
      const updated =
        await updateColumnRequest(
          projectId,
          selectedTableId,
          editingColumn.id,
          {
            name,
            dataType: columnDataType,

            length:
              columnLength !== ""
                ? Number(columnLength)
                : null,

            precision:
              columnPrecision !== ""
                ? Number(columnPrecision)
                : null,

            scale:
              columnScale !== ""
                ? Number(columnScale)
                : null,

            nullable: columnNullable,
            unique: columnUnique,
            autoIncrement:
              columnAutoIncrement,

            defaultValue:
              columnDefaultValue.trim() ||
              null,
          },
        );

      setColumns((current) =>
        current.map((column) =>
          column.id === updated.id
            ? updated
            : column,
        ),
      );

      setEditingColumn(null);
      resetColumnForm();
    } catch {
      setColumnError(
        "Nu s-a putut actualiza coloana.",
      );
    } finally {
      setIsUpdatingColumn(false);
    }
  }

  async function handleDeleteColumn(): Promise<void> {
    if (
      !projectId ||
      !selectedTableId ||
      !deletingColumn
    ) {
      return;
    }

    setColumnError("");
    setIsDeletingColumn(true);

    try {
      await deleteColumnRequest(
        projectId,
        selectedTableId,
        deletingColumn.id,
      );

      setColumns((current) =>
        current.filter(
          (column) =>
            column.id !== deletingColumn.id,
        ),
      );

      setDeletingColumn(null);
    } catch {
      setColumnError(
        "Nu s-a putut șterge coloana.",
      );
    } finally {
      setIsDeletingColumn(false);
    }
  }

  async function handleDeleteTable(): Promise<void> {
    if (!projectId || !deletingTable) {
      return;
    }

    setTableError("");
    setIsDeletingTable(true);

    try {
      await deleteTableRequest(
        projectId,
        deletingTable.id,
      );

      setTables((current) =>
        current.filter(
          (table) =>
            table.id !== deletingTable.id,
        ),
      );

      if (
        selectedTableId === deletingTable.id
      ) {
        const remaining = tables.filter(
          (table) =>
            table.id !== deletingTable.id,
        );

        setSelectedTableId(
          remaining[0]?.id ?? null,
        );
      }

      setDeletingTable(null);
    } catch {
      setTableError(
        "Nu s-a putut șterge tabelul.",
      );
    } finally {
      setIsDeletingTable(false);
    }
  }

  const selectedTable =
    tables.find(
      (table) =>
        table.id === selectedTableId,
    ) ?? null;

  function formatColumnType(
    column: DbColumn,
  ): string {
    if (
      (column.dataType === "VARCHAR" ||
        column.dataType === "CHAR") &&
      column.length !== null
    ) {
      return `${column.dataType}(${column.length})`;
    }

    if (
      column.dataType === "DECIMAL" &&
      column.precision !== null
    ) {
      if (column.scale !== null) {
        return `DECIMAL(${column.precision},${column.scale})`;
      }

      return `DECIMAL(${column.precision})`;
    }

    return column.dataType;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />

      <main className="w-full px-4 py-8">
        <Link
          to="/dashboard"
          className="inline-flex text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Înapoi la proiecte
        </Link>

        {isLoading && (
          <div className="mt-10 text-sm text-muted-foreground">
            Se încarcă proiectul...
          </div>
        )}

        {error && (
          <div
            className="mt-8 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            role="alert"
          >
            {error}
          </div>
        )}

        {!isLoading && project && (
          <>
            <section className="mt-8 flex items-start justify-between gap-6">
              <div>
                <span className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  MySQL
                </span>

                <h1 className="mt-4 wrap-break-word text-3xl font-bold tracking-tight">
                  {project.name}
                </h1>

                <p className="mt-2 max-w-3xl wrap-break-word text-sm leading-6 text-muted-foreground">
                  {project.description ||
                    "Proiect fără descriere."}
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => setShowMembers(true)}
              >
                <Users className="size-4" />
                Membrii proiectului
              </Button>
            </section>

            <ProjectMembersDialog
              projectId={project.id}
              accessRole={project.accessRole}
              open={showMembers}
              onOpenChange={setShowMembers}
            />

            <section className="mt-10 grid min-h-130 grid-cols-[220px_minmax(0,1fr)] overflow-hidden rounded-xl border border-border bg-card">
            {/* TABLE SIDEBAR */}
            <aside className="border-r border-border p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Tabele
                </h2>

                {project.accessRole !== "VIEWER" && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setShowCreateTable(true)
                    }
                  >
                    <Plus className="size-4" />
                  </Button>
                )}
              </div>

              {isLoadingTables && (
                <p className="mt-4 text-sm text-muted-foreground">
                  Se încarcă...
                </p>
              )}

              {!isLoadingTables &&
                tables.length === 0 && (
                  <div className="mt-6">
                    <p className="text-sm text-muted-foreground">
                      Nu există încă tabele.
                    </p>

                    {project.accessRole !== "VIEWER" && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() =>
                          setShowCreateTable(true)
                        }
                      >
                        <Plus className="size-4" />
                        Creează primul tabel
                      </Button>
                    )}
                  </div>
                )}

              <div className="mt-4 flex flex-col gap-1">
                {tables.map((table) => {
                  const isSelected =
                    table.id === selectedTableId;

                  return (
                    <button
                      key={table.id}
                      type="button"
                      onClick={() =>
                        setSelectedTableId(table.id)
                      }
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        isSelected
                          ? "bg-primary/15 font-medium text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      }`}
                    >
                      {table.name}
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* TABLE DETAILS */}
            <div className="p-6">
              {tableError && (
                <div
                  className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                  role="alert"
                >
                  {tableError}
                </div>
              )}

              {!selectedTable ? (
                <div className="flex h-full min-h-105 items-center justify-center text-center">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Selectează un tabel
                    </h3>

                    <p className="mt-2 text-sm text-muted-foreground">
                      Alege un tabel din partea stângă pentru a vedea structura lui.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <h2 className="wrap-break-word text-2xl font-bold">
                        {selectedTable.name}
                      </h2>
                    </div>

                    {project.accessRole !== "VIEWER" && (
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            openEditTable(
                              selectedTable,
                            )
                          }
                        >
                          <Pencil className="size-4" />
                          Editează
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setDeletingTable(
                              selectedTable,
                            )
                          }
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                          Șterge
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    <PrimaryKeySection
                      projectId={project.id}
                      tableId={selectedTable.id}
                      columns={columns}
                      canEdit={project.accessRole !== "VIEWER"}
                    />
                  </div>
                  <div className="mt-10 rounded-xl border border-border bg-background/40">
                    <div className="flex items-center justify-between border-b border-border px-5 py-4">
                      <h3 className="text-sm font-semibold">
                        Coloane
                      </h3>

                      {project.accessRole !== "VIEWER" && (
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => {
                            resetColumnForm();
                            setShowCreateColumn(true);
                          }}
                        >
                          <Plus className="size-4" />
                          Adaugă coloană
                        </Button>
                      )}
                    </div>

                    {columnError && (
                      <div
                        className="m-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                        role="alert"
                      >
                        {columnError}
                      </div>
                    )}

                    {isLoadingColumns ? (
                      <p className="p-5 text-sm text-muted-foreground">
                        Se încarcă coloanele...
                      </p>
                    ) : columns.length === 0 ? (
                      <p className="p-5 text-sm text-muted-foreground">
                        Acest tabel nu conține încă nicio coloană.
                      </p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border text-left text-xs text-muted-foreground">
                              <th className="px-5 py-3 font-medium">
                                Nume
                              </th>

                              <th className="px-5 py-3 font-medium">
                                Tip
                              </th>

                              <th className="px-5 py-3 font-medium">
                                Null
                              </th>

                              <th className="px-5 py-3 font-medium">
                                Unique
                              </th>

                              <th className="px-5 py-3 font-medium">
                                Auto Increment
                              </th>

                              <th className="px-5 py-3 font-medium">
                                Implicit
                              </th>

                              <th className="px-5 py-3" />
                            </tr>
                          </thead>

                          <tbody>
                            {columns.map((column) => (
                              <tr
                                key={column.id}
                                className="border-b border-border last:border-b-0"
                              >
                                <td className="px-5 py-4 font-medium">
                                  {column.name}
                                </td>

                                <td className="px-5 py-4">
                                  {formatColumnType(column)}
                                </td>

                                <td className="px-5 py-4">
                                  {column.nullable
                                    ? "Da"
                                    : "Nu"}
                                </td>

                                <td className="px-5 py-4">
                                  {column.unique
                                    ? "Da"
                                    : "Nu"}
                                </td>

                                <td className="px-5 py-4">
                                  {column.autoIncrement
                                    ? "Da"
                                    : "Nu"}
                                </td>

                                <td className="px-5 py-4 text-muted-foreground">
                                  {column.defaultValue ??
                                    "—"}
                                </td>

                                <td className="px-5 py-4">
                                  {project.accessRole !==
                                    "VIEWER" && (
                                    <div className="flex justify-end gap-2">
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                          openEditColumn(
                                            column,
                                          )
                                        }
                                      >
                                        <Pencil className="size-4" />
                                      </Button>

                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                        onClick={() =>
                                          setDeletingColumn(
                                            column,
                                          )
                                        }
                                      >
                                        <Trash2 className="size-4" />
                                      </Button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </section>

          <Dialog
            open={showCreateTable}
            onOpenChange={(open) => {
              if (!isCreatingTable) {
                setShowCreateTable(open);
              }
            }}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Creează tabel
                </DialogTitle>

                <DialogDescription>
                  Adaugă un nou tabel în schema proiectului.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="new-table-name"
                  className="text-sm font-medium"
                >
                  Nume tabel
                </label>

                <Input
                  id="new-table-name"
                  value={newTableName}
                  onChange={(event) =>
                    setNewTableName(
                      event.target.value,
                    )
                  }
                  placeholder="Exemplu: elevi"
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isCreatingTable}
                  onClick={() =>
                    setShowCreateTable(false)
                  }
                >
                  Anulează
                </Button>

                <Button
                  type="button"
                  disabled={
                    isCreatingTable ||
                    !newTableName.trim()
                  }
                  onClick={() =>
                    void handleCreateTable()
                  }
                >
                  {isCreatingTable
                    ? "Se creează..."
                    : "Creează tabelul"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog
            open={editingTable !== null}
            onOpenChange={(open) => {
              if (!open && !isUpdatingTable) {
                setEditingTable(null);
              }
            }}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Editează tabelul
                </DialogTitle>

                <DialogDescription>
                  Modifică numele tabelului.
                </DialogDescription>
              </DialogHeader>

              <Input
                value={editTableName}
                onChange={(event) =>
                  setEditTableName(
                    event.target.value,
                  )
                }
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isUpdatingTable}
                  onClick={() =>
                    setEditingTable(null)
                  }
                >
                  Anulează
                </Button>

                <Button
                  type="button"
                  disabled={
                    isUpdatingTable ||
                    !editTableName.trim()
                  }
                  onClick={() =>
                    void handleUpdateTable()
                  }
                >
                  {isUpdatingTable
                    ? "Se salvează..."
                    : "Salvează"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <AlertDialog
            open={deletingTable !== null}
            onOpenChange={(open) => {
              if (!open && !isDeletingTable) {
                setDeletingTable(null);
              }
            }}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Ștergi tabelul?
                </AlertDialogTitle>

                <AlertDialogDescription>
                  Ești sigur că vrei să ștergi tabelul{" "}
                  <strong className="text-foreground">
                    {deletingTable?.name}
                  </strong>
                  ? Această acțiune nu poate fi anulată.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel
                  disabled={isDeletingTable}
                >
                  Anulează
                </AlertDialogCancel>

                <AlertDialogAction
                  disabled={isDeletingTable}
                  onClick={(event) => {
                    event.preventDefault();
                    void handleDeleteTable();
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeletingTable
                    ? "Se șterge..."
                    : "Șterge tabelul"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Dialog
            open={showCreateColumn}
            onOpenChange={(open) => {
              if (!isCreatingColumn) {
                setShowCreateColumn(open);

                if (!open) {
                  resetColumnForm();
                }
              }
            }}
          >
            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>
                  Adaugă coloană
                </DialogTitle>

                <DialogDescription>
                  Definește o nouă coloană pentru tabelul{" "}
                  <strong className="text-foreground">
                    {selectedTable?.name}
                  </strong>
                  .
                </DialogDescription>
              </DialogHeader>

              <ColumnFormFields
                name={columnName}
                dataType={columnDataType}
                length={columnLength}
                precision={columnPrecision}
                scale={columnScale}
                nullable={columnNullable}
                unique={columnUnique}
                autoIncrement={columnAutoIncrement}
                defaultValue={columnDefaultValue}
                onNameChange={setColumnName}
                onDataTypeChange={setColumnDataType}
                onLengthChange={setColumnLength}
                onPrecisionChange={setColumnPrecision}
                onScaleChange={setColumnScale}
                onNullableChange={setColumnNullable}
                onUniqueChange={setColumnUnique}
                onAutoIncrementChange={
                  setColumnAutoIncrement
                }
                onDefaultValueChange={
                  setColumnDefaultValue
                }
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isCreatingColumn}
                  onClick={() => {
                    setShowCreateColumn(false);
                    resetColumnForm();
                  }}
                >
                  Anulează
                </Button>

                <Button
                  type="button"
                  disabled={
                    isCreatingColumn ||
                    !columnName.trim()
                  }
                  onClick={() =>
                    void handleCreateColumn()
                  }
                >
                  {isCreatingColumn
                    ? "Se creează..."
                    : "Adaugă coloana"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog
            open={editingColumn !== null}
            onOpenChange={(open) => {
              if (!open && !isUpdatingColumn) {
                setEditingColumn(null);
                resetColumnForm();
              }
            }}
          >
            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>
                  Editează coloana
                </DialogTitle>

                <DialogDescription>
                  Modifică proprietățile coloanei{" "}
                  <strong className="text-foreground">
                    {editingColumn?.name}
                  </strong>
                  .
                </DialogDescription>
              </DialogHeader>

              <ColumnFormFields
                name={columnName}
                dataType={columnDataType}
                length={columnLength}
                precision={columnPrecision}
                scale={columnScale}
                nullable={columnNullable}
                unique={columnUnique}
                autoIncrement={columnAutoIncrement}
                defaultValue={columnDefaultValue}
                onNameChange={setColumnName}
                onDataTypeChange={setColumnDataType}
                onLengthChange={setColumnLength}
                onPrecisionChange={setColumnPrecision}
                onScaleChange={setColumnScale}
                onNullableChange={setColumnNullable}
                onUniqueChange={setColumnUnique}
                onAutoIncrementChange={
                  setColumnAutoIncrement
                }
                onDefaultValueChange={
                  setColumnDefaultValue
                }
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isUpdatingColumn}
                  onClick={() => {
                    setEditingColumn(null);
                    resetColumnForm();
                  }}
                >
                  Anulează
                </Button>

                <Button
                  type="button"
                  disabled={
                    isUpdatingColumn ||
                    !columnName.trim()
                  }
                  onClick={() =>
                    void handleUpdateColumn()
                  }
                >
                  {isUpdatingColumn
                    ? "Se salvează..."
                    : "Salvează modificările"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <AlertDialog
            open={deletingColumn !== null}
            onOpenChange={(open) => {
              if (!open && !isDeletingColumn) {
                setDeletingColumn(null);
              }
            }}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Ștergi coloana?
                </AlertDialogTitle>

                <AlertDialogDescription>
                  Ești sigur că vrei să ștergi coloana{" "}
                  <strong className="text-foreground">
                    {deletingColumn?.name}
                  </strong>{" "}
                  din tabelul{" "}
                  <strong className="text-foreground">
                    {selectedTable?.name}
                  </strong>
                  ? Această acțiune nu poate fi anulată.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel
                  disabled={isDeletingColumn}
                >
                  Anulează
                </AlertDialogCancel>

                <AlertDialogAction
                  disabled={isDeletingColumn}
                  onClick={(event) => {
                    event.preventDefault();

                    void handleDeleteColumn();
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeletingColumn
                    ? "Se șterge..."
                    : "Șterge coloana"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          </>
        )}
      </main>
    </div>
  );
}