# BÁO CÁO TRIỂN KHAI VÀ DEMO KHANLIX

**Ngày lập báo cáo:** 28 Tháng 3, 2026  
**Dự án:** KHANLIX - Movie Application  
**Phiên bản:** 1.0.0  
**Trạng thái:** Sẵn sàng triển khai

---

## GIỚI THIỆU

Chương này cung cấp hướng dẫn toàn diện về cách cài đặt, chạy, và triển khai ứng dụng KHANLIX. Bạn sẽ tìm hiểu các yêu cầu hệ thống cần thiết, quy trình cài đặt từng bước, cách chạy ứng dụng ở chế độ phát triển và sản xuất, cùng với hướng dẫn chi tiết demo các tính năng chính và cách kiểm thử ứng dụng. Cuối cùng, chương cũng bao gồm hướng dẫn triển khai lên các nền tảng máy chủ khác nhau để đưa ứng dụng vào sử dụng để sản xuất.

---

## YÊU CẦU HỆ THỐNG

Để triển khai và chạy dự án KHANLIX, máy tính cần đáp ứng các yêu cầu tối thiểu sau:

- **Node.js:** phiên bản 18.0.0 trở lên
- **npm:** phiên bản 9.0.0 trở lên
- **Hệ điều hành:** Windows, macOS, hoặc Linux (bản cập nhật mới nhất)
- **RAM:** tối thiểu 4GB
- **Dung lượng ổ đĩa:** khoảng 500MB để cài đặt dependencies
- **Git:** nếu bạn muốn clone dự án từ kho tài nguyên
- **Trình duyệt web:** Chrome, Firefox, Safari, hoặc Edge (bản mới nhất)

---

## CÁCH CÀI ĐẶT VÀ TRIỂN KHAI

Quá trình cài đặt và triển khai bao gồm bốn bước chính. Quá trình này nhằm đảm bảo rằng tất cả các phụ thuộc (dependencies) của dự án được cài đặt đúng cách, không có lỗi cú pháp, và ứng dụng sẵn sàng để chạy trên máy tính của bạn hoặc triển khai lên máy chủ.

### Bước 1: Clone Dự Án

Bước đầu tiên là lấy mã nguồn của dự án từ kho tài nguyên. Nếu dự án được lưu trữ trên GitHub hoặc GitLab, bạn sử dụng lệnh `git clone` để kéo toàn bộ dự án về máy tính của mình. Git là một hệ thống quản lý phiên bản mã nguồn, cho phép bạn lấy mã mới nhất của dự án.

**Nếu clone từ GitHub:**
```
cd d:\Github\Vue3-Nuxt.js
git clone <repo-url>
cd movie-app
```

**Hoặc nếu bạn đã có thư mục dự án trên máy tính:**
```
cd d:\Github\Vue3-Nuxt.js\movie-app
```

Sau bước này, bạn đã có tất cả các tệp mã nguồn của dự án trong thư mục `movie-app`.

### Bước 2: Cài Đặt Các Phụ Thuộc (Dependencies)

Một khi bạn đã vào thư mục dự án, bước tiếp theo là cài đặt tất cả các thư viện và phụ thuộc cần thiết. Các phụ thuộc này được liệt kê trong tệp `package.json` của dự án. Lệnh `npm install` sẽ tìm tệp `package.json`, đọc danh sách các phụ thuộc, và tải xuống từng cái từ npm registry (kho lưu trữ thư viện JavaScript).

```
npm install
```

**Quá trình này sẽ:**
- Tải xuống tất cả các thư viện cần thiết (Vue 3, Nuxt 4, TypeScript, Tailwind CSS, Pinia, v.v.)
- Tạo thư mục `node_modules` chứa tất cả các thư viện đã tải
- Tạo tệp `package-lock.json` để đảm bảo phiên bản thư viện nhất quán

**Thời gian:** khoảng 2-5 phút (tùy thuộc tốc độ kết nối internet của bạn)

**Nếu gặp lỗi:**
- Kiểm tra kết nối internet của bạn
- Thử xóa thư mục `node_modules` và tệp `package-lock.json`, rồi chạy `npm install` lại
- Đảm bảo phiên bản Node.js của bạn là 18.0.0 trở lên

