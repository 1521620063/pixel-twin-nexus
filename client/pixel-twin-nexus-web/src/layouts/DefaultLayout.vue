<!--
/**
 * @fileoverview 默认布局组件
 * @description 应用程序的主要布局组件，包含顶部导航栏、侧边栏、主内容区域和底部状态栏
 * @author chensiyang
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 * @copyright Copyright (c) 2024 Pixel Twin Nexus. All rights reserved.
 * 
 * 功能特性：
 * - 响应式设计，支持桌面端和移动端
 * - 自动生成导航菜单（基于路由配置）
 * - 面包屑导航，显示当前页面路径
 * - 用户信息展示和操作菜单
 * - 实时时间显示
 * - 优雅的动画效果和过渡
 * - 支持深色模式
 * 
 * 布局结构：
 * - v-app-bar: 顶部导航栏，包含应用标题和用户菜单
 * - v-navigation-drawer: 侧边导航栏，包含用户信息和菜单项
 * - v-main: 主内容区域，包含面包屑和路由视图
 * - v-footer: 底部状态栏，显示版权信息和连接状态
 * 
 * 依赖组件：
 * - RouterView: Vue Router的路由视图组件
 * 
 * 依赖工具：
 * - Vue Router: 路由管理
 * - Vuetify: UI组件库
 * 
 * 样式特性：
 * - 渐变背景和毛玻璃效果
 * - 平滑的动画过渡
 * - 响应式布局适配
 * - 自定义滚动条样式
 * - 悬浮和焦点状态优化
 */
-->

<template>
  <v-app>
    <!-- 顶部导航栏 -->
    <v-app-bar
      color="primary"
      dark
      elevation="4"
      app
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title class="d-flex align-center">
        <v-icon class="mr-3" size="28">mdi-hexagon-multiple</v-icon>
        <span class="text-h6 font-weight-bold">Pixel Twin Nexus</span>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <!-- 用户菜单 -->
      <v-menu offset-y>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar size="36" color="secondary">
              <v-icon color="white">mdi-account</v-icon>
            </v-avatar>
          </v-btn>
        </template>

        <v-list min-width="200">
          <v-list-item>
            <v-list-item-title class="font-weight-medium">
              用户名
            </v-list-item-title>
            <v-list-item-subtitle>
              1521620063@qq.com
            </v-list-item-subtitle>
          </v-list-item>
          
          <v-divider></v-divider>
          
          <v-list-item @click="logout">
            <template v-slot:prepend>
              <v-icon color="error">mdi-logout</v-icon>
            </template>
            <v-list-item-title class="text-error">退出登录</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- 侧边导航栏 -->
    <v-navigation-drawer
      v-model="drawer"
      app
      color="grey-lighten-5"
      width="300"
      :permanent="$vuetify.display.lgAndUp"
      class="custom-drawer"
    >
      <!-- 用户信息卡片 -->
      <v-card class="ma-4 user-card" elevation="3">
        <v-card-text class="text-center py-5">
          <v-avatar size="72" color="primary" class="mb-4 user-avatar">
            <v-icon size="36" color="white">mdi-account</v-icon>
          </v-avatar>
          <div class="text-h6 font-weight-bold mb-1">欢迎回来</div>
          <div class="text-body-2 text-medium-emphasis">管理员</div>
          <v-chip
            size="small"
            color="success"
            variant="tonal"
            class="mt-2"
            prepend-icon="mdi-check-circle"
          >
            已登录
          </v-chip>
        </v-card-text>
      </v-card>

      <!-- 导航菜单标题 -->
      <div class="px-6 pb-2">
        <div class="text-overline font-weight-bold text-medium-emphasis">
          导航菜单
        </div>
      </div>

      <!-- 导航菜单 -->
      <v-list nav class="px-3 menu-list">
        <v-list-item
          v-for="(item, index) in menuItems"
          :key="item.title"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          :subtitle="item.subtitle"
          class="mb-2 menu-item"
          rounded="xl"
          color="purple-darken-2"
          :class="`menu-item-${index}`"
        >
          <template v-slot:append>
            <v-icon size="small" class="menu-arrow">mdi-chevron-right</v-icon>
          </template>
        </v-list-item>
      </v-list>

      <!-- 底部信息 -->
      <template v-slot:append>
        <v-divider class="mb-2"></v-divider>
        <div class="pa-4 text-center">
          <v-chip
            color="success"
            variant="tonal"
            size="small"
            prepend-icon="mdi-circle"
          >
            在线
          </v-chip>
          <div class="text-caption text-medium-emphasis mt-2">
            版本 v1.0.0
          </div>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- 主要内容区域 -->
    <v-main>
      <!-- 面包屑导航 -->
      <v-container fluid class="py-2">
        <v-breadcrumbs
          :items="breadcrumbs"
          class="pa-0"
        >
          <template v-slot:prepend>
            <v-icon size="small">mdi-home</v-icon>
          </template>
          <template v-slot:divider>
            <v-icon size="small">mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
      </v-container>

      <!-- 页面内容 -->
      <v-container fluid class="pa-4">
        <v-fade-transition mode="out-in">
          <RouterView />
        </v-fade-transition>
      </v-container>
    </v-main>

    <!-- 底部状态栏 -->
    <v-footer
      app
      color="grey-lighten-4"
      height="40"
      class="d-flex align-center justify-space-between px-4"
    >
      <div class="text-caption text-medium-emphasis">
        © {{new Date().getFullYear()}} Pixel Twin Nexus. All rights reserved.
      </div>
      <div class="d-flex align-center">
        <v-chip
          size="x-small"
          color="success"
          variant="flat"
          class="mr-2"
        >
          <v-icon start size="12">mdi-wifi</v-icon>
          已连接
        </v-chip>
        <span class="text-caption text-medium-emphasis">
          {{ currentTime }}
        </span>
      </div>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { logout as routerLogout } from '@/router/routerUtils'
