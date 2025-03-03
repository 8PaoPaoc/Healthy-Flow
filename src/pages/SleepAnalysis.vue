<template>
  <div class="sleep-analysis-container">
    <div class="page-header">
      <h1>睡眠分析</h1>
      <button class="btn-add" @click="showAddRecordModal = true">
        <i class="fas fa-plus"></i> 添加记录
      </button>
    </div>

    <!-- 睡眠概览 -->
    <div class="stats-grid">
      <div v-for="stat in sleepStats" :key="stat.id" class="stat-card">
        <div class="stat-header">
          <i :class="['stat-icon', stat.icon]"></i>
          <h3>{{ stat.title }}</h3>
        </div>
        <div class="stat-body">
          <span class="stat-value">{{ stat.value }}</span>
          <span class="stat-unit">{{ stat.unit }}</span>
        </div>
        <div class="stat-footer">
          <span class="trend" :class="stat.trend">
            <i :class="['fas', stat.trend === 'up' ? 'fa-arrow-up' : 'fa-arrow-down']"></i>
            {{ stat.change }}
          </span>
        </div>
      </div>
    </div>

    <!-- 睡眠质量图表 -->
    <div class="chart-section">
      <div class="section-header">
        <h2>睡眠质量趋势</h2>
        <div class="date-range">
          <button 
            v-for="range in dateRanges" 
            :key="range.value"
            :class="['range-btn', { active: selectedRange === range.value }]"
            @click="selectedRange = range.value"
          >
            {{ range.label }}
          </button>
        </div>
      </div>
      <div class="chart-container">
        <!-- 这里将集成睡眠质量趋势图表 -->
        <div class="chart-placeholder">
          <i class="fas fa-chart-line"></i>
          <p>睡眠质量趋势图表</p>
        </div>
      </div>
    </div>

    <!-- 睡眠记录列表 -->
    <div class="records-section">
      <div class="section-header">
        <h2>睡眠记录</h2>
        <div class="filters">
          <select v-model="qualityFilter" class="filter-select">
            <option value="">全部质量</option>
            <option value="good">良好</option>
            <option value="normal">一般</option>
            <option value="poor">欠佳</option>
          </select>
        </div>
      </div>

      <div class="sleep-records">
        <div v-for="record in sleepRecords" :key="record.id" class="record-card">
          <div class="record-header">
            <div class="date-info">
              <span class="date">{{ record.date }}</span>
              <span class="quality-badge" :class="record.quality">
                {{ record.qualityText }}
              </span>
            </div>
            <button class="btn-delete" @click="deleteRecord(record.id)">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
          
          <div class="sleep-time">
            <div class="time-item">
              <i class="fas fa-bed"></i>
              <div class="time-details">
                <span class="label">就寝时间</span>
                <span class="value">{{ record.bedTime }}</span>
              </div>
            </div>
            <div class="time-separator">
              <i class="fas fa-arrow-right"></i>
            </div>
            <div class="time-item">
              <i class="fas fa-sun"></i>
              <div class="time-details">
                <span class="label">起床时间</span>
                <span class="value">{{ record.wakeTime }}</span>
              </div>
            </div>
          </div>

          <div class="sleep-details">
            <div class="detail-item">
              <span class="label">总睡眠</span>
              <span class="value">{{ record.duration }}</span>
            </div>
            <div class="detail-item">
              <span class="label">深睡比例</span>
              <span class="value">{{ record.deepSleepRatio }}%</span>
            </div>
            <div class="detail-item">
              <span class="label">清醒次数</span>
              <span class="value">{{ record.wakeCount }}次</span>
            </div>
          </div>

          <div class="record-notes" v-if="record.notes">
            <i class="fas fa-sticky-note"></i>
            <p>{{ record.notes }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加记录模态框 -->
    <Teleport to="body">
      <div v-if="showAddRecordModal" class="modal-backdrop" @click="showAddRecordModal = false">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>添加睡眠记录</h2>
            <button class="btn-close" @click="showAddRecordModal = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit" class="record-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="bedTime">就寝时间</label>
                  <input
                    type="time"
                    id="bedTime"
                    v-model="form.bedTime"
                    class="form-control"
                    required
                  >
                </div>
                <div class="form-group">
                  <label for="wakeTime">起床时间</label>
                  <input
                    type="time"
                    id="wakeTime"
                    v-model="form.wakeTime"
                    class="form-control"
                    required
                  >
                </div>
              </div>

              <div class="form-group">
                <label for="quality">睡眠质量</label>
                <select id="quality" v-model="form.quality" class="form-control" required>
                  <option value="good">良好</option>
                  <option value="normal">一般</option>
                  <option value="poor">欠佳</option>
                </select>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="deepSleepRatio">深睡比例</label>
                  <div class="input-with-unit">
                    <input
                      type="number"
                      id="deepSleepRatio"
                      v-model="form.deepSleepRatio"
                      class="form-control"
                      min="0"
                      max="100"
                      required
                    >
                    <span class="unit">%</span>
                  </div>
                </div>
                <div class="form-group">
                  <label for="wakeCount">清醒次数</label>
                  <input
                    type="number"
                    id="wakeCount"
                    v-model="form.wakeCount"
                    class="form-control"
                    min="0"
                    required
                  >
                </div>
              </div>

              <div class="form-group">
                <label for="notes">备注</label>
                <textarea
                  id="notes"
                  v-model="form.notes"
                  class="form-control"
                  rows="3"
                  placeholder="记录影响睡眠的因素，如咖啡因摄入、运动、压力等..."
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

// 日期范围选项
const dateRanges = [
  { label: '周', value: 'week' },
  { label: '月', value: 'month' },
  { label: '年', value: 'year' }
]
const selectedRange = ref('week')

// 质量筛选
const qualityFilter = ref('')

// 表单数据
const form = reactive({
  bedTime: '22:00',
  wakeTime: '06:00',
  quality: 'good',
  deepSleepRatio: 25,
  wakeCount: 0,
  notes: ''
})

// 睡眠统计数据
const sleepStats = [
  {
    id: 1,
    title: '平均睡眠时长',
    value: '7.5',
    unit: '小时',
    icon: 'fas fa-moon',
    trend: 'up',
    change: '+0.5小时'
  },
  {
    id: 2,
    title: '平均深睡比例',
    value: '25',
    unit: '%',
    icon: 'fas fa-bed',
    trend: 'up',
    change: '+2%'
  },
  {
    id: 3,
    title: '平均入睡时间',
    value: '22:30',
    unit: '',
    icon: 'fas fa-clock',
    trend: 'down',
    change: '提前30分钟'
  },
  {
    id: 4,
    title: '睡眠质量评分',
    value: '85',
    unit: '分',
    icon: 'fas fa-star',
    trend: 'up',
    change: '+5分'
  }
]

// 睡眠记录数据
const sleepRecords = [
  {
    id: 1,
    date: '2024-03-20',
    bedTime: '22:30',
    wakeTime: '06:30',
    duration: '8小时',
    quality: 'good',
    qualityText: '良好',
    deepSleepRatio: 28,
    wakeCount: 1,
    notes: '今天运动后睡眠质量明显提升'
  },
  {
    id: 2,
    date: '2024-03-19',
    bedTime: '23:00',
    wakeTime: '06:00',
    duration: '7小时',
    quality: 'normal',
    qualityText: '一般',
    deepSleepRatio: 22,
    wakeCount: 2,
    notes: '晚上工作到较晚，睡眠质量受到影响'
  },
  {
    id: 3,
    date: '2024-03-18',
    bedTime: '23:30',
    wakeTime: '07:00',
    duration: '7.5小时',
    quality: 'poor',
    qualityText: '欠佳',
    deepSleepRatio: 18,
    wakeCount: 4,
    notes: '咖啡喝得太晚，影响入睡'
  }
]

// 删除记录
function deleteRecord(id) {
  // TODO: 实现删除记录功能
  notification.success('记录已删除')
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
    form.notes = ''
    form.wakeCount = 0
    form.deepSleepRatio = 25
  } catch (error) {
    notification.error('添加记录失败，请重试')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.sleep-analysis-container {
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
}

.trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
}

.trend.up {
  color: #10b981;
}

.trend.down {
  color: #ef4444;
}

.chart-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.date-range {
  display: flex;
  gap: 0.5rem;
}

.range-btn {
  background: none;
  border: 1px solid #e5e7eb;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.range-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.range-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.chart-container {
  height: 300px;
  width: 100%;
}

.chart-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
}

