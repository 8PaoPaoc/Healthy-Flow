<template>
  <MainLayout>
    <!-- 粒子背景效果，在简洁模式下不显示 -->
    <canvas v-if="!isSimpleMode" id="particles-canvas"></canvas>
    
    <!-- 路由页面将在这里显示 -->
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    
    <!-- 通知提示组件 -->
    <NotificationToast />
  </MainLayout>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import MainLayout from './layouts/MainLayout.vue';
import NotificationToast from './components/NotificationToast.vue';

const route = useRoute();

// 判断是否使用简洁模式（在8089端口）
const isSimpleMode = computed(() => {
  return route.meta.simpleMode || window.location.port === '8089';
});

// 是否隐藏注册表单（在8090端口）
const hideRegisterForm = computed(() => {
  return route.meta.hideRegisterForm || window.location.port === '8090';
});
</script>

<style>
/* 简化的全局样式 */
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}

/* 页面过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>