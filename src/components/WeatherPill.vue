<template>
  <div v-if="!weather" class="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-muted/30 border border-border/50 rounded-lg">
    <div class="w-3 h-3 sm:w-4 sm:h-4 bg-muted animate-pulse rounded" />
    <span class="text-xs sm:text-sm text-muted-foreground">Loading...</span>
  </div>

  <div v-else class="inline-flex items-center gap-1 px-2 py-1.5 sm:gap-2 sm:px-3 sm:py-2 bg-muted/30 border border-border/50 rounded-lg hover:bg-muted/40 transition-colors cursor-pointer">
    <component :is="getWeatherIcon(weather.icon)" />
    <span class="text-xs sm:text-sm font-medium text-foreground">{{ weather.temperature }}°C</span>
    
    <!-- Additional info - hidden on mobile -->
    <div class="hidden sm:flex items-center gap-1">
      <Thermometer class="w-3 h-3 text-muted-foreground" />
      <Droplets class="w-3 h-3 text-muted-foreground" />
      <span class="text-xs text-muted-foreground">{{ weather.humidity }}%</span>
    </div>
    <div class="hidden sm:flex items-center gap-1">
      <Wind class="w-3 h-3 text-muted-foreground" />
      <span class="text-xs text-muted-foreground">{{ weather.windSpeed }} km/h</span>
    </div>
    <span class="text-xs text-muted-foreground ml-1 hidden sm:inline">{{ weather.location }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Sun, Cloud, CloudRain, CloudSnow, Wind, Droplets, Thermometer } from 'lucide-vue-next'

interface WeatherData {
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  location: string
  icon: string
}

const weather = ref<WeatherData | null>(null)

const getWeatherIcon = (icon: string) => {
  switch (icon) {
    case 'sunny': return Sun
    case 'cloudy': return Cloud
    case 'partly-cloudy': return Cloud
    case 'rainy': return CloudRain
    case 'snowy': return CloudSnow
    default: return Sun
  }
}

onMounted(() => {
  // Mock weather data
  const mockWeather: WeatherData = {
    temperature: 22,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12,
    location: 'Amsterdam',
    icon: 'partly-cloudy'
  }

  setTimeout(() => {
    weather.value = mockWeather
  }, 1000)
})
</script>
