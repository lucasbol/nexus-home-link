<template>
  <Card class="p-6">
    <div v-if="loading" class="space-y-6">
      <!-- Header Skeleton -->
      <div class="flex items-center justify-between">
        <Skeleton class="h-6 w-48" />
        <Skeleton class="h-8 w-24" />
      </div>

      <!-- Stats Grid Skeleton -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="space-y-2">
          <Skeleton class="h-4 w-20" />
          <Skeleton class="h-8 w-16" />
          <Skeleton class="h-2 w-full" />
        </div>
      </div>

      <!-- Movies Section Skeleton -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <Skeleton class="h-5 w-40" />
          <div class="flex gap-1">
            <Skeleton class="h-4 w-4" />
            <Skeleton class="h-4 w-4" />
          </div>
        </div>
        <div class="flex gap-3 overflow-hidden">
          <div v-for="i in 6" :key="i" class="flex-shrink-0 w-32 space-y-2">
            <Skeleton class="h-48 w-32 rounded-lg" />
            <div class="space-y-1">
              <Skeleton class="h-4 w-full" />
              <Skeleton class="h-3 w-3/4" />
            </div>
          </div>
        </div>
      </div>

      <!-- TV Shows Section Skeleton -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <Skeleton class="h-5 w-40" />
          <div class="flex gap-1">
            <Skeleton class="h-4 w-4" />
            <Skeleton class="h-4 w-4" />
          </div>
        </div>
        <div class="flex gap-3 overflow-hidden">
          <div v-for="i in 6" :key="i" class="flex-shrink-0 w-32 space-y-2">
            <Skeleton class="h-48 w-32 rounded-lg" />
            <div class="space-y-1">
              <Skeleton class="h-4 w-full" />
              <Skeleton class="h-3 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="error" class="flex items-center justify-center h-64">
      <div class="text-center">
        <AlertCircle class="w-8 h-8 mx-auto mb-4 text-red-500" />
        <p class="text-red-500 mb-2">Failed to load media data</p>
        <p class="text-sm text-muted-foreground">{{ error }}</p>
        <p class="text-xs text-muted-foreground mt-2">
          Note: You need to add your TMDB API key to src/services/tmdb.ts
        </p>
      </div>
    </div>

    <div v-else class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-foreground">Media & Storage</h3>
          <p class="text-sm text-muted-foreground">Your personal media library</p>
        </div>
        <Badge variant="outline" class="flex items-center gap-1">
          <TrendingUp class="w-3 h-3" />
          Live Data
        </Badge>
      </div>

      <!-- Overall Stats -->
      <div class="grid grid-cols-3 gap-4">
        <div class="text-center p-4 bg-muted/50 rounded-lg">
          <div class="text-2xl font-bold text-foreground">
            {{ stats.totalMovies.toLocaleString() }}
          </div>
          <div class="text-sm text-muted-foreground">Movies</div>
        </div>
        <div class="text-center p-4 bg-muted/50 rounded-lg">
          <div class="text-2xl font-bold text-foreground">
            {{ stats.totalShows.toLocaleString() }}
          </div>
          <div class="text-sm text-muted-foreground">TV Shows</div>
        </div>
        <div class="text-center p-4 bg-muted/50 rounded-lg">
          <div class="text-2xl font-bold text-foreground">
            {{ stats.totalPhotos.toLocaleString() }}
          </div>
          <div class="text-sm text-muted-foreground">Photos</div>
        </div>
      </div>

      <!-- Library Details -->
      <div class="space-y-3">
        <h4 class="text-sm font-medium text-foreground">Library Status</h4>
        <div class="space-y-2">
          <div
            v-for="library in libraries"
            :key="library.id"
            class="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
          >
            <div class="flex items-center gap-3">
              <component :is="getLibraryIcon(library.type)" class="w-5 h-5" />
              <div>
                <div class="font-medium text-foreground">{{ library.name }}</div>
                <div class="text-sm text-muted-foreground">
                  {{ library.totalItems.toLocaleString() }} items •
                  {{ formatBytes(library.totalSize) }}
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <Badge variant="outline" :class="getStatusColor(library.status)">
                {{ library.status }}
              </Badge>
              <div class="text-right">
                <div class="text-sm font-medium text-foreground">{{ library.quality }}</div>
                <div class="text-xs text-muted-foreground">
                  {{ library.watchedPercentage }}% watched
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recently Added Movies -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <h4 class="text-sm font-medium text-foreground flex items-center gap-2">
            <Film class="w-4 h-4 text-red-500" />
            Recently Added Movies (TMDB)
          </h4>
          <div class="flex gap-1">
            <button
              @click="scrollMovies('left')"
              :disabled="movieScrollPosition === 0"
              class="p-1 rounded-full bg-muted hover:bg-muted/80 transition-colors disabled:opacity-50"
            >
              <ChevronLeft class="w-4 h-4" />
            </button>
            <button
              @click="scrollMovies('right')"
              class="p-1 rounded-full bg-muted hover:bg-muted/80 transition-colors"
            >
              <ChevronRight class="w-4 h-4" />
            </button>
          </div>
        </div>
        <div
          ref="moviesCarousel"
          class="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
          style="scrollbar-width: none; -ms-overflow-style: none"
        >
          <a
            v-for="item in recentItems.filter(item => item.type === 'movie').slice(0, 20)"
            :key="item.id"
            :href="getTMDBUrl(item, 'movie')"
            target="_blank"
            rel="noopener noreferrer"
            class="group relative overflow-hidden rounded-lg border border-border/30 hover:border-border/50 transition-all duration-200 hover:shadow-md flex-shrink-0 w-32 block cursor-pointer"
          >
            <div
              class="aspect-[2/3] bg-gradient-to-br from-red-500/10 to-orange-500/10 flex items-center justify-center overflow-hidden relative"
            >
              <img
                :src="
                  item.poster || 'https://via.placeholder.com/300x450/ef4444/ffffff?text=No+Poster'
                "
                :alt="item.title"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
              <div
                class="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Play class="w-6 h-6 text-white" />
              </div>
            </div>
            <div class="p-2 bg-muted/95 backdrop-blur-sm">
              <h5 class="text-xs font-medium text-foreground truncate">{{ item.title }}</h5>
              <p class="text-xs text-muted-foreground">{{ item.year }}</p>
              <div v-if="item.rating" class="flex items-center gap-1 mt-1">
                <Star class="w-3 h-3 text-yellow-500 fill-current" />
                <span class="text-xs text-muted-foreground">{{ item.rating.toFixed(1) }}</span>
              </div>
            </div>
          </a>
        </div>
      </div>

      <!-- Recently Added TV Shows -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <h4 class="text-sm font-medium text-foreground flex items-center gap-2">
            <Tv class="w-4 h-4 text-blue-500" />
            Recently Added TV Shows (TMDB)
          </h4>
          <div class="flex gap-1">
            <button
              @click="scrollTV('left')"
              :disabled="tvScrollPosition === 0"
              class="p-1 rounded-full bg-muted hover:bg-muted/80 transition-colors disabled:opacity-50"
            >
              <ChevronLeft class="w-4 h-4" />
            </button>
            <button
              @click="scrollTV('right')"
              class="p-1 rounded-full bg-muted hover:bg-muted/80 transition-colors"
            >
              <ChevronRight class="w-4 h-4" />
            </button>
          </div>
        </div>
        <div
          ref="tvCarousel"
          class="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
          style="scrollbar-width: none; -ms-overflow-style: none"
        >
          <a
            v-for="item in recentItems.filter(item => item.type === 'tv').slice(0, 20)"
            :key="item.id"
            :href="getTMDBUrl(item, 'tv')"
            target="_blank"
            rel="noopener noreferrer"
            class="group relative overflow-hidden rounded-lg border border-border/30 hover:border-border/50 transition-all duration-200 hover:shadow-md flex-shrink-0 w-32 block cursor-pointer"
          >
            <div
              class="aspect-[2/3] bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center overflow-hidden relative"
            >
              <img
                :src="
                  item.poster || 'https://via.placeholder.com/300x450/3b82f6/ffffff?text=No+Poster'
                "
                :alt="item.title"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
              <div
                class="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Play class="w-6 h-6 text-white" />
              </div>
            </div>
            <div class="p-2 bg-muted/95 backdrop-blur-sm">
              <h5 class="text-xs font-medium text-foreground truncate">{{ item.title }}</h5>
              <p class="text-xs text-muted-foreground">S{{ item.season }}E{{ item.episode }}</p>
              <div v-if="item.rating" class="flex items-center gap-1 mt-1">
                <Star class="w-3 h-3 text-yellow-500 fill-current" />
                <span class="text-xs text-muted-foreground">{{ item.rating.toFixed(1) }}</span>
              </div>
            </div>
          </a>
        </div>
      </div>

      <!-- Recently Added Photos -->
      <div class="space-y-3">
        <h4 class="text-sm font-medium text-foreground flex items-center gap-2">
          <Image class="w-4 h-4 text-green-500" />
          Recently Added Photos
        </h4>
        <div class="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          <div
            v-for="item in recentItems.filter(item => item.type === 'photo').slice(0, 10)"
            :key="item.id"
            class="group relative overflow-hidden rounded-lg border border-border/30 hover:border-border/50 transition-all duration-200 hover:shadow-md"
          >
            <div
              class="aspect-square bg-gradient-to-br from-green-500/10 to-emerald-500/10 flex items-center justify-center overflow-hidden relative"
            >
              <img
                :src="
                  item.thumbnail ||
                  'https://via.placeholder.com/300x300/10b981/ffffff?text=No+Photo'
                "
                :alt="item.title"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
              <div
                class="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Image class="w-6 h-6 text-white" />
              </div>
            </div>
            <div class="absolute bottom-0 left-0 right-0 p-2 bg-muted/95 backdrop-blur-sm">
              <h5 class="text-xs font-medium text-foreground truncate">{{ item.title }}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Film,
  Tv,
  Image,
  Play,
  Download,
  Clock,
  HardDrive,
  Users,
  Star,
  TrendingUp,
  Calendar,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-vue-next'
