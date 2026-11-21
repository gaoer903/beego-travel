import { createResolver } from "@nuxt/kit";

/**
 * 路由 file 字段路径助手
 *
 * 锚定本文件所在目录（`src/app/router/`），到 `src/pages/` 是 `../../pages/`。
 *
 * pages:extend hook 在 Node 端运行，**不走 vite 别名**，必须用绝对路径，
 * 因此用 `createResolver(import.meta.url)` 把相对路径解析为绝对路径。
 *
 * 每个分组文件统一通过 `view('<scope>/<Name>.vue')` 声明路由组件路径，
 * 不要在分组文件里重复写 `../../pages/...` 前缀。
 *
 * 注意：Nuxt 的 dir.pages 已被改为 '_pages_unused'（见 nuxt.config.ts），
 * 因此 pages/ 目录不会被 Nuxt 自动扫描成文件式路由，只供本助手手动引用。
 */
const { resolve } = createResolver(import.meta.url);

export const view = (p: string) => resolve(`../../pages/${p}`);
