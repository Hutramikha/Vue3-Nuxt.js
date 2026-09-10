# 3. Quản Lý Trạng Thái với Pinia

Khi một ứng dụng lớn dần, việc chia sẻ và quản lý trạng thái (state) giữa các component khác nhau trở nên phức tạp. Ví dụ, làm thế nào để component `MovieCard` biết được một bộ phim đã được người dùng "yêu thích" hay chưa, và làm thế nào để cập nhật trạng thái đó trên toàn bộ ứng dụng?

Đây là lúc **Pinia**, thư viện quản lý trạng thái chính thức cho Vue 3, phát huy tác dụng.

## Pinia là gì?

Pinia cung cấp một "kho" (store) trung tâm để lưu trữ trạng thái mà nhiều component có thể truy cập. Khi trạng thái trong store thay đổi, tất cả các component đang sử dụng nó sẽ tự động được cập nhật.

Trong dự án này, chúng ta sử dụng Pinia để quản lý danh sách các bộ phim yêu thích của người dùng.

## Phân Tích `stores/movieStore.ts`

File này định nghĩa một "movie store" với đầy đủ state, actions và getters (trong Pinia, getters được gọi là `computed`).

**Code cốt lõi (`stores/movieStore.ts`):**

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getFavorites, addFavoriteToStorage, removeFavoriteFromStorage } from '~/utils/localStorage'

// `defineStore` tạo ra một store mới.
// 'movie' là ID duy nhất của store này.
export const useMovieStore = defineStore('movie', () => {
  // ========== STATE ==========
  // `favorites` là một Map lưu trữ ID của các phim yêu thích.
  // Dùng Map giúp kiểm tra một phim có được yêu thích hay không rất nhanh (độ phức tạp O(1)).
  const favorites = ref<Map<number, boolean>>(new Map())

  // ========== ACTIONS (PHƯƠNG THỨC) ==========
  // Actions là các hàm dùng để thay đổi state.

  // Khởi tạo state từ localStorage khi ứng dụng bắt đầu
  const initFavorites = () => {
    const savedFavorites = getFavorites() // Hàm helper từ utils/localStorage.ts
    favorites.value = new Map(savedFavorites.map(id => [id, true]))
  }

  // Thêm một phim vào danh sách yêu thích
  const addFavorite = async (movieId: number): Promise<void> => {
    if (!favorites.value.has(movieId)) {
      favorites.value.set(movieId, true)
      addFavoriteToStorage(movieId) // Đồng bộ với localStorage
    }
  }

  // Xóa một phim khỏi danh sách yêu thích
  const removeFavorite = async (movieId: number): Promise<void> => {
    if (favorites.value.has(movieId)) {
      favorites.value.delete(movieId)
      removeFavoriteFromStorage(movieId) // Đồng bộ với localStorage
    }
  }

  // Hàm "toggle" tiện lợi: nếu đã yêu thích thì xóa, chưa thì thêm
  const toggleFavorite = async (movieId: number): Promise<boolean> => {
    if (isFavorited(movieId)) {
      await removeFavorite(movieId)
      return false
    } else {
      await addFavorite(movieId)
      return true
    }
  }

  // ========== GETTERS (COMPUTED) ==========
  // Getters là các thuộc tính tính toán (computed properties) dựa trên state.

  // Kiểm tra xem một phim có trong danh sách yêu thích không
  const isFavorited = (movieId: number): boolean => {
    return favorites.value.has(movieId)
  }

  // Lấy tổng số phim đã yêu thích
  const favoriteCount = computed(() => {
    return favorites.value.size
  })

  // Trả về các state và actions để các component khác có thể sử dụng
  return {
    favorites,
    favoriteCount,
    initFavorites,
    isFavorited,
    toggleFavorite,
  }
})
```

## Cách Sử Dụng Store trong Component

Bây giờ, hãy xem `components/MovieCard.vue` sử dụng `movieStore` như thế nào để hiển thị và cập nhật nút trái tim (yêu thích).

**Code trong `components/MovieCard.vue`:**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useMovieStore } from '~/stores/movieStore'

// Props nhận dữ liệu phim từ component cha
const props = defineProps<{ movie: Movie }>()

// 1. Lấy instance của store
const movieStore = useMovieStore()

// 2. Tạo một computed property để kiểm tra trạng thái yêu thích
// `isFavorited` sẽ tự động cập nhật mỗi khi `movieStore.favorites` thay đổi.
const isFavorited = computed(() => {
  return movieStore.isFavorited(props.movie.id)
})

// 3. Hàm để gọi action từ store khi người dùng click
const handleToggleFavorite = async (e: Event) => {
  e.preventDefault() // Ngăn không cho click vào thẻ phim
  e.stopPropagation()
  
  // Gọi action `toggleFavorite` từ store
  await movieStore.toggleFavorite(props.movie.id)
}
</script>

<template>
  <NuxtLink :to="`/movies/${props.movie.id}`" class="group">
    <div class="relative">
      <!-- ... poster phim ... -->
      <div class="absolute inset-0">
        <!-- Nút Yêu Thích -->
        <button
          @click="handleToggleFavorite"
          :class="[
            // Thay đổi style dựa trên `isFavorited`
            isFavorited
              ? 'bg-emerald-600 text-white' // Style khi đã yêu thích
              : 'bg-black/50 text-white'   // Style khi chưa yêu thích
          ]"
        >
          <!-- Thay đổi icon dựa trên `isFavorited` -->
          <Icon :name="isFavorited ? 'heroicons-solid:heart' : 'heroicons:heart'" />
        </button>
      </div>
    </div>
    <!-- ... thông tin phim ... -->
  </NuxtLink>
</template>
```

## Luồng Hoạt Động

1.  **Khởi tạo**: Khi ứng dụng tải lần đầu (`app.vue`), `movieStore.initFavorites()` được gọi, đọc danh sách ID phim yêu thích từ `localStorage` và điền vào state `favorites`.
2.  **Render**: Khi `MovieCard` được render, nó gọi `useMovieStore()` để truy cập store. `computed` property `isFavorited` được tính toán, trả về `true` hoặc `false`.
3.  **Hiển thị**: Giao diện của nút trái tim (màu sắc, icon) được hiển thị dựa trên giá trị của `isFavorited`.
4.  **Tương tác**: Người dùng click vào nút trái tim.
5.  **Action**: Hàm `handleToggleFavorite` được gọi, nó sẽ dispatch action `toggleFavorite` trong `movieStore`.
6.  **Cập nhật State**: `movieStore` thay đổi state `favorites` (thêm hoặc xóa ID phim) và đồng thời cập nhật `localStorage`.
7.  **Phản ứng (Reactivity)**: Vì `isFavorited` trong `MovieCard` là một `computed` property phụ thuộc vào state của store, nó sẽ tự động được tính toán lại.
8.  **Cập nhật UI**: Giao diện của nút trái tim tự động thay đổi để phản ánh trạng thái mới mà không cần tải lại trang.

Đây là sức mạnh của việc quản lý trạng thái tập trung: logic được đóng gói ở một nơi (`movieStore`), và các component chỉ cần "đăng ký" để sử dụng và phản ứng với các thay đổi của trạng thái đó.
