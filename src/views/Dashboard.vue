<template>
  <div
    class="min-h-screen bg-cover bg-center bg-no-repeat relative"
    :style="{ backgroundImage: `url(${backgroundImage})` }"
  >
    <!-- Background Overlay -->
    <div class="absolute inset-0 bg-background/80 backdrop-blur-sm" />

    <!-- Main Content -->
    <div class="relative z-10 flex min-h-screen">
      <!-- Navigation Sidebar -->
      <DashboardNavigation
        :active-tab="activeTab"
        @tab-change="setActiveTab"
        :is-mobile-menu-open="isMobileMenuOpen"
        @mobile-menu-toggle="toggleMobileMenu"
      />

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <main class="flex-1 overflow-auto">
          <DashboardContent
            :active-tab="activeTab"
            @refresh="handleRefresh"
            @open-settings="setActiveTab('settings')"
          />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBackgroundImage } from '@/composables/useBackgroundImage'
import DashboardNavigation from '@/components/DashboardNavigation.vue'
import DashboardContent from '@/components/DashboardContent.vue'

const activeTab = ref('monitoring')
const isMobileMenuOpen = ref(false)
const { backgroundImage, fetchBackgroundImage } = useBackgroundImage()

const setActiveTab = (tab: string) => {
  activeTab.value = tab
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const handleRefresh = () => {
  fetchBackgroundImage()
  // Add any other refresh logic here
}

// Close mobile menu on escape key
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      isMobileMenuOpen.value = false
    }
  }

  document.addEventListener('keydown', handleEscape)
  fetchBackgroundImage()
})
</script>
