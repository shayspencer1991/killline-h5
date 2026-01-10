import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Identity from '../views/Identity.vue'
import Game from '../views/Game.vue'
import Result from '../views/Result.vue'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/identity',
      name: 'identity',
      component: Identity
    },
    {
      path: '/game',
      name: 'game',
      component: Game
    },
    {
      path: '/result',
      name: 'result',
      component: Result
    }
  ]
})

export default router
