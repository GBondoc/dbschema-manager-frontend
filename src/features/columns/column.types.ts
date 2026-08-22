export type ColumnDataType =
  | "INT"
  | "BIGINT"
  | "DECIMAL"
  | "VARCHAR"
  | "CHAR"
  | "TEXT"
  | "BOOLEAN"
  | "DATE"
  | "DATETIME"
  | "TIMESTAMP";

export type DbColumn = {
  id: string;
  tableId: string;
  name: string;
  dataType: ColumnDataType;
  length: number | null;
  precision: number | null;
  scale: number | null;
  nullable: boolean;
  unique: boolean;
  autoIncrement: boolean;
  defaultValue: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type CreateColumnPayload = {
  name: string;
  dataType: ColumnDataType;
  length?: number;
  precision?: number;
  scale?: number;
  nullable?: boolean;
  unique?: boolean;
  autoIncrement?: boolean;
  defaultValue?: string;
};

export type UpdateColumnPayload = {
  name?: string;
  dataType?: ColumnDataType;
  length?: number | null;
  precision?: number | null;
  scale?: number | null;
  nullable?: boolean;
  unique?: boolean;
  autoIncrement?: boolean;
  defaultValue?: string | null;
};