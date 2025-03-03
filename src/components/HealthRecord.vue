<template>
  <div class="health-record">
    <el-card class="mb-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium">健康数据记录</h3>
          <el-button type="primary" @click="handleSave" :loading="isSaving">
            保存记录
          </el-button>
        </div>
      </template>

      <el-form 
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
        @submit.prevent="handleSave"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="测量日期" prop="measureDate">
              <el-date-picker
                v-model="formData.measureDate"
                type="datetime"
                placeholder="选择日期时间"
                format="YYYY-MM-DD HH:mm"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身体状况" prop="physicalCondition">
              <el-select
                v-model="formData.physicalCondition"
                placeholder="请选择身体状况"
              >
                <el-option label="良好" value="good" />
                <el-option label="一般" value="normal" />
                <el-option label="不适" value="bad" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="体温(℃)" prop="temperature">
              <el-input-number
                v-model="formData.temperature"
                :min="35"
                :max="42"
                :precision="1"
                :step="0.1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="血压(mmHg)" prop="bloodPressure">
              <el-input
                v-model="formData.bloodPressure"
                placeholder="收缩压/舒张压"
              >
                <template #prefix>
                  <el-tooltip content="格式：收缩压/舒张压，例如：120/80">
                    <el-icon><InfoFilled /></el-icon>
                  </el-tooltip>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="心率(次/分)" prop="heartRate">
              <el-input-number
                v-model="formData.heartRate"
                :min="40"
                :max="200"
                :step="1"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="症状描述" prop="symptoms">
          <el-input
            v-model="formData.symptoms"
            type="textarea"
            rows="3"
            placeholder="请描述您的症状（如有）"
          />
        </el-form-item>

        <el-form-item label="备注" prop="notes">
          <el-input
            v-model="formData.notes"
            type="textarea"
            rows="2"
            placeholder="其他需要记录的信息"
          />
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 历史记录列表 -->
    <el-card>
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium">历史记录</h3>
          <div class="flex gap-2">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="handleDateRangeChange"
            />
            <el-button type="primary" @click="refreshRecords">
              <el-icon><Refresh /></el-icon>
              刷新
            </el-button>
          </div>
        </div>
      </template>

      <el-table
        :data="records"
        stripe
        border
        style="width: 100%"
        v-loading="isLoading"
      >
        <el-table-column prop="measureDate" label="记录时间" width="160">
          <template #default="{ row }">
            {{ formatDate(row.measureDate) }}
          </template>
        </el-table-column>
        <el-table-column prop="physicalCondition" label="身体状况" width="100">
          <template #default="{ row }">
            <el-tag :type="getConditionType(row.physicalCondition)">
              {{ getConditionLabel(row.physicalCondition) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="temperature" label="体温(℃)" width="100" />
        <el-table-column prop="bloodPressure" label="血压(mmHg)" width="120" />
        <el-table-column prop="heartRate" label="心率(次/分)" width="120" />
        <el-table-column prop="symptoms" label="症状" show-overflow-tooltip />
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="{ row }">
            <el-button-group>
              <el-button
                type="primary"
                link
                @click="handleEdit(row)"
              >
                编辑
              </el-button>
              <el-button
                type="danger"
                link
                @click="handleDelete(row)"
              >
                删除
              </el-button>
            </el-button-group>
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="编辑健康记录"
      width="50%"
      :before-close="handleDialogClose"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="rules"
        label-width="100px"
      >
        <!-- 编辑表单内容与主表单相同 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="测量日期" prop="measureDate">
              <el-date-picker
                v-model="editForm.measureDate"
                type="datetime"
                placeholder="选择日期时间"
              />
            </el-form-item>
          </el-col>
          <!-- 其他表单项... -->
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleUpdate">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { InfoFilled, Refresh } from '@element-plus/icons-vue'
import { format } from 'date-fns'

// 类型定义
type ConditionType = 'good' | 'normal' | 'bad'
type ConditionMap = Record<ConditionType, string>

// 表单数据接口
interface HealthRecord {
  id?: number
  measureDate: string
  physicalCondition: ConditionType
  temperature: number
  bloodPressure: string
  heartRate: number
  symptoms: string
  notes: string
}

// 表单引用
const formRef = ref()
const editFormRef = ref()

// 表单数据
const formData = reactive<HealthRecord>({
  measureDate: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
  physicalCondition: 'normal',
  temperature: 36.5,
  bloodPressure: '',
  heartRate: 75,
  symptoms: '',
  notes: ''
})

// 表单验证规则
const rules = {
  measureDate: [
    { required: true, message: '请选择测量日期', trigger: 'change' }
  ],
  physicalCondition: [
    { required: true, message: '请选择身体状况', trigger: 'change' }
  ],
  temperature: [
    { required: true, message: '请输入体温', trigger: 'blur' },
    { type: 'number', min: 35, max: 42, message: '体温范围在35-42℃之间', trigger: 'blur' }
  ],
  bloodPressure: [
    { required: true, message: '请输入血压', trigger: 'blur' },
    { 
      pattern: /^\d{2,3}\/\d{2,3}$/,
      message: '血压格式不正确，应为"收缩压/舒张压"',
      trigger: 'blur'
    }
  ],
  heartRate: [
    { required: true, message: '请输入心率', trigger: 'blur' },
    { type: 'number', min: 40, max: 200, message: '心率范围在40-200次/分之间', trigger: 'blur' }
  ]
}

// 状态变量
const isLoading = ref(false)
const isSaving = ref(false)
const dialogVisible = ref(false)
const dateRange = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const records = ref<HealthRecord[]>([])
const editForm = reactive<HealthRecord>({
  measureDate: '',
  physicalCondition: 'normal',
  temperature: 36.5,
  bloodPressure: '',
  heartRate: 75,
  symptoms: '',
  notes: ''
})

// 工具函数
function formatDate(date: string) {
  return format(new Date(date), 'yyyy-MM-dd HH:mm')
}

function getConditionType(condition: ConditionType) {
  const types: ConditionMap = {
    good: 'success',
    normal: 'warning',
    bad: 'danger'
  }
  return types[condition] || 'info'
}

function getConditionLabel(condition: ConditionType) {
  const labels: ConditionMap = {
    good: '良好',
    normal: '一般',
    bad: '不适'
  }
  return labels[condition] || '未知'
}

// 事件处理函数
async function handleSave() {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    isSaving.value = true
    
    // TODO: 调用API保存数据
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('保存成功')
    refreshRecords()
    resetForm()
  } catch (error) {
    ElMessage.error('表单验证失败，请检查输入')
  } finally {
    isSaving.value = false
  }
}

function resetForm() {
  if (!formRef.value) return
  formRef.value.resetFields()
  formData.measureDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
}

async function refreshRecords() {
  isLoading.value = true
  try {
    // TODO: 调用API获取记录列表
    await new Promise(resolve => setTimeout(resolve, 1000))
    records.value = [
      {
        id: 1,
        measureDate: '2024-03-10 10:00:00',
        physicalCondition: 'good',
        temperature: 36.5,
        bloodPressure: '120/80',
        heartRate: 75,
        symptoms: '',
        notes: ''
      },
      // 更多模拟数据...
    ]
    total.value = records.value.length
  } catch (error) {
    ElMessage.error('获取记录失败')
  } finally {
    isLoading.value = false
  }
}

function handleEdit(row: HealthRecord) {
  Object.assign(editForm, row)
  dialogVisible.value = true
}

async function handleDelete(row: HealthRecord) {
  try {
    await ElMessageBox.confirm(
      '确定要删除这条记录吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // TODO: 调用API删除数据
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('删除成功')
    refreshRecords()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

async function handleUpdate() {
  if (!editFormRef.value) return
  
  try {
    await editFormRef.value.validate()
    
    // TODO: 调用API更新数据
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('更新成功')
    dialogVisible.value = false
    refreshRecords()
  } catch (error) {
    ElMessage.error('表单验证失败，请检查输入')
  }
}

function handleDialogClose(done: () => void) {
  ElMessageBox.confirm(
    '确认关闭？未保存的修改将会丢失',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      done()
    })
    .catch(() => {})
}

function handleDateRangeChange() {
  refreshRecords()
}

function handleSizeChange() {
  currentPage.value = 1
  refreshRecords()
}

function handleCurrentChange() {
  refreshRecords()
}

// 生命周期钩子
onMounted(() => {
  refreshRecords()
})
</script>

<style scoped>
.health-record {
  @apply space-y-4 p-4;
}

.el-input-number {
  @apply w-full;
}

.dialog-footer {
  @apply flex justify-end gap-2;
}
</style> 