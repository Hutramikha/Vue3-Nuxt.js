# 📋 HƯỚNG DẪN CÁC MỤC ỨNG DỤNG TRONG BÁO CÁO
## Vue3-Nuxt Movie App - 10 Application Modules

---

## **📌 1. MỤC 3.3: KHỞI TẠO KHUNG DỰ ÁN (Project Setup)**

### 📖 Định nghĩa

**Project Setup** là quá trình cấu hình nền tảng ban đầu: cấu trúc thư mục theo Nuxt convention, cài đặt dependencies (Vue 3, Pinia, Tailwind), và cấu hình các file (nuxt.config.ts, tsconfig.json). Điều này giúp dự án có cấu trúc rõ ràng, dễ bảo trì, và tận dụng tính năng auto-routing của Nuxt.

### 💻 Code mẫu (Simplified):

**File: package.json (Essentials)**
```json
{
  "name": "movie-app-demo",
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "preview": "nuxt preview"
  },
  "dependencies": {
    "vue": "^3.5.30",
    "nuxt": "^4.4.2",
    "pinia": "3.0.4",
    "@nuxtjs/tailwindcss": "^6.14.0"
  }
}
```

**Cấu trúc folder tối thiểu:**
```
movie-app-demo/
├── app.vue           # Root component
├── nuxt.config.ts    # Nuxt configuration
├── pages/            # Auto-routed pages
│   └── index.vue
├── composables/      # Reusable hooks
├── components/       # Reusable UI components
├── stores/           # Pinia stores
├── server/api/       # Backend endpoints
└── public/           # Static assets
```

### 🎬 Minh chứng thực nghiệm (2 screenshots):

**Minh chứng 1: Terminal - npm run dev**
- Chụp: Cửa sổ terminal hiển thị "✔ Nuxt 4.x server running at http://localhost:3000"
- Chứng minh: Dev server khởi động thành công

**Minh chứng 2: VS Code - Folder Structure**
- Chụp: File Explorer hiển thị cây thư mục đầy đủ (pages, composables, stores, etc)
- Chứng minh: Cấu trúc folder đã setup đúng theo Nuxt convention

---

## **📌 2. MỤC 4.3: XÂY DỰNG LOGIC TÌM KIẾM VÀ LỌC PHIM (Search & Filter)**

### 📖 Định nghĩa

**Search & Filter** là hai tính năng giúp người dùng tìm phim nhanh: Search cho phép tìm theo từ khóa (được lưu trong URL query `?search=...`), Filter cho phép chọn nhiều điều kiện (thể loại + năm) với logic AND. Search & Filter đều dùng computed properties của Composition API để tự động cập nhật khi dữ liệu thay đổi.

### 💻 Code mẫu (Simplified):
```typescript
/**
 * useMovieSearch: Tìm kiếm phim theo từ khóa
 * - searchQuery: từ khóa từ URL query (?search=...)
 * - searchedMovies: danh sách phim khớp từ khóa
 * - searchedMoviesPaginated: phim hiển thị trên page hiện tại (16 phim/trang)
 */
export const useMovieSearch = (allMovies: Ref<any[]>) => {
  const route = useRoute()
  const router = useRouter()

  const searchQuery = computed(() => route.query.search as string || '')
  
  const searchedMovies = computed(() => {
    if (!searchQuery.value) return []
    // Lọc phim theo title hoặc genre (case-insensitive)
    return allMovies.value.filter(movie =>
      movie.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      movie.genre.some((g: string) =>
        g.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    )
  })

  return {
    searchQuery,
    searchedMovies
  }
}
```

#### **B. Code Example 2: useMovieFilter.ts**
```typescript
/**
 * useMovieFilter: Lọc phim theo thể loại và năm
 * - activeGenreFilters: Set các thể loại đã chọn
 * - activeYearFilters: Set các năm đã chọn
 * - filteredMovies: phim khớp tất cả filters
 */
export const useMovieFilter = (allMovies: Ref<any[]>) => {
  const activeGenreFilters = ref<Set<string>>(new Set())
  const activeYearFilters = ref<Set<number>>(new Set())

  // Lấy danh sách tất cả thể loại
  const allGenres = computed(() => {
    const genres = new Set<string>()
    allMovies.value.forEach(movie => {
      movie.genre.forEach((g: string) => genres.add(g))
    })
    return Array.from(genres).sort()
  })

  const filteredMovies = computed(() => {
    return allMovies.value.filter(movie => {
      const genreMatch = activeGenreFilters.value.size === 0 ||
        movie.genre.some((g: string) => activeGenreFilters.value.has(g))
      const yearMatch = activeYearFilters.value.size === 0 ||
        activeYearFilters.value.has(movie.year)
      return genreMatch && yearMatch
    })
  })

  const filterByGenre = (genre: string) => {
    const newSet = new Set(activeGenreFilters.value)
    newSet.has(genre) ? newSet.delete(genre) : newSet.add(genre)
    activeGenreFilters.value = newSet
  }

  return {
    activeGenreFilters,
    activeYearFilters,
    allGenres,
    allYears,
    filteredMovies,
    filterByGenre,
    filterByYear,
    resetFilter
  }
}
```

