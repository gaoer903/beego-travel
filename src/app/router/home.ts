import type { NuxtPage } from "@nuxt/schema";

/**
 * 首页
 */
export const homeRoutes: NuxtPage[] = [
  { name: "home", path: "/", file: "@pages/home/Index.vue" },
  // { name: "web-learning", path: "/web-learning", file: "@pages/web/Index.vue" },
];
