<template>
  <div :class="cn('relative flex w-full touch-none select-none items-center', $attrs.class)">
    <div
      ref="trackRef"
      :class="
        cn(
          'relative h-2 w-full grow overflow-hidden rounded-full bg-secondary',
          disabled && 'cursor-not-allowed opacity-50'
        )
      "
      @mousedown="handleMouseDown"
      @touchstart="handleTouchStart"
    >
      <div
        :class="cn('absolute h-full bg-primary', disabled && 'cursor-not-allowed')"
        :style="{ width: `${percentage}%` }"
      />
    </div>
    <div
      v-for="(value, index) in modelValue"
      :key="index"
      :class="
        cn(
          'absolute h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          disabled && 'cursor-not-allowed'
        )
      "
      :style="{ left: `${getThumbPosition(value)}%` }"
      @mousedown="e => handleThumbMouseDown(e, index)"
      @touchstart="e => handleThumbTouchStart(e, index)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    modelValue: number[]
    min?: number
    max?: number
    step?: number
    disabled?: boolean
  }>(),
  {
    min: 0,
    max: 100,
    step: 1,
    disabled: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number[]): void
}>()

defineOptions({
  inheritAttrs: false
})

const trackRef = ref<HTMLElement>()
const isDragging = ref(false)
const activeThumb = ref(0)

const percentage = computed(() => {
  const value = props.modelValue[0] || 0
  return ((value - props.min) / (props.max - props.min)) * 100
})

const getThumbPosition = (value: number) => {
  return ((value - props.min) / (props.max - props.min)) * 100
}

const getValueFromPosition = (clientX: number) => {
  if (!trackRef.value) return props.min

  const rect = trackRef.value.getBoundingClientRect()
  const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
  const value = props.min + percentage * (props.max - props.min)

  // Round to step
  const steps = Math.round((value - props.min) / props.step)
  return Math.max(props.min, Math.min(props.max, props.min + steps * props.step))
}

const updateValue = (newValue: number, index: number = 0) => {
  const clampedValue = Math.max(props.min, Math.min(props.max, newValue))
  const newValues = [...props.modelValue]
  newValues[index] = clampedValue
  emit('update:modelValue', newValues)
}

const handleMouseDown = (e: MouseEvent) => {
  if (props.disabled) return

  e.preventDefault()
  const newValue = getValueFromPosition(e.clientX)
  updateValue(newValue, 0)
}

const handleTouchStart = (e: TouchEvent) => {
  if (props.disabled) return

  e.preventDefault()
  const newValue = getValueFromPosition(e.touches[0].clientX)
  updateValue(newValue, 0)
}

const handleThumbMouseDown = (e: MouseEvent, index: number) => {
  if (props.disabled) return

  e.preventDefault()
  e.stopPropagation()
  isDragging.value = true
  activeThumb.value = index

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.value) return
    const newValue = getValueFromPosition(e.clientX)
    updateValue(newValue, activeThumb.value)
  }

  const handleMouseUp = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

const handleThumbTouchStart = (e: TouchEvent, index: number) => {
  if (props.disabled) return

  e.preventDefault()
  e.stopPropagation()
  isDragging.value = true
  activeThumb.value = index

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging.value) return
    const newValue = getValueFromPosition(e.touches[0].clientX)
    updateValue(newValue, activeThumb.value)
  }

  const handleTouchEnd = () => {
    isDragging.value = false
    document.removeEventListener('touchmove', handleTouchMove)
    document.removeEventListener('touchend', handleTouchEnd)
  }

  document.addEventListener('touchmove', handleTouchMove)
  document.addEventListener('touchend', handleTouchEnd)
}

onMounted(() => {
  // Initialize with default value if empty
  if (props.modelValue.length === 0) {
    emit('update:modelValue', [props.min])
  }
})
</script>
