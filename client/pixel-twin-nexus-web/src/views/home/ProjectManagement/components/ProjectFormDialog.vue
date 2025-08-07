<template>
  <v-dialog v-model="dialog" max-width="900px" persistent scrollable>
    <v-card class="project-form-dialog">
      <!-- 对话框标题 -->
      <v-card-title class="dialog-header">
        <div class="d-flex align-center">
          <v-avatar size="40" color="primary" class="mr-3">
            <v-icon size="20" color="white">{{ isEdit ? 'mdi-pencil' : 'mdi-plus' }}</v-icon>
          </v-avatar>
          <div>
            <h2 class="text-h5 font-weight-bold mb-0">{{ isEdit ? '编辑项目' : '创建项目' }}</h2>
            <p class="text-body-2 text-medium-emphasis mb-0">{{ isEdit ? '修改项目配置信息' : '配置新的 Pixel Twin 项目' }}</p>
          </div>
        </div>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" variant="text" @click="closeDialog"></v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <!-- 表单内容 -->
      <v-card-text class="dialog-content">
        <v-form ref="formRef" v-model="formValid" @submit.prevent="submitForm">
          <!-- 基本信息区域 -->
          <div class="form-section">
            <div class="section-header">
              <v-icon color="primary" class="mr-2">mdi-information-outline</v-icon>
              <h3 class="text-h6 font-weight-bold">基本信息</h3>
            </div>
            
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.pixelTwinId"
                  label="项目ID"
                  prepend-inner-icon="mdi-identifier"
                  variant="outlined"
                  density="comfortable"
                  :rules="[rules.required, rules.pixelTwinId]"
                  :readonly="isEdit"
                  hint="项目的唯一标识符，创建后不可修改"
                  persistent-hint
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.pixelTwinName"
                  label="项目名称"
                  prepend-inner-icon="mdi-folder-outline"
                  variant="outlined"
                  density="comfortable"
                  :rules="[rules.required]"
                  hint="项目的显示名称"
                  persistent-hint
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.pixelTwinStartPath"
                  label="启动路径(信令服务所在本机路径)"
                  prepend-inner-icon="mdi-folder-open-outline"
                  variant="outlined"
                  density="comfortable"
                  hint="可执行文件的完整路径"
                  persistent-hint
                >
                  <template v-slot:append>
                    <v-btn
                      icon="mdi-folder-open"
                      variant="text"
                      size="small"
                      @click="selectFile"
                    ></v-btn>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="formData.graphicsMemory"
                  label="显存大小 (GB)"
                  prepend-inner-icon="mdi-memory"
                  variant="outlined"
                  density="comfortable"
                  type="number"
                  min="1"
                  max="64"
                  :rules="[rules.required, rules.graphicsMemory]"
                  hint="项目运行所需的显存大小，单位为GB"
                  persistent-hint
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-switch
                  v-model="formData.serviceEnable"
                  label="启用服务"
                  color="primary"
                  inset
                  hide-details
                  class="mt-4"
                >
                  <template v-slot:prepend>
                    <v-icon color="primary">mdi-power</v-icon>
                  </template>
                </v-switch>
              </v-col>
            </v-row>
          </div>

          <!-- 启动参数区域 -->
          <div class="form-section">
            <div class="section-header">
              <v-icon color="primary" class="mr-2">mdi-cog-outline</v-icon>
              <h3 class="text-h6 font-weight-bold">启动参数</h3>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                variant="outlined"
                size="small"
                prepend-icon="mdi-plus"
                @click="addArgument"
              >
                添加参数
              </v-btn>
            </div>

            <div v-if="formData.pixelTwinArgs.length === 0" class="no-args-placeholder">
              <v-avatar size="60" color="grey-lighten-3" class="mb-3">
                <v-icon size="30" color="grey">mdi-cog-off-outline</v-icon>
              </v-avatar>
              <p class="text-body-2 text-medium-emphasis">暂无启动参数</p>
              <v-btn color="primary" variant="text" @click="addArgument">
                添加第一个参数
              </v-btn>
            </div>

            <div v-else class="args-list">
              <v-card
                v-for="(arg, index) in formData.pixelTwinArgs"
                :key="index"
                :class="['arg-item', 'mb-3', { 'fixed-arg': arg.fixed }]"
                variant="outlined"
              >
                <v-card-text class="py-3">
                  <v-row align="center" no-gutters>
                    <v-col cols="12" sm="1" md="1" class="d-flex justify-center justify-sm-start mb-2 mb-sm-0">
                      <v-checkbox
                        v-model="arg.check"
                        color="primary"
                        :readonly="isParamNameReadonly(arg.key)"
                        hide-details
                        density="compact"
                      ></v-checkbox>
                    </v-col>
                    <v-col cols="12" sm="5" md="4" class="mb-2 mb-sm-0 px-2">
                      <v-text-field
                        v-model="arg.key"
                        label="参数名"
                        variant="outlined"
                        density="compact"
                        :rules="[rules.required]"
                        :readonly="isParamNameReadonly(arg.key)"
                        hide-details
                      >
                        <template v-if="arg.fixed" v-slot:prepend-inner>
                          <v-icon size="16" color="warning">mdi-lock</v-icon>
                        </template>
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="5" md="5" class="mb-2 mb-sm-0 px-2">
                      <v-text-field
                        v-model="arg.value"
                        label="参数值"
                        variant="outlined"
                        density="compact"
                        :readonly="isParamValueReadonly(arg)"
                        :type="arg.key === '-PixelStreamingWebRTCFps' || arg.key === '-ResX' || arg.key === '-ResY' || arg.key === '-PixelStreamingWebRTCLowQpThreshold' || arg.key === '-PixelStreamingWebRTCHighQpThreshold' ? 'number' : 'text'"
                        :min="arg.key === '-PixelStreamingWebRTCFps' ? 24 : (arg.key === '-ResX' || arg.key === '-ResY' ? 1 : (arg.key === '-PixelStreamingWebRTCLowQpThreshold' || arg.key === '-PixelStreamingWebRTCHighQpThreshold' ? 1 : undefined))"
                        :max="arg.key === '-PixelStreamingWebRTCFps' ? 120 : (arg.key === '-ResX' || arg.key === '-ResY' ? 4096 : (arg.key === '-PixelStreamingWebRTCLowQpThreshold' || arg.key === '-PixelStreamingWebRTCHighQpThreshold' ? 51 : undefined))"
                        :rules="getArgValidationRules(arg)"
                        hide-details
                        placeholder="可选"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="1" md="2" class="d-flex justify-center justify-sm-end px-2">
                      <v-btn
                        v-if="!arg.fixed"
                        icon="mdi-delete"
                        variant="text"
                        size="small"
                        color="error"
                        @click="removeArgument(index)"
                      ></v-btn>
                      <v-tooltip v-else location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-bind="props"
                            icon="mdi-lock"
                            variant="text"
                            size="small"
                            color="warning"
                            disabled
                          ></v-btn>
                        </template>
                        <span>系统参数，不可删除</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                  <!-- 参数描述 -->
                  <div v-if="arg.fixed && getArgDescription(arg.key)" class="arg-description mt-2">
                    <div class="d-flex align-center">
                      <v-icon size="14" color="info" class="mr-1">mdi-information-outline</v-icon>
                      <span class="text-caption text-info font-weight-medium">参数说明：</span>
                    </div>
                    <p class="text-caption text-medium-emphasis ml-4 mb-0 mt-1 text-wrap">
                      {{ getArgDescription(arg.key) }}
                    </p>
                  </div>
                </v-card-text>
              </v-card>
            </div>
          </div>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <!-- 对话框操作按钮 -->
      <v-card-actions class="dialog-actions">
        <v-spacer></v-spacer>
        <v-btn
          variant="outlined"
          @click="closeDialog"
          :disabled="loading"
        >
          取消
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          @click="submitForm"
          :loading="loading"
          :disabled="!formValid"
        >
          {{ isEdit ? '保存修改' : '创建项目' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick } from 'vue'
import api from '@/api'
import { useSnackbar } from '@/composables/useSnackbar'

const { showSuccess, showError } = useSnackbar()

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  editData: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'success'])

