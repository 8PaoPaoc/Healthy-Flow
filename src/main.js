import { createApp } from 'vue';
import App from './App.vue'; // 确保您有一个 App.vue 文件
import router from './router';
import './assets/css/main.css'; // 确保导入 CSS 文件

// 创建应用实例
const app = createApp(App);

// 使用路由
app.use(router);

// 挂载应用
app.mount('#app');