/**
 * useMovieTypeFilter Composable (Refactored)
 * ========================================
 * Lọc phim theo loại: Phim Lẻ (single) hoặc Phim Bộ (series)
 * 
 * Cách hoạt động:
 * - User chọn "Phim Lẻ" hoặc "Phim Bộ" trên header
 * - URL được cập nhật: ?type=single&typeFilterPage=1
 * - Hiển thị phim lọc với phân trang 16 phim/trang
 */

import { computed, watch } from 'vue'
import type { Ref } from 'vue'
import { useRoute } from 'vue-router'
import { usePagination } from './usePagination'

export function useMovieTypeFilter(allMovies: Ref<any[]>) {
  const route = useRoute()

  // ========== LẤY LỌC LOẠI TỪ URL ==========
  const typeFilter = computed(() => (route.query.type as string) || '')

  // ========== LỌC PHIM THEO LOẠI ==========
  const filteredByTypeMovies = computed(() => {
    if (!allMovies.value || !typeFilter.value) return []
    
    const type = typeFilter.value.toLowerCase()
    if (type !== 'single' && type !== 'series') return []
    
    return allMovies.value.filter((movie: any) => {
      const movieType = movie.type || 'single'
      return movieType.toLowerCase() === type
    })
  })

  // ========== PHÂN TRANG ==========
  const {
    currentItems: filteredByTypeMoviesPaginated,
    currentPage: typeFilterCurrentPage,
    totalPages: totalTypeFilterPages,
    goToPage: goToTypeFilterPage,
    resetPage: resetTypeFilterPage
  } = usePagination(filteredByTypeMovies, { 
    itemsPerPage: 16,
    queryParamName: 'page',
    useUrlSync: true
  })

  // ========== RESET TRANG KHI LOẠI THAY ĐỔI ==========
  watch(typeFilter, () => {
    resetTypeFilterPage()
  })

  // ========== LABEL HIỆN THỊ ==========
  const typeFilterLabel = computed(() => {
    if (typeFilter.value === 'single') return 'Phim Lẻ'
    if (typeFilter.value === 'series') return 'Phim Bộ (Series)'
    return ''
  })

  return {
    // Input
    typeFilter,

    // Data
    filteredByTypeMovies,
    filteredByTypeMoviesPaginated,

    // Pagination
    typeFilterCurrentPage,
    totalTypeFilterPages,

    // Methods
    goToTypeFilterPage,
    resetTypeFilterPage,

    // Display
    typeFilterLabel,

    // Mode check
    isTypeFilterMode: computed(() => typeFilter.value.length > 0)
  }
}
