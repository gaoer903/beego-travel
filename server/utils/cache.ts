import type { StorageValue } from 'unstorage'

type CacheState = 'hit' | 'miss' | 'bypass'

interface CacheOptions {
  ttl?: number
  storage?: string
}

interface CacheResult<T> {
  data: T
  key: string
  state: CacheState
}

export async function getCachedData<T extends StorageValue>(
  key: string,
  loader: () => Promise<T>,
  options: CacheOptions = {}
): Promise<CacheResult<T>> {
  const storage = useStorage(options.storage ?? 'redis')

  try {
    const cached = await storage.getItem<T>(key)

    if (cached !== null) {
      return {
        data: cached,
        key,
        state: 'hit',
      }
    }
  } catch (error) {
    console.warn(`[cache] read failed: ${key}`, error)

    return {
      data: await loader(),
      key,
      state: 'bypass',
    }
  }

  const data = await loader()

  try {
    await storage.setItem(key, data as StorageValue, { ttl: options.ttl })
  } catch (error) {
    console.warn(`[cache] write failed: ${key}`, error)
  }

  return {
    data,
    key,
    state: 'miss',
  }
}
