<template>
  <div class="data-analysis">
    <LoadingState
      v-if="loading"
      text="正在加载健康数据..."
      :overlay="true"
    />

    <ErrorMessage
      v-if="error"
      type="error"
      :title="error.title"
      :message="error.message"
      :show-retry="true"
      @retry="initializeData"
    />

    <template v-if="!loading && !error">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">健康数据分析</h2>
        <el-button type="primary" @click="refreshAllData">
          <el-icon class="mr-1"><Refresh /></el-icon>
          刷新所有数据
        </el-button>
      </div>

      <el-row :gutter="{ xs: 8, sm: 20 }">
        <!-- 健康评分卡片 -->
        <el-col :xs="24" :sm="8" class="mb-4 sm:mb-0">
          <el-card class="health-score-card">
            <div class="score-circle" :style="{ '--score-percentage': healthScore + '%' }">
              <div class="score-value">{{ healthScore }}</div>
              <div class="score-label">健康评分</div>
            </div>
            <div class="score-details">
              <div v-for="(item, index) in scoreDetails" :key="index" class="detail-item">
                <span class="detail-label">{{ item.label }}</span>
                <el-progress 
                  :percentage="item.value" 
                  :color="item.color"
                  :show-text="false"
                />
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 健康建议卡片 -->
        <el-col :xs="24" :sm="16">
          <el-card class="health-advice-card">
            <template #header>
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                <h3 class="text-lg font-medium">健康建议</h3>
                <el-button type="primary" plain @click="refreshAdvice">
                  <el-icon class="mr-1"><Refresh /></el-icon>
                  更新建议
                </el-button>
              </div>
            </template>
            <div class="advice-list">
              <div v-for="(advice, index) in healthAdvice" :key="index" class="advice-item">
                <div class="advice-icon" :class="advice.type">
                  <el-icon><component :is="advice.icon" /></el-icon>
                </div>
                <div class="advice-content">
                  <div class="advice-title">{{ advice.title }}</div>
                  <div class="advice-description">{{ advice.description }}</div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 健康趋势图表 -->
      <el-row :gutter="{ xs: 8, sm: 20 }" class="mt-4 sm:mt-6">
        <el-col :span="24">
          <el-card>
            <template #header>
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                <h3 class="text-lg font-medium">健康趋势分析</h3>
                <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                  <el-select v-model="trendType" placeholder="分析指标" size="small">
                    <el-option label="体重变化" value="weight" />
                    <el-option label="血压趋势" value="bloodPressure" />
                    <el-option label="心率变化" value="heartRate" />
                    <el-option label="营养摄入" value="nutrition" />
                  </el-select>
                  <el-select v-model="trendPeriod" placeholder="时间范围" size="small">
                    <el-option label="最近7天" :value="7" />
                    <el-option label="最近30天" :value="30" />
                    <el-option label="最近90天" :value="90" />
                  </el-select>
                </div>
              </div>
            </template>
            <div class="trend-chart" style="height: 400px">
              <v-chart class="chart" :option="trendChartOption" autoresize />
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 营养成分分布图表 -->
      <el-row :gutter="{ xs: 8, sm: 20 }" class="mt-4 sm:mt-6">
        <el-col :xs="24" :sm="12" class="mb-4 sm:mb-0">
          <el-card>
            <template #header>
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-medium">营养成分分布</h3>
                <el-tooltip content="点击查看详细营养建议">
                  <el-button type="primary" link @click="activeReport = 'nutrition'">
                    查看详情
                  </el-button>
                </el-tooltip>
              </div>
            </template>
            <div class="nutrition-chart" style="height: 400px">
              <v-chart class="chart" :option="nutritionChartOption" autoresize />
            </div>
          </el-card>
        </el-col>

        <!-- 每周运动时间柱状图 -->
        <el-col :xs="24" :sm="12">
          <el-card>
            <template #header>
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-medium">每周运动时间</h3>
                <el-tooltip content="点击查看运动建议">
                  <el-button type="primary" link @click="activeReport = 'physical'">
                    查看建议
                  </el-button>
                </el-tooltip>
              </div>
            </template>
            <div class="exercise-chart" style="height: 400px">
              <v-chart class="chart" :option="exerciseChartOption" autoresize />
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 健康指标雷达图 -->
      <el-row :gutter="{ xs: 8, sm: 20 }" class="mt-4 sm:mt-6">
        <el-col :xs="24" :sm="12" class="mb-4 sm:mb-0">
          <el-card>
            <template #header>
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-medium">健康指标分析</h3>
                <el-tooltip content="查看完整健康报告">
                  <el-button type="primary" link @click="generateReport">
                    查看报告
                  </el-button>
                </el-tooltip>
              </div>
            </template>
            <div class="radar-chart" style="height: 400px">
              <v-chart class="chart" :option="radarChartOption" autoresize />
            </div>
          </el-card>
        </el-col>

        <!-- 健康指标相关性散点图 -->
        <el-col :xs="24" :sm="12">
          <el-card>
            <template #header>
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                <h3 class="text-lg font-medium">指标相关性分析</h3>
                <div class="flex items-center space-x-4">
                  <el-select v-model="correlationX" placeholder="X轴指标" size="small">
                    <el-option
                      v-for="metric in correlationMetrics"
                      :key="metric.value"
                      :label="metric.label"
                      :value="metric.value"
                    />
                  </el-select>
                  <el-select v-model="correlationY" placeholder="Y轴指标" size="small">
                    <el-option
                      v-for="metric in correlationMetrics"
                      :key="metric.value"
                      :label="metric.label"
                      :value="metric.value"
                    />
                  </el-select>
                </div>
              </div>
            </template>
            <div class="correlation-chart" style="height: 400px">
              <v-chart class="chart" :option="correlationChartOption" autoresize />
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 详细分析报告 -->
      <el-row :gutter="20" class="mt-6">
        <el-col :span="24">
          <el-card>
            <template #header>
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-medium">详细分析报告</h3>
                <div class="flex items-center space-x-2">
                  <el-dropdown @command="handleExport">
                    <el-button type="primary" plain>
                      <el-icon class="mr-1"><Download /></el-icon>
                      导出数据
                      <el-icon class="el-icon--right"><arrow-down /></el-icon>
                    </el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item command="excel">导出为Excel</el-dropdown-item>
                        <el-dropdown-item command="csv">导出为CSV</el-dropdown-item>
                        <el-dropdown-item command="pdf">导出为PDF</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                  <el-button type="primary" @click="generateReport">
                    <el-icon class="mr-1"><Document /></el-icon>
                    生成报告
                  </el-button>
                </div>
              </div>
            </template>
            
            <el-tabs v-model="activeReport">
              <el-tab-pane label="身体状况" name="physical">
                <div class="report-section">
                  <h4 class="section-title">体重管理</h4>
                  <div class="analysis-content">
                    <p>您的体重在过去30天内{{ weightTrend }}，建议：</p>
                    <ul>
                      <li v-for="(tip, index) in weightTips" :key="index">{{ tip }}</li>
                    </ul>
                  </div>
                </div>

                <div class="report-section">
                  <h4 class="section-title">心血管健康</h4>
                  <div class="analysis-content">
                    <p>血压和心率监测显示：</p>
                    <ul>
                      <li v-for="(item, index) in cardiovascularAnalysis" :key="index">{{ item }}</li>
                    </ul>
                  </div>
                </div>
              </el-tab-pane>

              <el-tab-pane label="营养分析" name="nutrition">
                <div class="report-section">
                  <h4 class="section-title">营养摄入分析</h4>
                  <div class="analysis-content">
                    <el-descriptions :column="2" border>
                      <el-descriptions-item label="平均热量">
                        {{ nutritionAnalysis.calories }} kcal/天
                      </el-descriptions-item>
                      <el-descriptions-item label="蛋白质">
                        {{ nutritionAnalysis.protein }} g/天
                      </el-descriptions-item>
                      <el-descriptions-item label="碳水化合物">
                        {{ nutritionAnalysis.carbs }} g/天
                      </el-descriptions-item>
                      <el-descriptions-item label="脂肪">
                        {{ nutritionAnalysis.fat }} g/天
                      </el-descriptions-item>
                    </el-descriptions>
                    <div class="mt-4">
                      <h5 class="text-base font-medium mb-2">营养建议：</h5>
                      <ul>
                        <li v-for="(tip, index) in nutritionTips" :key="index">{{ tip }}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </el-tab-pane>

              <el-tab-pane label="生活方式" name="lifestyle">
                <div class="report-section">
                  <h4 class="section-title">生活习惯分析</h4>
                  <div class="analysis-content">
                    <el-timeline>
                      <el-timeline-item
                        v-for="(habit, index) in lifestyleHabits"
                        :key="index"
                        :type="habit.status"
                        :color="getHabitColor(habit.status)"
                      >
                        <h5 class="text-base font-medium">{{ habit.title }}</h5>
                        <p>{{ habit.description }}</p>
                      </el-timeline-item>
                    </el-timeline>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from '@vue/runtime-core'
