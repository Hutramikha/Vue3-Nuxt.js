// ========== API UTILITIES WITH ERROR HANDLING ==========
// Wrapper cho useFetch với error handling tích hợp

import { useErrorHandler } from '~/composables/useError'
import { ref, watch } from 'vue'

export const useApi = () => {
  const { handleApiError, handleNetworkError } = useErrorHandler()

  // ========== SAFE FETCH WITH ERROR HANDLING ==========
  const safeFetch = async <T = any>(
    url: string,
    options: any = {}
  ): Promise<{ data: T | null; error: any | null }> => {
    try {
      // Check network connection
      if (!navigator.onLine) {
        handleNetworkError()
        return { data: null, error: new Error('Mất kết nối internet') }
      }

      // Perform fetch
      const response = await fetch(url, options)

      // Check if response is ok
      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}`)
        handleApiError(error)
        return { data: null, error }
      }

      // Parse JSON
      const data = await response.json()
      return { data, error: null }
    } catch (error: any) {
      handleApiError(error)
      return { data: null, error }
    }
  }

  // ========== NUXT USEFETCH WITH ERROR WRAPPER ==========
  // Wrapper cho useFetch để tích hợp error handling
  const fetchWithError = async <T = any>(url: string) => {
    try {
      if (!navigator.onLine) {
        handleNetworkError()
        return { data: ref(null), error: ref(new Error('Mất kết nối internet')) }
      }

      const { data, error } = await useFetch<T>(url)

      // Monitor for errors
      watch(error, (newError) => {
        if (newError) {
          handleApiError(newError)
        }
      })

      return { data, error }
    } catch (err: any) {
      handleApiError(err)
      return { data: ref(null), error: ref(err) }
    }
  }

  return {
    safeFetch,
    fetchWithError
  }
}
