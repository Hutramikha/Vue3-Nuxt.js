/**
 * useMovieCategories Composable
 * Quản lý logic hiển thị các danh mục phim (New, Hot, MostViewed, Trending, Today)
 * Hỗ trợ 50 phim: 10 phim/danh mục × 5 danh mục
 * Phù hợp với Chương 5.3: Custom Composables
 */

import { ref, computed } from 'vue'

export function useMovieCategories(allMovies: any) {
  const moviesPerPage = 5

  // ========== QUẢN LÝ TRẠNG THÁI ==========
  const categories = {
    new: {
      name: 'Phim Mới Cập Nhật',
      startIndex: 0,
      endIndex: 10,
      currentPage: ref(1)
    },
    hot: {
      name: 'Phim Kinh Điển',
      startIndex: 10,
      endIndex: 20,
      currentPage: ref(1)
    },
    mostViewed: {
      name: 'Phim Kinh Điển II',
      startIndex: 20,
      endIndex: 30,
      currentPage: ref(1)
    },
    trending: {
      name: 'Trending Hôm Nay',
      startIndex: 30,
      endIndex: 40,
      currentPage: ref(1)
    },
    today: {
      name: 'Phim Lẻ Mới Ra Mắt',
      startIndex: 40,
      endIndex: 50,
      currentPage: ref(1)
    }
  }

  // ========== CÁC HÀM PHỤ TRỢ ==========
  // Lấy danh sách phim đã phân trang cho một danh mục
  const getPaginatedMovies = (startIndex: number, currentPage: number) => {
    if (!allMovies.value || allMovies.value.length === 0) return []
    const categoryMovies = allMovies.value.slice(startIndex, startIndex + 10)
    const start = (currentPage - 1) * moviesPerPage
    const end = start + moviesPerPage
    return categoryMovies.slice(start, end)
  }

  // Tính tổng số trang của một danh mục
  const getTotalPages = () => {
    if (!allMovies.value || allMovies.value.length === 0) return 0
    return Math.ceil(10 / moviesPerPage)
  }

  // ========== GETTERS - NEW CATEGORY ==========
  const newMoviesPaginated = computed(() => {
    return getPaginatedMovies(categories.new.startIndex, categories.new.currentPage.value)
  })
  const totalPagesNew = computed(() => getTotalPages())

  // ========== GETTERS - HOT CATEGORY ==========
  const hotMoviesPaginated = computed(() => {
    return getPaginatedMovies(categories.hot.startIndex, categories.hot.currentPage.value)
  })
  const totalPagesHot = computed(() => getTotalPages())

  // ========== GETTERS - MOST VIEWED CATEGORY ==========
  const mostViewedPaginated = computed(() => {
    return getPaginatedMovies(
      categories.mostViewed.startIndex,
      categories.mostViewed.currentPage.value
    )
  })
  const totalPagesMostViewed = computed(() => getTotalPages())

  // ========== GETTERS - TRENDING CATEGORY ==========
  const trendingPaginated = computed(() => {
    return getPaginatedMovies(categories.trending.startIndex, categories.trending.currentPage.value)
  })
  const totalPagesTrending = computed(() => getTotalPages())

  // ========== GETTERS - TODAY CATEGORY ==========
  const todayPaginated = computed(() => {
    return getPaginatedMovies(categories.today.startIndex, categories.today.currentPage.value)
  })
  const totalPagesToday = computed(() => getTotalPages())

  // ========== ACTIONS - PAGINATION FOR EACH CATEGORY ==========
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

  return {
    // State
    categories,
    // Getters - New
    newMoviesPaginated,
    totalPagesNew,
    // Getters - Hot
    hotMoviesPaginated,
    totalPagesHot,
    // Getters - Most Viewed
    mostViewedPaginated,
    totalPagesMostViewed,
    // Getters - Trending
    trendingPaginated,
    totalPagesTrending,
    // Getters - Today
    todayPaginated,
    totalPagesToday,
    // Actions
    goToPageNew,
    goToPageHot,
    goToPageMostViewed,
    goToPageTrending,
    goToPageToday
  }
}
