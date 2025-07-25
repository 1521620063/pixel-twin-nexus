<!--
 * Pixel Twin 实例管理页面
 * 
 * @file views/home/InstanceManagementView.vue
 * @description Pixel Twin 实例管理页面，提供实例列表查看、项目类型筛选、实例销毁等功能
 * @author chensiyang
 * @version 1.0.0
 * @created 2024-01-01
 * @lastModified 2024-01-01
 * @copyright © 2024 Pixel Twin Nexus. All rights reserved.
 * 
 * @component InstanceManagementView
 * @requires vue - Vue 3 Composition API
 * @requires @/api - API 接口模块
 * @requires @/composables/useConfirm - 确认对话框组合式函数
 * @requires @/composables/useSnackbar - 消息提示组合式函数
 * 
 * @features
 * - 实例列表展示：以卡片形式展示所有实例信息
 * - 项目类型筛选：支持按项目类型筛选实例
 * - 实例销毁：提供实例销毁功能
 * - 数据刷新：支持手动刷新实例数据
 * - 响应式设计：适配不同屏幕尺寸
 -->
<template>
  <!-- 实例管理页面主容器 -->
  <div class="instance-management-view">
    <!-- 页面标题区域 -->
    <v-card class="page-header mb-6" elevation="3">
      <v-card-text class="py-6">
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-avatar size="64" color="primary" class="mr-4">
              <v-icon size="32" color="white">mdi-cube-outline</v-icon>
            </v-avatar>
            <div>
              <h1 class="text-h4 font-weight-bold mb-1 text-primary">
                Pixel Twin 实例管理
              </h1>
              <p class="text-body-1 text-medium-emphasis mb-0">
                管理和监控 Pixel Twin 项目实例
              </p>
            </div>
          </div>
          <v-btn color="primary" variant="elevated" prepend-icon="mdi-refresh" @click="refreshData" :loading="loading"
            class="refresh-btn">
            刷新数据
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- 项目类型选择区域 -->
    <v-card class="mb-6" elevation="2">
      <v-card-text>
        <v-row align="center">
          <v-col cols="12" md="6">
            <v-select v-model="selectedProjectType" :items="projectTypes" item-title="pixelTwinName"
              item-value="pixelTwinId" label="选择项目类型" variant="outlined" density="comfortable"
              prepend-inner-icon="mdi-folder-outline" :loading="loadingTypes" @update:model-value="onProjectTypeChange"
              clearable hide-details>
              <template v-slot:no-data>
                <v-list-item>
                  <v-list-item-title>暂无项目类型</v-list-item-title>
                </v-list-item>
              </template>
            </v-select>
          </v-col>

        </v-row>
      </v-card-text>
    </v-card>



    <!-- 实例列表区域 -->
    <div v-if="!loadingInstances&&instances.length==0" class="text-center py-12">
      <v-icon size="80" color="grey-lighten-2" class="mb-4">mdi-folder-open-outline</v-icon>
      <h3 class="text-h6 text-medium-emphasis mb-2">请选择项目类型</h3>
      <p class="text-body-2 text-medium-emphasis">选择一个项目类型来查看其实例列表</p>
    </div>

    <div v-else-if="loadingInstances" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" size="64" class="mb-4"></v-progress-circular>
      <h3 class="text-h6 text-medium-emphasis">加载实例数据中...</h3>
    </div>

    <div v-else-if="instances.length === 0" class="text-center py-12">
      <v-icon size="80" color="grey-lighten-2" class="mb-4">mdi-cube-off-outline</v-icon>
      <h3 class="text-h6 text-medium-emphasis mb-2">暂无实例</h3>
      <p class="text-body-2 text-medium-emphasis">当前项目类型下没有运行的实例</p>
    </div>

    <!-- 实例网格视图 -->
    <div v-else class="instances-grid">
      <v-row>
        <v-col v-for="instance in instances" :key="instance.id" cols="12" sm="6" md="4" lg="3">
          <v-card class="instance-card" elevation="2" hover>
            <v-card-text class="pb-2">
              <!-- 实例头部信息 -->
              <div class="d-flex align-center mb-3">
                <v-avatar size="40" color="primary" class="mr-3">
                  <v-icon color="white">mdi-cube-outline</v-icon>
                </v-avatar>
                <div class="flex-grow-1">
                  <h3 class="text-subtitle-1 font-weight-bold mb-0 instance-title">实例 {{ instance.id }}</h3>
                </div>
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-dots-vertical" variant="text" size="small" v-bind="props"
                      @click.stop></v-btn>
                  </template>
                  <v-list>
                    <v-list-item @click="destroyInstance(instance)" :disabled="instance.destroying">
                      <template v-slot:prepend>
                        <v-icon color="error">mdi-delete</v-icon>
                      </template>
                      <v-list-item-title class="text-error">销毁实例</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>

              <!-- 项目信息 -->
              <div class="project-info mb-3">
                <v-chip color="primary" variant="tonal" size="small" class="mb-2">
                  <v-icon start size="16">mdi-folder</v-icon>
                  {{ instance.pixelTwinName }}
                </v-chip>
                <div class="info-row mb-1">
                  <v-icon size="16" class="mr-2" color="info">mdi-identifier</v-icon>
                  <span class="text-caption">项目ID: {{ instance.pixelTwinId }}</span>
                </div>
              </div>

              <!-- 服务器信息 -->
              <div class="server-info mb-3">
                <div class="info-row mb-1">
                  <v-icon size="16" class="mr-2" color="secondary">mdi-server</v-icon>
                  <span class="text-caption">服务器: {{ instance.serverIp }}</span>
                </div>
                <div class="info-row mb-1">
                  <v-icon size="16" class="mr-2" color="warning">mdi-graphics-card</v-icon>
                  <span class="text-caption">GPU适配器: {{ instance.gpuAdapter }}</span>
                </div>
              </div>

              <!-- 客户端连接信息 -->
              <div class="connection-info">
                <div class="info-row mb-1">
                  <v-icon size="16" class="mr-2" color="info">mdi-ip</v-icon>
                  <span class="text-caption">客户端IP: {{ instance.clientInfo?.ip || '未知' }}</span>
                </div>
                <div class="info-row mb-1">
                  <v-icon size="16" class="mr-2" color="success">mdi-connection</v-icon>
                  <span class="text-caption">连接时间: {{ formatTime(instance.clientInfo?.connectTime) }}</span>
                </div>
                <div class="info-row mb-1">
                  <v-icon size="16" class="mr-2" color="primary">mdi-clock-outline</v-icon>
                  <span class="text-caption">最后活跃: {{ formatTime(instance.clientInfo?.lastActiveTime) }}</span>
                </div>
                <div class="info-row">
                  <v-icon size="16" class="mr-2" color="purple">mdi-web</v-icon>
                  <span class="text-caption">来源: {{ instance.clientInfo?.origin || '未知' }}</span>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>




  </div>
