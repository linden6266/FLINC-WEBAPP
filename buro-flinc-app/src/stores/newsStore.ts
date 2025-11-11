import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface NewsItem {
    id: number
    title: string
    excerpt: string
    content: string
    image: string
    author: string
    date: Date
    category: 'nieuws' | 'success' | 'verjaardag' | 'event'
    likes: number
    comments: Comment[]
    isLiked: boolean
}

export interface Comment {
    id: number
    author: string
    avatar: string
    content: string
    date: Date
}

export const useNewsStore = defineStore('news', () => {
    const newsItems = ref<NewsItem[]>([
        {
            id: 1,
            title: 'BOOST-programma: Nieuwe mijlpaal bereikt! 🚀',
            excerpt: 'Ons innovatieve BOOST-programma heeft een belangrijke mijlpaal bereikt met meer dan 50 deelnemers.',
            content: 'Het BOOST-programma is een groot succes! Met meer dan 50 enthousiaste deelnemers hebben we samen geweldige stappen gezet in persoonlijke en professionele ontwikkeling. De komende maanden staan in het teken van innovatie en samenwerking.',
            image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop',
            author: 'Linda de Vries',
            date: new Date(Date.now() - 86400000),
            category: 'nieuws',
            likes: 24,
            comments: [
                {
                    id: 1,
                    author: 'Mark Jansen',
                    avatar: 'https://ui-avatars.com/api/?name=Mark+Jansen&background=004E89&color=fff',
                    content: 'Super gaaf! Trots om onderdeel te zijn van dit programma!',
                    date: new Date(Date.now() - 43200000)
                }
            ],
            isLiked: false
        },
        {
            id: 2,
            title: 'Klant Succes: Gemeente Amsterdam kiest voor Flinc',
            excerpt: 'We zijn trots om aan te kondigen dat Gemeente Amsterdam onze partner is geworden voor hun digitale transformatie.',
            content: 'Een prachtige samenwerking met Gemeente Amsterdam! We gaan hen helpen bij het moderniseren van hun digitale infrastructuur en het verbeteren van de dienstverlening aan burgers. Dit is een mooie erkenning van ons werk.',
            image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop',
            author: 'Rob Hendriks',
            date: new Date(Date.now() - 172800000),
            category: 'success',
            likes: 42,
            comments: [],
            isLiked: true
        },
        {
            id: 3,
            title: '🎉 Verjaardagen deze week',
            excerpt: 'Deze week vieren we de verjaardagen van Jan (maandag), Fatima (woensdag) en Peter (vrijdag)!',
            content: 'Gefeliciteerd aan al onze jarigen deze week! Jan wordt maandag een jaartje ouder, Fatima viert woensdag haar verjaardag en Peter sluit vrijdag af. Vergeet niet om ze te feliciteren!',
            image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop',
            author: 'HR Team',
            date: new Date(Date.now() - 259200000),
            category: 'verjaardag',
            likes: 18,
            comments: [],
            isLiked: false
        },
        {
            id: 4,
            title: 'Teamuitje Q1 2025: Stem nu op de locatie!',
            excerpt: 'Help mee beslissen waar we het volgende teamuitje houden. Kies uit drie geweldige opties!',
            content: 'Het is weer tijd voor ons traditionele teamuitje! Dit keer laten we jullie meebeslissen. Stemmen kan tot eind volgende week. De opties zijn: 1) Escape room + borrel in Utrecht, 2) High tea + workshop in Amsterdam, 3) Outdoor adventure in Veluwe.',
            image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop',
            author: 'Activiteitencommissie',
            date: new Date(Date.now() - 345600000),
            category: 'event',
            likes: 31,
            comments: [
                {
                    id: 1,
                    author: 'Sarah Bakker',
                    avatar: 'https://ui-avatars.com/api/?name=Sarah+Bakker&background=FF6B35&color=fff',
                    content: 'Escape room klinkt super leuk!',
                    date: new Date(Date.now() - 259200000)
                }
            ],
            isLiked: false
        },
        {
            id: 5,
            title: 'Nieuwe kantooruren en hybride werken',
            excerpt: 'Vanaf volgende maand introduceren we flexibele kantooruren voor nog betere work-life balance.',
            content: 'We luisteren naar jullie feedback! Vanaf volgende maand kunnen jullie kiezen uit flexibele kantooruren tussen 7:00 en 19:00. Ook blijft hybride werken mogelijk met minimaal 2 dagen op kantoor per week voor optimale samenwerking.',
            image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop',
            author: 'Management Team',
            date: new Date(Date.now() - 432000000),
            category: 'nieuws',
            likes: 56,
            comments: [],
            isLiked: true
        }
    ])

    const toggleLike = (id: number) => {
        const item = newsItems.value.find(n => n.id === id)
        if (item) {
            item.isLiked = !item.isLiked
            item.likes += item.isLiked ? 1 : -1
        }
    }

    const addComment = (newsId: number, content: string, author: string) => {
        const item = newsItems.value.find(n => n.id === newsId)
        if (item) {
            item.comments.push({
                id: item.comments.length + 1,
                author,
                avatar: `https://ui-avatars.com/api/?name=${author}&background=004E89&color=fff`,
                content,
                date: new Date()
            })
        }
    }

    const getNewsById = (id: number) => {
        return newsItems.value.find(n => n.id === id)
    }

    return {
        newsItems,
        toggleLike,
        addComment,
        getNewsById
    }
})

