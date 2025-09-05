<template>
  <div class="bg-card rounded-lg border border-border p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold">System Performance</h3>
      <div class="flex items-center gap-2">
        <button
          v-for="period in timePeriods"
          :key="period.value"
          @click="selectedPeriod = period.value"
          :class="[
            'px-3 py-1 rounded-md text-sm font-medium transition-colors',
            selectedPeriod === period.value
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          ]"
        >
          {{ period.label }}
        </button>
      </div>
    </div>

    <!-- System Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-muted/50 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-muted-foreground">CPU Usage</p>
            <p class="text-2xl font-bold text-green-600">{{ cpuUsage }}%</p>
          </div>
          <Cpu class="h-8 w-8 text-green-600" />
        </div>
        <div class="mt-2 w-full bg-muted rounded-full h-2">
          <div 
            class="bg-green-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${cpuUsage}%` }"
          />
        </div>
      </div>

      <div class="bg-muted/50 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-muted-foreground">Memory</p>
            <p class="text-2xl font-bold text-blue-600">{{ memoryUsage }}%</p>
          </div>
          <MemoryStick class="h-8 w-8 text-blue-600" />
        </div>
        <div class="mt-2 w-full bg-muted rounded-full h-2">
          <div 
            class="bg-blue-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${memoryUsage}%` }"
          />
        </div>
      </div>

      <div class="bg-muted/50 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-muted-foreground">Disk Usage</p>
            <p class="text-2xl font-bold text-orange-600">{{ diskUsage }}%</p>
          </div>
          <HardDrive class="h-8 w-8 text-orange-600" />
        </div>
        <div class="mt-2 w-full bg-muted rounded-full h-2">
          <div 
            class="bg-orange-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${diskUsage}%` }"
          />
        </div>
      </div>

      <div class="bg-muted/50 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-muted-foreground">Network</p>
            <p class="text-2xl font-bold text-purple-600">{{ networkSpeed }} Mbps</p>
          </div>
          <Network class="h-8 w-8 text-purple-600" />
        </div>
        <div class="mt-2 text-sm text-muted-foreground">
          ↑ {{ networkUpload }} Mbps ↓ {{ networkDownload }} Mbps
        </div>
      </div>
    </div>

    <!-- Performance Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- CPU & Memory Chart -->
      <div class="bg-muted/30 rounded-lg p-4">
        <h4 class="text-sm font-medium mb-4">CPU & Memory Usage</h4>
        <div class="h-64 flex items-center justify-center">
          <div class="w-full space-y-4">
            <div v-for="(point, index) in performanceData" :key="index" class="flex items-center gap-4">
              <div class="w-16 text-xs text-muted-foreground">{{ point.time }}</div>
              <div class="flex-1 space-y-2">
                <div class="flex items-center gap-2">
                  <div class="w-12 text-xs">CPU</div>
                  <div class="flex-1 bg-muted rounded-full h-2">
                    <div 
                      class="bg-green-600 h-2 rounded-full transition-all duration-300"
                      :style="{ width: `${point.cpu}%` }"
                    />
                  </div>
                  <div class="w-8 text-xs text-right">{{ point.cpu }}%</div>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-12 text-xs">RAM</div>
                  <div class="flex-1 bg-muted rounded-full h-2">
                    <div 
                      class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      :style="{ width: `${point.memory}%` }"
                    />
                  </div>
                  <div class="w-8 text-xs text-right">{{ point.memory }}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Network Activity Chart -->
      <div class="bg-muted/30 rounded-lg p-4">
        <h4 class="text-sm font-medium mb-4">Network Activity</h4>
        <div class="h-64 flex items-center justify-center">
          <div class="w-full space-y-4">
            <div v-for="(point, index) in networkData" :key="index" class="flex items-center gap-4">
              <div class="w-16 text-xs text-muted-foreground">{{ point.time }}</div>
              <div class="flex-1 space-y-2">
                <div class="flex items-center gap-2">
                  <div class="w-12 text-xs">↑</div>
                  <div class="flex-1 bg-muted rounded-full h-2">
                    <div 
                      class="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      :style="{ width: `${Math.min(point.upload / 100, 100)}%` }"
                    />
                  </div>
                  <div class="w-12 text-xs text-right">{{ point.upload }} Mbps</div>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-12 text-xs">↓</div>
                  <div class="flex-1 bg-muted rounded-full h-2">
                    <div 
                      class="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      :style="{ width: `${Math.min(point.download / 100, 100)}%` }"
                    />
                  </div>
                  <div class="w-12 text-xs text-right">{{ point.download }} Mbps</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Cpu, MemoryStick, HardDrive, Network } from 'lucide-vue-next'

const selectedPeriod = ref('1h')
const cpuUsage = ref(45)
const memoryUsage = ref(68)
const diskUsage = ref(32)
const networkSpeed = ref(1200)
const networkUpload = ref(45)
const networkDownload = ref(78)

const timePeriods = [
  { value: '1h', label: '1 Hour' },
  { value: '6h', label: '6 Hours' },
  { value: '24h', label: '24 Hours' },
  { value: '7d', label: '7 Days' }
]

const performanceData = ref([
  { time: '00:00', cpu: 45, memory: 68 },
  { time: '00:15', cpu: 52, memory: 72 },
  { time: '00:30', cpu: 38, memory: 65 },
  { time: '00:45', cpu: 61, memory: 75 },
  { time: '01:00', cpu: 47, memory: 70 }
])

const networkData = ref([
  { time: '00:00', upload: 45, download: 78 },
  { time: '00:15', upload: 52, download: 85 },
  { time: '00:30', upload: 38, download: 62 },
  { time: '00:45', upload: 61, download: 95 },
  { time: '01:00', upload: 47, download: 72 }
])

let interval: NodeJS.Timeout

onMounted(() => {
  // Simulate real-time data updates
  interval = setInterval(() => {
    cpuUsage.value = Math.floor(Math.random() * 40) + 30
    memoryUsage.value = Math.floor(Math.random() * 30) + 50
    networkUpload.value = Math.floor(Math.random() * 50) + 20
    networkDownload.value = Math.floor(Math.random() * 80) + 40
  }, 2000)
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})
</script>
