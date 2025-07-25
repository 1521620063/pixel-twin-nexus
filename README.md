# Pixel Twin Nexus

一个基于 NestJS + Vue 3 构建的企业级数字孪生管理平台，提供完整的前后端解决方案。后端提供 RESTful API 和 WebSocket 实时通信，前端支持实时数据可视化、WebRTC 流媒体播放和现代化 UI 交互。支持主从架构部署，可同时管理多个 Pixel Twin 实例。

## 🌟 项目概览

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

## 🚀 部署指南

### GitHub 部署

项目支持将指定文件自动部署到 GitHub 仓库。如果目标分支不存在，脚本会自动创建新分支。

使用以下命令可以一键部署文件到 GitHub：

```bash
npm run deploy:github
```

对于只有 main 分支的仓库，可以使用以下命令：

```bash
GITHUB_DEPLOY_BRANCH=main npm run deploy:github
```

详细说明请查看 [GitHub 部署指南](./docs/github-deployment.md)。

## 🛠️ 技术栈

### 后端技术栈

#### 核心框架
- **NestJS 11.0.1** - 基于 Node.js 的渐进式企业级框架
- **Express** - 快速、极简的 Web 框架（通过 @nestjs/platform-express）
- **TypeScript 5.7.3** - 类型安全的 JavaScript 超集
- **Reflect Metadata** - 元数据反射支持

#### 认证与安全
- **@nestjs/jwt 11.0.0** - JWT 身份验证模块
- **Helmet 8.1.0** - HTTP 安全头设置
- **CSRF-CSRF 4.0.3** - 跨站请求伪造防护
- **Cookie Parser 1.4.7** - Cookie 解析中间件
- **@nestjs/throttler 6.4.0** - 请求频率限制

#### WebSocket 通信
- **@nestjs/websockets 11.1.3** - WebSocket 网关支持
- **@nestjs/platform-ws 11.1.3** - WebSocket 平台适配器

#### 数据验证与转换
- **Class Validator 0.14.2** - 基于装饰器的数据验证
- **Class Transformer 0.5.1** - 对象转换和序列化

#### 工具库
- **UUID 11.1.0** - 唯一标识符生成
- **FS Extra 11.3.0** - 增强的文件系统操作
- **Tree Kill 1.2.2** - 进程树终止
- **Compression 1.8.0** - HTTP 响应压缩
- **RxJS 7.8.1** - 响应式编程库

#### 开发工具
- **SWC 1.10.7** - 快速 TypeScript/JavaScript 编译器
- **ESLint 9.18.0** - 代码质量检查
- **Prettier 3.4.2** - 代码格式化
- **Concurrently 9.2.0** - 并发执行多个命令
- **Cross-env 7.0.3** - 跨平台环境变量设置

### 前端技术栈

#### 核心框架
- **Vue 3** `^3.4.0` - 渐进式 JavaScript 框架，Composition API
- **Vite** `^5.0.0` - 下一代前端构建工具
- **Vue Router** `^4.2.0` - 官方路由管理器
- **Pinia** `^2.1.0` - Vue 3 状态管理库

#### UI 组件与样式
- **Vuetify** `^3.4.0` - Material Design 3 组件库
- **Material Design Icons** `^7.4.0` - 图标字体库
- **@mdi/js** `^7.4.0` - SVG 图标集（生产优化）
- **Sass** `^1.69.0` - CSS 预处理器

#### 实时通信
- **Socket.io Client** `^4.7.0` - WebSocket 客户端库
- **WebRTC API** - 原生浏览器流媒体支持

#### 开发工具
- **TypeScript** `^5.2.0` - 类型系统
- **ESLint** `^8.49.0` - 代码质量检查
- **Prettier** `^3.0.0` - 代码格式化
- **@vitejs/plugin-vue** `^4.4.0` - Vue SFC 支持

## 📁 项目结构

