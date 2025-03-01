<template>
  <div class="data-analysis-container">
    <h2>数据分析</h2>
    <div v-if="loading">加载中...</div>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div v-if="analysisData">
      <h3>健康趋势</h3>
      <p>体重趋势: {{ analysisData.weightTrend }}</p>
      <p>饮食卡路里趋势: {{ analysisData.calorieTrend }}</p>
      <h3>运动分析</h3>
      <p>总运动时长: {{ analysisData.totalDuration }} 分钟</p>
      <p>总消耗卡路里: {{ analysisData.totalCalories }} 卡路里</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchDataAnalysis } from '../services/analysisService';

const loading = ref(true);
const errorMessage = ref('');
const analysisData = ref(null);

const fetchAnalysisData = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    analysisData.value = await fetchDataAnalysis();
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchAnalysisData);
</script>

<style scoped>
.data-analysis-container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.error {
  color: red;
}
</style> 