// 响应式数据
const formRef = ref(null)
const formValid = ref(false)
const loading = ref(false)

// 计算属性
const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isEdit = computed(() => !!props.editData)

// 只读参数名配置
const READONLY_PARAMS = [
  '-PixelStreamingURL',
  '-RenderOffScreen', 
  '-Unattended',
  '-AudioMixer',
  '-PixelStreamingHideCursor',
  '-AllowPixelStreamingCommands',
  '-ForceRes'
]

// 可编辑值的参数
const EDITABLE_VALUE_PARAMS = ['-ResX', '-ResY', '-PixelStreamingWebRTCFps', '-PixelStreamingWebRTCMinBitrate', '-PixelStreamingWebRTCMaxBitrate', '-PixelStreamingWebRTCLowQpThreshold', '-PixelStreamingWebRTCHighQpThreshold']

// 判断参数名是否只读
const isParamNameReadonly = (paramKey) => {
  return READONLY_PARAMS.includes(paramKey) || EDITABLE_VALUE_PARAMS.includes(paramKey)
}

// 判断参数值是否只读
const isParamValueReadonly = (arg) => {
  return arg.fixed && !EDITABLE_VALUE_PARAMS.includes(arg.key)
}

// 获取参数描述
const getArgDescription = (argKey) => {
  const descriptions = {
    '-PixelStreamingURL': '像素流传输URL，用于指定WebRTC连接的端点路径',
    '-RenderOffScreen': '启用离屏渲染模式，提高性能并减少GPU资源占用',
    '-Unattended': '无人值守模式，程序在后台运行无需用户交互',
    '-AudioMixer': '启用音频混合器，处理多路音频输入输出',
    '-PixelStreamingHideCursor': '隐藏像素流中的鼠标光标显示',
    '-AllowPixelStreamingCommands': '允许通过像素流接收和执行远程命令',
    '-ForceRes': '强制使用指定的分辨率设置',
    '-ResX': '设置水平分辨率（像素宽度）',
    '-ResY': '设置垂直分辨率（像素高度）',
    '-PixelStreamingWebRTCFps': '设置WebRTC帧率，范围24-120fps，影响流传输的流畅度',
    '-PixelStreamingWebRTCMinBitrate': '设置WebRTC最小码率，范围100000-最大码率(bps)，影响流传输的质量和带宽使用。单位换算：1兆比特每秒 = 100万比特每秒',
    '-PixelStreamingWebRTCMaxBitrate': '设置WebRTC最大码率，范围最小码率-100000000(bps)，影响流传输的质量和带宽使用。单位换算：1兆比特每秒 = 100万比特每秒',
    '-PixelStreamingWebRTCLowQpThreshold': '设置WebRTC低QP阈值，范围1-51，影响视频编码质量控制',
    '-PixelStreamingWebRTCHighQpThreshold': '设置WebRTC高QP阈值，范围1-51，影响视频编码质量控制'
  }
  return descriptions[argKey] || ''
}

