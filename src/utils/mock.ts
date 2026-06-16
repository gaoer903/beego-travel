import type {
  CategoryMeta,
  CityRank,
  Incident,
  IncidentCategory,
  PitCase,
  PitTalk,
  Spot,
  ToolEntry,
} from '~/types'

/**
 * 分类视觉元数据（category-driven design 的核心）
 * 所有雷点 / 吐槽根据 category 自动套用配色 + 图标，无需配图。
 */
export const CATEGORY_MAP: Record<IncidentCategory, CategoryMeta> = {
  traffic: {
    key: 'traffic',
    label: '交通',
    icon: 'lucide:car',
    bg: 'bg-cat-traffic',
    ink: 'text-cat-traffic-ink',
  },
  stay: {
    key: 'stay',
    label: '住宿',
    icon: 'lucide:bed',
    bg: 'bg-cat-stay',
    ink: 'text-cat-stay-ink',
  },
  food: {
    key: 'food',
    label: '餐饮',
    icon: 'lucide:utensils',
    bg: 'bg-cat-food',
    ink: 'text-cat-food-ink',
  },
  ticket: {
    key: 'ticket',
    label: '景区',
    icon: 'lucide:ticket',
    bg: 'bg-cat-ticket',
    ink: 'text-cat-ticket-ink',
  },
  shop: {
    key: 'shop',
    label: '购物',
    icon: 'lucide:shopping-bag',
    bg: 'bg-cat-shop',
    ink: 'text-cat-shop-ink',
  },
  tour: {
    key: 'tour',
    label: '跟团',
    icon: 'lucide:bus',
    bg: 'bg-cat-tour',
    ink: 'text-cat-tour-ink',
  },
}

/** 6 大工具入口（第 6 个为「全部工具」） */
export const TOOL_ENTRIES: ToolEntry[] = [
  {
    id: 'checklist',
    title: '行前清单生成',
    subtitle: '一键生成 PDF 清单',
    icon: 'lucide:clipboard-list',
    to: '/checklist',
  },
  {
    id: 'route-scan',
    title: '行程风险扫描',
    subtitle: '行程重点早知道',
    icon: 'lucide:radar',
    to: '/assess',
  },
  {
    id: 'price-trap',
    title: '消费陷阱监控',
    subtitle: '识别套路，省钱避坑',
    icon: 'lucide:wallet',
    to: '/tools/price-trap',
  },
  {
    id: 'verify',
    title: '真假鉴别',
    subtitle: '拍照识别真伪',
    icon: 'lucide:shield-check',
    to: '/verify',
  },
  {
    id: 'sos',
    title: '应急联系',
    subtitle: '一键拨号求救',
    icon: 'lucide:phone-call',
    to: '/hotline',
  },
  {
    id: 'all',
    title: '全部 12 个工具',
    subtitle: '更多实用工具集合',
    icon: 'lucide:grid',
    to: '/tools',
    highlight: true,
  },
]

/** 热门搜索 */
export const HOT_SEARCHES = ['丽江', '三亚', '西双版纳', '西安', '重庆']

/** 今日已核实 · 雷点（首页展示 3 张） */
export const MOCK_INCIDENTS: Incident[] = [
  {
    id: 'inc-001',
    category: 'traffic',
    risk: 'high',
    status: 'verified',
    city: '丽江',
    place: '丽江火车站',
    summary: '出站口黑车开价 200，正常 30 块',
    sources: [{ label: '12315' }, { label: '黑猫' }],
    complaintCount: 14,
    postedAt: '3 天前',
    alternative: '滴滴 / 正规出租队',
    reportChannel: '12315',
  },
  {
    id: 'inc-002',
    category: 'stay',
    risk: 'new',
    status: 'verified',
    city: '丽江',
    place: '古城某客栈',
    summary: '入住后被强收清洁费 300',
    sources: [{ label: '黑猫' }, { label: '文旅通报' }],
    complaintCount: 9,
    postedAt: '1 周前',
    alternative: '入住前确认费用明细',
    reportChannel: '12315',
  },
  {
    id: 'inc-003',
    category: 'food',
    risk: 'high',
    status: 'verified',
    city: '三亚',
    place: '阳光小吃街',
    summary: '海鲜按只换克，38 元/只起步',
    sources: [{ label: '12315' }],
    complaintCount: 7,
    postedAt: '2 周前',
    alternative: '要求商家公示菜单',
    reportChannel: '12315',
  },
]

/** 高风险城市 TOP5 */
export const MOCK_CITY_RANK: CityRank[] = [
  { rank: 1, city: '丽江', risk: 'high', badge: '高风险' },
  { rank: 2, city: '三亚', risk: 'high', badge: '高风险' },
  { rank: 3, city: '西双版纳', risk: 'new', badge: '新坑' },
  { rank: 4, city: '桂林', risk: 'new', badge: '新坑' },
  { rank: 5, city: '上海', risk: 'warn', badge: '注意' },
]

