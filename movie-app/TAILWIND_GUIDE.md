# 📚 Tailwind CSS - Hướng Dẫn Tham Khảo

> Tailwind CSS là framework utility-first: thay vì viết CSS truyền thống, bạn kết hợp các class có sẵn để tạo giao diện.

---

## 🎨 **1. LAYOUT & POSITIONING** (Bố Cục)

### Flexbox
| Class | CSS tương đương | Ý nghĩa |
|-------|-----------------|--------|
| `flex` | `display: flex;` | Kích hoạt flexbox |
| `flex-col` | `flex-direction: column;` | Sắp xếp theo chiều dọc |
| `flex-1` | `flex: 1;` | Chiếm hết không gian còn lại |
| `gap-2` | `gap: 8px;` | Khoảng cách giữa các phần tử (gap-1=4px, gap-2=8px, gap-4=16px) |
| `items-center` | `align-items: center;` | Căn giữa theo trục Y |
| `justify-between` | `justify-content: space-between;` | Phân bố: 2 đầu, giữa cách |
| `justify-center` | `justify-content: center;` | Căn giữa theo trục X |

### Grid
| Class | CSS tương đương | Ý nghĩa |
|-------|-----------------|--------|
| `grid` | `display: grid;` | Kích hoạt grid layout |
| `grid-cols-1` | `grid-template-columns: repeat(1, ...)` | 1 cột trên tất cả màn hình |
| `grid-cols-4` | `grid-template-columns: repeat(4, ...)` | 4 cột |
| `lg:grid-cols-5` | Responsive - 5 cột trên lg screen | Responsive grid |

**Ví dụ kết hợp:**
```html
<!-- Responsive grid: 1 cột mobile, 2 tablet, 4 desktop -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  <!-- các phần tử -->
</div>
```

---

## 🎨 **2. SPACING** (Khoảng Cách)

### Margin (Khoảng cách ngoài)
| Class | Giá trị | Ý nghĩa |
|-------|--------|--------|
| `m-4` | `margin: 16px;` | Cả 4 phía |
| `mb-6` | `margin-bottom: 24px;` | Phía dưới |
| `mt-3` | `margin-top: 12px;` | Phía trên |
| `mx-auto` | `margin: 0 auto;` | Căn giữa ngang |
| `-translate-y-1/2` | `transform: translateY(-50%);` | Dịch lên 50% |
| `-translate-x-1/2` | `transform: translateX(-50%);` | Dịch trái 50% |

### Padding (Khoảng cách trong)
| Class | Giá trị | Ý nghĩa |
|-------|--------|--------|
| `p-4` | `padding: 16px;` | Cả 4 phía |
| `px-3` | `padding-left/right: 12px;` | Trái-phải |
| `py-2` | `padding-top/bottom: 8px;` | Trên-dưới |

**Quy tắc khoảng cách Tailwind:**
- `1` = 4px, `2` = 8px, `3` = 12px, `4` = 16px, `6` = 24px, `8` = 32px

---

## 🌈 **3. MÀU SẮC (Colors)**

### Background
| Class | Cách dùng | Ý nghĩa |
|-------|----------|--------|
| `bg-black` | `background-color: black;` | Nền đen |
| `bg-white` | `background-color: white;` | Nền trắng |
| `bg-gray-800` | `background-color: #1f2937;` | Nền xám đậm |
| `bg-emerald-600` | `background-color: #059669;` | Nền xanh lá (chủ yếu) |
| `bg-emerald-600/20` | `background-color: rgba(5, 150, 105, 0.2);` | Nền xanh lá 20% opacity |
| `hover:bg-emerald-700` | Hover effect | Đổi nền khi hover |

### Text
| Class | Ý nghĩa |
|-------|--------|
| `text-white` | Chữ màu trắng |
| `text-gray-400` | Chữ xám nhạt |
| `text-emerald-400` | Chữ xanh lá nhạt |
| `hover:text-emerald-500` | Hover đổi chữ |

### Border
| Class | Ý nghĩa |
|-------|--------|
| `border` | Đường viền 1px |
| `border-emerald-600/30` | Viền xanh lá, 30% opacity |
| `rounded-lg` | Bo góc (lg = 8px) |
| `rounded-full` | Bo tròn hoàn toàn |

**Giải thích opacity (`/XX`):**
- `emerald-600/20` = Xanh 20% (nhạt, trong suốt)
- `emerald-600/50` = Xanh 50% (trung bình)
- `emerald-600/80` = Xanh 80% (đậm)

---

## 📏 **4. KÍCH THƯỚC (Sizing)**

### Width & Height
| Class | Giá trị | Ý nghĩa |
|-------|--------|--------|
| `w-full` | `width: 100%;` | Toàn bộ chiều rộng |
| `w-20` | `width: 80px;` | 80px |
| `h-full` | `height: 100%;` | Toàn bộ chiều cao |
| `h-96` | `height: 384px;` | 384px |
| `min-h-screen` | `min-height: 100vh;` | Ít nhất 1 màn hình |
| `aspect-[2/3]` | `aspect-ratio: 2/3;` | Tỷ lệ 2:3 (poster phim) |

