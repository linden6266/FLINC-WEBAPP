import { defineStore } from 'pinia'
import { ref } from 'vue'
import { newsAPI, engagementAPI } from '../services/api'

export interface NewsItem {
    id: number
    title: string
    excerpt?: string
    content: string
    image?: string
    author_name?: string
    author?: string
    date?: Date
    created_at?: string
    category: 'nieuws' | 'success' | 'verjaardag' | 'event'
    likes?: number
    comments?: Comment[]
    isLiked?: boolean
}

export interface Comment {
    id: number
    author: string
    avatar: string
    content: string
    date: Date
}

export const useNewsStore = defineStore('news', () => {
    const newsItems = ref<NewsItem[]>([])
    const isLoading = ref(false)

    const fetchNewsFromAPI = async () => {
        try {
            isLoading.value = true
            const data = await newsAPI.getAll()
            console.log('News data:', data)

            // Transform API data to match NewsItem interface
            newsItems.value = await Promise.all(data.map(async (item: any) => {
                let comments = []
                let likes = 0
                try {
                    comments = await engagementAPI.getComments(item.id)
                    likes = await engagementAPI.getLikes(item.id)
                } catch (error) {
                    console.error(`Error fetching comments for news ${item.id}:`, error)
                }

                return {
                    id: item.id,
                    title: item.title,
                    content: item.content,
                    excerpt: item.content.substring(0, 100) + '...',
                    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop',
                    author_name: item.author_name || 'Onbekend',
                    author: item.author_name || 'Onbekend',
                    created_at: item.created_at,
                    date: new Date(item.created_at),
                    category: item.category || 'nieuws',
                    likes: item.likes_count || 0,
                    comments: comments,
                    isLiked: false
                }
            }))
        } catch (error) {
            console.error('Error fetching news from API:', error)
            // Keep existing items on error
        } finally {
            isLoading.value = false
        }
    }

    const toggleLike = async (id: number) => {
        const item = newsItems.value.find(n => n.id === id)
        if (!item) return

        try {
            // Call API to toggle like in database
            const result = await engagementAPI.toggleLike(id)

            // Update local state
            item.isLiked = result.liked
            item.likes = result.count
            console.log(`✅ Like toggled for news ${id}:`, result)
        } catch (error) {
            console.error(`❌ Error toggling like for news ${id}:`, error)
        }
    }

    const addComment = async (newsId: number, content: string, author: string) => {
        const item = newsItems.value.find(n => n.id === newsId)
        if (!item) return

        try {
            // Call API to add comment to database
            const newComment = await engagementAPI.addComment(newsId, content)
            console.log("New comment:", newComment)
            // Update local state
            if (!item.comments) item.comments = []
            item.comments.push({
                id: newComment.id,
                author: newComment.author_name || author,
                avatar: `https://ui-avatars.com/api/?name=${newComment.author_name || author}&background=004E89&color=fff`,
                content: newComment.content,
                date: new Date(newComment.created_at)
            })
            console.log(`✅ Comment added for news ${newsId}:`, newComment)
        } catch (error) {
            console.error(`❌ Error adding comment for news ${newsId}:`, error)
        }
    }

    const getNewsById = (id: number) => {
        return newsItems.value.find(n => n.id === id)
    }

    return {
        newsItems,
        isLoading,
        fetchNewsFromAPI,
        toggleLike,
        addComment,
        getNewsById
    }
})

