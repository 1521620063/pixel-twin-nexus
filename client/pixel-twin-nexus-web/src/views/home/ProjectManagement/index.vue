<template>
  <!-- 项目管理页面主容器 -->
  <div class="project-management-view">
    <!-- 页面标题区域 -->
    <v-card class="page-header mb-6" elevation="3">
      <v-card-text class="py-6">
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-avatar size="64" color="primary" class="mr-4">
              <v-icon size="32" color="white">mdi-folder-multiple-outline</v-icon>
            </v-avatar>
            <div>
              <h1 class="text-h4 font-weight-bold mb-1 text-primary">
                项目管理中心
              </h1>
              <p class="text-body-1 text-medium-emphasis mb-0">
                管理和监控 Pixel Twin 项目实例
              </p>
            </div>
          </div>
          <div class="d-flex gap-4">
            <v-btn color="primary" variant="elevated" prepend-icon="mdi-plus" @click="createProject" class="create-btn">
              创建项目
            </v-btn>
            &nbsp;
            <v-btn color="info" variant="outlined" prepend-icon="mdi-refresh" @click="refreshProjects"
              :loading="loading" class="refresh-btn">
              刷新列表
            </v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- 搜索和筛选区域 -->
    <v-card class="filter-section mb-6" elevation="2">
      <v-card-text class="py-4">
        <v-row align="center">
          <v-col cols="12" md="6">
            <v-text-field v-model="searchQuery" label="搜索项目名称" prepend-inner-icon="mdi-magnify" variant="outlined"
              density="compact" clearable  @click:clear="handleSearch" @input="handleSearch"></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-select v-model="pageSize" :items="pageSizeOptions" label="每页显示"
              prepend-inner-icon="mdi-format-list-numbered" variant="outlined" density="compact"
              ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <div class="text-body-2 text-medium-emphasis text-center">
              共 {{ totalItems }} 个项目
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 项目列表 -->
    <v-card elevation="2">
      <v-data-table-server v-model:items-per-page="pageSize" v-model:page="currentPage" :headers="responsiveHeaders"
        :items="projects" :items-length="totalItems" :loading="loading" class="project-table"
        @update:options="loadProjects" :mobile-breakpoint="0">
        <template v-slot:item.pixelTwinName="{ item }">
          <div class="d-flex align-center">
            <v-avatar size="32" color="primary" class="mr-3">
              <v-icon size="16" color="white">mdi-cube-outline</v-icon>
            </v-avatar>
            <div class="flex-grow-1">
              <div class="font-weight-bold">{{ item.pixelTwinName }}</div>
              <div class="d-flex align-center text-caption text-medium-emphasis">
                <span class="mr-2">ID: {{ item.pixelTwinId }}</span>
                <v-btn
                  icon="mdi-content-copy"
                  variant="text"
                  size="x-small"
                  color="primary"
                  @click.stop="copyProjectId(item.pixelTwinId)"
                  class="copy-id-btn"
                >
                  <v-icon size="12">mdi-content-copy</v-icon>
                  <v-tooltip activator="parent" location="top">
                    复制项目ID
                  </v-tooltip>
                </v-btn>
              </div>
              
              <!-- 移动端额外信息 -->
              <div v-if="windowWidth < 600" class="mt-2">
                <!-- 服务状态 -->
                <div class="d-flex align-center mb-1">
                  <v-chip
                    :color="item.serviceEnable ? 'success' : 'error'"
                    size="x-small"
                    variant="tonal"
                    class="mr-2"
                  >
                    {{ item.serviceEnable ? '已启用' : '已禁用' }}
                  </v-chip>
                  <span class="text-caption text-medium-emphasis">
                    显存: {{ item.graphicsMemory || '--' }} GB
                  </span>
                </div>
                
                <!-- 部署信息简化显示 -->
                <div class="mobile-deployment-info">
                  <div v-if="item.pixelTwinStartPath" class="d-flex align-center mb-1">
                    <v-icon size="12" color="primary" class="mr-1">mdi-server</v-icon>
                    <span class="text-caption text-primary">信令服务器UE程序已部署</span>
                  </div>
                  <div v-if="item.gpuList && item.gpuList.length > 0" class="d-flex align-center">
                    <v-icon size="12" color="success" class="mr-1">mdi-gpu</v-icon>
                    <span class="text-caption text-success">
                      GPU节点: {{ item.gpuList.length }}个
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <template v-slot:item.pixelTwinStartPath="{ item }">
          <div class="deployment-servers">
            <!-- 信令服务器 -->
            <div v-if="item.pixelTwinStartPath" class="mb-2">
              <div class="d-flex align-center mb-1">
                <v-icon size="14" color="primary" class="mr-1">mdi-server</v-icon>
                <span class="text-caption font-weight-bold text-primary">信令服务器UE程序</span>
              </div>
              <v-tooltip location="top" max-width="500">
                <template v-slot:activator="{ props }">
                  <v-chip
                    v-bind="props"
                    color="primary"
                    size="small"
                    variant="tonal"
                    class="text-truncate cursor-pointer"
                    style="max-width: 280px;"
                  >
                    <v-icon size="12" class="mr-1">mdi-folder-outline</v-icon>
                    {{ getServerPathDisplay(item.pixelTwinStartPath) }}
                  </v-chip>
                </template>
                <div class="server-path-tooltip">
                  <div class="text-subtitle-2 mb-1 font-weight-bold text-primary">完整路径：</div>
                  <div class="text-body-2">{{ item.pixelTwinStartPath }}</div>
                </div>
              </v-tooltip>
            </div>
            <div v-else class="mb-2">
              <div class="d-flex align-center mb-1">
                <v-icon size="14" color="warning" class="mr-1">mdi-server-off</v-icon>
                <span class="text-caption font-weight-bold text-warning">信令服务器UE程序</span>
              </div>
              <v-chip color="warning" size="small" variant="tonal">
                <v-icon size="12" class="mr-1">mdi-close-circle-outline</v-icon>
                未部署
              </v-chip>
            </div>
            
            <!-- GPU服务器列表 -->
            <div v-if="item.gpuList && item.gpuList.length > 0">
              <div class="d-flex align-center mb-1">
                <v-icon size="14" color="success" class="mr-1">mdi-gpu</v-icon>
                <span class="text-caption font-weight-bold text-success">GPU服务器节点</span>
                <v-chip
                  color="success"
                  size="x-small"
                  variant="text"
                  class="ml-1"
                >
                  {{ item.gpuList.length }}
                </v-chip>
              </div>
              <div class="d-flex flex-wrap gap-1">
                <v-chip
                  v-for="(gpu, index) in item.gpuList.slice(0, 2)"
                  :key="index"
                  color="success"
                  size="small"
                  variant="tonal"
                  class="gpu-chip"
                >
                  <v-icon size="12" class="mr-1">mdi-ip-network</v-icon>
                  {{ gpu }}
                </v-chip>
                <v-tooltip v-if="item.gpuList.length > 2" location="top" max-width="300">
                  <template v-slot:activator="{ props }">
                    <v-chip
                      v-bind="props"
                      color="success"
                      size="small"
                      variant="outlined"
                      class="cursor-pointer"
                    >
                      +{{ item.gpuList.length - 2 }}
                    </v-chip>
                  </template>
                  <div class="gpu-list-tooltip">
                    <div class="text-subtitle-2 mb-2 font-weight-bold text-success">所有GPU服务器：</div>
                    <div v-for="(gpu, index) in item.gpuList" :key="index" class="mb-1">
                      <div class="d-flex align-center">
                        <v-icon size="12" color="success" class="mr-1">mdi-ip-network</v-icon>
                        <span class="text-body-2">{{ gpu }}</span>
                      </div>
                    </div>
                  </div>
                </v-tooltip>
              </div>
            </div>
          </div>
        </template>

        <template v-slot:item.pixelTwinArgs="{ item }">
          <div v-if="item.pixelTwinArgs && item.pixelTwinArgs.length > 0">
            <v-tooltip location="top" max-width="400">
              <template v-slot:activator="{ props }">
                <v-chip 
                  v-bind="props"
                  color="info" 
                  size="small" 
                  variant="tonal"
                  class="cursor-pointer"
                >
                  {{ item.pixelTwinArgs.length }} 个参数
                </v-chip>
              </template>
              <div class="args-tooltip">
                <div class="text-subtitle-2 mb-2 font-weight-bold">启动参数详情：</div>
                <div v-for="(arg, index) in item.pixelTwinArgs" :key="index" class="mb-1">
                  <div class="d-flex align-center">
                    <v-icon size="12" color="primary" class="mr-1">mdi-chevron-right</v-icon>
                    <span class="font-weight-medium text-primary">{{ arg.key }}</span>
                    <span v-if="arg.value" class="ml-1 text-medium-emphasis">: {{ arg.value }}</span>
                  </div>
                  <div v-if="getArgDescription(arg.key)" class="text-caption text-medium-emphasis ml-4">
                    {{ getArgDescription(arg.key) }}
                  </div>
                </div>
              </div>
            </v-tooltip>
          </div>
          <span v-else class="text-medium-emphasis">无参数</span>
        </template>



        <template v-slot:item.graphicsMemory="{ item }">
          <div class="d-flex align-center">
            <v-icon size="16" color="info" class="mr-1">mdi-memory</v-icon>
            <span class="text-body-2 font-weight-medium">{{ item.graphicsMemory || '--' }} GB</span>
          </div>
        </template>

        <template v-slot:item.serviceEnable="{ item }">
          <v-chip
            :color="item.serviceEnable ? 'success' : 'error'"
            size="small"
            variant="tonal"
          >
            {{ item.serviceEnable ? '已启用' : '已禁用' }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <div class="d-flex" :class="windowWidth < 600 ? 'flex-column gap-1' : 'gap-1'">
            <!-- 移动端：垂直排列，更紧凑 -->
            <template v-if="windowWidth < 600">
              <div class="d-flex gap-1">
                <v-btn
                  :icon="item.serviceEnable ? 'mdi-pause' : 'mdi-play'"
                  variant="text"
                  size="x-small"
                  :color="item.serviceEnable ? 'warning' : 'success'"
                  @click="toggleServiceStatus(item)"
                >
                  <v-icon size="14">{{ item.serviceEnable ? 'mdi-pause' : 'mdi-play' }}</v-icon>
                </v-btn>
                <v-btn icon="mdi-monitor" variant="text" size="x-small" color="info" @click="previewProject(item)">
                  <v-icon size="14">mdi-monitor</v-icon>
                </v-btn>
              </div>
              <div class="d-flex gap-1">
                <v-btn icon="mdi-pencil" variant="text" size="x-small" color="primary" @click="editProject(item)">
                  <v-icon size="14">mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon="mdi-delete" variant="text" size="x-small" color="error" @click="deleteProject(item)">
                  <v-icon size="14">mdi-delete</v-icon>
                </v-btn>
              </div>
            </template>
            
            <!-- 桌面端：水平排列 -->
            <template v-else>
              <v-btn
                :icon="item.serviceEnable ? 'mdi-pause' : 'mdi-play'"
                variant="text"
                size="small"
                :color="item.serviceEnable ? 'warning' : 'success'"
                @click="toggleServiceStatus(item)"
              >
                <v-icon>{{ item.serviceEnable ? 'mdi-pause' : 'mdi-play' }}</v-icon>
                <v-tooltip activator="parent" location="top">{{ item.serviceEnable ? '禁用服务' : '启用服务' }}</v-tooltip>
              </v-btn>
              <v-btn icon="mdi-monitor" variant="text" size="small" color="info" @click="previewProject(item)">
                <v-icon>mdi-monitor</v-icon>
                <v-tooltip activator="parent" location="top">预览项目</v-tooltip>
              </v-btn>
              <v-btn icon="mdi-pencil" variant="text" size="small" color="primary" @click="editProject(item)">
                <v-icon>mdi-pencil</v-icon>
                <v-tooltip activator="parent" location="top">编辑项目</v-tooltip>
              </v-btn>
              <v-btn icon="mdi-delete" variant="text" size="small" color="error" @click="deleteProject(item)">
                <v-icon>mdi-delete</v-icon>
                <v-tooltip activator="parent" location="top">删除项目</v-tooltip>
              </v-btn>
            </template>
          </div>
        </template>

        <template v-slot:no-data>
          <div class="text-center py-8">
            <v-avatar size="80" color="grey-lighten-2" class="mb-4">
              <v-icon size="40" color="grey">mdi-folder-open-outline</v-icon>
            </v-avatar>
            <h3 class="text-h6 mb-2">暂无项目</h3>
            <p class="text-body-2 text-medium-emphasis mb-4">
              {{ searchQuery ? '没有找到匹配的项目' : '还没有创建任何项目' }}
            </p>
            <v-btn v-if="!searchQuery" color="primary" variant="elevated" prepend-icon="mdi-plus"
              @click="createProject">
              创建第一个项目
            </v-btn>
          </div>
        </template>
      </v-data-table-server>
    </v-card>

    <!-- 项目表单对话框 -->
    <ProjectFormDialog
      v-model="showProjectDialog"
      :edit-data="editingProject"
      @success="handleProjectSuccess"
    />


  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, onMounted as onMountedVue, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api'
import { useConfirm } from '@/composables/useConfirm'
import { useSnackbar } from '@/composables/useSnackbar'
import ProjectFormDialog from './components/ProjectFormDialog.vue'

const router = useRouter()
const { confirmDelete, confirmToggleStatus, confirm } = useConfirm()
const { showSuccess, showError, showInfo } = useSnackbar()

// 响应式数据
const loading = ref(false)
const projects = ref([])
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)
const windowWidth = ref(window.innerWidth)

