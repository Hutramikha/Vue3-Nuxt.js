/**
 * useMovieSearch Composable
 * Quản lý logic tìm kiếm phim
 * Phù hợp với Chương 5.3: Custom Composables
 */

import { computed } from 'vue'
import { useRoute } from 'vue-router'

export function useMovieSearch(allMovies: any) {
  const route = useRoute()

  // ========== GETTERS (COMPUTED) ==========
  // Lấy từ khóa tìm kiếm từ route query
  const searchQuery = computed(() => {
    return (route.query.search as string) || ''
  })

  // Phim tìm được
  const searchedMovies = computed(() => {
    if (!allMovies.value || !searchQuery.value.trim()) return []

    const query = searchQuery.value.toLowerCase().trim()
    return allMovies.value.filter((movie: any) => {
      return (
        movie.title.toLowerCase().includes(query) ||
        movie.genre.toLowerCase().includes(query)
      )
    })
  })

  // Phim tìm được hiển thị trên trang hiện tại (16 phim/trang)
  const searchCurrentPage = computed(() => {
    return parseInt((route.query.searchPage as string) || '1')
  })

  const searchedMoviesPaginated = computed(() => {
    const moviesPerSearchPage = 16
    const start = (searchCurrentPage.value - 1) * moviesPerSearchPage
    return searchedMovies.value.slice(start, start + moviesPerSearchPage)
  })

  // Tổng số trang khi tìm kiếm
  const totalSearchPages = computed(() => {
    if (searchedMovies.value.length === 0) return 1
    return Math.ceil(searchedMovies.value.length / 16)
  })

  // Kiểm tra xem đang ở chế độ search hay không
  const isSearchMode = computed(() => {
    return searchQuery.value.trim().length > 0
  })

  return {
    // Getters
    searchQuery,
    searchedMovies,
    searchCurrentPage,
    searchedMoviesPaginated,
    totalSearchPages,
    isSearchMode
  }
}
