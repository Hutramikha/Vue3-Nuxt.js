# 1. Cấu Trúc Thư Mục và Tương Tác Giữa Các File trong Dự Án Nuxt 3

Dự án này sử dụng cấu trúc thư mục tiêu chuẩn của Nuxt 3, được thiết kế để tối ưu hóa việc phát triển và tổ chức code. Dưới đây là giải thích chi tiết về vai trò của từng thư mục và cách chúng tương tác với nhau.

## Sơ Đồ Cấu Trúc Thư Mục

```
movie-app/
├── app/
│   └── app.vue           # File gốc của ứng dụng
├── assets/
│   └── css/
│       └── main.css      # CSS toàn cục
├── components/
│   └── MovieCard.vue     # Component UI tái sử dụng
├── composables/
│   └── usePagination.ts  # Logic tái sử dụng (Composition API)
├── layouts/
│   └── default.vue       # Bố cục (layout) mặc định
├── pages/
│   └── index.vue         # Trang chủ (route '/')
├── server/
│   └── api/
│       └── movies.ts     # API endpoint phía server
└── stores/
    └── movieStore.ts     # State management với Pinia
```

## Giải Thích Chi Tiết

### 1. `app/app.vue` - File Gốc Của Ứng Dụng

- **Vai trò**: Đây là file component chính, nơi toàn bộ ứng dụng của bạn được render. Nó giống như `App.vue` trong một dự án Vue thông thường.
- **Tương tác**:
    - Nó sử dụng `<NuxtLayout>` để áp dụng một bố cục (ví dụ: `layouts/default.vue`) cho các trang.
    - Nó chứa `<NuxtPage />`, là nơi nội dung của các trang trong thư mục `pages/` sẽ được hiển thị dựa trên URL.
    - Trong dự án này, `app.vue` cũng là nơi khởi tạo `movieStore` và tải dữ liệu yêu thích từ `localStorage` khi ứng dụng bắt đầu.

**Ví dụ Code (`app.vue`):**
```vue
<script setup>
import { onMounted } from 'vue'
import { useMovieStore } from '~/stores/movieStore'

// Khởi tạo store
const movieStore = useMovieStore()

// Tải dữ liệu yêu thích khi ứng dụng được gắn kết (mounted)
onMounted(() => {
  movieStore.initFavorites()
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

### 2. `pages/` - Định Tuyến Dựa Trên File

- **Vai trò**: Nuxt tự động tạo các route (đường dẫn URL) dựa trên cấu trúc file trong thư mục này.
    - `pages/index.vue` -> `http://localhost:3000/`
    - `pages/movies/[id].vue` -> `http://localhost:3000/movies/1`, `http://localhost:3000/movies/2`, ...
- **Tương tác**:
    - `pages/index.vue` là trang chính, nơi hiển thị danh sách phim, các bộ lọc và chức năng tìm kiếm.
    - Nó import và sử dụng rất nhiều `composables` để quản lý logic phức tạp.
    - Nó cũng sử dụng component `components/MovieCard.vue` để hiển thị từng bộ phim.

### 3. `layouts/` - Bố Cục Tái Sử Dụng

- **Vai trò**: Chứa các bố cục chung cho ứng dụng, như header, footer, và thanh điều hướng.
- **Tương tác**:
    - `layouts/default.vue` định nghĩa cấu trúc chung của trang web.
    - Nó chứa một thẻ `<slot />`, là nơi nội dung từ các file trong `pages/` được chèn vào.
    - Điều này giúp bạn không phải lặp lại code header và footer trên mọi trang.

**Ví dụ Code (`layouts/default.vue`):**
```vue
<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header chung cho mọi trang -->
    <header>...</header>

    <!-- Nội dung của trang hiện tại sẽ được chèn vào đây -->
    <main class="flex-grow">
      <slot />
    </main>

    <!-- Footer chung cho mọi trang -->
    <footer>...</footer>
  </div>
</template>
```

### 4. `components/` - Các Component UI

- **Vai trò**: Chứa các component Vue có thể tái sử dụng. Nuxt sẽ tự động import chúng khi bạn sử dụng trong template.
- **Tương tác**:
    - `components/MovieCard.vue` là một ví dụ điển hình. Nó định nghĩa cách một thẻ phim được hiển thị.
    - `pages/index.vue` sử dụng `MovieCard` trong một vòng lặp `v-for` để hiển thị danh sách phim.
    - Bất kỳ component nào đặt trong thư mục này đều có thể được sử dụng ở bất kỳ đâu trong ứng dụng mà không cần import thủ công.

### 5. `composables/` - Logic Tái Sử Dụng