// 对话框相关
const showProjectDialog = ref(false)
const editingProject = ref(null)

// 分页选项
const pageSizeOptions = [
  { title: '10 条/页', value: 10 },
  { title: '20 条/页', value: 20 },
  { title: '50 条/页', value: 50 },
  { title: '100 条/页', value: 100 }
]

// 表格头部
const tableHeaders = [
  { title: '项目名称', key: 'pixelTwinName', sortable: false, width: '220px' },
  { title: '部署服务器', key: 'pixelTwinStartPath', sortable: false, width: '380px' },
  { title: '启动参数', key: 'pixelTwinArgs', sortable: false, width: '120px' },
  { title: '显存大小', key: 'graphicsMemory', sortable: false, width: '100px' },
  { title: '服务状态', key: 'serviceEnable', sortable: false, width: '100px' },
  { title: '操作', key: 'actions', sortable: false, width: '250px' }
]

// 响应式表格头部
const responsiveHeaders = computed(() => {
  const screenWidth = windowWidth.value
  
  if (screenWidth < 600) {
    // 移动端：只显示项目名称和操作
    return [
      { title: '项目信息', key: 'pixelTwinName', sortable: false },
      { title: '操作', key: 'actions', sortable: false, width: '120px' }
    ]
  } else if (screenWidth < 960) {
    // 平板端：显示核心信息
    return [
      { title: '项目名称', key: 'pixelTwinName', sortable: false, width: '200px' },
      { title: '部署服务器', key: 'pixelTwinStartPath', sortable: false, width: '280px' },
      { title: '状态', key: 'serviceEnable', sortable: false, width: '80px' },
      { title: '操作', key: 'actions', sortable: false, width: '180px' }
    ]
  } else {
    // 桌面端：显示所有列
    return tableHeaders
  }
})

