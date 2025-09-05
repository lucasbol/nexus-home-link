// Caching composable for data persistence
import { ref, computed } from 'vue'

interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

export function useCache<T>(key: string, ttl: number = 300000) {
  // 5 minutes default
  const cache = ref<Map<string, CacheItem<T>>>(new Map())

  const get = (k: string): T | null => {
    const item = cache.value.get(k)
    if (!item) return null

    const now = Date.now()
    if (now - item.timestamp > item.ttl) {
      cache.value.delete(k)
      return null
    }

    return item.data
  }

  const set = (k: string, data: T, customTtl?: number) => {
    cache.value.set(k, {
      data,
      timestamp: Date.now(),
      ttl: customTtl || ttl
    })
  }

  const has = (k: string): boolean => {
    const item = cache.value.get(k)
    if (!item) return false

    const now = Date.now()
    if (now - item.timestamp > item.ttl) {
      cache.value.delete(k)
      return false
    }

    return true
  }

  const remove = (k: string) => {
    cache.value.delete(k)
  }

  const clear = () => {
    cache.value.clear()
  }

  const size = computed(() => cache.value.size)

  const keys = computed(() => Array.from(cache.value.keys()))

  const isExpired = (k: string): boolean => {
    const item = cache.value.get(k)
    if (!item) return true

    const now = Date.now()
    return now - item.timestamp > item.ttl
  }

  const cleanup = () => {
    const now = Date.now()
    for (const [key, item] of cache.value.entries()) {
      if (now - item.timestamp > item.ttl) {
        cache.value.delete(key)
      }
    }
  }

  return {
    get,
    set,
    has,
    remove,
    clear,
    size,
    keys,
    isExpired,
    cleanup
  }
}

// Local storage cache with serialization
export function useLocalStorageCache<T>(key: string, ttl: number = 300000) {
  const get = (): T | null => {
    try {
      const item = localStorage.getItem(key)
      if (!item) return null

      const parsed = JSON.parse(item)
      const now = Date.now()

      if (now - parsed.timestamp > parsed.ttl) {
        localStorage.removeItem(key)
        return null
      }

      return parsed.data
    } catch (error) {
      console.error('Error reading from localStorage cache:', error)
      return null
    }
  }

  const set = (data: T, customTtl?: number) => {
    try {
      const item = {
        data,
        timestamp: Date.now(),
        ttl: customTtl || ttl
      }
      localStorage.setItem(key, JSON.stringify(item))
    } catch (error) {
      console.error('Error writing to localStorage cache:', error)
    }
  }

  const remove = () => {
    localStorage.removeItem(key)
  }

  const has = (): boolean => {
    return get() !== null
  }

  return {
    get,
    set,
    remove,
    has
  }
}

// Memory cache with LRU eviction
export function useLRUCache<T>(maxSize: number = 100) {
  const cache = ref<Map<string, T>>(new Map())

  const get = (key: string): T | undefined => {
    const value = cache.value.get(key)
    if (value !== undefined) {
      // Move to end (most recently used)
      cache.value.delete(key)
      cache.value.set(key, value)
    }
    return value
  }

  const set = (key: string, value: T) => {
    if (cache.value.has(key)) {
      // Update existing key
      cache.value.delete(key)
    } else if (cache.value.size >= maxSize) {
      // Remove least recently used (first item)
      const firstKey = cache.value.keys().next().value
      cache.value.delete(firstKey)
    }

    cache.value.set(key, value)
  }

  const has = (key: string): boolean => {
    return cache.value.has(key)
  }

  const remove = (key: string) => {
    cache.value.delete(key)
  }

  const clear = () => {
    cache.value.clear()
  }

  const size = computed(() => cache.value.size)

  return {
    get,
    set,
    has,
    remove,
    clear,
    size
  }
}
