import type { NuxtPage } from "@nuxt/schema";

/**
 * 工具 / 信息类路由
 * - 避雷地图、行前清单、真假鉴别、工具集、维权热线
 */
export const toolsRoutes: NuxtPage[] = [
  { name: "map", path: "/map", file: "@pages/map/Index.vue" },
  { name: "checklist", path: "/checklist", file: "@pages/checklist/Index.vue" },
  { name: "verify", path: "/verify", file: "@pages/verify/Index.vue" },
  { name: "tools", path: "/tools", file: "@pages/tools/Index.vue" },
  { name: "tools-price-trap", path: "/tools/price-trap", file: "@pages/tools/PriceTrap.vue" },
  { name: "hotline", path: "/hotline", file: "@pages/hotline/Index.vue" },
];
