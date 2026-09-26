/* Ultraviolet configuration for nexOS. */
const base = self.location.pathname.includes("/uv/")
  ? self.location.pathname.replace(/\/uv\/.*$/, "/")
  : new URL("./", self.location).pathname;

self.__uv$config = {
  prefix: base + "service/",
  bare: "https://tomp.app/",
  encodeUrl: Ultraviolet.codec.xor.encode,
  decodeUrl: Ultraviolet.codec.xor.decode,
  handler: base + "uv/uv.handler.js",
  client: base + "uv/uv.client.js",
  bundle: base + "uv/uv.bundle.js",
  config: base + "uv/uv.config.js",
  sw: base + "uv/uv.sw.js",
};