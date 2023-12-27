import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CreateGist from "../views/CreateGist.vue"
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/create',
    name: 'create',
    component: CreateGist
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
