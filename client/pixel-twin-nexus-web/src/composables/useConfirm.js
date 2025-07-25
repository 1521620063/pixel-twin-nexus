/**
 * 确认对话框组合式函数
 * 
 * @file composables/useConfirm.js
 * @description 提供程序化调用确认对话框的功能，支持删除确认、状态切换确认、保存确认等多种场景
 * @author chensiyang
 * @version 1.0.0
 * @created 2024-01-01
 * @lastModified 2024-01-01
 * @copyright © 2024 Pixel Twin Nexus. All rights reserved.
 * 
 * @module useConfirm
 * @requires vue - Vue 3 响应式 API
 * 
 * @exports useConfirm - 确认对话框组合式函数
 * @exports globalConfirmState - 全局确认对话框状态
 */
import { ref, reactive } from 'vue'

// ==================== 全局状态管理 ====================

/**
 * 全局确认对话框状态
 * 管理确认对话框的显示状态和配置信息
 * 
 * @type {Object}
 * @property {boolean} show - 是否显示对话框
 * @property {string} title - 对话框标题
 * @property {string} content - 对话框内容
 * @property {string} subtitle - 对话框副标题
 * @property {string} warning - 警告信息
 * @property {string} icon - 对话框图标
 * @property {string} iconColor - 图标颜色
 * @property {string} confirmText - 确认按钮文本
 * @property {string} cancelText - 取消按钮文本
 * @property {string} confirmColor - 确认按钮颜色
 * @property {string} confirmIcon - 确认按钮图标
 * @property {boolean} loading - 确认按钮加载状态
 * @property {Function|null} resolve - Promise 解析函数
 */
const globalConfirmState = reactive({
  show: false,
  title: '',
  content: '',
  subtitle: '',
  warning: '',
  icon: 'mdi-help-circle',
  iconColor: 'warning',
  confirmText: '确认',
  cancelText: '取消',
  confirmColor: 'error',
  confirmIcon: 'mdi-check',
  loading: false,
  resolve: null
})

// ==================== 组合式函数 ====================

/**
 * 确认对话框组合式函数
 * 提供程序化调用确认对话框的功能，支持多种预设场景
 * 
 * @function useConfirm
 * @returns {Object} 返回确认对话框相关的方法和状态
 */