---

## ✨ **5. EFFECTS & ANIMATION**

### Shadow
| Class | Ý nghĩa |
|-------|--------|
| `shadow-lg` | Bóng đổ lớn |
| `shadow-2xl` | Bóng đổ rất lớn |
| `hover:shadow-xl` | Bóng lớn khi hover |
| `shadow-emerald-500/50` | Bóng xanh 50% opacity |

### Opacity & Visibility
| Class | Ý nghĩa |
|-------|--------|
| `opacity-0` | Ẩn hoàn toàn (vẫn chiếm chỗ) |
| `opacity-20` | 20% mờ |
| `opacity-50` | 50% mờ |
| `opacity-100` | Hoàn toàn rõ |
| `hidden` | Ẩn hoàn toàn (không chiếm chỗ) |

### Transitions & Animations
| Class | Ý nghĩa |
|-------|--------|
| `transition` | Hiệu ứng mịn khi đổi màu/size |
| `transition-all` | Tất cả thuộc tính có hiệu ứng |
| `duration-300` | Thời gian 300ms |
| `ease` | Chuyển động mượt |
| `scale-105` | Phóng to 105% |
| `hover:scale-105` | Phóng to khi hover |
| `transform` | Kích hoạt transform |

**Ví dụ button hiệu ứng:**
```html
<button class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 transition transform hover:scale-105">
  Nút
</button>
```

### Animation
| Class | Ý nghĩa |
|-------|--------|
| `animate-pulse` | Nhấp nháy |
| `animate-bounce` | Nảy lên-xuống |
| `animate-spin` | Quay tròn |

---

## 🎭 **6. FLEX CON TRỎ & CURSOR**

| Class | Ý nghĩa |
|-------|--------|
| `cursor-pointer` | Con trỏ thay đổi khi hover (tay) |
| `cursor-not-allowed` | Con trỏ "cấm" (disabled) |
| `pointer-events-none` | Không thể click vào element |

---

## 📱 **7. RESPONSIVE DESIGN (Thiết kế Đáp Ứng)**

Tailwind dùng breakpoints để responsive:

| Class | Kích thước | Ý nghĩa |
|-------|-----------|--------|
| (không prefix) | 0px+ | Mobile (mặc định) |
| `sm:` | 640px+ | Smartphone ngang, tablet nhỏ |
| `md:` | 768px+ | Tablet |
| `lg:` | 1024px+ | Desktop nhỏ |
| `xl:` | 1280px+ | Desktop |
| `2xl:` | 1536px+ | Desktop lớn |

**Ví dụ:**
```html
<!-- Mobile: 1 cột, Tablet: 2 cột, Desktop: 4 cột -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
  ...
</div>

<!-- Ẩn trên mobile, hiển thị trên desktop -->
<div class="hidden lg:flex">
  ...
</div>
```

---

## 📌 **8. DISPLAY & VISIBILITY**

| Class | Ý nghĩa |
|-------|--------|
| `block` | `display: block;` |
| `flex` | `display: flex;` |
| `grid` | `display: grid;` |
| `inline` | `display: inline;` |
| `hidden` | Ẩn (không hiển thị, không chiếm chỗ) |
| `visible` | Hiển thị |
| `overflow-hidden` | Cắt bỏ nội dung thừa |
| `overflow-auto` | Cuộn nếu thừa nội dung |

**Display Responsive:**
```html
<!-- Ẩn trên mobile, hiển thị flex trên lg screen -->
<div class="hidden lg:flex">...</div>

<!-- Ẩn trên sm, hiển thị block trên md -->
<div class="hidden md:block">...</div>
```

---

## 🔡 **9. TEXT & TYPOGRAPHY**

| Class | Ý nghĩa |
|-------|--------|
| `text-xs` | Chữ rất nhỏ (12px) |
| `text-sm` | Chữ nhỏ (14px) |
| `text-base` | Chữ bình thường (16px) |
| `text-lg` | Chữ lớn (18px) |
| `text-4xl` | Chữ rất lớn (36px) |
| `font-light` | Chữ mỏng |
| `font-normal` | Chữ bình thường |
| `font-semibold` | Chữ đậm (600) |
| `font-bold` | Chữ rất đậm (700) |
| `uppercase` | CHỮ HOA |
| `lowercase` | chữ thường |
| `line-clamp-2` | Giới hạn 2 dòng, thêm "..." |
| `tracking-tighter` | Khoảng cách chữ nhỏ |

---

## 🎯 **10. POSITION & ABSOLUTE**

