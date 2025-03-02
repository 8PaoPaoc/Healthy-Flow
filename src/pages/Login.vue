<template>
  <div class="login-container">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">用户登录</h5>
        
        <form id="login-form" @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="username">用户名或邮箱</label>
            <input 
              type="text" 
              class="form-control" 
              id="username" 
              v-model="loginForm.username"
              placeholder="请输入用户名或邮箱" 
              required
              :disabled="isLoading"
            >
          </div>
          
          <div class="form-group">
            <label for="password">密码</label>
            <input 
              type="password" 
              class="form-control" 
              id="password" 
              v-model="loginForm.password"
              placeholder="请输入密码" 
              required
              :disabled="isLoading"
            >
          </div>
          
          <div class="form-options">
            <div class="form-check">
              <input 
                type="checkbox" 
                class="form-check-input" 
                id="rememberMe" 
                v-model="loginForm.rememberMe"
              >
              <label class="form-check-label" for="rememberMe">记住我</label>
            </div>
            <a href="#" class="forgot-password" @click.prevent="handleForgotPassword">忘记密码?</a>
          </div>

          <!-- 调试信息 -->
          <div v-if="loginError" class="login-error">
            <p>{{ loginError }}</p>
          </div>
          
          <button 
            type="submit" 
            class="btn btn-primary btn-block"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">
              <i class="fas fa-sign-in-alt btn-icon"></i> 登录
            </span>
            <span v-else>
              <i class="fas fa-spinner fa-spin"></i> 登录中...
            </span>
          </button>
        </form>
        
        <!-- 注册按钮，在8086端口不显示 -->
        <div v-if="showRegisterButton" class="register-button-container">
          <button class="btn btn-outline" @click="goToRegister">
            <i class="fas fa-user-plus"></i> 没有账号? 注册
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { login, getCurrentUser } from '../services/userService';
import { notifySuccess, notifyError, notifyInfo, notifyWarning } from '../services/notificationService';

// 路由实例
const router = useRouter();
const route = useRoute();

// 判断是否使用简洁模式（在8089端口）
const isSimpleMode = computed(() => {
  return route.meta.simpleMode || window.location.port === '8089';
});

// 是否隐藏注册表单（在8090端口）
const hideRegisterForm = computed(() => {
  return route.meta.hideRegisterForm || window.location.port === '8090';
});

// 控制是否显示注册按钮
const showRegisterButton = computed(() => {
  // 在8086端口或简洁模式下不显示注册按钮
  // 在8090端口也不显示注册按钮（避免显示注册表单）
  return window.location.port !== '8086' && !isSimpleMode.value && !hideRegisterForm.value;
});

// 登录错误信息
const loginError = ref('');

// 表单数据
const loginForm = reactive({
  username: '',
  password: '',
  rememberMe: false
});

// 加载状态
const isLoading = ref(false);

// 处理登录
async function handleLogin() {
  if (isLoading.value) return;
  
  loginError.value = ''; // 清除之前的错误信息
  
  try {
    isLoading.value = true;
    
    console.log('尝试登录:', loginForm.username);
    
    // 调用登录服务
    const user = await login(loginForm.username, loginForm.password);
    
    // 登录成功提示
    notifySuccess(`欢迎回来，${user.username}!`);
    console.log('登录成功:', user);
    
    // 清空表单
    loginForm.password = '';
    
    // 登录成功后跳转到仪表盘页面
    setTimeout(() => {
      router.push('/dashboard');
    }, 1000);
    
  } catch (error) {
    // 显示错误消息
    console.error('登录失败:', error);
    loginError.value = error.message || '登录失败，请稍后再试';
    notifyError(loginError.value);
  } finally {
    isLoading.value = false;
  }
}

// 处理忘记密码
function handleForgotPassword() {
  notifyInfo('密码重置功能即将推出');
}

// 跳转到注册页面
function goToRegister() {
  router.push('/register');
}

// 检查用户是否已登录
onMounted(() => {
  console.log('检查用户登录状态');
  const currentUser = getCurrentUser();
  console.log('当前用户:', currentUser);
  
  if (currentUser) {
    // 用户已登录，跳转到仪表盘
    console.log('用户已登录，跳转到仪表盘');
    router.push('/dashboard');
  }
});
</script>

<style scoped>
/* 精确匹配图片中样式 */
.login-container {
  width: 100%;
  max-width: 450px;
  margin: 20px auto;
}

.card {
  background: #fff;
  border: none;
  border-radius: 20px;
  box-shadow: v-bind('isSimpleMode ? "none" : "0 4px 15px rgba(0, 0, 0, 0.05)"');
  overflow: hidden;
  position: relative;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: v-bind('isSimpleMode ? "transparent" : "linear-gradient(90deg, #3E78FF, #6C63FF)"');
}

.card-body {
  padding: 30px 40px;
}

.card-title {
  color: #333;
  font-weight: 600;
  margin-bottom: 30px;
  font-size: 1.4rem;
  text-align: center;
  position: relative;
}

.card-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 25%;
  width: 50%;
  height: 2px;
  background: linear-gradient(90deg, #3E78FF, #6C63FF);
}

.form-group {
  margin-bottom: 25px;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 12px;
  color: #555;
  font-size: 0.95rem;
}

.form-control {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 12px 15px;
  width: 100%;
  font-size: 1rem;
  background-color: rgba(248, 249, 250, 0.5);
}

.form-control:focus {
  border-color: #3E78FF;
  box-shadow: 0 0 0 3px rgba(62, 120, 255, 0.1);
  outline: none;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.form-check {
  display: flex;
  align-items: center;
}

.form-check-input {
  margin-right: 8px;
}

.forgot-password {
  color: #3E78FF;
  text-decoration: none;
  font-size: 0.9rem;
}

.btn {
  display: block;
  width: 100%;
  padding: 12px;
  font-weight: 500;
  text-align: center;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 15px;
}

.btn-primary {
  background: linear-gradient(90deg, #4365FA, #5D5FEF);
  color: white;
  border: none;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(93, 95, 239, 0.3);
}

.register-button-container {
  margin-top: 25px;
  text-align: center;
  padding-top: 15px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.btn-outline {
  background: transparent;
  border: 1px solid #3E78FF;
  color: #3E78FF;
}

.btn-outline:hover {
  background: rgba(62, 120, 255, 0.05);
}

.login-error {
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 0.9rem;
  text-align: center;
}

.btn-icon {
  margin-right: 8px;
}

/* 移动端适配 */
@media (max-width: 576px) {
  .card-body {
    padding: 25px 20px;
  }
}
</style> 