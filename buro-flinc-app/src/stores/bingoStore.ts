import { defineStore } from 'pinia'
import { ref } from 'vue'
import { bingoAPI } from '../services/api'

export interface BingoSquare {
    id: number
    bingo_card_id: number
    position: number
    text: string
    checked: number
}

export interface BingoCard {
    id: number
    user_id: number
    title: string
    author_name: string
    created_at: string
    squares: BingoSquare[]
}

export const useBingoStore = defineStore('bingo', () => {
    const bingoCards = ref<BingoCard[]>([])
    const myCard = ref<BingoCard | null>(null)
    const isLoading = ref(false)

    const fetchAllCards = async () => {
        try {
            isLoading.value = true
            const data = await bingoAPI.getAllCards()
            bingoCards.value = data
        } catch (error) {
            console.error('Error fetching bingo cards:', error)
        } finally {
            isLoading.value = false
        }
    }

    const fetchMyCard = async () => {
        try {
            const data = await bingoAPI.getMyCard()
            myCard.value = data
        } catch (error) {
            console.error('Error fetching my bingo card:', error)
        }
    }

    const createCard = async (title: string, squares: string[]) => {
        try {
            isLoading.value = true
            const card = await bingoAPI.createCard(title, squares)
            myCard.value = card
            // Refresh all cards
            await fetchAllCards()
            return card
        } catch (error) {
            console.error('Error creating bingo card:', error)
            throw error
        } finally {
            isLoading.value = false
        }
    }

    const toggleSquare = async (cardId: number, squareId: number) => {
        try {
            const result = await bingoAPI.toggleSquare(cardId, squareId)

            // Update local state
            if (myCard.value && myCard.value.id === cardId) {
                const square = myCard.value.squares.find(s => s.id === squareId)
                if (square) {
                    square.checked = result.checked
                }
            }

            // Also update in cards list
            const card = bingoCards.value.find(c => c.id === cardId)
            if (card) {
                const square = card.squares.find(s => s.id === squareId)
                if (square) {
                    square.checked = result.checked
                }
            }
        } catch (error) {
            console.error('Error toggling square:', error)
            throw error
        }
    }

    return {
        bingoCards,
        myCard,
        isLoading,
        fetchAllCards,
        fetchMyCard,
        createCard,
        toggleSquare,
    }
})

