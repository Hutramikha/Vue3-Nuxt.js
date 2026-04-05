// ========== MOVIE STORE (PINIA) ==========
// Quản lý state: favorites

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  getFavorites, 
  setFavorites, 
  addFavoriteToStorage, 
  removeFavoriteFromStorage 
} from '~/utils/localStorage'

export const useMovieStore = defineStore('movie', () => {
  // ========== STATE ==========
  
  // favorites: Map ID phim → favorited (true/false)
  // Dùng Map để O(1) lookup khi check favorite status
  const favorites = ref<Map<number, boolean>>(new Map())

  // ========== INIT ==========
  
  // Tải favorites từ localStorage khi store khởi tạo
  const initFavorites = () => {
    const savedFavorites = getFavorites()
    favorites.value = new Map(savedFavorites.map(id => [id, true]))
  }

  // ========== COMPUTED ==========

  // favoriteIds: Trả về array của tất cả favorite movie IDs
  const favoriteIds = computed(() => {
    return Array.from(favorites.value.keys())
  })

  // favoriteCount: Số lượng phim yêu thích
  const favoriteCount = computed(() => {
    return favorites.value.size
  })

  // ========== METHODS ==========

  // isFavorited(movieId): Check xem phim có là favorite không
  const isFavorited = (movieId: number): boolean => {
    return favorites.value.has(movieId)
  }

  // addFavorite(movieId): Thêm phim vào yêu thích
  const addFavorite = async (movieId: number): Promise<void> => {
    if (!favorites.value.has(movieId)) {
      favorites.value.set(movieId, true)
      
      // Lưu vào localStorage
      addFavoriteToStorage(movieId)
      
      console.log(`Added to favorites: ${movieId}`)
    }
  }

  // removeFavorite(movieId): Xóa phim khỏi yêu thích
  const removeFavorite = async (movieId: number): Promise<void> => {
    if (favorites.value.has(movieId)) {
      favorites.value.delete(movieId)
      
      // Xóa khỏi localStorage
      removeFavoriteFromStorage(movieId)
      
      console.log(`Removed from favorites: ${movieId}`)
    }
  }

  // toggleFavorite(movieId): Toggle favorite status (add/remove)
  const toggleFavorite = async (movieId: number): Promise<boolean> => {
    if (isFavorited(movieId)) {
      await removeFavorite(movieId)
      return false
    } else {
      await addFavorite(movieId)
      return true
    }
  }

  // clearAllFavorites(): Xóa tất cả favorites
  const clearAllFavorites = (): void => {
    favorites.value.clear()
    setFavorites([])
    console.log('Cleared all favorites')
  }

  return {
    // State
    favorites,

    // Computed
    favoriteIds,
    favoriteCount,

    // Methods
    initFavorites,
    isFavorited,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearAllFavorites
  }
})
