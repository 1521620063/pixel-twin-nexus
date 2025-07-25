/**
 * 配置相关 API 接口模块
 */
import apiClient from '@/utils/request.js'

/**
 * 配置 API 接口对象
 * 包含所有与配置相关的 API 调用方法
 */
export default {
    /**
     * 获取配置接口
     * 从后端获取配置信息
     * @param {Object} axiosOpts - Axios 请求配置选项
     * @param {Object} requestOpts - 请求处理选项
     * @returns {Promise} 返回包含配置信息的 Promise
     */
    getConfig: (axiosOpts, requestOpts) => apiClient({ url: '/pixel-twin/config/read', method: 'POST', ...axiosOpts }),
    /**
     * 保存配置接口
     * 将配置信息发送到后端保存
     * @param {Object} axiosOpts - Axios 请求配置选项
     * @param {Object} requestOpts - 请求处理选项
     * @returns {Promise} 返回包含配置信息的 Promise
     */
    saveConfig: (axiosOpts, requestOpts) => apiClient({ url: '/pixel-twin/config/write', method: 'POST', ...axiosOpts }),
    /**
     * 获取GPU配置接口
     * 从后端获取配置信息
     * @param {Object} axiosOpts - Axios 请求配置选项
     * @param {Object} requestOpts - 请求处理选项
     * @returns {Promise} 返回包含配置信息的 Promise
     */
    getGpuConfig: (axiosOpts, requestOpts) => apiClient({ url: '/pixel-twin/config/gpu-read', method: 'POST', ...axiosOpts }),
    /**
     * 保存GPU配置接口
     * 将配置信息发送到后端保存
     * @param {Object} axiosOpts - Axios 请求配置选项
     * @param {Object} requestOpts - 请求处理选项
     * @returns {Promise} 返回包含配置信息的 Promise
     */
    saveGpuConfig: (axiosOpts, requestOpts) => apiClient({ url: '/pixel-twin/config/gpu-write', method: 'POST', ...axiosOpts }),
}