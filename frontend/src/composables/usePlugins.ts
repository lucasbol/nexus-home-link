import { ref, computed } from 'vue'
import { api } from '../services/api'
import type { PluginStatus } from '../types'

export function usePlugins() {
  const plugins = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchPlugins = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await api.getPlugins()
      plugins.value = response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch plugins'
      console.error('Error fetching plugins:', err)
    } finally {
      loading.value = false
    }
  }

  const getPluginStatus = async (pluginName: string) => {
    try {
      const response = await api.getPluginStatus(pluginName)
      return response.data
    } catch (err) {
      console.error(`Error fetching status for plugin ${pluginName}:`, err)
      throw err
    }
  }

  const executePluginAction = async (pluginName: string, action: string, parameters?: any) => {
    try {
      const response = await api.executePluginAction(pluginName, action, parameters)
      return response.data
    } catch (err) {
      console.error(`Error executing action ${action} on plugin ${pluginName}:`, err)
      throw err
    }
  }

  const availablePlugins = computed(() => 
    plugins.value.filter(plugin => plugin.status === 'Available')
  )

  const runningPlugins = computed(() => 
    plugins.value.filter(plugin => plugin.status === 'Running')
  )

  return {
    plugins: readonly(plugins),
    loading: readonly(loading),
    error: readonly(error),
    availablePlugins,
    runningPlugins,
    fetchPlugins,
    getPluginStatus,
    executePluginAction
  }
}
