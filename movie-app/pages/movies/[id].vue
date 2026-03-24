<script setup lang="ts">
/**
 * Trang Chi Tiết Phim - Dynamic Route [id].vue
 * Phù hợp với:
 * - Chương 7.3: Rendering modes - Dynamic Routes
 * - Chương 8.3: Fetch dữ liệu phim
 * - Chương 9.3: SEO optimization
 */

// ========== ROUTER  + ROUTE PARAMETERS ==========
const route = useRoute()
const movieId = computed(() => parseInt(route.params.id as string))

// ========== LẤY DỮ LIỆU PHIM ==========
const isLoading = ref(true)

// Fetch API để lấy thông tin phim
const { data: allMovies } = await useFetch('/api/movies')

// Tìm phim dựa vào ID
const movie = computed(() => {
  if (!allMovies.value) return null
  return allMovies.value.find((m: any) => m.id === movieId.value)
})

isLoading.value = false

// ========== REACTIVE OBJECT - TRẠNG THÁI XEM PHIM ==========
const watchState = reactive({
  currentTime: 0,
  isPlaying: false,
  isMuted: false,
  playbackRate: 1
})

// ========== WATCHER - GHI LỮC SỬ XEM ==========
// Side effect: Lưu trạng thái xem phim vào localStorage
watch(
  () => ({ id: movieId.value, time: watchState.currentTime }),
  (newState) => {
    console.log(`[WATCH] Đang xem: ${newState.id}, tiến độ: ${newState.time}s`)
  },
  { deep: true }
)

// ========== SEO OPTIMIZATION ==========
// Meta tags động dựa vào thông tin phim
useHead({
  title: () => `${movie.value?.title || 'Phim'} | KHANLIX`,
  meta: () => [
    {
      name: 'description',
      content: `Xem phim ${movie.value?.title}. Thể loại: ${movie.value?.genre}. Năm phát hành: ${movie.value?.year}. Rating: ${movie.value?.rating}/10`
    },
    {
      name: 'keywords',
      content: `${movie.value?.title}, xem phim, ${movie.value?.genre}, ${movie.value?.year}`
    },
    {
      property: 'og:title',
      content: `${movie.value?.title} | KHANLIX`
    },
    {
      property: 'og:description',
      content: `Xem ${movie.value?.title} trực tuyến với chất lượng HD`
    },
    {
      property: 'og:image',
      content: `http://localhost:3000${movie.value?.poster || ''}`
    },
    {
      property: 'og:type',
      content: 'video.movie'
    }
  ]
})

// ========== FUNCTIONS ==========
const togglePlay = () => {
  watchState.isPlaying = !watchState.isPlaying
}

const toggleMute = () => {
  watchState.isMuted = !watchState.isMuted
}

const handleProgressClick = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLDivElement
  if (target) {
    watchState.currentTime = Math.floor((event.offsetX / target.offsetWidth) * 5400)
  }
}
</script>

