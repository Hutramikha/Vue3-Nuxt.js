# HƯỚNG DẪN CHỤP SCREENSHOT CHO DEMO KHANLIX

**Ngày lập:** 6 Tháng 4, 2026  
**Mục đích:** Hướng dẫn từng bước chụp ảnh các trang web để demo sản phẩm KHANLIX

---

## 📋 Danh Sách Trang & Features

Ứng dụng KHANLIX có **3 trang chính** + **6 tính năng chính**:

| # | Trang/Feature | URL | Ảnh Cần Chụp |
|---|---|---|---|
| 1 | Homepage (Danh Mục) | http://localhost:3000/ | 3 ảnh |
| 2 | Favorites (Danh Sách Yêu Thích) | http://localhost:3000/favorites | 2 ảnh |
| 3 | Movie Detail (Chi Tiết Phim) | http://localhost:3000/movies/1 | 2 ảnh |
| **TỔNG** | | | **7 ảnh** |

---

## TRANG 1: HOMEPAGE (http://localhost:3000/)

Homepage là trang quan trọng nhất, hiển thị 3 chế độ chính.

### Screenshot 1.1: Full Homepage + 5 Danh Mục (Default View)

**Mục đích:**
- Hiển thị giao diện mặc định
- Thấy tất cả 5 danh mục phim
- Thấy phân trang của từng danh mục
- Thấy MovieCard design

**Cách chụp:**
```
1. Mở http://localhost:3000/
2. Chờ trang load xong (thấy 5 danh mục)
3. Chụp toàn màn hình từ header đến footer
4. Tên file: 1.1_Homepage_Categories_Overview.png
5. Caption: "Hình 1.1: Trang chủ với 5 danh mục phim - 
   Phim Mới, Hot, Xem Nhiều, Trending, Hôm Nay"
```

**Khung ảnh:**
```
[Header Navigation Bar]
[Search, Danh Mục Dropdown]
[☐ Trending Hôm Nay | ← [5 phim] → |]
[☐ Phim Mới Cập Nhật | ← [5 phim] → |]
[☐ Phim Hot Hiện Tại | ← [5 phim] → |]
[☐ Phim Xem Nhiều | ← [5 phim] → |]
[☐ Phim Lẻ Mới | ← [5 phim] → |]
[Footer]
```

---

### Screenshot 1.2: Search Feature + Results

**Mục đích:**
- Chứng minh tính năng tìm kiếm hoạt động
- Thấy search input + autocomplete suggestions
- Thấy kết quả search (nhiều phim, phân trang)

**Cách chụp:**
```
1. Nhấp vào search input (top header)
2. Gõ từ khóa: "Avatar"
3. Thấy autocomplete gợi ý
4. Nhấn Enter hoặc "Tìm Kiếm"
5. Chuyển sang trang kết quả
6. Chụp toàn màn hình kết quả tìm kiếm
7. Tên file: 1.2_Search_Results_Avatar.png
8. Caption: "Hình 1.2: Kết quả tìm kiếm phim 'Avatar' - 
   Hiển thị 16 phim/trang với phân trang"
```

**Khung ảnh:**
```
[Header + Search Input (đã nhập "Avatar")]
[Autocomplete Suggestions]
-----------
[Kết quả tìm kiếm]
[Phim 1] [Phim 2] [Phim 3] [Phim 4]
[Phim 5] [Phim 6] [Phim 7] [Phim 8]
[← Trang 1 / 2 →]
[Footer]
```

---

### Screenshot 1.3: Filter Feature (Thể Loại + Năm)

**Mục đích:**
- Chứng minh tính năng lọc phim
- Thấy filter options (Genre + Year)
- Thấy kết quả sau lọc

**Cách chụp:**
```
1. Trong search/filter section, tìm Filter buttons
2. Chọn thể loại: "Hành Động"
3. Chọn năm: "2024"
4. Nhấp "Áp dụng" hoặc tự động filter
5. Chụp kết quả lọc
6. Tên file: 1.3_Filter_Genre_Year.png
7. Caption: "Hình 1.3: Lọc phim theo thể loại 
   'Hành Động' và năm '2024'"
```

**Khung ảnh:**
```
[Header]
[Filter Controls]
  Thể loại: [Hành Động ✓]
  Năm: [2024 ✓]
  [Xóa Bộ Lọc]
-----------
[Kết quả lọc]
[Phim 1] [Phim 2] [Phim 3] [Phim 4]
[← Trang 1 / 1 →]
[Footer]
```

