/** 格式化数字为带千分位 */
export function formatNumber(n: number): string {
  return n.toLocaleString('zh-CN')
}

/** 评分等级 */
export function scoreLevel(score: number): {
  label: string
  color: string
  bg: string
} {
  if (score >= 8.5)
    return { label: '强烈推荐', color: 'text-emerald-700', bg: 'bg-emerald-50' }
  if (score >= 7) return { label: '推荐', color: 'text-green-700', bg: 'bg-green-50' }
  if (score >= 5.5)
    return { label: '一般', color: 'text-amber-700', bg: 'bg-amber-50' }
  if (score >= 4) return { label: '慎重', color: 'text-orange-700', bg: 'bg-orange-50' }
  return { label: '避坑', color: 'text-red-700', bg: 'bg-red-50' }
}

/** 坑指数等级（越高越坑） */
export function pitLevel(score: number): {
  label: string
  color: string
} {
  if (score >= 8.5) return { label: '深坑', color: 'text-red-600' }
  if (score >= 7) return { label: '高风险', color: 'text-orange-600' }
  if (score >= 5) return { label: '需注意', color: 'text-amber-600' }
  if (score >= 3) return { label: '低风险', color: 'text-yellow-600' }
  return { label: '安全', color: 'text-green-600' }
}

/** 相对时间显示 */
export function relativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const diff = Date.now() - d.getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes} 分钟前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} 小时前`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} 天前`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} 个月前`
  return `${Math.floor(months / 12)} 年前`
}
