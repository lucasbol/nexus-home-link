// Mock data for development and testing
import type {
  Device,
  Room,
  SmartHomeStats,
  NetworkNode,
  NetworkLink,
  NetworkHealth,
  DockerContainer,
  SecurityAlert,
  BackupStatus,
  SystemMetrics,
  WeatherData,
  NetworkStatus
} from '@/types'

// Smart Home Mock Data
export const mockSmartHomeDevices: Device[] = [
  // Living Room
  {
    id: 'lr-light-1',
    name: 'Main Light',
    type: 'light',
    room: 'Living Room',
    status: 'on',
    brightness: 80,
    color: '#FFD700',
    lastSeen: 'now',
    controllable: true
  },
  {
    id: 'lr-light-2',
    name: 'Ambient Light',
    type: 'light',
    room: 'Living Room',
    status: 'on',
    brightness: 60,
    color: '#87CEEB',
    lastSeen: 'now',
    controllable: true
  },
  {
    id: 'lr-light-3',
    name: 'Reading Light',
    type: 'light',
    room: 'Living Room',
    status: 'off',
    lastSeen: 'now',
    controllable: true
  },
  {
    id: 'lr-temp',
    name: 'TADO Temp',
    type: 'temperature',
    room: 'Living Room',
    status: 'on',
    value: 22.5,
    unit: '°C',
    lastSeen: 'now'
  },
  {
    id: 'lr-humidity',
    name: 'TADO Humidity',
    type: 'humidity',
    room: 'Living Room',
    status: 'on',
    value: 45,
    unit: '%',
    lastSeen: 'now'
  },
  {
    id: 'lr-window',
    name: 'Window',
    type: 'window',
    room: 'Living Room',
    status: 'closed',
    lastSeen: 'now'
  },
  {
    id: 'lr-plug-1',
    name: 'TV Plug',
    type: 'plug',
    room: 'Living Room',
    status: 'on',
    power: 45,
    energy: 2.3,
    lastSeen: 'now',
    controllable: true
  },
  {
    id: 'lr-motion',
    name: 'Motion Sensor',
    type: 'motion',
    room: 'Living Room',
    status: 'no_motion',
    lastSeen: '2m ago'
  },

  // Kitchen
  {
    id: 'k-light-1',
    name: 'Kitchen Light',
    type: 'light',
    room: 'Kitchen',
    status: 'on',
    brightness: 100,
    lastSeen: 'now',
    controllable: true
  },
  {
    id: 'k-temp',
    name: 'Kitchen Temp',
    type: 'temperature',
    room: 'Kitchen',
    status: 'on',
    value: 24.2,
    unit: '°C',
    lastSeen: 'now'
  },
  {
    id: 'k-humidity',
    name: 'Kitchen Humidity',
    type: 'humidity',
    room: 'Kitchen',
    status: 'on',
    value: 52,
    unit: '%',
    lastSeen: 'now'
  },
  {
    id: 'k-fan',
    name: 'Exhaust Fan',
    type: 'fan',
    room: 'Kitchen',
    status: 'off',
    lastSeen: 'now',
    controllable: true
  },
  {
    id: 'k-plug-1',
    name: 'Coffee Machine',
    type: 'plug',
    room: 'Kitchen',
    status: 'on',
    power: 1200,
    energy: 0.8,
    lastSeen: 'now',
    controllable: true
  },

  // Bedroom
  {
    id: 'br-light-1',
    name: 'Bedside Light',
    type: 'light',
    room: 'Bedroom',
    status: 'off',
    brightness: 30,
    lastSeen: 'now',
    controllable: true
  },
  {
    id: 'br-light-2',
    name: 'Ceiling Light',
    type: 'light',
    room: 'Bedroom',
    status: 'off',
    lastSeen: 'now',
    controllable: true
  },
  {
    id: 'br-temp',
    name: 'Bedroom Temp',
    type: 'temperature',
    room: 'Bedroom',
    status: 'on',
    value: 20.8,
    unit: '°C',
    lastSeen: 'now'
  },
  {
    id: 'br-humidity',
    name: 'Bedroom Humidity',
    type: 'humidity',
    room: 'Bedroom',
    status: 'on',
    value: 38,
    unit: '%',
    lastSeen: 'now'
  },
  {
    id: 'br-window',
    name: 'Bedroom Window',
    type: 'window',
    room: 'Bedroom',
    status: 'closed',
    lastSeen: 'now'
  },

  // Office
  {
    id: 'o-light-1',
    name: 'Desk Light',
    type: 'light',
    room: 'Office',
    status: 'on',
    brightness: 90,
    lastSeen: 'now',
    controllable: true
  },
  {
    id: 'o-temp',
    name: 'Office Temp',
    type: 'temperature',
    room: 'Office',
    status: 'on',
    value: 23.1,
    unit: '°C',
    lastSeen: 'now'
  },
  {
    id: 'o-plug-1',
    name: 'Computer',
    type: 'plug',
    room: 'Office',
    status: 'on',
    power: 180,
    energy: 4.2,
    lastSeen: 'now',
    controllable: true
  },
  {
    id: 'o-plug-2',
    name: 'Monitor',
    type: 'plug',
    room: 'Office',
    status: 'on',
    power: 45,
    energy: 1.1,
    lastSeen: 'now',
    controllable: true
  },
  {
    id: 'o-plug-3',
    name: 'Printer',
    type: 'plug',
    room: 'Office',
    status: 'off',
    power: 0,
    energy: 0,
    lastSeen: 'now',
    controllable: true
  }
]

