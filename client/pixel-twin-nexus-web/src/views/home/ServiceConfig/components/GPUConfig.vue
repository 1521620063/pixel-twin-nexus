<template>
  <div class="tab-content">

    <!-- GPU 配置区域 -->
    <v-card class="config-section mb-6" elevation="0" variant="flat">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-3" color="primary">mdi-expansion-card</v-icon>
        <span class="text-h5">GPU 配置管理</span>
        <v-spacer></v-spacer>
        <v-chip color="primary" variant="tonal" size="small">
          Graphics Processing Unit
        </v-chip>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text class="py-6">
        <v-form ref="gpuConfigForm" v-model="formValid">
          <v-row>
            <v-col cols="12">
              <v-card class="server-card mb-4" variant="outlined" elevation="2">
                <v-card-title class="d-flex align-center py-3">
                  <v-icon class="mr-2" color="info" size="small">mdi-server</v-icon>
                  <span class="text-subtitle-1">GPU 服务器</span>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text class="py-4">
                  <div class="config-field-wrapper mb-4">
                    <v-text-field v-model="gpuConfig.ip" label="服务器 IP 地址" variant="outlined" density="compact"
                      prepend-inner-icon="mdi-ip-network" :rules="[rules.required, rules.ip]"
                      placeholder="例如：192.168.1.100" disabled>
                      <template v-slot:append>
                        <v-tooltip location="top">
                          <template v-slot:activator="{ props }">
                            <v-icon v-bind="props" color="info" size="small">mdi-information-outline</v-icon>
                          </template>
                          <div class="tooltip-content">
                            <div class="text-subtitle-2 mb-1">服务器 IP 说明</div>
                            <div class="text-body-2">
                              GPU 服务器的 IP 地址，用于网络连接和通信
                            </div>
                          </div>
                        </v-tooltip>
                      </template>
                    </v-text-field>
                  </div>

                  <!-- GPU 设备列表 -->
                  <v-divider class="my-4"></v-divider>
                  <div class="d-flex justify-space-between align-center mb-3">
                    <h4 class="text-h6">GPU 设备</h4>
                    <v-btn color="primary" variant="tonal" size="small" prepend-icon="mdi-plus" @click="addGpu()">
                      添加 GPU
                    </v-btn>
                  </div>

                  <v-row>
                    <v-col v-for="(gpu, gpuIndex) in gpuConfig.gpu" :key="gpuIndex" cols="12" md="6" lg="4">
                      <v-card class="gpu-device-card" variant="outlined" elevation="1">
                        <v-card-title class="d-flex align-center py-3">
                          <v-icon class="mr-2" color="primary" size="small">mdi-expansion-card</v-icon>
                          <span class="text-subtitle-2">GPU {{ gpuIndex + 1 }}</span>
                          <v-spacer></v-spacer>
                          <v-btn icon="mdi-delete" size="x-small" color="error" variant="text"
                            @click="removeGpu(gpuIndex)"></v-btn>
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-text class="py-3">
                          <div class="config-field-wrapper mb-3">
                            <v-text-field v-model.number="gpu.graphicsAdapter" label="显卡适配器索引" variant="outlined"
                              density="compact" prepend-inner-icon="mdi-numeric" type="number"
                              :rules="[rules.requiredNumber, rules.nonNegativeNumber]" placeholder="例如：0"
                              @update:model-value="markAsChanged">
                              <template v-slot:append>
                                <v-tooltip location="top">
                                  <template v-slot:activator="{ props }">
                                    <v-icon v-bind="props" color="info" size="small">mdi-information-outline</v-icon>
                                  </template>
                                  <div class="tooltip-content">
                                    <div class="text-subtitle-2 mb-1">显卡适配器索引说明</div>
                                    <div class="text-body-2">
                                      GPU 在系统中的适配器索引，通常从 0 开始编号
                                    </div>
                                  </div>
                                </v-tooltip>
                              </template>
                            </v-text-field>
                          </div>

                          <div class="config-field-wrapper">
                            <v-text-field v-model.number="gpu.gpuMemory" label="显存大小 (GB)" variant="outlined"
                              density="compact" prepend-inner-icon="mdi-memory" type="number"
                              :rules="[rules.required, rules.positiveNumber]" placeholder="例如：16"
                              @update:model-value="markAsChanged">
                              <template v-slot:append>
                                <v-tooltip location="top">
                                  <template v-slot:activator="{ props }">
                                    <v-icon v-bind="props" color="info" size="small">mdi-information-outline</v-icon>
                                  </template>
                                  <div class="tooltip-content">
                                    <div class="text-subtitle-2 mb-1">显存大小说明</div>
                                    <div class="text-body-2">
                                      GPU 的显存容量，单位为 GB，用于渲染和计算任务
                                    </div>
                                  </div>
                                </v-tooltip>
                              </template>
                            </v-text-field>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- GPU 配置预览区域 -->
    <v-card class="config-preview mb-6" elevation="2">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-3" color="secondary">mdi-code-json</v-icon>
        <span class="text-h5">GPU 配置预览</span>
        <v-spacer></v-spacer>
        <v-btn color="secondary" variant="tonal" size="small" prepend-icon="mdi-content-copy" @click="copyGpuConfig">
          复制配置
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text class="py-4">
        <v-code class="config-code">
          <pre>{{ formattedGpuConfig }}</pre>
        </v-code>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api'
import { useSnackbar } from '@/composables/useSnackbar'

// 响应式数据
const loading = ref(false)
const saving = ref(false)
const formValid = ref(false)
const originalGpuConfig = ref(null)
const { showSuccess, showError, showWarning } = useSnackbar()

