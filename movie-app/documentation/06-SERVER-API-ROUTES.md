# 6. Server API Routes - Xây Dựng Backend trong Nuxt

Một trong những tính năng mạnh mẽ nhất của Nuxt là khả năng xây dựng các API endpoint phía server ngay trong cùng một dự án. Điều này được thực hiện thông qua thư mục `server/`.

## Thư Mục `server/api/`

Bất kỳ file nào bạn tạo trong `server/api/` sẽ tự động trở thành một API endpoint.

-   `server/api/hello.ts` -> sẽ tạo ra endpoint `/api/hello`.
-   `server/api/movies.ts` -> sẽ tạo ra endpoint `/api/movies`.
-   `server/api/users/profile.ts` -> sẽ tạo ra endpoint `/api/users/profile`.

Những endpoint này chạy trong một môi trường server (Node.js) và có thể thực hiện các tác vụ như kết nối cơ sở dữ liệu, gọi các API bên ngoài, xử lý logic nghiệp vụ phức tạp, v.v.

## Phân Tích `server/api/movies.ts`

Trong dự án này, `server/api/movies.ts` đóng vai trò như một "cơ sở dữ liệu giả" (mock database), cung cấp danh sách 50 bộ phim cho frontend.

**Code cốt lõi (`server/api/movies.ts`):**

```typescript
// `defineEventHandler` là một hàm helper từ Nitro (server engine của Nuxt)
// để định nghĩa một trình xử lý sự kiện (request handler).
import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  // `event` là một đối tượng chứa thông tin về yêu cầu HTTP đến.

  // ========== DANH SÁCH TẤT CẢ PHIM ==========
  // Trong một ứng dụng thực tế, dữ liệu này sẽ được lấy từ cơ sở dữ liệu (MongoDB, PostgreSQL, v.v.)
  const allMovies = [
    { id: 1, title: "Lật Mặt 7: Một Điều Ước", ... },
    { id: 2, title: "Mai", ... },
    // ... 48 phim khác
  ]

  // ========== THÊM FIELD TYPE (PHIM LẺ/BỘ) ==========
  // Xử lý dữ liệu phía server: thêm thuộc tính 'type' cho mỗi phim
  const moviesWithType = allMovies.map((movie: any) => ({
    ...movie,
    type: movie.id <= 25 ? 'single' : 'series'
  }))

  // ========== LOGIC FILTER PHÍA SERVER ==========
  // `getQuery` là một hàm helper để lấy các query parameters từ URL.
  // Ví dụ: /api/movies?genre=Hành%20Động&year=2024
  const query = getQuery(event)
  const genre = query.genre as string // "Hành Động"
  const year = query.year as string   // "2024"
  const search = query.search as string

  // [...moviesWithType] sử dụng spread operator để tạo BẢN SAO của mảng
  // Lý do: Nếu không làm vậy, các phép .filter() sẽ thay đổi mảng gốc.
  // Với spread operator, chúng ta có một mảng độc lập để lọc mà không ảnh hưởng đến dữ liệu gốc.
  // Ví dụ: moviesWithType là [movie1, movie2, ...], [...moviesWithType] tạo ra mảng mới [movie1, movie2, ...]
  let filteredMovies = [...moviesWithType]

  // Filter theo thể loại nếu có query `genre`
  if (genre) {
    filteredMovies = filteredMovies.filter((movie: any) =>
      movie.genre.includes(genre)
    )
  }

  // Filter theo năm nếu có query `year`
  if (year) {
    filteredMovies = filteredMovies.filter((movie: any) =>
      movie.year === year
    )
  }

  // Filter theo từ khóa tìm kiếm nếu có query `search`
  if (search) {
    const searchLower = search.toLowerCase()
    filteredMovies = filteredMovies.filter((movie: any) =>
      movie.title.toLowerCase().includes(searchLower) ||
      movie.genre.toLowerCase().includes(searchLower)
    )
  }

  // Bất cứ thứ gì được trả về từ hàm này sẽ được gửi lại cho client dưới dạng JSON.
  return filteredMovies
})
```

## Luồng Hoạt Động

1.  **Yêu cầu từ Frontend**: Component `pages/index.vue` ở phía client gọi `useFetch('/api/movies')`.
2.  **Routing**: Nuxt nhận được yêu cầu đến `/api/movies` và chuyển nó đến trình xử lý sự kiện trong `server/api/movies.ts`.
3.  **Thực thi ở Server**:
    -   Code bên trong `defineEventHandler` được thực thi trên server.
    -   Nó định nghĩa một mảng lớn `allMovies`.
    -   Nó xử lý dữ liệu, thêm trường `type`.
    -   Nó kiểm tra các query parameters (`genre`, `year`, `search`) trên URL của yêu cầu.
    -   Nếu có, nó sẽ lọc danh sách phim cho phù hợp.
4.  **Trả về Phản hồi**:
    -   Hàm `return filteredMovies` sẽ trả về mảng phim (đã được lọc hoặc toàn bộ).
    -   Nuxt/Nitro tự động chuyển đổi mảng này thành chuỗi JSON và gửi nó lại cho client với header `Content-Type: application/json`.
5.  **Nhận dữ liệu ở Frontend**:
    -   `useFetch` ở phía client nhận được phản hồi JSON.
    -   Nó cập nhật `ref` `data` với dữ liệu phim.
    -   Giao diện người dùng (UI) sẽ tự động cập nhật để hiển thị danh sách phim này.

## Tại Sao Lại Cần Server Routes?

Mặc dù trong ví dụ này, dữ liệu là tĩnh, nhưng việc sử dụng server routes mang lại nhiều lợi ích trong các ứng dụng thực tế:

1.  **Bảo mật**: Bạn có thể giữ các thông tin nhạy cảm (như API keys, mật khẩu cơ sở dữ liệu) an toàn trên server. Client không bao giờ thấy được chúng.
2.  **Giảm tải cho Client**: Các tác vụ nặng như lọc, sắp xếp, tính toán phức tạp có thể được thực hiện trên server, giúp client (đặc biệt là các thiết bị di động yếu) chạy nhanh hơn.
3.  **Tích hợp với Cơ sở dữ liệu**: Đây là nơi bạn sẽ viết logic để kết nối và truy vấn cơ sở dữ liệu thực sự.
4.  **Tích hợp với API bên ngoài**: Bạn có thể gọi các API của bên thứ ba từ đây, xử lý dữ liệu và chỉ trả về những gì client cần, giúp giảm lượng dữ liệu truyền qua mạng.
5.  **Tối ưu hóa cho SEO**: Khi dữ liệu được lấy và xử lý ở server, nội dung HTML cuối cùng được gửi đến trình duyệt (và các công cụ tìm kiếm) đã đầy đủ, giúp cải thiện khả năng được lập chỉ mục (SEO).
