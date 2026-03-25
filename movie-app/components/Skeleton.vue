<!-- ========== SKELETON LOADER COMPONENT ========== -->
<!-- Hiển thị placeholder lúc đang loading -->
<!-- Sử dụng CSS animation để tạo hiệu ứng "shimmer" -->

<script setup lang="ts">
// Props để customize skeleton dimensions
const props = defineProps({
  // Độ rộng (width)
  width: {
    type: String,
    default: 'w-full'
  },
  // Độ cao (height)
  height: {
    type: String,
    default: 'h-48'
  },
  // Border radius
  rounded: {
    type: String,
    default: 'rounded-lg'
  },
  // Số lượng skeleton items để hiển thị (dùng cho list)
  count: {
    type: Number,
    default: 1
  },
  // Có phải aspect ratio [2/3] (dùng cho MovieCard)?
  isMovieCard: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <!-- Movie Card Skeleton (Poster size 2/3) -->
  <div v-if="isMovieCard" :class="['space-y-3', props.count > 1 ? 'space-y-8' : '']">
    <div v-for="i in props.count" :key="i" class="space-y-3">
      <!-- Poster skeleton -->
      <div :class="[`${props.width} aspect-[2/3] ${props.rounded} bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 overflow-hidden`]">
        <div class="animate-shimmer" />
      </div>
      <!-- Title skeleton -->
      <div :class="`${props.width} h-4 ${props.rounded} bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-shimmer`" />
      <!-- Subtitle skeleton -->
      <div :class="`w-2/3 h-3 ${props.rounded} bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-shimmer`" />
    </div>
  </div>

  <!-- Generic Skeleton (không phải poster) -->
  <div v-else :class="['space-y-4']">
    <div
      v-for="i in props.count"
      :key="i"
      :class="[`${props.width} ${props.height} ${props.rounded} bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 overflow-hidden`]"
    >
      <div class="animate-shimmer" />
    </div>
  </div>
</template>

<style scoped>
/* Shimmer animation - tạo hiệu ứng loading */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.animate-shimmer {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.1) 20%,
    rgba(255, 255, 255, 0.5) 60%,
    rgba(255, 255, 255, 0)
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}
</style>
