import type { AssessmentResult } from '~/types'

interface AssessRequest {
  text: string
  travelers?: string[]
  season?: string
  budget?: 'low' | 'medium' | 'high'
}

/**
 * 行程评估接口
 *
 * 当前版本：返回 mock 数据（用于跑通前后端链路）
 * 待接入：DeepSeek / 豆包 大模型 API（见下方 TODO）
 */
export default defineEventHandler(async (event): Promise<AssessmentResult> => {
  const body = await readBody<AssessRequest>(event)

  if (!body.text || body.text.length < 10) {
    throw createError({
      statusCode: 400,
      statusMessage: '行程描述过短，请至少输入 10 字',
    })
  }

  // 模拟 AI 调用延迟
  await new Promise((r) => setTimeout(r, 1500))

  // TODO: 接入 DeepSeek 真实评估
  // const config = useRuntimeConfig()
  // const aiResp = await $fetch(`${config.deepseekBaseUrl}/v1/chat/completions`, {
  //   method: 'POST',
  //   headers: { Authorization: `Bearer ${config.deepseekApiKey}` },
  //   body: { model: 'deepseek-chat', messages: [...], response_format: { type: 'json_object' } },
  // })

  const id = Math.random().toString(36).slice(2, 10)

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
      {
        day: 1,
        location: '成都',
        status: 'good',
        note: '锦里夜游推荐，体验不错。',
      },
      {
        day: 2,
        location: '成都 → 九寨沟',
        status: 'warn',
        note: '车程 8 小时过长，体感极差。',
        advice: '建议在川主寺住一晚，拆分为 2 天',
      },
      {
        day: 3,
        location: '九寨沟',
        status: 'good',
        note: '时间充裕，景区已限流，体验改善。',
        advice: '拒绝任何"额外景点"推销',
      },
      {
        day: 4,
        location: '黄龙 → 成都',
        status: 'warn',
        note: '黄龙海拔 3500m+，部分人群有高反风险。',
        advice: '提前备红景天，老人小孩慎入',
      },
    ],
    risks: [
      {
        level: 'high',
        title: 'Day2 车程超 8 小时',
        description: '成都直达九寨沟车程过长，体感非常差，容易引发疲劳和情绪问题。',
        suggestion: '拆分为 2 天，川主寺住一晚',
      },
      {
        level: 'medium',
        title: '隐藏成本约 1,200 元/人',
        description: '高速油费、景区交通车、保险等未包含在常见报价中。',
      },
      {
        level: 'high',
        title: '黄龙海拔风险',
        description: '黄龙海拔 3500-3800m，老人、小孩、高血压人群可能出现高反。',
        suggestion: '提前 3 天服用红景天，备好氧气罐',
      },
      {
        level: 'medium',
        title: '景区餐饮均价偏高',
        description: '九寨沟景区内餐饮均价 80+ 元/人，建议自带干粮。',
      },
      {
        level: 'low',
        title: '建议提前购票',
        description: '九寨沟旺季每日限流 4 万人，需提前 5-7 天官网预约。',
      },
      {
        level: 'medium',
        title: '酒店推销陷阱',
        description: '沟口酒店常推销"额外景点 + 民俗表演"，多为低质项目。',
        suggestion: '直接拒绝',
      },
      {
        level: 'low',
        title: '当地特产真假',
        description: '九寨沟周边藏药、虫草多为假货，建议正规药店购买。',
      },
    ],
    hiddenCosts: [
      { name: '高速过路费 + 油费', amount: 800, unit: '车/全程' },
      { name: '景区观光车', amount: 90, unit: '人/天' },
      { name: '保险', amount: 30, unit: '人/天' },
      { name: '景区餐饮溢价', amount: 200, unit: '人/天' },
      { name: '小费 / 司机辛苦费', amount: 100, unit: '车/天' },
    ],
    optimizedSuggestions: [
      '川主寺加住一晚，把 Day2 车程拆分',
      '九寨沟提前 7 天官网订票',
      '随身携带氧气罐、红景天',
      '景区内自带干粮和水',
    ],
    createdAt: new Date().toISOString(),
    isPaid: false,
  }
})
