/**
 * 用户认证工具模块
 * 
 * @file utils/auth.js
 * @description 提供用户认证相关的cookie存储管理功能，包括访问令牌和用户信息的存储、获取、清除操作，使用 js-cookie 确保数据安全性和跨标签页共享
 * @author chensiyang
 * @version 1.1.0
 * @created 2024-01-01
 * @lastModified 2024-01-10
 * @copyright © 2024 Pixel Twin Nexus. All rights reserved.
 * 
 * @module AuthUtils
 * @requires @/config/api - API配置模块
 * @requires js-cookie - Cookie操作库
 * 
 * @exports setToken - 存储访问令牌
 * @exports getToken - 获取访问令牌
 * @exports clearToken - 清除访问令牌
 * @exports setUserInfo - 存储用户信息
 * @exports getUserInfo - 获取用户信息
 * @exports clearUserInfo - 清除用户信息
 * @exports clearAuthInfo - 清除所有认证信息
 */

import { API_CONFIG } from '@/config/api'
import Cookies from 'js-cookie'

export default {
    /**
     * 存储访问令牌
     * @param {string} token - JWT访问令牌
     */
    setToken: token => Cookies.set(API_CONFIG.TOKEN_KEY, token, { 
        expires: 1, 
        sameSite: 'Lax' 
    }),
    
    /**
     * 获取访问令牌
     * @returns {string|null} 存储的访问令牌，不存在时返回null
     */
    getToken: () => Cookies.get(API_CONFIG.TOKEN_KEY) || null,
    
    /**
     * 清除访问令牌
     * 用于用户登出或令牌过期时清理
     */
    clearToken: () => Cookies.remove(API_CONFIG.TOKEN_KEY),
    
    /**
     * 存储用户信息
     * @param {Object} userInfo - 用户信息对象
     */
    setUserInfo: userInfo => Cookies.set(API_CONFIG.USER_INFO_KEY, JSON.stringify(userInfo), { 
        expires: 1, 
        sameSite: 'Lax' 
    }),
    
    /**
     * 获取用户信息
     * @returns {Object|null} 解析后的用户信息对象，解析失败或不存在时返回null
     */
    getUserInfo: () => {
        try {
            const userInfoStr = Cookies.get(API_CONFIG.USER_INFO_KEY)
            return userInfoStr ? JSON.parse(userInfoStr) : null
        } catch (error) {
            console.error('解析用户信息失败:', error)
            return null
        }
    },
    
    /**
     * 清除用户信息
     * 用于用户登出时清理用户数据
     */
    clearUserInfo: () => Cookies.remove(API_CONFIG.USER_INFO_KEY),
    
    /**
     * 清除所有认证信息
     * 一次性清除访问令牌和用户信息，用于完全登出
     */
    clearAuthInfo: () => {
        Cookies.remove(API_CONFIG.TOKEN_KEY)
        Cookies.remove(API_CONFIG.USER_INFO_KEY)
    }
}