### Bước 3: Xác Minh Cài Đặt

Vì dự án yêu cầu Node.js và npm cụ thể, bạn cần xác minh rằng các công cụ này đã được cài đặt với phiên bản đúng. Chạy các lệnh sau để kiểm tra:

```
npm --version
node --version
```

Bạn sẽ thấy kết quả hiển thị phiên bản của npm và Node.js. Ví dụ:
```
v9.6.7  (phiên bản npm)
v18.17.1 (phiên bản Node.js)
```

**Yêu cầu tối thiểu:**
- Node.js phải là 18.0.0 hoặc cao hơn
- npm phải là 9.0.0 hoặc cao hơn

Nếu các phiên bản thấp hơn, bạn cần cập nhật Node.js. Hãy tải xuống phiên bản mới nhất từ https://nodejs.org/ và cài đặt.

### Bước 4: Kiểm Tra Build Sản Xuất

Trước khi triển khai lên máy chủ thực tế, rất quan trọng phải kiểm tra xem mã có lỗi hay không bằng cách xây dựng (build) phiên bản sản xuất. Lệnh `npm run build` sẽ:

- Biên dịch tất cả các tệp Vue thành JavaScript
- Biên dịch tất cả các tệp TypeScript thành JavaScript
- Nén và tối ưu hóa tất cả các tệp CSS và JavaScript
- Tạo thư mục `.output` chứa phiên bản sản xuất cuối cùng

```
npm run build
```

**Kết quả mong đợi:**
```
✓ Build complete!
Total size: 27.4 MB (10.4 MB gzip)
```

Nếu build thành công, ứng dụng sẵn sàng để triển khai lên máy chủ hoặc sử dụng locally. Nếu có lỗi, bạn sẽ thấy thông báo lỗi chi tiết. Hãy đọc thông báo lỗi và sửa lỗi trong mã trước khi build lại.

---

## CÁCH CHẠY DỰ ÁN

Có hai cách khác nhau để chạy ứng dụng tùy thuộc vào mục đích của bạn. Mỗi cách có những ưu điểm riêng và được sử dụng trong các tình huống khác nhau.

### Chế Độ Phát Triển (Development)

**Khi nào sử dụng?** Sử dụng chế độ này khi bạn đang viết code, kiểm thử các tính năng, hoặc debug lỗi. Đây là chế độ tốc độ nhanh nhất cho quá trình phát triển.

**Lệnh chạy:**
```
npm run dev
```

**Kết quả:**
```
Local:    http://localhost:3000/
```

**Đặc điểm chế độ này:**
- Ứng dụng khởi động ngay lập tức (không cần build trước)
- **Live reload:** Khi bạn lưu thay đổi trong code, trình duyệt tự động tải lại trang để hiển thị thay đổi mới nhất
- Kích thước tệp lớn hơn vì mã không được nén gọn
- Chứa source maps giúp bạn dễ dàng debug code (xem code gốc thay vì code được biên dịch)
- Thích hợp cho việc phát triển nhanh chóng
- Chỉ chạy trên máy tính của bạn (localhost), không thể truy cập từ máy khác

**Cách sử dụng:**
1. Chạy lệnh `npm run dev`
2. Đợi cho đến khi thấy thông báo "Local: http://localhost:3000/"
3. Mở trình duyệt web (Chrome, Firefox, Safari, Edge)
4. Truy cập địa chỉ http://localhost:3000
5. Ứng dụng sẽ tải và hiển thị
6. Bất kỳ thay đổi nào bạn thực hiện trong code sẽ tự động cập nhật trong trình duyệt
7. Để dừng chế độ phát triển, nhấn `Ctrl+C` trong terminal

### Chế Độ Sản Xuất (Production)

**Khi nào sử dụng?** Sử dụng chế độ này khi bạn cần kiểm tra xem ứng dụng sẽ hoạt động như thế nào trên máy chủ thực. Đây là chế độ giống hệt như khi ứng dụng triển khai lên máy chủ sản xuất.

**Lệnh chạy:**
```
npm run build
npm run preview
```

**Quá trình của các lệnh này:**

