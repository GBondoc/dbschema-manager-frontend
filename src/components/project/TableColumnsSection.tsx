import {
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type { DbColumn } from "../../features/columns/column.types";

type TableColumnsSectionProps = {
  columns: DbColumn[];
  isLoading: boolean;
  error: string;
  canEdit: boolean;

  onCreate: () => void;
  onEdit: (
    column: DbColumn,
  ) => void;
  onDelete: (
    column: DbColumn,
  ) => void;
};

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

export function TableColumnsSection({
  columns,
  isLoading,
  error,
  canEdit,
  onCreate,
  onEdit,
  onDelete,
}: TableColumnsSectionProps) {
  return (
    <div className="mt-10 rounded-xl border border-border bg-background/40">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h3 className="text-sm font-semibold">
          Coloane
        </h3>

        {canEdit && (
          <Button
            type="button"
            size="sm"
            onClick={onCreate}
          >
            <Plus className="size-4" />
            Adaugă coloană
          </Button>
        )}
      </div>

      {error && (
        <div
          className="m-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {error}
        </div>
      )}

      {isLoading ? (
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
              {columns.map(
                (column) => (
                  <tr
                    key={column.id}
                    className="border-b border-border last:border-b-0"
                  >
                    <td className="px-5 py-4 font-medium">
                      {column.name}
                    </td>

                    <td className="px-5 py-4">
                      {formatColumnType(
                        column,
                      )}
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
                      {canEdit && (
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              onEdit(
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
                              onDelete(
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
                ),
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}