// 窗口大小监听
const handleResize = () => {
  windowWidth.value = window.innerWidth
}

// 生命周期
onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})



// 加载项目列表
const loadProjects = async (options = {}) => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      search: searchQuery.value || ''
    }
    const response = await api.project.getProjectList({ data: params })

    if (response.code === 200) {
      projects.value = response.data.list || []
      totalItems.value = response.data.total || 0
    } else {
      throw new Error(response.message || '获取项目列表失败')
    }
  } catch (error) {
    console.error('加载项目列表失败:', error)
    showError(error.message || '加载项目列表失败')
    projects.value = []
    totalItems.value = 0
  } finally {
    loading.value = false
  }
}

// 刷新项目列表
const refreshProjects = () => {
  currentPage.value = 1
  loadProjects()
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  loadProjects()
}

// 创建项目
const createProject = () => {
  editingProject.value = null
  showProjectDialog.value = true
}

// 复制项目ID
const copyProjectId = async (pixelTwinId) => {
  try {
    await navigator.clipboard.writeText(pixelTwinId)
    showSuccess('项目ID已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)
    showError('复制失败，请手动复制')
  }
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
    '-PixelStreamingWebRTCFps': '设置WebRTC帧率，范围24-120fps，影响流传输的流畅度'
  }
  return descriptions[argKey] || ''
}