```
pixel-twin-nexus/
├── .env.development            # 开发环境变量
├── .env.master                 # 主节点环境变量
├── .env.production             # 生产环境变量
├── .env.slave                  # 从节点环境变量
├── .gitignore                  # Git 忽略文件
├── .prettierrc                 # Prettier 配置
├── README.md                   # 项目文档
├── ecosystem.config.js         # PM2 配置文件
├── eslint.config.mjs           # ESLint 配置
├── nest-cli.json               # NestJS CLI 配置
├── package.json                # 项目依赖
├── tsconfig.json               # TypeScript 配置
├── tsconfig.build.json         # 构建配置
├── src/                        # 后端源码
│   ├── app.module.ts           # 应用根模块
│   ├── main.ts                 # 应用入口文件
│   ├── commonEnum.ts           # 通用枚举定义
│   ├── http-exception.filter.ts # 全局异常过滤器
│   ├── auth/                   # 认证模块
│   │   ├── auth.controller.ts  # 认证控制器
│   │   ├── auth.dto.ts        # 认证数据传输对象
│   │   ├── auth.guard.ts      # JWT 认证守卫
│   │   ├── auth.module.ts     # 认证模块定义
│   │   └── auth.service.ts    # 认证服务
│   ├── constants/              # 常量定义
│   │   ├── index.ts           # 常量统一导出
│   │   └── paths.constants.ts # 路径常量
│   ├── encryption/             # 加密相关
│   │   └── encryption.md      # 加密文档
│   ├── interceptors/           # 拦截器
│   │   ├── httpInterceptors.ts # HTTP 响应拦截器
│   │   └── wsInterceptors.ts  # WebSocket 拦截器
│   ├── pipe/                   # 管道
│   │   └── validation.pipe.ts # 数据验证管道
│   ├── pixel-twin/             # Pixel Twin 核心模块
│   │   ├── pixel-twin-player.gateway.ts # 播放器 WebSocket 网关
│   │   ├── pixel-twin-ue.gateway.ts     # UE WebSocket 网关
│   │   ├── pixel-twin.controller.ts     # Pixel Twin 控制器
│   │   ├── pixel-twin.module.ts         # Pixel Twin 模块定义
│   │   └── pixel-twin.service.ts        # Pixel Twin 服务
│   ├── pixel-twin-config/      # 配置管理模块
│   │   ├── pixel-twin-config.controller.ts # 配置控制器
│   │   ├── pixel-twin-config.module.ts     # 配置模块定义
│   │   └── pixel-twin-config.service.ts    # 配置服务
│   ├── pixel-twin-instance/    # 实例管理模块
│   │   ├── pixel-twin-instance.controller.ts # 实例控制器
│   │   ├── pixel-twin-instance.module.ts     # 实例模块定义
│   │   └── pixel-twin-instance.service.ts    # 实例服务
│   ├── pixel-twin-project/     # 项目管理模块
│   │   ├── pixel-twin-project.controller.ts  # 项目控制器
│   │   ├── pixel-twin-project.module.ts      # 项目模块定义
│   │   └── pixel-twin-project.service.ts     # 项目服务
│   ├── pixel-twin-slave/       # 从节点管理模块
│   │   ├── pixel-twin-slave.controller.ts    # 从节点控制器
│   │   ├── pixel-twin-slave.module.ts        # 从节点模块定义
│   │   └── pixel-twin-slave.service.ts       # 从节点服务
│   ├── users/                  # 用户管理模块
│   │   ├── users.module.ts    # 用户模块定义
│   │   └── users.service.ts   # 用户服务
│   └── utils/                  # 工具类
│       ├── index.ts           # 工具类统一导出
│       ├── client.util.ts     # 客户端工具
│       ├── json.util.ts       # JSON 文件操作工具
│       ├── system-resource.util.ts # 系统资源工具
│       └── url.util.ts        # URL 工具
├── client/                     # 前端应用
│   └── pixel-twin-nexus-web/   # Vue 3 前端项目
│       ├── public/             # 静态资源
│       │   ├── favicon.ico
│       │   └── index.html
│       ├── src/
│       │   ├── api/            # API 接口层
│       │   │   ├── index.js   # API 统一导出
│       │   │   ├── request.js # Axios 请求封装
│       │   │   └── modules/   # 模块化 API
│       │   │       ├── auth.js        # 认证相关
│       │   │       ├── pixelTwin.js   # 数字孪生
│       │   │       └── websocket.js   # WebSocket 管理
│       │   ├── assets/         # 静态资源
│       │   │   ├── images/    # 图片资源
│       │   │   ├── icons/     # 图标文件
│       │   │   └── styles/    # 全局样式
│       │   │       ├── main.scss     # 主样式文件
│       │   │       ├── variables.scss # Sass 变量
│       │   │       └── vuetify.scss  # Vuetify 自定义
│       │   ├── components/     # 可复用组件
│       │   │   ├── common/    # 通用组件
│       │   │   │   ├── AppHeader.vue
│       │   │   │   ├── AppSidebar.vue
│       │   │   │   └── LoadingSpinner.vue
│       │   │   ├── charts/    # 图表组件
│       │   │   │   ├── LineChart.vue
│       │   │   │   └── BarChart.vue
│       │   │   └── media/     # 媒体组件
│       │   │       ├── VideoPlayer.vue
│       │   │       └── StreamViewer.vue
│       │   ├── config/         # 配置文件
│       │   │   ├── index.js   # 主配置
│       │   │   ├── api.js     # API 配置
│       │   │   └── websocket.js # WebSocket 配置
│       │   ├── plugins/        # Vue 插件
│       │   │   ├── vuetify.js # Vuetify 配置
│       │   │   └── router.js  # 路由配置
│       │   ├── router/         # 路由管理
│       │   │   ├── index.js   # 路由主文件
│       │   │   └── routes.js  # 路由定义
│       │   ├── stores/         # Pinia 状态管理
│       │   │   ├── index.js   # Store 入口
│       │   │   ├── auth.js    # 认证状态
│       │   │   ├── pixelTwin.js # 数字孪生状态
│       │   │   └── websocket.js # WebSocket 状态
│       │   ├── utils/          # 工具函数
│       │   │   ├── index.js   # 工具函数导出
│       │   │   ├── format.js  # 格式化工具
│       │   │   ├── validation.js # 验证工具
│       │   │   └── websocket.js # WebSocket 工具
│       │   ├── views/          # 页面组件
│       │   │   ├── Home.vue   # 首页
│       │   │   ├── Dashboard.vue # 仪表板
│       │   │   ├── PixelTwin.vue # 数字孪生主页
│       │   │   └── Settings.vue # 设置页面
│       │   ├── App.vue         # 根组件
│       │   └── main.js         # 应用入口
│       ├── .env                # 环境变量
│       ├── .env.development    # 开发环境变量
│       ├── .env.production     # 生产环境变量
│       ├── .gitignore          # Git 忽略文件
│       ├── index.html          # HTML 模板
│       ├── jsconfig.json       # JavaScript 配置
│       ├── package.json        # 项目依赖
│       └── vite.config.js      # Vite 配置
├── json/                       # JSON 配置文件
│   ├── pixelTwinConfig.json   # Pixel Twin 配置
│   ├── pixelTwinGPU.json      # GPU 配置
│   └── pixelTwinList.json     # Pixel Twin 列表
└── public/                     # 后端静态资源
```