// 固定的启动参数（不可删除）
const fixedArgs = [
  {
    key: '-PixelStreamingURL',
    value: '/pixel-twin-ue',
    check: true,
    fixed: true
  },
  {
    key: '-RenderOffScreen',
    check: true,
    fixed: true
  },
  {
    key: '-Unattended',
    check: true,
    fixed: true
  },
  {
    key: '-AudioMixer',
    check: true,
    fixed: true
  },
  {
    key: '-PixelStreamingHideCursor',
    check: true,
    fixed: true
  },
  {
    key: '-AllowPixelStreamingCommands',
    check: true,
    fixed: true
  },
  {
    key: '-ForceRes',
    check: true,
    fixed: true
  },
  {
    key: '-ResX',
    value: 1920,
    check: true,
    fixed: true
  },
  {
    key: '-ResY',
    value: 1080,
    check: true,
    fixed: true
  },
  {
    key: '-PixelStreamingWebRTCFps',
    value: 60,
    check: true,
    fixed: true
  },
  {
    key: '-PixelStreamingWebRTCMinBitrate',
    value: 100000,
    check: true,
    fixed: true
  },
  {
    key: '-PixelStreamingWebRTCMaxBitrate',
    value: 50000000,
    check: true,
    fixed: true
  },
  {
    key: '-PixelStreamingWebRTCLowQpThreshold',
    value: 25,
    check: true,
    fixed: true
  },
  {
    key: '-PixelStreamingWebRTCHighQpThreshold',
    value: 37,
    check: true,
    fixed: true
  }
]

// 表单数据
const defaultFormData = {
  pixelTwinId: '',
  pixelTwinName: '',
  pixelTwinStartPath: '',
  pixelTwinArgs: [...fixedArgs],
  graphicsMemory: 4,
  serviceEnable: true
}

const formData = reactive({ ...defaultFormData })

// 表单验证规则
const rules = {
  required: (value) => !!value || '此字段为必填项',
  pixelTwinId: (value) => {
    if (!value) return '项目ID为必填项'
    if (!/^[a-zA-Z0-9-_]+$/.test(value)) return '项目ID只能包含字母、数字、连字符和下划线'
    return true
  },
  graphicsMemory: (value) => {
    if (!value) return '显存大小为必填项'
    if (isNaN(value) || value < 1 || value > 64) return '显存大小必须在1-64GB之间'
    return true
  }
}

