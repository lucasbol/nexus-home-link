# TMDB API Setup for Media & Storage Widget

This dashboard now uses **The Movie Database (TMDB) API** to fetch real movie and TV show data, just like Overseerr does!

## 🚀 Quick Setup

### 1. Get Your TMDB API Key
1. Go to [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
2. Create a free account if you don't have one
3. Request an API key (it's free!)
4. Copy your API key

### 2. Add Your API Key
1. Open `src/services/tmdb.ts`
2. Replace `your_tmdb_api_key_here` with your actual API key:
   ```typescript
   const TMDB_API_KEY = 'your_actual_api_key_here';
   ```

### 3. That's It! 🎉
The widget will now fetch:
- **Popular Movies** from TMDB
- **Popular TV Shows** from TMDB  
- **Real Movie Posters** (no more CORS issues!)
- **Real TV Show Posters**
- **Ratings and Metadata**

## 🔧 What You Get

### Real Data Features:
- ✅ **Live Popular Movies** - Currently trending films
- ✅ **Live Popular TV Shows** - Currently trending series
- ✅ **Real Movie Posters** - High-quality official posters
- ✅ **Real TV Show Posters** - High-quality official artwork
- ✅ **TMDB Ratings** - Community ratings for each title
- ✅ **Release Years** - Accurate release dates
- ✅ **No CORS Issues** - TMDB allows cross-origin requests

### Fallback Handling:
- If API fails, shows helpful error message
- If images fail to load, shows placeholder
- Graceful loading states with spinners

## 🎬 API Endpoints Used

The widget uses these TMDB endpoints:
- `/movie/popular` - Popular movies
- `/tv/popular` - Popular TV shows  
- `/trending/movie/week` - Trending movies
- `/trending/tv/week` - Trending TV shows

## 🔒 Privacy & Security

- Your API key is only used client-side
- No data is sent to external servers except TMDB
- TMDB is a trusted, community-driven database
- Free tier includes 1000 requests per day (more than enough!)

## 🆚 Comparison with Overseerr

| Feature | Overseerr | This Dashboard |
|---------|-----------|----------------|
| Data Source | TMDB API | TMDB API ✅ |
| Movie Posters | Real TMDB | Real TMDB ✅ |
| TV Show Posters | Real TMDB | Real TMDB ✅ |
| Popular Content | Yes | Yes ✅ |
| Trending Content | Yes | Yes ✅ |
| Ratings | Yes | Yes ✅ |
| Free to Use | Yes | Yes ✅ |

Now your dashboard has the same data quality as Overseerr! 🎬✨
