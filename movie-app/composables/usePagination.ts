/**
 * usePagination Composable
 * ========================================
 * Generic pagination logic dùng chung cho tất cả trường hợp
 * 
 * Cách sử dụng:
 * const { currentPage, totalPages, currentItems, goToPage } = usePagination(itemsRef, { itemsPerPage: 16 })
 * 
 * Parameters:
 * - items: Ref<T[]> - mảng items cần phân trang
 * - options.itemsPerPage: số item/trang (mặc định: 16)
 * - options.initialPage: trang ban đầu (mặc định: 1)
 * 
 * Returns:
 * - currentPage: Ref<number> - trang hiện tại
 * - totalPages: Ref<number> - tổng số trang
 * - currentItems: Ref<T[]> - items trên trang hiện tại
 * - isFirstPage: boolean - true nếu trang đầu
 * - isLastPage: boolean - true nếu trang cuối
 * - goToPage(page): hàm chuyển đến trang cụ thể
 * - nextPage(): chuyển sang trang tiếp theo
 * - prevPage(): quay lại trang trước
 * - resetPage(): reset về trang 1
 */

import { ref, computed } from 'vue'
import type { Ref } from 'vue'

export interface PaginationOptions {
  itemsPerPage?: number
  initialPage?: number
}

export function usePagination<T>(
  items: Ref<T[]>,
  options: PaginationOptions = {}
) {
  const { itemsPerPage = 16, initialPage = 1 } = options

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

  // ========== METHODS ==========
  /**
   * Chuyển đến trang cụ thể
   * Kiểm tra trang hợp lệ (1 <= page <= totalPages)
   */
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  /**
   * Chuyển sang trang tiếp theo
   * Không vượt quá trang cuối
   */
  const nextPage = () => {
    if (!isLastPage.value) {
      currentPage.value++
    }
  }

  /**
   * Quay lại trang trước
   * Không thấp hơn trang 1
   */
  const prevPage = () => {
    if (!isFirstPage.value) {
      currentPage.value--
    }
  }

  /**
   * Reset về trang 1
   * Dùng khi lọc/tìm kiếm, để user không bị stuck ở trang cao
   */
  const resetPage = () => {
    currentPage.value = 1
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
