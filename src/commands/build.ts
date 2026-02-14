import { ensureDir } from "../fs.ts";
import { readDdlFiles } from "../ddl.ts";
import { parseDdlToAst, extractCreateStmts } from "../parser.ts";
import { createSchemaFromCreateStmts, type TableSchema } from "../schema.ts";
import { computeSha256Hex, readJson, writeJson } from "../util.ts";
import { writeCrudTests, writeMeta } from "../generator.ts";

const DDL_DIR = "db/ddl";
const LOCK_PATH = "db/schema.lock.json";
const GENERATED_DIR = "generated";
const CRUD_DIR = "generated/crud";
const META_PATH = "generated/_meta.json";

export async function build() {
  await ensureDir(DDL_DIR);
  await ensureDir(GENERATED_DIR);
  await ensureDir(CRUD_DIR);

  const ddl = await readDdlFiles(DDL_DIR);
  const ddlHash = await computeSha256Hex(ddl);

  const previousLock = await readJson<{ ddlHash?: string }>(LOCK_PATH);

  const ast = parseDdlToAst(ddl);
  const createStmts = extractCreateStmts(ast);
  const schema = createSchemaFromCreateStmts(createStmts);

  const changesDetected = previousLock?.ddlHash !== ddlHash;

  if (changesDetected) {
    await writeCrudTests(schema, CRUD_DIR);
    await writeMeta({ ddlHash, tables: schema }, META_PATH);
    await writeJson(LOCK_PATH, { ddlHash, tables: schema });
  }

  printSummary(schema, changesDetected);
}

function printSummary(schema: TableSchema[], changed: boolean) {
  if (!changed) {
    for (const table of schema) {
      console.log(`${table.tableName}: unchanged`);
    }
    if (schema.length === 0) {
      console.log("no tables detected");
    }
    return;
  }

  for (const table of schema) {
    console.log(`${table.tableName}: regenerated`);
  }
  if (schema.length === 0) {
    console.log("no tables detected");
  }
}