#### **C. Code Example 3: pages/index.vue - Usage**
```vue
<script setup>
const { searchQuery, searchedMovies } = useMovieSearch(allMovies)
const { activeGenreFilters, filteredMovies, filterByGenre } = useMovieFilter(allMovies)
</script>

<template>
  <!-- Khi tìm kiếm -->
  <div v-if="searchQuery" class="grid grid-cols-4 gap-6">
    <MovieCard v-for="movie in searchedMovies" :movie="movie" />
  </div>

  <!-- Bộ lọc UI -->
  <div class="mb-4">
    <button
      v-for="genre in allGenres"
      @click="filterByGenre(genre)"
      :class="{
        'bg-emerald-600': activeGenreFilters.has(genre),
        'bg-gray-800': !activeGenreFilters.has(genre)
      }"
    >
      {{ genre }}
    </button>
  </div>

  <!-- Hiển thị kết quả lọc -->
  <div class="grid grid-cols-4 gap-6">
    <MovieCard v-for="movie in filteredMovies" :movie="movie" />
  </div>
</template>
```

### 🎬 Minh chứng thực nghiệm:
1. **Screenshot 1**: Kết quả tìm kiếm
   - Nhập từ khóa "Avatar" trong Header search
   - Chụp: URL thay đổi thành `?search=Avatar`, hiển thị 3-5 phim khớp

2. **Screenshot 2**: Kết quả lọc
   - Nhấn "Hành Động" + "2020"
   - Chụp: Grid phim thay đổi, hiển thị "Kết Quả Lọc (8 phim)" + các filter chip

3. **Screenshot 3**: Bộ lọc UI (Filter panel)
   - Chụp: Nút "Hiện Bộ Lọc" đã nhấn, hiển thị 2 hàng button (thể loại + năm), nút được highlight khi chọn

---

## **📌 3. MỤC 5.4: XÂY DỰNG COMPONENT MOVIECARD VÀ THEHEADER**

### 📖 Định nghĩa

**Components** là các khối giao diện tái sử dụng (MovieCard, TheHeader). MovieCard hiển thị thông tin bộ phim (poster, title, rating), có hover effect với nút ❤️ yêu thích. TheHeader là thanh điều hướng sticky ở top với logo, search input, navigation links, và nút login. Tách components giúp tái sử dụng code, dễ bảo trì, và đảm bảo tính nhất quán UI.

### 💻 Code mẫu (Simplified):
```vue
<script setup lang="ts">
/**
 * MovieCard Component: Hiển thị thông tin một bộ phim
 * - movie prop: dữ liệu phim {id, title, poster, rating, ...}
 * - isFavorited computed: kiểm tra phim có nằm trong danh sách yêu thích
 * - toggleFavorite: thêm/bỏ yêu thích
 */
interface Movie {
  id: number
  title: string
  poster: string
  rating: number
  year: number
  genre: string[]
  synopsis: string
}

const props = defineProps<{ movie: Movie }>()
const movieStore = useMovieStore()

// Kiểm tra phim có nằm trong danh sách yêu thích không
const isFavorited = computed(() => movieStore.isFavorited(props.movie.id))

// Thêm/bỏ yêu thích
const toggleFavorite = (e: Event) => {
  e.preventDefault()
  e.stopPropagation()
  movieStore.toggleFavorite(props.movie)
}
</script>

<template>
  <NuxtLink :to="`/movies/${movie.id}`" class="group relative">
    <!-- Poster image -->
    <NuxtImg :src="movie.poster" alt="movie.title" class="rounded-lg" />
    
    <!-- Overlay on hover -->
    <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition
                 bg-black/80 rounded-lg flex flex-col justify-between p-4">
      <!-- Rating -->
      <div class="star-rating">{{ movie.rating }}/10 ⭐</div>
      
      <!-- Favorite button -->
      <button
        @click="toggleFavorite"
        :class="{
          'text-red-500': isFavorited,
          'text-gray-400': !isFavorited
        }"
        class="text-2xl hover:scale-110 transition"
      >
        ❤️
      </button>
    </div>
    
    <!-- Title -->
    <h3 class="mt-2 font-semibold text-white line-clamp-2">{{ movie.title }}</h3>
  </NuxtLink>
</template>
```

