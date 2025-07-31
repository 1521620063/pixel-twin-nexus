/**
 * Pixel Twin Nexus 前端应用入口文件
 * 
 * @file main.js
 * @description 负责初始化 Vue 3 应用实例并配置所有必要的插件和依赖，包括路由管理、状态管理、UI组件库等核心功能的集成
 * @author chensiyang
 * @version 1.0.0
 * @created 2024-01-01
 * @lastModified 2024-01-01
 * @copyright © 2024 Pixel Twin Nexus. All rights reserved.
 */

// 导入全局样式文件
import './assets/main.css'

// Vue 3 核心依赖
import { createApp } from 'vue'

// 应用组件和路由
import App from './App.vue'
import router from './router'

// Vuetify UI 组件库配置
import 'vuetify/styles' // Vuetify 核心样式
import { createVuetify } from 'vuetify'
import { md3 } from 'vuetify/blueprints' // Material Design 3 设计规范
import '@mdi/font/css/materialdesignicons.css' // Material Design Icons 图标字体

/**
 * 创建 Vuetify 实例
 * 使用 Material Design 3 设计规范，提供现代化的 UI 组件
 * 统一的紫色系主题设计，营造科技感和专业感
 */
const vuetify = createVuetify({
  blueprint: md3, // 启用 Material Design 3 主题
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          // 主色调 - 深紫色系，体现科技感和专业性
          primary: '#6366f1',        // 现代紫蓝色，主要操作按钮
          'primary-darken-1': '#4f46e5', // 深一级紫色，悬停状态
          'primary-lighten-1': '#818cf8', // 浅一级紫色，次要元素
          'primary-lighten-2': '#a5b4fc', // 更浅紫色，背景装饰
          
          // 辅助色调 - 渐变紫色系，保持视觉连贯性
          secondary: '#8b5cf6',      // 紫色，次要操作
          'secondary-darken-1': '#7c3aed', // 深紫色，强调元素
          'secondary-lighten-1': '#a78bfa', // 浅紫色，装饰元素
          
          // 功能色彩 - 保持系统一致性
          accent: '#06b6d4',         // 青色，特殊强调
          success: '#10b981',        // 绿色，成功状态
          warning: '#f59e0b',        // 橙色，警告状态
          error: '#ef4444',          // 红色，错误状态
          info: '#3b82f6',           // 蓝色，信息提示
          
          // 中性色调 - 现代化灰色系
          surface: '#ffffff',        // 卡片背景
          'surface-variant': '#f8fafc', // 次要背景
          'surface-bright': '#ffffff',  // 明亮背景
          'surface-dim': '#f1f5f9',     // 暗淡背景
          
          // 文字颜色
          'on-primary': '#ffffff',   // 主色上的文字
          'on-secondary': '#ffffff', // 辅助色上的文字
          'on-surface': '#1e293b',   // 表面上的文字
          'on-surface-variant': '#64748b', // 次要文字
          
          // 边框和分割线
          outline: '#e2e8f0',        // 边框颜色
          'outline-variant': '#f1f5f9', // 次要边框
          
          // 背景色调
          background: '#fefefe',      // 页面背景
          'background-variant': '#f8fafc', // 次要背景
          
          // 兼容性颜色（保持向后兼容）
          'purple-darken-2': '#6366f1',
        }
      },
      dark: {
        dark: true,
        colors: {
          // 深色模式主色调
          primary: '#818cf8',
          'primary-darken-1': '#6366f1',
          'primary-lighten-1': '#a5b4fc',
          'primary-lighten-2': '#c7d2fe',
          
          secondary: '#a78bfa',
          'secondary-darken-1': '#8b5cf6',
          'secondary-lighten-1': '#c4b5fd',
          
          accent: '#22d3ee',
          success: '#34d399',
          warning: '#fbbf24',
          error: '#f87171',
          info: '#60a5fa',
          
          // 深色模式背景
          surface: '#1e293b',
          'surface-variant': '#334155',
          'surface-bright': '#475569',
          'surface-dim': '#0f172a',
          
          background: '#0f172a',
          'background-variant': '#1e293b',
          
          // 深色模式文字
          'on-primary': '#1e293b',
          'on-secondary': '#1e293b',
          'on-surface': '#f1f5f9',
          'on-surface-variant': '#94a3b8',
          
          outline: '#475569',
          'outline-variant': '#334155',
        }
      }
    }
  },
  defaults: {
    // 全局组件默认属性，提升视觉一致性
    VBtn: {
      style: 'text-transform: none;', // 按钮文字不转大写
      rounded: 'lg',                  // 圆角按钮
    },
    VCard: {
      rounded: 'xl',                  // 卡片圆角
      elevation: 2,                   // 默认阴影
    },
    VTextField: {
      variant: 'outlined',            // 输入框样式
      rounded: 'lg',                  // 输入框圆角
    },
    VSelect: {
      variant: 'outlined',
      rounded: 'lg',
    },
    VTextarea: {
      variant: 'outlined',
      rounded: 'lg',
    },
    VChip: {
      rounded: 'lg',                  // 标签圆角
    }
  }
})

// 创建 Vue 应用实例
const app = createApp(App)

// 注册应用插件
app.use(router)        // 路由管理 - Vue Router
app.use(vuetify)       // UI 组件库 - Vuetify

// 挂载应用到 DOM
app.mount('#app')
