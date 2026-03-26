<script setup lang="ts">
/**
 * Trang Tìm Kiếm & Duyệt Phim (index.vue)
 * ========================================
 * Mục đích chính:
 * 1. Hiển thị các danh mục phim (5 danh mục, 10 phim mỗi danh mục)
 * 2. Cho phép đăc kiếm phim theo từ khóa
 * 3. Cho phép lọc phim theo thể loại và năm
 * 4. Quản lý phân trang cho từng chế độ (danh mục, tìm kiếm, lọc)
 * 
 * 3 chế độ hiển thị:
 * - Chế độ danh mục (mặc định): hiển thị 5 danh mục với phân trang riêng
 * - Chế độ tìm kiếm: hiển thị kết quả tìm kiếm khi người dùng nhập từ khóa
 * - Chế độ lọc: hiển thị kết quả lọc khi người dùng chọn thể loại/năm
 */

// ============================================
// IMPORT COMPOSABLES & UTILITIES
// ============================================
import { useCarousel } from '~/composables/useCarousel'
import { useNavigation } from '~/composables/useNavigation'
import { useErrorHandler } from '~/composables/useError'

// ============================================
// PHẦN 1: LẤY DỮ LIỆU PHIM TỪ API
// ============================================
// allMovies: danh sách 50 phim lấy từ server (API endpoint: /api/movies)
// isLoading: hiển thị loading spinner trong khi tải dữ liệu
const isLoading = ref(true)
const { addError } = useErrorHandler()

const allMovies = ref<any[]>([])
try {
  // useFetch: hàm Nuxt tự động xử lý SSR + client-side fetching
  const { data, error } = await useFetch('/api/movies')
  if (error.value || !data.value) {
    addError('Lỗi tải danh sách phim. Vui lòng làm mới trang.')
  } else {
    allMovies.value = data.value  // Gán 50 phim vào state
  }
} catch (err: any) {
  addError(err.message || 'Lỗi khi tải dữ liệu từ server')
}
isLoading.value = false  // Tắt loading spinner

// ============================================
// PHẦN 2: KHAI BÁO COMPOSABLES
// ============================================

