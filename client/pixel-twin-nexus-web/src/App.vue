<!--
/**
 * Pixel Twin Nexus 应用根组件
 * 
 * @file App.vue
 * @description 应用程序的根组件，负责渲染路由视图和全局组件
 * @author chensiyang
 * @version 1.0.0
 * @created 2024-01-01
 * @lastModified 2024-01-01
 * @copyright © 2024 Pixel Twin Nexus. All rights reserved.
 */
-->

<template>
  <!-- 路由视图容器 - 渲染当前路由对应的组件 -->
  <RouterView />
  
  <!-- 全局确认对话框组件 - 提供统一的确认交互体验 -->
  <GlobalConfirmDialog />
  
  <!-- 全局消息提示组件 - 提供统一的消息反馈机制 -->
  <GlobalSnackbar />
</template>

<script setup>
/**
 * 组件导入区域
 * 导入全局共享的UI组件
 */
import GlobalConfirmDialog from '@/components/GlobalConfirmDialog.vue'
import GlobalSnackbar from '@/components/GlobalSnackbar.vue'
</script>

<style scoped lang="scss">
/**
 * 根组件样式
 * 当前为空，所有样式通过全局样式和组件样式管理
 */
</style>
