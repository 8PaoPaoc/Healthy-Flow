<template>
  <div class="error-message" :class="type">
    <el-icon class="error-icon">
      <component :is="icon" />
    </el-icon>
    <div class="error-content">
      <div class="error-title">{{ title }}</div>
      <div v-if="message" class="error-description">{{ message }}</div>
      <div v-if="showRetry" class="error-actions">
        <el-button type="primary" size="small" @click="$emit('retry')">
          重试
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Warning,
  CircleClose,
  InfoFilled
} from '@element-plus/icons-vue'
import { computed } from '@vue/runtime-core'
import type { Component } from 'vue'

type ErrorType = 'error' | 'warning' | 'info'

const props = defineProps({
  type: {
    type: String as () => ErrorType,
    default: 'error',
    validator: (value: string): boolean => ['error', 'warning', 'info'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  showRetry: {
    type: Boolean,
    default: false
  }
})

defineEmits(['retry'])

const icon = computed(() => {
  const icons: Record<ErrorType, Component> = {
    error: CircleClose,
    warning: Warning,
    info: InfoFilled
  }
  return icons[props.type]
})
</script>

<style scoped>
.error-message {
  @apply flex items-start p-4 rounded-lg border;
}

.error-message.error {
  @apply bg-red-50 border-red-200;
}

.error-message.warning {
  @apply bg-yellow-50 border-yellow-200;
}

.error-message.info {
  @apply bg-blue-50 border-blue-200;
}

.error-icon {
  @apply flex-shrink-0 w-6 h-6 mr-3;
}

.error-message.error .error-icon {
  @apply text-red-500;
}

.error-message.warning .error-icon {
  @apply text-yellow-500;
}

.error-message.info .error-icon {
  @apply text-blue-500;
}

.error-content {
  @apply flex-1;
}

.error-title {
  @apply text-sm font-medium;
}

.error-message.error .error-title {
  @apply text-red-800;
}

.error-message.warning .error-title {
  @apply text-yellow-800;
}

.error-message.info .error-title {
  @apply text-blue-800;
}

.error-description {
  @apply mt-1 text-sm text-gray-600;
}

.error-actions {
  @apply mt-3;
}
</style> 