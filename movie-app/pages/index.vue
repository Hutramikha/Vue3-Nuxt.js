<script setup lang="ts">
// ============================================
// PHƯƠNG B: REFACTOR THEO LÝ THUYẾT BÁNG (100% MATCH)
// Sử dụng custom composables + reactive() + watchers
// ============================================

// ============================================
// 1. LẤY DỮ LIỆU PHIM TỪ API (Chương 8.4)
// ============================================
const isLoading = ref(true)
const { data: allMovies } = await useFetch('/api/movies')
isLoading.value = false

// ============================================
// 2. IMPORT CUSTOM COMPOSABLES (Chương 5.3)
// ============================================
// useMovieFilter - quản lý logic filter phim
const { 
  activeGenreFilter, 
  activeYearFilter, 
  filterCurrentPage,
  allGenres,
  allYears,
  filteredMovies,
  filteredMoviesPaginated,
  totalFilterPages,
  isFilterMode,
  filterByGenre,
  filterByYear,
  goToFilterPage,
  resetFilter
} = useMovieFilter(allMovies)

// useMovieSearch - quản lý logic search phim
const { 
  searchQuery, 
  searchedMovies, 
  searchedMoviesPaginated, 
  totalSearchPages, 
  isSearchMode 
} = useMovieSearch(allMovies)

// useMovieCategories - quản lý categories + pagination
const {
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
} = useMovieCategories(allMovies)

// ============================================
// 2.5. TRẠNG THÁI UI
// ============================================
const showFilter = ref(false)  // Toggle hiển thị/ẩn filter

// ============================================
// 2.6. RESET BỘ LỌC KHI QUAY LẠI TRANG CHỦ
// ============================================
const route = useRoute()

// Watch route.query để detect khi user bấm "Trang chủ" hoặc click logo
watch(() => route.query, (newQuery) => {
  // Nếu không có search, genre, year trong query → reset filter
  if (!newQuery.search && !newQuery.genre && !newQuery.year) {
    // Reset tất cả filter state
    resetFilter()
    // Ẩn filter UI
    showFilter.value = false
    // Reset các category pagination về trang 1
    categories.new.currentPage.value = 1
    categories.hot.currentPage.value = 1
    categories.mostViewed.currentPage.value = 1
    categories.trending.currentPage.value = 1
    categories.today.currentPage.value = 1
  }
})

// ========== CAROUSEL QUẢNG CÁO ==========
const advertisements = [
  {
    id: 1,
    title: "Khám Phá Bộ Sưu Tập Phim Độc Quyền",
    description: "Tận hưởng hàng trăm bộ phim mới nhất, hot nhất với chất lượng 4K HDR. Đăng ký ngay để được xem miễn phí 7 ngày!",
    color: "from-emerald-600 via-emerald-500 to-teal-600",
    textColor: "text-emerald-700",
    icon: "megaphone"
  },
  {
    id: 2,
    title: "Xem Phim Không Giới Hạn Cùng Gia Đình",
    description: "Chia sẻ tài khoản với 4 thành viên gia đình, mỗi người có thể xem riêng biệt trên các thiết bị khác nhau.",
    color: "from-blue-600 via-blue-500 to-cyan-600",
    textColor: "text-blue-700",
    icon: "users"
  },
  {
    id: 3,
    title: "Hộp Quà Tặng Phim May Mắn",
    description: "Mỗi tháng có cơ hội thắng voucher xem phim miễn phí, tài khoản VIP, và những phần quà hấp dẫn khác!",
    color: "from-purple-600 via-purple-500 to-pink-600",
    textColor: "text-purple-700",
    icon: "gift"
  },
  {
    id: 4,
    title: "Phim Exclusives - Chỉ Có Ở Đây",
    description: "Những bộ phim original độc quyền, không có ở bất kỳ nền tảng nào khác. Xem trước khi ai khác!",
    color: "from-orange-600 via-amber-500 to-red-600",
    textColor: "text-orange-700",
    icon: "star"
  }
]

const currentAdIndex = ref(0)
let autoSlideInterval: ReturnType<typeof setInterval> | null = null

