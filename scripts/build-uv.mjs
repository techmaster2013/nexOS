import { mkdir, cp, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "node_modules/@titaniumnetwork-dev/ultraviolet/dist");
const target = join(root, "uv");

await mkdir(target, { recursive: true });
for (const file of ["uv.bundle.js", "uv.client.js", "uv.handler.js", "uv.sw.js"]) {
  const out = join(target, file);
  await cp(join(source, file), out);
  if (file === "uv.sw.js") {
    let sw = await readFile(out, "utf8");
    sw = sw
      .replaceAll("/uv/uv.bundle.js", "./uv.bundle.js")
      .replaceAll("/uv/uv.config.js", "./uv.config.js");
    await writeFile(out, sw);
  }
}
console.log("Ultraviolet assets copied to uv/");
