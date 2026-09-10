# 5. UI Components và Styling với Tailwind CSS

Giao diện người dùng (UI) của dự án được xây dựng bằng cách kết hợp các **Component** Vue tái sử dụng và **Tailwind CSS** để tạo kiểu một cách nhanh chóng và nhất quán.

## Components Tự Động Import

Nuxt 3 có một tính năng tuyệt vời: bất kỳ component nào được đặt trong thư mục `components/` đều có thể được sử dụng ở bất kỳ đâu trong ứng dụng mà không cần phải `import` thủ công. Nuxt sẽ tự động quét và đăng ký chúng.

### Phân Tích `components/MovieCard.vue`

Đây là một component điển hình, chịu trách nhiệm hiển thị thông tin của một bộ phim duy nhất dưới dạng một "thẻ" (card).

**Mục đích:**
-   Nhận vào một đối tượng `movie` qua `props`.
-   Hiển thị poster, tên, năm, thể loại, và điểm đánh giá.
-   Chứa nút "Yêu thích" (trái tim) để tương tác với `movieStore`.
-   Bọc toàn bộ thẻ trong một `<NuxtLink>` để điều hướng đến trang chi tiết của phim khi được click.

**Code cốt lõi (`components/MovieCard.vue`):**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useMovieStore } from '~/stores/movieStore'

// Định nghĩa kiểu dữ liệu cho prop `movie` để có type-safety
interface Movie {
  id: number
  title: string
  poster: string
  year: string
  genre: string
  rating: number
}

// Nhận đối tượng `movie` từ component cha
const props = defineProps<{ movie: Movie }>()

// Sử dụng store để quản lý trạng thái yêu thích
const movieStore = useMovieStore()
const isFavorited = computed(() => movieStore.isFavorited(props.movie.id))

// Hàm xử lý khi click nút yêu thích
const toggleFavorite = async (e: Event) => {
  e.preventDefault()
  e.stopPropagation()
  await movieStore.toggleFavorite(props.movie.id)
}
</script>

<template>
  <!-- Bọc trong NuxtLink để điều hướng đến trang chi tiết -->
  <NuxtLink :to="`/movies/${props.movie.id}`" class="group cursor-pointer">
    <!-- Thẻ chứa poster -->
    <div class="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-800 shadow-lg 
                hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 
                transform hover:scale-105">
      
      <!-- Ảnh poster phim -->
      <NuxtImg 
        :src="props.movie.poster" 
        :alt="props.movie.title"
        loading="lazy"
        class="w-full h-full object-cover"
      />

      <!-- Lớp phủ (overlay) chỉ hiển thị khi hover -->
      <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                  flex flex-col justify-between p-3">
        
        <!-- Phần trên: Rating và Nút Yêu thích -->
        <div class="flex justify-between items-start">
          <!-- Rating -->
          <div class="flex items-center gap-1 bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            <Icon name="heroicons-solid:star" />
            {{ props.movie.rating }}
          </div>
          
          <!-- Nút Yêu thích -->
          <button @click.stop.prevent="toggleFavorite" :class="[isFavorited ? 'bg-emerald-600' : 'bg-emerald-500/20']">
            <Icon :name="isFavorited ? 'heroicons-solid:heart' : 'heroicons:heart'" />
          </button>
        </div>

        <!-- Phần dưới: Tên phim, năm, thể loại -->
        <div>
          <h3 class="font-bold text-sm text-white line-clamp-2">
            {{ props.movie.title }}
          </h3>
          <p class="text-xs text-emerald-400">
            {{ props.movie.year }} • {{ props.movie.genre }}
          </p>
        </div>
      </div>
    </div>

    <!-- Thông tin phụ bên dưới thẻ -->
    <div class="mt-3">
      <h3 class="font-bold text-sm text-white group-hover:text-emerald-400 transition">
        {{ props.movie.title }}
      </h3>
      <!-- ... -->
    </div>
  </NuxtLink>
</template>
```

## Styling với Tailwind CSS

Dự án này sử dụng **Tailwind CSS**, một framework CSS "utility-first". Thay vì viết các file CSS riêng biệt, bạn tạo kiểu cho các element trực tiếp trong HTML bằng cách áp dụng các class tiện ích.

**Ví dụ về các class tiện ích trong `MovieCard.vue`:**

-   **Layout & Sizing**:
    -   `relative`, `absolute`, `inset-0`: Dùng để định vị lớp phủ (overlay) bên trong thẻ poster.
    -   `flex`, `justify-between`, `items-start`: Sắp xếp các phần tử rating và nút yêu thích.
    -   `w-full`, `h-full`: Làm cho ảnh poster lấp đầy thẻ.
    -   `aspect-[2/3]`: Thiết lập tỷ lệ khung hình của thẻ là 2:3 (chiều rộng 2, chiều cao 3), rất phổ biến cho poster phim.

-   **Styling & Colors**:
    -   `rounded-lg`: Bo tròn các góc.
    -   `bg-gray-800`, `bg-emerald-600`: Đặt màu nền.
    -   `text-white`, `text-emerald-400`: Đặt màu chữ.
    -   `font-bold`, `text-sm`: Đặt độ đậm và kích thước font.
    -   `shadow-lg`: Thêm hiệu ứng đổ bóng.

-   **Trạng thái Hover & Group-Hover**:
    -   `hover:scale-105`: Khi di chuột (`hover`) vào thẻ, phóng to (`scale`) nó lên 105%.
    -   `hover:shadow-2xl`: Tăng độ đậm của bóng khi hover.
    -   `group`: Khi một element cha có class `group` (ở đây là `<NuxtLink>`), bạn có thể tạo kiểu cho các element con dựa trên trạng thái của cha.
    -   `group-hover:opacity-100`: Khi di chuột vào element `group`, làm cho lớp phủ (vốn có `opacity-0`) trở nên hoàn toàn sichtbar (`opacity-100`).
    -   `group-hover:text-emerald-400`: Đổi màu chữ của tiêu đề bên dưới thẻ khi hover vào `group`.

-   **Transitions (Hiệu ứng chuyển động)**:
    -   `transition-all`, `duration-300`: Làm cho tất cả các thay đổi (màu sắc, kích thước, vị trí) diễn ra mượt mà trong 300ms.

**Lợi ích của Tailwind CSS:**

1.  **Nhanh chóng**: Bạn không cần phải chuyển qua lại giữa file HTML và CSS.
2.  **Nhất quán**: Dễ dàng duy trì một hệ thống thiết kế nhất quán (màu sắc, khoảng cách, kích thước font).
3.  **Tối ưu hóa**: Tailwind tự động loại bỏ tất cả các class không được sử dụng trong quá trình build, giúp file CSS cuối cùng cực kỳ nhỏ gọn.
4.  **Responsive**: Dễ dàng tạo giao diện đáp ứng cho các kích thước màn hình khác nhau bằng các tiền tố như `sm:`, `md:`, `lg:` (ví dụ: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`).
