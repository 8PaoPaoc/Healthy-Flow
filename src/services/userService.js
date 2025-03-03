// 模拟用户数据存储
const STORAGE_KEY = 'health_management_users';
const CURRENT_USER_KEY = 'current_user';

// 模拟用户数据
const mockUser = {
  id: 1,
  name: '测试用户',
  email: 'test@example.com',
  avatar: '/images/default-avatar.png'
}

// 从 localStorage 获取当前用户状态
let currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY))

/**
 * 获取所有用户
 * @returns {Array} 用户列表
 */
function getUsers() {
  const users = localStorage.getItem(STORAGE_KEY);
  if (!users) {
    // 如果没有用户，创建一个测试用户
    createDefaultUser();
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  }
  return JSON.parse(users);
}

/**
 * 创建默认用户（用于测试）
 */
function createDefaultUser() {
  const defaultUser = {
    id: '1',
    username: 'test',
    email: 'test@example.com',
    password: 'password', // 实际项目中应当加密
    createdAt: new Date().toISOString(),
    profile: {
      avatar: null,
      bio: '测试用户',
      healthData: {
        weight: 70,
        height: 175,
        bloodType: 'O',
        allergies: []
      }
    }
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify([defaultUser]));
  console.log('创建了默认用户:', defaultUser.username);
}

/**
 * 保存用户列表
 * @param {Array} users 用户列表
 */
function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

/**
 * 根据用户名获取用户
 * @param {string} username 用户名
 * @returns {Object|null} 用户对象或null
 */
function getUserByUsername(username) {
  const users = getUsers();
  return users.find(user => user.username === username) || null;
}

/**
 * 根据邮箱获取用户
 * @param {string} email 邮箱
 * @returns {Object|null} 用户对象或null
 */
function getUserByEmail(email) {
  const users = getUsers();
  return users.find(user => user.email === email) || null;
}

/**
 * 获取当前登录用户
 * @returns {Object|null} 当前用户信息或null
 */
export function getCurrentUser() {
  return currentUser
}

/**
 * 用户登录
 * @param {string} email 邮箱
 * @param {string} password 密码
 * @returns {Promise<Object>} 用户信息
 */
export async function login(email, password) {
  // 模拟API调用
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  if (email === 'test@example.com' && password === 'password') {
    currentUser = mockUser
    // 持久化用户状态
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser))
    return currentUser
  }
  
  throw new Error('邮箱或密码错误')
}

/**
 * 用户注册
 * @param {Object} userData 用户数据
 * @returns {Promise<Object>} 用户信息
 */
export async function register(userData) {
  // 模拟API调用
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // 模拟成功注册
  currentUser = {
    ...mockUser,
    ...userData
  }
  
  // 持久化用户状态
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser))
  return currentUser
}

/**
 * 用户登出
 * @returns {Promise<void>}
 */
export async function logout() {
  // 模拟API调用
  await new Promise(resolve => setTimeout(resolve, 500))
  
  currentUser = null
  // 清除持久化的用户状态
  localStorage.removeItem(CURRENT_USER_KEY)
}

/**
 * 更新用户信息
 * @param {Object} userData 用户数据
 * @returns {Promise<Object>} 更新后的用户信息
 */
export async function updateUserProfile(userData) {
  // 模拟API调用
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  if (!currentUser) {
    throw new Error('用户未登录')
  }
  
  currentUser = {
    ...currentUser,
    ...userData
  }
  
  // 持久化更新后的用户状态
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser))
  return currentUser
}

/**
 * 更改密码
 * @param {string} oldPassword 旧密码
 * @param {string} newPassword 新密码
 * @returns {Promise<void>}
 */
export async function changePassword(oldPassword, newPassword) {
  // 模拟API调用
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  if (!currentUser) {
    throw new Error('用户未登录')
  }
  
  if (oldPassword !== 'password') {
    throw new Error('旧密码错误')
  }
  
  // 模拟成功更改密码
  return true
}

/**
 * 重置密码
 * @param {string} email 邮箱
 * @returns {Promise<void>}
 */
export async function resetPassword(email) {
  // 模拟API调用
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  if (email !== 'test@example.com') {
    throw new Error('邮箱不存在')
  }
  
  // 模拟发送重置密码邮件
  return true
}

/**
 * 验证重置密码令牌
 * @param {string} token 重置密码令牌
 * @returns {Promise<boolean>}
 */
export async function verifyResetToken(token) {
  // 模拟API调用
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // 模拟令牌验证
  return token === 'valid-token'
}

/**
 * 使用令牌重置密码
 * @param {string} token 重置密码令牌
 * @param {string} newPassword 新密码
 * @returns {Promise<void>}
 */
export async function resetPasswordWithToken(token, newPassword) {
  // 模拟API调用
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  if (token !== 'valid-token') {
    throw new Error('无效的重置密码令牌')
  }
  
  // 模拟成功重置密码
  return true
} 