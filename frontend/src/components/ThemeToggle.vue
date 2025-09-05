<template>
  <div class="flex items-center bg-muted rounded-lg p-1">
    <button
      v-for="theme in themes"
      :key="theme.value"
      @click="setTheme(theme.value)"
      :class="[
        'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
        savedTheme === theme.value
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:text-foreground'
      ]"
      :title="theme.label"
    >
      <component :is="theme.icon" class="h-4 w-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Sun, Moon, Monitor } from 'lucide-vue-next'
import { useTheme } from '@/composables/useTheme'

const { savedTheme, setTheme } = useTheme()

const themes = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor }
]
</script>
