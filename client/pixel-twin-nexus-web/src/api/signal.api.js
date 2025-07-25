/**
 * 信令相关 API 接口模块
 */
import apiClient from '@/utils/request.js'

/**
 * 信令 API 接口对象
 * 包含所有与信令相关的 API 调用方法
 */
export default {
    /**
     * 获取信令接口
     * 从后端获取信令信息
     * @param {Object} axiosOpts - Axios 请求配置选项
     * @param {Object} requestOpts - 请求处理选项
     * @returns {Promise} 返回包含信令信息的 Promise
     */
    signalToggle: (axiosOpts, requestOpts) => apiClient({ url: '/pixel-twin/signal/toggle', method: 'POST', ...axiosOpts }),
    /**
     * 保存信令接口
     * 将信令信息发送到后端保存
     * @param {Object} axiosOpts - Axios 请求配置选项
     * @param {Object} requestOpts - 请求处理选项
     * @returns {Promise} 返回包含信令信息的 Promise
     */
    getSignalStatus: (axiosOpts, requestOpts) => apiClient({ url: '/pixel-twin/signal/status', method: 'POST', ...axiosOpts }),
}