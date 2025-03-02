import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist', // 输出目录
    assetsDir: 'assets', // 资源目录
    rollupOptions: {
      input: {
        main: 'index.html', // 确保入口文件为 index.html
      },
    },
  },
  server: {
    port: 8080,
    open: true
  }
}); 