---

## TRANG 2: FAVORITES (http://localhost:3000/favorites)

### Screenshot 2.1: Favorites Page (Có Phim Yêu Thích)

**Mục đích:**
- Chứng minh danh sách yêu thích hoạt động
- Thấy danh sách phim được mark yêu thích
- Thấy các nút hành động (Back, Clear All)

**Cách chụp:**
```
1. Trước tiên, thêm vài phim vào yêu thích:
   - Quay lại homepage (http://localhost:3000/)
   - Click heart icon trên 3-4 phim
   - Thấy heart đổi màu (đã yêu thích)
   
2. Sau đó, truy cập favorites:
   - Nhấp heart icon (top header) hoặc
   - Truy cập http://localhost:3000/favorites
   
3. Chụp toàn màn hình:
   - Thấy dòng "Danh Sách Yêu Thích (3 phim)"
   - Thấy 3-4 phim được yêu thích
   - Thấy nút "Clear All" + "Back Home"
   
4. Tên file: 2.1_Favorites_Page_With_Movies.png
5. Caption: "Hình 2.1: Trang danh sách phim yêu thích - 
   Hiển thị các phim đã đánh dấu"
```

**Khung ảnh:**
```
[Header]
[Danh Sách Yêu Thích (3 phim)]
[Nút: Clear All | Back Home]
-----------
[Phim 1 ❤] [Phim 2 ❤] [Phim 3 ❤]
[Clear All Confirmation Dialog]
[Footer]
```

---

### Screenshot 2.2: Favorites Empty State (Không Có Phim)

**Mục đích:**
- Chứng minh chế độ xóa toàn bộ hoạt động
- Thấy empty state (không có phim)
- Thấy pesan "Danh sách trống"

**Cách chụp:**
```
1. Từ screenshot 2.1, nhấp "Clear All"
2. Xác nhận xóa trong dialog: "Yes, Delete All"
3. Danh sách sẽ thành rỗng
4. Chụp empty state:
   - Thấy icon trống (hoặc message)
   - Thấy "No favorites yet" message
   - Thấy nút "Back Home"
   
5. Tên file: 2.2_Favorites_Empty_State.png
6. Caption: "Hình 2.2: Trạng thái rỗng danh sách yêu thích - 
   Sau khi xóa toàn bộ"
```

**Khung ảnh:**
```
[Header]
[Danh Sách Yêu Thích (0 phim)]
-----------
[Empty Icon / Message]
"Danh sách yêu thích của bạn đang trống"
[Back Home Button]
[Footer]
```

---

## TRANG 3: MOVIE DETAIL (http://localhost:3000/movies/1)

### Screenshot 3.1: Movie Detail Page (Full Layout)

**Mục đích:**
- Chứng minh trang chi tiết phim hoạt động
- Thấy tất cả thông tin: poster, title, rating, description
- Thấy video player / trailer preview
- Thấy nút yêu thích

**Cách chụp:**
```
1. Từ homepage hoặc favorites, click trên một phim
2. Hoặc truy cập trực tiếp: http://localhost:3000/movies/1
3. Chụp toàn màn hình chi tiết phim:
   - Header navigation
   - Left: Poster + Rating + Metadata
   - Right: Title + Description + Genres
   - Video player / Trailer preview
   - Heart button (yêu thích)
   
4. Tên file: 3.1_Movie_Detail_Full.png
5. Caption: "Hình 3.1: Trang chi tiết phim - 
   Poster, thông tin, rating, và video player"
```

**Khung ảnh:**
```
[Header]
-----------
[Poster (2:3)] | [Title: Lật Mặt 7]
                | Rating: 9.0/10
                | Year: 2024
                | Duration: 120 min
                | [❤ Yêu Thích]
                | 
                | [Description...]
                | Genres: [Action] [Drama]
-----------
[Video Player Preview / Trailer]
-----------
[Similar Movies Section]
[Movie 1] [Movie 2] [Movie 3]
[Footer]
```

---

### Screenshot 3.2: Heart/Favorite Interaction

**Mục đích:**
- Chứng minh toggle yêu thích hoạt động
- Thấy heart icon đổi trạng thái

