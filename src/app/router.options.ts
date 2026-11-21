import type { RouterConfig } from "@nuxt/schema";

/**
 * Vue Router 运行时配置
 *
 * 路由表本身由 `nuxt.config.ts` 的 `pages:extend` hook 注入
 * （路由声明见 `app/routes.config.ts`），这里只放运行时行为。
 */

export default <RouterConfig>{
  /**
   * 滚动行为：进入新页面滚到顶部，前进/后退恢复浏览位置
   *
   * 等 `page:finish` 钩子（新页面异步数据加载完、真正渲染后）再滚动，
   * 否则同步滚动会作用在尚未卸载的旧页面上，出现「旧页面先滚到顶再跳转」的现象。
   */
  scrollBehavior(_to, _from, savedPosition) {
    const nuxtApp = useNuxtApp();
    return new Promise((resolve) => {
      nuxtApp.hooks.hookOnce("page:finish", () => {
        resolve(savedPosition || { top: 0 });
      });
    });
  },
};
