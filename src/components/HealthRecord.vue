<template>
  <div class="health-record-container">
    <h2>健康记录</h2>
    <form @submit.prevent="submitHealthRecord">
      <div>
        <label for="weight">体重 (kg)</label>
        <input type="number" v-model="weight" required />
      </div>
      <div>
        <label for="height">身高 (cm)</label>
        <input type="number" v-model="height" required />
      </div>
      <div>
        <label for="bloodPressure">血压 (mmHg)</label>
        <input type="text" v-model="bloodPressure" required />
      </div>
      <div>
        <label for="heartRate">心率 (bpm)</label>
        <input type="number" v-model="heartRate" required />
      </div>
      <div>
        <label for="bloodSugar">血糖 (mg/dL)</label>
        <input type="number" v-model="bloodSugar" required />
      </div>
      <button type="submit">记录健康数据</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { recordHealthData } from '../services/healthService';

const weight = ref('');
const height = ref('');
const bloodPressure = ref('');
const heartRate = ref('');
const bloodSugar = ref('');
const errorMessage = ref('');
const successMessage = ref('');

const submitHealthRecord = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  try {
    await recordHealthData({ weight: weight.value, height: height.value, bloodPressure: bloodPressure.value, heartRate: heartRate.value, bloodSugar: bloodSugar.value });
    successMessage.value = '健康数据记录成功！';
  } catch (error) {
    errorMessage.value = error.message;
  }
};
</script>

<style scoped>
.health-record-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.error {
  color: red;
}
.success {
  color: green;
}
</style> 