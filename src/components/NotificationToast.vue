<template>
  <div class="notifications-container">
    <transition-group name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="['notification', notification.type]"
        v-show="notification.show"
      >
        {{ notification.message }}
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useNotifications } from '@/services/notificationService'

const { notifications } = useNotifications()
</script>

<style scoped>
.notifications-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  pointer-events: none;
}

.notification {
  padding: 15px 25px;
  margin-bottom: 10px;
  border-radius: 8px;
  color: white;
  font-size: 0.9rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  pointer-events: auto;
}

.notification.success {
  background-color: #28a745;
}

.notification.error {
  background-color: #dc3545;
}

.notification.info {
  background-color: #17a2b8;
}

.notification.warning {
  background-color: #ffc107;
  color: #333;
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style> 