import { Refresh, Document, Download, ArrowDown } from '@element-plus/icons-vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, PieChart, BarChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { analysisService } from '../services/analysisService'
import { exportService } from '../services/exportService'
import type { HealthData, AnalysisData, NutritionData } from '../services/analysisService'
import { ElMessage } from 'element-plus'
import LoadingState from './common/LoadingState.vue'
import ErrorMessage from './common/ErrorMessage.vue'

// 注册必要的 ECharts 组件
use([
  CanvasRenderer,
  LineChart,
  PieChart,
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent
])

interface ScoreDetail {
  label: string
  value: number
  color: string
}

interface HealthAdvice {
  type: 'warning' | 'success' | 'info'
  icon: string
  title: string
  description: string
}

interface NutritionAnalysis {
  calories: number
  protein: number
  carbs: number
  fat: number
}

interface LifestyleHabit {
  title: string
  description: string
  status: 'success' | 'warning' | 'info' | 'danger'
}

// 健康评分
const healthScore = ref(85)
const scoreDetails = ref<ScoreDetail[]>([
  { label: '身体状况', value: 90, color: '#67C23A' },
  { label: '营养均衡', value: 85, color: '#409EFF' },
  { label: '运动习惯', value: 75, color: '#E6A23C' },
  { label: '睡眠质量', value: 80, color: '#909399' }
])

