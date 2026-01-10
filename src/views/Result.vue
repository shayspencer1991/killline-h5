<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getEnding, type Ending } from '../game/story'
import { getRunCount } from '../game/memory'

const router = useRouter()
const route = useRoute()

const risk = ref(0)
const survival = ref(0)
const meaning = ref(0)
const identityId = ref('')
const runCount = ref(0)
const ending = ref<Ending>({
  type: 'normal_survival',
  title: '',
  content: '',
  verdict: '',
  survivalTime: 'normal',
  lifeQuality: 'functional'
})

const survivalTimeLabel = computed(() => {
  switch (ending.value.survivalTime) {
    case 'short': return '短暂'
    case 'normal': return '普通'
    case 'long': return '长期'
    case 'stable': return '稳定留存'
    default: return '普通'
  }
})

const lifeQualityLabel = computed(() => {
  switch (ending.value.lifeQuality) {
    case 'broken': return '断裂'
    case 'functional': return '功能性'
    case 'connected': return '有连接'
    case 'coherent': return '高一致性'
    default: return '功能性'
  }
})

const survivalTimeBar = computed(() => {
  const map = { short: 25, normal: 50, long: 75, stable: 100 }
  return map[ending.value.survivalTime] || 50
})

const lifeQualityBar = computed(() => {
  const map = { broken: 25, functional: 50, connected: 75, coherent: 100 }
  return map[ending.value.lifeQuality] || 50
})

onMounted(() => {
  risk.value = Number(route.query.risk) || 0
  survival.value = Number(route.query.survival) || 0
  meaning.value = Number(route.query.meaning) || 0
  identityId.value = String(route.query.identity) || ''
  
  runCount.value = getRunCount()
  
  ending.value = getEnding(risk.value, survival.value, meaning.value, identityId.value)
  
  const history = localStorage.getItem('killLineHistory')
  const historyData = history ? JSON.parse(history) : []
  historyData.push({ 
    risk: risk.value,
    survival: survival.value,
    meaning: meaning.value,
    type: ending.value.type, 
    timestamp: Date.now() 
  })
  localStorage.setItem('killLineHistory', JSON.stringify(historyData.slice(-10)))
})

const playAgain = () => {
  router.push('/identity')
}

const backHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="result-container">
    <div class="result-content">
      <div class="result-header">
        <h1 class="result-title">{{ ending.title }}</h1>
        <div v-if="runCount > 0" class="run-badge">第 {{ runCount }} 次记录</div>
      </div>
      
      <div class="ending-text">{{ ending.content }}</div>
      
      <div class="stats-section">
        <div class="stat-item">
          <div class="stat-label">生存时间</div>
          <div class="stat-bar">
            <div class="stat-fill survival" :style="{ width: survivalTimeBar + '%' }"></div>
          </div>
          <div class="stat-value">{{ survivalTimeLabel }}</div>
        </div>
        
        <div class="stat-item">
          <div class="stat-label">存在质量</div>
          <div class="stat-bar">
            <div class="stat-fill meaning" :style="{ width: lifeQualityBar + '%' }"></div>
          </div>
          <div class="stat-value">{{ lifeQualityLabel }}</div>
        </div>
      </div>
      
      <div class="verdict">{{ ending.verdict }}</div>
      
      <div class="button-group">
        <button class="action-button primary" @click="playAgain">
          🔁 再来一次
        </button>
        <button class="action-button secondary" @click="backHome">
          返回主页
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.result-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f0f0f;
  overflow-y: auto;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
}

.result-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  padding: 24px;
  max-width: 600px;
  width: 100%;
}

.result-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.result-title {
  font-size: 32px;
  font-weight: 300;
  color: #eaeaea;
  letter-spacing: 4px;
  margin: 0;
}

.run-badge {
  font-size: 11px;
  color: #555;
  padding: 4px 12px;
  border: 1px solid #333;
  border-radius: 12px;
  letter-spacing: 1px;
}

.ending-text {
  font-size: 18px;
  line-height: 1.8;
  color: #ccc;
  text-align: center;
  margin-top: 8px;
}

.stats-section {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-label {
  font-size: 12px;
  color: #666;
  letter-spacing: 1px;
}

.stat-bar {
  width: 100%;
  height: 6px;
  background: #1a1a1a;
  border-radius: 3px;
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  transition: width 0.8s ease;
  border-radius: 3px;
}

.stat-fill.survival {
  background: linear-gradient(90deg, #4a5568 0%, #718096 100%);
}

.stat-fill.meaning {
  background: linear-gradient(90deg, #805ad5 0%, #9f7aea 100%);
}

.stat-value {
  font-size: 13px;
  color: #888;
  text-align: right;
}

.verdict {
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-top: 8px;
  padding: 20px 16px;
  border-top: 1px solid #222;
  border-bottom: 1px solid #222;
  width: 100%;
  line-height: 1.6;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 320px;
  margin-top: 16px;
}

.action-button {
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 400;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  touch-action: manipulation;
  letter-spacing: 1px;
}

.action-button.primary {
  color: #eaeaea;
  background: transparent;
  border: 1px solid #444;
}

.action-button.secondary {
  color: #888;
  background: transparent;
  border: 1px solid #333;
}

.action-button:active {
  background: #1a1a1a;
}

@media (max-width: 768px) {
  .result-title {
    font-size: 24px;
  }
  
  .ending-text {
    font-size: 16px;
  }
  
  .verdict {
    font-size: 12px;
  }
  
  .stat-label {
    font-size: 11px;
  }
  
  .stat-value {
    font-size: 12px;
  }
}
</style>
