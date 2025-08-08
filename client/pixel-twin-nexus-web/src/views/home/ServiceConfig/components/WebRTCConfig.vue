<template>
  <div class="tab-content">

    <!-- WebRTC 配置区域 -->
    <v-card class="config-section mb-6" elevation="0" variant="flat">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-3" color="primary">mdi-video-wireless</v-icon>
        <span class="text-h5">WebRTC 连接配置</span>
        <v-spacer></v-spacer>
        <v-chip color="primary" variant="tonal" size="small">
          PeerConnection Options
        </v-chip>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text class="py-6">
        <v-form ref="configForm" v-model="formValid">
          <v-row>
            <!-- ICE Transport Policy -->
            <v-col cols="12" md="6">
              <div class="config-field-wrapper">
                <v-select v-model="config.peerConnectionOptions.iceTransportPolicy" :items="iceTransportPolicyOptions"
                  label="ICE 传输策略" variant="outlined" prepend-inner-icon="mdi-network" :rules="[rules.required]"
                  @update:model-value="markAsChanged">
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template v-slot:title>
                        <div class="d-flex align-center">
                          <v-icon class="mr-2" size="small">{{ item.raw.icon }}</v-icon>
                          {{ item.raw.title }}
                        </div>
                      </template>
                      <template v-slot:subtitle>
                        {{ item.raw.description }}
                      </template>
                    </v-list-item>
                  </template>
                  <template v-slot:append>
                    <v-tooltip location="top">
                      <template v-slot:activator="{ props }">
                        <v-icon v-bind="props" color="info" size="small">mdi-information-outline</v-icon>
                      </template>
                      <div class="tooltip-content">
                        <div class="text-subtitle-2 mb-1">ICE 传输策略说明</div>
                        <div class="text-body-2">
                          控制 WebRTC 连接时 ICE 候选者的收集策略：<br>
                          • <strong>All</strong>：收集所有类型候选者（本地、反射、中继）<br>
                          • <strong>Relay</strong>：仅收集中继候选者以增强隐私保护
                        </div>
                      </div>
                    </v-tooltip>
                  </template>
                </v-select>
              </div>
            </v-col>

            <!-- Bundle Policy -->
            <v-col cols="12" md="6">
              <div class="config-field-wrapper">
                <v-select v-model="config.peerConnectionOptions.bundlePolicy" :items="bundlePolicyOptions"
                  label="Bundle 策略" variant="outlined" prepend-inner-icon="mdi-package-variant"
                  :rules="[rules.required]" @update:model-value="markAsChanged">
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template v-slot:title>
                        <div class="d-flex align-center">
                          <v-icon class="mr-2" size="small">{{ item.raw.icon }}</v-icon>
                          {{ item.raw.title }}
                        </div>
                      </template>
                      <template v-slot:subtitle>
                        {{ item.raw.description }}
                      </template>
                    </v-list-item>
                  </template>
                  <template v-slot:append>
                    <v-tooltip location="top">
                      <template v-slot:activator="{ props }">
                        <v-icon v-bind="props" color="info" size="small">mdi-information-outline</v-icon>
                      </template>
                      <div class="tooltip-content">
                        <div class="text-subtitle-2 mb-1">Bundle 策略说明</div>
                        <div class="text-body-2">
                          控制多个媒体流的打包传输策略：<br>
                          • <strong>Balanced</strong>：平衡性能和兼容性<br>
                          • <strong>Max Compat</strong>：最大兼容性但可能增加延迟<br>
                          • <strong>Max Bundle</strong>：最大打包减少网络开销
                        </div>
                      </div>
                    </v-tooltip>
                  </template>
                </v-select>
              </div>
            </v-col>

            <!-- RTCP Mux Policy -->
            <v-col cols="12" md="6">
              <div class="config-field-wrapper">
                <v-select v-model="config.peerConnectionOptions.rtcpMuxPolicy" :items="rtcpMuxPolicyOptions"
                  label="RTCP 复用策略" variant="outlined" prepend-inner-icon="mdi-merge" :rules="[rules.required]"
                  @update:model-value="markAsChanged">
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template v-slot:title>
                        <div class="d-flex align-center">
                          <v-icon class="mr-2" size="small">{{ item.raw.icon }}</v-icon>
                          {{ item.raw.title }}
                        </div>
                      </template>
                      <template v-slot:subtitle>
                        {{ item.raw.description }}
                      </template>
                    </v-list-item>
                  </template>
                  <template v-slot:append>
                    <v-tooltip location="top">
                      <template v-slot:activator="{ props }">
                        <v-icon v-bind="props" color="info" size="small">mdi-information-outline</v-icon>
                      </template>
                      <div class="tooltip-content">
                        <div class="text-subtitle-2 mb-1">RTCP 复用策略说明</div>
                        <div class="text-body-2">
                          控制 RTCP（实时传输控制协议）和 RTP（实时传输协议）的复用方式：<br>
                          • <strong>Require</strong>：强制复用减少端口使用<br>
                          • <strong>Negotiate</strong>：协商决定是否复用
                        </div>
                      </div>
                    </v-tooltip>
                  </template>
                </v-select>
              </div>
            </v-col>

            <!-- ICE Candidate Pool Size -->
            <v-col cols="12" md="6">
              <div class="config-field-wrapper">
                <v-slider v-model="config.peerConnectionOptions.iceCandidatePoolSize" :min="0" :max="10" :step="1"
                  label="ICE 候选池大小" variant="outlined" prepend-inner-icon="mdi-pool" :rules="[rules.iceCandidatePoolSize]"
                  @update:model-value="markAsChanged" show-ticks thumb-label>
                  <template v-slot:append>
                    <v-tooltip location="top">
                      <template v-slot:activator="{ props }">
                        <v-icon v-bind="props" color="info" size="small">mdi-information-outline</v-icon>
                      </template>
                      <div class="tooltip-content">
                        <div class="text-subtitle-2 mb-1">ICE 候选池大小说明</div>
                        <div class="text-body-2">
                          控制预加载的 ICE 候选者数量，范围 0-10，默认值 0：<br>
                          • <strong>0</strong>：不预加载候选者<br>
                          • <strong>1-10</strong>：预加载指定数量的候选者以加快连接建立
                        </div>
                      </div>
                    </v-tooltip>
                  </template>
                </v-slider>
              </div>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- ICE 服务器配置区域 -->
    <v-card class="config-section mb-6" elevation="2">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-3" color="info">mdi-server-network</v-icon>
        <span class="text-h5">ICE 服务器配置</span>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="tonal" size="small" prepend-icon="mdi-plus" @click="addIceServer">
          添加服务器
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text class="py-6">
        <v-row>
          <v-col v-for="(server, index) in config.peerConnectionOptions.iceServers" :key="index" cols="12" md="6"
            lg="4">
            <v-card class="ice-server-card" variant="outlined" elevation="1">
              <v-card-title class="d-flex align-center py-3">
                <v-icon class="mr-2" color="info" size="small">mdi-server</v-icon>
                <span class="text-subtitle-1">ICE 服务器 {{ index + 1 }}</span>
                <v-spacer></v-spacer>
                <v-btn icon="mdi-delete" size="x-small" color="error" variant="text" @click="removeIceServer(index)"
                  :disabled="config.peerConnectionOptions.iceServers.length <= 1"></v-btn>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text class="py-4">
                <div class="config-field-wrapper">
                  <v-text-field v-model="server.urls" label="服务器 URL" variant="outlined" density="compact"
                    prepend-inner-icon="mdi-link" :rules="[rules.required, rules.url]"
                    placeholder="stun:stun.example.com:19302" @update:model-value="markAsChanged">
                    <template v-slot:append>
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <v-icon v-bind="props" color="info" size="small">mdi-information-outline</v-icon>
                        </template>
                        <div class="tooltip-content">
                          <div class="text-subtitle-2 mb-1">服务器 URL 格式</div>
                          <div class="text-body-2">
                            • <strong>STUN 服务器</strong>：stun:域名:端口<br>
                            • <strong>TURN 服务器</strong>：turn:域名:端口<br>
                            • <strong>TURNS 服务器</strong>：turns:域名:端口（安全连接）
                          </div>
                        </div>
                      </v-tooltip>
                    </template>
                  </v-text-field>
                </div>

                <div class="config-field-wrapper mt-3">
                  <v-text-field v-model="server.username" label="用户名 (可选)" variant="outlined" density="compact"
                    prepend-inner-icon="mdi-account" @update:model-value="markAsChanged">
                    <template v-slot:append>
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <v-icon v-bind="props" color="info" size="small">mdi-information-outline</v-icon>
                        </template>
                        <div class="tooltip-content">
                          <div class="text-subtitle-2 mb-1">用户名说明</div>
                          <div class="text-body-2">
                            TURN 服务器认证用户名，STUN 服务器通常不需要此字段
                          </div>
                        </div>
                      </v-tooltip>
                    </template>
                  </v-text-field>
                </div>

                <div class="config-field-wrapper mt-3">
                  <v-text-field v-model="server.credential" label="凭证 (可选)" variant="outlined" density="compact"
                    prepend-inner-icon="mdi-key" type="password" @update:model-value="markAsChanged">
                    <template v-slot:append>
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <v-icon v-bind="props" color="info" size="small">mdi-information-outline</v-icon>
                        </template>
                        <div class="tooltip-content">
                          <div class="text-subtitle-2 mb-1">凭证说明</div>
                          <div class="text-body-2">
                            TURN 服务器认证密码或令牌，STUN 服务器通常不需要此字段
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

    <!-- WebRTC 配置预览区域 -->
    <v-card class="config-preview mb-6" elevation="2">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-3" color="secondary">mdi-code-json</v-icon>
        <span class="text-h5">WebRTC 配置预览</span>
        <v-spacer></v-spacer>
        <v-btn color="secondary" variant="tonal" size="small" prepend-icon="mdi-content-copy" @click="copyConfig">
          复制配置
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text class="py-4">
        <v-code class="config-code">
          <pre>{{ formattedConfig }}</pre>
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
const originalConfig = ref(null)
const { showSuccess, showError, showWarning } = useSnackbar()

