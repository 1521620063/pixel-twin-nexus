# Pixel Twin Nexus

一个基于 NestJS + Vue 3 构建的企业级数字孪生管理平台，提供完整的前后端解决方案。后端提供 RESTful API 和 WebSocket 实时通信，前端支持实时数据可视化、WebRTC 流媒体播放和现代化 UI 交互。支持主从架构部署，可同时管理多个 Pixel Twin 实例。

## 🌟 项目特点

### 后端服务 (NestJS)
- 🚀 **企业级架构** - 基于 NestJS 的模块化设计
- 🔐 **安全认证** - JWT 身份验证和权限控制
- 📡 **实时通信** - WebSocket 双向通信支持
- 🎯 **主从架构** - 支持分布式部署和负载均衡
- 🛡️ **安全防护** - CSRF、XSS、请求频率限制

### 前端应用 (Vue 3)
- 🎨 **现代化 UI** - Material Design 3 设计系统
- ⚡ **高性能** - Vite 构建工具，HMR 热更新
- 📱 **响应式设计** - 完美适配桌面端和移动端
- 🎥 **流媒体播放** - WebRTC 实时视频流播放
- 🌙 **主题切换** - 支持明亮/深色主题动态切换

## 🛠️ 技术栈

### 后端技术栈
- **NestJS** - 基于 Node.js 的渐进式企业级框架
- **TypeScript** - 类型安全的 JavaScript 超集
- **JWT** - 身份验证
- **WebSocket** - 实时通信
- **PM2** - 进程管理

### 前端技术栈
- **Vue 3** - 渐进式 JavaScript 框架
- **Vite** - 下一代前端构建工具
- **Vuetify** - Material Design 3 组件库
- **Pinia** - Vue 3 状态管理库
- **WebRTC** - 实时流媒体播放

## 🚀 部署指南

### 环境要求
- Node.js >= 20.x
- npm >= 10.x

### 安装依赖
```bash

# 安装依赖
npm run install:all
```

### 构建项目
```bash
# 配置前端环境变量
cp .env.production.local .env.production
# 配置信令服务环境变量
cp .env.master.local .env.master
# 配置UE渲染子节点环境变量
cp .env.slave.local .env.slave
# 构建前端生产版本
npm run build:client
```

### 启动服务
```bash
# 启动主节点
npm run start:prod:master

# 启动从节点
npm run start:prod:slave
```

### PM2 部署
```bash
# 使用 PM2 启动主节点
npm run pm2:start:master

# 使用 PM2 启动从节点
npm run pm2:start:slave
```

## 📁 目录结构

```
project/
├── dist/                   # 后端构建输出目录
├── client/
│   └── pixel-twin-nexus-web/
│       └── dist/           # 前端构建输出目录
├── json/                   # 配置文件目录
├── ecosystem.config.js     # PM2 配置文件
└── README.md               # 项目说明文件
```

## 📄 许可证

本项目为专有软件，未经授权不得使用、复制或分发。
