<template>
  <div class="app-container" :class="{ 'simple-mode': isSimpleMode }">
    <!-- 浮动健康图标装饰 (减少数量)，在简洁模式下不显示 -->
    <div v-if="!isSimpleMode" class="floating-icons">
      <div class="floating-icon" v-for="i in 3" :key="i">
        <i :class="getRandomIcon()" :style="getRandomStyle()"></i>
      </div>
    </div>
    
    <!-- 页面内容 -->
    <div class="content-wrapper">
      <slot></slot>
    </div>
    
    <!-- 简化页脚，在简洁模式下可选隐藏 -->
    <footer v-if="!isSimpleMode" class="footer">
      <p>© {{ currentYear }} 健康管理系统</p>
    </footer>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// 判断是否使用简洁模式（在8089端口）
const isSimpleMode = computed(() => {
  return route.meta.simpleMode || window.location.port === '8089';
});

// 是否隐藏注册表单（在8090端口）
const hideRegisterForm = computed(() => {
  return route.meta.hideRegisterForm || window.location.port === '8090';
});

// 当前年份
const currentYear = computed(() => new Date().getFullYear());

// 随机健康图标
const healthIcons = [
  'fas fa-heartbeat',
  'fas fa-running',
  'fas fa-apple-alt',
  'fas fa-heart',
  'fas fa-bicycle'
];

// 随机生成图标
function getRandomIcon() {
  const randomIndex = Math.floor(Math.random() * healthIcons.length);
  return healthIcons[randomIndex];
}

// 随机生成浮动图标样式
function getRandomStyle() {
  return {
    left: `${Math.random() * 95}%`,
    top: `${Math.random() * 90}%`,
    animationDuration: `${Math.random() * 10 + 10}s`,
    animationDelay: `${Math.random() * 5}s`,
    color: `hsla(${Math.random() * 40 + 190}, 70%, 60%, 0.3)`,
    fontSize: `${Math.random() * 1 + 1.5}rem`
  };
}

// 粒子效果背景
const particles = ref([]);

// 创建粒子(减少数量)
function createParticles() {
  particles.value = Array(30).fill().map(() => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 5 + 1,
    speedX: Math.random() * 3 - 1.5,
    speedY: Math.random() * 3 - 1.5,
    color: `hsla(${Math.random() * 60 + 190}, 70%, 70%, ${Math.random() * 0.2 + 0.1})`
  }));
}

let animationFrameId = null;

// 动画循环
function animateParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particles.value.forEach(particle => {
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    
    // 更新位置
    particle.x += particle.speedX;
    particle.y += particle.speedY;
    
    // 边界检测
    if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
    if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
  });
  
  animationFrameId = requestAnimationFrame(animateParticles);
}

// 组件挂载时启动粒子效果
onMounted(() => {
  createParticles();
  animateParticles();
  
  // 窗口大小变化时重新创建粒子
  window.addEventListener('resize', createParticles);
});

// 组件卸载时清理资源
onBeforeUnmount(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  window.removeEventListener('resize', createParticles);
});
</script>

<style>
:root {
  /* 颜色变量 */
  --primary-color: #3E78FF;
  --secondary-color: #6C63FF;
  --accent-color: #5D5FEF;
  --text-primary: #333;
  --text-secondary: #666;
  --bg-primary: #f8f9fa;
  
  /* 渐变 */
  --primary-gradient: linear-gradient(135deg, #3E78FF, #6C63FF);
  --bg-gradient: radial-gradient(circle at 30% 20%, rgba(120, 180, 255, 0.1) 0%, rgba(255, 255, 255, 0) 40%), 
                 radial-gradient(circle at 80% 60%, rgba(120, 220, 255, 0.12) 0%, rgba(255, 255, 255, 0) 30%);
  
  /* 阴影 */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 5px 15px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.1);
  
  /* 圆角 */
  --border-radius: 20px;
  --border-radius-sm: 10px;
  
  /* 卡片背景 */
  --card-bg: rgba(255, 255, 255, 0.95);
}

/* 全局样式 */
body {
  background: var(--bg-gradient);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: var(--text-primary);
  margin: 0;
  padding: 0;
  min-height: 100vh;
  overflow-x: hidden;
  background-attachment: fixed;
  background-color: #f4f7fd;
}

/* 简洁模式下的样式 */
.simple-mode {
  background: white;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

/* 粒子效果背景 */
#particles-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}

/* 内容包装器 */
.content-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 0 20px 40px;
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

/* 浮动图标装饰 */
.floating-icons {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.floating-icon {
  position: absolute;
  animation: float 15s infinite ease-in-out;
  opacity: 0.25;
}

/* 页脚 */
.footer {
  text-align: center;
  padding: 15px;
  font-size: 0.85rem;
  color: var(--text-secondary);
  position: relative;
  z-index: 1;
}

/* 动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) rotate(5deg);
  }
  50% {
    transform: translateY(10px) rotate(-5deg);
  }
  75% {
    transform: translateY(-15px) rotate(3deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content-wrapper {
    padding: 0 15px 30px;
  }
}

/* 在8090端口上隐藏注册表单 */
@media screen and (min-width: 1px) {
  body:has(.app-container) {
    position: relative;
    overflow-y: auto;
  }
  
  body:has(.app-container)[data-port="8090"] .register-container,
  body:has(.app-container)[data-port="8090"] .content-wrapper > div:nth-child(2) {
    display: none !important;
  }
}
</style>

<script>
// 在全局范围内设置当前端口
document.addEventListener('DOMContentLoaded', () => {
  document.body.setAttribute('data-port', window.location.port);
});
</script> 