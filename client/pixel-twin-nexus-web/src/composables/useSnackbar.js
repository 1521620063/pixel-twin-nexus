/**
 * @fileoverview 全局消息提示组合式函数
 * @description 提供统一的消息提示功能，支持成功、错误、警告、信息等多种类型的消息显示
 * @author chensiyang
 * @version 1.0.0
 * @created 2024-01-15
 * @modified 2024-01-15
 * @copyright Copyright (c) 2024 Pixel Twin Nexus. All rights reserved.
 * 
 * 功能特性：
 * - 支持多种消息类型（成功、错误、警告、信息）
 * - 可自定义图标、颜色、位置、超时时间等
 * - 支持操作按钮和自定义回调
 * - 支持加载状态显示
 * - 全局状态管理，组件间共享
 * 
 * 依赖库：
 * - Vue 3 Composition API
 * - Vuetify 3 (用于UI组件)
 * 
 * 导出函数：
 * - useSnackbar: 主要组合式函数
 * - globalSnackbarState: 全局状态对象
 */

import { reactive } from 'vue'

// 全局 Snackbar 状态
const globalSnackbarState = reactive({
  show: false,
  message: '',
  title: '',
  color: 'success',
  icon: '',
  iconSize: 'default',
  timeout: 3000,
  location: 'top right',
  elevation: 6,
  rounded: 'lg',
  variant: 'elevated',
  showCloseButton: true,
  closeButtonText: '关闭',
  closeButtonColor: 'white',
  actionButton: null, // { text: '', color: '', variant: '', action: () => {} }
  onClose: null,
  onAction: null
})

/**
 * Snackbar 可组合函数
 * 提供程序化调用消息提示的功能
 */
export function useSnackbar() {
  /**
   * 显示消息提示
   * @param {string|Object} messageOrOptions - 消息文本或配置对象
   * @param {Object} options - 额外配置选项
   */
  const showSnackbar = (messageOrOptions, options = {}) => {
    // 如果第一个参数是字符串，则作为消息处理
    if (typeof messageOrOptions === 'string') {
      const message = messageOrOptions
      const config = {
        message,
        ...options
      }
      updateSnackbarState(config)
    } else {
      // 如果第一个参数是对象，则作为完整配置处理
      updateSnackbarState(messageOrOptions)
    }
  }

  /**
   * 更新 Snackbar 状态
   * @param {Object} config - 配置对象
   */
  const updateSnackbarState = (config) => {
    // 重置状态
    Object.assign(globalSnackbarState, {
      show: false,
      message: '',
      title: '',
      color: 'success',
      icon: '',
      iconSize: 'default',
      timeout: 3000,
      location: 'top right',
      elevation: 6,
      rounded: 'lg',
      variant: 'elevated',
      showCloseButton: true,
      closeButtonText: '关闭',
      closeButtonColor: 'white',
      actionButton: null,
      onClose: null,
      onAction: null
    })

    // 应用新配置
    Object.assign(globalSnackbarState, config, { show: true })

    // 根据消息类型自动设置图标
    if (!config.icon && config.color) {
      globalSnackbarState.icon = getDefaultIcon(config.color)
    }
  }

  /**
   * 根据颜色类型获取默认图标
   * @param {string} color - 颜色类型
   * @returns {string} 图标名称
   */
  const getDefaultIcon = (color) => {
    const iconMap = {
      success: 'mdi-check-circle',
      error: 'mdi-alert-circle',
      warning: 'mdi-alert',
      info: 'mdi-information',
      primary: 'mdi-information-outline'
    }
    return iconMap[color] || 'mdi-information'
  }

  /**
   * 显示成功消息
   * @param {string} message - 消息内容
   * @param {Object} options - 额外选项
   */
  const showSuccess = (message, options = {}) => {
    showSnackbar(message, {
      color: 'success',
      icon: 'mdi-check-circle',
      ...options
    })
  }

  /**
   * 显示错误消息
   * @param {string} message - 消息内容
   * @param {Object} options - 额外选项
   */
  const showError = (message, options = {}) => {
    showSnackbar(message, {
      color: 'error',
      icon: 'mdi-alert-circle',
      timeout: 5000, // 错误消息显示时间更长
      ...options
    })
  }

  /**
   * 显示警告消息
   * @param {string} message - 消息内容
   * @param {Object} options - 额外选项
   */
  const showWarning = (message, options = {}) => {
    showSnackbar(message, {
      color: 'warning',
      icon: 'mdi-alert',
      timeout: 4000,
      ...options
    })
  }

  /**
   * 显示信息消息
   * @param {string} message - 消息内容
   * @param {Object} options - 额外选项
   */
  const showInfo = (message, options = {}) => {
    showSnackbar(message, {
      color: 'info',
      icon: 'mdi-information',
      ...options
    })
  }

  /**
   * 显示带操作按钮的消息
   * @param {string} message - 消息内容
   * @param {Object} actionConfig - 操作按钮配置
   * @param {Object} options - 额外选项
   */
  const showWithAction = (message, actionConfig, options = {}) => {
    showSnackbar(message, {
      timeout: 0, // 不自动关闭
      actionButton: {
        text: '操作',
        color: 'white',
        variant: 'text',
        ...actionConfig
      },
      ...options
    })
  }

  /**
   * 显示加载消息
   * @param {string} message - 消息内容
   * @param {Object} options - 额外选项
   */
  const showLoading = (message = '加载中...', options = {}) => {
    showSnackbar(message, {
      color: 'primary',
      icon: 'mdi-loading mdi-spin',
      timeout: 0, // 不自动关闭
      showCloseButton: false,
      ...options
    })
  }

  /**
   * 隐藏消息提示
   */
  const hideSnackbar = () => {
    globalSnackbarState.show = false
  }

  /**
   * 处理关闭按钮点击
   */
  const handleClose = () => {
    if (globalSnackbarState.onClose) {
      globalSnackbarState.onClose()
    }
    hideSnackbar()
  }

  /**
   * 处理操作按钮点击
   */
  const handleAction = () => {
    if (globalSnackbarState.onAction) {
      globalSnackbarState.onAction()
    } else if (globalSnackbarState.actionButton?.action) {
      globalSnackbarState.actionButton.action()
    }
    hideSnackbar()
  }

  return {
    // 状态
    globalSnackbarState,
    
    // 基础方法
    showSnackbar,
    hideSnackbar,
    
    // 便捷方法
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showWithAction,
    showLoading,
    
    // 事件处理
    handleClose,
    handleAction
  }
}

// 导出全局状态供组件使用
export { globalSnackbarState }

// 默认导出
export default useSnackbar