export const mockRooms: Room[] = [
  {
    name: 'Living Room',
    temperature: 22.5,
    humidity: 45,
    lightsOn: 2,
    totalLights: 3,
    devices: mockSmartHomeDevices.filter(d => d.room === 'Living Room')
  },
  {
    name: 'Kitchen',
    temperature: 24.2,
    humidity: 52,
    lightsOn: 1,
    totalLights: 1,
    devices: mockSmartHomeDevices.filter(d => d.room === 'Kitchen')
  },
  {
    name: 'Bedroom',
    temperature: 20.8,
    humidity: 38,
    lightsOn: 0,
    totalLights: 2,
    devices: mockSmartHomeDevices.filter(d => d.room === 'Bedroom')
  },
  {
    name: 'Office',
    temperature: 23.1,
    humidity: 42,
    lightsOn: 1,
    totalLights: 1,
    devices: mockSmartHomeDevices.filter(d => d.room === 'Office')
  }
]

export const mockSmartHomeStats: SmartHomeStats = {
  totalDevices: mockSmartHomeDevices.length,
  onlineDevices: mockSmartHomeDevices.filter(d => d.status !== 'unavailable').length,
  lightsOn: mockSmartHomeDevices.filter(d => d.type === 'light' && d.status === 'on').length,
  totalLights: mockSmartHomeDevices.filter(d => d.type === 'light').length,
  averageTemperature: 22.7,
  averageHumidity: 44.3,
  totalPowerConsumption: 1470,
  solarProduction: 3.2,
  batteryLevel: 85
}

