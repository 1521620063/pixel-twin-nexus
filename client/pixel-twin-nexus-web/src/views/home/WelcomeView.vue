<template>
  <!-- 欢迎页面主容器 -->
  <div class="welcome-view">
    <!-- 欢迎横幅区域 -->
    <v-card class="welcome-banner mb-6" elevation="8" rounded="xl">
      <v-card-text class="py-8 py-md-12">
        <v-row align="center" justify="center">
          <v-col cols="12" lg="10" xl="8" class="text-center">
            <div class="welcome-content">
              <v-avatar size="120" color="primary" class="mb-6 welcome-avatar elevation-8">
                <v-icon size="60" color="white">mdi-cube-scan</v-icon>
              </v-avatar>
              <h1 class="welcome-title text-h3 text-md-h2 font-weight-bold mb-4">
                欢迎使用 Pixel Twin Nexus
              </h1>
              <p class="welcome-subtitle text-h6 text-md-h5 text-medium-emphasis mb-6">
                下一代数字孪生和实时流媒体管理平台
              </p>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 信令服务控制区域 -->
    <v-card class="service-control-card mb-6" elevation="6" rounded="xl">
      <v-card-title class="d-flex align-center pa-6">
        <v-icon class="mr-3" color="primary" size="28">mdi-server-network</v-icon>
        <span class="text-h6 font-weight-bold">信令服务控制</span>
        <v-spacer></v-spacer>
        <v-chip :color="serviceStatus.color" variant="tonal" :prepend-icon="serviceStatus.icon"
          class="service-status-chip">
          {{ serviceStatus.text }}
        </v-chip>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pa-6">
        <v-row align="center" justify="center">
          <v-col cols="12" md="6" class="text-center">
            <v-btn v-if="!isServiceRunning" color="success" variant="elevated" size="large" prepend-icon="mdi-play"
              @click="startService" :loading="serviceLoading" class="service-btn" block>
              启动服务
            </v-btn>
            <v-btn v-else color="warning" variant="elevated" size="large" prepend-icon="mdi-pause" @click="stopService"
              :loading="serviceLoading" class="service-btn" block>
              暂停服务
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 数字孪生问答展示区域 -->
    <v-card class="qa-section mb-6" elevation="6" rounded="xl">
      <v-card-title class="d-flex align-center pa-6">
        <v-icon class="mr-3" color="primary" size="28">mdi-help-circle</v-icon>
        <span class="text-h6 font-weight-bold">数字孪生知识问答</span>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="outlined" size="small" prepend-icon="mdi-refresh" >
          刷新问答
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pa-0">
        <v-expansion-panels v-model="expandedPanels" multiple variant="accordion" class="qa-panels">
          <v-expansion-panel v-for="(qa, index) in qaList" :key="index" class="qa-panel">
            <v-expansion-panel-title class="qa-question">
              <div class="d-flex align-center">
                <v-icon class="mr-3" :color="qa.color" size="24">{{ qa.icon }}</v-icon>
                <span class="text-h6 font-weight-medium">{{ qa.question }}</span>
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text class="qa-answer">
              <div class="pa-4">
                <div class="text-body-1 mb-4" v-html="qa.answer"></div>
                <v-row v-if="qa.features" class="mb-4">
                  <v-col cols="12">
                    <div class="text-subtitle-2 font-weight-bold mb-3">主要特点：</div>
                    <v-row>
                      <v-col cols="12" sm="6" md="4" v-for="(feature, fIndex) in qa.features" :key="fIndex">
                        <v-card class="feature-item" variant="tonal" :color="qa.color">
                          <v-card-text class="pa-3">
                            <div class="d-flex align-center">
                              <v-icon class="mr-2" :color="qa.color" size="20">{{ feature.icon }}</v-icon>
                              <div>
                                <div class="text-subtitle-2 font-weight-bold">{{ feature.title }}</div>
                                <div class="text-caption text-medium-emphasis">{{ feature.description }}</div>
                              </div>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
                <v-row v-if="qa.applications" class="mb-4">
                  <v-col cols="12">
                    <div class="text-subtitle-2 font-weight-bold mb-3">应用场景：</div>
                    <div class="d-flex flex-wrap gap-2">
                      <v-chip v-for="(app, aIndex) in qa.applications" :key="aIndex" :color="qa.color"
                        variant="outlined" size="small" class="application-chip">
                        {{ app }}
                      </v-chip>
                    </div>
                  </v-col>
                </v-row>
                <div v-if="qa.learnMore" class="text-center">
                  <v-btn :color="qa.color" variant="outlined" prepend-icon="mdi-open-in-new"
                    @click="openLearnMore(qa.learnMore)">
                    了解更多
                  </v-btn>
                </div>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>






  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api'

const router = useRouter()

