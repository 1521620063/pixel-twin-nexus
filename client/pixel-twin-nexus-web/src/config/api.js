/**
 * API 配置文件
 * 统一管理应用中所有 API 相关的配置常量
 * 包括服务地址、超时设置、请求头、存储键名等
 */

/**
 * API 基础配置对象
 * 包含所有与 HTTP 请求相关的配置项
 * @type {Object}
 */
export const API_CONFIG = {
  /** 
   * API 基础 URL 地址
   * 从环境变量 VITE_API_URL 中获取，支持不同环境配置
   * @type {string}
   */
  BASE_URL: import.meta.env.VITE_API_URL,

  /** 
   * API 服务路径前缀
   * 统一为所有 API 请求添加的路径前缀
   * @type {string}
   */
  SERVICE_PREFIX: '/api',
  
  /** 
   * HTTP 请求超时时间
   * 单位：毫秒，超过此时间未响应则视为请求失败
   * @type {number}
   */
  TIMEOUT: 10000,
  
  /** 
   * 默认 HTTP 请求头配置
   * 所有请求都会携带这些默认头信息
   * @type {Object}
   */
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
  
  /** 
   * 认证令牌在 cookie 中的存储键名
   * @type {string}
   */
  TOKEN_KEY: 'access_token',
  
  /** 
   * 用户信息在 cookie 中的存储键名
   * @type {string}
   */
  USER_INFO_KEY: 'user_info'
}
/**
 * 错误消息配置对象
 * 定义各种 HTTP 错误状态对应的用户友好提示消息
 * @type {Object}
 */
export const ERROR_MESSAGES = {
  /** 网络连接错误消息 */
  NETWORK_ERROR: '网络连接失败，请检查网络',
  /** 请求超时错误消息 */
  TIMEOUT_ERROR: '请求超时，请重试',
  /** 401 未授权错误消息 */
  UNAUTHORIZED: '登录已过期，请重新登录',
  /** 403 禁止访问错误消息 */
  FORBIDDEN: '没有权限访问该资源',
  /** 404 资源未找到错误消息 */
  NOT_FOUND: '请求的资源不存在',
  /** 500 服务器内部错误消息 */
  SERVER_ERROR: '服务器内部错误',
  /** 默认错误消息 */
  DEFAULT_ERROR: '请求失败，请重试'
}

/**
 * 成功消息配置对象
 * 定义各种操作成功时的用户提示消息
 * @type {Object}
 */
export const SUCCESS_MESSAGES = {
  /** 登录成功提示消息 */
  LOGIN_SUCCESS: '登录成功！',
  /** 退出登录成功提示消息 */
  LOGOUT_SUCCESS: '退出登录成功！',
  /** 保存操作成功提示消息 */
  SAVE_SUCCESS: '保存成功！',
  /** 删除操作成功提示消息 */
  DELETE_SUCCESS: '删除成功！',
  /** 更新操作成功提示消息 */
  UPDATE_SUCCESS: '更新成功！'
}