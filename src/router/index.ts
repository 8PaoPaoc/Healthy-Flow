import { createRouter, createWebHistory } from 'vue-router';
import Register from '../components/Register.vue';
import Login from '../components/Login.vue';
import ResetPassword from '../components/ResetPassword.vue';
import UserProfile from '../components/UserProfile.vue';
import HealthRecord from '../components/HealthRecord.vue';
import NutritionRecord from '../components/NutritionRecord.vue';
import DataAnalysis from '../components/DataAnalysis.vue';

const routes = [
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/reset-password', component: ResetPassword },
  { path: '/profile', component: UserProfile },
  { path: '/health-record', component: HealthRecord },
  { path: '/nutrition-record', component: NutritionRecord },
  { path: '/data-analysis', component: DataAnalysis },
  { path: '/', redirect: '/login' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;