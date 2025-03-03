# HealthyFlow - 健康管理系统

## 项目介绍
HealthyFlow 是一个现代化的健康管理系统，帮助用户记录和分析个人健康数据。

## 主要功能
- 健康数据记录（体温、血压、心率等）
- 历史记录管理
- 数据分析和可视化
- 健康建议生成

## 技术栈
- Vue 3.4
- TypeScript
- Vite
- Element Plus
- ECharts
- Tailwind CSS
- Pinia
- Vue Router

## 开发环境设置
1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 构建生产版本：
```bash
npm run build
```

## 项目结构
```
src/
  ├── components/      # 组件
  ├── views/          # 页面
  ├── router/         # 路由配置
  ├── stores/         # Pinia 状态管理
  ├── services/       # API 服务
  ├── utils/          # 工具函数
  └── assets/         # 静态资源
```

## 组件说明
- HealthRecord：健康数据记录组件
  - 支持记录体温、血压、心率等健康指标
  - 提供数据验证和历史记录管理
  - 包含数据编辑和删除功能

## 开发进度
- [x] 项目基础架构搭建
- [x] 健康记录组件开发
- [x] 表单验证实现
- [x] 历史记录管理
- [ ] 数据分析功能
- [ ] 健康建议生成
- [ ] 数据导出功能

## 注意事项
- 确保 Node.js 版本 >= 18.0.0
- 开发时请遵循项目的代码规范
- 提交代码前请进行代码格式化 