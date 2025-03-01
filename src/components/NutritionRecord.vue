<template>
  <div class="nutrition-record-container">
    <h2>营养记录</h2>
    <form @submit.prevent="submitNutritionRecord">
      <div>
        <label for="mealType">餐食类型</label>
        <input type="text" v-model="mealType" required />
      </div>
      <div>
        <label for="foodItems">食物项 (JSON格式)</label>
        <textarea v-model="foodItems" required></textarea>
      </div>
      <div>
        <label for="calories">卡路里</label>
        <input type="number" v-model="calories" required />
      </div>
      <div>
        <label for="waterIntake">水分摄入 (L)</label>
        <input type="number" v-model="waterIntake" required />
      </div>
      <button type="submit">记录饮食数据</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { recordNutritionData } from '../services/nutritionService';

const mealType = ref('');
const foodItems = ref('');
const calories = ref('');
const waterIntake = ref('');
const errorMessage = ref('');
const successMessage = ref('');

const submitNutritionRecord = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  try {
    await recordNutritionData({ mealType: mealType.value, foodItems: JSON.parse(foodItems.value), calories: calories.value, waterIntake: waterIntake.value });
    successMessage.value = '饮食数据记录成功！';
  } catch (error) {
    errorMessage.value = error.message;
  }
};
</script>

<style scoped>
.nutrition-record-container {
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