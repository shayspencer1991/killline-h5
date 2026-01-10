<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { worldIntro } from '../game/story'

const router = useRouter()
const showIntro = ref(false)

const viewIntro = () => {
  showIntro.value = true
}

const startGame = () => {
  router.push('/identity')
}
</script>

<template>
  <div class="home-container">
    <div v-if="!showIntro" class="home-content">
      <h1 class="game-title">斩杀线</h1>
      <div class="subtitle">Kill Line</div>
      <button class="start-button" @click="viewIntro">
        进入
      </button>
    </div>

    <div v-else class="intro-content">
      <div class="intro-text">{{ worldIntro }}</div>
      <button class="continue-button" @click="startGame">
        开始记录
      </button>
    </div>
  </div>
</template>

<style scoped>
.home-container {
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
  overflow: hidden;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
}

.home-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.game-title {
  font-size: 48px;
  font-weight: 300;
  color: #eaeaea;
  letter-spacing: 8px;
  margin: 0;
}

.subtitle {
  font-size: 14px;
  color: #666;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.start-button,
.continue-button {
  margin-top: 32px;
  padding: 14px 40px;
  font-size: 16px;
  font-weight: 400;
  color: #eaeaea;
  background: transparent;
  border: 1px solid #444;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  touch-action: manipulation;
  letter-spacing: 2px;
}

.start-button:active,
.continue-button:active {
  background: #1a1a1a;
  border-color: #666;
}

.intro-content {
  max-width: 600px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.intro-text {
  font-size: 16px;
  line-height: 2;
  color: #ccc;
  white-space: pre-line;
  text-align: left;
  margin-bottom: 48px;
}

@media (max-width: 768px) {
  .game-title {
    font-size: 36px;
  }
  
  .intro-text {
    font-size: 14px;
    line-height: 1.8;
  }
}
</style>
