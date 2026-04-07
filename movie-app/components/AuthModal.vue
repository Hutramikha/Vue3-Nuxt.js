<script setup>
// ============================================
// 1. NHẬN DỮ LIỆU TỪ COMPONENT CHA
// ============================================
const props = defineProps({
  isOpen: Boolean,                    // Modal có mở không
  initialMode: {
    type: String,
    default: 'login'                  // Mặc định mở modal đăng nhập
  }
})

// ============================================
// 2. GỬI SỰ KIỆN ĐẾN COMPONENT CHA
// ============================================
const emit = defineEmits(['close'])   // Báo cho component cha là modal sẽ đóng

// ============================================
// 3. KHAI BÁO BIẾN TRẠNG THÁI
// ============================================
// ref() = biến phản ứng được (khi thay đổi, giao diện tự động cập nhật)
const isLoginForm = ref(true)              // true = form đăng nhập, false = form đăng ký
const showPassword = ref(false)            // Hiển thị/ẩn mật khẩu
const showConfirmPassword = ref(false)     // Hiển thị/ẩn xác nhận mật khẩu

// reactive() = đối tượng phản ứng được (thường dùng cho object)
const formData = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  fullName: ''
})

// ============================================
// 4. THEO DÕI THAY ĐỔI (watch)
// ============================================
// Khi modal mở, cập nhật loại form cần hiển thị
watch(() => props.isOpen, (isModalOpen) => {
  if (isModalOpen) {
    isLoginForm.value = props.initialMode === 'login'
  }
})

// ============================================
// 5. CÁC HÀM XỬ LÝ
// ============================================

// Hàm chuyển đổi giữa form đăng nhập và đăng ký
const toggleForm = () => {
  // Chuyển đổi: nếu đang đăng nhập thì chuyển sang đăng ký và ngược lại
  isLoginForm.value = !isLoginForm.value

  // Xóa sạch các dữ liệu của form cũ
  formData.email = ''
  formData.password = ''
  formData.confirmPassword = ''
  formData.fullName = ''
  showPassword.value = false
  showConfirmPassword.value = false
}

// Hàm xử lý khi người dùng gửi form
const handleSubmit = () => {
  if (!isLoginForm.value && formData.password !== formData.confirmPassword) {
    alert('Mật khẩu xác nhận không khớp! Vui lòng kiểm tra lại.')
    return
  }
  if (isLoginForm.value){
    // Người dùng đăng nhập
    console.log('Đăng nhập:', {
      email: formData.email,
      password: formData.password
    })
  } else {
    // Người dùng đăng ký
    console.log('Đăng ký:', formData)
  }

  // Xóa sạch dữ liệu sau khi submit
  formData.email = ''
  formData.password = ''
  formData.confirmPassword = ''
  formData.fullName = ''
}
</script>

