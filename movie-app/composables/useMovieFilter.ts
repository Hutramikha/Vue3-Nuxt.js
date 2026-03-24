/**
 * useMovieFilter Composable
 * Quản lý logic lọc phim theo thể loại và năm
 * Phù hợp với Chương 5.3: Custom Composables
 */

import { ref, computed } from 'vue'

export function useMovieFilter(allMovies: any) {
  // ========== QUẢN LÝ TRẠNG THÁI ==========
  const activeGenreFilter = ref<string | null>(null)
  const activeYearFilter = ref<string | null>(null)
  const filterCurrentPage = ref(1)

  // ========== GETTERS (COMPUTED) ==========
  // Lấy danh sách thể loại từ API
  const allGenres = computed(() => {
    if (!allMovies.value) return []
    const genres = new Set<string>()
    allMovies.value.forEach((movie: any) => {
      if (movie.genre) {
        movie.genre.split(', ').forEach((g: string) => genres.add(g))
      }
    })
    return Array.from(genres).sort()
  })

  // Lấy danh sách năm từ API
  const allYears = computed(() => {
    if (!allMovies.value) return []
    const years = new Set<string>()
    allMovies.value.forEach((movie: any) => {
      years.add(movie.year)
    })
    return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a))
  })

  // Phim đã được lọc dựa vào activeGenreFilter và activeYearFilter
  const filteredMovies = computed(() => {
    if (!allMovies.value) return []

    return allMovies.value.filter((movie: any) => {
      // Nếu chọn thể loại, phim phải chứa thể loại đó
      if (activeGenreFilter.value) {
        const hasGenre = movie.genre.includes(activeGenreFilter.value)
        if (!hasGenre) return false
      }

      // Nếu chọn năm, phim phải phát hành năm đó
      if (activeYearFilter.value) {
        if (movie.year !== activeYearFilter.value) return false
      }

      return true
    })
  })

  // Phim lọc được hiển thị trên trang hiện tại (16 phim/trang)
  const filteredMoviesPaginated = computed(() => {
    const moviesPerPage = 16
    const start = (filterCurrentPage.value - 1) * moviesPerPage
    return filteredMovies.value.slice(start, start + moviesPerPage)
  })

  // Tổng số trang khi lọc phim
  const totalFilterPages = computed(() => {
    if (filteredMovies.value.length === 0) return 1
    return Math.ceil(filteredMovies.value.length / 16)
  })

  // Kiểm tra xem đang ở chế độ lọc hay chế độ danh mục
  const isFilterMode = computed(() => {
    return activeGenreFilter.value !== null || activeYearFilter.value !== null
  })

  // ========== CÁC HÀM XỬ LÝ ===========
  const filterByGenre = (genre: string | null) => {
    activeGenreFilter.value = genre
    activeYearFilter.value = null
    filterCurrentPage.value = 1
  }

  const filterByYear = (year: string | null) => {
    activeYearFilter.value = year
    activeGenreFilter.value = null
    filterCurrentPage.value = 1
  }

  const goToFilterPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalFilterPages.value) {
      filterCurrentPage.value = pageNumber
    }
  }

  const resetFilter = () => {
    activeGenreFilter.value = null
    activeYearFilter.value = null
    filterCurrentPage.value = 1
  }

  return {
    // State
    activeGenreFilter,
    activeYearFilter,
    filterCurrentPage,
    // Getters
    allGenres,
    allYears,
    filteredMovies,
    filteredMoviesPaginated,
    totalFilterPages,
    isFilterMode,
    // Actions
    filterByGenre,
    filterByYear,
    goToFilterPage,
    resetFilter
  }
}
