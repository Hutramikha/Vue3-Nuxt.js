/**
 * useMovieTypeFilter Composable
 * ========================================
 * Chức năng: Quản lý lọc phim theo loại (Phim Lẻ / Phim Bộ)
 * 
 * Cách hoạt động:
 * - Người dùng chọn "Phim Lẻ" hoặc "Phim Bộ" trên header
 * - Ứng dụng lọc phim dựa vào type field
 * - Hiển thị kết quả với phân trang (16 phim/trang)
 * 
 * Loại phim được lưu trong URL (route.query.type):
 * - Ưu điểm: khi chuyển trang, loại phim vẫn được giữ
 * - Ví dụ: ?type=single&typeFilterPage=1 (phim lẻ, trang 1)
 */

import { computed } from 'vue'
import { useRoute } from 'vue-router'

export function useMovieTypeFilter(allMovies: any) {
  const route = useRoute()

  // ========== GETTERS (COMPUTED - tự động cập nhật) ==========
  
  // 1. Lấy loại phim từ URL
  // Ví dụ: URL là /index?type=single → typeFilter = "single"
  const typeFilter = computed(() => {
    return (route.query.type as string) || ''
  })

  // 2. Lọc phim dựa vào loại
  // Mục đích: Trả về danh sách phim theo loại (single = phim lẻ, series = phim bộ)
  const filteredByTypeMovies = computed(() => {
    if (!allMovies.value || !typeFilter.value) return []

    const type = typeFilter.value.toLowerCase()
    
    // Nếu không chỉ định type, trả về rỗng
    if (type !== 'single' && type !== 'series') return []
    
    return allMovies.value.filter((movie: any) => {
      // Nếu movie không có type field, mặc định là single (phim lẻ)
      const movieType = movie.type || 'single'
      return movieType.toLowerCase() === type
    })
  })

  // 3. Lấy trang hiện tại khi lọc theo loại
  // Ví dụ: URL là /index?type=single&typeFilterPage=2 → typeFilterCurrentPage = 2
  const typeFilterCurrentPage = computed(() => {
    return parseInt((route.query.typeFilterPage as string) || '1')
  })

  // 4. Phim lọc theo loại hiển thị trên trang hiện tại
  // Mục đích: Phân trang kết quả lọc (16 phim/trang)
  const filteredByTypeMoviesPaginated = computed(() => {
    const moviesPerPage = 16
    const start = (typeFilterCurrentPage.value - 1) * moviesPerPage
    return filteredByTypeMovies.value.slice(start, start + moviesPerPage)
  })

  // 5. Tổng số trang khi lọc theo loại
  // Ví dụ: 25 phim lẻ ÷ 16 phim/trang = 2 trang
  const totalTypeFilterPages = computed(() => {
    if (filteredByTypeMovies.value.length === 0) return 1
    return Math.ceil(filteredByTypeMovies.value.length / 16)
  })

  // 6. Kiểm tra xem đang ở chế độ lọc loại hay không
  // Mục đích: Quyết định hiển thị kết quả lọc hay danh mục bình thường
  const isTypeFilterMode = computed(() => {
    return typeFilter.value.length > 0
  })

  // 7. Lấy label của loại phim hiện tại
  // Mục đích: Hiển thị tên loại phim ở heading (Phim Lẻ / Phim Bộ)
  const typeFilterLabel = computed(() => {
    if (typeFilter.value === 'single') return 'Phim Lẻ'
    if (typeFilter.value === 'series') return 'Phim Bộ (Series)'
    return ''
  })

  return {
    // Getters
    typeFilter,
    filteredByTypeMovies,
    typeFilterCurrentPage,
    filteredByTypeMoviesPaginated,
    totalTypeFilterPages,
    isTypeFilterMode,
    typeFilterLabel
  }
}
