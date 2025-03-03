<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="dashboard-header">
          <h1 class="dashboard-title">健康管理</h1>
          <p class="dashboard-subtitle">记录和分析您的健康数据</p>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mb-6">
      <el-col :span="24">
        <health-data-form />
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="24">
        <health-data-display />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import HealthDataForm from '@/components/health/HealthDataForm.vue'
import HealthDataDisplay from '@/components/health/HealthDataDisplay.vue'
</script>

<style scoped>
.dashboard {
  @apply p-6;
}

.dashboard-header {
  @apply text-center mb-8;
}

.dashboard-title {
  @apply text-3xl font-bold text-gray-800 mb-2;
  background: linear-gradient(to right, #4f46e5, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.dashboard-subtitle {
  @apply text-gray-600;
}
</style> 