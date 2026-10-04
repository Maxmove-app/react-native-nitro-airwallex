import { spawnSync } from "node:child_process";

for (const [command, args, cwd] of [
  ["bun", ["run", "build"], process.cwd()],
  ["node", ["scripts/package-check.mjs"], process.cwd()],
  ["bun", ["install", "--force"], `${process.cwd()}/example`],
]) {
  const result = spawnSync(command, args, { cwd, stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
