<script setup lang="ts">
import { useRouter } from 'vue-router'
import { identities } from '../game/identity'

const router = useRouter()

const selectIdentity = (id: string) => {
  localStorage.setItem('selectedIdentity', id)
  router.push('/game')
}

const introText = `你并不是从零开始的。

在你做出任何选择之前，
有些东西已经被决定了。

出生的时间、地点、
被看见的方式、
被允许承担的风险。

你无法改变它们。
你只能决定——
在这样的起点上，你要如何活下去。`
</script>

<template>
  <div class="identity-container">
    <div class="identity-content">
      <div class="intro-section">
        <div class="intro-text">{{ introText }}</div>
      </div>

      <div class="selection-prompt">请选择你的起始身份</div>

      <div class="identity-list">
        <div 
          v-for="identity in identities" 
          :key="identity.id"
          class="identity-card"
          @click="selectIdentity(identity.id)"
        >
          <div class="identity-desc">{{ identity.desc }}</div>
          <button class="identity-button">
            {{ identity.id === 'local_stable' ? '从这里开始' : 
               identity.id === 'marginal' ? '接受这个起点' : '承担这种期待' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.identity-container {
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

.identity-content {
  max-width: 600px;
  width: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.intro-section {
  text-align: center;
}

.intro-text {
  font-size: 15px;
  line-height: 2;
  color: #999;
  white-space: pre-line;
  margin-bottom: 24px;
}

.selection-prompt {
  font-size: 14px;
  color: #666;
  text-align: center;
  letter-spacing: 2px;
  padding: 16px 0;
  border-top: 1px solid #222;
  border-bottom: 1px solid #222;
}

.identity-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.identity-card {
  padding: 24px;
  border: 1px solid #333;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.identity-card:active {
  background: #1a1a1a;
  border-color: #444;
}

.identity-desc {
  font-size: 15px;
  line-height: 1.8;
  color: #ccc;
  white-space: pre-line;
  text-align: left;
}

.identity-button {
  align-self: flex-end;
  padding: 10px 24px;
  font-size: 14px;
  color: #888;
  background: transparent;
  border: 1px solid #444;
  border-radius: 2px;
  letter-spacing: 1px;
  transition: all 0.3s ease;
}

.identity-card:active .identity-button {
  color: #aaa;
  border-color: #555;
}

@media (max-width: 768px) {
  .intro-text {
    font-size: 14px;
    line-height: 1.8;
  }
  
  .identity-desc {
    font-size: 14px;
  }
}
</style>
