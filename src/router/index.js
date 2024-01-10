import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CreateGist from "../views/CreateGist.vue"
import GistDetail from "../views/GistDetail.vue"
import { eq } from "lodash-es"
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
  history: eq(process.env.NODE_ENV, 'development') ? createWebHashHistory() : createWebHistory(),
  routes
})

export default router
