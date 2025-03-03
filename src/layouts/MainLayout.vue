<template>
  <div class="main-layout">
    <!-- 顶部导航栏 -->
    <nav v-if="isLoggedIn" class="nav-bar">
      <div class="nav-brand">
        <router-link to="/dashboard" class="brand-link">
          <i class="fas fa-heartbeat"></i>
          <span>HealthyFlow</span>
        </router-link>
      </div>
      
      <div class="nav-menu">
        <router-link to="/dashboard" class="nav-item" :class="{ active: currentRoute === '/dashboard' }">
          <i class="fas fa-home"></i>
          <span>仪表盘</span>
        </router-link>
        
        <router-link to="/health-record" class="nav-item" :class="{ active: currentRoute === '/health-record' }">
          <i class="fas fa-notes-medical"></i>
          <span>健康记录</span>
        </router-link>
        
        <router-link to="/exercise-plan" class="nav-item" :class="{ active: currentRoute === '/exercise-plan' }">
          <i class="fas fa-running"></i>
          <span>运动计划</span>
        </router-link>
        
        <router-link to="/diet-record" class="nav-item" :class="{ active: currentRoute === '/diet-record' }">
          <i class="fas fa-utensils"></i>
          <span>饮食记录</span>
        </router-link>
        
        <router-link to="/sleep-analysis" class="nav-item" :class="{ active: currentRoute === '/sleep-analysis' }">
          <i class="fas fa-bed"></i>
          <span>睡眠分析</span>
        </router-link>
      </div>
      
      <div class="nav-user">
        <el-dropdown trigger="click" @command="handleCommand">
          <div class="user-info">
            <img :src="userAvatar" alt="用户头像" class="user-avatar">
            <span class="user-name">{{ userName }}</span>
            <i class="el-icon-arrow-down"></i>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">
                <i class="fas fa-user"></i> 个人资料
              </el-dropdown-item>
              <el-dropdown-item command="settings">
                <i class="fas fa-cog"></i> 设置
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <i class="fas fa-sign-out-alt"></i> 退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <slot></slot>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCurrentUser, logout } from '@/services/userService'

const route = useRoute()
const router = useRouter()

// 当前路由路径
const currentRoute = computed(() => route.path)

// 用户登录状态
const isLoggedIn = computed(() => {
  const currentUser = getCurrentUser()
  return !!currentUser
})

// 用户信息
const userName = computed(() => {
  const user = getCurrentUser()
  return user ? user.name : ''
})

const userAvatar = computed(() => {
  const user = getCurrentUser()
  return user?.avatar || '/images/default-avatar.png'
})

// 处理下拉菜单命令
async function handleCommand(command) {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      await logout()
      router.push('/login')
      break
  }
}
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.nav-bar {
  background: white;
  height: 64px;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.nav-brand {
  display: flex;
  align-items: center;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: #3b82f6;
  font-size: 1.25rem;
  font-weight: 600;
}

.brand-link i {
  font-size: 1.5rem;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #4b5563;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s;
}

.nav-item:hover {
  color: #3b82f6;
  background: #f0f7ff;
}

.nav-item.active {
  color: #3b82f6;
  background: #f0f7ff;
}

.nav-item i {
  font-size: 1.1rem;
}

.nav-user {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background 0.2s;
}

.user-info:hover {
  background: #f3f4f6;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  color: #1f2937;
  font-weight: 500;
}

.main-content {
  margin-top: 64px;
  flex: 1;
  padding: 2rem;
  background: #f9fafb;
}

@media (max-width: 1024px) {
  .nav-bar {
    padding: 0 1rem;
  }

  .nav-menu {
    gap: 1rem;
  }

  .nav-item {
    padding: 0.5rem;
  }

  .nav-item span {
    display: none;
  }
}

@media (max-width: 640px) {
  .brand-link span {
    display: none;
  }

  .user-name {
    display: none;
  }
}
</style> 