import { ref, onMounted } from 'vue'
import { 
  getPopularMovies, 
  getPopularTVShows, 
  getTrendingMovies, 
  getTrendingTVShows,
  getPosterUrl,
  type TMDBMovie, 
  type TMDBTVShow
} from '@/services/tmdb'

export interface RecentItem {
  id: string
  title: string
  type: 'movie' | 'tv' | 'photo'
  addedDate: string
  year?: number
  season?: number
  episode?: number
  poster?: string
  thumbnail?: string
  traktId?: string
  rating?: number
  overview?: string
}

export function useTMDB() {
  const popularMovies = ref<TMDBMovie[]>([])
  const popularTVShows = ref<TMDBTVShow[]>([])
  const trendingMovies = ref<TMDBMovie[]>([])
  const trendingTVShows = ref<TMDBTVShow[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  // Convert TMDB data to RecentItem format
  const convertToRecentItems = (movies: TMDBMovie[], tvShows: TMDBTVShow[]): RecentItem[] => {
    const movieItems: RecentItem[] = movies.slice(0, 10).map((movie, index) => ({
      id: `tmdb-movie-${movie.id}`,
      title: movie.title,
      type: 'movie' as const,
      addedDate: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' '),
      year: new Date(movie.release_date).getFullYear(),
      poster: movie.poster_path ? getPosterUrl(movie.poster_path) : undefined,
      traktId: `tmdb-${movie.id}`,
      rating: movie.vote_average,
      overview: movie.overview
    }))

    const tvItems: RecentItem[] = tvShows.slice(0, 10).map((show, index) => ({
      id: `tmdb-tv-${show.id}`,
      title: show.name,
      type: 'tv' as const,
      addedDate: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' '),
      year: new Date(show.first_air_date).getFullYear(),
      season: Math.floor(Math.random() * 3) + 1, // Mock season data
      episode: Math.floor(Math.random() * 8) + 1, // Mock episode data
      poster: show.poster_path ? getPosterUrl(show.poster_path) : undefined,
      traktId: `tmdb-${show.id}`,
      rating: show.vote_average,
      overview: show.overview
    }))

    // Add some mock photos
    const photoItems: RecentItem[] = Array.from({ length: 10 }, (_, index) => ({
      id: `photo-${index + 1}`,
      title: `Photo ${index + 1}`,
      type: 'photo' as const,
      addedDate: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' '),
      thumbnail: `https://picsum.photos/300/300?random=${index + 1}`
    }))

    return [...movieItems, ...tvItems, ...photoItems]
  }

  const recentItems = ref<RecentItem[]>([])

  onMounted(async () => {
    try {
      loading.value = true
      error.value = null

      // Fetch all data in parallel
      const [movies, tvShows, trendingMoviesData, trendingTVData] = await Promise.all([
        getPopularMovies(1),
        getPopularTVShows(1),
        getTrendingMovies('week'),
        getTrendingTVShows('week')
      ])

      popularMovies.value = movies
      popularTVShows.value = tvShows
      trendingMovies.value = trendingMoviesData
      trendingTVShows.value = trendingTVData

      // Convert to recent items
      recentItems.value = convertToRecentItems(movies, tvShows)
    } catch (err) {
      console.error('Error fetching TMDB data:', err)
      error.value = err instanceof Error ? err.message : 'Failed to fetch data'
    } finally {
      loading.value = false
    }
  })

  return {
    popularMovies,
    popularTVShows,
    trendingMovies,
    trendingTVShows,
    recentItems,
    loading,
    error
  }
}
