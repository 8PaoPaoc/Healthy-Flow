import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Dashboard from '../pages/Dashboard.vue'
import { getCurrentUser } from '../services/userService'
import { notifyWarning } from '../services/notificationService'

// 路由配置
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { 
      title: '登录 - 健康管理系统',
      requiresAuth: false
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { 
      title: '注册 - 健康管理系统',
      requiresAuth: false
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { 
      title: '仪表盘 - 健康管理系统',
      requiresAuth: true
    }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局导航守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title || 'HealthyFlow - 健康管理系统';
  
  // 完全禁用在8086端口访问注册页面
  if (window.location.port === '8086' && to.path === '/register') {
    console.log('在8086端口禁止访问注册页面，重定向到登录页面');
    next('/login');
    return;
  }
  
  // 8087端口访问注册页面时，保持路径但内容清空（通过meta标记处理）
  if (window.location.port === '8087' && to.path === '/register') {
    console.log('在8087端口访问注册页面，清空界面功能');
    to.meta.emptyContent = true;
    next();
    return;
  }
  
  // 8089端口访问登录页面时，不显示背景图片等装饰元素
  if (window.location.port === '8089' && to.path === '/login') {
    console.log('在8089端口访问登录页面，使用简洁模式');
    to.meta.simpleMode = true;
    next();
    return;
  }
  
  // 8090端口访问登录页面时，不显示下方的注册表单
  if (window.location.port === '8090' && to.path === '/login') {
    console.log('在8090端口访问登录页面，隐藏注册表单');
    to.meta.hideRegisterForm = true;
    next();
    return;
  }
  
  // 检查用户是否已登录
  const currentUser = getCurrentUser();
  
  // 检查路由是否需要认证
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  if (requiresAuth && !currentUser) {
    // 需要认证但用户未登录，重定向到登录页面
    console.log('需要认证但用户未登录，重定向到登录页面');
    next('/login');
  } else if ((to.path === '/login' || to.path === '/register') && currentUser) {
    // 用户已登录，尝试访问登录或注册页面，重定向到仪表盘
    console.log('用户已登录，尝试访问登录或注册页面，重定向到仪表盘');
    next('/dashboard');
  } else {
    // 其他情况，允许访问
    next();
  }
});

export default router 