// 获取参数验证规则
const getArgValidationRules = (arg) => {
  const rules = []
  
  // 对于可编辑值的固定参数，添加相应验证
  if (arg.key === '-PixelStreamingWebRTCFps') {
    rules.push((value) => {
      if (!value) return true // 可选参数
      const num = Number(value)
      if (isNaN(num)) return '帧率必须是数字'
      if (num < 24 || num > 120) return '帧率必须在24-120之间'
      return true
    })
  } else if (arg.key === '-ResX' || arg.key === '-ResY') {
    rules.push((value) => {
      if (!value) return true // 可选参数
      const num = Number(value)
      if (isNaN(num)) return '分辨率必须是数字'
      if (num < 1 || num > 4096) return '分辨率必须在1-4096之间'
      return true
    })
  } else if (arg.key === '-PixelStreamingWebRTCMinBitrate') {
    rules.push((value) => {
      if (!value) return true // 可选参数
      const num = Number(value)
      if (isNaN(num)) return '最小码率必须是数字'
      if (num < 100000) return '最小码率不能小于100000'
      // 检查是否小于最大码率
      const maxBitrateArg = formData.pixelTwinArgs.find(a => a.key === '-PixelStreamingWebRTCMaxBitrate')
      if (maxBitrateArg && maxBitrateArg.value && Number(maxBitrateArg.value) <= num) {
        return '最小码率不能大于等于最大码率'
      }
      return true
    })
  } else if (arg.key === '-PixelStreamingWebRTCMaxBitrate') {
    rules.push((value) => {
      if (!value) return true // 可选参数
      const num = Number(value)
      if (isNaN(num)) return '最大码率必须是数字'
      if (num > 100000000) return '最大码率不能大于100000000'
      // 检查是否大于最小码率
      const minBitrateArg = formData.pixelTwinArgs.find(a => a.key === '-PixelStreamingWebRTCMinBitrate')
      if (minBitrateArg && minBitrateArg.value && Number(minBitrateArg.value) >= num) {
        return '最大码率不能小于等于最小码率'
      }
      return true
    })
  } else if (arg.key === '-PixelStreamingWebRTCLowQpThreshold') {
    rules.push((value) => {
      if (!value) return true // 可选参数
      const num = Number(value)
      if (isNaN(num)) return '低QP阈值必须是数字'
      if (num < 1 || num > 51) return '低QP阈值必须在1-51之间'
      // 检查是否小于高QP阈值
      const highQpArg = formData.pixelTwinArgs.find(a => a.key === '-PixelStreamingWebRTCHighQpThreshold')
      if (highQpArg && highQpArg.value && Number(highQpArg.value) <= num) {
        return '低QP阈值不能大于等于高QP阈值'
      }
      return true
    })
  } else if (arg.key === '-PixelStreamingWebRTCHighQpThreshold') {
    rules.push((value) => {
      if (!value) return true // 可选参数
      const num = Number(value)
      if (isNaN(num)) return '高QP阈值必须是数字'
      if (num < 1 || num > 51) return '高QP阈值必须在1-51之间'
      // 检查是否大于低QP阈值
      const lowQpArg = formData.pixelTwinArgs.find(a => a.key === '-PixelStreamingWebRTCLowQpThreshold')
      if (lowQpArg && lowQpArg.value && Number(lowQpArg.value) >= num) {
        return '高QP阈值不能小于等于低QP阈值'
      }
      return true
    })
  }
  
  return rules
}

// 监听编辑数据变化
watch(() => props.editData, (newData) => {
  if (newData) {
    // 合并固定参数和用户自定义参数
    const existingArgs = newData.pixelTwinArgs || []
    const customArgs = existingArgs.filter(arg => 
      !fixedArgs.some(fixed => fixed.key === arg.key)
    )
    
    // 合并固定参数，保留现有值
    const mergedFixedArgs = fixedArgs.map(fixedArg => {
      const existingArg = existingArgs.find(arg => arg.key === fixedArg.key)
      return existingArg ? {
        ...fixedArg,
        value: existingArg.value,
        check: existingArg.check
      } : fixedArg
    })
    
    Object.assign(formData, {
      pixelTwinId: newData.pixelTwinId || '',
      pixelTwinName: newData.pixelTwinName || '',
      pixelTwinStartPath: newData.pixelTwinStartPath || '',
      pixelTwinArgs: [...mergedFixedArgs, ...customArgs],
      graphicsMemory: newData.graphicsMemory || 4,
      serviceEnable: newData.serviceEnable ?? true
    })
  }
}, { immediate: true })

// 监听对话框打开状态
watch(dialog, (newValue) => {
  if (newValue && !props.editData) {
    // 创建模式，重置表单
    resetForm()
  }
})

// 重置表单
const resetForm = () => {
  Object.assign(formData, {
    ...defaultFormData,
    pixelTwinArgs: [...fixedArgs]
  })
  nextTick(() => {
    formRef.value?.resetValidation()
  })
}

