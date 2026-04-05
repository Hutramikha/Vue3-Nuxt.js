/**
 * useMovieCategoryFilter Composable (Refactored)
 * ========================================
 * Lọc phim theo danh mục cụ thể (5 danh mục: new, hot, mostViewed, trending, today)
 * 
 * Cách hoạt động:
 * - User click vào một danh mục cụ thể
 * - Hiển thị tất cả phim của danh mục đó
 * - Phân trang: 16 phim/trang (giống search)
 * - User có thể quay lại chế độ danh mục bằng Home
 */

import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { usePagination } from './usePagination'

export function useMovieCategoryFilter(allMovies: Ref<any[]>) {
  // ========== STATE ==========
  const selectedCategory = ref<string | null>(null)

  // ========== ĐỊNH NGHĨA 5 DANH MỤC ==========
  const categoryMap = {
    new: { name: 'Phim Mới Cập Nhật', startIndex: 0, endIndex: 10 },
    hot: { name: 'Phim Hot Hiện Tại', startIndex: 10, endIndex: 20 },
    mostViewed: { name: 'Phim Được Xem Nhiều', startIndex: 20, endIndex: 30 },
    trending: { name: 'Trending Hôm Nay', startIndex: 30, endIndex: 40 },
    today: { name: 'Phim Lẻ Mới Ra Mắt', startIndex: 40, endIndex: 50 }
  }

  // ========== LẤYPHIM CỦA DANH MỤC ==========
  const categoryFilteredMoviesRef = computed(() => {
    if (!selectedCategory.value || !allMovies.value) return []
    
    const category = categoryMap[selectedCategory.value as keyof typeof categoryMap]
    if (!category) return []
    
    return allMovies.value.slice(category.startIndex, category.endIndex)
  })

  // ========== PHÂN TRANG ==========
  const {
    currentItems: categoryFilteredMoviesPaginated,
    currentPage: categoryFilterCurrentPage,
    totalPages: totalCategoryFilterPages,
    goToPage: goToCategoryFilterPageLocal,
    resetPage: resetCategoryFilterPage
  } = usePagination(categoryFilteredMoviesRef, { itemsPerPage: 16 })

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
    selectedCategory.value = categoryKey
    resetCategoryFilterPage()
  }

  const resetCategoryFilter = () => {
    selectedCategory.value = null
    resetCategoryFilterPage()
  }

  const goToCategoryFilterPage = (pageNumber: number) => {
    goToCategoryFilterPageLocal(pageNumber)
  }

  return {
    // State
    selectedCategory,

    // Data
    categoryMap,
    categoryFilteredMovies: categoryFilteredMoviesRef,
    categoryFilteredMoviesRef,
    categoryFilteredMoviesPaginated,

    // Pagination
    categoryFilterCurrentPage,
    totalCategoryFilterPages,

    // Info
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