</template>

<script setup>
/**
 * Pixel Twin 实例管理页面脚本
 * 使用 Vue 3 Composition API 构建的实例管理功能
 */
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import api from '@/api'
import { useConfirm } from '@/composables/useConfirm'
import { useSnackbar } from '@/composables/useSnackbar'

// ==================== 响应式数据定义 ====================

/** 全局加载状态 */
const loading = ref(false)

/** 项目类型加载状态 */
const loadingTypes = ref(false)

/** 实例列表加载状态 */
const loadingInstances = ref(false)

/** 当前选中的项目类型ID */
const selectedProjectType = ref('')

/** 定时器引用 - 用于实时数据刷新 */
let refreshTimer = null

// ==================== 组合式函数 ====================

/** 确认对话框功能 */
const { confirmDelete } = useConfirm()

/** 消息提示功能 */
const { showSuccess, showError } = useSnackbar()

// ==================== 数据状态 ====================

/** 项目类型列表 */
const projectTypes = ref([])

/** 实例列表 */
const instances = ref([])

/** 当前页码 */
const currentPage = ref(1)

/** 每页显示数量 */
const pageSize = ref(20)

/** 总数量 */
const totalCount = ref(0)




// ==================== 核心方法 ====================

/**
 * 刷新数据
 * 重新加载当前选中项目类型的实例列表
 * 
 * @async
 * @function refreshData
 */
const refreshData = async () => {
  // 手动刷新时显示加载状态
  await loadInstances(null, true)
}

/**
 * 加载项目类型列表
 * 从后端获取所有可用的项目类型，并添加"全部"选项
 * 
 * @async
 * @function loadProjectTypes
 */
const loadProjectTypes = async () => {
  loadingTypes.value = true
  try {
    const response = await api.instance.getInstanceTypes()
    if (response.code == 200) {
      const originalTypes = response.data.list || []
      // 添加"全部"选项到项目类型列表的开头
      projectTypes.value = [
        { pixelTwinId: '', pixelTwinName: '全部' },
        ...originalTypes
      ]
      // 默认选择"全部"
      selectedProjectType.value = ''
      // 自动加载实例列表，传空字符串获取所有实例
      await loadInstances('')
    } else {
      console.error('获取项目类型失败:', response.message)
      projectTypes.value = []
    }
  } catch (error) {
    console.error('获取项目类型失败:', error)
    projectTypes.value = []
  } finally {
    loadingTypes.value = false
  }
}

