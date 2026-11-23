import type { NuxtPage } from "@nuxt/schema";

/**
 * 早期版本遗留路由
 * - 景点档案、避雷评估、案例库、黑名单
 * - 后续逐步合并到 content/* 后可下线
 */
export const legacyRoutes: NuxtPage[] = [
  { name: "spots", path: "/spots", file: "@pages/spots/Index.vue" },
  { name: "spots-detail", path: "/spots/:id", file: "@pages/spots/Detail.vue" },
  { name: "assess", path: "/assess", file: "@pages/assess/Index.vue" },
  { name: "assess-detail", path: "/assess/:id", file: "@pages/assess/Detail.vue" },
  { name: "cases", path: "/cases", file: "@pages/cases/Index.vue" },
  { name: "cases-detail", path: "/cases/:id", file: "@pages/cases/Detail.vue" },
  { name: "blacklist", path: "/blacklist", file: "@pages/blacklist/Index.vue" },
];
