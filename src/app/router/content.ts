import type { NuxtPage } from "@nuxt/schema";

/**
 * 内容类路由
 * - 事件通报、城市档案、踩坑墙
 */
export const contentRoutes: NuxtPage[] = [
  { name: "incidents", path: "/incidents", file: "@pages/incidents/Index.vue" },
  { name: "incidents-detail", path: "/incidents/:id", file: "@pages/incidents/Detail.vue" },
  { name: "cities", path: "/cities", file: "@pages/cities/Index.vue" },
  { name: "cities-detail", path: "/cities/:slug", file: "@pages/cities/Detail.vue" },
  { name: "wall", path: "/wall", file: "@pages/wall/Index.vue" },
];