// 配置数据
const config = ref({
  peerConnectionOptions: {
    iceTransportPolicy: 'all',
    bundlePolicy: 'balanced',
    rtcpMuxPolicy: 'require',
    iceCandidatePoolSize: 0,
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302'
      }
    ]
  }
})

// 配置选项
const iceTransportPolicyOptions = [
  {
    title: 'All',
    value: 'all',
    description: '收集所有类型的 ICE 候选者',
    icon: 'mdi-select-all'
  },
  {
    title: 'Relay',
    value: 'relay',
    description: '仅收集中继类型的 ICE 候选者',
    icon: 'mdi-relay'
  }
]

const bundlePolicyOptions = [
  {
    title: 'Balanced',
    value: 'balanced',
    description: '平衡的媒体流打包策略',
    icon: 'mdi-scale-balance'
  },
  {
    title: 'Max Compat',
    value: 'max-compat',
    description: '最大兼容性的打包策略',
    icon: 'mdi-check-network'
  },
  {
    title: 'Max Bundle',
    value: 'max-bundle',
    description: '最大打包的策略',
    icon: 'mdi-package-variant-closed'
  }
]

const rtcpMuxPolicyOptions = [
  {
    title: 'Require',
    value: 'require',
    description: '要求 RTCP 和 RTP 复用',
    icon: 'mdi-merge'
  },
  {
    title: 'Negotiate',
    value: 'negotiate',
    description: '协商 RTCP 和 RTP 复用',
    icon: 'mdi-handshake'
  }
]

