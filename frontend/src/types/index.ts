// Centralized type definitions for the homelab dashboard

export interface BaseEntity {
  id: string
  name: string
  status:
    | 'online'
    | 'offline'
    | 'unknown'
    | 'unavailable'
    | 'on'
    | 'off'
    | 'closed'
    | 'open'
    | 'motion'
    | 'no_motion'
  lastSeen: string
}

export interface Device extends BaseEntity {
  type: DeviceType
  room?: string
  controllable?: boolean
  value?: string | number
  unit?: string
  battery?: number
  signal?: number
  brightness?: number
  color?: string
  power?: number
  energy?: number
  history?: Array<{ time: string; value: number }>
}

export type DeviceType =
  | 'light'
  | 'temperature'
  | 'humidity'
  | 'window'
  | 'energy'
  | 'solar'
  | 'gas'
  | 'battery'
  | 'plug'
  | 'motion'
  | 'fan'
  | 'doorbell'
  | 'camera'

export interface NetworkNode extends BaseEntity {
  type: NetworkDeviceType
  ip: string
  mac: string
  signal?: number
  bandwidth?: number
  security: 'secure' | 'warning' | 'insecure'
  layer: 'core' | 'distribution' | 'access' | 'endpoint'
  vlan?: number
  x: number
  y: number
  size: number
}

export type NetworkDeviceType =
  | 'router'
  | 'server'
  | 'desktop'
  | 'laptop'
  | 'phone'
  | 'tablet'
  | 'gaming'
  | 'camera'
  | 'printer'
  | 'nas'
  | 'switch'
  | 'access_point'

export interface NetworkLink {
  source: string
  target: string
  strength: number
  type: 'wired' | 'wireless'
}

export interface Room {
  name: string
  devices: Device[]
  temperature?: number
  humidity?: number
  lightsOn: number
  totalLights: number
}

export interface SmartHomeStats {
  totalDevices: number
  onlineDevices: number
  lightsOn: number
  totalLights: number
  averageTemperature: number
  averageHumidity: number
  totalPowerConsumption: number
  solarProduction: number
  batteryLevel: number
}

export interface NetworkHealth {
  totalDevices: number
  onlineDevices: number
  averageSignal: number
  securityIssues: number
  totalBandwidth: number
}


export interface SecurityAlert {
  id: string
  type: 'threat' | 'vulnerability' | 'anomaly' | 'breach'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  timestamp: string
  source: string
  resolved: boolean
}

export interface BackupStatus {
  id: string
  name: string
  type: 'full' | 'incremental' | 'differential'
  status: 'success' | 'failed' | 'running' | 'pending'
  size: number
  duration: number
  lastRun: string
  nextRun: string
  retention: number
}

export interface SystemMetrics {
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  uptime: number
  loadAverage: number[]
  temperature?: number
  processes?: ProcessInfo[]
}

export interface ProcessInfo {
  id: string
  name: string
  pid: number
  cpuUsage: number
  memoryUsage: number
  status: string
  command: string
}

export interface DockerContainer {
  id: string
  name: string
  image: string
  status: 'running' | 'stopped' | 'paused' | 'restarting'
  health: 'healthy' | 'unhealthy' | 'starting' | 'unknown'
  ports: string[]
  created: string
  uptime: string
  cpu: number
  memory: number
  memoryLimit: number
  network: string
}

export interface PluginStatus {
  name: string
  status: 'Available' | 'Initializing' | 'Running' | 'Error' | 'Disabled'
  lastUpdated: string
  version?: string
  description?: string
}

export interface WeatherData {
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  pressure: number
  visibility: number
  uvIndex: number
  icon: string
  location: string
  lastUpdated: string
}

export interface NetworkStatus {
  internet: boolean
  latency: number
  downloadSpeed: number
  uploadSpeed: number
  packetLoss: number
  dnsStatus: boolean
  lastChecked: string
}

export interface Theme {
  name: 'light' | 'dark' | 'system'
  label: string
  icon: string
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  timestamp: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Error types
export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
  timestamp: string
}

// Configuration types
export interface AppConfig {
  api: {
    baseUrl: string
    timeout: number
  }
  tmdb: {
    apiKey: string
    accessToken: string
  }
  features: {
    enableMockData: boolean
    enableAnalytics: boolean
    enableNotifications: boolean
  }
  refresh: {
    interval: number
    enabled: boolean
  }
}

// Component prop types
export interface BaseWidgetProps {
  title: string
  icon: any
  loading?: boolean
  refreshable?: boolean
  error?: string | null
}

export interface ChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
  }>
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
