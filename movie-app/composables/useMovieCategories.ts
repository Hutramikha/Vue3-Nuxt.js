/**
 * useMovieCategories Composable (Refactored)
 * ========================================
 * Quản lý 5 danh mục phim với phân trang riêng (5 phim/trang)
 * 
 * CÁCH CHIA 50 PHIM THÀNH 5 DANH MỤC:
 * 1. new (0-9):          "Phim Mới Cập Nhật" - 10 phim → 2 trang
 * 2. hot (10-19):        "Phim Hot Hiện Tại" - 10 phim → 2 trang
 * 3. mostViewed (20-29): "Phim Được Xem Nhiều" - 10 phim → 2 trang
 * 4. trending (30-39):   "Trending Hôm Nay" - 10 phim → 2 trang
 * 5. today (40-49):      "Phim Lẻ Mới Ra Mắt" - 10 phim → 2 trang
 */

import { computed } from 'vue'
import type { Ref } from 'vue'
import { usePagination } from './usePagination'

export function useMovieCategories(allMovies: Ref<any[]>) {
  const moviesPerPage = 5

  // ========== ĐỊNH NGHĨA 5 DANH MỤC ==========
  const categoryMap = {
    new: { name: 'Phim Mới Cập Nhật', startIndex: 0, endIndex: 10 },
    hot: { name: 'Phim Hot Hiện Tại', startIndex: 10, endIndex: 20 },
    mostViewed: { name: 'Phim Được Xem Nhiều', startIndex: 20, endIndex: 30 },
    trending: { name: 'Trending Hôm Nay', startIndex: 30, endIndex: 40 },
    today: { name: 'Phim Lẻ Mới Ra Mắt', startIndex: 40, endIndex: 50 }
  }

  // ========== COMPUTED REF CHO MỖI DANH MỤC ==========
  const newMoviesRef = computed(() =>
    !allMovies.value ? [] : allMovies.value.slice(0, 10)
  )
  const hotMoviesRef = computed(() =>
    !allMovies.value ? [] : allMovies.value.slice(10, 20)
  )
  const mostViewedMoviesRef = computed(() =>
    !allMovies.value ? [] : allMovies.value.slice(20, 30)
  )
  const trendingMoviesRef = computed(() =>
    !allMovies.value ? [] : allMovies.value.slice(30, 40)
  )
  const todayMoviesRef = computed(() =>
    !allMovies.value ? [] : allMovies.value.slice(40, 50)
  )

  // ========== PHÂN TRANG CHO MỖI DANH MỤC ==========
  const {
    currentItems: newMoviesPaginated,
    currentPage: newCurrentPage,
    totalPages: totalPagesNew,
    goToPage: goToPageNew,
    resetPage: resetPageNew
  } = usePagination(newMoviesRef, { itemsPerPage: moviesPerPage })

  const {
    currentItems: hotMoviesPaginated,
    currentPage: hotCurrentPage,
    totalPages: totalPagesHot,
    goToPage: goToPageHot,
    resetPage: resetPageHot
  } = usePagination(hotMoviesRef, { itemsPerPage: moviesPerPage })

  const {
    currentItems: mostViewedPaginated,
    currentPage: mostViewedCurrentPage,
    totalPages: totalPagesMostViewed,
    goToPage: goToPageMostViewed,
    resetPage: resetPageMostViewed
  } = usePagination(mostViewedMoviesRef, { itemsPerPage: moviesPerPage })

  const {
    currentItems: trendingPaginated,
    currentPage: trendingCurrentPage,
    totalPages: totalPagesTrending,
    goToPage: goToPageTrending,
    resetPage: resetPageTrending
  } = usePagination(trendingMoviesRef, { itemsPerPage: moviesPerPage })

  const {
    currentItems: todayPaginated,
    currentPage: todayCurrentPage,
    totalPages: totalPagesToday,
    goToPage: goToPageToday,
    resetPage: resetPageToday
  } = usePagination(todayMoviesRef, { itemsPerPage: moviesPerPage })

  // ========== RESET ALL PAGES ==========
  const resetAllPages = () => {
    resetPageNew()
    resetPageHot()
    resetPageMostViewed()
    resetPageTrending()
    resetPageToday()
  }

  return {
    // Danh mục 1: Phim Mới Cập Nhật
    newMoviesPaginated,
    newCurrentPage,
    totalPagesNew,
    goToPageNew,

    // Danh mục 2: Phim Hot Hiện Tại
    hotMoviesPaginated,
    hotCurrentPage,
    totalPagesHot,
    goToPageHot,

    // Danh mục 3: Phim Được Xem Nhiều
    mostViewedPaginated,
    mostViewedCurrentPage,
    totalPagesMostViewed,
    goToPageMostViewed,

    // Danh mục 4: Trending Hôm Nay
    trendingPaginated,
    trendingCurrentPage,
    totalPagesTrending,
    goToPageTrending,

    // Danh mục 5: Phim Lẻ Mới Ra Mắt
    todayPaginated,
    todayCurrentPage,
    totalPagesToday,
    goToPageToday,

    // Utility
    resetAllPages
  }
}
