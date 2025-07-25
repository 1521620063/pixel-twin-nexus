/**
 * 工具函数模块统一导出文件
 * 
 * @file utils/index.js
 * @description 统一导出所有工具函数模块，提供便捷的导入方式
 * @author chensiyang
 * @version 1.0.0
 * @created 2024-01-01
 * @lastModified 2024-01-01
 * @copyright © 2024 Pixel Twin Nexus. All rights reserved.
 * 
 * @module Utils
 * @requires ./auth - 认证相关工具函数
 * 
 * @exports auth - 认证工具函数模块
 */

// 导入认证相关工具函数
import authUtils from './auth'

/**
 * 工具函数模块统一导出对象
 * 将所有工具函数模块整合到一个对象中，便于统一管理和使用
 * 
 * @type {Object}
 * @property {Object} auth - 认证相关工具函数模块
 */
export default {
    /** 认证相关工具函数 */
    auth: authUtils
}