# 4. Routing và Data Fetching trong Nuxt 3

Nuxt 3 cung cấp một hệ thống định tuyến (routing) tự động và các công cụ mạnh mẽ để lấy dữ liệu (data fetching) từ API, giúp việc xây dựng ứng dụng trở nên nhanh chóng và hiệu quả.

## Routing Tự Động Dựa Trên Thư Mục `pages/`

Nuxt tự động tạo ra các route cho ứng dụng của bạn dựa trên cấu trúc file bên trong thư mục `pages`. Điều này giúp bạn không cần phải cấu hình file `router.js` thủ công như trong các dự án Vue thông thường.

**Các quy tắc cơ bản:**

-   **`pages/index.vue`**: Trở thành route gốc (`/`). Đây là trang chủ của ứng dụng.
-   **`pages/about.vue`**: Trở thành route `/about`.
-   **`pages/favorites.vue`**: Trở thành route `/favorites`.
-   **`pages/movies/index.vue`**: Trở thành route `/movies`.
-   **Dynamic Routes (Route động)**:
    -   **`pages/movies/[id].vue`**: Tạo ra một route động. `[id]` là một "param" (tham số). Nó sẽ khớp với các URL như `/movies/1`, `/movies/lat-mat-7`, v.v. Giá trị của `id` có thể được truy cập bên trong component.

**Ví dụ truy cập param trong `pages/movies/[id].vue`:**

```vue
<script setup>
// useRoute() là một composable của Nuxt để truy cập thông tin về route hiện tại
const route = useRoute()

// Lấy giá trị 'id' từ URL
const movieId = route.params.id 

console.log(movieId) // Sẽ in ra '1' nếu URL là /movies/1
</script>
```

## Data Fetching với `useFetch`

`useFetch` là một composable cực kỳ mạnh mẽ được Nuxt cung cấp để lấy dữ liệu từ các API endpoint. Nó được tối ưu hóa cho việc render phía server (SSR) và cung cấp nhiều tính năng hữu ích.

Hãy xem cách `pages/index.vue` sử dụng `useFetch` để lấy danh sách phim.

**Code trong `pages/index.vue`:**

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'

// Khai báo các biến để lưu trữ dữ liệu và trạng thái loading
const allMovies = ref<any[]>([])
const isLoading = ref(false)

// Gọi useFetch để lấy dữ liệu từ API endpoint '/api/movies'
const { data, error, pending, refresh } = await useFetch('/api/movies', {
  lazy: true  // Tùy chọn quan trọng!
})

// `pending` là một Ref<boolean> cho biết yêu cầu có đang được xử lý hay không.
// Chúng ta theo dõi nó để cập nhật biến `isLoading` của riêng mình.
watch(pending, (newPending) => {
  isLoading.value = newPending
}, { immediate: true })

// `data` là Ref chứa kết quả trả về từ API.
// Khi dữ liệu về, chúng ta gán nó vào biến `allMovies`.
watch(data, (newData) => {
  if (newData && Array.isArray(newData)) {
    allMovies.value = newData
  }
}, { immediate: true })

// `error` là Ref chứa lỗi nếu yêu cầu thất bại.
watch(error, (newError) => {
  if (newError) {
    console.error('API Error:', newError)
    // Xử lý lỗi, ví dụ hiển thị thông báo cho người dùng
  }
})
</script>

<template>
  <div>
    <!-- Hiển thị spinner trong khi dữ liệu đang được tải -->
    <LoadingSpinner :isVisible="isLoading" />

    <!-- Hiển thị danh sách phim khi đã có dữ liệu -->
    <div v-if="!isLoading && allMovies.length > 0">
      <MovieCard v-for="movie in allMovies" :key="movie.id" :movie="movie" />
    </div>
  </div>
</template>
```

### Các Tính Năng Chính của `useFetch`

-   **`data`**: Một `ref` chứa dữ liệu trả về thành công. Ban đầu nó là `null`.
-   **`pending`**: Một `ref` boolean cho biết yêu cầu có đang chờ xử lý hay không. Rất hữu ích để hiển thị trạng thái loading (ví dụ: spinner hoặc skeleton).
-   **`error`**: Một `ref` chứa đối tượng lỗi nếu yêu cầu thất bại.
-   **`refresh`**: Một hàm để thực hiện lại yêu cầu (ví dụ: khi người dùng nhấn nút "Tải lại").

### Tùy Chọn `lazy: true` - Tối Ưu Hóa Trải Nghiệm Người Dùng

Đây là một tùy chọn cực kỳ quan trọng trong dự án này.

-   **Mặc định (`lazy: false`)**: Nuxt sẽ đợi cho đến khi `useFetch` hoàn thành việc lấy dữ liệu rồi mới render trang. Nếu API chậm, người dùng sẽ phải nhìn vào một màn hình trắng trong một thời gian.
-   **Với `lazy: true`**: Nuxt sẽ render trang ngay lập tức với dữ liệu ban đầu là `null`. Đồng thời, nó sẽ thực hiện yêu cầu API ở phía client.
    -   **Lợi ích**: Người dùng thấy giao diện của trang (header, footer, layout) gần như ngay lập tức, cải thiện đáng kể trải nghiệm người dùng (Perceived Performance).
    -   **Cách hoạt động**: Trong khi dữ liệu đang được tải (`pending` là `true`), chúng ta có thể hiển thị một `LoadingSpinner` hoặc các `Skeleton` component. Khi dữ liệu về (`pending` là `false` và `data` có giá trị), giao diện sẽ tự động cập nhật để hiển thị nội dung thực tế.

### Tương Tác với Server API Routes

`useFetch('/api/movies')` hoạt động liền mạch với hệ thống API phía server của Nuxt. Khi bạn gọi `useFetch` với một đường dẫn tương đối như `/api/movies`, Nuxt đủ thông minh để biết rằng:

1.  **Khi render ở server (SSR)**: Nó sẽ gọi trực tiếp hàm trong `server/api/movies.ts` mà không cần thực hiện một yêu cầu HTTP thực sự.
2.  **Khi chạy ở client**: Nó sẽ thực hiện một yêu cầu `fetch` thực sự đến URL `http://localhost:3000/api/movies`.

Sự tích hợp chặt chẽ này giúp đơn giản hóa việc phát triển ứng dụng full-stack, cho phép bạn định nghĩa cả frontend và backend trong cùng một dự án.