## 🔧 核心功能

### 1. 用户认证与授权
- **JWT 身份验证**: 基于 JSON Web Token 的无状态认证
- **认证守卫**: 路由级别的权限控制
- **JWT 策略**: 自定义 JWT 验证策略
- **用户管理**: 用户注册、登录、信息管理

### 2. Pixel Twin 核心管理
- **项目管理**: Pixel Twin 项目的创建、配置、删除
- **实例控制**: 系统实例的启动、停止、状态监控
- **配置管理**: 系统配置的读取、更新、验证
- **进程管理**: 后台进程的生命周期管理

### 3. WebSocket 实时通信
- **信号网关**: 基于 WebSocket 的实时双向通信
- **事件处理**: 客户端事件监听和响应
- **连接管理**: WebSocket 连接的建立和维护
- **消息广播**: 多客户端消息分发

### 4. 数据验证与安全
- **DTO 验证**: 基于 Class Validator 的数据验证
- **管道验证**: 全局数据验证管道
- **异常处理**: 统一的异常捕获和处理
- **安全防护**: CSRF、XSS、请求频率限制

### 5. 文件系统操作
- **JSON 配置**: 配置文件的读写操作
- **路径管理**: 统一的文件路径常量管理
- **文件监控**: 配置文件变更监听

## 🎨 设计系统

### Material Design 3 主题

项目采用 Material Design 3 设计规范，支持明亮/深色主题切换：

#### 明亮主题色彩
```scss
$light-theme: (
  primary: #6750A4,
  on-primary: #FFFFFF,
  primary-container: #EADDFF,
  on-primary-container: #21005D,
  secondary: #625B71,
  on-secondary: #FFFFFF,
  secondary-container: #E8DEF8,
  on-secondary-container: #1D192B,
  surface: #FEF7FF,
  on-surface: #1D1B20,
  surface-variant: #E7E0EC,
  on-surface-variant: #49454F
);
```

