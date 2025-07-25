<template>
  <v-app>
    <v-main>
      <v-container fluid class="fill-height">
        <v-row justify="center" align="center" class="fill-height">
          <v-col cols="12" sm="8" md="6" lg="4" xl="3">
            <v-card class="elevation-12 rounded-lg">
              <v-card-title class="text-center pa-6">
                <div class="text-h4 font-weight-bold primary--text">
                  Pixel Twin Nexus
                </div>
                <div class="text-subtitle-1 mt-2 text-medium-emphasis">
                  欢迎回来，请登录您的账户
                </div>
              </v-card-title>

              <v-card-text class="pa-6">
                <v-form ref="form" v-model="valid" @submit.prevent="handleLogin">
                  <v-text-field v-model="loginForm.username" :rules="usernameRules" label="用户名"
                    prepend-inner-icon="mdi-account" variant="outlined" class="mb-3" :loading="loading"
                    required></v-text-field>

                  <v-text-field v-model="loginForm.password" :rules="passwordRules" label="密码"
                    prepend-inner-icon="mdi-lock" :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPassword ? 'text' : 'password'" variant="outlined" class="mb-4" :loading="loading"
                    @click:append-inner="showPassword = !showPassword" required></v-text-field>

                  <v-btn type="submit" color="primary" size="large" block class="mb-4" :loading="loading"
                    :disabled="!valid">
                    <v-icon left>mdi-login</v-icon>
                    登录
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>


  </v-app>
</template>

<script setup>
/**
 * 用户登录页面组件
 * 
 * 提供用户身份验证功能，包括：
 * - 用户名和密码输入表单
 * - 表单验证
 * - 登录状态管理
 * - 成功/失败消息提示
 * - 登录后的路由跳转
 * 
 * @component LoginView
 */

import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api'
import utils from '@/utils'
import { SUCCESS_MESSAGES } from '@/config/api'
import { useSnackbar } from '@/composables/useSnackbar'


const router = useRouter()
const { showSuccess, showError } = useSnackbar()

/**
 * 登录表单数据
 * 使用 reactive 确保表单数据的响应式更新
 */
const loginForm = reactive({
  username: '', // 用户名
  password: ''  // 密码
})

/**
 * 表单状态管理
 */
const valid = ref(false)        // 表单验证状态
const showPassword = ref(false) // 密码显示/隐藏状态
const form = ref(null)          // 表单引用
const loading = ref(false)      // 登录加载状态

/**
 * 用户名验证规则
 * 确保用户名不为空且长度符合要求
 */
const usernameRules = [
  v => !!v || '用户名不能为空',
  v => (v && v.length >= 2) || '用户名至少2个字符'
]

/**
 * 密码验证规则
 * 确保密码不为空且长度符合安全要求
 */
const passwordRules = [
  v => !!v || '密码不能为空',
  v => (v && v.length >= 6) || '密码至少6个字符'
]

/**
 * 处理登录表单提交
 * 验证表单有效性后发起登录请求
 */
const handleLogin = async () => {
  if (!valid.value) return // 表单验证未通过时不执行登录

  loading.value = true
  try {
    const response = await api.auth.login({ data: loginForm })

    if (response.code === 200) {
      // 存储访问令牌到本地存储
      if (response.data.accessToken) {
        utils.auth.setToken(response.data.accessToken)
      }

      // 显示登录成功消息
      showSuccess(SUCCESS_MESSAGES.LOGIN_SUCCESS)

      // 延迟跳转，给用户时间看到成功消息
      setTimeout(() => {
        // 检查是否有重定向参数（从路由守卫传递）
        const redirectPath = router.currentRoute.value.query.redirect
        if (redirectPath && redirectPath !== '/') {
          router.push(redirectPath) // 跳转到原始请求页面
        } else {
          router.push('/home') // 默认跳转到首页
        }
      }, 1000)
    }
  } catch (error) {
  } finally {
    loading.value = false
  }
}


</script>

<style lang="scss" scoped>
.fill-height {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.v-card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95) !important;
}

.primary--text {
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>