<template>
  <div class="nutrition-record">
    <el-card class="mb-6">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold">营养摄入记录</h2>
          <el-button type="primary" @click="showMealForm = true">
            <el-icon class="mr-1"><Plus /></el-icon>
            添加饮食记录
          </el-button>
        </div>
      </template>

      <!-- 今日营养摄入统计 -->
      <el-row :gutter="20" class="mb-6">
        <el-col :span="6" v-for="stat in nutritionStats" :key="stat.title">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-icon" :class="stat.color">
              <el-icon><component :is="stat.icon" /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-title">{{ stat.title }}</div>
              <div class="stat-target">目标: {{ stat.target }}</div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 营养摄入图表 -->
      <div class="chart-container">
        <el-tabs v-model="activeChart">
          <el-tab-pane label="热量趋势" name="calories">
            <div class="h-80">
              <!-- 这里将添加热量趋势图表 -->
            </div>
          </el-tab-pane>
          <el-tab-pane label="营养构成" name="nutrition">
            <div class="h-80">
              <!-- 这里将添加营养构成图表 -->
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>

    <!-- 饮食记录列表 -->
    <el-card>
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium">饮食记录</h3>
          <div class="flex items-center space-x-4">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="small"
            />
            <el-select v-model="mealType" placeholder="用餐类型" size="small">
              <el-option label="全部" value="" />
              <el-option label="早餐" value="breakfast" />
              <el-option label="午餐" value="lunch" />
              <el-option label="晚餐" value="dinner" />
              <el-option label="加餐" value="snack" />
            </el-select>
          </div>
        </div>
      </template>

      <el-table :data="mealRecords" stripe>
        <el-table-column prop="date" label="记录时间" width="180" />
        <el-table-column prop="type" label="用餐类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getMealTypeTag(row.type)">
              {{ getMealTypeLabel(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="food" label="食物" show-overflow-tooltip />
        <el-table-column prop="calories" label="热量" width="120">
          <template #default="{ row }">
            {{ row.calories }} kcal
          </template>
        </el-table-column>
        <el-table-column label="营养素" width="200">
          <template #default="{ row }">
            <el-tooltip
              :content="getNutritionDetails(row.nutrition)"
              placement="top"
            >
              <div class="nutrition-bars">
                <div 
                  v-for="(value, key) in row.nutrition" 
                  :key="key"
                  class="nutrition-bar"
                  :style="{ width: \`\${value}%\` }"
                  :class="getNutritionBarClass(key)"
                />
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="editMeal(row)">编辑</el-button>
            <el-button link type="danger" @click="deleteMeal(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="flex justify-end mt-4">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
        />
      </div>
    </el-card>

    <!-- 添加饮食记录对话框 -->
    <el-dialog
      v-model="showMealForm"
      title="添加饮食记录"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="mealForm"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="用餐类型" prop="type">
          <el-select v-model="mealForm.type" placeholder="请选择用餐类型" class="w-full">
            <el-option label="早餐" value="breakfast" />
            <el-option label="午餐" value="lunch" />
            <el-option label="晚餐" value="dinner" />
            <el-option label="加餐" value="snack" />
          </el-select>
        </el-form-item>

        <el-form-item label="用餐时间" prop="date">
          <el-date-picker
            v-model="mealForm.date"
            type="datetime"
            placeholder="选择日期时间"
            class="w-full"
          />
        </el-form-item>

        <el-form-item label="食物" prop="foods">
          <div v-for="(food, index) in mealForm.foods" :key="index" class="food-item">
            <el-row :gutter="10">
              <el-col :span="10">
                <el-input
                  v-model="food.name"
                  placeholder="食物名称"
                />
              </el-col>
              <el-col :span="6">
                <el-input-number
                  v-model="food.amount"
                  :min="0"
                  placeholder="数量"
                />
              </el-col>
              <el-col :span="6">
                <el-select v-model="food.unit" placeholder="单位">
                  <el-option label="克" value="g" />
                  <el-option label="毫升" value="ml" />
                  <el-option label="份" value="serving" />
                </el-select>
              </el-col>
              <el-col :span="2">
                <el-button 
                  type="danger" 
                  circle
                  @click="removeFoodItem(index)"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </el-col>
            </el-row>
          </div>
          <div class="mt-2">
            <el-button type="primary" plain @click="addFoodItem">
              <el-icon class="mr-1"><Plus /></el-icon>
              添加食物
            </el-button>
          </div>
        </el-form-item>

        <el-form-item label="备注" prop="notes">
          <el-input
            v-model="mealForm.notes"
            type="textarea"
            rows="3"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="flex justify-end">
          <el-button @click="showMealForm = false">取消</el-button>
          <el-button type="primary" @click="submitMeal">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Plus, Delete } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'

interface FoodItem {
  name: string
  amount: number
  unit: string
}

interface MealForm {
  type: string
  date: string
  foods: FoodItem[]
  notes: string
}

// 状态定义
const activeChart = ref('calories')
const showMealForm = ref(false)
const dateRange = ref([])
const mealType = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(100)

// 营养统计数据
const nutritionStats = [
  {
    title: '热量',
    value: '1580 kcal',
    target: '2000 kcal',
    icon: 'Histogram',
    color: 'bg-orange-100 text-orange-600'
  },
  {
    title: '蛋白质',
    value: '65g',
    target: '80g',
    icon: 'Chicken',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    title: '碳水化合物',
    value: '220g',
    target: '250g',
    icon: 'Bowl',
    color: 'bg-yellow-100 text-yellow-600'
  },
  {
    title: '脂肪',
    value: '45g',
    target: '60g',
    icon: 'Food',
    color: 'bg-red-100 text-red-600'
  }
]

// 饮食记录数据
const mealRecords = ref([
  {
    date: '2024-01-20 08:00',
    type: 'breakfast',
    food: '牛奶, 全麦面包, 鸡蛋',
    calories: 350,
    nutrition: {
      protein: 30,
      carbs: 50,
      fat: 20
    }
  },
  {
    date: '2024-01-20 12:00',
    type: 'lunch',
    food: '米饭, 炒青菜, 红烧肉',
    calories: 650,
    nutrition: {
      protein: 35,
      carbs: 45,
      fat: 20
    }
  }
])

// 表单数据
const formRef = ref<FormInstance>()
const mealForm = reactive<MealForm>({
  type: '',
  date: '',
  foods: [{ name: '', amount: 0, unit: 'g' }],
  notes: ''
})

// 表单验证规则
const formRules = {
  type: [
    { required: true, message: '请选择用餐类型', trigger: 'change' }
  ],
  date: [
    { required: true, message: '请选择用餐时间', trigger: 'change' }
  ],
  'foods.*.name': [
    { required: true, message: '请输入食物名称', trigger: 'blur' }
  ],
  'foods.*.amount': [
    { required: true, message: '请输入食物数量', trigger: 'blur' }
  ]
}

// 工具函数
function getMealTypeTag(type: string): string {
  const tags: Record<string, string> = {
    breakfast: 'success',
    lunch: 'warning',
    dinner: 'danger',
    snack: 'info'
  }
  return tags[type] || ''
}

function getMealTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    breakfast: '早餐',
    lunch: '午餐',
    dinner: '晚餐',
    snack: '加餐'
  }
  return labels[type] || type
}