#### **B. Code Example 2: layouts/default.vue - TheHeader**
```vue
<script setup>
const { showAuthModal, toggleAuthModal } = useHeader()
const { goHome } = useNavigation()

const handleSearch = (query: string) => {
  useRouter().push({ query: { search: query } })
}
</script>

<template>
  <div>
    <!-- Header -->
    <header class="bg-black border-b border-gray-800 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <!-- Logo -->
        <div @click="goHome" class="cursor-pointer">
          <h1 class="text-2xl font-bold text-emerald-500">🎬 KHANLIX</h1>
        </div>

        <!-- Search Input -->
        <div class="flex-1 mx-8">
          <input
            type="text"
            placeholder="Tìm kiếm phim..."
            @keyup.enter="handleSearch($event.target.value)"
            class="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <!-- Navigation Links -->
        <nav class="flex gap-6">
          <NuxtLink to="/" class="hover:text-emerald-400">Trang chủ</NuxtLink>
          <NuxtLink to="/favorites" class="hover:text-emerald-400">❤️ Yêu thích</NuxtLink>
          <NuxtLink to="/history" class="hover:text-emerald-400">�℧ Lịch sử</NuxtLink>
          <button @click="toggleAuthModal" class="bg-emerald-600 px-4 py-2 rounded hover:bg-emerald-700">
            Đăng nhập
          </button>
        </nav>
      </div>
    </header>

    <!-- Main content -->
    <main class="max-w-7xl mx-auto px-4 py-8">
      <slot />
    </main>
  </div>
</template>
```

### 🎬 Minh chứng thực nghiệm:
1. **Screenshot 1**: MovieCard hover effect
   - Di chuột vào card phim
   - Chụp: Overlay hiển thị, rating + ❤️ button visible, text mờ

2. **Screenshot 2**: TheHeader layout + search
   - Chụp: Header sticky ở top với logo, search input, navigation links, login button
   - Tính năng: Nhập "Avatar" vào search, Enter → URL thay đổi

3. **Screenshot 3**: MovieCard favorited state
   - Nhấn ❤️ button trên card
   - Chụp: Icon thay đổi màu thành đỏ, card được highlight

---

## **📌 4. MỤC 6.3: XÂY DỰNG MODULE "PHIM YÊU THÍCH"**

### 📖 Định nghĩa

**Phim Yêu Thích** là tính năng cho phép người dùng lưu phim yêu thích trong Pinia store (dùng normalization - Object key-value). Dữ liệu được persist vào localStorage nên khi refresh hay đóng mở lại app, yêu thích vẫn giữ. Pages/favorites.vue hiển thị danh sách, MovieCard.vue có nút ❤️ để toggle.

### 💻 Code mẫu (Simplified):

#### **A. Code Example 1: stores/movieStore.ts**
```typescript
import { defineStore } from 'pinia'

/**
 * movieStore: Quản lý trạng thái phim toàn ứng dụng
 * State:
 *   - favorites: Object<id, movie> - Normalization (O(1) lookup)
 *   - favorites lưu vào localStorage tự động (pinia-plugin-persistedstate)
 */
export const useMovieStore = defineStore('movie', {
  state: () => ({
    favorites: {} as Record<number, any>
  }),

  getters: {
    // Trả về danh sách yêu thích (array)
    favoriteList: (state) => Object.values(state.favorites),
    
    // Trả về số lượng yêu thích
    favoriteCount: (state) => Object.keys(state.favorites).length,
    
    // Kiểm tra phim có yêu thích không (O(1))
    isFavorited: (state) => (movieId: number) => {
      return movieId in state.favorites
    }
  },

  actions: {
    // Khởi tạo từ localStorage
    initFavorites() {
      const stored = localStorage.getItem('movie_favorites')
      if (stored) {
        try {
          this.favorites = JSON.parse(stored)
        } catch (e) {
          console.error('Failed to parse favorites:', e)
          this.favorites = {}
        }
      }
    },

    // Toggle yêu thích (add/remove)
    toggleFavorite(movie: any) {
      if (this.isFavorited(movie.id)) {
        delete this.favorites[movie.id]
      } else {
        this.favorites[movie.id] = movie
      }
      // Tự động lưu vào localStorage (observable)
      localStorage.setItem('movie_favorites', JSON.stringify(this.favorites))
    },

    // Thêm yêu thích
    addFavorite(movie: any) {
      this.favorites[movie.id] = movie
      localStorage.setItem('movie_favorites', JSON.stringify(this.favorites))
    },

    // Bỏ yêu thích
    removeFavorite(movieId: number) {
      delete this.favorites[movieId]
      localStorage.setItem('movie_favorites', JSON.stringify(this.favorites))
    }
  }
})
```