1. **`npm run build`:** Xây dựng phiên bản sản xuất
   - Biên dịch và tối ưu hóa toàn bộ mã
   - Nén CSS, JavaScript, và các assets khác
   - Tạo thư mục `.output` chứa phiên bản sản xuất
   - Quá trình này mất 1-2 phút

2. **`npm run preview`:** Chạy phiên bản sản xuất trên máy tính
   - Khởi động máy chủ chạy phiên bản đã được build
   - Hiển thị URL: http://localhost:3000

**Đặc điểm chế độ này:**
- Mã được nén gọn và tối ưu hóa (kích thước nhỏ hơn 60-70% so với chế độ phát triển)
- Không có live reload - phải khởi động lại server để thấy thay đổi
- Không có source maps - khó debug hơn chế độ phát triển
- Giống hệt cách ứng dụng chạy trên máy chủ sản xuất thực
- Giúp bạn kiểm tra hiệu suất và tính ổn định của ứng dụng

**Cách sử dụng:**
1. Chạy `npm run build` (đợi build hoàn tất - mất 1-2 phút)
2. Chạy `npm run preview`
3. Đợi cho đến khi thấy thông báo "Local: http://localhost:3000/"
4. Mở trình duyệt web và truy cập http://localhost:3000
5. Kiểm tra tất cả các tính năng hoạt động bình thường
6. Kiểm tra tốc độ tải trang (nó sẽ nhanh hơn ở chế độ này)
7. Để dừng, nhấn `Ctrl+C` trong terminal

**So sánh hai chế độ:**

| Khía cạnh | Phát Triển (dev) | Sản Xuất (build + preview) |
|-----------|------------------|----------------------------|
| Tốc độ khởi động | Rất nhanh | Chậm (cần build) |
| Live reload | ✓ Có | ✗ Không |
| Kích thước tệp | Lớn | Nhỏ (tối ưu hóa) |
| Dễ debug | ✓ Có source maps | ✗ Khó hơn |
| Hiệu suất | Chậm hơn | Nhanh hơn |
| Dùng cho | Phát triển code | Kiểm tra trước triển khai |












---

## HƯỚNG DẪN DEMO CÁC TÍNH NĂNG

Ứng dụng KHANLIX bao gồm sáu tính năng chính. Trình bày dưới đây là hướng dẫn chi tiết cho từng tính năng để giúp bạn hiểu cách ứng dụng hoạt động và cách kiểm thử các chức năng.

### Tính Năng 1: Duyệt Các Danh Mục Phim

Tính năng đầu tiên cho phép người dùng duyệt qua các danh mục phim được sắp xếp sẵn. Khi truy cập trang chủ, bạn sẽ thấy năm danh mục phim khác nhau. Mỗi danh mục chứa 10 bộ phim, nhưng chỉ 5 bộ được hiển thị trên mỗi trang. Bạn có thể điều hướng bằng cách nhấp vào nút "Trước" và "Sau" ở dưới mỗi danh mục.

**Danh mục bao gồm:**
- Trending Hôm Nay (Phim ID 31-40)
- Phim Mới Cập Nhật (Phim ID 1-10)
- Phim Hot Hiện Tại (Phim ID 11-20)
- Phim Được Xem Nhiều (Phim ID 21-30)
- Phim Lẻ Mới Ra Mắt (Phim ID 41-50)

**Cách kiểm thử:**
```
1. Mở http://localhost:3000/
2. Quan sát năm danh mục phim
3. Nhấp vào nút "Sau" để xem trang tiếp theo
4. Nhấp vào nút "Trước" để quay lại trang trước
5. Xác minh rằng đúng 5 phim được hiển thị trên mỗi trang
```

### Tính Năng 2: Lọc Theo Danh Mục

Tính năng thứ hai cung cấp cách khác để xem các bộ phim. Người dùng có thể chọn một danh mục cụ thể bằng cách nhấp vào một nút lọc. Khi đó, ứng dụng sẽ hiển thị tất cả 10 bộ phim trong danh mục đó, với phân trang 16 bộ phim trên mỗi trang.

**Cách kiểm thử:**
```
1. Trên trang chủ, tìm năm nút lọc ở phía trên
2. Nhấp vào một nút (ví dụ "Phim Hot")
3. Xác minh rằng chỉ các phim từ danh mục được chọn được hiển thị
4. Kiểm tra phân trang
5. Nhấp vào "Quay Lại" để trở lại chế độ danh mục
```

