<script setup lang="ts">
// Component bọc hiệu ứng chuyển trang
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-500"
    leave-active-class="transition-all duration-300"
    enter-from-class="opacity-0 translate-y-4"
    leave-to-class="opacity-0 translate-y-4"
    mode="out-in"
  >
    <slot />
  </Transition>
</template>
