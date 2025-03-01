<template>
  <div class="register-container">
    <h2>用户注册</h2>
    <form @submit.prevent="registerUser">
      <div>
        <label for="username">用户名</label>
        <input type="text" v-model="username" required />
      </div>
      <div>
        <label for="email">邮箱</label>
        <input type="email" v-model="email" required />
      </div>
      <div>
        <label for="password">密码</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">注册</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { registerUser } from '../services/authService';

const username = ref('');
const email = ref('');
const password = ref('');
const errorMessage = ref('');

const registerUserHandler = async () => {
  errorMessage.value = '';
  try {
    await registerUser({ username: username.value, email: email.value, password: password.value });
    // TODO: 注册成功后的处理，例如跳转到登录页面
  } catch (error) {
    errorMessage.value = error.message;
  }
};
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.error {
  color: red;
}
</style> 