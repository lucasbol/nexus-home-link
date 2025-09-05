<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-6">
      <!-- System Overview Skeleton -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="bg-card rounded-lg border border-border p-4 space-y-3">
          <div class="flex items-center justify-between">
            <div class="space-y-2">
              <Skeleton class="h-4 w-16" />
              <Skeleton class="h-6 w-20" />
            </div>
            <Skeleton class="h-5 w-5" />
          </div>
        </div>
      </div>

      <!-- Charts Skeleton -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div v-for="i in 4" :key="i" class="bg-card rounded-lg border border-border p-6 space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Skeleton class="h-5 w-5" />
              <Skeleton class="h-6 w-24" />
            </div>
            <Skeleton class="h-6 w-16" />
          </div>
          <Skeleton class="h-64 w-full" />
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="space-y-6">
      <!-- System Overview -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          class="p-4 bg-gradient-to-br from-card/80 to-card/60 border-border/50 backdrop-blur-sm"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Uptime</p>
              <p class="text-lg font-semibold text-foreground">{{ stats.uptime }}</p>
            </div>
            <CheckCircle class="w-5 h-5 text-green-500" />
          </div>
        </Card>

        <Card
          class="p-4 bg-gradient-to-br from-card/80 to-card/60 border-border/50 backdrop-blur-sm"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Load Average</p>
              <p class="text-lg font-semibold text-foreground">
                {{ stats.loadAverage.join(', ') }}
              </p>
            </div>
            <Activity class="w-5 h-5 text-blue-500" />
          </div>
        </Card>

        <Card
          class="p-4 bg-gradient-to-br from-card/80 to-card/60 border-border/50 backdrop-blur-sm"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Processes</p>
              <p class="text-lg font-semibold text-foreground">{{ stats.processes.total }}</p>
              <p class="text-xs text-muted-foreground">{{ stats.processes.running }} running</p>
            </div>
            <Activity class="w-5 h-5 text-purple-500" />
          </div>
        </Card>

        <Card
          class="p-4 bg-gradient-to-br from-card/80 to-card/60 border-border/50 backdrop-blur-sm"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Temperature</p>
              <p class="text-lg font-semibold text-foreground">{{ currentTemp }}°C</p>
              <p class="text-xs text-muted-foreground">CPU: {{ stats.temperature.cpu }}°C</p>
            </div>
            <Thermometer class="w-5 h-5 text-orange-500" />
          </div>
        </Card>
      </div>

      <!-- Main Metrics Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- CPU Usage -->
        <Card
          class="p-6 bg-gradient-to-br from-card/80 to-card/60 border-border/50 backdrop-blur-sm"
        >
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Cpu class="w-5 h-5 text-primary" />
                <h3 class="font-semibold text-foreground">CPU Usage</h3>
              </div>
              <div class="flex items-center gap-2">
                <span
                  :class="[
                    'text-2xl font-bold',
                    getStatusColor(currentCpu, { warning: 70, critical: 90 })
                  ]"
                >
                  {{ currentCpu }}%
                </span>
                <AlertTriangle v-if="currentCpu >= 90" class="w-4 h-4 text-red-500" />
              </div>
            </div>
            <div class="h-32">
              <Line :data="cpuChartData" :options="cpuChartOptions" />
            </div>
          </div>
        </Card>

        <!-- Memory Usage -->
        <Card
          class="p-6 bg-gradient-to-br from-card/80 to-card/60 border-border/50 backdrop-blur-sm"
        >
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <MemoryStick class="w-5 h-5 text-accent" />
                <h3 class="font-semibold text-foreground">Memory Usage</h3>
              </div>
              <div class="flex items-center gap-2">
                <span
                  :class="[
                    'text-2xl font-bold',
                    getStatusColor(currentMemory, { warning: 80, critical: 95 })
                  ]"
                >
                  {{ currentMemory }}%
                </span>
                <AlertTriangle v-if="currentMemory >= 95" class="w-4 h-4 text-red-500" />
              </div>
            </div>
            <div class="h-32">
              <Line :data="memoryChartData" :options="memoryChartOptions" />
            </div>
          </div>
        </Card>
      </div>

      <!-- Secondary Metrics -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Network Usage -->
        <Card
          class="p-6 bg-gradient-to-br from-card/80 to-card/60 border-border/50 backdrop-blur-sm"
        >
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Wifi class="w-5 h-5 text-success" />
                <h3 class="font-semibold text-foreground">Network</h3>
              </div>
              <span class="text-xl font-bold text-success">{{ currentNetwork }} MB/s</span>
            </div>
            <div class="h-24">
              <Line :data="networkChartData" :options="networkChartOptions" />
            </div>
          </div>
        </Card>

        <!-- Disk Usage -->
        <Card
          class="p-6 bg-gradient-to-br from-card/80 to-card/60 border-border/50 backdrop-blur-sm"
        >
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <HardDrive class="w-5 h-5 text-warning" />
                <h3 class="font-semibold text-foreground">Disk Usage</h3>
              </div>
              <div class="flex items-center gap-2">
                <span
                  :class="[
                    'text-xl font-bold',
                    getStatusColor(currentDisk, { warning: 80, critical: 95 })
                  ]"
                >
                  {{ currentDisk }}%
                </span>
                <AlertTriangle v-if="currentDisk >= 95" class="w-4 h-4 text-red-500" />
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-muted-foreground">Used: {{ stats.diskSpace.used }}GB</span>
                <span class="text-muted-foreground">Free: {{ stats.diskSpace.free }}GB</span>
              </div>
              <Progress :value="currentDisk" class="h-2" />
            </div>
          </div>
        </Card>

        <!-- Temperature -->
        <Card
          class="p-6 bg-gradient-to-br from-card/80 to-card/60 border-border/50 backdrop-blur-sm"
        >
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Thermometer class="w-5 h-5 text-orange-500" />
                <h3 class="font-semibold text-foreground">Temperature</h3>
              </div>
              <span
                :class="[
                  'text-xl font-bold',
                  getStatusColor(currentTemp, { warning: 70, critical: 85 })
                ]"
              >
                {{ currentTemp }}°C
              </span>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-muted-foreground">CPU: {{ stats.temperature.cpu }}°C</span>
                <span class="text-muted-foreground">GPU: {{ stats.temperature.gpu }}°C</span>
              </div>
              <div class="h-16">
                <Bar :data="temperatureChartData" :options="temperatureChartOptions" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import {
  Cpu,
  HardDrive,
  Wifi,
  MemoryStick,
  Thermometer,
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-vue-next'
import { Line, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import Card from './ui/card.vue'
import Progress from './ui/progress.vue'
import Skeleton from './ui/skeleton.vue'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface SystemMetric {
  timestamp: string
  cpu: number
  memory: number
  network: number
  disk: number
  temperature: number
  processes: number
}

interface SystemStats {
  uptime: string
  loadAverage: number[]
  diskSpace: {
    total: number
    used: number
    free: number
  }
  processes: {
    total: number
    running: number
    sleeping: number
  }
  temperature: {
    cpu: number
    gpu: number
    system: number
  }
}

const isLoading = ref(true)
const metrics = ref<SystemMetric[]>([])
const stats = ref<SystemStats>({
  uptime: '12d 3h 45m',
  loadAverage: [1.2, 1.5, 1.8],
  diskSpace: {
    total: 1000, // GB
    used: 750,
    free: 250
  },
  processes: {
    total: 342,
    running: 8,
    sleeping: 334
  },
  temperature: {
    cpu: 45,
    gpu: 52,
    system: 38
  }
})

const currentCpu = computed(() =>
  metrics.value.length > 0 ? metrics.value[metrics.value.length - 1].cpu : 0
)
const currentMemory = computed(() =>
  metrics.value.length > 0 ? metrics.value[metrics.value.length - 1].memory : 0
)
const currentNetwork = computed(() =>
  metrics.value.length > 0 ? metrics.value[metrics.value.length - 1].network : 0
)
const currentDisk = computed(() =>
  metrics.value.length > 0 ? metrics.value[metrics.value.length - 1].disk : 0
)
const currentTemp = computed(() =>
  metrics.value.length > 0 ? metrics.value[metrics.value.length - 1].temperature : 0
)

const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
  if (value >= thresholds.critical) return 'text-red-500'
  if (value >= thresholds.warning) return 'text-yellow-500'
  return 'text-green-500'
}

// Chart data computed properties
const cpuChartData = computed(() => ({
  labels: metrics.value.map(m => m.timestamp),
  datasets: [
    {
      label: 'CPU Usage (%)',
      data: metrics.value.map(m => m.cpu),
      borderColor: '#0ea5e9', // Blue color
      backgroundColor: 'rgba(14, 165, 233, 0.1)',
      fill: true,
      tension: 0.4
    }
  ]
}))

const memoryChartData = computed(() => ({
  labels: metrics.value.map(m => m.timestamp),
  datasets: [
    {
      label: 'Memory Usage (%)',
      data: metrics.value.map(m => m.memory),
      borderColor: '#a855f7', // Purple color
      backgroundColor: 'rgba(168, 85, 247, 0.1)',
      fill: true,
      tension: 0.4
    }
  ]
}))

const networkChartData = computed(() => ({
  labels: metrics.value.map(m => m.timestamp),
  datasets: [
    {
      label: 'Network (MB/s)',
      data: metrics.value.map(m => m.network),
      borderColor: '#22c55e', // Green color
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      fill: false,
      tension: 0.4
    }
  ]
}))

const temperatureChartData = computed(() => ({
  labels: metrics.value.slice(-12).map(m => m.timestamp),
  datasets: [
    {
      label: 'Temperature (°C)',
      data: metrics.value.slice(-12).map(m => m.temperature),
      backgroundColor: '#f97316', // Orange color
      borderColor: '#f97316',
      borderWidth: 1
    }
  ]
}))

// Chart options
const baseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      enabled: true,
      mode: 'index' as const,
      intersect: false,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1
    }
  },
  scales: {
    x: {
      display: false,
      grid: {
        display: false
      }
    },
    y: {
      display: false,
      beginAtZero: true,
      grid: {
        display: false
      }
    }
  },
  elements: {
    point: {
      radius: 0
    }
  }
}

