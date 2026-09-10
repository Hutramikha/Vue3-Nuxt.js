<script setup lang="ts">
/**
 * Trang Phim Yêu Thích - Favorites Page
 * Hiển thị danh sách tất cả phim mà người dùng đã yêu thích
 */

import { computed, onMounted, ref } from 'vue'
import { useMovieStore } from '~/stores/movieStore'
import { useNavigation } from '~/composables/useNavigation'

// ========== SEO OPTIMIZATION ==========
// Meta tags cho trang yêu thích
useHead({
  title: 'Phim Yêu Thích | KHANLIX',
  meta: [
    {
      name: 'description',
      content: 'Danh sách các bộ phim yêu thích của bạn trên KHANLIX. Quản lý và xem lại những bộ phim bạn yêu thích'
    },
    {
      name: 'keywords',
      content: 'phim yêu thích, danh sách yêu thích, phim lưu trữ'
    },
    {
      property: 'og:title',
      content: 'Phim Yêu Thích | KHANLIX'
    },
    {
      property: 'og:description',
      content: 'Xem danh sách những bộ phim yêu thích của bạn'
    }
  ]
})

// ========== MOVIE STORE ==========
const movieStore = useMovieStore()

// ========== NAVIGATION ==========
const { goHome } = useNavigation()

// ========== STATE ==========
const isLoading = ref(true)
const { data: allMovies } = await useFetch('/api/movies')
isLoading.value = false

// ========== INIT FAVORITES ==========
// Load favorites từ localStorage khi component mount
onMounted(() => {
  movieStore.initFavorites()
})

// ========== COMPUTED ==========
// favoriteMoviesSorted: Trả về danh sách phim yêu thích sắp xếp theo thời gian
// (Mới nhất thêm vào sẽ hiển thị đầu tiên)
const favoriteMoviesSorted = computed(() => {
  if (!allMovies.value) return []
  
  // Lấy danh sách ID phim yêu thích theo thứ tự thời gian (mới nhất trước)
  const sortedFavIds = movieStore.getFavoritesWithTimestamp.map(item => item.movieId)
  
  // Filter movies từ API và sắp xếp theo thứ tự
  const sortedMovies = sortedFavIds.map(id => 
    allMovies.value!.find((movie: any) => movie.id === id)
  ).filter(Boolean)
  
  return sortedMovies
})

// getFavoriteTimestamp: Hàm helper để lấy timestamp của một phim
const getFavoriteTimestamp = (movieId: number): number | undefined => {
  const item = movieStore.getFavoritesWithTimestamp.find(item => item.movieId === movieId)
  return item?.addedAt
}