**Cách chụp:**
```
1. Ở trang chi tiết (screenshot 3.1), tìm heart icon
2. Click heart icon:
   - Heart sẽ đổi màu (từ outline → filled)
   - Phim được thêm vào yêu thích
3. Click lại heart:
   - Heart về lại outline
   - Phim bị xóa khỏi yêu thích
4. Chụp khi heart ở trạng thái "favorite" (filled):
   
5. Tên file: 3.2_Movie_Detail_Favorite_Button.png
6. Caption: "Hình 3.2: Nút yêu thích trên trang chi tiết - 
   Bấm để thêm/xóa khỏi danh sách yêu thích"
```

**Khung ảnh:**
```
[Movie Title]
[Rating & Metadata]
[❤ (FILLED) Yêu Thích] ← Heart filled = đã yêu thích
[Description & Genres]
```

---

## TÍNH NĂNG KHÁC (Không Cần Chụp Riêng)

### Pagination
- Đã hiển thị trong screenshot 1.1, 1.2, 1.3
- Thấy nút "Trước" "Sau" giữa các trang

### Responsive Design
- Tùy chọn chụp trên di động (DevTools)
- Có thể chụp thêm 1 ảnh responsive layout

### Header Navigation
- Thấy trong tất cả screenshots (không cần riêng)

### Type Filter (Single/Series)
- Có thể add vào screenshot 1.3 nếu có filter option

---

## 📝 HƯỚNG DẪN CHỤP CHUNG

### Chuẩn Bị Trước

```
1. Khởi động app:
   npm run dev

2. Mở http://localhost:3000/
3. Mở DevTools (F12) để check responsive
4. Tắt DevTools cho ảnh cuối cùng (full screen)
```

### Khi Chụp Ảnh

```
Cách 1: Dùng Print Screen
- Nhấn Print Screen
- Mở Paint / Photoshop
- Paste + Save (PNG format)

Cách 2: Dùng Built-in Screenshot (Windows)
- Nhấn Windows Key + Shift + S
- Chọn vùng cần chụp
- Save tự động

Cách 3: Dùng Chrome DevTools
- F12 → 3 dots → Capture full page screenshot
```

### Tên File & Caption

**Format Tên File:**
```
[Số Trang].[Số Ảnh]_[Mô Tả Ngắn].png

Ví dụ:
1.1_Homepage_Categories_Overview.png
1.2_Search_Results_Avatar.png
2.1_Favorites_Page_With_Movies.png
```

**Format Caption (Viết Báo Cáo):**
```
Hình [Số]: [Mô Tả Chi Tiết Ảnh]

Ví dụ:
Hình 1.1: Trang chủ KHANLIX với 5 danh mục phim - 
hiển thị phân trang cho từng danh mục

Hình 2.1: Danh sách phim yêu thích với các bộ phim 
đã được người dùng đánh dấu
```

---

## 🎯 Tóm Lại Cần Chụp

| # | Trang | Feature | Tên File | Priority |
|---|-------|---------|----------|----------|
| 1.1 | Homepage | Danh mục | 1.1_Homepage_Categories_Overview.png | ⭐⭐⭐ |
| 1.2 | Homepage | Tìm kiếm | 1.2_Search_Results_Avatar.png | ⭐⭐⭐ |
| 1.3 | Homepage | Lọc phim | 1.3_Filter_Genre_Year.png | ⭐⭐⭐ |
| 2.1 | Favorites | Có phim | 2.1_Favorites_Page_With_Movies.png | ⭐⭐ |
| 2.2 | Favorites | Rỗng | 2.2_Favorites_Empty_State.png | ⭐⭐ |
| 3.1 | Detail | Full layout | 3.1_Movie_Detail_Full.png | ⭐⭐⭐ |
| 3.2 | Detail | Favorite btn | 3.2_Movie_Detail_Favorite_Button.png | ⭐⭐ |

**⭐⭐⭐ = Bắt buộc (Core features)**  
**⭐⭐ = Tùy chọn (Nice to have)**

---

## ✅ Checklist

```
Trước khi chụp:
☐ npm run dev đang chạy
☐ http://localhost:3000/ load thành công
☐ Tất cả tập tin ready (assets, data)

Khi chụp:
☐ Chụp đủ 7 ảnh chính (3 bắt buộc mức 1)
☐ Tên file theo format [số].[số]_[tên]
☐ Lưu format PNG (quality cao)
☐ Tảo folder để tập trung (demo_screenshots/)

Sau khi chụp:
☐ Review từng ảnh (sắc nét, đầy đủ UI)
☐ Tạo file captions.md liệt kê tất cả caption
☐ Sẵn sàng dán vào báo cáo
```

---

**Chúc bạn chụp ảnh demo thành công!** 📸
