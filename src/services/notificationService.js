import { ref } from 'vue';

// 通知状态
const notifications = ref([]);

// 通知类型枚举
export const NotificationType = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning'
};

/**
 * 创建一个新通知
 * @param {string} message 通知消息
 * @param {string} type 通知类型
 * @param {number} duration 显示时长(毫秒)
 * @returns {string} 通知ID
 */
export function notify(message, type = NotificationType.INFO, duration = 3000) {
  const id = Date.now().toString();
  
  // 创建新通知
  const notification = {
    id,
    message,
    type,
    show: true,
    createdAt: new Date()
  };
  
  // 添加到通知列表
  notifications.value.push(notification);
  
  // 设置自动关闭计时器
  if (duration > 0) {
    setTimeout(() => {
      closeNotification(id);
    }, duration);
  }
  
  return id;
}

/**
 * 关闭指定ID的通知
 * @param {string} id 通知ID
 */
export function closeNotification(id) {
  const index = notifications.value.findIndex(notif => notif.id === id);
  if (index !== -1) {
    // 标记为隐藏
    notifications.value[index].show = false;
    
    // 动画完成后删除
    setTimeout(() => {
      notifications.value = notifications.value.filter(notif => notif.id !== id);
    }, 300);
  }
}

/**
 * 成功通知快捷方法
 * @param {string} message 消息内容
 * @param {number} duration 显示时长(毫秒)
 * @returns {string} 通知ID
 */
export function notifySuccess(message, duration = 3000) {
  return notify(message, NotificationType.SUCCESS, duration);
}

/**
 * 错误通知快捷方法
 * @param {string} message 消息内容
 * @param {number} duration 显示时长(毫秒)
 * @returns {string} 通知ID
 */
export function notifyError(message, duration = 4000) {
  return notify(message, NotificationType.ERROR, duration);
}

/**
 * 信息通知快捷方法
 * @param {string} message 消息内容
 * @param {number} duration 显示时长(毫秒)
 * @returns {string} 通知ID
 */
export function notifyInfo(message, duration = 3000) {
  return notify(message, NotificationType.INFO, duration);
}

/**
 * 警告通知快捷方法
 * @param {string} message 消息内容
 * @param {number} duration 显示时长(毫秒)
 * @returns {string} 通知ID
 */
export function notifyWarning(message, duration = 3500) {
  return notify(message, NotificationType.WARNING, duration);
}

// 导出通知列表(响应式)
export function useNotifications() {
  return { notifications };
} 