import { serverSupabaseClient } from '#supabase/server'

// 上报页城市下拉专用：只取选择器需要的字段，按省份+城市名稳定排序
// 与首页 risk-cities 解耦，互不影响
const CACHE_KEY = 'cities:options'
const CACHE_TTL_SECONDS = 60 * 60 * 24 // 城市列表变动极少，缓存 1 天

export interface CityOption {
  id: string | number
  name: string
  province: string
}

export default defineEventHandler(async (event) => {
  const result = await getCachedData<CityOption[]>(
    CACHE_KEY,
    async () => {
      const client = await serverSupabaseClient(event)
      const { data, error } = await client
        .from('cities')
        .select('id, name, province')
        .order('province', { ascending: true })
        .order('name', { ascending: true })

      if (error) {
        throw createError({ statusCode: 500, statusMessage: error.message })
      }

      return (data ?? []) as CityOption[]
    },
    { ttl: CACHE_TTL_SECONDS }
  )

  setHeader(event, 'x-cache', result.state)
  setHeader(event, 'x-cache-key', result.key)

  return {
    data: result.data,
    meta: {
      cache: result.state,
      key: result.key,
      ttl: CACHE_TTL_SECONDS,
    },
  }
})