// 获取服务器路径显示文本
const getServerPathDisplay = (path) => {
  if (!path) return ''
  // 提取文件名或最后一段路径
  const parts = path.split(/[\\/]/)
  const fileName = parts[parts.length - 1]
  const parentDir = parts[parts.length - 2]
  
  if (fileName && parentDir) {
    return `${parentDir}/${fileName}`
  }
  return fileName || path
}

// 预览项目
const previewProject = async (project) => {
  const defaultServerUrl = `ws://${location.hostname}:3000/pixel-twin-player?pixelTwinId=${project.pixelTwinId}`
  
  const confirmed = await confirm({
    title: '预览项目',
    subtitle: project.pixelTwinName,
    content: `
      <div style="margin-bottom: 16px;">
        <p style="margin-bottom: 12px; color: rgb(var(--v-theme-on-surface));">请确认或修改WebSocket连接地址后开始预览项目</p>
        <div style="margin-bottom: 12px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 500; color: rgb(var(--v-theme-on-surface));">WebSocket连接地址:</label>
          <input 
            id="preview-server-url" 
            type="text" 
            value="${defaultServerUrl}"
            style="
              width: 100%; 
              padding: 12px; 
              border: 1px solid rgba(var(--v-theme-outline), 0.38);
              border-radius: 8px;
              font-size: 14px;
              background: rgb(var(--v-theme-surface));
              color: rgb(var(--v-theme-on-surface));
              font-family: inherit;
            "
            placeholder="ws://host:port/path?pixelTwinId=xxx"
          />
        </div>
        <p style="font-size: 12px; color: rgba(var(--v-theme-on-surface), 0.6); margin: 0;">
          <strong>提示:</strong> 确保服务器地址正确且服务已启动
        </p>
      </div>
    `,
    icon: 'mdi-monitor',
    iconColor: 'info',
    confirmText: '开始预览',
    cancelText: '取消',
    confirmColor: 'info',
    confirmIcon: 'mdi-monitor'
  })
  
  if (confirmed) {
    try {
      // 获取用户输入的服务器地址
      const inputElement = document.getElementById('preview-server-url')
      const serverUrl = inputElement ? inputElement.value.trim() : defaultServerUrl
      
      // 验证WebSocket地址格式
      if (!serverUrl) {
        showError('请输入WebSocket连接地址')
        return
      }
      
      if (!serverUrl.startsWith('ws://') && !serverUrl.startsWith('wss://')) {
        showError('WebSocket地址必须以 ws:// 或 wss:// 开头')
        return
      }
      
      // 构建预览URL
      const url = router.resolve({
        name: 'webrtc-player',
        query: { server_url: serverUrl }
      }).href
      
      // 打开新窗口
      const newWindow = window.open(url, '_blank')
      
      if (newWindow) {
        showSuccess('预览窗口已打开')
      } else {
        showError('无法打开预览窗口，请检查浏览器弹窗设置')
      }
    } catch (error) {
      console.error('预览失败:', error)
      showError('预览失败，请稍后重试')
    }
  }
}

