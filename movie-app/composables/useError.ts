// ========== ERROR HANDLING COMPOSABLE ==========
// Quản lý error state và display error messages

import { ref, computed } from 'vue'

export interface AppError {
  message: string
  code?: string | number
  timestamp?: Date
}

export const useErrorHandler = () => {
  // ========== STATE ==========
  
  // errors: Danh sách lỗi
  const errors = ref<AppError[]>([])

  // isError: Check có lỗi nào không
  const isError = computed(() => errors.value.length > 0)

  // lastError: Lấy lỗi gần nhất
  const lastError = computed(() => {
    return errors.value[errors.value.length - 1] || null
  })

  // ========== METHODS ==========

  // addError: Thêm lỗi mới
  const addError = (message: string, code?: string | number): void => {
    errors.value.push({
      message,
      code,
      timestamp: new Date()
    })

    console.error(`[ERROR] ${message}`, code ? `(${code})` : '')

    // Auto remove error sau 5 seconds
    setTimeout(() => {
      clearError(0)
    }, 5000)
  }

  // clearError: Xóa lỗi theo index
  const clearError = (index: number): void => {
    errors.value.splice(index, 1)
  }

  // clearAllErrors: Xóa tất cả lỗi
  const clearAllErrors = (): void => {
    errors.value = []
  }

  // handleApiError: Xử lý lỗi từ API
  const handleApiError = (error: any, defaultMessage: string = 'Đã xảy ra lỗi'): void => {
    let errorMessage = defaultMessage

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.message) {
      errorMessage = error.message
    }

    const errorCode = error.response?.status || error.code

    addError(errorMessage, errorCode)
  }

  // handleNetworkError: Xử lý lỗi mạng
  const handleNetworkError = (): void => {
    addError('Mất kết nối internet. Vui lòng kiểm tra kết nối của bạn.')
  }

  // handleNotFoundError: Xử lý lỗi 404
  const handleNotFoundError = (resource: string = 'Tài nguyên'): void => {
    addError(`${resource} không tìm thấy.`, 404)
  }

  // handleValidationError: Xử lý lỗi validation
  const handleValidationError = (errors_list: string[]): void => {
    errors_list.forEach(error => addError(error))
  }

  return {
    // State
    errors,
    isError,
    lastError,

    // Methods
    addError,
    clearError,
    clearAllErrors,
    handleApiError,
    handleNetworkError,
    handleNotFoundError,
    handleValidationError
  }
}
