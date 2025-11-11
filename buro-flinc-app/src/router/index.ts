import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '../stores/userStore'

const routes: RouteRecordRaw[] = [
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/LoginView.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/',
        name: 'home',
        component: () => import('../views/HomeView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/nieuws',
        name: 'nieuws',
        component: () => import('../views/NieuwsView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/nieuws/:id',
        name: 'nieuws-detail',
        component: () => import('../views/NieuwsDetailView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/chat',
        name: 'chat',
        component: () => import('../views/ChatView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/quiz',
        name: 'quiz',
        component: () => import('../views/spelView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/zoeken',
        name: 'zoeken',
        component: () => import('../views/ZoekenView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/instellingen',
        name: 'instellingen',
        component: () => import('../views/InstellingenView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/admin/events',
        name: 'admin-events',
        component: () => import('../views/AdminEventsView.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/bingo',
        name: 'bingo',
        component: () => import('../views/BingoView.vue'),
        meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

// Route guard to check authentication and authorization
router.beforeEach((to, from, next) => {
    const userStore = useUserStore()

    // Ensure store is initialized from localStorage on page refresh
    if (!userStore.isLoggedIn && localStorage.getItem('authToken')) {
        userStore.initializeFromLocalStorage()
    }

    const isLoggedIn = userStore.isLoggedIn
    const isAdmin = userStore.isAdmin
    const requiresAuth = to.meta.requiresAuth !== false
    const requiresAdmin = (to.meta as any).requiresAdmin === true


    // If trying to access protected route without login
    if (requiresAuth && !isLoggedIn) {
        next('/login')
    }
    // If trying to access admin route without admin privileges
    else if (requiresAdmin && !isAdmin) {
        next('/')
    }
    // If already logged in and trying to access login page, go to home
    else if (to.name === 'login' && isLoggedIn) {
        next('/')
    }
    // Allow navigation
    else {
        next()
    }
})

export default router