const nextAd = () => {
  currentAdIndex.value = (currentAdIndex.value + 1) % advertisements.length
}

const prevAd = () => {
  currentAdIndex.value = (currentAdIndex.value - 1 + advertisements.length) % advertisements.length
}

const goToAd = (index: number) => {
  currentAdIndex.value = index
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval)
    startAutoSlide()
  }
}

const startAutoSlide = () => {
  autoSlideInterval = setInterval(() => {
    nextAd()
  }, 5000)
}

onMounted(() => {
  startAutoSlide()
})

onUnmounted(() => {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval)
  }
})

// ============================================
// 4. OBJ REACTIVE - CHI TIẾT PHIM (Chương 4.1.3)
// ============================================
// Demo sử dụng reactive() cho cấu trúc dữ liệu phức tạp
// reactive() phù hợp hơn ref() khi làm việc với object nhiều thuộc tính
const selectedMovieState = reactive({
  movieId: null as number | null,
  isDetailOpen: false,
  watchedTime: 0,
  isWatched: false,
  rating: 0,
  review: ''
})

// ============================================
// 5. WATCHERS - CÁC HIỆU ỨNG PHỤ (Chương 4.2.2)
// ============================================
// Watcher để xử lý hiệu ứng phụ khi selectedMovieState thay đổi
// Lưu dữ liệu vào localStorage khi xem phim (hiệu ứng phụ)
watch(
  () => selectedMovieState,
  (newState) => {
    if (newState.movieId) {
      // Ghi nhận lịch sử xem phim (hiệu ứng phụ - không phải pure function)
      console.log(`[WATCH] Đang xem phim: ${newState.movieId}, tiến độ: ${newState.watchedTime}s`)
      // Ở đây có thể lưu vào localStorage
      // localStorage.setItem('watchHistory', JSON.stringify(newState))
    }
  },
  { deep: true }
)

// ============================================
// 6. PHÂN TRANG TÌM KIẾM
// ============================================
const goToSearchPage = async (pageNumber: number) => {
  const router = useRouter()
  if (pageNumber >= 1 && pageNumber <= totalSearchPages.value) {
    await router.push({
      query: {
        search: searchQuery.value,
        searchPage: pageNumber
      }
    })
  }
}

// ============================================
// 7. Ẩn hiện filter
// ============================================
const toggleFilter = () => {
  showFilter.value = !showFilter.value
}
</script>

