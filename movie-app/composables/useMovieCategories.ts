/**
 * useMovieCategories Composable
 * ========================================
 * Chức năng: Quản lý 5 danh mục phim với phân trang riêng
 * 
 * CÁCH CHIA 50 PHIM THÀNH 5 DANH MỤC:
 * Tổng 50 phim (ID 1-50) được chia đều thành 5 danh mục:
 * 1. new (ID 0-9):          "Phim Mới Cập Nhật" - 10 phim
 * 2. hot (ID 10-19):        "Phim Hot Hiện Tại" - 10 phim
 * 3. mostViewed (ID 20-29): "Phim Được Xem Nhiều" - 10 phim
 * 4. trending (ID 30-39):   "Trending Hôm Nay" - 10 phim
 * 5. today (ID 40-49):      "Phim Lẻ Mới Ra Mắt" - 10 phim
 * 
 * PHÂN TRANG MỖI DANH MỤC:
 * - Mỗi danh mục: 10 phim
 * - Hiển thị: 5 phim/trang (fix cứng)
 * - Tổng trang/danh mục: 10 ÷ 5 = 2 trang
 * 
 * QUẢN LÝ STATE:
 * - Mỗi danh mục có currentPage ref riêng (categories.new.currentPage, categories.hot.currentPage, ...)
 * - Khi user click logo "Home", tất cả currentPage được reset về 1
 * - Điều này đảm bảo mỗi danh mục độc lập, không ảnh hưởng lẫn nhau
 */

import { ref, computed } from 'vue'

