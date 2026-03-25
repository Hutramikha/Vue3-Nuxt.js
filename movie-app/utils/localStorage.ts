// ========== LOCALSTORAGE UTILITIES ==========
// Quản lý lưu trữ dữ liệu cục bộ: lịch sử xem, progress phim

const WATCH_HISTORY_KEY = 'watchHistory'
const MOVIE_PROGRESS_KEY = 'movieProgress'

// ========== GET WATCH HISTORY ==========
export const getWatchHistory = () => {
  try {
    const data = localStorage.getItem(WATCH_HISTORY_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Lỗi đọc lịch sử xem:', error)
    return []
  }
}

// ========== SET WATCH HISTORY ==========
export const setWatchHistory = (history: any[]) => {
  try {
    localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(history))
  } catch (error) {
    console.error('Lỗi lưu lịch sử xem:', error)
  }
}

// ========== ADD TO WATCH HISTORY ==========
export const addToWatchHistory = (movieId: number, movieTitle: string) => {
  const history = getWatchHistory()
  
  // Xóa phim nếu đã tồn tại
  const filtered = history.filter((item: any) => item.id !== movieId)
  
  // Thêm vào đầu với timestamp
  filtered.unshift({
    id: movieId,
    title: movieTitle,
    watchedAt: new Date().toISOString()
  })
  
  // Chỉ lưu 20 phim gần đây
  setWatchHistory(filtered.slice(0, 20))
}

// ========== GET MOVIE PROGRESS ==========
export const getMovieProgress = (movieId: number) => {
  try {
    const data = localStorage.getItem(MOVIE_PROGRESS_KEY)
    if (!data) return null
    
    const progress = JSON.parse(data)
    return progress[movieId] || null
  } catch (error) {
    console.error('Lỗi đọc tiến độ phim:', error)
    return null
  }
}

// ========== SET MOVIE PROGRESS ==========
export const setMovieProgress = (movieId: number, currentTime: number, duration: number) => {
  try {
    const data = localStorage.getItem(MOVIE_PROGRESS_KEY)
    const progress = data ? JSON.parse(data) : {}
    
    progress[movieId] = {
      currentTime,
      duration,
      lastWatched: new Date().toISOString(),
      percentage: (currentTime / duration) * 100
    }
    
    localStorage.setItem(MOVIE_PROGRESS_KEY, JSON.stringify(progress))
  } catch (error) {
    console.error('Lỗi lưu tiến độ phim:', error)
  }
}

// ========== CLEAR WATCH HISTORY ==========
export const clearWatchHistory = () => {
  try {
    localStorage.removeItem(WATCH_HISTORY_KEY)
  } catch (error) {
    console.error('Lỗi xóa lịch sử xem:', error)
  }
}

// ========== CLEAR MOVIE PROGRESS ==========
export const clearMovieProgress = (movieId?: number) => {
  try {
    if (movieId) {
      const data = localStorage.getItem(MOVIE_PROGRESS_KEY)
      if (data) {
        const progress = JSON.parse(data)
        delete progress[movieId]
        localStorage.setItem(MOVIE_PROGRESS_KEY, JSON.stringify(progress))
      }
    } else {
      localStorage.removeItem(MOVIE_PROGRESS_KEY)
    }
  } catch (error) {
    console.error('Lỗi xóa tiến độ phim:', error)
  }
}

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
