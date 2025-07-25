<template>
  <div class="pixel-twin-player">
    <!-- 播放器容器 -->
    <div class="player-container">

      <!-- 视频播放器 -->
      <div class="video-wrapper">
        <video ref="videoRef" id="video" autoplay playsinline disablePictureInPicture class="video-player"></video>

        <!-- 加载状态 -->
        <div v-if="isLoading" class="loading-overlay">
          <div class="loading-container">
            <v-progress-circular indeterminate color="primary" size="64" width="4"></v-progress-circular>
            <p class="loading-text">{{ loadingText }}</p>
          </div>
        </div>

        <!-- 播放按钮遮罩层 -->
        <div v-if="showPlayButton" class="play-overlay" @click="handleManualPlay">
          <div class="play-button-container">
            <div class="play-button">
              <v-icon size="48" color="white">mdi-play</v-icon>
            </div>
            <p class="play-text">点击播放媒体流</p>
            <p class="play-hint">点击开始播放</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 音频元素 -->
    <audio ref="audioRef" id="audio" autoplay></audio>

    <!-- 设置信息显示组件 -->
    <SettingsDisplay :initialSettings="initialSettings" :videoEncoderAvgQP="videoEncoderAvgQP"
      :webrtcStats="webrtcStats" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSnackbar } from '@/composables/useSnackbar'
import SettingsDisplay from '@/components/SettingsDisplay.vue'
import { PixelTwinSDK, processWebRtcStats } from 'pixel-twin-player'

const PixelTwinPlayer = new PixelTwinSDK()
const route = useRoute()
const { showInfo } = useSnackbar()

// 计算属性
const connectURL = computed(() => route.query.server_url)



// 响应式数据
const videoRef = ref(null)
const audioRef = ref(null)
const showPlayButton = ref(false)
const isLoading = ref(false)
const loadingText = ref('正在连接...')
const isConnecting = ref(false)
const initialSettings = ref(null)
const videoEncoderAvgQP = ref(null)
const webrtcStats = ref(null)

let timer = null;

// 窗口大小变化处理
const handleWindowResize = () => {
  PixelTwinPlayer.resize()
  //改变源媒体流的分辨率（不适合频繁调用）
  // PixelTwinPlayer.setResolutionVideoOutPut()
}

onMounted(() => {
  window.PixelTwinPlayer = PixelTwinPlayer

  // 设置回调函数
  PixelTwinPlayer.setCallbacks({
    onConnected: () => {
      isConnecting.value = false
    },

    onDisconnected: () => {
      isConnecting.value = false
    },

    onPlayBlocked: () => {
      isLoading.value = false
      showPlayButton.value = true
    },

    onPlaySuccess: () => {
      isLoading.value = false;
      getPeerConnectionStats()
      // PixelTwinPlayer.sendDataChannelMessage("'TQXT|11'")
    },

    onError: () => {
      isLoading.value = false
      isConnecting.value = false
    },

    onMessage: (messageInfo) => {
      if (messageInfo.event === 'message') {
        showInfo(messageInfo.message, { location: 'top', timeout: 4000 })
      }
    },

    onInitialSettings: ({ data: { value } }) => {
      let settings = JSON.parse(value);
      //settings 格式为 { "PixelStreaming": { "AllowPixelStreamingCommands": true, "DisableLatencyTest": false }, "Encoder": { "TargetBitrate": -1, "MaxBitrate": 20000000, "MinQP": 0, "MaxQP": 51, "RateControl": "CBR", "FillerData": 0, "MultiPass": "FULL" }, "WebRTC": { "DegradationPref": "MAINTAIN_FRAMERATE", "FPS": 60, "MinBitrate": 100000, "MaxBitrate": 100000000, "LowQP": 25, "HighQP": 37 } }
      initialSettings.value = settings
    },

    onVideoEncoderAvgQP: ({ data: { value } }) => {
      //value 格式为 Number
      videoEncoderAvgQP.value = value
    },
    onWebRTCConfigReceived: () => {
      loadingText.value = '正在协商媒体流...'
    },
    onWebRTCOfferReceived: () => {
      loadingText.value = '正在协商媒体流...'
    },
    onIceCandidateReceived: () => {
      loadingText.value = '正在协商媒体流...'
    },
    onDataChannelOpen: () => {
      loadingText.value = 'WebRTC数据通道开启成功...'
    },
    onVideoTrack: () => {
      loadingText.value = '视频轨道开启成功...'
    },
    onAudioTrack: () => {
      loadingText.value = '音频轨道开启成功...'
    }
  })

  // 设置媒体元素
  PixelTwinPlayer.setVideoElement(videoRef.value)
  PixelTwinPlayer.setAudioElement(audioRef.value)
  // 设置RSA密钥
  PixelTwinPlayer.setRSAKey({
    publicKey: import.meta.env.VITE_RSA_PUBLIC_KEY,
    privateKey: import.meta.env.VITE_RSA_PRIVATE_KEY
  })
  
  // 监听窗口大小变化
  window.addEventListener('resize', handleWindowResize)

  // 自动连接
  if (connectURL.value) {
    handleConnect()
  }
})

