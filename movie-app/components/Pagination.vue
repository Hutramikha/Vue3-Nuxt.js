<template>
  <div v-if="totalPages > 1" class="flex justify-center items-center gap-2">
    <!-- NÚT TRƯỚC -->
    <button 
      @click="goToPreviousPage"
      :disabled="currentPage === 1"
      class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
    >
      ← Trước
    </button>
    
    <!-- CÁC NÚT TRANG -->
    <div class="flex gap-1">
      <button 
        v-for="page in pageNumbers" 
        :key="page"
        @click="goToPage(page)"
        :class="[
          'px-3 py-1 text-sm rounded font-semibold transition',
          currentPage === page 
            ? 'bg-emerald-600 text-white' 
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
        ]"
      >
        {{ page }}
      </button>
    </div>
    
    <!-- NÚT SAU -->
    <button 
      @click="goToNextPage"
      :disabled="currentPage === totalPages"
      class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
    >
      Sau →
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

/**
 * Pagination Component
 * ================================================
 * Dùng chung cho tất cả loại phân trang (tìm kiếm, lọc, danh mục, v.v.)
 * 
 * Props:
 * - totalPages: Tổng số trang
 * - currentPage: Trang hiện tại
 * 
 * Events:
 * - change-page: Emit khi user click nút (nhận pageNumber)
 */

const props = defineProps({
  totalPages: {
    type: Number,
    required: true
  },
  currentPage: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['change-page'])

// Tạo array [1, 2, 3, ...totalPages] từ number
const pageNumbers = computed(() => {
  return Array.from({ length: props.totalPages }, (_, i) => i + 1)
})

const goToPreviousPage = () => {
  emit('change-page', Math.max(1, props.currentPage - 1))
}

const goToNextPage = () => {
  emit('change-page', Math.min(props.totalPages, props.currentPage + 1))
}

const goToPage = (page) => {
  emit('change-page', page)
}
</script>
