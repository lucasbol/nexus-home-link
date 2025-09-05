// Error handling composable
import { ref, computed, readonly } from 'vue'
import type { ApiError } from '@/types'
import { ERROR_MESSAGES } from '@/constants'

export function useErrorHandler() {
  const error = ref<string | null>(null)
  const apiError = ref<ApiError | null>(null)

  const isError = computed(() => !!error.value)
  const hasApiError = computed(() => !!apiError.value)

  const setError = (err: string | Error | ApiError) => {
    if (typeof err === 'string') {
      error.value = err
      apiError.value = null
    } else if (err instanceof Error) {
      error.value = err.message
      apiError.value = null
    } else {
      // ApiError object
      apiError.value = err
      error.value = err.message
    }
  }

  const setApiError = (err: ApiError) => {
    apiError.value = err
    error.value = err.message
  }

  const clearError = () => {
    error.value = null
    apiError.value = null
  }

  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'NETWORK_ERROR':
        return ERROR_MESSAGES.NETWORK_ERROR
      case 'API_ERROR':
        return ERROR_MESSAGES.API_ERROR
      case 'VALIDATION_ERROR':
        return ERROR_MESSAGES.VALIDATION_ERROR
      case 'UNAUTHORIZED':
        return ERROR_MESSAGES.UNAUTHORIZED
      case 'NOT_FOUND':
        return ERROR_MESSAGES.NOT_FOUND
      case 'SERVER_ERROR':
        return ERROR_MESSAGES.SERVER_ERROR
      case 'TIMEOUT':
        return ERROR_MESSAGES.TIMEOUT
      default:
        return ERROR_MESSAGES.UNKNOWN
    }
  }

  const handleApiError = (err: any): string => {
    if (err.response?.data?.message) {
      return err.response.data.message
    }

    if (err.code === 'NETWORK_ERROR' || !err.response) {
      return ERROR_MESSAGES.NETWORK_ERROR
    }

    if (err.response?.status === 401) {
      return ERROR_MESSAGES.UNAUTHORIZED
    }

    if (err.response?.status === 404) {
      return ERROR_MESSAGES.NOT_FOUND
    }

    if (err.response?.status >= 500) {
      return ERROR_MESSAGES.SERVER_ERROR
    }

    return ERROR_MESSAGES.UNKNOWN
  }

  return {
    error: readonly(error),
    apiError: readonly(apiError),
    isError,
    hasApiError,
    setError,
    setApiError,
    clearError,
    getErrorMessage,
    handleApiError
  }
}
