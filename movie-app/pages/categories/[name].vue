<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ref, computed, onMounted } from 'vue'

const route = useRoute()
const router = useRouter()

// Ánh xạ tên danh mục
const categoryMap: Record<string, {name: string, range: [number, number]}> = {
  'moi-cap-nhat': { name: 'Phim Mới Cập Nhật', range: [1, 20] },
  'hot-hien-tai': { name: 'Phim Hot Hiện Tại', range: [21, 40] },
  'viet-nam': { name: 'Phim Việt Nam', range: [41, 60] },
  'duong-day': { name: 'Phim Đường Dây Xấu', range: [61, 80] },
  'sap-chieu': { name: 'Phim Sắp Chiều', range: [81, 100] }
}

// State
const allMovies = ref<any[]>([])
const isLoading = ref(true)

// Danh mục hiện tại
const categoryName = computed(() => route.params.name as string)
const categoryInfo = computed(() => categoryMap[categoryName.value])
const categoryTitle = computed(() => categoryInfo.value?.name || 'Danh Mục')

// Lọc phim theo danh mục
const categoryMovies = computed(() => {
  if (!categoryInfo.value) return []
  const [start, end] = categoryInfo.value.range
  return allMovies.value.filter(m => m.id >= start && m.id <= end)
})

// Tải dữ liệu
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

onMounted(() => fetchMovies())

// Hàm xử lý
const goToMovie = (id: number) => router.push(`/movies/${id}`)
const goBack = () => router.back()
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 py-8">
    <!-- Header -->
    <div class="max-w-7xl mx-auto px-4 mb-8">
      <button
        @click="goBack"
        class="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 mb-6 text-sm font-medium"
      >
        <Icon name="heroicons-solid:arrow-left" class="w-5 h-5" />
        Quay lại
      </button>
      <h1 class="text-4xl font-bold mb-2">{{ categoryTitle }}</h1>
      <p class="text-slate-400">{{ categoryMovies.length }} phim</p>
    </div>

    <!-- Skeleton Loading -->
    <div v-if="isLoading" class="max-w-7xl mx-auto px-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div v-for="i in 16" :key="i" class="animate-pulse">
          <div class="bg-slate-700 rounded-lg h-64 mb-2"></div>
          <div class="bg-slate-700 rounded h-4 w-3/4 mb-2"></div>
          <div class="bg-slate-700 rounded h-3 w-1/2"></div>
        </div>
      </div>
    </div>

    <!-- Danh sách phim -->
    <div v-else class="max-w-7xl mx-auto px-4">
      <div v-if="categoryMovies.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <MovieCard
          v-for="movie in categoryMovies"
          :key="movie.id"
          :movie="movie"
          @click="goToMovie(movie.id)"
        />
      </div>

      <!-- Trống -->
      <div v-else class="flex flex-col items-center justify-center min-h-96 text-center">
        <Icon name="heroicons-solid:film" class="w-16 h-16 text-slate-600 mb-4" />
        <p class="text-slate-400 text-lg">Không có phim</p>
        <button
          @click="goBack"
          class="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium"
        >
          Quay lại
        </button>
      </div>
    </div>
  </div>
</template>
