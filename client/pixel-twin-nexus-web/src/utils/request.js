/**
 * HTTP 请求工具模块
 * 
 * @file utils/request.js
 * @description 基于 Axios 和 vue-request 封装的统一请求处理工具，提供请求/响应拦截、错误处理、认证令牌管理等功能
 * @author chensiyang
 * @version 1.0.0
 * @created 2024-01-01
 * @lastModified 2024-01-01
 * @copyright © 2024 Pixel Twin Nexus. All rights reserved.
 * 
 * @module RequestUtils
 * @requires axios - HTTP 客户端库
 * @requires vue-request - Vue 3 请求管理库
 * @requires @/config/api - API 配置模块
 * @requires . - 工具函数模块
 * 
 * @exports useApiRequest - API 请求组合式函数
 * @exports default - 配置好的 Axios 实例
 */
import axios from 'axios'
import { API_CONFIG, ERROR_MESSAGES } from '@/config/api'
import { useSnackbar } from '@/composables/useSnackbar'
import utils from '.'
import { Decrypt, Encrypt } from '@/utils/encryption'
/**
 * 创建 Axios 实例
 * 配置基础 URL、超时时间和默认请求头
 * @type {AxiosInstance} Axios 实例对象
 */
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,     // API 基础地址
  timeout: API_CONFIG.TIMEOUT,     // 请求超时时间
  headers: API_CONFIG.DEFAULT_HEADERS  // 默认请求头
})

// 获取消息提示功能
const { showWarning, showError } = useSnackbar()

/**
 * 请求拦截器
 * 在每个请求发送前执行，用于添加认证令牌和统一处理请求配置
 */
apiClient.interceptors.request.use(
  /**
   * 请求成功拦截处理
   * @param {Object} config - Axios 请求配置对象
   * @returns {Object} 处理后的请求配置
   */
  (config) => {
    // 从 cookie 获取认证令牌
    const token = utils.auth.getToken();
    if (token) {
      // 在请求头中添加 Bearer 认证令牌
      config.headers.Authorization = `Bearer ${token}`
    }
    // 统一为所有请求添加 API 服务前缀
    config.url = API_CONFIG.SERVICE_PREFIX + config.url
    if (config.data) {
      config.data = {
        pixel_twin_params: Encrypt(JSON.stringify(config.data), Date.now().toString())
      }
    }
    return config
  },
  /**
   * 请求错误拦截处理
   * @param {Error} error - 请求错误对象
   * @returns {Promise} 拒绝的 Promise
   */
  (error) => {
    console.error('请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 * 在每个响应返回后执行，用于统一处理响应数据和错误状态
 */
apiClient.interceptors.response.use(
  /**
   * 响应成功拦截处理
   * @param {Object} response - Axios 响应对象
   * @returns {any} 响应数据
   */
  (response) => {
    // 直接返回响应数据，去除 Axios 包装
    if (response.data.errorMessage) {
      // 正常请求但有错误消息时显示警告
      showWarning(response.data.errorMessage)
    }
    //如果有解密参数
    if (response.data?.data?.pixel_twin_params) {
      const [ciphertext, timestamp, key, iv] = response.data.data.pixel_twin_params;
      let [decryptText, t] = Decrypt(key, iv, ciphertext, timestamp)
      response.data.data = JSON.parse(decryptText)

    }
    return response.data
  },
  /**
   * 响应错误拦截处理
   * @param {Error} error - 响应错误对象
   * @returns {Promise} 拒绝的 Promise
   */
  (error) => {
    console.error('响应拦截器错误:', error)

    // 根据不同的错误类型进行处理
    if (error.response) {
      // 服务器返回了错误状态码
      const { status, data } = error.response
      switch (status) {
        case 401:
          // 未授权：清除认证信息并重定向到登录页
          utils.auth.clearAuthInfo()
          window.location.href = '/'
          console.error(ERROR_MESSAGES.UNAUTHORIZED)
          break
        case 403:
          // 禁止访问
          console.error(ERROR_MESSAGES.FORBIDDEN)
          break
        case 404:
          // 资源未找到
          console.error(ERROR_MESSAGES.NOT_FOUND)
          break
        case 500:
          // 服务器内部错误
          console.error(ERROR_MESSAGES.SERVER_ERROR)
          break
        default:
          // 其他错误状态码
          console.error(data?.errorMessage || ERROR_MESSAGES.DEFAULT_ERROR)
          if (data?.errorMessage) {
            // 错误请求时显示错误消息
            showError(data.errorMessage)
          }
      }
    } else if (error.request) {
      // 网络错误（请求已发出但未收到响应）
      console.error(ERROR_MESSAGES.NETWORK_ERROR)
    } else {
      // 其他错误（请求配置错误等）
      console.error(ERROR_MESSAGES.DEFAULT_ERROR)
    }

    return Promise.reject(error)
  }
)

/**
 * 导出配置好的 Axios 实例
 * 可直接用于发送 HTTP 请求，已包含拦截器和错误处理
 * @type {AxiosInstance}
 */
export default apiClient;