// useMovieFilter: quản lý lọc phim theo thể loại và năm
// - activeGenreFilters: Set các thể loại đã chọn
// - activeYearFilters: Set các năm đã chọn
// - filteredMovies: danh sách phim thỏa mãn điều kiện lọc
// - isFilterMode: boolean - đang ở chế độ lọc không
const { 
  activeGenreFilters, 
  activeYearFilters, 
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

// useMovieSearch: quản lý tìm kiếm phim
// - searchQuery: từ khóa tìm kiếm (lấy từ URL: ?search=...)
// - searchedMovies: danh sách phim khớp với từ khóa
// - isSearchMode: boolean - đang ở chế độ tìm kiếm không
const { 
  searchQuery, 
  searchedMovies, 
  searchedMoviesPaginated, 
  totalSearchPages, 
  isSearchMode 
} = useMovieSearch(allMovies)

// useMovieCategories: quản lý 5 danh mục phim
// Chia 50 phim thành 5 danh mục, mỗi danh mục 10 phim, phân trang mỗi danh mục
// - newMoviesPaginated: phim mới cập nhật (id 1-10)
// - hotMoviesPaginated: phim kinh điển (id 11-20)
// - mostViewedPaginated: phim kinh điển II (id 21-30)
// - trendingPaginated: trending hôm nay (id 31-40)
// - todayPaginated: phim lẻ mới ra mắt (id 41-50)
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

// useNavigation - xử lý navigation
const { goHome } = useNavigation()

// ============================================
// PHẦN 3: QUẢN LÝ TRẠNG THÁI UI
// ============================================

// showFilter: boolean để toggle (bật/tắt) hiển thị bộ lọc filter
// - true: hiển thị bộ lọc theo thể loại + năm
// - false: ẩn bộ lọc, hiển thị danh mục thông thường
const showFilter = ref(false)

// ============================================
// PHẦN 4: THEO DÕI THAY ĐỔI URL & RESET STATE
// ============================================

const route = useRoute()

/**
 * Theo dõi route.query để detect khi người dùng:
 * 1. Bấm nút "Trang Chủ"
 * 2. Click logo (điều hướng về trang chính)
 * 3. Xóa hết các query parameters
 * 
 * Khi không có search, genre, year → reset tất cả filter state
 * Lý do: Người dùng quay lại view mặc định (danh mục), 
 * nên phải reset tất cả lọc để hiển thị sạch sẽ
 */
watch(() => route.query, (newQuery) => {
  // Kiểm tra nếu không có bất kỳ query parameter nào
  if (!newQuery.search && !newQuery.genre && !newQuery.year) {
    // Reset tất cả filter state (activeGenreFilters, activeYearFilters...)
    resetFilter()
    
    // Ẩn bộ lọc UI
    showFilter.value = false
    
    // Reset các category pagination về trang đầu tiên (trang 1)
    // Mỗi danh mục có state currentPage riêng, phải reset hết
    categories.new.currentPage.value = 1
    categories.hot.currentPage.value = 1
    categories.mostViewed.currentPage.value = 1
    categories.trending.currentPage.value = 1
    categories.today.currentPage.value = 1
  }
})

// ============================================
// PHẦN 5: DỮ LIỆU CAROUSEL QUẢNG CÁO
// ============================================

/**
 * Dữ liệu cho carousel quảng cáo (4 slides)
 * Mỗi slide có:
 * - id: định danh duy nhất
 * - title: tiêu đề quảng cáo
 * - description: mô tả chi tiết
 * - color: gradient CSS (from, via, to)
 * - textColor: màu chữ tương ứng với màu nền
 * - icon: tên icon từ heroicons-solid
 */
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

// ============================================
// PHẦN 6: CAROUSEL COMPOSABLE QUẢNG CÁO
// ============================================

/**
 * useCarousel(ref(advertisements)): Composable quản lý carousel
 * Trả về:
 * - currentIndex: vị trí slide hiện tại (0, 1, 2, 3)
 * - nextItem: hàm chuyển sang slide tiếp theo
 * - prevItem: hàm quay lại slide trước
 * - goToItem(index): hàm nhảy đến slide cụ thể
 * 
 * Cách hoạt động:
 * - currentAdIndex = 0: hiển thị slide đầu tiên (Khám Phá Bộ Sưu Tập)
 * - nextAd(): tăng index lên 1, khi >= 4 thì quay về 0
 * - goToAd(2): nhảy trực tiếp đến slide 3 (Hộp Quà Tặng)
 */
const { currentIndex: currentAdIndex, nextItem: nextAd, prevItem: prevAd, goToItem: goToAd } = useCarousel(ref(advertisements))

/**
 * Hàm điều hướng đến trang tìm kiếm cụ thể
 * 
 * Logic:
 * 1. Kiểm tra pageNumber có hợp lệ không (1 <= page <= totalSearchPages)
 * 2. Nếu hợp lệ: push route mới với query ?search=...&searchPage=...
 * 3. URL thay đổi → useMovieSearch composable sẽ bánh ứng & cập nhật dữ liệu
 * 
 * Ví dụ: pageNumber = 2
 * → router.push({ query: { search: 'avatar', searchPage: 2 } })
 * → URL: ?search=avatar&searchPage=2
 * → searchedMoviesPaginated sẽ hiển thị phim 6-10 thay vì 1-5
 */
const goToSearchPage = async (pageNumber: number) => {
  const router = useRouter()
  // Kiểm tra pageNumber hợp lệ
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
// PHẦN 7: TOGGLE BỘ LỌC
// ============================================

/**
 * Hàm bật/tắt hiển thị bộ lọc
 * 
 * Khi bấm nút "Hiện Bộ Lọc":
 * - showFilter: false → true → hiển thị UI lọc theo thể loại + năm
 * 
 * Khi bấm lại:
 * - showFilter: true → false → ẩn UI lọc, hiển thị danh mục thường
 * 
 * Lợi ích: Giao diện sạch sẽ, không quá phức tạp
 */
const toggleFilter = () => {
  showFilter.value = !showFilter.value
}
</script>

<template>
  <div>
    <!-- ===== LOADING SPINNER - Khi tải dữ liệu từ API ===== -->
    <!-- Hiển thị trong khi useFetch đang chạy, ẩn khi isLoading = false -->
    <LoadingSpinner :isVisible="isLoading" />
    
    <!-- ===== CAROUSEL QUẢNG CÁO - Chỉ hiển thị khi không tìm kiếm ===== -->
    <!-- v-if="!isSearchMode": ẩn carousel khi user đang tìm kiếm phim
         Lý do: Khi tìm kiếm, tập trung vào kết quả, không cần quảng cáo -->
    <div v-if="!isSearchMode" class="mb-24 relative overflow-hidden rounded-2xl bg-gradient-to-r shadow-2xl">
      <!-- Gradient nền thay đổi theo slide hiện tại (advertisements[currentAdIndex]?.color) -->
      <!-- transition-all duration-700: gradient thay đổi mượt trong 700ms -->
      <div v-if="advertisements[currentAdIndex]" :class="`bg-gradient-to-r ${advertisements[currentAdIndex]?.color}`" class="transition-all duration-700">
        <!-- Vòng tròn mờ động (blur effect) -->
        <!-- 2 vòng tròn chồng lên nhau, xoay chiều khác nhau để tạo cảm giác vận động -->
        <div class="absolute inset-0 opacity-20">
          <div class="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div class="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
        </div>
        
        <!-- Nội dung carousel: text bên trái, icon bên phải -->
        <div class="relative px-8 py-12 flex items-center justify-between">
          <!-- ===== PHẦN TRÁI: TIÊU ĐỀ + MÔ TẢ + NÚT CTA ===== -->
          <div class="flex-1">
            <!-- Icon và badge "QUẢNG CÁO" -->
            <div class="flex items-center gap-3 mb-3">
              <!-- Icon bounce: phóng to/thu nhỏ lặp lại tạo cảm giác chuyển động -->
              <Icon :name="`heroicons-solid:${advertisements[currentAdIndex]?.icon}`" class="w-8 h-8 text-white animate-bounce" />
              <span class="text-sm font-bold text-white bg-black bg-opacity-30 px-3 py-1 rounded-full">QUẢNG CÁO</span>
            </div>
            
            <!-- Tiêu đề quảng cáo (thay đổi theo slide) -->
            <h2 class="text-4xl font-bold text-white mb-3 transition-all duration-500">{{ advertisements[currentAdIndex]?.title }}</h2>
            
            <!-- Mô tả quảng cáo (thay đổi theo slide) -->
            <p class="text-lg text-white text-opacity-90 mb-6 max-w-3xl transition-all duration-500">{{ advertisements[currentAdIndex]?.description }}</p>
            
            <!-- Nút CTA (Call To Action): "Xem Ngay" →
                 Màu nền trắng, chữ màu theo theme của slide (emerald, blue, purple, orange)
                 hover: phong to nhẹ (scale-105) + shadow lớn hơn -->
            <button :class="[`px-8 py-3 bg-white ${advertisements[currentAdIndex]?.textColor} font-bold rounded-lg hover:bg-opacity-90 transition transform hover:scale-105 flex items-center gap-2 shadow-lg hover:shadow-xl`]">
              <Icon name="heroicons-solid:play" :class="advertisements[currentAdIndex]?.textColor" />
              Xem Ngay
            </button>
          </div>
          
          <!-- ===== PHẦN PHẢI: ICON FILM (CHỈ HIỂN THỊ TRÊN MÀN HÌNH LỚN) ===== -->
          <!-- hidden lg:flex: ẩn trên mobile/tablet, hiển thị trên desktop
               opacity-20: màu nhạt, tạo background decor -->
          <div class="hidden lg:flex flex-1 justify-end items-center">
            <Icon name="heroicons-solid:film" class="w-48 h-48 text-white opacity-20" />
          </div>
        </div>
        
        <!-- ===== NÚT NEXT CAROUSEL (BÊN PHẢI) ===== -->
        <!-- absolute right-4 top-1/2: vị trí cố định bên phải, giữa chiều cao
             z-10: nằm trên các layer khác -->
        <button 
          @click="nextAd" 
          class="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 text-white p-3 rounded-full transition z-10 hidden sm:flex items-center justify-center"
        >
          <Icon name="heroicons-solid:chevron-right" class="w-6 h-6" />
        </button>
      </div>
      
      <!-- ===== CHỈ BÁO DẤU CHẤM (CAROUSEL DOTS) ===== -->
      <!-- Ở dưới cùng carousel, người dùng có thể click để nhảy đến slide -->
      <!-- absolute bottom-4 left-1/2: đặt ở giữa dưới -->
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        <button 
          v-for="(ad, index) in advertisements" 
          :key="ad.id"
          @click="goToAd(index)"
          :class="[
            'w-2 h-2 rounded-full transition-all duration-300',
            // Slide hiện tại: chấm trắng dài (w-8), các slide khác: chấm nhỏ (w-2)
            currentAdIndex === index 
              ? 'bg-white w-8' 
              : 'bg-white bg-opacity-50 hover:bg-opacity-75'
          ]"
        ></button>
      </div>
    </div>
    
    <!-- ===== PHẦN HIỂN THỊ KẾT QUẢ TÌM KIẾM ===== -->
    <!-- v-if="isSearchMode": Chỉ hiển thị khi people đang tìm kiếm
         (Ẩn carousel, carousel phân trang, v.v) -->
    <div v-if="isSearchMode" class="mb-24">
    <!-- ===== TIÊU ĐỀ KẾT QUẢ TÌM KIẾM ===== -->
      <!-- Hiển thị từ khóa đã tìm và số phim tìm được -->
      <div class="mb-10 p-6 rounded-lg bg-gradient-to-r from-emerald-600/20 to-blue-600/20 border border-emerald-600/30">
        <h2 class="text-3xl font-bold text-white mb-2">
          Kết Quả Tìm Kiếm
          <!-- searchedMovies.length: tổng số phim khớp từ khóa trước phân trang -->
          <span class="text-emerald-400 text-lg">({{ searchedMovies.length }} phim)</span>
        </h2>
        <!-- Hiển thị từ khóa đã nhập -->
        <p class="text-gray-400 text-sm">Từ khóa: <span class="text-emerald-400 font-semibold">{{ searchQuery }}</span></p>
      </div>
      
      <!-- ===== HIỂN THỊ PHIM TÌM ĐƯỢC HOẶC THÔNG BÁO "KHÔNG TÌM THẤY" ===== -->
      <!-- template v-if: kiểm tra có phim tìm được không -->
      <template v-if="searchedMovies.length > 0">
        <!-- ===== GRID PHIM TÌM KIẾM ===== -->
        <!-- searchedMoviesPaginated: danh sách phim hiển thị trên page hiện tại
             - mobile: 1 phim/hàng
             - tablet: 2 phim/hàng
             - desktop: 4 phim/hàng -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <MovieCard v-for="movie in searchedMoviesPaginated" :key="movie.id" :movie="movie" />
        </div>
        
        <!-- ===== PHÂN TRANG TÌM KIẾM ===== -->
        <!-- v-if="totalSearchPages > 1": Chỉ hiển thị nếu > 1 trang
             Ví dụ: 20 phim tìm được ÷ 5 phim/trang = 4 trang -->
        <div v-if="totalSearchPages > 1" class="flex justify-center items-center gap-2">
          <!-- NÚT TRƯỚC: Quay lại trang trước -->
          <button 
            @click="goToSearchPage(1)"
            :disabled="totalSearchPages === 1"
            class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            ← Trước
          </button>
          
          <!-- CÁC NÚT TRANG ỐỀ -->
          <!-- v-for="page in totalSearchPages": tạo nút cho mỗi trang
               Ví dụ: 4 trang → 4 nút (1, 2, 3, 4) -->
          <div class="flex gap-1">
            <button 
              v-for="page in totalSearchPages" 
              :key="page"
              class="px-3 py-1 text-sm rounded font-semibold transition bg-gray-800 text-gray-300 hover:bg-gray-700"
            >
              {{ page }}
            </button>
          </div>
          
          <!-- NÚT SAU: Chuyển đến trang tiếp theo -->
          <button 
            @click="goToSearchPage(totalSearchPages)"
            :disabled="totalSearchPages === 1"
            class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Sau →
          </button>
        </div>
      </template>
      
      <!-- ===== THÔNG BÁO KHÔNG TÌM THẤY PHIM ===== -->
      <!-- v-else: hiển thị khi searchedMovies.length === 0 -->
      <div v-else class="flex flex-col items-center justify-center py-20">
        <!-- Icon phim với opacity nhạt -->
        <Icon name="heroicons-solid:film" class="w-20 h-20 text-gray-600 mb-4" />
        <h3 class="text-2xl font-bold text-gray-400 mb-2">Không Tìm Thấy Phim</h3>
        <p class="text-gray-500 text-center max-w-md">
          Rất tiếc, chúng tôi không tìm thấy phim phù hợp với từ khóa "<span class="text-emerald-400 font-semibold">{{ searchQuery }}</span>". 
          Vui lòng thử tìm kiếm với từ khóa khác.
        </p>
      </div>
    </div>
    
    <!-- ===== NÚT MỞ/ĐÓNG BỘ LỌC (TOGGLE FILTER) ===== -->
    <!-- v-if=!isSearchMode: Chỉ hiển thị khi không tìm kiếm -->
    <template v-if="!isSearchMode">
    <div class="mb-6 flex items-center gap-2">
      <!-- NÚT TOGGLE: Thay đổi showFilter: true ↔ false -->
      <!-- :class binding: Đổi màu nút dựa trên showFilter -->
      <button 
        @click="toggleFilter"
        :class="[
          'px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2',
          // showFilter = true: nền emerald, chữ trắng
          // showFilter = false: nền xám, chữ xám nhạt
          showFilter
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
            : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
        ]"
      >
        <Icon name="heroicons-solid:funnel" class="w-5 h-5" />
        <!-- Thay đổi text nút: "Hiện" hay "Ẩn" -->
        <span>{{ showFilter ? 'Ẩn Bộ Lọc' : 'Hiện Bộ Lọc' }}</span>
      </button>
    </div>
    
    <!-- ===== BỘ LỌC PHIM (FILTER PANEL) ===== -->
    <!-- v-if="showFilter": Chỉ hiển thị khi showFilter = true -->
    <!-- Ẩn/hiện mượt với transition mặc định của Vue -->
    <div v-if="showFilter" class="mb-12">
      <!-- Tiêu đề bộ lọc -->
      <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Icon name="heroicons-solid:funnel" class="w-5 h-5 text-emerald-500" />
        Lọc Phim
      </h3>
      
      <!-- ===== LỌCTHEO THỂ LOẠI ===== -->
      <!-- activeGenreFilters: Set các thể loại đã chọn
           v-for="genre in allGenres": vòng lặp tất cả thể loại có sẵn -->
      <div class="mb-4">
        <p class="text-sm text-emerald-400 font-semibold mb-2">Theo Thể Loại:</p>
        <div class="flex flex-wrap gap-2">
          <button 
            v-for="genre in allGenres" 
            :key="genre"
            @click="filterByGenre(genre)"
            :class="[
              'px-4 py-2 rounded-lg font-semibold transition text-sm',
              // activeGenreFilters.has(genre): kiểm tra thể loại có được chọn không
              // Nếu chọn: nền emerald (chỉ báo đã chọn)
              // Nếu chưa: nền xám, có thể nhấn để chọn
              activeGenreFilters.has(genre)
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            ]"
          >
            {{ genre }}
          </button>
        </div>
      </div>
      
      <!-- ===== LỌCTHEO NĂM ===== -->
      <!-- Tương tự như lọc thể loại nhưng dùng màu xanh dương thay vì xanh lá -->
      <div class="mb-4">
        <p class="text-sm text-emerald-400 font-semibold mb-2">Theo Năm:</p>
        <div class="flex flex-wrap gap-2">
          <button 
            v-for="year in allYears" 
            :key="year"
            @click="filterByYear(year)"
            :class="[
              'px-4 py-2 rounded-lg font-semibold transition text-sm',
              activeYearFilters.has(year)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            ]"
          >
            {{ year }}
          </button>
        </div>
      </div>
      
      <!-- ===== NÚT XÓA BỘ LỌC (CHỈ HIỂN THỊ KHI ĐANG LỌC) ===== -->
      <!-- v-if="isFilterMode": Chỉ hiển thị nút này khi người dùng đã chọn filter
           Khi bấm: resetFilter() → xóa tất cả filters → quay về view danh mục -->
      <button 
        v-if="isFilterMode"
        @click="resetFilter"
        class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
      >
        Xóa Bộ Lọc
      </button>
    </div>
    
    <!-- ===== PHẦN HIỂN THỊ: PHIM LỌC HOẶC DANH MỤC ===== -->
    
    <!-- ===== SECTION LỌC PHIM (CHỈ HIỂN THỊ KHI ISFILTERMODE = TRUE) ===== -->
    <!-- v-if="isFilterMode": Người dùng đã chọn filter và muốn xem kết quả
         Ẩn liền 5 danh mục bình thường, hiển thị phim lọc được
         Khi XÓA BỘLỌC (resetFilter): isFilterMode = false → hiển thị lại danh mục -->
    <div v-if="isFilterMode" class="mb-24">
      <!-- ===== TIÊU ĐỀ PHẦN LỌC ===== -->
      <!-- filteredMovies.length: tổng số phim thỏa mãn tất cả điều kiện lọc -->
      <div class="mb-10 p-6 rounded-lg bg-gradient-to-r from-emerald-600/20 to-blue-600/20 border border-emerald-600/30">
        <h2 class="text-3xl font-bold text-white mb-4">
          Kết Quả Lọc
          <span class="text-emerald-400 text-lg">({{ filteredMovies.length }} phim)</span>
        </h2>
        
        <!-- ===== HIỂN THỊ CÁC TIÊU CHÍ LỌC ĐÃ CHỌN ===== -->
        <!-- Ví dụ: "Hành Động", "2020", "Tâm Lý" (nếu chọn nhiều filter) -->
        <div v-if="activeGenreFilters.size > 0 || activeYearFilters.size > 0" class="flex flex-wrap gap-2 items-center">
          <span class="text-gray-400 text-sm">Lọc:</span>
          
          <!-- Hiển thị các thể loại đã chọn trong các chip -->
          <span 
            v-for="genre in activeGenreFilters" 
            :key="genre"
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-600/30 border border-emerald-500 text-emerald-300 text-sm font-semibold"
          >
            {{ genre }}
            <!-- Nút × để bỏ chọn thể loại này -->
            <button @click="filterByGenre(genre)" class="hover:text-emerald-100">✕</button>
          </span>
          
          <!-- Hiển thị các năm đã chọn trong các chip -->
          <span 
            v-for="year in activeYearFilters" 
            :key="year"
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/30 border border-blue-500 text-blue-300 text-sm font-semibold"
          >
            {{ year }}
            <!-- Nút × để bỏ chọn năm này -->
            <button @click="filterByYear(year)" class="hover:text-blue-100">✕</button>
          </span>
        </div>
      </div>
      
      <!-- ===== GRID PHIM LỌC ĐƯỢC ===== -->
      <!-- filteredMoviesPaginated: danh sách phim lọc được trên trang hiện tại
           Similar layout: 4 phim/hàng desktop, 2 tablet, 1 mobile -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MovieCard v-for="movie in filteredMoviesPaginated" :key="movie.id" :movie="movie" />
      </div>
      
      <!-- ===== PHÂN TRANG KHI LỌC PHIM ===== -->
      <!-- totalFilterPages: số trang kết quả lọc
           filterCurrentPage: trang hiện tại -->
      <div v-if="totalFilterPages > 1" class="flex justify-center items-center gap-2">
        <!-- NÚT TRƯỚC -->
        <button 
          @click="goToFilterPage(filterCurrentPage - 1)"
          :disabled="filterCurrentPage === 1"
          class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          ← Trước
        </button>
        
        <!-- CÁC NÚT TRANG SỐ -->
        <div class="flex gap-1">
          <button 
            v-for="page in totalFilterPages" 
            :key="page"
            @click="goToFilterPage(page)"
            :class="[
              'px-3 py-1 text-sm rounded font-semibold transition',
              // Trang hiện tại: nền emerald, chữ trắng
              // Các trang khác: nền xám, có thể nhấn
              filterCurrentPage === page 
                ? 'bg-emerald-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            ]"
          >
            {{ page }}
          </button>
        </div>
        
        <!-- NÚT SAU -->
        <button 
          @click="goToFilterPage(filterCurrentPage + 1)"
          :disabled="filterCurrentPage === totalFilterPages"
          class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Sau →
        </button>
      </div>
    </div>
    
    <!-- ===== PHẦN DANH MỤC (CHỈ HIỂN THỊ KHI ISFILTERMODE = FALSE) ===== -->
    <!-- Khi không lọc phim: hiển thị 5 danh mục với phim ưu tiên -->
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
