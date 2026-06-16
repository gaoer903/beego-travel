import type { AssessmentResult } from '~/types'

/**
 * 根据 ID 获取评估报告
 *
 * 当前版本：返回 mock 报告
 * 待接入：从数据库读取（Prisma + Postgres）
 */
export default defineEventHandler(async (event): Promise<AssessmentResult> => {
  const id = getRouterParam(event, 'id') || 'mock'

  return {
    id,
    overallScore: 6.2,
    dimensions: {
      time: 8,
      route: 5,
      costPerf: 6,
      energy: 3,
      season: 8,
    },
    timeline: [
      { day: 1, location: '成都', status: 'good', note: '锦里夜游推荐' },
      {
        day: 2,
        location: '成都 → 九寨沟',
        status: 'warn',
        note: '车程 8 小时过长',
        advice: '建议在川主寺住一晚',
      },
      { day: 3, location: '九寨沟', status: 'good', note: '时间充裕' },
      {
        day: 4,
        location: '黄龙 → 成都',
        status: 'warn',
        note: '海拔 3500m+',
        advice: '提前备红景天',
      },
    ],
    risks: [
      {
        level: 'high',
        title: 'Day2 车程超 8 小时',
        description: '体感极差，建议拆分。',
        suggestion: '川主寺住一晚',
      },
      {
        level: 'medium',
        title: '隐藏成本约 1,200 元/人',
        description: '高速、景交、保险等未含在常见报价。',
      },
      {
        level: 'high',
        title: '黄龙海拔风险',
        description: '海拔 3500m+，老人小孩慎入。',
      },
      {
        level: 'medium',
        title: '景区餐饮溢价',
        description: '人均 80+，建议自带。',
      },
      {
        level: 'low',
        title: '建议提前购票',
        description: '旺季限流 4 万人。',
      },
    ],
    hiddenCosts: [
      { name: '高速过路费 + 油费', amount: 800, unit: '车/全程' },
      { name: '景区观光车', amount: 90, unit: '人/天' },
      { name: '保险', amount: 30, unit: '人/天' },
      { name: '景区餐饮溢价', amount: 200, unit: '人/天' },
    ],
    optimizedSuggestions: ['川主寺加住一晚', '提前 7 天订票'],
    createdAt: new Date().toISOString(),
    isPaid: false,
  }
})
