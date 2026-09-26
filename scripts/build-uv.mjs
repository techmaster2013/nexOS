import { mkdir, cp, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const uvSource = join(root, "node_modules/@titaniumnetwork-dev/ultraviolet/dist");
const target = join(root, "uv");
await mkdir(target, { recursive: true });
for (const file of ["uv.bundle.js", "uv.client.js", "uv.handler.js"]) await cp(join(uvSource, file), join(target, file));

const service = join(root, "service");
await mkdir(service, { recursive: true });
let sw = await readFile(join(uvSource, "uv.sw.js"), "utf8");
sw = sw.replaceAll("/uv/uv.bundle.js", "../uv/uv.bundle.js").replaceAll("/uv/uv.config.js", "../uv/uv.config.js");
await writeFile(join(service, "sw.js"), sw);

const muxSource = join(root, "node_modules/@mercuryworkshop/bare-mux/dist");
const mux = join(root, "baremux");
await mkdir(mux, { recursive: true });
await cp(join(muxSource, "index.js"), join(mux, "index.js"));
await cp(join(muxSource, "worker.js"), join(mux, "worker.js"));

const epoxySource = join(root, "node_modules/@mercuryworkshop/epoxy-transport/dist");
const libcurlSource = join(root, "node_modules/@mercuryworkshop/libcurl-transport/dist");
const epoxy = join(root, "epoxy");
await mkdir(epoxy, { recursive: true });
await cp(join(epoxySource, "index.mjs"), join(epoxy, "index.mjs"));
const libcurl = join(root, "libcurl");
await mkdir(libcurl, { recursive: true });
await cp(join(libcurlSource, "index.mjs"), join(libcurl, "index.mjs"));

console.log("Ultraviolet + bare-mux + Epoxy assets built.");
