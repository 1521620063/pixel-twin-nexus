/**
 * Vue Router 路由配置文件
 * 
 * @file router/index.js
 * @description 定义应用的所有路由规则、导航守卫和页面跳转逻辑，使用 Hash 模式路由，支持认证检查和页面标题设置
 * @author chensiyang
 * @version 1.0.0
 * @created 2024-01-01
 * @lastModified 2024-01-01
 * @copyright © 2024 Pixel Twin Nexus. All rights reserved.
 */
import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import { authGuard, setPageTitle, logRouteChange } from './routerUtils'


const routes = [
  /**
   * 登录页面路由
   * 应用的入口页面，用户认证界面
   */
  {
    path: '/',
    name: 'login',
    component: LoginView,
    meta: {
      requiresAuth: false, // 不需要认证即可访问
      title: '登录 - Pixel Twin Nexus'
    }
  },
  /**
   * WebRTC 播放器页面路由
   * Pixel Twin 实时流媒体播放器界面
   */
  {
    path: '/webrtc-player',
    name: 'webrtc-player',
    component: () => import('../views/PixelTwinPlayer.vue'),
    meta: {
      requiresAuth: false,
      title: 'WebRTC 播放器 - Pixel Twin Nexus',
      description: '实时流媒体播放器',
      icon: 'mdi-play-circle'
    }
  },
  /**
   * 主应用布局路由
   * 包含所有需要认证的页面，使用默认布局组件
   */
  {
    path: '/home',
    component: DefaultLayout,
    meta: {
      requiresAuth: true // 需要用户登录后才能访问
    },
    children: [
      /**
       * 默认重定向到欢迎页面
       * 当访问 /home 时自动跳转到 /home/welcome
       */
      {
        path: '',
        redirect: '/home/welcome'
      },
      /**
       * 欢迎页面路由
       * 系统主页，显示概览信息和导航
       */
      {
        path: 'welcome',
        name: 'welcome',
        component: () => import('../views/home/WelcomeView.vue'),
        meta: {
          requiresAuth: true,
          title: '欢迎页面 - Pixel Twin Nexus',
          description: '系统概览和欢迎信息',
          icon: 'mdi-home'
        }
      },
      /**
       * 服务配置页面路由
       * 系统服务配置和管理界面
       */
      {
        path: 'service-config',
        name: 'service-config',
        component: () => import('../views/home/ServiceConfig/index.vue'),
        meta: {
          requiresAuth: true,
          title: '服务配置 - Pixel Twin Nexus',
          description: '管理和配置系统服务参数',
          icon: 'mdi-cog-outline'
        }
      },
      /**
       * 项目管理页面路由
       * 项目创建、监控和管理界面
       */
      {
        path: 'project-management',
        name: 'project-management',
        component: () => import('../views/home/ProjectManagement/index.vue'),
        meta: {
          requiresAuth: true,
          title: '项目管理 - Pixel Twin Nexus',
          description: '管理和监控 Pixel Twin 项目实例',
          icon: 'mdi-folder-multiple-outline'
        }
      },
      /**
       * 实例管理页面路由
       * 系统实例监控和管理界面
       */
      {
        path: 'instance-management',
        name: 'instance-management',
        component: () => import('../views/home/InstanceManagement/index.vue'),
        meta: {
          requiresAuth: true,
          title: '实例管理 - Pixel Twin Nexus',
          description: '监控和管理系统实例运行状态',
          icon: 'mdi-cube-outline'
        }
      },
    ]
  },
  /**
   * 404 错误页面路由
   * 当页面不存在时显示的错误页面
   */
  {
    path: '/404',
    name: 'notFound',
    component: () => import('../views/NotFoundView.vue'),
    meta: {
      requiresAuth: false,
      title: '页面未找到 - Pixel Twin Nexus'
    }
  },
  /**
   * 通配符路由
   * 捕获所有未匹配的路由并重定向到 404 页面
   */
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

/**
 * 创建 Vue Router 实例
 * 配置路由历史模式和路由规则
 * @type {Router} Vue Router 实例
 */
const router = createRouter({
  /** 使用 Hash 模式的路由历史管理 */
  history: createWebHashHistory(import.meta.env.BASE_URL),
  /** 路由配置数组，定义所有页面的路由规则 */
  routes
})

/**
 * 路由前置守卫
 * 在每次路由跳转前执行，处理页面标题设置和用户认证检查
 * @param {Object} to - 即将进入的目标路由对象
 * @param {Object} from - 当前导航正要离开的路由对象
 * @param {Function} next - 调用该方法来 resolve 这个钩子
 */
router.beforeEach((to, from, next) => {
  // 根据路由元信息设置页面标题
  setPageTitle(to)

  // 执行用户认证检查和权限验证
  authGuard(to, from, next)
})

/**
 * 路由后置守卫
 * 在每次路由跳转完成后执行，用于记录路由变化和执行后续操作
 * @param {Object} to - 已经进入的目标路由对象
 * @param {Object} from - 离开的路由对象
 */
router.afterEach((to, from) => {
  // 在开发环境下记录路由跳转信息，便于调试
  logRouteChange(to, from)
})

export {
  routes
}

/**
 * 导出配置好的路由实例
 * 供 main.js 中的 Vue 应用实例使用
 */
export default router
