<template>
  <Card class="p-6 bg-gradient-to-br from-card/80 to-card/60 border-border/50 backdrop-blur-sm">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Container class="w-5 h-5 text-primary" />
          <h3 class="text-lg font-semibold text-foreground">Docker Containers</h3>
        </div>
        <div class="flex items-center gap-2">
          <CheckCircle class="w-4 h-4 text-green-500" />
          <span class="text-sm text-muted-foreground">
            {{ containerStats.running }}/{{ containerStats.total }} running
          </span>
        </div>
      </div>

      <!-- Overall Stats -->
      <div class="grid grid-cols-3 gap-4">
        <div class="text-center p-3 bg-muted/20 rounded-lg">
          <Cpu class="w-4 h-4 text-primary mx-auto mb-1" />
          <p class="text-xs text-muted-foreground">CPU Usage</p>
          <p class="text-lg font-semibold text-foreground">
            {{ totalCpuUsage.toFixed(1) }}%
          </p>
        </div>
        <div class="text-center p-3 bg-muted/20 rounded-lg">
          <MemoryStick class="w-4 h-4 text-primary mx-auto mb-1" />
          <p class="text-xs text-muted-foreground">Memory</p>
          <p class="text-lg font-semibold text-foreground">
            {{ formatBytes(totalMemoryUsage) }}/{{
              formatBytes(totalMemoryLimit)
            }}
          </p>
        </div>
        <div class="text-center p-3 bg-muted/20 rounded-lg">
          <Activity class="w-4 h-4 text-primary mx-auto mb-1" />
          <p class="text-xs text-muted-foreground">Uptime</p>
          <p class="text-lg font-semibold text-foreground">12d 3h</p>
        </div>
      </div>

      <!-- Container List -->
      <div class="space-y-3">
        <h4 class="text-sm font-medium text-foreground">Container Status</h4>
        <div
          v-for="container in dockerContainers"
          :key="container.id"
          class="flex items-center justify-between p-3 bg-muted/10 rounded-lg border border-border/30 hover:bg-muted/20 transition-colors"
        >
          <div class="flex items-center gap-3">
            <component
              :is="getStatusIcon(container.status)"
              :class="getStatusIconClass(container.status)"
            />
            <div>
              <p class="text-sm font-medium text-foreground">{{ container.name }}</p>
              <p class="text-xs text-muted-foreground">{{ container.image }}</p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="text-right">
              <p class="text-xs text-muted-foreground">CPU</p>
              <p class="text-sm font-medium text-foreground">{{ container.cpuUsage }}%</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-muted-foreground">Memory</p>
              <p class="text-sm font-medium text-foreground">
                {{ formatBytes(container.memoryUsage) }}
              </p>
            </div>
            <div class="text-right">
              <p class="text-xs text-muted-foreground">Uptime</p>
              <p class="text-sm font-medium text-foreground">{{ container.uptime }}</p>
            </div>
            <button
              v-if="container.serviceUrl && container.status === 'running'"
              @click="openService(container.serviceUrl)"
              class="flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 text-primary hover:bg-primary/20 rounded border border-primary/20 transition-colors"
              :title="`Open ${container.serviceName || container.name}`"
            >
              <ExternalLink class="w-3 h-3" />
              {{ container.serviceName || 'Open' }}
            </button>
            <Badge :class="getStatusColor(container.status)">
              {{ container.status }}
            </Badge>
          </div>
        </div>
      </div>

      <!-- Memory Usage Progress -->
      <div class="space-y-2">
        <div class="flex justify-between text-sm">
          <span class="text-muted-foreground">Memory Usage</span>
          <span class="text-foreground">
            {{ ((totalMemoryUsage / totalMemoryLimit) * 100).toFixed(1) }}%
          </span>
        </div>
        <Progress
          :value="(totalMemoryUsage / totalMemoryLimit) * 100"
          class="h-2"
        />
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
  Container,
  Activity,
  Cpu,
  HardDrive,
  MemoryStick,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  ExternalLink
} from 'lucide-vue-next'
import Card from './ui/card.vue'
import Badge from './ui/badge.vue'
import Progress from './ui/progress.vue'
import { useDocker } from '../composables/useDocker'

interface DockerContainer {
  id: string
  name: string
  image: string
  status: 'running' | 'stopped' | 'paused' | 'restarting'
  cpuUsage: number
  memoryUsage: number
  memoryLimit: number
  uptime: string
  ports: string[]
  serviceUrl?: string
  serviceName?: string
}

// Use the docker composable
const {
  containers: dockerContainers,
  loading: dockerLoading,
  error: dockerError,
  runningContainers,
  stoppedContainers,
  containerStats,
  fetchContainers,
  startContainer,
  stopContainer,
  refreshContainers
} = useDocker()

// Fetch data when component mounts
onMounted(async () => {
  await refreshContainers()
})

// Computed properties for stats
const totalCpuUsage = computed(() => {
  return runningContainers.value.reduce((sum, c) => sum + (c.cpuUsage || 0), 0)
})

const totalMemoryUsage = computed(() => {
  return runningContainers.value.reduce((sum, c) => sum + (c.memoryUsage || 0), 0)
})

const totalMemoryLimit = computed(() => {
  return runningContainers.value.reduce((sum, c) => sum + (c.memoryLimit || 0), 0)
})

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'running':
      return Play
    case 'stopped':
      return Pause
    case 'paused':
      return Pause
    case 'restarting':
      return RotateCcw
    default:
      return AlertTriangle
  }
}

const getStatusIconClass = (status: string) => {
  switch (status) {
    case 'running':
      return 'w-3 h-3 text-green-500'
    case 'stopped':
      return 'w-3 h-3 text-red-500'
    case 'paused':
      return 'w-3 h-3 text-yellow-500'
    case 'restarting':
      return 'w-3 h-3 text-blue-500'
    default:
      return 'w-3 h-3 text-gray-500'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'running':
      return 'bg-green-500/20 text-green-500 border-green-500/30'
    case 'stopped':
      return 'bg-red-500/20 text-red-500 border-red-500/30'
    case 'paused':
      return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
    case 'restarting':
      return 'bg-blue-500/20 text-blue-500 border-blue-500/30'
    default:
      return 'bg-gray-500/20 text-gray-500 border-gray-500/30'
  }
}

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const openService = (url: string) => {
  window.open(url, '_blank')
}

onMounted(async () => {
  // Fetch real data from API
  await fetchContainers()
  
})
</script>
