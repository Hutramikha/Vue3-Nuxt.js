// ========== HEADER LAYOUT COMPOSABLE ==========
// Quản lý tất cả state và logic của header component

import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNavigation } from '~/composables/useNavigation'

export const useHeader = () => {
  const route = useRoute()
  const router = useRouter()
  const { goHome: navigateHome } = useNavigation()

  // ========== AUTH MODAL STATE ==========
  // showAuthModal: kiểm soát việc hiển thị/ẩn modal auth
  const showAuthModal = ref(false)

  // authMode: lưu trữ chế độ hiện tại ('login' hoặc 'register')
  const authMode = ref('login')

  // ========== CATEGORY DROPDOWN STATE ==========
  // showCategoryDropdown: kiểm soát việc hiển thị/ẩn dropdown danh mục
  const showCategoryDropdown = ref(false)

  // ========== SEARCH STATE ==========
  // searchInput: lưu từ khóa tìm kiếm tạm thời
  const searchInput = ref('')

  // ========== FUNCTIONS ==========

  // openAuthModal(mode): mở modal auth với chế độ cụ thể
  // Tham số mode: 'login' hoặc 'register'
  const openAuthModal = (mode: 'login' | 'register') => {
    authMode.value = mode
    showAuthModal.value = true
  }

  // closeAuthModal(): đóng modal auth
  const closeAuthModal = () => {
    showAuthModal.value = false
  }

  // handleSearch(): xử lý tìm kiếm khi user bấm Enter
  // Cập nhật route.query với giá trị tìm kiếm hiện tại
  const handleSearch = async () => {
    if (searchInput.value.trim()) {
      await router.push({ query: { search: searchInput.value } })
      searchInput.value = ''
    }
  }

  // filterBySingleMovies(): lọc phim lẻ
  // Khi user click nút "Phim Lẻ" trên header
  const filterBySingleMovies = async () => {
    await router.push({ query: { type: 'single' } })
    showCategoryDropdown.value = false
  }

  // filterBySeriesMovies(): lọc phim bộ (series)
  // Khi user click nút "Phim Bộ" trên header
  const filterBySeriesMovies = async () => {
    await router.push({ query: { type: 'series' } })
    showCategoryDropdown.value = false
  }

  // filterByGenre(genre): lọc phim theo thể loại
  // Khi user click vào thể loại trong dropdown danh mục
  const filterByGenre = async (genre: string) => {
    await router.push({ query: { genre } })
    showCategoryDropdown.value = false
  }

  // filterByYear(year): lọc phim theo năm
  // Khi user click vào năm trong dropdown danh mục
  const filterByYear = async (year: string) => {
    await router.push({ query: { year } })
    showCategoryDropdown.value = false
  }

  // filterByRating(): lọc phim theo rating cao
  const filterByRating = async () => {
    await router.push({ query: { sortBy: 'rating' } })
    showCategoryDropdown.value = false
  }

  // filterByNew(): lọc phim mới nhất
  const filterByNew = async () => {
    await router.push({ query: { sortBy: 'newest' } })
    showCategoryDropdown.value = false
  }

  // filterByViewed(): lọc phim xem nhiều nhất
  const filterByViewed = async () => {
    await router.push({ query: { sortBy: 'viewed' } })
    showCategoryDropdown.value = false
  }

  // clearFilters(): xóa tất cả filter
  const clearFilters = async () => {
    await router.push({ query: {} })
    searchInput.value = ''
    showCategoryDropdown.value = false
  }

  // toggleCategoryDropdown(): bật/tắt dropdown danh mục
  const toggleCategoryDropdown = (state?: boolean) => {
    if (state !== undefined) {
      showCategoryDropdown.value = state
    } else {
      showCategoryDropdown.value = !showCategoryDropdown.value
    }
  }

  // goHome(): quay lại trang chủ và xóa tất cả filter/search
  // Được gọi khi click vào logo hoặc nút "Trang chủ"
  const goHome = async () => {
    await clearFilters()
    await navigateHome()
  }

  // ========== WATCHERS ==========

  // Watch route.query.search để cập nhật searchInput từ URL
  // Khi user vào từ URL với search param, cập nhật input value
  watch(
    () => route.query.search,
    (newVal) => {
      searchInput.value = (newVal as string) || ''
    }
  )

  // Auto-close dropdown khi navigate
  watch(
    () => route.path,
    () => {
      showCategoryDropdown.value = false
    }
  )

  return {
    // Auth Modal
    showAuthModal,
    authMode,
    openAuthModal,
    closeAuthModal,

    // Category Dropdown
    showCategoryDropdown,
    toggleCategoryDropdown,

    // Search
    searchInput,
    handleSearch,

    // Movie Type Filters
    filterBySingleMovies,
    filterBySeriesMovies,

    // Category Filters
    filterByGenre,
    filterByYear,
    filterByRating,
    filterByNew,
    filterByViewed,

    // Navigation
    goHome,
    clearFilters
  }
}
