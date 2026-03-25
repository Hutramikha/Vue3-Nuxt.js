// ========== JSON-LD SCHEMA CHO SEO ==========
// Tạo structured data cho Google

export const useJsonLd = () => {
  // Tạo schema cho 1 phim
  const movieSchema = (movie: any) => ({
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.title,
    description: movie.synopsis,
    image: movie.poster,
    datePublished: `${movie.year}-01-01`,
    genre: movie.genre?.split(',').map((g: string) => g.trim()),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: movie.rating,
      ratingCount: 10000,
      bestRating: 10,
      worstRating: 1
    }
  })

  // Thêm schema vào <head>
  const addSchema = (schema: any) => {
    if (typeof window === 'undefined') return
    
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(schema)
    document.head.appendChild(script)
  }

  return { movieSchema, addSchema }
}
