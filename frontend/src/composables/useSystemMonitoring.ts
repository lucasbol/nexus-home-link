import { ref, computed, readonly } from 'vue'
import { api } from '../services/api'
import type { SystemMetrics, ProcessInfo } from '../types'

export function useSystemMonitoring() {
  const metrics = ref<SystemMetrics | null>(null)
  const processes = ref<ProcessInfo[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchMetrics = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await api.executePluginAction('SystemMonitoring', 'get-metrics')
      metrics.value = response || null
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch system metrics'
      console.error('Error fetching system metrics:', err)
      // Set fallback data to prevent crashes
      metrics.value = null
    } finally {
      loading.value = false
    }
  }

  const fetchProcesses = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await api.executePluginAction('SystemMonitoring', 'get-processes')
      processes.value = response || []
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch processes'
      console.error('Error fetching processes:', err)
      // Set fallback data to prevent crashes
      processes.value = []
    } finally {
      loading.value = false
    }
  }

  const cpuUsage = computed(() => metrics.value?.cpuUsage || 0)
  const memoryUsage = computed(() => metrics.value?.memoryUsage || 0)
  const diskUsage = computed(() => metrics.value?.diskUsage || 0)
  const uptime = computed(() => metrics.value?.uptime || 0)
  const loadAverage = computed(() => metrics.value?.loadAverage || [0, 0, 0])

  const topProcesses = computed(() => 
    (processes.value || [])
      .sort((a, b) => (b.cpuUsage || 0) - (a.cpuUsage || 0))
      .slice(0, 10)
  )

  const refreshData = async () => {
    await Promise.all([fetchMetrics(), fetchProcesses()])
  }

  return {
    metrics: readonly(metrics),
    processes: readonly(processes),
    loading: readonly(loading),
    error: readonly(error),
    cpuUsage,
    memoryUsage,
    diskUsage,
    uptime,
    loadAverage,
    topProcesses,
    fetchMetrics,
    fetchProcesses,
    refreshData
  }
}
