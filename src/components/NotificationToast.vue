<template>
  <div class="notification-container">
    <transition-group name="toast">
      <div 
        v-for="notification in notifications" 
        :key="notification.id"
        :class="['notification-toast', `notification-${notification.type}`]"
        v-show="notification.show"
      >
        <div class="notification-icon">
          <i :class="getIconClass(notification.type)"></i>
        </div>
        <div class="notification-content">
          <div class="notification-message">{{ notification.message }}</div>
        </div>
        <button class="notification-close" @click="closeNotification(notification.id)">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useNotifications, closeNotification, NotificationType } from '../services/notificationService';

// 获取通知列表
const { notifications } = useNotifications();

// 根据通知类型获取对应图标
function getIconClass(type) {
  switch (type) {
    case NotificationType.SUCCESS:
      return 'fas fa-check-circle';
    case NotificationType.ERROR:
      return 'fas fa-exclamation-circle';
    case NotificationType.WARNING:
      return 'fas fa-exclamation-triangle';
    case NotificationType.INFO:
    default:
      return 'fas fa-info-circle';
  }
}
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  pointer-events: none;
}

.notification-toast {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 12px 16px;
  margin-bottom: 12px;
  width: 300px;
  max-width: 90vw;
  pointer-events: auto;
  overflow: hidden;
  position: relative;
  animation: slide-in 0.3s ease-out forwards;
}

.notification-icon {
  margin-right: 12px;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-content {
  flex: 1;
}

.notification-message {
  font-size: 0.95rem;
  color: var(--text-primary);
  line-height: 1.4;
}

.notification-close {
  background: transparent;
  border: none;
  padding: 4px;
  margin-left: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-close:hover {
  opacity: 1;
}

/* 通知类型样式 */
.notification-success .notification-icon {
  color: var(--success-color);
}

.notification-error .notification-icon {
  color: var(--danger-color);
}

.notification-warning .notification-icon {
  color: var(--warning-color);
}

.notification-info .notification-icon {
  color: var(--info-color);
}

/* 通知类型边框 */
.notification-success {
  border-left: 4px solid var(--success-color);
}

.notification-error {
  border-left: 4px solid var(--danger-color);
}

.notification-warning {
  border-left: 4px solid var(--warning-color);
}

.notification-info {
  border-left: 4px solid var(--info-color);
}

/* 通知动画 */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease-out;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(60px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}

@keyframes slide-in {
  from {
    transform: translateX(60px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 移动端适配 */
@media (max-width: 480px) {
  .notification-container {
    right: 10px;
    left: 10px;
    align-items: stretch;
  }
  
  .notification-toast {
    width: 100%;
  }
}
</style> 