// 健康建议
const healthAdvice = ref<HealthAdvice[]>([
  {
    type: 'warning',
    icon: 'Warning',
    title: '运动建议',
    description: '建议增加有氧运动时间，每周至少进行3次30分钟以上的中等强度运动。'
  },
  {
    type: 'success',
    icon: 'Food',
    title: '饮食建议',
    description: '您的饮食结构较为合理，建议继续保持，可以适当增加蛋白质的摄入。'
  },
  {
    type: 'info',
    icon: 'Moon',
    title: '睡眠建议',
    description: '睡眠时间略显不足，建议保持规律作息，每晚保证7-8小时的睡眠时间。'
  }
])

// 趋势分析
const trendType = ref<string>('weight')
const trendPeriod = ref<number>(30)

// 报告相关
const activeReport = ref<string>('physical')
const weightTrend = ref<string>('保持稳定')
const weightTips = ref<string[]>([
  '继续保持当前的饮食习惯',
  '可以适当增加运动强度',
  '注意控制晚餐摄入量'
])

const cardiovascularAnalysis = ref<string[]>([
  '血压维持在正常范围内',
  '心率变化趋势平稳',
  '建议继续保持良好的作息习惯'
])

const nutritionAnalysis = ref<NutritionAnalysis>({
  calories: 2100,
  protein: 75,
  carbs: 280,
  fat: 65
})

const nutritionTips = ref<string[]>([
  '增加优质蛋白质的摄入',
  '适当减少精制碳水化合物的摄入',
  '注意补充必要的维生素和矿物质'
])

