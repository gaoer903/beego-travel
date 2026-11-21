/**
 * SSR HTML 响应压缩插件
 *
 * 用 Node 内置 zlib 对动态 HTML 响应做 brotli / gzip 压缩。
 * 仅压 text/html；静态 _nuxt/* 资源由 Nitro compressPublicAssets 单独处理。
 *
 * 注意：同步压缩会短暂阻塞 event loop，适用于本地预览/小流量场景。
 * 生产高并发建议在 Nginx / CDN 层做压缩，移除此插件。
 */
import { brotliCompressSync, constants, gzipSync } from "node:zlib";

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("render:response", (response, { event }) => {
    if (!response.headers) response.headers = {};
    const accept = getRequestHeader(event, "accept-encoding") ?? "";
    const ct = String(response.headers["content-type"] ?? "");

    // 只压 HTML；跳过已编码的响应
    if (!ct.includes("text/html")) return;
    if (response.headers["content-encoding"]) return;

    const buf =
      typeof response.body === "string"
        ? Buffer.from(response.body, "utf-8")
        : Buffer.isBuffer(response.body)
          ? response.body
          : null;
    if (!buf) return;

    if (accept.includes("br")) {
      // quality 4：brotli 速度/压缩率均衡点（0=最快，11=最小）
      response.body = brotliCompressSync(buf, {
        params: { [constants.BROTLI_PARAM_QUALITY]: 4 },
      });
      response.headers["content-encoding"] = "br";
    } else if (accept.includes("gzip")) {
      response.body = gzipSync(buf, { level: 6 });
      response.headers["content-encoding"] = "gzip";
    } else {
      return;
    }

    // body 大小已变，必须删掉旧的 content-length
    delete response.headers["content-length"];
    // 告知缓存层响应因 Accept-Encoding 而异
    const vary = response.headers["vary"];
    response.headers["vary"] = vary
      ? `${vary}, Accept-Encoding`
      : "Accept-Encoding";
  });
});
