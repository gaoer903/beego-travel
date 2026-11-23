import type { NuxtPage } from "@nuxt/schema";

/**
 * 账户与用户中心
 * - 登录、用户首页、行前清单、收藏、举报、订阅提醒
 */
export const userRoutes: NuxtPage[] = [
  { name: "login", path: "/login", file: "@pages/login/Index.vue" },
  { name: "confirm", path: "/confirm", file: "@pages/login/Confirm.vue" },
  { name: "user", path: "/user", file: "@pages/user/Index.vue" },
  { name: "user-checklist", path: "/user/checklist", file: "@pages/user/Checklist.vue" },
  { name: "user-favorites", path: "/user/favorites", file: "@pages/user/Favorites.vue" },
  { name: "user-reports", path: "/user/reports", file: "@pages/user/Reports.vue" },
  { name: "user-alerts", path: "/user/alerts", file: "@pages/user/Alerts.vue" },
];