const lifestyleHabits = ref<LifestyleHabit[]>([
  {
    title: '运动习惯',
    description: '每周运动3-4次，以有氧运动为主',
    status: 'warning'
  },
  {
    title: '作息规律',
    description: '睡眠时间较为规律，但入睡时间偏晚',
    status: 'info'
  },
  {
    title: '饮食习惯',
    description: '三餐规律，注重营养均衡',
    status: 'success'
  }
])

// 窗口大小响应式
const isMobile = ref(window.innerWidth < 640)

// 监听窗口大小变化
function handleResize() {
  isMobile.value = window.innerWidth < 640
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 图表基础配置
const baseChartConfig = computed(() => ({
  title: {
    textStyle: {
      fontSize: isMobile.value ? 14 : 16
    }
  },
  tooltip: {
    confine: true
  },
  legend: {
    textStyle: {
      fontSize: isMobile.value ? 12 : 14
    }
  },
  grid: {
    left: isMobile.value ? '8%' : '10%',
    right: isMobile.value ? '4%' : '5%',
    bottom: isMobile.value ? '15%' : '12%',
    top: isMobile.value ? '15%' : '12%',
    containLabel: true
  }
}))

// 更新图表配置
const trendChartOption = computed(() => ({
  ...baseChartConfig.value,
  title: {
    ...baseChartConfig.value.title,
    text: getTrendTitle(),
    left: 'center'
  },
  tooltip: {
    ...baseChartConfig.value.tooltip,
    trigger: 'axis'
  },
  toolbox: {
    show: !isMobile.value,
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: getTrendDates()
  },
  yAxis: {
    type: 'value',
    name: getTrendYAxisName()
  },
  series: [
    {
      name: getTrendSeriesName(),
      type: 'line',
      data: getTrendData(),
      smooth: true,
      markPoint: {
        data: [
          { type: 'max', name: '最大值' },
          { type: 'min', name: '最小值' }
        ]
      },
      markLine: {
        data: [{ type: 'average', name: '平均值' }]
      }
    }
  ]
}))

// 营养分布数据
const nutritionData = ref<NutritionData[]>([])

// 营养分布图表配置
const nutritionChartOption = computed(() => ({
  ...baseChartConfig.value,
  title: {
    ...baseChartConfig.value.title,
    text: '每日营养摄入分布',
    left: 'center'
  },
  legend: {
    ...baseChartConfig.value.legend,
    orient: isMobile.value ? 'horizontal' : 'vertical',
    left: isMobile.value ? 'center' : 'left',
    top: isMobile.value ? 'bottom' : 'middle',
    itemWidth: isMobile.value ? 12 : 14,
    itemHeight: isMobile.value ? 12 : 14
  },
  series: [
    {
      name: '营养成分',
      type: 'pie',
      radius: isMobile.value ? ['35%', '60%'] : ['40%', '70%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: true,
        formatter: '{b}: {c}g'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '14',
          fontWeight: 'bold'
        }
      },
      data: nutritionData.value.map((item: NutritionData) => ({
        name: item.category,
        value: item.value,
        itemStyle: {
          color: getNutritionColor(item.category)
        }
      }))
    }
  ]
}))

// 获取营养成分颜色
function getNutritionColor(category: string): string {
  const colors: Record<string, string> = {
    '蛋白质': '#FF6B6B',
    '碳水化合物': '#4ECDC4',
    '脂肪': '#45B7D1',
    '膳食纤维': '#96CEB4',
    '维生素': '#FFEEAD',
    '矿物质': '#D4A5A5'
  }
  return colors[category] || '#909399'
}

// 运动时间数据接口
interface ExerciseData {
  day: string
  duration: number
  type: string
}

// 运动时间数据
const exerciseData = ref<ExerciseData[]>([
  { day: '周一', duration: 45, type: '有氧运动' },
  { day: '周二', duration: 30, type: '力量训练' },
  { day: '周三', duration: 60, type: '有氧运动' },
  { day: '周四', duration: 40, type: '力量训练' },
  { day: '周五', duration: 50, type: '有氧运动' },
  { day: '周六', duration: 90, type: '混合训练' },
  { day: '周日', duration: 0, type: '休息' }
])

