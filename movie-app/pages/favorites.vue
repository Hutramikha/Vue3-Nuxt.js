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
// favoriteMovies: Filter movies từ API based on favorite IDs
const favoriteMovies = computed(() => {
  if (!allMovies.value) return []
  
  return allMovies.value.filter((movie: any) => 
    movieStore.isFavorited(movie.id)
  )
})

// isEmpty: Check nếu không có favorite movies
const isEmpty = computed(() => {
  return favoriteMovies.value.length === 0
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
            <p class="text-gray-400 mt-1">{{ favoriteMovies.length }} phim</p>
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
      <p class="text-gray-500 mb-8">Hãy thêm những bộ phim bạn yêu thích bằng cách nhấp vào nút ❤️</p>
      <button
        @click="backToHome"
        class="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition"
      >
        Khám Phá Phim
      </button>
    </div>

    <!-- Favorites Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-12">
      <MovieCard 
        v-for="movie in favoriteMovies" 
        :key="movie.id" 
        :movie="movie"
      />
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