<template>
  <div>
    <!-- Loadinng Spinner -->
    <LoadingSpinner :isVisible="isLoading" />
    
    <!-- ====== CAROUSEL QUẢNG CÁO ====== -->
    <div class="mb-24 relative overflow-hidden rounded-2xl bg-gradient-to-r shadow-2xl">
      <!-- Gradient nền được chọn từ dữ liệu quảng cáo -->
      <div v-if="advertisements[currentAdIndex]" :class="`bg-gradient-to-r ${advertisements[currentAdIndex]?.color}`" class="transition-all duration-700">
        <!-- Vòng tròn mờ động -->
        <div class="absolute inset-0 opacity-20">
          <div class="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div class="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
        </div>
        
        <div class="relative px-8 py-12 flex items-center justify-between">
          <!-- Phần trái: Text + Button -->
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-3">
              <Icon :name="`heroicons-solid:${advertisements[currentAdIndex]?.icon}`" class="w-8 h-8 text-white animate-bounce" />
              <span class="text-sm font-bold text-white bg-black bg-opacity-30 px-3 py-1 rounded-full">QUẢNG CÁO</span>
            </div>
            <h2 class="text-4xl font-bold text-white mb-3 transition-all duration-500">{{ advertisements[currentAdIndex]?.title }}</h2>
            <p class="text-lg text-white text-opacity-90 mb-6 max-w-3xl transition-all duration-500">{{ advertisements[currentAdIndex]?.description }}</p>
            <button :class="[`px-8 py-3 bg-white ${advertisements[currentAdIndex]?.textColor} font-bold rounded-lg hover:bg-opacity-90 transition transform hover:scale-105 flex items-center gap-2 shadow-lg hover:shadow-xl`]">
              <Icon name="heroicons-solid:play" :class="advertisements[currentAdIndex]?.textColor" />
              Xem Ngay
            </button>
          </div>
          
          <!-- Phần phải: Icon/Hình ảnh -->
          <div class="hidden lg:flex flex-1 justify-end items-center">
            <Icon name="heroicons-solid:film" class="w-48 h-48 text-white opacity-20" />
          </div>
        </div>
        
        <!-- Nút điều hướng (bên phải) -->
        <button 
          @click="nextAd" 
          class="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 text-white p-3 rounded-full transition z-10 hidden sm:flex items-center justify-center"
        >
          <Icon name="heroicons-solid:chevron-right" class="w-6 h-6" />
        </button>
      </div>
      
      <!-- Chỉ báo dấu chấm -->
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        <button 
          v-for="(ad, index) in advertisements" 
          :key="ad.id"
          @click="goToAd(index)"
          :class="[
            'w-2 h-2 rounded-full transition-all duration-300',
            currentAdIndex === index 
              ? 'bg-white w-8' 
              : 'bg-white bg-opacity-50 hover:bg-opacity-75'
          ]"
        ></button>
      </div>
    </div>
    
    <!-- ====== PHẦN HIỂN THỊ KẾT QUẢ TÌM KIẾM ====== -->
    <!-- Khi đang tìm kiếm: hiển thị kết quả hoặc thông báo không tìm thấy -->
    <div v-if="isSearchMode" class="mb-24">
      <!-- Tiêu đề kết quả tìm kiếm -->
      <div class="mb-10 p-6 rounded-lg bg-gradient-to-r from-emerald-600/20 to-blue-600/20 border border-emerald-600/30">
        <h2 class="text-3xl font-bold text-white mb-2">
          Kết Quả Tìm Kiếm
          <span class="text-emerald-400 text-lg">({{ searchedMovies.length }} phim)</span>
        </h2>
        <p class="text-gray-400 text-sm">Từ khóa: <span class="text-emerald-400 font-semibold">{{ searchQuery }}</span></p>
      </div>
      
      <!-- Hiển thị phim tìm kiếm được (nếu có) -->
      <template v-if="searchedMovies.length > 0">
        <!-- Grid phim: 4 phim/hàng -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <MovieCard v-for="movie in searchedMoviesPaginated" :key="movie.id" :movie="movie" />
        </div>
        
        <!-- Phân trang kết quả tìm kiếm -->
        <div v-if="totalSearchPages > 1" class="flex justify-center items-center gap-2">
          <button 
            @click="goToSearchPage(1)"
            :disabled="totalSearchPages === 1"
            class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            ← Trước
          </button>
          <div class="flex gap-1">
            <button 
              v-for="page in totalSearchPages" 
              :key="page"
              class="px-3 py-1 text-sm rounded font-semibold transition bg-gray-800 text-gray-300 hover:bg-gray-700"
            >
              {{ page }}
            </button>
          </div>
          <button 
            @click="goToSearchPage(totalSearchPages)"
            :disabled="totalSearchPages === 1"
            class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Sau →
          </button>
        </div>
      </template>
      
      <!-- Thông báo không tìm thấy phim -->
      <div v-else class="flex flex-col items-center justify-center py-20">
        <Icon name="heroicons-solid:film" class="w-20 h-20 text-gray-600 mb-4" />
        <h3 class="text-2xl font-bold text-gray-400 mb-2">Không Tìm Thấy Phim</h3>
        <p class="text-gray-500 text-center max-w-md">
          Rất tiếc, chúng tôi không tìm thấy phim phù hợp với từ khóa "<span class="text-emerald-400 font-semibold">{{ searchQuery }}</span>". 
          Vui lòng thử tìm kiếm với từ khóa khác.
        </p>
      </div>
    </div>
    
    <!-- ====== NÚT MỞ/ĐÓNG BỘ LỌC ====== -->
    <template v-if="!isSearchMode">
    <div class="mb-6 flex items-center gap-2">
      <button 
        @click="toggleFilter"
        :class="[
          'px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2',
          showFilter
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
            : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
        ]"
      >
        <Icon name="heroicons-solid:funnel" class="w-5 h-5" />
        <span>{{ showFilter ? 'Ẩn Bộ Lọc' : 'Hiện Bộ Lọc' }}</span>
      </button>
    </div>
    
    <!-- ====== BỘ LỌC PHIM ====== -->
    <div v-if="showFilter" class="mb-12">
      <!-- Tiêu đề bộ lọc -->
      <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Icon name="heroicons-solid:funnel" class="w-5 h-5 text-emerald-500" />
        Lọc Phim
      </h3>
      
      <!-- Nút lọc theo thể loại -->
      <div class="mb-4">
        <p class="text-sm text-emerald-400 font-semibold mb-2">Theo Thể Loại:</p>
        <div class="flex flex-wrap gap-2">
          <button 
            v-for="genre in allGenres" 
            :key="genre"
            @click="filterByGenre(genre)"
            :class="[
              'px-4 py-2 rounded-lg font-semibold transition text-sm',
              activeGenreFilter === genre
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            ]"
          >
            {{ genre }}
          </button>
        </div>
      </div>
      
      <!-- Nút lọc theo năm -->
      <div class="mb-4">
        <p class="text-sm text-emerald-400 font-semibold mb-2">Theo Năm:</p>
        <div class="flex flex-wrap gap-2">
          <button 
            v-for="year in allYears" 
            :key="year"
            @click="filterByYear(year)"
            :class="[
              'px-4 py-2 rounded-lg font-semibold transition text-sm',
              activeYearFilter === year
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            ]"
          >
            {{ year }}
          </button>
        </div>
      </div>
      
      <!-- Nút bỏ lọc (hiển thị khi đang lọc) -->
      <button 
        v-if="isFilterMode"
        @click="resetFilter"
        class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
      >
        Xóa Bộ Lọc
      </button>
    </div>
    
    <!-- ====== PHẦN HIỂN THỊ: LỌC PHIM HOẶC DANH MỤC ====== -->
    <!-- Khi đang ở chế độ lọc: hiển thị phim lọc được, 4 phim/hàng -->
    <div v-if="isFilterMode" class="mb-24">
      <!-- Tiêu đề chế độ lọc -->
      <div class="mb-10 p-6 rounded-lg bg-gradient-to-r from-emerald-600/20 to-blue-600/20 border border-emerald-600/30">
        <h2 class="text-3xl font-bold text-white mb-2">
          Kết Quả Lọc
          <span class="text-emerald-400 text-lg">({{ filteredMovies.length }} phim)</span>
        </h2>
        <p class="text-gray-400 text-sm">
          Lọc: 
          <span v-if="activeGenreFilter" class="text-emerald-400 font-semibold">{{ activeGenreFilter }}</span>
          <span v-if="activeYearFilter" class="text-blue-400 font-semibold">{{ activeYearFilter }}</span>
        </p>
      </div>
      
      <!-- Grid phim lọc: 4 phim/hàng -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MovieCard v-for="movie in filteredMoviesPaginated" :key="movie.id" :movie="movie" />
      </div>
      
      <!-- Phân trang khi lọc phim -->
      <div v-if="totalFilterPages > 1" class="flex justify-center items-center gap-2">
        <button 
          @click="goToFilterPage(filterCurrentPage - 1)"
          :disabled="filterCurrentPage === 1"
          class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          ← Trước
        </button>
        <div class="flex gap-1">
          <button 
            v-for="page in totalFilterPages" 
            :key="page"
            @click="goToFilterPage(page)"
            :class="[
              'px-3 py-1 text-sm rounded font-semibold transition',
              filterCurrentPage === page 
                ? 'bg-emerald-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            ]"
          >
            {{ page }}
          </button>
        </div>
        <button 
          @click="goToFilterPage(filterCurrentPage + 1)"
          :disabled="filterCurrentPage === totalFilterPages"
          class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Sau →
        </button>
      </div>
    </div>
    
    <!-- Khi không lọc: hiển thị danh mục theo chủ đề -->
    <template v-else>
    
    <!-- ====== DANH MỤC 0: PHIM TOP TRENDING (NỔI BẬT ĐẦU TIÊN) ====== -->
    <div class="mb-24 p-6 rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-emerald-600 border-opacity-30 shadow-2xl">
      <div class="mb-10">
        <h2 class="text-5xl font-bold text-white mb-2 flex items-center gap-3">
          <Icon name="heroicons-solid:sparkles" class="w-8 h-8 text-emerald-500" />
          Trending Hôm Nay
        </h2>
        <p class="text-emerald-400 text-base font-semibold">Những phim đang trending hot nhất lúc này - Không nên bỏ lỡ!</p>
        <div class="w-32 h-1.5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 rounded mt-4"></div>
      </div>
      <!-- GRID PHIM -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-6">
        <MovieCard v-for="movie in trendingPaginated" :key="movie.id" :movie="movie" />
      </div>
      <!-- PAGINATION cho hàng này -->
      <div v-if="totalPagesTrending > 1" class="flex justify-center items-center gap-2">
        <button 
          @click="goToPageTrending(categories.trending.currentPage.value - 1)"
          :disabled="categories.trending.currentPage.value === 1"
          class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          ← Trước
        </button>
        <div class="flex gap-1">
          <button 
            v-for="page in totalPagesTrending" 
            :key="page"
            @click="goToPageTrending(page)"
            :class="[
              'px-3 py-1 text-sm rounded font-semibold transition',
              categories.trending.currentPage.value === page 
                ? 'bg-emerald-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            ]"
          >
            {{ page }}
          </button>
        </div>
        <button 
          @click="goToPageTrending(categories.trending.currentPage.value + 1)"
          :disabled="categories.trending.currentPage.value === totalPagesTrending"
          class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Sau →
        </button>
      </div>
    </div>

    <!-- ====== DANH MỤC 1: PHIM MỚI CẬP NHẬT ====== -->
    <div class="mb-16">
      <div class="mb-10">
        <h2 class="text-4xl font-bold text-white mb-2 flex items-center gap-3">
          <Icon name="heroicons-solid:film" class="w-6 h-6 text-emerald-500" />
          Phim Mới Cập Nhật
        </h2>
        <p class="text-emerald-500 text-sm">Danh sách những bộ phim hot nhất hôm nay</p>
        <div class="w-16 h-1 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded mt-3"></div>
      </div>
      <!-- GRID PHIM -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <MovieCard v-for="movie in newMoviesPaginated" :key="movie.id" :movie="movie" />
      </div>
      <!-- PAGINATION cho hàng này -->
      <div v-if="totalPagesNew > 1" class="flex justify-center items-center gap-2">
        <button 
          @click="goToPageNew(categories.new.currentPage.value - 1)"
          :disabled="categories.new.currentPage.value === 1"
          class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          ← Trước
        </button>
        <div class="flex gap-1">
          <button 
            v-for="page in totalPagesNew" 
            :key="page"
            @click="goToPageNew(page)"
            :class="[
              'px-3 py-1 text-sm rounded font-semibold transition',
              categories.new.currentPage.value === page 
                ? 'bg-emerald-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            ]"
          >
            {{ page }}
          </button>
        </div>
        <button 
          @click="goToPageNew(categories.new.currentPage.value + 1)"
          :disabled="categories.new.currentPage.value === totalPagesNew"
          class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Sau →
        </button>
      </div>
    </div>

    <!-- ====== DANH MỤC 2: PHIM HOT HIỆN TẠI ====== -->
    <div class="mb-16">
      <div class="mb-10">
        <h2 class="text-4xl font-bold text-white mb-2 flex items-center gap-3">
          <Icon name="heroicons-solid:fire" class="w-6 h-6 text-emerald-500" />
          Phim Hot Hiện Tại
        </h2>
        <p class="text-emerald-500 text-sm">Những bộ phim đang hot trên nền tảng</p>
        <div class="w-16 h-1 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded mt-3"></div>
      </div>
      <!-- GRID PHIM -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <MovieCard v-for="movie in hotMoviesPaginated" :key="movie.id" :movie="movie" />
      </div>
      <!-- PAGINATION cho hàng này -->
      <div v-if="totalPagesHot > 1" class="flex justify-center items-center gap-2">
        <button 
          @click="goToPageHot(categories.hot.currentPage.value - 1)"
          :disabled="totalPagesHot === 1"
          class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          ← Trước
        </button>
        <div class="flex gap-1">
          <button 
            v-for="page in totalPagesHot" 
            :key="page"
            @click="goToPageHot(page)"
            :class="[
              'px-3 py-1 text-sm rounded font-semibold transition',
              categories.hot.currentPage.value === page 
                ? 'bg-emerald-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            ]"
          >
            {{ page }}
          </button>
        </div>
        <button 
          @click="goToPageHot(categories.hot.currentPage.value + 1)"
          :disabled="categories.hot.currentPage.value === totalPagesHot"
          class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Sau →
        </button>
      </div>
    </div>

    <!-- ====== DANH MỤC 3: PHIM ĐƯỢC XEM NHIỀU ====== -->
    <div class="mb-16">
      <div class="mb-10">
        <h2 class="text-4xl font-bold text-white mb-2 flex items-center gap-3">
          <Icon name="heroicons-solid:bars-3" class="w-6 h-6 text-emerald-500" />
          Phim Được Xem Nhiều
        </h2>
        <p class="text-emerald-500 text-sm">Những bộ phim được xem nhiều nhất</p>
        <div class="w-16 h-1 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded mt-3"></div>
      </div>
      <!-- GRID PHIM -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <MovieCard v-for="movie in mostViewedPaginated" :key="movie.id" :movie="movie" />
      </div>
      <!-- PAGINATION cho hàng này -->
      <div v-if="totalPagesMostViewed > 1" class="flex justify-center items-center gap-2">
        <button 
          @click="goToPageMostViewed(categories.mostViewed.currentPage.value - 1)"
          :disabled="categories.mostViewed.currentPage.value === 1"
          class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          ← Trước
        </button>
        <div class="flex gap-1">
          <button 
            v-for="page in totalPagesMostViewed" 
            :key="page"
            @click="goToPageMostViewed(page)"
            :class="[
              'px-3 py-1 text-sm rounded font-semibold transition',
              categories.mostViewed.currentPage.value === page 
                ? 'bg-emerald-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            ]"
          >
            {{ page }}
          </button>
        </div>
        <button 
          @click="goToPageMostViewed(categories.mostViewed.currentPage.value + 1)"
          :disabled="categories.mostViewed.currentPage.value === totalPagesMostViewed"
          class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Sau →
        </button>
      </div>
    </div>

    <!-- ====== DANH MỤC 5: PHIM LẺ MỚI RA MẮT ====== -->
    <div class="mb-16">
      <div class="mb-10">
        <h2 class="text-4xl font-bold text-white mb-2 flex items-center gap-3">
          <Icon name="heroicons-solid:bookmark" class="w-6 h-6 text-emerald-500" />
          Phim Lẻ Mới Ra Mắt
        </h2>
        <p class="text-emerald-500 text-sm">Những bộ phim lẻ mới nhất vừa mới ra mắt</p>
        <div class="w-16 h-1 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded mt-3"></div>
      </div>
      <!-- GRID PHIM -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <MovieCard v-for="movie in todayPaginated" :key="movie.id" :movie="movie" />
      </div>
      <!-- PAGINATION cho hàng này -->
      <div v-if="totalPagesToday > 1" class="flex justify-center items-center gap-2">
        <button 
          @click="goToPageToday(categories.today.currentPage.value - 1)"
          :disabled="categories.today.currentPage.value === 1"
          class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          ← Trước
        </button>
        <div class="flex gap-1">
          <button 
            v-for="page in totalPagesToday" 
            :key="page"
            @click="goToPageToday(page)"
            :class="[
              'px-3 py-1 text-sm rounded font-semibold transition',
              categories.today.currentPage.value === page 
                ? 'bg-emerald-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            ]"
          >
            {{ page }}
          </button>
        </div>
        <button 
          @click="goToPageToday(categories.today.currentPage.value + 1)"
          :disabled="categories.today.currentPage.value === totalPagesToday"
          class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Sau →
        </button>
      </div>
    </div>
    
    </template>
    </template>
  </div>
</template>
