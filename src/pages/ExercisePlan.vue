<template>
  <div class="exercise-plan-container">
    <div class="page-header">
      <h1 class="page-title">运动计划</h1>
      <el-button type="primary" @click="showAddPlanModal = true">
        <i class="fas fa-plus"></i> 添加计划
      </el-button>
    </div>

    <!-- 运动计划统计 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-fire text-orange-500"></i>
        </div>
        <div class="stat-content">
          <h3>本周消耗</h3>
          <p class="stat-value">{{ weeklyCalories }} 千卡</p>
          <p class="stat-trend" :class="{ 'up': weeklyTrend > 0, 'down': weeklyTrend < 0 }">
            <i :class="weeklyTrend > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
            {{ Math.abs(weeklyTrend) }}%
          </p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-clock text-blue-500"></i>
        </div>
        <div class="stat-content">
          <h3>运动时长</h3>
          <p class="stat-value">{{ weeklyDuration }} 分钟</p>
          <p class="stat-trend" :class="{ 'up': durationTrend > 0, 'down': durationTrend < 0 }">
            <i :class="durationTrend > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
            {{ Math.abs(durationTrend) }}%
          </p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-dumbbell text-purple-500"></i>
        </div>
        <div class="stat-content">
          <h3>完成计划</h3>
          <p class="stat-value">{{ completedPlans }}/{{ totalPlans }}</p>
          <p class="completion-rate">完成率 {{ completionRate }}%</p>
        </div>
      </div>
    </div>

    <!-- 运动计划列表 -->
    <div class="plans-container">
      <div class="plans-header">
        <h2>我的计划</h2>
        <div class="plans-filter">
          <el-select v-model="filterType" placeholder="计划类型">
            <el-option label="全部" value="all" />
            <el-option label="有氧运动" value="cardio" />
            <el-option label="力量训练" value="strength" />
            <el-option label="柔韧性训练" value="flexibility" />
          </el-select>
        </div>
      </div>

      <div class="plans-grid">
        <div v-for="plan in filteredPlans" :key="plan.id" class="plan-card">
          <div class="plan-header">
            <i :class="getPlanIcon(plan.type)"></i>
            <h3>{{ plan.name }}</h3>
          </div>
          <div class="plan-body">
            <p class="plan-description">{{ plan.description }}</p>
            <div class="plan-details">
              <span><i class="fas fa-clock"></i> {{ plan.duration }}分钟</span>
              <span><i class="fas fa-fire"></i> {{ plan.calories }}千卡</span>
            </div>
          </div>
          <div class="plan-footer">
            <el-button type="primary" plain @click="startPlan(plan)">开始</el-button>
            <el-button type="danger" plain @click="deletePlan(plan)">删除</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加计划模态框 -->
    <el-dialog
      v-model="showAddPlanModal"
      title="添加运动计划"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form ref="planForm" :model="newPlan" :rules="planRules" label-width="100px">
        <el-form-item label="计划名称" prop="name">
          <el-input v-model="newPlan.name" placeholder="请输入计划名称" />
        </el-form-item>
        
        <el-form-item label="运动类型" prop="type">
          <el-select v-model="newPlan.type" placeholder="请选择运动类型">
            <el-option label="有氧运动" value="cardio" />
            <el-option label="力量训练" value="strength" />
            <el-option label="柔韧性训练" value="flexibility" />
          </el-select>
        </el-form-item>

        <el-form-item label="持续时间" prop="duration">
          <el-input-number v-model="newPlan.duration" :min="1" :max="360" placeholder="分钟" />
        </el-form-item>

        <el-form-item label="消耗热量" prop="calories">
          <el-input-number v-model="newPlan.calories" :min="1" :max="2000" placeholder="千卡" />
        </el-form-item>

        <el-form-item label="计划描述" prop="description">
          <el-input
            v-model="newPlan.description"
            type="textarea"
            rows="3"
            placeholder="请输入计划描述"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showAddPlanModal = false">取消</el-button>
          <el-button type="primary" @click="submitPlan" :loading="isSubmitting">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 统计数据
