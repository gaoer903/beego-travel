import type { NuxtPage } from "@nuxt/schema";
import { view } from "./resolver";

/**
 * 首页
 */
export const homeRoutes: NuxtPage[] = [
  { name: "home", path: "/", file: view("home/Index.vue") },
  // { name: "web-learning", path: "/web-learning", file: view("web/Index.vue") },
];