| Class | Ý nghĩa |
|-------|--------|
| `relative` | `position: relative;` - Tham chiếu bố cục tương đối |
| `absolute` | `position: absolute;` - Tuyệt đối trong parent relative |
| `fixed` | `position: fixed;` - Cố định trên màn hình |
| `sticky` | `position: sticky;` - Dính khi scroll |
| `top-0` | `top: 0;` - Cạnh trên |
| `right-4` | `right: 16px;` - Cạnh phải |
| `bottom-4` | `bottom: 16px;` - Cạnh dưới |
| `left-1/2` | `left: 50%;` - Giữa ngang |
| `inset-0` | Cạnh trên/phải/dưới/trái = 0 |
| `z-50` | `z-index: 50;` - Tầng cao |
| `z-10` | `z-index: 10;` - Tầng thấp |

**Ví dụ absolute + transform căn giữa:**
```html
<!-- Nút X đặt góc phải trên của card, căn giữa theo Y -->
<div class="relative">
  <button class="absolute right-4 top-1/2 -translate-y-1/2">X</button>
</div>
```

---

## 🖼️ **11. OBJECT-FIT (Ảnh/Video)**

| Class | Ý nghĩa |
|-------|--------|
| `object-cover` | Ảnh phủ kín khung (có cắt) |
| `object-contain` | Ảnh vừa khung (không cắt, có trắng) |
| `object-fill` | Ảnh kéo dãn vừa khung |

---

## 🌈 **12. GRADIENT (Dải Độc Lập)**

| Class | Ý nghĩa |
|-------|--------|
| `bg-gradient-to-r` | Gradient từ trái sang phải |
| `bg-gradient-to-b` | Gradient từ trên xuống dưới |
| `bg-gradient-to-br` | Gradient từ trên-trái → dưới-phải |
| `from-emerald-600` | Màu bắt đầu (trái/trên) |
| `to-emerald-400` | Màu kết thúc (phải/dưới) |
| `via-emerald-500` | Màu giữa (tùy chọn) |

**Ví dụ:**
```html
<!-- Gradient xanh từ đậm (trái) → nhạt (phải) -->
<div class="bg-gradient-to-r from-emerald-600 to-emerald-400">
  ...
</div>

<!-- Gradient từ trên xuống -->
<div class="bg-gradient-to-b from-black via-gray-950 to-gray-900">
  ...
</div>
```

---

## 📦 **13. BORDER RADIUS (Bo Góc)**

| Class | Giá trị |
|-------|--------|
| `rounded-none` | 0px |
| `rounded-sm` | 2px |
| `rounded` | 4px |
| `rounded-md` | 6px |
| `rounded-lg` | 8px |
| `rounded-2xl` | 16px |
| `rounded-full` | 50% (tròn hoàn toàn) |

---

## 🚀 **CÁC CLASS THƯỜNG XÀY RA TRONG DỰ ÁN**

### Button
```html
<!-- Solid button (filled) -->
<button class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition">
  Nút
</button>

<!-- Border button (outline) -->
<button class="px-4 py-2 border border-emerald-600 text-emerald-600 hover:bg-emerald-600/10 rounded-lg font-medium transition">
  Nút
</button>

<!-- Disabled button -->
<button disabled class="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed">
  Nút
</button>
```

### Card/Box
```html
<div class="p-6 rounded-lg bg-gray-900 border border-emerald-600/30 shadow-lg">
  <!-- Nội dung -->
</div>
```

### Grid Responsive
```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
  <!-- Mỗi item: Movie Card -->
</div>
```

### Header Sticky
```html
<header class="sticky top-0 z-50 bg-gradient-to-b from-black via-gray-950 to-black backdrop-blur-md border-b border-emerald-600/30">
  <!-- Logo + Menu -->
</header>
```

### Absolute Overlay
```html
<div class="relative group">
  <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
    <!-- Overlay content -->
  </div>
</div>
```

---

## 💡 **MẸO NHỚ TAILWIND**

| Mẹo | Ví dụ |
|-----|-------|
| **Responsive-first** | Viết mobile trước, rồi thêm `lg:`, `md:` |
| **Composition** | Kết hợp nhiều class (flex, gap-4, items-center, ...) |
| **Opacity** | Dùng `/XX` để điều chỉnh opacity (bg-emerald-600/20) |
| **Hover** | Thêm `hover:` hoặc `group-hover:` để effect |
| **Negative** | Dùng `-` cho negative values (mt-(-4), -translate-y-1/2) |
| **Arbitrary** | Dùng `[]` cho giá trị custom (w-[500px], text-[#fff]) |

---

## 📖 **TÀI LIỆU CHÍNH THỨC**

- **Tailwind Docs**: https://tailwindcss.com/docs
- **Color Palette**: https://tailwindcss.com/docs/customizing-colors
- **Components**: https://tailwindui.com/ (trả phí nhưng hữu ích)

---

**Happy Styling! 🎨**
