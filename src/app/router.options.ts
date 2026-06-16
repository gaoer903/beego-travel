import type { RouterConfig } from '@nuxt/schema'

/**
 * Vue Router 运行时配置
 *
 * 路由表本身由 `nuxt.config.ts` 的 `pages:extend` hook 注入
 * （路由声明见 `app/routes.config.ts`），这里只放运行时行为。
 */

export default <RouterConfig>{
  /**
   * 滚动行为：进入新页面滚到顶部，前进/后退恢复浏览位置
   */
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition || { top: 0 }
  },
}
