/**
 * API 接口模块入口文件
 * 
 * @file api/index.js
 * @description 统一导出所有 API 接口模块，提供集中的接口访问点，使用模块化设计，便于维护和扩展
 * @author chensiyang
 * @version 1.0.0
 * @created 2024-01-01
 * @lastModified 2024-01-01
 * @copyright © 2024 Pixel Twin Nexus. All rights reserved.
 * 
 * @module ApiIndex
 * @requires ./auth.api - 认证相关 API 接口
 * @requires ./config.api - 配置相关 API 接口
 * @requires ./signal.api - 信令相关 API 接口
 * @requires ./project.api - 项目相关 API 接口
 * @requires ./instance.api - 实例相关 API 接口
 * 
 * @exports default - 包含所有 API 接口模块的对象
 */
import authApi from './auth.api'
import configApi from './config.api'
import signalApi from './signal.api'
import projectApi from './project.api'
import instanceApi from './instance.api'

/**
 * API 接口集合对象
 * 包含应用中所有的 API 接口模块，提供统一的接口访问入口
 * 
 * @type {Object}
 * @property {Object} auth - 认证相关的 API 接口
 * @property {Object} config - 配置相关的 API 接口
 * @property {Object} signal - 信令相关的 API 接口
 * @property {Object} project - 项目相关的 API 接口
 * @property {Object} instance - 实例相关的 API 接口
 */
export default {
    /** 认证相关 API 接口模块 */
    auth: authApi,
    /** 配置相关 API 接口模块 */
    config: configApi,
    /** 信令相关 API 接口模块 */
    signal: signalApi,
    /** 项目相关 API 接口模块 */
    project: projectApi,
    /** 实例相关 API 接口模块 */
    instance: instanceApi
}