// 信令服务相关数据
const isServiceRunning = ref(false)
const serviceLoading = ref(false)
const expandedPanels = ref([0, 1, 2])

// 计算属性
const serviceStatus = computed(() => {
  if (isServiceRunning.value) {
    return {
      text: '运行中',
      color: 'success',
      icon: 'mdi-check-circle'
    }
  } else {
    return {
      text: '已停止',
      color: 'error',
      icon: 'mdi-stop-circle'
    }
  }
})



// 数字孪生问答数据
const qaList = ref([
  {
    question: '什么是数字孪生？',
    answer: '数字孪生（Digital Twin）是物理实体的数字化副本，它通过实时数据连接，能够模拟、监控、诊断和预测物理实体的行为和性能。数字孪生技术结合了物联网、人工智能、机器学习和软件分析等技术，为物理世界和数字世界之间建立了双向的动态连接。',
    icon: 'mdi-cube-scan',
    color: 'primary',
    features: [
      {
        icon: 'mdi-sync',
        title: '实时同步',
        description: '与物理实体保持实时数据同步'
      },
      {
        icon: 'mdi-chart-timeline-variant',
        title: '预测分析',
        description: '基于历史数据进行未来预测'
      },
      {
        icon: 'mdi-monitor-dashboard',
        title: '可视化监控',
        description: '直观的3D可视化界面'
      },
      {
        icon: 'mdi-cog-sync',
        title: '智能优化',
        description: '自动优化系统性能'
      },
      {
        icon: 'mdi-database-sync',
        title: '数据集成',
        description: '整合多源异构数据'
      },
      {
        icon: 'mdi-shield-check',
        title: '安全可靠',
        description: '企业级安全保障'
      }
    ],
    applications: ['智能制造', '智慧城市', '医疗健康', '航空航天', '能源管理', '交通运输'],
    learnMore: 'https://example.com/digital-twin'
  },
  {
    question: '数字孪生能干什么？',
    answer: '数字孪生技术具有广泛的应用价值，主要体现在以下几个方面：<br><br><strong>1. 实时监控与诊断：</strong>通过传感器数据实时监控设备状态，及时发现异常并进行诊断。<br><br><strong>2. 预测性维护：</strong>基于历史数据和机器学习算法，预测设备故障，提前进行维护。<br><br><strong>3. 性能优化：</strong>通过仿真分析找出最优运行参数，提升系统效率。<br><br><strong>4. 风险评估：</strong>模拟各种场景，评估潜在风险并制定应对策略。',
    icon: 'mdi-cog-outline',
    color: 'success',
    features: [
      {
        icon: 'mdi-eye-outline',
        title: '实时监控',
        description: '24/7全天候监控系统状态'
      },
      {
        icon: 'mdi-wrench',
        title: '预测维护',
        description: '提前预警设备故障'
      },
      {
        icon: 'mdi-speedometer',
        title: '性能优化',
        description: '持续优化运行效率'
      },
      {
        icon: 'mdi-shield-alert',
        title: '风险管控',
        description: '识别和控制潜在风险'
      },
      {
        icon: 'mdi-brain',
        title: '智能决策',
        description: 'AI辅助决策支持'
      },
      {
        icon: 'mdi-currency-usd',
        title: '成本节约',
        description: '降低运营和维护成本'
      }
    ],
    applications: ['设备维护', '生产优化', '质量控制', '能耗管理', '安全监控', '流程改进'],
    learnMore: 'https://example.com/digital-twin-applications'
  },
  {
    question: '数字孪生的核心技术有哪些？',
    answer: '数字孪生技术是多种先进技术的融合，主要包括：<br><br><strong>物联网技术：</strong>通过传感器网络收集实时数据<br><strong>云计算：</strong>提供强大的计算和存储能力<br><strong>人工智能：</strong>实现智能分析和决策<br><strong>3D建模：</strong>构建精确的数字化模型<br><strong>仿真技术：</strong>模拟真实世界的行为',
    icon: 'mdi-chip',
    color: 'info',
    features: [
      {
        icon: 'mdi-wifi',
        title: '物联网',
        description: '传感器数据采集'
      },
      {
        icon: 'mdi-cloud',
        title: '云计算',
        description: '弹性计算资源'
      },
      {
        icon: 'mdi-robot',
        title: '人工智能',
        description: '智能算法分析'
      },
      {
        icon: 'mdi-cube-outline',
        title: '3D建模',
        description: '精确数字化建模'
      },
      {
        icon: 'mdi-play-circle',
        title: '仿真技术',
        description: '虚拟环境模拟'
      },
      {
        icon: 'mdi-api',
        title: '系统集成',
        description: '多系统无缝对接'
      }
    ],
    applications: ['技术研发', '系统集成', '平台开发', '算法优化', '数据分析', '架构设计']
  }
])



// 方法