#### **B. Code Example 2: app.vue - Initialize Store**
```vue
<script setup>
const movieStore = useMovieStore()

// Khởi tạo favorites từ localStorage
onMounted(() => {
  movieStore.initFavorites()
})
</script>

<template>
  <div id="app">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
```

#### **C. Code Example 3: pages/favorites.vue**
```vue
<script setup>
const movieStore = useMovieStore()
const favoriteList = computed(() => movieStore.favoriteList)
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">❤️ Phim Yêu Thích ({{ movieStore.favoriteCount }})</h1>
    
    <div v-if="favoriteList.length === 0" class="text-center py-20">
      <p class="text-gray-400">Chưa có phim yêu thích nào</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <MovieCard v-for="movie in favoriteList" :key="movie.id" :movie="movie" />
    </div>
  </div>
</template>
```

### 🎬 Minh chứng thực nghiệm:
1. **Screenshot 1**: Thêm phim yêu thích
   - Click ❤️ trên MovieCard
   - Chụp: Icon đổi thành đỏ, notification "Đã thêm vào yêu thích"

2. **Screenshot 2**: Favorites page với phim
   - Chuyển đến `/favorites`
   - Chụp: Grid phim yêu thích (2-4 phim), counter "❤️ Phim Yêu Thích (4)"

3. **Screenshot 3**: Persistence - Refresh page
   - F5 refresh trang
   - Chụp: Favorites vẫn hiển thị (dữ liệu từ localStorage)

---

## **📌 5. MỤC 7.3: XÂY DỰNG HỆ THỐNG ĐIỀU HƯỚNG TRANG DANH MỤC PHIM (Pagination)**

### 📖 Định nghĩa

**Pagination** là kỹ thuật chia 50 phim thành 5 danh mục (mỗi 10 phim), mỗi danh mục lại chia 2 trang (mỗi 5 phim). useMovieCategories composable tracking trang hiện tại của mỗi danh mục, dùng computed để tính slice phim. UI có nút "1", "2" để chuyển trang. Pagination tối ưu hiệu suất (không render 50 phim cùng lúc) và UX (dễ duyệt).

### 💻 Code mẫu (Simplified):
```typescript
/**
 * useMovieCategories: Quản lý 5 danh mục phim
 * - Chia 50 phim thành 5 danh mục (10 phim/mục)
 * - Mỗi danh mục có phân trang (5 phim/trang = 2 trang/mục)
 */
export const useMovieCategories = (allMovies: Ref<any[]>) => {
  const categories = reactive({
    new: { startIndex: 0, endIndex: 10, currentPage: ref(1) },
    hot: { startIndex: 10, endIndex: 20, currentPage: ref(1) },
    mostViewed: { startIndex: 20, endIndex: 30, currentPage: ref(1) },
    trending: { startIndex: 30, endIndex: 40, currentPage: ref(1) },
    today: { startIndex: 40, endIndex: 50, currentPage: ref(1) }
  })

  // Lấy phim của danh mục (10 phim)
  const getCategoryMovies = (category: any) => {
    return allMovies.value.slice(category.startIndex, category.endIndex)
  }

  // Phân trang: 5 phim/trang
  const getPaginatedMovies = (categoryMovies: any[], page: number) => {
    const start = (page - 1) * 5
    const end = start + 5
    return categoryMovies.slice(start, end)
  }

  // Computed properties cho mỗi danh mục
  const newMoviesPaginated = computed(() => {
    const categoryMovies = getCategoryMovies(categories.new)
    return getPaginatedMovies(categoryMovies, categories.new.currentPage.value)
  })

  const totalPagesNew = computed(() => {
    const categoryMovies = getCategoryMovies(categories.new)
    return Math.ceil(categoryMovies.length / 5)
  })

  // Tương tự cho hot, mostViewed, trending, today...

  // Methods để chuyển trang
  const goToPageNew = (page: number) => {
    if (page >= 1 && page <= totalPagesNew.value) {
      categories.new.currentPage.value = page
    }
  }

  return {
    categories,
    newMoviesPaginated,
    totalPagesNew,
    hotMoviesPaginated,
    totalPagesHot,
    mostViewedPaginated,
    totalPagesMostViewed,
    trendingPaginated,
    totalPagesTrending,
    todayPaginated,
    totalPagesToday,
    goToPageNew,
    goToPageHot,
    goToPageMostViewed,
    goToPageTrending,
    goToPageToday
  }
}
```