export function useMovieCategories(allMovies: any) {
  const moviesPerPage = 5  // Mỗi trang hiển thị 5 phim
  
  // ========== QUẢN LÝ TRẠNG THÁI DANH MỤC ==========
  // Định nghĩa 5 danh mục với vị trí trong mảng allMovies
  // Mỗi danh mục lưu: name (tên hiển thị), startIndex, endIndex, currentPage (trạng thái phân trang)
  // 
  // LƯU Ý: 
  // - Tên danh mục (new, hot, mostViewed, trending, today) là internal name, không phải tên hiển thị
  // - Tên hiển thị lấy từ category.name (vd: "Phim Mới Cập Nhật")
  // - Mỗi danh mục: 10 phim, 2 trang, 5 phim/trang
  const categories = {
    new: {
      name: 'Phim Mới Cập Nhật',
      startIndex: 0,    // Bắt đầu từ vị trí 0 (phim ID 1)
      endIndex: 10,     // Kết thúc tại vị trí 10 (phim ID 10, tổng 10 phim: ID 1-10)
      currentPage: ref(1)  // Trạng thái phân trang riêng: trang 1 hoặc 2
    },
    hot: {
      name: 'Phim Hot Hiện Tại',  // Gọi là "Hot" để dễ nhận biết, tên hiển thị là "Phim Hot Hiện Tại"
      startIndex: 10,
      endIndex: 20,     // 10 phim: ID 11-20
      currentPage: ref(1)
    },
    mostViewed: {
      name: 'Phim Được Xem Nhiều',
      startIndex: 20,
      endIndex: 30,     // 10 phim: ID 21-30
      currentPage: ref(1)
    },
    trending: {
      name: 'Trending Hôm Nay',
      startIndex: 30,
      endIndex: 40,     // 10 phim: ID 31-40
      currentPage: ref(1)
    },
    today: {
      name: 'Phim Lẻ Mới Ra Mắt',
      startIndex: 40,
      endIndex: 50,     // 10 phim: ID 41-50
      currentPage: ref(1)
    }
  }

  // ========== CÁC HÀM PHỤ TRỢ ==========
  
  // 1. Lấy phim đã phân trang của một danh mục
  // Ví dụ: danh mục "Phim Mới" có 10 phim, lấy 5 phim trang 1
  const getPaginatedMovies = (startIndex: number, currentPage: number) => {
    if (!allMovies.value || allMovies.value.length === 0) return []
    
    // Lấy 10 phim của danh mục này
    const categoryMovies = allMovies.value.slice(startIndex, startIndex + 10)
    
    // Phân trang: trang 1 = phim 0-4, trang 2 = phim 5-9
    const start = (currentPage - 1) * moviesPerPage
    const end = start + moviesPerPage
    return categoryMovies.slice(start, end)
  }

  // 2. Tính tổng số trang của một danh mục
  // 10 phim ÷ 5 phim/trang = 2 trang
  const getTotalPages = () => {
    if (!allMovies.value || allMovies.value.length === 0) return 0
    return Math.ceil(10 / moviesPerPage)  // 10 phim/danh mục
  }

  // ========== GETTERS CHO MỖI DANH MỤC ==========
  // Mỗi danh mục có 3 computed: danh sách phim, tổng trang, và hàm chuyển trang
  
  // DANH MỤC 1 - Phim Mới Cập Nhật
  const newMoviesPaginated = computed(() => {
    return getPaginatedMovies(categories.new.startIndex, categories.new.currentPage.value)
  })
  const totalPagesNew = computed(() => getTotalPages())

  // DANH MỤC 2 - Phim Kinh Điển
  const hotMoviesPaginated = computed(() => {
    return getPaginatedMovies(categories.hot.startIndex, categories.hot.currentPage.value)
  })
  const totalPagesHot = computed(() => getTotalPages())

  // DANH MỤC 3 - Phim Kinh Điển II
  const mostViewedPaginated = computed(() => {
    return getPaginatedMovies(
      categories.mostViewed.startIndex,
      categories.mostViewed.currentPage.value
    )
  })
  const totalPagesMostViewed = computed(() => getTotalPages())

  // DANH MỤC 4 - Trending
  const trendingPaginated = computed(() => {
    return getPaginatedMovies(categories.trending.startIndex, categories.trending.currentPage.value)
  })
  const totalPagesTrending = computed(() => getTotalPages())

  // DANH MỤC 5 - Phim Lẻ Mới Ra Mắt
  const todayPaginated = computed(() => {
    return getPaginatedMovies(categories.today.startIndex, categories.today.currentPage.value)
  })
  const totalPagesToday = computed(() => getTotalPages())

  // ========== PHƯƠNG THỨC CHUYỂN TRANG ==========
  // Mỗi danh mục có hàm riêng để chuyển trang
  // Ví dụ: goToPageNew(2) → chuyển danh mục "Phim Mới" sang trang 2
  
  const goToPageNew = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPagesNew.value) {
      categories.new.currentPage.value = pageNumber
    }
  }

  const goToPageHot = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPagesHot.value) {
      categories.hot.currentPage.value = pageNumber
    }
  }

  const goToPageMostViewed = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPagesMostViewed.value) {
      categories.mostViewed.currentPage.value = pageNumber
    }
  }

  const goToPageTrending = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPagesTrending.value) {
      categories.trending.currentPage.value = pageNumber
    }
  }

  const goToPageToday = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPagesToday.value) {
      categories.today.currentPage.value = pageNumber
    }
  }

  // ========== EXPORT CÁC GIOCKTÓC VÀ PHƯƠNG THỨC ==========
  return {
    // Danh sách danh mục (chứa name, startIndex, endIndex, currentPage)
    categories,
    
    // Danh mục 1: Phim Mới Cập Nhật
    newMoviesPaginated,
    totalPagesNew,
    
    // Danh mục 2: Phim Kinh Điển
    hotMoviesPaginated,
    totalPagesHot,
    
    // Danh mục 3: Phim Kinh Điển II
    mostViewedPaginated,
    totalPagesMostViewed,
    
    // Danh mục 4: Trending Hôm Nay
    trendingPaginated,
    totalPagesTrending,
    
    // Danh mục 5: Phim Lẻ Mới Ra Mắt
    todayPaginated,
    totalPagesToday,
    
    // Các phương thức chuyển trang cho mỗi danh mục
    goToPageNew,
    goToPageHot,
    goToPageMostViewed,
    goToPageTrending,
    goToPageToday
  }
}
