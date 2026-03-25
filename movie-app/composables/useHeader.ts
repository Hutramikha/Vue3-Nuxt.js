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
    }
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
    searchInput.value = ''
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

    // Navigation
    goHome
  }
}