// 表单验证规则
const rules = {
  required: value => !!value || '此字段为必填项',
  url: value => {
    if (!value) return true
    const urlPattern = /^(stun|turn|turns):[\w.-]+:\d+$/
    return urlPattern.test(value) || '请输入有效的 STUN/TURN 服务器 URL'
  },
  iceCandidatePoolSize: value => {
    if (value === undefined || value === null) return '此字段为必填项'
    if (Number.isInteger(value) && value >= 0 && value <= 10) return true
    return '请输入 0-10 之间的整数'
  }
}

// 计算属性
const formattedConfig = computed(() => {
  return JSON.stringify(config.value, null, 2)
})

// 方法
const markAsChanged = () => {
  // 内部状态变化，不需要通知父组件
}

const addIceServer = () => {
  config.value.peerConnectionOptions.iceServers.push({
    urls: ''
  })
  markAsChanged()
}

const removeIceServer = (index) => {
  if (config.value.peerConnectionOptions.iceServers.length > 1) {
    config.value.peerConnectionOptions.iceServers.splice(index, 1)
    markAsChanged()
  }
}

const copyConfig = async () => {
  try {
    await navigator.clipboard.writeText(formattedConfig.value)
    showSuccess('WebRTC 配置已复制到剪贴板')
  } catch (error) {
    showError('复制失败')
  }
}

// 加载配置
const loadConfig = async () => {
  loading.value = true
  try {
    const response = await api.config.getConfig()
    if (response.code == 200) {
      config.value = response.data
      originalConfig.value = JSON.parse(JSON.stringify(response.data))
      showSuccess('WebRTC 配置加载成功')
    } else {
      throw new Error('配置数据格式错误')
    }
  } catch (error) {
    console.error('加载 WebRTC 配置失败:', error)
    showError(error.message || '加载 WebRTC 配置失败')
  } finally {
    loading.value = false
  }
}

// 保存配置
const saveConfig = async () => {
  if (!formValid.value) {
    showWarning('请检查 WebRTC 配置项是否填写正确')
    return
  }

  saving.value = true
  try {
    const response = await api.config.saveConfig({ data: config.value })
    if (response.code == 200) {
      originalConfig.value = JSON.parse(JSON.stringify(config.value))
      showSuccess('WebRTC 配置保存成功')
      // 保存成功后重新加载配置
      await loadConfig()
    } else {
      throw new Error('保存 WebRTC 配置失败')
    }
  } catch (error) {
    console.error('保存 WebRTC 配置失败:', error)
    showError(error.message || '保存 WebRTC 配置失败')
  } finally {
    saving.value = false
  }
}

// 生命周期
onMounted(async () => {
  await loadConfig()
})

// 暴露方法给父组件（如果需要）
defineExpose({
  loadConfig,
  saveConfig
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

.ice-server-card {
  transition: all 0.3s ease;
  border-radius: 12px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(var(--v-theme-info), 0.15) !important;
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
  .ice-server-card {
    margin-bottom: 16px;
  }
}
</style>