import { routes } from '@/router'

const router = useRouter()
const route = useRoute()

// 响应式数据
const drawer = ref(false)
const currentTime = ref('')

/**
 * 根据路由配置自动生成菜单项
 * 从路由配置中提取需要在菜单中显示的路由
 */
const generateMenuItems = () => {
  
  const homeRoute = routes.find(route => route.path === '/home')
  
  if (!homeRoute || !homeRoute.children) {
    return []
  }
  
  return homeRoute.children
    .filter(child => {
      // 过滤掉重定向路由和不需要在菜单中显示的路由
      return child.path && 
             child.path !== '' && 
             child.meta?.title &&
             !child.meta?.hideInMenu
    })
    .map(child => {
      // 根据路由路径自动分配图标
      const getIconByPath = (path) => {
        if (path.includes('welcome')) return 'mdi-home'
        if (path.includes('webrtc') || path.includes('player')) return 'mdi-play-circle'
        if (path.includes('service-config')) return 'mdi-cog-outline'
        if (path.includes('project-management')) return 'mdi-folder-multiple-outline'
        if (path.includes('instance-management')) return 'mdi-cube-outline'
        if (path.includes('profile')) return 'mdi-account-circle'
        if (path.includes('settings')) return 'mdi-cog'
        return 'mdi-file-document'
      }
      
      return {
        title: child.meta.title.replace(' - Pixel Twin Nexus', ''),
        subtitle: child.meta.description || '功能模块',
        icon: child.meta.icon || getIconByPath(child.path),
        to: `/home/${child.path}`
      }
    })
}

// 菜单项配置 - 自动从路由生成
const menuItems = ref(generateMenuItems())

