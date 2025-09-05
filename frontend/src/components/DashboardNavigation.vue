<template>
  <div>
    <!-- Mobile Menu Button -->
    <div class="md:hidden fixed top-4 right-4 z-50">
      <Button
        variant="outline"
        size="sm"
        @click="$emit('mobile-menu-toggle')"
        class="bg-background/95 backdrop-blur-sm border-border/50"
      >
        <X v-if="isMobileMenuOpen" class="w-4 h-4" />
        <Menu v-else class="w-4 h-4" />
      </Button>
    </div>

    <!-- Mobile Overlay -->
    <div
      v-if="isMobileMenuOpen"
      class="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
      @click="$emit('mobile-menu-toggle')"
    />

    <!-- Navigation Sidebar -->
    <div
      :class="[
        'fixed left-0 top-0 h-screen w-80 bg-background/95 backdrop-blur-sm border-r border-border/50 z-50',
        'transform transition-transform duration-300 ease-in-out',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
        'md:sticky md:top-0 md:h-screen md:transform-none md:w-80 md:bg-background/95 md:border-r md:border-border/50'
      ]"
    >
      <div class="h-full flex flex-col p-6 lg:p-6">
        <!-- Header - Always visible -->
        <div class="mb-8">
          <div class="flex items-center gap-2 mb-2">
            <img
              src="/logo_full.svg"
              alt="BOLCAT HOMELAB"
              class="h-16 object-contain object-left flex-shrink-0"
            />
            <h1 class="text-xl font-bold text-foreground whitespace-nowrap leading-tight -mt-1">
              HOMELAB
            </h1>
          </div>
          <p class="text-sm text-muted-foreground">Dashboard Navigation</p>
        </div>

        <!-- Navigation Tabs - Expand to fill available space -->
        <div class="flex-1 space-y-2">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="handleTabClick(tab.id)"
            :class="[
              'w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 min-h-[60px]',
              activeTab === tab.id
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
            ]"
          >
            <component
              :is="tab.icon"
              :class="['w-5 h-5', activeTab === tab.id ? 'text-primary' : '']"
            />
            <div class="flex-1 min-w-0">
              <div class="font-medium truncate">{{ tab.label }}</div>
              <div class="text-xs opacity-75 truncate">{{ tab.description }}</div>
            </div>
            <Badge v-if="activeTab === tab.id" variant="secondary" class="text-xs">Active</Badge>
          </button>
        </div>

        <!-- Footer - Stick to bottom -->
        <div class="mt-8 pt-6 border-t border-border/50">
          <div class="text-xs text-muted-foreground text-center">BOLCAT HOMELAB Dashboard</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Home, Monitor, Smartphone, Server, Shield, Film, Menu, X } from 'lucide-vue-next'
import Button from './ui/button.vue'
import Badge from './ui/badge.vue'

interface Tab {
  id: string
  label: string
  icon: any
  description: string
}

const tabs: Tab[] = [
  {
    id: 'monitoring',
    label: 'Monitoring',
    icon: Monitor,
    description: 'System graphs & metrics'
  },
  {
    id: 'smart-home',
    label: 'Smart Home',
    icon: Smartphone,
    description: 'Home automation & devices'
  },
  {
    id: 'media',
    label: 'Media & Storage',
    icon: Film,
    description: 'Movies, TV shows & photos'
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    icon: Server,
    description: 'Docker, network & backups'
  },
  {
    id: 'security',
    label: 'Security',
    icon: Shield,
    description: 'Alerts & system security'
  }
]

const handleTabClick = (tabId: string) => {
  emit('tab-change', tabId)
  emit('mobile-menu-toggle') // Close mobile menu on selection
}

defineProps<{
  activeTab: string
  isMobileMenuOpen: boolean
}>()

const emit = defineEmits<{
  'tab-change': [tab: string]
  'mobile-menu-toggle': []
}>()
</script>
