export async function runTests() {
  const cmd = new Deno.Command("deno", {
    args: ["test", "generated/"],
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });
  const result = await cmd.output();
  if (!result.success) {
    Deno.exit(result.code);
  }
}
