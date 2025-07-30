/**
 * 认证相关 API 接口模块
 * 
 * @file api/auth.api.js
 * @description 提供用户登录、获取用户信息等认证相关的 HTTP 请求方法，使用 useApiRequest 组合式函数统一处理请求逻辑
 * @author chensiyang
 * @version 1.0.0
 * @created 2024-01-01
 * @lastModified 2024-01-01
 * @copyright © 2024 Pixel Twin Nexus. All rights reserved.
 * 
 * @module AuthApi
 * @requires @/utils/request.js - HTTP 请求工具模块
 * 
 * @exports default - 认证相关 API 接口对象
 */
import apiClient from '@/utils/request.js'

/**
 * 认证 API 接口对象
 * 包含所有与用户认证相关的 API 调用方法
 */
export default {
    /**
     * 用户登录接口
     * 向后端发送用户凭据进行身份验证
     * @param {Object} axiosOpts - Axios 请求配置选项
     * @param {Object} axiosOpts.data - 登录数据，包含用户名和密码
     * @param {string} axiosOpts.data.username - 用户名
     * @param {string} axiosOpts.data.password - 密码
     * @param {Object} requestOpts - 请求处理选项
     * @returns {Promise} 返回包含认证令牌和用户信息的 Promise
     */
    login: (axiosOpts) => apiClient({ url: '/auth/login', method: 'POST', ...axiosOpts }),
    /**
     * 修改用户信息接口
     * @param {Object} axiosOpts - Axios 请求配置选项
     * @param {Object} axiosOpts.data - 修改用户数据，包含用户名、旧密码、新用户名和新密码
     * @param {string} axiosOpts.data.username - 新用户名
     * @param {string} axiosOpts.data.oldPassword - 旧密码
     * @param {string} axiosOpts.data.newPassword - 新密码
     * @param {Object} requestOpts - 请求处理选项
     * @returns {Promise} 返回包含修改结果的 Promise
     */
    modifyUser: (axiosOpts) => apiClient({ url: '/auth/modifyUser', method: 'POST', ...axiosOpts }),
}