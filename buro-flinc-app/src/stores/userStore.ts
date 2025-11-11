import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { notificationsAPI } from '../services/api'

export const useUserStore = defineStore('user', () => {
    // Authentication state
    const userId = ref<number | null>(null)
    const username = ref('')
    const isAdmin = ref(false)
    const authToken = ref<string | null>(null)

    // User profile state
    const userName = ref('Timo')
    const userRole = ref('Developer')
    const userTeam = ref('Digital Innovation')
    const userAvatar = ref('https://ui-avatars.com/api/?name=Timo+van+der+Linden&background=0EA5E9&color=fff')

    const notifications = ref<any[]>([])

    const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)
    const isLoggedIn = computed(() => !!authToken.value && !!userId.value)

    const markAsRead = (id: number) => {
        const notification = notifications.value.find(n => n.id === id)
        if (notification) {
            notification.read = true
        }
    }

    const markAllAsRead = async () => {
        try {
            await notificationsAPI.markAllAsRead()
            notifications.value.forEach(n => n.read = 1)
        } catch (error) {
            console.error('Error marking all notifications as read:', error)
        }
    }

    const fetchNotifications = async () => {
        try {
            if (isLoggedIn.value) {
                const data = await notificationsAPI.getAll()
                notifications.value = data
            }
        } catch (error) {
            console.error('Error fetching notifications:', error)
        }
    }

    const markNotificationAsRead = async (id: number) => {
        try {
            await notificationsAPI.markAsRead(id)
            const notif = notifications.value.find(n => n.id === id)
            if (notif) {
                notif.read = 1
            }
        } catch (error) {
            console.error('Error marking notification as read:', error)
        }
    }

    // Authentication methods
    const setUser = (user: { id: number; username: string; isAdmin: boolean }) => {
        userId.value = user.id
        username.value = user.username
        isAdmin.value = user.isAdmin
        // Only set authToken if it's not already set
        if (!authToken.value) {
            authToken.value = localStorage.getItem('authToken')
        }

        // Update profile info
        userName.value = user.username
        // Use FLINC gradient colors for avatar
        userAvatar.value = `https://ui-avatars.com/api/?name=${user.username}&background=004E89&color=fff&bold=true`
    }

    const login = (token: string, user: { id: number; username: string; isAdmin: boolean }) => {
        authToken.value = token
        setUser(user)
    }

    const logout = () => {
        userId.value = null
        username.value = ''
        isAdmin.value = false
        authToken.value = null
        userName.value = 'Guest'
        localStorage.removeItem('authToken')
        localStorage.removeItem('userId')
        localStorage.removeItem('username')
        localStorage.removeItem('isAdmin')
    }

    const initializeFromLocalStorage = () => {
        const token = localStorage.getItem('authToken')
        const id = localStorage.getItem('userId')
        const name = localStorage.getItem('username')
        const admin = localStorage.getItem('isAdmin')

        // Only restore if ALL required fields exist
        if (token && id && name) {
            try {
                authToken.value = token
                userId.value = parseInt(id)
                username.value = name
                // Convert string 'true'/'false' to boolean
                isAdmin.value = admin === 'true' || String(admin) === '1'
                userName.value = name
                // Use FLINC gradient colors for avatar
                userAvatar.value = `https://ui-avatars.com/api/?name=${name}&background=004E89&color=fff&bold=true`
                console.log('✅ User session restored:', name, '| isAdmin:', isAdmin.value)
            } catch (error) {
                console.error('Error restoring session:', error)
                logout()
            }
        } else {
            console.log('❌ No valid session found, user is logged out')
            logout()
        }
    }

    return {
        // Authentication
        userId,
        username,
        isAdmin,
        authToken,
        isLoggedIn,

        // Profile
        userName,
        userRole,
        userTeam,
        userAvatar,
        notifications,
        unreadCount,

        // Methods
        markAsRead,
        markAllAsRead,
        fetchNotifications,
        markNotificationAsRead,
        setUser,
        login,
        logout,
        initializeFromLocalStorage
    }
})

