<template>
  <header class="bg-card/80 backdrop-blur-sm border-b border-border p-4">
    <div class="flex items-center justify-between">
      <!-- Network Status Pills -->
      <div class="flex flex-wrap gap-1.5 sm:gap-2 min-w-0">
        <div 
          v-for="status in networkStatuses"
          :key="status.id"
          class="flex items-center gap-1.5 px-2 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
        >
          <div class="w-2 h-2 rounded-full bg-green-500" />
          <span class="hidden sm:inline">{{ status.label }}</span>
          <span class="font-mono">{{ status.value }}</span>
        </div>
      </div>

      <!-- Right Side Controls - Moved to top right -->
      <div class="flex items-center gap-2">
        <!-- Weather Pill -->
        <div class="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-full bg-muted text-sm">
          <Sun class="h-4 w-4 text-yellow-500" />
          <span class="font-medium">22°C</span>
          <span class="hidden sm:inline text-muted-foreground">Sunny</span>
        </div>

        <!-- Theme Dropdown -->
        <ThemeDropdown />

        <!-- Settings Button -->
        <button
          @click="openSettings"
          class="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
          title="Settings"
        >
          <Settings class="h-4 w-4" />
          <span class="hidden sm:inline text-sm font-medium">Settings</span>
        </button>

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
import { RefreshCw, Sun, Settings } from 'lucide-vue-next'
import ThemeDropdown from './ThemeDropdown.vue'

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

const refreshDashboard = () => {
  console.log('Refreshing dashboard...')
}

const openSettings = () => {
  // Emit event to parent to switch to settings tab
  emit('open-settings')
}

const emit = defineEmits<{
  'open-settings': []
}>()
</script>
