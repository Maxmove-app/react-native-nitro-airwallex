import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

for (const [command, args, cwd] of [
  ["bun", ["run", "build"], process.cwd()],
  ["node", ["scripts/package-check.mjs"], process.cwd()],
]) {
  const result = spawnSync(command, args, { cwd, stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const { exampleArchive } = JSON.parse(readFileSync("artifacts/package-manifest.json", "utf8"));
const install = spawnSync("bun", ["add", `file:../artifacts/${exampleArchive}`], {
  cwd: `${process.cwd()}/example`,
  stdio: "inherit",
});
if (install.status !== 0) process.exit(install.status ?? 1);
