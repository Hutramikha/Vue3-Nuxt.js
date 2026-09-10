import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  getFavorites, 
  setFavorites, 
  addFavoriteToStorage, 
  removeFavoriteFromStorage,
  type FavoriteItem
} from '~/utils/localStorage'

export const useMovieStore = defineStore('movie', () => {
  // ========== STATE ==========
  // favorites: Map ID phim → timestamp (thời gian thêm vào yêu thích)
  const favorites = ref<Map<number, number>>(new Map())

  // ========== INIT ==========
  const initFavorites = () => {
    const savedFavorites = getFavorites()
    favorites.value = new Map(savedFavorites.map(item => [item.movieId, item.addedAt]))
  }

  // ========== COMPUTED ==========
  const favoriteIds = computed(() => {
    return Array.from(favorites.value.keys())
  })

  const favoriteCount = computed(() => {
    return favorites.value.size
  })

  // Trả về danh sách yêu thích với timestamp, sắp xếp theo thời gian (mới nhất trước)
  const getFavoritesWithTimestamp = computed(() => {
    const items: FavoriteItem[] = Array.from(favorites.value.entries()).map(([movieId, addedAt]) => ({
      movieId,
      addedAt
    }))
    // Sắp xếp theo thời gian: mới nhất trước
    return items.sort((a, b) => b.addedAt - a.addedAt)
  })

  // ========== METHODS ==========
  const isFavorited = (movieId: number): boolean => {
    return favorites.value.has(movieId)
  }

  const addFavorite = async (movieId: number): Promise<void> => {
    if (!favorites.value.has(movieId)) {
      favorites.value.set(movieId, Date.now())
      addFavoriteToStorage(movieId)
      
      console.log(`Added to favorites: ${movieId}`)
    }
  }

  const removeFavorite = async (movieId: number): Promise<void> => {
    if (favorites.value.has(movieId)) {
      favorites.value.delete(movieId)
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
    getFavoritesWithTimestamp,

    // Methods
    initFavorites,
    isFavorited,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearAllFavorites
  }
})
