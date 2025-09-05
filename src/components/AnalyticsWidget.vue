<template>
  <div class="bg-card rounded-lg border border-border p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold">Analytics Dashboard</h3>
      <div class="flex items-center gap-2">
        <select 
          v-model="selectedTimeRange"
          class="px-3 py-1 rounded-lg bg-muted border border-border text-sm"
        >
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
        <button
          @click="refreshAnalytics"
          class="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
          title="Refresh Analytics"
        >
          <RefreshCw class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-muted/50 rounded-lg p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-blue-600 rounded-lg">
            <TrendingUp class="h-5 w-5 text-white" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Uptime</p>
            <p class="text-2xl font-bold">99.9%</p>
            <p class="text-xs text-green-600">+0.1% from last month</p>
          </div>
        </div>
      </div>

      <div class="bg-muted/50 rounded-lg p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-green-600 rounded-lg">
            <Zap class="h-5 w-5 text-white" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Power Usage</p>
            <p class="text-2xl font-bold">245W</p>
            <p class="text-xs text-red-600">+12W from yesterday</p>
          </div>
        </div>
      </div>

      <div class="bg-muted/50 rounded-lg p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-purple-600 rounded-lg">
            <Network class="h-5 w-5 text-white" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Data Transfer</p>
            <p class="text-2xl font-bold">2.4TB</p>
            <p class="text-xs text-blue-600">+180GB this week</p>
          </div>
        </div>
      </div>

      <div class="bg-muted/50 rounded-lg p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-orange-600 rounded-lg">
            <Users class="h-5 w-5 text-white" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Active Users</p>
            <p class="text-2xl font-bold">8</p>
            <p class="text-xs text-green-600">+2 new this month</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- CPU Usage Over Time -->
      <div class="bg-muted/30 rounded-lg p-4">
        <h4 class="text-sm font-medium mb-4">CPU Usage Over Time</h4>
        <div class="h-64 flex items-center justify-center">
          <div class="w-full space-y-2">
            <div 
              v-for="(point, index) in cpuUsageData"
              :key="index"
              class="flex items-center gap-4"
            >
              <div class="w-16 text-xs text-muted-foreground">{{ point.time }}</div>
              <div class="flex-1 bg-muted rounded-full h-3">
                <div 
                  class="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  :style="{ width: `${point.usage}%` }"
                />
              </div>
              <div class="w-12 text-xs text-right">{{ point.usage }}%</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Network Traffic -->
      <div class="bg-muted/30 rounded-lg p-4">
        <h4 class="text-sm font-medium mb-4">Network Traffic</h4>
        <div class="h-64 flex items-center justify-center">
          <div class="w-full space-y-2">
            <div 
              v-for="(point, index) in networkTrafficData"
              :key="index"
              class="flex items-center gap-4"
            >
              <div class="w-16 text-xs text-muted-foreground">{{ point.time }}</div>
              <div class="flex-1 space-y-1">
                <div class="flex items-center gap-2">
                  <div class="w-8 text-xs">↑</div>
                  <div class="flex-1 bg-muted rounded-full h-2">
                    <div 
                      class="bg-green-600 h-2 rounded-full transition-all duration-300"
                      :style="{ width: `${Math.min(point.upload / 10, 100)}%` }"
                    />
                  </div>
                  <div class="w-12 text-xs text-right">{{ point.upload }}MB</div>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-8 text-xs">↓</div>
                  <div class="flex-1 bg-muted rounded-full h-2">
                    <div 
                      class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      :style="{ width: `${Math.min(point.download / 10, 100)}%` }"
                    />
                  </div>
                  <div class="w-12 text-xs text-right">{{ point.download }}MB</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Service Usage -->
    <div class="bg-muted/30 rounded-lg p-4 mb-6">
      <h4 class="text-sm font-medium mb-4">Service Usage</h4>
      <div class="space-y-3">
        <div 
          v-for="service in serviceUsage"
          :key="service.id"
          class="flex items-center gap-4"
        >
          <div class="w-24 text-sm font-medium">{{ service.name }}</div>
          <div class="flex-1 bg-muted rounded-full h-3">
            <div 
              class="bg-primary h-3 rounded-full transition-all duration-300"
              :style="{ width: `${service.usage}%` }"
            />
          </div>
          <div class="w-16 text-sm text-right">{{ service.usage }}%</div>
          <div class="w-20 text-xs text-muted-foreground text-right">{{ service.requests }} req</div>
        </div>
      </div>
    </div>

    <!-- Top Devices -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-muted/30 rounded-lg p-4">
        <h4 class="text-sm font-medium mb-4">Top Devices by Bandwidth</h4>
        <div class="space-y-3">
          <div 
            v-for="device in topDevices"
            :key="device.id"
            class="flex items-center gap-3"
          >
            <div class="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
              <component :is="device.icon" class="h-4 w-4" />
            </div>
            <div class="flex-1">
              <div class="text-sm font-medium">{{ device.name }}</div>
              <div class="text-xs text-muted-foreground">{{ device.ip }}</div>
            </div>
            <div class="text-sm font-medium">{{ device.bandwidth }}GB</div>
          </div>
        </div>
      </div>

      <div class="bg-muted/30 rounded-lg p-4">
        <h4 class="text-sm font-medium mb-4">Storage Usage</h4>
        <div class="space-y-3">
          <div 
            v-for="storage in storageUsage"
            :key="storage.id"
            class="flex items-center gap-3"
          >
            <div class="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
              <HardDrive class="h-4 w-4" />
            </div>
            <div class="flex-1">
              <div class="text-sm font-medium">{{ storage.name }}</div>
              <div class="text-xs text-muted-foreground">{{ storage.used }}GB / {{ storage.total }}GB</div>
            </div>
            <div class="text-sm font-medium">{{ storage.percentage }}%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  RefreshCw, 
  TrendingUp, 
  Zap, 
  Network, 
  Users, 
  HardDrive,
  Monitor,
  Smartphone,
  Laptop,
  Tv
} from 'lucide-vue-next'

