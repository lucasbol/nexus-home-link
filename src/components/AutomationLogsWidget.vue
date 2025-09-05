<template>
  <div class="bg-card rounded-lg border border-border p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold">Automation Logs</h3>
      <div class="flex items-center gap-2">
        <div class="text-sm text-muted-foreground">
          {{ totalAutomations }} automations configured
        </div>
        <button
          @click="refreshLogs"
          class="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
          title="Refresh Logs"
        >
          <RefreshCw class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- Automation Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-green-100 dark:bg-green-900/20 rounded-lg p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-green-600 rounded-lg">
            <CheckCircle class="h-5 w-5 text-white" />
          </div>
          <div>
            <p class="text-sm text-green-800 dark:text-green-400">Successful</p>
            <p class="text-2xl font-bold text-green-900 dark:text-green-300">{{ successfulRuns }}</p>
          </div>
        </div>
      </div>

      <div class="bg-red-100 dark:bg-red-900/20 rounded-lg p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-red-600 rounded-lg">
            <XCircle class="h-5 w-5 text-white" />
          </div>
          <div>
            <p class="text-sm text-red-800 dark:text-red-400">Failed</p>
            <p class="text-2xl font-bold text-red-900 dark:text-red-300">{{ failedRuns }}</p>
          </div>
        </div>
      </div>

      <div class="bg-blue-100 dark:bg-blue-900/20 rounded-lg p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-blue-600 rounded-lg">
            <Clock class="h-5 w-5 text-white" />
          </div>
          <div>
            <p class="text-sm text-blue-800 dark:text-blue-400">Running</p>
            <p class="text-2xl font-bold text-blue-900 dark:text-blue-300">{{ runningAutomations }}</p>
          </div>
        </div>
      </div>

      <div class="bg-purple-100 dark:bg-purple-900/20 rounded-lg p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-purple-600 rounded-lg">
            <Zap class="h-5 w-5 text-white" />
          </div>
          <div>
            <p class="text-sm text-purple-800 dark:text-purple-400">Triggers</p>
            <p class="text-2xl font-bold text-purple-900 dark:text-purple-300">{{ totalTriggers }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex flex-wrap gap-2 mb-6">
      <button
        v-for="filter in logFilters"
        :key="filter.id"
        @click="selectedFilter = filter.id"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
          selectedFilter === filter.id
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
        ]"
      >
        <component :is="filter.icon" class="h-4 w-4 mr-2 inline" />
        {{ filter.name }}
      </button>
    </div>

    <!-- Automation Logs -->
    <div class="space-y-3">
      <div 
        v-for="log in filteredLogs"
        :key="log.id"
        class="p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors"
      >
        <div class="flex items-start gap-3">
          <div 
            :class="[
              'w-3 h-3 rounded-full mt-1.5 flex-shrink-0',
              log.status === 'success' ? 'bg-green-500' :
              log.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
            ]"
          />
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-medium">{{ log.name }}</span>
              <span 
                :class="[
                  'px-2 py-0.5 rounded-full text-xs font-medium',
                  log.status === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                  log.status === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                ]"
              >
                {{ log.status.toUpperCase() }}
              </span>
            </div>
            <p class="text-sm text-muted-foreground mb-2">{{ log.description }}</p>
            <div class="flex items-center gap-4 text-xs text-muted-foreground">
              <span>{{ log.trigger }}</span>
              <span>{{ log.time }}</span>
              <span>{{ log.duration }}</span>
            </div>
            <div v-if="log.error" class="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs text-red-800 dark:text-red-400">
              {{ log.error }}
            </div>
          </div>
          <div class="flex gap-1">
            <button
              @click="viewLog(log.id)"
              class="p-1 rounded hover:bg-muted transition-colors"
              title="View Details"
            >
              <ExternalLink class="h-4 w-4" />
            </button>
            <button
              v-if="log.status === 'error'"
              @click="retryAutomation(log.id)"
              class="p-1 rounded hover:bg-muted transition-colors"
              title="Retry Automation"
            >
              <RefreshCw class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Automations -->
    <div class="mt-6 pt-6 border-t border-border">
      <h4 class="text-sm font-medium mb-3">Recent Automations</h4>
      <div class="space-y-2">
        <div 
          v-for="automation in recentAutomations"
          :key="automation.id"
          class="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
        >
          <div 
            :class="[
              'w-2 h-2 rounded-full',
              automation.status === 'success' ? 'bg-green-500' : 'bg-red-500'
            ]"
          />
          <div class="flex-1">
            <div class="text-sm font-medium">{{ automation.name }}</div>
            <div class="text-xs text-muted-foreground">{{ automation.description }}</div>
          </div>
          <div class="text-xs text-muted-foreground">{{ automation.time }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Zap, 
  ExternalLink,
  Filter,
  CheckCircle2,
  AlertCircle,
  Info
} from 'lucide-vue-next'

