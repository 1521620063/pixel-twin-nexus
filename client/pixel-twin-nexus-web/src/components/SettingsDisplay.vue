<template>
  <div v-if="initialSettings || (videoEncoderAvgQP !== null && videoEncoderAvgQP !== undefined)"
    class="settings-display">
    <div class="settings-header" @click="toggleExpanded">
      <v-icon size="16" color="white">mdi-cog</v-icon>
      <span>流媒体信息</span>
      <v-btn icon size="x-small" variant="text" @click.stop="toggleExpanded" class="toggle-btn">
        <v-icon size="14" color="white">
          {{ isExpanded ? 'mdi-chevron-down' : 'mdi-chevron-up' }}
        </v-icon>
      </v-btn>
    </div>
    <div v-if="isExpanded" class="settings-content">


      <!-- WebRTC 统计信息 -->
      <div class="settings-section" v-if="webrtcStats && webrtcStats.length > 0">
        <div class="section-title">WebRTC 统计</div>
        <div class="section-items">
          <div v-for="stat in webrtcStats" :key="stat.key" class="setting-item">
            <span class="setting-key">{{ stat.key }}:</span>
            <span class="setting-value" :class="getStatusClass(stat.key, stat.value)">
              {{ stat.value }}
            </span>
          </div>
        </div>
      </div>

      <!-- 实时状态 -->
      <div class="settings-section" v-if="videoEncoderAvgQP !== null && videoEncoderAvgQP !== undefined">
        <!-- <div class="section-title">实时状态</div> -->
        <div class="section-items">
          <div v-if="videoEncoderAvgQP !== null && videoEncoderAvgQP !== undefined" class="setting-item">
            <span class="setting-key">视频编码器平均QP:</span>
            <span class="setting-value" :class="qpQuality?.class"
              :style="{ color: qpQuality?.color, textAlign: 'center' }">
              {{ videoEncoderAvgQP }}
              <br />
              {{ qpQuality?.text }}
            </span>
          </div>
        </div>
      </div>
      <!-- 初始设置 -->
      <div class="settings-section" v-for="(section, key) in initialSettings" :key="key">
        <div class="section-title">{{ key }}</div>
        <div class="section-items">
          <div v-for="(value, settingKey) in section" :key="settingKey" class="setting-item">
            <span class="setting-key">{{ settingKey }}:</span>
            <span class="setting-value">{{ value }}</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Props
const props = defineProps({
  initialSettings: {
    type: Object,
    default: null
  },

  videoEncoderAvgQP: {
    type: [Number, String, null],
    default: null
  },

  webrtcStats: {
    type: Array, //[{"key":"视频帧率","value":"60 FPS"},{"key":"视频分辨率","value":"1920x1080"},{"key":"视频丢包","value":"0"},{"key":"视频接收","value":"13.26 MB"},{"key":"视频抖动","value":"4.0 ms"},{"key":"视频卡顿次数","value":"0"},{"key":"音频丢包","value":"0"},{"key":"音频接收","value":"10.56 KB"},{"key":"音频抖动","value":"4.0 ms"},{"key":"网络延迟","value":"0 ms"},{"key":"可用带宽","value":"0 bps"},{"key":"总接收","value":"5.33 MB"},{"key":"总发送","value":"8.31 KB"},{"key":"DTLS状态","value":"connected"},{"key":"ICE状态","value":"connected"},{"key":"数据通道","value":"open"},{"key":"消息收发","value":"21/8"}]
    default: []
  }
})

// 响应式数据
const isExpanded = ref(true)

// QP质量评估
const qpQuality = computed(() => {
  if (props.videoEncoderAvgQP === null) return null

  const orangeQP = 26
  const redQP = 35
  const qp = props.videoEncoderAvgQP

  if (qp > redQP) {
    return {
      color: '#f44336',
      text: '质量较差',
      level: 'poor',
      class: 'qp-poor'
    }
  } else if (qp > orangeQP) {
    return {
      color: '#ff9800',
      text: '质量一般',
      level: 'medium',
      class: 'qp-medium'
    }
  } else {
    return {
      color: '#4caf50',
      text: '质量清晰',
      level: 'good',
      class: 'qp-good'
    }
  }
})