#### 深色主题色彩
```scss
$dark-theme: (
  primary: #D0BCFF,
  on-primary: #381E72,
  primary-container: #4F378B,
  on-primary-container: #EADDFF,
  secondary: #CCC2DC,
  on-secondary: #332D41,
  secondary-container: #4A4458,
  on-secondary-container: #E8DEF8,
  surface: #141218,
  on-surface: #E6E0E9,
  surface-variant: #49454F,
  on-surface-variant: #CAC4D0
);
```

#### 响应式断点
```scss
$breakpoints: (
  xs: 0,
  sm: 600px,
  md: 960px,
  lg: 1280px,
  xl: 1920px,
  xxl: 2560px
);
```

## 🚀 快速开始

### 环境要求
- Node.js >= 20.0.0
- npm >= 10.0.0
- TypeScript >= 5.0.0
- Vue 3 >= 3.4.0
- Vite >= 5.0.0

### 安装依赖
```bash
# 安装后端依赖
npm install

# 安装前端依赖
cd client/pixel-twin-nexus-web
npm install
```

### 开发模式
```bash
# 同时启动前后端开发服务器
npm run start

# 仅启动后端开发服务器（主节点）
npm run start:server

# 仅启动前端开发服务器
npm run start:client

# 启动从节点开发服务器
npm run start:slave

# 单独启动前端开发服务器
cd client/pixel-twin-nexus-web
npm run dev
```

### 生产构建
```bash
# 构建整个项目（前端+后端）
npm run build

# 仅构建后端
npm run build:server

# 仅构建前端
npm run build:client

# 启动生产服务器（主节点）
npm run start:prod

# 启动生产服务器（从节点）
npm run start:prod:slave

# 单独构建前端项目
cd client/pixel-twin-nexus-web
npm run build

# 预览前端构建结果
npm run preview
```

### 代码质量检查
```bash
# 后端代码检查
npm run lint

# 前端代码检查
cd client/pixel-twin-nexus-web
npm run lint
npm run type-check
```

### PM2 部署管理
```bash
# 启动 PM2 集群
npm run pm2:start

# 启动生产环境主节点
npm run pm2:start:prod

# 启动从节点
npm run pm2:start:slave

# 停止所有服务
npm run pm2:stop

# 重启所有服务
npm run pm2:restart

# 删除所有服务
npm run pm2:delete

# 查看日志
npm run pm2:logs

# 查看状态
npm run pm2:status
```

## 📡 API 接口

### 认证接口
- `POST /auth/login` - 用户登录
- `POST /auth/logout` - 用户登出
- `GET /auth/profile` - 获取用户信息

### 项目管理接口
- `GET /project` - 获取项目列表
- `POST /project` - 创建新项目
- `PUT /project/:id` - 更新项目信息
- `DELETE /project/:id` - 删除项目

### 实例管理接口
- `GET /instance` - 获取实例状态
- `POST /instance/start` - 启动实例
- `POST /instance/stop` - 停止实例
- `GET /instance/logs` - 获取实例日志

### 配置管理接口
- `GET /config` - 获取系统配置
- `PUT /config` - 更新系统配置
- `POST /config/validate` - 验证配置

### Pixel Twin 接口
- `GET /pixel-twin` - 获取 Pixel Twin 信息
- `POST /pixel-twin/deploy` - 部署 Pixel Twin
- `POST /pixel-twin/undeploy` - 卸载 Pixel Twin

## 🔌 WebSocket 事件

### 客户端事件
- `connection` - 客户端连接
- `disconnect` - 客户端断开
- `message` - 消息发送
- `join-room` - 加入房间
- `leave-room` - 离开房间

### 服务端事件
- `status-update` - 状态更新通知
- `log-message` - 日志消息推送
- `error-notification` - 错误通知
- `system-alert` - 系统警报

## 🛡️ 安全特性

### 认证安全
- JWT Token 过期机制
- 刷新 Token 支持
- 密码加密存储
- 会话管理

### 请求安全
- CORS 跨域配置
- CSRF 攻击防护
- XSS 脚本注入防护
- 请求频率限制

### 数据安全
- 输入数据验证
- SQL 注入防护
- 敏感信息脱敏
- 错误信息过滤

## ⚙️ 配置说明

### 后端环境变量

项目支持多环境配置：

- `.env.development` - 开发环境配置
- `.env.master` - 主节点配置
- `.env.slave` - 从节点配置
- `.env.production` - 生产环境配置

### 后端主要配置项