// GPU 配置数据
const gpuConfig = ref({
  ip: '127.0.0.1',
  gpu: [
    {
      graphicsAdapter: 0,
      gpuMemory: 0
    }
  ]
})

// 表单验证规则
const rules = {
  required: value => !!value || '此字段为必填项',
  requiredNumber: value => {
    return (value !== null && value !== undefined && value !== '') || '此字段为必填项'
  },
  positiveNumber: value => {
    if (!value) return true
    const num = parseFloat(value)
    return (num > 0) || '请输入大于0的数值'
  },
  nonNegativeNumber: value => {
    if (value === '' || value === null || value === undefined) return true
    const num = parseFloat(value)
    return (num >= 0) || '请输入大于等于0的数值'
  },
  ip: value => {
    if (!value) return true
    const ipPattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    return ipPattern.test(value) || '请输入有效的 IP 地址'
  }
}

// 计算属性
const formattedGpuConfig = computed(() => {
  return JSON.stringify(gpuConfig.value, null, 2)
})

// 方法
const markAsChanged = () => {
  // 内部状态变化，不需要通知父组件
}

// GPU 配置操作方法

const addGpu = () => {
  gpuConfig.value.gpu.push({
    graphicsAdapter: 0,
    gpuMemory: 0
  })
  markAsChanged()
}

const removeGpu = (gpuIndex) => {
  gpuConfig.value.gpu.splice(gpuIndex, 1)
  markAsChanged()
}

const copyGpuConfig = async () => {
  try {
    await navigator.clipboard.writeText(formattedGpuConfig.value)
    showSuccess('GPU 配置已复制到剪贴板')
  } catch (error) {
    showError('复制失败')
  }
}

// 加载GPU配置
const loadGpuConfig = async () => {
  loading.value = true
  try {
    const response = await api.config.getGpuConfig()
    if (response.code == 200) {
      // 处理数据结构：response.data 是单个对象
      const configData = response.data || {
        ip: 'localhost',
        gpu: [
          {
            graphicsAdapter: 0,
            gpuMemory: 0
          }
        ]
      }
      // 直接使用单个对象
      gpuConfig.value = configData
      originalGpuConfig.value = JSON.parse(JSON.stringify(gpuConfig.value))
      showSuccess('GPU 配置加载成功')
    } else {
      throw new Error('GPU 配置数据格式错误')
    }
  } catch (error) {
    console.error('加载 GPU 配置失败:', error)
    showError(error.message || '加载 GPU 配置失败')
  } finally {
    loading.value = false
  }
}

// 保存GPU配置
const saveGpuConfig = async () => {
  if (!formValid.value) {
    showWarning('请检查 GPU 配置项是否填写正确')
    return
  }

  saving.value = true
  try {
    // 发送单个对象，符合API要求
    const response = await api.config.saveGpuConfig({ data: gpuConfig.value })
    if (response.code == 200) {
      originalGpuConfig.value = JSON.parse(JSON.stringify(gpuConfig.value))
      showSuccess('GPU 配置保存成功')
      // 保存成功后重新加载配置
      await loadGpuConfig()
    } else {
      throw new Error('保存 GPU 配置失败')
    }
  } catch (error) {
    console.error('保存 GPU 配置失败:', error)
    showError(error.message || '保存 GPU 配置失败')
  } finally {
    saving.value = false
  }
}

// 生命周期
onMounted(async () => {
  await loadGpuConfig()
})

// 暴露方法给父组件（如果需要）
defineExpose({
  loadGpuConfig,
  saveGpuConfig
})
</script>

<style scoped lang="scss">

.tab-content {
  padding: 24px;
}

.config-section {
  border-radius: 16px;
  border: 1px solid rgba(var(--v-theme-surface-variant), 0.2);
  backdrop-filter: blur(5px);

  .v-card-title {
    background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05), rgba(var(--v-theme-primary), 0.02));
    border-radius: 16px 16px 0 0;
  }
}

.server-card {
  transition: all 0.3s ease;
  border-radius: 12px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(var(--v-theme-info), 0.15) !important;
  }
}

.gpu-device-card {
  transition: all 0.3s ease;
  border-radius: 8px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.12) !important;
  }
}

.config-field-wrapper {
  position: relative;
}

.tooltip-content {
  max-width: 300px;
  padding: 8px;
  line-height: 1.4;

  .text-subtitle-2 {
    color: rgb(var(--v-theme-primary));
    font-weight: 600;
  }

  .text-body-2 {
    color: rgba(var(--v-theme-on-surface), 0.87);

    strong {
      color: rgb(var(--v-theme-primary));
      font-weight: 600;
    }
  }
}

.config-preview {
  border-radius: 16px;
  border: 1px solid rgba(var(--v-theme-surface-variant), 0.2);

  .v-card-title {
    background: linear-gradient(135deg, rgba(var(--v-theme-secondary), 0.05), rgba(var(--v-theme-secondary), 0.02));
    border-radius: 16px 16px 0 0;
  }
}

.config-code {
  background: rgba(var(--v-theme-surface-variant), 0.1);
  border-radius: 8px;
  padding: 16px;
  font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.5;
  max-height: 400px;
  overflow-y: auto;
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  color: rgba(var(--v-theme-on-surface), 0.87);
  width: 100%;
  box-sizing: border-box;
}

// 响应式设计
@media (max-width: 768px) {
  .tab-content {
    padding: 16px;
  }

  .config-code {
    font-size: 12px;
  }
}

@media (max-width: 600px) {

  .server-card,
  .gpu-device-card {
    margin-bottom: 16px;
  }
}
</style>