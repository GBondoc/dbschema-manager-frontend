import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { DbTable } from "../../features/tables/table.types";

type ProjectTablesSidebarProps = {
  tables: DbTable[];
  selectedTableId: string | null;
  isLoading: boolean;
  canEdit: boolean;

  onSelectTable: (
    tableId: string,
  ) => void;

  onCreateTable: () => void;
};

export function ProjectTablesSidebar({
  tables,
  selectedTableId,
  isLoading,
  canEdit,
  onSelectTable,
  onCreateTable,
}: ProjectTablesSidebarProps) {
  return (
    <aside className="border-r border-border p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Tabele
        </h2>

        {canEdit && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onCreateTable}
          >
            <Plus className="size-4" />
          </Button>
        )}
      </div>

      {isLoading && (
        <p className="mt-4 text-sm text-muted-foreground">
          Se încarcă...
        </p>
      )}

      {!isLoading &&
        tables.length === 0 && (
          <div className="mt-6">
            <p className="text-sm text-muted-foreground">
              Nu există încă tabele.
            </p>

            {canEdit && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={onCreateTable}
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
            table.id ===
            selectedTableId;

          return (
            <button
              key={table.id}
              type="button"
              onClick={() =>
                onSelectTable(
                  table.id,
                )
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
  );
}