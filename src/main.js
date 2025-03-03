import { createApp } from 'vue';
import App from './App.vue'; // 确保您有一个 App.vue 文件
import router from './router';
import './assets/css/main.css'; // 确保导入 CSS 文件
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

// 创建应用实例
const app = createApp(App);

// 使用路由
app.use(router);
app.use(ElementPlus);

// 挂载应用
app.mount('#app');