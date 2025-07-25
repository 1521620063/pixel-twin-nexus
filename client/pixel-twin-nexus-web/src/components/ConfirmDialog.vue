<!--
/**
 * @fileoverview 确认对话框组件
 * @description 可复用的确认对话框组件，支持自定义标题、内容、图标、按钮等
 * @author chensiyang
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 * @copyright Copyright (c) 2024 Pixel Twin Nexus. All rights reserved.
 * 
 * 功能特性：
 * - 支持自定义标题、副标题、内容和警告信息
 * - 可配置图标、颜色、按钮文本等
 * - 支持加载状态显示
 * - 响应式设计，适配移动端
 * - 支持深色主题
 * - 优雅的动画效果
 * 
 * Props:
 * - modelValue: 对话框显示状态
 * - title: 对话框标题
 * - subtitle: 对话框副标题
 * - content: 对话框内容（支持HTML）
 * - warning: 警告信息
 * - icon: 图标名称
 * - iconColor: 图标颜色
 * - confirmText: 确认按钮文本
 * - cancelText: 取消按钮文本
 * - confirmColor: 确认按钮颜色
 * - confirmIcon: 确认按钮图标
 * - loading: 加载状态
 * 
 * Events:
 * - update:modelValue: 更新显示状态
 * - confirm: 确认操作
 * - cancel: 取消操作
 */
-->

<template>
  <v-dialog
    v-model="dialog"
    max-width="480"
    persistent
    transition="dialog-bottom-transition"
  >
    <v-card class="confirm-dialog" elevation="12" rounded="xl">
      <!-- 对话框头部 -->
      <v-card-title class="dialog-header pa-6 pb-4">
        <div class="d-flex align-center">
          <v-avatar
            :size="56"
            :color="iconColor"
            class="mr-4 dialog-icon"
            variant="tonal"
          >
            <v-icon :color="iconColor" size="28">{{ icon }}</v-icon>
          </v-avatar>
          <div class="flex-grow-1">
            <h2 class="text-h5 font-weight-bold mb-1">{{ title }}</h2>
            <p class="text-body-2 text-medium-emphasis mb-0" v-if="subtitle">
              {{ subtitle }}
            </p>
          </div>
        </div>
      </v-card-title>

      <!-- 对话框内容 -->
      <v-card-text class="dialog-content px-6 py-4">
        <div class="text-body-1" v-html="content"></div>
        
        <!-- 额外信息 -->
        <v-alert
          v-if="warning"
          type="warning"
          variant="tonal"
          class="mt-4"
          density="compact"
        >
          <div class="text-body-2">{{ warning }}</div>
        </v-alert>
      </v-card-text>

      <!-- 对话框操作按钮 -->
      <v-card-actions class="dialog-actions pa-6 pt-2">
        <v-spacer></v-spacer>
        <v-btn
          variant="outlined"
          color="grey"
          size="large"
          class="mr-3 cancel-btn"
          @click="handleCancel"
          :disabled="loading"
          rounded="pill"
        >
          <v-icon start>mdi-close</v-icon>
          {{ cancelText }}
        </v-btn>
        <v-btn
          :color="confirmColor"
          variant="elevated"
          size="large"
          class="confirm-btn"
          @click="handleConfirm"
          :loading="loading"
          rounded="pill"
        >
          <v-icon start>{{ confirmIcon }}</v-icon>
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'

// Props 定义
const props = defineProps({
  // 对话框显示状态
  modelValue: {
    type: Boolean,
    default: false
  },
  // 标题
  title: {
    type: String,
    default: '确认操作'
  },
  // 副标题
  subtitle: {
    type: String,
    default: ''
  },
  // 内容
  content: {
    type: String,
    required: true
  },
  // 警告信息
  warning: {
    type: String,
    default: ''
  },
  // 图标
  icon: {
    type: String,
    default: 'mdi-help-circle'
  },
  // 图标颜色
  iconColor: {
    type: String,
    default: 'warning'
  },
  // 确认按钮文本
  confirmText: {
    type: String,
    default: '确认'
  },
  // 取消按钮文本
  cancelText: {
    type: String,
    default: '取消'
  },
  // 确认按钮颜色
  confirmColor: {
    type: String,
    default: 'error'
  },
  // 确认按钮图标
  confirmIcon: {
    type: String,
    default: 'mdi-check'
  },
  // 加载状态
  loading: {
    type: Boolean,
    default: false
  }
})

// Emits 定义
const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

// 响应式数据
const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 方法
const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
  dialog.value = false
}
</script>

<style scoped lang="scss">
.confirm-dialog {
  background: linear-gradient(135deg, rgba(var(--v-theme-surface), 0.98), rgba(var(--v-theme-background), 0.95));
  backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--v-theme-surface-variant), 0.2);
  
  .dialog-header {
    background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05), rgba(var(--v-theme-primary), 0.02));
    border-bottom: 1px solid rgba(var(--v-theme-surface-variant), 0.1);
  }
  
  .dialog-icon {
    box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.2);
    transition: all 0.3s ease;
    
    &:hover {
      transform: scale(1.05);
    }
  }
  
  .dialog-content {
    line-height: 1.6;
  }
  
  .dialog-actions {
    background: linear-gradient(135deg, rgba(var(--v-theme-surface), 0.5), rgba(var(--v-theme-background), 0.3));
    border-top: 1px solid rgba(var(--v-theme-surface-variant), 0.1);
  }
  
  .cancel-btn {
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }
  
  .confirm-btn {
    box-shadow: 0 4px 15px rgba(var(--v-theme-error), 0.3);
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 8px 25px rgba(var(--v-theme-error), 0.4);
    }
  }
}

// 响应式设计
@media (max-width: 600px) {
  .confirm-dialog {
    margin: 16px;
    
    .dialog-header {
      padding: 20px 20px 16px;
      
      .dialog-icon {
        margin-right: 12px;
      }
    }
    
    .dialog-content {
      padding: 16px 20px;
    }
    
    .dialog-actions {
      padding: 16px 20px 20px;
      flex-direction: column;
      gap: 12px;
      
      .v-spacer {
        display: none;
      }
      
      .cancel-btn,
      .confirm-btn {
        width: 100%;
        margin: 0;
      }
    }
  }
}

// 深色主题适配
.v-theme--dark {
  .confirm-dialog {
    background: linear-gradient(135deg, rgba(var(--v-theme-surface), 0.95), rgba(var(--v-theme-background), 0.98));
  }
}
</style>