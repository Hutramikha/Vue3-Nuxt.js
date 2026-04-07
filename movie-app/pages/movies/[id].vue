<script setup lang="ts">
/**
 * Trang Chi Tiết Phim - Dynamic Route [id].vue
 * Phù hợp với:
 * - Chương 7.3: Rendering modes - Dynamic Routes
 * - Chương 8.3: Fetch dữ liệu phim
 * - Chương 9.3: SEO optimization
 */

import { useMovieDetail } from '~/composables/useMovieDetail'
import { useVideoPlayer } from '~/composables/useVideoPlayer'
import { useMovieStore } from '~/stores/movieStore'
import { generateMovieMeta, generatePageTitle } from '~/utils/seo'
import { ref, computed } from 'vue'

// ========== LẤY DỮ LIỆU PHIM ==========
const isLoading = ref(true)
const { data: allMovies } = await useFetch('/api/movies')
isLoading.value = false

// ========== MOVIE DETAIL COMPOSABLE ==========
const { movieId, movie, isMovieFound } = useMovieDetail(allMovies)

// ========== VIDEO PLAYER COMPOSABLE ==========
const { playerState, togglePlay, toggleMute, handleProgressClick, getProgressPercentage } = useVideoPlayer()

// ========== MOVIE STORE - FAVORITES ==========
const movieStore = useMovieStore()

// Check nếu phim hiện tại là favorite
const isFavorited = computed(() => {
  return movieStore.isFavorited(movieId.value)
})

// Toggle favorite
const toggleFavorite = async () => {
  await movieStore.toggleFavorite(movieId.value)
}

// ========== TRAILER SCROLL ==========
const trailerSection = ref<HTMLDivElement | null>(null)

const scrollToTrailer = () => {
  trailerSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}


// ========== SEO OPTIMIZATION ==========
// Meta tags động dựa vào thông tin phim
useHead({
  title: () => generatePageTitle(movie.value || { title: 'Phim' }),
  meta: () => movie.value ? generateMovieMeta(movie.value) : []
})
</script>

<template>
  <div>
    <!-- Loading State -->
    <LoadingSpinner :isVisible="isLoading" />

    <!-- Phim Không Tìm Thấy -->
    <div v-if="!isLoading && !isMovieFound" class="flex items-center justify-center py-20">
      <div class="text-center">
        <Icon name="heroicons-solid:exclamation-circle" class="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 class="text-4xl font-bold text-white mb-2">Phim Không Tìm Thấy</h1>
        <p class="text-gray-400 mb-6">ID: {{ movieId }}</p>
      </div>
    </div>

    <!-- Chi Tiết Phim -->
    <div v-else-if="movie" class="pb-12">
      <!-- Header Section với Back Button -->
      <div class="mb-12 pt-8 px-4 sm:px-8">
        <div class="container mx-auto">
          <div class="flex items-center justify-between mb-8">
            <!-- Tiêu Đề -->
            <div>
              <h1 class="text-4xl font-bold text-white">{{ movie.title }}</h1>
              <div class="flex items-center gap-2 mt-2 text-gray-400">
                <span>{{ movie.year }}</span>
                <span class="text-gray-600">•</span>
                <span>{{ movie.genre }}</span>
                <span class="text-gray-600">•</span>
                <div class="flex items-center gap-1 text-emerald-400 font-semibold">
                  <Icon name="heroicons-solid:star" class="w-4 h-4" />
                  {{ movie.rating }}
                </div>
              </div>
            </div>

            <!-- Back Button -->
            <NuxtLink 
              to="/" 
              class="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              title="Quay Lại Trang Chủ"
            >
              <Icon name="heroicons-solid:arrow-left" class="w-5 h-5" />
              Quay Lại
            </NuxtLink>
          </div>

          <!-- Separator -->
          <div class="h-px bg-gradient-to-r from-emerald-600/50 via-emerald-600 to-emerald-600/50"></div>
        </div>
      </div>

      <!-- Hero Section -->
      <div class="relative px-4 sm:px-8">
        <div class="container mx-auto">
          <!-- Main Content -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Poster (Left) -->
            <div class="md:col-span-1">
              <NuxtImg 
                :src="movie.poster" 
                :alt="movie.title"
                loading="lazy"
                class="w-full h-auto rounded-lg shadow-2xl sticky top-24"
              />
            </div>

            <!-- Info (Right) -->
            <div class="md:col-span-2">
              <!-- Meta Info -->
              <div class="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-600">
                <div class="flex items-center gap-2 bg-emerald-600/20 px-4 py-2 rounded-lg">
                  <Icon name="heroicons-solid:star" class="w-5 h-5 text-emerald-400" />
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
                <button @click="scrollToTrailer" class="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition flex items-center gap-2 shadow-lg">
                  <Icon name="heroicons-solid:play" class="w-5 h-5" />
                  Xem Ngay
                </button>
                <button 
                  @click="toggleFavorite"
                  :class="[
                    'px-8 py-3 font-semibold rounded-lg transition flex items-center gap-2',
                    isFavorited
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/50'
                      : 'bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500'
                  ]"
                >
                  <Icon 
                    :name="isFavorited ? 'heroicons-solid:heart' : 'heroicons:heart'"
                    class="w-5 h-5"
                  />
                  {{ isFavorited ? 'Đã Yêu Thích' : 'Yêu Thích' }}
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
              <div class="md:col-span-1" ref="trailerSection">
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
                        playerState.isPlaying
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                      ]"
                    >
                      <Icon :name="playerState.isPlaying ? 'heroicons-solid:pause' : 'heroicons-solid:play'" class="w-4 h-4" />
                      {{ playerState.isPlaying ? 'Tạm Dừng' : 'Phát' }}
                    </button>

                    <button
                      @click="toggleMute"
                      :class="[
                        'px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 text-sm',
                        playerState.isMuted
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                      ]"
                    >
                      <Icon :name="playerState.isMuted ? 'heroicons-solid:speaker-x-mark' : 'heroicons-solid:speaker-wave'" class="w-4 h-4" />
                    </button>

                    <select v-model.number="playerState.playbackRate" class="px-3 py-2 rounded-lg bg-gray-700 text-white text-sm font-semibold">
                      <option :value="0.5">0.5x</option>
                      <option :value="1">1x</option>
                      <option :value="1.5">1.5x</option>
                      <option :value="2">2x</option>
                    </select>
                  </div>

                  <!-- Progress Bar -->
                  <div class="w-full bg-gray-700 rounded-full h-1.5 cursor-pointer hover:h-2 transition" @click="handleProgressClick($event, 5400)">
                    <div
                      class="bg-emerald-600 h-full rounded-full transition-all duration-100"
                      :style="{ width: `${getProgressPercentage(5400)}%` }"
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