### Tính Năng 3: Tìm Kiếm Phim

Tính năng tìm kiếm cho phép người dùng tìm các bộ phim dựa trên tiêu đề hoặc thể loại. Người dùng nhập từ khóa vào thanh tìm kiếm, và ứng dụng sẽ trả về tất cả các bộ phim phù hợp với tiêu đề hoặc thể loại được nhập.

**Cách kiểm thử:**
```
1. Tìm thanh tìm kiếm ở phía trên trang
2. Nhập tên phim (ví dụ "Avatar")
3. Nhấp nút "Tìm Kiếm" hoặc nhấn Enter
4. Xác minh kết quả trả về là chính xác
5. Thử tìm kiếm bằng thể loại (ví dụ "Hành Động")
6. Kiểm tra phân trang với 16 kết quả trên mỗi trang
```

### Tính Năng 4: Lọc Theo Thể Loại và Năm

Tính năng lọc nâng cao cho phép người dùng lọc các bộ phim dựa trên thể loại và năm phát hành. Người dùng có thể chọn một hoặc nhiều thể loại, rồi chọn một hoặc nhiều năm, và ứng dụng sẽ trả về phim phù hợp với cả hai tiêu chí.

**Cách kiểm thử:**
```
1. Tìm phần lọc trên trang (các dropdown cho thể loại và năm)
2. Chọn một thể loại (ví dụ "Hành Động")
3. Chọn một năm (ví dụ "2024")
4. Quan sát kết quả - chỉ phim phù hợp được hiển thị
5. Thử chọn nhiều thể loại hoặc năm
6. Kiểm tra phân trang
7. Nhấp "Xóa Bộ Lọc" để reset
```

### Tính Năng 5: Lọc Theo Loại Phim

Ứng dụng có khả năng phân biệt giữa phim lẻ (single films) và phim bộ (series). Có 25 phim lẻ và 25 phim bộ trong ứng dụng.

**Cách kiểm thử:**
```
1. Tìm bộ chọn loại phim (Phim Lẻ / Phim Bộ)
2. Chọn "Phim Lẻ"
3. Xác minh rằng 25 phim lẻ được hiển thị
4. Kiểm tra phân trang (16 phim trên mỗi trang)
5. Chọn "Phim Bộ"
6. Xác minh rằng 25 phim bộ được hiển thị
```

### Tính Năng 6: Danh Sách Phim Yêu Thích

Tính năng cuối cùng cho phép người dùng đánh dấu các bộ phim yêu thích. Người dùng nhấp vào biểu tượng trái tim trên mỗi card phim để thêm hoặc xóa phim khỏi danh sách yêu thích. Dữ liệu được lưu trong localStorage của trình duyệt.

**Cách kiểm thử:**
```
1. Tìm biểu tượng trái tim trên một card phim
2. Nhấp vào nó - trái tim sẽ đổi màu (thêm vào yêu thích)
3. Tải lại trang (F5)
4. Xác minh rằng phim vẫn trong danh sách yêu thích
5. Nhấp lại trái tim để xóa khỏi yêu thích
6. Tải lại trang để xác minh nó đã bị xóa
```

---

## KIỂM THỬ CÁC CHỨC NĂNG

Để kiểm thử toàn bộ tính năng của ứng dụng, hãy thực hiện các bước sau:

**Kiểm thử danh mục:**
```
1. Duyệt qua tất cả năm danh mục
2. Sử dụng phân trang để xem tất cả các trang
3. Xác minh số lượng phim hiển thị là chính xác (5 phim trên mỗi trang)
```

**Kiểm thử tìm kiếm:**
```
1. Nhập tên phim nổi tiếng (ví dụ "Avatar")
2. Xác minh kết quả trả về là chính xác
3. Thử tìm kiếm với thể loại
4. Thử tìm kiếm với từ khóa không tồn tại
5. Xác minh thông báo "Không tìm thấy" hiển thị đúng
```

**Kiểm thử lọc:**
```
1. Thử lọc bằng các thể loại khác nhau
2. Thử lọc bằng các năm khác nhau
3. Thử kết hợp cả thể loại và năm
4. Xác minh các kết quả trả về chính xác
5. Kiểm tra phân trang hoạt động đúng
```

