<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'

const router = useRouter()

// State
const allMovies = ref<any[]>([])
const isLoading = ref(true)

// Lấy lịch sử từ localStorage
const history = computed(() => {
  const data = localStorage.getItem('movieWatchHistory')
  if (!data) return []
  try {
    const parsed = JSON.parse(data)
    return Array.isArray(parsed) ? parsed : Object.values(parsed)
  } catch {
    return []
  }
})

// Danh sách phim đã xem
const watchedMovies = computed(() => {
  return history.value
    .map((item: any) => {
      const movie = allMovies.value.find(m => m.id === item.movieId)
      return movie ? { ...movie, watchedAt: item.lastWatchedAt } : null
    })
    .filter(Boolean)
})

// Tải phim
const fetchMovies = async () => {
  try {
    isLoading.value = true
    const res = await fetch('/api/movies')
    allMovies.value = await res.json()
  } catch (error) {
    console.error('Lỗi tải phim:', error)
  } finally {
    isLoading.value = false
  }
}

// Format ngày
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('vi-VN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => fetchMovies())

const goToMovie = (id: number) => router.push(`/movies/${id}`)
const goBack = () => router.back()
const clearHistory = () => {
  if (confirm('Xóa toàn bộ lịch sử?')) {
    localStorage.removeItem('movieWatchHistory')
    location.reload()
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 py-8">
    <!-- Header -->
    <div class="max-w-6xl mx-auto px-4 mb-8">
      <div class="flex items-center justify-between gap-4 mb-6">
        <button
          @click="goBack"
          class="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm font-medium"
        >
          <Icon name="heroicons-solid:arrow-left" class="w-5 h-5" />
          Quay lại
        </button>

        <button
          v-if="watchedMovies.length > 0"
          @click="clearHistory"
          class="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-sm font-medium"
        >
          <Icon name="heroicons-solid:trash" class="w-5 h-5" />
          Xóa Lịch Sử
        </button>
      </div>

      <h1 class="text-4xl font-bold mb-2">📺 Lịch Sử Xem</h1>
      <p class="text-slate-400">{{ watchedMovies.length }} phim đã xem</p>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="max-w-6xl mx-auto px-4">
      <div class="space-y-4">
        <div v-for="i in 5" :key="i" class="flex gap-4 p-4 rounded-lg bg-slate-700 animate-pulse">
          <div class="w-20 h-32 rounded bg-slate-600"></div>
          <div class="flex-1">
            <div class="h-4 bg-slate-600 rounded w-1/3 mb-2"></div>
            <div class="h-3 bg-slate-600 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Danh sách -->
    <div v-else class="max-w-6xl mx-auto px-4">
      <div v-if="watchedMovies.length > 0" class="space-y-4">
        <div
          v-for="movie in watchedMovies"
          :key="movie.id"
          @click="goToMovie(movie.id)"
          class="flex gap-4 p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 cursor-pointer transition group"
        >
          <div class="flex-shrink-0 w-20 h-32 rounded overflow-hidden bg-slate-700">
            <NuxtImg
              :src="movie.poster"
              :alt="movie.title"
              class="w-full h-full object-cover group-hover:scale-105 transition"
              loading="lazy"
            />
          </div>

          <div class="flex-1">
            <h3 class="text-lg font-bold group-hover:text-red-500">{{ movie.title }}</h3>
            <p class="text-sm text-slate-400">{{ movie.year }}</p>
            <p class="text-sm text-slate-300 mt-2 line-clamp-2">{{ movie.synopsis }}</p>
            <div class="flex items-center gap-4 mt-3 text-sm text-slate-400">
              <span>⏱️ {{ formatDate(movie.watchedAt) }}</span>
              <span>⭐ {{ movie.rating }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Trống -->
      <div v-else class="flex flex-col items-center justify-center min-h-96 text-center">
        <Icon name="heroicons-solid:clock" class="w-16 h-16 text-slate-600 mb-4" />
        <p class="text-slate-400 text-lg mb-2">Chưa xem phim nào</p>
        <p class="text-slate-500 text-sm">Khi xem phim sẽ được lưu lại ở đây</p>
        <button
          @click="goBack"
          class="mt-6 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium"
        >
          Xem Phim Ngay
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
