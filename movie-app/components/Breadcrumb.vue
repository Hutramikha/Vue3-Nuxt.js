<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Tạo đường dẫn breadcrumb
const breadcrumbs = computed(() => {
  const items = [
    { label: 'Trang chủ', path: '/' }
  ]

  // Phân loại
  if (route.path.startsWith('/categories/')) {
    const name = route.params.name as string
    const names: Record<string, string> = {
      'moi-cap-nhat': 'Phim Mới',
      'hot-hien-tai': 'Phim Hot',
      'viet-nam': 'Phim Việt',
      'duong-day': 'Đường Dây',
      'sap-chieu': 'Sắp Chiều'
    }
    items.push({ label: names[name] || 'Danh Mục', path: route.path })
  }
  // Yêu thích
  else if (route.path === '/favorites') {
    items.push({ label: 'Yêu Thích', path: '/favorites' })
  }
  // Chi tiết phim
  else if (route.path.startsWith('/movies/')) {
    items.push({ label: 'Chi Tiết Phim', path: route.path })
  }

  return items
})

const navigate = (path: string) => {
  if (path !== route.path) {
    router.push(path)
  }
}
</script>

<template>
  <div class="flex items-center gap-2 text-sm text-slate-400 mb-6 flex-wrap">
    <template v-for="(item, idx) in breadcrumbs" :key="item.path">
      <button
        @click="navigate(item.path)"
        :class="[
          idx === breadcrumbs.length - 1 ? 'text-white font-medium cursor-default' : 'hover:text-white cursor-pointer'
        ]"
      >
        {{ item.label }}
      </button>
      <span v-if="idx < breadcrumbs.length - 1" class="text-slate-600">/</span>
    </template>
  </div>
</template>
