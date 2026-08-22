import {
  useEffect,
  useState,
} from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

import type { DbTable } from "../../features/tables/table.types";

type TableDialogsProps = {
  createOpen: boolean;
  onCreateOpenChange: (
    open: boolean,
  ) => void;

  editingTable: DbTable | null;
  onEditingTableChange: (
    table: DbTable | null,
  ) => void;

  deletingTable: DbTable | null;
  onDeletingTableChange: (
    table: DbTable | null,
  ) => void;

  onCreate: (
    name: string,
  ) => Promise<unknown>;

  onUpdate: (
    tableId: string,
    name: string,
  ) => Promise<unknown>;

  onDelete: (
    tableId: string,
  ) => Promise<void>;
};

export function TableDialogs({
  createOpen,
  onCreateOpenChange,

  editingTable,
  onEditingTableChange,

  deletingTable,
  onDeletingTableChange,

  onCreate,
  onUpdate,
  onDelete,
}: TableDialogsProps) {
  const [newTableName, setNewTableName] =
    useState("");

  const [editTableName, setEditTableName] =
    useState("");

  const [isCreating, setIsCreating] =
    useState(false);

  const [isUpdating, setIsUpdating] =
    useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  useEffect(() => {
    setEditTableName(
      editingTable?.name ?? "",
    );
  }, [editingTable]);

  async function handleCreate(): Promise<void> {
    const name =
      newTableName.trim();

    if (!name) {
      return;
    }

    setIsCreating(true);

    try {
      await onCreate(name);

      setNewTableName("");
      onCreateOpenChange(false);
    } finally {
      setIsCreating(false);
    }
  }

  async function handleUpdate(): Promise<void> {
    if (!editingTable) {
      return;
    }

    const name =
      editTableName.trim();

    if (!name) {
      return;
    }

    setIsUpdating(true);

    try {
      await onUpdate(
        editingTable.id,
        name,
      );

      onEditingTableChange(null);
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDelete(): Promise<void> {
    if (!deletingTable) {
      return;
    }

    setIsDeleting(true);

    try {
      await onDelete(
        deletingTable.id,
      );

      onDeletingTableChange(null);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Dialog
        open={createOpen}
        onOpenChange={(open) => {
          if (isCreating) {
            return;
          }

          onCreateOpenChange(open);

          if (!open) {
            setNewTableName("");
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
              disabled={isCreating}
              onClick={() =>
                onCreateOpenChange(
                  false,
                )
              }
            >
              Anulează
            </Button>

            <Button
              type="button"
              disabled={
                isCreating ||
                !newTableName.trim()
              }
              onClick={() =>
                void handleCreate()
              }
            >
              {isCreating
                ? "Se creează..."
                : "Creează tabelul"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={editingTable !== null}
        onOpenChange={(open) => {
          if (
            !open &&
            !isUpdating
          ) {
            onEditingTableChange(
              null,
            );
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
              disabled={isUpdating}
              onClick={() =>
                onEditingTableChange(
                  null,
                )
              }
            >
              Anulează
            </Button>

            <Button
              type="button"
              disabled={
                isUpdating ||
                !editTableName.trim()
              }
              onClick={() =>
                void handleUpdate()
              }
            >
              {isUpdating
                ? "Se salvează..."
                : "Salvează"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deletingTable !== null}
        onOpenChange={(open) => {
          if (
            !open &&
            !isDeleting
          ) {
            onDeletingTableChange(
              null,
            );
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
              disabled={isDeleting}
            >
              Anulează
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={isDeleting}
              onClick={(event) => {
                event.preventDefault();

                void handleDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting
                ? "Se șterge..."
                : "Șterge tabelul"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}