<template>
  <!-- PHẦN 1: NỀN MỜ - Click vào nền để đóng modal -->
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" @click="emit('close')"></div>
  </Transition>

  <!-- PHẦN 2: MODAL CHÍNH -->
  <Transition name="slide">
    <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="bg-gray-900 rounded-lg border border-emerald-600/30 w-full max-w-md shadow-2xl" @click.stop>
        <!-- HEADER: Tiêu đề + Nút X -->
        <div class="flex justify-between items-center p-6 border-b border-emerald-600/20">
          <!-- Tiêu đề (Đăng Nhập hay Đăng Ký) -->
          <h2 class="text-2xl font-bold text-white">
            {{ isLoginForm ? 'Đăng Nhập' : 'Đăng Ký' }}
          </h2>
          <!-- Nút đóng -->
          <button 
            @click="emit('close')"
            class="text-gray-400 hover:text-white transition"
          >
              <Icon name="heroicons-solid:x-mark" class="w-6 h-6" />
          </button>
        </div>

        <!-- NỘI DUNG: Chứa form đăng nhập và đăng ký -->
        <div class="p-6">
          <!-- Chuyển form mượt mà: form đăng nhập ↔ đăng ký -->
          <Transition name="fade-slide" mode="out-in">
            <!-- FORM ĐĂNG NHẬP: Email + Mật Khẩu -->
            <form v-if="isLoginForm" key="login" @submit.prevent="handleSubmit" class="space-y-4">
              <!-- Trường Email -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input 
                  v-model="formData.email"
                  type="email" 
                  placeholder="example@gmail.com"
                  class="w-full bg-gray-800 border border-emerald-600/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-600 transition"
                  required
                />
              </div>

              <!-- Trường Mật Khẩu (có nút hiện/ẩn) -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Mật Khẩu</label>
                <div class="relative">
                  <!-- Input: type thay đổi tùy showPassword -->
                  <input 
                    v-model="formData.password"
                    :type="showPassword ? 'text' : 'password'" 
                    placeholder="••••••••"
                    class="w-full bg-gray-800 border border-emerald-600/30 rounded-lg px-4 py-2 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-600 transition"
                    required
                  />
                  <!-- Nút bật/tắt hiển thị mật khẩu -->
                  <button 
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-0 top-0 h-full px-4 flex items-center justify-center text-gray-400 hover:text-emerald-400 transition pointer-events-auto"
                  >
                    <!-- Icon mắt: eye (hiện) hay eye-slash (ẩn) -->
                    <Icon :name="showPassword ? 'heroicons-solid:eye-slash' : 'heroicons-solid:eye'" class="w-5 h-5" />
                  </button>
                </div>
              </div>

              <!-- Nút Đăng Nhập -->
              <button 
                type="submit"
                class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg transition"
              >
                Đăng Nhập
              </button>

              <!-- Link chuyển sang Đăng Ký -->
              <p class="text-center text-gray-400 text-sm">
                Chưa có tài khoản?
                <button 
                  type="button"
                  @click="toggleForm"
                  class="text-emerald-500 hover:text-emerald-400 font-semibold transition"
                >
                  Đăng ký ngay
                </button>
              </p>
            </form>
            <!-- FORM ĐĂNG KÝ: Họ tên + Email + 2 Mật khẩu -->
            <form v-else key="register" @submit.prevent="handleSubmit" class="space-y-4">
              <!-- Trường Họ Tên -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Họ Tên</label>
                <input 
                  v-model="formData.fullName"
                  type="text" 
                  placeholder="Nguyễn Văn A"
                  class="w-full bg-gray-800 border border-emerald-600/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-600 transition"
                  required
                />
              </div>

              <!-- Trường Email -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input 
                  v-model="formData.email"
                  type="email" 
                  placeholder="example@gmail.com"
                  class="w-full bg-gray-800 border border-emerald-600/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-600 transition"
                  required
                />
              </div>

              <!-- Trường Mật Khẩu (có nút hiện/ẩn) -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Mật Khẩu</label>
                <div class="relative">
                  <input 
                    v-model="formData.password"
                    :type="showPassword ? 'text' : 'password'" 
                    placeholder="••••••••"
                    class="w-full bg-gray-800 border border-emerald-600/30 rounded-lg px-4 py-2 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-600 transition"
                    required
                  />
                  <!-- Nút bật/tắt hiển thị mật khẩu -->
                  <button 
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-0 top-0 h-full px-4 flex items-center justify-center text-gray-400 hover:text-emerald-400 transition pointer-events-auto"
                  >
                    <Icon :name="showPassword ? 'heroicons-solid:eye-slash' : 'heroicons-solid:eye'" class="w-5 h-5" />
                  </button>
                </div>
              </div>

              <!-- Trường Xác Nhận Mật Khẩu (có nút hiện/ẩn) -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Xác Nhận Mật Khẩu</label>
                <div class="relative">
                  <input 
                    v-model="formData.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'" 
                    placeholder="••••••••"
                    class="w-full bg-gray-800 border border-emerald-600/30 rounded-lg px-4 py-2 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-600 transition"
                    required
                  />
                  <!-- Icon mắt: thay đổi theo showConfirmPassword -->
                  <button 
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute right-0 top-0 h-full px-4 flex items-center justify-center text-gray-400 hover:text-emerald-400 transition pointer-events-auto"
                  >
                    <Icon :name="showConfirmPassword ? 'heroicons-solid:eye-slash' : 'heroicons-solid:eye'" class="w-5 h-5" />
                  </button>
                </div>
              </div>

              <!-- Nút Đăng Ký -->
              <button 
                type="submit"
                class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg transition"
              >
                Đăng Ký
              </button>

              <!-- Link chuyển sang Đăng Nhập -->
              <p class="text-center text-gray-400 text-sm">
                Đã có tài khoản?
                <button 
                  type="button"
                  @click="toggleForm"
                  class="text-emerald-500 hover:text-emerald-400 font-semibold transition"
                >
                  Đăng nhập
                </button>
              </p>
            </form>
          </Transition>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* ========== SỰ KIỆN FADE (Nền mờ) ========== */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;  /* Từ trong suốt sang hiển thị (hoặc ngược lại) */
}

/* ========== SỰ KIỆN SLIDE (Modal) ========== */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);  /* Nhỏ lại và dịch lên */
}

/* ========== SỰ KIỆN FADE-SLIDE (Chuyển form) ========== */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(15px);  /* Form mới vào từ phải */
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-15px);  /* Form cũ ra sang trái */
}
</style>
