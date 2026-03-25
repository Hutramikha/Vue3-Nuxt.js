/**
 * useMovieFilter Composable
 * Quản lý logic lọc phim theo thể loại và năm
 * Phù hợp với Chương 5.3: Custom Composables
 */

import { ref, computed } from 'vue'

export function useMovieFilter(allMovies: any) {
  // ========== QUẢN LÝ TRẠNG THÁI ==========
  // Sử dụng Set để lưu nhiều tiêu chí lọc
  const activeGenreFilters = ref<Set<string>>(new Set())
  const activeYearFilters = ref<Set<string>>(new Set())
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

  // Phim đã được lọc dựa vào activeGenreFilters và activeYearFilters
  const filteredMovies = computed(() => {
    if (!allMovies.value) return []

    return allMovies.value.filter((movie: any) => {
      // Nếu chọn thể loại, phim phải chứa ít nhất 1 thể loại đã chọn
      if (activeGenreFilters.value.size > 0) {
        const hasGenre = Array.from(activeGenreFilters.value).some(
          genre => movie.genre.includes(genre)
        )
        if (!hasGenre) return false
      }

      // Nếu chọn năm, phim phải phát hành trong 1 năm đã chọn
      if (activeYearFilters.value.size > 0) {
        const hasYear = activeYearFilters.value.has(movie.year)
        if (!hasYear) return false
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
    return activeGenreFilters.value.size > 0 || activeYearFilters.value.size > 0
  })

  // ========== CÁC HÀM XỬ LÝ ===========
  // Toggle thể loại (bấm lại để bỏ)
  const filterByGenre = (genre: string) => {
    const newSet = new Set(activeGenreFilters.value)
    if (newSet.has(genre)) {
      newSet.delete(genre)
    } else {
      newSet.add(genre)
    }
    activeGenreFilters.value = newSet
    filterCurrentPage.value = 1
  }

  // Toggle năm (bấm lại để bỏ)
  const filterByYear = (year: string) => {
    const newSet = new Set(activeYearFilters.value)
    if (newSet.has(year)) {
      newSet.delete(year)
    } else {
      newSet.add(year)
    }
    activeYearFilters.value = newSet
    filterCurrentPage.value = 1
  }

  const goToFilterPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalFilterPages.value) {
      filterCurrentPage.value = pageNumber
    }
  }

  const resetFilter = () => {
    activeGenreFilters.value = new Set()
    activeYearFilters.value = new Set()
    filterCurrentPage.value = 1
  }

  return {
    // State
    activeGenreFilters,
    activeYearFilters,
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
