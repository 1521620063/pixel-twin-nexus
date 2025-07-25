/**
 * 计数器状态管理模块
 * 
 * @file stores/counter.js
 * @description 使用 Pinia 定义的计数器状态管理 Store，提供计数器的状态和操作方法
 * @author chensiyang
 * @version 1.0.0
 * @created 2024-01-01
 * @lastModified 2024-01-01
 * @copyright © 2024 Pixel Twin Nexus. All rights reserved.
 * 
 * @module CounterStore
 * @requires vue - Vue 3 响应式 API
 * @requires pinia - 状态管理库
 * 
 * @exports useCounterStore - 计数器状态管理 Store
 */
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

/**
 * 计数器状态管理 Store
 * 使用 Composition API 风格定义的 Pinia Store
 * 
 * @function useCounterStore
 * @returns {Object} 返回包含状态和方法的对象
 * @property {Ref<number>} count - 计数器当前值
 * @property {ComputedRef<number>} doubleCount - 计数器值的两倍
 * @property {Function} increment - 增加计数器值的方法
 */
export const useCounterStore = defineStore('counter', () => {
  /** 计数器当前值，响应式引用 */
  const count = ref(0)
  
  /** 计数器值的两倍，计算属性 */
  const doubleCount = computed(() => count.value * 2)
  
  /**
   * 增加计数器值
   * 将计数器的值增加 1
   * 
   * @function increment
   */
  function increment() {
    count.value++
  }

  // 返回状态和方法供组件使用
  return { count, doubleCount, increment }
})
