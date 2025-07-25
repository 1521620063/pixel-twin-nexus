/**
 * 项目相关 API 接口模块
 */
import apiClient from '@/utils/request.js'

/**
 * 项目 API 接口对象
 * 包含所有与项目相关的 API 调用方法
 */
export default {
    /**
     * 获取项目列表接口
     * 从后端获取项目列表信息
     * @param {Object} axiosOpts - Axios 请求配置选项
     * @param {Object} requestOpts - 请求处理选项
     * @returns {Promise} 返回包含项目列表信息的 Promise
     */
    getProjectList: (axiosOpts, requestOpts) => apiClient({ url: '/pixel-twin/project/list', method: 'POST', ...axiosOpts }),
    /**
     * 添加项目接口
     * @param {Object} axiosOpts - Axios 请求配置选项
     * @param {Object} requestOpts - 请求处理选项
     * @returns {Promise} 返回操作结果的 Promise
     */
    addProject: (axiosOpts, requestOpts) => apiClient({ url: '/pixel-twin/project/add', method: 'POST', ...axiosOpts }),
    /**
     * 编辑项目接口
     * @param {Object} axiosOpts - Axios 请求配置选项
     * @param {Object} requestOpts - 请求处理选项
     * @returns {Promise} 返回操作结果的 Promise
     */
    editProject: (axiosOpts, requestOpts) => apiClient({ url: '/pixel-twin/project/edit', method: 'POST', ...axiosOpts }),
    /**
     * 删除项目接口
     * 根据项目ID从后端删除项目
     * @param {Object} axiosOpts - Axios 请求配置选项
     * @param {Object} requestOpts - 请求处理选项
     * @returns {Promise} 返回删除操作结果的 Promise
     */
    deleteProject: (axiosOpts, requestOpts) => apiClient({ url: '/pixel-twin/project/delete', method: 'POST', ...axiosOpts }),
}