<template>
  <div class="health-data-form">
    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <h2>健康数据记录</h2>
          <el-button type="primary" @click="handleSubmit">保存记录</el-button>
        </div>
      </template>

      <el-form 
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-position="top"
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
                class="w-full"
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="身体状况" prop="condition">
              <el-select
                v-model="formData.condition"
                placeholder="请选择身体状况"
                class="w-full"
              >
                <el-option label="很好" value="excellent" />
                <el-option label="良好" value="good" />
                <el-option label="一般" value="fair" />
                <el-option label="较差" value="poor" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="体温 (°C)" prop="temperature">
              <el-input-number
                v-model="formData.temperature"
                :precision="1"
                :step="0.1"
                :min="35"
                :max="42"
                class="w-full"
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="8">
            <el-form-item label="血压 (mmHg)" prop="bloodPressure">
              <el-input
                v-model="formData.bloodPressure"
                placeholder="收缩压/舒张压"
              >
                <template #prefix>
                  <el-icon><Monitor /></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          
          <el-col :span="8">
            <el-form-item label="心率 (次/分)" prop="heartRate">
              <el-input-number
                v-model="formData.heartRate"
                :min="40"
                :max="200"
                class="w-full"
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Monitor } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'

const formRef = ref<FormInstance>()

const formData = reactive({
  measureDate: '',
  condition: '',
  temperature: 36.5,
  bloodPressure: '',
  heartRate: 75,
  symptoms: '',
  notes: ''
})

const rules = {
  measureDate: [
    { required: true, message: '请选择测量日期', trigger: 'change' }
  ],
  condition: [
    { required: true, message: '请选择身体状况', trigger: 'change' }
  ],
  temperature: [
    { required: true, message: '请输入体温', trigger: 'blur' },
    { 
      validator: (rule: any, value: number) => {
        if (value < 35 || value > 42) {
          return new Error('体温数值异常，请确认')
        }
        return true
      },
      trigger: 'blur'
    }
  ],
  bloodPressure: [
    { required: true, message: '请输入血压', trigger: 'blur' },
    {
      pattern: /^\d{2,3}\/\d{2,3}$/,
      message: '请输入正确的血压格式（如：120/80）',
      trigger: 'blur'
    }
  ],
  heartRate: [
    { required: true, message: '请输入心率', trigger: 'blur' },
    {
      validator: (rule: any, value: number) => {
        if (value < 40 || value > 200) {
          return new Error('心率数值异常，请确认')
        }
        return true
      },
      trigger: 'blur'
    }
  ]
}

async function handleSubmit() {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    // TODO: 调用API保存数据
    ElMessage.success('数据保存成功')
    formRef.value.resetFields()
  } catch (error) {
    ElMessage.error('请检查表单填写是否正确')
  }
}
</script>

<style scoped>
.health-data-form {
  @apply max-w-4xl mx-auto p-4;
}

.form-card {
  @apply rounded-xl shadow-md;
}

.card-header {
  @apply flex justify-between items-center;
}

.card-header h2 {
  @apply text-xl font-bold text-gray-800 m-0;
}

:deep(.el-form-item__label) {
  @apply font-medium text-gray-700;
}

:deep(.el-input-number) {
  @apply w-full;
}

:deep(.el-input-number .el-input__wrapper) {
  @apply shadow-none;
}
</style> 