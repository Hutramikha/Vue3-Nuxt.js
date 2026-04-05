/**
 * useMovieCategoryFilter Composable (Updated with URL Sync)
 * ========================================
 * Lọc phim theo danh mục cụ thể (5 danh mục: new, hot, mostViewed, trending, today)
 * 
 * Cách hoạt động:
 * - User click vào một danh mục cụ thể
 * - Hiển thị tất cả phim của danh mục đó
 * - Phân trang: 16 phim/trang
 * - URL format: /index?category=new&page=2
 * 
 * URL Examples:
 * - /index?category=new&page=1
 * - /index?category=hot&page=2
 */

import { computed, watch } from 'vue'
import type { Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePagination } from './usePagination'

export function useMovieCategoryFilter(allMovies: Ref<any[]>) {
  const route = useRoute()
  const router = useRouter()

  // ========== ĐỊNH NGHĨA 5 DANH MỤC ==========
  const categoryMap = {
    new: { name: 'Phim Mới Cập Nhật', startIndex: 0, endIndex: 10 },
    hot: { name: 'Phim Hot Hiện Tại', startIndex: 10, endIndex: 20 },
    mostViewed: { name: 'Phim Được Xem Nhiều', startIndex: 20, endIndex: 30 },
    trending: { name: 'Trending Hôm Nay', startIndex: 30, endIndex: 40 },
    today: { name: 'Phim Lẻ Mới Ra Mắt', startIndex: 40, endIndex: 50 }
  }

  // ========== LẤY DANH MỤC TỪ URL ==========
  const selectedCategory = computed(() => (route.query.category as string) || null)

  // ========== LẤYPHIM CỦA DANH MỤC ==========
  const categoryFilteredMoviesRef = computed(() => {
    if (!selectedCategory.value || !allMovies.value) return []
    
    const category = categoryMap[selectedCategory.value as keyof typeof categoryMap]
    if (!category) return []
    
    return allMovies.value.slice(category.startIndex, category.endIndex)
  })

  // ========== PHÂN TRANG ==========
  // Dùng URL sync: /index?category=new&page=2
  const {
    currentItems: categoryFilteredMoviesPaginated,
    currentPage: categoryFilterCurrentPage,
    totalPages: totalCategoryFilterPages,
    goToPage: goToCategoryFilterPage,
    resetPage: resetCategoryFilterPage
  } = usePagination(categoryFilteredMoviesRef, { 
    itemsPerPage: 16,
    queryParamName: 'page',
    useUrlSync: true
  })

  // ========== TÊN DANH MỤC HIỆN TẠI ==========
  const selectedCategoryName = computed(() => {
    if (!selectedCategory.value) return ''
    return categoryMap[selectedCategory.value as keyof typeof categoryMap]?.name || ''
  })

  // ========== TỔNG SỐ PHIM CỦA DANH MỤC ==========
  const totalMoviesInCategory = computed(() => {
    return categoryFilteredMoviesRef.value.length
  })

  // ========== PHƯƠNG THỨC ==========
  const selectCategory = (categoryKey: string) => {
    router.push({
      query: {
        category: categoryKey,
        page: 1
      }
    })
  }

  const resetCategoryFilter = () => {
    router.push({ query: {} })
  }

  return {
    // Data
    categoryMap,
    categoryFilteredMovies: categoryFilteredMoviesRef,
    categoryFilteredMoviesPaginated,

    // Pagination
    categoryFilterCurrentPage,
    totalCategoryFilterPages,

    // Info
    selectedCategory,
    selectedCategoryName,
    totalMoviesInCategory,

    // Methods
    selectCategory,
    resetCategoryFilter,
    goToCategoryFilterPage,

    // Mode check
    isCategoryFilterMode: computed(() => selectedCategory.value !== null)
  }
}