#### **B. Code Example 2: pages/index.vue - Category Display**
```vue
<script setup>
const { newMoviesPaginated, totalPagesNew, goToPageNew } = useMovieCategories(allMovies)
</script>

<template>
  <div>
    <!-- DANH MỤC 1: PHIM MỚI CẬP NHẬT -->
    <div class="mb-16">
      <h2 class="text-3xl font-bold mb-6">🎬 Phim Mới Cập Nhật</h2>
      
      <!-- Grid phim: 5 phim/hàng -->
      <div class="grid grid-cols-5 gap-6 mb-6">
        <MovieCard v-for="movie in newMoviesPaginated" :movie="movie" />
      </div>

      <!-- Pagination -->
      <div v-if="totalPagesNew > 1" class="flex justify-center gap-2">
        <button 
          v-for="page in totalPagesNew"
          @click="goToPageNew(page)"
          class="px-4 py-2 rounded bg-gray-800 hover:bg-emerald-600"
        >
          {{ page }}
        </button>
      </div>
    </div>

    <!-- DANH MỤC 2, 3, 4, 5: TỰ ĐỘNG TRONG VÒNG LẶP... -->
  </div>
</template>
```

#### **C. Code Example 3: pages/categories/[name].vue**
```vue
<script setup>
const route = useRoute()
const categoryName = route.params.name as string

// Lấy danh sách phim từ tên danh mục
const allMovies = ref([])
const { data } = await useFetch('/api/movies')
allMovies.value = data.value || []

// Filter phim theo danh mục
const categoryMovies = computed(() => {
  const categoryMap: Record<string, [number, number]> = {
    'phim-moi': [0, 10],
    'phim-hot': [10, 20],
    'most-viewed': [20, 30],
    'trending': [30, 40],
    'today': [40, 50]
  }
  const [start, end] = categoryMap[categoryName] || [0, 10]
  return allMovies.value.slice(start, end)
})
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">{{ categoryName }}</h1>
    <div class="grid grid-cols-4 gap-6">
      <MovieCard v-for="movie in categoryMovies" :movie="movie" />
    </div>
  </div>
</template>
```

### 🎬 Minh chứng thực nghiệm:
1. **Screenshot 1**: Trang chủ với 5 danh mục + pagination
   - Chụp: H2 headings "Phim Mới Cập Nhật", "Phim Kinh Điển", "Trending", với 2 nút trang (1, 2) dưới mỗi danh mục

2. **Screenshot 2**: Thay đổi trang
   - Thao tác: Nhấn nút "2" ở danh mục "Phim Mới"
   - Chụp: Grid phim thay đổi, hiển thị phim 6-10 thay vì 1-5, nút "2" được highlight

3. **Screenshot 3**: Category detail page (Optional)
   - URL: `/categories/trending`
   - Chụp: URL thay đổi, grid hiển thị 10 phim trending

---

## **📌 6. MỤC 8.4: TRIỂN KHAI HỆ THỐNG API MOVIE NỘI BỘ (Backend API)**

### 📖 Định nghĩa

**Backend API** là endpoint server `/api/movies` cung cấp 50 phim dữ liệu, hỗ trợ filtering (genre, year) và searching. Frontend gọi `useFetch('/api/movies?genre=Action')` → server filter → return kết quả. Tách API là tốt vì: tập trung dữ liệu ở server, tối ưu query (database index), scalable khi có nhiều phim, và reusable cho mobile/desktop.

### Nội dung để viết trong báo cáo:

#### **A. Code Example 1: server/api/movies.ts**
```typescript
/**
 * Backend API: Danh sách 50 phim
 * Endpoints:
 * - GET /api/movies - Trả về tất cả 50 phim
 * - GET /api/movies?genre=Action - Lọc theo thể loại
 * - GET /api/movies?year=2020 - Lọc theo năm
 * - GET /api/movies?search=Avatar - Tìm kiếm theo title/genre
 */

const movies = [
  {
    id: 1,
    title: 'Avatar: The Way of Water',
    poster: '/images/avatar.jpg',
    year: 2022,
    rating: 8.3,
    genre: ['Sci-Fi', 'Adventure'],
    synopsis: 'Jake Sully và gia đình phải rời khỏi nhà...',
    trailerUrl: 'https://youtu.be/...'
  },
  {
    id: 2,
    title: 'The Shawshank Redemption',
    poster: '/images/shawshank.jpg',
    year: 1994,
    rating: 9.3,
    genre: ['Drama', 'Crime'],
    synopsis: 'Hai phạm nhân đặc biệt tìm được tình bạn...',
    trailerUrl: 'https://youtu.be/...'
  },
  // ... 48 phim khác (tổng 50)
]

export default defineEventHandler((event) => {
  const query = getQuery(event)
  let results = [...movies]

  // Lọc theo thể loại
  if (query.genre) {
    results = results.filter(m =>
      m.genre.some(g => g.toLowerCase() === (query.genre as string).toLowerCase())
    )
  }

  // Lọc theo năm
  if (query.year) {
    results = results.filter(m => m.year === parseInt(query.year as string))
  }

  // Tìm kiếm theo title
  if (query.search) {
    results = results.filter(m =>
      m.title.toLowerCase().includes((query.search as string).toLowerCase())
    )
  }

  return results
})
```