.chart-placeholder i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.records-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.filters {
  display: flex;
  gap: 1rem;
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #4b5563;
  background: white;
}

.sleep-records {
  display: grid;
  gap: 1rem;
}

.record-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.date-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.date {
  color: #1f2937;
  font-weight: 500;
}

.quality-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
}

.quality-badge.good {
  background: #d1fae5;
  color: #059669;
}

.quality-badge.normal {
  background: #fef3c7;
  color: #d97706;
}

.quality-badge.poor {
  background: #fee2e2;
  color: #dc2626;
}

.btn-delete {
  background: none;
  border: none;
  color: #ef4444;
  padding: 0.5rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.btn-delete:hover {
  opacity: 1;
}

.sleep-time {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
}

.time-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.time-item i {
  color: #3b82f6;
  font-size: 1.25rem;
}

.time-details {
  display: flex;
  flex-direction: column;
}

.time-separator {
  color: #9ca3af;
}

.sleep-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.label {
  color: #6b7280;
  font-size: 0.875rem;
}

.value {
  color: #1f2937;
  font-weight: 500;
}

.record-notes {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
}

.record-notes i {
  color: #9ca3af;
}

.record-notes p {
  margin: 0;
  color: #4b5563;
  font-size: 0.875rem;
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

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
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

.input-with-unit {
  position: relative;
}

.input-with-unit .form-control {
  padding-right: 2.5rem;
}

.input-with-unit .unit {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
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
  .sleep-analysis-container {
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

  .section-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .date-range {
    width: 100%;
    justify-content: center;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .sleep-time {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .time-separator {
    transform: rotate(90deg);
  }

  .sleep-details {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
</style> 