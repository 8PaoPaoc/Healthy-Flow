<template>
  <div class="diet-record-container">
    <div class="page-header">
      <h1>饮食记录</h1>
      <button class="btn-add" @click="showAddRecordModal = true">
        <i class="fas fa-plus"></i> 添加记录
      </button>
    </div>

    <!-- 营养摄入统计 -->
    <div class="stats-grid">
      <div v-for="stat in nutritionStats" :key="stat.id" class="stat-card">
        <div class="stat-header">
          <i :class="['stat-icon', stat.icon]"></i>
          <h3>{{ stat.title }}</h3>
        </div>
        <div class="stat-body">
          <div class="progress-container">
            <div class="progress-bar" :style="{ width: stat.percentage + '%', background: stat.color }"></div>
          </div>
          <div class="stat-values">
            <span class="current-value">{{ stat.current }}{{ stat.unit }}</span>
            <span class="target-value">目标: {{ stat.target }}{{ stat.unit }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 今日饮食记录 -->
    <div class="records-section">
      <div class="section-header">
        <h2>今日饮食记录</h2>
        <div class="date-picker">
          <button class="date-nav" @click="previousDay">
            <i class="fas fa-chevron-left"></i>
          </button>
          <span class="current-date">{{ currentDate }}</span>
          <button class="date-nav" @click="nextDay">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <div class="meal-timeline">
        <div v-for="meal in meals" :key="meal.type" class="meal-section">
          <div class="meal-header">
            <i :class="['meal-icon', meal.icon]"></i>
            <h3>{{ meal.title }}</h3>
            <span class="meal-time">{{ meal.time }}</span>
          </div>
          
          <div v-if="meal.items.length" class="meal-items">
            <div v-for="item in meal.items" :key="item.id" class="food-item">
              <img :src="item.image" :alt="item.name" class="food-image">
              <div class="food-details">
                <h4>{{ item.name }}</h4>
                <p class="portion">{{ item.portion }}{{ item.unit }}</p>
                <p class="calories">{{ item.calories }}卡路里</p>
              </div>
              <button class="btn-delete" @click="deleteFood(item.id)">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
          
          <div v-else class="empty-meal">
            <button class="btn-add-meal" @click="addMeal(meal.type)">
              <i class="fas fa-plus"></i>
              添加{{ meal.title }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加记录模态框 -->
    <Teleport to="body">
      <div v-if="showAddRecordModal" class="modal-backdrop" @click="showAddRecordModal = false">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>添加饮食记录</h2>
            <button class="btn-close" @click="showAddRecordModal = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="modal-body">
            <form @submit.prevent="handleSubmit" class="record-form">
              <div class="form-group">
                <label for="foodSearch">食物名称</label>
                <div class="search-container">
                  <input
                    type="text"
                    id="foodSearch"
                    v-model="form.foodSearch"
                    class="form-control"
                    placeholder="搜索食物..."
                    @input="searchFood"
                    required
                  >
                  <div v-if="searchResults.length" class="search-results">
                    <div
                      v-for="result in searchResults"
                      :key="result.id"
                      class="search-item"
                      @click="selectFood(result)"
                    >
                      <img :src="result.image" :alt="result.name">
                      <span>{{ result.name }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="mealType">用餐类型</label>
                  <select id="mealType" v-model="form.mealType" class="form-control" required>
                    <option value="breakfast">早餐</option>
                    <option value="lunch">午餐</option>
                    <option value="dinner">晚餐</option>
                    <option value="snack">加餐</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label for="portion">份量</label>
                  <div class="portion-input">
                    <input
                      type="number"
                      id="portion"
                      v-model="form.portion"
                      class="form-control"
                      min="0"
                      step="0.1"
                      required
                    >
                    <select v-model="form.unit" class="unit-select">
                      <option value="克">克</option>
                      <option value="份">份</option>
                      <option value="杯">杯</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="nutrition-info" v-if="selectedFood">
                <h3>营养信息</h3>
                <div class="nutrition-grid">
                  <div class="nutrition-item">
                    <span class="label">热量</span>
                    <span class="value">{{ calculatedNutrition.calories }}卡路里</span>
                  </div>
                  <div class="nutrition-item">
                    <span class="label">蛋白质</span>
                    <span class="value">{{ calculatedNutrition.protein }}克</span>
                  </div>
                  <div class="nutrition-item">
                    <span class="label">碳水</span>
                    <span class="value">{{ calculatedNutrition.carbs }}克</span>
                  </div>
                  <div class="nutrition-item">
                    <span class="label">脂肪</span>
                    <span class="value">{{ calculatedNutrition.fat }}克</span>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label for="notes">备注</label>
                <textarea
                  id="notes"
                  v-model="form.notes"
                  class="form-control"
                  rows="2"
                  placeholder="添加备注..."
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
import { ref, reactive, computed } from 'vue'
import { useNotification } from '@/services/notificationService'

const notification = useNotification()

// 模态框状态
const showAddRecordModal = ref(false)
const isSubmitting = ref(false)

// 当前日期
const currentDate = ref(new Date().toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}))

// 营养摄入统计
const nutritionStats = [
  {
    id: 1,
    title: '热量',
    current: 1200,
    target: 2000,
    unit: 'kcal',
    percentage: 60,
    color: '#3b82f6',
    icon: 'fas fa-fire'
  },
  {
    id: 2,
    title: '蛋白质',
    current: 45,
    target: 60,
    unit: 'g',
    percentage: 75,
    color: '#10b981',
    icon: 'fas fa-drumstick-bite'
  },
  {
    id: 3,
    title: '碳水化合物',
    current: 150,
    target: 250,
    unit: 'g',
    percentage: 60,
    color: '#f59e0b',
    icon: 'fas fa-bread-slice'
  },
  {
    id: 4,
    title: '脂肪',
    current: 40,
    target: 65,
    unit: 'g',
    percentage: 62,
    color: '#ef4444',
    icon: 'fas fa-cheese'
  }
]

// 用餐数据
const meals = [
  {
    type: 'breakfast',
    title: '早餐',
    time: '06:00 - 09:00',
    icon: 'fas fa-sun',
    items: [
      {
        id: 1,
        name: '全麦面包',
        portion: 2,
        unit: '片',
        calories: 160,
        image: '/images/bread.jpg'
      },
      {
        id: 2,
        name: '牛奶',
        portion: 250,
        unit: '毫升',
        calories: 120,
        image: '/images/milk.jpg'
      }
    ]
  },
  {
    type: 'lunch',
    title: '午餐',
    time: '11:30 - 13:30',
    icon: 'fas fa-cloud-sun',
    items: [
      {
        id: 3,
        name: '糙米饭',
        portion: 1,
        unit: '碗',
        calories: 200,
        image: '/images/rice.jpg'
      }
    ]
  },
  {
    type: 'dinner',
    title: '晚餐',
    time: '17:30 - 19:30',
    icon: 'fas fa-moon',
    items: []
  },
  {
    type: 'snack',
    title: '加餐',
    time: '任意时间',
    icon: 'fas fa-cookie',
    items: []
  }
]

// 表单数据
const form = reactive({
  foodSearch: '',
  mealType: 'breakfast',
  portion: 1,
  unit: '份',
  notes: ''
})

// 搜索结果
const searchResults = ref([])
const selectedFood = ref(null)

// 计算营养成分
const calculatedNutrition = computed(() => {
  if (!selectedFood.value) return null
  
  const ratio = form.portion / selectedFood.value.baseAmount
  return {
    calories: Math.round(selectedFood.value.calories * ratio),
    protein: Math.round(selectedFood.value.protein * ratio * 10) / 10,
    carbs: Math.round(selectedFood.value.carbs * ratio * 10) / 10,
    fat: Math.round(selectedFood.value.fat * ratio * 10) / 10
  }
})

// 日期导航
function previousDay() {
  // TODO: 实现前一天导航
}

function nextDay() {
  // TODO: 实现后一天导航
}

// 搜索食物
async function searchFood() {
  if (!form.foodSearch) {
    searchResults.value = []
    return
  }

  // 模拟API调用
  await new Promise(resolve => setTimeout(resolve, 300))
  searchResults.value = [
    {
      id: 1,
      name: '全麦面包',
      image: '/images/bread.jpg',
      baseAmount: 1,
      baseUnit: '片',
      calories: 80,
      protein: 3,
      carbs: 15,
      fat: 1
    },
    {
      id: 2,
      name: '牛奶',
      image: '/images/milk.jpg',
      baseAmount: 100,
      baseUnit: '毫升',
      calories: 48,
      protein: 3.2,
      carbs: 4.8,
      fat: 1.8
    }
  ]
}

// 选择食物
function selectFood(food) {
  selectedFood.value = food
  form.foodSearch = food.name
  form.unit = food.baseUnit
  searchResults.value = []
}

// 删除食物
function deleteFood(id) {
  // TODO: 实现删除食物记录功能
  notification.success('记录已删除')
}

// 添加用餐
function addMeal(type) {
  form.mealType = type
  showAddRecordModal.value = true
}

// 处理表单提交
async function handleSubmit() {
  if (!selectedFood.value) {
    notification.error('请选择食物')
    return
  }

  try {
    isSubmitting.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    notification.success('记录添加成功')
    showAddRecordModal.value = false
    
    // 重置表单
    form.foodSearch = ''
    form.portion = 1
    form.notes = ''
    selectedFood.value = null
  } catch (error) {
    notification.error('添加记录失败，请重试')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.diet-record-container {
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

.progress-container {
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.stat-values {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
}

.current-value {
  color: #1f2937;
  font-weight: 500;
}

.target-value {
  color: #6b7280;
}

.records-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
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

.date-picker {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.date-nav {
  background: none;
  border: 1px solid #e5e7eb;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.date-nav:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.current-date {
  font-weight: 500;
  color: #1f2937;
}

.meal-timeline {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.meal-section {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.meal-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
}

.meal-icon {
  color: #3b82f6;
  font-size: 1.25rem;
}

.meal-header h3 {
  margin: 0;
  color: #1f2937;
  font-size: 1.1rem;
  font-weight: 500;
}

.meal-time {
  color: #6b7280;
  font-size: 0.875rem;
  margin-left: auto;
}

.meal-items {
  padding: 1rem;
}

.food-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 0.75rem;
}

.food-item:last-child {
  margin-bottom: 0;
}

.food-image {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  object-fit: cover;
}

.food-details {
  flex: 1;
}

.food-details h4 {
  margin: 0 0 0.25rem;
  color: #1f2937;
  font-size: 1rem;
}

.portion {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.calories {
  margin: 0;
  color: #3b82f6;
  font-size: 0.875rem;
  font-weight: 500;
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

.empty-meal {
  padding: 2rem;
  display: flex;
  justify-content: center;
}

.btn-add-meal {
  background: none;
  border: 2px dashed #e5e7eb;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  color: #6b7280;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add-meal:hover {
  border-color: #3b82f6;
  color: #3b82f6;
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

.search-container {
  position: relative;
}

.form-control {
  width: 100%;
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

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  margin-top: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.search-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  cursor: pointer;
  transition: background 0.2s;
}

.search-item:hover {
  background: #f8fafc;
}

.search-item img {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  object-fit: cover;
}

.portion-input {
  display: flex;
  gap: 0.5rem;
}

.portion-input .form-control {
  flex: 1;
}

.unit-select {
  width: 80px;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  color: #4b5563;
}

.nutrition-info {
  background: #f8fafc;
  border-radius: 8px;
  padding: 1rem;
}

.nutrition-info h3 {
  margin: 0 0 1rem;
  color: #1f2937;
  font-size: 1.1rem;
}

.nutrition-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.nutrition-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nutrition-item .label {
  color: #6b7280;
  font-size: 0.875rem;
}

.nutrition-item .value {
  color: #1f2937;
  font-weight: 500;
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
  .diet-record-container {
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

  .date-picker {
    width: 100%;
    justify-content: center;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .nutrition-grid {
    grid-template-columns: 1fr;
  }
}
</style> 