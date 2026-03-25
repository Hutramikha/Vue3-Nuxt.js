// ========== MOVIE DETAIL COMPOSABLE ==========
// Fetch dữ liệu phim từ ID, tìm phim trong danh sách

import { computed } from 'vue'
import { useRoute } from 'vue-router'

export const useMovieDetail = (allMovies: any) => {
  const route = useRoute()

  // ========== GET MOVIE ID FROM ROUTE ==========
  const movieId = computed(() => parseInt(route.params.id as string))

  // ========== FETCH MOVIE BY ID ==========
  const movie = computed(() => {
    if (!allMovies.value) return null
    return allMovies.value.find((m: any) => m.id === movieId.value)
  })

  // ========== HANDLE MOVIE NOT FOUND ==========
  const isMovieFound = computed(() => !!movie.value)

  // ========== GET RELATED MOVIES (CÙNG THỂ LOẠI) ==========
  const getRelatedMovies = (limit: number = 5) => {
    if (!movie.value || !allMovies.value) return []
    
    return allMovies.value
      .filter((m: any) => 
        m.id !== movie.value!.id && 
        m.genre.split(', ').some((g: string) => 
          movie.value!.genre.split(', ').includes(g)
        )
      )
      .slice(0, limit)
  }

  // ========== GET NEXT/PREVIOUS MOVIE ==========
  const getNextMovie = () => {
    if (!allMovies.value) return null
    const currentIndex = allMovies.value.findIndex((m: any) => m.id === movieId.value)
    return currentIndex < allMovies.value.length - 1 
      ? allMovies.value[currentIndex + 1] 
      : allMovies.value[0]
  }

  const getPreviousMovie = () => {
    if (!allMovies.value) return null
    const currentIndex = allMovies.value.findIndex((m: any) => m.id === movieId.value)
    return currentIndex > 0 
      ? allMovies.value[currentIndex - 1] 
      : allMovies.value[allMovies.value.length - 1]
  }

  return {
    movieId,
    movie,
    isMovieFound,
    getRelatedMovies,
    getNextMovie,
    getPreviousMovie
  }
}
