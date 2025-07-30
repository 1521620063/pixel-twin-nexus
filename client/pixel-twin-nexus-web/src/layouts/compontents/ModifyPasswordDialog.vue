<!--
 * 修改密码弹窗组件
 * 
 * @file components/ModifyPasswordDialog.vue
 * @description 修改用户名密码的弹窗组件
 * @author chensiyang
 * @version 1.0.0
 * @created 2024-01-01
 * @lastModified 2024-01-01
 * @copyright © 2024 Pixel Twin Nexus. All rights reserved.
 * 
 * @component ModifyPasswordDialog
 * @requires vue - Vue 3 Composition API
 * @requires @/api - API 接口模块
 * @requires @/composables/useSnackbar - 消息提示组合式函数
 * @requires @/utils/auth - 认证工具函数
 * 
 * @features
 * - 修改用户名密码功能
 * - 表单验证
 * - 响应式设计
 * - 用户友好的交互反馈
 -->
<template>
  <!-- 修改密码弹窗 -->
  <v-dialog
    v-model="dialog"
    max-width="600px"
    persistent
    scrollable
  >
    <v-card class="modify-password-dialog">
      <v-card-title class="d-flex align-center py-4">
        <v-icon size="24" color="primary" class="mr-2">mdi-lock-outline</v-icon>
        <span class="text-h6">修改用户名密码</span>
      </v-card-title>
      
      <v-card-text style="height: 600px;">
        <v-form ref="formRef" v-model="valid" @submit.prevent="submitForm">
          <v-row>
            <!-- 当前用户名 -->
            <v-col cols="12">
              <v-text-field
                v-model="formData.username"
                label="当前用户名"
                prepend-inner-icon="mdi-account-outline"
                variant="outlined"
                density="comfortable"
                :rules="[rules.required]"
                readonly
                hint="您当前的用户名"
                persistent-hint
              ></v-text-field>
            </v-col>
            
            <!-- 旧密码 -->
            <v-col cols="12">
              <v-text-field
                v-model="formData.password"
                label="旧密码"
                prepend-inner-icon="mdi-lock-outline"
                variant="outlined"
                density="comfortable"
                :append-inner-icon="showOldPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showOldPassword ? 'text' : 'password'"
                :rules="[rules.required, rules.password]"
                @click:append-inner="showOldPassword = !showOldPassword"
                hint="请输入您当前的密码"
                persistent-hint
              ></v-text-field>
            </v-col>
            
            <!-- 新用户名 -->
            <v-col cols="12">
              <v-text-field
                v-model="formData.newUsername"
                label="新用户名"
                prepend-inner-icon="mdi-account-edit-outline"
                variant="outlined"
                density="comfortable"
                :rules="[rules.required, rules.username]"
                hint="请输入新的用户名"
                persistent-hint
              ></v-text-field>
            </v-col>
            
            <!-- 新密码 -->
            <v-col cols="12">
              <v-text-field
                v-model="formData.newPassword"
                label="新密码"
                prepend-inner-icon="mdi-lock-plus-outline"
                variant="outlined"
                density="comfortable"
                :append-inner-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showNewPassword ? 'text' : 'password'"
                :rules="[rules.required, rules.password]"
                @click:append-inner="showNewPassword = !showNewPassword"
                hint="请输入新的密码"
                persistent-hint
              ></v-text-field>
            </v-col>
            
            <!-- 确认新密码 -->
            <v-col cols="12">
              <v-text-field
                v-model="confirmNewPassword"
                label="确认新密码"
                prepend-inner-icon="mdi-lock-check-outline"
                variant="outlined"
                density="comfortable"
                :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showConfirmPassword ? 'text' : 'password'"
                :rules="[rules.required, rules.password, confirmPasswordRule]"
                @click:append-inner="showConfirmPassword = !showConfirmPassword"
                hint="请再次输入新的密码"
                persistent-hint
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      
      <v-card-actions class="pa-4">
        <v-btn
          color="error"
          variant="outlined"
          @click="closeDialog"
        >
          <v-icon left>mdi-close</v-icon>
          取消
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          variant="elevated"
          :loading="loading"
          :disabled="!valid"
          @click="submitForm"
        >
          <v-icon left>mdi-content-save</v-icon>
          保存更改
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
/**
 * 修改密码弹窗组件
 * 
 * 提供用户修改用户名密码的功能，包括：
 * - 表单验证
 * - 密码可见性切换
 * - 提交状态管理
 * - 成功/失败消息提示
 * 
 * @component ModifyPasswordDialog
 */

