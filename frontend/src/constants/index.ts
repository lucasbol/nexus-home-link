// Application constants

export const STORAGE_KEYS = {
  THEME: 'homelab-theme',
  SETTINGS: 'homelab-settings',
  USER_PREFERENCES: 'homelab-user-preferences'
} as const

export const API_CONFIG = {
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
} as const

export const REFRESH_INTERVALS = {
  DASHBOARD: 30000, // 30 seconds
  WEATHER: 300000, // 5 minutes
  SYSTEM_METRICS: 10000, // 10 seconds
  NETWORK_TOPOLOGY: 60000, // 1 minute
  DOCKER_CONTAINERS: 15000, // 15 seconds
  SMART_HOME: 5000, // 5 seconds
  SECURITY_ALERTS: 120000 // 2 minutes
} as const

export const DEVICE_TYPES = {
  LIGHT: 'light',
  TEMPERATURE: 'temperature',
  HUMIDITY: 'humidity',
  WINDOW: 'window',
  ENERGY: 'energy',
  SOLAR: 'solar',
  GAS: 'gas',
  BATTERY: 'battery',
  PLUG: 'plug',
  MOTION: 'motion',
  FAN: 'fan',
  DOORBELL: 'doorbell',
  CAMERA: 'camera'
} as const

export const NETWORK_DEVICE_TYPES = {
  ROUTER: 'router',
  SERVER: 'server',
  DESKTOP: 'desktop',
  LAPTOP: 'laptop',
  PHONE: 'phone',
  TABLET: 'tablet',
  GAMING: 'gaming',
  CAMERA: 'camera',
  PRINTER: 'printer',
  NAS: 'nas',
  SWITCH: 'switch',
  ACCESS_POINT: 'access_point'
} as const

export const STATUS_COLORS = {
  online: 'text-green-500',
  offline: 'text-red-500',
  unknown: 'text-yellow-500',
  unavailable: 'text-gray-500',
  on: 'text-green-500',
  off: 'text-gray-500',
  open: 'text-green-500',
  closed: 'text-gray-500',
  motion: 'text-blue-500',
  no_motion: 'text-gray-500',
  running: 'text-green-500',
  stopped: 'text-red-500',
  paused: 'text-yellow-500',
  restarting: 'text-blue-500',
  success: 'text-green-500',
  failed: 'text-red-500',
  pending: 'text-yellow-500',
  secure: 'text-green-500',
  warning: 'text-yellow-500',
  insecure: 'text-red-500'
} as const

export const LAYER_COLORS = {
  core: 'bg-blue-500/20 border-blue-500/50 text-blue-500',
  distribution: 'bg-purple-500/20 border-purple-500/50 text-purple-500',
  access: 'bg-orange-500/20 border-orange-500/50 text-orange-500',
  endpoint: 'bg-green-500/20 border-green-500/50 text-green-500'
} as const

export const VLAN_COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#f59e0b', // amber
  '#10b981', // emerald
  '#ef4444', // red
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#f97316' // orange
] as const

export const SEVERITY_LEVELS = {
  low: { color: 'text-green-500', bg: 'bg-green-500/20', border: 'border-green-500/50' },
  medium: { color: 'text-yellow-500', bg: 'bg-yellow-500/20', border: 'border-yellow-500/50' },
  high: { color: 'text-orange-500', bg: 'bg-orange-500/20', border: 'border-orange-500/50' },
  critical: { color: 'text-red-500', bg: 'bg-red-500/20', border: 'border-red-500/50' }
} as const

export const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#06b6d4',
  gradient: ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#06b6d4']
} as const

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const

export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 500
} as const

export const DEBOUNCE_DELAYS = {
  search: 300,
  resize: 100,
  scroll: 16
} as const

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
} as const

export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  IP_ADDRESS:
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  MAC_ADDRESS: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/
} as const

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
  API_ERROR: 'An error occurred while fetching data. Please try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'A server error occurred. Please try again later.',
  TIMEOUT: 'The request timed out. Please try again.',
  UNKNOWN: 'An unknown error occurred. Please try again.'
} as const

export const SUCCESS_MESSAGES = {
  SAVED: 'Settings saved successfully.',
  UPDATED: 'Data updated successfully.',
  DELETED: 'Item deleted successfully.',
  CREATED: 'Item created successfully.',
  CONNECTED: 'Connection established successfully.',
  SYNCED: 'Data synchronized successfully.'
} as const

export const THEMES = [
  { name: 'light', label: 'Light', icon: 'Sun' },
  { name: 'dark', label: 'Dark', icon: 'Moon' },
  { name: 'system', label: 'System', icon: 'Monitor' }
] as const

export const DASHBOARD_TABS = [
  { id: 'monitoring', label: 'Monitoring', icon: 'Activity' },
  { id: 'smart-home', label: 'Smart Home', icon: 'Home' },
  { id: 'media', label: 'Media & Storage', icon: 'Film' },
  { id: 'infrastructure', label: 'Infrastructure', icon: 'Server' },
  { id: 'security', label: 'Security', icon: 'Shield' },
  { id: 'settings', label: 'Settings', icon: 'Settings' }
] as const