// 根据统计项目和值获取状态样式类
const getStatusClass = (key, value) => {
  // 帧率相关
  if (key === '视频帧率') {
    const fps = parseInt(value)
    if (fps >= 30) return 'status-active'
    if (fps >= 15) return 'status-warning'
    return 'status-inactive'
  }
  
  // 丢包相关
  if (key.includes('丢包')) {
    const packets = parseInt(value)
    return packets === 0 ? 'status-active' : 'status-inactive'
  }
  
  // 抖动相关
  if (key.includes('抖动')) {
    const jitter = parseFloat(value)
    if (jitter < 10) return 'status-active'
    if (jitter < 50) return 'status-warning'
    return 'status-inactive'
  }
  
  // 延迟相关
  if (key === '网络延迟') {
    const rtt = parseInt(value)
    if (rtt < 50) return 'status-active'
    if (rtt < 150) return 'status-warning'
    return 'status-inactive'
  }
  
  // 卡顿相关
  if (key.includes('卡顿')) {
    const count = parseInt(value)
    if (count === 0) return 'status-active'
    if (count < 5) return 'status-warning'
    return 'status-inactive'
  }
  
  // 重传包相关
  if (key.includes('重传包')) {
    const packets = parseInt(value)
    if (packets === 0) return 'status-active'
    if (packets < 10) return 'status-warning'
    return 'status-inactive'
  }
  
  // 连接状态相关
  if (key === 'DTLS状态' || key === 'ICE状态') {
    return value === 'connected' ? 'status-active' : 'status-inactive'
  }
  
  // 数据通道状态
  if (key === '数据通道') {
    return value === 'open' ? 'status-active' : 'status-inactive'
  }
  
  // 默认无特殊样式
  return ''
}

// 切换展开状态
const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

</script>

<style scoped lang="scss">
// 变量定义
$bg-color: #000;
$overlay-bg: rgba(255, 255, 255, 0.95);
$overlay-bg-hover: rgba(255, 255, 255, 0.95);
$text-primary: #333;
$text-secondary: #666;
$primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
$shadow-primary: 0 8px 25px rgba(102, 126, 234, 0.3);
$shadow-hover: 0 12px 35px rgba(102, 126, 234, 0.4);

// 设置显示区域样式
.settings-display {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  z-index: 100;
  min-width: 280px;
  max-width: 520px;
  max-height: 80vh;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  }

  .settings-header {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.05);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    cursor: pointer;
    user-select: none;

    span {
      color: white;
      font-size: 0.9rem;
      font-weight: 500;
      margin-left: 8px;
      flex: 1;
    }

    .toggle-btn {
      margin-left: auto;
      opacity: 0.7;
      transition: opacity 0.2s ease;

      &:hover {
        opacity: 1;
      }
    }
  }

  .settings-content {
    max-height: 70vh;
    overflow-y: auto;
    padding: 8px 0;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 2px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }

  .settings-section {
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 0;
    }

    .section-title {
      color: #4fc3f7;
      font-size: 0.85rem;
      font-weight: 600;
      padding: 8px 16px 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid rgba(79, 195, 247, 0.2);
      margin-bottom: 8px;
    }

    .section-items {
      padding: 0 16px;
    }

    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      font-size: 0.8rem;

      &:last-child {
        border-bottom: none;
      }

      .setting-key {
        color: rgba(255, 255, 255, 0.8);
        font-weight: 500;
        flex: 1;
        margin-right: 12px;
        word-break: break-word;
      }

      .setting-value {
        color: #81c784;
        font-weight: 600;
        text-align: right;
        max-width: 130px;
        word-break: break-all;
        font-family: 'Consolas', 'Monaco', monospace;

        &.status-active {
          color: #4caf50;
          background: rgba(76, 175, 80, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid rgba(76, 175, 80, 0.3);
        }

        &.status-inactive {
          color: #f44336;
          background: rgba(244, 67, 54, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid rgba(244, 67, 54, 0.3);
        }

        &.status-warning {
          color: #ff9800;
          background: rgba(255, 152, 0, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid rgba(255, 152, 0, 0.3);
        }

        &.qp-good {
          background: rgba(76, 175, 80, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid rgba(76, 175, 80, 0.3);
          font-weight: 700;
        }

        &.qp-medium {
          background: rgba(255, 152, 0, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid rgba(255, 152, 0, 0.3);
          font-weight: 700;
        }

        &.qp-poor {
          background: rgba(244, 67, 54, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid rgba(244, 67, 54, 0.3);
          font-weight: 700;
          animation: pulse-warning 2s infinite;
        }
      }
    }
  }
}

// 动画
@keyframes pulse-warning {

  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.7;
    transform: scale(1.02);
  }
}

// 响应式设计 - 设置显示区域
@media (max-width: 768px) {
  .settings-display {
    bottom: 10px;
    right: 10px;
    min-width: 260px;
    max-width: calc(100vw - 20px);

    .settings-header {
      padding: 10px 12px;

      span {
        font-size: 0.85rem;
      }
    }

    .settings-section {
      .section-title {
        font-size: 0.8rem;
        padding: 6px 12px 3px;
      }

      .section-items {
        padding: 0 12px;
      }

      .setting-item {
        font-size: 0.75rem;

        .setting-value {
          max-width: 100px;
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .settings-display {
    bottom: 5px;
    right: 5px;
    min-width: 240px;

    .settings-header {
      padding: 8px 10px;

      span {
        font-size: 0.8rem;
      }
    }

    .settings-section {
      .setting-item {
        flex-direction: column;
        align-items: flex-start;

        .setting-key {
          margin-right: 0;
          margin-bottom: 2px;
        }

        .setting-value {
          max-width: none;
          text-align: left;
        }
      }
    }
  }
}
</style>