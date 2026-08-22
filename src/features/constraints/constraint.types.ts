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