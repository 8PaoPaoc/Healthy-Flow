<template>
  <div class="register-container">
    <div class="card register-card">
      <div class="card-body">
        <h4 class="card-title text-center mb-4">用户注册</h4>
        
        <!-- 注册表单 -->
        <form @submit.prevent="handleRegister" class="register-form">
          <!-- 用户名输入框 -->
          <div class="form-group">
            <label for="username">用户名</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="fas fa-user"></i>
              </span>
              <input
                type="text"
                id="username"
                v-model="formData.username"
                class="form-control"
                :class="{ 'is-invalid': errors.username }"
                placeholder="请输入用户名"
                required
                @input="validateUsername"
              >
            </div>
            <div class="invalid-feedback" v-if="errors.username">
              {{ errors.username }}
            </div>
          </div>

          <!-- 邮箱输入框 -->
          <div class="form-group">
            <label for="email">邮箱</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="fas fa-envelope"></i>
              </span>
              <input
                type="email"
                id="email"
                v-model="formData.email"
                class="form-control"
                :class="{ 'is-invalid': errors.email }"
                placeholder="请输入邮箱"
                required
                @input="validateEmail"
              >
            </div>
            <div class="invalid-feedback" v-if="errors.email">
              {{ errors.email }}
            </div>
          </div>

          <!-- 密码输入框 -->
          <div class="form-group">
            <label for="password">密码</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="fas fa-lock"></i>
              </span>
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="formData.password"
                class="form-control"
                :class="{ 'is-invalid': errors.password }"
                placeholder="请输入密码"
                required
                @input="validatePassword"
              >
              <button 
                type="button" 
                class="btn btn-outline-secondary"
                @click="togglePasswordVisibility"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <div class="invalid-feedback" v-if="errors.password">
              {{ errors.password }}
            </div>
          </div>

          <!-- 确认密码输入框 -->
          <div class="form-group">
            <label for="confirmPassword">确认密码</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="fas fa-lock"></i>
              </span>
              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                id="confirmPassword"
                v-model="formData.confirmPassword"
                class="form-control"
                :class="{ 'is-invalid': errors.confirmPassword }"
                placeholder="请再次输入密码"
                required
                @input="validateConfirmPassword"
              >
              <button 
                type="button" 
                class="btn btn-outline-secondary"
                @click="toggleConfirmPasswordVisibility"
              >
                <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <div class="invalid-feedback" v-if="errors.confirmPassword">
              {{ errors.confirmPassword }}
            </div>
          </div>

          <!-- 注册按钮 -->
          <button
            type="submit"
            class="btn btn-primary btn-block mt-4"
            :disabled="isLoading || !isFormValid"
          >
            <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
            {{ isLoading ? '注册中...' : '注册' }}
          </button>

          <!-- 错误提示 -->
          <div v-if="registerError" class="alert alert-danger mt-3">
            {{ registerError }}
          </div>
        </form>

        <!-- 返回登录 -->
        <div class="mt-3 text-center">
          <router-link to="/login" class="text-decoration-none">
            已有账号？返回登录
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/services/userService'
import { useNotification } from '@/services/notificationService'

// 路由实例
const router = useRouter()
const notification = useNotification()

// 表单数据
const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// 状态变量
const isLoading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const registerError = ref('')
const errors = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// 表单验证
const validateUsername = () => {
  if (!formData.username) {
    errors.username = '请输入用户名'
  } else if (formData.username.length < 3) {
    errors.username = '用户名至少需要3个字符'
  } else {
    errors.username = ''
  }
}

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formData.email) {
    errors.email = '请输入邮箱'
  } else if (!emailRegex.test(formData.email)) {
    errors.email = '请输入有效的邮箱地址'
  } else {
    errors.email = ''
  }
}

const validatePassword = () => {
  if (!formData.password) {
    errors.password = '请输入密码'
  } else if (formData.password.length < 6) {
    errors.password = '密码至少需要6个字符'
  } else {
    errors.password = ''
  }
  validateConfirmPassword()
}

const validateConfirmPassword = () => {
  if (!formData.confirmPassword) {
    errors.confirmPassword = '请确认密码'
  } else if (formData.confirmPassword !== formData.password) {
    errors.confirmPassword = '两次输入的密码不一致'
  } else {
    errors.confirmPassword = ''
  }
}

// 计算属性：表单是否有效
const isFormValid = computed(() => {
  return formData.username && 
         formData.email &&
         formData.password && 
         formData.confirmPassword &&
         !errors.username && 
         !errors.email &&
         !errors.password &&
         !errors.confirmPassword
})

// 切换密码可见性
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

// 处理注册
const handleRegister = async () => {
  try {
    // 重置错误
    registerError.value = ''
    
    // 表单验证
    validateUsername()
    validateEmail()
    validatePassword()
    validateConfirmPassword()
    if (!isFormValid.value) return

    // 设置加载状态
    isLoading.value = true

    // 调用注册API
    await register({
      username: formData.username,
      email: formData.email,
      password: formData.password
    })

    // 注册成功提示
    notification.success('注册成功')

    // 跳转到登录页
    router.push('/login')
  } catch (error) {
    console.error('注册失败:', error)
    registerError.value = error.message || '注册失败，请稍后重试'
    notification.error(registerError.value)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.register-container {
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  padding: 20px;
}

.register-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  transition: transform 0.3s ease;
}

.register-card:hover {
  transform: translateY(-5px);
}

.card-title {
  color: var(--primary-color);
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
  position: relative;
}

.input-group {
  position: relative;
  margin-top: 0.5rem;
}

.input-group-text {
  background: transparent;
  border-right: none;
  color: #6c757d;
}

.form-control {
  border-left: none;
  padding: 0.75rem 1rem;
  height: auto;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-control:focus {
  box-shadow: none;
  border-color: #ced4da;
}

.btn-primary {
  padding: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.btn-primary:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
}

.btn-primary:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.alert {
  border-radius: 10px;
  font-size: 0.9rem;
}

.invalid-feedback {
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.register-form {
  animation: fadeIn 0.5s ease-out;
}
</style> 