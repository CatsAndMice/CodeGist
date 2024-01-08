import { createRouter,createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CreateGist from "../views/CreateGist.vue"
import GistDetail from "../views/GistDetail.vue"
const routes = [
  {
    path: '/',
    name: 'homeView',
    meta: { isCache: true },
    component: HomeView
  },
  {
    path: '/create',
    name: 'create',
    component: CreateGist
  },
  {
    path: '/gist-detail',
    name: 'gistDetail',
    component: GistDetail
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router