const weeklyCalories = ref(2450)
const weeklyTrend = ref(15)
const weeklyDuration = ref(320)
const durationTrend = ref(-5)
const completedPlans = ref(8)
const totalPlans = ref(10)
const completionRate = computed(() => {
  return Math.round((completedPlans.value / totalPlans.value) * 100)
})

// 计划列表数据
const plans = ref([
  {
    id: 1,
    name: '晨跑计划',
    type: 'cardio',
    duration: 30,
    calories: 300,
    description: '清晨在公园进行30分钟慢跑，保持心率在120-140之间。'
  },
  {
    id: 2,
    name: '力量训练A',
    type: 'strength',
    duration: 45,
    calories: 400,
    description: '上半身力量训练，包括俯卧撑、哑铃练习等。'
  }
])

// 筛选相关
const filterType = ref('all')
const filteredPlans = computed(() => {
  if (filterType.value === 'all') return plans.value
  return plans.value.filter(plan => plan.type === filterType.value)
})

// 添加计划相关
const showAddPlanModal = ref(false)
const isSubmitting = ref(false)
const planForm = ref(null)

const newPlan = reactive({
  name: '',
  type: '',
  duration: 30,
  calories: 200,
  description: ''
})

const planRules = {
  name: [
    { required: true, message: '请输入计划名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择运动类型', trigger: 'change' }
  ],
  duration: [
    { required: true, message: '请输入持续时间', trigger: 'blur' }
  ],
  calories: [
    { required: true, message: '请输入消耗热量', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入计划描述', trigger: 'blur' },
    { min: 10, max: 200, message: '长度在 10 到 200 个字符', trigger: 'blur' }
  ]
}

// 获取计划图标
function getPlanIcon(type) {
  const icons = {
    cardio: 'fas fa-running',
    strength: 'fas fa-dumbbell',
    flexibility: 'fas fa-child'
  }
  return icons[type] || 'fas fa-question'
}

// 提交新计划
async function submitPlan() {
  if (!planForm.value) return
  
  try {
    await planForm.value.validate()
    isSubmitting.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const plan = {
      id: Date.now(),
      ...newPlan
    }
    
    plans.value.push(plan)
    showAddPlanModal.value = false
    ElMessage.success('添加计划成功')
    
    // 重置表单
    planForm.value.resetFields()
  } catch (error) {
    console.error('表单验证失败:', error)
  } finally {
    isSubmitting.value = false
  }
}

// 开始计划
function startPlan(plan) {
  ElMessage.success(`开始执行计划：${plan.name}`)
}

// 删除计划
function deletePlan(plan) {
  ElMessageBox.confirm(
    '确定要删除这个运动计划吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const index = plans.value.findIndex(p => p.id === plan.id)
    if (index > -1) {
      plans.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  }).catch(() => {
    // 取消删除
  })
}
</script>

<style scoped>
.exercise-plan-container {
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

.page-title {
  font-size: 1.875rem;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--el-color-primary-light-9);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-content h3 {
  font-size: 0.875rem;
  color: var(--el-text-color-secondary);
  margin: 0;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0.25rem 0;
}

.stat-trend {
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.stat-trend.up {
  color: #10b981;
}

.stat-trend.down {
  color: #ef4444;
}

.completion-rate {
  font-size: 0.875rem;
  color: var(--el-text-color-secondary);
}

.plans-container {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.plans-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.plans-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.plan-card {
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.3s ease;
}

.plan-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.plan-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.plan-header i {
  font-size: 1.25rem;
  color: var(--el-color-primary);
}

.plan-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.plan-description {
  color: var(--el-text-color-secondary);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.plan-details {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  color: var(--el-text-color-secondary);
  font-size: 0.875rem;
}

.plan-details span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.plan-footer {
  display: flex;
  gap: 0.75rem;
}

@media (max-width: 768px) {
  .exercise-plan-container {
    padding: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .plans-grid {
    grid-template-columns: 1fr;
  }

  .plan-footer {
    flex-direction: column;
  }
}
</style> 