function getNutritionDetails(nutrition: Record<string, number>): string {
  return `蛋白质: ${nutrition.protein}% | 碳水: ${nutrition.carbs}% | 脂肪: ${nutrition.fat}%`
}

function getNutritionBarClass(type: string): string {
  const classes: Record<string, string> = {
    protein: 'bg-blue-500',
    carbs: 'bg-yellow-500',
    fat: 'bg-red-500'
  }
  return classes[type] || ''
}

// 表单操作
function addFoodItem() {
  mealForm.foods.push({ name: '', amount: 0, unit: 'g' })
}

function removeFoodItem(index: number) {
  mealForm.foods.splice(index, 1)
}

// 事件处理函数
function editMeal(meal: any) {
  console.log('编辑饮食记录:', meal)
}

function deleteMeal(meal: any) {
  console.log('删除饮食记录:', meal)
}

async function submitMeal() {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    // TODO: 调用API保存记录
    console.log('提交饮食记录:', mealForm)
    showMealForm.value = false
    formRef.value.resetFields()
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}
</script>

<style scoped>
.nutrition-record {
  @apply p-6;
}

.stat-card {
  @apply flex items-center p-4;
}

.stat-icon {
  @apply w-12 h-12 rounded-full flex items-center justify-center mr-4;
}

.stat-icon .el-icon {
  @apply text-xl;
}

.stat-info {
  @apply flex-1;
}

.stat-value {
  @apply text-xl font-bold mb-1;
}

.stat-title {
  @apply text-sm text-gray-500;
}

.stat-target {
  @apply text-xs text-gray-400;
}

.chart-container {
  @apply mt-6;
}

.nutrition-bars {
  @apply flex h-2 rounded-full overflow-hidden bg-gray-100;
}

.nutrition-bar {
  @apply h-full transition-all duration-300;
}

.food-item {
  @apply mb-4;
}

.food-item:last-child {
  @apply mb-0;
}
</style> 