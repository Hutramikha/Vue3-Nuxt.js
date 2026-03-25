// ========== NAVIGATION COMPOSABLE ==========
// Xử lý navigation logic: go home, reset filters, reset route

import { useRouter, useRoute } from 'vue-router'

export const useNavigation = () => {
  const router = useRouter()
  const route = useRoute()

  // ========== GO HOME & RESET ALL FILTERS ==========
  const goHome = async () => {
    // Navigate about trang chủ
    await router.push('/')
    
    // Clear tất cả query params
    if (route.query && Object.keys(route.query).length > 0) {
      await router.replace({ query: {} })
    }
  }

  // ========== GO TO MOVIE DETAIL ==========
  const goToMovie = async (movieId: number) => {
    await router.push(`/movies/${movieId}`)
  }

  // ========== GO BACK ==========
  const goBack = () => {
    router.back()
  }

  // ========== CLEAR QUERY PARAMS ==========
  const clearQueryParams = async () => {
    await router.replace({ query: {} })
  }

  // ========== NAVIGATE WITH SEARCH ==========
  const navigateWithSearch = async (searchQuery: string) => {
    await router.push({
      query: { search: searchQuery }
    })
  }

  // ========== NAVIGATE WITH FILTER ==========
  const navigateWithFilter = async (genre?: string, year?: string) => {
    const query: any = {}
    if (genre) query.genre = genre
    if (year) query.year = year
    await router.push({ query })
  }

  return {
    goHome,
    goToMovie,
    goBack,
    clearQueryParams,
    navigateWithSearch,
    navigateWithFilter
  }
}