// Network Topology Mock Data
export const mockNetworkNodes: NetworkNode[] = [
  {
    id: 'router-1',
    name: 'Main Router',
    type: 'router',
    ip: '192.168.1.1',
    mac: '00:11:22:33:44:55',
    status: 'online',
    signal: -30,
    lastSeen: 'now',
    security: 'secure',
    layer: 'core',
    x: 100,
    y: 100,
    size: 20,
    vlan: 1
  },
  {
    id: 'server-1',
    name: 'Home Server',
    type: 'server',
    ip: '192.168.1.10',
    mac: '00:11:22:33:44:66',
    status: 'online',
    lastSeen: 'now',
    security: 'secure',
    layer: 'core',
    x: 200,
    y: 100,
    size: 18,
    vlan: 1
  },
  {
    id: 'switch-1',
    name: 'Main Switch',
    type: 'switch',
    ip: '192.168.1.2',
    mac: '00:11:22:33:44:77',
    status: 'online',
    lastSeen: 'now',
    security: 'secure',
    layer: 'distribution',
    x: 150,
    y: 200,
    size: 16,
    vlan: 1
  },
  {
    id: 'nas-1',
    name: 'NAS Storage',
    type: 'nas',
    ip: '192.168.1.20',
    mac: '00:11:22:33:44:88',
    status: 'online',
    lastSeen: 'now',
    security: 'secure',
    layer: 'access',
    x: 250,
    y: 200,
    size: 14,
    vlan: 10
  },
  {
    id: 'desktop-1',
    name: 'Gaming PC',
    type: 'desktop',
    ip: '192.168.1.50',
    mac: '00:11:22:33:44:99',
    status: 'online',
    lastSeen: 'now',
    security: 'secure',
    layer: 'endpoint',
    x: 100,
    y: 300,
    size: 12,
    vlan: 1
  },
  {
    id: 'laptop-1',
    name: 'Work Laptop',
    type: 'laptop',
    ip: '192.168.1.51',
    mac: '00:11:22:33:44:AA',
    status: 'online',
    signal: -45,
    lastSeen: 'now',
    security: 'secure',
    layer: 'endpoint',
    x: 200,
    y: 300,
    size: 10,
    vlan: 1
  },
  {
    id: 'phone-1',
    name: 'iPhone',
    type: 'phone',
    ip: '192.168.1.52',
    mac: '00:11:22:33:44:BB',
    status: 'online',
    signal: -55,
    lastSeen: 'now',
    security: 'secure',
    layer: 'endpoint',
    x: 300,
    y: 300,
    size: 8,
    vlan: 1
  },
  {
    id: 'camera-1',
    name: 'Security Cam',
    type: 'camera',
    ip: '192.168.1.100',
    mac: '00:11:22:33:44:CC',
    status: 'online',
    lastSeen: 'now',
    security: 'secure',
    layer: 'access',
    x: 50,
    y: 200,
    size: 10,
    vlan: 20
  },
  {
    id: 'printer-1',
    name: 'Office Printer',
    type: 'printer',
    ip: '192.168.1.30',
    mac: '00:11:22:33:44:DD',
    status: 'offline',
    lastSeen: '2h ago',
    security: 'warning',
    layer: 'access',
    x: 350,
    y: 200,
    size: 8,
    vlan: 1
  }
]

export const mockNetworkLinks: NetworkLink[] = [
  { source: 'router-1', target: 'server-1', strength: 100, type: 'wired' },
  { source: 'router-1', target: 'switch-1', strength: 100, type: 'wired' },
  { source: 'switch-1', target: 'nas-1', strength: 100, type: 'wired' },
  { source: 'switch-1', target: 'desktop-1', strength: 100, type: 'wired' },
  { source: 'router-1', target: 'laptop-1', strength: 85, type: 'wireless' },
  { source: 'router-1', target: 'phone-1', strength: 75, type: 'wireless' },
  { source: 'switch-1', target: 'camera-1', strength: 100, type: 'wired' },
  { source: 'switch-1', target: 'printer-1', strength: 0, type: 'wired' }
]

export const mockNetworkHealth: NetworkHealth = {
  totalDevices: mockNetworkNodes.length,
  onlineDevices: mockNetworkNodes.filter(n => n.status === 'online').length,
  averageSignal: -45,
  securityIssues: 1,
  totalBandwidth: 1000
}

// Docker Containers Mock Data
export const mockDockerContainers: DockerContainer[] = [
  {
    id: 'nginx-1',
    name: 'nginx',
    image: 'nginx:latest',
    status: 'running',
    ports: ['80:80', '443:443'],
    created: '2024-01-15T10:30:00Z',
    uptime: '2d 5h 30m',
    cpu: 2.5,
    memory: 128,
    memoryLimit: 256,
    network: 'bridge'
  },
  {
    id: 'postgres-1',
    name: 'postgres',
    image: 'postgres:15',
    status: 'running',
    ports: ['5432:5432'],
    created: '2024-01-10T08:15:00Z',
    uptime: '7d 12h 45m',
    cpu: 8.2,
    memory: 512,
    memoryLimit: 1024,
    network: 'bridge'
  },
  {
    id: 'redis-1',
    name: 'redis',
    image: 'redis:7',
    status: 'running',
    ports: ['6379:6379'],
    created: '2024-01-12T14:20:00Z',
    uptime: '5d 8h 15m',
    cpu: 1.8,
    memory: 64,
    memoryLimit: 128,
    network: 'bridge'
  },
  {
    id: 'mongodb-1',
    name: 'mongodb',
    image: 'mongo:6',
    status: 'stopped',
    ports: ['27017:27017'],
    created: '2024-01-08T16:45:00Z',
    uptime: '0m',
    cpu: 0,
    memory: 0,
    memoryLimit: 512,
    network: 'bridge'
  },
  {
    id: 'elasticsearch-1',
    name: 'elasticsearch',
    image: 'elasticsearch:8',
    status: 'running',
    ports: ['9200:9200'],
    created: '2024-01-14T11:30:00Z',
    uptime: '3d 2h 10m',
    cpu: 15.6,
    memory: 1024,
    memoryLimit: 2048,
    network: 'bridge'
  }
]