interface AutomationLog {
  id: string
  name: string
  description: string
  status: 'success' | 'error' | 'running'
  trigger: string
  time: string
  duration: string
  error?: string
}

interface RecentAutomation {
  id: string
  name: string
  description: string
  status: 'success' | 'error'
  time: string
}

const selectedFilter = ref('all')

const logFilters = [
  { id: 'all', name: 'All', icon: Filter },
  { id: 'success', name: 'Success', icon: CheckCircle2 },
  { id: 'error', name: 'Errors', icon: AlertCircle },
  { id: 'running', name: 'Running', icon: Clock }
]

const automationLogs = ref<AutomationLog[]>([
  {
    id: '1',
    name: 'Morning Routine',
    description: 'Turn on lights, adjust temperature, start coffee maker',
    status: 'success',
    trigger: 'Time: 07:00',
    time: '2 hours ago',
    duration: '45s'
  },
  {
    id: '2',
    name: 'Security Check',
    description: 'Check all doors and windows, arm security system',
    status: 'success',
    trigger: 'Time: 22:00',
    time: '4 hours ago',
    duration: '12s'
  },
  {
    id: '3',
    name: 'Temperature Control',
    description: 'Adjust HVAC based on weather forecast',
    status: 'error',
    trigger: 'Weather API',
    time: '6 hours ago',
    duration: '2m',
    error: 'Weather API timeout - retrying in 5 minutes'
  },
  {
    id: '4',
    name: 'Media Sync',
    description: 'Sync new media files to Plex library',
    status: 'running',
    trigger: 'File Watcher',
    time: '10 minutes ago',
    duration: 'Running...'
  },
  {
    id: '5',
    name: 'Backup System',
    description: 'Daily backup of important files',
    status: 'success',
    trigger: 'Time: 03:00',
    time: '1 day ago',
    duration: '15m'
  },
  {
    id: '6',
    name: 'Network Scan',
    description: 'Scan network for new devices',
    status: 'error',
    trigger: 'Schedule: Daily',
    time: '1 day ago',
    duration: '30s',
    error: 'Network timeout - check network connectivity'
  }
])

const recentAutomations = ref<RecentAutomation[]>([
  {
    id: '1',
    name: 'Motion Detection',
    description: 'Turn on lights when motion detected',
    status: 'success',
    time: '5 minutes ago'
  },
  {
    id: '2',
    name: 'Door Lock',
    description: 'Auto-lock doors at night',
    status: 'success',
    time: '1 hour ago'
  },
  {
    id: '3',
    name: 'Garden Watering',
    description: 'Water plants based on soil moisture',
    status: 'error',
    time: '2 hours ago'
  }
])

const totalAutomations = computed(() => automationLogs.value.length)

const successfulRuns = computed(() => 
  automationLogs.value.filter(log => log.status === 'success').length
)

const failedRuns = computed(() => 
  automationLogs.value.filter(log => log.status === 'error').length
)

const runningAutomations = computed(() => 
  automationLogs.value.filter(log => log.status === 'running').length
)

const totalTriggers = computed(() => 
  new Set(automationLogs.value.map(log => log.trigger)).size
)

const filteredLogs = computed(() => {
  if (selectedFilter.value === 'all') {
    return automationLogs.value
  }
  return automationLogs.value.filter(log => log.status === selectedFilter.value)
})

const viewLog = (logId: string) => {
  console.log('Viewing log:', logId)
}

const retryAutomation = (logId: string) => {
  const log = automationLogs.value.find(l => l.id === logId)
  if (log) {
    log.status = 'running'
    log.time = 'Just now'
    log.duration = 'Running...'
    delete log.error
  }
}

const refreshLogs = () => {
  console.log('Refreshing automation logs...')
}
</script>
