<script setup>
// ============================================
// NHẬN DỮ LIỆU TỪ COMPONENT CHA (PARENT)
// ============================================
const props = defineProps({
  movie: {
    type: Object,
    required: true
    // movie chứa: id, title, poster, year, genre, rating
  }
})
</script>

<template>
  <div class="group cursor-pointer">
    <!-- ============ THẺ PHIM (POSTER) ============ -->
    <div class="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-800 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105">
      <!-- Ảnh phim -->
      <img 
        :src="props.movie.poster" 
        :alt="props.movie.title" 
        class="w-full h-full object-cover"
      />

      <!-- Hiệu ứng phủ khi di chuột vào (hover effect) -->
      <!-- opacity-0 = ẩn, group-hover:opacity-100 = hiển thị khi hover -->
      <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
        <!-- Phần trên: Đánh giá sao -->
        <div class="flex justify-end">
          <span class="bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            ★ {{ props.movie.rating }}
          </span>
        </div>

        <!-- Phần dưới: Tên phim + Năm + Thể loại -->
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

    <!-- ============ THÔNG TIN PHIM (DƯỚI POSTER) ============ -->
    <div class="mt-3">
      <!-- Tên phim -->
      <!-- Khi hover sẽ đổi sang màu xanh emerald -->
      <h3 class="font-bold text-sm text-white group-hover:text-emerald-400 transition line-clamp-2">
        {{ props.movie.title }}
      </h3>

      <!-- Dòng thứ 2: Năm (bên trái) + Đánh giá (bên phải) -->
      <div class="flex justify-between items-center mt-1">
        <p class="text-xs text-gray-400">{{ props.movie.year }}</p>
        <span class="text-emerald-500 font-semibold text-xs">⭐ {{ props.movie.rating }}</span>
      </div>
    </div>
  </div>
</template>