import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types/user'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isAuthenticated = ref(!!token.value)

  // 登录
  async function login(credentials: { 
    username: string
    password: string
    rememberMe: boolean 
  }) {
    try {
      // TODO: 替换为实际的 API 调用
      const response = await mockLoginApi(credentials)
      
      const { user: userData, token: newToken } = response
      
      user.value = userData
      token.value = newToken
      isAuthenticated.value = true
      
      if (credentials.rememberMe) {
        localStorage.setItem('token', newToken)
      } else {
        sessionStorage.setItem('token', newToken)
      }
      
      return response
    } catch (error) {
      console.error('Login failed:', error)
      throw new Error('用户名或密码错误')
    }
  }

  // 登出
  async function logout() {
    try {
      // TODO: 替换为实际的 API 调用
      await mockLogoutApi()
      
      user.value = null
      token.value = null
      isAuthenticated.value = false
      
      localStorage.removeItem('token')
      sessionStorage.removeItem('token')
      
      ElMessage.success('已安全退出登录')
    } catch (error) {
      console.error('Logout failed:', error)
      throw new Error('退出登录失败')
    }
  }

  // 获取用户信息
  async function fetchUserInfo() {
    try {
      if (!token.value) return null
      
      // TODO: 替换为实际的 API 调用
      const userData = await mockGetUserInfo()
      user.value = userData
      return userData
    } catch (error) {
      console.error('Fetch user info failed:', error)
      throw new Error('获取用户信息失败')
    }
  }

  // 检查并恢复用户会话
  async function checkAuth() {
    const savedToken = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (savedToken) {
      token.value = savedToken
      isAuthenticated.value = true
      await fetchUserInfo()
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    fetchUserInfo,
    checkAuth
  }
})

// Mock API 函数 - 将来替换为实际的 API 调用
async function mockLoginApi(credentials: { username: string; password: string }) {
  // 模拟 API 延迟
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // 模拟验证
  if (credentials.username === 'admin' && credentials.password === '123456') {
    return {
      user: {
        id: 1,
        username: 'admin',
        name: '管理员',
        email: 'admin@example.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
      },
      token: 'mock_jwt_token'
    }
  }
  
  throw new Error('用户名或密码错误')
}

async function mockLogoutApi() {
  await new Promise(resolve => setTimeout(resolve, 500))
  return true
}

async function mockGetUserInfo() {
  await new Promise(resolve => setTimeout(resolve, 500))
  return {
    id: 1,
    username: 'admin',
    name: '管理员',
    email: 'admin@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
  }
} 