const selectedTimeRange = ref('7d')

const cpuUsageData = ref([
  { time: '00:00', usage: 25 },
  { time: '04:00', usage: 15 },
  { time: '08:00', usage: 45 },
  { time: '12:00', usage: 60 },
  { time: '16:00', usage: 55 },
  { time: '20:00', usage: 70 },
  { time: '24:00', usage: 35 }
])

const networkTrafficData = ref([
  { time: '00:00', upload: 12, download: 45 },
  { time: '04:00', upload: 8, download: 32 },
  { time: '08:00', upload: 25, download: 78 },
  { time: '12:00', upload: 35, download: 95 },
  { time: '16:00', upload: 28, download: 82 },
  { time: '20:00', upload: 42, download: 120 },
  { time: '24:00', upload: 18, download: 55 }
])

const serviceUsage = ref([
  { id: '1', name: 'Plex', usage: 85, requests: 1247 },
  { id: '2', name: 'Sonarr', usage: 45, requests: 89 },
  { id: '3', name: 'Radarr', usage: 38, requests: 67 },
  { id: '4', name: 'Home Assistant', usage: 72, requests: 2341 },
  { id: '5', name: 'UniFi Controller', usage: 15, requests: 456 }
])

const topDevices = ref([
  { id: '1', name: 'Gaming PC', ip: '192.168.1.50', bandwidth: 245, icon: Monitor },
  { id: '2', name: 'MacBook Pro', ip: '192.168.1.51', bandwidth: 189, icon: Laptop },
  { id: '3', name: 'iPhone 15', ip: '192.168.1.52', bandwidth: 156, icon: Smartphone },
  { id: '4', name: 'PlayStation 5', ip: '192.168.1.53', bandwidth: 134, icon: Tv }
])

const storageUsage = ref([
  { id: '1', name: 'Main Storage', used: 1247, total: 2000, percentage: 62 },
  { id: '2', name: 'Media Library', used: 3456, total: 4000, percentage: 86 },
  { id: '3', name: 'Backups', used: 892, total: 1000, percentage: 89 },
  { id: '4', name: 'System', used: 156, total: 500, percentage: 31 }
])

const refreshAnalytics = () => {
  console.log('Refreshing analytics...')
}
</script>
