// Reusable async data fetching composable
import { ref, onMounted, onUnmounted, readonly } from 'vue'
import { useErrorHandler } from './useErrorHandler'

export interface AsyncDataOptions<T> {
  immediate?: boolean
  retry?: boolean
  retryAttempts?: number
  retryDelay?: number
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  onFinally?: () => void
}

export function useAsyncData<T>(asyncFn: () => Promise<T>, options: AsyncDataOptions<T> = {}) {
  const {
    immediate = true,
    retry = false,
    retryAttempts = 3,
    retryDelay = 1000,
    onSuccess,
    onError,
    onFinally
  } = options

  const data = ref<T | null>(null)
  const loading = ref(false)
  const { setError, clearError } = useErrorHandler()

  let retryCount = 0
  let retryTimeout: NodeJS.Timeout | null = null

  const execute = async (): Promise<T | null> => {
    if (loading.value) return null

    try {
      loading.value = true
      clearError()

      const result = await asyncFn()
      data.value = result
      retryCount = 0

      onSuccess?.(result)
      return result
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error')

      if (retry && retryCount < retryAttempts) {
        retryCount++
        console.warn(`Retry attempt ${retryCount}/${retryAttempts} after ${retryDelay}ms`)

        retryTimeout = setTimeout(() => {
          execute()
        }, retryDelay)

        return null
      }

      setError(err)
      onError?.(err)
      return null
    } finally {
      loading.value = false
      onFinally?.()
    }
  }

  const cancel = () => {
    if (retryTimeout) {
      clearTimeout(retryTimeout)
      retryTimeout = null
    }
    loading.value = false
  }

  const reset = () => {
    cancel()
    data.value = null
    clearError()
    retryCount = 0
  }

  if (immediate) {
    onMounted(execute)
  }

  onUnmounted(cancel)

  return {
    data: readonly(data),
    loading: readonly(loading),
    execute,
    cancel,
    reset
  }
}

// Specialized composable for API calls with automatic retry
export function useApiData<T>(
  apiCall: () => Promise<T>,
  options: Omit<AsyncDataOptions<T>, 'retry'> = {}
) {
  return useAsyncData(apiCall, {
    ...options,
    retry: true,
    retryAttempts: 3,
    retryDelay: 1000
  })
}

// Composable for polling data
export function usePollingData<T>(
  asyncFn: () => Promise<T>,
  interval: number = 30000,
  options: Omit<AsyncDataOptions<T>, 'immediate'> = {}
) {
  const { data, loading, execute, cancel } = useAsyncData(asyncFn, {
    ...options,
    immediate: false
  })

  let pollingInterval: NodeJS.Timeout | null = null

  const startPolling = () => {
    if (pollingInterval) return

    // Execute immediately
    execute()

    // Then poll at interval
    pollingInterval = setInterval(execute, interval)
  }

  const stopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval)
      pollingInterval = null
    }
  }

  onMounted(() => {
    startPolling()
  })

  onUnmounted(() => {
    stopPolling()
    cancel()
  })

  return {
    data,
    loading,
    execute,
    startPolling,
    stopPolling,
    cancel
  }
}