// 面包屑导航
const breadcrumbs = computed(() => {
  const paths = route.path.split('/').filter(Boolean)
  const crumbs = [{ title: '首页', to: '/home' }]
  
  let currentPath = ''
  paths.forEach((path, index) => {
    if (path !== 'home') {
      currentPath += `/${path}`
      const menuItem = menuItems.value.find(item => item.to.includes(path))
      crumbs.push({
        title: menuItem ? menuItem.title : path,
        to: index === paths.length - 1 ? undefined : currentPath,
        disabled: index === paths.length - 1
      })
    }
  })
  
  return crumbs
})

// 更新时间
let timeInterval
const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 方法
const goToProfile = () => {
  router.push('/home/profile')
}

const goToSettings = () => {
  router.push('/home/settings')
}

const logout = () => {
  routerLogout(router)
}

// 生命周期
onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style scoped>
/* 导航抽屉样式 */
.custom-drawer {
  border-right: 1px solid rgba(99, 102, 241, 0.1);
  background: linear-gradient(180deg, #fafafa 0%, #f8fafc 100%);
  position: relative;
  backdrop-filter: blur(10px);
}

.custom-drawer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%);
  z-index: 1;
  box-shadow: 0 2px 10px rgba(99, 102, 241, 0.2);
}

/* 顶部应用栏样式 */
.v-app-bar {
  backdrop-filter: blur(20px);
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important;
  box-shadow: 0 4px 25px rgba(99, 102, 241, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.v-app-bar:hover {
  box-shadow: 0 6px 30px rgba(99, 102, 241, 0.4);
}

/* 用户卡片样式 */
.user-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(99, 102, 241, 0.1);
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.08);
}

.user-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 35px rgba(99, 102, 241, 0.15) !important;
  border-color: rgba(99, 102, 241, 0.2);
}

.user-avatar {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important;
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.user-avatar:hover {
  transform: scale(1.08) rotate(5deg);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
}

/* 菜单列表样式 */
.menu-list {
  padding-top: 8px;
}

/* 菜单项样式 */
.menu-item {
  margin-bottom: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px !important;
  position: relative;
  overflow: hidden;
  border: 1px solid transparent;
}

.menu-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s;
}

.menu-item:hover::before {
  left: 100%;
}

.menu-item:hover {
  transform: translateX(6px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.2);
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.04) 100%);
  border-color: rgba(99, 102, 241, 0.1);
}

.menu-item.v-list-item--active {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.08) 100%);
  border-left: 4px solid #6366f1;
  transform: translateX(6px);
  box-shadow: 0 6px 25px rgba(99, 102, 241, 0.25);
  border-color: rgba(99, 102, 241, 0.2);
}

.menu-item.v-list-item--active .v-list-item__prepend .v-icon {
  color: #6366f1 !important;
  transform: scale(1.15);
}

.menu-arrow {
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #6366f1;
}

.menu-item:hover .menu-arrow {
  opacity: 1;
  transform: translateX(6px);
}

.menu-item.v-list-item--active .menu-arrow {
  opacity: 1;
  transform: translateX(6px) rotate(90deg);
}

/* 菜单项动画延迟 */
.menu-item-0 { animation-delay: 0.1s; }
.menu-item-1 { animation-delay: 0.2s; }
.menu-item-2 { animation-delay: 0.3s; }
.menu-item-3 { animation-delay: 0.4s; }
.menu-item-4 { animation-delay: 0.5s; }

/* 面包屑样式优化 */
.v-breadcrumbs {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 12px 20px !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(99, 102, 241, 0.1);
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.1);
  transition: all 0.3s ease;
}

.v-breadcrumbs:hover {
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.15);
  border-color: rgba(99, 102, 241, 0.2);
}

/* 底部状态栏样式 */
.v-footer {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%) !important;
  border-top: 1px solid rgba(99, 102, 241, 0.1);
  backdrop-filter: blur(10px);
}

/* 页面过渡动画 */
.v-fade-transition-enter-active,
.v-fade-transition-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-fade-transition-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.v-fade-transition-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* 响应式设计 */
@media (max-width: 1280px) {
  .custom-drawer {
    width: 280px !important;
  }
}

