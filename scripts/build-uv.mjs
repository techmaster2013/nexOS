import { mkdir, cp, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "node_modules/@titaniumnetwork-dev/ultraviolet/dist");
const target = join(root, "uv");

await mkdir(target, { recursive: true });
for (const file of ["uv.bundle.js", "uv.client.js", "uv.handler.js"]) {
  await cp(join(source, file), join(target, file));
}
const service = join(root, "service");
await mkdir(service, { recursive: true });
let sw = await readFile(join(source, "uv.sw.js"), "utf8");
sw = sw
  .replaceAll("/uv/uv.bundle.js", "../uv/uv.bundle.js")
  .replaceAll("/uv/uv.config.js", "../uv/uv.config.js");
await writeFile(join(service, "sw.js"), sw);
console.log("Ultraviolet assets copied to uv/");
