<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-gray-900 rounded-lg p-8 flex flex-col items-center gap-4">
      <!-- Spinner -->
      <div class="w-12 h-12 border-4 border-emerald-500 border-t-emerald-300 rounded-full animate-spin"></div>
      <!-- Loading text -->
      <p class="text-white text-lg font-semibold">Đang tải phim...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isVisible?: boolean
}

withDefaults(defineProps<Props>(), {
  isVisible: false
})
</script>

<style scoped>
@keyframes spin {
  from {
    transform: rotate(0deg)
  }
  to {
    transform: rotate(360deg)
  }
}

.animate-spin {
  animation: spin 1s linear infinite
}
</style>
