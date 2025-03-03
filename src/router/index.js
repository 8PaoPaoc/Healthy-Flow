import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue'
import Dashboard from '@/pages/Dashboard.vue'
import { getCurrentUser } from '../services/userService'
import { notifyWarning } from '../services/notificationService'

// 路由配置
const routes = [
  {
    path: '/',
    redirect: '/dashboard'
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
  },
  {
    path: '/health-record',
    name: 'HealthRecord',
    component: () => import('@/pages/HealthRecord.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/exercise-plan',
    name: 'ExercisePlan',
    component: () => import('@/pages/ExercisePlan.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/diet-record',
    name: 'DietRecord',
    component: () => import('@/pages/DietRecord.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/sleep-analysis',
    name: 'SleepAnalysis',
    component: () => import('@/pages/SleepAnalysis.vue'),
    meta: {
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
  
  const port = window.location.port
  
  // 处理不同端口的特殊逻辑
  if (port === '8086' && to.path === '/register') {
    console.log('在8086端口禁止访问注册页面，重定向到登录页面');
    next('/login');
  } else if (port === '8087' && to.path === '/register') {
    console.log('在8087端口访问注册页面，清空界面功能');
    to.meta.emptyContent = true;
    next();
  } else if (port === '8089') {
    console.log('在8089端口访问登录页面，使用简洁模式');
    to.meta.simpleMode = true;
    next();
  } else if (port === '8090') {
    console.log('在8090端口访问登录页面，隐藏注册表单');
    to.meta.hideRegisterForm = true;
    next();
  } else {
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
  }
});

export default router 