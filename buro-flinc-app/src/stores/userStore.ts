import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
    const userName = ref('Timo')
    const userRole = ref('Developer')
    const userTeam = ref('Digital Innovation')
    const userAvatar = ref('https://ui-avatars.com/api/?name=Timo+van+der+Linden&background=FF6B35&color=fff')

    const notifications = ref([
        { id: 1, title: 'Nieuw bericht van directie', date: new Date(), read: false },
        { id: 2, title: 'Nieuwe project-update beschikbaar', date: new Date(Date.now() - 3600000), read: false },
        { id: 3, title: 'Quiz van november is live!', date: new Date(Date.now() - 7200000), read: true },
    ])

    const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

    const markAsRead = (id: number) => {
        const notification = notifications.value.find(n => n.id === id)
        if (notification) {
            notification.read = true
        }
    }

    const markAllAsRead = () => {
        notifications.value.forEach(n => n.read = true)
    }

    return {
        userName,
        userRole,
        userTeam,
        userAvatar,
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead
    }
})

