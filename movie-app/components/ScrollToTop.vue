<template>
  <Teleport to="body">
    <transition name="fade-scale">
      <button
        v-if="isVisible"
        class="scroll-to-top"
        @click="scrollToTop"
        aria-label="Scroll to top"
      >
        <div class="arrow-container">
          <svg
            class="arrow"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </div>
      </button>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isVisible = ref(false)

// Tính toán khi nào hiển thị nút (khi scroll xuống hơn 300px)
const handleScroll = () => {
  // Chỉ thực hiện logic khi cần thiết để tránh re-render liên tục
  const scrollPos = window.scrollY > 300
  if (isVisible.value !== scrollPos) {
    isVisible.value = scrollPos
  }
}

// Smooth scroll về top
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.scroll-to-top {
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2));
  backdrop-filter: blur(10px);
  border: 1.5px solid rgba(16, 185, 129, 0.3);
  color: rgba(16, 185, 129, 0.8);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 1000;
  padding: 0;
  font-size: 0;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.1);

  &:hover {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(5, 150, 105, 0.3));
    border-color: rgba(16, 185, 129, 0.5);
    color: rgba(16, 185, 129, 1);
    box-shadow: 0 8px 30px rgba(16, 185, 129, 0.2);
    transform: translateY(-3px);
  }

  &:active {
    transform: translateY(-1px);
  }
}

.arrow-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.arrow {
  animation: float 1.5s ease-in-out infinite;
  opacity: 0.7;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-6px);
    opacity: 1;
  }
}

/* Transition animations */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s ease;
}

.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

/* Responsive design */
@media (max-width: 768px) {
  .scroll-to-top {
    bottom: 30px;
    right: 30px;
    width: 45px;
    height: 45px;

    svg {
      width: 20px;
      height: 20px;
    }
  }
}
</style>