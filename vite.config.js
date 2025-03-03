import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

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
    host: true, // 监听所有地址
    port: 8083,
    strictPort: true, // 如果端口被占用，不要尝试下一个端口
    open: true, // 自动打开浏览器
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  }
}); 