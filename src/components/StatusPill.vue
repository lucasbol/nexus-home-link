<template>
  <div :class="[
    'flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium',
    statusClasses[status]
  ]">
    <component :is="icon" class="w-3 h-3 sm:w-3 sm:h-3" />
    <span v-if="!compact" class="text-xs hidden sm:inline">{{ label }}:</span>
    <span class="font-semibold text-xs sm:text-sm">{{ value }}{{ unit }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  icon: any
  label: string
  value: string | number
  unit?: string
  status?: 'normal' | 'warning' | 'critical'
  compact?: boolean
}>(), {
  status: 'normal',
  compact: false
})

const statusClasses = computed(() => ({
  critical: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20',
  warning: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20',
  normal: 'bg-muted/30 text-muted-foreground border border-border/30'
}))
</script>
