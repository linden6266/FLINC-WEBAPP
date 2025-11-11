// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Helper function to get token from localStorage
function getToken(): string | null {
    return localStorage.getItem('authToken');
}

// Helper function to set headers with auth token
function getHeaders(includeAuth = true): Record<string, string> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (includeAuth) {
        const token = getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    return headers;
}

// Auth API
export const authAPI = {
    login: async (username: string, password: string) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: getHeaders(false),
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }
        return data;
    },

    register: async (username: string, password: string) => {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
        }
        return data;
    },
};

// Games API
export const gamesAPI = {
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/games`, {
            headers: getHeaders(false),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch games');
        }
        return response.json();
    },

    getById: async (id: number) => {
        const response = await fetch(`${API_BASE_URL}/games/${id}`, {
            headers: getHeaders(false),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch game');
        }
        return response.json();
    },

    create: async (gameData: {
        title: string;
        description?: string;
        category?: string;
        difficulty?: string;
    }) => {
        const response = await fetch(`${API_BASE_URL}/games`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(gameData),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Failed to create game');
        }
        return data;
    },

    update: async (
        id: number,
        gameData: {
            title?: string;
            description?: string;
            category?: string;
            difficulty?: string;
        }
    ) => {
        const response = await fetch(`${API_BASE_URL}/games/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(gameData),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Failed to update game');
        }
        return data;
    },

    delete: async (id: number) => {
        const response = await fetch(`${API_BASE_URL}/games/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Failed to delete game');
        }
        return data;
    },
};

// Engagement API (Likes & Comments)
export const engagementAPI = {
    // Likes
    getLikes: async (newsId: number) => {
        const response = await fetch(`${API_BASE_URL}/engagement/news/${newsId}/likes`, {
            headers: getHeaders(false),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch likes');
        }
        return response.json();
    },

    toggleLike: async (newsId: number) => {
        const response = await fetch(`${API_BASE_URL}/engagement/news/${newsId}/like`, {
            method: 'POST',
            headers: getHeaders(),
        });
        if (!response.ok) {
            throw new Error('Failed to toggle like');
        }
        return response.json();
    },

    // Comments
    getComments: async (newsId: number) => {
        const response = await fetch(`${API_BASE_URL}/engagement/news/${newsId}/comments`, {
            headers: getHeaders(false),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch comments');
        }
        return response.json();
    },

    addComment: async (newsId: number, content: string) => {
        const response = await fetch(`${API_BASE_URL}/engagement/news/${newsId}/comment`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ content }),
        });
        if (!response.ok) {
            throw new Error('Failed to add comment');
        }
        return response.json();
    },

    deleteComment: async (commentId: number) => {
        const response = await fetch(`${API_BASE_URL}/engagement/comments/${commentId}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        if (!response.ok) {
            throw new Error('Failed to delete comment');
        }
        return response.json();
    },
};

// Notifications API
export const notificationsAPI = {
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/notifications`, {
            headers: getHeaders(),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch notifications');
        }
        return response.json();
    },

    markAsRead: async (id: number) => {
        const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
            method: 'PUT',
            headers: getHeaders(),
        });
        if (!response.ok) {
            throw new Error('Failed to mark notification as read');
        }
        return response.json();
    },

    markAllAsRead: async () => {
        const response = await fetch(`${API_BASE_URL}/notifications/mark-all/read`, {
            method: 'PUT',
            headers: getHeaders(),
        });
        if (!response.ok) {
            throw new Error('Failed to mark all notifications as read');
        }
        return response.json();
    },
};

// News API
export const newsAPI = {
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/news`, {
            headers: getHeaders(false),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch news');
        }
        return response.json();
    },

    getById: async (id: number) => {
        const response = await fetch(`${API_BASE_URL}/news/${id}`, {
            headers: getHeaders(false),
        });
        if (!response.ok) {
            throw new Error('Failed to fetch news article');
        }
        return response.json();
    },

    create: async (newsData: {
        title: string;
        content: string;
        category?: string;
    }) => {
        const response = await fetch(`${API_BASE_URL}/news`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(newsData),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Failed to create news');
        }
        return data;
    },

    update: async (
        id: number,
        newsData: {
            title?: string;
            content?: string;
            category?: string;
        }
    ) => {
        const response = await fetch(`${API_BASE_URL}/news/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(newsData),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Failed to update news');
        }
        return data;
    },

    delete: async (id: number) => {
        const response = await fetch(`${API_BASE_URL}/news/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Failed to delete news');
        }
        return data;
    },
};