// 获取信令服务状态
const getServiceStatus = async () => {
  try {
    const response = await api.signal.getSignalStatus()
    if (response.code === 200) {
      isServiceRunning.value = response.data.state || false
    }
  } catch (error) {
    console.error('获取服务状态失败:', error)
    isServiceRunning.value = false
  }
}

// 信令服务控制方法
const startService = async () => {
  serviceLoading.value = true
  try {
    const response = await api.signal.signalToggle({ data: { enable: true } })
    if (response.data && response.code === 200) {
      isServiceRunning.value = response.data.state;
    } else {
      throw new Error(response.data?.message || '启动服务失败')
    }
  } catch (error) {
    console.error('启动服务失败:', error)
  } finally {
    serviceLoading.value = false
  }
}

const stopService = async () => {
  serviceLoading.value = true
  try {
    const response = await api.signal.signalToggle({ data: { enable: false } })
    if (response.data && response.code === 200) {
      isServiceRunning.value = response.data.state;
    } else {
      throw new Error(response.data?.message || '停止服务失败')
    }
  } catch (error) {
    console.error('停止服务失败:', error)
  } finally {
    serviceLoading.value = false
  }
}


const openLearnMore = (url) => {
  window.open(url, '_blank')
}

// 生命周期
onMounted(() => {
  // 页面加载时获取服务状态
  getServiceStatus()
})
</script>

<style scoped lang="scss">
.welcome-view {
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.02), rgba(var(--v-theme-secondary), 0.01));
}

.welcome-banner {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.08), rgba(var(--v-theme-secondary), 0.04));
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(var(--v-theme-primary), 0.15) !important;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
    animation: shimmer 4s infinite;
  }
}

/* 信令服务控制卡片样式 */
.service-control-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(var(--v-theme-surface-variant), 0.2);
}

.service-control-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.service-status-chip {
  font-weight: 600;
}

.service-info {
  background: rgba(var(--v-theme-surface-variant), 0.1);
  border-radius: 12px;
  padding: 16px;
}

.service-btn {
  transition: all 0.3s ease;
  font-weight: 600;
}

.service-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

/* 问答展示区域样式 */
.qa-section {
  transition: all 0.3s ease;
  border: 1px solid rgba(var(--v-theme-surface-variant), 0.2);
}

.qa-panels {
  border-radius: 0;
}

.qa-panel {
  margin-bottom: 0;
}

.qa-question {
  background: rgba(var(--v-theme-surface-variant), 0.05);
  transition: all 0.3s ease;
}

.qa-question:hover {
  background: rgba(var(--v-theme-primary), 0.1);
}

.qa-answer {
  background: rgba(var(--v-theme-surface), 0.8);
}

.feature-item {
  transition: all 0.3s ease;
  border-radius: 12px;
}

.feature-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.application-chip {
  margin: 2px;
  transition: all 0.3s ease;
}

.application-chip:hover {
  transform: scale(1.05);
}



@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

.welcome-content {
  position: relative;
  z-index: 1;
}

.welcome-avatar {
  animation: pulse 3s infinite;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
}

@keyframes pulse {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.02);
  }
}

.welcome-title {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.start-btn {
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(var(--v-theme-primary), 0.3);

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 25px rgba(var(--v-theme-primary), 0.4);
  }
}

.feature-card {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(var(--v-theme-surface-variant), 0.2);

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 40px rgba(var(--v-theme-primary), 0.15) !important;
  }

  .feature-icon {
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.1) rotate(5deg);
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
}



// 响应式设计
@media (max-width: 768px) {
  .welcome-banner {
    .welcome-title {
      font-size: 2rem !important;
    }

    .welcome-subtitle {
      font-size: 1.1rem !important;
    }
  }
}

@media (max-width: 600px) {
  .welcome-view {
    padding: 0 8px;
  }

  .welcome-banner {
    .welcome-avatar {
      width: 80px !important;
      height: 80px !important;

      .v-icon {
        font-size: 40px !important;
      }
    }

    .welcome-title {
      font-size: 1.75rem !important;
    }
  }
}

.v-theme--dark {
  .welcome-view {
    background: linear-gradient(135deg, rgba(var(--v-theme-surface), 0.95), rgba(var(--v-theme-background), 0.98));
  }

  .welcome-banner {
    background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.08), rgba(var(--v-theme-secondary), 0.04));
    border-left: 4px solid rgba(var(--v-theme-primary), 0.6);
  }

  .service-control-card,
  .qa-section {
    border: 1px solid rgba(var(--v-theme-surface-variant), 0.3);
  }
}

// 响应式优化
@media (max-width: 960px) {
  .welcome-banner {
    padding: 24px !important;
  }
}

@media (max-width: 600px) {
  .welcome-view {
    padding: 12px !important;
  }

  .welcome-banner {
    padding: 16px !important;
  }
}
</style>