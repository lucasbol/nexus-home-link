// TMDB API service for fetching movie and TV show data
// Overseerr uses TMDB API for all media data

const TMDB_API_KEY = '20f0c4d004e66b56ac05b65bd146f94d'; // Your actual TMDB API key
const TMDB_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMGYwYzRkMDA0ZTY2YjU2YWMwNWI2NWJkMTQ2Zjk0ZCIsIm5iZiI6MTc1NzAyNDQ3My43NjQ5OTk5LCJzdWIiOiI2OGJhMTBkOTNjMmIxNjJiYTIxZjQxYjkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.iU3sj9R_1Ee2fs3mNR48VEu-eqxaS-HeqQ4kJHS6Dgs'; // Your access token
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
  original_language: string;
  original_title: string;
  genre_ids: number[];
  video: boolean;
}

export interface TMDBTVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
  original_language: string;
  original_name: string;
  origin_country: string[];
  genre_ids: number[];
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// Get popular movies
export async function getPopularMovies(page: number = 1): Promise<TMDBMovie[]> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/popular?page=${page}&language=en-US`,
      {
        headers: {
          'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }
    
    const data: TMDBResponse<TMDBMovie> = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return [];
  }
}

// Get popular TV shows
export async function getPopularTVShows(page: number = 1): Promise<TMDBTVShow[]> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/popular?page=${page}&language=en-US`,
      {
        headers: {
          'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }
    
    const data: TMDBResponse<TMDBTVShow> = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching popular TV shows:', error);
    return [];
  }
}

// Get trending movies
export async function getTrendingMovies(timeWindow: 'day' | 'week' = 'week'): Promise<TMDBMovie[]> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/movie/${timeWindow}?language=en-US`,
      {
        headers: {
          'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }
    
    const data: TMDBResponse<TMDBMovie> = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return [];
  }
}

// Get trending TV shows
export async function getTrendingTVShows(timeWindow: 'day' | 'week' = 'week'): Promise<TMDBTVShow[]> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/tv/${timeWindow}?language=en-US`,
      {
        headers: {
          'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }
    
    const data: TMDBResponse<TMDBTVShow> = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching trending TV shows:', error);
    return [];
  }
}

// Get movie details
export async function getMovieDetails(movieId: number): Promise<TMDBMovie | null> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?language=en-US`,
      {
        headers: {
          'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
}

// Get TV show details
export async function getTVShowDetails(tvId: number): Promise<TMDBTVShow | null> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${tvId}?language=en-US`,
      {
        headers: {
          'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching TV show details:', error);
    return null;
  }
}

// Helper function to get full image URL
export function getImageUrl(path: string, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string {
  if (!path) return '';
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

// Helper function to get poster URL
export function getPosterUrl(path: string, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string {
  return getImageUrl(path, size);
}

// Helper function to get backdrop URL
export function getBackdropUrl(path: string, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'): string {
  return getImageUrl(path, size);
}