- **Vai trò**: Đây là nơi chứa các hàm "composable" của Vue 3. Mỗi file là một module chứa logic nghiệp vụ cụ thể, giúp tách biệt logic ra khỏi component.
- **Tương tác**:
    - `composables/usePagination.ts` chứa logic phân trang chung.
    - `composables/useMovieFilter.ts` và `composables/useMovieSearch.ts` sử dụng `usePagination` để tạo ra các chức năng lọc và tìm kiếm có phân trang.
    - `pages/index.vue` import và sử dụng các composable này để giữ cho file component của nó gọn gàng và dễ đọc.

### 6. `stores/` - Quản Lý Trạng Thái Toàn Cục (Pinia)

- **Vai trò**: Chứa các "store" của Pinia để quản lý trạng thái (state) toàn cục của ứng dụng.
- **Tương tác**:
    - `stores/movieStore.ts` quản lý danh sách các phim yêu thích.
    - Bất kỳ component nào (như `MovieCard.vue`) hoặc composable nào cũng có thể import và sử dụng store này để truy cập hoặc thay đổi trạng thái yêu thích.
    - `app.vue` gọi `initFavorites()` từ store này để đồng bộ hóa trạng thái từ `localStorage` khi khởi động.

### 7. `server/api/` - API Endpoint Phía Server

- **Vai trò**: Nuxt cho phép bạn tạo các API endpoint ngay trong dự án của mình. Các file trong thư mục này sẽ trở thành các API route.
- **Tương tác**:
    - `server/api/movies.ts` tạo ra một endpoint tại `/api/movies`.
    - `pages/index.vue` sử dụng hàm `useFetch('/api/movies')` để gọi đến endpoint này và lấy về danh sách 50 bộ phim.
    - Đây là một tính năng mạnh mẽ của Nuxt, cho phép bạn xây dựng một ứng dụng full-stack mà không cần một backend riêng biệt.

## Luồng Tương Tác Tổng Thể

1.  Người dùng truy cập vào `http://localhost:3000/`.
2.  Nuxt xác định route và render `pages/index.vue`.
3.  `app.vue` được tải, nó áp dụng `layouts/default.vue` làm bố cục.
4.  Nội dung của `pages/index.vue` được chèn vào thẻ `<slot />` trong `layouts/default.vue`.
5.  Trong `pages/index.vue`, hàm `useFetch('/api/movies')` được gọi.
6.  Yêu cầu được gửi đến `server/api/movies.ts`, file này trả về một danh sách JSON chứa 50 phim.
7.  Dữ liệu phim được truyền vào các `composables` (`useMovieFilter`, `useMovieSearch`, v.v.) để xử lý logic.
8.  Trang `index.vue` sử dụng component `MovieCard.vue` để lặp và hiển thị từng bộ phim.
9.  Khi người dùng click vào nút "yêu thích" trên một `MovieCard`, component này sẽ gọi một action trong `stores/movieStore.ts`.
10. `movieStore` cập nhật trạng thái yêu thích và đồng bộ nó với `localStorage`. Giao diện người dùng được tự động cập nhật nhờ vào tính chất "reactive" của Pinia và Vue.

## Ghi Chú Về Phiên Bản: Cấu Trúc Nuxt 3 trên Nền Tảng Nuxt 4

Một điểm quan trọng cần lưu ý là, mặc dù dự án này có thể đang chạy trên phiên bản Nuxt 4, cấu trúc thư mục mà chúng ta đang sử dụng (`pages/`, `components/`, `layouts/`, v.v.) là cấu trúc cốt lõi và đã được chuẩn hóa từ Nuxt 3.

**Đây không phải là một sự lỗi thời, mà là một minh chứng cho tính ổn định và khả năng tương thích ngược của Nuxt.**

-   **Tính năng:** Khả năng tương thích ngược (Backward Compatibility).
-   **Giải thích:** Các phiên bản mới của Nuxt (như Nuxt 4) được xây dựng dựa trên nền tảng vững chắc của các phiên bản trước. Cấu trúc thư mục tự động và các quy ước đặt tên là một phần nền tảng đó. Thay vì loại bỏ, Nuxt 4 giữ lại những gì đã hoạt động tốt và bổ sung thêm các tính năng mới hoặc cải tiến hiệu suất "bên trong".
-   **Lợi ích:** Điều này cho phép các nhà phát triển nâng cấp dự án từ Nuxt 3 lên Nuxt 4 một cách mượt mà mà không cần phải cấu trúc lại toàn bộ ứng dụng. Bạn có thể tận hưởng những cải tiến của phiên bản mới trong khi vẫn giữ được cấu trúc code quen thuộc và hiệu quả.