/** 踩坑墙 · 实时吐槽（未核实） */
export const MOCK_PIT_TALKS: PitTalk[] = [
  {
    id: 'talk-1',
    emoji: '😡',
    content: '在三亚被出租车绕路多收了 200！',
    city: '三亚',
    tags: ['#交通避坑', '#三亚'],
    postedAt: '2 小时前',
    meTooCount: 18,
    status: 'pending',
    category: 'traffic',
  },
  {
    id: 'talk-2',
    emoji: '🍴',
    content: '丽江古城吃个饭等于被打劫',
    city: '丽江',
    tags: ['#餐饮避坑', '#丽江'],
    postedAt: '5 小时前',
    meTooCount: 18,
    status: 'pending',
    category: 'food',
  },
  {
    id: 'talk-3',
    emoji: '🎫',
    content: '景区门票套路多，隐形收费防不胜防',
    tags: ['#景区避坑'],
    postedAt: '3 小时前',
    meTooCount: 18,
    status: 'pending',
    category: 'ticket',
  },
  {
    id: 'talk-4',
    emoji: '🏠',
    content: '成都网红民宿，照片和实物差太多了',
    city: '成都',
    tags: ['#住宿避坑', '#成都'],
    postedAt: '4 小时前',
    meTooCount: 18,
    status: 'pending',
    category: 'stay',
  },
  {
    id: 'talk-5',
    emoji: '🎟️',
    content: '西安某景区门票，现场比网上贵一倍',
    city: '西安',
    tags: ['#景区避坑', '#西安'],
    postedAt: '6 小时前',
    meTooCount: 18,
    status: 'pending',
    category: 'ticket',
  },
  {
    id: 'talk-6',
    emoji: '🛏️',
    content: '机场附近酒店宰客严重，慎选！',
    city: '全国',
    tags: ['#住宿避坑', '#全国'],
    postedAt: '1 小时前',
    meTooCount: 18,
    status: 'pending',
    category: 'stay',
  },
]

/** 「全部 1287 条吐槽」总数（用于首页展开链接） */
export const PIT_TALK_TOTAL = 1287

/** 风险等级 → 配色 helper */
export function riskTone(risk: 'high' | 'new' | 'warn' | 'mid' | 'low') {
  switch (risk) {
    case 'high':
      return { chip: 'chip-risk-high', tape: 'tape-high', label: '高风险' }
    case 'new':
      return { chip: 'chip-risk-new', tape: 'tape-new', label: '新坑' }
    case 'warn':
      return { chip: 'chip-risk-warn', tape: 'tape-warn', label: '注意' }
    case 'mid':
      return { chip: 'chip-risk-new', tape: 'tape-new', label: '中风险' }
    default:
      return { chip: 'chip-risk-warn', tape: 'tape-warn', label: '低风险' }
  }
}

/* ============================================================
 * Legacy mock 数据（兼容 pages/spots、pages/cases）
 * ============================================================ */
export const mockSpots: Spot[] = [
  {
    id: 'sp-001',
    name: '丽江古城',
    province: '云南',
    city: '丽江',
    category: 'ancient_town',
    baseScore: 6.8,
    pitScore: 7.4,
    goodTags: ['古风', '夜景'],
    badTags: ['酒吧扰民', '商业化', '宰客'],
    bestSeason: ['春季', '秋季'],
    suitableFor: ['情侣', '摄影'],
    unsuitableFor: ['亲子', '老人'],
    description: '夜景出片，白天清淡；商业化程度高，需避开购物街。',
    coverUrl: '',
    reviewCount: 12834,
  },
  {
    id: 'sp-002',
    name: '九寨沟',
    province: '四川',
    city: '阿坝',
    category: 'natural',
    baseScore: 8.6,
    pitScore: 4.1,
    goodTags: ['水色', '原生态'],
    badTags: ['车程长', '高反', '旺季拥挤'],
    bestSeason: ['秋季'],
    suitableFor: ['摄影', '情侣', '朋友'],
    unsuitableFor: ['婴幼儿'],
    description: '世界级自然景观，秋色最佳；建议避开十一假期。',
    coverUrl: '',
    reviewCount: 9821,
  },
  {
    id: 'sp-003',
    name: '三亚亚龙湾',
    province: '海南',
    city: '三亚',
    category: 'natural',
    baseScore: 7.5,
    pitScore: 6.2,
    goodTags: ['沙滩', '酒店'],
    badTags: ['海鲜宰客', '出租车绕路'],
    bestSeason: ['冬季', '春季'],
    suitableFor: ['亲子', '情侣'],
    unsuitableFor: ['预算紧张'],
    description: '海滩质量佳，住度假酒店体验好；街边海鲜需提防。',
    coverUrl: '',
    reviewCount: 7642,
  },
]

export const mockCases: PitCase[] = [
  {
    id: 'case-001',
    userId: 'u1',
    userName: '小红薯翻车记',
    userAvatar: 'https://i.pravatar.cc/100?img=1',
    spotName: '丽江古城',
    title: '在丽江古城被宰客一千多，详细记录',
    summary: '记录一次踩坑经历，希望大家避雷。',
    coverUrl: '',
    likes: 2418,
    views: 18642,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'case-002',
    userId: 'u2',
    userName: '川西自驾老张',
    userAvatar: 'https://i.pravatar.cc/100?img=8',
    title: '川西小环线被强制购物的一天',
    summary: '导游带团去玉石店，强制购物 4 小时。',
    coverUrl: '',
    likes: 1208,
    views: 9425,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
]