**Kiểm thử responsive design:**
```
1. Mở ứng dụng trên máy tính để bàn (1920x1080)
2. Thay đổi kích thước cửa sổ trình duyệt
3. Mở DevTools (F12) và chọn chế độ di động
4. Kiểm tra giao diện trên các kích thước: iPhone, iPad, Android
5. Xác minh tất cả chức năng hoạt động trên di động
```

---

## CÁC CÔNG CỤ KIỂM THỬ

### Sử Dụng Console

Console của trình duyệt giúp kiểm thử các chức năng phía client:

```
Nhấn F12 hoặc Ctrl+Shift+I để mở DevTools
Chọn tab "Console"
Xem các log, lỗi, và cảnh báo
Thử chạy lệnh JavaScript nếu cần
```

### Sử Dụng Tab Network

Tab Network cho phép bạn xem tất cả các request HTTP:

```
Chọn tab "Network" trong DevTools
Tải lại trang (F5)
Xem tất cả các request API
Kiểm tra status code (200 = thành công)
Xem thời gian tải của mỗi tệp
```

### Sử Dụng Tab Application

Tab Application cho phép kiểm tra dữ liệu lưu trữ:

```
Chọn tab "Application" trong DevTools
Chọn "Local Storage"
Tìm khóa "favorites"
Xem dữ liệu JSON được lưu
Xác minh dữ liệu được cập nhật chính xác
```

---

## TRIỂN KHAI LÊN MÁY CHỦ

### Triển Khai Lên Vercel

Vercel là nền tảng phổ biến cho các ứng dụng Nuxt:

```
1. Đẩy mã lên kho GitHub
2. Đăng ký tài khoản Vercel (vercel.com)
3. Kết nối kho GitHub với Vercel
4. Vercel tự động phát hiện cài đặt Nuxt
5. Nhấp "Deploy" để triển khai
6. Sau vài phút, ứng dụng sẽ có sẵn ở URL công khai
```

### Triển Khai Lên Netlify

Netlify cũng hỗ trợ các ứng dụng Nuxt:

```
1. Đẩy mã lên GitHub
2. Đăng ký tài khoản Netlify (netlify.com)
3. Kết nối kho GitHub
4. Cài đặt lệnh build: npm run build
5. Cài đặt thư mục publish: .output/public
6. Nhấp "Deploy"
7. Ứng dụng sẽ sẵn sàng trong vài phút
```

### Triển Khai Lên Máy Chủ Tùy Chỉnh (VPS)

Nếu bạn muốn triển khai trên máy chủ của mình:

```
1. Xây dựng phiên bản sản xuất: npm run build
2. Sao chép thư mục .output lên máy chủ
3. Cài đặt Node.js trên máy chủ
4. Chạy ứng dụng: node .output/server/index.mjs
5. (Nâng cao) Sử dụng PM2 để quản lý quá trình: pm2 start .output/server/index.mjs
6. (Nâng cao) Cấu hình Nginx làm reverse proxy
7. (Nâng cao) Thiết lập SSL certificate
```

---

## KẾT LUẬN

Báo cáo này cung cấp hướng dẫn toàn diện để triển khai, chạy, và kiểm thử ứng dụng KHANLIX. Bằng cách tuân theo các bước được nêu ra, bạn sẽ có thể đưa ứng dụng vào sản xuất thành công và cung cấp trải nghiệm mượt mà cho người dùng. Nếu gặp vấn đề trong quá trình triển khai hoặc kiểm thử, hãy kiểm tra console trong DevTools để tìm thông báo lỗi chi tiết. Ngoài ra, đảm bảo rằng tất cả các phụ thuộc được cài đặt đúng cách và phiên bản Node.js của bạn đủ cao để chạy dự án.



Nếu bạn muốn kiểm tra cách ứng dụng hoạt động trong môi trường sản xuất trước khi triển khai, bạn có thể chạy lệnh npm run build để xây dựng phiên bản sản xuất. Sau đó, chạy lệnh npm run preview để xem phiên bản được xây dựng trên máy cục bộ. Điều này cho phép bạn xác minh rằng tất cả các tính năng hoạt động chính xác mà không có các công cụ phát triển.

