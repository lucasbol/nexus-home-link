<template>
  <Card class="p-6 bg-gradient-to-br from-card/80 to-card/60 border-border/50 backdrop-blur-sm">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Network class="w-5 h-5 text-primary" />
          <h3 class="text-lg font-semibold text-foreground">Network Topology</h3>
        </div>
        <div class="flex items-center gap-2">
          <Button variant="ghost" size="sm" @click="showDetails = !showDetails" class="h-8">
            <component :is="showDetails ? EyeOff : Eye" class="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" class="h-8">
            <RefreshCw class="w-4 h-4" />
          </Button>
        </div>
      </div>

      <!-- Network Health Stats -->
      <div class="grid grid-cols-4 gap-3">
        <div class="text-center p-3 bg-muted/20 rounded-lg">
          <Activity class="w-4 h-4 text-green-500 mx-auto mb-1" />
          <p class="text-xs text-muted-foreground">Online</p>
          <p class="text-lg font-semibold text-foreground">
            {{ networkHealth.onlineDevices }}/{{ networkHealth.totalDevices }}
          </p>
        </div>
        <div class="text-center p-3 bg-muted/20 rounded-lg">
          <Wifi class="w-4 h-4 text-blue-500 mx-auto mb-1" />
          <p class="text-xs text-muted-foreground">Avg Signal</p>
          <p class="text-lg font-semibold text-foreground">
            {{ networkHealth.averageSignal.toFixed(0) }}%
          </p>
        </div>
        <div class="text-center p-3 bg-muted/20 rounded-lg">
          <Shield class="w-4 h-4 text-orange-500 mx-auto mb-1" />
          <p class="text-xs text-muted-foreground">Security</p>
          <p class="text-lg font-semibold text-foreground">
            {{ networkHealth.securityIssues }}
          </p>
        </div>
        <div class="text-center p-3 bg-muted/20 rounded-lg">
          <Zap class="w-4 h-4 text-purple-500 mx-auto mb-1" />
          <p class="text-xs text-muted-foreground">Bandwidth</p>
          <p class="text-lg font-semibold text-foreground">
            {{ (networkHealth.totalBandwidth / 1000).toFixed(1) }}G
          </p>
        </div>
      </div>

      <!-- Network Topology Visualization -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h4 class="text-sm font-medium text-foreground">Interactive Network Map</h4>
          <div class="flex gap-2">
            <Badge
              v-for="layer in ['core', 'distribution', 'access', 'endpoint']"
              :key="layer"
              :class="getLayerColor(layer)"
              variant="outline"
            >
              {{ layer.charAt(0).toUpperCase() + layer.slice(1) }}
            </Badge>
          </div>
        </div>

        <!-- VLAN Legend -->
        <div class="flex flex-wrap gap-2 text-xs">
          <span class="text-muted-foreground">VLANs:</span>
          <div v-for="vlan in uniqueVlans" :key="vlan" class="flex items-center gap-1">
            <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: getVlanColor(vlan) }" />
            <span class="text-muted-foreground">VLAN {{ vlan }}</span>
          </div>
        </div>

        <div
          class="relative h-80 bg-gradient-to-br from-muted/10 to-muted/5 rounded-lg border border-border/30 overflow-hidden"
        >
          <div v-if="isLoading" class="flex items-center justify-center h-full">
            <div class="text-center">
              <div
                class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"
              ></div>
              <p class="text-sm text-muted-foreground">Loading network topology...</p>
            </div>
          </div>
          <div v-else-if="graphData.nodes.length > 0" class="h-full">
            <ForceGraph
              :nodes="graphData.nodes"
              :links="graphData.links"
              :width="1000"
              :height="320"
              :node-radius="8"
              :link-distance="150"
              :charge-strength="-500"
              @node-click="handleNodeClick"
              @node-hover="handleNodeHover"
            />
          </div>
        </div>
      </div>

      <!-- Device Details Panel -->
      <div v-if="showDetails" class="space-y-3">
        <h4 class="text-sm font-medium text-foreground">All Devices</h4>
        <div class="max-h-48 overflow-y-auto space-y-2">
          <div
            v-for="node in nodes"
            :key="node.id"
            :class="`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${
              selectedNode?.id === node.id
                ? 'bg-primary/10 border-primary/30'
                : 'bg-muted/10 border-border/30 hover:bg-muted/20'
            }`"
            @click="selectedNode = selectedNode?.id === node.id ? null : node"
          >
            <div class="flex items-center gap-3">
              <div :class="`p-2 rounded-md ${getLayerColor(node.layer)}`">
                <Network class="w-4 h-4" />
              </div>
              <div>
                <p class="text-sm font-medium text-foreground">{{ node.name }}</p>
                <p class="text-xs text-muted-foreground">{{ node.ip }} • {{ node.layer }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <div v-if="node.signal" class="text-right">
                <p class="text-xs text-muted-foreground">Signal</p>
                <p class="text-sm font-medium text-foreground">{{ node.signal }}%</p>
              </div>
              <div class="text-right">
                <p class="text-xs text-muted-foreground">Bandwidth</p>
                <p class="text-sm font-medium text-foreground">{{ node.bandwidth }}Mbps</p>
              </div>
              <div class="flex items-center gap-1">
                <component :is="getSecurityIcon(node.security)" class="w-3 h-3" />
              </div>
              <Badge
                :class="`${
                  node.status === 'online' ? 'text-green-500' : 'text-red-500'
                } border-current`"
                variant="outline"
              >
                {{ node.status }}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import ForceGraph from './ForceGraph.vue'
import {
  Router,
  Wifi,
  Server,
  Monitor,
  Smartphone,
  Laptop,
  Gamepad2,
  Camera,
  Printer,
  HardDrive,
  Activity,
  Shield,
  AlertTriangle,
  RefreshCw,
  Zap,
  Globe,
  Database,
  Cpu,
  HardDrive as HDD,
  Eye,
  EyeOff,
  Layers,
  Network,
  Settings
} from 'lucide-vue-next'
import Card from './ui/card.vue'
import Badge from './ui/badge.vue'
import Button from './ui/button.vue'

interface NetworkNode {
  id: string
  name: string
  type:
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
  ip: string
  mac: string
  status: 'online' | 'offline' | 'unknown'
  signal?: number
  lastSeen: string
  bandwidth?: number
  security: 'secure' | 'warning' | 'insecure'
  layer: 'core' | 'distribution' | 'access' | 'endpoint'
  x: number
  y: number
  size: number
  vlan?: number
}

interface NetworkLink {
  source: string
  target: string
  strength: number
  type: 'wired' | 'wireless'
}

const nodes = ref<NetworkNode[]>([])
const links = ref<NetworkLink[]>([])
const networkHealth = ref({
  totalDevices: 0,
  onlineDevices: 0,
  averageSignal: 0,
  securityIssues: 0,
  totalBandwidth: 0
})
const selectedNode = ref<NetworkNode | null>(null)
const showDetails = ref(false)
const isLoading = ref(true)
const graphData = ref<{ nodes: NetworkNode[]; links: NetworkLink[] }>({ nodes: [], links: [] })

const uniqueVlans = computed(() => {
  return Array.from(new Set(nodes.value.map(n => n.vlan).filter(Boolean)))
})

const getVlanColor = (vlan?: number) => {
  if (!vlan) return '#6b7280'
  const colors = [
    '#3b82f6',
    '#8b5cf6',
    '#f59e0b',
    '#10b981',
    '#ef4444',
    '#06b6d4',
    '#84cc16',
    '#f97316'
  ]
  return colors[vlan % colors.length]
}

const getLayerColor = (layer: string) => {
  switch (layer) {
    case 'core':
      return 'bg-blue-500/20 border-blue-500/50 text-blue-500'
    case 'distribution':
      return 'bg-purple-500/20 border-purple-500/50 text-purple-500'
    case 'access':
      return 'bg-orange-500/20 border-orange-500/50 text-orange-500'
    case 'endpoint':
      return 'bg-green-500/20 border-green-500/50 text-green-500'
    default:
      return 'bg-gray-500/20 border-gray-500/50 text-gray-500'
  }
}

const getSecurityIcon = (security: string) => {
  switch (security) {
    case 'secure':
      return Shield
    case 'warning':
      return AlertTriangle
    case 'insecure':
      return AlertTriangle
    default:
      return Shield
  }
}

const handleNodeClick = (node: NetworkNode) => {
  selectedNode.value = node
}

const handleNodeHover = (node: NetworkNode | null) => {
  if (node) {
    // Highlight connected nodes
    const connectedNodes = new Set()
    links.value.forEach(link => {
      if (link.source === node.id || link.target === node.id) {
        connectedNodes.add(link.source)
        connectedNodes.add(link.target)
      }
    })

    // Update node colors based on selection
    nodes.value.forEach(n => {
      n.__highlighted = connectedNodes.has(n.id)
    })
  } else {
    // Reset all highlights
    nodes.value.forEach(n => {
      n.__highlighted = false
    })
  }
}

onMounted(() => {
  // Create network nodes with proper force graph data structure
  const mockNodes: NetworkNode[] = [
    {
      id: 'internet',
      name: 'Internet',
      type: 'router',
      ip: '8.8.8.8',
      mac: '00:00:00:00:00:01',
      status: 'online',
      lastSeen: 'now',
      bandwidth: 1000,
      security: 'secure',
      layer: 'core',
      size: 8,
      x: 500,
      y: 50,
      vlan: 0
    },
    {
      id: 'router-1',
      name: 'ASUS Router',
      type: 'router',
      ip: '192.168.1.1',
      mac: '00:11:22:33:44:55',
      status: 'online',
      lastSeen: 'now',
      bandwidth: 1000,
      security: 'secure',
      layer: 'core',
      size: 8,
      x: 500,
      y: 150,
      vlan: 1
    },
    {
      id: 'switch-1',
      name: 'Core Switch',
      type: 'switch',
      ip: '192.168.1.2',
      mac: '00:11:22:33:44:56',
      status: 'online',
      lastSeen: 'now',
      bandwidth: 1000,
      security: 'secure',
      layer: 'distribution',
      size: 7,
      x: 200,
      y: 250,
      vlan: 1
    },
    {
      id: 'ap-1',
      name: 'WiFi AP',
      type: 'access_point',
      ip: '192.168.1.3',
      mac: '00:11:22:33:44:57',
      status: 'online',
      lastSeen: 'now',
      bandwidth: 866,
      security: 'secure',
      layer: 'distribution',
      size: 7,
      x: 800,
      y: 250,
      vlan: 1
    },
    {
      id: 'server-1',
      name: 'HomeLab Server',
      type: 'server',
      ip: '192.168.1.100',
      mac: '00:11:22:33:44:66',
      status: 'online',
      lastSeen: 'now',
      bandwidth: 1000,
      security: 'secure',
      layer: 'access',
      size: 6,
      x: 100,
      y: 350,
      vlan: 10
    },
    {
      id: 'nas-1',
      name: 'Synology NAS',
      type: 'nas',
      ip: '192.168.1.101',
      mac: '00:11:22:33:44:77',
      status: 'online',
      lastSeen: '2m ago',
      bandwidth: 1000,
      security: 'secure',
      layer: 'access',
      size: 6,
      x: 500,
      y: 350,
      vlan: 10
    },
    {
      id: 'desktop-1',
      name: 'Gaming PC',
      type: 'desktop',
      ip: '192.168.1.50',
      mac: '00:11:22:33:44:88',
      status: 'online',
      lastSeen: '1m ago',
      bandwidth: 1000,
      security: 'secure',
      layer: 'endpoint',
      size: 5,
      x: 100,
      y: 450,
      vlan: 20
    },
    {
      id: 'laptop-1',
      name: 'MacBook Pro',
      type: 'laptop',
      ip: '192.168.1.51',
      mac: '00:11:22:33:44:99',
      status: 'online',
      lastSeen: 'now',
      signal: 85,
      bandwidth: 866,
      security: 'secure',
      layer: 'endpoint',
      size: 5,
      x: 500,
      y: 450,
      vlan: 30
    },
    {
      id: 'phone-1',
      name: 'iPhone 15',
      type: 'phone',
      ip: '192.168.1.52',
      mac: '00:11:22:33:44:AA',
      status: 'online',
      lastSeen: 'now',
      signal: 92,
      bandwidth: 433,
      security: 'secure',
      layer: 'endpoint',
      size: 4,
      x: 800,
      y: 450,
      vlan: 30
    },
    {
      id: 'gaming-1',
      name: 'PlayStation 5',
      type: 'gaming',
      ip: '192.168.1.53',
      mac: '00:11:22:33:44:BB',
      status: 'online',
      lastSeen: '5m ago',
      signal: 78,
      bandwidth: 866,
      security: 'secure',
      layer: 'endpoint',
      size: 5,
      x: 900,
      y: 450,
      vlan: 30
    },
    {
      id: 'camera-1',
      name: 'Security Cam',
      type: 'camera',
      ip: '192.168.1.54',
      mac: '00:11:22:33:44:CC',
      status: 'online',
      lastSeen: 'now',
      signal: 65,
      bandwidth: 150,
      security: 'warning',
      layer: 'endpoint',
      size: 4,
      x: 900,
      y: 350,
      vlan: 40
    },
    {
      id: 'printer-1',
      name: 'HP Printer',
      type: 'printer',
      ip: '192.168.1.55',
      mac: '00:11:22:33:44:DD',
      status: 'offline',
      lastSeen: '2h ago',
      signal: 0,
      bandwidth: 0,
      security: 'insecure',
      layer: 'endpoint',
      size: 4,
      x: 300,
      y: 450,
      vlan: 20
    }
  ]

  const mockLinks: NetworkLink[] = [
    { source: 'internet', target: 'router-1', strength: 1, type: 'wired' },
    { source: 'router-1', target: 'switch-1', strength: 0.8, type: 'wired' },
    { source: 'router-1', target: 'ap-1', strength: 0.8, type: 'wired' },
    { source: 'switch-1', target: 'server-1', strength: 0.6, type: 'wired' },
    { source: 'switch-1', target: 'nas-1', strength: 0.6, type: 'wired' },
    { source: 'switch-1', target: 'desktop-1', strength: 0.4, type: 'wired' },
    { source: 'switch-1', target: 'printer-1', strength: 0.4, type: 'wired' },
    { source: 'ap-1', target: 'laptop-1', strength: 0.5, type: 'wireless' },
    { source: 'ap-1', target: 'phone-1', strength: 0.5, type: 'wireless' },
    { source: 'ap-1', target: 'gaming-1', strength: 0.5, type: 'wireless' },
    { source: 'ap-1', target: 'camera-1', strength: 0.5, type: 'wireless' }
  ]

  setTimeout(() => {
    console.log('Setting graph data:', { nodes: mockNodes, links: mockLinks })
    nodes.value = mockNodes
    links.value = mockLinks
    graphData.value = { nodes: mockNodes, links: mockLinks }
    isLoading.value = false

    const online = mockNodes.filter(d => d.status === 'online')
    const avgSignal =
      online.filter(d => d.signal).reduce((sum, d) => sum + (d.signal || 0), 0) /
      online.filter(d => d.signal).length
    const securityIssues = mockNodes.filter(d => d.security !== 'secure').length
    const totalBandwidth = online.reduce((sum, d) => sum + (d.bandwidth || 0), 0)

    networkHealth.value = {
      totalDevices: mockNodes.length,
      onlineDevices: online.length,
      averageSignal: avgSignal || 0,
      securityIssues,
      totalBandwidth
    }
  }, 1500)
})
</script>
