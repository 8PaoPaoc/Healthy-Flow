<template>
  <div class="health-data-display">
    <el-tabs v-model="activeTab" class="display-tabs">
      <el-tab-pane label="数据记录" name="records">
        <div class="tab-header">
          <h3>健康记录列表</h3>
          <el-button type="primary" @click="refreshData">
            <el-icon><Refresh /></el-icon>
            刷新数据
          </el-button>
        </div>

        <el-table 
          :data="healthRecords" 
          style="width: 100%"
          v-loading="loading"
        >
          <el-table-column prop="measure_date" label="记录时间" width="180">
            <template #default="{ row }">
              {{ formatDate(row.measure_date) }}
            </template>
          </el-table-column>
          
          <el-table-column prop="condition" label="身体状况" width="120">
            <template #default="{ row }">
              <el-tag :type="getConditionType(row.condition)">
                {{ getConditionLabel(row.condition) }}
              </el-tag>
            </template>
          </el-table-column>
          
          <el-table-column prop="temperature" label="体温" width="100">
            <template #default="{ row }">
              {{ row.temperature }}°C
            </template>
          </el-table-column>
          
          <el-table-column prop="blood_pressure" label="血压" width="120" />
          
          <el-table-column prop="heart_rate" label="心率" width="120">
            <template #default="{ row }">
              {{ row.heart_rate }} 次/分
            </template>
          </el-table-column>
          
          <el-table-column prop="symptoms" label="症状" show-overflow-tooltip />
          
          <el-table-column fixed="right" label="操作" width="120">
            <template #default="{ row }">
              <el-button 
                link 
                type="primary" 
                @click="showDetail(row)"
              >
                详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="total"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-tab-pane>

      <el-tab-pane label="健康分析" name="analysis">
        <div class="analysis-container">
          <div class="analysis-header">
            <h3>健康趋势分析</h3>
            <el-select v-model="analysisPeriod" @change="fetchAnalysis">
              <el-option label="最近7天" :value="7" />
              <el-option label="最近30天" :value="30" />
              <el-option label="最近90天" :value="90" />
            </el-select>
          </div>

          <el-row :gutter="20" class="analysis-cards">
            <el-col :span="8" v-for="(stat, key) in analysisData.stats" :key="key">
              <el-card class="stat-card">
                <template #header>
                  <div class="stat-header">
                    <span>{{ getStatLabel(key) }}</span>
                    <el-tooltip 
                      :content="getStatDescription(key)" 
                      placement="top"
                    >
                      <el-icon><InfoFilled /></el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <div class="stat-content">
                  <template v-if="key === 'blood_pressure'">
                    <div class="stat-value">
                      {{ Math.round(stat.systolic_mean) }}/{{ Math.round(stat.diastolic_mean) }}
                    </div>
                    <div class="stat-label">平均血压 (mmHg)</div>
                  </template>
                  <template v-else>
                    <div class="stat-value">
                      {{ Math.round(stat.mean * 10) / 10 }}
                      {{ getStatUnit(key) }}
                    </div>
                    <div class="stat-metrics">
                      <span>最低: {{ stat.min }}{{ getStatUnit(key) }}</span>
                      <span>最高: {{ stat.max }}{{ getStatUnit(key) }}</span>
                    </div>
                  </template>
                </div>
              </el-card>
            </el-col>
          </el-row>

          <div class="recommendations" v-if="analysisData.recommendations?.length">
            <h4>健康建议</h4>
            <el-alert
              v-for="(rec, index) in analysisData.recommendations"
              :key="index"
              :title="rec"
              type="info"
              :closable="false"
              class="mb-4"
            />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="健康记录详情"
      width="500px"
    >
      <div v-if="selectedRecord" class="record-detail">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="记录时间">
            {{ formatDate(selectedRecord.measure_date) }}
          </el-descriptions-item>
          <el-descriptions-item label="身体状况">
            <el-tag :type="getConditionType(selectedRecord.condition)">
              {{ getConditionLabel(selectedRecord.condition) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="体温">
            {{ selectedRecord.temperature }}°C
          </el-descriptions-item>
          <el-descriptions-item label="血压">
            {{ selectedRecord.blood_pressure }} mmHg
          </el-descriptions-item>
          <el-descriptions-item label="心率">
            {{ selectedRecord.heart_rate }} 次/分
          </el-descriptions-item>
          <el-descriptions-item label="症状描述">
            {{ selectedRecord.symptoms || '无' }}
          </el-descriptions-item>
          <el-descriptions-item label="备注">
            {{ selectedRecord.notes || '无' }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh, InfoFilled } from '@element-plus/icons-vue'
import { format } from 'date-fns'
import type { HealthRecord, AnalysisData } from '@/types/health'

// 状态
const activeTab = ref('records')
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const healthRecords = ref<HealthRecord[]>([])
const detailVisible = ref(false)
const selectedRecord = ref<HealthRecord | null>(null)
const analysisPeriod = ref(30)
const analysisData = ref<AnalysisData>({
  stats: {},
  recommendations: [],
  period: ''
})

// 获取健康记录列表
async function fetchRecords() {
  loading.value = true
  try {
    const response = await fetch(
      '/api/health-records/?skip=' + ((currentPage.value - 1) * pageSize.value) + '&limit=' + pageSize.value
    )
    if (!response.ok) throw new Error('获取数据失败')
    const data = await response.json()
    healthRecords.value = data.items
    total.value = data.total
  } catch (error: any) {
    ElMessage.error(error.message)
  } finally {
    loading.value = false
  }
}

// 获取健康分析数据
async function fetchAnalysis() {
  try {
    const response = await fetch('/api/health-records/analysis?days=' + analysisPeriod.value)
    if (!response.ok) throw new Error('获取分析数据失败')
    const data = await response.json()
    analysisData.value = data
  } catch (error: any) {
    ElMessage.error(error.message)
  }
}

// 事件处理
function handleSizeChange(val: number) {
  pageSize.value = val
  fetchRecords()
}

function handleCurrentChange(val: number) {
  currentPage.value = val
  fetchRecords()
}

function refreshData() {
  if (activeTab.value === 'records') {
    fetchRecords()
  } else {
    fetchAnalysis()
  }
}

function showDetail(record: HealthRecord) {
  selectedRecord.value = record
  detailVisible.value = true
}

// 工具函数
function formatDate(date: string) {
  return format(new Date(date), 'yyyy-MM-dd HH:mm')
}

function getConditionLabel(condition: string) {
  const labels: Record<string, string> = {
    excellent: '很好',
    good: '良好',
    fair: '一般',
    poor: '较差'
  }
  return labels[condition] || condition
}

function getConditionType(condition: string) {
  const types: Record<string, string> = {
    excellent: 'success',
    good: '',
    fair: 'warning',
    poor: 'danger'
  }
  return types[condition] || ''
}

function getStatLabel(key: string) {
  const labels: Record<string, string> = {
    temperature: '体温',
    heart_rate: '心率',
    blood_pressure: '血压'
  }
  return labels[key] || key
}

function getStatUnit(key: string) {
  const units: Record<string, string> = {
    temperature: '°C',
    heart_rate: '次/分'
  }
  return units[key] || ''
}

function getStatDescription(key: string) {
  const descriptions: Record<string, string> = {
    temperature: '正常体温范围：36.3°C - 37.2°C',
    heart_rate: '正常心率范围：60-100次/分',
    blood_pressure: '正常血压范围：收缩压90-140mmHg，舒张压60-90mmHg'
  }
  return descriptions[key] || ''
}

// 生命周期
onMounted(() => {
  fetchRecords()
  fetchAnalysis()
})
</script>

<style scoped>
.health-data-display {
  @apply w-full;
}

.display-tabs {
  @apply bg-white rounded-xl shadow-md p-6;
}

.tab-header {
  @apply flex justify-between items-center mb-6;
}

.tab-header h3 {
  @apply text-xl font-bold text-gray-800 m-0;
}

.pagination {
  @apply mt-6 flex justify-end;
}

.analysis-container {
  @apply space-y-6;
}

.analysis-header {
  @apply flex justify-between items-center mb-6;
}

.analysis-header h3 {
  @apply text-xl font-bold text-gray-800 m-0;
}

.analysis-cards {
  @apply mb-8;
}

.stat-card {
  @apply h-full;
}

.stat-header {
  @apply flex items-center justify-between;
}

.stat-header span {
  @apply text-lg font-medium;
}

.stat-content {
  @apply text-center;
}

.stat-value {
  @apply text-2xl font-bold text-indigo-600 mb-2;
}

.stat-metrics {
  @apply flex justify-between text-sm text-gray-500;
}

.stat-label {
  @apply text-sm text-gray-500;
}

.recommendations {
  @apply mt-8;
}

.recommendations h4 {
  @apply text-lg font-bold text-gray-800 mb-4;
}

:deep(.el-alert) {
  @apply mb-4;
}

.record-detail {
  @apply max-h-[60vh] overflow-y-auto;
}
</style> 