// 运动时间柱状图配置
const exerciseChartOption = computed(() => {
  const days = exerciseData.value.map(item => item.day)
  const durations = exerciseData.value.map(item => item.duration)
  const types = exerciseData.value.map(item => item.type)

  return {
    ...baseChartConfig.value,
    title: {
      ...baseChartConfig.value.title,
      text: '本周运动时间分布',
      left: 'center'
    },
    tooltip: {
      ...baseChartConfig.value.tooltip,
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        const data = params[0]
        return `${data.name}<br/>${types[data.dataIndex]}: ${data.value}分钟`
      }
    },
    xAxis: {
      type: 'category',
      data: days,
      axisTick: {
        alignWithLabel: true
      },
      axisLabel: {
        fontSize: isMobile.value ? 12 : 14,
        interval: isMobile.value ? 1 : 0
      }
    },
    yAxis: {
      type: 'value',
      name: '运动时间（分钟）',
      minInterval: 15,
      nameTextStyle: {
        fontSize: isMobile.value ? 12 : 14
      },
      axisLabel: {
        fontSize: isMobile.value ? 12 : 14
      }
    },
    series: [
      {
        name: '运动时间',
        type: 'bar',
        barWidth: isMobile.value ? '40%' : '60%',
        data: durations.map((value, index) => ({
          value,
          itemStyle: {
            color: getExerciseColor(types[index])
          }
        })),
        label: {
          show: !isMobile.value,
          position: 'top',
          formatter: '{c}分钟',
          fontSize: isMobile.value ? 12 : 14
        }
      }
    ]
  }
})

// 获取运动类型颜色
function getExerciseColor(type: string): string {
  const colors: Record<string, string> = {
    '有氧运动': '#67C23A',
    '力量训练': '#409EFF',
    '混合训练': '#E6A23C',
    '休息': '#909399'
  }
  return colors[type] || '#909399'
}

// 加载和错误状态
const loading = ref(false)
const error = ref<{ title: string; message: string } | null>(null)

// 健康指标数据接口
interface HealthMetric {
  name: string
  max: number
  current: number
  target: number
}

// 健康指标数据
const healthMetrics = ref<HealthMetric[]>([
  { name: '体重控制', max: 100, current: 85, target: 90 },
  { name: '血压管理', max: 100, current: 92, target: 95 },
  { name: '心率水平', max: 100, current: 88, target: 90 },
  { name: '运动习惯', max: 100, current: 75, target: 85 },
  { name: '睡眠质量', max: 100, current: 80, target: 90 },
  { name: '营养均衡', max: 100, current: 85, target: 90 }
])

// 雷达图配置
const radarChartOption = computed(() => ({
  ...baseChartConfig.value,
  title: {
    ...baseChartConfig.value.title,
    text: '健康指标多维度分析',
    left: 'center'
  },
  legend: {
    ...baseChartConfig.value.legend,
    data: ['当前水平', '目标水平'],
    bottom: 0,
    itemWidth: isMobile.value ? 12 : 14,
    itemHeight: isMobile.value ? 12 : 14
  },
  radar: {
    indicator: healthMetrics.value.map(metric => ({
      name: metric.name,
      max: metric.max
    })),
    splitNumber: isMobile.value ? 4 : 5,
    radius: isMobile.value ? '60%' : '70%',
    axisName: {
      color: '#666',
      fontSize: isMobile.value ? 12 : 14
    },
    splitArea: {
      show: true,
      areaStyle: {
        color: ['#f3f6f9', '#e9ecf2']
      }
    }
  },
  series: [
    {
      name: '健康指标',
      type: 'radar',
      data: [
        {
          value: healthMetrics.value.map(metric => metric.current),
          name: '当前水平',
          itemStyle: {
            color: '#409EFF'
          },
          areaStyle: {
            color: 'rgba(64, 158, 255, 0.2)'
          }
        },
        {
          value: healthMetrics.value.map(metric => metric.target),
          name: '目标水平',
          itemStyle: {
            color: '#67C23A'
          },
          areaStyle: {
            color: 'rgba(103, 194, 58, 0.2)'
          }
        }
      ]
    }
  ]
}))

