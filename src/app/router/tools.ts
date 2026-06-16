import type { NuxtPage } from '@nuxt/schema'
import { view } from './resolver'

/**
 * 工具 / 信息类路由
 * - 避雷地图、行前清单、真假鉴别、工具集、维权热线
 */
export const toolsRoutes: NuxtPage[] = [
  { name: 'map', path: '/map', file: view('map/Index.vue') },
  { name: 'checklist', path: '/checklist', file: view('checklist/Index.vue') },
  { name: 'verify', path: '/verify', file: view('verify/Index.vue') },
  { name: 'tools', path: '/tools', file: view('tools/Index.vue') },
  { name: 'tools-price-trap', path: '/tools/price-trap', file: view('tools/PriceTrap.vue') },
  { name: 'hotline', path: '/hotline', file: view('hotline/Index.vue') },
]
