<script setup>
// ============================================
// 1. LẤY DỮ LIỆU PHIM TỪ API
// ============================================
const { data: allMovies } = await useFetch('/api/movies')

// ============================================
// 1.5. CAROUSEL/SLIDER QUẢNG CÁO
// ============================================
// Mảng chứa các quảng cáo
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

// Trạng thái carousel
const currentAdIndex = ref(0)
let autoSlideInterval = null

// Hàm chuyển quảng cáo
const nextAd = () => {
  currentAdIndex.value = (currentAdIndex.value + 1) % advertisements.length
}

const prevAd = () => {
  currentAdIndex.value = (currentAdIndex.value - 1 + advertisements.length) % advertisements.length
}

const goToAd = (index) => {
  currentAdIndex.value = index
  // Reset interval khi user click
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval)
    startAutoSlide()
  }
}

// Auto-slide carousel
const startAutoSlide = () => {
  autoSlideInterval = setInterval(() => {
    nextAd()
  }, 5000) // Chuyển sau 5 giây
}

// Lifecycle: Start auto-slide when component mounted
onMounted(() => {
  startAutoSlide()
})

// Lifecycle: Clear interval when component unmounted
onUnmounted(() => {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval)
  }
})
// Mỗi hàng phim có page riêng: currentPageNew, currentPageHot, v.v
const currentPageNew = ref(1)              // Trang hiện tại của hàng 1
const currentPageHot = ref(1)              // Trang hiện tại của hàng 2
const currentPageMostViewed = ref(1)       // Trang hiện tại của hàng 3
const currentPageTrending = ref(1)         // Trang hiện tại của hàng 4
const currentPageToday = ref(1)            // Trang hiện tại của hàng 5

const moviesPerPage = 5                    // Mỗi hàng hiển thị 5 phim

// ============================================
// 3. TÍNH TOÁN PHÂN TRANG CHO MỖI HÀNG
// ============================================
// Hàng 1: Phim Mới Cập Nhật (phim 0-19)
const newMoviesPaginated = computed(() => {
  if (!allMovies.value || allMovies.value.length === 0) return []
  // Lấy từ vị trí 0 đến 19 (20 phim)
  const sourceMovies = allMovies.value.slice(0, 20)
  // Tính trang: (trang - 1) * 5
  const startIndex = (currentPageNew.value - 1) * moviesPerPage
  const endIndex = startIndex + moviesPerPage
  return sourceMovies.slice(startIndex, endIndex)
})

// Tính tổng page cho hàng 1
const totalPagesNew = computed(() => {
  if (!allMovies.value || allMovies.value.length < 20) return 0
  return Math.ceil(20 / moviesPerPage)
})

// Hàng 2: Phim Hot Hiện Tại (phim 20-39)
const hotMoviesPaginated = computed(() => {
  if (!allMovies.value || allMovies.value.length < 20) return []
  const sourceMovies = allMovies.value.slice(20, 40)
  const startIndex = (currentPageHot.value - 1) * moviesPerPage
  const endIndex = startIndex + moviesPerPage
  return sourceMovies.slice(startIndex, endIndex)
})

const totalPagesHot = computed(() => {
  if (!allMovies.value || allMovies.value.length < 40) return 0
  return Math.ceil(20 / moviesPerPage)
})

// Hàng 3: Phim Được Xem Nhiều (phim 40-59)
const mostViewedPaginated = computed(() => {
  if (!allMovies.value || allMovies.value.length < 40) return []
  const sourceMovies = allMovies.value.slice(40, 60)
  const startIndex = (currentPageMostViewed.value - 1) * moviesPerPage
  const endIndex = startIndex + moviesPerPage
  return sourceMovies.slice(startIndex, endIndex)
})

const totalPagesMostViewed = computed(() => {
  if (!allMovies.value || allMovies.value.length < 60) return 0
  return Math.ceil(20 / moviesPerPage)
})

// Hàng 4: Trending Hôm Nay (phim 60-79)
const trendingPaginated = computed(() => {
  if (!allMovies.value || allMovies.value.length < 60) return []
  const sourceMovies = allMovies.value.slice(60, 80)
  const startIndex = (currentPageTrending.value - 1) * moviesPerPage
  const endIndex = startIndex + moviesPerPage
  return sourceMovies.slice(startIndex, endIndex)
})

const totalPagesTrending = computed(() => {
  if (!allMovies.value || allMovies.value.length < 80) return 0
  return Math.ceil(20 / moviesPerPage)
})

// Hàng 5: Phim Hôm Nay (phim 80-99)
const todayPaginated = computed(() => {
  if (!allMovies.value || allMovies.value.length < 80) return []
  const sourceMovies = allMovies.value.slice(80, 100)
  const startIndex = (currentPageToday.value - 1) * moviesPerPage
  const endIndex = startIndex + moviesPerPage
  return sourceMovies.slice(startIndex, endIndex)
})

const totalPagesToday = computed(() => {
  if (!allMovies.value || allMovies.value.length < 100) return 0
  return Math.ceil(20 / moviesPerPage)
})

// ============================================
// 4. CÁC HÀM XỬ LÝ - PHÂN TRANG CHO MỖI HÀNG
// ============================================
// Hàm chuyển trang cho hàng 1
const goToPageNew = (pageNumber) => {
  if (pageNumber >= 1 && pageNumber <= totalPagesNew.value) {
    currentPageNew.value = pageNumber
  }
}

