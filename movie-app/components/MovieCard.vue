<script setup lang="ts">
import { computed } from 'vue'
import { useMovieStore } from '~/stores/movieStore'

// Nhận dữ liệu từ component cha (parent)
const props = defineProps({
  movie: {
    type: Object as () => any,
    required: true
    // movie chứa: id, title, poster, year, genre, rating
  }
})

// ========== MOVIE STORE ==========
const movieStore = useMovieStore()

// ========== STATE ==========
// Kiểm tra xem phim có phải favorite không
const isFavorited = computed(() => {
  return movieStore.isFavorited(props.movie.id)
})

// ========== METHODS ==========
// toggleFavorite: Thêm/xóa khỏi yêu thích
// Ngăn event bubble (không navigate khi click heart)
const toggleFavorite = async (e: Event) => {
  e.preventDefault()
  e.stopPropagation()
  
  await movieStore.toggleFavorite(props.movie.id)
}
</script>

<template>
  <NuxtLink :to="`/movies/${props.movie.id}`" class="group cursor-pointer">
    <!-- Thẻ phim (poster) -->
    <div class="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-800 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105">
      <!-- Ảnh phim (NuxtImg với lazy loading) -->
      <NuxtImg 
        :src="props.movie.poster" 
        :alt="props.movie.title"
        loading="lazy"
        class="w-full h-full object-cover"
      />

      <!-- Hiệu ứng phủ khi di chuột vào (hover) -->
      <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
        <!-- Top: Đánh giá sao + Nút Yêu Thích -->
        <div class="flex justify-between items-start">
          <div class="flex items-center gap-1 bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            <Icon name="heroicons-solid:star" class="w-4 h-4 text-emerald-300" />
            {{ props.movie.rating }}
          </div>
          
          <!-- Nút Yêu Thích -->
          <button
            @click="toggleFavorite"
            :class="[
              'p-2 rounded-full transition-all duration-200 transform hover:scale-110',
              isFavorited
                ? 'bg-emerald-600/80 text-white shadow-lg shadow-emerald-500/50'
                : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40'
            ]"
            :title="isFavorited ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'"
          >
            <Icon 
              :name="isFavorited ? 'heroicons-solid:heart' : 'heroicons:heart'"
              class="w-5 h-5"
            />
          </button>
        </div>

        <!-- Tên phim + Năm + Thể loại -->
        <div>
          <h3 class="font-bold text-sm text-white line-clamp-2 mb-1">
            {{ props.movie.title }}
          </h3>
          <p class="text-xs text-emerald-400">
            {{ props.movie.year }} • {{ props.movie.genre }}
          </p>
        </div>
      </div>
    </div>

    <!-- Thông tin phim (dưới poster) -->
    <div class="mt-3">
      <!-- Tên phim -->
      <h3 class="font-bold text-sm text-white group-hover:text-emerald-400 transition line-clamp-2">
        {{ props.movie.title }}
      </h3>

      <!-- Năm (bên trái) + Đánh giá (bên phải) -->
      <div class="flex justify-between items-center mt-1">
        <p class="text-xs text-gray-400">{{ props.movie.year }}</p>
        <div class="flex items-center gap-1 text-emerald-400 font-semibold text-xs">
          <Icon name="heroicons-solid:star" class="w-3.5 h-3.5" />
          {{ props.movie.rating }}
        </div>
      </div>
    </div>
  </NuxtLink>
</template>