---

## HƯỚNG DẪN DEMO CÁC TÍNH NĂNG

### Tính Năng Thứ Nhất: Duyệt Các Danh Mục Phim

Tính năng đầu tiên của ứng dụng cho phép người dùng duyệt qua các danh mục phim được sắp xếp sẵn. Khi bạn truy cập trang chủ, bạn sẽ nhìn thấy năm danh mục phim khác nhau bao gồm "Trending Hôm Nay", "Phim Mới Cập Nhật", "Phim Hot Hiện Tại", "Phim Được Xem Nhiều", và "Phim Lẻ Mới Ra Mắt". Mỗi danh mục chứa 10 bộ phim, và chỉ 5 bộ được hiển thị trên mỗi trang. Người dùng có thể điều hướng giữa các trang bằng cách nhấp vào các nút "Trước" và "Sau" ở phía dưới mỗi danh mục. Khi nhấp vào một bộ phim cụ thể, một card sẽ hiển thị thông tin cơ bản bao gồm tiêu đề, đánh giá, năm phát hành, và thể loại.

### Tính Năng Thứ Hai: Lọc Theo Danh Mục

Tính năng thứ hai cung cấp một cách khác để xem các bộ phim. Thay vì xem tất cả các danh mục cùng một lúc, người dùng có thể chọn một danh mục cụ thể bằng cách nhấp vào một trong năm nút lọc được đặt ở phía trên cùng của bộ sưu tập phim. Khi một danh mục được chọn, ứng dụng sẽ hiển thị tất cả 10 bộ phim trong danh mục đó, với phân trang 16 bộ phim trên mỗi trang. Người dùng có thể quay lại chế độ xem danh mục bằng cách nhấp vào nút "Quay Lại" hoặc chọn một danh mục khác.

### Tính Năng Thứ Ba: Tìm Kiếm Phim

Tính năng tìm kiếm cho phép người dùng tìm các bộ phim dựa trên tiêu đề hoặc thể loại. Người dùng có thể nhập một từ khóa vào thanh tìm kiếm được đặt ở phía trên cùng của trang, và ứng dụng sẽ trả về tất cả các bộ phim phù hợp với tiêu đề hoặc thể loại được nhập. Kết quả được hiển thị với phân trang 16 bộ phim trên mỗi trang, cho phép người dùng dễ dàng duyệt qua nhiều kết quả nếu cần.

### Tính Năng Thứ Tư: Lọc Theo Thể Loại và Năm

Tính năng lọc nâng cao cho phép người dùng lọc các bộ phim dựa trên thể loại và năm phát hành. Người dùng có thể chọn một hoặc nhiều thể loại từ danh sách, sau đó chọn một hoặc nhiều năm. Ứng dụng sẽ trả về tất cả các bộ phim phù hợp với cả hai tiêu chí. Kết quả cũng được hiển thị với phân trang 16 bộ phim trên mỗi trang.

### Tính Năng Thứ Năm: Lọc Theo Loại Phim

Ứng dụng có khả năng phân biệt giữa các bộ phim lẻ (single films) và phim bộ (series). Người dùng có thể chọn để xem chỉ phim lẻ hoặc chỉ phim bộ bằng cách chọn loại tương ứng. Có 25 bộ phim lẻ và 25 phim bộ trong ứng dụng, được hiển thị với phân trang 16 trên mỗi trang.

### Tính Năng Thứ Sáu: Danh Sách Phim Yêu Thích

Tính năng cuối cùng cho phép người dùng đánh dấu các bộ phim yêu thích của họ. Người dùng có thể nhấp vào biểu tượng trái tim trên mỗi card phim để thêm hoặc xóa phim khỏi danh sách yêu thích. Dữ liệu danh sách yêu thích được lưu trong localStorage của trình duyệt, có nghĩa là nó sẽ vẫn tồn tại khi người dùng quay lại ứng dụng lần sau.

---






<!-- ## KIỂM THỬ CÁC CHỨC NĂNG

