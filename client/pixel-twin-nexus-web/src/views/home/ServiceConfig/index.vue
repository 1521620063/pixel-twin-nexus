<template>
  <!-- 配置管理页面主容器 -->
  <div class="config-management-view">
    <!-- 页面标题区域 -->
    <v-card class="page-header mb-6" elevation="3">
      <v-card-text class="py-6">
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-avatar size="64" color="primary" class="mr-4">
              <v-icon size="32" color="white">mdi-cog-outline</v-icon>
            </v-avatar>
            <div>
              <h1 class="text-h4 font-weight-bold mb-1 text-primary">
                配置管理中心
              </h1>
              <p class="text-body-1 text-medium-emphasis mb-0">
                管理和配置 Pixel Twin 系统参数
              </p>
            </div>
          </div>
          <div class="d-flex gap-4">
            <v-btn color="success" variant="elevated" prepend-icon="mdi-content-save" @click="saveCurrentConfig"
              :loading="saving" :disabled="!hasChanges" class="save-btn">
              保存配置
            </v-btn>
            &nbsp;
            <v-btn color="warning" variant="outlined" prepend-icon="mdi-refresh" @click="loadCurrentConfig" :loading="loading"
              class="refresh-btn">
              重新加载
            </v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>



    <!-- 配置选项卡 -->
    <v-card class="config-tabs-container" elevation="2">
      <v-tabs v-model="activeTab" class="config-tabs" color="primary" align-tabs="start">
        <v-tab value="webrtc" class="tab-item">
          <v-icon class="mr-2">mdi-video-wireless</v-icon>
          WebRTC 配置
        </v-tab>
        <v-tab value="gpu" class="tab-item">
          <v-icon class="mr-2">mdi-expansion-card</v-icon>
          GPU 配置
        </v-tab>
      </v-tabs>
      
      <v-divider></v-divider>
      
      <v-tabs-window v-model="activeTab" class="config-tabs-window">
        <!-- WebRTC 配置选项卡 -->
        <v-tabs-window-item value="webrtc">
          <WebRTCConfig ref="webrtcConfigRef" />
        </v-tabs-window-item>

        <!-- GPU 配置选项卡 -->
        <v-tabs-window-item value="gpu">
          <GPUConfig ref="gpuConfigRef" />
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import WebRTCConfig from './components/WebRTCConfig.vue'
import GPUConfig from './components/GPUConfig.vue'
import { useSnackbar } from '@/composables/useSnackbar'

// 响应式数据
const activeTab = ref('webrtc')
const loading = ref(false)
const saving = ref(false)

// 组件引用
const webrtcConfigRef = ref(null)
const gpuConfigRef = ref(null)

// 消息提示
const { showSuccess, showError, showWarning } = useSnackbar()

// 计算属性
const hasChanges = computed(() => {
  // 这里可以根据需要实现变更检测逻辑
  // 暂时返回true，让按钮始终可用
  return true
})

// 获取当前活动的配置组件
const getCurrentConfigComponent = () => {
  if (activeTab.value === 'webrtc') {
    return webrtcConfigRef.value
  } else if (activeTab.value === 'gpu') {
    return gpuConfigRef.value
  }
  return null
}

// 加载当前配置
const loadCurrentConfig = async () => {
  const currentComponent = getCurrentConfigComponent()
  if (!currentComponent) {
    showError('未找到当前配置组件')
    return
  }

  loading.value = true
  try {
    if (activeTab.value === 'webrtc' && currentComponent.loadConfig) {
      await currentComponent.loadConfig()
    } else if (activeTab.value === 'gpu' && currentComponent.loadGpuConfig) {
      await currentComponent.loadGpuConfig()
    } else {
      showError('当前组件不支持加载配置')
    }
  } catch (error) {
    console.error('加载配置失败:', error)
    showError('加载配置失败')
  } finally {
    loading.value = false
  }
}

// 保存当前配置
const saveCurrentConfig = async () => {
  const currentComponent = getCurrentConfigComponent()
  if (!currentComponent) {
    showError('未找到当前配置组件')
    return
  }

  saving.value = true
  try {
    if (activeTab.value === 'webrtc' && currentComponent.saveConfig) {
      await currentComponent.saveConfig()
    } else if (activeTab.value === 'gpu' && currentComponent.saveGpuConfig) {
      await currentComponent.saveGpuConfig()
    } else {
      showError('当前组件不支持保存配置')
    }
  } catch (error) {
    console.error('保存配置失败:', error)
    showError('保存配置失败')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped lang="scss">
.config-management-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 16px;
  background: linear-gradient(135deg, rgba(var(--v-theme-surface), 0.95), rgba(var(--v-theme-background), 0.98));
  min-height: 100vh;
}

.page-header {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.08), rgba(var(--v-theme-primary), 0.04));
  border-radius: 20px;
  border-left: 4px solid rgb(var(--v-theme-primary));
  border: 1px solid rgba(var(--v-theme-surface-variant), 0.2);
  backdrop-filter: blur(10px);
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

.save-btn {
  box-shadow: 0 4px 15px rgba(var(--v-theme-success), 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 25px rgba(var(--v-theme-success), 0.4);
  }
}

.refresh-btn {
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px) scale(1.02);
  }
}

.config-tabs-container {
  border-radius: 16px;
  border: 1px solid rgba(var(--v-theme-surface-variant), 0.2);
  backdrop-filter: blur(5px);
  overflow: hidden;
}

.config-tabs {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05), rgba(var(--v-theme-primary), 0.02));
  
  .tab-item {
    font-weight: 600;
    text-transform: none;
    letter-spacing: 0.5px;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(var(--v-theme-primary), 0.08);
    }
  }
}

.config-tabs-window {
  min-height: 600px;
}

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

.config-preview {
  border-radius: 16px;
  border: 1px solid rgba(var(--v-theme-surface-variant), 0.2);

  .v-card-title {
    background: linear-gradient(135deg, rgba(var(--v-theme-secondary), 0.05), rgba(var(--v-theme-secondary), 0.02));
    border-radius: 16px 16px 0 0;
  }
}

.config-code,
.config-json {
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
  .config-management-view {
    padding: 0 8px;
  }

  .page-header {
    .d-flex {
      flex-direction: column;
      align-items: flex-start !important;
      gap: 16px;
    }

    .d-flex.gap-3 {
      align-self: stretch;

      .v-btn {
        flex: 1;
      }
    }
  }

  .page-header .text-h4 {
    font-size: 1.5rem !important;
  }

  .config-code {
    font-size: 12px;
  }
}

@media (max-width: 600px) {
  .ice-server-card,
  .server-card,
  .gpu-device-card {
    margin-bottom: 16px;
  }
  
  .tab-content {
    padding: 16px;
  }
  
  .config-tabs {
    .tab-item {
      font-size: 0.875rem;
      min-width: auto;
    }
  }
}
</style>