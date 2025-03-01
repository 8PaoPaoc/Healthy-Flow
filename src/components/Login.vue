<template>
  <div class="login-container">
    <h2>用户登录</h2>
    <form @submit.prevent="loginUserHandler">
      <div>
        <label for="email">邮箱</label>
        <input type="email" v-model="email" required />
      </div>
      <div>
        <label for="password">密码</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">登录</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { loginUser } from '../services/authService';

const email = ref('');
const password = ref('');
const errorMessage = ref('');

const loginUserHandler = async () => {
  errorMessage.value = '';
  try {
    await loginUser({ email: email.value, password: password.value });
    // TODO: 登录成功后的处理，例如跳转到用户主页
  } catch (error) {
    errorMessage.value = error.message;
  }
};
</script>

<style scoped>
.login-container {
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