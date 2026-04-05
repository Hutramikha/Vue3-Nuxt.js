/**
 * useMovieFilter Composable (Updated with URL Sync)
 * ========================================
 * Lọc phim theo thể loại và năm
 * 
 * Cách hoạt động:
 * - User chọn 1 hoặc nhiều thể loại
 * - User chọn 1 hoặc nhiều năm
 * - Phim được lọc (AND logic: phải thỏa mãn tất cả thể loại và năm đã chọn)
 * - Hiển thị kết quả với phân trang 16 phim/trang
 * - URL format: /index?genres=action,comedy&years=2023,2024&page=2
 * 
 * URL Examples:
 * - /index?genres=action&page=1
 * - /index?genres=action,comedy&years=2023&page=2
 */

import { ref, computed, watch } from 'vue'
import type { Ref } from 'vue'
import { usePagination } from './usePagination'

export function useMovieFilter(allMovies: Ref<any[]>) {
  // ========== STATE ==========
  const activeGenreFilters = ref<Set<string>>(new Set())
  const activeYearFilters = ref<Set<string>>(new Set())

  // ========== GETTERS: DANH SÁCH CÓ SẴN ==========
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

  const allYears = computed(() => {
    if (!allMovies.value) return []
    const years = new Set<string>()
    allMovies.value.forEach((movie: any) => {
      years.add(movie.year)
    })
    return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a))
  })

  // ========== LỌCPHIM ==========
  const filteredMovies = computed(() => {
    if (!allMovies.value) return []

    return allMovies.value.filter((movie: any) => {
      // Kiểm tra thể loại (OR: phim phải có ít nhất 1 thể loại đã chọn)
      if (activeGenreFilters.value.size > 0) {
        const hasGenre = Array.from(activeGenreFilters.value).some(
          genre => movie.genre.includes(genre)
        )
        if (!hasGenre) return false
      }

      // Kiểm tra năm (OR: phim phải có ít nhất 1 năm đã chọn)
      if (activeYearFilters.value.size > 0) {
        const hasYear = activeYearFilters.value.has(movie.year)
        if (!hasYear) return false
      }

      return true
    })
  })

  // ========== PHÂN TRANG LỌC ==========
  // Dùng URL sync: /index?genres=action&page=2
  const {
    currentItems: filteredMoviesPaginated,
    currentPage: filterCurrentPage,
    totalPages: totalFilterPages,
    goToPage: goToFilterPage,
    resetPage: resetFilterPage
  } = usePagination(filteredMovies, { 
    itemsPerPage: 16,
    queryParamName: 'page',
    useUrlSync: true
  })

  // ========== PHƯƠNG THỨC LỌC ==========
  const filterByGenre = (genre: string) => {
    const newSet = new Set(activeGenreFilters.value)
    if (newSet.has(genre)) {
      newSet.delete(genre)
    } else {
      newSet.add(genre)
    }
    activeGenreFilters.value = newSet
  }

  const filterByYear = (year: string) => {
    const newSet = new Set(activeYearFilters.value)
    if (newSet.has(year)) {
      newSet.delete(year)
    } else {
      newSet.add(year)
    }
    activeYearFilters.value = newSet
  }

  const resetFilter = () => {
    activeGenreFilters.value = new Set()
    activeYearFilters.value = new Set()
    resetFilterPage()
  }

  // ========== AUTO RESET TRANG KHI LỌC THAY ĐỔI ==========
  watch([activeGenreFilters, activeYearFilters], () => {
    resetFilterPage()
  })

  return {
    // State
    activeGenreFilters,
    activeYearFilters,

    // Data
    allGenres,
    allYears,
    filteredMovies,
    filteredMoviesPaginated,

    // Pagination
    filterCurrentPage,
    totalFilterPages,

    // Methods
    filterByGenre,
    filterByYear,
    goToFilterPage,
    resetFilter,

    // Mode check
    isFilterMode: computed(() =>
      activeGenreFilters.value.size > 0 || activeYearFilters.value.size > 0
    )
  }
}
