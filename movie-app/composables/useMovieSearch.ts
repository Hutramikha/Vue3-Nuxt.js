/**
 * useMovieSearch Composable
 * ========================================
 * Chức năng: Quản lý tìm kiếm phim theo từ khóa
 * 
 * Cách hoạt động:
 * - Người dùng nhập từ khóa tìm kiếm
 * - Ứng dụng tìm kiếm giống với tên phim hoặc thể loại
 * - Hiển thị kết quả với phân trang (16 phim/trang)
 * 
 * Từ khóa được lưu trong URL (route.query.search):
 * - Ưu điểm: khi chuyển trang, từ khóa vẫn được giữ
 * - Ví dụ: /search?search=hành động&searchPage=1
 */

import { computed } from 'vue'
import { useRoute } from 'vue-router'

export function useMovieSearch(allMovies: any) {
  const route = useRoute()

  // ========== GETTERS (COMPUTED - tự động cập nhật) ==========
  
  // 1. Lấy từ khóa tìm kiếm từ URL
  // Ví dụ: URL là /index?search=avatar → searchQuery = "avatar"
  const searchQuery = computed(() => {
    return (route.query.search as string) || ''
  })

  // 2. Tìm kiếm phim dựa vào từ khóa
  // Mục đích: Trả về danh sách phim khớp với từ khóa
  // Tìm kiếm trong: tên phim hoặc thể loại (không phân biệt hoa/thường)
  const searchedMovies = computed(() => {
    if (!allMovies.value || !searchQuery.value.trim()) return []

    const query = searchQuery.value.toLowerCase().trim()
    return allMovies.value.filter((movie: any) => {
      return (
        movie.title.toLowerCase().includes(query) ||
        movie.genre.toLowerCase().includes(query)
      )
    })
  })

  // 3. Lấy trang hiện tại khi tìm kiếm
  // Ví dụ: URL là /index?search=avatar&searchPage=2 → searchCurrentPage = 2
  const searchCurrentPage = computed(() => {
    return parseInt((route.query.searchPage as string) || '1')
  })

  // 4. Phim tìm được hiển thị trên trang hiện tại
  // Mục đích: Phân trang kết quả tìm kiếm (16 phim/trang)
  const searchedMoviesPaginated = computed(() => {
    const moviesPerSearchPage = 16
    const start = (searchCurrentPage.value - 1) * moviesPerSearchPage
    return searchedMovies.value.slice(start, start + moviesPerSearchPage)
  })

  // 5. Tổng số trang khi tìm kiếm
  // Ví dụ: 32 phim trùng ÷ 16 phim/trang = 2 trang
  const totalSearchPages = computed(() => {
    if (searchedMovies.value.length === 0) return 1
    return Math.ceil(searchedMovies.value.length / 16)
  })

  // 6. Kiểm tra xem đang ở chế độ tìm kiếm hay không
  // Mục đích: Quyết định hiển thị kết quả tìm kiếm hay danh mục bình thường
  const isSearchMode = computed(() => {
    return searchQuery.value.trim().length > 0
  })

  return {
    // Getters
    searchQuery,
    searchedMovies,
    searchCurrentPage,
    searchedMoviesPaginated,
    totalSearchPages,
    isSearchMode
  }
}