Để kiểm thử toàn bộ tính năng của ứng dụng, bạn nên thực hiện các bước sau. Trước tiên, mở ứng dụng trong trình duyệt và duyệt qua tất cả năm danh mục bằng cách sử dụng các nút phân trang để đảm bảo tất cả các bộ phim được hiển thị chính xác. Sau đó, hãy sử dụng tính năng tìm kiếm bằng cách nhập tên của một bộ phim (ví dụ "Avatar") và xác minh rằng kết quả trả về là chính xác. Tiếp theo, hãy thử lọc các bộ phim bằng cách chọn các thể loại và năm khác nhau để đảm bảo bộ lọc hoạt động như mong đợi.

Sau đó, hãy sử dụng tính năng lọc theo loại phim để hiển thị chỉ phim lẻ hoặc phim bộ, và xác minh rằng đúng số lượng phim được hiển thị. Để kiểm thử tính năng danh sách yêu thích, hãy nhấp vào biểu tượng trái tim trên một vài bộ phim, sau đó tải lại trang. Danh sách yêu thích của bạn nên vẫn còn sau khi tải lại, điều này xác minh rằng dữ liệu đang được lưu trữ chính xác. Cuối cùng, hãy kiểm tra responsive design của ứng dụng bằng cách thay đổi kích thước cửa sổ trình duyệt hoặc bằng cách mở ứng dụng trên các thiết bị di động khác nhau để đảm bảo giao diện vẫn hoạt động tốt trên tất cả các kích thước màn hình. -->







<!-- ---

## CÁC PHƯƠNG PHÁP KIỂM THỬ

### Sử Dụng Console

Để kiểm thử các chức năng phía client, bạn có thể sử dụng Console của trình duyệt. Bằng cách mở DevTools (nhấn F12 hoặc Ctrl+Shift+I), bạn có thể xem các log, lỗi, và cảnh báo mà ứng dụng sinh ra. Này sẽ giúp bạn xác định nếu có bất kỳ vấn đề nào trong mã JavaScript hoặc TypeScript.

### Sử Dụng Tab Network

Tab Network trong DevTools cho phép bạn xem tất cả các request HTTP được thực hiện bởi ứng dụng. Bạn có thể kiểm tra xem các API request đang được gửi đúng cách và trả về dữ liệu chính xác không. Bạn cũng có thể xem thời gian tải của các tệp để xác định nếu có bất kỳ vấn đề hiệu suất nào.

### Sử Dụng Tab Application

Tab Application cho phép bạn xem dữ liệu được lưu trữ trong localStorage. Bạn có thể kiểm tra xem dữ liệu danh sách yêu thích đang được lưu trữ chính xác không bằng cách kiểm tra khóa "favorites" trong localStorage.

--- -->

<!-- ## TRIỂN KHAI LÊN MÁY CHỦ

### Triển Khai Lên Vercel

Vercel là một nền tảng phổ biến để triển khai các ứng dụng Nuxt. Hướng dẫn chi tiết từng bước:

**Bước 1: Tạo Repository Trên GitHub**
```
1. Đăng nhập vào GitHub (https://github.com)
2. Nhấp "New" để tạo repository mới
3. Đặt tên: movie-app
4. Chọn "Public" để công khai
5. Nhấp "Create Repository"
```

**Bước 2: Push Mã Lên GitHub**
```bash
cd d:\Github\Vue3-Nuxt.js\movie-app

# Khởi tạo git (nếu chưa có)
git init

# Thêm tất cả file vào git
git add .

# Tạo commit đầu tiên
git commit -m "Initial commit: KHANLIX Movie Application"

# Thêm remote repository (thay <username> và <repo-name> bằng của bạn)
git remote add origin https://github.com/<username>/movie-app.git

# Push code lên GitHub
git branch -M main
git push -u origin main
```

**Bước 3: Đăng Ký Vercel**
```
1. Truy cập https://vercel.com
2. Nhấp "Sign Up"
3. Chọn đăng nhập bằng GitHub
4. Ủy quyền Vercel truy cập tài khoản GitHub của bạn
5. Nhập tên và email của bạn
6. Nhấp "Create Account"
```