// Security Alerts Mock Data
export const mockSecurityAlerts: SecurityAlert[] = [
  {
    id: 'alert-1',
    type: 'threat',
    severity: 'high',
    title: 'Suspicious Login Attempt',
    description: 'Multiple failed login attempts detected from IP 192.168.1.100',
    timestamp: '2024-01-15T14:30:00Z',
    source: 'Firewall',
    resolved: false
  },
  {
    id: 'alert-2',
    type: 'vulnerability',
    severity: 'medium',
    title: 'Outdated Package Detected',
    description: 'OpenSSL package needs to be updated to version 3.0.8',
    timestamp: '2024-01-15T10:15:00Z',
    source: 'Security Scanner',
    resolved: false
  },
  {
    id: 'alert-3',
    type: 'anomaly',
    severity: 'low',
    title: 'Unusual Network Traffic',
    description: 'High bandwidth usage detected during off-peak hours',
    timestamp: '2024-01-14T22:45:00Z',
    source: 'Network Monitor',
    resolved: true
  },
  {
    id: 'alert-4',
    type: 'breach',
    severity: 'critical',
    title: 'Potential Data Breach',
    description: 'Unauthorized access attempt to database server',
    timestamp: '2024-01-14T18:20:00Z',
    source: 'Database Monitor',
    resolved: false
  }
]

// Backup Status Mock Data
export const mockBackupStatus: BackupStatus[] = [
  {
    id: 'backup-1',
    name: 'Full System Backup',
    type: 'full',
    status: 'success',
    size: 1073741824,
    duration: 3600,
    lastRun: '2024-01-15T02:00:00Z',
    nextRun: '2024-01-16T02:00:00Z',
    retention: 30
  },
  {
    id: 'backup-2',
    name: 'Database Backup',
    type: 'incremental',
    status: 'success',
    size: 134217728,
    duration: 300,
    lastRun: '2024-01-15T12:00:00Z',
    nextRun: '2024-01-15T18:00:00Z',
    retention: 7
  },
  {
    id: 'backup-3',
    name: 'Configuration Backup',
    type: 'differential',
    status: 'failed',
    size: 0,
    duration: 0,
    lastRun: '2024-01-14T20:00:00Z',
    nextRun: '2024-01-15T20:00:00Z',
    retention: 14
  },
  {
    id: 'backup-4',
    name: 'Media Backup',
    type: 'full',
    status: 'running',
    size: 0,
    duration: 0,
    lastRun: '2024-01-15T15:30:00Z',
    nextRun: '2024-01-22T15:30:00Z',
    retention: 90
  }
]

// System Metrics Mock Data
export const mockSystemMetrics: SystemMetrics = {
  cpu: {
    usage: 45.2,
    cores: 8,
    temperature: 65
  },
  memory: {
    used: 8192,
    total: 16384,
    percentage: 50.0
  },
  disk: {
    used: 512000,
    total: 1000000,
    percentage: 51.2
  },
  network: {
    upload: 1250000,
    download: 8750000,
    total: 10000000
  },
  uptime: 604800, // 7 days
  loadAverage: [1.2, 1.5, 1.8]
}

// Weather Data Mock Data
export const mockWeatherData: WeatherData = {
  temperature: 22,
  condition: 'Partly Cloudy',
  humidity: 65,
  windSpeed: 12,
  pressure: 1013,
  visibility: 10,
  uvIndex: 6,
  icon: 'partly-cloudy',
  location: 'Amsterdam, NL',
  lastUpdated: '2024-01-15T15:30:00Z'
}

// Network Status Mock Data
export const mockNetworkStatus: NetworkStatus = {
  internet: true,
  latency: 15,
  downloadSpeed: 95.5,
  uploadSpeed: 12.3,
  packetLoss: 0.1,
  dnsStatus: true,
  lastChecked: '2024-01-15T15:30:00Z'
}
