import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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

    const leaderboard = ref<LeaderboardEntry[]>([
        {
            name: 'Emma de Jong',
            team: 'Digital Innovation',
            score: 95,
            avatar: 'https://ui-avatars.com/api/?name=Emma+de+Jong&background=FF6B35&color=fff'
        },
        {
            name: 'Lars Vermeer',
            team: 'Project Management',
            score: 90,
            avatar: 'https://ui-avatars.com/api/?name=Lars+Vermeer&background=004E89&color=fff'
        },
        {
            name: 'Sophie Bakker',
            team: 'Marketing',
            score: 85,
            avatar: 'https://ui-avatars.com/api/?name=Sophie+Bakker&background=FFB81C&color=000'
        },
        {
            name: 'Mike van Dijk',
            team: 'Development',
            score: 80,
            avatar: 'https://ui-avatars.com/api/?name=Mike+van+Dijk&background=1A659E&color=fff'
        },
        {
            name: 'Lisa Peters',
            team: 'HR',
            score: 75,
            avatar: 'https://ui-avatars.com/api/?name=Lisa+Peters&background=FF6B35&color=fff'
        }
    ])

    const userScore = ref(0)
    const currentQuestionIndex = ref(0)
    const quizCompleted = ref(false)
    const userAnswers = ref<number[]>([])

    const currentQuestion = computed(() => currentQuiz.value[currentQuestionIndex.value])
    const totalQuestions = computed(() => currentQuiz.value.length)
    const progress = computed(() => (currentQuestionIndex.value / totalQuestions.value) * 100)

    const answerQuestion = (answerIndex: number) => {
        userAnswers.value.push(answerIndex)

        const current = currentQuestion.value
        if (current && answerIndex === current.correctAnswer) {
            userScore.value += 20
        }

        if (currentQuestionIndex.value < currentQuiz.value.length - 1) {
            currentQuestionIndex.value++
        } else {
            quizCompleted.value = true
        }
    }

    const resetQuiz = () => {
        userScore.value = 0
        currentQuestionIndex.value = 0
        quizCompleted.value = false
        userAnswers.value = []
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
        answerQuestion,
        resetQuiz
    }
})

