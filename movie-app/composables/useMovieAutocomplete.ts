/**
 * useMovieAutocomplete Composable
 * ========================================
 * Chức năng: Quản lý tự động hoàn thành tìm kiếm phim
 * 
 * Tính năng:
 * - Lọc phim theo từ khóa nhập vào (real-time)
 * - Debounce 300ms để tối ưu hiệu suất
 * - Lưu cache lịch sử tìm kiếm (top 10 search queries)
 * - Trả về danh sách gợi ý có max 8 kết quả
 * - Highlight từ khóa trôi trong tên phim
 */

import { computed, ref, watch, onMounted } from 'vue'

interface MovieSuggestion {
  id: number
  title: string
  genre: string
  year?: number
  poster?: string
  highlighted?: string // Tên phim với từ khóa được highlight
}

interface SearchHistory {
  query: string
  timestamp: number
}

export function useMovieAutocomplete(allMovies: any) {
  // ========== STATE ==========
  const inputQuery = ref('')
  const debouncedQuery = ref('')
  const recentSearches = ref<SearchHistory[]>([])
  const MAX_SUGGESTIONS = 8
  const MAX_HISTORY = 10
  const DEBOUNCE_DELAY = 300

  // ========== LOAD SEARCH HISTORY FROM LOCALSTORAGE ==========
  onMounted(() => {
    const savedSearches = localStorage.getItem('movieSearchHistory')
    if (savedSearches) {
      try {
        recentSearches.value = JSON.parse(savedSearches)
      } catch (e) {
        recentSearches.value = []
      }
    }
  })

  // ========== DEBOUNCE INPUT ==========
  let debounceTimer: ReturnType<typeof setTimeout>
  watch(inputQuery, (newQuery) => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      debouncedQuery.value = newQuery
    }, DEBOUNCE_DELAY)
  })

  // ========== HELPER: HIGHLIGHT KEYWORD IN TITLE ==========
  const highlightKeyword = (text: string, keyword: string): string => {
    if (!keyword) return text
    const regex = new RegExp(`(${keyword})`, 'gi')
    return text.replace(regex, '<mark>$1</mark>')
  }

  // ========== COMPUTED: SUGGESTIONS ==========
  const suggestions = computed((): MovieSuggestion[] => {
    // Nếu input trống, trả về danh sách tìm kiếm gần đây
    if (!debouncedQuery.value.trim()) {
      return recentSearches.value
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, MAX_HISTORY)
        .map(search => ({
          id: 0,
          title: search.query,
          genre: 'Gần đây',
          highlighted: search.query
        }))
    }

    // Filter phim theo từ khóa
    const query = debouncedQuery.value.toLowerCase().trim()
    return allMovies.value
      .filter((movie: any) => {
        return (
          movie.title.toLowerCase().includes(query) ||
          movie.genre.toLowerCase().includes(query)
        )
      })
      .slice(0, MAX_SUGGESTIONS)
      .map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        genre: movie.genre,
        year: movie.year,
        poster: movie.poster,
        highlighted: highlightKeyword(movie.title, debouncedQuery.value)
      }))
  })

  // ========== FUNCTION: ADD TO SEARCH HISTORY ==========
  const addToSearchHistory = (query: string) => {
    if (!query.trim()) return

    // Xóa query cũ nếu tồn tại (để tránh duplicate)
    recentSearches.value = recentSearches.value.filter(
      search => search.query.toLowerCase() !== query.toLowerCase()
    )

    // Thêm query mới vào đầu
    recentSearches.value.unshift({
      query: query.trim(),
      timestamp: Date.now()
    })

    // Giới hạn lịch sử tối đa MAX_HISTORY
    if (recentSearches.value.length > MAX_HISTORY) {
      recentSearches.value.pop()
    }

    // Lưu vào localStorage
    localStorage.setItem('movieSearchHistory', JSON.stringify(recentSearches.value))
  }

  // ========== FUNCTION: CLEAR SEARCH HISTORY ==========
  const clearSearchHistory = () => {
    recentSearches.value = []
    localStorage.removeItem('movieSearchHistory')
  }

  // ========== FUNCTION: REMOVE SINGLE HISTORY ITEM ==========
  const removeFromHistory = (query: string) => {
    recentSearches.value = recentSearches.value.filter(
      search => search.query !== query
    )
    localStorage.setItem('movieSearchHistory', JSON.stringify(recentSearches.value))
  }

  return {
    // State
    inputQuery,
    suggestions,
    recentSearches,

    // Methods
    addToSearchHistory,
    clearSearchHistory,
    removeFromHistory
  }
}
