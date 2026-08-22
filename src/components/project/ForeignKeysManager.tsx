import { useState } from "react";

import { ForeignKeysSection } from "./ForeignKeysSection";
import { ForeignKeyDialogs } from "./ForeignKeyDialogs";

import { useForeignKeys } from "../../features/constraints/use-foreign-keys";

import type { DbTable } from "@/features/tables/table.types";
import type { DbColumn } from "@/features/columns/column.types";
import type { ForeignKey } from "@/features/constraints/constraint.types";

type ForeignKeysManagerProps = {
  projectId: string;
  tableId: string;
  tables: DbTable[];
  localColumns: DbColumn[];
  canEdit: boolean;
};

export function ForeignKeysManager({
  projectId,
  tableId,
  tables,
  localColumns,
  canEdit,
}: ForeignKeysManagerProps) {
  const [
    showCreateForeignKey,
    setShowCreateForeignKey,
  ] = useState(false);

  const [
    editingForeignKey,
    setEditingForeignKey,
  ] = useState<ForeignKey | null>(null);

  const [
    deletingForeignKey,
    setDeletingForeignKey,
  ] = useState<ForeignKey | null>(null);

  const {
    foreignKeys,
    isLoadingForeignKeys,
    foreignKeyError,
    createForeignKey,
    updateForeignKey,
    deleteForeignKey,
  } = useForeignKeys(
    projectId,
    tableId,
  );

  return (
    <>
      <ForeignKeysSection
        foreignKeys={foreignKeys}
        isLoading={isLoadingForeignKeys}
        error={foreignKeyError}
        canEdit={canEdit}
        onCreate={() =>
          setShowCreateForeignKey(true)
        }
        onEdit={setEditingForeignKey}
        onDelete={setDeletingForeignKey}
      />

      <ForeignKeyDialogs
            projectId={projectId}
            tableId={tableId}
            tables={tables}
            localColumns={localColumns}
            createOpen={showCreateForeignKey}
            onCreateOpenChange={setShowCreateForeignKey}
            editingForeignKey={editingForeignKey}
            onEditingForeignKeyChange={setEditingForeignKey}
            deletingForeignKey={deletingForeignKey}
            onDeletingForeignKeyChange={setDeletingForeignKey}
            onCreate={createForeignKey}
            onUpdate={updateForeignKey}
            onDelete={deleteForeignKey}
        />
    </>
  );
}