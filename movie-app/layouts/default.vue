<template>
  <div class="min-h-screen flex flex-col bg-black">
    <header class="bg-gradient-to-b from-black via-gray-950 to-black backdrop-blur-md sticky top-0 z-50 border-b border-emerald-600/30">
      <nav class="container mx-auto px-4 py-4 flex justify-between items-center">
        <!-- PHẦN 1: LOGO + TÊN WEBSITE -->
        <NuxtLink to="/">
          <div 
            @click="goHome"
            class="flex items-center gap-2 text-2xl font-bold text-emerald-500 tracking-tighter uppercase cursor-pointer hover:opacity-80 transition"
          >
            <!-- Icon phim: biểu tượng ngành công nghiệp -->
            <Icon name="heroicons-solid:film" class="w-8 h-8" />
            <!-- Tên website: KHANLIX = nền tảng xem phim -->
            KHANLIX
          </div>
        </NuxtLink>
        <div class="flex items-center gap-6">
          <!-- PHẦN 2: MENU ĐIỀU HƯỚNG CHÍNH -->
          <!-- 3 trang chính: Trang chủ, Phim Lẻ, Phim Bộ -->
          <ul class="flex gap-6 font-medium text-white">
            <!-- Link Trang chủ: điều hướng về index page và clear search -->
            <li>
              <NuxtLink to="/" @click="goHome" class="hover:text-emerald-500 transition">Trang chủ</NuxtLink>
            </li>
            <!-- Link Phim Lẻ: để xem các bộ phim đơn (chưa có page này) -->
            <li><NuxtLink to="#" class="hover:text-emerald-500 transition">Phim Lẻ</NuxtLink></li>
            <!-- Link Phim Bộ: để xem các series/phim tập (chưa có page này) -->
            <li><NuxtLink to="#" class="hover:text-emerald-500 transition">Phim Bộ</NuxtLink></li>
          </ul>

          <!-- PHẦN 3: DROPDOWN DANH MỤC -->
          <!-- Dropdown có 3 cột: Thể Loại, Năm Phát Hành, Khác -->
          <div class="relative group" @mouseenter="showCategoryDropdown = true" @mouseleave="showCategoryDropdown = false">
            <!-- NÚT DANH MỤC: Click để hiển thị dropdown hoặc di chuột để mở -->
            <button class="flex items-center gap-1 text-white hover:text-emerald-500 transition font-medium py-2">
              <span>Danh Mục</span>
              <!-- Icon mũi tên: xoay 180° khi dropdown mở (rotate-180 class) -->
              <Icon name="heroicons-solid:chevron-down" class="w-4 h-4" :class="{ 'rotate-180': showCategoryDropdown }" />
            </button>

            <!-- VÙNG HOVER Vborgo: Giữ dropdown mở khi di chuột từ button xuống -->
            <!-- Chiều cao h-4 = 16px để tạo khoảng trắng liền lạc không bị gián đoạn -->
            <div class="absolute left-0 right-0 top-full h-4 pointer-events-auto" />

            <!-- NỘI DUNG DROPDOWN: Lưới 3 cột với animation fade-scale -->
            <!-- Appearance: Dark background (gray-900) với border này là đường viền emerald -->
            <Transition name="fade-scale">
              <div v-if="showCategoryDropdown" class="absolute left-0 top-full bg-gray-900 border border-emerald-600/30 rounded-lg shadow-2xl z-40 mt-4">
                <!-- LƯ ỚI 3 CỘT: Mỗi cột hiển thị một loại danh mục -->
                <!-- gap-8 = khoảng cách giữa các cột, p-6 = padding bên trong -->
                <div class="grid grid-cols-3 gap-8 p-6 min-w-max">
                  <!-- CỘT 1: THỂ LOẠI (Genre) -->
                  <!-- Giúp người dùng lọc phim theo thể loại: Hành động, Hài, Kinh dị, v.v -->
                  <div>
                    <!-- Tiêu đề cột -->
                    <div class="text-xs font-bold text-emerald-500 mb-3 uppercase">Theo Thể Loại</div>
                    <!-- Danh sách các thể loại: mỗi link là một thể loại riêng -->
                    <div class="space-y-2">
                      <!-- Link thể loại: khi click sẽ lọc phim theo thể loại này -->
                      <NuxtLink to="#" class="block text-sm text-gray-300 hover:text-emerald-400 transition">Hành động</NuxtLink>
                      <NuxtLink to="#" class="block text-sm text-gray-300 hover:text-emerald-400 transition">Hài hước</NuxtLink>
                      <NuxtLink to="#" class="block text-sm text-gray-300 hover:text-emerald-400 transition">Kinh dị</NuxtLink>
                      <NuxtLink to="#" class="block text-sm text-gray-300 hover:text-emerald-400 transition">Lãng mạn</NuxtLink>
                      <NuxtLink to="#" class="block text-sm text-gray-300 hover:text-emerald-400 transition">Khoa học viễn tưởng</NuxtLink>
                      <NuxtLink to="#" class="block text-sm text-gray-300 hover:text-emerald-400 transition">Tâm lý</NuxtLink>
                    </div>
                  </div>

                  <!-- CỘT 2: NĂNG PHÁT HÀNH (Year) -->
                  <!-- Giúp người dùng tìm phim từ những năm khác nhau: 2026, 2025, 2024, v.v -->
                  <div>
                    <!-- Tiêu đề cột -->
                    <div class="text-xs font-bold text-emerald-500 mb-3 uppercase">Theo Năm</div>
                    <!-- Danh sách các năm: từ mới nhất đến cũ nhất -->
                    <div class="space-y-2">
                      <!-- Link năm: khi click sẽ lọc phim phát hành trong năm đó -->
                      <NuxtLink to="#" class="block text-sm text-gray-300 hover:text-emerald-400 transition">2026</NuxtLink>
                      <NuxtLink to="#" class="block text-sm text-gray-300 hover:text-emerald-400 transition">2025</NuxtLink>
                      <NuxtLink to="#" class="block text-sm text-gray-300 hover:text-emerald-400 transition">2024</NuxtLink>
                      <NuxtLink to="#" class="block text-sm text-gray-300 hover:text-emerald-400 transition">2023</NuxtLink>
                      <NuxtLink to="#" class="block text-sm text-gray-300 hover:text-emerald-400 transition">2022</NuxtLink>
                      <NuxtLink to="#" class="block text-sm text-gray-300 hover:text-emerald-400 transition">2021</NuxtLink>
                    </div>
                  </div>

                  <!-- CỘT 3: KHÁC (Other) -->
                  <!-- Giúp người dùng truy cập các lọcnâng cao: Top Phim, Phim Mới, Xem Nhiều, v.v -->
                  <div>
                    <!-- Tiêu đề cột -->
                    <div class="text-xs font-bold text-emerald-500 mb-3 uppercase">Khác</div>
                    <!-- Danh sách các bộ lọc đặc biệt -->
                    <div class="space-y-2">
                      <!-- Link bộ lọc: khi click sẽ hiển thị phim được xếp hạng cao nhất -->
                      <NuxtLink to="#" class="block text-sm text-gray-300 hover:text-emerald-400 transition">Top Phim</NuxtLink>
                      <!-- Link bộ lọc: khi click sẽ hiển thị phim được phát hành gần đây -->
                      <NuxtLink to="#" class="block text-sm text-gray-300 hover:text-emerald-400 transition">Phim Mới Nhất</NuxtLink>
                      <!-- Link bộ lọc: khi click sẽ hiển thị phim được xem nhiều nhất -->
                      <NuxtLink to="#" class="block text-sm text-gray-300 hover:text-emerald-400 transition">Xem Nhiều Nhất</NuxtLink>
                      <!-- Link bộ lọc: khi click sẽ hiển thị phim có rating cao nhất (IMDb, v.v) -->
                      <NuxtLink to="#" class="block text-sm text-gray-300 hover:text-emerald-400 transition">Được Đánh Giá Cao</NuxtLink>
                      <!-- Link bộ lọc: khi click sẽ hiển thị phim sắp phát hành -->
                      <NuxtLink to="#" class="block text-sm text-gray-300 hover:text-emerald-400 transition">Sắp Ra Mắt</NuxtLink>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
        
        <!-- PHẦN 4: FAVORITES, HISTORY, SEARCH VÀ AUTH BUTTONS -->
        <div class="flex items-center gap-3">
          <!-- NÚT YÊU THÍCH -->
          <!-- Link đến trang phim yêu thích -->
          <NuxtLink 
            to="/favorites"
            class="p-2 text-white hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition flex items-center gap-1"
            title="Phim Yêu Thích"
          >
            <Icon name="heroicons-solid:heart" class="w-5 h-5 text-white" />
          </NuxtLink>

          <!-- NÚT LỊCH SỬ XEM -->
          <!-- Liên kết đến trang lịch sử -->
          <NuxtLink 
            to="/history"
            class="p-2 text-white hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition flex items-center gap-1"
            title="Lịch Sử Xem"
          >
            <Icon name="heroicons-solid:clock" class="w-5 h-5" />
          </NuxtLink>

          <!-- TÌM KIẾM: Input tìm kiếm phim -->
          <!-- Chỉ tìm kiếm khi bấm Enter để tối ưu -->
          <div class="flex items-center bg-gray-900 hover:bg-gray-800 border border-emerald-600/50 px-3 py-2 rounded-full text-sm text-white transition w-56 flex-shrink-0">
            <!-- Icon kính lúp: biểu tượng tìm kiếm -->
            <Icon name="heroicons-solid:magnifying-glass" class="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <!-- Input thực tế -->
            <input 
              v-model="searchInput"
              @keyup.enter="handleSearch"
              type="text"
              placeholder="Tìm kiếm phim..."
              class="flex-1 bg-transparent outline-none placeholder-gray-500 ml-2 text-white"
            />
          </div>

          <!-- NÚT ĐĂNG NHẬP -->
          <!-- Border button (empty background): khi click gọi openAuthModal('login') -->
          <!-- Có thể tab vào hoặc click trực tiếp để mở form login -->
          <button 
            @click="openAuthModal('login')"
            class="px-4 py-2 border border-emerald-600 text-emerald-500 hover:bg-emerald-600/10 rounded-lg font-medium transition"
          >
            Đăng Nhập
          </button>

          <!-- NÚT ĐĂNG KÝ -->
          <!-- Solid button (filled background): khi click gọi openAuthModal('register') -->
          <!-- Có thể tab vào hoặc click trực tiếp để mở form register -->
          <button 
            @click="openAuthModal('register')"
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition"
          >
            Đăng Ký
          </button>
        </div>
      </nav>
    </header>

    <!-- PHẦN MAIN: NỘI DUNG CHÍNH CỦA TRANG -->
    <!-- flex-grow = chiếm tất cả khoảng trắng còn lại giữa header và footer -->
    <!-- slot = nơi hiển thị nội dung của page cơ thể (pages/index.vue, v.v) -->
    <main class="flex-grow container mx-auto px-4 py-8">
      <Breadcrumb />
      <slot />
    </main>

    <!-- FOOTER: CHÂN TRANG VỚI 4 CỘT -->
    <!-- Gradient từ gray-950 đến black: tạo hiệu ứng chuyển độc từ main content -->
    <!-- border-t = đường viền trên (ngăn cách với content chính) -->
    <footer class="bg-gradient-to-b from-gray-950 to-black border-t border-emerald-600/30 py-12 text-gray-300">
      <div class="container mx-auto px-4">
        <!-- LƯỚI 4 CỘT: Mobile 1 cột (md:grid-cols-4 = 4 cột trên medium screen trở lên) -->
        <!-- gap-8 = khoảng cách 32px giữa các cột, mb-8 = margin dưới 32px -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <!-- CỘT 1: PHẦN THƯƠNG HIỆU (Brand) -->
          <!-- Giới thiệu về website và công ty -->
          <div>
            <!-- LOGO + TÊN: Giống như header -->
            <div class="flex items-center gap-2 text-xl font-bold text-emerald-500 mb-4">
              <!-- Icon phim: giống như header -->
              <Icon name="heroicons-solid:film" class="w-6 h-6" />
              <!-- Tên: KHANLIX -->
              KHANLIX
            </div>
            <!-- MÔ TẢ VĂN BẢN: Giải thích gamer về website -->
            <p class="text-sm text-gray-400">
              Nền tảng xem phim trực tuyến với bộ sưu tập phim đa dạng và chất lượng cao.
            </p>
          </div>

          <!-- CỘT 2: DANH MỤC (Categories) -->
          <!-- Các link nhanh để người dùng dễ dàng tìm phim -->
          <div>
            <!-- Tiêu đề cột -->
            <h3 class="text-white font-bold mb-4">Danh Mục</h3>
            <!-- Danh sách: mỗi link là một loại phim hoặc lọc -->
            <ul class="space-y-2 text-sm">
              <!-- Phim Mới: link đến page hiển thị phim mới phát hành gần đây -->
              <li><NuxtLink to="#" class="hover:text-emerald-400 transition">Phim Mới</NuxtLink></li>
              <!-- Phim Lẻ: link đến page hiển thị phim lẻ (non-series movies) -->
              <li><NuxtLink to="#" class="hover:text-emerald-400 transition">Phim Lẻ</NuxtLink></li>
              <!-- Phim Bộ: link đến page hiển thị series/phim tập -->
              <li><NuxtLink to="#" class="hover:text-emerald-400 transition">Phim Bộ</NuxtLink></li>
              <!-- Top Phim: link để xem phim được xếp hạng cao nhất -->
              <li><NuxtLink to="#" class="hover:text-emerald-400 transition">Top Phim</NuxtLink></li>
            </ul>
          </div>

          <!-- CỘT 3: HỖ TRỢ (Support) -->
          <!-- Link để người dùng liên hệ hoặc xem FAQ -->
          <div>
            <!-- Tiêu đề cột -->
            <h3 class="text-white font-bold mb-4">Hỗ Trợ</h3>
            <!-- Danh sách: mỗi link là một cách để liên hệ hoặc nhận trợ giúp -->
            <ul class="space-y-2 text-sm">
              <!-- Liên Hệ: link để người dùng liên hệ với support team -->
              <li><NuxtLink to="#" class="hover:text-emerald-400 transition">Liên Hệ</NuxtLink></li>
              <!-- FAQ: link để xem các câu hỏi thường gặp -->
              <li><NuxtLink to="#" class="hover:text-emerald-400 transition">FAQ</NuxtLink></li>
              <!-- Báo Cáo Lỗi: link để báo cáo bug hoặc vấn đề kỹ thuật -->
              <li><NuxtLink to="#" class="hover:text-emerald-400 transition">Báo Cáo Lỗi</NuxtLink></li>
              <!-- Góp Ý: link để gửi feedback hoặc suggestion về features -->
              <li><NuxtLink to="#" class="hover:text-emerald-400 transition">Góp Ý</NuxtLink></li>
            </ul>
          </div>

          <!-- CỘT 4: PHÁP LÝ (Legal) -->
          <!-- Các điều khoản dịch vụ, chính sách riêng tư, v.v -->
          <div>
            <!-- Tiêu đề cột -->
            <h3 class="text-white font-bold mb-4">Pháp Lý</h3>
            <!-- Danh sách: mỗi link là một tài liệu pháp lý -->
            <ul class="space-y-2 text-sm">
              <!-- Điều Khoản Dịch Vụ: link đến ToS (Terms of Service) -->
              <li><NuxtLink to="#" class="hover:text-emerald-400 transition">Điều Khoản Dịch Vụ</NuxtLink></li>
              <!-- Chính Sách Riêng Tư: link đến Privacy Policy -->
              <li><NuxtLink to="#" class="hover:text-emerald-400 transition">Chính Sách Riêng Tư</NuxtLink></li>
              <!-- Cookie Settings: link để quản lý cookie preferences -->
              <li><NuxtLink to="#" class="hover:text-emerald-400 transition">Cookie Settings</NuxtLink></li>
            </ul>
          </div>
        </div>

        <!-- ĐƯỜNG CHIA RẠN: Phân cách giữa phần nội dung và phần copyright/social -->
        <!-- border-t = đường viền trên, my-8 = margin trên/dưới 32px -->
        <div class="border-t border-emerald-600/20 my-8"></div>

        <!-- PHẦN DƯỚI: COPYRIGHT VÀ SOCIAL ICONS -->
        <!-- Hiển thị thông tin bản quyền và các icon mạng xã hội -->
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <!-- COPYRIGHT: © 2026 KHANLIX. All rights reserved. -->
          <!-- text-sm = kích thước chữ nhỏ, text-gray-500 = màu xám nhạt (mờ hơn nội dung chính) -->
          <div class="text-sm text-gray-500">
            © 2026 KHANLIX. All rights reserved.
          </div>

          <!-- SOCIAL ICONS: 3 icon mạng xã hội -->
          <!-- gap-4 = khoảng cách 16px giữa các icon -->
          <div class="flex gap-4">
            <!-- Icon Globe: link đến website chính hoặc social media -->
            <a href="#" class="text-gray-400 hover:text-emerald-400 transition">
              <!-- Icon hình quả cầu biểu tượng: "Thế giới" hoặc "Website" -->
              <Icon name="heroicons-solid:globe-alt" class="w-5 h-5" />
            </a>
            <!-- Icon Envelope: link đến email hoặc contact form -->
            <a href="#" class="text-gray-400 hover:text-emerald-400 transition">
              <!-- Icon hình phong bì: "Email" hoặc "Liên hệ" -->
              <Icon name="heroicons-solid:envelope" class="w-5 h-5" />
            </a>
            <!-- Icon Bell: link đến thông báo hoặc notification center -->
            <a href="#" class="text-gray-400 hover:text-emerald-400 transition">
              <!-- Icon hình chuông: "Thông báo" hoặc "Tin tức mới" -->
              <Icon name="heroicons-solid:bell" class="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>

    <!-- AUTH MODAL: Component modal để đăng nhập / đăng ký -->
    <!-- isOpen = điều khiển việc hiển thị/ẩn modal (boolean ref) -->
    <!-- initialMode = chế độ khởi tạo ('login' hoặc 'register') -->
    <!-- @close = sự kiện khi đóng modal (cập nhật showAuthModal = false) -->
    <AuthModal :isOpen="showAuthModal" :initialMode="authMode" @close="showAuthModal = false" />

    <ScrollToTop />
  </div>
