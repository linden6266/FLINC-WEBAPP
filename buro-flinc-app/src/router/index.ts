import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/LoginView.vue')
    },
    {
        path: '/',
        name: 'home',
        component: () => import('../views/HomeView.vue')
    },
    {
        path: '/nieuws',
        name: 'nieuws',
        component: () => import('../views/NieuwsView.vue')
    },
    {
        path: '/nieuws/:id',
        name: 'nieuws-detail',
        component: () => import('../views/NieuwsDetailView.vue')
    },
    {
        path: '/chat',
        name: 'chat',
        component: () => import('../views/ChatView.vue')
    },
    {
        path: '/spel',
        name: 'spel',
        component: () => import('../views/SpelView.vue')
    },
    {
        path: '/zoeken',
        name: 'zoeken',
        component: () => import('../views/ZoekenView.vue')
    },
    {
        path: '/instellingen',
        name: 'instellingen',
        component: () => import('../views/InstellingenView.vue')
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router

