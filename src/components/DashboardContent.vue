<template>
  <div>
    <!-- Sticky Header -->
    <div class="sticky top-0 z-40 py-3 px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex flex-col gap-3 mb-2">
        <!-- Mobile Layout -->
        <div class="md:hidden space-y-3">
          <!-- Mobile Top Row - Controls -->
          <div class="flex items-center justify-between pr-16">
            <div class="flex items-center gap-2">
              <WeatherPill />
            </div>
            <div class="flex items-center gap-1">
              <!-- Theme Dropdown -->
              <ThemeDropdown />
              
              <button
                @click="$emit('open-settings')"
                class="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                title="Settings"
              >
                <Settings class="w-4 h-4" />
              </button>
              <button
                @click="$emit('refresh')"
                class="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                title="Refresh Dashboard"
              >
                <RefreshCw class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <!-- Mobile Network Pills -->
          <div class="flex flex-wrap gap-1.5">
            <NetworkStatus />
          </div>
        </div>

        <!-- Desktop Layout -->
        <div class="hidden md:block space-y-3">
          <!-- Desktop Top Row - Network Pills and Controls -->
          <div class="flex items-center justify-between gap-3">
            <!-- Network Pills -->
            <div class="flex flex-wrap gap-1.5 sm:gap-2 min-w-0">
              <NetworkStatus />
            </div>
            
            <!-- Right Controls - Positioned at top right -->
            <div class="flex items-center gap-1 flex-shrink-0">
              <!-- Theme Dropdown -->
              <ThemeDropdown />
              
              <!-- Settings Button -->
              <button
                @click="$emit('open-settings')"
                class="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                title="Settings"
              >
                <Settings class="w-4 h-4" />
              </button>
              
              <button
                @click="$emit('refresh')"
                class="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                title="Refresh Dashboard"
              >
                <RefreshCw class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <!-- Desktop Bottom Row - Weather Pill -->
          <div class="flex items-center justify-start gap-3">
            <div class="flex-shrink-0">
              <WeatherPill />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div class="px-6 lg:px-8 pt-2 pb-6 lg:pb-8">
      <div :class="[
        'transition-all duration-300 ease-in-out',
        isTransitioning ? 'opacity-50' : 'opacity-100'
      ]">
        <!-- Monitoring Tab Content -->
        <div v-if="activeTab === 'monitoring'" class="min-h-[600px]">
          <h2 class="text-2xl font-semibold text-foreground mb-6">System Monitoring</h2>
          <SystemGraphs />
        </div>

        <!-- Smart Home Tab Content -->
        <div v-else-if="activeTab === 'smart-home'" class="min-h-[600px]">
          <h2 class="text-2xl font-semibold text-foreground mb-6">Smart Home</h2>
          <SmartHomeWidget />
        </div>

        <!-- Media Tab Content -->
        <div v-else-if="activeTab === 'media'" class="min-h-[600px]">
          <h2 class="text-2xl font-semibold text-foreground mb-6">Media & Storage</h2>
          <MediaStatsWidgetTMDB />
        </div>

        <!-- Infrastructure Tab Content -->
        <div v-else-if="activeTab === 'infrastructure'" class="min-h-[600px]">
          <h2 class="text-2xl font-semibold text-foreground mb-6">Infrastructure & Monitoring</h2>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DockerStatsWidget />
            <NetworkTopologyWidget />
          </div>
        </div>

        <!-- Security Tab Content -->
        <div v-else-if="activeTab === 'security'" class="min-h-[600px]">
          <h2 class="text-2xl font-semibold text-foreground mb-6">Security & Backups</h2>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SecurityAlertsWidget />
            <BackupStatusWidget />
          </div>
        </div>

        <!-- Settings Tab Content -->
        <div v-else-if="activeTab === 'settings'" class="min-h-[600px]">
          <h2 class="text-2xl font-semibold text-foreground mb-6">Settings & Configuration</h2>
          <SettingsWidget />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { RefreshCw, Settings } from 'lucide-vue-next'
import NetworkStatus from './NetworkStatus.vue'
import WeatherPill from './WeatherPill.vue'
import ThemeDropdown from './ThemeDropdown.vue'
import SystemGraphs from './SystemGraphs.vue'
import SmartHomeWidget from './SmartHomeWidget.vue'
import MediaStatsWidgetTMDB from './MediaStatsWidgetTMDB.vue'
import DockerStatsWidget from './DockerStatsWidget.vue'
import NetworkTopologyWidget from './NetworkTopologyWidget.vue'
import SecurityAlertsWidget from './SecurityAlertsWidget.vue'
import BackupStatusWidget from './BackupStatusWidget.vue'
import SettingsWidget from './SettingsWidget.vue'

const props = defineProps<{
  activeTab: string
}>()

const isTransitioning = ref(false)

// Handle tab changes with transition
watch(() => props.activeTab, () => {
  isTransitioning.value = true
  setTimeout(() => {
    isTransitioning.value = false
  }, 150)
})

defineEmits<{
  refresh: []
  'open-settings': []
}>()
</script>