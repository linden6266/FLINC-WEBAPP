import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'
import { useUserStore } from './stores/userStore'

console.log('📦 main.ts loading...')

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize user store from localStorage on app load
const userStore = useUserStore()
console.log('📦 Initializing user store...')
userStore.initializeFromLocalStorage()
console.log('📦 User store initialized')

app.mount('#app')
console.log('📦 App mounted to #app')
