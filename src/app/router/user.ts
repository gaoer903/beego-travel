import type { NuxtPage } from "@nuxt/schema";
import { view } from "./resolver";

/**
 * 账户与用户中心
 * - 登录、用户首页、行前清单、收藏、举报、订阅提醒
 */
export const userRoutes: NuxtPage[] = [
  { name: "login", path: "/login", file: view("login/Index.vue") },
  { name: "confirm", path: "/confirm", file: view("login/Confirm.vue") },
  { name: "user", path: "/user", file: view("user/Index.vue") },
  { name: "user-checklist", path: "/user/checklist", file: view("user/Checklist.vue") },
  { name: "user-favorites", path: "/user/favorites", file: view("user/Favorites.vue") },
  { name: "user-reports", path: "/user/reports", file: view("user/Reports.vue") },
  { name: "user-alerts", path: "/user/alerts", file: view("user/Alerts.vue") },
];
