// Environment configuration
import type { AppConfig } from '@/types'

export const config: AppConfig = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000
  },
  tmdb: {
    apiKey: import.meta.env.VITE_TMDB_API_KEY || '',
    accessToken: import.meta.env.VITE_TMDB_ACCESS_TOKEN || ''
  },
  features: {
    enableMockData: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true' || true,
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true' || false,
    enableNotifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true' || true
  },
  refresh: {
    interval: Number(import.meta.env.VITE_REFRESH_INTERVAL) || 30000,
    enabled: import.meta.env.VITE_AUTO_REFRESH !== 'false'
  }
}

// Validate required environment variables
export const validateConfig = () => {
  const errors: string[] = []

  if (!config.tmdb.apiKey) {
    errors.push('VITE_TMDB_API_KEY is required for TMDB integration')
  }

  if (!config.tmdb.accessToken) {
    errors.push('VITE_TMDB_ACCESS_TOKEN is required for TMDB integration')
  }

  if (errors.length > 0) {
    console.warn('Configuration validation warnings:', errors)
  }

  return errors.length === 0
}

// Initialize configuration validation
if (import.meta.env.DEV) {
  validateConfig()
}
