/**
 * 实例相关 API 接口模块
 * 
 * @file api/instance.api.js
 * @description 提供实例管理相关的 HTTP 请求方法，包括获取实例类型、实例列表、销毁实例等功能
 * @author chensiyang
 * @version 1.0.0
 * @created 2024-01-01
 * @lastModified 2024-01-01
 * @copyright © 2024 Pixel Twin Nexus. All rights reserved.
 * 
 * @module InstanceApi
 * @requires @/utils/request.js - HTTP 请求工具模块
 * 
 * @exports default - 实例相关 API 接口对象
 */
import apiClient from '@/utils/request.js'

/**
 * 实例 API 接口对象
 * 包含所有与实例管理相关的 API 调用方法
 * 
 * @namespace InstanceApi
 */
export default {
    /**
     * 获取实例类型接口
     * 从后端获取所有可用的实例类型信息，用于实例管理页面的类型筛选
     * 
     * @function getInstanceTypes
     * @param {Object} axiosOpts - Axios 请求配置选项
     * @param {Object} requestOpts - 请求处理选项
     * @returns {Promise<Object>} 返回包含实例类型列表的 Promise
     * @example
     * // 获取实例类型列表
     * const types = await instanceApi.getInstanceTypes()
     */
    getInstanceTypes: (axiosOpts, requestOpts) => apiClient({ url: '/pixel-twin/instance/types', method: 'POST', ...axiosOpts }),
    /**
     * 获取实例列表接口
     * 根据指定条件从后端获取实例列表信息，支持按项目类型筛选
     * 
     * @function getInstanceList
     * @param {Object} axiosOpts - Axios 请求配置选项
     * @param {Object} axiosOpts.data - 请求数据
     * @param {string} [axiosOpts.data.pixelTwinId] - 项目ID，为空时获取所有实例
     * @param {Object} requestOpts - 请求处理选项
     * @returns {Promise<Object>} 返回包含实例列表的 Promise
     * @example
     * // 获取所有实例
     * const allInstances = await instanceApi.getInstanceList({ data: { pixelTwinId: '' } })
     * // 获取指定项目的实例
     * const projectInstances = await instanceApi.getInstanceList({ data: { pixelTwinId: 'project-123' } })
     */
    getInstanceList: (axiosOpts, requestOpts) => apiClient({ url: '/pixel-twin/instance/list', method: 'POST', ...axiosOpts }),
    /**
     * 销毁实例接口
     * 向后端发送销毁指定实例的请求，用于清理不再需要的实例资源
     * 
     * @function destroyInstance
     * @param {Object} axiosOpts - Axios 请求配置选项
     * @param {Object} axiosOpts.data - 请求数据
     * @param {string} axiosOpts.data.instanceId - 要销毁的实例ID
     * @param {Object} requestOpts - 请求处理选项
     * @returns {Promise<Object>} 返回销毁操作结果的 Promise
     * @example
     * // 销毁指定实例
     * const result = await instanceApi.destroyInstance({ data: { instanceId: 'instance-123' } })
     */
    destroyInstance: (axiosOpts, requestOpts) => apiClient({ url: '/pixel-twin/instance/destroy', method: 'POST', ...axiosOpts }),
}