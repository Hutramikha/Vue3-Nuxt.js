// ========== CAROUSEL AUTO-SLIDE COMPOSABLE ==========
// Quản lý logic carousel quảng cáo: state, timer, navigation

import { ref, onMounted, onUnmounted } from 'vue'

export const useCarousel = (items: any) => {
  const currentIndex = ref(0)
  let autoSlideInterval: ReturnType<typeof setInterval> | null = null

  // ========== NEXT ITEM ==========
  const nextItem = () => {
    currentIndex.value = (currentIndex.value + 1) % items.value.length
  }

  // ========== PREVIOUS ITEM ==========
  const prevItem = () => {
    currentIndex.value = (currentIndex.value - 1 + items.value.length) % items.value.length
  }

  // ========== GO TO SPECIFIC ITEM ==========
  const goToItem = (index: number) => {
    currentIndex.value = index
    // Restart auto-slide khi user tương tác
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval)
      startAutoSlide()
    }
  }

  // ========== START AUTO-SLIDE ==========
  const startAutoSlide = () => {
    autoSlideInterval = setInterval(() => {
      nextItem()
    }, 5000)
  }

  // ========== STOP AUTO-SLIDE ==========
  const stopAutoSlide = () => {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval)
      autoSlideInterval = null
    }
  }

  // ========== AUTO CLEANUP ==========
  onMounted(() => {
    startAutoSlide()
  })

  onUnmounted(() => {
    stopAutoSlide()
  })

  return {
    currentIndex,
    nextItem,
    prevItem,
    goToItem,
    startAutoSlide,
    stopAutoSlide
  }
}
