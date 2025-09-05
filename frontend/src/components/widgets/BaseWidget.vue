<!-- Base widget component with common functionality -->
<template>
  <Card class="relative">
    <CardHeader>
      <div class="flex items-center justify-between">
        <CardTitle class="flex items-center gap-2">
          <component :is="icon" class="w-5 h-5" />
          {{ title }}
        </CardTitle>
        <div class="flex items-center gap-2">
          <Button
            v-if="refreshable"
            variant="ghost"
            size="sm"
            @click="handleRefresh"
            :disabled="loading"
            title="Refresh"
          >
            <RefreshCw :class="{ 'animate-spin': loading }" class="w-4 h-4" />
          </Button>
          <Button
            v-if="expandable"
            variant="ghost"
            size="sm"
            @click="toggleExpanded"
            title="Toggle details"
          >
            <ChevronDown :class="{ 'rotate-180': expanded }" class="w-4 h-4 transition-transform" />
          </Button>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div
        v-if="error"
        class="text-red-500 text-sm mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
      >
        {{ error }}
      </div>
      <Skeleton v-if="loading" class="h-32" />
      <div v-else-if="!expanded && collapsible" class="space-y-2">
        <slot name="summary" />
      </div>
      <div v-else class="space-y-4">
        <slot />
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RefreshCw, ChevronDown } from 'lucide-vue-next'
import Card from '@/components/ui/card.vue'
import CardHeader from '@/components/ui/card.vue'
import CardTitle from '@/components/ui/card.vue'
import CardContent from '@/components/ui/card.vue'
import Button from '@/components/ui/button.vue'
import Skeleton from '@/components/ui/skeleton.vue'
import type { BaseWidgetProps } from '@/types'

interface Props extends BaseWidgetProps {
  expandable?: boolean
  collapsible?: boolean
  defaultExpanded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  refreshable: false,
  expandable: false,
  collapsible: false,
  defaultExpanded: true,
  error: null
})

const emit = defineEmits<{
  refresh: []
  toggle: [expanded: boolean]
}>()

const expanded = ref(props.defaultExpanded)

const handleRefresh = () => {
  emit('refresh')
}

const toggleExpanded = () => {
  expanded.value = !expanded.value
  emit('toggle', expanded.value)
}
</script>
