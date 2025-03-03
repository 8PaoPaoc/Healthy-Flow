<template>
  <div class="health-record-container">
    <div class="page-header">
      <h1>健康记录</h1>
      <button class="btn-add" @click="showAddRecordModal = true">
        <i class="fas fa-plus"></i> 添加记录
      </button>
    </div>

    <!-- 数据卡片 -->
    <div class="stats-grid">
      <div v-for="stat in healthStats" :key="stat.id" class="stat-card">
        <div class="stat-header">
          <i :class="['stat-icon', stat.icon]"></i>
          <h3>{{ stat.title }}</h3>
        </div>
        <div class="stat-body">
          <span class="stat-value">{{ stat.value }}</span>
          <span class="stat-unit">{{ stat.unit }}</span>
        </div>
        <div class="stat-footer">
          <span :class="['trend', stat.trend]">
            <i :class="getTrendIcon(stat.trend)"></i>
            {{ stat.change }}
          </span>
          <span class="trend-period">较上周</span>
        </div>
      </div>
    </div>

    <!-- 历史记录图表 -->
    <div class="chart-section">
      <div class="chart-header">
        <h2>历史趋势</h2>
        <div class="chart-controls">
          <select v-model="selectedMetric" class="metric-select">
            <option value="weight">体重</option>
            <option value="bloodPressure">血压</option>
            <option value="heartRate">心率</option>
            <option value="bloodSugar">血糖</option>
          </select>
          <select v-model="timeRange" class="time-range-select">
            <option value="week">近一周</option>
            <option value="month">近一月</option>
            <option value="year">近一年</option>
          </select>
        </div>
      </div>
      <div class="chart-container">
        <!-- 这里将来添加图表组件 -->
        <div class="placeholder-chart">
          图表区域 - 开发中
        </div>
      </div>
    </div>

    <!-- 添加记录模态框 -->
    <Teleport to="body">
      <div v-if="showAddRecordModal" class="modal-backdrop" @click="showAddRecordModal = false">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>添加健康记录</h2>
            <button class="btn-close" @click="showAddRecordModal = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit" class="record-form">
              <div class="form-group">
                <label for="recordType">记录类型</label>
                <select id="recordType" v-model="form.type" class="form-control">
                  <option value="weight">体重</option>
                  <option value="bloodPressure">血压</option>
                  <option value="heartRate">心率</option>
                  <option value="bloodSugar">血糖</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="value">数值</label>
                <input
                  type="number"
                  id="value"
                  v-model="form.value"
                  class="form-control"
                  step="0.1"
                  required
                >
              </div>

              <div class="form-group">
                <label for="date">记录时间</label>
                <input
                  type="datetime-local"
                  id="date"
                  v-model="form.date"
                  class="form-control"
                  required
                >
              </div>

              <div class="form-group">
                <label for="notes">备注</label>
                <textarea
                  id="notes"
                  v-model="form.notes"
                  class="form-control"
                  rows="3"
                ></textarea>
              </div>

              <div class="form-actions">
                <button type="button" class="btn-cancel" @click="showAddRecordModal = false">
                  取消
                </button>
                <button type="submit" class="btn-submit" :disabled="isSubmitting">
                  <span v-if="isSubmitting" class="spinner"></span>
                  {{ isSubmitting ? '保存中...' : '保存' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useNotification } from '@/services/notificationService'

const notification = useNotification()

// 模态框状态
const showAddRecordModal = ref(false)
const isSubmitting = ref(false)

// 表单数据
const form = reactive({
  type: 'weight',
  value: '',
  date: new Date().toISOString().slice(0, 16),
  notes: ''
})

// 图表控制
const selectedMetric = ref('weight')
const timeRange = ref('week')

// 模拟健康统计数据
const healthStats = [
  {
    id: 1,
    title: '体重',
    value: '65.5',
    unit: 'kg',
    icon: 'fas fa-weight',
    trend: 'down',
    change: '-0.5kg'
  },
  {
    id: 2,
    title: '血压',
    value: '120/80',
    unit: 'mmHg',
    icon: 'fas fa-heart',
    trend: 'stable',
    change: '持平'
  },
  {
    id: 3,
    title: '心率',
    value: '75',
    unit: 'bpm',
    icon: 'fas fa-heartbeat',
    trend: 'up',
    change: '+3bpm'
  },
  {
    id: 4,
    title: '血糖',
    value: '5.6',
    unit: 'mmol/L',
    icon: 'fas fa-tint',
    trend: 'down',
    change: '-0.2'
  }
]

// 获取趋势图标
function getTrendIcon(trend) {
  const icons = {
    up: 'fas fa-arrow-up',
    down: 'fas fa-arrow-down',
    stable: 'fas fa-equals'
  }
  return icons[trend] || icons.stable
}

// 处理表单提交
async function handleSubmit() {
  try {
    isSubmitting.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    notification.success('记录添加成功')
    showAddRecordModal.value = false
    
    // 重置表单
    form.value = ''
    form.notes = ''
    form.date = new Date().toISOString().slice(0, 16)
  } catch (error) {
    notification.error('添加记录失败，请重试')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.health-record-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  margin: 0;
  color: #2c3e50;
  font-size: 2rem;
}

.btn-add {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-add:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.stat-icon {
  font-size: 1.5rem;
  color: #3b82f6;
}

.stat-header h3 {
  margin: 0;
  color: #4b5563;
  font-size: 1.1rem;
  font-weight: 500;
}

.stat-body {
  margin-bottom: 1rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 600;
  color: #1f2937;
}

.stat-unit {
  font-size: 1rem;
  color: #6b7280;
  margin-left: 0.5rem;
}

.stat-footer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.trend.up {
  color: #ef4444;
}

.trend.down {
  color: #10b981;
}

.trend.stable {
  color: #6b7280;
}

.trend-period {
  color: #6b7280;
  font-size: 0.9rem;
}

.chart-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.chart-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.chart-controls {
  display: flex;
  gap: 1rem;
}

.metric-select,
.time-range-select {
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  color: #4b5563;
  font-size: 0.95rem;
}

.chart-container {
  width: 100%;
  height: 400px;
}

.placeholder-chart {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  border-radius: 8px;
  color: #6b7280;
  font-size: 1.1rem;
}

/* 模态框样式 */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.btn-close {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1.2rem;
  transition: color 0.2s;
}

.btn-close:hover {
  color: #4b5563;
}

.modal-body {
  padding: 1.5rem;
}

.record-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #4b5563;
  font-weight: 500;
}

.form-control {
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-control:focus {
  outline: none;
  border-color: #3b82f6;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-cancel,
.btn-submit {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: #f3f4f6;
  border: none;
  color: #4b5563;
}

.btn-cancel:hover {
  background: #e5e7eb;
}

.btn-submit {
  background: #3b82f6;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-submit:hover:not(:disabled) {
  background: #2563eb;
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid #ffffff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .health-record-container {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .btn-add {
    width: 100%;
    justify-content: center;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .chart-header {
    flex-direction: column;
    gap: 1rem;
  }

  .chart-controls {
    width: 100%;
  }

  .metric-select,
  .time-range-select {
    flex: 1;
  }
}
</style> 