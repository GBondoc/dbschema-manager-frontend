import {
  useEffect,
  useState,
} from "react";

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

import { ColumnFormFields } from "../ColumnFormFields";

import type {
  ColumnDataType,
  CreateColumnPayload,
  DbColumn,
  UpdateColumnPayload,
} from "../../features/columns/column.types";

type ColumnDialogsProps = {
  tableName: string | undefined;

  createOpen: boolean;
  onCreateOpenChange: (
    open: boolean,
  ) => void;

  editingColumn: DbColumn | null;
  onEditingColumnChange: (
    column: DbColumn | null,
  ) => void;

  deletingColumn: DbColumn | null;
  onDeletingColumnChange: (
    column: DbColumn | null,
  ) => void;

  onCreate: (
    payload: CreateColumnPayload,
  ) => Promise<unknown>;

  onUpdate: (
    columnId: string,
    payload: UpdateColumnPayload,
  ) => Promise<unknown>;

  onDelete: (
    columnId: string,
  ) => Promise<void>;
};

export function ColumnDialogs({
  tableName,

  createOpen,
  onCreateOpenChange,

  editingColumn,
  onEditingColumnChange,

  deletingColumn,
  onDeletingColumnChange,

  onCreate,
  onUpdate,
  onDelete,
}: ColumnDialogsProps) {
  const [name, setName] =
    useState("");

  const [dataType, setDataType] =
    useState<ColumnDataType>("INT");

  const [length, setLength] =
    useState("");

  const [precision, setPrecision] =
    useState("");

  const [scale, setScale] =
    useState("");

  const [nullable, setNullable] =
    useState(true);

  const [unique, setUnique] =
    useState(false);

  const [
    autoIncrement,
    setAutoIncrement,
  ] = useState(false);

  const [
    defaultValue,
    setDefaultValue,
  ] = useState("");

  const [isCreating, setIsCreating] =
    useState(false);

  const [isUpdating, setIsUpdating] =
    useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  function resetForm(): void {
    setName("");
    setDataType("INT");
    setLength("");
    setPrecision("");
    setScale("");
    setNullable(true);
    setUnique(false);
    setAutoIncrement(false);
    setDefaultValue("");
  }

  useEffect(() => {
    if (!editingColumn) {
      return;
    }

    setName(editingColumn.name);
    setDataType(
      editingColumn.dataType,
    );

    setLength(
      editingColumn.length?.toString() ??
        "",
    );

    setPrecision(
      editingColumn.precision?.toString() ??
        "",
    );

    setScale(
      editingColumn.scale?.toString() ??
        "",
    );

    setNullable(
      editingColumn.nullable,
    );

    setUnique(
      editingColumn.unique,
    );

    setAutoIncrement(
      editingColumn.autoIncrement,
    );

    setDefaultValue(
      editingColumn.defaultValue ??
        "",
    );
  }, [editingColumn]);

  function buildCreatePayload():
    CreateColumnPayload {
    return {
      name: name.trim(),
      dataType,

      length:
        length !== ""
          ? Number(length)
          : undefined,

      precision:
        precision !== ""
          ? Number(precision)
          : undefined,

      scale:
        scale !== ""
          ? Number(scale)
          : undefined,

      nullable,
      unique,
      autoIncrement,

      defaultValue:
        defaultValue.trim() ||
        undefined,
    };
  }

  function buildUpdatePayload():
    UpdateColumnPayload {
    return {
      name: name.trim(),
      dataType,

      length:
        length !== ""
          ? Number(length)
          : null,

      precision:
        precision !== ""
          ? Number(precision)
          : null,

      scale:
        scale !== ""
          ? Number(scale)
          : null,

      nullable,
      unique,
      autoIncrement,

      defaultValue:
        defaultValue.trim() ||
        null,
    };
  }

  async function handleCreate(): Promise<void> {
    if (!name.trim()) {
      return;
    }

    setIsCreating(true);

    try {
      await onCreate(
        buildCreatePayload(),
      );

      resetForm();
      onCreateOpenChange(false);
    } finally {
      setIsCreating(false);
    }
  }

  async function handleUpdate(): Promise<void> {
    if (
      !editingColumn ||
      !name.trim()
    ) {
      return;
    }

    setIsUpdating(true);

    try {
      await onUpdate(
        editingColumn.id,
        buildUpdatePayload(),
      );

      onEditingColumnChange(null);
      resetForm();
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDelete(): Promise<void> {
    if (!deletingColumn) {
      return;
    }

    setIsDeleting(true);

    try {
      await onDelete(
        deletingColumn.id,
      );

      onDeletingColumnChange(null);
    } finally {
      setIsDeleting(false);
    }
  }

  const formFields = (
    <ColumnFormFields
      name={name}
      dataType={dataType}
      length={length}
      precision={precision}
      scale={scale}
      nullable={nullable}
      unique={unique}
      autoIncrement={
        autoIncrement
      }
      defaultValue={
        defaultValue
      }
      onNameChange={setName}
      onDataTypeChange={
        setDataType
      }
      onLengthChange={
        setLength
      }
      onPrecisionChange={
        setPrecision
      }
      onScaleChange={setScale}
      onNullableChange={
        setNullable
      }
      onUniqueChange={setUnique}
      onAutoIncrementChange={
        setAutoIncrement
      }
      onDefaultValueChange={
        setDefaultValue
      }
    />
  );

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
            resetForm();
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
                {tableName}
              </strong>
              .
            </DialogDescription>
          </DialogHeader>

          {formFields}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isCreating}
              onClick={() => {
                onCreateOpenChange(false);
                resetForm();
              }}
            >
              Anulează
            </Button>

            <Button
              type="button"
              disabled={
                isCreating ||
                !name.trim()
              }
              onClick={() =>
                void handleCreate()
              }
            >
              {isCreating
                ? "Se creează..."
                : "Adaugă coloana"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={
          editingColumn !== null
        }
        onOpenChange={(open) => {
          if (
            !open &&
            !isUpdating
          ) {
            onEditingColumnChange(
              null,
            );

            resetForm();
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

          {formFields}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isUpdating}
              onClick={() => {
                onEditingColumnChange(
                  null,
                );

                resetForm();
              }}
            >
              Anulează
            </Button>

            <Button
              type="button"
              disabled={
                isUpdating ||
                !name.trim()
              }
              onClick={() =>
                void handleUpdate()
              }
            >
              {isUpdating
                ? "Se salvează..."
                : "Salvează modificările"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={
          deletingColumn !== null
        }
        onOpenChange={(open) => {
          if (
            !open &&
            !isDeleting
          ) {
            onDeletingColumnChange(
              null,
            );
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
                {tableName}
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
                : "Șterge coloana"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}