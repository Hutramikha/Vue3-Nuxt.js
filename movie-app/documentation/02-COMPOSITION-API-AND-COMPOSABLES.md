# 2. Composition API và Composables - Tổ Chức Logic

Một trong những điểm mạnh nhất của Vue 3, và được tận dụng triệt để trong dự án Nuxt này, là **Composition API**. Nó cho phép chúng ta tổ chức code theo logic chức năng thay vì theo các tùy chọn (options) của component.

## Composition API là gì?

Trong Vue 2 (Options API), code của một component thường được chia thành các khối `data`, `methods`, `computed`, `watch`. Khi component lớn lên, logic cho một chức năng cụ thể (ví dụ: "quản lý tìm kiếm") có thể bị phân tán ở nhiều nơi, gây khó khăn cho việc đọc và bảo trì.

Composition API giải quyết vấn đề này bằng cách cho phép nhóm code liên quan đến một chức năng lại với nhau. Toàn bộ logic được viết bên trong hàm `setup()`.

**So sánh nhanh:**

| Khái niệm | Options API (Vue 2) | Composition API (Vue 3) |
| :--- | :--- | :--- |
| State | `data()` | `ref()`, `reactive()` |
| Methods | `methods: { ... }` | `function myFunction() { ... }` |
| Computed | `computed: { ... }` | `computed(() => { ... })` |
| Watchers | `watch: { ... }` | `watch(source, () => { ... })` |
| Lifecycle | `mounted()` | `onMounted()` |

## Composables: Tái Sử Dụng Logic

**Composable** là một hàm sử dụng Composition API để đóng gói và tái sử dụng logic có trạng thái (stateful logic). Trong dự án này, thư mục `composables/` chứa rất nhiều ví dụ điển hình.

Hãy phân tích `composables/usePagination.ts` để hiểu rõ hơn.

### Ví dụ: `usePagination.ts`

Đây là một composable "generic" (chung), có thể được sử dụng để phân trang cho bất kỳ danh sách dữ liệu nào.

**Mục đích:**
- Nhận vào một danh sách các mục (`items`).
- Nhận vào các tùy chọn như `itemsPerPage` (số mục mỗi trang).
- Trả về trạng thái hiện tại của việc phân trang (`currentPage`, `totalPages`) và các phương thức để điều khiển nó (`goToPage`, `nextPage`, `prevPage`).

**Code cốt lõi (`composables/usePagination.ts`):**

```typescript
import { ref, computed } from 'vue'
import type { Ref } from 'vue'

// Định nghĩa các tùy chọn có thể truyền vào
export interface PaginationOptions {
  itemsPerPage?: number
  initialPage?: number
}

// Hàm composable chính
export function usePagination<T>(
  items: Ref<T[]>, // Dữ liệu đầu vào là một Ref chứa mảng
  options: PaginationOptions = {}
) {
  // --- STATE ---
  // ref() tạo ra một biến reactive. Khi giá trị của nó thay đổi, UI sẽ tự động cập nhật.
  const currentPage = ref(options.initialPage || 1)
  const itemsPerPage = ref(options.itemsPerPage || 16)

  // --- COMPUTED PROPERTIES ---
  // computed() tạo ra một giá trị dẫn xuất, nó sẽ tự động tính toán lại khi state phụ thuộc thay đổi.
  
  // Tính tổng số trang
  const totalPages = computed(() => {
    if (items.value.length === 0) return 1
    return Math.ceil(items.value.length / itemsPerPage.value)
  })

  // Lấy ra các mục cho trang hiện tại
  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return items.value.slice(start, end)
  })

  // --- METHODS ---
  // Các hàm để thay đổi state
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  // Trả về tất cả state và methods cần thiết để component khác có thể sử dụng
  return {
    currentPage,
    totalPages,
    paginatedItems, // Đổi tên từ currentItems để rõ ràng hơn
    goToPage
  }
}
```

### Cách Sử Dụng Composable trong Component

Bây giờ, hãy xem cách `pages/index.vue` sử dụng các composable này. Thay vì viết lại toàn bộ logic tìm kiếm, lọc, phân trang... trong một file duy nhất, nó chỉ cần "gọi" các composable tương ứng.

**Ví dụ trong `pages/index.vue`:**

```vue
<script setup lang="ts">
// ... imports
import { useMovieFilter } from '~/composables/useMovieFilter'
import { useMovieSearch } from '~/composables/useMovieSearch'
import { useMovieCategories } from '~/composables/useMovieCategories'

// Lấy danh sách tất cả phim
const { data: allMovies } = await useFetch('/api/movies')

// 1. Sử dụng composable cho chức năng LỌC PHIM
const { 
  filteredMovies,
  filteredMoviesPaginated, // Dữ liệu đã được phân trang
  totalFilterPages,
  isFilterMode,
  goToFilterPage // Hàm điều khiển phân trang
} = useMovieFilter(allMovies)

// 2. Sử dụng composable cho chức năng TÌM KIẾM
const { 
  searchedMovies, 
  searchedMoviesPaginated, // Dữ liệu đã được phân trang
  totalSearchPages, 
  isSearchMode,
  goToSearchPage // Hàm điều khiển phân trang
} = useMovieSearch(allMovies)

// 3. Sử dụng composable cho các DANH MỤC PHIM
const {
  newMoviesPaginated,
  hotMoviesPaginated,
  // ... và các danh mục khác
} = useMovieCategories(allMovies)

</script>

<template>
  <!-- Hiển thị kết quả tìm kiếm nếu ở chế độ tìm kiếm -->
  <div v-if="isSearchMode">
    <div class="grid">
      <MovieCard v-for="movie in searchedMoviesPaginated" :key="movie.id" :movie="movie" />
    </div>
    <Pagination :totalPages="totalSearchPages" @change-page="goToSearchPage" />
  </div>

  <!-- Hiển thị kết quả lọc nếu ở chế độ lọc -->
  <div v-else-if="isFilterMode">
    <!-- ... -->
  </div>

  <!-- Hiển thị các danh mục mặc định -->
  <div v-else>
    <!-- Danh mục phim mới -->
    <h2>Phim Mới</h2>
    <div class="grid">
       <MovieCard v-for="movie in newMoviesPaginated" :key="movie.id" :movie="movie" />
    </div>
    <!-- ... -->
  </div>
</template>
```

## Lợi Ích của Cách Tiếp Cận Này

1.  **Tổ Chức Code Rõ Ràng**: Logic của `pages/index.vue` trở nên cực kỳ đơn giản. Nó chỉ tập trung vào việc "sử dụng" các chức năng và hiển thị dữ liệu, không cần quan tâm đến việc "làm thế nào" để lọc hay phân trang.
2.  **Tái Sử Dụng Tối Đa**: `usePagination` là một ví dụ hoàn hảo. Nó được sử dụng bên trong `useMovieFilter`, `useMovieSearch`, và `useMovieCategories` mà không cần viết lại code.
3.  **Dễ Dàng Bảo Trì và Mở Rộng**: Nếu bạn muốn thay đổi cách phân trang hoạt động (ví dụ: thêm nút "đến trang cuối"), bạn chỉ cần sửa file `composables/usePagination.ts` một lần duy nhất, và tất cả các chức năng sử dụng nó sẽ được cập nhật.
4.  **Dễ Test**: Các composable là các hàm JavaScript thông thường, bạn có thể test chúng một cách độc lập mà không cần render toàn bộ component.
