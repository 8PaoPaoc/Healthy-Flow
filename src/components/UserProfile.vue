<template>
  <div class="user-profile-container">
    <h2>用户信息</h2>
    <form @submit.prevent="updateUserProfile">
      <div>
        <label for="username">用户名</label>
        <input type="text" v-model="username" required />
      </div>
      <div>
        <label for="email">邮箱</label>
        <input type="email" v-model="email" required />
      </div>
      <button type="submit">更新信息</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getUserProfile, updateUserProfile } from '../services/authService';

const username = ref('');
const email = ref('');
const errorMessage = ref('');
const successMessage = ref('');

const fetchUserProfile = async () => {
  try {
    const profile = await getUserProfile();
    username.value = profile.username;
    email.value = profile.email;
  } catch (error) {
    errorMessage.value = error.message;
  }
};

const updateUserProfileHandler = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  try {
    await updateUserProfile({ username: username.value, email: email.value });
    successMessage.value = '信息更新成功！';
  } catch (error) {
    errorMessage.value = error.message;
  }
};

onMounted(fetchUserProfile);
</script>

<style scoped>
.user-profile-container {
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