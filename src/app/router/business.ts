import type { NuxtPage } from "@nuxt/schema";
import { view } from "./resolver";

/**
 * 商业 / 介绍类路由
 * - VIP 订阅、深度报告、关于我们
 */
export const businessRoutes: NuxtPage[] = [
  { name: "vip", path: "/vip", file: view("vip/Index.vue") },
  { name: "report", path: "/report/:action?", file: view("report/Index.vue") },
  { name: "about", path: "/about", file: view("about/Index.vue") },
];