```bash
# 服务器配置
PORT=3000
HOST=localhost

# 数据库配置
DATABASE_URL=mongodb://localhost:27017/pixel-twin

# JWT 配置
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# WebSocket 配置
WS_PORT=3001
WS_CORS_ORIGIN=http://localhost:8080

# Pixel Twin 配置
PIXEL_TWIN_CONFIG_PATH=./json/pixelTwinConfig.json
PIXEL_TWIN_GPU_CONFIG_PATH=./json/pixelTwinGPU.json
```

## 🛠️ 开发工具

### Vue DevTools

```javascript
// 开发环境启用 Vue DevTools
if (import.meta.env.DEV) {
  app.config.devtools = true;
}
```

### Vuetify 主题调试

```javascript
// 主题切换和调试
import { useTheme } from 'vuetify';

const theme = useTheme();

// 动态切换主题
const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark 
    ? 'light' 
    : 'dark';
};
```

### 性能监控

```javascript
// 性能监控配置
if (import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING) {
  // 启用性能监控
  performance.mark('app-start');
  
  // 组件渲染性能监控
  app.config.performance = true;
}
```

## 🚀 部署

### 静态部署

```bash
# 构建前端项目
cd client/pixel-twin-nexus-web
npm run build

# 部署到 Nginx
sudo cp -r dist/* /var/www/html/

# Nginx 配置示例
server {
  listen 80;
  server_name your-domain.com;
  root /var/www/html;
  index index.html;
  
  location / {
    try_files $uri $uri/ /index.html;
  }
  
  location /api {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
  
  location /socket.io {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}
```

### Docker 部署

```dockerfile
# 前端 Dockerfile
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "3000:3000"
      - "3001:3001"
    environment:
      - NODE_ENV=production
    volumes:
      - ./json:/app/json
  
  frontend:
    build: ./client/pixel-twin-nexus-web
    ports:
      - "80:80"
    depends_on:
      - backend
```

## 🔧 配置管理

### JSON 配置文件

项目使用 JSON 文件进行配置管理：

- `pixelTwinConfig.json` - Pixel Twin 主配置
- `pixelTwinGPU.json` - GPU 相关配置
- `pixelTwinList.json` - Pixel Twin 实例列表

### 配置热重载

- **实时监控**: 配置文件变更自动重载
- **版本控制**: 配置变更历史记录
- **验证机制**: 配置文件格式验证
- **备份恢复**: 自动备份和恢复机制

### 配置同步

- **主从同步**: 主节点配置自动同步到从节点
- **增量更新**: 只同步变更的配置项
- **冲突解决**: 配置冲突自动解决机制
- **状态监控**: 配置同步状态实时监控

### 前端开发配置

#### Vite 开发服务器配置

```javascript
// vite.config.js
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 8080,
    open: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      },
      '/socket.io': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        ws: true
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@views': path.resolve(__dirname, 'src/views'),
      '@stores': path.resolve(__dirname, 'src/stores'),
      '@utils': path.resolve(__dirname, 'src/utils')
    }
  }
});
```

#### 前端环境变量

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_URL=http://localhost:3001
VITE_APP_TITLE=Pixel Twin Nexus - Development
VITE_ENABLE_DEVTOOLS=true

# .env.production
VITE_API_BASE_URL=/api
VITE_WS_URL=wss://your-domain.com
VITE_APP_TITLE=Pixel Twin Nexus
VITE_ENABLE_DEVTOOLS=false
```

## 🔌 WebSocket 集成

### Socket.io 客户端配置

```javascript
// src/config/websocket.js
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_WS_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
  timeout: 20000
});

export default socket;
```

### 事件类型定义

```javascript
// WebSocket 事件类型
export const WS_EVENTS = {
  // 连接事件
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  
  // Pixel Twin 事件
  PIXEL_TWIN_STATUS: 'pixelTwinStatus',
  PIXEL_TWIN_UPDATE: 'pixelTwinUpdate',
  PIXEL_TWIN_ERROR: 'pixelTwinError',
  
  // 用户事件
  USER_JOIN: 'userJoin',
  USER_LEAVE: 'userLeave',
  
  // 系统事件
  SYSTEM_STATUS: 'systemStatus',
  RESOURCE_UPDATE: 'resourceUpdate'
};
```

## ⚡ 性能优化

### Vite 构建优化

```javascript
// vite.config.js - 构建优化
export default defineConfig({
  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          ui: ['vuetify'],
          utils: ['axios', 'socket.io-client']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'vuetify']
  }
});
```

### 组件懒加载

```javascript
// 路由懒加载
const routes = [
  {
    path: '/dashboard',
    component: () => import('@/views/Dashboard.vue')
  },
  {
    path: '/pixel-twin',
    component: () => import('@/views/PixelTwin.vue')
  }
];

