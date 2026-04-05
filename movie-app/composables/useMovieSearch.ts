/**
 * useMovieSearch Composable (Refactored)
 * ========================================
 * Tìm kiếm phim theo từ khóa với phân trang 16 phim/trang
 * 
 * Cách hoạt động:
 * - User nhập từ khóa tìm kiếm
 * - Ứng dụng tìm kiếm trong tên phim hoặc thể loại (case-insensitive)
 * - Hiển thị kết quả với phân trang
 * - URL được cập nhật: ?search=keyword&searchPage=1
 */

import { computed, watch } from 'vue'
import type { Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePagination } from './usePagination'

export function useMovieSearch(allMovies: Ref<any[]>) {
  const route = useRoute()
  const router = useRouter()

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
  const {
    currentItems: searchedMoviesPaginated,
    currentPage: searchCurrentPage,
    totalPages: totalSearchPages,
    goToPage: goToSearchPageLocal,
    resetPage: resetSearchPage
  } = usePagination(searchedMovies, { itemsPerPage: 16 })

  // ========== ĐIỀU HƯỚNG URL ==========
  // Khi user click nút trang số, update URL query parameter
  const goToSearchPage = async (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalSearchPages.value) {
      await router.push({
        query: {
          search: searchQuery.value,
          searchPage: pageNumber
        }
      })
    }
  }

  // ========== RESET TRANG KHI TÌM KIẾM THAY ĐỔI ==========
  watch(searchQuery, () => {
    resetSearchPage()
  })

  // ========== ĐỒNG BỘHÓA TRANG TỪ URL ==========
  // Khi URL thay đổi, cập nhật currentPage từ route.query.searchPage
  watch(() => route.query.searchPage, (newPage) => {
    if (newPage) {
      const pageNum = parseInt(newPage as string)
      goToSearchPageLocal(pageNum)
    }
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