// 编辑项目
const editProject = (project) => {
  editingProject.value = { ...project }
  showProjectDialog.value = true
}

// 删除项目
const deleteProject = async (project) => {
  const confirmed = await confirmDelete(project.pixelTwinName, '项目')
  if (confirmed) {
    loading.value = true
    try {
      const response = await api.project.deleteProject({
        data: { pixelTwinId: project.pixelTwinId }
      })

      if (response.code === 200) {
        showSuccess(`项目 "${project.pixelTwinName}" 已删除`)
        // 重新加载当前页数据
        await loadProjects()
      } else {
        throw new Error(response.message || '删除项目失败')
      }
    } catch (error) {
      console.error('删除项目失败:', error)
      showError(error.message || '删除项目失败')
    } finally {
      loading.value = false
    }
  }
}

// 切换服务状态
const toggleServiceStatus = async (project) => {
  try {
    const newStatus = !project.serviceEnable
    const action = newStatus ? '启用' : '禁用'
    
    const confirmed = await confirmToggleStatus(project.pixelTwinName, project.serviceEnable, '服务')
    if (confirmed) {
      loading.value = true
      
      // 构建编辑数据，从表格项获取完整数据并更新 serviceEnable
      const editData = {
        ...project,
        serviceEnable: newStatus
      }
      
      // 调用项目编辑接口
      const response = await api.project.editProject({ data: editData })
      
      if (response.code === 200) {
        showSuccess(`项目 "${project.pixelTwinName}" 服务已${action}`)
        // 重新加载数据以确保同步
        await loadProjects()
      } else {
        throw new Error(response.message || `${action}服务失败`)
      }
    }
  } catch (error) {
    console.error('切换服务状态失败:', error)
    showError(error.message || '切换服务状态失败')
  } finally {
    loading.value = false
  }
}