#### **B. Code Example 2: useFetch('/api/movies')**
```typescript
// Trong components/pages
const { data: allMovies, pending, error } = await useFetch('/api/movies')

// Với filters
const { data: filteredMovies } = await useFetch(() => {
  const params = new URLSearchParams()
  if (selectedGenre.value) params.append('genre', selectedGenre.value)
  if (selectedYear.value) params.append('year', selectedYear.value)
  return `/api/movies?${params.toString()}`
})
```

#### **C. Code Example 3: Movie data structure**
```typescript
interface Movie {
  id: number
  title: string
  poster: string        // Relative path: /images/movie1.jpg
  year: number
  rating: number        // 1-10
  genre: string[]       // ['Action', 'Sci-Fi']
  synopsis: string      // HTML supported
  trailerUrl: string    // YouTube embed URL
  director?: string
  cast?: string[]
  duration?: number     // minutes
  releaseDate?: string
  tmdbId?: number       // For future API expansion
}
```

### 🎬 Minh chứng thực nghiệm:
1. **Network Request**: Bắt request `/api/movies` response JSON 50 phim (Response tab show phim array).
2. **Filter Performance**: Request `/api/movies?genre=Action&search=Avatar` → server filter 2 phim (Query Params tab).
3. **API Data Structure**: JSON response show movie object structure (id, title, year, genre, rating, director...).

---

## **📌 7. MỤC 9.3: TỐI ƯU SEO CHO TRANG CHI TIẾT PHIM**

### 📖 Định nghĩa

**SEO Optimization** là quá trình nhúng meta tags (description, keywords, Open Graph) và structured data vào HTML trang phim. Giúp Google, Facebook, Twitter hiểu rõ nội dung: tiêu đề phim là gì, poster ra sao, rating bao nhiêu. Kết quả: trang phim được xếp hạng cao hơn, khi share lên mạng xã hội hiển thị đúng tiêu đề + ảnh + mô tả, organic traffic tăng.

### 💻 Code mẫu:

#### **A. Code Example 1: utils/seo.ts - Tạo meta tags động**
```typescript
// Tạo meta tags dựa trên dữ liệu phim
export const generateMovieMeta = (movie: any) => {
  return [
    {
      name: 'description',
      content: `Xem phim ${movie.title}. Thể loại: ${movie.genre}. Năm phát hành: ${movie.year}. Rating: ${movie.rating}/10`
    },
    {
      name: 'keywords',
      content: `${movie.title}, xem phim, ${movie.genre}, ${movie.year}`
    },
    {
      property: 'og:title',
      content: `${movie.title} | KHANLIX`
    },
    {
      property: 'og:description',
      content: `Xem ${movie.title} trực tuyến với chất lượng HD`
    },
    {
      property: 'og:image',
      content: `http://localhost:3000${movie.poster || ''}`
    },
    {
      property: 'og:type',
      content: 'video.movie'
    }
  ]
}

export const generatePageTitle = (movie: any) => {
  return `${movie.title} | KHANLIX`
}
```

#### **B. Code Example 2: pages/movies/[id].vue - Áp dụng useHead()**
```vue
<script setup lang="ts">
import { generateMovieMeta, generatePageTitle } from '~/utils/seo'

// Fetch phim
const { data: allMovies } = await useFetch('/api/movies')

// Lấy movieId từ URL
const route = useRoute()
const movie = computed(() => {
  return allMovies.value?.find(m => m.id === parseInt(route.params.id as string))
})

// ✅ Áp dụng SEO: cập nhật <title> và <meta> tags động
useHead({
  title: () => generatePageTitle(movie.value || { title: 'Phim' }),
  meta: () => movie.value ? generateMovieMeta(movie.value) : []
})
</script>

