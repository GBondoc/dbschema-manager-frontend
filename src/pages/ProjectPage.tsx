import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router";

import { AppHeader } from "../components/AppHeader";
import { ProjectMembersDialog } from "../components/ProjectMembersDialog";

import { ProjectHeaderSection } from "../components/project/ProjectHeaderSection";
import { ProjectTablesSidebar } from "../components/project/ProjectTablesSidebar";
import { SelectedTablePanel } from "../components/project/SelectedTablePanel";
import { TableDialogs } from "../components/project/TableDialogs";
import { ColumnDialogs } from "../components/project/ColumnDialogs";

import { getProjectRequest } from "../features/projects/projects-api";

import { useProjectTables } from "../features/tables/use-project-tables";
import { useTableColumns } from "../features/columns/use-table-columns";

import type { Project } from "../features/projects/project.types";
import type { DbTable } from "../features/tables/table.types";
import type { DbColumn } from "../features/columns/column.types";

export function ProjectPage() {
  const { projectId } =
    useParams();

  const [project, setProject] =
    useState<Project | null>(
      null,
    );

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [showMembers, setShowMembers] =
    useState(false);

  const [
    showCreateTable,
    setShowCreateTable,
  ] = useState(false);

  const [
    editingTable,
    setEditingTable,
  ] =
    useState<DbTable | null>(
      null,
    );

  const [
    deletingTable,
    setDeletingTable,
  ] =
    useState<DbTable | null>(
      null,
    );

  const [
    showCreateColumn,
    setShowCreateColumn,
  ] = useState(false);

  const [
    editingColumn,
    setEditingColumn,
  ] =
    useState<DbColumn | null>(
      null,
    );

  const [
    deletingColumn,
    setDeletingColumn,
  ] =
    useState<DbColumn | null>(
      null,
    );

  const {
    tables,
    selectedTable,
    selectedTableId,
    setSelectedTableId,

    isLoadingTables,
    tableError,

    createTable,
    updateTable,
    deleteTable,
  } = useProjectTables(
    projectId,
  );

  const {
    columns,
    isLoadingColumns,
    columnError,

    createColumn,
    updateColumn,
    deleteColumn,
  } = useTableColumns(
    projectId,
    selectedTableId,
  );

  useEffect(() => {
    let cancelled = false;

    async function loadProject(): Promise<void> {
      if (!projectId) {
        setError(
          "Proiect invalid.",
        );

        setIsLoading(false);
        return;
      }

      setError("");
      setIsLoading(true);

      try {
        const data =
          await getProjectRequest(
            projectId,
          );

        if (!cancelled) {
          setProject(data);
        }
      } catch {
        if (!cancelled) {
          setError(
            "Proiectul nu a fost găsit.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadProject();

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const canEdit =
    project?.accessRole !==
    "VIEWER";

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

        {!isLoading &&
          project && (
            <>
              <ProjectHeaderSection
                project={project}
                onOpenMembers={() =>
                  setShowMembers(
                    true,
                  )
                }
              />

              <section className="mt-10 grid min-h-130 grid-cols-[220px_minmax(0,1fr)] overflow-hidden rounded-xl border border-border bg-card">
                <ProjectTablesSidebar
                  tables={tables}
                  selectedTableId={
                    selectedTableId
                  }
                  isLoading={
                    isLoadingTables
                  }
                  canEdit={
                    canEdit
                  }
                  onSelectTable={
                    setSelectedTableId
                  }
                  onCreateTable={() =>
                    setShowCreateTable(
                      true,
                    )
                  }
                />

                <SelectedTablePanel
                  projectId={project.id}
                  table={selectedTable}
                  tables={tables}
                  columns={columns}
                  tableError={tableError}
                  columnError={columnError}
                  isLoadingColumns={isLoadingColumns}
                  canEdit={canEdit}
                  onEditTable={setEditingTable}
                  onDeleteTable={setDeletingTable}
                  onCreateColumn={() =>
                    setShowCreateColumn(true)
                  }
                  onEditColumn={setEditingColumn}
                  onDeleteColumn={setDeletingColumn}
                />
              </section>

              <ProjectMembersDialog
                projectId={
                  project.id
                }
                accessRole={
                  project.accessRole
                }
                open={
                  showMembers
                }
                onOpenChange={
                  setShowMembers
                }
              />

              <TableDialogs
                createOpen={
                  showCreateTable
                }
                onCreateOpenChange={
                  setShowCreateTable
                }
                editingTable={
                  editingTable
                }
                onEditingTableChange={
                  setEditingTable
                }
                deletingTable={
                  deletingTable
                }
                onDeletingTableChange={
                  setDeletingTable
                }
                onCreate={
                  createTable
                }
                onUpdate={
                  updateTable
                }
                onDelete={
                  deleteTable
                }
              />

              <ColumnDialogs
                tableName={
                  selectedTable?.name
                }
                createOpen={
                  showCreateColumn
                }
                onCreateOpenChange={
                  setShowCreateColumn
                }
                editingColumn={
                  editingColumn
                }
                onEditingColumnChange={
                  setEditingColumn
                }
                deletingColumn={
                  deletingColumn
                }
                onDeletingColumnChange={
                  setDeletingColumn
                }
                onCreate={
                  createColumn
                }
                onUpdate={
                  updateColumn
                }
                onDelete={
                  deleteColumn
                }
              />
            </>
          )}
      </main>
    </div>
  );
}