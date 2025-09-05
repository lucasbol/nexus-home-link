// Device utility functions
import {
  Lightbulb,
  Thermometer,
  Droplets,
  Lock,
  Zap,
  Sun,
  Flame,
  Battery,
  Plug,
  Eye,
  Wind,
  Bell,
  Camera,
  Activity,
  Router,
  Server,
  Monitor,
  Laptop,
  Smartphone,
  Tablet,
  Gamepad2,
  Printer,
  HardDrive,
  Switch,
  Wifi
} from 'lucide-vue-next'
import type { DeviceType, NetworkDeviceType } from '@/types'
import { STATUS_COLORS, LAYER_COLORS } from '@/constants'

// Device icon mapping
const DEVICE_ICON_MAP: Record<DeviceType, any> = {
  light: Lightbulb,
  temperature: Thermometer,
  humidity: Droplets,
  window: Lock,
  energy: Zap,
  solar: Sun,
  gas: Flame,
  battery: Battery,
  plug: Plug,
  motion: Eye,
  fan: Wind,
  doorbell: Bell,
  camera: Camera
}

const NETWORK_DEVICE_ICON_MAP: Record<NetworkDeviceType, any> = {
  router: Router,
  server: Server,
  desktop: Monitor,
  laptop: Laptop,
  phone: Smartphone,
  tablet: Tablet,
  gaming: Gamepad2,
  camera: Camera,
  printer: Printer,
  nas: HardDrive,
  switch: Switch,
  access_point: Wifi
}

export const getDeviceIcon = (type: DeviceType) => {
  return DEVICE_ICON_MAP[type] || Activity
}

export const getNetworkDeviceIcon = (type: NetworkDeviceType) => {
  return NETWORK_DEVICE_ICON_MAP[type] || Activity
}

export const getStatusColor = (status: string): string => {
  return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || STATUS_COLORS.unknown
}

export const getLayerColor = (layer: string): string => {
  return LAYER_COLORS[layer as keyof typeof LAYER_COLORS] || LAYER_COLORS.endpoint
}

export const getSecurityIcon = (security: string) => {
  switch (security) {
    case 'secure':
      return 'Shield'
    case 'warning':
      return 'AlertTriangle'
    case 'insecure':
      return 'AlertCircle'
    default:
      return 'Shield'
  }
}

export const formatDeviceValue = (value: string | number | undefined, unit?: string): string => {
  if (value === undefined || value === null) return 'N/A'

  if (typeof value === 'number') {
    return `${value.toFixed(1)}${unit || ''}`
  }

  return `${value}${unit || ''}`
}

export const formatBatteryLevel = (level: number | undefined): string => {
  if (level === undefined) return 'N/A'

  if (level >= 80) return 'High'
  if (level >= 50) return 'Medium'
  if (level >= 20) return 'Low'
  return 'Critical'
}

export const getBatteryColor = (level: number | undefined): string => {
  if (level === undefined) return 'text-gray-500'

  if (level >= 80) return 'text-green-500'
  if (level >= 50) return 'text-yellow-500'
  if (level >= 20) return 'text-orange-500'
  return 'text-red-500'
}

export const formatSignalStrength = (signal: number | undefined): string => {
  if (signal === undefined) return 'N/A'

  if (signal >= -50) return 'Excellent'
  if (signal >= -60) return 'Good'
  if (signal >= -70) return 'Fair'
  if (signal >= -80) return 'Poor'
  return 'Very Poor'
}

export const getSignalColor = (signal: number | undefined): string => {
  if (signal === undefined) return 'text-gray-500'

  if (signal >= -50) return 'text-green-500'
  if (signal >= -60) return 'text-green-400'
  if (signal >= -70) return 'text-yellow-500'
  if (signal >= -80) return 'text-orange-500'
  return 'text-red-500'
}

export const formatUptime = (uptime: number): string => {
  const days = Math.floor(uptime / 86400)
  const hours = Math.floor((uptime % 86400) / 3600)
  const minutes = Math.floor((uptime % 3600) / 60)

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else {
    return `${minutes}m`
  }
}

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export const formatBandwidth = (bytes: number): string => {
  return `${formatBytes(bytes)}/s`
}

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`
}

export const formatTemperature = (temp: number, unit: 'C' | 'F' = 'C'): string => {
  return `${temp.toFixed(1)}°${unit}`
}

export const formatHumidity = (humidity: number): string => {
  return `${humidity.toFixed(0)}%`
}

export const formatPower = (power: number): string => {
  return `${power.toFixed(1)}W`
}

export const formatEnergy = (energy: number): string => {
  return `${energy.toFixed(2)}kWh`
}

export const isDeviceOnline = (lastSeen: string): boolean => {
  const lastSeenDate = new Date(lastSeen)
  const now = new Date()
  const diffInMinutes = (now.getTime() - lastSeenDate.getTime()) / (1000 * 60)

  // Consider device online if last seen within 5 minutes
  return diffInMinutes <= 5
}

export const getDeviceStatus = (lastSeen: string, status: string): string => {
  if (status === 'unavailable') return 'unavailable'
  if (isDeviceOnline(lastSeen)) return 'online'
  return 'offline'
}
