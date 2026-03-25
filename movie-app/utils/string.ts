// ========== STRING UTILITIES ==========
// Các hàm xử lý string và text

// ========== TRUNCATE TEXT ==========
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

// ========== CAPITALIZE FIRST LETTER ==========
export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

// ========== SLUGIFY STRING ==========
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]/g, '-')
    .replace(/--+/g, '-')
}

// ========== EXTRACT YOUTUBE ID FROM URL ==========
export const extractYoutubeId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/embed\/|youtu\.be\/)([^?&]+)/
  const match = url.match(regex)
  return match?.[1] ?? null
}

// ========== FORMAT DURATION HH:MM:SS ==========
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  const parts = []
  if (hours > 0) parts.push(hours.toString().padStart(2, '0'))
  parts.push(minutes.toString().padStart(2, '0'))
  parts.push(secs.toString().padStart(2, '0'))
  
  return parts.join(':')
}

// ========== FORMAT NUMBER WITH COMMAS ==========
export const formatNumber = (num: number): string => {
  return num.toLocaleString('vi-VN')
}

// ========== SEARCH HIGHLIGHTS ==========
export const highlightSearchTerm = (text: string, searchTerm: string): string => {
  if (!searchTerm) return text
  
  const regex = new RegExp(`(${searchTerm})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}
