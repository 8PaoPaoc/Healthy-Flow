<template>
  <div class="dashboard-container">
    <!-- 用户信息卡片 -->
    <section class="user-profile-card">
      <div class="profile-header">
        <div class="avatar-container">
          <div class="avatar">
            <i class="fas fa-user-circle"></i>
          </div>
        </div>
        <div class="user-info">
          <h2 class="user-name">{{ user ? user.username : '加载中...' }}</h2>
          <p class="user-email">{{ user ? user.email : '' }}</p>
          <p class="join-date" v-if="user && user.createdAt">
            加入时间: {{ formatDate(user.createdAt) }}
          </p>
        </div>
      </div>
      <div class="profile-actions">
        <button class="btn btn-outline" @click="goToProfile">
          <i class="fas fa-user-edit"></i> 编辑资料
        </button>
        <button class="btn btn-outline btn-danger" @click="handleLogout">
          <i class="fas fa-sign-out-alt"></i> 退出登录
        </button>
      </div>
    </section>
    
    <!-- 健康模块导航 -->
    <h3 class="section-title">健康管理功能</h3>
    <section class="feature-cards">
      <div class="feature-card" @click="goToFeature('health-data')">
        <div class="feature-icon">
          <i class="fas fa-heartbeat"></i>
        </div>
        <h3>健康数据</h3>
        <p>记录和跟踪您的体重、血压等健康指标</p>
      </div>
      
      <div class="feature-card" @click="goToFeature('diet')">
        <div class="feature-icon">
          <i class="fas fa-apple-alt"></i>
        </div>
        <h3>饮食管理</h3>
        <p>获取健康饮食建议和个性化膳食计划</p>
      </div>
      
      <div class="feature-card" @click="goToFeature('exercise')">
        <div class="feature-icon">
          <i class="fas fa-running"></i>
        </div>
        <h3>运动记录</h3>
        <p>跟踪您的运动活动和锻炼计划</p>
      </div>
      
      <div class="feature-card" @click="goToFeature('reports')">
        <div class="feature-icon">
          <i class="fas fa-chart-line"></i>
        </div>
        <h3>健康报告</h3>
        <p>查看您的健康状况分析和趋势报告</p>
      </div>
    </section>
    
    <!-- 健康提示 -->
    <h3 class="section-title">今日健康提示</h3>
    <section class="health-tips">
      <div class="tip-card">
        <div class="tip-icon">
          <i class="fas fa-lightbulb"></i>
        </div>
        <div class="tip-content">
          <h4>保持水分</h4>
          <p>每天饮用8杯水有助于保持身体水分，提高新陈代谢。</p>
        </div>
      </div>
      
      <div class="tip-card">
        <div class="tip-icon">
          <i class="fas fa-bed"></i>
        </div>
        <div class="tip-content">
          <h4>充足睡眠</h4>
          <p>成年人每晚应保证7-9小时的睡眠，有助于恢复体力和增强免疫力。</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getCurrentUser, logout } from '../services/userService';
import { notifySuccess, notifyError, notifyWarning } from '../services/notificationService';

// 路由实例
const router = useRouter();

// 用户信息
const user = ref(null);

// 格式化日期
function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

// 跳转到个人资料页
function goToProfile() {
  notifyWarning('个人资料功能正在开发中');
  // 后续可以跳转到个人资料页面
  // router.push('/profile');
}

// 处理退出登录
function handleLogout() {
  try {
    logout();
    notifySuccess('您已成功退出登录');
    router.push('/login');
  } catch (error) {
    notifyError('退出登录时发生错误');
  }
}

// 跳转到功能页面
function goToFeature(feature) {
  notifyWarning(`${getFeatureName(feature)}功能正在开发中`);
  // 后续可以跳转到相应功能页面
  // router.push(`/${feature}`);
}

// 获取功能名称
function getFeatureName(feature) {
  const names = {
    'health-data': '健康数据',
    'diet': '饮食管理',
    'exercise': '运动记录',
    'reports': '健康报告'
  };
  return names[feature] || feature;
}

// 获取用户信息
onMounted(() => {
  // 检查用户是否已登录
  const currentUser = getCurrentUser();
  if (!currentUser) {
    notifyWarning('请先登录');
    router.push('/login');
    return;
  }
  
  user.value = currentUser;
});
</script>

<style scoped>
.dashboard-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 用户资料卡片 */
.user-profile-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  padding: 30px;
  margin-bottom: 30px;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.user-profile-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: var(--primary-gradient);
}

.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.avatar-container {
  margin-right: 25px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--primary-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2.5rem;
  box-shadow: 0 5px 15px rgba(62, 120, 255, 0.3);
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 5px;
}

.user-email {
  color: var(--text-secondary);
  font-size: 1rem;
  margin-bottom: 8px;
}

.join-date {
  color: var(--text-light);
  font-size: 0.9rem;
}

.profile-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

/* 按钮样式 */
.btn {
  border-radius: 12px;
  padding: 12px 20px;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
}

.btn-outline:hover {
  background: rgba(62, 120, 255, 0.1);
  transform: translateY(-2px);
}

.btn-danger {
  border-color: var(--danger-color);
  color: var(--danger-color);
}

.btn-danger:hover {
  background: rgba(220, 53, 69, 0.1);
}

/* 章节标题 */
.section-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 30px 0 20px;
  position: relative;
  display: inline-block;
  padding-bottom: 8px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60%;
  height: 3px;
  background: var(--primary-gradient);
  border-radius: 3px;
}

/* 功能卡片 */
.feature-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.92);
  border-radius: var(--border-radius-sm);
  padding: 25px;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  cursor: pointer;
  text-align: center;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(5px);
}

.feature-card::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--primary-gradient);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-md);
}

.feature-card:hover::after {
  transform: scaleX(1);
}

.feature-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(62, 120, 255, 0.1), rgba(108, 99, 255, 0.15));
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  font-size: 1.5rem;
  color: var(--primary-color);
  transition: all 0.3s ease;
}

.feature-card:hover .feature-icon {
  background: var(--primary-gradient);
  color: white;
  transform: scale(1.1);
}

.feature-card h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: var(--text-primary);
}

.feature-card p {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* 健康提示 */
.health-tips {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.tip-card {
  background: rgba(255, 255, 255, 0.92);
  border-radius: var(--border-radius-sm);
  padding: 20px;
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: flex-start;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
}

.tip-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.tip-icon {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.15), rgba(255, 159, 67, 0.2));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  flex-shrink: 0;
  font-size: 1.2rem;
  color: #ffc107;
}

.tip-content {
  flex: 1;
}

.tip-content h4 {
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.tip-content p {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .avatar-container {
    margin: 0 0 20px;
  }
  
  .profile-actions {
    justify-content: center;
  }
  
  .feature-cards {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

@media (max-width: 576px) {
  .dashboard-container {
    padding: 15px;
  }
  
  .user-profile-card {
    padding: 20px;
  }
  
  .btn {
    width: 100%;
  }
}
</style> 