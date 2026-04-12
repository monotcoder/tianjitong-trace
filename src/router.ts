import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/404',
  },
  {
    path: '/404',
    name: 'not-found',
    component: () => import('./pages/NotFound.vue'),
  },
  {
    path: '/:traceCode',
    name: 'trace',
    component: () => import('./pages/Trace.vue'),
    props: true,
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