</template>



<script setup lang="ts">
// ========== IMPORT COMPOSABLE ==========
import { useHeader } from '~/composables/useHeader'

// ========== USE HEADER COMPOSABLE ==========
// Quản lý tất cả state và logic của header
const {
  showAuthModal,
  authMode,
  openAuthModal,
  showCategoryDropdown,
  searchInput,
  handleSearch,
  goHome
} = useHeader()
</script>



<style scoped>
/* ===== ANIMATION: FADE-SCALE TRANSITION CHO DROPDOWN =====*/
/* Animation này dùng cho dropdown danh mục khi mở/đóng */

/* TRẠNG THÁI: Khi animation đang chạy (vào và ra) */
.fade-scale-enter-active,
.fade-scale-leave-active {
  /* transition: thuộc tính animation thời gian timing-function */
  /* all = áp dụng cho tất cả thuộc tính CSS thay đổi */
  /* 0.2s = thời gian 200ms (khá nhanh, mượt mà) */
  /* cubic-bezier(0.4, 0, 0.2, 1) = đường cong easing (smooth acceleration/deceleration) */
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* TRẠNG THÁI: Khi element vào từ ẩn đến hiển thị (hoặc ra khỏi hiển thị quay lại ẩn) */
.fade-scale-enter-from,
.fade-scale-leave-to {
  /* opacity: 0; = từ trong suốt (0%) sang hiển thị đầy đủ (100%) khi enter */
  /* hoặc từ hiển thị (100%) sang trong suốt khi leave */
  opacity: 0;
  
  /* transform: scale(0.95) = kích thước nhỏ lại 95% (nhỏ hơn 5% kích thước chính) */
  /* scale(1) = kích thước bình thường 100%, nên 0.95 tức là nhỏ hơn một chút */
  
  /* translateY(-8px) = dịch lên 8 pixel (trước khi hiển thị hoàn toàn) */
  /* (Âm = lên trên, Dương = xuống dưới) */
  /* Tạo hiệu ứng "dropdown xuất hiện từ trên xuống" khi mở */
  transform: scale(0.95) translateY(-8px);
}
</style>