**Bước 4: Tạo Project Trên Vercel**
```
1. Sau khi đăng ký, bạn sẽ được dẫn đến Dashboard của Vercel
2. Nhấp "Add New..." → "Project"
3. Tìm repository "movie-app" trong danh sách
4. Nhấp vào repository để import
5. Vercel sẽ tự động phát hiện đây là dự án Nuxt
6. Cài đặt Build sẽ là:
   - Framework: Nuxt.js
   - Build Command: npm run build
   - Output Directory: .output/public
```

**Bước 5: Cấu Hình Environment (Nếu Cần)**
```
Nếu dự án của bạn cần environment variables:
1. Trên trang cấu hình, cuộn xuống tìm "Environment Variables"
2. Nhấp "Add"
3. Nhập các biến cần thiết (hiện tại KHANLIX không cần)
4. Nhấp "Save"
```

**Bước 6: Deploy**
```
1. Nhấp nút "Deploy"
2. Vercel sẽ bắt đầu build ứng dụng của bạn
3. Đợi cho đến khi thấy thông báo "Deployment successful!"
4. Sao chép URL được cung cấp (dạng: https://movie-app-<random>.vercel.app)
5. Ứng dụng của bạn giờ đã sống trên internet!
```

**Bước 7: Kiểm Tra Ứng Dụng**
```
1. Mở URL được cung cấp trong trình duyệt
2. Kiểm tra xem tất cả tính năng có hoạt động không:
   - Danh mục phim hiển thị
   - Tìm kiếm hoạt động
   - Lọc phim hoạt động
   - Yêu thích lưu trữ (localStorage)
3. Kiểm tra responsive design trên di động
4. Nếu có lỗi, kiểm tra logs trên Vercel Dashboard
```

**Bước 8: Tùy Chỉnh Domain (Tùy Chọn)**
```
Nếu bạn muốn sử dụng domain tùy chỉnh:
1. Trên Vercel Dashboard, chọn project
2. Chọn tab "Settings"
3. Tìm "Domains"
4. Nhấp "Add"
5. Nhập domain của bạn
6. Cập nhật DNS records theo hướng dẫn của Vercel
```

**Cập Nhật Sau Này**
```
Mỗi khi bạn push code mới lên GitHub:
git add .
git commit -m "Update description"
git push

Vercel sẽ tự động deploy phiên bản mới!
```

**Lợi Ích Của Vercel**
- ✓ Triển khai miễn phí
- ✓ Tự động build & deploy khi push code
- ✓ SSL/HTTPS tự động
- ✓ CDN toàn cầu (tốc độ nhanh)
- ✓ Analytics & monitoring tích hợp

### Triển Khai Lên Netlify

Netlify là một lựa chọn khác để triển khai ứng dụng Nuxt. Quá trình triển khai tương tự như Vercel - bạn cần kết nối kho GitHub của bạn với tài khoản Netlify, và Netlify sẽ xử lý phần còn lại. Netlify cũng cung cấp các tính năng bổ sung như các hàm serverless (lambda functions) nếu bạn cần chạy mã phía máy chủ.

### Triển Khai Lên Máy Chủ Tùy Chỉnh

Nếu bạn muốn triển khai ứng dụng trên máy chủ tùy chỉnh (VPS hoặc dedicated server), bạn cần trước tiên xây dựng phiên bản sản xuất bằng cách chạy npm run build. Lệnh này sẽ tạo một thư mục .output chứa tất cả các tệp cần thiết để chạy ứng dụng. Sau đó, bạn có thể sao chép thư mục này lên máy chủ của bạn và chạy ứng dụng bằng cách chạy node .output/server/index.mjs. Bạn nên sử dụng một trình quản lý quy trình (process manager) như PM2 để đảm bảo ứng dụng được khởi động lại tự động nếu nó gặp sự cố.

---

## KẾT LUẬN

Báo cáo này cung cấp hướng dẫn toàn diện để triển khai, chạy, và kiểm thử ứng dụng KHANLIX. Bằng cách tuân theo các bước được nêu ra, bạn sẽ có thể đưa ứng dụng vào sản xuất một cách thành công và cung cấp trải nghiệm mượt mà cho người dùng của bạn. Nếu bạn gặp bất kỳ vấn đề nào trong quá trình triển khai hoặc kiểm thử, hãy kiểm tra console trong DevTools để xem có bất kỳ thông báo lỗi nào không. -->

