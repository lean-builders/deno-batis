import type { TableSchema } from "./schema.ts";
import { writeJson } from "./util.ts";

export async function writeCrudTests(tables: TableSchema[], outDir: string) {
  // TODO: Generate CRUD tests per table.
  // For now, just ensure directory exists and remove stale generated files later.
  void tables;
  void outDir;
}

export async function writeMeta(
  meta: { ddlHash: string; tables: TableSchema[] },
  path: string,
) {
  await writeJson(path, meta);
}
