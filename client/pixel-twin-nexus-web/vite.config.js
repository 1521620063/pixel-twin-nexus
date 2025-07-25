/**
 * @fileoverview Vite 构建工具配置文件
 * @description 配置 Vite 开发服务器、构建选项、插件和代理设置
 * @author chensiyang
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 * @copyright Copyright (c) 2024 Pixel Twin Nexus. All rights reserved.
 * 
 * 配置功能：
 * - Vue 3 单文件组件支持
 * - Vuetify UI 组件库集成
 * - Vue DevTools 开发工具
 * - 路径别名配置
 * - 开发服务器代理设置
 * - WebSocket 代理支持
 */

import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'                    // Vue 3 单文件组件支持
import vueDevTools from 'vite-plugin-vue-devtools'     // Vue 开发工具
import vuetify from 'vite-plugin-vuetify'              // Vuetify UI 组件库

// Vite 配置文档: https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, '../../', '')

  return {
    // 环境变量文件目录配置 - 指向项目根目录
    envDir: '../../',
    // 插件配置
    plugins: [
      vue(),          // Vue 3 单文件组件编译支持
      vuetify(),      // Vuetify 组件库按需加载和样式处理
      vueDevTools()   // Vue 开发者工具，提供组件调试功能
    ],

    // 模块解析配置
    resolve: {
      alias: {
        // 设置 @ 别名指向 src 目录，简化导入路径
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },

    // 构建配置
    build: {
      target: 'esnext',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,  // 移除console语句
          drop_debugger: true  // 移除debugger语句
        }
      },
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router', 'pinia'],
            ui: ['vuetify']
          }
        }
      },
      sourcemap: false
    },
    
    // 开发服务器配置
    server: {
      host: '0.0.0.0',    // 允许外部访问（局域网内其他设备可访问）
      port: 5173,         // 开发服务器端口
      cors: true,         // 启用跨域资源共享

      // 代理配置 - 将前端请求转发到后端服务
      proxy: {
        // API 请求代理：将 /service_prefix 开头的请求转发到后端
        '/service_prefix': {
          target: env.VITE_API_URL_PROXY ,  // 从环境变量读取代理地址
          secure: false,                            // 不验证 SSL 证书
          changeOrigin: true,                       // 修改请求头中的 origin
          rewrite: (path) => path.replace(/^\/service_prefix/, ''), // 重写路径，移除前缀
        },
      }
    }
  }
})
