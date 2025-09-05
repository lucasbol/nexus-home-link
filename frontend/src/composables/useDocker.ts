import { ref, computed } from 'vue'
import { api } from '../services/api'
import type { DockerContainer } from '../types'

export function useDocker() {
  const containers = ref<DockerContainer[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchContainers = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await api.executePluginAction('Docker', 'get-containers')
      containers.value = response || []
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch Docker containers'
      console.error('Error fetching Docker containers:', err)
      // Set fallback data to prevent crashes
      containers.value = []
    } finally {
      loading.value = false
    }
  }

  const startContainer = async (containerId: string) => {
    try {
      const response = await api.executePluginAction('Docker', 'start-container', { containerId })
      
      // Update the container status locally
      const container = containers.value.find(c => c.id === containerId)
      if (container) {
        container.status = 'running'
      }
      
      return response.data
    } catch (err) {
      console.error(`Error starting container ${containerId}:`, err)
      throw err
    }
  }

  const stopContainer = async (containerId: string) => {
    try {
      const response = await api.executePluginAction('Docker', 'stop-container', { containerId })
      
      // Update the container status locally
      const container = containers.value.find(c => c.id === containerId)
      if (container) {
        container.status = 'stopped'
      }
      
      return response.data
    } catch (err) {
      console.error(`Error stopping container ${containerId}:`, err)
      throw err
    }
  }

  const runningContainers = computed(() => 
    containers.value.filter(container => container.status === 'running')
  )

  const stoppedContainers = computed(() => 
    containers.value.filter(container => container.status === 'stopped')
  )

  const containersByStatus = computed(() => {
    const grouped: Record<string, DockerContainer[]> = {}
    containers.value.forEach(container => {
      if (!grouped[container.status]) {
        grouped[container.status] = []
      }
      grouped[container.status].push(container)
    })
    return grouped
  })

  const containerStats = computed(() => ({
    total: containers.value.length,
    running: runningContainers.value.length,
    stopped: stoppedContainers.value.length,
    healthy: containers.value.filter(c => c.health === 'healthy').length,
    unhealthy: containers.value.filter(c => c.health === 'unhealthy').length
  }))

  const refreshContainers = async () => {
    await fetchContainers()
  }

  return {
    containers: readonly(containers),
    loading: readonly(loading),
    error: readonly(error),
    runningContainers,
    stoppedContainers,
    containersByStatus,
    containerStats,
    fetchContainers,
    startContainer,
    stopContainer,
    refreshContainers
  }
}