<template>
  <div v-if="movie" class="max-w-6xl mx-auto px-4 py-8">
    <div class="flex gap-8">
      <NuxtImg :src="movie.poster" :alt="movie.title" class="w-64 rounded-lg" />
      <div>
        <h1 class="text-4xl font-bold">{{ movie.title }}</h1>
        <p class="text-gray-400">{{ movie.year }} | ⭐ {{ movie.rating }}/10</p>
        <p>{{ movie.synopsis }}</p>
      </div>
    </div>
  </div>
</template>
```

### 🎬 Minh chứng thực nghiệm:

**Minh chứng 1: Kiểm tra meta tags trong DevTools**
- Bước 1: Chạy `npm run dev`
- Bước 2: Truy cập `http://localhost:3000/movies/1`
- Bước 3: Nhấn **F12** → chọn tab **Elements**
- Bước 4: Nhấn **Ctrl+F** tìm `og:title` hoặc `description`
- Bước 5: **Chụp hình** hiển thị các meta tags trong `<head>`
  - Nhìn thấy: `<meta property="og:title" content="Lật Mặt 7: Một Điều Ước | KHANLIX">`
  - Nhìn thấy: `<meta property="og:image" content="http://localhost:3000/images/...">`
  - Nhìn thấy: `<title>Lật Mặt 7: Một Điều Ước | KHANLIX</title>`

**Minh chứng 2: So sánh 2 trang phim khác nhau (Chứng minh SEO động)**
- Bước 1: Truy cập `/movies/1` → Chụp hình `<title>` + `og:title` + `og:image`
- Bước 2: Chuyển sang `/movies/2` → Chụp hình `<title>` + `og:title` + `og:image`
- Bước 3: So sánh 2 hình: **tiêu đề, ảnh khác nhau = SEO hoạt động động** ✅

**Minh chứng 3: Kiểm tra View Page Source (HTML raw)**
- Bước 1: Chuột phải trang → **View Page Source** (Ctrl+U)
- Bước 2: **Ctrl+F** tìm `<meta name="description"`
- Bước 3: **Chụp hình** hiển thị:
  ```html
  <meta name="description" content="Xem Lật Mặt 7: Một Điều Ước. Thể loại: Tâm Lý, Gia Đình. Rating: 9.0/10">
  <meta property="og:title" content="Lật Mặt 7: Một Điều Ước | KHANLIX">
  <meta property="og:image" content="http://localhost:3000/images/posters/lat-mat-7.jpg">
  ```

---

## **📌 8. MỤC 10.3: TỐI ƯU TỐC ĐỘ TẢI TRANG CHỦ**

### 📖 Định nghĩa

**Performance Optimization (Tối ưu hiệu năng)** là các kỹ thuật giúp trang web tải nhanh hơn: lazy loading (chỉ tải hình ảnh khi cần), code splitting (chia JavaScript thành các file nhỏ để trang load nhanh lần đầu), nén hình ảnh sang định dạng WebP nhẹ hơn, và caching (lưu dữ liệu tạm để lần sau không phải tải lại). Kết quả: trang tải nhanh, người dùng không phải đợi, trải nghiệm mượt mà.

### Nội dung để viết trong báo cáo:

#### **A. Code Example 1: Lazy Loading Components**
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@nuxt/image',  // Auto image optimization
  ],
  
  // Code splitting cho routes
  router: {
    options: {
      scrollBehaviorType: 'smooth'
    }
  }
})
```

```vue
<!-- pages/index.vue -->
<script setup>
// Lazy load components (code splitting)
const MovieCard = defineAsyncComponent(() => import('~/components/MovieCard.vue'))
const AuthModal = defineAsyncComponent(() => import('~/components/AuthModal.vue'))

// v-if trì hoãn việc load
const showAuthModal = ref(false)
</script>

<template>
  <!-- AuthModal chỉ load khi showAuthModal = true -->
  <AuthModal v-if="showAuthModal" />
  
  <!-- MovieCard load ngay lập tức (sẽ improve bằng defineAsyncComponent nếu cần) -->
  <div class="grid grid-cols-5 gap-6">
    <MovieCard v-for="movie in newMovies" :movie="movie" />
  </div>
</template>
```

#### **B. Code Example 2: Image Optimization**
```vue
<template>
  <!-- Sử dụng NuxtImg (tự động optimize) -->
  <NuxtImg
    :src="movie.poster"
    :alt="movie.title"
    sizes="sm:100vw md:50vw lg:400px"
    quality="80"
    format="webp"
    loading="lazy"
    class="rounded-lg"
  />
