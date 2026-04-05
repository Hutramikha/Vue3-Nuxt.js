/**
 * usePagination Composable (Enhanced with URL Sync)
 * ========================================
 * Generic pagination logic với tự động sync URL query params
 * 
 * Cách sử dụng:
 * const { currentPage, totalPages, currentItems, goToPage } = usePagination(
 *   itemsRef, 
 *   { 
 *     itemsPerPage: 16,
 *     queryParamName: 'page'  // Optional: tên query param (mặc định: 'page')
 *   }
 * )
 * 
 * URL Examples:
 * - Search: /index?search=avatar&page=2
 * - Type:   /index?type=single&page=2
 * - Category: /index?category=new&page=2
 * 
 * Parameters:
 * - items: Ref<T[]> - mảng items cần phân trang
 * - options.itemsPerPage: số item/trang (mặc định: 16)
 * - options.initialPage: trang ban đầu (mặc định: 1)
 * - options.queryParamName: tên query parameter (mặc định: 'page')
 * 
 * Returns:
 * - currentPage: Ref<number> - trang hiện tại (synced with URL)
 * - totalPages: Computed<number> - tổng số trang
 * - currentItems: Computed<T[]> - items trên trang hiện tại
 * - isFirstPage: Computed<boolean> - true nếu trang đầu
 * - isLastPage: Computed<boolean> - true nếu trang cuối
 * - goToPage(page): hàm chuyển đến trang cụ thể (update URL)
 * - nextPage(): chuyển sang trang tiếp theo
 * - prevPage(): quay lại trang trước
 * - resetPage(): reset về trang 1
 */

import { ref, computed, watch } from 'vue'
import type { Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export interface PaginationOptions {
  itemsPerPage?: number
  initialPage?: number
  queryParamName?: string
  useUrlSync?: boolean  // ếu true, tự động sync với URL query params
}

export function usePagination<T>(
  items: Ref<T[]>,
  options: PaginationOptions = {}
) {
  const { 
    itemsPerPage = 16, 
    initialPage = 1,
    queryParamName = 'page',
    useUrlSync = false
  } = options

  const route = useRoute()
  const router = useRouter()

  // ========== STATE ==========
  const currentPage = ref(initialPage)

  // ========== COMPUTED ==========
  /**
   * Tính tổng số trang
   * Công thức: Math.ceil(tổng item ÷ item/trang)
   * Ví dụ: 50 item ÷ 16 item/trang = 3.125 → rounded = 4 trang
   */
  const totalPages = computed(() => {
    if (items.value.length === 0) return 1
    return Math.ceil(items.value.length / itemsPerPage)
  })

  /**
   * Lấy items trên trang hiện tại
   * Ví dụ: trang 2, 16 item/trang
   * start = (2 - 1) * 16 = 16
   * end = 16 + 16 = 32
   * return items[16:32]
   */
  const currentItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return items.value.slice(start, end)
  })

  /**
   * Kiểm tra trang đầu tiên
   * Dùng để disable nút "Trước" trên UI
   */
  const isFirstPage = computed(() => currentPage.value === 1)

  /**
   * Kiểm tra trang cuối cùng
   * Dùng để disable nút "Sau" trên UI
   */
  const isLastPage = computed(() => currentPage.value === totalPages.value)

  // ========== URL SYNC ==========
  // Nếu useUrlSync = true, tự động sync currentPage với query param
  if (useUrlSync) {
    // 1. Đọc từ URL khi component mount
    const pageFromUrl = parseInt((route.query[queryParamName] as string) || '1')
    currentPage.value = pageFromUrl

    // 2. Theo dõi URL thay đổi → cập nhật currentPage
    watch(() => route.query[queryParamName], (newPage) => {
      if (newPage) {
        const pageNum = parseInt(newPage as string)
        if (pageNum >= 1 && pageNum <= totalPages.value) {
          currentPage.value = pageNum
        }
      }
    })
  }

  // ========== METHODS ==========
  /**
   * Chuyển đến trang cụ thể
   * Kiểm tra trang hợp lệ (1 <= page <= totalPages)
   * Nếu useUrlSync = true, update URL query params
   */
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
      
      // Nếu dùng URL sync, update route
      if (useUrlSync) {
        router.push({
          query: {
            ...route.query,
            [queryParamName]: page
          }
        })
      }
    }
  }

  /**
   * Chuyển sang trang tiếp theo
   * Không vượt quá trang cuối
   */
  const nextPage = () => {
    if (!isLastPage.value) {
      goToPage(currentPage.value + 1)
    }
  }

  /**
   * Quay lại trang trước
   * Không thấp hơn trang 1
   */
  const prevPage = () => {
    if (!isFirstPage.value) {
      goToPage(currentPage.value - 1)
    }
  }

  /**
   * Reset về trang 1
   * Dùng khi lọc/tìm kiếm, để user không bị stuck ở trang cao
   */
  const resetPage = () => {
    currentPage.value = 1
    
    if (useUrlSync) {
      router.push({
        query: {
          ...route.query,
          [queryParamName]: 1
        }
      })
    }
  }

  return {
    // State
    currentPage,

    // Computed
    totalPages,
    currentItems,
    isFirstPage,
    isLastPage,

    // Methods
    goToPage,
    nextPage,
    prevPage,
    resetPage
  }
}
