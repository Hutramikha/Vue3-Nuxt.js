// ========== SEO UTILITIES ==========
// Tạo meta tags động cho các trang phim

export const generateMovieMeta = (movie: any) => {
  return [
    {
      name: 'description',
      content: `Xem phim ${movie.title}. Thể loại: ${movie.genre}. Năm phát hành: ${movie.year}. Rating: ${movie.rating}/10`
    },
    {
      name: 'keywords',
      content: `${movie.title}, xem phim, ${movie.genre}, ${movie.year}`
    },
    {
      property: 'og:title',
      content: `${movie.title} | KHANLIX`
    },
    {
      property: 'og:description',
      content: `Xem ${movie.title} trực tuyến với chất lượng HD`
    },
    {
      property: 'og:image',
      content: `http://localhost:3000${movie.poster || ''}`
    },
    {
      property: 'og:type',
      content: 'video.movie'
    }
  ]
}

export const generatePageTitle = (movie: any) => {
  return `${movie.title} | KHANLIX`
}
