import { fileURLToPath } from "node:url";
import { defineNuxtConfig } from "nuxt/config";
import { customRoutes } from "./src/app/router";

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineNuxtConfig({
  compatibilityDate: "2025-01-01",
  devtools: { enabled: true },

  /**
   * 全部源码集中在 src/ 目录：
   *   src/app/        — app.vue 同级的 router.options.ts、自定义路由 router/
   *   src/components/ src/pages/ src/layouts/ src/assets/
   *   src/composables/ src/stores/ src/utils/ src/types/
   *   server/         — Nitro 服务端（已移到根目录）
   *
   * srcDir 指向 src 后：
   *   - `~/` / `@/`   → src/
   *   - `~~/` / `@@/` → 项目根（rootDir）
   *   - `<srcDir>/app/router.options.ts` 仍按 Nuxt 约定生效
   */
  srcDir: "src",

  /**
   * 语义化命名别名，配合 src/ 目录使用，import 更短更直观。
   * 这些会被 Nuxt 写进 .nuxt/tsconfig.json 的 paths，TS 与运行时一致。
   * 仍兼容原有的 `~/xxx` 写法（`~` = srcDir = src/）。
   */
  alias: {
    "@router": r("./src/app/router"),
    "@components": r("./src/components"),
    "@pages": r("./src/pages"),
    "@layouts": r("./src/layouts"),
    "@assets": r("./src/assets"),
    "@composables": r("./src/composables"),
    "@stores": r("./src/stores"),
    "@utils": r("./src/utils"),
  },

  modules: [
    "@element-plus/nuxt",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@vueuse/nuxt",
    "@nuxt/icon",
    "@nuxtjs/supabase",
    "@nuxt/ui",
    "nuxt-echarts",
  ],

  /**
   * 路由：采用集中式声明，通过 pages:extend hook 注入自定义路由表
   * - pages: true 强制启用 vue-router
   * - 路由声明按业务模块拆分在 src/app/router/<scope>.ts，由 src/app/router/index.ts 聚合
   * - 运行时配置（scrollBehavior 等）在 src/app/router.options.ts
   * - 通过下面 dir.pages 禁用 Nuxt 对 pages/ 的自动文件式路由扫描，
   *   src/pages/ 目录改作"路由级组件"的存放位置，仅由 customRoutes 手动引用
   */
  pages: true,

  serverDir: "server",

  dir: {
    pages: "_pages_unused",
    /**
     * srcDir 指向 src/ 后，Nuxt 会把 public 目录按 srcDir 解析（即 src/public）。
     * 静态资源放在项目根的 public/，故用相对 srcDir 的 "../public" 指回根目录，
     * 与上面 pages 一致使用相对路径写法，否则 /favicon.png、/maps/*.json 会 404。
     */
    public: "../public",
  },

  hooks: {
    /**
     * pages:extend 在构建期触发。本项目通过 dir.pages 禁用了 Nuxt 的
     * 自动扫描，初始 pages = []，这里 push 我们 app/router/ 下声明的
     * 自定义路由表，由 Nuxt 自动处理 lazy import / 取 default /
     * code-split / SSR payload。
     */
    "pages:extend"(pages) {
      pages.push(...customRoutes);
    },
  },

  css: ["~/assets/css/main.css"],

  app: {
    head: {
      title: "避过 · 这地方，避过吗？",
      htmlAttrs: { lang: "zh-CN" },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "避过 — 基于 12315、黑猫投诉、文旅通报等真实数据的城市避雷工具，今天你想避哪儿的坑？",
        },
        { name: "keywords", content: "旅行避坑,避雷地图,景点黑名单,城市投诉,真假鉴别,出行情报" },
        { name: "theme-color", content: "#10b981" },
      ],
      link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.png" }],
    },
  },

  elementPlus: {
    importStyle: "css",
  },

  postcss: {
    plugins: {
      "@tailwindcss/postcss": {},
      autoprefixer: {},
    },
  },

  runtimeConfig: {
    deepseekApiKey: process.env.NUXT_DEEPSEEK_API_KEY || "",
    deepseekBaseUrl: process.env.NUXT_DEEPSEEK_BASE_URL || "https://api.deepseek.com",

    public: {
      appName: "避过",
      appSlogan: "这地方，避过吗？",
      appVersion: "0.2.0",
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_KEY: process.env.SUPABASE_PUBLISHABLE_KEY,
    },
  },

  supabase: {
    redirect: false,
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      exclude: [],
    },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  echarts: {
    renderer: ["canvas"], // 仅使用 canvas 渲染，禁用 SVG 渲染以节省资源
    charts: ["EffectScatterChart"],

    components: ["GeoComponent", "TooltipComponent"],
  },

  experimental: {
    payloadExtraction: true,
  },
});
