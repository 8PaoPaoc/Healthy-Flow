import axios from 'axios'

// 创建axios实例
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 在这里可以添加认证信息等
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // 统一处理错误
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 处理未授权错误
          break
        case 403:
          // 处理禁止访问错误
          break
        case 404:
          // 处理未找到错误
          break
        case 500:
          // 处理服务器错误
          break
        default:
          // 处理其他错误
          break
      }
    }
    return Promise.reject(error)
  }
)

export default api 