import type { NuxtPage } from "@nuxt/schema";
import { view } from "./resolver";

/**
 * 内容类路由
 * - 事件通报、城市档案、踩坑墙
 */
export const contentRoutes: NuxtPage[] = [
  { name: "incidents", path: "/incidents", file: view("incidents/Index.vue") },
  { name: "incidents-detail", path: "/incidents/:id", file: view("incidents/Detail.vue") },
  { name: "cities", path: "/cities", file: view("cities/Index.vue") },
  { name: "cities-detail", path: "/cities/:slug", file: view("cities/Detail.vue") },
  { name: "wall", path: "/wall", file: view("wall/Index.vue") },
];
