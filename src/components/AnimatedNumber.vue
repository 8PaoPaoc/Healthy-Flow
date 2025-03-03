<template>
  <span>{{ displayValue }}</span>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useTransition } from '@vueuse/core'

const props = defineProps({
  value: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    default: 1000
  },
  decimals: {
    type: Number,
    default: 0
  },
  delay: {
    type: Number,
    default: 0
  }
})

// 使用 VueUse 的 useTransition 来创建平滑过渡
const source = ref(0)
const output = useTransition(source, {
  duration: props.duration,
  delay: props.delay,
  transition: [0.5, 0, 0.5, 1] // 缓动函数：cubic-bezier
})

// 格式化显示值
const displayValue = computed(() => {
  return Number(output.value).toFixed(props.decimals)
})

// 监听值的变化
watch(() => props.value, (newVal) => {
  source.value = newVal
}, { immediate: true })

// 组件挂载时初始化
onMounted(() => {
  source.value = props.value
})
</script>

<style scoped>
span {
  display: inline-block;
  min-width: 1ch;
  text-align: inherit;
}
</style> 