// Hàm chuyển trang cho hàng 2
const goToPageHot = (pageNumber) => {
  if (pageNumber >= 1 && pageNumber <= totalPagesHot.value) {
    currentPageHot.value = pageNumber
  }
}

// Hàm chuyển trang cho hàng 3
const goToPageMostViewed = (pageNumber) => {
  if (pageNumber >= 1 && pageNumber <= totalPagesMostViewed.value) {
    currentPageMostViewed.value = pageNumber
  }
}

// Hàm chuyển trang cho hàng 4
const goToPageTrending = (pageNumber) => {
  if (pageNumber >= 1 && pageNumber <= totalPagesTrending.value) {
    currentPageTrending.value = pageNumber
  }
}

// Hàm chuyển trang cho hàng 5
const goToPageToday = (pageNumber) => {
  if (pageNumber >= 1 && pageNumber <= totalPagesToday.value) {
    currentPageToday.value = pageNumber
  }
}
</script>

<template>
  <div>
    <!-- ====== PROMOTIONAL CAROUSEL / SLIDER QUẢNG CÁO ====== -->
    <div class="mb-24 relative overflow-hidden rounded-2xl bg-gradient-to-r shadow-2xl">
      <!-- Background gradient được phủ bởi ad data -->
      <div :class="`bg-gradient-to-r ${advertisements[currentAdIndex].color}`" class="transition-all duration-700">
        <!-- Animated blur circles -->
        <div class="absolute inset-0 opacity-20">
          <div class="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div class="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
        </div>
        
        <div class="relative px-8 py-12 flex items-center justify-between">
          <!-- Phần trái: Text + Button -->
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-3">
              <Icon :name="`heroicons-solid:${advertisements[currentAdIndex].icon}`" class="w-8 h-8 text-white animate-bounce" />
              <span class="text-sm font-bold text-white bg-black bg-opacity-30 px-3 py-1 rounded-full">QUẢNG CÁO</span>
            </div>
            <h2 class="text-4xl font-bold text-white mb-3 transition-all duration-500">{{ advertisements[currentAdIndex].title }}</h2>
            <p class="text-lg text-white text-opacity-90 mb-6 max-w-3xl transition-all duration-500">{{ advertisements[currentAdIndex].description }}</p>
            <button :class="[`px-8 py-3 bg-white ${advertisements[currentAdIndex].textColor} font-bold rounded-lg hover:bg-opacity-90 transition transform hover:scale-105 flex items-center gap-2 shadow-lg hover:shadow-xl`]">
              <Icon name="heroicons-solid:play" :class="advertisements[currentAdIndex].textColor" />
              Xem Ngay
            </button>
          </div>
          
          <!-- Phần phải: Icon/Hình ảnh -->
          <div class="hidden lg:flex flex-1 justify-end items-center">
            <Icon name="heroicons-solid:film" class="w-48 h-48 text-white opacity-20" />
          </div>
        </div>
        
        <!-- Navigation button (right only) -->
        <button 
          @click="nextAd" 
          class="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 text-white p-3 rounded-full transition z-10 hidden sm:flex items-center justify-center"
        >
          <Icon name="heroicons-solid:chevron-right" class="w-6 h-6" />
        </button>
      </div>
      
      <!-- Dots indicator -->
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
          @click="goToPageTrending(currentPageTrending - 1)"
          :disabled="currentPageTrending === 1"
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
              currentPageTrending === page 
                ? 'bg-emerald-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            ]"
          >
            {{ page }}
          </button>
        </div>
        <button 
          @click="goToPageTrending(currentPageTrending + 1)"
          :disabled="currentPageTrending === totalPagesTrending"
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
          @click="goToPageNew(currentPageNew - 1)"
          :disabled="currentPageNew === 1"
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
              currentPageNew === page 
                ? 'bg-emerald-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            ]"
          >
            {{ page }}
          </button>
        </div>
        <button 
          @click="goToPageNew(currentPageNew + 1)"
          :disabled="currentPageNew === totalPagesNew"
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
          @click="goToPageHot(currentPageHot - 1)"
          :disabled="currentPageHot === 1"
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
              currentPageHot === page 
                ? 'bg-emerald-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            ]"
          >
            {{ page }}
          </button>
        </div>
        <button 
          @click="goToPageHot(currentPageHot + 1)"
          :disabled="currentPageHot === totalPagesHot"
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
          @click="goToPageMostViewed(currentPageMostViewed - 1)"
          :disabled="currentPageMostViewed === 1"
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
              currentPageMostViewed === page 
                ? 'bg-emerald-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            ]"
          >
            {{ page }}
          </button>
        </div>
        <button 
          @click="goToPageMostViewed(currentPageMostViewed + 1)"
          :disabled="currentPageMostViewed === totalPagesMostViewed"
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
          @click="goToPageToday(currentPageToday - 1)"
          :disabled="currentPageToday === 1"
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
              currentPageToday === page 
                ? 'bg-emerald-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            ]"
          >
            {{ page }}
          </button>
        </div>
        <button 
          @click="goToPageToday(currentPageToday + 1)"
          :disabled="currentPageToday === totalPagesToday"
          class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Sau →
        </button>
      </div>
    </div>
  </div>
</template>