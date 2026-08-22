import type { ColumnDataType } from "../columns/column.types";

export type ConstraintType =
  | "PRIMARY_KEY"
  | "FOREIGN_KEY";

export type PrimaryKeyColumn = {
  id: string;
  name: string;
  dataType: ColumnDataType;
  position: number;
};

export type PrimaryKey = {
  id: string;
  tableId: string;
  type: "PRIMARY_KEY";
  columns: PrimaryKeyColumn[];
};

export type SetPrimaryKeyPayload = {
  columnIds: string[];
};

export type PrimaryKeyResponse = {
  primaryKey: PrimaryKey | null;
};

export type ForeignKeyColumn = {
  id: string;

  column: {
    id: string;
    name: string;
  };

  referencedColumn: {
    id: string;
    name: string;
  } | null;

  position: number;
};

export type ForeignKey = {
  id: string;
  tableId: string;
  type: "FOREIGN_KEY";
  name: string | null;

  referencedTable: {
    id: string;
    name: string;
  } | null;

  columns: ForeignKeyColumn[];
};

export type CreateForeignKeyPayload = {
  referencedTableId: string;

  columns: {
    columnId: string;
    referencedColumnId: string;
  }[];
};

export type UpdateForeignKeyPayload = {
  referencedTableId: string;

  columns: {
    columnId: string;
    referencedColumnId: string;
  }[];
};