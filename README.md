# 🎬 KHANLIX - Nền Tảng Xem Phim Trực Tuyến

[![Nuxt](https://img.shields.io/badge/Nuxt-4.4.2-00DC82?logo=nuxt.js)](https://nuxt.com)
[![Vue](https://img.shields.io/badge/Vue-3.5.30-4FC08D?logo=vue.js)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-06B6D4?logo=tailwind-css)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **KHANLIX** là một nền tảng xem phim trực tuyến hiện đại, được xây dựng bằng **Nuxt 4** và **Vue 3**, cung cấp trải nghiệm người dùng mượt mà, giao diện thân thiện và các tính năng tìm kiếm, lọc, phân trang tiên tiến.

---

## Tính Năng Chính

### Tìm Kiếm & Lọc Phim
- **Tìm kiếm realtime** với Autocomplete gợi ý
- **Lọc theo thể loại** (6 thể loại: Hành động, Hài, Kinh dị, Lãng mạn, Viễn tưởng, Chính kịch)
- **Lọc theo năm phát hành** (2021-2026)
- **Lọc theo loại phim** (Phim Lẻ / Phim Bộ)
- **Lọc nâng cao** (Theo rating, phim mới nhất, xem nhiều nhất)
- **URL-Sync Pagination**: Tất cả trạng thái được lưu vào URL → dễ bookmark, chia sẻ

### Quản Lý Danh Sách Yêu Thích
- **Thêm/xóa phim yêu thích** với 1 click
- **Cập nhật UI realtime** khi bấm yêu thích
- **Tự động lưu** vào localStorage
- **Trang danh sách yêu thích** riêng biệt
- **Xóa toàn bộ** yêu thích một lúc (với xác nhận)

### Xem Chi Tiết Phim
- **Trang chi tiết phim** với đầy đủ thông tin (đạo diễn, diễn viên, rating, năm, thể loại)
- **Video player preview** - xem trailer
- **Phim tương tự** - gợi ý phim liên quan
- **Nút yêu thích** - đánh dấu phim yêu thích

### Giao Diện Responsive
- **Desktop, Tablet, Mobile** - tối ưu hóa 100%
- **Dark theme** với màu xanh accent (Emerald)
- **Smooth animations** và transitions
- **Scroll to top** button

### Danh Mục (5 Categories)
- **Phim Mới Cập Nhật** - 10 phim mới nhất
- **Phim HOT Hiện Tại** - 10 phim trending
- **Xem Nhiều Nhất** - 10 phim top views
- **Xu Hướng** - 10 phim trending
- **Hôm Nay** - 10 phim hôm nay

### Phân Trang Thông Minh
- **Phân trang sử dụng Composable `usePagination.ts`** - reusable và hiệu quả
- **Hỗ trợ multiple pagination modes**: Danh mục (10 phim/trang), Tìm kiếm (16 phim/trang), Lọc (16 phim/trang)
- **URL sync tự động** - mỗi trang được lưu trong URL query
- **Smooth navigation** - Previous/Next buttons

### SEO Optimization
- **Dynamic Meta Tags** - mỗi trang có meta tags riêng
- **Open Graph Tags** - chia sẻ link đẹp trên social
- **Structured Data (JSON-LD)** - schema cho Search Engines
- **Server-Side Rendering (SSR)** - tối ưu SEO

### Hiệu Năng
- **Lazy Loading Images** sử dụng Nuxt Image
- **Code Splitting** tự động
- **Caching** với composables reusable
- **Gzip Compression** trong production build

---

## Tech Stack

### **Frontend**
| Công nghệ | Phiên bản | Mục đích |
|-----------|---------|---------|
| **Nuxt** | 4.4.2 | Full-stack Vue framework |
| **Vue** | 3.5.30 | Progressive JS framework |
| **TypeScript** | 5.0+ | Static typing |
| **Vue Router** | 5.0.3 | Client-side routing |
| **Pinia** | 3.0.4 | State management |
| **Tailwind CSS** | 6.14.0 | Utility-first CSS |

### **Plugins & Modules**
| Module | Mục đích |
|--------|---------|
| **@nuxt/icon** | Icon library (Heroicons) |
| **@nuxt/image** | Image optimization |

### **Development**
| Tool | Mục đích |
|------|---------|
| **Vite** | Build tool (mặc định Nuxt 4) |
| **ESLint** | Code quality (tùy chọn) |

---

## Cấu Trúc Dự Án

```
movie-app/
├── app.vue                      # Root component (init stores)
├── nuxt.config.ts              # Nuxt configuration
├── tailwind.config.ts           # Tailwind CSS config
├── tsconfig.json                # TypeScript config
├── package.json                 # Dependencies
│
├── assets/
│   └── css/
│       └── main.css             # Global styles
│
├── components/                  # Vue components (9 files)
│   ├── AuthModal.vue            # Modal đăng nhập/ký
│   ├── MovieCard.vue            # Card hiển thị phim
│   ├── Pagination.vue           # Component phân trang
│   ├── SearchAutocomplete.vue   # Gợi ý tìm kiếm
│   ├── LoadingSpinner.vue       # Loading indicator
│   ├── Toast.vue                # Toast notifications
│   ├── Skeleton.vue             # Skeleton loading
│   ├── Breadcrumb.vue           # Breadcrumb navigation
│   ├── ScrollToTop.vue          # Scroll to top button
│   └── PageTransition.vue       # Page transitions
│
├── composables/                 # Composition functions (14 files)
│   ├── usePagination.ts         # Generic pagination logic with URL sync
│   ├── useMovieFilter.ts        # Lọc theo thể loại + năm
│   ├── useMovieSearch.ts        # Tìm kiếm phim
│   ├── useMovieTypeFilter.ts    # Lọc phim single/series
│   ├── useMovieCategories.ts    # 5 danh mục chính
│   ├── useMovieCategoryFilter.ts # Lọc theo 5 danh mục
│   ├── useMovieDetail.ts        # Chi tiết phim
│   ├── useMovieAutocomplete.ts  # Autocomplete suggestions
│   ├── useNavigation.ts         # Navigation utils
│   ├── useCarousel.ts           # Carousel logic
│   ├── useHeader.ts             # Header functions
│   ├── useErrorHandler.ts       # Error handling
│   ├── useJsonLd.ts             # JSON-LD structured data
│   └── useVideoPlayer.ts        # Video player control
│
├── stores/                      # Pinia stores
│   └── movieStore.ts            # Movie state management (favorites)
│
├── pages/                       # Pages (3 files)
│   ├── index.vue                # Trang chủ - tìm kiếm, lọc, danh mục
│   ├── favorites.vue            # Trang danh sách yêu thích
│   └── movies/
│       └── [id].vue             # Trang chi tiết phim
│
├── layouts/                     # Layouts
│   └── default.vue              # Main layout (Header + Navigation)
│
├── public/                      # Static files
│   ├── robots.txt               # SEO robots
│   └── images/
│       └── posters/             # Movie poster images
│
├── server/                      # Backend endpoints
│   └── api/
│       └── movies.ts            # GET /api/movies - return 50 movies
│
└── utils/                       # Utility functions
    ├── localStorage.ts          # Favorites persistence
    └── generateMeta.ts          # Meta tag generators

```

---

## Cài Đặt & Chạy

### **Prerequisites**
- **Node.js** ≥ 18.0
- **npm** hoặc **pnpm**

### **1. Clone Repository**
```bash
git clone <repository-url>
cd movie-app
```

### **2. Cài Đặt Dependencies**
```bash
npm install
# hoặc
pnpm install
# hoặc
yarn install
```

### **3. Chạy Development Server**
```bash
npm run dev
```

Mở browser tại: **http://localhost:3000**

### **4. Build Cho Production**
```bash
npm run build
npm run preview  # Preview production build locally
```

---

## API Endpoints

### **Movies Endpoint**
```typescript
GET /api/movies
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Lật Mặt 7: Một Điều Ước",
    "poster": "/images/posters/lat-mat-7.jpg",
    "year": "2024",
    "genre": "Tâm Lý, Gia Đình",
    "rating": 9.0,
    "synopsis": "...",
    "trailerUrl": "https://www.youtube.com/embed/..."
  },
  // ... 49 more movies
]
```

**Hỗ trợ Filtering (Server-side):**
- `?genre=Hành%20Động` - Lọc theo thể loại
- `?year=2024` - Lọc theo năm
- `?search=Avatar` - Tìm kiếm phim

---

## State Management

### **Pinia Store - movieStore**
```typescript
// State
favorites: Map<number, boolean>  // O(1) lookup by movie ID

// Actions
initFavorites()                  // Load from localStorage
addFavorite(movieId)             // Add to favorites
removeFavorite(movieId)          // Remove from favorites
toggleFavorite(movieId)          // Toggle favorite status
clearAllFavorites()              // Clear all favorites

// Getters
isFavorited(movieId)             // Check if movie is favorited
favoriteIds                       // Array of favorite movie IDs
favoriteCount                     // Total favorites count
```

### **LocalStorage Persistence**
```typescript
// Tự động save/load favorites vào localStorage
localStorage.setItem('movie_favorites', JSON.stringify([...favorites]))
```

---

## Thiết Kế & Wireframes

### **Design System**
- **Color Palette:**
  - Primary (Emerald): `#10B981`
  - Dark BG: `#0f0f1e`
  - Card BG: `#1a1a2e`
  - Text: `#ffffff`, `#9CA3AF`

- **Typography:**
  - Heading: Bold
  - Body: Regular
  - Font: System fonts (tối ưu hóa)

### **8 Wireframes**
Tất cả wireframes lưu trong folder `wireframes/`:
1. **Header Navigation** - Menu chính, dropdown, search
2. **Homepage Categories** - 5 danh mục với grid
3. **Category Filter** - Danh mục được chọn
4. **Search Results** - Kết quả tìm kiếm
5. **Genre & Year Filter** - Lọc nâng cao
6. **Favorites Page** - Danh sách yêu thích
7. **Movie Card Component** - Anatomy của card
8. **Movie Detail Page** - Chi tiết phim đầy đủ

---

## Các Tính Năng Kỹ Thuật

### **Composition API & Composables**
Ứng dụng sử dụng **Composition API** với các composables tái sử dụng:
```typescript
// Ví dụ usePagination.ts - Generic pagination composable
const { 
  currentPage, 
  totalPages, 
  currentItems, 
  goToPage 
} = usePagination(movies, { 
  itemsPerPage: 16,
  queryParamName: 'page',
  useUrlSync: true 
})
```

### **URL Synchronization**
Tất cả trạng thái phân trang được sync với URL:
- `/index?search=avatar&page=2` - Trang 2 kết quả tìm "avatar"
- `/index?type=single&page=1` - Trang 1 phim lẻ
- `/favorites` - Danh sách yêu thích

### **Reactive Data Binding**
```vue
<template>
  <!-- Tất cả thay đổi tự động cập nhật UI -->
  <MovieCard 
    v-for="movie in paginatedMovies"
    :key="movie.id"
    :movie="movie"
    :is-favorited="movieStore.isFavorited(movie.id)"
    @toggle-favorite="movieStore.toggleFavorite(movie.id)"
  />
</template>
```

---

## Testing & Development

### **Build Status**
✅ Nuxt Build: **Success** (238 modules)

### **Browser Support**
- ✓ Chrome/Edge (latest)
- ✓ Firefox (latest)
- ✓ Safari (latest)
- ✓ Mobile browsers

---

## TypeScript

Toàn bộ dự án được viết bằng **TypeScript Strict Mode**:
```typescript
// Ví dụ type-safe code
interface Movie {
  id: number
  title: string
  genre: string
  rating: number
  synopsis: string
  trailerUrl: string
}

const movies = ref<Movie[]>([])
```

---

## Security

- ✓ XSS Protection (Vue template escaping)
- ✓ CSRF Protection (SameSite cookies)
- ✓ Content Security Policy (nếu cần config thêm)
- ✓ No sensitive data trong localStorage (chỉ movie IDs)

---

## SEO

Ứng dụng được tối ưu hóa SEO:
- ✓ Server-Side Rendering (SSR enabled)
- ✓ Dynamic Meta Tags (per page)
- ✓ Open Graph Tags (social sharing)
- ✓ JSON-LD Structured Data
- ✓ Robots.txt (indexing control)

---

## Đóng Góp

Để đóng góp vào dự án:

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

---

## License

Dự án này được cấp phép dưới **MIT License** - xem file [LICENSE](LICENSE) để chi tiết.

---

## Liên Hệ

- **Tác giả**: Khang
- **Email**: minhkhang28042k4@gmail.com
- **GitHub**: https://github.com/Hutramikha

---

## Cảm Ơn

Cảm ơn các tác giả/thư viện:
- [Nuxt.js](https://nuxt.com) - Framework tuyệt vời
- [Vue.js](https://vuejs.org) - Reactive framework
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Pinia](https://pinia.vuejs.org) - State management
- [Heroicons](https://heroicons.com) - Icons

---

## Roadmap

### **v1.1** (Soon)
- [ ] User authentication (đăng nhập/ký)
- [ ] Watch history (lịch sử xem)
- [ ] Watchlist (danh sách theo dõi)
- [ ] Comments & ratings (bình luận đánh giá)

### **v1.2**
- [ ] Dark/Light mode toggle
- [ ] Multi-language support
- [ ] Advanced search filters
- [ ] Social sharing features

### **v2.0**
- [ ] Admin dashboard
- [ ] Movie uploading system
- [ ] User profiles
- [ ] Recommendation engine

---

**Made with Love using Nuxt 4 & Vue 3**
