/**
 * 图标语义映射表（Lucide）
 *
 * 全项目统一通过 <Icon :name="..."/> 使用，命名空间固定为 `lucide:`。
 * 在这里集中按"业务语义"声明，便于后续按场景统一替换。
 *
 * 添加新图标请遵循：
 * - 业务语义优先，不要用形状命名（避免：square、circle，应该用：tool、user）
 * - 名称去掉前缀 `lucide:`，使用时通过模板字符串拼
 */

export const ICON_PREFIX = 'lucide:'

/** 顶部主导航 + 顶栏操作 */
export const NAV_ICON = {
  map: 'map-pin',
  checklist: 'clipboard-list',
  verify: 'shield-check',
  tools: 'wrench',
  hotline: 'phone-call',
  report: 'megaphone',
  shareCard: 'share-2',
  assistant: 'bot-message-square',
  user: 'circle-user-round',
  arrowDown: 'chevron-down',
} as const

/** 个人中心菜单 */
export const USER_ICON = {
  checklist: 'bookmark',
  favorites: 'heart',
  reports: 'flag',
  alerts: 'bell-ring',
  login: 'log-in',
  logout: 'log-out',
} as const

/** 雷点分类（CATEGORY_MAP 使用） */
export const CATEGORY_ICON = {
  traffic: 'car-front',
  stay: 'bed-double',
  food: 'utensils',
  ticket: 'ticket',
  shop: 'shopping-bag',
  tour: 'users-round',
} as const

/** 工具入口 */
export const TOOL_ICON = {
  checklist: 'clipboard-list',
  routeScan: 'radar',
  priceTrap: 'wallet',
  verify: 'shield-check',
  sos: 'phone-call',
  all: 'layout-grid',
  priceTrap2: 'tag',
} as const

/** 通用状态与操作 */
export const UI_ICON = {
  // 状态
  verified: 'badge-check',
  pending: 'clock-3',
  high: 'flame',
  // 通用
  search: 'search',
  flash: 'zap',
  store: 'store',
  pin: 'map-pin',
  bar: 'bar-chart-3',
  bulb: 'lightbulb',
  phone: 'phone',
  chevronRight: 'chevron-right',
  plus: 'plus',
  close: 'x',
  bell: 'bell',
  bookmark: 'bookmark',
  share: 'share-2',
  download: 'download',
  upload: 'upload',
  edit: 'pen-line',
  lock: 'lock',
  warn: 'triangle-alert',
  check: 'check',
  loading: 'loader-circle',
  star: 'star',
  crown: 'crown',
  wallet: 'wallet',
  shield: 'shield',
  info: 'info',
  // 联系/求救
  siren: 'siren',
  // 表单
  smartphone: 'smartphone',
  keyhole: 'lock-keyhole',
  wechat: 'message-circle',
  // 案例 / 投稿
  pencil: 'pencil',
  eye: 'eye',
  heart: 'heart',
  // 工作流
  layoutGrid: 'layout-grid',
  // 数据/分析
  filter: 'sliders-horizontal',
  // 应急
  hospital: 'cross',
  // 反馈
  thumbsUp: 'thumbs-up',
  // 设置
  settings: 'settings',
} as const

/** 安全地拼接全名 */
export const lc = (key: string) => `${ICON_PREFIX}${key}`
