import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  // 1. Giữ nguyên các module của Khang
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/icon',
    '@nuxt/image'
  ],

  // 2. Cấu hình SEO cơ bản (Cực kỳ quan trọng cho web phim)
  app: {
    head: {
      title: 'Khanlix - Xem phim đỉnh cao',
      meta: [
        { name: 'description', content: 'Web xem phim trực tuyến sử dụng Nuxt 4' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // 3. Cấu hình Nuxt Image (Dùng ảnh local /images/posters/)
  image: {
    // domains: ['image.tmdb.org', 'vcinema.com'], // Bỏ comment nếu dùng API external sau này
  },

  // 4. Bật chế độ SSR (Mặc định là true, nhưng ghi ra cho giảng viên thấy)
  ssr: true,

  devtools: { enabled: true },
  compatibilityDate: '2026-04-04',
})