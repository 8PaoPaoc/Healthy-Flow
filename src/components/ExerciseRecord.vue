<template>
  <div class="exercise-record-container">
    <h2>运动记录</h2>
    <form @submit.prevent="submitExerciseRecord">
      <div>
        <label for="exerciseType">运动类型</label>
        <input type="text" v-model="exerciseType" required />
      </div>
      <div>
        <label for="duration">持续时间 (分钟)</label>
        <input type="number" v-model="duration" required />
      </div>
      <div>
        <label for="caloriesBurned">消耗卡路里</label>
        <input type="number" v-model="caloriesBurned" required />
      </div>
      <button type="submit">记录运动数据</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { recordExerciseData } from '../services/exerciseService';

const exerciseType = ref('');
const duration = ref('');
const caloriesBurned = ref('');
const errorMessage = ref('');
const successMessage = ref('');

const submitExerciseRecord = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  try {
    await recordExerciseData({ exerciseType: exerciseType.value, duration: duration.value, caloriesBurned: caloriesBurned.value });
    successMessage.value = '运动数据记录成功！';
  } catch (error) {
    errorMessage.value = error.message;
  }
};
</script>

<style scoped>
.exercise-record-container {
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