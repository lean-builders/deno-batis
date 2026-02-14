import { build } from "./commands/build.ts";
import { runTests } from "./commands/test.ts";

const COMMANDS = new Set(["build", "test"]);

export async function main(args: string[]) {
  const [cmd] = args;
  if (!cmd || !COMMANDS.has(cmd)) {
    console.error("Usage: deno-batis <build|test>");
    Deno.exit(1);
  }

  if (cmd === "build") {
    await build();
    return;
  }

  if (cmd === "test") {
    await runTests();
    return;
  }
}

if (import.meta.main) {
  await main(Deno.args);
}
