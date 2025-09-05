import { ref, computed } from 'vue'
import { api } from '../services/api'
import type { Device } from '../types'

export function useSmartHome() {
  const devices = ref<Device[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchDevices = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await api.executePluginAction('SmartHome', 'get-devices')
      devices.value = response || []
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch smart home devices'
      console.error('Error fetching smart home devices:', err)
      // Set fallback data to prevent crashes
      devices.value = []
    } finally {
      loading.value = false
    }
  }

  const toggleDevice = async (deviceId: string) => {
    try {
      const response = await api.executePluginAction('SmartHome', 'toggle-device', { deviceId })
      
      // Update the device status locally
      const device = devices.value.find(d => d.id === deviceId)
      if (device) {
        device.status = device.status === 'on' ? 'off' : 'on'
      }
      
      return response.data
    } catch (err) {
      console.error(`Error toggling device ${deviceId}:`, err)
      throw err
    }
  }

  const onlineDevices = computed(() => 
    devices.value.filter(device => device.status === 'on')
  )

  const offlineDevices = computed(() => 
    devices.value.filter(device => device.status === 'off')
  )

  const devicesByType = computed(() => {
    const grouped: Record<string, Device[]> = {}
    devices.value.forEach(device => {
      if (!grouped[device.type]) {
        grouped[device.type] = []
      }
      grouped[device.type].push(device)
    })
    return grouped
  })

  const deviceCount = computed(() => ({
    total: devices.value.length,
    online: onlineDevices.value.length,
    offline: offlineDevices.value.length
  }))

  const refreshDevices = async () => {
    await fetchDevices()
  }

  return {
    devices: readonly(devices),
    loading: readonly(loading),
    error: readonly(error),
    onlineDevices,
    offlineDevices,
    devicesByType,
    deviceCount,
    fetchDevices,
    toggleDevice,
    refreshDevices
  }
}
