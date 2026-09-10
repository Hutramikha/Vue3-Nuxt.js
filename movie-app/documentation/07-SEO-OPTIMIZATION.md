# 7. Tối Ưu Hóa Công Cụ Tìm Kiếm (SEO) trong Nuxt 3

Một trong những lợi thế lớn nhất của việc sử dụng Nuxt là khả năng **Render Phía Server (Server-Side Rendering - SSR)**, điều này cực kỳ có lợi cho SEO.

## Tại sao SSR lại tốt cho SEO?

Khi một công cụ tìm kiếm (như Google Bot) "craw" (thu thập dữ liệu) trang web của bạn:

-   **Với ứng dụng Single-Page Application (SPA) truyền thống (phía client)**: Bot chỉ nhận được một file HTML gần như trống rỗng với các thẻ `<script>`. Nó phải chạy JavaScript để render nội dung, điều này có thể không hiệu quả và đôi khi nội dung không được lập chỉ mục chính xác.
-   **Với Nuxt (SSR)**: Server của Nuxt sẽ render toàn bộ trang HTML với đầy đủ nội dung trước khi gửi nó đến trình duyệt (hoặc bot). Bot nhận được một trang HTML hoàn chỉnh, giống như một trang web tĩnh, giúp nó dễ dàng đọc, hiểu và lập chỉ mục nội dung của bạn.

## Quản Lý Thẻ `<head>` với `useHead`

Nuxt cung cấp một composable rất tiện lợi là `useHead` để quản lý các thẻ bên trong `<head>` của trang HTML một cách linh hoạt và "reactive". Điều này cho phép bạn đặt các thẻ meta quan trọng cho SEO như `title`, `description`, `keywords`, và các thẻ Open Graph (dùng cho chia sẻ trên mạng xã hội) cho từng trang riêng biệt.

### Ví dụ Thực Tế trong `pages/index.vue`

Trong dự án này, trang chủ (`pages/index.vue`) đã được tối ưu hóa SEO bằng cách sử dụng `useHead`.

**Code trong `pages/index.vue`:**

```vue
<script setup lang="ts">
// ... các import khác

// ========== SEO OPTIMIZATION ==========
// Sử dụng useHead để thêm các thẻ meta cho trang chủ
useHead({
  // 1. Thẻ <title>: Tiêu đề xuất hiện trên tab trình duyệt và kết quả tìm kiếm
  title: 'KHANLIX - Xem Phim Trực Tuyến Miễn Phí | Phim HD',
  
  // 2. Mảng `meta`: Chứa tất cả các thẻ <meta> khác
  meta: [
    // Thẻ description: Mô tả ngắn gọn về trang, rất quan trọng cho SEO
    {
      name: 'description',
      content: 'Xem phim trực tuyến hd miễn phí. 50+ bộ phim hay, lọc theo thể loại, tìm kiếm nhanh. KHANLIX - nền tảng xem phim tốt nhất Việt Nam'
    },
    // Thẻ keywords: Các từ khóa liên quan đến nội dung trang
    {
      name: 'keywords',
      content: 'xem phim, phim trực tuyến, phim hd, phim việt, phim lẻ, phim bộ'
    },
    
    // --- Open Graph (OG) Tags ---
    // Các thẻ này giúp hiển thị đẹp hơn khi link được chia sẻ trên mạng xã hội (Facebook, Zalo, etc.)
    
    // og:title: Tiêu đề khi chia sẻ
    {
      property: 'og:title',
      content: 'KHANLIX - Xem Phim Đỉnh Cao'
    },
    // og:description: Mô tả khi chia sẻ
    {
      property: 'og:description',
      content: 'Web xem phim trực tuyến với giao diện hiện đại, hỗ trợ lọc và tìm kiếm'
    },
    // og:type: Loại nội dung (ở đây là 'website')
    {
      property: 'og:type',
      content: 'website'
    }
    // Bạn cũng có thể thêm og:image, og:url, v.v.
  ]
})

// ... phần còn lại của script
</script>
```

## Luồng Hoạt Động

1.  Khi người dùng (hoặc bot) yêu cầu truy cập trang chủ.
2.  Server Nuxt bắt đầu quá trình render `pages/index.vue`.
3.  Nó thấy lệnh `useHead` và thu thập tất cả thông tin về `title` và `meta`.
4.  Nuxt tạo ra một trang HTML hoàn chỉnh, chèn các thẻ `<title>`, `<meta name="description" ...>`, `<meta property="og:title" ...>` vào bên trong thẻ `<head>`.
5.  Trang HTML đầy đủ này được gửi đến trình duyệt/bot.

Bằng cách này, bạn đảm bảo rằng mỗi trang trong ứng dụng của mình đều có thể được tối ưu hóa SEO một cách độc lập, giúp cải thiện thứ hạng trên các công cụ tìm kiếm và tăng khả năng hiển thị khi được chia sẻ trên mạng xã hội.