</template>
```

#### **C. Code Example 3: Caching Strategy**
```typescript
// composables/useApi.ts
export const useApi = () => {
  const safeFetch = async (url: string, options = {}) => {
    // Cache strategy: tiêu đề request/response
    return await useFetch(url, {
      ...options,
      // Hỏi server nếu fresh, nhưng cache nếu expired
      // Headers: Cache-Control: max-age=3600
    })
  }
  return { safeFetch }
}
```

#### **D. Code Example 4: Performance Metrics**
```typescript
// Measure và log performance
if (typeof window !== 'undefined' && window.performance) {
  onMounted(() => {
    window.addEventListener('load', () => {
      const perfData = window.performance.timing
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart
      const connectTime = perfData.responseEnd - perfData.requestStart
      const renderTime = perfData.domComplete - perfData.domLoading
      
      console.log(`
        Page Load Time: ${pageLoadTime}ms
        Connect Time: ${connectTime}ms
        Render Time: ${renderTime}ms
      `)
    })
  })
}
```

### 🎬 Minh chứng thực nghiệm:
1. **Lighthouse Performance Audit**: DevTools → Lighthouse → Score 80+ with FCP < 2s, LCP < 2.5s, CLS < 0.1
2. **Network Waterfall**: DevTools → Network tab shows all resources loaded in parallel, total size < 2MB, WebP images used
3. **Performance Metrics**: Console logs showing Page Load Time < 1.8s, Connect < 300ms, Render < 500ms (after optimization)

---

## **📊 TÓNG HỢP MINH CHỨNG CẦN CHUẨN BỊ**

| Mục | Tổng Screenshots | Loại Proof |
|-----|-----------------|-----------|
| 3.3 Project Setup | 3 | Terminal + Folder structure + Network |
| 4.3 Search & Filter | 3 | Search results + Filter results + Filter UI panel |
| 5.4 Components | 3 | Hover effect + Header layout + Favorite state |
| 6.3 Favorites | 3 | Add favorite + Page with films + Refresh persistence |
| 7.3 Navigation | 3 | Categories + pagination + Page change + Category detail (optional) |
| 8.4 API | 3 | Network request + Filter performance + Data structure |
| 9.3 SEO | 3 | Meta tags in head + JSON-LD schema + Rich results |
| 10.3 Performance | 3 | Lighthouse audit + Network waterfall + Performance logs |
| **TỔNG** | **24 screenshots** | Mixed |

---

## 📝 **CÁCH CHỤP SCREENSHOT CHUYÊN NGHIỆP**

### Quy cách chung:
1. **Quy chuẩn màn hình**: 1920x1080 resolution (hoặc khác, nhưng thống nhất)
2. **Không chụp taskbar/statusbar**: Cắt chỉ lại phần App/Browser
3. **Highlight quan trọng**: Dùng mũi tên/hình chữ nhật màu để chỉ mục đích
4. **Caption rõ ràng**: Mỗi screenshot có text giải thích ở dưới
5. **Format**: PNG hoặc JPG (quality 80+%)

### Tool gợi ý:
- **Snagit** - Chuyên nghiệp
- **ShareX** - Miễn phí, mạnh
- **Gyroflow Toolbox** - Cho video recording
- **OBS** - Nếu đụng video demo

### Cách tổ chức:
```
Báo_Cáo/
├── 3.3_Project_Setup/
│   ├── 3.3.1_Terminal.png
│   ├── 3.3.2_Folder_Structure.png
│   └── 3.3.3_Network.png
├── 4.3_Search_Filter/
│   ├── 4.3.1_Filter_UI.png
│   ├── 4.3.2_Search_URL.png
│   └── ...
└── ...
```

---

## 🎯 **BỐI CỤC VIẾT MỖI MỤC (Standard Template)**

```markdown
## MỤC X.X: TÊN MỤC ỨNG DỤNG

### Định nghĩa & Mục tiêu
[2-3 câu giải thích]

### Nội dung công nghệ
#### Code Example 1: [Tên file]
\`\`\`typescript/vue
[Code snippet]
\`\`\`

#### Code Example 2: [Tên file]
\`\`\`typescript/vue
[Code snippet]
\`\`\`

### Kết quả & Minh chứng
**Minh chứng 1**: [Tên Screenshot]
- ![Screenshot](./path/image.png)
- Giải thích: ...

**Minh chứng 2**: [Tên Screenshot]
- ![Screenshot](./path/image.png)
- Giải thích: ...

### Kết luận
[Tóm tắt kết quả đạt được]
```

---

**Tài liệu này hoàn chỉnh. Bạn có thể copy-paste vào báo cáo luôn! 💪**
