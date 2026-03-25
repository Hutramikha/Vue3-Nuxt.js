<script setup>
import { onMounted } from 'vue'
import { useMovieStore } from '~/stores/movieStore'
import './assets/css/main.css'

// ========== INIT STORES ON APP MOUNT ==========
const movieStore = useMovieStore()

// Initialize favorites từ localStorage khi app load
onMounted(() => {
  movieStore.initFavorites()
})
</script>

<template>
  <!-- Toast Notifications -->
  <Toast />
  
  <!-- Main Layout với Page Transitions -->
  <NuxtLayout>
    <PageTransition>
      <NuxtPage />
    </PageTransition>
  </NuxtLayout>
</template>
