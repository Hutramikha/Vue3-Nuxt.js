<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

interface Suggestion {
  id: number
  title: string
  genre: string
  year?: number
  poster?: string
  highlighted?: string
}

interface Props {
  suggestions: Suggestion[]
  inputQuery: string
  isOpen: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  selectSuggestion: [suggestion: Suggestion]
  clear: []
  removeSuggestion: [query: string]
}>()

const router = useRouter()
const highlightedIndex = ref(-1)

// ========== KEYBOARD NAVIGATION ==========
const handleKeyDown = (e: KeyboardEvent) => {
  if (!props.isOpen) return

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      highlightedIndex.value = Math.min(
        highlightedIndex.value + 1,
        props.suggestions.length - 1
      )
      break
    case 'ArrowUp':
      e.preventDefault()
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, -1)
      break
    case 'Enter':
      e.preventDefault()
      const selectedItem = props.suggestions[highlightedIndex.value]
      if (highlightedIndex.value >= 0 && selectedItem) {
        selectSuggestion(selectedItem)
      }
      break
    case 'Escape':
      emit('clear')
      break
  }
}

// ========== SELECT SUGGESTION ==========
const selectSuggestion = (suggestion: Suggestion) => {
  emit('selectSuggestion', suggestion)
  highlightedIndex.value = -1
}

// ========== REMOVE FROM HISTORY ==========
const handleRemove = (e: Event, query: string) => {
  e.stopPropagation()
  emit('removeSuggestion', query)
}

// ========== GROUP SUGGESTIONS ==========
const groupedSuggestions = computed(() => {
  return {
    recent: props.suggestions.filter(s => s.genre === 'Gần đây'),
    movies: props.suggestions.filter(s => s.genre !== 'Gần đây')
  }
})

// ========== RESET HIGHLIGHT WHEN SUGGESTIONS CHANGE ==========
watch(() => props.suggestions, () => {
  highlightedIndex.value = -1
})
</script>

<template>
  <!-- DROPDOWN GỢI ý TÌM KIẾM -->
  <!-- v-show="isOpen": ẩn/hiện dropdown -->
  <!-- v-if="suggestions.length > 0": chỉ render khi có gợi ý -->
  <Transition name="fade-down">
    <div 
      v-show="isOpen && suggestions.length > 0"
      class="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-emerald-600/30 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto"
      @keydown="handleKeyDown"
    >
      <!-- ===== PHẦN GỢI ý GẦN ĐÂY ===== -->
      <!-- Chỉ hiển thị khi người dùng chưa nhập gì (inputQuery rỗng) -->
      <div v-if="groupedSuggestions.recent.length > 0 && !inputQuery.trim()">
        <!-- Tiêu đề phần -->
        <div class="px-4 py-2 text-xs font-bold text-emerald-400 uppercase tracking-wider border-b border-emerald-600/20">
          🕐 Tìm kiếm gần đây
        </div>
        
        <!-- Danh sách gợi ý gần đây -->
        <div>
          <button
            v-for="(suggestion, index) in groupedSuggestions.recent"
            :key="`recent-${suggestion.title}`"
            @click="selectSuggestion(suggestion)"
            :class="[
              'w-full px-4 py-2 text-left hover:bg-emerald-600/10 transition flex items-center justify-between group',
              highlightedIndex === index ? 'bg-emerald-600/20' : ''
            ]"
          >
            <!-- Nội dung -->
            <div class="flex items-center gap-3 flex-1">
              <Icon name="heroicons-solid:clock" class="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span class="text-sm text-gray-300">{{ suggestion.title }}</span>
            </div>
            
            <!-- Nút xóa (chỉ hiển thị khi hover) -->
            <button
              @click="handleRemove($event, suggestion.title)"
              class="p-1 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition flex-shrink-0"
              title="Xóa khỏi lịch sử"
            >
              <Icon name="heroicons-solid:x-mark" class="w-4 h-4" />
            </button>
          </button>
        </div>
      </div>

      <!-- DIVIDER: Nếu có cả gợi ý gần đây lẫn phim -->
      <div
        v-if="groupedSuggestions.recent.length > 0 && groupedSuggestions.movies.length > 0"
        class="h-px bg-emerald-600/20"
      ></div>

      <!-- ===== PHẦN GỢI ý PHIM ===== -->
      <!-- Hiển thị khi người dùng đã nhập từ khóa -->
      <div v-if="groupedSuggestions.movies.length > 0">
        <!-- Tiêu đề phần (chỉ hiển thị khi có gợi ý gần đây ở trên) -->
        <div v-if="groupedSuggestions.recent.length > 0" class="px-4 py-2 text-xs font-bold text-emerald-400 uppercase tracking-wider border-b border-emerald-600/20">
          🎬 Kết quả tìm kiếm
        </div>

        <!-- Danh sách phim gợi ý -->
        <div>
          <button
            v-for="(suggestion, index) in groupedSuggestions.movies"
            :key="`movie-${suggestion.id}`"
            @click="selectSuggestion(suggestion)"
            :class="[
              'w-full px-4 py-3 text-left hover:bg-emerald-600/10 transition flex items-start gap-3 border-b border-gray-800/50',
              highlightedIndex === (groupedSuggestions.recent.length + index) ? 'bg-emerald-600/20' : ''
            ]"
          >
            <!-- Poster (nếu có) -->
            <div class="flex-shrink-0 w-10 h-14 bg-gray-800 rounded overflow-hidden">
              <img
                v-if="suggestion.poster"
                :src="suggestion.poster"
                :alt="suggestion.title"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-600">
                <Icon name="heroicons-solid:film" class="w-5 h-5" />
              </div>
            </div>

            <!-- Thông tin phim -->
            <div class="flex-1 min-w-0">
              <!-- Tên phim (với highlight từ khóa) -->
              <div class="text-sm font-medium text-white truncate">
                <span v-if="suggestion.highlighted" v-html="suggestion.highlighted" />
                <span v-else>{{ suggestion.title }}</span>
              </div>

              <!-- Genre + Year -->
              <div class="text-xs text-gray-400 mt-1">
                <span>{{ suggestion.genre }}</span>
                <span v-if="suggestion.year" class="ml-2">• {{ suggestion.year }}</span>
              </div>
            </div>

            <!-- Icon mũi tên (chỉ hiển thị khi hover) -->
            <Icon
              name="heroicons-solid:arrow-right"
              class="w-4 h-4 text-gray-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition"
            />
          </button>
        </div>
      </div>

      <!-- ===== THÔNG BÁO KHÔNG TÌM THẤY ===== -->
      <!-- Hiển thị khi người dùng đã nhập từ khóa nhưng không tìm thấy phim nào -->
      <div v-if="inputQuery.trim() && groupedSuggestions.movies.length === 0" class="px-4 py-6 text-center">
        <Icon name="heroicons-solid:magnifying-glass" class="w-8 h-8 text-gray-600 mx-auto mb-2 opacity-50" />
        <p class="text-sm text-gray-400">Không tìm thấy phim nào</p>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Animation: Fade + động từ trên xuống */
.fade-down-enter-active,
.fade-down-leave-active {
  transition: all 0.2s ease;
}

.fade-down-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.fade-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Highlight từ khóa trong gợi ý */
:deep(mark) {
  background-color: rgba(16, 185, 129, 0.3);
  color: #10b981;
  font-weight: 600;
  padding: 0 2px;
  border-radius: 2px;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(16, 185, 129, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(16, 185, 129, 0.5);
}
</style>