// 添加参数
const addArgument = () => {
  formData.pixelTwinArgs.push({
    key: '',
    value: '',
    check: true,
    fixed: false
  })
}

// 删除参数
const removeArgument = (index) => {
  const arg = formData.pixelTwinArgs[index]
  if (!arg.fixed) {
    formData.pixelTwinArgs.splice(index, 1)
  }
}

// 选择文件（模拟功能）
const selectFile = () => {
  // 这里可以集成文件选择器
  showError('文件选择功能暂未实现，请手动输入路径')
}

// 关闭对话框
const closeDialog = () => {
  dialog.value = false
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    // 清理参数数据，移除fixed标识
    const cleanArgs = formData.pixelTwinArgs.map(arg => ({
      key: arg.key,
      value: arg.value,
      check: arg.check
    }))

    const submitData = {
      ...formData,
      pixelTwinArgs: cleanArgs,
      pixelTwinInstance: []
    }

    let response
    if (isEdit.value) {
      response = await api.project.editProject({ data: submitData })
    } else {
      response = await api.project.addProject({ data: submitData })
    }

    if (response.code === 200) {
      showSuccess(`项目${isEdit.value ? '修改' : '创建'}成功`)
      emit('success')
      closeDialog()
    } else {
      throw new Error(response.message || `项目${isEdit.value ? '修改' : '创建'}失败`)
    }
  } catch (error) {
    console.error('提交表单失败:', error)
    showError(error.message || `项目${isEdit.value ? '修改' : '创建'}失败`)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.project-form-dialog {
  border-radius: 16px;
  overflow: hidden;
}

.dialog-header {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.08), rgba(var(--v-theme-primary), 0.04));
  border-bottom: 1px solid rgba(var(--v-theme-surface-variant), 0.2);
  padding: 20px 24px;
}

.dialog-content {
  max-height: 70vh;
  padding: 24px;
}

.form-section {
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(var(--v-theme-primary), 0.1);
}

.no-args-placeholder {
  text-align: center;
  padding: 40px 20px;
  background: rgba(var(--v-theme-surface-variant), 0.05);
  border-radius: 12px;
  border: 2px dashed rgba(var(--v-theme-surface-variant), 0.3);
}

.args-list {
  max-height: 300px;
  overflow-y: auto;
}

.arg-item {
  transition: all 0.2s ease;
  border-radius: 12px;

  &:hover {
    box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.1);
    transform: translateY(-1px);
  }

  // 固定参数样式
  &.fixed-arg {
    background: rgba(var(--v-theme-warning), 0.05);
    border-color: rgba(var(--v-theme-warning), 0.2);
    
    &:hover {
      box-shadow: 0 4px 12px rgba(var(--v-theme-warning), 0.1);
    }
  }
}

// 参数描述样式
.arg-description {
  background: rgba(var(--v-theme-info), 0.05);
  border-radius: 8px;
  padding: 8px 12px;
  border-left: 3px solid rgba(var(--v-theme-info), 0.3);
  
  .text-caption {
    line-height: 1.4;
  }
}

.dialog-actions {
  padding: 16px 24px;
  background: rgba(var(--v-theme-surface-variant), 0.05);
}

// 响应式设计
@media (max-width: 900px) {
  .project-form-dialog {
    margin: 16px;
  }
}

@media (max-width: 768px) {
  .dialog-content {
    padding: 16px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .arg-item {
    .v-card-text {
      padding: 12px !important;
    }
  }
}

@media (max-width: 480px) {
  .dialog-header {
    padding: 16px;
    
    .text-h5 {
      font-size: 1.1rem !important;
    }
    
    .text-body-2 {
      font-size: 0.8rem !important;
    }
  }
  
  .dialog-content {
    padding: 12px;
  }
  
  .dialog-actions {
    padding: 12px 16px;
    
    .v-btn {
      min-width: 80px;
    }
  }
}

@media (max-width: 600px) {
  .arg-item {
    .v-card-text {
      padding: 8px !important;
    }
    
    margin-bottom: 16px;
  }
  
  .arg-description {
    margin-top: 12px;
    margin-left: 0;
    margin-right: 0;
    padding: 6px 8px;
    
    .ml-4 {
      margin-left: 8px !important;
    }
  }
  
  .section-header {
    h3 {
      margin-bottom: 8px;
    }
    
    .v-btn {
      width: 100%;
      margin-top: 8px;
    }
  }
  
  .no-args-placeholder {
    padding: 20px 16px;
  }
  
  .args-list {
    max-height: 250px;
  }
}
</style>