<template>
  <div>
    <!-- Loading State -->
    <LoadingSpinner :isVisible="isLoading" />

    <!-- Phim Không Tìm Thấy -->
    <div v-if="!isLoading && !movie" class="flex items-center justify-center py-20">
      <div class="text-center">
        <Icon name="heroicons-solid:exclamation-circle" class="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 class="text-4xl font-bold text-white mb-2">Phim Không Tìm Thấy</h1>
        <p class="text-gray-400 mb-6">ID: {{ movieId }}</p>
      </div>
    </div>

    <!-- Chi Tiết Phim -->
    <div v-else-if="movie" class="pb-12">
      <!-- Sticky Back Button -->
      <NuxtLink 
        to="/" 
        class="fixed left-4 top-24 z-40 p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg transition transform hover:scale-110"
        title="Quay Lại Trang Chủ"
      >
        <Icon name="heroicons-solid:arrow-left" class="w-6 h-6" />
      </NuxtLink>

      <!-- Hero Section -->
      <div class="relative pt-12 px-4 sm:px-8">
        <div class="container mx-auto">
          <!-- Main Content -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Poster (Left) -->
            <div class="md:col-span-1">
              <img 
                :src="movie.poster" 
                :alt="movie.title" 
                class="w-full h-auto rounded-lg shadow-2xl sticky top-24"
              />
            </div>

            <!-- Info (Right) -->
            <div class="md:col-span-2">
              <!-- Tiêu Đề -->
              <h1 class="text-5xl font-bold text-white mb-4">{{ movie.title }}</h1>

              <!-- Meta Info -->
              <div class="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-600">
                <div class="flex items-center gap-2 bg-yellow-600/20 px-4 py-2 rounded-lg">
                  <Icon name="heroicons-solid:star" class="w-5 h-5 text-yellow-400" />
                  <span class="text-white font-bold">{{ movie.rating }}/10</span>
                </div>
                <span class="text-gray-300">{{ movie.year }}</span>
                <span class="px-3 py-1 bg-emerald-600/30 border border-emerald-500 text-emerald-300 rounded-full text-sm font-semibold">
                  {{ movie.genre }}
                </span>
              </div>

              <!-- Mô Tả -->
              <div class="mb-8">
                <h2 class="text-xl font-bold text-white mb-3">Về bộ phim này</h2>
                <p class="text-gray-300 leading-relaxed text-base">
                  Bộ phim <strong>{{ movie.title }}</strong> là một tác phẩm điện ảnh xuất sắc thuộc thể loại 
                  <span class="text-emerald-400">{{ movie.genre }}</span>, được phát hành vào năm 
                  <span class="text-emerald-400">{{ movie.year }}</span>. 
                  Với rating <strong>{{ movie.rating }}/10</strong> trên IMDb, đây là một bộ phim đáng xem mà bạn không nên bỏ lỡ.
                </p>
              </div>

              <!-- Nút Hành Động -->
              <div class="flex gap-4">
                <button class="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition flex items-center gap-2 shadow-lg">
                  <Icon name="heroicons-solid:play" class="w-5 h-5" />
                  Xem Ngay
                </button>
                <button class="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition flex items-center gap-2">
                  <Icon name="heroicons-solid:heart" class="w-5 h-5" />
                  Yêu Thích
                </button>
              </div>
            </div>
          </div>

          <!-- Tóm Tắt Phim & Trailer Section -->
          <div class="mt-16 pt-8 border-t border-gray-700">
            <h2 class="text-2xl font-bold text-white mb-8 flex items-center gap-2">
              <Icon name="heroicons-solid:film" class="w-6 h-6 text-emerald-500" />
              Tóm Tắt & Trailer
            </h2>

            <!-- 2 Cột: Tóm Tắt (Trái) + Trailer (Phải) -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <!-- Cột Trái: Tóm Tắt Phim -->
              <div class="md:col-span-1">
                <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 border border-emerald-600/20">
                  <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Icon name="heroicons-solid:document-text" class="w-5 h-5 text-emerald-500" />
                    Tóm Tắt
                  </h3>
                  <p class="text-gray-300 leading-relaxed text-base">
                    {{ movie.synopsis }}
                  </p>
                </div>
              </div>

              <!-- Cột Phải: Trailer Video Player (Rộng hơn) -->
              <div class="md:col-span-2">
                <div class="space-y-4">
                  <!-- Trailer Video Area -->
                  <div class="bg-black rounded-lg h-96 flex items-center justify-center relative shadow-lg border border-emerald-600/20 overflow-hidden">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      :src="movie.trailerUrl" 
                      :title="`Trailer - ${movie.title}`"
                      frameborder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      allowfullscreen
                      class="rounded-lg"
                    ></iframe>
                  </div>

                  <!-- Trailer Controls -->
                  <div class="flex items-center gap-3">
                    <button
                      @click="togglePlay"
                      :class="[
                        'px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 text-sm',
                        watchState.isPlaying
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                      ]"
                    >
                      <Icon :name="watchState.isPlaying ? 'heroicons-solid:pause' : 'heroicons-solid:play'" class="w-4 h-4" />
                      {{ watchState.isPlaying ? 'Tạm Dừng' : 'Phát' }}
                    </button>

                    <button
                      @click="toggleMute"
                      :class="[
                        'px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 text-sm',
                        watchState.isMuted
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                      ]"
                    >
                      <Icon :name="watchState.isMuted ? 'heroicons-solid:speaker-x-mark' : 'heroicons-solid:speaker-wave'" class="w-4 h-4" />
                    </button>

                    <select v-model.number="watchState.playbackRate" class="px-3 py-2 rounded-lg bg-gray-700 text-white text-sm font-semibold">
                      <option :value="0.5">0.5x</option>
                      <option :value="1">1x</option>
                      <option :value="1.5">1.5x</option>
                      <option :value="2">2x</option>
                    </select>
                  </div>

                  <!-- Progress Bar -->
                  <div class="w-full bg-gray-700 rounded-full h-1.5 cursor-pointer hover:h-2 transition" @click="handleProgressClick">
                    <div
                      class="bg-emerald-600 h-full rounded-full transition-all duration-100"
                      :style="{ width: `${(watchState.currentTime / 5400) * 100}%` }"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
