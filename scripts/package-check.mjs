import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, copyFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

mkdirSync("artifacts", { recursive: true });
const packed = spawnSync(
  "npm",
  ["pack", "--ignore-scripts", "--json", "--pack-destination", "artifacts"],
  { encoding: "utf8" },
);
if (packed.status !== 0) throw new Error(packed.stderr || "npm pack failed");
const [manifest] = JSON.parse(packed.stdout);
const paths = manifest.files.map((file) => file.path);
const required = [
  "LICENSE",
  "README.md",
  "lib/index.js",
  "lib/index.d.ts",
  "src/index.ts",
  "nitro.json",
  "NitroAirwallex.podspec",
  "android/CMakeLists.txt",
  "android/build.gradle",
  "app.plugin.js",
  "nitrogen/generated/ios/NitroAirwallex+autolinking.rb",
  "nitrogen/generated/android/NitroAirwallex+autolinking.cmake",
];
for (const path of required) {
  if (!paths.includes(path)) throw new Error(`Missing package file: ${path}`);
}
for (const path of paths) {
  if (
    /(^|\/)(node_modules|build|\.cxx|\.gradle|Pods|example|native-tests|tests|scripts)(\/|$)|(^|\/)\.env|\.npmrc$|local\.properties$/.test(
      path,
    )
  ) {
    throw new Error(`Development/private file in npm archive: ${path}`);
  }
  const content = readFileSync(path, "utf8");
  if (
    /\/Users\/|\/private\/tmp\/|Maxmove-app\/maxmove(?:\W|$)|services\/payments-svc|Infisical/.test(
      content,
    )
  ) {
    throw new Error(`Private workspace reference in npm archive: ${path}`);
  }
  if (
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|npm_[A-Za-z0-9]{30,}|gh[pousr]_[A-Za-z0-9]{30,}/.test(
      content,
    )
  ) {
    throw new Error(`Credential-shaped value in npm archive: ${path}`);
  }
}
if (manifest.unpackedSize > 2_000_000)
  throw new Error(`Unexpected package size: ${manifest.unpackedSize}`);
const archive = resolve("artifacts", manifest.filename);
// Local tarball dependencies are cached by path. Give each payload its own path
// so the example's lockfile always verifies the artifact being tested.
const exampleArchive = `${manifest.name}-${manifest.version}-${manifest.shasum}.tgz`;
copyFileSync(archive, resolve("artifacts", exampleArchive));
writeFileSync("artifacts/package-manifest.json", JSON.stringify({ exampleArchive }));
console.log(
  JSON.stringify(
    {
      name: manifest.name,
      version: manifest.version,
      files: paths.length,
      unpackedBytes: manifest.unpackedSize,
      packedBytes: manifest.size,
      archive,
    },
    null,
    2,
  ),
);