const cpuChartOptions = computed(() => ({
  ...baseChartOptions,
  scales: {
    ...baseChartOptions.scales,
    y: {
      ...baseChartOptions.scales.y,
      max: 100
    }
  }
}))

const memoryChartOptions = computed(() => ({
  ...baseChartOptions,
  scales: {
    ...baseChartOptions.scales,
    y: {
      ...baseChartOptions.scales.y,
      max: 100
    }
  }
}))

const networkChartOptions = computed(() => ({
  ...baseChartOptions,
  scales: {
    ...baseChartOptions.scales,
    y: {
      ...baseChartOptions.scales.y,
      beginAtZero: true
    }
  }
}))

const temperatureChartOptions = computed(() => ({
  ...baseChartOptions,
  scales: {
    ...baseChartOptions.scales,
    y: {
      ...baseChartOptions.scales.y,
      beginAtZero: true
    }
  }
}))

const generateMetrics = () => {
  const now = Date.now()
  const data: SystemMetric[] = []

  for (let i = 23; i >= 0; i--) {
    const time = new Date(now - i * 5 * 60000) // 5-minute intervals
    data.push({
      timestamp: time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      cpu: Math.floor(Math.random() * 40) + 30, // 30-70% CPU usage
      memory: Math.floor(Math.random() * 30) + 50, // 50-80% memory usage
      network: Math.floor(Math.random() * 1000) + 100, // 100-1100 MB/s
      disk: Math.floor(Math.random() * 20) + 70, // 70-90% disk usage
      temperature: Math.floor(Math.random() * 15) + 40, // 40-55°C
      processes: Math.floor(Math.random() * 50) + 300 // 300-350 processes
    })
  }

  metrics.value = data
}

let interval: NodeJS.Timeout

onMounted(() => {
  generateMetrics()
  interval = setInterval(generateMetrics, 30000) // Update every 30 seconds

  // Simulate loading
  const loadingTimer = setTimeout(() => {
    isLoading.value = false
  }, 1200)

  return () => {
    clearInterval(interval)
    clearTimeout(loadingTimer)
  }
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})
</script>
