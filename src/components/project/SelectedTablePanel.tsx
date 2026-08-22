import {
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { PrimaryKeySection } from "../PrimaryKeySection";

import { TableColumnsSection } from "./TableColumnsSection";

import type { DbTable } from "../../features/tables/table.types";
import type { DbColumn } from "../../features/columns/column.types";
import { ForeignKeysManager } from "./ForeignKeysManager";

type SelectedTablePanelProps = {
  projectId: string;

  table: DbTable | null;
  tables: DbTable[];
  columns: DbColumn[];

  tableError: string;
  columnError: string;

  isLoadingColumns: boolean;
  canEdit: boolean;

  onEditTable: (
    table: DbTable,
  ) => void;

  onDeleteTable: (
    table: DbTable,
  ) => void;

  onCreateColumn: () => void;

  onEditColumn: (
    column: DbColumn,
  ) => void;

  onDeleteColumn: (
    column: DbColumn,
  ) => void;
};

export function SelectedTablePanel({
  projectId,
  table,
  tables,
  columns,
  tableError,
  columnError,
  isLoadingColumns,
  canEdit,
  onEditTable,
  onDeleteTable,
  onCreateColumn,
  onEditColumn,
  onDeleteColumn,
}: SelectedTablePanelProps) {
  return (
    <div className="p-6">
      {tableError && (
        <div
          className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {tableError}
        </div>
      )}

      {!table ? (
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
            <h2 className="wrap-break-word text-2xl font-bold">
              {table.name}
            </h2>

            {canEdit && (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onEditTable(
                      table,
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
                    onDeleteTable(
                      table,
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
              projectId={projectId}
              tableId={table.id}
              columns={columns}
              canEdit={canEdit}
            />
          </div>

          <TableColumnsSection
            columns={columns}
            isLoading={
              isLoadingColumns
            }
            error={columnError}
            canEdit={canEdit}
            onCreate={onCreateColumn}
            onEdit={onEditColumn}
            onDelete={onDeleteColumn}
          />

          <ForeignKeysManager
            projectId={projectId}
            tableId={table.id}
            tables={tables}
            localColumns={columns}
            canEdit={canEdit}
          />
        </>
      )}
    </div>
  );
}