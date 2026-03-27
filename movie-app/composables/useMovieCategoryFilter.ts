/**
 * useMovieCategoryFilter Composable
 * ========================================
 * Chức năng: Quản lý lọc phim theo 5 danh mục chính
 * 
 * Khi người dùng chọn một danh mục:
 * - Hiển thị tất cả phim của danh mục đó
 * - Phân trang: 16 phim/trang (giống search mode)
 * - Có thể quay lại chế độ danh mục bằng cách click "Home"
 * 
 * 5 DANH MỤC:
 * 1. new: ID 1-10 - Phim Mới Cập Nhật
 * 2. hot: ID 11-20 - Phim Hot Hiện Tại
 * 3. mostViewed: ID 21-30 - Phim Được Xem Nhiều
 * 4. trending: ID 31-40 - Trending Hôm Nay
 * 5. today: ID 41-50 - Phim Lẻ Mới Ra Mắt
 */

import { ref, computed } from 'vue'

export function useMovieCategoryFilter(allMovies: any) {
  const moviesPerPage = 16  // Phân trang: 16 phim/trang (giống search)
  
  // ========== TRẠNG THÁI FILTER ==========
  const selectedCategory = ref<string | null>(null)  // null = không lọc, hoặc 'new', 'hot', 'mostViewed', 'trending', 'today'
  const categoryFilterCurrentPage = ref(1)
  
  // Định nghĩa 5 danh mục
  const categoryMap = {
    new: { name: 'Phim Mới Cập Nhật', startIndex: 0, endIndex: 10 },
    hot: { name: 'Phim Hot Hiện Tại', startIndex: 10, endIndex: 20 },
    mostViewed: { name: 'Phim Được Xem Nhiều', startIndex: 20, endIndex: 30 },
    trending: { name: 'Trending Hôm Nay', startIndex: 30, endIndex: 40 },
    today: { name: 'Phim Lẻ Mới Ra Mắt', startIndex: 40, endIndex: 50 }
  }
  
  // ========== LOGIC LỌC ==========
  
  // Lấy phim của danh mục đã chọn
  const categoryFilteredMovies = computed(() => {
    if (!selectedCategory.value || !allMovies.value) return []
    
    const category = categoryMap[selectedCategory.value as keyof typeof categoryMap]
    if (!category) return []
    
    return allMovies.value.slice(category.startIndex, category.endIndex)
  })
  
  // Phân trang: 16 phim/trang (giống search mode)
  const categoryFilteredMoviesPaginated = computed(() => {
    if (categoryFilteredMovies.value.length === 0) return []
    
    const start = (categoryFilterCurrentPage.value - 1) * moviesPerPage
    const end = start + moviesPerPage
    
    return categoryFilteredMovies.value.slice(start, end)
  })
  
  // Tổng số trang
  const totalCategoryFilterPages = computed(() => {
    if (categoryFilteredMovies.value.length === 0) return 0
    return Math.ceil(categoryFilteredMovies.value.length / moviesPerPage)
  })
  
  // ========== TRẠNG THÁI MODE ==========
  
  // isCategoryFilterMode: true khi người dùng chọn một danh mục cụ thể
  const isCategoryFilterMode = computed(() => {
    return selectedCategory.value !== null
  })
  
  // Tên danh mục hiện tại
  const selectedCategoryName = computed(() => {
    if (!selectedCategory.value) return ''
    return categoryMap[selectedCategory.value as keyof typeof categoryMap]?.name || ''
  })
  
  // ========== PHƯƠNG THỨC ==========
  
  // Chọn danh mục
  const selectCategory = (categoryKey: string) => {
    selectedCategory.value = categoryKey
    categoryFilterCurrentPage.value = 1  // Reset về trang 1
  }
  
  // Xóa filter (quay lại danh mục)
  const resetCategoryFilter = () => {
    selectedCategory.value = null
    categoryFilterCurrentPage.value = 1
  }
  
  // Chuyển trang
  const goToCategoryFilterPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalCategoryFilterPages.value) {
      categoryFilterCurrentPage.value = pageNumber
    }
  }
  
  return {
    // Trạng thái
    selectedCategory,
    categoryFilterCurrentPage,
    
    // Dữ liệu
    categoryMap,
    categoryFilteredMovies,
    categoryFilteredMoviesPaginated,
    totalCategoryFilterPages,
    
    // Mode
    isCategoryFilterMode,
    selectedCategoryName,
    
    // Phương thức
    selectCategory,
    resetCategoryFilter,
    goToCategoryFilterPage
  }
}
