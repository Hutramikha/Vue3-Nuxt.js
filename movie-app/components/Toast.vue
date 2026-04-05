<!-- ========== TOAST NOTIFICATION COMPONENT ========== -->
<!-- Hiển thị thông báo lỗi, thành công, v.v -->

<script setup lang="ts">
import { TransitionGroup } from 'vue';
import { useErrorHandler } from '~/composables/useError'

// ========== USE ERROR COMPOSABLE ==========
const { errors, clearError } = useErrorHandler()
</script>

<template>
  <!-- Toast Container - Fixed top right -->
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      <!-- Mỗi error là một toast notification -->
      <Transition
          v-for="(error, index) in errors"
          :key= "`${error.timestamp}-${index}`"
          name="toast-slide"
          @enter="() => {}"
      >
        <div
          class="pointer-events-auto flex items-start gap-3 px-4 py-3 bg-red-600 text-white rounded-lg shadow-lg max-w-sm border-l-4 border-red-500 animate-pulse-fade">

          <!-- Error Icon -->
          <Icon name="heroicons-solid:exclamation-circle" class="w-5 h-5 flex-shrink-0 mt-0.5" />

          <!-- Error Message -->
          <div class="flex-1">
            <p class="font-semibold text-sm">Lỗi</p>
            <p class="text-xs text-red-100 mt-1">{{ error.message }}</p>
            <p v-if="error.code" class="text-xs text-red-100 opacity-70">Mã: {{ error.code }}</p>
          </div>

          <!-- Close Button -->
          <button
            @click="clearError(index)"
            class="flex-shrink-0 text-red-200 hover:text-white transition"
          >
            <Icon name="heroicons-solid:x-mark" class="w-4 h-4" />
          </button>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<style scoped>
/* Toast slide animation */
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.3s ease;
}

.toast-slide-enter-from,
.toast-slide-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

/* Pulse fade animation */
@keyframes pulse-fade {
  0% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.animate-pulse-fade {
  animation: pulse-fade 5s ease-out forwards;
}
</style>
