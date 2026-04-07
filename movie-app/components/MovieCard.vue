<script setup lang="ts">
import { computed } from 'vue'
import { useMovieStore } from '~/stores/movieStore'

interface Movie {
  id: number
  title: string
  poster: string
  year: string
  genre: string
  rating: number
  synopsis?: string
  trailerUrl?: string
  type?: string
}

// ========== NHẬN DỮ LIỆU TỪ COMPONENT CHA ==========
// Movie object chứa thông tin: id, title, poster, year, genre, rating
const props = defineProps<{ movie: Movie }>()

// ========== QUẢN LÝ STATE ==========
// Kết nối với Pinia store để quản lý danh sách yêu thích
const movieStore = useMovieStore()

// Kiểm tra xem phim hiện tại có phải yêu thích không
// computed: tự động cập nhật khi movieStore.favorites thay đổi
const isFavorited = computed(() => {
  return movieStore.isFavorited(props.movie.id)
})

// ========== PHƯƠNG THỨC XỬ LÝ ==========

// toggleFavorite: Thêm/xóa phim khỏi danh sách yêu thích
// Tham số e: sự kiện click (dùng để ngăn không navigate khi click heart)
const toggleFavorite = async (e: Event) => {
  // e.preventDefault(): Ngăn hành động mặc định (navigate)
  e.preventDefault()
  // e.stopPropagation(): Ngăn sự kiện lan truyền lên element cha
  e.stopPropagation()
  
  // Gọi phương thức từ store để thêm/xóa yêu thích
  await movieStore.toggleFavorite(props.movie.id)
}
</script>

<template>
  <!-- NuxtLink: tạo link đến trang chi tiết phim (/movies/{id}) -->
  <NuxtLink :to="`/movies/${props.movie.id}`" class="group cursor-pointer">
    <!-- ===== THẺ PHIM (POSTER) ===== -->
    <div class="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-800 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105">
      <!-- Ảnh poster với lazy loading (NuxtImg tự động tối ưu hóa) -->
      <NuxtImg 
        :src="props.movie.poster" 
        :alt="props.movie.title"
        loading="lazy"
        class="w-full h-full object-cover"
      />

      <!-- ===== HIỆU ỨNG KÍNH (OVERLAY) KHI DI CHUỘT =====-->
      <!-- Hiển thị khi người dùng di chuột vào card (group-hover) -->
      <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
        
        <!-- TOP: Đánh giá sao + Nút Yêu Thích -->
        <div class="flex justify-between items-start">
          <!-- Hộp đánh giá: hiển thị số sao -->
          <div class="flex items-center gap-1 bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            <Icon name="heroicons-solid:star" class="w-4 h-4 text-emerald-300" />
            {{ props.movie.rating }}
          </div>
          
          <!-- Nút Yêu Thích: thay đổi màu sắc nếu yêu thích -->
          <button
            type="button"
            @click.stop.prevent="toggleFavorite"
            :class="[
              'p-2 rounded-full transition-all duration-200 transform hover:scale-110',
              isFavorited
                ? 'bg-emerald-600/80 text-white shadow-lg shadow-emerald-500/50'
                : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40'
            ]"
            :title="isFavorited ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'"
            :aria-label="isFavorited ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'"
          >
            <!-- Icon trái tim: đầy đủ nếu yêu thích, rỗng nếu chưa -->
            <Icon 
              :name="isFavorited ? 'heroicons-solid:heart' : 'heroicons:heart'"
              class="w-5 h-5"
            />
          </button>
        </div>

        <!-- BOTTOM: Tên phim + Năm + Thể loại -->
        <div>
          <!-- Tên phim (có ellipsis nếu quá dài) -->
          <h3 class="font-bold text-sm text-white line-clamp-2 mb-1">
            {{ props.movie.title }}
          </h3>
          <!-- Năm phát hành + Thể loại -->
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