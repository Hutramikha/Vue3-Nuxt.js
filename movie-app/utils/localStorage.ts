// ========== LOCALSTORAGE UTILITIES ==========

const FAVORITES_KEY = 'favorites'

// ========== INTERFACE ==========
export interface FavoriteItem {
  movieId: number
  addedAt: number  // Timestamp (milliseconds) khi thêm vào yêu thích
}

// ========== GET FAVORITES ==========
// Trả về mảng các item yêu thích với thông tin timestamp
export const getFavorites = (): FavoriteItem[] => {
  try {
    const data = localStorage.getItem(FAVORITES_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Lỗi đọc danh sách yêu thích:', error)
    return []
  }
}

// ========== SET FAVORITES ==========
export const setFavorites = (favorites: FavoriteItem[]): void => {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  } catch (error) {
    console.error('Lỗi lưu danh sách yêu thích:', error)
  }
}

// ========== ADD FAVORITE TO STORAGE ==========
// Thêm phim với timestamp hiện tại
export const addFavoriteToStorage = (movieId: number): void => {
  const favorites = getFavorites()
  
  // Kiểm tra xem movieId đã tồn tại chưa
  const exists = favorites.some(item => item.movieId === movieId)
  
  if (!exists) {
    favorites.push({
      movieId,
      addedAt: Date.now()  // Timestamp hiện tại
    })
    setFavorites(favorites)
    console.log(`Added to favorites: ${movieId} at ${new Date().toLocaleString()}`)
  }
}

// ========== REMOVE FAVORITE FROM STORAGE ==========
export const removeFavoriteFromStorage = (movieId: number): void => {
  const favorites = getFavorites()
  
  const filtered = favorites.filter(item => item.movieId !== movieId)
  setFavorites(filtered)
  console.log(`Removed from favorites: ${movieId}`)
}

// ========== CHECK IF FAVORITED ==========
export const isFavoritedInStorage = (movieId: number): boolean => {
  const favorites = getFavorites()
  return favorites.some(item => item.movieId === movieId)
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
