<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { story, KILL_LINE, getRiskHint, type StoryChoice } from '../game/story'
import { getIdentity } from '../game/identity'
import { getMemory, saveMemory, analyzeRun, getMemoryText, getRunCount } from '../game/memory'

const router = useRouter()

const currentIndex = ref(0)
const risk = ref(0)
const survival = ref(2)
const meaning = ref(3)
const showHint = ref(false)
const identityId = ref('')
const choiceHistory = ref<Array<{ survivalDelta: number, meaningDelta: number }>>([])
const runCount = ref(0)

const preventZoom = (e: TouchEvent) => {
  if (e.touches.length > 1) {
    e.preventDefault()
  }
}

const preventDefaultTouch = (e: TouchEvent) => {
  e.preventDefault()
}

const currentNode = ref(story[0])

const makeChoice = (choice: StoryChoice) => {
  const identity = getIdentity(identityId.value)
  if (!identity) return
  
  // 应用身份修饰符
  const modifiedRisk = choice.risk * identity.riskSensitivity
  risk.value += modifiedRisk
  survival.value += choice.survival
  meaning.value += choice.meaning * identity.meaningGain
  
  // 记录选择
  choiceHistory.value.push({
    survivalDelta: choice.survival,
    meaningDelta: choice.meaning
  })
  
  // 检查斩杀线（考虑容忍度）
  if (risk.value >= KILL_LINE + identity.tolerance) {
    finishGame()
    return
  }
  
  showHint.value = true
  
  setTimeout(() => {
    showHint.value = false
    currentIndex.value++
    
    if (currentIndex.value >= story.length) {
      finishGame()
    } else {
      currentNode.value = story[currentIndex.value]
    }
  }, 2000)
}

const finishGame = () => {
  // 分析本局并更新记忆
  const memory = getMemory()
  const flags = analyzeRun(risk.value, survival.value, meaning.value, choiceHistory.value)
  
  saveMemory({
    runCount: memory.runCount + 1,
    flags: [...new Set([...memory.flags, ...flags])],
    lastIdentity: identityId.value,
    lastRisk: risk.value,
    lastSurvival: survival.value,
    lastMeaning: meaning.value
  })
  
  router.push(`/result?risk=${risk.value}&survival=${survival.value}&meaning=${meaning.value}&identity=${identityId.value}`)
}

onMounted(() => {
  // 获取身份
  const storedIdentity = localStorage.getItem('selectedIdentity')
  if (!storedIdentity) {
    router.push('/identity')
    return
  }
  identityId.value = storedIdentity
  
  // 获取周目数
  runCount.value = getRunCount()
  
  document.addEventListener('gesturestart', preventDefaultTouch as any)
  document.addEventListener('gesturechange', preventDefaultTouch as any)
  document.addEventListener('gestureend', preventDefaultTouch as any)
  document.addEventListener('touchmove', preventZoom, { passive: false })
  
  document.body.style.overflow = 'hidden'
  document.documentElement.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.removeEventListener('gesturestart', preventDefaultTouch as any)
  document.removeEventListener('gesturechange', preventDefaultTouch as any)
  document.removeEventListener('gestureend', preventDefaultTouch as any)
  document.removeEventListener('touchmove', preventZoom)
  
  document.body.style.overflow = ''
  document.documentElement.style.overflow = ''
})
</script>

<template>
  <div class="game-container">
    <div class="game-content">
      <div v-if="!showHint" class="story-section">
        <div class="node-text">
          {{ currentNode.text }}
          <div v-if="runCount > 0 && getMemoryText(currentNode.id)" class="memory-hint">
            {{ getMemoryText(currentNode.id) }}
          </div>
        </div>
        
        <div class="choices">
          <button 
            v-for="(choice, index) in currentNode.choices" 
            :key="index"
            class="choice-button"
            @click="makeChoice(choice)"
          >
            {{ choice.text }}
          </button>
        </div>
      </div>
      
      <div v-else class="hint-section">
        <div class="hint-text">{{ getRiskHint(risk) }}</div>
      </div>
      
      <div class="progress-indicator">
        {{ currentIndex + 1 }} / {{ story.length }}
        <span v-if="runCount > 0" class="run-count"> · 第{{ runCount + 1 }}次</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background: #0f0f0f;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
}

.game-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  position: relative;
}

.story-section {
  max-width: 600px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.node-text {
  font-size: 18px;
  line-height: 1.8;
  color: #eaeaea;
  text-align: center;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.choices {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.choice-button {
  padding: 16px 24px;
  font-size: 16px;
  color: #eaeaea;
  background: transparent;
  border: 1px solid #444;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  touch-action: manipulation;
  text-align: left;
}

.choice-button:active {
  background: #1a1a1a;
  border-color: #666;
}

.hint-section {
  max-width: 600px;
  width: 100%;
  text-align: center;
}

.hint-text {
  font-size: 14px;
  color: #888;
  font-style: italic;
  opacity: 0;
  animation: fadeIn 0.5s ease-in forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

.progress-indicator {
  position: absolute;
  bottom: 24px;
  font-size: 12px;
  color: #444;
  letter-spacing: 1px;
}

.memory-hint {
  margin-top: 16px;
  font-size: 12px;
  color: #666;
  font-style: italic;
  opacity: 0.8;
}

.run-count {
  color: #555;
  font-size: 10px;
}

@media (max-width: 768px) {
  .node-text {
    font-size: 16px;
    min-height: 100px;
  }
  
  .choice-button {
    font-size: 14px;
    padding: 14px 20px;
  }
}
</style>
