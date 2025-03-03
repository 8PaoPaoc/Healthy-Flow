<template>
  <div class="login-page">
    <div class="login-left">
      <div class="brand-section">
        <div class="brand-logo">
          <i class="fas fa-heartbeat"></i>
        </div>
        <div class="brand-text">
          <h1>HealthyFlow</h1>
          <p>健康管理系统</p>
        </div>
      </div>
    </div>
    
    <div class="login-right">
      <div class="login-form-container">
        <h2>用户登录</h2>
        
        <el-form 
          ref="formRef"
          :model="formData"
          :rules="rules"
          class="login-form"
          size="large"
        >
          <el-form-item prop="username">
            <el-input
              v-model="formData.username"
              placeholder="用户名"
              :prefix-icon="User"
            />
          </el-form-item>
          
          <el-form-item prop="password">
            <el-input
              v-model="formData.password"
              placeholder="密码"
              :prefix-icon="Lock"
              :type="showPassword ? 'text' : 'password'"
            >
              <template #suffix>
                <el-icon 
                  class="password-toggle"
                  @click="showPassword = !showPassword"
                >
                  <component :is="showPassword ? 'Hide' : 'View'" />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>

          <div class="form-options">
            <el-checkbox v-model="formData.rememberMe">记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>

          <el-button 
            type="primary" 
            class="submit-btn"
            :loading="isLoading"
            @click="handleLogin"
          >
            登 录
          </el-button>

          <div class="register-link">
            <span>还没有账号？</span>
            <el-link type="primary" :underline="false">立即注册</el-link>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { User, Lock, View, Hide } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref<FormInstance>()
const showPassword = ref(false)
const isLoading = ref(false)

const formData = reactive({
  username: '',
  password: '',
  rememberMe: false
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名至少需要3个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少需要6个字符', trigger: 'blur' }
  ]
}

async function handleLogin() {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    isLoading.value = true
    
    await userStore.login({
      username: formData.username,
      password: formData.password,
      rememberMe: formData.rememberMe
    })
    
    ElMessage.success('登录成功')
    router.push('/dashboard')
  } catch (error: any) {
    ElMessage.error(error.message || '登录失败，请稍后重试')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-page {
  @apply min-h-screen flex;
}

.login-left {
  @apply hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 to-blue-500 items-center justify-center relative overflow-hidden;
}

.brand-section {
  @apply text-center text-white z-10;
}

.brand-logo {
  @apply text-6xl mb-6;
}

.brand-text h1 {
  @apply text-4xl font-bold mb-2;
}

.brand-text p {
  @apply text-xl opacity-90;
}

/* 装饰背景 */
.login-left::before {
  content: '';
  @apply absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI3NTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgY3g9IjcyMCIgY3k9IjM3NSIgcj0iMzc1Ii8+PGNpcmNsZSBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIGN4PSI3MjAiIGN5PSIzNzUiIHI9IjI1MCIvPjxjaXJjbGUgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBjeD0iNzIwIiBjeT0iMzc1IiByPSIxMjUiLz48L2c+PC9zdmc+')] bg-no-repeat bg-cover opacity-10;
}

.login-right {
  @apply flex-1 flex items-center justify-center p-8 bg-gray-50;
}

.login-form-container {
  @apply w-full max-w-md bg-white rounded-2xl p-8 shadow-lg;
}

.login-form-container h2 {
  @apply text-2xl font-bold text-gray-800 mb-8 text-center;
}

.login-form {
  @apply space-y-6;
}

:deep(.el-input__wrapper) {
  @apply shadow-none border border-gray-300 rounded-xl transition-all duration-300;
  box-shadow: none !important;
}

:deep(.el-input__wrapper.is-focus) {
  @apply border-indigo-500 ring-2 ring-indigo-500/10;
}

:deep(.el-input__inner) {
  @apply h-12;
}

.form-options {
  @apply flex items-center justify-between mb-6;
}

:deep(.el-checkbox__label) {
  @apply text-gray-600;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  @apply bg-indigo-600 border-indigo-600;
}

.submit-btn {
  @apply w-full h-12 text-base font-medium rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 border-none shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300;
}

.register-link {
  @apply mt-6 text-center text-gray-500 space-x-1;
}

:deep(.el-form-item__error) {
  @apply text-xs mt-1;
}

.password-toggle {
  @apply text-gray-400 cursor-pointer hover:text-indigo-600 transition-colors duration-300;
}

@media (max-width: 1024px) {
  .login-right {
    @apply w-full;
  }
  
  .login-form-container {
    @apply shadow-none;
  }
}
</style> 