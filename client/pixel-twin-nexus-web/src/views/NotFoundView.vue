<template>
  <v-app>
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="6" lg="4">
            <v-card class="elevation-8 text-center pa-8">
              <!-- 404 图标和标题 -->
              <div class="mb-6">
                <v-icon 
                  size="120" 
                  color="primary" 
                  class="mb-4"
                >
                  mdi-emoticon-sad-outline
                </v-icon>
                
                <div class="text-h2 font-weight-bold text-primary mb-2">
                  404
                </div>
                
                <div class="text-h5 text-medium-emphasis mb-4">
                  页面未找到
                </div>
                
                <div class="text-body-1 text-medium-emphasis mb-6">
                  抱歉，您访问的页面不存在或已被移除。
                </div>
              </div>
              
              <!-- 错误信息卡片 -->
              <v-alert
                type="info"
                variant="tonal"
                class="mb-6 text-left"
              >
                <div class="text-subtitle-2 mb-2">
                  <v-icon class="mr-2">mdi-information</v-icon>
                  可能的原因：
                </div>
                <ul class="text-body-2">
                  <li>URL地址输入错误</li>
                  <li>页面已被删除或移动</li>
                  <li>您没有访问权限</li>
                  <li>服务器配置问题</li>
                </ul>
              </v-alert>
              
              <!-- 操作按钮 -->
              <v-row justify="center" class="mb-4">
                <v-col cols="auto">
                  <v-btn
                    color="primary"
                    size="large"
                    prepend-icon="mdi-home"
                    @click="goHome"
                  >
                    返回首页
                  </v-btn>
                </v-col>
                
                <v-col cols="auto">
                  <v-btn
                    color="secondary"
                    variant="outlined"
                    size="large"
                    prepend-icon="mdi-arrow-left"
                    @click="goBack"
                  >
                    返回上页
                  </v-btn>
                </v-col>
              </v-row>
              
              <!-- 快速导航 -->
              <v-divider class="my-6"></v-divider>
              
              <div class="text-subtitle-2 mb-4">
                <v-icon class="mr-2">mdi-compass</v-icon>
                快速导航
              </div>
              
              <v-row justify="center">
                <v-col cols="auto" v-for="link in quickLinks" :key="link.name">
                  <v-btn
                    :color="link.color"
                    variant="text"
                    size="small"
                    :prepend-icon="link.icon"
                    @click="navigateTo(link.path)"
                  >
                    {{ link.name }}
                  </v-btn>
                </v-col>
              </v-row>
              
              <!-- 联系信息 -->
              <v-card-text class="text-caption text-medium-emphasis mt-6">
                <v-icon size="16" class="mr-1">mdi-help-circle</v-icon>
                如果问题持续存在，请联系系统管理员
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { API_CONFIG } from '@/config/api'
import auth from '@/utils/auth'

const router = useRouter()

// 快速导航链接
const quickLinks = ref([
  {
    name: '登录',
    path: '/',
    icon: 'mdi-login',
    color: 'primary'
  },
  {
    name: '首页',
    path: '/home',
    icon: 'mdi-home',
    color: 'success'
  }
])

// 返回首页
const goHome = () => {
  // 检查是否有token，决定跳转到首页还是登录页
  const token = auth.getToken()
  if (token) {
    router.push('/home')
  } else {
    router.push('/')
  }
}

// 返回上一页
const goBack = () => {
  // 如果有历史记录则返回，否则跳转到首页
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    goHome()
  }
}

// 导航到指定路径
const navigateTo = (path) => {
  router.push(path)
}
</script>

<style lang="scss" scoped>
.fill-height {
  min-height: 100vh;
}

.v-card {
  border-radius: 16px;
}

ul {
  padding-left: 20px;
}

li {
  margin-bottom: 4px;
}
</style>