onUnmounted(() => {
  clearInterval(timer)
  timer = null;
  PixelTwinPlayer.destroy()

  // 移除事件监听器
  window.removeEventListener('resize', handleWindowResize)
})

// 手动播放处理
const handleManualPlay = async () => {
  PixelTwinPlayer.startPlay()
  showPlayButton.value = false
}

// 连接处理
const handleConnect = async () => {
  if (isConnecting.value) return

  isLoading.value = true
  isConnecting.value = true
  loadingText.value = '正在连接信令服务...'

  try {
    await PixelTwinPlayer.connect(connectURL.value, {
      timeout: 15000,
      maxReconnectAttempts: 5,
      reconnectDelay: 2000
    })
  } catch (error) {console.info(error)
    isLoading.value = false
    isConnecting.value = false
  }
}

const getPeerConnectionStats = async () => {
  timer = setInterval(async () => {
    let stats = await PixelTwinPlayer.getPeerConnectionStats()
    if (stats) {
      webrtcStats.value = processWebRtcStats(stats)
    }
  }, 750);
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

.pixel-twin-player {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: $bg-color;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  overflow: hidden;
}

.player-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: $bg-color;
  overflow: hidden;
}

.video-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  background: $bg-color;
  overflow: hidden;
}

// 视频播放器
.video-player {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
  background: $bg-color;
}

// 加载状态
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: $overlay-bg;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;

  .loading-container {
    text-align: center;
    color: $text-primary;
  }

  .loading-text {
    margin-top: 16px;
    font-size: 1.1rem;
    font-weight: 500;
    color: $text-secondary;
  }
}

// 播放按钮遮罩层
.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 60;
  transition: all 0.3s ease;

  &:hover {
    background: $overlay-bg-hover;

    .play-button-container {
      transform: scale(1.05);
    }
  }

  .play-button-container {
    text-align: center;
    color: $text-primary;
    user-select: none;
    transform: scale(1);
    transition: transform 0.3s ease;
  }

  .play-button {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: $primary-gradient;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
    box-shadow: $shadow-primary;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.1);
      box-shadow: $shadow-hover;
    }
  }

  .play-text {
    font-size: 1.3rem;
    margin: 0 0 8px 0;
    font-weight: 600;
    color: $text-primary;
  }

  .play-hint {
    font-size: 0.95rem;
    margin: 0;
    color: $text-secondary;
    font-weight: 400;
  }
}

// 动画
@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}



@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}



// 响应式设计
@media (max-width: 768px) {
  .play-overlay {
    .play-button {
      width: 60px;
      height: 60px;
    }

    .play-text {
      font-size: 1.1rem;
    }

    .play-hint {
      font-size: 0.85rem;
    }
  }
}

@media (max-width: 480px) {
  .play-overlay {
    .play-button {
      width: 50px;
      height: 50px;
    }

    .play-text {
      font-size: 1rem;
    }
  }
}
</style>