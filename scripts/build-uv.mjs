import { mkdir, cp } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "node_modules/@titaniumnetwork-dev/ultraviolet/dist");
const target = join(root, "uv");

await mkdir(target, { recursive: true });
for (const file of ["uv.bundle.js", "uv.client.js", "uv.handler.js", "uv.sw.js"]) {
  await cp(join(source, file), join(target, file));
}
console.log("Ultraviolet assets copied to uv/");