// formatAddedDate: Hàm helper để format ngày tháng dạng DD/MM/YYYY
const formatAddedDate = (timestamp: number): string => {
  const date = new Date(timestamp)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

// isEmpty: Check nếu không có favorite movies
const isEmpty = computed(() => {
  return favoriteMoviesSorted.value.length === 0
})

// ========== METHODS ==========
// Quay lại trang chủ
const backToHome = async () => {
  await goHome()
}

// Xóa tất cả yêu thích
const clearAllFavorites = () => {
  if (confirm('Bạn có chắc chắn muốn xóa tất cả phim yêu thích? Hành động này không thể hoàn tác.')) {
    movieStore.clearAllFavorites()
  }
}
</script>

<template>
  <div>
    <!-- Loading -->
    <LoadingSpinner :isVisible="isLoading" />

    <!-- Header Section -->
    <div class="mb-12">
      <div class="flex items-center justify-between mb-8">
        <!-- Tiêu Đề + Số Lượng -->
        <div class="flex items-center gap-3">
          <Icon name="heroicons-solid:heart" class="w-8 h-8 text-emerald-500" />
          <div>
            <h1 class="text-4xl font-bold text-white">Phim Yêu Thích</h1>
            <p class="text-gray-400 mt-1">{{ favoriteMoviesSorted.length }} phim • Sắp xếp: Mới nhất trước</p>
          </div>
        </div>

        <!-- Buttons: Xóa tất cả + Quay lại -->
        <div class="flex items-center gap-3">
          <!-- Xóa tất cả (Chỉ hiển thị khi có phim yêu thích) -->
          <button 
            v-if="!isEmpty"
            @click="clearAllFavorites"
            class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition flex items-center gap-2 shadow-lg"
            title="Xóa tất cả phim yêu thích"
          >
            <Icon name="heroicons-solid:trash" class="w-5 h-5" />
            Xóa Tất Cả
          </button>

          <!-- Back Button -->
          <button 
            @click="backToHome"
            class="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition flex items-center gap-2 shadow-lg"
          >
            <Icon name="heroicons-solid:arrow-left" class="w-5 h-5" />
            Quay Lại
          </button>
        </div>
      </div>

      <!-- Separator -->
      <div class="h-px bg-gradient-to-r from-emerald-600/50 via-emerald-600 to-emerald-600/50"></div>
    </div>

    <!-- Empty State -->
    <div v-if="isEmpty && !isLoading" class="flex flex-col items-center justify-center py-20">
      <Icon name="heroicons-solid:heart-slash" class="w-20 h-20 text-gray-600 mb-4" />
      <h2 class="text-3xl font-bold text-gray-400 mb-2">Chưa Có Phim Yêu Thích</h2>
      <p class="text-gray-500 mb-8">Hãy thêm những bộ phim bạn yêu thích bằng cách nhấp vào nút <Icon name="heroicons-solid:heart" class="w-5 h-5 text-emerald-500 inline-block" /></p>
      <button
        @click="backToHome"
        class="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition"
      >
        Khám Phá Phim
      </button>
    </div>

    <!-- Favorites Grid with Timeline Info -->
    <div v-else class="pb-12">
      <!-- Timeline View -->
      <div class="space-y-6">
        <div 
          v-for="movie in favoriteMoviesSorted"
          :key="movie.id"
          class="flex gap-4 items-start p-4 rounded-lg border border-emerald-600/30 hover:border-emerald-600/60 hover:bg-emerald-600/5 transition"
        >
          <!-- Poster + Timeline -->
          <div class="flex flex-col items-center gap-2">
            <!-- Timeline Dot -->
            <div class="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50 mt-1"></div>
            <!-- Poster Thumbnail -->
            <NuxtImg 
              :src="movie.poster" 
              :alt="movie.title"
              class="w-16 h-24 object-cover rounded-md border border-emerald-600/30"
            />
          </div>

          <!-- Movie Info -->
          <div class="flex-1 pt-1">
            <!-- Tên Phim -->
            <h3 class="text-lg font-bold text-white hover:text-emerald-400 transition line-clamp-2 mb-2">
              {{ movie.title }}
            </h3>
            
            <!-- Năm + Thể loại -->
            <p class="text-sm text-gray-400 mb-3">
              {{ movie.year }} • {{ movie.genre }}
            </p>
            
            <!-- Đánh giá -->
            <div class="flex items-center gap-1 text-emerald-400 text-sm font-semibold">
              <Icon name="heroicons-solid:star" class="w-4 h-4" />
              {{ movie.rating }}/10
            </div>
          </div>

          <!-- Ngày Thêm Vào (Bên Phải) -->
          <div class="flex flex-col items-end gap-2">
            <div class="flex items-center gap-2 bg-emerald-600/20 px-3 py-2 rounded-lg border border-emerald-600/40">
              <Icon name="heroicons-solid:calendar" class="w-4 h-4 text-emerald-400" />
              <span class="text-sm font-bold text-emerald-400">
                {{ formatAddedDate(getFavoriteTimestamp(movie.id) || Date.now()) }}
              </span>
            </div>
            
            <!-- Nút Action -->
            <NuxtLink 
              :to="`/movies/${movie.id}`"
              class="px-3 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition font-semibold"
            >
              Xem Chi Tiết
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Smooth transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
