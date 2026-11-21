import { serverSupabaseClient } from '#supabase/server'
import type { CityRecord } from '~/types'

const CACHE_KEY = 'home:risk-cities'
const CACHE_TTL_SECONDS = 60 * 5

export default defineEventHandler(async (event) => {
  const result = await getCachedData<CityRecord[]>(
    CACHE_KEY,
    async () => {
      const client = await serverSupabaseClient(event)
      const { data, error } = await client
        .from('cities')
        .select('*')
        .order('risk_score', { ascending: false })

      if (error) {
        throw createError({ statusCode: 500, statusMessage: error.message })
      }

      return (data ?? []) as CityRecord[]
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