// 组件懒加载
const LazyChart = defineAsyncComponent(() => 
  import('@/components/charts/LineChart.vue')
);
```

### 图片优化

```javascript
// 图片懒加载和优化
const imageOptimization = {
  // 使用 WebP 格式
  formats: ['webp', 'jpg'],
  // 响应式图片
  sizes: [320, 640, 960, 1280, 1920],
  // 懒加载
  loading: 'lazy'
};
```

## 🔧 配置管理

### 环境配置
```typescript
// 开发环境
export const config = {
  port: 3000,
  jwt: {
    secret: 'your-secret-key',
    expiresIn: '1h'
  },
  cors: {
    origin: 'http://localhost:5173'
  }
};
```

### 数据库配置
```typescript
// 数据库连接配置
export const database = {
  type: 'sqlite',
  database: 'pixel-twin.db',
  synchronize: true,
  logging: false
};
```

## 📊 监控与日志

### 应用监控
- 请求响应时间统计
- API 调用频率监控
- 错误率统计
- 系统资源使用监控

### 日志管理
- 分级日志记录
- 日志文件轮转
- 错误日志告警
- 访问日志记录

## 🚀 部署指南

### Docker 部署
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]
```

### PM2 部署
```json
{
  "name": "pixel-twin-nexus",
  "script": "dist/main.js",
  "instances": "max",
  "exec_mode": "cluster",
  "env": {
    "NODE_ENV": "production",
    "PORT": 3000
  }
}
```

### GitHub 部署

项目支持直接部署到 GitHub 仓库，使用专门的部署脚本将构建产物和必要文件推送到指定分支。

有关详细说明，请参阅 [GitHub 部署文档](docs/github-deployment.md)。

```bash
# 部署到 GitHub (默认使用 main 分支)
npm run deploy:github

# 部署到指定分支
GITHUB_DEPLOY_BRANCH=main npm run deploy:github
```

## 📈 性能优化

### 代码优化
- 懒加载模块
- 缓存策略实现
- 数据库查询优化
- 内存使用优化

### 网络优化
- HTTP 响应压缩
- 静态资源缓存
- CDN 加速配置
- 负载均衡配置

## 🔍 故障排查

### 常见问题
1. **端口占用**: 检查端口 3000 是否被占用
2. **依赖安装失败**: 清除 node_modules 重新安装
3. **JWT 验证失败**: 检查密钥配置和 Token 有效期
4. **WebSocket 连接失败**: 检查 CORS 配置和防火墙设置

### 调试工具
- NestJS Logger
- Chrome DevTools
- Postman API 测试
- WebSocket 测试工具

## 🤝 贡献指南

我们欢迎所有形式的贡献！请遵循以下指南：

### 开发流程

1. **Fork 项目**
   ```bash
   git clone https://github.com/your-username/pixel-twin-nexus.git
   cd pixel-twin-nexus
   ```

2. **创建功能分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **安装依赖**
   ```bash
   # 后端依赖
   npm install
   
   # 前端依赖
   cd client/pixel-twin-nexus-web
   npm install
   ```

4. **开发和代码检查**
   ```bash
   # 后端代码检查
   npm run lint
   npm run format
   
   # 前端代码检查
   cd client/pixel-twin-nexus-web
   npm run lint
   npm run format
   ```

5. **提交代码**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```

### 提交规范

请使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 代码重构
- `chore:` 构建过程或辅助工具的变动

### 代码审查

- 遵循项目的代码风格
- 添加必要的文档和注释
- 更新相关的 README 文档

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 📞 支持

### 获取帮助

- 📖 **文档**: 查看本 README 和代码注释
- 🐛 **Bug 报告**: [提交 Issue](https://github.com/your-repo/pixel-twin-nexus/issues)
- 💡 **功能请求**: [提交 Feature Request](https://github.com/your-repo/pixel-twin-nexus/issues)
- 💬 **讨论**: [GitHub Discussions](https://github.com/your-repo/pixel-twin-nexus/discussions)

### 联系方式

- **邮箱**: istack@yeah.net


**Pixel Twin Nexus** - 下一代数字孪生云渲染平台 🚀

*Built with ❤️ by the Pixel Twin Nexus Team*