import Card from './ui/card.vue'
import Badge from './ui/badge.vue'
import Skeleton from './ui/skeleton.vue'
import { useTMDB, type RecentItem } from '@/composables/useTMDB'

interface MediaLibrary {
  id: string
  name: string
  type: 'movies' | 'tv' | 'photos'
  totalItems: number
  totalSize: number
  lastAdded: string
  quality: '4K' | '1080p' | '720p' | '480p'
  status: 'online' | 'offline' | 'syncing'
  watchedPercentage: number
  rating: number
}

interface MediaStats {
  totalMovies: number
  totalShows: number
  totalEpisodes: number
  totalPhotos: number
  totalSize: number
  watchedMovies: number
  watchedShows: number
  averageRating: number
}

const { recentItems, loading, error } = useTMDB()

const libraries = ref<MediaLibrary[]>([])
const stats = ref<MediaStats>({
  totalMovies: 0,
  totalShows: 0,
  totalEpisodes: 0,
  totalPhotos: 0,
  totalSize: 0,
  watchedMovies: 0,
  watchedShows: 0,
  averageRating: 0
})

const movieScrollPosition = ref(0)
const tvScrollPosition = ref(0)
const moviesCarousel = ref<HTMLElement>()
const tvCarousel = ref<HTMLElement>()

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getLibraryIcon = (type: string) => {
  switch (type) {
    case 'movies':
      return Film
    case 'tv':
      return Tv
    case 'photos':
      return Image
    default:
      return HardDrive
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online':
      return 'text-green-500'
    case 'offline':
      return 'text-red-500'
    case 'syncing':
      return 'text-yellow-500'
    default:
      return 'text-gray-500'
  }
}

