// Dashboard state management with Pinia
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { SystemMetrics, NetworkHealth, WeatherData, NetworkStatus } from '@/types'

export const useDashboardStore = defineStore('dashboard', () => {
  // State
  const activeTab = ref('monitoring')
  const isMobileMenuOpen = ref(false)
  const isLoading = ref(false)
  const lastRefresh = ref<Date | null>(null)

  // System data
  const systemMetrics = ref<SystemMetrics | null>(null)
  const networkHealth = ref<NetworkHealth | null>(null)
  const weatherData = ref<WeatherData | null>(null)
  const networkStatus = ref<NetworkStatus | null>(null)

  // Error state
  const error = ref<string | null>(null)

  // Computed
  const isOnline = computed(() => networkStatus.value?.internet ?? false)
  const hasError = computed(() => !!error.value)
  const lastRefreshTime = computed(() => {
    if (!lastRefresh.value) return null
    return lastRefresh.value.toLocaleTimeString()
  })

  // Actions
  const setActiveTab = (tab: string) => {
    activeTab.value = tab
  }

  const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
  }

  const closeMobileMenu = () => {
    isMobileMenuOpen.value = false
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const setError = (err: string | null) => {
    error.value = err
  }

  const clearError = () => {
    error.value = null
  }

  const updateSystemMetrics = (metrics: SystemMetrics) => {
    systemMetrics.value = metrics
    lastRefresh.value = new Date()
  }

  const updateNetworkHealth = (health: NetworkHealth) => {
    networkHealth.value = health
  }

  const updateWeatherData = (weather: WeatherData) => {
    weatherData.value = weather
  }

  const updateNetworkStatus = (status: NetworkStatus) => {
    networkStatus.value = status
  }

  const refreshAll = async () => {
    setLoading(true)
    clearError()

    try {
      // This would typically call API services
      // For now, we'll just update the refresh time
      lastRefresh.value = new Date()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh data')
    } finally {
      setLoading(false)
    }
  }

  return {
    // State
    activeTab,
    isMobileMenuOpen,
    isLoading,
    lastRefresh,
    systemMetrics,
    networkHealth,
    weatherData,
    networkStatus,
    error,

    // Computed
    isOnline,
    hasError,
    lastRefreshTime,

    // Actions
    setActiveTab,
    toggleMobileMenu,
    closeMobileMenu,
    setLoading,
    setError,
    clearError,
    updateSystemMetrics,
    updateNetworkHealth,
    updateWeatherData,
    updateNetworkStatus,
    refreshAll
  }
})
