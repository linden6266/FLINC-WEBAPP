import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { quizAPI } from '../services/api'

export interface QuizQuestion {
    id: number
    question: string
    options: string[]
    correctAnswer: number
    explanation: string
}

export interface LeaderboardEntry {
    name: string
    team: string
    score: number
    avatar: string
    rank?: number
    completed_at?: string
}

export interface AnswerResult {
    isCorrect: boolean
    selectedAnswer: number
    correctAnswer: number
    explanation: string
    points: number
}

export const useQuizStore = defineStore('quiz', () => {
    const currentQuiz = ref<QuizQuestion[]>([
        {
            id: 1,
            question: 'In welk jaar is Buro Flinc opgericht?',
            options: ['2010', '2012', '2015', '2018'],
            correctAnswer: 1,
            explanation: 'Buro Flinc is opgericht in 2012 en is sindsdien uitgegroeid tot een toonaangevend bureau.'
        },
        {
            id: 2,
            question: 'Wat is een van onze kernwaarden?',
            options: ['Snelheid boven kwaliteit', 'Samenwerking', 'Individueel succes', 'Winstmaximalisatie'],
            correctAnswer: 1,
            explanation: 'Samenwerking is een van onze belangrijkste kernwaarden bij Buro Flinc!'
        },
        {
            id: 3,
            question: 'Hoeveel medewerkers heeft Buro Flinc ongeveer?',
            options: ['25-50', '50-100', '100-150', '150+'],
            correctAnswer: 2,
            explanation: 'Buro Flinc heeft een team van ongeveer 100-150 toegewijde professionals.'
        },
        {
            id: 4,
            question: 'Wat is het BOOST-programma?',
            options: ['Een energiedrankje', 'Een leer- en ontwikkelprogramma', 'Een fitnessapp', 'Een projectmanagementsysteem'],
            correctAnswer: 1,
            explanation: 'BOOST is ons innovatieve leer- en ontwikkelprogramma voor persoonlijke en professionele groei.'
        },
        {
            id: 5,
            question: 'In welke stad is het hoofdkantoor gevestigd?',
            options: ['Amsterdam', 'Rotterdam', 'Utrecht', 'Den Haag'],
            correctAnswer: 2,
            explanation: 'Ons hoofdkantoor is gevestigd in het mooie Utrecht!'
        }
    ])


    const userScore = ref(0)
    const currentQuestionIndex = ref(0)
    const quizCompleted = ref(false)
    const userAnswers = ref<number[]>([])
    const leaderboard = ref<LeaderboardEntry[]>([])
    const hasAttemptedToday = ref(false)
    const isSubmitting = ref(false)
    const lastAnswerResult = ref<AnswerResult | null>(null)
    const showAnswerFeedback = ref(false)

    const currentQuestion = computed(() => currentQuiz.value[currentQuestionIndex.value])
    const totalQuestions = computed(() => currentQuiz.value.length)
    const progress = computed(() => (currentQuestionIndex.value / totalQuestions.value) * 100)

    const answerQuestion = (answerIndex: number) => {
        const current = currentQuestion.value
        if (!current) return

        userAnswers.value.push(answerIndex)

        const isCorrect = answerIndex === current.correctAnswer
        const points = isCorrect ? 20 : 0

        if (isCorrect) {
            userScore.value += points
        }

        // Set feedback for immediate UI response
        lastAnswerResult.value = {
            isCorrect,
            selectedAnswer: answerIndex,
            correctAnswer: current.correctAnswer,
            explanation: current.explanation,
            points
        }
        showAnswerFeedback.value = true

        // Move to next question after feedback delay
        setTimeout(() => {
            showAnswerFeedback.value = false
            lastAnswerResult.value = null

            if (currentQuestionIndex.value < currentQuiz.value.length - 1) {
                currentQuestionIndex.value++
            } else {
                quizCompleted.value = true
                submitScore()
            }
        }, 3000) // Show feedback for 3 seconds
    }

    const resetQuiz = () => {
        userScore.value = 0
        currentQuestionIndex.value = 0
        quizCompleted.value = false
        userAnswers.value = []
        lastAnswerResult.value = null
        showAnswerFeedback.value = false
    }

    const fetchLeaderboard = async () => {
        try {
            const data = await quizAPI.getLeaderboard()
            leaderboard.value = data
        } catch (error) {
            console.error('Error fetching leaderboard:', error)
            // Keep existing leaderboard on error
        }
    }

    const checkAttemptToday = async () => {
        try {
            const data = await quizAPI.checkAttemptToday()
            hasAttemptedToday.value = data.attempted
        } catch (error) {
            console.error('Error checking quiz attempt:', error)
            hasAttemptedToday.value = false
        }
    }

    const submitScore = async () => {
        if (isSubmitting.value) return

        try {
            isSubmitting.value = true
            console.log('Submitting quiz score:', userScore.value)
            const result = await quizAPI.submitScore(userScore.value, totalQuestions.value)
            console.log('Quiz score submitted successfully:', result)

            // Mark user as having attempted today
            hasAttemptedToday.value = true

            // Refresh leaderboard after submission to show updated rankings
            console.log('Refreshing leaderboard...')
            await fetchLeaderboard()
            console.log('Leaderboard refreshed successfully')
        } catch (error: any) {
            console.error('Error submitting score:', error)
            // If submission fails due to already attempted, mark as attempted
            if (error.message && (
                error.message.includes('already attempted') ||
                error.message.includes('once per day') ||
                error.message.includes('You can only attempt')
            )) {
                hasAttemptedToday.value = true
                console.log('User has already attempted quiz today')
            }
        } finally {
            isSubmitting.value = false
        }
    }

    return {
        currentQuiz,
        leaderboard,
        userScore,
        currentQuestionIndex,
        quizCompleted,
        userAnswers,
        currentQuestion,
        totalQuestions,
        progress,
        hasAttemptedToday,
        isSubmitting,
        lastAnswerResult,
        showAnswerFeedback,
        answerQuestion,
        resetQuiz,
        fetchLeaderboard,
        checkAttemptToday,
        submitScore
    }
})