// 相关性分析数据接口
interface CorrelationData {
  date: string
  [key: string]: number | string
}

interface CorrelationMetric {
  label: string
  value: string
  unit: string
}

// 相关性分析指标选项
const correlationMetrics = ref<CorrelationMetric[]>([
  { label: '体重', value: 'weight', unit: 'kg' },
  { label: '运动时长', value: 'exercise', unit: '分钟' },
  { label: '睡眠时长', value: 'sleep', unit: '小时' },
  { label: '热量摄入', value: 'calories', unit: 'kcal' },
  { label: '血压', value: 'bloodPressure', unit: 'mmHg' },
  { label: '心率', value: 'heartRate', unit: '次/分' }
])

// 选中的相关性分析指标
const correlationX = ref('exercise')
const correlationY = ref('weight')

// 相关性数据（模拟数据）
const correlationData = ref<CorrelationData[]>([
  { date: '2024-03-01', weight: 70, exercise: 30, sleep: 7, calories: 2200, bloodPressure: 120, heartRate: 75 },
  { date: '2024-03-02', weight: 69.8, exercise: 45, sleep: 7.5, calories: 2100, bloodPressure: 118, heartRate: 72 },
  { date: '2024-03-03', weight: 69.5, exercise: 60, sleep: 8, calories: 2000, bloodPressure: 115, heartRate: 70 },
  { date: '2024-03-04', weight: 69.3, exercise: 40, sleep: 6.5, calories: 2300, bloodPressure: 122, heartRate: 78 },
  { date: '2024-03-05', weight: 69.1, exercise: 50, sleep: 7.2, calories: 2150, bloodPressure: 119, heartRate: 73 },
  { date: '2024-03-06', weight: 69.0, exercise: 55, sleep: 7.8, calories: 2050, bloodPressure: 117, heartRate: 71 },
  { date: '2024-03-07', weight: 68.8, exercise: 65, sleep: 8.2, calories: 1950, bloodPressure: 116, heartRate: 69 }
])

