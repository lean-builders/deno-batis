import { parse } from "@supabase/pg-parser";

export type PgAst = unknown;
export type CreateStmt = unknown;

export function parseDdlToAst(ddl: string): PgAst {
  if (!ddl.trim()) {
    return [];
  }

  try {
    return parse(ddl);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`DDL parse failed: ${message}`);
  }
}

export function extractCreateStmts(ast: PgAst): CreateStmt[] {
  // TODO: Walk AST and extract CreateStmt nodes.
  // Returning an empty list for now keeps the pipeline runnable.
  void ast;
  return [];
}
