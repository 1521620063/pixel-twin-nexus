<!--
/**
 * @fileoverview 全局确认对话框组件
 * @description 基于ConfirmDialog的全局确认对话框，通过useConfirm组合式函数进行状态管理
 * @author chensiyang
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 * @copyright Copyright (c) 2024 Pixel Twin Nexus. All rights reserved.
 * 
 * 功能特性：
 * - 全局状态管理，可在任意组件中调用
 * - 基于ConfirmDialog组件，继承所有功能特性
 * - 通过useConfirm组合式函数控制显示和交互
 * - 支持多种预设类型（删除、状态切换、保存等）
 * 
 * 依赖组件：
 * - ConfirmDialog: 基础确认对话框组件
 * 
 * 依赖组合式函数：
 * - useConfirm: 全局确认对话框状态管理
 */
-->

<template>
  <ConfirmDialog
    v-model="globalConfirmState.show"
    :title="globalConfirmState.title"
    :content="globalConfirmState.content"
    :subtitle="globalConfirmState.subtitle"
    :warning="globalConfirmState.warning"
    :icon="globalConfirmState.icon"
    :icon-color="globalConfirmState.iconColor"
    :confirm-text="globalConfirmState.confirmText"
    :cancel-text="globalConfirmState.cancelText"
    :confirm-color="globalConfirmState.confirmColor"
    :confirm-icon="globalConfirmState.confirmIcon"
    :loading="globalConfirmState.loading"
    @confirm="handleConfirm"
    @cancel="handleCancel"
    @update:model-value="updateShow"
  />
</template>

<script setup>
import ConfirmDialog from './ConfirmDialog.vue'
import { globalConfirmState, useConfirm } from '@/composables/useConfirm'

const { handleConfirm, handleCancel, updateShow } = useConfirm()
</script>