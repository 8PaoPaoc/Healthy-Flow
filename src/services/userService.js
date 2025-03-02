// 模拟用户数据存储
const STORAGE_KEY = 'health_management_users';
const CURRENT_USER_KEY = 'current_user';

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
 * 用户注册
 * @param {Object} userData 用户数据
 * @returns {Promise<Object>} 注册结果
 */
export async function register(userData) {
  return new Promise((resolve, reject) => {
    // 模拟网络延迟
    setTimeout(() => {
      try {
        console.log('注册用户:', userData.username);
        
        // 检查用户名是否已存在
        if (getUserByUsername(userData.username)) {
          console.error('用户名已存在');
          return reject({ message: '用户名已存在' });
        }

        // 检查邮箱是否已存在
        if (getUserByEmail(userData.email)) {
          console.error('邮箱已被注册');
          return reject({ message: '邮箱已被注册' });
        }

        // 创建新用户
        const users = getUsers();
        const newUser = {
          id: Date.now().toString(),
          username: userData.username,
          email: userData.email,
          password: userData.password, // 实际项目中应当加密处理
          createdAt: new Date().toISOString(),
          profile: {
            avatar: null,
            bio: '',
            healthData: {
              weight: null,
              height: null,
              bloodType: null,
              allergies: []
            }
          }
        };

        // 保存用户
        users.push(newUser);
        saveUsers(users);
        console.log('用户注册成功:', newUser.username);

        // 返回用户信息（不含密码）
        const { password, ...userWithoutPassword } = newUser;
        resolve(userWithoutPassword);
      } catch (error) {
        console.error('注册错误:', error);
        reject({ message: '注册过程中发生错误' });
      }
    }, 800); // 模拟网络延迟
  });
}

/**
 * 用户登录
 * @param {string} username 用户名或邮箱
 * @param {string} password 密码
 * @returns {Promise<Object>} 登录结果
 */
export async function login(username, password) {
  return new Promise((resolve, reject) => {
    // 模拟网络延迟
    setTimeout(() => {
      try {
        console.log('尝试登录用户:', username);
        
        // 确保至少有一个用户存在
        const users = getUsers();
        console.log('当前用户数量:', users.length);
        
        // 查找用户
        let user = getUserByUsername(username);
        
        // 如果通过用户名没找到，尝试通过邮箱查找
        if (!user) {
          user = getUserByEmail(username);
        }

        console.log('查找到用户:', user ? '是' : '否');

        // 检查用户是否存在及密码是否正确
        if (!user || user.password !== password) {
          console.error('用户名或密码错误');
          return reject({ message: '用户名或密码错误' });
        }

        console.log('密码验证成功');
        
        // 登录成功，返回用户信息（不含密码）
        const { password: _, ...userWithoutPassword } = user;
        
        // 保存当前登录用户到localStorage
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
        console.log('用户信息已保存到localStorage');
        
        resolve(userWithoutPassword);
      } catch (error) {
        console.error('登录错误:', error);
        reject({ message: '登录过程中发生错误' });
      }
    }, 800); // 模拟网络延迟
  });
}

/**
 * 检查用户是否已登录
 * @returns {Object|null} 当前登录的用户或null
 */
export function getCurrentUser() {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  console.log('获取当前用户:', user ? '已登录' : '未登录');
  return user ? JSON.parse(user) : null;
}

/**
 * 用户登出
 */
export function logout() {
  console.log('用户登出');
  localStorage.removeItem(CURRENT_USER_KEY);
}

/**
 * 更新用户信息
 * @param {string} userId 用户ID
 * @param {Object} userData 要更新的用户数据
 * @returns {Promise<Object>} 更新结果
 */
export async function updateUserProfile(userId, userData) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const users = getUsers();
        const userIndex = users.findIndex(user => user.id === userId);
        
        if (userIndex === -1) {
          return reject({ message: '用户不存在' });
        }
        
        // 更新用户信息
        users[userIndex] = { ...users[userIndex], ...userData };
        saveUsers(users);
        
        // 如果更新的是当前登录用户，同时更新localStorage中的current_user
        const currentUser = getCurrentUser();
        if (currentUser && currentUser.id === userId) {
          const { password: _, ...userWithoutPassword } = users[userIndex];
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
        }
        
        const { password: __, ...updatedUser } = users[userIndex];
        resolve(updatedUser);
      } catch (error) {
        reject({ message: '更新用户信息时发生错误' });
      }
    }, 800);
  });
} 