/**
 * 加载实例列表
 * 根据指定的项目类型ID获取实例列表
 * 
 * @async
 * @function loadInstances
 * @param {string|null} pixelTwinId - 项目类型ID，为null时使用当前选中的项目类型
 * @param {boolean} showLoading - 是否显示加载状态，默认为true
 */
const loadInstances = async (pixelTwinId = null, showLoading = true) => {
  // 如果没有传入pixelTwinId参数，使用当前选中的项目类型
  const targetPixelTwinId = pixelTwinId !== null ? pixelTwinId : selectedProjectType.value
  
  // 只有在需要显示加载状态时才设置loading
  if (showLoading) {
    loadingInstances.value = true
  }
  
  try {
    const response = await api.instance.getInstanceList({
      data: {
        pixelTwinId: targetPixelTwinId,
        page: 1,
        pageSize: 100
      }
    })
    if (response.code == 200) {
      instances.value = (response.data?.list || []).map(instance => ({
        ...instance,
        destroying: false
      }))
      totalCount.value = response.data?.total || 0
    } else {
      console.error('获取实例列表失败:', response.message)
      instances.value = []
    }
  } catch (error) {
    console.error('获取实例列表失败:', error)
    instances.value = []
  } finally {
    // 只有在显示了加载状态时才重置loading
    if (showLoading) {
      loadingInstances.value = false
    }
  }
}

/**
 * 项目类型变化处理
 * 当用户选择不同的项目类型时，重置页码
 * 
 * @function onProjectTypeChange
 */
const onProjectTypeChange = () => {
  currentPage.value = 1
}

/**
 * 启动定时器
 * 每5秒自动刷新实例数据以显示实时状态
 * 
 * @function startRefreshTimer
 */
const startRefreshTimer = () => {
  // 清除现有定时器
  stopRefreshTimer()
  
  // 设置新的定时器，每5秒执行一次
  refreshTimer = setInterval(() => {
    // 只有在选中了项目类型且不在加载状态时才刷新
    if (selectedProjectType.value !== null && !loadingInstances.value) {
      // 自动刷新时不显示加载状态，实现无感刷新
      loadInstances(null, false)
    }
  }, 5000)
}

/**
 * 停止定时器
 * 清除定时器引用，释放资源
 * 
 * @function stopRefreshTimer
 */
const stopRefreshTimer = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}



/**
 * 销毁实例
 * 显示确认对话框后销毁指定的实例
 * 
 * @async
 * @function destroyInstance
 * @param {Object} instance - 要销毁的实例对象
 * @param {string} instance.id - 实例ID
 * @param {string} instance.pixelTwinId - 项目ID
 */
const destroyInstance = async (instance) => {
  const confirmed = await confirmDelete(instance.id, '实例')
  if (!confirmed) return

  instance.destroying = true

  try {
    const response = await api.instance.destroyInstance({
      data: {
        pixelTwinId: instance.pixelTwinId,
        instanceId: instance.id
      }
    })

    if (response.code == 200) {
      // 从列表中移除已销毁的实例
      const index = instances.value.findIndex(i => i.id === instance.id)
      if (index !== -1) {
        instances.value.splice(index, 1)
      }

      showSuccess(`实例 "${instance.id}" 已销毁`)
    } else {
      showError(response.message || '销毁实例失败')
    }
  } catch (error) {
    console.error('销毁实例失败:', error)
    showError('销毁实例失败，请稍后重试')
  } finally {
    instance.destroying = false
  }
}

// ==================== 工具函数 ====================

/**
 * 格式化时间字符串
 * 将ISO时间字符串转换为本地化的时间显示格式
 * 
 * @function formatTime
 * @param {string} timeString - ISO时间字符串
 * @returns {string} 格式化后的时间字符串
 */
const formatTime = (timeString) => {
  if (!timeString) return '未知'
  const date = new Date(timeString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}



// ==================== 响应式监听 ====================

/**
 * 监听项目类型变化
 * 当用户选择不同的项目类型时，自动加载对应的实例列表
 */
watch(selectedProjectType, (newValue) => {
  // 当选择项目类型时加载对应实例，包括"全部"(空字符串)
  loadInstances(newValue)
})

// ==================== 生命周期钩子 ====================

/**
 * 组件挂载时的初始化操作
 * 加载项目类型列表和默认实例数据，并启动定时器
 */
onMounted(() => {
  loadProjectTypes()
  // 启动定时器，每5秒刷新实例数据
  startRefreshTimer()
})

/**
 * 组件卸载时的清理操作
 * 清除定时器，避免内存泄漏
 */
onUnmounted(() => {
  stopRefreshTimer()
})
</script>

<style scoped lang="scss">
.instance-management-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
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

.refresh-btn {
  box-shadow: 0 4px 15px rgba(var(--v-theme-primary), 0.3);
  transition: all 0.3s ease;
  border-radius: 25px;
  text-transform: none;
  font-weight: 600;

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 25px rgba(var(--v-theme-primary), 0.4);
  }
}