import { ref, reactive, onMounted, defineEmits, defineProps, watch } from 'vue'
import api from '@/api'
import utils from '@/utils'
import { useSnackbar } from '@/composables/useSnackbar'
import { logout } from '@/router/routerUtils'
import { useRouter } from 'vue-router'

// ==================== 组件属性 ====================

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

// ==================== 路由 ====================

const router = useRouter()

// ==================== 响应式数据 ====================

/** 弹窗显示状态 */
const dialog = ref(false)

/** 表单引用 */
const formRef = ref(null)

/** 表单验证状态 */
const valid = ref(false)

/** 提交加载状态 */
const loading = ref(false)

/** 旧密码显示状态 */
const showOldPassword = ref(false)

/** 新密码显示状态 */
const showNewPassword = ref(false)

/** 确认密码显示状态 */
const showConfirmPassword = ref(false)

/** 确认新密码 */
const confirmNewPassword = ref('')

/** 表单数据 */
const formData = reactive({
  userId: '',
  username: '',
  password: '',
  newUsername: '',
  newPassword: ''
})

/** 表单验证规则 */
const rules = {
  required: (value) => !!value || '此字段为必填项',
  username: (value) => {
    if (!value) return '用户名为必填项'
    if (value.length < 2) return '用户名至少2个字符'
    if (value.length > 20) return '用户名不能超过20个字符'
    return true
  },
  password: (value) => {
    if (!value) return '密码为必填项'
    if (value.length < 6) return '密码至少6个字符'
    if (value.length > 50) return '密码不能超过50个字符'
    return true
  }
}

/** 确认密码验证规则 */
const confirmPasswordRule = (value) => {
  if (!value) return '请确认新密码'
  if (value !== formData.newPassword) return '两次输入的密码不一致'
  return true
}

// ==================== 监听器 ====================

/** 监听弹窗显示状态变化 */
watch(() => props.modelValue, (newValue) => {
  dialog.value = newValue
  if (newValue) {
    // 弹窗打开时重置表单
    resetForm()
  }
})

/** 监听内部弹窗状态变化 */
watch(dialog, (newValue) => {
  emit('update:modelValue', newValue)
  if (!newValue) {
    // 弹窗关闭时重置表单
    resetForm()
  }
})

// ==================== 生命周期 ====================

/** 组件挂载时获取用户信息 */
onMounted(() => {
  const userInfo = utils.auth.getUserInfo()
  if (userInfo) {
    formData.userId = userInfo.userId || ''
    formData.username = userInfo.username || ''
    // 初始化新用户名为当前用户名
    formData.newUsername = userInfo.username || ''
  }
})

// ==================== 核心方法 ====================

/** 重置表单 */
const resetForm = () => {
  // 清空密码字段
  formData.password = ''
  formData.newPassword = ''
  confirmNewPassword.value = ''
  
  // 重置表单验证状态
  formRef.value?.resetValidation()
  
  // 重置密码可见性
  showOldPassword.value = false
  showNewPassword.value = false
  showConfirmPassword.value = false
}

/** 关闭弹窗 */
const closeDialog = () => {
  dialog.value = false
}

/** 消息提示功能 */
const { showSuccess, showError } = useSnackbar()

/**
 * 提交表单
 * 验证表单有效性后发起修改用户信息请求
 */
const submitForm = async () => {
  if (!valid.value) return // 表单验证未通过时不执行提交

  // 再次验证确认密码
  if (formData.newPassword !== confirmNewPassword.value) {
    showError('两次输入的新密码不一致')
    return
  }

  loading.value = true
  try {
    const response = await api.auth.modifyUser({ 
      data: {
        userId: formData.userId,
        username: formData.username,
        password: formData.password,
        newUsername: formData.newUsername,
        newPassword: formData.newPassword
      }
    })

    if (response.code === 200) {
      showSuccess('用户名密码修改成功')
      
      // 如果修改的是当前登录用户的信息，更新本地存储
      const currentUserInfo = utils.auth.getUserInfo()
      if (currentUserInfo && currentUserInfo.userId === formData.userId) {
        // 更新用户名
        currentUserInfo.username = formData.newUsername
        utils.auth.setUserInfo(currentUserInfo)
      }
      
      // 关闭弹窗
      closeDialog()
      
      // 退出登录并跳转到登录页面
      logout(router)
    } else {
      showError(response.message || '修改失败')
    }
  } catch (error) {
    console.error('修改用户名密码失败:', error)
    showError('修改用户名密码失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 修改密码弹窗样式 */
.modify-password-dialog {
  border-radius: 16px;
}

/* 响应式设计 */
@media (max-width: 600px) {
  .modify-password-dialog {
    border-radius: 12px;
  }
}
</style>