<template>
  <div class="loading-state" :class="{ 'is-fullscreen': fullscreen }">
    <div class="loading-content">
      <el-icon class="loading-icon" :size="32">
        <Loading />
      </el-icon>
      <div class="loading-text">{{ text }}</div>
    </div>
    <div v-if="overlay" class="loading-overlay" />
  </div>
</template>

<script setup lang="ts">
import { Loading } from '@element-plus/icons-vue'

defineProps({
  text: {
    type: String,
    default: '加载中...'
  },
  fullscreen: {
    type: Boolean,
    default: false
  },
  overlay: {
    type: Boolean,
    default: true
  }
})
</script>

<style scoped>
.loading-state {
  @apply relative flex items-center justify-center min-h-[200px];
}

.loading-state.is-fullscreen {
  @apply fixed inset-0 z-50 min-h-screen;
}

.loading-content {
  @apply relative z-10 flex flex-col items-center;
}

.loading-icon {
  @apply animate-spin text-primary-500;
}

.loading-text {
  @apply mt-4 text-sm text-gray-600;
}

.loading-overlay {
  @apply absolute inset-0 bg-white bg-opacity-80;
}
</style> 