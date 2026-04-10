// ========== LOCALSTORAGE UTILITIES ==========

const FAVORITES_KEY = 'favorites'

// ========== GET FAVORITES ==========
export const getFavorites = (): number[] => {
  try {
    const data = localStorage.getItem(FAVORITES_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Lỗi đọc danh sách yêu thích:', error)
    return []
  }
}

// ========== SET FAVORITES ==========
export const setFavorites = (favorites: number[]): void => {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  } catch (error) {
    console.error('Lỗi lưu danh sách yêu thích:', error)
  }
}

// ========== ADD FAVORITE TO STORAGE ==========
export const addFavoriteToStorage = (movieId: number): void => {
  const favorites = getFavorites()
  
  if (!favorites.includes(movieId)) {
    favorites.push(movieId)
    setFavorites(favorites)
    console.log(`Added to favorites: ${movieId}`)
  }
}

// ========== REMOVE FAVORITE FROM STORAGE ==========
export const removeFavoriteFromStorage = (movieId: number): void => {
  const favorites = getFavorites()
  
  const filtered = favorites.filter(id => id !== movieId)
  setFavorites(filtered)
  console.log(`Removed from favorites: ${movieId}`)
}

// ========== CHECK IF FAVORITED ==========
export const isFavoritedInStorage = (movieId: number): boolean => {
  const favorites = getFavorites()
  return favorites.includes(movieId)
}

// ========== CLEAR ALL FAVORITES ==========
export const clearAllFavorites = (): void => {
  try {
    localStorage.removeItem(FAVORITES_KEY)
    console.log('Cleared all favorites')
  } catch (error) {
    console.error('Lỗi xóa danh sách yêu thích:', error)
  }
}
