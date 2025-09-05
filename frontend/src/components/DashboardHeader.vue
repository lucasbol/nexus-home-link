1<template>
  <header class="bg-card/80 backdrop-blur-sm border-b border-border p-4">
    <div class="flex items-center justify-between">
      <!-- Network Status Pills -->
      <div class="flex flex-wrap gap-1.5 sm:gap-2 min-w-0">
        <NetworkStatusPill 
          v-for="status in networkStatuses"
          :key="status.id"
          :status="status"
          class="flex-shrink-0"
        />
      </div>

      <!-- Right Side Controls -->
      <div class="flex items-center gap-3">
        <!-- Weather Pill -->
        <WeatherPill class="hidden sm:flex" />

        <!-- Theme Toggle (Desktop) -->
        <ThemeToggle class="hidden md:block" />

        <!-- Refresh Button -->
        <button
          @click="refreshDashboard"
          class="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
          title="Refresh Dashboard"
        >
          <RefreshCw class="h-4 w-4" />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RefreshCw } from 'lucide-vue-next'
import NetworkStatusPill from './NetworkStatusPill.vue'
import WeatherPill from './WeatherPill.vue'
import ThemeToggle from './ThemeToggle.vue'

interface NetworkStatus {
  id: string
  label: string
  status: 'online' | 'offline' | 'warning'
  value: string
}

const networkStatuses = ref<NetworkStatus[]>([
  { id: 'internet', label: 'Internet', status: 'online', value: '1.2 Gbps' },
  { id: 'lan', label: 'LAN', status: 'online', value: '10 Gbps' },
  { id: 'wifi', label: 'WiFi', status: 'online', value: '866 Mbps' },
  { id: 'uptime', label: 'Uptime', status: 'online', value: '99.9%' }
])

function refreshDashboard() {
  // Emit refresh event or call refresh function
  console.log('Refreshing dashboard...')
}
</script>
