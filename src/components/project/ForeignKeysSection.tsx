import {
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type { ForeignKey } from "../../features/constraints/constraint.types";

type ForeignKeysSectionProps = {
  foreignKeys: ForeignKey[];
  isLoading: boolean;
  error: string;
  canEdit: boolean;

  onCreate: () => void;

  onEdit: (
    foreignKey: ForeignKey,
  ) => void;

  onDelete: (
    foreignKey: ForeignKey,
  ) => void;
};

export function ForeignKeysSection({
  foreignKeys,
  isLoading,
  error,
  canEdit,
  onCreate,
  onEdit,
  onDelete,
}: ForeignKeysSectionProps) {
  return (
    <div className="mt-10 rounded-xl border border-border bg-background/40">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold">
            Foreign Keys
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            Relațiile de tip cheie străină către alte tabele.
          </p>
        </div>

        {canEdit && (
          <Button
            type="button"
            size="sm"
            onClick={onCreate}
          >
            <Plus className="size-4" />
            Adaugă cheie străină
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
          Se încarcă cheile străine...
        </p>
      ) : foreignKeys.length === 0 ? (
        <p className="p-5 text-sm text-muted-foreground">
          Acest tabel nu conține încă nicio cheie străină.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-5 py-3 font-medium">
                  Coloană locală
                </th>

                <th className="px-5 py-3 font-medium">
                  Tabel referit
                </th>

                <th className="px-5 py-3 font-medium">
                  Referință
                </th>
              </tr>
            </thead>

            <tbody>
              {foreignKeys.flatMap(
                (foreignKey) =>
                  foreignKey.columns.map(
                    (mapping) => (
                      <tr
                        key={mapping.id}
                        className="border-b border-border last:border-b-0"
                      >
                        <td className="px-5 py-4 font-medium">
                          {mapping.column.name}
                        </td>

                        <td className="px-5 py-4">
                          {foreignKey.referencedTable?.name ??
                            "—"}
                        </td>

                        <td className="px-5 py-4">
                          {foreignKey.referencedTable &&
                          mapping.referencedColumn
                            ? `${foreignKey.referencedTable.name}.${mapping.referencedColumn.name}`
                            : "—"}
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
                                    foreignKey,
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
                                    foreignKey,
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
                  ),
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}