// 处理项目操作成功
const handleProjectSuccess = () => {
  loadProjects()
}

// 生命周期
onMounted(() => {})
</script>

<style scoped lang="scss">
.project-management-view {
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

.create-btn {
  box-shadow: 0 4px 15px rgba(var(--v-theme-primary), 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 25px rgba(var(--v-theme-primary), 0.4);
  }
}

.refresh-btn {
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px) scale(1.02);
  }
}

.filter-section {
  border-radius: 16px;
  border: 1px solid rgba(var(--v-theme-surface-variant), 0.2);
}

.project-table {
  border-radius: 16px;

  :deep(.v-data-table__tr) {
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: rgba(var(--v-theme-primary), 0.05);
    }
  }

  :deep(.v-data-table-header__content) {
    font-weight: 600;
    color: rgb(var(--v-theme-primary));
  }

  :deep(.v-data-table__td) {
    padding: 12px 16px;
  }
}

// 复制按钮样式
.copy-id-btn {
  opacity: 0.7;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
}

// 参数提示框样式
.args-tooltip {
  max-width: 400px;
  padding: 8px;
  
  .text-subtitle-2 {
    color: rgb(var(--v-theme-primary));
    border-bottom: 1px solid rgba(var(--v-theme-primary), 0.2);
    padding-bottom: 4px;
  }
}

// 部署服务器样式
.deployment-servers {
  min-width: 300px;
  
  .gpu-chip {
    transition: all 0.2s ease;
    
    &:hover {
      transform: scale(1.05);
      box-shadow: 0 2px 8px rgba(var(--v-theme-success), 0.3);
    }
  }
}

// 服务器路径提示框样式
.server-path-tooltip {
  max-width: 500px;
  padding: 8px;
  
  .text-subtitle-2 {
    color: rgb(var(--v-theme-primary));
    border-bottom: 1px solid rgba(var(--v-theme-primary), 0.2);
    padding-bottom: 4px;
  }
}

// GPU列表提示框样式
.gpu-list-tooltip {
  max-width: 300px;
  padding: 8px;
  
  .text-subtitle-2 {
    color: rgb(var(--v-theme-success));
    border-bottom: 1px solid rgba(var(--v-theme-success), 0.2);
    padding-bottom: 4px;
  }
}

// 鼠标指针样式
.cursor-pointer {
  cursor: pointer;
}

// 响应式设计
@media (max-width: 768px) {
  .project-management-view {
    padding: 0 8px;
  }

  .page-header {
    .d-flex {
      flex-direction: column;
      align-items: flex-start !important;
      gap: 16px;
    }

    .d-flex.gap-4 {
      align-self: stretch;

      .v-btn {
        flex: 1;
      }
    }
  }

  .page-header .text-h4 {
    font-size: 1.5rem !important;
  }

  .project-table {
    :deep(.v-data-table__td) {
      padding: 8px 12px;
      font-size: 0.875rem;
    }
  }
}

@media (max-width: 600px) {
  .filter-section {
    margin-bottom: 16px;
  }
  
  .v-data-table {
    font-size: 12px;
  }
  
  .v-data-table-header th {
    padding: 8px 4px !important;
    font-size: 11px;
  }
  
  .v-data-table tbody td {
    padding: 8px 4px !important;
    font-size: 12px;
    line-height: 1.2;
  }
  
  .deployment-servers {
    min-width: auto;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    
    .gpu-chip {
      font-size: 10px;
      height: 18px;
      min-height: 18px;
    }
    
    .text-caption {
      font-size: 10px;
    }
  }
  
  .mobile-project-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
  }
  
  .mobile-info-row {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
  }
  
  .v-chip {
    font-size: 10px !important;
    height: 20px !important;
  }
}

@media (max-width: 960px) {
  .v-data-table-header th {
    padding: 10px 6px !important;
  }
  
  .v-data-table tbody td {
    padding: 10px 6px !important;
  }
  
  .deployment-servers {
    min-width: 250px;
    gap: 6px;
    
    .d-flex.flex-wrap {
      gap: 2px;
    }
    
    .gpu-chip {
      font-size: 11px;
      height: 20px;
      min-height: 20px;
    }
    
    .text-caption {
      font-size: 11px;
    }
  }
}


</style>