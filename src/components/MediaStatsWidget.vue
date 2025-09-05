<template>
  <div class="bg-card rounded-lg border border-border p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold">Media Library</h3>
      <div class="flex items-center gap-2">
        <div class="text-sm text-muted-foreground">
          {{ totalItems }} items in library
        </div>
        <button
          @click="refreshLibrary"
          class="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
          title="Refresh Library"
        >
          <RefreshCw class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- Media Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-muted/50 rounded-lg p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-red-600 rounded-lg">
            <Film class="h-5 w-5 text-white" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Movies</p>
            <p class="text-2xl font-bold">{{ mediaStats.movies }}</p>
          </div>
        </div>
      </div>

      <div class="bg-muted/50 rounded-lg p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-blue-600 rounded-lg">
            <Tv class="h-5 w-5 text-white" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">TV Shows</p>
            <p class="text-2xl font-bold">{{ mediaStats.tvShows }}</p>
          </div>
        </div>
      </div>

      <div class="bg-muted/50 rounded-lg p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-green-600 rounded-lg">
            <Music class="h-5 w-5 text-white" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Music</p>
            <p class="text-2xl font-bold">{{ mediaStats.music }}</p>
          </div>
        </div>
      </div>

      <div class="bg-muted/50 rounded-lg p-4">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-purple-600 rounded-lg">
            <Image class="h-5 w-5 text-white" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Photos</p>
            <p class="text-2xl font-bold">{{ mediaStats.photos }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recently Added Tabs -->
    <div class="flex flex-wrap gap-2 mb-6">
      <button
        v-for="tab in mediaTabs"
        :key="tab.id"
        @click="selectedMediaTab = tab.id"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
          selectedMediaTab === tab.id
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
        ]"
      >
        <component :is="tab.icon" class="h-4 w-4 mr-2 inline" />
        {{ tab.name }}
      </button>
    </div>

    <!-- Recently Added Content -->
    <div v-if="selectedMediaTab === 'movies'" class="space-y-4">
      <h4 class="text-sm font-medium">Recently Added Movies</h4>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div 
          v-for="movie in recentMovies"
          :key="movie.id"
          class="group cursor-pointer"
          @click="openMovie(movie.tmdbUrl)"
        >
          <div class="aspect-[2/3] rounded-lg overflow-hidden bg-muted mb-2">
            <img 
              :src="movie.poster" 
              :alt="movie.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div class="text-sm font-medium truncate">{{ movie.title }}</div>
          <div class="text-xs text-muted-foreground">{{ movie.year }}</div>
        </div>
      </div>
    </div>

    <div v-else-if="selectedMediaTab === 'tv'" class="space-y-4">
      <h4 class="text-sm font-medium">Recently Added TV Shows</h4>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div 
          v-for="show in recentTvShows"
          :key="show.id"
          class="group cursor-pointer"
          @click="openTvShow(show.tmdbUrl)"
        >
          <div class="aspect-[2/3] rounded-lg overflow-hidden bg-muted mb-2">
            <img 
              :src="show.poster" 
              :alt="show.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div class="text-sm font-medium truncate">{{ show.title }}</div>
          <div class="text-xs text-muted-foreground">{{ show.year }}</div>
        </div>
      </div>
    </div>

    <div v-else-if="selectedMediaTab === 'photos'" class="space-y-4">
      <h4 class="text-sm font-medium">Recently Added Photos</h4>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div 
          v-for="photo in recentPhotos"
          :key="photo.id"
          class="group cursor-pointer"
        >
          <div class="aspect-square rounded-lg overflow-hidden bg-muted mb-2">
            <img 
              :src="photo.thumbnail" 
              :alt="photo.filename"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div class="text-sm font-medium truncate">{{ photo.filename }}</div>
          <div class="text-xs text-muted-foreground">{{ photo.date }}</div>
        </div>
      </div>
    </div>

    <!-- Service Status -->
    <div class="mt-6 pt-6 border-t border-border">
      <h4 class="text-sm font-medium mb-3">Service Status</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div 
          v-for="service in mediaServices"
          :key="service.id"
          class="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
        >
          <div 
            :class="[
              'w-2 h-2 rounded-full',
              service.status === 'online' ? 'bg-green-500' : 'bg-red-500'
            ]"
          />
          <div class="flex-1">
            <div class="text-sm font-medium">{{ service.name }}</div>
            <div class="text-xs text-muted-foreground">{{ service.status }}</div>
          </div>
          <button
            @click="openService(service.url)"
            class="p-1 rounded hover:bg-muted transition-colors"
            title="Open Service"
          >
            <ExternalLink class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  RefreshCw, 
  Film, 
  Tv, 
  Music, 
  Image, 
  ExternalLink 
} from 'lucide-vue-next'

interface MediaItem {
  id: string
  title: string
  year: string
  poster: string
  tmdbUrl?: string
}

interface Photo {
  id: string
  filename: string
  thumbnail: string
  date: string
}

interface MediaService {
  id: string
  name: string
  status: 'online' | 'offline'
  url: string
}

const selectedMediaTab = ref('movies')

