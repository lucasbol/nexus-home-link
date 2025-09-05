<template>
  <div class="relative">
    <button
      @click="isOpen = !isOpen"
      class="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
      :title="getCurrentThemeLabel()"
    >
      <component :is="getCurrentThemeIcon()" class="h-4 w-4" />
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="isOpen"
      class="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-50"
    >
      <div class="py-1">
        <button
          v-for="theme in themes"
          :key="theme.value"
          @click="selectTheme(theme.value)"
          :class="[
            'w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-muted transition-colors',
            currentTheme === theme.value ? 'bg-primary/10 text-primary' : 'text-foreground'
          ]"
        >
          <component :is="theme.icon" class="h-4 w-4" />
          <span>{{ theme.label }}</span>
          <Check v-if="currentTheme === theme.value" class="h-4 w-4 ml-auto" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Sun, Moon, Monitor, ChevronDown, Check } from 'lucide-vue-next'

const isOpen = ref(false)
const currentTheme = ref('system')

const themes = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor }
]

const getCurrentThemeIcon = () => {
  switch (currentTheme.value) {
    case 'light':
      return Sun
    case 'dark':
      return Moon
    case 'system':
      return Monitor
    default:
      return Monitor
  }
}

const getCurrentThemeLabel = () => {
  const theme = themes.find(t => t.value === currentTheme.value)
  return theme ? theme.label : 'System'
}

const selectTheme = (theme: string) => {
  currentTheme.value = theme
  isOpen.value = false

  // Apply theme
  const root = document.documentElement
  root.classList.remove('light', 'dark')

  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.classList.add(prefersDark ? 'dark' : 'light')
  } else {
    root.classList.add(theme)
  }

  // Save to localStorage
  localStorage.setItem('theme', theme)
}

const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    isOpen.value = false
  }
}

onMounted(() => {
  // Load saved theme
  const savedTheme = localStorage.getItem('theme') || 'system'
  currentTheme.value = savedTheme

  // Apply saved theme
  selectTheme(savedTheme)

  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handleSystemThemeChange = () => {
    if (currentTheme.value === 'system') {
      selectTheme('system')
    }
  }

  mediaQuery.addEventListener('change', handleSystemThemeChange)

  // Add click outside listener
  document.addEventListener('click', handleClickOutside)

  onUnmounted(() => {
    mediaQuery.removeEventListener('change', handleSystemThemeChange)
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>
