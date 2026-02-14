export async function ensureDir(path: string) {
  await Deno.mkdir(path, { recursive: true });
}
