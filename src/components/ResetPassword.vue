<template>
  <div class="reset-password-container">
    <h2>重置密码</h2>
    <form @submit.prevent="resetPasswordHandler">
      <div>
        <label for="email">邮箱</label>
        <input type="email" v-model="email" required />
      </div>
      <div>
        <label for="newPassword">新密码</label>
        <input type="password" v-model="newPassword" required />
      </div>
      <button type="submit">重置密码</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { resetPassword } from '../services/authService';

const email = ref('');
const newPassword = ref('');
const errorMessage = ref('');
const successMessage = ref('');

const resetPasswordHandler = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  try {
    await resetPassword({ email: email.value, newPassword: newPassword.value });
    successMessage.value = '密码重置成功！';
  } catch (error) {
    errorMessage.value = error.message;
  }
};
</script>

<style scoped>
.reset-password-container {
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