const getTMDBUrl = (item: RecentItem, type: 'movie' | 'tv') => {
  const tmdbId = item.traktId?.replace('tmdb-', '') || item.id.replace(`tmdb-${type}-`, '')
  return `https://www.themoviedb.org/${type}/${tmdbId}`
}

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.src = 'https://via.placeholder.com/300x450/ef4444/ffffff?text=Error+Loading'
}

// Carousel scroll functions
const scrollMovies = (direction: 'left' | 'right') => {
  if (!moviesCarousel.value) return

  const scrollAmount = 200
  const newPosition =
    direction === 'left'
      ? Math.max(0, movieScrollPosition.value - scrollAmount)
      : movieScrollPosition.value + scrollAmount

  moviesCarousel.value.scrollTo({ left: newPosition, behavior: 'smooth' })
  movieScrollPosition.value = newPosition
}

const scrollTV = (direction: 'left' | 'right') => {
  if (!tvCarousel.value) return

  const scrollAmount = 200
  const newPosition =
    direction === 'left'
      ? Math.max(0, tvScrollPosition.value - scrollAmount)
      : tvScrollPosition.value + scrollAmount

  tvCarousel.value.scrollTo({ left: newPosition, behavior: 'smooth' })
  tvScrollPosition.value = newPosition
}

onMounted(() => {
  // Mock data for libraries
  const mockLibraries: MediaLibrary[] = [
    {
      id: 'movies-1',
      name: 'Movies Library',
      type: 'movies',
      totalItems: 1247,
      totalSize: 2147483648000, // 2TB
      lastAdded: '2024-01-15 14:30:00',
      quality: '4K',
      status: 'online',
      watchedPercentage: 68,
      rating: 4.2
    },
    {
      id: 'tv-1',
      name: 'TV Shows Library',
      type: 'tv',
      totalItems: 156,
      totalSize: 1073741824000, // 1TB
      lastAdded: '2024-01-15 12:15:00',
      quality: '1080p',
      status: 'online',
      watchedPercentage: 45,
      rating: 4.1
    },
    {
      id: 'photos-1',
      name: 'Photos Library',
      type: 'photos',
      totalItems: 45678,
      totalSize: 268435456000, // 250GB
      lastAdded: '2024-01-15 16:20:00',
      quality: '4K',
      status: 'syncing',
      watchedPercentage: 100,
      rating: 4.8
    }
  ]

  setTimeout(() => {
    libraries.value = mockLibraries

    // Calculate stats from libraries
    const totalMovies = mockLibraries.find(lib => lib.type === 'movies')?.totalItems || 0
    const totalShows = mockLibraries.find(lib => lib.type === 'tv')?.totalItems || 0
    const totalPhotos = mockLibraries.find(lib => lib.type === 'photos')?.totalItems || 0
    const totalSize = mockLibraries.reduce((sum, lib) => sum + lib.totalSize, 0)
    const watchedMovies = Math.floor(totalMovies * 0.68)
    const watchedShows = Math.floor(totalShows * 0.45)
    const averageRating =
      mockLibraries.reduce((sum, lib) => sum + lib.rating, 0) / mockLibraries.length

    stats.value = {
      totalMovies,
      totalShows,
      totalEpisodes: totalShows * 8, // Estimate 8 episodes per show
      totalPhotos,
      totalSize,
      watchedMovies,
      watchedShows,
      averageRating
    }
  }, 1000)
})
</script>
