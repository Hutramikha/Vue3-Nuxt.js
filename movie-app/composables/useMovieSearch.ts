/**
 * useMovieSearch Composable (Updated with URL Sync)
 * ========================================
 * Tìm kiếm phim theo từ khóa với phân trang URL-synced
 * 
 * Cách hoạt động:
 * - User nhập từ khóa tìm kiếm
 * - Ứng dụng tìm kiếm trong tên phim hoặc thể loại (case-insensitive)
 * - Hiển thị kết quả với phân trang
 * - URL format: /index?search=keyword&page=2 (thay vì searchPage=2)
 * 
 * URL Examples:
 * - /index?search=avatar&page=1
 * - /index?search=avatar&page=2
 */

import { computed, watch } from 'vue'
import type { Ref } from 'vue'
import { useRoute } from 'vue-router'
import { usePagination } from './usePagination'

export function useMovieSearch(allMovies: Ref<any[]>) {
  const route = useRoute()

  // ========== LẤY TỪ KHÓA TỪ URL ==========
  const searchQuery = computed(() => (route.query.search as string) || '')

  // ========== TÌMKIẾM PHIM ==========
  const searchedMovies = computed(() => {
    if (!searchQuery.value.trim() || !allMovies.value) return []
    
    const query = searchQuery.value.toLowerCase().trim()
    return allMovies.value.filter((movie: any) =>
      movie.title.toLowerCase().includes(query) ||
      movie.genre.toLowerCase().includes(query)
    )
  })

  // ========== PHÂN TRANG TÌM KIẾM ==========
  // Dùng URL sync: /index?search=keyword&page=2
  const {
    currentItems: searchedMoviesPaginated,
    currentPage: searchCurrentPage,
    totalPages: totalSearchPages,
    goToPage: goToSearchPage,
    resetPage: resetSearchPage
  } = usePagination(searchedMovies, { 
    itemsPerPage: 16,
    queryParamName: 'page',  // Dùng 'page' thay vì 'searchPage'
    useUrlSync: true  // Tự động sync với URL
  })

  // ========== RESET TRANG KHI TÌM KIẾM THAY ĐỔI ==========
  watch(searchQuery, () => {
    resetSearchPage()
  })

  return {
    // Input
    searchQuery,

    // Data
    searchedMovies,
    searchedMoviesPaginated,

    // Pagination
    searchCurrentPage,
    totalSearchPages,

    // Methods
    goToSearchPage,
    resetSearchPage,

    // Mode check
    isSearchMode: computed(() => searchQuery.value.trim().length > 0)
  }
}
