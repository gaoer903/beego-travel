import type { NuxtPage } from "@nuxt/schema";

import { homeRoutes } from "./home";
import { toolsRoutes } from "./tools";
import { contentRoutes } from "./content";
import { legacyRoutes } from "./legacy";
import { userRoutes } from "./user";
import { businessRoutes } from "./business";

/**
 * 自定义路由总表
 *
 * 通过 `nuxt.config.ts` 的 `hooks: { 'pages:extend' }` 注入到 Nuxt 路由系统。
 * 各业务模块的路由分别声明在同目录下的子文件中，本文件只做聚合，新增模块时：
 *   ① 在 `app/router/` 下新建 `<scope>.ts`，导出 `xxxRoutes: NuxtPage[]`
 *   ② 在此文件 import 并展开到下方数组即可
 *
 * 新增单条路由：直接编辑对应的子文件，无需改动这里。
 */
export const customRoutes: NuxtPage[] = [
  ...homeRoutes,
  ...toolsRoutes,
  ...contentRoutes,
  ...legacyRoutes,
  ...userRoutes,
  ...businessRoutes,
];
