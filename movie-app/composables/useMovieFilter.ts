/**
 * useMovieFilter Composable
 * ========================================
 * Chức năng: Quản lý lọc phim theo thể loại và năm
 * 
 * Cách hoạt động:
 * - Người dùng chọn thể loại hoặc năm
 * - Dữ liệu được lọc dựa vào các lựa chọn
 * - Hiển thị kết quả lọc với phân trang (16 phim/trang)
 * 
 * Dùng Set (thay vì Array) vì:
 * - Set không cho phép giá trị trùng lặp
 * - Kiểm tra giá trị tồn tại nhanh hơn
 * - Dễ dàng thêm/xóa giá trị
 */

import { ref, computed } from 'vue'

export function useMovieFilter(allMovies: any) {
  // ========== QUẢN LÝ TRẠNG THÁI (REF) ==========
  // Sử dụng Set để lưu thể loại được chọn (có thể chọn nhiều cái)
  const activeGenreFilters = ref<Set<string>>(new Set())
  
  // Sử dụng Set để lưu năm được chọn (có thể chọn nhiều cái)
  const activeYearFilters = ref<Set<string>>(new Set())
  
  // Trang hiện tại khi hiển thị kết quả lọc
  const filterCurrentPage = ref(1)

  // ========== GETTERS (COMPUTED - tự động cập nhật khi dữ liệu thay đổi) ==========
  
  // 1. Lấy danh sách tất cả thể loại từ tất cả phim
  // Mục đích: Cho người dùng chọn từ luôn
  const allGenres = computed(() => {
    if (!allMovies.value) return []
    
    const genres = new Set<string>()
    allMovies.value.forEach((movie: any) => {
      // Thể loại có thể có nhiều (cách nhau bằng ", ")
      // Ví dụ: "Hành Động, Tâm Lý"
      if (movie.genre) {
        movie.genre.split(', ').forEach((g: string) => genres.add(g))
      }
    })
    return Array.from(genres).sort()
  })

  // 2. Lấy danh sách tất cả năm từ tất cả phim
  // Mục đích: Cho người dùng chọn từ phim nào đến phim nào
  const allYears = computed(() => {
    if (!allMovies.value) return []
    
    const years = new Set<string>()
    allMovies.value.forEach((movie: any) => {
      years.add(movie.year)
    })
    // Sắp xếp năm từ mới nhất đến cũ nhất
    return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a))
  })

  // 3. Phim được lọc dựa vào activeGenreFilters và activeYearFilters
  // Mục đích: Trả về danh sách phim thỏa mãn điều kiện lọc
  const filteredMovies = computed(() => {
    if (!allMovies.value) return []

    return allMovies.value.filter((movie: any) => {
      // Kiểm tra thể loại:
      // - Nếu chọn thể loại, phim phải chứa ít nhất 1 thể loại đã chọn
      // - Nếu không chọn, bỏ qua kiểm tra này
      if (activeGenreFilters.value.size > 0) {
        const hasGenre = Array.from(activeGenreFilters.value).some(
          genre => movie.genre.includes(genre)
        )
        if (!hasGenre) return false
      }

      // Kiểm tra năm:
      // - Nếu chọn năm, phim phải phát hành trong 1 năm đã chọn
      // - Nếu không chọn, bỏ qua kiểm tra này
      if (activeYearFilters.value.size > 0) {
        const hasYear = activeYearFilters.value.has(movie.year)
        if (!hasYear) return false
      }

      // Phim thỏa mãn tất cả điều kiện
      return true
    })
  })

  // 4. Phim lọc được hiển thị trên trang hiện tại
  // Mục đích: Phân trang kết quả lọc (16 phim/trang)
  const filteredMoviesPaginated = computed(() => {
    const moviesPerPage = 16
    const start = (filterCurrentPage.value - 1) * moviesPerPage
    return filteredMovies.value.slice(start, start + moviesPerPage)
  })

  // 5. Tổng số trang khi lọc phim
  // Ví dụ: 48 phim lọc được ÷ 16 phim/trang = 3 trang
  const totalFilterPages = computed(() => {
    if (filteredMovies.value.length === 0) return 1
    return Math.ceil(filteredMovies.value.length / 16)
  })

  // 6. Kiểm tra xem đang ở chế độ lọc hay chế độ danh mục
  // Mục đích: Quyết định hiển thị kết quả lọc hay danh mục bình thường
  const isFilterMode = computed(() => {
    return activeGenreFilters.value.size > 0 || activeYearFilters.value.size > 0
  })

  // ========== PHƯƠNG THỨC (METHODS) XỬ LÝ ==========
  
  // 1. Toggle thể loại (chọn lần đầu thêm, bấm lại thì xóa)
  // Ví dụ: người dùng bấm "Hành Động" → thêm vào Set
  //        người dùng bấm "Hành Động" lại → xóa khỏi Set
  const filterByGenre = (genre: string) => {
    const newSet = new Set(activeGenreFilters.value)
    if (newSet.has(genre)) {
      newSet.delete(genre)
    } else {
      newSet.add(genre)
    }
    activeGenreFilters.value = newSet
    filterCurrentPage.value = 1  // Reset về trang 1 khi lọc
  }

  // 2. Toggle năm (chọn lần đầu thêm, bấm lại thì xóa)
  const filterByYear = (year: string) => {
    const newSet = new Set(activeYearFilters.value)
    if (newSet.has(year)) {
      newSet.delete(year)
    } else {
      newSet.add(year)
    }
    activeYearFilters.value = newSet
    filterCurrentPage.value = 1  // Reset về trang 1 khi lọc
  }

  // 3. Đi đến trang cụ thể khi lọc phim
  // Ví dụ: người dùng bấm nút "Trang 2" → chuyển sang trang 2
  const goToFilterPage = (pageNumber: number) => {
    // Kiểm tra trang hợp lệ (từ 1 đến tổng số trang)
    if (pageNumber >= 1 && pageNumber <= totalFilterPages.value) {
      filterCurrentPage.value = pageNumber
    }
  }

  // 4. Xóa tất cả bộ lọc (reset)
  // Ví dụ: người dùng bấm nút "Xóa Bộ Lọc" → quay lại hiển thị tất cả phim
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
