export async function readDdlFiles(dir: string): Promise<string> {
  const entries = [] as string[];
  for await (const entry of Deno.readDir(dir)) {
    if (!entry.isFile) continue;
    if (!entry.name.endsWith(".sql")) continue;
    entries.push(entry.name);
  }
  entries.sort();

  const parts: string[] = [];
  for (const name of entries) {
    const text = await Deno.readTextFile(`${dir}/${name}`);
    parts.push(text);
  }

  return parts.join("\n\n");
}
