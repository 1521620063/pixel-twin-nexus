<!--
/**
 * @fileoverview 全局消息提示组件
 * @description 基于Vuetify Snackbar的全局消息提示组件，通过useSnackbar组合式函数进行状态管理
 * @author chensiyang
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 * @copyright Copyright (c) 2024 Pixel Twin Nexus. All rights reserved.
 * 
 * 功能特性：
 * - 全局状态管理，可在任意组件中调用
 * - 支持多种消息类型（成功、错误、警告、信息）
 * - 支持自定义图标、颜色、位置、超时时间
 * - 支持操作按钮和关闭按钮
 * - 响应式设计，适配移动端
 * - 优雅的渐变背景和动画效果
 * - 支持标题和消息内容
 * 
 * 依赖组件：
 * - v-snackbar: Vuetify消息提示组件
 * 
 * 依赖组合式函数：
 * - useSnackbar: 全局消息提示状态管理
 * 
 * 样式特性：
 * - 毛玻璃效果背景
 * - 不同类型的渐变色彩
 * - 响应式字体大小
 * - 平滑的动画过渡
 */
-->

<template>
  <v-snackbar
    v-model="globalSnackbarState.show"
    :color="globalSnackbarState.color"
    :timeout="globalSnackbarState.timeout"
    :location="globalSnackbarState.location"
    :elevation="globalSnackbarState.elevation"
    :rounded="globalSnackbarState.rounded"
    :variant="globalSnackbarState.variant"
    class="global-snackbar"
  >
    <div class="d-flex align-center">
      <v-icon 
        v-if="globalSnackbarState.icon" 
        class="mr-3" 
        :size="globalSnackbarState.iconSize"
      >
        {{ globalSnackbarState.icon }}
      </v-icon>
      
      <div class="snackbar-content">
        <div 
          v-if="globalSnackbarState.title" 
          class="snackbar-title font-weight-medium mb-1"
        >
          {{ globalSnackbarState.title }}
        </div>
        <div class="snackbar-message">
          {{ globalSnackbarState.message }}
        </div>
      </div>
    </div>
    
    <template v-slot:actions>
      <v-btn
        v-if="globalSnackbarState.showCloseButton"
        :color="globalSnackbarState.closeButtonColor"
        variant="text"
        size="small"
        @click="handleClose"
      >
        {{ globalSnackbarState.closeButtonText }}
      </v-btn>
      
      <v-btn
        v-if="globalSnackbarState.actionButton"
        :color="globalSnackbarState.actionButton.color"
        :variant="globalSnackbarState.actionButton.variant"
        size="small"
        @click="handleAction"
      >
        {{ globalSnackbarState.actionButton.text }}
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { globalSnackbarState, useSnackbar } from '@/composables/useSnackbar'

const { handleClose, handleAction } = useSnackbar()
</script>

<style lang="scss" scoped>
.global-snackbar {
  :deep(.v-snackbar__wrapper) {
    backdrop-filter: blur(10px);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  :deep(.v-snackbar__content) {
    padding: 16px 20px;
  }
}

.snackbar-content {
  flex: 1;
  min-width: 0;
}

.snackbar-title {
  font-size: 0.875rem;
  line-height: 1.25;
  color: rgba(255, 255, 255, 0.95);
}

.snackbar-message {
  font-size: 0.875rem;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.87);
  word-break: break-word;
}

// 不同类型的样式增强
:deep(.v-snackbar--variant-elevated) {
  &.bg-success {
    background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%) !important;
  }
  
  &.bg-error {
    background: linear-gradient(135deg, #f44336 0%, #ef5350 100%) !important;
  }
  
  &.bg-warning {
    background: linear-gradient(135deg, #ff9800 0%, #ffb74d 100%) !important;
  }
  
  &.bg-info {
    background: linear-gradient(135deg, #2196f3 0%, #42a5f5 100%) !important;
  }
  
  &.bg-primary {
    background: linear-gradient(135deg, #1976d2 0%, #1e88e5 100%) !important;
  }
}

// 响应式设计
@media (max-width: 600px) {
  .global-snackbar {
    :deep(.v-snackbar__wrapper) {
      margin: 8px;
      max-width: calc(100vw - 16px);
    }
  }
  
  .snackbar-title,
  .snackbar-message {
    font-size: 0.8125rem;
  }
}

// 动画增强
.global-snackbar {
  :deep(.v-snackbar__wrapper) {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}
</style>