const mediaTabs = [
  { id: 'movies', name: 'Movies', icon: Film },
  { id: 'tv', name: 'TV Shows', icon: Tv },
  { id: 'photos', name: 'Photos', icon: Image }
]

const mediaStats = ref({
  movies: 1247,
  tvShows: 89,
  music: 15420,
  photos: 3847
})

const recentMovies = ref<MediaItem[]>([
  {
    id: '1',
    title: 'Dune: Part Two',
    year: '2024',
    poster: 'https://image.tmdb.org/t/p/w500/8gpu8Qr8Vd6Qb8JgTKh4Uo0rY0L.jpg',
    tmdbUrl: 'https://www.themoviedb.org/movie/693134'
  },
  {
    id: '2',
    title: 'Oppenheimer',
    year: '2023',
    poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    tmdbUrl: 'https://www.themoviedb.org/movie/872585'
  },
  {
    id: '3',
    title: 'Barbie',
    year: '2023',
    poster: 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',
    tmdbUrl: 'https://www.themoviedb.org/movie/346698'
  },
  {
    id: '4',
    title: 'Top Gun: Maverick',
    year: '2022',
    poster: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
    tmdbUrl: 'https://www.themoviedb.org/movie/361743'
  },
  {
    id: '5',
    title: 'Spider-Man: No Way Home',
    year: '2021',
    poster: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
    tmdbUrl: 'https://www.themoviedb.org/movie/634649'
  },
  {
    id: '6',
    title: 'The Batman',
    year: '2022',
    poster: 'https://image.tmdb.org/t/p/w500/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg',
    tmdbUrl: 'https://www.themoviedb.org/movie/414906'
  }
])

const recentTvShows = ref<MediaItem[]>([
  {
    id: '1',
    title: 'House of the Dragon',
    year: '2022',
    poster: 'https://image.tmdb.org/t/p/w500/z2yahl2uefxDCl0nogcRBstwruJ.jpg',
    tmdbUrl: 'https://www.themoviedb.org/tv/94997'
  },
  {
    id: '2',
    title: 'The Last of Us',
    year: '2023',
    poster: 'https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg',
    tmdbUrl: 'https://www.themoviedb.org/tv/100088'
  },
  {
    id: '3',
    title: 'Stranger Things',
    year: '2016',
    poster: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
    tmdbUrl: 'https://www.themoviedb.org/tv/66732'
  },
  {
    id: '4',
    title: 'The Mandalorian',
    year: '2019',
    poster: 'https://image.tmdb.org/t/p/w500/eU1i6eHXlzMOlEq0ku1Rzq7Y4wA.jpg',
    tmdbUrl: 'https://www.themoviedb.org/tv/82856'
  },
  {
    id: '5',
    title: 'Wednesday',
    year: '2022',
    poster: 'https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg',
    tmdbUrl: 'https://www.themoviedb.org/tv/119051'
  },
  {
    id: '6',
    title: 'The Bear',
    year: '2022',
    poster: 'https://image.tmdb.org/t/p/w500/y8VfHqKz7QYz0f0q9W9vHqKz7QYz.jpg',
    tmdbUrl: 'https://www.themoviedb.org/tv/114695'
  }
])

const recentPhotos = ref<Photo[]>([
  {
    id: '1',
    filename: 'vacation_2024_001.jpg',
    thumbnail: 'https://picsum.photos/300/300?random=1',
    date: '2 days ago'
  },
  {
    id: '2',
    filename: 'family_dinner.jpg',
    thumbnail: 'https://picsum.photos/300/300?random=2',
    date: '3 days ago'
  },
  {
    id: '3',
    filename: 'sunset_beach.jpg',
    thumbnail: 'https://picsum.photos/300/300?random=3',
    date: '5 days ago'
  },
  {
    id: '4',
    filename: 'birthday_party.jpg',
    thumbnail: 'https://picsum.photos/300/300?random=4',
    date: '1 week ago'
  },
  {
    id: '5',
    filename: 'hiking_trail.jpg',
    thumbnail: 'https://picsum.photos/300/300?random=5',
    date: '1 week ago'
  },
  {
    id: '6',
    filename: 'city_lights.jpg',
    thumbnail: 'https://picsum.photos/300/300?random=6',
    date: '2 weeks ago'
  }
])

const mediaServices = ref<MediaService[]>([
  { id: 'plex', name: 'Plex', status: 'online', url: 'http://plex.local:32400' },
  { id: 'sonarr', name: 'Sonarr', status: 'online', url: 'http://sonarr.local:8989' },
  { id: 'radarr', name: 'Radarr', status: 'online', url: 'http://radarr.local:7878' },
  { id: 'overseerr', name: 'Overseerr', status: 'offline', url: 'http://overseerr.local:5055' }
])

const totalItems = computed(() => 
  mediaStats.value.movies + mediaStats.value.tvShows + mediaStats.value.music + mediaStats.value.photos
)

const openMovie = (url?: string) => {
  if (url) {
    window.open(url, '_blank')
  }
}

const openTvShow = (url?: string) => {
  if (url) {
    window.open(url, '_blank')
  }
}

const openService = (url: string) => {
  window.open(url, '_blank')
}

const refreshLibrary = () => {
  console.log('Refreshing media library...')
}
</script>