@media (max-width: 960px) {
  .custom-drawer {
    width: 260px !important;
  }
  
  .user-card {
    margin: 8px !important;
  }
  
  .menu-list {
    padding: 0 8px;
  }
  
  .v-breadcrumbs {
    padding: 8px 12px !important;
    font-size: 0.875rem;
  }
}

@media (max-width: 600px) {
  .custom-drawer {
    width: 240px !important;
  }
  
  .user-card {
    margin: 6px !important;
  }
  
  .user-avatar {
    width: 56px !important;
    height: 56px !important;
  }
  
  .menu-item {
    margin-bottom: 4px;
    border-radius: 8px !important;
  }
  
  .v-app-bar-title .text-h6 {
    font-size: 1.1rem !important;
  }
}

@media (max-width: 480px) {
  .custom-drawer {
    width: 220px !important;
  }
  
  .v-breadcrumbs {
    padding: 6px 10px !important;
    font-size: 0.8rem;
  }
}

/* 滚动条样式 */
.custom-drawer ::-webkit-scrollbar {
  width: 6px;
}

.custom-drawer ::-webkit-scrollbar-track {
  background: transparent;
}

.custom-drawer ::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%);
  border-radius: 3px;
  transition: all 0.3s ease;
}

.custom-drawer ::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.5) 0%, rgba(139, 92, 246, 0.5) 100%);
  transform: scaleY(1.1);
}

/* 加载动画 */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* 应用动画 */
.custom-drawer {
  animation: slideInLeft 0.5s ease-out;
}

.user-card {
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.menu-item {
  animation: fadeInUp 0.4s ease-out both;
}

.v-breadcrumbs {
  animation: fadeInUp 0.5s ease-out 0.1s both;
}

/* 状态指示器动画 */
.v-chip {
  animation: pulse 2s infinite;
}

/* 图标旋转动画 */
.v-app-bar-nav-icon {
  transition: transform 0.3s ease;
}

.v-app-bar-nav-icon:hover {
  transform: rotate(180deg);
}

/* 菜单项图标动画 */
.menu-item .v-list-item__prepend .v-icon {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-item:hover .v-list-item__prepend .v-icon {
  transform: scale(1.1) rotate(5deg);
}

/* 用户头像呼吸效果 */
.user-avatar {
  animation: pulse 3s infinite;
}

/* 渐变文字效果 */
.v-app-bar-title {
  background: linear-gradient(45deg, #ffffff 0%, #e2e8f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 10px rgba(255, 255, 255, 0.3);
}

/* 悬浮效果优化 */
.v-card:hover {
  transform: translateY(-4px) scale(1.02);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 焦点状态优化 */
.menu-item:focus-visible {
  outline: 2px solid #6366f1;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
}

/* 深色模式支持 */
@media (prefers-color-scheme: dark) {
  .custom-drawer {
    background: linear-gradient(180deg, #1e293b 0%, #334155 100%);
    border-right-color: rgba(129, 140, 248, 0.2);
  }
  
  .custom-drawer::before {
    background: linear-gradient(90deg, #818cf8 0%, #a78bfa 50%, #c4b5fd 100%);
  }
  
  .user-card {
    background: linear-gradient(135deg, #334155 0%, #475569 100%);
    border-color: rgba(129, 140, 248, 0.2);
  }
  
  .v-breadcrumbs {
    background: rgba(30, 41, 59, 0.95);
    border-color: rgba(129, 140, 248, 0.2);
  }
  
  .menu-item:hover {
    background: linear-gradient(135deg, rgba(129, 140, 248, 0.15) 0%, rgba(167, 139, 250, 0.08) 100%);
  }
  
  .menu-item.v-list-item--active {
    background: linear-gradient(135deg, rgba(129, 140, 248, 0.25) 0%, rgba(167, 139, 250, 0.15) 100%);
    border-left-color: #818cf8;
  }
}
</style>