.instances-grid {
  .instance-card {
    height: 100%;
    position: relative;
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid rgba(var(--v-theme-surface-variant), 0.2);
    backdrop-filter: blur(5px);
    cursor: pointer;

    &:hover {
      transform: translateY(-6px) scale(1.02);
      box-shadow: 0 15px 35px rgba(var(--v-theme-primary), 0.12) !important;
      border-color: rgba(var(--v-theme-primary), 0.3);
    }

    .instance-title {
      max-width: 200px;
      word-break: break-all;
    }

    .project-info {
      .info-row {
        display: flex;
        align-items: center;
        color: rgba(var(--v-theme-on-surface), 0.6);
      }
    }

    .server-info {
      background: rgba(var(--v-theme-surface-variant), 0.05);
      border-radius: 12px;
      padding: 12px;
      border: 1px solid rgba(var(--v-theme-outline), 0.1);
    }

    .connection-info {
      background: rgba(var(--v-theme-surface-variant), 0.03);
      border-radius: 8px;
      padding: 8px;

      .info-row {
        display: flex;
        align-items: center;
        color: rgba(var(--v-theme-on-surface), 0.6);
        font-size: 0.75rem;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}

// 空状态样式
.text-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

// 对话框样式
.v-dialog .v-card {
  background: rgba(var(--v-theme-surface), 0.98);
  backdrop-filter: blur(10px);
  border-radius: 16px;
}

// 芯片样式
.v-chip {
  font-weight: 500;
  border-radius: 12px;
}

// 列表项样式
.v-list-item {
  border-radius: 8px;
  margin-bottom: 4px;

  &:hover {
    background: rgba(var(--v-theme-primary), 0.05);
  }
}

// 进度条样式
.v-progress-circular {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

// 选择器和输入框样式
.v-select .v-field,
.v-text-field .v-field {
  border-radius: 12px;
}

// 按钮样式
.v-btn {
  text-transform: none;
  font-weight: 500;
  border-radius: 12px;

  &--elevated {
    box-shadow: 0 2px 10px rgba(var(--v-theme-shadow-key-umbra), 0.1);

    &:hover {
      box-shadow: 0 4px 20px rgba(var(--v-theme-shadow-key-umbra), 0.15);
    }
  }
}

// 卡片样式
.v-card {
  box-shadow: 0 4px 20px rgba(var(--v-theme-shadow-key-umbra), 0.1);

  &:hover {
    box-shadow: 0 8px 30px rgba(var(--v-theme-shadow-key-umbra), 0.15);
  }
}

// 响应式设计
@media (max-width: 960px) {
  .instance-management-view {
    padding: 16px;
  }

  .page-header {
    .d-flex {
      flex-direction: column;
      align-items: flex-start !important;
      gap: 16px;
    }

    .refresh-btn {
      align-self: stretch;
    }
  }

  .d-flex.align-center {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;

    .v-chip {
      justify-content: center;
    }
  }
}

@media (max-width: 600px) {
  .instance-management-view {
    padding: 12px;
  }

  .page-header .text-h4 {
    font-size: 1.5rem !important;
  }

  .instance-info {
    padding: 8px !important;

    .info-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }
  }

  .v-card-text {
    padding: 12px !important;
  }

  .v-card-actions {
    padding: 8px 12px !important;
  }
}

// 深色主题适配
.v-theme--dark {
  .instance-card {
    background: rgba(var(--v-theme-surface), 0.95);
    border-color: rgba(var(--v-theme-outline), 0.2);
  }

  .page-header {
    background: rgba(var(--v-theme-surface), 0.95);
    border-color: rgba(var(--v-theme-outline), 0.2);
  }

  .resource-info {
    background: rgba(var(--v-theme-surface-variant), 0.1);
    border-color: rgba(var(--v-theme-outline), 0.15);
  }

  .connection-info {
    background: rgba(var(--v-theme-surface-variant), 0.08);

    .info-row {
      color: rgba(var(--v-theme-on-surface), 0.8);
    }
  }

  .project-info {
    .info-row {
      color: rgba(var(--v-theme-on-surface), 0.7);
    }
  }
}

// 加载状态
.v-btn--loading {
  pointer-events: none;
}
</style>