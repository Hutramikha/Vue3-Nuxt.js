// ========== LOCALSTORAGE UTILITIES ==========
// Quản lý lưu trữ dữ liệu cục bộ: danh sách phim yêu thích

// ========== FAVORITES - YÊU THÍCH PHIM ==========

const FAVORITES_KEY = 'favorites'

// ========== GET FAVORITES ==========
// Trả về array của tất cả favorite movie IDs
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
// Lưu toàn bộ danh sách yêu thích
export const setFavorites = (favorites: number[]): void => {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  } catch (error) {
    console.error('Lỗi lưu danh sách yêu thích:', error)
  }
}

// ========== ADD FAVORITE TO STORAGE ==========
// Thêm một phim vào yêu thích
export const addFavoriteToStorage = (movieId: number): void => {
  const favorites = getFavorites()
  
  // Nếu chưa có thì thêm
  if (!favorites.includes(movieId)) {
    favorites.push(movieId)
    setFavorites(favorites)
    console.log(`✅ Added to favorites: ${movieId}`)
  }
}

// ========== REMOVE FAVORITE FROM STORAGE ==========
// Xóa một phim khỏi yêu thích
export const removeFavoriteFromStorage = (movieId: number): void => {
  const favorites = getFavorites()
  
  const filtered = favorites.filter(id => id !== movieId)
  setFavorites(filtered)
  console.log(`❌ Removed from favorites: ${movieId}`)
}

// ========== CHECK IF FAVORITED ==========
// Kiểm tra xem phim có trong danh sách yêu thích không
export const isFavoritedInStorage = (movieId: number): boolean => {
  const favorites = getFavorites()
  return favorites.includes(movieId)
}

// ========== CLEAR ALL FAVORITES ==========
// Xóa toàn bộ danh sách yêu thích
export const clearAllFavorites = (): void => {
  try {
    localStorage.removeItem(FAVORITES_KEY)
    console.log('🗑️ Cleared all favorites')
  } catch (error) {
    console.error('Lỗi xóa danh sách yêu thích:', error)
  }
}