// 散点图配置
const correlationChartOption = computed(() => {
  const xMetric = correlationMetrics.value.find(m => m.value === correlationX.value)
  const yMetric = correlationMetrics.value.find(m => m.value === correlationY.value)

  if (!xMetric || !yMetric) return {}

  const data = correlationData.value.map(item => [
    item[correlationX.value],
    item[correlationY.value]
  ])

  return {
    ...baseChartConfig.value,
    title: {
      ...baseChartConfig.value.title,
      text: `${xMetric.label}与${yMetric.label}的相关性分析`,
      left: 'center'
    },
    tooltip: {
      ...baseChartConfig.value.tooltip,
      formatter: (params: any) => {
        return `${xMetric.label}: ${params.value[0]}${xMetric.unit}<br/>${yMetric.label}: ${params.value[1]}${yMetric.unit}`
      }
    },
    grid: {
      ...baseChartConfig.value.grid,
      left: isMobile.value ? '12%' : '10%',
      right: isMobile.value ? '8%' : '5%'
    },
    xAxis: {
      type: 'value',
      name: `${xMetric.label}（${xMetric.unit}）`,
      nameLocation: 'middle',
      nameGap: isMobile.value ? 25 : 30,
      nameTextStyle: {
        fontSize: isMobile.value ? 12 : 14
      },
      axisLabel: {
        fontSize: isMobile.value ? 12 : 14
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: `${yMetric.label}（${yMetric.unit}）`,
      nameLocation: 'middle',
      nameGap: isMobile.value ? 35 : 40,
      nameTextStyle: {
        fontSize: isMobile.value ? 12 : 14
      },
      axisLabel: {
        fontSize: isMobile.value ? 12 : 14
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: [
      {
        type: 'scatter',
        data: data,
        symbolSize: isMobile.value ? 8 : 12,
        itemStyle: {
          color: '#409EFF'
        },
        emphasis: {
          itemStyle: {
            color: '#67C23A',
            borderColor: '#fff',
            borderWidth: 2
          }
        }
      }
    ]
  }
})

// 监听相关性指标变化
watch([correlationX, correlationY], async () => {
  // 这里可以添加获取新的相关性数据的API调用
  // const newData = await analysisService.fetchCorrelationData(correlationX.value, correlationY.value)
  // correlationData.value = newData
})

// 初始化数据加载
async function initializeData() {
  loading.value = true
  error.value = null
  try {
    const data = await analysisService.fetchAnalysisData()
    healthScore.value = data.healthScore
    scoreDetails.value = data.scoreDetails
    healthAdvice.value = data.healthAdvice
    nutritionData.value = data.nutritionData
    // 这里可以添加获取运动数据、健康指标数据和相关性数据的API调用
    // const exerciseResponse = await analysisService.fetchExerciseData()
    // exerciseData.value = exerciseResponse
    // const metricsResponse = await analysisService.fetchHealthMetrics()
    // healthMetrics.value = metricsResponse
    // const correlationResponse = await analysisService.fetchCorrelationData(correlationX.value, correlationY.value)
    // correlationData.value = correlationResponse
    await updateTrendData()
  } catch (err) {
    error.value = {
      title: '数据加载失败',
      message: '无法获取健康分析数据，请稍后重试'
    }
    console.error('初始化数据失败:', err)
  } finally {
    loading.value = false
  }
}

// 更新趋势数据
async function updateTrendData() {
  try {
    const data = await analysisService.fetchTrendData(trendType.value, trendPeriod.value)
    trendData.value = data
  } catch (err) {
    ElMessage.error('更新趋势数据失败')
    console.error('更新趋势数据失败:', err)
  }
}

// 刷新健康建议
async function refreshAdvice() {
  try {
    const data = await analysisService.fetchHealthAdvice()
    healthAdvice.value = data
    ElMessage.success('健康建议已更新')
  } catch (err) {
    ElMessage.error('更新健康建议失败')
    console.error('更新健康建议失败:', err)
  }
}

// 生成报告
async function generateReport() {
  try {
    loading.value = true
    const url = await analysisService.generateReport()
    window.open(url, '_blank')
    ElMessage.success('报告生成成功')
  } catch (err) {
    ElMessage.error('报告生成失败')
    console.error('生成报告失败:', err)
  } finally {
    loading.value = false
  }
}

// 刷新所有数据
async function refreshAllData() {
  loading.value = true
  error.value = null
  try {
    // 清除缓存
    analysisService.clearCache()
    // 重新加载数据
    await initializeData()
    ElMessage.success('数据已更新')
  } catch (err) {
    error.value = {
      title: '刷新数据失败',
      message: '无法更新健康分析数据，请稍后重试'
    }
    console.error('刷新数据失败:', err)
  } finally {
    loading.value = false
  }
}

// 监听趋势类型和时间范围变化
watch([trendType, trendPeriod], async () => {
  await updateTrendData()
})

// 组件挂载时加载数据
onMounted(initializeData)

// 图表辅助函数
function getTrendTitle(): string {
  const titles: Record<string, string> = {
    weight: '体重变化趋势',
    bloodPressure: '血压变化趋势',
    heartRate: '心率变化趋势',
    nutrition: '营养摄入趋势'
  }
  return titles[trendType.value] || ''
}

function getTrendYAxisName(): string {
  const names: Record<string, string> = {
    weight: '体重 (kg)',
    bloodPressure: '血压 (mmHg)',
    heartRate: '心率 (次/分)',
    nutrition: '热量 (kcal)'
  }
  return names[trendType.value] || ''
}

function getTrendSeriesName(): string {
  const names: Record<string, string> = {
    weight: '体重',
    bloodPressure: '收缩压',
    heartRate: '心率',
    nutrition: '热量摄入'
  }
  return names[trendType.value] || ''
}

const trendData = ref<Array<{ date: string; value: number }>>([])

function getTrendDates(): string[] {
  return trendData.value.map(item => item.date)
}

function getTrendData(): number[] {
  return trendData.value.map(item => item.value)
}

function getHabitColor(status: string): string {
  const colors: Record<string, string> = {
    success: '#67C23A',
    warning: '#E6A23C',
    info: '#909399',
    danger: '#F56C6C'
  }
  return colors[status] || colors.info
}

// 导出数据
async function handleExport(command: string) {
  try {
    loading.value = true
    const exportData = {
      healthData: trendData.value.map(item => ({
        ...item,
        type: trendType.value
      })),
      healthAdvice: healthAdvice.value,
      nutritionData: nutritionData.value
    }

    switch (command) {
      case 'excel':
        exportService.exportToExcel(exportData, activeReport.value)
        ElMessage.success('数据已导出为Excel文件')
        break
      case 'csv':
        exportService.exportToCSV(exportData, activeReport.value)
        ElMessage.success('数据已导出为CSV文件')
        break
      case 'pdf':
        await exportService.exportToPDF(exportData)
        ElMessage.success('数据已导出为PDF文件')
        break
      default:
        ElMessage.warning('不支持的导出格式')
    }
  } catch (err) {
    ElMessage.error('导出数据失败')
    console.error('导出数据失败:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.data-analysis {
  @apply p-4 sm:p-6;
}

.health-score-card {
  @apply h-full;
}

.score-circle {
  @apply relative w-32 sm:w-48 h-32 sm:h-48 mx-auto mb-4 sm:mb-6 rounded-full flex items-center justify-center;
  background: conic-gradient(
    #67C23A var(--score-percentage),
    #E5E7EB var(--score-percentage)
  );
}

.score-circle::before {
  content: '';
  @apply absolute w-24 sm:w-40 h-24 sm:h-40 rounded-full bg-white;
}

.score-value {
  @apply relative text-2xl sm:text-4xl font-bold text-gray-800;
}

.score-label {
  @apply relative text-xs sm:text-sm text-gray-500 mt-1;
}

.score-details {
  @apply space-y-2 sm:space-y-4;
}

.detail-item {
  @apply flex items-center;
}

.detail-label {
  @apply w-16 sm:w-20 text-xs sm:text-sm text-gray-600;
}

.health-advice-card {
  @apply h-full;
}

.advice-list {
  @apply space-y-2 sm:space-y-4;
}

.advice-item {
  @apply flex items-start p-2 sm:p-4 rounded-lg border border-gray-100;
}

.advice-icon {
  @apply w-8 sm:w-10 h-8 sm:h-10 rounded-full flex items-center justify-center mr-2 sm:mr-4;
}

.advice-icon.warning {
  @apply bg-yellow-100 text-yellow-600;
}

.advice-icon.success {
  @apply bg-green-100 text-green-600;
}

.advice-icon.info {
  @apply bg-blue-100 text-blue-600;
}

.advice-content {
  @apply flex-1;
}

.advice-title {
  @apply text-sm sm:text-base font-medium mb-0.5 sm:mb-1;
}

.advice-description {
  @apply text-xs sm:text-sm text-gray-600;
}

.trend-chart,
.nutrition-chart,
.exercise-chart,
.radar-chart,
.correlation-chart {
  @apply bg-gray-50 rounded-lg;
}

.report-section {
  @apply mb-4 sm:mb-8;
}

.section-title {
  @apply text-base sm:text-lg font-medium mb-2 sm:mb-4;
}

.analysis-content {
  @apply bg-gray-50 rounded-lg p-3 sm:p-4;
}

.analysis-content ul {
  @apply list-disc list-inside space-y-1 sm:space-y-2 text-sm sm:text-base text-gray-600;
}

.chart {
  height: 100%;
  min-height: 250px;
}

.el-loading {
  background-color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 640px) {
  :deep(.el-card__header) {
    padding: 12px;
  }

  :deep(.el-card__body) {
    padding: 12px;
  }

  :deep(.el-descriptions) {
    font-size: 0.875rem;
  }

  :deep(.el-timeline-item) {
    padding-bottom: 16px;
  }

  :deep(.el-timeline-item__content) {
    font-size: 0.875rem;
  }

  :deep(.el-select) {
    width: 100%;
  }

  :deep(.el-button) {
    width: 100%;
  }
}
</style> 