export function useConfirm() {
  /**
   * 显示确认对话框
   * 通用的确认对话框显示方法，支持完全自定义配置
   * 
   * @function confirm
   * @param {Object} options - 对话框配置选项
   * @param {string} [options.title='确认操作'] - 对话框标题
   * @param {string} [options.content='您确定要执行此操作吗？'] - 对话框内容
   * @param {string} [options.subtitle=''] - 对话框副标题
   * @param {string} [options.warning=''] - 警告信息
   * @param {string} [options.icon='mdi-help-circle'] - 对话框图标
   * @param {string} [options.iconColor='warning'] - 图标颜色
   * @param {string} [options.confirmText='确认'] - 确认按钮文本
   * @param {string} [options.cancelText='取消'] - 取消按钮文本
   * @param {string} [options.confirmColor='error'] - 确认按钮颜色
   * @param {string} [options.confirmIcon='mdi-check'] - 确认按钮图标
   * @returns {Promise<boolean>} 返回用户选择结果，true表示确认，false表示取消
   * 
   * @example
   * // 基本用法
   * const result = await confirm({ title: '删除文件', content: '确定要删除这个文件吗？' })
   * if (result) {
   *   // 用户点击了确认
   * }
   */
  const confirm = (options = {}) => {
    return new Promise((resolve) => {
      const {
        title = '确认操作',
        content = '您确定要执行此操作吗？',
        subtitle = '',
        warning = '',
        icon = 'mdi-help-circle',
        iconColor = 'warning',
        confirmText = '确认',
        cancelText = '取消',
        confirmColor = 'error',
        confirmIcon = 'mdi-check'
      } = options

      // 更新全局状态
      Object.assign(globalConfirmState, {
        show: true,
        title,
        content,
        subtitle,
        warning,
        icon,
        iconColor,
        confirmText,
        cancelText,
        confirmColor,
        confirmIcon,
        loading: false,
        resolve
      })
    })
  }

  /**
   * 处理确认操作
   * 当用户点击确认按钮时调用，设置加载状态并解析Promise
   * 
   * @async
   * @function handleConfirm
   */
  const handleConfirm = async () => {
    globalConfirmState.loading = true
    // 模拟异步操作延迟，提供更好的用户体验
    await new Promise(resolve => setTimeout(resolve, 200))
    globalConfirmState.show = false
    globalConfirmState.loading = false
    if (globalConfirmState.resolve) {
      globalConfirmState.resolve(true)
      globalConfirmState.resolve = null
    }
  }

  /**
   * 处理取消操作
   * 当用户点击取消按钮时调用，关闭对话框并解析Promise为false
   * 
   * @function handleCancel
   */
  const handleCancel = () => {
    globalConfirmState.show = false
    globalConfirmState.loading = false
    if (globalConfirmState.resolve) {
      globalConfirmState.resolve(false)
      globalConfirmState.resolve = null
    }
  }

  /**
   * 更新对话框显示状态
   * 用于外部控制对话框的显示和隐藏
   * 
   * @function updateShow
   * @param {boolean} value - 是否显示对话框
   */
  const updateShow = (value) => {
    globalConfirmState.show = value
    if (!value && globalConfirmState.resolve) {
      globalConfirmState.resolve(false)
      globalConfirmState.resolve = null
    }
  }

  /**
   * 删除确认对话框
   * 专门用于删除操作的确认对话框，具有危险操作的视觉提示
   * 
   * @function confirmDelete
   * @param {string} itemName - 要删除的项目名称
   * @param {string} [itemType='项目'] - 项目类型（如：项目、实例、文件等）
   * @returns {Promise<boolean>} 返回用户选择结果
   * 
   * @example
   * // 删除实例确认
   * const confirmed = await confirmDelete('instance-123', '实例')
   * if (confirmed) {
   *   // 执行删除操作
   * }
   */
  const confirmDelete = (itemName, itemType = '项目') => {
    return confirm({
      title: `删除${itemType}`,
      content: `您确定要删除${itemType} "${itemName}" 吗？`,
      subtitle: '此操作不可撤销',
      warning: '删除后将无法恢复，请谨慎操作！',
      icon: 'mdi-delete-alert',
      iconColor: 'error',
      confirmText: '删除',
      cancelText: '取消',
      confirmColor: 'error',
      confirmIcon: 'mdi-delete'
    })
  }

  /**
   * 状态切换确认对话框
   * 用于启用/禁用操作的确认对话框，根据当前状态动态调整提示信息
   * 
   * @function confirmToggleStatus
   * @param {string} itemName - 项目名称
   * @param {boolean} currentStatus - 当前状态，true表示启用，false表示禁用
   * @param {string} [itemType='项目'] - 项目类型
   * @returns {Promise<boolean>} 返回用户选择结果
   * 
   * @example
   * // 切换项目状态
   * const confirmed = await confirmToggleStatus('project-1', true, '项目')
   * if (confirmed) {
   *   // 执行状态切换操作
   * }
   */
  const confirmToggleStatus = (itemName, currentStatus, itemType = '项目') => {
    const action = currentStatus ? '禁用' : '启用'
    const actionColor = currentStatus ? 'warning' : 'success'
    const actionIcon = currentStatus ? 'mdi-pause-circle' : 'mdi-play-circle'
    
    return confirm({
      title: `${action}${itemType}`,
      content: `您确定要${action}${itemType} "${itemName}" 吗？`,
      subtitle: `${action}后${itemType}状态将发生改变`,
      icon: actionIcon,
      iconColor: actionColor,
      confirmText: action,
      cancelText: '取消',
      confirmColor: actionColor,
      confirmIcon: actionIcon
    })
  }

  /**
   * 保存确认对话框
   * 用于保存或更新操作的确认对话框
   * 
   * @function confirmSave
   * @param {string} [action='保存'] - 操作类型（保存、更新、提交等）
   * @returns {Promise<boolean>} 返回用户选择结果
   * 
   * @example
   * // 保存表单确认
   * const confirmed = await confirmSave('保存')
   * if (confirmed) {
   *   // 执行保存操作
   * }
   */
  const confirmSave = (action = '保存') => {
    return confirm({
      title: `${action}更改`,
      content: `您确定要${action}当前更改吗？`,
      subtitle: '请确认所有信息都已正确填写',
      icon: 'mdi-content-save-alert',
      iconColor: 'primary',
      confirmText: action,
      cancelText: '取消',
      confirmColor: 'primary',
      confirmIcon: 'mdi-check'
    })
  }

  // 返回所有可用的方法和状态
  return {
    /** 通用确认对话框方法 */
    confirm,
    /** 删除确认对话框方法 */
    confirmDelete,
    /** 状态切换确认对话框方法 */
    confirmToggleStatus,
    /** 保存确认对话框方法 */
    confirmSave,
    /** 全局确认对话框状态 */
    globalConfirmState,
    /** 确认操作处理方法 */
    handleConfirm,
    /** 取消操作处理方法 */
    handleCancel,
    /** 更新显示状态方法 */
    updateShow
  }
}

// ==================== 导出 ====================

/**
 * 导出全局确认对话框状态
 * 供全局确认对话框组件使用
 */
export { globalConfirmState }

/**
 * 默认导出确认对话框组合式函数
 */
export default useConfirm