import type { NuxtPage } from "@nuxt/schema";
import { view } from "./resolver";

/**
 * 早期版本遗留路由
 * - 景点档案、避雷评估、案例库、黑名单
 * - 后续逐步合并到 content/* 后可下线
 */
export const legacyRoutes: NuxtPage[] = [
  { name: "spots", path: "/spots", file: view("spots/Index.vue") },
  { name: "spots-detail", path: "/spots/:id", file: view("spots/Detail.vue") },
  { name: "assess", path: "/assess", file: view("assess/Index.vue") },
  { name: "assess-detail", path: "/assess/:id", file: view("assess/Detail.vue") },
  { name: "cases", path: "/cases", file: view("cases/Index.vue") },
  { name: "cases-detail", path: "/cases/:id", file: view("cases/Detail.vue") },
  { name: "blacklist", path: "/blacklist", file: view("blacklist/Index.vue") },
];
