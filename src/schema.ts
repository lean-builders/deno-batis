import type { CreateStmt } from "./parser.ts";

export type ColumnSchema = {
  name: string;
  type: string;
  notNull: boolean;
  hasDefault: boolean;
};

export type TableSchema = {
  tableName: string;
  columns: ColumnSchema[];
  primaryKey: string | null;
};

export function createSchemaFromCreateStmts(_stmts: CreateStmt[]): TableSchema[] {
  // TODO: Convert CreateStmt nodes into the internal schema model.
  return [];
}
